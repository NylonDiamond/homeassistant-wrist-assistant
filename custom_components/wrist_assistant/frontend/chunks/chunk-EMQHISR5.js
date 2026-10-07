var lt=globalThis,dt=lt.ShadowRoot&&(lt.ShadyCSS===void 0||lt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Kt=Symbol(),lo=new WeakMap,Be=class{constructor(t,n,o){if(this._$cssResult$=!0,o!==Kt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(dt&&t===void 0){let o=n!==void 0&&n.length===1;o&&(t=lo.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&lo.set(n,t))}return t}toString(){return this.cssText}},Se=e=>new Be(typeof e=="string"?e:e+"",void 0,Kt),C=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((o,i,r)=>o+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new Be(n,e,Kt)},co=(e,t)=>{if(dt)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let o=document.createElement("style"),i=lt.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=n.cssText,e.appendChild(o)}},qt=dt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let o of t.cssRules)n+=o.cssText;return Se(n)})(e):e;var{is:Jr,defineProperty:Xr,getOwnPropertyDescriptor:Yr,getOwnPropertyNames:Zr,getOwnPropertySymbols:Qr,getPrototypeOf:ea}=Object,ct=globalThis,uo=ct.trustedTypes,ta=uo?uo.emptyScript:"",na=ct.reactiveElementPolyfillSupport,Ue=(e,t)=>e,We={toAttribute(e,t){switch(t){case Boolean:e=e?ta:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},ut=(e,t)=>!Jr(e,t),po={attribute:!0,type:String,converter:We,reflect:!1,useDefault:!1,hasChanged:ut};Symbol.metadata??=Symbol("metadata"),ct.litPropertyMetadata??=new WeakMap;var Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=po){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let o=Symbol(),i=this.getPropertyDescriptor(t,o,n);i!==void 0&&Xr(this.prototype,t,i)}}static getPropertyDescriptor(t,n,o){let{get:i,set:r}=Yr(this.prototype,t)??{get(){return this[n]},set(a){this[n]=a}};return{get:i,set(a){let d=i?.call(this);r?.call(this,a),this.requestUpdate(t,d,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??po}static _$Ei(){if(this.hasOwnProperty(Ue("elementProperties")))return;let t=ea(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ue("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ue("properties"))){let n=this.properties,o=[...Zr(n),...Qr(n)];for(let i of o)this.createProperty(i,n[i])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[o,i]of n)this.elementProperties.set(o,i)}this._$Eh=new Map;for(let[n,o]of this.elementProperties){let i=this._$Eu(n,o);i!==void 0&&this._$Eh.set(i,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let i of o)n.unshift(qt(i))}else t!==void 0&&n.push(qt(t));return n}static _$Eu(t,n){let o=n.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let o of n.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return co(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,o){this._$AK(t,o)}_$ET(t,n){let o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(i!==void 0&&o.reflect===!0){let r=(o.converter?.toAttribute!==void 0?o.converter:We).toAttribute(n,o.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,n){let o=this.constructor,i=o._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=o.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:We;this._$Em=i;let d=a.fromAttribute(n,r.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(t,n,o,i=!1,r){if(t!==void 0){let a=this.constructor;if(i===!1&&(r=this[t]),o??=a.getPropertyOptions(t),!((o.hasChanged??ut)(r,n)||o.useDefault&&o.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,o))))return;this.C(t,n,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:o,reflect:i,wrapped:r},a){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??n??this[t]),r!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(n=void 0),this._$AL.set(t,n)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[i,r]of o){let{wrapped:a}=r,d=this[i];a!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,r,d)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(n)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[Ue("elementProperties")]=new Map,Y[Ue("finalized")]=new Map,na?.({ReactiveElement:Y}),(ct.reactiveElementVersions??=[]).push("2.1.2");var Xt=globalThis,ho=e=>e,pt=Xt.trustedTypes,fo=pt?pt.createPolicy("lit-html",{createHTML:e=>e}):void 0,Yt="$lit$",Z=`lit$${Math.random().toFixed(9).slice(2)}$`,Zt="?"+Z,oa=`<${Zt}>`,ue=document,je=()=>ue.createComment(""),Ke=e=>e===null||typeof e!="object"&&typeof e!="function",Qt=Array.isArray,wo=e=>Qt(e)||typeof e?.[Symbol.iterator]=="function",Jt=`[ 	
\f\r]`,Ge=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mo=/-->/g,go=/>/g,de=RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),xo=/'/g,yo=/"/g,vo=/^(?:script|style|textarea|title)$/i,en=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),O=en(1),y=en(2),Ic=en(3),pe=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),bo=new WeakMap,ce=ue.createTreeWalker(ue,129);function ko(e,t){if(!Qt(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return fo!==void 0?fo.createHTML(t):t}var Co=(e,t)=>{let n=e.length-1,o=[],i,r=t===2?"<svg>":t===3?"<math>":"",a=Ge;for(let d=0;d<n;d++){let s=e[d],h,u,l=-1,c=0;for(;c<s.length&&(a.lastIndex=c,u=a.exec(s),u!==null);)c=a.lastIndex,a===Ge?u[1]==="!--"?a=mo:u[1]!==void 0?a=go:u[2]!==void 0?(vo.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=de):u[3]!==void 0&&(a=de):a===de?u[0]===">"?(a=i??Ge,l=-1):u[1]===void 0?l=-2:(l=a.lastIndex-u[2].length,h=u[1],a=u[3]===void 0?de:u[3]==='"'?yo:xo):a===yo||a===xo?a=de:a===mo||a===go?a=Ge:(a=de,i=void 0);let p=a===de&&e[d+1].startsWith("/>")?" ":"";r+=a===Ge?s+oa:l>=0?(o.push(h),s.slice(0,l)+Yt+s.slice(l)+Z+p):s+Z+(l===-2?d:p)}return[ko(e,r+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},qe=class e{constructor({strings:t,_$litType$:n},o){let i;this.parts=[];let r=0,a=0,d=t.length-1,s=this.parts,[h,u]=Co(t,n);if(this.el=e.createElement(h,o),ce.currentNode=this.el.content,n===2||n===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=ce.nextNode())!==null&&s.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let l of i.getAttributeNames())if(l.endsWith(Yt)){let c=u[a++],p=i.getAttribute(l).split(Z),f=/([.?@])?(.*)/.exec(c);s.push({type:1,index:r,name:f[2],strings:p,ctor:f[1]==="."?ft:f[1]==="?"?mt:f[1]==="@"?gt:fe}),i.removeAttribute(l)}else l.startsWith(Z)&&(s.push({type:6,index:r}),i.removeAttribute(l));if(vo.test(i.tagName)){let l=i.textContent.split(Z),c=l.length-1;if(c>0){i.textContent=pt?pt.emptyScript:"";for(let p=0;p<c;p++)i.append(l[p],je()),ce.nextNode(),s.push({type:2,index:++r});i.append(l[c],je())}}}else if(i.nodeType===8)if(i.data===Zt)s.push({type:2,index:r});else{let l=-1;for(;(l=i.data.indexOf(Z,l+1))!==-1;)s.push({type:7,index:r}),l+=Z.length-1}r++}}static createElement(t,n){let o=ue.createElement("template");return o.innerHTML=t,o}};function he(e,t,n=e,o){if(t===pe)return t;let i=o!==void 0?n._$Co?.[o]:n._$Cl,r=Ke(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(e),i._$AT(e,n,o)),o!==void 0?(n._$Co??=[])[o]=i:n._$Cl=i),i!==void 0&&(t=he(e,i._$AS(e,t.values),i,o)),t}var ht=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:o}=this._$AD,i=(t?.creationScope??ue).importNode(n,!0);ce.currentNode=i;let r=ce.nextNode(),a=0,d=0,s=o[0];for(;s!==void 0;){if(a===s.index){let h;s.type===2?h=new Ae(r,r.nextSibling,this,t):s.type===1?h=new s.ctor(r,s.name,s.strings,this,t):s.type===6&&(h=new xt(r,this,t)),this._$AV.push(h),s=o[++d]}a!==s?.index&&(r=ce.nextNode(),a++)}return ce.currentNode=ue,i}p(t){let n=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,n),n+=o.strings.length-2):o._$AI(t[n])),n++}},Ae=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,o,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=he(this,t,n),Ke(t)?t===F||t==null||t===""?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==pe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):wo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&Ke(this._$AH)?this._$AA.nextSibling.data=t:this.T(ue.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=qe.createElement(ko(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(n);else{let r=new ht(i,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let n=bo.get(t.strings);return n===void 0&&bo.set(t.strings,n=new qe(t)),n}k(t){Qt(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,o,i=0;for(let r of t)i===n.length?n.push(o=new e(this.O(je()),this.O(je()),this,this.options)):o=n[i],o._$AI(r),i++;i<n.length&&(this._$AR(o&&o._$AB.nextSibling,i),n.length=i)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let o=ho(t).nextSibling;ho(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},fe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,o,i,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=n,this._$AM=i,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=F}_$AI(t,n=this,o,i){let r=this.strings,a=!1;if(r===void 0)t=he(this,t,n,0),a=!Ke(t)||t!==this._$AH&&t!==pe,a&&(this._$AH=t);else{let d=t,s,h;for(t=r[0],s=0;s<r.length-1;s++)h=he(this,d[o+s],n,s),h===pe&&(h=this._$AH[s]),a||=!Ke(h)||h!==this._$AH[s],h===F?t=F:t!==F&&(t+=(h??"")+r[s+1]),this._$AH[s]=h}a&&!i&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ft=class extends fe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}},mt=class extends fe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}},gt=class extends fe{constructor(t,n,o,i,r){super(t,n,o,i,r),this.type=5}_$AI(t,n=this){if((t=he(this,t,n,0)??F)===pe)return;let o=this._$AH,i=t===F&&o!==F||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==F&&(o===F||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},xt=class{constructor(t,n,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){he(this,t)}},Rc={M:Yt,P:Z,A:Zt,C:1,L:Co,R:ht,D:wo,V:he,I:Ae,H:fe,N:mt,U:gt,B:ft,F:xt},ia=Xt.litHtmlPolyfillSupport;ia?.(qe,Ae),(Xt.litHtmlVersions??=[]).push("3.3.3");var So=(e,t,n)=>{let o=n?.renderBefore??t,i=o._$litPart$;if(i===void 0){let r=n?.renderBefore??null;o._$litPart$=i=new Ae(t.insertBefore(je(),r),r,void 0,n??{})}return i._$AI(e),i};var tn=globalThis,Te=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=So(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return pe}};Te._$litElement$=!0,Te.finalized=!0,tn.litElementHydrateSupport?.({LitElement:Te});var ra=tn.litElementPolyfillSupport;ra?.({LitElement:Te});(tn.litElementVersions??=[]).push("4.2.2");var aa={attribute:!0,type:String,converter:We,reflect:!1,hasChanged:ut},sa=(e=aa,t,n)=>{let{kind:o,metadata:i}=n,r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),o==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),o==="accessor"){let{name:a}=n;return{set(d){let s=t.get.call(this);t.set.call(this,d),this.requestUpdate(a,s,e,!0,d)},init(d){return d!==void 0&&this.C(a,void 0,e,d),d}}}if(o==="setter"){let{name:a}=n;return function(d){let s=this[a];t.call(this,d),this.requestUpdate(a,s,e,!0,d)}}throw Error("Unsupported decorator location: "+o)};function Ao(e){return(t,n)=>typeof n=="object"?sa(e,t,n):((o,i,r)=>{let a=i.hasOwnProperty(r);return i.constructor.createProperty(r,o),a?Object.getOwnPropertyDescriptor(i,r):void 0})(e,t,n)}function Xc(e){return Ao({...e,state:!0,attribute:!1})}var nn=/^(#{1,3})\s+/,Je=/^\s*\d{1,3}[.)]\s+/,Xe=/^\s*[-*•]\s+/,la="\\*_[]()#`";function on(e){if(typeof e!="string")return;let t=e.replace(/\r\n?/g,`
`).trim();return t===""?void 0:t.slice(0,2e3)}var vu=`What it shows.

# Set up
1. Point [Kitchen light] at your own light.
2. \u2026

Tap it to \u2026`;function To(e){let t=e.trim();return/^https?:\/\/[^\s<>"']+$/i.test(t)?t:void 0}function Ee(e,t){let n=[],o=r=>{if(r==="")return;let a=n.at(-1);a?.kind==="text"?a.text+=r:n.push({kind:"text",text:r})},i=0;for(;i<e.length;){let r=e[i];if(r==="\\"&&i+1<e.length&&la.includes(e[i+1])){o(e[i+1]),i+=2;continue}if(r==="*"&&e[i+1]==="*"){let a=e.indexOf("**",i+2);for(;a>0&&e[a+2]==="*";)a+=1;let d=a<0?"":e.slice(i+2,a);if(d.trim()!==""&&d===d.trim()){n.push({kind:"strong",spans:Ee(d,t)}),i=a+2;continue}}if((r==="*"||r==="_")&&e[i+1]!==r){let a=r==="*"||i===0||!/[\p{L}\p{N}]/u.test(e[i-1]),d=e.indexOf(r,i+1);for(;d>0&&r==="*"&&e[d+1]==="*";)d=e.indexOf(r,d+2);let s=d<0?"":e.slice(i+1,d),h=e[d+1],u=r==="*"||h===void 0||!/[\p{L}\p{N}]/u.test(h);if(a&&u&&s.trim()!==""&&s===s.trim()){n.push({kind:"em",spans:Ee(s,t)}),i=d+1;continue}}if(r==="["){let a=e.indexOf("]",i+1),d=a<0?"":e.slice(i+1,a);if(a>0&&d.length<=80&&!d.includes("["))if(e[a+1]==="("){let s=e.indexOf(")",a+2),h=s<0?void 0:To(e.slice(a+2,s));if(h&&d.trim()!==""){n.push({kind:"url",text:d.trim(),href:h}),i=s+1;continue}}else{let s=d.trim()===""?void 0:t(d.trim());if(s){n.push({kind:"link",text:d.trim(),target:s}),i=a+1;continue}}}o(r),i+=1}return n}function rn(e){return e.map(t=>t.kind==="strong"||t.kind==="em"?rn(t.spans):t.text).join("")}function da(e,t){let n=[],o=[],i,r=()=>{o.length!==0&&(n.push({kind:"para",spans:Ee(o.join(`
`),t)}),o=[])},a=()=>{i&&(n.push({kind:"list",ordered:i.ordered,items:i.items.map(d=>Ee(d,t))}),i=void 0)};for(let d of e.replace(/\r\n?/g,`
`).split(`
`)){let s=d.trim();if(s===""){r(),a();continue}let h=nn.exec(s);if(h){r(),a();let c=h[1].length;n.push({kind:"heading",level:c,spans:Ee(s.slice(h[0].length).replace(/\s+#+$/,""),t)});continue}let u=Je.test(s),l=!u&&Xe.test(s);if(u||l){r(),i&&i.ordered!==u&&a(),i??={ordered:u,items:[]},i.items.push(s.replace(u?Je:Xe,""));continue}if(i){i.items[i.items.length-1]+=` ${s}`;continue}o.push(s)}return r(),a(),n}function ca(e){let n=(e.split(`
`).map(o=>o.trim()).find(o=>o!=="")??"").replace(nn,"").replace(Je,"").replace(Xe,"");return rn(Ee(n,()=>{})).replace(/\[([^\[\]\n]{1,80})\]/g,"$1")}function ku(e,t){let n=da(e,()=>{}).find(a=>a.kind==="para"),o=n?.kind==="para"?rn(n.spans).replace(/\[([^\[\]\n]{1,80})\]/g,"$1").replace(/\s*\n\s*/g," ").trim():ca(e);if(o.length<=t)return o;let i=o.slice(0,t-1),r=i.lastIndexOf(" ");return`${(r>t/2?i.slice(0,r):i).trimEnd()}\u2026`}function Cu(e){return e.kind==="value"?"Open this shared value":e.kind==="group"?"Select this group":"Select this layer"}function Eo(e,t,n){let o=e.lastIndexOf(`
`,t-1)+1,i=n>t&&e[n-1]===`
`?n-1:n,r=e.indexOf(`
`,i);return[o,r<0?e.length:r]}function bt(e){return e.replace(nn,"").replace(Je,"").replace(Xe,"").trimStart()}function Su(e,t,n,o){let[i,r]=Eo(e,t,n),a=e.slice(i,r).split(`
`),d=o?Je:Xe,s=a.filter(m=>m.trim()!==""),h=s.length>0&&s.every(m=>d.test(m)),u=e.slice(0,Math.max(0,i-1)).split(`
`).at(-1)??"",l=o?Number(/^\s*(\d{1,3})[.)]\s+/.exec(u)?.[1]??0):0,p=a.map(m=>m.trim()===""&&s.length>0?m:h?bt(m):(l+=1,`${o?`${l}. `:"- "}${bt(m)}`)).join(`
`),f=e.slice(0,i)+p+e.slice(r);return t===n&&a.length===1?{text:f,start:i+p.length,end:i+p.length}:{text:f,start:i,end:i+p.length}}function Au(e,t){let[n,o]=Eo(e,t,t),i=e.slice(n,o),r=/^#\s+/.test(i.trimStart())?bt(i):`# ${bt(i)}`;return{text:e.slice(0,n)+r+e.slice(o),start:n+r.length,end:n+r.length}}function Tu(e,t,n,o){let i=e.slice(0,t),r=e.slice(n),a=e.slice(t,n);if(i.endsWith(o)&&r.startsWith(o)&&(o==="**"||!(i.endsWith("**")&&r.startsWith("**"))||i.endsWith("***")))return{text:i.slice(0,-o.length)+a+r.slice(o.length),start:t-o.length,end:n-o.length};let s=a.length-a.trimStart().length,h=a.length-a.trimEnd().length,u=a.trim(),l=`${i}${a.slice(0,s)}${o}${u}${o}${a.slice(a.length-h)}${r}`,c=t+s+o.length;return{text:l,start:c,end:c+u.length}}function _o(e,t,n,o){let i=e.slice(0,t),r=e.slice(n),a=i===""||/\s$/.test(i)?"":" ",d=r===""||/^[\s.,;:!?)]/.test(r)?"":" ",s=`${a}${o}${d}`,h=t+s.length;return{text:i+s+r,start:h,end:h}}function Eu(e,t,n,o){return _o(e,t,n,`[${o}]`)}function _u(e,t,n,o){let i=e.slice(t,n).replace(/[[\]\n]/g," ").trim()||o.replace(/^https?:\/\//i,"");return _o(e,t,n,`[${i}](${o})`)}function Fu(e){let t=e.trim();if(t==="")return;let n=/^[a-z][a-z0-9+.-]*:/i.test(t)?t:/^[^\s/]+\.[^\s/]+/.test(t)?`https://${t}`:t;return To(n)}var ni=["rectangular","circular","corner"],bn=["small","medium","large","xlarge"],L=[...ni,...bn];function ot(e){return L.includes(e)}var P={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34},small:{width:162.67,height:162.67},medium:{width:344.67,height:162.67},large:{width:344.67,height:360},xlarge:{width:344.67,height:557.33}},Ze=["rectangular","circular","corner","inline",...bn];var Mu=64;function Iu(e,t){let n=new Set(e);return t.filter(o=>o.kind!=="preset"||!n.has(o.slot))}function wn(e){return pa(e)?10:$i(e)?9:ua(e)?8:bn.some(n=>e.supportedFamilies.includes(n))?7:ni.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}function ua(e){if(e.elements.some(n=>n.kind==="list"))return!0;let t=!1;return le(e,n=>{(n.kind.kind==="item"||n.kind.kind==="listStat")&&(t=!0)}),t}function pa(e){let t=!1;return le(e,n=>{n.kind.kind==="imageTime"&&(t=!0)}),t}function Ft(e){return e==="standard"||e==="condensed"||e==="compressed"||e==="expanded"?e:void 0}var ha=4,it=.5;function fa(e){return Number.isFinite(e)?Math.min(1,Math.max(it,e)):it}var ma=["none","dot","triangle"],ga=["straight","smooth","step"],xa=["light","medium","strong"],ya={light:.05,medium:.1,strong:.2};function Fo(e){return typeof e=="string"&&ga.includes(e)?e:"straight"}var ba=["flat","fade"],wa=["none","all","auto"],oi=4,Ht="#FFFFFF33";function ln(e){return typeof e=="string"&&ba.includes(e)?e:"flat"}function dn(e){return typeof e=="string"&&wa.includes(e)?e:"none"}function cn(e){return typeof e!="number"||!Number.isFinite(e)?0:Math.max(0,Math.min(oi,Math.round(e)))}function $e(e,t){return e.replace(/^#/,"").toUpperCase()===t.replace(/^#/,"").toUpperCase()}function Fe(e){return typeof e=="string"&&e!==""?e:Ht}var va=1,ka=12;function et(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.max(va,Math.min(ka,e))}function ii(e){return e==="all"?"all":"auto"}var vn=1,kn=3,Ca=.25,Sa=4;function ri(e){return typeof e!="number"||!Number.isFinite(e)?kn:Math.max(1,Math.min(oi,Math.round(e)))}function ai(e){return typeof e!="number"||!Number.isFinite(e)?vn:Math.max(Ca,Math.min(Sa,e))}var Aa=["all","top"],Cn=1.2;function un(e){return typeof e!="number"||!Number.isFinite(e)?Cn:Math.max(0,e)}function pn(e){return typeof e=="string"&&Aa.includes(e)?e:"all"}function hn(e){if(typeof e=="string")return xa.includes(e)?e:void 0;if(e===3||e===5)return"light";if(e===7)return"medium";if(e===9)return"strong"}function Ru(e,t){if(t===void 0||e<2)return 0;let n=Math.max(3,Math.floor(e*ya[t]+.5));return n%2===0?n+1:n}var Ta=[["history","Recorded history"],["statistics","Long-term statistics"]],Ea=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],_a=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],Sn="history",An="hour",Tn="mean",Fa=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],Ha=[["clock","Time"],["date","Date"],["weekday","Weekday"],["dateTime","Weekday and time"]];function $u(e){return e==="clock"||e==="dateTime"}var Pu=[["count","Items shown"],["total","Items in total"]],si={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},La=[["highest","Highest reading"],["lowest","Lowest reading"],["now","Now"],["first","First reading"],["latest","Newest reading"],["threshold","Threshold"],["zero","Zero"]];function Nu(e){return e!=="threshold"&&e!=="zero"}var Ma=[["above","Above"],["on","On"],["below","Inside"],["bottom","At the bottom"],["through","Through"]];function Ia(e){return La.some(([t])=>t===e)}function Ra(e){return Ma.some(([t])=>t===e)}function $a(e){if(!g(e)||typeof e.layer!="string"||e.layer==="")return;let t={layer:e.layer.toUpperCase(),at:Ia(e.at)?e.at:"highest",place:Ra(e.place)?e.place:"above"},n=v(e.dx,0),o=v(e.dy,0);return n!==0&&(t.dx=n),o!==0&&(t.dy=o),t}function wt(e,t){let n=$a(e.chartAnchor);n!==void 0&&(t.chartAnchor=n)}function vt(e,t){e.chartAnchor!==void 0&&(t.chartAnchor=Pa(e.chartAnchor))}function Pa(e){let t={layer:e.layer,at:e.at,place:e.place};return e.dx!==void 0&&e.dx!==0&&(t.dx=b(e.dx)),e.dy!==void 0&&e.dy!==0&&(t.dy=b(e.dy)),t}var zu=[["linear","Linear"],["radial","Radial"]],Na=2,za=4;function Qe(e){if(!g(e)||!Array.isArray(e.stops))return;let t=[];for(let i of e.stops){if(t.length===za)break;if(!g(i))continue;let r=T(i.colorHex);r===void 0||r===""||t.push({at:j(v(i.at,0)),colorHex:r})}if(t.length<Na)return;let n={kind:e.kind==="radial"?"radial":"linear",stops:t},o=v(e.angle,0);return n.kind==="linear"&&o!==0&&(n.angle=o),n}function kt(e){let t={kind:e.kind,stops:e.stops.map(n=>({at:b(n.at),colorHex:n.colorHex}))};return e.kind==="linear"&&e.angle!==void 0&&e.angle!==0&&(t.angle=b(e.angle)),t}function Du(e,t){let n=[...e.stops].sort((r,a)=>r.at-a.at),o=n[0],i=n[n.length-1];if(t<=o.at)return o.colorHex;if(t>=i.at)return i.colorHex;for(let r=1;r<n.length;r++){let a=n[r],d=n[r-1];if(t>a.at)continue;let s=a.at-d.at;return Da(d.colorHex,a.colorHex,s<=0?0:(t-d.at)/s)}return i.colorHex}function Da(e,t,n){let o=s=>{let h=s.replace(/^#/,""),u=h.length===6?`${h}FF`:h.padEnd(8,"F");return[0,2,4,6].map(l=>parseInt(u.slice(l,l+2),16)||0)},i=o(e),r=o(t),a=i.map((s,h)=>Math.round(s+(r[h]-s)*n)),d=a.map(s=>Math.max(0,Math.min(255,s)).toString(16).padStart(2,"0").toUpperCase());return a[3]===255?`#${d[0]}${d[1]}${d[2]}`:`#${d.join("")}`}function Ou(e,t){let n=e.replace(/^#/,""),o=n.length>=6?n.slice(0,6).toUpperCase():"FFFFFF",i=n.length>=8?parseInt(n.slice(6,8),16):255,r=Math.min(255,Math.max(0,Math.round(i*t)));return r===255?`#${o}`:`#${o}${r.toString(16).padStart(2,"0").toUpperCase()}`}var Oa=[["up","Up"],["down","Down"],["left","Left"],["right","Right"]],En="up",_n=0,Fn=100,Vu=.25;function Bu(e){return{value:e,minValue:_n,maxValue:Fn,direction:En}}function Va(e){if(!g(e))return;let t={value:g(e.value)?_(e.value):A("50"),minValue:v(e.minValue,_n),maxValue:v(e.maxValue,Fn),direction:me(e.direction,Oa.map(([o])=>o),En)};g(e.minSource)&&(t.minSource=_(e.minSource)),g(e.maxSource)&&(t.maxSource=_(e.maxSource));let n=T(e.trackColorHex);return n!==void 0&&n!==""&&(t.trackColorHex=n),t}function Ba(e){let t={value:E(e.value)};return e.minValue!==_n&&(t.minValue=b(e.minValue)),e.maxValue!==Fn&&(t.maxValue=b(e.maxValue)),e.minSource!==void 0&&(t.minSource=E(e.minSource)),e.maxSource!==void 0&&(t.maxSource=E(e.maxSource)),e.direction!==En&&(t.direction=e.direction),e.trackColorHex!==void 0&&(t.trackColorHex=e.trackColorHex),t}function Ho(e,t){let n=Va(e.level);n!==void 0&&(t.level=n)}function Lo(e,t){e.level!==void 0&&(t.level=Ba(e.level))}var Ua=["circular","rectangular","corner","small","medium","large","xlarge"];function Uu(e){return Ua.includes(e)}var Wa=.1,Ga=3,Wu=.5,ja=10,Ka=360,Ct=120,qa=-2,Ja=20;function Xa(e){if(!g(e))return;let t=v(e.radius,NaN);if(!Number.isFinite(t))return;let n={radius:Math.min(Ga,Math.max(Wa,t))},o=v(e.angle,0);o!==0&&(n.angle=o);let i=Ya(v(e.sweep,Ct));i!==Ct&&(n.sweep=i);let r=Za(v(e.spacing,0));return r!==0&&(n.spacing=r),e.flip===!0&&(n.flip=!0),n}function Ya(e){if(!Number.isFinite(e)||e===0)return Ct;let t=Math.min(Ka,Math.max(ja,Math.abs(e)));return e<0?-t:t}function Za(e){return Number.isFinite(e)?Math.min(Ja,Math.max(qa,e)):0}function Qa(e){let t={radius:b(e.radius)};return e.angle!==void 0&&e.angle!==0&&(t.angle=b(e.angle)),e.sweep!==void 0&&e.sweep!==Ct&&(t.sweep=b(e.sweep)),e.spacing!==void 0&&e.spacing!==0&&(t.spacing=b(e.spacing)),e.flip===!0&&(t.flip=!0),t}var es={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setFontDesign:"fontDesign",setFontWidth:"fontWidth",setItalic:"italic",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},ts=12,Mo=12,li="#000000",Gu={colorHex:li,radius:3,dx:0,dy:1};function ns(e){return Number.isFinite(e)?Math.min(ts,Math.max(0,e)):0}function Io(e){return Number.isFinite(e)?Math.min(Mo,Math.max(-Mo,e)):0}function os(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):1}function ju(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function di(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function ci(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function ui(e){let t=u=>u.icon===void 0&&u.value.kind.kind!=="literal",n=(u,l)=>e.slice(u,l).map(c=>c.icon===void 0?ci(c.value)??"":"").join(""),o=e.findIndex(t);if(o<0)return A(n(0,e.length));let i=e.findIndex((u,l)=>l>o&&t(u)),r=e[o].value,a={...r.format},d=n(0,o)+(a.prefix??""),s=(a.suffix??"")+n(o+1,i<0?e.length:i);delete a.prefix,delete a.suffix,d!==""&&(a.prefix=d),s!==""&&(a.suffix=s);let h={kind:structuredClone(r.kind)};return Ie(a)||(h.format=a),h}function Ku(e){di(e)&&(e.value=ui(e.parts))}var is="svg:custom",rs="0 0 24 24",Ro=8*1024;function qu(e){return e.symbol.kind.kind==="literal"&&e.symbol.kind.value===is}function Hn(e){if(e===void 0)return;let t=e.trim();if(!(t===""||t===rs))return t}function Ju(e){let t={minX:0,minY:0,width:24,height:24};if(e===void 0)return t;let n=e.trim().split(/[\s,]+/).filter(s=>s!=="");if(n.length!==4)return t;let o=n.map(s=>Number(s));if(!o.every(s=>Number.isFinite(s)))return t;let[i,r,a,d]=o;return!(a>0)||!(d>0)?t:{minX:i,minY:r,width:a,height:d}}var as=/^[MmLlHhVvCcSsQqTtAaZz0-9eE+\-.,\s]+$/;function Xu(e){let t=e.trim();if(t==="")return{ok:!1,error:"Paste an SVG path or the whole <svg> markup."};let n=t.startsWith("<"),o=n?ss(t):t.replace(/\s+/g," ").trim();if(n&&o==="")return{ok:!1,error:"That markup has no <path> in it. Only paths can be drawn on a watch face."};if(!as.test(o))return{ok:!1,error:"That is not an SVG path: it holds characters no path command uses."};if(!/[Mm]/.test(o))return{ok:!1,error:"An SVG path starts with a move command (M)."};let i=new TextEncoder().encode(o).length;if(i>Ro)return{ok:!1,error:`That drawing is ${Math.ceil(i/1024)} KB of path and the limit is ${Ro/1024} KB. Simplify it in a vector editor first.`};let r=n?Hn(ls(t)):void 0;return r===void 0?{ok:!0,path:o}:{ok:!0,path:o,viewBox:r}}function ss(e){let t=[];for(let n of e.matchAll(/<path\b[^>]*>/gi)){let o=/\sd\s*=\s*("([^"]*)"|'([^']*)')/i.exec(n[0]),i=(o?.[2]??o?.[3]??"").replace(/\s+/g," ").trim();i!==""&&t.push(i)}return t.join(" ")}function ls(e){let t=/<svg\b[^>]*>/i.exec(e);if(!t)return;let n=/\sviewBox\s*=\s*("([^"]*)"|'([^']*)')/i.exec(t[0]),o=(n?.[2]??n?.[3]??"").replace(/\s+/g," ").trim();return o===""?void 0:o}var Ln="#FFFFFF",Lt="#FFFFFF80",Mt=3,ds=60,cs=8,It="#FFFFFF",Rt=8,us=4,ps=20;function Yu(e){if(!Number.isFinite(e))return"";let t=e.toFixed(2);return t.includes(".")&&(t=t.replace(/0+$/,"").replace(/\.$/,"")),t==="-0"?"0":t}function Zu(){return{count:0,length:Mt,colorHex:Lt,majorEvery:0}}function Qu(){return{show:!1,size:Rt,colorHex:It}}function pi(e){return e.count===0&&e.length===Mt&&$e(e.colorHex,Lt)&&e.majorEvery===0}function hi(e){return!e.show&&e.size===Rt&&$e(e.colorHex,It)}function hs(e){if(!g(e))return;let t={count:Math.max(0,Math.min(ds,Math.round(v(e.count,0)))),length:Math.max(1,Math.min(cs,v(e.length,Mt))),colorHex:w(e.colorHex,Lt),majorEvery:Math.max(0,Math.round(v(e.majorEvery,0)))};return pi(t)?void 0:t}function fs(e){let t={};return e.count!==0&&(t.count=Math.round(e.count)),e.length!==Mt&&(t.length=b(e.length)),$e(e.colorHex,Lt)||(t.colorHex=e.colorHex),e.majorEvery!==0&&(t.majorEvery=Math.round(e.majorEvery)),t}function ms(e){if(!g(e))return;let t={show:e.show===!0,size:Math.max(us,Math.min(ps,v(e.size,Rt))),colorHex:w(e.colorHex,It)};return hi(t)?void 0:t}function gs(e){let t={};return e.show&&(t.show=!0),e.size!==Rt&&(t.size=b(e.size)),$e(e.colorHex,It)||(t.colorHex=e.colorHex),t}function $o(e){return typeof e=="string"&&ma.includes(e)}function xs(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function fn(e){let t=xs(e.marker);return{high:e.highMarker??t.high,low:e.lowMarker??t.low}}function fi(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function mi(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function ys(e,t){e.marker=fi(t),mi(t)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=t.high,e.lowMarker=t.low)}var ep=24,bs=6,Po="#FFFFFF";function tp(e){if(e.style!=="bars")return 0;let t=e.barBorderWidth;return typeof t!="number"||!Number.isFinite(t)?0:Math.min(Math.max(t,0),bs)}function np(e,t,n,o,i){if(i!==void 0)return{fill:i,border:i};if(!vs(e))return{fill:e.fillColorHex??o,border:e.barBorderColorHex??Po};let r=n.find(d=>t<=d.upTo),a=r?{color:r.colorHex,fill:r.fillColorHex,border:r.borderColorHex}:{color:e.bandAboveColorHex,fill:e.bandAboveFillColorHex,border:e.bandAboveBorderColorHex};return{fill:a.fill??e.fillColorHex??a.color,border:a.border??e.barBorderColorHex??Po}}var He="#FF6B35",Le="#32D74B",ws="#32D74B",G="#FF453A",Mn="#FF453A",In="#FFFFFF99";function op(e){return[...e.bands].sort((t,n)=>t.upTo-n.upTo)}function vs(e){return e.coloring==="bands"&&e.bands.length>0}function ip(e,t,n){for(let o of t)if(e<=o.upTo)return o.colorHex;return n}function rp(e,t){let n=Math.abs(t),o=n>=10?0:n>=1?1:2;return e.toFixed(o)}function ap(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var ks=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],Cs=360,Ss=10080,sp=[...ks,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],lp=366*24*60,As=2,Ts=120,Es=0;function Rn(e){let t=Math.round(e.historyPoints);return Number.isFinite(t)?t<1?Es:Math.max(As,Math.min(Ts,t)):24}function _s(e){return Pn(e)!==void 0?!0:$n(e)!==void 0&&Rn(e)>0}function $n(e){if(e.source==="history")return gi(e)}function Pn(e){if(e.source==="statistics")return gi(e)}function gi(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Fs(e){let t=$n(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${Rn(e)}${e.gaps===!0?"|gaps":""}`}function Hs(e){let t=Pn(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}${e.gaps===!0?"|gaps":""}`}function dp(e){return[...Nn(e).map(n=>n.key),...zn(e).map(n=>n.key)].sort().join(";")}function Nn(e){let t=new Map,n=o=>{t.has(o.key)||t.set(o.key,o)};for(let o of e.elements)if(o.kind==="chart"){let i=Fs(o.payload),r=$n(o.payload);if(i===void 0||r===void 0)continue;n({key:i,entityId:r,minutes:Math.round(o.payload.historyMinutes),points:Rn(o.payload),mode:"numeric",gaps:o.payload.gaps===!0})}else if(o.kind==="timeline"){let i=Us(o.payload),r=ki(o.payload);if(i===void 0||r===void 0||Bs(o.payload))continue;let a=Nt(o.payload);n({key:i,entityId:r,minutes:vi(o.payload),points:wi,mode:"states",gaps:!1,...a.length>0?{entities:a,combine:o.payload.aggregate?.combine??$t}:{}})}return[...t.values()]}function zn(e){let t=new Map;for(let n of e.elements){if(n.kind!=="chart")continue;let o=Hs(n.payload),i=Pn(n.payload);o===void 0||i===void 0||t.has(o)||t.set(o,{key:o,entityId:i,minutes:Math.round(n.payload.historyMinutes),period:n.payload.statPeriod,type:n.payload.statType,gaps:n.payload.gaps===!0})}return[...t.values()]}var Ls=2,Ms=20,$t="any",Is="binary_sensor",cp=[["any","Any"],["all","All"]];function up(e){return e==="all"?"On when all of them are active":"On when any of them is active"}var pp=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],hp=[["auto","Auto"],["always","Always"],["never","Never"]];function an(e){return e==="h12"||e==="h24"?e:ye}function sn(e){return e==="always"||e==="never"?e:be}function Rs(e){let t={},n=e.fontWeight;(n==="medium"||n==="semibold"||n==="bold")&&(t.fontWeight=n);let o=e.fontDesign;(o==="default"||o==="monospaced"||o==="serif")&&(t.fontDesign=o);let i=Ft(e.fontWidth);return i!==void 0&&i!=="standard"&&(t.fontWidth=i),e.italic===!0&&(t.italic=!0),e.monospacedDigits===!0&&(t.monospacedDigits=!0),t}function $s(e){return e.timeLabelCount!==void 0?Me(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:xe}function Me(e){let t=Number(e);return Number.isFinite(t)?Math.max(0,Math.min(bi,Math.round(t))):xe}function fp(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(t,n)=>n/(e-1))}var Pt="#8E8E93",xi=1,Ps="#000000",Ns=2,zs=1440,Dn=60,xe=0,ee=9,te="#8E8E93",ye="auto",be="auto",yi=4,bi=12,Ds=1,Os=20,Vs=4,wi=120;function mp(e,t,n){let o=e.trim().toLowerCase();for(let i of t)if(i.match.trim().toLowerCase()===o)return i.colorHex;return n}function vi(e){let t=Math.round(e.historyMinutes);return Number.isFinite(t)?Math.max(1,Math.min(Ss,t)):Dn}function ki(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Nt(e){let t=e.aggregate?.entities??[],n=[];for(let o of t){let i=typeof o=="string"?o.trim():"";i!==""&&!n.includes(i)&&n.push(i)}return n}function gp(e){let t=[...e.aggregate?.entities??[]];for(;t.length<Ls;)t.push("");return t}function Bs(e){return Nt(e).length>Ms}function Us(e){let t=ki(e);if(t===void 0)return;let n=`${t}|${vi(e)}|${wi}|states`,o=Nt(e);return o.length===0?n:`${n}|${e.aggregate?.combine??$t}:${o.join(",")}`}var Ws={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},Gs={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function No(e){return Ws[e.trim().toLowerCase()]??Pt}var js=["door","garage_door","window","opening"];function zo(e,t){let n=(t??"").trim().toLowerCase(),o=e==="binary_sensor"&&js.includes(n),i=a=>No(o&&a==="on"?"open":a);return[...Gs[e]??[],"unavailable","unknown"].map(a=>({id:M(),match:a,colorHex:i(a)}))}var xp=48*1024,Ci=6,Ks=0,zt=9,qs=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Js(e){let t=e.trim();if(t==="")return 0;let n=t.endsWith("==")?2:t.endsWith("=")?1:0;return Math.max(0,Math.floor(t.length*3/4)-n)}function yp(e){return e.source==="inline"&&e.data!==void 0?Js(e.data):0}function bp(e){if(e.source!=="inline")return;let t=e.data;if(!(t===void 0||t===""))return`data:${e.format==="jpeg"?"image/jpeg":"image/png"};base64,${t}`}function Si(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Xs(e,t){let n=t<=.5,o=e<=.5;return n?o?"topLeading":"topTrailing":o?"bottomLeading":"bottomTrailing"}var Ys={top:0,left:0,bottom:0,right:0};function Ai(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}function wp(e){return e.fontDesign??"rounded"}var vp=[["down","Down"],["across","Across"]],Zs=[["name","Name"],["state","State"],["lastChanged","Last changed"]],Qs=[["open","To do"],["done","Done"],["all","Everything"]],el=[["list","List order"],["due","Due"]],tl=[["hourly","Hourly"],["daily","Daily"],["twiceDaily","Twice daily"]],kp=[["entities","Entities"],["attribute","Attribute"],["template","Template"],["calendar","Calendar"],["todo","To-do list"],["forecast","Forecast"]],nl=1,ol=12,On=4,il=1,rl=4,Vn=1,Bn=2,al=12,sl=8,Cp=5,ll=1,Ti=8784,Ei=24,_i=["list","chart","timeline","chartTimes","chartDots","chartGrid","imageTime"],Sp=["rectangular","small","medium","large","xlarge"];function Ap(e){let t=Pe(e.rows);if(e.direction==="across")return{lines:1,columns:t};let n=Math.min(Un(e.columns),t);return{lines:Math.ceil(t/n),columns:n}}function Pe(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.round(e):On;return Math.min(ol,Math.max(nl,t))}function Un(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Vn;return Math.min(rl,Math.max(il,t))}function Fi(e){let t=typeof e=="number"&&Number.isFinite(e)?e:Bn;return Math.min(al,Math.max(0,t))}function Ne(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Ei;return Math.min(Ti,Math.max(ll,t))}var Tp=["hours","days","weeks","months"],J={hours:1,days:24,weeks:168,months:720};function Ep(e){let t=Ne(e);return t%J.months===0?{value:t/J.months,unit:"months"}:t%J.weeks===0?{value:t/J.weeks,unit:"weeks"}:t%J.days===0?{value:t/J.days,unit:"days"}:{value:t,unit:"hours"}}function _p(e,t){let n=Number.isFinite(e)?e:1;return Ne(Math.round(n*J[t]))}function dl(e){return Math.floor(Ti/J[e])}function Fp(e,t){let n=Math.ceil(Ne(e)/J[t]);return Math.min(dl(t),Math.max(1,n))}function Hp(e,t){return Math.round(Ne(e)/J[t]*100)/100}var cl=["toggleEntity","runScene","runScript","addTodo","runHTTPAction","openEntity"];function Lp(e){return cl.includes(e)}function Mp(e){let t=(e??"").trim();if(t==="")return!0;try{let n=JSON.parse(t);return typeof n=="object"&&n!==null&&!Array.isArray(n)}catch{return!1}}var ul=[["refresh","Refresh this complication"],["refreshAll","Refresh multiple complications"],["nextPage","Show next page"],["previousPage","Show previous page"],["showPage","Show one page"],["playTour","Play all pages"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["callService","Call a service"],["runHTTPAction","Run an HTTP action"],["addTodo","Add a to-do"],["openApp","Open the app"],["openPage","Open a watch app page"],["openEntity","Open an entity"],["openRoomPage","Open the room I'm in"],["timerStartPause","Start or pause a timer"],["timerCancel","Cancel a timer"],["none","Nothing"]],Ip=[["Refresh",["refresh","refreshAll"]],["Pages",["nextPage","previousPage","showPage","playTour"]],["Home Assistant",["toggleEntity","runScene","runScript","callService","runHTTPAction","addTodo"]],["Open the app",["openApp","openPage","openEntity","openRoomPage"]],["Timer",["timerStartPause","timerCancel"]]],pl=["openPage","openEntity","openRoomPage","addTodo"];function Rp(e,t=!1){let o={refresh:"Fetches new data and redraws this complication.",refreshAll:"Fetches new data for this complication and the others you pick. The other tiles redraw only when watchOS allows it.",nextPage:"Shows the next page of this complication. Needs two or more pages.",previousPage:"Shows the page before this one. Needs two or more pages.",showPage:"Shows the page you pick, such as page 1. Needs two or more pages.",playTour:"Shows every page once, then goes back to page 1. Needs two or more pages.",toggleEntity:"Turns an entity on or off, such as a light or a switch.",runScene:"Turns on a Home Assistant scene.",runScript:"Runs a Home Assistant script.",callService:"Calls any Home Assistant service, with your own data.",runHTTPAction:"Runs an HTTP action kept in Home Assistant or the Wrist Assistant app.",addTodo:"Opens the watch app to add an item to a to-do list.",openApp:"Opens Wrist Assistant.",openPage:"Opens one page of your Wrist Assistant grid. You pick the page.",openEntity:"Opens the watch app on the controls of the entity you pick. The entity needs a tile on a watch app page.",openRoomPage:"Opens the app on the page for the room it finds you in.",timerStartPause:"Starts or pauses the first timer this complication shows. Three quick taps cancel it.",timerCancel:"Works the same as Start or pause a timer: three quick taps cancel it.",none:"Does nothing. On the whole complication the watch still opens the app."}[e];return t&&pl.includes(e)?`${o} On iPhone this only opens the app.`:o}function hl(e){return ul.find(([t])=>t===e.type)?.[1]??e.type}function $p(e){let t=hl(e);if(e.type==="callService"){let o=[e.serviceDomain,e.serviceName].filter(i=>i!=="").join(".");return o===""?t:`${t}: ${o}`}if(e.type==="refreshAll"){if(e.allPlaced===!0)return`${t}: all placed`;let o=e.targets?.length??0,i=Object.keys(e.targetLayers??{}).length,r=o>0?`${t}: ${o} picked`:`${t}: none picked`;return i>0?`${r}, ${i} narrowed`:r}if(e.type==="showPage")return`${t}: ${e.page}`;if(e.type==="refresh"&&e.layerIds!==void 0){let o=e.layerIds.length;return o>0?`${t}: ${o} picked`:`${t}: none picked`}if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function Pp(e,t,n){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let o=t.trim().toUpperCase(),i=e.targets??[],r=n?o===""||i.includes(o)?[...i]:[...i,o]:i.filter(s=>s!==o),a={type:"refreshAll"};r.length>0&&(a.targets=r);let d=n?e.targetLayers:Hi(e.targetLayers,o);return d!==void 0&&(a.targetLayers={...d}),a}function Hi(e,t){if(e===void 0||!(t in e))return e;let n={...e};return delete n[t],Object.keys(n).length>0?n:void 0}function Np(e,t,n){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let o=t.trim().toUpperCase();if(o==="")return e;let i={type:"refreshAll"};e.targets!==void 0&&e.targets.length>0&&(i.targets=[...e.targets]);let r=n?Hi(e.targetLayers,o):{...e.targetLayers??{},[o]:[]};return r!==void 0&&(i.targetLayers={...r}),i}function zp(e,t,n,o){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let i=t.trim().toUpperCase(),r=n.trim();if(i==="")return e;let a=e.targetLayers?.[i]??[],d=o?r===""||a.includes(r)?[...a]:[...a,r]:a.filter(h=>h!==r),s={type:"refreshAll"};return e.targets!==void 0&&e.targets.length>0&&(s.targets=[...e.targets]),s.targetLayers={...e.targetLayers??{},[i]:d},s}function Dp(e,t,n){let o=t.trim(),i=e.layerIds??[];return{type:"refresh",layerIds:n?o===""||i.includes(o)?[...i]:[...i,o]:i.filter(a=>a!==o)}}function Op(e,t=!1){if(mn(e.type))return t?e.type==="nextPage"?"Each tap shows the next page. The page stays where it was left.":e.type==="previousPage"?"Each tap shows the page before. The page stays where it was left.":e.type==="showPage"?`Each tap shows page ${e.page}. A complication with fewer pages shows its last page.`:"Plays every page once from one tap, then returns to page 1.":"This complication has one page, so this does nothing yet. Add a page in the Pages card, on the left.";if(e.type==="timerStartPause")return"Uses the first timer entity this complication shows. One tap starts or pauses it, three quick taps cancel it. With no timer entity, a tap only refreshes.";if(e.type==="timerCancel")return"This works the same as Start or pause a timer: one tap starts or pauses, three quick taps cancel. Pick Start or pause a timer to say so.";if(e.type==="openEntity")return"The watch opens the page that has this entity's tile, then opens its controls. With no tile for it, the watch says Not on a page.";if(e.type==="none")return"The watch cannot do nothing on a tap: a complication with no action still opens the app. Pick Open the app to say so, or Refresh this complication to make the tap worth something.";if(e.type==="refresh"){if(e.layerIds===void 0)return"Refreshes every layer and every page of this complication, not just the layer the tap sits on.";let a=" On a watch running an older app this tap refreshes everything instead.";return e.layerIds.length===0?"Nothing is ticked, so this tap still refreshes the whole complication. Tick the layers you want it to fetch."+a:`Fetches only the ${e.layerIds.length} ticked below. Everything else keeps what it last read, and the whole tile is redrawn.`+a}if(e.type!=="refreshAll")return;let n=" On a watch running an older app this tap does nothing.";if(e.allPlaced===!0)return"Refreshes every Wrist Assistant complication placed on the watch, not just this one."+n;let o=e.targets?.length??0,i=Object.keys(e.targetLayers??{}).length,r=i===0?"":i===1?" One complication is narrowed to the layers ticked under its own box.":` ${i} complications are narrowed to the layers ticked under their own boxes.`;return o>0?`Refreshes this complication and the ${o} picked below.`+r+n:"Nothing is picked, so this tap only refreshes this complication. Pick all placed complications or some below."+r+n}var Li="\uE000",Mi="\uE001";function Vp(e){return`${Li}${e}${Mi}`}function Bp(e){let t=[],n="",o=e;for(;;){let i=o.indexOf(Li);if(i<0)break;let r=o.indexOf(Mi,i+1);if(n+=o.slice(0,i),r<0||r===i+1){n+=o.slice(i),o="";break}n!==""&&t.push({text:n}),n="",t.push({symbol:o.slice(i+1,r)}),o=o.slice(r+1)}return n+=o,n!==""&&t.push({text:n}),t}function Up(e){return(e.parts?.length??0)>0}var fl=["toggleEntity","runScene","runScript","callService","runHTTPAction","openApp"],ml=["toggleEntity","callService"],gl=new Set(["on","open","unlocked","home","playing","heat","cool"]),Ii="switch.2";function xl(e){return fl.includes(e)}function Wp(e){return e.kind==="toggle"&&ml.includes(e.action.type)?"toggle":"button"}function Gp(e){return e!==void 0&&gl.has(e.trim().toLowerCase())}var Ri=4,Dt=2,Do={min:1,max:10};function we(e){return Number.isFinite(e)?Math.min(Math.max(Math.trunc(e),1),Ri):1}function ie(e){return Number.isFinite(e)?Math.min(Math.max(e,Do.min),Do.max):Dt}function yl(e=2,t="tap"){return{count:we(e),mode:t,dwell:[]}}function ze(e){return e!==void 0&&e.count>1}function Ot(e){return Array.from({length:we(e.count)},(t,n)=>n+1)}function bl(e){if(!g(e))return;let t=we(v(e.count,1));if(t<=1)return;let n=(Array.isArray(e.dwell)?e.dwell:[]).slice(0,t).map(o=>ie(v(o,Dt)));return{count:t,mode:e.mode==="tour"?"tour":"tap",dwell:n}}function wl(e){if(!ze(e))return;let t={count:we(e.count),mode:e.mode};return e.dwell.length>0&&(t.dwell=e.dwell.map(ie)),t}function vl(e){if(typeof e!="number"||!Number.isFinite(e))return;let t=Math.trunc(e);return t>=1?t:void 0}function $i(e){return ze(e.pages)?!0:e.elements.some(t=>t.payload.page!==void 0)}function Pi(e){let t=Wn(e);if(ze(e.pages))return{...e.pages,mode:t,dwell:[...e.pages.dwell]};let n=e.elements.map(a=>a.payload.page).filter(a=>a!==void 0),o=n.length>0?Math.max(...n):1,i=e.pages??yl(1),r={...i,mode:t,dwell:[...i.dwell]};return o<=1?r:{...r,count:we(o)}}function Ni(e,t){return t<1||t>e.dwell.length?Dt:ie(e.dwell[t-1])}function jp(e){return Ot(e).reduce((t,n)=>t+Ni(e,n),0)}function Kp(e,t){if(!ze(e))return[];let n=[],o=0;for(let i of Ot(e))n.push({atMs:t+o*1e3,page:i}),o+=Ni(e,i);return n.push({atMs:t+o*1e3,page:1}),n}function kl(e,t){let n=e.payload.page;return n===void 0||n===t}function qp(e,t,n){return $i(e)?t.filter(o=>kl(o,n)):[...t]}function Jp(e){return mn(e.tapAction.type)?!0:e.elements.some(t=>t.kind==="tap"&&mn(t.payload.action.type))}function mn(e){return e==="nextPage"||e==="previousPage"||e==="showPage"||e==="playTour"}function Xp(e,t,n){let o=D("tap"),i=o.payload,r=t==="nextPage";return i.name=r?"Next page tap area":"Prev page tap area",i.frame={x:r?.5:0,y:0,width:.5,height:1,rotationDegrees:0},i.action={type:t},n!==void 0&&(i.page=n),e.elements.unshift(o),i.id}function Wn(e){return e.tapAction.type==="playTour"||e.elements.some(t=>t.kind==="tap"&&t.payload.action.type==="playTour")?"tour":"tap"}function Gn(e,t){let n=we(t);if(n<=1){delete e.pages;for(let i of e.elements)delete i.payload.page;return}for(let i of e.elements)i.payload.page!==void 0&&i.payload.page>n&&(i.payload.page=n);let o=e.pages;e.pages={count:n,mode:Wn(e),dwell:(o?.dwell??[]).slice(0,n).map(ie)}}function Yp(e){let t=Pi(e).count;if(!(t>=Ri))return Gn(e,t+1),t+1}function Zp(e){for(let t of e.elements)t.payload.page=1;return Gn(e,2),2}function Qp(e,t){let n=Pi(e);if(t<1||t>n.count)return;for(let i of e.elements.filter(r=>r.payload.page===t).map(r=>r.payload.id))Q(e,i);for(let i of e.elements){let r=i.payload.page;r!==void 0&&r>t&&(i.payload.page=r-1)}let o=[...n.dwell];t<=o.length&&o.splice(t-1,1),e.pages={count:n.count,mode:n.mode,dwell:o},Gn(e,n.count-1)}function eh(e,t,n){let o=e.pages;if(!ze(o))return;let i=we(o.count),r=[];for(let a=0;a<i;a++)r.push(a<o.dwell.length?ie(o.dwell[a]):void 0);for(t>=1&&t<=i&&(r[t-1]=n===void 0?void 0:ie(n));r.length>0&&r[r.length-1]===void 0;)r.pop();o.dwell=r.map(a=>a??Dt)}function Cl(e,t){if(!(t<1||t>e.dwell.length))return ie(e.dwell[t-1])}function th(e,t){let n=e.pages;ze(n)&&(n.dwell=t===void 0?[]:Ot(n).map(()=>ie(t)))}function nh(e){let t=Ot(e).map(o=>Cl(e,o)),n=t[0];return n!==void 0&&t.every(o=>o===n)?n:void 0}function oh(e){return(e.tapAction.type==="playTour"?1:0)+e.elements.filter(n=>n.kind==="tap"&&n.payload.action.type==="playTour").length}function ih(e,t,n,o){for(let i of e.elements)t.has(i.payload.id)&&(n?i.payload.page===void 0&&(i.payload.page=o):delete i.payload.page)}var rh="#30D158";function g(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function w(e,t=""){return typeof e=="string"?e:t}function v(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function j(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function tt(e){return e==null?void 0:v(e,0)}function T(e){return typeof e=="string"?e:void 0}function me(e,t,n){return typeof e=="string"&&t.includes(e)?e:n}function ge(e,t,n){return t.some(([o])=>o===e)?e:n}var X=class extends Error{};function oe(e){if(typeof e.entityId!="string")throw new X("entityId is required");let t={entityId:e.entityId,displayName:w(e.displayName),domain:w(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function Oo(e){if(!g(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=v(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=v(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=v(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),e.duration===!0&&(t.duration=!0),Ha.some(([n])=>n===e.timestamp)&&(t.timestamp=e.timestamp),e.hideMinutes===!0&&(t.hideMinutes=!0),e.hideDayPeriod===!0&&(t.hideDayPeriod=!0),e.showSeconds===!0&&(t.showSeconds=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),Ie(t)?void 0:t}function Ie(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.timestamp===void 0&&!e.hideMinutes&&!e.hideDayPeriod&&!e.showSeconds&&e.textCase===void 0:!0}function zi(e){let t=w(e.function,"count"),n=g(e.scope)?e.scope:{},o;if(n.kind==="entities")o={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(g).map(oe)};else{let r=a=>Array.isArray(a)?a.filter(d=>typeof d=="string"):[];o={kind:"filter",domains:r(n.domains),areaIds:r(n.areaIds),labelIds:r(n.labelIds),floorIds:r(n.floorIds)}}let i={function:t,scope:o};if(g(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?i.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(i.stateFilter={kind:r,value:w(e.stateFilter.value)})}return typeof e.attribute=="string"&&(i.attribute=e.attribute),i}function Vo(e){switch(e.kind){case"literal":return{kind:"literal",value:w(e.value)};case"entityState":return{kind:"entityState",...oe(e)};case"entityAttribute":return{kind:"entityAttribute",...oe(e),attribute:w(e.attribute)};case"entityAge":return{kind:"entityAge",...oe(e)};case"aggregate":return{kind:"aggregate",aggregate:zi(g(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:T(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:w(e.value)};case"named":return{kind:"named",id:w(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:w(e.layer).toUpperCase(),stat:Fa.some(([t])=>t===e.stat)?e.stat:"latest"};case"item":return{kind:"item",field:w(e.field)};case"listStat":return{kind:"listStat",layer:w(e.layer).toUpperCase(),stat:e.stat==="total"?"total":"count"};case"imageTime":return{kind:"imageTime",layer:w(e.layer).toUpperCase()};default:throw new X(`unknown value kind ${String(e.kind)}`)}}function _(e){if(!g(e))throw new X("value must be an object");if(g(e.kind)){let o={kind:Vo(e.kind)},i=Oo(e.format);return i&&(o.format=i),o}let t={kind:Vo(e)},n=Oo(e.format);return n&&(t.format=n),t}function Di(e){return g(e)?{x:v(e.x,.25),y:v(e.y,.25),width:v(e.width,.5),height:v(e.height,.5),rotationDegrees:v(e.rotationDegrees,0)}:{...si}}function Sl(e){if(!g(e))return{kind:"isOn"};let t=w(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=g(e.value)?_(e.value):A("");break;case"between":case"timeBetween":n.value=g(e.value)?_(e.value):A(""),n.upper=g(e.upper)?_(e.upper):A("");break;case"matchesRegex":n.pattern=w(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(o=>typeof o=="string"):[];break;default:break}return n}function Bo(e){if(!g(e))return{kind:"show"};let t=w(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=g(e.value)?_(e.value):A(""),t==="setIcon"&&T(e.path)&&(n.path=T(e.path));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=v(e.number,0);break;case"setFontWeight":n.weight=T(e.weight)??"regular";break;case"setFontDesign":n.design=T(e.design)??"default";break;case"setFontWidth":n.width=Ft(T(e.width))??"standard";break;case"setItalic":n.italic=e.italic!==!1;break;default:break}return n}function Oi(e){return Array.isArray(e)?e.filter(g).map(t=>{let n={id:w(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(g).map(o=>{let i=g(o.when)?o.when:{};return{id:w(o.id).toUpperCase(),when:{join:i.join==="any"?"any":"all",tests:(Array.isArray(i.tests)?i.tests:[]).filter(g).map(r=>({id:w(r.id).toUpperCase(),value:g(r.value)?_(r.value):A(""),comparison:Sl(r.comparison)}))},then:(Array.isArray(o.then)?o.then:[]).map(Bo)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(Bo)),typeof t.partId=="string"&&t.partId!==""&&(n.partId=t.partId.toUpperCase()),n}):[]}function Al(e,t){return{baseColorHex:g(e)?w(e.baseColorHex,t):t}}function rt(e){return Array.isArray(e)?e.filter(g).map(t=>{let n={id:w(t.id,M()),upTo:v(t.upTo,0),colorHex:w(t.colorHex,"#FFFFFF")};return typeof t.fillColorHex=="string"&&(n.fillColorHex=t.fillColorHex),typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),n}):[]}function nt(e){let t={id:e.id,upTo:b(e.upTo),colorHex:e.colorHex};return e.fillColorHex!==void 0&&(t.fillColorHex=e.fillColorHex),e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t}function Tl(e){return Array.isArray(e)?e.filter(g).map(t=>{let n={id:w(t.id,M()).toUpperCase(),value:g(t.value)?_(t.value):A("")};g(t.icon)&&(n.icon=_(t.icon)),typeof t.colorHex=="string"&&(n.colorHex=t.colorHex);let o=T(t.fontWeight);(o==="regular"||o==="medium"||o==="semibold"||o==="bold")&&(n.fontWeight=o),typeof t.fontSize=="number"&&(n.fontSize=t.fontSize);let i=T(t.fontDesign);(i==="default"||i==="rounded"||i==="monospaced"||i==="serif")&&(n.fontDesign=i);let r=Ft(T(t.fontWidth));r!==void 0&&(n.fontWidth=r),typeof t.italic=="boolean"&&(n.italic=t.italic),T(t.coloring)==="bands"&&(n.coloring="bands");let a=rt(t.bands);a.length>0&&(n.bands=a);let d=w(t.bandAboveColorHex,G);return d!==G&&(n.bandAboveColorHex=d),n}):[]}function El(e){if(Array.isArray(e.bands))return rt(e.bands);if(typeof e.bandLowerBound!="number")return[];let t=g(e.colorSlot)?w(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:M(),upTo:e.bandLowerBound,colorHex:w(e.bandLowColorHex,ws)},{id:M(),upTo:v(e.bandUpperBound,100),colorHex:t}]}function _l(e){return Array.isArray(e)?e.filter(g).map(t=>({id:w(t.id,M()).toUpperCase(),match:w(t.match,""),colorHex:w(t.colorHex,Pt)})):[]}function Fl(e){if(!g(e))return;let t=[];for(let n of Array.isArray(e.entities)?e.entities:[]){let o=typeof n=="string"?n.trim():"";o!==""&&!t.includes(o)&&t.push(o)}if(t.length!==0)return{entities:t,combine:e.combine==="all"?"all":$t}}function gn(e){let t=g(e)?e:{},n={entityId:w(t.entityId),displayName:w(t.displayName),domain:w(t.domain)};return typeof t.iconName=="string"&&(n.iconName=t.iconName),n}function Uo(e){return Array.isArray(e)?e.map(gn).filter(t=>t.entityId!==""):[]}function Hl(e){let t=g(e)?e:{},n=o=>Array.isArray(o)?o.filter(i=>typeof i=="string"):[];switch(t.kind){case"attribute":return{kind:"attribute",...gn(t),attribute:w(t.attribute)};case"template":return{kind:"template",value:w(t.value)};case"calendar":return{kind:"calendar",entities:Uo(t.entities),hours:Ne(t.hours)};case"todo":return{kind:"todo",entities:Uo(t.entities),status:ge(T(t.status),Qs,"open"),sort:ge(T(t.sort),el,"list")};case"forecast":return{kind:"forecast",...gn(t),type:ge(T(t.type),tl,"hourly")};default:{let o=zi({scope:t.scope,stateFilter:t.stateFilter}),i={kind:"entities",scope:o.scope,sort:ge(T(t.sort),Zs,"name"),descending:t.descending===!0,attributes:n(t.attributes)},r=w(t.deviceClass).trim();return r!==""&&(i.deviceClass=r),o.stateFilter&&(i.stateFilter=o.stateFilter),i}}}function Ll(e){if(g(e))return{colorHex:w(e.colorHex,li),radius:ns(v(e.radius,0)),dx:Io(v(e.dx,0)),dy:Io(v(e.dy,0))}}function V(e,t){if(typeof e.id!="string")throw new X("element id is required");let n={id:e.id.toUpperCase(),colorSlot:Al(e.colorSlot,t),rules:Oi(e.rules),frame:Di(e.frame),isHidden:e.isHidden===!0},o=os(v(e.opacity,1));o!==1&&(n.opacity=o);let i=Ll(e.shadow);return i!==void 0&&(n.shadow=i),n}function Ml(e){let t=Vi(e),n=vl(e.payload.page);return n!==void 0&&(t.payload.page=n),t}function Vi(e){let t=Il(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),typeof n.name=="string"&&n.name!==""&&(t.payload.name=n.name),n.accentGroup==="accent"&&(t.payload.accentGroup="accent"),t}function Il(e){if(!g(e)||!g(e.payload))throw new X("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...V(t,"#FFFFFF"),value:g(t.value)?_(t.value):A(""),fontSize:v(t.fontSize,14),fontWeight:T(t.fontWeight)??"regular"};t.countdown===!0&&(n.countdown=!0),t.monospacedDigits===!0&&(n.monospacedDigits=!0);let o=typeof t.lineLimit=="number"?Math.round(t.lineLimit):1,i=Math.min(ha,Math.max(1,o));i>1&&(n.lineLimit=i);let r=T(t.fontDesign);(r==="rounded"||r==="monospaced"||r==="serif")&&(n.fontDesign=r);let a=Ft(T(t.fontWidth));a!==void 0&&a!=="standard"&&(n.fontWidth=a),t.italic===!0&&(n.italic=!0);let d=fa(v(t.minimumScale,it));d!==it&&(n.minimumScale=d);let s=T(t.alignment);(s==="leading"||s==="trailing")&&(n.alignment=s),T(t.coloring)==="bands"&&(n.coloring="bands");let h=rt(t.bands);h.length>0&&(n.bands=h);let u=w(t.bandAboveColorHex,G);u!==G&&(n.bandAboveColorHex=u);let l=T(t.highlight);(l==="highest"||l==="lowest"||l==="both")&&(n.highlight=l);let c=w(t.highColorHex,He);c!==He&&(n.highColorHex=c);let p=w(t.lowColorHex,Le);p!==Le&&(n.lowColorHex=p);let f=Tl(t.parts);f.length>0&&(n.parts=f);let m=Xa(t.arc);return m!==void 0&&(n.arc=m),wt(t,n),{kind:"text",payload:n}}case"icon":{let n={...V(t,"#FFFFFF"),symbol:g(t.symbol)?_(t.symbol):A("lightbulb"),size:v(t.size,14)},o=T(t.path);o!==void 0&&o!==""&&(n.path=o);let i=Hn(T(t.viewBox));return i!==void 0&&(n.viewBox=i),Ho(t,n),wt(t,n),{kind:"icon",payload:n}}case"gauge":{let n={...V(t,"#FFFFFF"),value:g(t.value)?_(t.value):A("50"),minValue:v(t.minValue,0),maxValue:v(t.maxValue,100),style:T(t.style)??"arc",lineWidth:v(t.lineWidth,4),trackColorHex:w(t.trackColorHex,"#FFFFFF40"),coloring:T(t.coloring)??"uniform",bands:rt(t.bands),bandAboveColorHex:w(t.bandAboveColorHex,G),thresholdColorHex:w(t.thresholdColorHex,Ln)},o=tt(t.thresholdValue);o!==void 0&&(n.thresholdValue=o),g(t.total)&&(n.total=_(t.total)),g(t.minSource)&&(n.minSource=_(t.minSource)),g(t.maxSource)&&(n.maxSource=_(t.maxSource));let i=Qe(t.fill);i!==void 0&&(n.fill=i);let r=hs(t.ticks);r!==void 0&&(n.ticks=r);let a=ms(t.labels);return a!==void 0&&(n.labels=a),{kind:"gauge",payload:n}}case"chart":return{kind:"chart",payload:{...V(t,"#FFFFFF"),value:g(t.value)?_(t.value):A("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(v(t.historyMinutes,0))),historyPoints:Math.round(v(t.historyPoints,24)),source:ge(T(t.source),Ta,Sn),statPeriod:ge(T(t.statPeriod),Ea,An),statType:ge(T(t.statType),_a,Tn),style:me(t.style,["bars","line","area"],"bars"),limit:Math.max(0,Math.round(v(t.limit,0))),takeFromEnd:t.takeFromEnd===!0,scale:me(t.scale,["auto","fixed"],"auto"),minValue:v(t.minValue,0),maxValue:v(t.maxValue,100),baseline:me(t.baseline,["lowest","zero"],"lowest"),barGap:v(t.barGap,1.5),lineWidth:v(t.lineWidth,2),highlight:me(t.highlight,["none","highest","lowest","both"],"none"),highColorHex:w(t.highColorHex,He),lowColorHex:w(t.lowColorHex,Le),marker:typeof t.marker=="string"?me(t.marker,["none","dot","pointer"],"dot"):"pointer",...$o(t.highMarker)?{highMarker:t.highMarker}:{},...$o(t.lowMarker)?{lowMarker:t.lowMarker}:{},coloring:me(t.coloring,["uniform","bands"],"uniform"),bands:El(t),bandAboveColorHex:w(t.bandHighColorHex,w(t.bandAboveColorHex,G)),fillBands:t.fillBands===!0,...Fo(t.curve)!=="straight"?{curve:Fo(t.curve)}:{},...ln(t.fillStyle)!=="flat"?{fillStyle:ln(t.fillStyle)}:{},...typeof t.fillColorHex=="string"?{fillColorHex:t.fillColorHex}:{},...Qe(t.areaFill)!==void 0?{areaFill:Qe(t.areaFill)}:{},...un(t.barRadius)!==Cn?{barRadius:un(t.barRadius)}:{},...pn(t.barCorners)!=="all"?{barCorners:pn(t.barCorners)}:{},...typeof t.barBorderWidth=="number"&&Number.isFinite(t.barBorderWidth)&&t.barBorderWidth!==0?{barBorderWidth:t.barBorderWidth}:{},...typeof t.barBorderColorHex=="string"?{barBorderColorHex:t.barBorderColorHex}:{},...t.barBorderOpenBase===!0?{barBorderOpenBase:!0}:{},...typeof t.bandAboveFillColorHex=="string"?{bandAboveFillColorHex:t.bandAboveFillColorHex}:{},...typeof t.bandAboveBorderColorHex=="string"?{bandAboveBorderColorHex:t.bandAboveBorderColorHex}:{},...dn(t.pointDots)!=="none"?{pointDots:dn(t.pointDots)}:{},...et(t.pointDotSize)!==void 0?{pointDotSize:et(t.pointDotSize)}:{},...typeof t.pointDotColorHex=="string"?{pointDotColorHex:t.pointDotColorHex}:{},...cn(t.gridLines)!==0?{gridLines:cn(t.gridLines)}:{},...$e(Fe(t.gridColorHex),Ht)?{}:{gridColorHex:Fe(t.gridColorHex)},...t.zeroLine===!0?{zeroLine:!0}:{},...hn(t.smoothing)!==void 0?{smoothing:hn(t.smoothing)}:{},...t.gaps===!0?{gaps:!0}:{},...typeof t.thresholdValue=="number"&&Number.isFinite(t.thresholdValue)?{thresholdValue:t.thresholdValue}:{},thresholdColorHex:w(t.thresholdColorHex,Mn),...g(t.nowIndex)?{nowIndex:_(t.nowIndex)}:{},nowColorHex:w(t.nowColorHex,In),...t.drawsThreshold===!1?{drawsThreshold:!1}:{},...t.drawsNowLine===!1?{drawsNowLine:!1}:{},...t.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{},...T(t.scaleFrom)!==void 0?{scaleFrom:T(t.scaleFrom)}:{},timeLabelCount:Me(t.timeLabelCount),labelSize:v(t.labelSize,ee),labelColorHex:w(t.labelColorHex,te),labelsAbove:t.labelsAbove===!0,hourCycle:an(t.hourCycle),minutes:sn(t.minutes)}};case"timeline":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i=Fl(t.aggregate);return{kind:"timeline",payload:{...o,value:g(t.value)?_(t.value):A(""),...i!==void 0?{aggregate:i}:{},historyMinutes:Math.max(1,Math.round(v(t.historyMinutes,Dn))),bands:_l(t.bands),otherColorHex:w(t.otherColorHex,Pt),gap:Math.min(Vs,Math.max(0,v(t.gap,0))),cornerRadius:Math.max(0,v(t.cornerRadius,xi)),timeLabelCount:$s(t),labelSize:v(t.labelSize,ee),labelColorHex:w(t.labelColorHex,te),labelsAbove:t.labelsAbove===!0,hourCycle:an(t.hourCycle),minutes:sn(t.minutes),...t.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{}}}}case"shape":{let n={...V(t,"#FFFFFF33"),kind:T(t.kind)??"roundedRectangle",cornerRadius:v(t.cornerRadius,6),thickness:v(t.thickness,1),borderWidth:v(t.borderWidth,1)};typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex);let o=Qe(t.fill);return o!==void 0&&(n.fill=o),Ho(t,n),wt(t,n),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i={...o,entity:g(t.entity)?oe(t.entity):{entityId:"",displayName:"",domain:""},source:t.source==="entityPicture"?"entityPicture":t.source==="inline"?"inline":"camera",contentMode:t.contentMode==="fit"?"fit":"fill",zoom:v(t.zoom,1),panX:v(t.panX,0),panY:v(t.panY,0),cornerRadius:v(t.cornerRadius,Ci),timestampCorner:qs.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:v(t.timestampSize,zt)},r=T(t.data);r!==void 0&&r!==""&&(i.data=r),t.format==="jpeg"&&(i.format="jpeg"),t.timestamp===!0&&(i.timestamp=!0);let a=tt(t.timestampX),d=tt(t.timestampY);return a!==void 0&&d!==void 0&&Number.isFinite(a)&&Number.isFinite(d)&&(i.timestampX=j(a),i.timestampY=j(d)),wt(t,i),{kind:"image",payload:i}}case"tap":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i={...o,action:g(t.action)?jn(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(i.openPageId=t.openPageId),typeof t.openPageName=="string"&&(i.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(i.attachedTo=t.attachedTo.toUpperCase()),{kind:"tap",payload:i}}case"chartTimes":{let{colorSlot:n,...o}=V(t,"#FFFFFF");return{kind:"chartTimes",payload:{...o,chart:w(t.chart).toUpperCase(),timeLabelCount:Me(t.timeLabelCount),labelSize:v(t.labelSize,ee),labelColorHex:w(t.labelColorHex,te),hourCycle:an(t.hourCycle),minutes:sn(t.minutes),...Rs(t)}}}case"imageTime":{let{colorSlot:n,...o}=V(t,"#FFFFFF");return{kind:"imageTime",payload:{...o,image:w(t.image).toUpperCase()}}}case"chartDots":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i=et(t.size);return{kind:"chartDots",payload:{...o,chart:w(t.chart).toUpperCase(),dots:ii(t.dots),...i!==void 0?{size:i}:{},...typeof t.colorHex=="string"?{colorHex:t.colorHex}:{}}}}case"chartGrid":{let{colorSlot:n,...o}=V(t,"#FFFFFF");return{kind:"chartGrid",payload:{...o,chart:w(t.chart).toUpperCase(),lines:ri(t.lines),colorHex:Fe(t.colorHex),thickness:ai(t.thickness)}}}case"list":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i=(Array.isArray(t.template)?t.template:[]).filter(r=>g(r)&&!_i.includes(String(r.kind))).map(r=>Vi(r));return{kind:"list",payload:{...o,source:Hl(t.source),rows:Pe(t.rows),direction:t.direction==="across"?"across":"down",columns:Un(t.columns),gap:Fi(t.gap),template:i}}}default:throw new X(`unknown element kind ${String(e.kind)}`)}}function Wo(e){let t=g(e)?e:{},n={};if(g(t.placements))for(let[r,a]of Object.entries(t.placements)){if(!g(a))continue;let d={frame:Di(a.frame),isHidden:a.isHidden===!0},s=tt(a.size);s!==void 0&&(d.size=s),n[r.toUpperCase()]=d}let o={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:v(t.borderWidth,2),rules:Oi(t.rules)};if(g(t.bezelText)&&(o.bezelText=_(t.bezelText)),t.bezelCountdown===!0&&(o.bezelCountdown=!0),g(t.curvedText)&&(o.curvedText=_(t.curvedText)),typeof t.curvedColorHex=="string"&&(o.curvedColorHex=t.curvedColorHex),g(t.parkedCurvedText)&&(o.parkedCurvedText=_(t.parkedCurvedText)),typeof t.parkedCurvedColorHex=="string"&&(o.parkedCurvedColorHex=t.parkedCurvedColorHex),g(t.bezelGauge)){let r=t.bezelGauge,a={value:g(r.value)?_(r.value):A("50"),minValue:v(r.minValue,0),maxValue:v(r.maxValue,100),colorHexes:Array.isArray(r.colorHexes)&&r.colorHexes.length>0?r.colorHexes.filter(d=>typeof d=="string"):["#34C759","#FFCC00","#FF3B30"]};g(r.minLabel)&&(a.minLabel=_(r.minLabel)),g(r.maxLabel)&&(a.maxLabel=_(r.maxLabel)),o.bezelGauge=a}typeof t.backgroundColorHex=="string"&&(o.backgroundColorHex=t.backgroundColorHex);let i=Qe(t.backgroundFill);return i!==void 0&&(o.backgroundFill=i),typeof t.borderColorHex=="string"&&(o.borderColorHex=t.borderColorHex),o}function Rl(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let o=e[n];typeof o=="string"&&(t[o]=Wo(e[n+1]))}else if(g(e))for(let[n,o]of Object.entries(e))t[n]=Wo(o);return t}function $l(e){let t={value:g(e.value)?_(e.value):A("")};if(typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),Array.isArray(e.parts)){let n=e.parts.filter(g).map(o=>{let i={id:typeof o.id=="string"&&o.id!==""?o.id.toUpperCase():M(),value:g(o.value)?_(o.value):A("")};return typeof o.symbol=="string"&&o.symbol!==""&&(i.symbol=o.symbol),i});n.length>0&&(t.parts=n)}return t}function Pl(e){let t={kind:e.kind==="button"?"button":"toggle",title:g(e.title)?_(e.title):A(""),symbol:w(e.symbol,Ii),coloring:e.coloring==="bands"?"bands":"uniform",bands:rt(e.bands),action:jn(e.action)};return g(e.valueLabel)&&(t.valueLabel=_(e.valueLabel)),g(e.state)&&(t.state=_(e.state)),typeof e.symbolOff=="string"&&(t.symbolOff=e.symbolOff),typeof e.tintColorHex=="string"&&(t.tintColorHex=e.tintColorHex),typeof e.bandAboveColorHex=="string"&&(t.bandAboveColorHex=e.bandAboveColorHex),g(e.status)&&(t.status=_(e.status)),t}function xn(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){if(typeof n!="string")continue;let o=n.trim().toUpperCase();o===""||t.includes(o)||t.push(o)}return t}function Nl(e){if(!g(e))return;let t={};for(let[n,o]of Object.entries(e)){if(!Array.isArray(o))continue;let i=n.trim().toUpperCase();i===""||i in t||(t[i]=xn(o))}return Object.keys(t).length>0?t:void 0}function jn(e){if(!g(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":case"nextPage":case"previousPage":case"playTour":return{type:e.type};case"refresh":return Array.isArray(e.layerIds)?{type:"refresh",layerIds:xn(e.layerIds)}:{type:"refresh"};case"refreshAll":{let t={type:"refreshAll"};if(e.allPlaced===!0)return t.allPlaced=!0,t;let n=xn(e.targets);n.length>0&&(t.targets=n);let o=Nl(e.targetLayers);return o!==void 0&&(t.targetLayers=o),t}case"showPage":return{type:"showPage",page:typeof e.page=="number"&&Number.isInteger(e.page)&&e.page>=1?e.page:1};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":case"openEntity":return{type:e.type,...oe(e)};case"callService":{let t={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(t.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(t.target=oe(e)),t}default:return{type:"none"}}}function ah(e){if(!g(e))throw new X("config must be an object");for(let d of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(d in e))throw new X(`${d} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(g).map(d=>({id:w(d.id).toUpperCase(),name:w(d.name),value:g(d.value)?_(d.value):A("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(g).map(d=>d.kind==="template"?{kind:"template",value:w(d.value)}:d.kind==="entity"?{kind:"entity",...oe(d)}:null).filter(d=>d!==null),o={schemaVersion:v(e.schemaVersion,1),id:w(e.id).toUpperCase(),name:w(e.name,"Custom"),values:t,slotIndex:v(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Ml),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(d=>typeof d=="string"),perFamily:Rl(e.perFamily),dataSources:n,tapAction:jn(e.tapAction)};g(e.inline)&&(o.inline=$l(e.inline)),g(e.control)&&(o.control=Pl(e.control));let i=tt(e.refreshMinutes);i!==void 0&&(o.refreshMinutes=i),typeof e.openPageId=="string"&&(o.openPageId=e.openPageId),typeof e.openPageName=="string"&&(o.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(o.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(o.successFlashColorHex=e.successFlashColorHex),e.httpShowResult===!0&&(o.httpShowResult=!0),e.hidden===!0&&(o.hidden=!0),typeof e.linkId=="string"&&e.linkId!==""&&(o.linkId=e.linkId.toUpperCase());let r=bl(e.pages);if(r!==void 0&&(o.pages=r),Array.isArray(e.groups)){let d=e.groups.filter(g).filter(s=>typeof s.id=="string").map(s=>({id:w(s.id).toUpperCase(),name:w(s.name,"Group"),locked:s.locked!==!1,...typeof s.parentId=="string"&&s.parentId!==""?{parentId:s.parentId.toUpperCase()}:{}}));d.length>0&&(o.groups=d)}let a=on(e.notes);return a!==void 0&&(o.notes=a),sd(o,Array.isArray(e.elements)?e.elements:[]),W(o),o}function zl(e,t){let n=t?.kind;if(!n||n.kind!=="chartStat")return;let o=e.elements.find(i=>i.payload.id===n.layer);return o?.kind==="chart"?o:void 0}function Bi(e,t){return e.elements.filter(n=>n.kind==="text"&&n.payload.value.kind.kind==="chartStat"&&n.payload.value.kind.layer===t)}function ae(e,t,n){Ui(e,t,n);let o=Xn(e,t.payload.id);if(o){Cd(e,n,o.id);return}let i=ir(e,[t.payload.id,n]),r=e.groups?.find(a=>a.id===i);r&&(r.locked=!1)}function Ui(e,t,n){let o=e.elements.find(i=>i.payload.id===n);o&&(t.payload.page===void 0?delete o.payload.page:o.payload.page=t.payload.page)}var Wi={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function Gi(e,t,n,o){let i=P.rectangular,r=Math.min(1,(o*n*.62+4)/i.width),a=Math.min(1,n*1.3/i.height),d=e.x+t.x*e.width-t.x*r,s=e.y+t.y*e.height-t.y*a;return{x:Math.max(0,Math.min(1-r,d)),y:Math.max(0,Math.min(1-a,s)),width:r,height:a,rotationDegrees:0}}function sh(e,t,n){let o=e.elements.find(h=>h.payload.id===t);if(!o||o.kind!=="chart")return;let i=D("text"),r=n==="latest"?10:8,a={kind:{kind:"chartStat",layer:t,stat:n}};(n==="latest"||n==="delta"||n==="sum")&&(a.format={useEntityUnit:!0}),i.payload.value=a,i.payload.fontSize=r,i.payload.fontWeight="medium",i.payload.colorSlot={baseColorHex:n==="latest"?"#FFFFFF":"#FFFFFF99"};let d=n==="trend"?2:a.format?.useEntityUnit?7:4;i.payload.frame=Gi(o.payload.frame,Wi[n],r,d);let s=e.elements.findIndex(h=>h.payload.id===t);return e.elements.splice(s+1,0,i),ae(e,o,i.payload.id),i.payload.id}var ji={highest:"arrowtriangle.up.fill",lowest:"circle.fill",now:"arrowtriangle.down.fill",first:"circle.fill",latest:"circle.fill",threshold:"circle.fill",zero:"circle.fill"},Go=6,Dl={"\u25B2":"arrowtriangle.up.fill","\u25BC":"arrowtriangle.down.fill","\u25CF":"circle.fill","\u25C6":"diamond.fill"};function Ol(e,t){let n=(o,i)=>o!==void 0&&o!==i?o:void 0;return t==="highest"?n(e.payload.highColorHex,He)??"#FFD60A":t==="lowest"?n(e.payload.lowColorHex,Le)??"#FF453A":"#FFFFFF"}function Kn(e){e.nowIndex===void 0&&(e.nowIndex={kind:{kind:"time",timeField:"hour"}},e.drawsNowLine=!1)}function Re(e,t){return e.elements.filter(n=>n.payload.chartAnchor?.layer===t)}function Vl(e,t,n,o="above"){let i=e.elements.find(d=>d.payload.id===t);if(!i||i.kind!=="chart")return;n==="now"&&Kn(i.payload);let r=D("icon");r.payload.symbol=A(ji[n]),r.payload.size=Go,r.payload.colorSlot={baseColorHex:Ol(i,n)},r.payload.frame=Bl(Go),r.payload.chartAnchor={layer:t,at:n,place:o};let a=e.elements.findIndex(d=>d.payload.id===t);return e.elements.splice(a+1,0,r),ae(e,i,r.payload.id),r.payload.id}function lh(e,t){let n=e.elements.findIndex(l=>l.payload.id===t),o=e.elements[n];if(!o||o.kind!=="text"||o.payload.chartAnchor===void 0)return;let i=o.payload,r=i.chartAnchor,a=l=>{let c=ci(l);return c===void 0?void 0:Dl[c.trim()]},d=new Set(tc.icon),s=l=>l.flatMap(c=>{if(c.kind==="setText"){let p=c.value===void 0?void 0:a(c.value);return p===void 0?[]:[{kind:"setIcon",value:A(p)}]}return d.has(es[c.kind])?[c]:[]}),h=i.rules.filter(l=>l.partId===void 0).map(l=>({...l,cases:l.cases.map(c=>({...c,then:s(c.then)})),...l.otherwise!==void 0?{otherwise:s(l.otherwise)}:{}})),u=D("icon");u.payload={...u.payload,id:i.id,colorSlot:i.colorSlot,rules:h,frame:i.frame,isHidden:i.isHidden,...i.groupId!==void 0?{groupId:i.groupId}:{},...i.name!==void 0?{name:i.name}:{},chartAnchor:r,symbol:A(a(i.value)??ji[r.at]),size:i.fontSize},e.elements[n]=u}function Bl(e){let t=P.rectangular;return{x:0,y:0,width:Math.min(1,e*1.2/t.width),height:Math.min(1,e*1.3/t.height),rotationDegrees:0}}function St(e,t,n){let o=e.elements.find(d=>d.payload.id===t);if(!o||o.kind!=="chart")return;let i=o.payload;n==="now"&&Kn(i);let r=D("shape");r.payload.kind="line",r.payload.thickness=1,r.payload.borderWidth=0,r.payload.colorSlot={baseColorHex:n==="now"?i.nowColorHex:i.thresholdColorHex},r.payload.frame=Ki(i.frame,n),r.payload.chartAnchor={layer:t,at:n,place:"through"};let a=e.elements.findIndex(d=>d.payload.id===t);return e.elements.splice(a+1,0,r),ae(e,o,r.payload.id),n==="now"?i.drawsNowLine=!1:i.drawsThreshold=!1,r.payload.id}function Ki(e,t){let n=P.rectangular,o=3;return t==="now"?{...e,width:Math.min(e.width,o/n.width),rotationDegrees:0}:{...e,height:Math.min(e.height,o/n.height),rotationDegrees:0}}function Ul(e,t){return e.elements.filter(n=>n.kind==="chartTimes"&&n.payload.chart===t)}function qi(e,t){let n=e.elements.find(a=>a.payload.id===t);if(!n||n.kind!=="chart"&&n.kind!=="timeline")return;let o=n.payload,i=D("chartTimes");i.payload.chart=t,i.payload.timeLabelCount=o.timeLabelCount>0?Me(o.timeLabelCount):yi,i.payload.labelSize=o.labelSize,i.payload.labelColorHex=o.labelColorHex,i.payload.hourCycle=o.hourCycle,i.payload.minutes=o.minutes,i.payload.frame=ad(o.frame,o.labelSize,o.labelsAbove);let r=e.elements.findIndex(a=>a.payload.id===t);return e.elements.splice(r+1,0,i),ae(e,n,i.payload.id),o.drawsTimeLabels=!1,i.payload.id}function Wl(e,t){return e.elements.filter(n=>n.kind==="imageTime"&&n.payload.image===t)}function Gl(e){let t=Math.min(40,Math.max(4,e));return{w:8*t*.578+t*.89,h:t*1.25}}function Ji(e,t){return Math.max(0,Math.min(e/(8*.578+.89),t/1.25))}var qn="Timestamp",jl="#0000008C";function At(e,t){let n=e?.kind;return n?.kind==="imageTime"&&(t===void 0||n.layer.toUpperCase()===t.toUpperCase())}function Kl(e,t){return e.elements.filter(n=>n.kind==="text"&&(At(n.payload.value,t)||(n.payload.parts??[]).some(o=>At(o.value,t))))}function ql(e,t){let n=new Set;for(let o of Wl(e,t))n.add(o.payload.id);for(let o of Kl(e,t))for(let i of Xi(e,o))n.add(i);return e.elements.filter(o=>n.has(o.payload.id))}function Xi(e,t){let n=t.payload.groupId;if(n===void 0)return[t.payload.id];let o=nr(e,n);return o.every(r=>r.kind==="shape"||r.kind==="text"&&(At(r.payload.value)||(r.payload.parts??[]).some(a=>At(a.value))))?o.map(r=>r.payload.id):[t.payload.id]}function dh(e,t){let n=e.elements.find(i=>i.payload.id===t);if(!n)return;let o=n.kind==="text"?Xi(e,n):[t];for(let i of o)Q(e,i)}function Yi(e,t,n){let o=D("shape");o.payload.kind="capsule",o.payload.colorSlot={baseColorHex:jl},o.payload.borderWidth=0,o.payload.frame={...t};let i=D("text");return i.payload.value={kind:{kind:"imageTime",layer:e},format:{timestamp:"clock",showSeconds:!0,hideDayPeriod:!0}},i.payload.colorSlot={baseColorHex:"#FFFFFF"},i.payload.fontWeight="semibold",i.payload.fontDesign="rounded",i.payload.fontSize=Math.round(Math.max(4,n)*10)/10,i.payload.frame={...t},[o,i]}function Jl(e){let t=e.payload.name?.trim();if(t)return t;if(e.kind!=="image")return"Picture";let n=e.payload.entity,o=n.displayName.trim()||n.entityId.trim();return o!==""&&e.payload.source!=="inline"?o:e.payload.source==="camera"?"Camera":"Picture"}function Zi(e,t){let n=$(e,t.payload.groupId);if(n)return n.id;let o={id:M(),name:Jl(t),locked:!1};return e.groups=[...e.groups??[],o],t.payload.groupId=o.id,o.id}function yn(e,t,n,o=qn,i){if(e.elements.splice(n,0,...t),i!==void 0)for(let r of t)r.payload.groupId=i;return ir(e,t.map(r=>r.payload.id),o)}function Qi(e,t,n,o){let i=Zi(e,t);return yn(e,n,e.elements.indexOf(t)+1,o,i)}function Xl(e){for(let t of[...e.groups??[]]){if(t.parentId!==void 0||t.name!==qn||!t.locked||wd(e,t.id).length>0)continue;let n=nr(e,t.id);if(n.length!==2)continue;let o=n.find(m=>m.kind==="shape"&&m.payload.kind==="capsule"),i=n.find(m=>m.kind==="text"&&m.payload.value.kind.kind==="imageTime");if(!o||!i||i.kind!=="text"||i.payload.value.kind.kind!=="imageTime")continue;let r=i.payload.value.kind.layer.toUpperCase(),a=e.elements.find(m=>m.kind==="image"&&m.payload.id.toUpperCase()===r);if(!a)continue;let d=e.elements.filter(m=>!R(e,m)),s=m=>{let x=d.map((S,H)=>m.has(S.payload.id)?H:-1).filter(S=>S>=0);if(!(x.length===0||x[x.length-1]-x[0]+1!==x.length))return[x[0],x[x.length-1]]},h=U(e,a.payload.groupId),u=h[h.length-1],l=s(u?new Set(ne(e,u.id).map(m=>m.payload.id)):new Set([a.payload.id])),c=s(new Set(n.map(m=>m.payload.id)));if(!l||!c||c[0]!==l[1]+1&&l[0]!==c[1]+1)continue;let p=Zi(e,a),f=e.elements.filter(m=>!n.includes(m));f.splice(f.indexOf(a)+1,0,...n),e.elements=f,t.parentId=p,W(e),se(e)}}function Yl(e,t,n=P.rectangular){let o=e.elements.find(m=>m.payload.id===t);if(!o||o.kind!=="image")return;let i=o.payload,r=Gl(i.timestampSize),a=i.frame.x*n.width,d=i.frame.y*n.height,s=i.frame.width*n.width,h=i.frame.height*n.height,u,l;if(Si(i)){let m=(x,S,H,N)=>N>=H?S+(H-N)/2:Math.min(S+H-N,Math.max(S,x-N/2));u=m(a+i.timestampX*s,a,s,r.w),l=m(d+i.timestampY*h,d,h,r.h)}else u=i.timestampCorner.endsWith("Leading")?a+4:a+s-4-r.w,l=i.timestampCorner.startsWith("top")?d+4:d+h-4-r.h;let c=m=>Math.round(m*1e3)/1e3,p={x:c(u/n.width),y:c(l/n.height),width:c(r.w/n.width),height:c(r.h/n.height),rotationDegrees:0},f=Yi(t,p,Ji(r.w,r.h));Qi(e,o,f);for(let m of f)Ui(e,o,m.payload.id);return delete i.timestamp,delete i.timestampX,delete i.timestampY,i.timestampCorner="topLeading",i.timestampSize=zt,f[1].payload.id}function Zl(e,t){let n=e.elements.find(m=>m.payload.id===t);if(!n||n.kind!=="imageTime")return;let o=n.payload,i=L.find(m=>e.perFamily[m]?.placements[t]!==void 0),a=(i===void 0?void 0:e.perFamily[i].placements[t])?.frame??o.frame,d=P[i??"rectangular"],s=Ji(a.width*d.width,a.height*d.height),[h,u]=Yi(o.image,o.frame,s);for(let m of[h,u])m.payload.isHidden=o.isHidden,o.opacity!==void 0&&(m.payload.opacity=o.opacity),o.page!==void 0&&(m.payload.page=o.page),o.accentGroup==="accent"&&(m.payload.accentGroup="accent");h.payload.rules=structuredClone(o.rules),u.payload.rules=structuredClone(o.rules),o.shadow!==void 0&&(h.payload.shadow=structuredClone(o.shadow));for(let m of L){let x=e.perFamily[m]?.placements[t];if(!x)continue;let S=e.perFamily[m];for(let H of[h,u])S.placements[H.payload.id]={frame:{...x.frame},isHidden:x.isHidden};delete S.placements[t]}for(let m of e.elements)m.kind==="tap"&&m.payload.attachedTo===t&&(m.payload.attachedTo=u.payload.id);let l=o.groupId,c=e.elements.indexOf(n);e.elements.splice(c,1);let p=o.name!==void 0&&o.name.trim()!==""?o.name:qn,f=e.elements.find(m=>m.kind==="image"&&m.payload.id===o.image);return f?l!==void 0&&f.payload.groupId===l?yn(e,[h,u],c,p,l):Qi(e,f,[h,u],p):yn(e,[h,u],c,p),W(e),Oe(e),u.payload.id}function Ql(e,t){return e.elements.filter(n=>n.kind==="chartDots"&&n.payload.chart===t)}function ed(e,t){return e.elements.filter(n=>n.kind==="chartGrid"&&n.payload.chart===t)}function td(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n||n.kind!=="chart")return;let o=D("chartDots");o.payload.chart=t,o.payload.dots=n.payload.pointDots==="all"?"all":"auto",o.payload.frame={...n.payload.frame};let i=e.elements.findIndex(r=>r.payload.id===t);return e.elements.splice(i+1,0,o),ae(e,n,o.payload.id),o.payload.id}function nd(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n||n.kind!=="chart")return;let o=D("chartGrid");o.payload.chart=t,o.payload.frame={...n.payload.frame};let i=e.elements.findIndex(r=>r.payload.id===t);return e.elements.splice(i,0,o),ae(e,n,o.payload.id),o.payload.id}var od="#FFFFFF66";function id(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n||n.kind!=="chart")return;let o=D("shape");o.payload.kind="line",o.payload.thickness=1,o.payload.borderWidth=0,o.payload.colorSlot={baseColorHex:od},o.payload.frame=Ki(n.payload.frame,"threshold"),o.payload.chartAnchor={layer:t,at:"zero",place:"through"};let i=e.elements.findIndex(r=>r.payload.id===t);return e.elements.splice(i+1,0,o),ae(e,n,o.payload.id),o.payload.id}function ch(e,t,n){let o=e.elements.find(r=>r.payload.id===t);if(!o||o.kind!=="chart")return;let i=o.payload;if(n===void 0){delete i.thresholdValue,delete i.drawsThreshold;for(let r of Re(e,t))r.payload.chartAnchor?.at==="threshold"&&Q(e,r.payload.id);return}i.thresholdValue=n,i.drawsThreshold=!1,Re(e,t).some(r=>r.payload.chartAnchor?.at==="threshold")||St(e,t,"threshold")}function uh(e,t,n){let o=e.elements.find(r=>r.payload.id===t);if(!o||o.kind!=="chart")return;let i=o.payload;if(!n){delete i.nowIndex,delete i.drawsNowLine;for(let r of Re(e,t))r.payload.chartAnchor?.at==="now"&&Q(e,r.payload.id);return}Kn(i),i.drawsNowLine=!1,Re(e,t).some(r=>r.payload.chartAnchor?.at==="now")||St(e,t,"now")}function ph(e){let t=e.elements.filter(n=>n.kind==="chart"||n.kind==="timeline"||n.kind==="image");for(let n of t){let o=n.payload,i=new Set(e.elements.map(s=>s.payload.id)),r=L.find(s=>e.perFamily[s]?.placements[o.id]!==void 0),a=o.frame,d=r===void 0?void 0:e.perFamily[r].placements[o.id];if(d&&(o.frame={...d.frame}),n.kind==="chart"&&rd(e,n.payload),n.kind==="timeline"&&n.payload.drawsTimeLabels!==!1&&n.payload.timeLabelCount>0&&qi(e,o.id),n.kind==="image"&&n.payload.timestamp===!0&&Yl(e,o.id,P[r??"rectangular"]),o.frame=a,!(r===void 0||d===void 0))for(let s of e.elements)i.has(s.payload.id)||(e.perFamily[r].placements[s.payload.id]={frame:{...s.payload.frame},isHidden:d.isHidden},s.payload.isHidden=!0)}for(let n of e.elements.filter(o=>o.kind==="imageTime"))Zl(e,n.payload.id);Xl(e)}function rd(e,t){{if(t.highlight!==void 0&&t.highlight!=="none"){let i=fn(t),r=[];(t.highlight==="highest"||t.highlight==="both")&&r.push(["highest",i.high]),(t.highlight==="lowest"||t.highlight==="both")&&r.push(["lowest",i.low]);for(let[a,d]of r){let s=Vl(e,t.id,a),h=e.elements.find(u=>u.payload.id===s);h?.kind==="icon"&&d!=="none"&&(h.payload.symbol=A(d==="triangle"?"arrowtriangle.up.fill":"circle.fill"))}ys(t,{high:"none",low:"none"}),t.highlight="none"}t.thresholdValue!==void 0&&t.drawsThreshold!==!1&&St(e,t.id,"threshold"),t.nowIndex!==void 0&&t.drawsNowLine!==!1&&St(e,t.id,"now"),t.drawsTimeLabels!==!1&&_s(t)&&t.timeLabelCount>0&&qi(e,t.id);let n=dn(t.pointDots);if(n!=="none"){let i=td(e,t.id),r=e.elements.find(a=>a.payload.id===i);if(r?.kind==="chartDots"){r.payload.dots=n;let a=et(t.pointDotSize);a!==void 0&&(r.payload.size=a),typeof t.pointDotColorHex=="string"&&(r.payload.colorHex=t.pointDotColorHex)}}let o=cn(t.gridLines);if(o>0){let i=nd(e,t.id),r=e.elements.find(a=>a.payload.id===i);r?.kind==="chartGrid"&&(r.payload.lines=o,r.payload.colorHex=Fe(t.gridColorHex))}if(t.zeroLine===!0){let i=id(e,t.id),r=e.elements.find(a=>a.payload.id===i);r?.kind==="shape"&&(r.payload.colorSlot={baseColorHex:Fe(t.gridColorHex)})}delete t.pointDots,delete t.pointDotSize,delete t.pointDotColorHex,delete t.gridLines,delete t.gridColorHex,delete t.zeroLine}}function ad(e,t,n){let o=P.rectangular,i=Math.max(Ds,Math.min(Os,t)),r=Math.min(1,i*1.2/o.height),a=Math.min(1,Math.max(0,e.width)),d=n?e.y-r:e.y+e.height;return{x:Math.max(0,Math.min(1-a,e.x)),y:Math.max(0,Math.min(1-r,d)),width:a,height:r,rotationDegrees:0}}function sd(e,t){for(let n of t){if(!g(n)||n.kind!=="chart"||!g(n.payload))continue;let o=n.payload,i=w(o.id).toUpperCase(),r=e.elements.find(c=>c.payload.id===i);if(!r||r.kind!=="chart")continue;let a=w(o.scaleLabelColorHex,"#FFFFFF99"),d=c=>{let p=g(c)?c:{};return{fontSize:v(p.fontSize,8),colorHex:w(p.colorHex,a),pillColorHex:typeof p.pillColorHex=="string"?p.pillColorHex:void 0}},s=[],h=T(o.scaleLabels);(h==="top"||h==="range")&&s.push(["top",d(o.topLabelStyle)]),h==="range"&&s.push(["bottom",d(o.bottomLabelStyle)]);let u=T(o.latestLabel);if((u==="corner"||u==="end")&&s.push(["latest",d(o.latestLabelStyle)]),s.length===0)continue;let l=e.elements.findIndex(c=>c.payload.id===i)+1;for(let[c,p]of s){let f=Gi(r.payload.frame,Wi[c],p.fontSize,c==="latest"?5:4),m=[];if(p.pillColorHex!==void 0){let S=D("shape");S.payload.kind="capsule",S.payload.colorSlot={baseColorHex:p.pillColorHex},S.payload.frame={...f},m.push(S)}let x=D("text");x.payload.value={kind:{kind:"chartStat",layer:i,stat:c}},x.payload.fontSize=p.fontSize,x.payload.fontWeight="medium",x.payload.colorSlot={baseColorHex:p.colorHex},x.payload.frame=f,m.push(x),e.elements.splice(l,0,...m),l+=m.length;for(let S of m)ae(e,r,S.payload.id)}}}function b(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function B(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function ld(e){let t={};return e.decimals!==void 0&&(t.decimals=b(e.decimals)),e.multiply!==void 0&&(t.multiply=b(e.multiply)),e.offset!==void 0&&(t.offset=b(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.duration&&(t.duration=!0),e.timestamp!==void 0&&(t.timestamp=e.timestamp),e.hideMinutes&&(t.hideMinutes=!0),e.hideDayPeriod&&(t.hideDayPeriod=!0),e.showSeconds&&(t.showSeconds=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function er(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(B)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function dd(e){switch(e.kind){case"named":return e.id.trim()==="";case"chartStat":case"listStat":case"imageTime":return e.layer.trim()==="";default:return!1}}function cd(e){if(dd(e))return{kind:"literal",value:""};switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...B(e)};case"entityAttribute":return{kind:"entityAttribute",...B(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...B(e)};case"aggregate":return{kind:"aggregate",aggregate:er(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat};case"item":return{kind:"item",field:e.field};case"listStat":return{kind:"listStat",layer:e.layer,stat:e.stat};case"imageTime":return{kind:"imageTime",layer:e.layer}}}function E(e){let t={kind:cd(e.kind)};return Ie(e.format)||(t.format=ld(e.format)),t}function K(e){return{x:b(e.x),y:b(e.y),width:b(e.width),height:b(e.height),rotationDegrees:b(e.rotationDegrees)}}function ud(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=E(e.value??A(""));break;case"between":case"timeBetween":t.value=E(e.value??A("")),t.upper=E(e.upper??A(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function jo(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=E(e.value??A("")),e.kind==="setIcon"&&e.path&&(t.path=e.path);break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=b(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;case"setFontDesign":t.design=e.design??"default";break;case"setFontWidth":t.width=e.width??"standard";break;case"setItalic":t.italic=e.italic!==!1;break;default:break}return t}function q(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(o=>({id:o.id,when:{join:o.when.join,tests:o.when.tests.map(i=>({id:i.id,value:E(i.value),comparison:ud(i.comparison)}))},then:o.then.map(jo)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(jo)),t.partId!==void 0&&(n.partId=t.partId),n})}function pd(e){let t={id:e.id,value:E(e.value)};return e.icon!==void 0&&(t.icon=E(e.icon)),e.colorHex!==void 0&&(t.colorHex=e.colorHex),e.fontWeight!==void 0&&(t.fontWeight=e.fontWeight),e.fontSize!==void 0&&(t.fontSize=b(e.fontSize)),e.fontDesign!==void 0&&(t.fontDesign=e.fontDesign),e.fontWidth!==void 0&&(t.fontWidth=e.fontWidth),e.italic!==void 0&&(t.italic=e.italic),e.coloring!==void 0&&e.coloring!=="uniform"&&(t.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(t.bands=e.bands.map(nt)),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==G&&(t.bandAboveColorHex=e.bandAboveColorHex),t}function hd(e){let t=tr(e);return e.payload.page!==void 0&&(t.payload.page=e.payload.page),t}function tr(e){let t=fd(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),e.payload.name!==void 0&&(t.payload.name=e.payload.name),e.payload.accentGroup==="accent"&&(t.payload.accentGroup="accent"),t}function fd(e){let t=n=>{let o={id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden};return n.opacity!==void 0&&n.opacity!==1&&(o.opacity=b(n.opacity)),n.shadow!==void 0&&(o.shadow={colorHex:n.shadow.colorHex,radius:b(n.shadow.radius),dx:b(n.shadow.dx),dy:b(n.shadow.dy)}),o};switch(e.kind){case"text":{let n={...t(e.payload),value:E(e.payload.value),fontSize:b(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(n.countdown=!0),e.payload.monospacedDigits===!0&&(n.monospacedDigits=!0),e.payload.lineLimit!==void 0&&e.payload.lineLimit>1&&(n.lineLimit=e.payload.lineLimit),e.payload.fontDesign!==void 0&&e.payload.fontDesign!=="default"&&(n.fontDesign=e.payload.fontDesign),e.payload.fontWidth!==void 0&&e.payload.fontWidth!=="standard"&&(n.fontWidth=e.payload.fontWidth),e.payload.italic===!0&&(n.italic=!0),e.payload.minimumScale!==void 0&&e.payload.minimumScale!==it&&(n.minimumScale=b(e.payload.minimumScale)),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(n.alignment=e.payload.alignment);let o=e.payload;return o.coloring!==void 0&&o.coloring!=="uniform"&&(n.coloring=o.coloring),o.bands!==void 0&&o.bands.length>0&&(n.bands=o.bands.map(nt)),o.bandAboveColorHex!==void 0&&o.bandAboveColorHex!==G&&(n.bandAboveColorHex=o.bandAboveColorHex),o.highlight!==void 0&&o.highlight!=="none"&&(n.highlight=o.highlight),o.highColorHex!==void 0&&o.highColorHex!==He&&(n.highColorHex=o.highColorHex),o.lowColorHex!==void 0&&o.lowColorHex!==Le&&(n.lowColorHex=o.lowColorHex),o.parts!==void 0&&o.parts.length>0&&(n.parts=o.parts.map(pd),di(o)&&(n.value=E(ui(o.parts)))),o.arc!==void 0&&(n.arc=Qa(o.arc)),vt(o,n),{kind:"text",payload:n}}case"icon":{let n={...t(e.payload),symbol:E(e.payload.symbol)};e.payload.path!==void 0&&e.payload.path!==""&&(n.path=e.payload.path);let o=Hn(e.payload.viewBox);return o!==void 0&&(n.viewBox=o),n.size=b(e.payload.size),Lo(e.payload,n),vt(e.payload,n),{kind:"icon",payload:n}}case"gauge":{let n=e.payload,o={...t(n),value:E(n.value),minValue:b(n.minValue),maxValue:b(n.maxValue),style:n.style,lineWidth:b(n.lineWidth),trackColorHex:n.trackColorHex};return n.coloring!=="uniform"&&(o.coloring=n.coloring),n.bands.length>0&&(o.bands=n.bands.map(nt)),n.bandAboveColorHex!==G&&(o.bandAboveColorHex=n.bandAboveColorHex),n.thresholdValue!==void 0&&(o.thresholdValue=b(n.thresholdValue)),n.thresholdColorHex!==Ln&&(o.thresholdColorHex=n.thresholdColorHex),n.total!==void 0&&(o.total=E(n.total)),n.minSource!==void 0&&(o.minSource=E(n.minSource)),n.maxSource!==void 0&&(o.maxSource=E(n.maxSource)),n.fill!==void 0&&(o.fill=kt(n.fill)),n.ticks!==void 0&&!pi(n.ticks)&&(o.ticks=fs(n.ticks)),n.labels!==void 0&&!hi(n.labels)&&(o.labels=gs(n.labels)),{kind:"gauge",payload:o}}case"chart":{let n=e.payload,o={...t(n),value:E(n.value),historyMinutes:Math.max(0,Math.round(n.historyMinutes)),historyPoints:Math.round(n.historyPoints),style:n.style,limit:Math.max(0,Math.round(n.limit)),takeFromEnd:n.takeFromEnd,scale:n.scale,minValue:b(n.minValue),maxValue:b(n.maxValue),baseline:n.baseline,barGap:b(n.barGap),lineWidth:b(n.lineWidth),highlight:n.highlight,highColorHex:n.highColorHex,lowColorHex:n.lowColorHex,marker:fi(fn(n)),coloring:n.coloring,bands:n.bands.map(nt),bandAboveColorHex:n.bandAboveColorHex,fillBands:n.fillBands};n.source!==Sn&&(o.source=n.source),n.statPeriod!==An&&(o.statPeriod=n.statPeriod),n.statType!==Tn&&(o.statType=n.statType),n.thresholdValue!==void 0&&(o.thresholdValue=b(n.thresholdValue)),n.thresholdColorHex!==Mn&&(o.thresholdColorHex=n.thresholdColorHex),n.nowIndex!==void 0&&(o.nowIndex=E(n.nowIndex)),n.nowColorHex!==In&&(o.nowColorHex=n.nowColorHex),n.drawsThreshold===!1&&(o.drawsThreshold=!1),n.drawsNowLine===!1&&(o.drawsNowLine=!1),n.drawsTimeLabels===!1&&(o.drawsTimeLabels=!1),n.scaleFrom!==void 0&&(o.scaleFrom=n.scaleFrom),n.labelSize!==ee&&(o.labelSize=b(n.labelSize)),n.labelColorHex!==te&&(o.labelColorHex=n.labelColorHex),n.labelsAbove&&(o.labelsAbove=!0),n.timeLabelCount!==xe&&(o.timeLabelCount=Me(n.timeLabelCount)),n.hourCycle!==ye&&(o.hourCycle=n.hourCycle),n.minutes!==be&&(o.minutes=n.minutes);let i=fn(n);mi(i)||(o.highMarker=i.high,o.lowMarker=i.low);let r=n.curve??"straight";r!=="straight"&&(o.curve=r);let a=ln(n.fillStyle);a!=="flat"&&(o.fillStyle=a),n.fillColorHex!==void 0&&(o.fillColorHex=n.fillColorHex),n.areaFill!==void 0&&(o.areaFill=kt(n.areaFill));let d=un(n.barRadius);d!==Cn&&(o.barRadius=b(d));let s=pn(n.barCorners);s!=="all"&&(o.barCorners=s);let h=hn(n.smoothing);return h!==void 0&&(o.smoothing=h),n.gaps===!0&&(o.gaps=!0),n.barBorderWidth!==void 0&&n.barBorderWidth!==0&&(o.barBorderWidth=b(n.barBorderWidth)),n.barBorderColorHex!==void 0&&(o.barBorderColorHex=n.barBorderColorHex),n.bandAboveFillColorHex!==void 0&&(o.bandAboveFillColorHex=n.bandAboveFillColorHex),n.bandAboveBorderColorHex!==void 0&&(o.bandAboveBorderColorHex=n.bandAboveBorderColorHex),n.barBorderOpenBase===!0&&(o.barBorderOpenBase=!0),{kind:"chart",payload:o}}case"timeline":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden,value:E(n.value)},i=Nt(n);return n.aggregate!==void 0&&i.length>0&&(o.aggregate={entities:i,...n.aggregate.combine!==$t?{combine:n.aggregate.combine}:{}}),n.historyMinutes!==Dn&&(o.historyMinutes=Math.max(1,Math.round(n.historyMinutes))),n.bands.length>0&&(o.bands=n.bands.map(r=>({id:r.id,match:r.match,colorHex:r.colorHex}))),n.otherColorHex!==Pt&&(o.otherColorHex=n.otherColorHex),n.gap!==0&&(o.gap=b(n.gap)),n.cornerRadius!==xi&&(o.cornerRadius=b(n.cornerRadius)),n.labelSize!==ee&&(o.labelSize=b(n.labelSize)),n.labelColorHex!==te&&(o.labelColorHex=n.labelColorHex),n.labelsAbove&&(o.labelsAbove=!0),n.timeLabelCount!==xe&&(o.timeLabelCount=Math.max(0,Math.min(bi,Math.round(n.timeLabelCount)))),n.hourCycle!==ye&&(o.hourCycle=n.hourCycle),n.minutes!==be&&(o.minutes=n.minutes),n.drawsTimeLabels===!1&&(o.drawsTimeLabels=!1),{kind:"timeline",payload:o}}case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:b(e.payload.cornerRadius),borderWidth:b(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(n.thickness=b(e.payload.thickness)),e.payload.fill!==void 0&&(n.fill=kt(e.payload.fill)),Lo(e.payload,n),vt(e.payload,n),{kind:"shape",payload:n}}case"image":{let n=e.payload,o={id:n.id};(n.source!=="inline"||n.entity.entityId!=="")&&(o.entity=B(n.entity)),o.rules=q(n.rules),o.frame=K(n.frame),o.isHidden=n.isHidden,n.source!=="camera"&&(o.source=n.source),n.data!==void 0&&n.data!==""&&(o.data=n.data),n.format==="jpeg"&&(o.format="jpeg"),n.timestamp===!0&&(o.timestamp=!0),n.contentMode!=="fill"&&(o.contentMode=n.contentMode),n.zoom!==1&&(o.zoom=b(n.zoom)),n.panX!==0&&(o.panX=b(n.panX)),n.panY!==0&&(o.panY=b(n.panY)),n.cornerRadius!==Ci&&(o.cornerRadius=b(n.cornerRadius));let i=Si(n),r=i?Xs(n.timestampX,n.timestampY):n.timestampCorner;return r!=="topLeading"&&(o.timestampCorner=r),n.timestampSize!==zt&&(o.timestampSize=b(n.timestampSize)),i&&(o.timestampX=b(n.timestampX),o.timestampY=b(n.timestampY)),vt(n,o),{kind:"image",payload:o}}case"tap":{let n=e.payload,o={id:n.id,action:Jn(n.action)};return n.openPageId!==void 0&&(o.openPageId=n.openPageId),n.openPageName!==void 0&&(o.openPageName=n.openPageName),n.attachedTo!==void 0&&(o.attachedTo=n.attachedTo),o.rules=q(n.rules),o.frame=K(n.frame),o.isHidden=n.isHidden,n.opacity!==void 0&&n.opacity!==1&&(o.opacity=b(n.opacity)),n.shadow!==void 0&&(o.shadow={colorHex:n.shadow.colorHex,radius:b(n.shadow.radius),dx:b(n.shadow.dx),dy:b(n.shadow.dy)}),{kind:"tap",payload:o}}case"chartTimes":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden,chart:n.chart};return n.labelSize!==ee&&(o.labelSize=b(n.labelSize)),n.labelColorHex!==te&&(o.labelColorHex=n.labelColorHex),n.timeLabelCount!==xe&&(o.timeLabelCount=Me(n.timeLabelCount)),n.hourCycle!==ye&&(o.hourCycle=n.hourCycle),n.minutes!==be&&(o.minutes=n.minutes),n.fontWeight!==void 0&&n.fontWeight!=="regular"&&(o.fontWeight=n.fontWeight),n.fontDesign!==void 0&&n.fontDesign!=="rounded"&&(o.fontDesign=n.fontDesign),n.fontWidth!==void 0&&n.fontWidth!=="standard"&&(o.fontWidth=n.fontWidth),n.italic===!0&&(o.italic=!0),n.monospacedDigits===!0&&(o.monospacedDigits=!0),{kind:"chartTimes",payload:o}}case"imageTime":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden};return n.image!==""&&(o.image=n.image),{kind:"imageTime",payload:o}}case"chartDots":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden,chart:n.chart};ii(n.dots)!=="auto"&&(o.dots="all");let i=et(n.size);return i!==void 0&&(o.size=b(i)),n.colorHex!==void 0&&(o.colorHex=n.colorHex),{kind:"chartDots",payload:o}}case"chartGrid":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden,chart:n.chart},i=ri(n.lines);i!==kn&&(o.lines=i);let r=Fe(n.colorHex);$e(r,Ht)||(o.colorHex=r);let a=ai(n.thickness);return a!==vn&&(o.thickness=b(a)),{kind:"chartGrid",payload:o}}case"list":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden};n.opacity!==void 0&&n.opacity!==1&&(o.opacity=b(n.opacity)),n.shadow!==void 0&&(o.shadow={colorHex:n.shadow.colorHex,radius:b(n.shadow.radius),dx:b(n.shadow.dx),dy:b(n.shadow.dy)}),o.source=md(n.source);let i=Pe(n.rows);i!==On&&(o.rows=i),n.direction==="across"&&(o.direction="across");let r=Un(n.columns);r!==Vn&&(o.columns=r);let a=Fi(n.gap);return a!==Bn&&(o.gap=b(a)),n.template.length>0&&(o.template=n.template.map(tr)),{kind:"list",payload:o}}}}function md(e){switch(e.kind){case"entities":{let t={kind:"entities",scope:er({function:"count",scope:e.scope}).scope},n=(e.deviceClass??"").trim();return n!==""&&(t.deviceClass=n),e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.sort!=="name"&&(t.sort=e.sort),e.descending&&(t.descending=!0),e.attributes.length>0&&(t.attributes=[...e.attributes]),t}case"attribute":return{kind:"attribute",...B(e),attribute:e.attribute};case"template":return{kind:"template",value:e.value};case"calendar":{let t={kind:"calendar",entities:e.entities.map(B)},n=Ne(e.hours);return n!==Ei&&(t.hours=n),t}case"todo":{let t={kind:"todo",entities:e.entities.map(B)};return e.status!=="open"&&(t.status=e.status),e.sort!=="list"&&(t.sort=e.sort),t}case"forecast":{let t={kind:"forecast",...B(e)};return e.type!=="hourly"&&(t.type=e.type),t}}}function gd(e){let t={},n=Object.keys(e.placements);if(n.length>0){let o={};for(let i of n){let r=e.placements[i],a={frame:K(r.frame)};r.isHidden&&(a.isHidden=!0),r.size!==void 0&&(a.size=b(r.size)),o[i]=a}t.placements=o}if(e.bezelText&&(t.bezelText=E(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=E(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.parkedCurvedText&&(t.parkedCurvedText=E(e.parkedCurvedText)),e.parkedCurvedColorHex!==void 0&&(t.parkedCurvedColorHex=e.parkedCurvedColorHex),e.bezelGauge){let o=e.bezelGauge,i={value:E(o.value),minValue:b(o.minValue),maxValue:b(o.maxValue),colorHexes:o.colorHexes};o.minLabel&&(i.minLabel=E(o.minLabel)),o.maxLabel&&(i.maxLabel=E(o.maxLabel)),t.bezelGauge=i}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),e.backgroundFill!==void 0&&(t.backgroundFill=kt(e.backgroundFill)),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=b(e.borderWidth),e.rules.length>0&&(t.rules=q(e.rules)),t}function Jn(e){if(e.type==="callService"){let t={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(t.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(t,B(e.target)),t}if(e.type==="refreshAll"){let t={type:e.type};if(e.allPlaced===!0)return t.allPlaced=!0,t;e.targets!==void 0&&e.targets.length>0&&(t.targets=[...e.targets]);let n=Object.entries(e.targetLayers??{});if(n.length>0){let o={};for(let[i,r]of n)o[i]=[...r];t.targetLayers=o}return t}if(e.type==="refresh"){let t={type:e.type};return e.layerIds!==void 0&&(t.layerIds=[...e.layerIds]),t}return e.type==="showPage"?{type:e.type,page:e.page}:"entityId"in e?{type:e.type,...B(e)}:{type:e.type}}function xd(e){if(e.kind==="template")return{kind:"template",value:e.value};if(e.kind==="entity")return{kind:"entity",...B(e)};let t={kind:"list",source:e.source};return e.entities!==void 0&&(t.entities=[...e.entities]),e.entity_id!==void 0&&(t.entity_id=e.entity_id),e.hours!==void 0&&(t.hours=e.hours),e.status!==void 0&&(t.status=e.status),e.sort!==void 0&&(t.sort=e.sort),e.type!==void 0&&(t.type=e.type),t.limit=e.limit,t}function yd(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=E(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),e.parts!==void 0&&e.parts.length>0&&(t.parts=e.parts.map(n=>{let o={id:n.id,value:E(n.value)};return n.symbol!==void 0&&(o.symbol=n.symbol),o})),t}function bd(e){let t={kind:e.kind,title:E(e.title)};return e.valueLabel!==void 0&&(t.valueLabel=E(e.valueLabel)),e.state!==void 0&&(t.state=E(e.state)),t.symbol=e.symbol,e.symbolOff!==void 0&&(t.symbolOff=e.symbolOff),e.tintColorHex!==void 0&&(t.tintColorHex=e.tintColorHex),e.coloring!=="uniform"&&(t.coloring=e.coloring),e.bands.length>0&&(t.bands=e.bands.map(nt)),e.bandAboveColorHex!==void 0&&(t.bandAboveColorHex=e.bandAboveColorHex),e.status!==void 0&&(t.status=E(e.status)),t.action=Jn(e.action),t}function hh(e){let t=[];for(let r of L){let a=e.perFamily[r];a&&t.push(r,gd(a))}let n={schemaVersion:wn(e),id:e.id,name:e.name,values:e.values.map(r=>({id:r.id,name:r.name,value:E(r.value)})),slotIndex:e.slotIndex,elements:e.elements.map(hd),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(xd),tapAction:Jn(e.tapAction)};e.inline!==void 0&&(n.inline=yd(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.httpShowResult===!0&&(n.httpShowResult=!0),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(r=>({id:r.id,name:r.name,locked:r.locked,...r.parentId!==void 0?{parentId:r.parentId}:{}})));let o=on(e.notes);o!==void 0&&(n.notes=o),e.hidden===!0&&(n.hidden=!0),e.linkId!==void 0&&(n.linkId=e.linkId);let i=wl(e.pages===void 0?void 0:{...e.pages,mode:Wn(e)});return i!==void 0&&(n.pages=i),e.control!==void 0&&(n.control=bd(e.control)),n}function fh(e){return e.tapAction.type==="runHTTPAction"||e.elements.some(t=>t.kind==="tap"&&t.payload.action.type==="runHTTPAction")}function mh(e){return g(e)&&e.hidden===!0}function gh(e,t){let n={...e};return t?n.hidden=!0:delete n.hidden,n}function $(e,t){return t===void 0?void 0:e.groups?.find(n=>n.id===t)}function Xn(e,t){let n=e.elements.find(o=>o.payload.id===t);return $(e,n?.payload.groupId)}function U(e,t){let n=[],o=new Set,i=$(e,t);for(;i&&!o.has(i.id);)n.push(i),o.add(i.id),i=$(e,i.parentId);return n}function xh(e,t){return U(e,t).slice(1)}function Yn(e,t){let n=new Set([t]),o=!0;for(;o;){o=!1;for(let i of e.groups??[])i.parentId!==void 0&&n.has(i.parentId)&&!n.has(i.id)&&(n.add(i.id),o=!0)}return n}function wd(e,t){return(e.groups??[]).filter(n=>n.parentId===t)}function yh(e,t,n){return U(e,t.payload.groupId).some(o=>o.id===n)}function nr(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!R(e,n))}function ne(e,t){let n=Yn(e,t);return e.elements.filter(o=>o.payload.groupId!==void 0&&n.has(o.payload.groupId)&&!R(e,o))}function Zn(e,t){let n=U(e,t);for(let o=n.length-1;o>=0;o--)if(n[o].locked)return n[o]}function bh(e,t){return Zn(e,Xn(e,t)?.id)}function wh(e,t){return Zn(e,t)??$(e,t)}function vh(e,t){let n=new Set;for(let o of t){let i=Xn(e,o),r=i===void 0?void 0:Zn(e,i.id);if(r)for(let a of ne(e,r.id))n.add(a.payload.id);else n.add(o)}return e.elements.filter(o=>n.has(o.payload.id)&&o.kind!=="chartDots"&&o.kind!=="chartGrid"&&o.payload.chartAnchor===void 0).map(o=>o.payload.id)}function or(e){let t=e.groups??[],n=new Map(t.map(o=>[o.id,o]));for(let o of t){if(o.parentId===void 0)continue;if(o.parentId===o.id||!n.has(o.parentId)){delete o.parentId;continue}let i=new Set,r=n.get(o.parentId);for(;r!==void 0;){if(r.id===o.id){delete o.parentId;break}if(i.has(r.id))break;i.add(r.id),r=r.parentId===void 0?void 0:n.get(r.parentId)}}}function W(e){let t=new Set((e.groups??[]).map(i=>i.id));for(let i of e.elements)i.payload.groupId!==void 0&&!t.has(i.payload.groupId)&&delete i.payload.groupId;or(e);let n=new Set;for(let i of e.elements)for(let r of U(e,i.payload.groupId))n.add(r.id);let o=(e.groups??[]).filter(i=>n.has(i.id));o.length===0?delete e.groups:e.groups=o}function se(e){if(!e.groups?.length)return;or(e);let t=e.elements.filter(u=>!R(e,u)),n=e.elements.filter(u=>R(e,u)),o=new Map;t.forEach((u,l)=>{for(let c of U(e,u.payload.groupId))o.set(c.id,Math.max(o.get(c.id)??-1,l))});let i=new Map,r=(u,l)=>{let c=i.get(u);c?c.push(l):i.set(u,[l])};t.forEach((u,l)=>r($(e,u.payload.groupId)?.id,{at:l,el:u}));for(let u of e.groups){let l=o.get(u.id);l!==void 0&&r($(e,u.parentId)?.id,{at:l,group:u})}let a=[],d=new Set,s=new Set,h=u=>{let l=(i.get(u)??[]).sort((c,p)=>c.at-p.at);for(let c of l)"el"in c?(a.push(c.el),d.add(c.el)):s.has(c.group.id)||(s.add(c.group.id),h(c.group.id))};h(void 0);for(let u of t)d.has(u)||a.push(u);e.elements=[...a,...n],Oe(e)}function vd(e){let t=new Set((e.groups??[]).map(o=>o.name.trim())),n=1;for(;t.has(`Group ${n}`);)n++;return`Group ${n}`}function ir(e,t,n=vd(e)){let o=e.elements.filter(u=>t.includes(u.payload.id)&&!R(e,u));if(o.length<2)return;let i=o.map(u=>U(e,u.payload.groupId)),r=i[0].find(u=>i.every(l=>l.includes(u))),a=new Set(o.map(u=>u.payload.id)),d=new Set,s=[];o.forEach((u,l)=>{let c=i[l],p=r===void 0?c:c.slice(0,c.indexOf(r)),f;for(let m=p.length-1;m>=0;m--)if(ne(e,p[m].id).every(x=>a.has(x.payload.id))){f=p[m];break}f?d.add(f):s.push(u)});let h={id:M(),name:n,locked:!0,...r!==void 0?{parentId:r.id}:{}};e.groups=[...e.groups??[],h];for(let u of d)u.parentId=h.id;for(let u of s)u.payload.groupId=h.id;return W(e),se(e),h.id}function kd(e,t){let o=$(e,t)?.parentId;for(let i of e.elements)i.payload.groupId===t&&(o===void 0?delete i.payload.groupId:i.payload.groupId=o);for(let i of e.groups??[])i.parentId===t&&(o===void 0?delete i.parentId:i.parentId=o);e.groups&&(e.groups=e.groups.filter(i=>i.id!==t)),W(e)}function Cd(e,t,n){let o=e.elements.find(i=>i.payload.id===t);!o||R(e,o)||(n===void 0?delete o.payload.groupId:o.payload.groupId=n,W(e),se(e))}function kh(e,t,n){let o=$(e,t);return!o||n!==void 0&&(!$(e,n)||Yn(e,t).has(n))?!1:(n===void 0?delete o.parentId:o.parentId=n,W(e),se(e),!0)}function Ko(e,t){return $(e,t)?new Set(ne(e,t).map(n=>n.payload.id)):new Set([t])}function Tt(e,t,n,o){let i=e.filter(d=>t.has(d.payload.id)),r=e.filter(d=>!t.has(d.payload.id)),a=r.map((d,s)=>n.has(d.payload.id)?s:-1).filter(d=>d>=0);return i.length===0||a.length===0?e:(r.splice(o?a[a.length-1]+1:a[0],0,...i),r)}function Ch(e,t,n,o,i){if(t===n)return!1;let r=$(e,t);if(i!==void 0&&!$(e,i))return!1;if(r){let u=Yn(e,t);if(i!==void 0&&u.has(i)||$(e,n)&&u.has(n))return!1}let a=Ko(e,t),d=Ko(e,n);for(let u of a)d.delete(u);let s=e.elements.filter(u=>!R(e,u)),h=e.elements.filter(u=>R(e,u));if(!s.some(u=>a.has(u.payload.id))||!s.some(u=>d.has(u.payload.id)))return!1;if(e.elements=[...Tt(s,a,d,o),...h],r)i===void 0?delete r.parentId:r.parentId=i;else{let u=e.elements.find(l=>l.payload.id===t);i===void 0?delete u.payload.groupId:u.payload.groupId=i}return W(e),se(e),!0}function Sh(e,t,n,o=()=>!0){let i=e.elements.filter(p=>!R(e,p)),r=e.elements.filter(p=>R(e,p)),a=i.findIndex(p=>p.payload.id===t);if(a<0)return;let d=a+n;for(;d>=0&&d<i.length&&!o(i[d]);)d+=n;if(d<0||d>=i.length)return;let s=i[a],h=i[d],u=$(e,s.payload.groupId),l=U(e,h.payload.groupId),c=i;if(u!==void 0&&!l.includes(u)){let p=new Set(ne(e,u.id).map(f=>f.payload.id));p.delete(t),p.size>0&&(c=Tt(i,new Set([t]),p,n===1)),u.parentId===void 0?delete s.payload.groupId:s.payload.groupId=u.parentId}else if(l[0]!==u){let p=u===void 0?l.length:l.indexOf(u);s.payload.groupId=l[p-1].id}else c=[...i],c.splice(a,1),c.splice(d,0,s);e.elements=[...c,...r],W(e),se(e)}function Ah(e,t,n,o=()=>!0){let i=$(e,t);if(!i)return;let r=e.elements.filter(f=>!R(e,f)),a=e.elements.filter(f=>R(e,f)),d=new Set(ne(e,t).map(f=>f.payload.id)),s=r.map((f,m)=>d.has(f.payload.id)?m:-1).filter(f=>f>=0);if(s.length===0)return;let h=n===1?s[s.length-1]+1:s[0]-1;for(;h>=0&&h<r.length&&!o(r[h]);)h+=n;if(h<0||h>=r.length)return;let u=r[h],l=$(e,i.parentId),c=U(e,u.payload.groupId),p;if(l!==void 0&&!c.includes(l)){let f=new Set(ne(e,l.id).map(m=>m.payload.id));for(let m of d)f.delete(m);p=Tt(r,d,f,n===1),l.parentId===void 0?delete i.parentId:i.parentId=l.parentId}else{let f=l===void 0?c.length:c.indexOf(l),m=f>0?c[f-1]:void 0,x=m?new Set(ne(e,m.id).map(S=>S.payload.id)):new Set([u.payload.id]);p=Tt(r,d,x,n===1)}e.elements=[...p,...a],W(e),se(e)}var k={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","httpShowResult","groups","notes","hidden","linkId","control","pages"],group:["id","name","locked","parentId"],pages:["count","mode","dwell"],inline:["label","value","symbol","countdown","parts"],inlinePart:["id","value","symbol"],control:["kind","title","valueLabel","state","symbol","symbolOff","tintColorHex","coloring","bands","bandAboveColorHex","status","action"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","timestamp","hideMinutes","hideDayPeriod","showSeconds","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],chartAnchor:["layer","at","place","dx","dy"],fill:["kind","stops","angle"],fillStop:["at","colorHex"],level:["value","minValue","maxValue","minSource","maxSource","direction","trackColorHex"],gaugeTicks:["count","length","colorHex","majorEvery"],gaugeLabels:["show","size","colorHex"],arc:["radius","angle","sweep","spacing","flip"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","opacity","shadow","groupId","name","accentGroup"],elementPage:["page"],shadow:["colorHex","radius","dx","dy"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","fontDesign","fontWidth","italic","minimumScale","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts","arc","chartAnchor"],textPart:["id","value","icon","colorHex","fontWeight","fontSize","fontDesign","fontWidth","italic","coloring","bands","bandAboveColorHex"],icon:["symbol","path","viewBox","size","level","chartAnchor"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource","fill","ticks","labels"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","curve","fillStyle","fillColorHex","areaFill","barRadius","barCorners","smoothing","gaps","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","pointDots","pointDotSize","pointDotColorHex","gridLines","gridColorHex","zeroLine","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","aggregate","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes","drawsTimeLabels"],timelineAggregate:["entities","combine"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth","fill","level","chartAnchor"],image:["entity","source","data","format","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY","chartAnchor"],tap:["action","openPageId","openPageName","attachedTo","grow"],chartTimes:["chart","timeLabelCount","labelSize","labelColorHex","hourCycle","minutes","fontWeight","fontDesign","fontWidth","italic","monospacedDigits"],chartDots:["chart","dots","size","colorHex"],chartGrid:["chart","lines","colorHex","thickness"],imageTime:["image","size"],list:["source","rows","direction","columns","gap","template"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight","design","width","italic","path"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","parkedCurvedText","parkedCurvedColorHex","bezelGauge","backgroundColorHex","backgroundFill","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON","targets","allPlaced","layerIds","targetLayers","page"]},qo={literal:["kind","value"],entityState:["kind",...k.entityRef],entityAttribute:["kind",...k.entityRef,"attribute"],entityAge:["kind",...k.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"],item:["kind","field"],listStat:["kind","layer","stat"],imageTime:["kind","layer"]},Sd={entities:["kind","scope","deviceClass","stateFilter","sort","descending","attributes"],attribute:["kind",...k.entityRef,"attribute"],template:["kind","value"],calendar:["kind","entities","hours"],todo:["kind","entities","status","sort"],forecast:["kind",...k.entityRef,"type"]};function Th(e){let t=[],n=(l,c,p)=>{if(g(l))for(let f of Object.keys(l))c.includes(f)||t.push(`${p}.${f}`)},o=(l,c)=>{if(!g(l))return;let p=typeof l.kind=="string"?l.kind:"";n(l,qo[p]??["kind"],c),p==="aggregate"&&g(l.aggregate)&&(n(l.aggregate,k.aggregate,`${c}.aggregate`),n(l.aggregate.scope,k.scope,`${c}.aggregate.scope`),g(l.aggregate.scope)&&Array.isArray(l.aggregate.scope.entities)&&l.aggregate.scope.entities.forEach((f,m)=>n(f,k.entityRef,`${c}.aggregate.scope.entities[${m}]`)),n(l.aggregate.stateFilter,k.stateFilter,`${c}.aggregate.stateFilter`))},i=(l,c)=>{if(g(l)){if(g(l.kind))n(l,k.value,c),o(l.kind,`${c}.kind`);else{let p=typeof l.kind=="string"?l.kind:"";n(l,[...qo[p]??["kind"],"format"],c),p==="aggregate"&&o(l,c)}n(l.format,k.format,`${c}.format`)}},r=(l,c)=>{g(l)&&(n(l,k.fill,c),Array.isArray(l.stops)&&l.stops.forEach((p,f)=>n(p,k.fillStop,`${c}.stops[${f}]`)))},a=(l,c)=>{Array.isArray(l)&&l.forEach((p,f)=>{n(p,k.styleChange,`${c}[${f}]`),g(p)&&i(p.value,`${c}[${f}].value`)})},d=(l,c)=>{Array.isArray(l)&&l.forEach((p,f)=>{let m=`${c}[${f}]`;n(p,k.rule,m),g(p)&&(Array.isArray(p.cases)&&p.cases.forEach((x,S)=>{let H=`${m}.cases[${S}]`;n(x,k.case,H),g(x)&&(n(x.when,k.condition,`${H}.when`),g(x.when)&&Array.isArray(x.when.tests)&&x.when.tests.forEach((N,qr)=>{let Ve=`${H}.when.tests[${qr}]`;n(N,k.test,Ve),g(N)&&(i(N.value,`${Ve}.value`),n(N.comparison,k.comparison,`${Ve}.comparison`),g(N.comparison)&&(i(N.comparison.value,`${Ve}.comparison.value`),i(N.comparison.upper,`${Ve}.comparison.upper`)))}),a(x.then,`${H}.then`))}),a(p.otherwise,`${m}.otherwise`))})};if(!g(e))return t;n(e,k.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((l,c)=>n(l,k.group,`$.groups[${c}]`)),Array.isArray(e.values)&&e.values.forEach((l,c)=>{n(l,k.named,`$.values[${c}]`),g(l)&&i(l.value,`$.values[${c}].value`)});let s=(l,c)=>{if(!g(l))return;let p=typeof l.kind=="string"?l.kind:"";n(l,Sd[p]??["kind"],c),p==="entities"&&(n(l.scope,k.scope,`${c}.scope`),g(l.scope)&&Array.isArray(l.scope.entities)&&l.scope.entities.forEach((f,m)=>n(f,k.entityRef,`${c}.scope.entities[${m}]`)),n(l.stateFilter,k.stateFilter,`${c}.stateFilter`)),(p==="calendar"||p==="todo")&&Array.isArray(l.entities)&&l.entities.forEach((f,m)=>n(f,k.entityRef,`${c}.entities[${m}]`))},h=(l,c,p=!0)=>{if(n(l,k.elementEnvelope,c),!g(l)||!g(l.payload))return;let f=typeof l.kind=="string"?l.kind:"",m=k[f]??[];n(l.payload,[...k.elementBase,...p?k.elementPage:[],...m],`${c}.payload`),n(l.payload.colorSlot,k.colorSlot,`${c}.payload.colorSlot`),n(l.payload.frame,k.frame,`${c}.payload.frame`),"chartAnchor"in l.payload&&n(l.payload.chartAnchor,k.chartAnchor,`${c}.payload.chartAnchor`),"shadow"in l.payload&&n(l.payload.shadow,k.shadow,`${c}.payload.shadow`);for(let x of["fill","areaFill"])x in l.payload&&r(l.payload[x],`${c}.payload.${x}`);if("ticks"in l.payload&&n(l.payload.ticks,k.gaugeTicks,`${c}.payload.ticks`),"labels"in l.payload&&n(l.payload.labels,k.gaugeLabels,`${c}.payload.labels`),g(l.payload.level)){let x=`${c}.payload.level`;n(l.payload.level,k.level,x);for(let S of["value","minSource","maxSource"])S in l.payload.level&&i(l.payload.level[S],`${x}.${S}`)}d(l.payload.rules,`${c}.payload.rules`);for(let x of["value","symbol","nowIndex","total","minSource","maxSource"])x in l.payload&&i(l.payload[x],`${c}.payload.${x}`);if(f==="text"&&"arc"in l.payload&&n(l.payload.arc,k.arc,`${c}.payload.arc`),f==="timeline"&&"aggregate"in l.payload&&n(l.payload.aggregate,k.timelineAggregate,`${c}.payload.aggregate`),f==="text"&&Array.isArray(l.payload.parts)&&l.payload.parts.forEach((x,S)=>{n(x,k.textPart,`${c}.payload.parts[${S}]`),g(x)&&i(x.value,`${c}.payload.parts[${S}].value`),g(x)&&"icon"in x&&i(x.icon,`${c}.payload.parts[${S}].icon`)}),f==="image"&&n(l.payload.entity,k.entityRef,`${c}.payload.entity`),f==="tap"&&n(l.payload.action,k.tapAction,`${c}.payload.action`),f==="list"){s(l.payload.source,`${c}.payload.source`);let x=Array.isArray(l.payload.template)?l.payload.template:[];x.length>sl&&t.push(`${c}.payload.template.length`),x.forEach((S,H)=>{let N=`${c}.payload.template[${H}]`;g(S)&&_i.includes(String(S.kind))?t.push(`${N}.kind`):h(S,N,!1)})}};Array.isArray(e.elements)&&e.elements.forEach((l,c)=>h(l,`$.elements[${c}]`));let u=[];if(Array.isArray(e.perFamily))for(let l=0;l+1<e.perFamily.length;l+=2)u.push([String(e.perFamily[l]),e.perFamily[l+1]]);else g(e.perFamily)&&u.push(...Object.entries(e.perFamily));for(let[l,c]of u){let p=`$.perFamily.${l}`;if(n(c,k.layout,p),!!g(c)){if(g(c.placements))for(let[f,m]of Object.entries(c.placements))n(m,k.placement,`${p}.placements.${f}`),g(m)&&n(m.frame,k.frame,`${p}.placements.${f}.frame`);if(i(c.bezelText,`${p}.bezelText`),i(c.curvedText,`${p}.curvedText`),i(c.parkedCurvedText,`${p}.parkedCurvedText`),"backgroundFill"in c&&r(c.backgroundFill,`${p}.backgroundFill`),g(c.bezelGauge)){let f=`${p}.bezelGauge`;n(c.bezelGauge,k.bezelGauge,f),i(c.bezelGauge.value,`${f}.value`),i(c.bezelGauge.minLabel,`${f}.minLabel`),i(c.bezelGauge.maxLabel,`${f}.maxLabel`)}d(c.rules,`${p}.rules`)}}if(g(e.inline)&&(n(e.inline,k.inline,"$.inline"),i(e.inline.value,"$.inline.value"),Array.isArray(e.inline.parts)&&e.inline.parts.forEach((l,c)=>{n(l,k.inlinePart,`$.inline.parts[${c}]`),g(l)&&i(l.value,`$.inline.parts[${c}].value`)})),g(e.pages)&&n(e.pages,k.pages,"$.pages"),g(e.control)){n(e.control,k.control,"$.control");for(let l of["title","valueLabel","state","status"])l in e.control&&i(e.control[l],`$.control.${l}`);n(e.control.action,k.tapAction,"$.control.action")}return n(e.tapAction,k.tapAction,"$.tapAction"),t}function M(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function Vt(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function rr(){return A("Text")}function Eh(e){return e?.curvedText!==void 0?"curved":"canvas"}function _h(e,t){t==="curved"?(e.curvedText===void 0&&(e.curvedText=e.parkedCurvedText??rr(),e.parkedCurvedColorHex!==void 0&&(e.curvedColorHex=e.parkedCurvedColorHex)),delete e.parkedCurvedText,delete e.parkedCurvedColorHex):e.curvedText!==void 0&&(e.parkedCurvedText=e.curvedText,e.curvedColorHex!==void 0?e.parkedCurvedColorHex=e.curvedColorHex:delete e.parkedCurvedColorHex,delete e.curvedText,delete e.curvedColorHex)}function Fh(e){return e!==void 0&&(e.curvedText!==void 0||e.bezelText!==void 0||e.bezelGauge!==void 0)}function Ad(){return{value:A("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]}}function ar(e,t,n="rectangular"){let o=Td(e,t,n===null?[]:[n]),i=o.perFamily.corner;return i&&(i.curvedText=rr(),i.bezelGauge=Ad(),o.schemaVersion=wn(o)),o}function Td(e,t,n){let o={};for(let r of L)n.includes(r)&&(o[r]=Vt());let i={schemaVersion:4,id:M(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:Ze.filter(r=>n.includes(r)),perFamily:o,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(i.inline={value:A("Text")}),i.schemaVersion=wn(i),i}function Ed(e){let t=xl(e.tapAction.type)?structuredClone(e.tapAction):{type:"toggleEntity",entityId:"",displayName:"",domain:""};return{kind:"toggle",title:A(e.name.trim()||"Control"),symbol:Ii,coloring:"uniform",bands:[],action:t}}function Hh(e){return e.control===void 0}function _d(e){return e.control!==void 0&&e.supportedFamilies.length===0}function Fd(e,t){if(!t){if(_d(e))return;delete e.control;return}e.control===void 0&&(e.control=Ed(e))}function Lh(e,t,n){let o=ar(e,t,n??null);return Fd(o,!0),o}function D(e){let t=n=>({id:M(),colorSlot:{baseColorHex:n},rules:[],frame:{...si},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:A("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:A("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:A("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:G,thresholdColorHex:Ln}};case"chart":return{kind:e,payload:{...t("#FFFFFF"),value:A("13,14,16,17,19,22,24,28,30"),historyMinutes:Cs,historyPoints:24,source:Sn,statPeriod:An,statType:Tn,style:"bars",curve:"smooth",fillStyle:"fade",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:He,lowColorHex:Le,marker:"none",coloring:"uniform",bands:[],bandAboveColorHex:G,fillBands:!1,thresholdColorHex:Mn,nowColorHex:In,timeLabelCount:xe,labelSize:ee,labelColorHex:te,labelsAbove:!1,hourCycle:ye,minutes:be}};case"timeline":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,value:A(""),historyMinutes:zs,bands:[],otherColorHex:Ps,gap:0,cornerRadius:Ns,timeLabelCount:yi,labelSize:ee,labelColorHex:te,labelsAbove:!1,hourCycle:ye,minutes:be}}}case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:Ks,timestampCorner:"topLeading",timestampSize:zt}}}case"tap":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,action:{type:"refresh"}}}}case"chartTimes":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,chart:"",timeLabelCount:xe,labelSize:ee,labelColorHex:te,hourCycle:ye,minutes:be}}}case"imageTime":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,image:""}}}case"chartDots":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,chart:"",dots:"auto"}}}case"chartGrid":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,chart:"",lines:kn,colorHex:Ht,thickness:vn}}}case"list":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,source:{kind:"entities",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},sort:"name",descending:!1,attributes:[]},rows:On,direction:"down",columns:Vn,gap:Bn,template:[]}}}}}function A(e){return{kind:{kind:"literal",value:e}}}function sr(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}var Jo=["circular","corner"],Xo=Math.SQRT1_2;function Hd(e){return e==="text"||e==="icon"?4:.5}function lr(e,t,n,o){let i=structuredClone(e),r=P[t],a=P[n];if(t===n||!r||!a)return i;let d=Jo.includes(t),s=Jo.includes(n),h=d===s?1:s?Xo:1/Xo,u=Math.min(a.width/r.width,a.height/r.height)*h;if(h!==1){let l=i.frame,c=l.x+l.width/2,p=l.y+l.height/2;i.frame={...l,width:l.width*h,height:l.height*h,x:.5+(c-.5)*h-l.width*h/2,y:.5+(p-.5)*h-l.height*h/2}}return i.size!==void 0&&(i.size=Math.max(Hd(o),Math.round(i.size*u*10)/10)),i}function Ld(e,t){if(!t)return e;let n={...e.payload,frame:t.frame,isHidden:t.isHidden};return t.size!==void 0&&(e.kind==="text"?n.fontSize=t.size:e.kind==="icon"?n.size=t.size:(e.kind==="gauge"||e.kind==="chart")&&(n.lineWidth=t.size)),{kind:e.kind,payload:n}}function Mh(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(o=>Ld(o,n.placements[o.payload.id]))}function De(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return e.payload.source==="inline"?void 0:{kind:{kind:"entityState",...e.payload.entity}};case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}function at(e){let t=[],n=o=>{for(let i of o)i.value&&t.push(i.value)};for(let o of e){for(let i of o.cases){for(let r of i.when.tests)t.push(r.value),r.comparison.value&&t.push(r.comparison.value),r.comparison.upper&&t.push(r.comparison.upper);n(i.then)}o.otherwise&&n(o.otherwise)}return t}var Md=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function Et(e,t){let n,o=t;for(let i=0;o!==void 0&&i<4;i++){let r=o.kind;if(r.kind==="chartStat"){o=zl(e,o)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let a={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return n===void 0?{ref:a}:{ref:a,namedId:n}}if(r.kind!=="named")return;n=r.id.toUpperCase(),o=e.values.find(a=>a.id.toUpperCase()===n)?.value}}function Id(e,t){return Et(e,De(t))?.ref}function Rd(e,t){let n=Id(e,t),o=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&Md.includes(o)?{type:"toggleEntity",...n,domain:o}:{type:"refresh"}}function Yo(e,t,n){if(Ai(t)||n.width<=0||n.height<=0)return{...e};let o=t,i=e.x-o.left/n.width,r=e.x+e.width+o.right/n.width,a=e.y-o.top/n.height,d=e.y+e.height+o.bottom/n.height;return r<i&&(i=r=(i+r)/2),d<a&&(a=d=(a+d)/2),i=j(i),r=j(r),a=j(a),d=j(d),{...e,x:i,y:a,width:Math.max(0,r-i),height:Math.max(0,d-a)}}function dr(e,t,n){let o=i=>Math.round(i*100)/100||0;return{left:o((e.x-t.x)*n.width),right:o((t.x+t.width-e.x-e.width)*n.width),top:o((e.y-t.y)*n.height),bottom:o((t.y+t.height-e.y-e.height)*n.height)}}function Ih(e,t,n,o){let i=e.elements.find(c=>c.payload.id===t);if(!i||i.kind!=="tap"||i.payload.attachedTo===void 0)return;let r=e.elements.find(c=>c.payload.id===i.payload.attachedTo);if(!r)return;let a=e.perFamily[n]?.placements[r.payload.id]?.frame??r.payload.frame,d=j(o.x),s=j(o.y),h=j(o.x+o.width),u=j(o.y+o.height),l={...o,x:d,y:s,width:Math.max(0,h-d),height:Math.max(0,u-s)};i.payload.outset=dr(a,l,P[n])}function Rh(e,t,n){let o=e.elements.find(d=>d.payload.id===t);if(!o)return;let i=e.perFamily[n];if(!i)return;let r=i.placements[t]?.frame??o.payload.frame,a=P[n];return{width:r.width*a.width,height:r.height*a.height}}function ve(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function R(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function $d(e,t){for(let n of e.elements)if(n.kind==="list"&&n.payload.template.some(o=>o.payload.id===t))return n}function $h(e,t){let n=e.elements.find(o=>o.payload.id===t);if(!n)return $d(e,t)?.payload.id;if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let o=e.elements.find(i=>i.payload.id===n.payload.attachedTo);if(o)return o.payload.id}return n.payload.id}function Oe(e){let t=new Map(e.elements.map(i=>[i.payload.id,i])),n=new Map;for(let i of e.elements){if(i.kind!=="tap")continue;let r=i.payload.attachedTo;if(r===void 0)continue;let a=t.get(r);if(!a||a.kind==="tap"||r===i.payload.id){delete i.payload.attachedTo;continue}let d=n.get(r);d?d.push(i):n.set(r,[i])}if(n.size===0)return;for(let[i,r]of n){let a=t.get(i);for(let d of r){let s=d.payload;s.outset===void 0&&(s.outset=dr(a.payload.frame,s.frame,P.rectangular));let h=s.outset,u=!Ai(h);d.payload.frame=Yo(a.payload.frame,h,P.rectangular),d.payload.isHidden=a.payload.isHidden,a.payload.page===void 0?delete d.payload.page:d.payload.page=a.payload.page;let l=Vd(e,i);for(let c of L){let p=e.perFamily[c];if(!p)continue;let f=P[c],m=p.placements[i];c!==l||!m?delete p.placements[d.payload.id]:u?p.placements[d.payload.id]={frame:Yo(m.frame,h,f),isHidden:m.isHidden}:p.placements[d.payload.id]={frame:{...m.frame},isHidden:m.isHidden}}}}let o=[];for(let i of e.elements){if(i.kind==="tap"&&i.payload.attachedTo!==void 0)continue;o.push(i);let r=n.get(i.payload.id);r&&o.push(...r)}e.elements=o}function Ph(e,t,n){let o=e.elements.find(d=>d.payload.id===t);if(!o||o.kind==="tap")return;let i=ve(e,t)[0];if(i)return i.payload;let r=D("tap"),a=r.payload;return a.attachedTo=t,a.outset={...Ys},a.action=n??Rd(e,o),e.elements.push(r),Oe(e),a}function Pd(e,t){let n=ve(e,t).map(o=>o.payload.id);if(n.length!==0){e.elements=e.elements.filter(o=>!n.includes(o.payload.id));for(let o of L)for(let i of n)delete e.perFamily[o]?.placements[i]}}function Q(e,t){for(let r of Bi(e,t))Q(e,r.payload.id);for(let r of Ul(e,t))Q(e,r.payload.id);for(let r of Ql(e,t))Q(e,r.payload.id);for(let r of ed(e,t))Q(e,r.payload.id);for(let r of ql(e,t))Q(e,r.payload.id);for(let r of Re(e,t))delete r.payload.chartAnchor;let n=e.elements.find(r=>r.payload.id===t),o=n?U(e,n.payload.groupId).map(r=>r.id):[];Pd(e,t),e.elements=e.elements.filter(r=>r.payload.id!==t);let i=n?.payload.chartAnchor;if(i&&(i.at==="threshold"||i.at==="now")&&!Re(e,i.layer).some(r=>r.payload.chartAnchor?.at===i.at)){let r=e.elements.find(a=>a.payload.id===i.layer);r?.kind==="chart"&&(i.at==="threshold"?(delete r.payload.thresholdValue,delete r.payload.drawsThreshold):(delete r.payload.nowIndex,delete r.payload.drawsNowLine))}for(let r of e.elements)r.kind==="chart"&&r.payload.scaleFrom===t&&delete r.payload.scaleFrom;for(let r of L)delete e.perFamily[r]?.placements[t];if(n?.kind==="list")for(let r of n.payload.template)for(let a of L)delete e.perFamily[a]?.placements[r.payload.id];Oe(e),W(e),n&&zd(e,o.find(r=>$(e,r)!==void 0),Nd(n))}function Nd(e){if(e.payload.chartAnchor)return e.payload.chartAnchor.layer;switch(e.kind){case"text":{let t=e.payload.value.kind;return t.kind==="chartStat"||t.kind==="imageTime"?t.layer:void 0}case"chartTimes":return e.payload.chart;case"chartDots":return e.payload.chart;case"chartGrid":return e.payload.chart;case"imageTime":return e.payload.image;default:return}}function zd(e,t,n){if(t===void 0||n===void 0||!e.groups?.some(i=>i.id===t))return;let o=ne(e,t);o.length===1&&o[0].payload.id===n&&kd(e,t)}function Nh(e,t){let n=e.elements.findIndex(s=>s.payload.id===t),o=e.elements[n];if(!o)return;let i=M(),r=structuredClone(o);r.payload.id=i,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let a=[r],d=[[t,i]];for(let s of ve(e,t)){let h=structuredClone(s);h.payload.id=M(),h.payload.attachedTo=i,a.push(h),d.push([s.payload.id,h.payload.id])}e.elements.splice(n+1,0,...a);for(let s of L){let h=e.perFamily[s];if(h)for(let[u,l]of d){let c=h.placements[u];c&&(h.placements[l]=structuredClone(c))}}return Oe(e),i}function Dd(e,t){let n=/^(.*\S) \d+$/.exec(e)?.[1]??e,o=new Set(t),i=2;for(;o.has(`${n} ${i}`);)i++;return`${n} ${i}`}function zh(e,t,n){let o=e.elements.findIndex(d=>d.payload.id===t),i=e.elements[o];if(!i||i.kind!=="chart")return;let r=M(),a=structuredClone(i);a.payload.id=r,a.payload.scaleFrom=t,n&&(a.payload.name=Dd(n(i),e.elements.map(n))),e.elements.splice(o+1,0,a);for(let d of L){let s=e.perFamily[d],h=s?.placements[t];s&&h&&(s.placements[r]=structuredClone(h))}return r}function cr(e,t,n){let o=new Set,i=u=>{o.add(u);for(let l of ve(e,u))o.add(l.payload.id)};for(let u of t){i(u);for(let l of Bi(e,u))i(l.payload.id)}let r=e.elements.filter(u=>o.has(u.payload.id)).map(u=>structuredClone(u)),a=r.flatMap(u=>u.kind==="list"?[u.payload.id,...u.payload.template.map(l=>l.payload.id)]:[u.payload.id]),d={};for(let u of L){let l=e.perFamily[u];if(!l)continue;let c={};for(let p of a){let f=l.placements[p];f&&(c[p]=structuredClone(f))}Object.keys(c).length>0&&(d[u]=c)}let s=new Set;for(let u of r)for(let l of U(e,u.payload.groupId))s.add(l.id);let h=(e.groups??[]).filter(u=>s.has(u.id)).map(u=>structuredClone(u));return{elements:r,placements:d,groups:h,...n!==void 0?{family:n}:{}}}function Dh(e,t,n){let o=t.family,i=o!==void 0&&o!==n&&ot(o);if(!ot(n))return _t(e,t);let r=_t(e,t,i?{nudge:!1}:{}),a=e.perFamily[n]??(e.perFamily[n]=Vt());for(let d of r){let s=e.elements.find(c=>c.payload.id===d);if(!s)continue;let h=(o!==void 0?e.perFamily[o]?.placements[d]:void 0)??L.map(c=>e.perFamily[c]?.placements[d]).find(c=>c!==void 0),u=h?.size??sr(s),l={frame:{...h?.frame??s.payload.frame},isHidden:!1,...u!==void 0?{size:u}:{}};for(let c of L)c!==n&&delete e.perFamily[c]?.placements[d];a.placements[d]=i?lr(l,o,n,s.kind):l}return pr(e,n),r}function Od(e,t){let n=new Map,o=new Set(e.map(a=>a.id)),i=new Set,r=a=>{if(i.has(a.id))return 0;i.add(a.id);let d=t.filter(s=>s.payload.groupId===a.id).length;for(let s of e)s.parentId===a.id&&(d+=r(s));return d>=2?(n.set(a.id,M()),1):d};for(let a of e)(a.parentId===void 0||!o.has(a.parentId))&&r(a);return n}function _t(e,t,n={}){let o=new Map;for(let p of t.elements)if(o.set(p.payload.id,M()),p.kind==="list")for(let f of p.payload.template)o.set(f.payload.id,M());let i=new Set(e.elements.map(p=>p.payload.id)),r=n.nudge!==!1&&t.elements.some(p=>i.has(p.payload.id)),a=p=>r?{...p,x:Math.min(.9,p.x+.05),y:Math.min(.9,p.y+.05)}:p,d=[];for(let p of t.elements){let f=structuredClone(p);if(f.payload.id=o.get(p.payload.id),f.kind==="tap"&&f.payload.attachedTo!==void 0){let m=o.get(f.payload.attachedTo);m?f.payload.attachedTo=m:delete f.payload.attachedTo}if(f.kind==="chart"&&f.payload.scaleFrom!==void 0){let m=o.get(f.payload.scaleFrom);m?f.payload.scaleFrom=m:i.has(f.payload.scaleFrom)||delete f.payload.scaleFrom}if(f.kind==="text")for(let m of f.payload.parts??[]){let x=m.value.kind,S=x.kind==="chartStat"?o.get(x.layer):void 0;x.kind==="chartStat"&&S&&(x.layer=S)}if(f.kind==="text"&&f.payload.value.kind.kind==="chartStat"){let m=o.get(f.payload.value.kind.layer);if(m)f.payload.value.kind.layer=m;else if(!i.has(f.payload.value.kind.layer))continue}if(f.kind==="chartTimes"||f.kind==="chartDots"||f.kind==="chartGrid"){let m=o.get(f.payload.chart);if(m)f.payload.chart=m;else if(!i.has(f.payload.chart))continue}if(f.kind==="imageTime"){let m=o.get(f.payload.image);if(m)f.payload.image=m;else if(!i.has(f.payload.image))continue}if(Xd(f,m=>{if(m.kind.kind!=="imageTime")return;let x=o.get(m.kind.layer);x&&(m.kind.layer=x)}),f.payload.chartAnchor!==void 0){let m=o.get(f.payload.chartAnchor.layer);m?f.payload.chartAnchor.layer=m:i.has(f.payload.chartAnchor.layer)||delete f.payload.chartAnchor}if(f.kind==="list")for(let m of f.payload.template){let x=o.get(m.payload.id);x&&(m.payload.id=x)}f.payload.frame=a(f.payload.frame),d.push(f)}let s=Od(t.groups,d.filter(p=>!(p.kind==="tap"&&p.payload.attachedTo!==void 0))),h=new Map(t.groups.map(p=>[p.id,p])),u=p=>{let f=new Set,m=p===void 0?void 0:h.get(p);for(;m&&!f.has(m.id);){let x=s.get(m.id);if(x)return x;f.add(m.id),m=m.parentId===void 0?void 0:h.get(m.parentId)}};for(let p of t.groups){let f=s.get(p.id);if(!f)continue;let m={...structuredClone(p),id:f},x=u(p.parentId);x?m.parentId=x:delete m.parentId,(e.groups??=[]).push(m)}for(let p of d){if(p.payload.groupId===void 0)continue;let f=u(p.payload.groupId);f?p.payload.groupId=f:delete p.payload.groupId}e.elements.push(...d);let l=new Set(d.map(p=>p.payload.id)),c=new Set(d.flatMap(p=>p.kind==="list"?p.payload.template.map(f=>f.payload.id):[]));for(let p of L){let f=t.placements[p],m=e.perFamily[p];if(!(!f||!m))for(let[x,S]of Object.entries(f)){let H=o.get(x);H!==void 0&&(c.has(H)?m.placements[H]=structuredClone(S):l.has(H)&&(m.placements[H]={...structuredClone(S),frame:a(S.frame)}))}}return Oe(e),W(e),se(e),d.filter(p=>!R(e,p)).map(p=>p.payload.id)}function ur(e,t,n){let o=e.perFamily[t],i=o?.placements[n.payload.id];return o&&Object.keys(o.placements).length>0&&i?!i.isHidden:!n.payload.isHidden}function Vd(e,t){let n=e.elements.find(r=>r.payload.id===t),i=(n&&n.kind==="tap"?n.payload.attachedTo:void 0)??t;return L.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[i]!==void 0)}function Qn(e,t){let n=e.perFamily[t];return n?e.elements.filter(o=>{let i=o.kind==="tap"?o.payload.attachedTo:void 0;return n.placements[i??o.payload.id]!==void 0}):[]}function Oh(e,t){let n=e.perFamily[t];return n?Qn(e,t).filter(o=>!R(e,o)&&!n.placements[o.payload.id]?.isHidden).length:0}function pr(e,t){let n=L.filter(d=>e.supportedFamilies.includes(d));if(n.length===0)return;let o=t!==void 0&&ot(t)&&n.includes(t)?t:n[0];for(let d of n)e.perFamily[d]||(e.perFamily[d]=Vt());let i=()=>e.elements.filter(d=>!R(e,d)),r=new Map,a=new Set;if(t===void 0){let d=new Map(i().map(c=>[c.payload.id,n.filter(p=>ur(e,p,c))]));for(let[c,p]of d)p[0]&&r.set(c,p[0]);let s=new Map([...i().entries()].map(([c,p])=>[p.payload.id,c]));for(let c of n){let p=i().filter(x=>(d.get(x.payload.id)??[]).includes(c)&&r.get(x.payload.id)!==c).map(x=>x.payload.id);if(p.length===0)continue;let f=cr(e,p,c),m=_t(e,f,{nudge:!1});m.forEach((x,S)=>{r.set(x,c);let H=m.length===p.length?p[S]:void 0;s.set(x,H!==void 0?s.get(H)??0:s.size)})}for(let c of i())r.has(c.payload.id)||a.add(c.payload.id);let h=c=>n.indexOf(r.get(c)??o),u=i().sort((c,p)=>h(c.payload.id)-h(p.payload.id)||(s.get(c.payload.id)??0)-(s.get(p.payload.id)??0)),l=[];for(let c of u)l.push(c),l.push(...ve(e,c.payload.id));e.elements=l}for(let d of i()){let s=d.payload.id,h=n.filter(p=>e.perFamily[p].placements[s]!==void 0),u=r.get(s)??h.find(p=>!e.perFamily[p].placements[s].isHidden)??h[0]??o,l=e.perFamily[u]?.placements[s],c={frame:{...l?.frame??d.payload.frame},isHidden:a.has(s)||l?.isHidden===!0,...l?.size!==void 0?{size:l.size}:{}};d.payload.isHidden=!0;for(let p of L){let f=e.perFamily[p];f&&(p===u?f.placements[s]=c:delete f.placements[s])}}}function Bd(e,t,n){let o=e.perFamily[n]??(e.perFamily[n]=Vt()),i=Qn(e,t).filter(s=>!R(e,s));if(i.length===0)return;let r=cr(e,i.map(s=>s.payload.id),t),a=_t(e,r,{nudge:!1}),d=e.perFamily[t];for(let s of a){let h=e.elements.find(p=>p.payload.id===s);if(!h)continue;let u=d?.placements[s],l=u?.size??sr(h),c={frame:{...u?.frame??h.payload.frame},isHidden:u?.isHidden??!1,...l!==void 0?{size:l}:{}};for(let p of L)p!==n&&delete e.perFamily[p]?.placements[s];o.placements[s]=lr(c,t,n,h.kind)}pr(e,n)}var Ud={small:"circular",medium:"rectangular"};function Wd(e,t){let n=L.filter(r=>r!==t&&r!=="corner"&&e.supportedFamilies.includes(r)&&Qn(e,r).some(a=>!R(e,a))),o=ot(t)?Ud[t]:void 0;if(o!==void 0&&n.includes(o))return o;let i;for(let r of n)(i===void 0||P[r].width>P[i].width)&&(i=r);return i}function Vh(e,t){if(!ot(t)||!e.supportedFamilies.includes(t))return;let n=e.perFamily[t];if(n&&Object.keys(n.placements).length>0)return;let o=Wd(e,t);if(o!==void 0)return Bd(e,o,t),o}function Gd(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n)return[];let o=[],i=Et(e,De(n));if(i){let r=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";o.push(i.namedId===void 0?{where:r,ref:i.ref}:{where:r,ref:i.ref,namedId:i.namedId})}for(let r of ve(e,t)){let a=r.payload.action;!("entityId"in a)||a.entityId===""||o.push({where:"tap",ref:{entityId:a.entityId,displayName:a.displayName,domain:a.domain},tapId:r.payload.id})}for(let r of n.payload.rules)for(let a of r.cases)for(let d of a.when.tests){let s=Et(e,d.value);if(!s)continue;let h={where:"test",ref:s.ref,ruleId:r.id,caseId:a.id,testId:d.id};s.namedId!==void 0&&(h.namedId=s.namedId),o.push(h)}return o}function jd(e,t){return Gd(e,t)[0]?.ref}function Ye(e,t,n){if(!e)return;let o=e.kind;switch(o.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:o.attribute}};case"literal":return n==="text"||n==="gauge"||n==="chart"||n==="timeline"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function Bh(e,t,n,o){let i=e.elements.find(d=>d.payload.id===t);if(!i||n.entityId==="")return;let r={...n,domain:n.domain||n.entityId.split(".")[0]||""},a=jd(e,t)?.entityId;if(a!==void 0&&a!==r.entityId){let d=new Set;for(let s of i.payload.rules)for(let h of s.cases)for(let u of h.when.tests){let l=u.value.kind;if(l.kind==="named"){Et(e,u.value)?.ref.entityId===a&&d.add(l.id);continue}if(!("entityId"in l)||l.entityId!==a)continue;let c=Ye(u.value,r,"icon");c&&(u.value=c)}for(let s of d){let h=e.values.find(l=>l.id.toUpperCase()===s.toUpperCase()),u=h?Ye(h.value,r,"icon"):void 0;u&&Yd(e,s,u)}}if(i.kind==="timeline"){let d=i.payload.value.kind.kind==="entityState"?i.payload.value.kind.entityId:void 0,s=Ye(i.payload.value,r,i.kind);s&&(i.payload.value=s),(i.payload.bands.length===0||d!==r.entityId)&&(i.payload.bands=i.payload.aggregate!==void 0?zo(Is):zo(r.domain,o)),i.payload.aggregate!==void 0&&(i.payload.aggregate={...i.payload.aggregate,entities:i.payload.aggregate.entities.map((h,u)=>u===0?r.entityId:h)})}else if(i.kind==="image")i.payload.entity=r;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let d=Ye(i.payload.value,r,i.kind);d&&(i.payload.value=d)}else if(i.kind==="icon"){let d=Ye(i.payload.symbol,r,i.kind);d&&(i.payload.symbol=d)}for(let d of ve(e,t)){let s=d.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var Kd={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area",chartTimes:"clock times",chartDots:"chart dots",chartGrid:"chart grid",imageTime:"timestamp",list:"list"};function Zo(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function Qo(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let t=e.layerKind===void 0?"":Kd[e.layerKind],n=e.layerName?`${t} "${e.layerName}"`:t;if(e.part==="listSource")return`Items of ${n}`;if(e.part==="listRow")return n===""?"List row":`Row of ${n}`;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${n}`:e.part==="gaugeMin"?`Min on ${n}`:e.part==="gaugeMax"?`Max on ${n}`:e.part==="nowIndex"?`Now marker on ${n}`:e.part==="level"?`Fill on ${n}`:e.part==="levelMin"?`Fill min on ${n}`:e.part==="levelMax"?`Fill max on ${n}`:e.part==="textPart"?`Part of ${n}`:e.part==="timelineGroup"?`Combined on ${n}`:`${Zo(t)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return n===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${n}`;case"layout":{let o=Zo(e.family??"");switch(e.part){case"curvedText":return`${o} curved text`;case"bezelGauge":return`${o} bezel gauge`;case"bezelGaugeMin":return`${o} bezel gauge low label`;case"bezelGaugeMax":return`${o} bezel gauge high label`;default:return`${o} bezel`}}case"inline":return"Inline";case"control":switch(e.part){case"controlValue":return"Control Center value line";case"controlState":return"Control Center state";case"controlStatus":return"Control Center status text";default:return"Control Center"}}}var hr=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g,qd="{item.";function ei(e){return e.startsWith(qd)}function eo(e){let t=[];for(let n of e.matchAll(hr))n[2]!==void 0&&t.push(n[2]);return t}function Uh(e,t){return t.size===0?e:e.replace(hr,(n,o,i)=>{let r=t.get(i);return r===void 0?n:`${o}${r}${o}`})}function _e(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function Jd(e,t){if(t.payload.name)return t.payload.name;if(t.kind==="shape")return t.payload.kind==="roundedRectangle"?"rounded rectangle":t.payload.kind;if(t.kind==="tap")return"";if(t.kind==="image")return t.payload.entity.displayName||t.payload.entity.entityId;let n=De(t)?.kind;if(n===void 0)return"";if(n.kind==="literal")return n.value;if("entityId"in n)return n.displayName||n.entityId;if(n.kind==="named"){let o=n.id.toUpperCase();return e.values.find(i=>i.id.toUpperCase()===o)?.name??""}return""}function re(e,t){let n=(s,h)=>{t.value?.(s,h);let u=s.kind;if(u.kind==="jinja"){if(t.text){let c=t.text(u.value,{...h,part:"template"});c!==u.value&&(u.value=c)}return}if(u.kind==="aggregate"){let c=u.aggregate.scope;if(t.ref&&c.kind==="entities")for(let p=0;p<c.entities.length;p++){let f=t.ref(_e(c.entities[p]),h);f&&(c.entities[p]=f)}return}if(!t.ref||!("entityId"in u))return;let l=t.ref(_e(u),h);l&&(u.kind==="entityAttribute"?s.kind={kind:"entityAttribute",...l,attribute:u.attribute}:u.kind==="entityState"?s.kind={kind:"entityState",...l}:s.kind={kind:"entityAge",...l})},o=(s,h,u)=>{if(s.type==="callService"){if(t.ref&&s.target!==void 0&&!ei(s.target.entityId)&&s.target.entityId!==""){let c=t.ref(_e(s.target),h);c&&(s.target=c)}if(t.text&&s.serviceDataJSON!==void 0){let c=t.text(s.serviceDataJSON,{...h,part:"serviceData"});c!==s.serviceDataJSON&&(s.serviceDataJSON=c)}return}if(!t.ref||!("entityId"in s)||s.entityId===""||ei(s.entityId))return;let l=t.ref(_e(s),h);l&&u({type:s.type,...l})};for(let s of e.values)n(s.value,{kind:"named",valueId:s.id,valueName:s.name});let i=(s,h)=>{if(s.kind==="image"){if(t.ref){let l=t.ref(_e(s.payload.entity),{...h,kind:"image"});l&&(s.payload.entity=l)}}else if(s.kind==="tap"){let l=s.payload;o(l.action,{...h,kind:"tap"},c=>{l.action=c})}else{let l=De(s);if(l&&n(l,h),s.kind==="text")for(let c of s.payload.parts??[])n(c.value,{...h,part:"textPart"}),c.icon&&n(c.icon,{...h,part:"textPart"});if(s.kind==="gauge"&&s.payload.total&&n(s.payload.total,{...h,part:"total"}),s.kind==="gauge"&&s.payload.minSource&&n(s.payload.minSource,{...h,part:"gaugeMin"}),s.kind==="gauge"&&s.payload.maxSource&&n(s.payload.maxSource,{...h,part:"gaugeMax"}),s.kind==="chart"&&s.payload.nowIndex&&n(s.payload.nowIndex,{...h,part:"nowIndex"}),s.kind==="icon"||s.kind==="shape"){let c=s.payload.level;c&&(n(c.value,{...h,part:"level"}),c.minSource&&n(c.minSource,{...h,part:"levelMin"}),c.maxSource&&n(c.maxSource,{...h,part:"levelMax"}))}if(s.kind==="timeline"&&t.ref&&s.payload.aggregate!==void 0){let c=s.payload.aggregate.entities;for(let p=0;p<c.length;p++){let f=c[p]??"";if(f==="")continue;let m=t.ref({entityId:f,displayName:"",domain:f.split(".")[0]??""},{...h,part:"timelineGroup"});m&&(c[p]=m.entityId)}}if(s.kind==="list"){r(s.payload.source,{...h,part:"listSource"});let c={...h,part:"listRow"};for(let p of s.payload.template)i(p,c)}}let u={...h,kind:"rule"};for(let l of at(s.payload.rules))n(l,u)},r=(s,h)=>{if(s.kind==="template"){if(t.text){let l=t.text(s.value,{...h,part:"template"});l!==s.value&&(s.value=l)}return}if(!t.ref)return;let u=(l,c)=>{if(l.entityId==="")return;let p=t.ref(_e(l),h);p&&c(p)};switch(s.kind){case"entities":if(s.scope.kind==="entities"){let l=s.scope.entities;for(let c=0;c<l.length;c++)u(l[c],p=>{l[c]=p})}return;case"calendar":case"todo":{let l=s.entities;for(let c=0;c<l.length;c++)u(l[c],p=>{l[c]=p});return}case"attribute":case"forecast":u(s,l=>{s.entityId=l.entityId,s.displayName=l.displayName,s.domain=l.domain,l.iconName!==void 0?s.iconName=l.iconName:delete s.iconName});return}};for(let s of e.elements)i(s,{kind:"layer",layerId:s.payload.id,layerKind:s.kind,layerName:Jd(e,s)});let a=Object.keys(e.perFamily).sort((s,h)=>{let u=Ze.indexOf(s),l=Ze.indexOf(h);return(u<0?Ze.length:u)-(l<0?Ze.length:l)});for(let s of a){let h=e.perFamily[s];if(!h)continue;let u={kind:"layout",family:s};h.bezelText&&n(h.bezelText,{...u,part:"bezelText"}),h.curvedText&&n(h.curvedText,{...u,part:"curvedText"});let l=h.bezelGauge;l&&(n(l.value,{...u,part:"bezelGauge"}),l.minLabel&&n(l.minLabel,{...u,part:"bezelGaugeMin"}),l.maxLabel&&n(l.maxLabel,{...u,part:"bezelGaugeMax"}));let c={kind:"rule",family:s};for(let p of at(h.rules))n(p,c)}if(e.inline){n(e.inline.value,{kind:"inline"});for(let s of e.inline.parts??[])n(s.value,{kind:"inline",part:"textPart"})}let d=e.control;if(d){let s={kind:"control"};n(d.title,s),d.valueLabel&&n(d.valueLabel,{...s,part:"controlValue"}),d.state&&n(d.state,{...s,part:"controlState"}),d.status&&n(d.status,{...s,part:"controlStatus"}),o(d.action,s,h=>{d.action=h})}o(e.tapAction,{kind:"documentTap"},s=>{e.tapAction=s})}function le(e,t){re(e,{value:t})}function Xd(e,t){let n=ar("",0);n.elements=[e],re(n,{value:t})}function Bt(e,t){return e.kind.kind==="named"&&e.kind.id.toUpperCase()===t.toUpperCase()}function Wh(e,t){let n=new Set;return le(e,(o,i)=>{Bt(o,t)&&n.add(i.layerId??`${i.kind}:${i.valueId??""}:${i.family??""}:${i.part??""}`)}),n.size}function Yd(e,t,n){let o=e.values.find(c=>c.id.toUpperCase()===t.toUpperCase());if(!o)return;let r=(c=>"entityId"in c.kind&&c.kind.entityId!==""?c.kind.entityId:void 0)(o.value);o.value=n;let a="entityId"in n.kind?{entityId:n.kind.entityId,displayName:n.kind.displayName,domain:n.kind.domain}:void 0;if(r===void 0||a===void 0||a.entityId===""||a.entityId===r)return;let d=new Set;le(e,(c,p)=>{p.layerId!==void 0&&Bt(c,t)&&d.add(p.layerId)});let s=new Map(e.elements.map(c=>[c.payload.id,c])),h=c=>{let p=s.get(c);if(!p)return;let f=p.kind==="tap"&&p.payload.attachedTo!==void 0?s.get(p.payload.attachedTo)??p:p;return U(e,f.payload.groupId).at(-1)?.id},u=new Set;for(let c of d){let p=h(c);p!==void 0&&u.add(p)}let l=c=>{if(d.has(c))return!0;let p=s.get(c);if(p?.kind==="tap"&&p.payload.attachedTo!==void 0&&d.has(p.payload.attachedTo))return!0;let f=h(c);return f!==void 0&&u.has(f)};ec(e,(c,p)=>{if(!(c.entityId!==r||p.kind==="named"||p.layerId===void 0||!l(p.layerId)))return{...a,domain:a.domain||a.entityId.split(".")[0]||""}})}function Gh(e,t){let n=new Set;return le(e,(o,i)=>{i.layerId!==void 0&&Bt(o,t)&&n.add(i.layerId)}),e.elements.map(o=>o.payload.id).filter(o=>n.has(o))}function Zd(e,t){let n=new Set(e.values.map(i=>i.name.trim().toLowerCase())),o=t.trim()||"Value";if(!n.has(o.toLowerCase()))return o;for(let i=2;;i++){let r=`${o} ${i}`;if(!n.has(r.toLowerCase()))return r}}function jh(e,t,n){let o={id:M(),name:Zd(e,n),value:{kind:structuredClone(t.kind)}},i={kind:{kind:"named",id:o.id}};return t.format&&!Ie(t.format)&&(i.format=structuredClone(t.format)),{named:o,ref:i}}function Qd(e,t){if(t.kind.kind!=="named")return;let n=t.kind.id,o=e.values.find(a=>a.id.toUpperCase()===n.toUpperCase());if(!o)return;let i=t.format&&!Ie(t.format)?t.format:o.value.format,r={kind:structuredClone(o.value.kind)};return i&&!Ie(i)&&(r.format=structuredClone(i)),r}function Kh(e,t){le(e,n=>{if(!Bt(n,t))return;let o=Qd(e,n);o&&(n.kind=o.kind,o.format?n.format=o.format:delete n.format)}),e.values=e.values.filter(n=>n.id.toUpperCase()!==t.toUpperCase())}function ec(e,t){re(e,{ref:t})}function qh(e,t){re(e,{text:t})}function Jh(e,t){let n=[],o={ref:(i,r)=>{i.entityId!==""&&n.push({entityId:i.entityId,ref:i,where:Qo(r)})}};return t&&(o.text=(i,r)=>{for(let a of eo(i)){let d=a.split(".")[0]??"";t(a,d)&&n.push({entityId:a,ref:{entityId:a,displayName:"",domain:d},where:Qo(r)})}return i}),re(e,o),n}function Xh(e,t,n){let o=c=>{switch(c.kind){case"control":return t.kind==="control";case"layer":case"image":case"tap":{if(t.kind!=="family")return!1;let p=e.elements.find(m=>m.payload.id===c.layerId);if(!p)return!1;let f=p.kind==="tap"&&p.payload.attachedTo!==void 0?e.elements.find(m=>m.payload.id===p.payload.attachedTo)??p:p;return ur(e,t.family,f)}case"layout":case"rule":return t.kind==="family"&&c.family===t.family;case"documentTap":case"inline":return t.kind==="family";case"named":return!1}},i=new Set,r={value:(c,p)=>{c.kind.kind==="named"&&(o(p)||p.kind==="named"&&p.valueId!==void 0&&i.has(p.valueId))&&i.add(c.kind.id)}},a=-1;for(let c=0;c<4&&a!==i.size;c++)a=i.size,re(e,r);let d=c=>o(c)||c.kind==="named"&&c.valueId!==void 0&&i.has(c.valueId),s=[],h=new Set,u=c=>{c===""||h.has(c)||(h.add(c),s.push(c))},l={ref:(c,p)=>{d(p)&&u(c.entityId)}};return n&&(l.text=(c,p)=>{if(d(p))for(let f of eo(c))n(f,f.split(".")[0]??"")&&u(f);return c}),re(e,l),{entityIds:s,namedIds:[...i]}}function Yh(e,t,n,o=!0){let i=new Set,r=new Set,a=s=>{s.kind==="named"&&s.valueId!==void 0?r.add(s.valueId.toUpperCase()):s.layerId!==void 0&&i.add(s.layerId)},d={ref:(s,h)=>{s.entityId===t&&a(h)}};n&&(d.text=(s,h)=>{for(let u of eo(s))u===t&&n(u,u.split(".")[0]??"")&&a(h);return s}),re(e,d);for(let s=o&&r.size>0;s;)s=!1,le(e,(h,u)=>{if(!(h.kind.kind!=="named"||!r.has(h.kind.id.toUpperCase())))if(u.kind==="named"&&u.valueId!==void 0){let l=u.valueId.toUpperCase();r.has(l)||(r.add(l),s=!0)}else u.layerId!==void 0&&i.add(u.layerId)});return fr(e,i)}function Zh(e,t){let n=new Set([t.toUpperCase()]),o=new Set;for(let i=!0;i;)i=!1,le(e,(r,a)=>{if(!(r.kind.kind!=="named"||!n.has(r.kind.id.toUpperCase())))if(a.kind==="named"&&a.valueId!==void 0){let d=a.valueId.toUpperCase();n.has(d)||(n.add(d),i=!0)}else a.layerId!==void 0&&o.add(a.layerId)});return fr(e,o)}function fr(e,t){let n=new Set;for(let o of e.elements)t.has(o.payload.id)&&n.add(R(e,o)&&o.kind==="tap"?o.payload.attachedTo:o.payload.id);return e.elements.map(o=>o.payload.id).filter(o=>n.has(o))}var tc={text:["color","opacity","text","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],chartTimes:["opacity","rotation","visibility"],chartDots:["opacity","visibility"],chartGrid:["opacity","visibility"],imageTime:["opacity","rotation","visibility"],list:["opacity","rotation","visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]};function nc(e){let t=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(t)?t:void 0}function oc(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function ic(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setFontDesign":return"design";case"setFontWidth":return"width";case"setItalic":return"italic";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function rc(){return{id:M(),value:A(""),comparison:{kind:"isOn"}}}function ac(){return{id:M(),when:{join:"all",tests:[rc()]},then:[]}}function Qh(){return{id:M(),cases:[ac()]}}function ti(e,t){return e&&(e.kind.kind!=="literal"||nc(e.kind.value)!==void 0)?e:A(t)}function ef(e,t){let n={kind:t};switch(oc(t)){case"value":n.value=e.value??A("");break;case"between":n.value=e.value??A(""),n.upper=e.upper??A("");break;case"times":n.value=ti(e.value,"22:00"),n.upper=ti(e.upper,"06:00");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function tf(e){let t={kind:e};switch(ic(e)){case"value":t.value=A(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"design":t.design="rounded";break;case"width":t.width="condensed";break;case"italic":t.italic=!0;break;case"none":break}return t}function Ut(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,o=0x100000001b3n,i=0xffffffffffffffffn;for(let r of t)n^=BigInt(r),n=n*o&i;return n.toString(16)}function gr(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function mr(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function sc(e,t,n=0){let o=t instanceof Map?t:gr(t),i=e.kind;if(i.kind==="named"){if(n>8)return;let a=o.get(i.id.toUpperCase());return a?a.kind.kind==="named"?sc(a,o,n+1):mr(a.kind)?"n_"+i.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!mr(i))return;let r=to(i);if(r!==void 0)return"e_"+Ut(r)}function z(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function xr(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(n=>z(n.entityId)).join(", ")}])`;else{let{domains:n,areaIds:o,labelIds:i,floorIds:r}=e.scope;if(!(o.length+i.length+r.length>0))t=n.length===0?"[]":"("+n.map(d=>`(states.${d} | list)`).join(" + ")+")";else{let d=[];for(let s of o)d.push(`area_entities(${z(s)})`);for(let s of i)d.push(`label_entities(${z(s)})`);r.length>0&&d.push(`((${r.map(s=>`floor_areas(${z(s)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${d.join(" + ")})`,n.length>0&&(t+=` | selectattr('domain', 'in', [${n.map(z).join(", ")}])`),t+=")"}}return t}function yr(e){return e?e.kind==="isOn"?" | selectattr('state', 'eq', 'on')":e.kind==="isOff"?" | selectattr('state', 'eq', 'off')":e.kind==="equals"?` | selectattr('state', 'eq', ${z(e.value)})`:` | rejectattr('state', 'eq', ${z(e.value)})`:""}function lc(e){let t=xr(e)+yr(e.stateFilter);if(e.function==="count")return`(${t} | list | count)`;let n=e.attribute?`attributes.${e.attribute}`:"state",o=`${t} | map(attribute=${z(n)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${o} | sum)`;case"average":return`(${o} | average(0))`;case"min":return`(${o} | min(default=0))`;case"max":return`(${o} | max(default=0))`}}var dc=" | rejectattr('state', 'in', ['unavailable', 'unknown'])";function br(e,t){let n=Pe(t);switch(e.kind){case"entities":{let o=e.stateFilter,i=o?.kind==="equals"&&(o.value==="unavailable"||o.value==="unknown"),r=(e.deviceClass??"").trim(),a=r===""?"":` | selectattr('attributes.device_class', 'eq', ${z(r)})`,d=`(${xr(e)})${i?"":dc}${a}${yr(o)}`,s=e.attributes.map(l=>`, 'attr.${l}': s.attributes.get(${z(l)})`).join(""),h=e.descending?"true":"false",u=e.sort==="state"?`((ns.items | rejectattr('n', 'none') | sort(attribute='n', reverse=${h}) | list) + (ns.items | selectattr('n', 'none') | sort(attribute='state', reverse=${h}) | list))`:`(ns.items | sort(attribute='${e.sort==="lastChanged"?"lastChanged":"name"}', reverse=${h}) | list)`;return`{% set ns = namespace(items=[]) %}{% for s in ${d} %}{% set ns.items = ns.items + [{'entityId': s.entity_id, 'name': s.name[:120], 'state': s.state[:120], 'unit': s.attributes.get('unit_of_measurement'), 'domain': s.domain, 'deviceClass': s.attributes.get('device_class'), 'area': area_name(s.entity_id), 'lastChanged': (as_timestamp(s.last_changed) | round(0)), 'n': (s.state | float(none))${s}}] %}{% endfor %}{% set sorted = ${u} %}{{ {'items': sorted[:${n}], 'total': (sorted | count)} | to_json }}`}case"attribute":return`{% set a = state_attr(${z(e.entityId)}, ${z(e.attribute)}) %}{% if a is string or a is mapping or a is not iterable %}{% set a = [] %}{% endif %}{% set a = a | list %}{{ {'items': a[:${n}], 'total': (a | count)} | to_json }}`;case"template":{let o=e.value.trim();return o.length===0?void 0:o}default:return}}function rf(e,t){let n=br(e,t);return n===void 0?void 0:"e_"+Ut(n)}function cc(e){let t=n=>n.map(o=>o.entityId).filter(o=>o!=="");switch(e.kind){case"calendar":{let n=t(e.entities);return n.length===0?void 0:`calendar|${n.join(",")}|${e.hours}`}case"todo":{let n=t(e.entities);return n.length===0?void 0:`todo|${n.join(",")}|${e.status}|${e.sort}`}case"forecast":return e.entityId===""?void 0:`forecast|${e.entityId}|${e.type}`;default:return}}function uc(e,t){let n=Pe(t),o=i=>i.map(r=>r.entityId).filter(r=>r!=="");switch(e.kind){case"calendar":{let i=o(e.entities);return i.length===0?void 0:{source:"calendar",entities:i,hours:e.hours,limit:n}}case"todo":{let i=o(e.entities);return i.length===0?void 0:{source:"todo",entities:i,status:e.status,sort:e.sort,limit:n}}case"forecast":return e.entityId===""?void 0:{source:"forecast",entity_id:e.entityId,type:e.type,limit:n};default:return}}function pc(e){let t=[];for(let n of e.elements)n.kind==="list"&&t.push(n.payload);return t}function no(e){let t=new Map;for(let n of pc(e)){let o=cc(n.source),i=uc(n.source,n.rows);if(o===void 0||i===void 0)continue;let r=t.get(o);r===void 0?t.set(o,i):i.limit>r.limit&&t.set(o,{...r,limit:i.limit})}return new Map([...t.entries()].sort(([n],[o])=>n<o?-1:n>o?1:0))}function to(e){switch(e.kind){case"entityAttribute":return`state_attr(${z(e.entityId)}, ${z(e.attribute)})`;case"entityAge":{let t=z(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return lc(e.aggregate);default:return}}function hc(e){let t=new Map,n=new Map,o=gr(e.values),i=(s,h=0)=>{let u=s.kind;switch(u.kind){case"literal":case"dataAge":case"chartStat":case"item":case"listStat":case"imageTime":return;case"entityState":t.set(u.entityId,u);return;case"named":{if(h>8)return;let l=o.get(u.id.toUpperCase());if(!l)return;if(l.kind.kind==="named"){i(l,h+1);return}if(l.kind.kind==="entityState"){t.set(l.kind.entityId,l.kind);return}let c=to(l.kind);if(c===void 0)return;n.set("n_"+u.id.toLowerCase().replace(/-/g,""),c);return}default:{let l=to(u);if(l===void 0)return;n.set("e_"+Ut(l),l)}}},r=s=>{let h=De(s);if(h&&i(h),s.kind==="text")for(let u of s.payload.parts??[])i(u.value),u.icon&&i(u.icon);if(s.kind==="gauge"&&s.payload.total&&i(s.payload.total),s.kind==="gauge"&&s.payload.minSource&&i(s.payload.minSource),s.kind==="gauge"&&s.payload.maxSource&&i(s.payload.maxSource),s.kind==="chart"&&s.payload.nowIndex&&i(s.payload.nowIndex),s.kind==="icon"||s.kind==="shape"){let u=s.payload.level;u&&(i(u.value),u.minSource&&i(u.minSource),u.maxSource&&i(u.maxSource))}if(s.kind==="list"){let u=br(s.payload.source,s.payload.rows);u!==void 0&&n.set("e_"+Ut(u),u);for(let l of s.payload.template)r(l)}for(let u of at(s.payload.rules))i(u)};for(let s of e.values)i({kind:{kind:"named",id:s.id}});for(let s of e.elements)r(s);for(let s of L){if(!e.supportedFamilies.includes(s))continue;let h=e.perFamily[s];if(h){h.bezelText&&i(h.bezelText),h.curvedText&&i(h.curvedText),h.bezelGauge&&(i(h.bezelGauge.value),h.bezelGauge.minLabel&&i(h.bezelGauge.minLabel),h.bezelGauge.maxLabel&&i(h.bezelGauge.maxLabel));for(let u of at(h.rules))i(u)}}e.supportedFamilies.includes("inline")&&e.inline&&i(e.inline.value);let a=e.control;a&&(i(a.title),a.valueLabel&&i(a.valueLabel),a.state&&i(a.state),a.status&&i(a.status));let d={entities:t,expressions:n};return n.size>0&&(d.document=fc(n)),d}function fc(e){let t=[...e.keys()].sort(),n=[];for(let i of t){let r=e.get(i);r.includes("{{")||r.includes("{%")?n.push(`{% set v_${i} %}${r}{% endset %}`):n.push(`{% set v_${i} = ${r} %}`)}let o=t.map(i=>`"${i}": v_${i}`).join(", ");return n.push(`{{ { ${o} } | to_json }}`),n.join(`
`)}function af(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,o=new Set;for(let[i,r]of Object.entries(t))r===null?o.add(i):n.set(i,mc(r));return{values:n,nullKeys:o}}function mc(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function sf(e){let t=hc(e),n=[...t.entities.entries()].sort(([o],[i])=>o<i?-1:o>i?1:0).map(([,o])=>({kind:"entity",entityId:o.entityId,displayName:o.displayName,domain:o.domain,...o.iconName!==void 0?{iconName:o.iconName}:{}}));t.document&&n.push({kind:"template",value:t.document});for(let o of no(e).values())n.push({kind:"list",...o});return n}var I="wrist_assistant/complications";async function uf(e){return e.connection.sendMessagePromise({type:"wrist_assistant/gallery_key"})}async function pf(e){return e.connection.sendMessagePromise({type:`${I}/parts_list`})}async function hf(e,t,n,o){let i={type:`${I}/parts_save`,name:t,text:n};return o!==void 0&&(i.part_id=o),e.connection.sendMessagePromise(i)}async function ff(e,t){return e.connection.sendMessagePromise({type:`${I}/parts_delete`,part_id:t})}async function mf(e,t,n,o={}){return e.connection.sendMessagePromise({type:"call_service",domain:t,service:n,service_data:o})}async function gf(e){return e.connection.sendMessagePromise({type:`${I}/owners`})}async function xf(e,t){return e.connection.sendMessagePromise({type:`${I}/list`,owner_watch_id:t})}async function yf(e,t,n,o,i,r){return e.connection.sendMessagePromise({type:`${I}/preview_save`,owner_watch_id:t,complication_id:n,revision:o,png:i,meta:r})}async function bf(e,t,n,o){return e.connection.sendMessagePromise({type:`${I}/preview_get`,owner_watch_id:t,complication_id:n,revision:o})}async function wf(e,t){return e.connection.sendMessagePromise({type:`${I}/nudge`,owner_watch_id:t})}async function vf(e,t){return e.connection.sendMessagePromise({type:`${I}/watch_status`,owner_watch_id:t})}async function kf(e,t,n){let i=(await e.connection.sendMessagePromise({type:"config/device_registry/list"})).find(r=>r.identifiers.some(([a,d])=>a==="wrist_assistant"&&d===`watch_${t}`));if(i===void 0)throw new Error("Home Assistant has no device entry for it");await e.connection.sendMessagePromise({type:"config/device_registry/update",device_id:i.id,name_by_user:n})}async function Cf(e,t){return e.connection.sendMessagePromise({type:"wrist_assistant/devices/forget",watch_id:t,force:!0})}async function Sf(e,t,n,o){return e.connection.sendMessagePromise({type:`${I}/save`,owner_watch_id:t,document:n,base_revision:o})}async function Af(e,t,n,o){return e.connection.sendMessagePromise({type:`${I}/delete`,owner_watch_id:t,complication_id:n,base_revision:o})}async function Tf(e,t,n){return e.connection.sendMessagePromise({type:`${I}/history`,owner_watch_id:t,complication_id:n})}async function Ef(e,t,n,o){return e.connection.sendMessagePromise({type:`${I}/history_get`,owner_watch_id:t,complication_id:n,revision:o})}async function _f(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${I}/history_restore`,owner_watch_id:t,complication_id:n,revision:o,base_revision:i})}var st="wrist_assistant/pair";async function Ff(e){return e.connection.sendMessagePromise({type:"config/auth/list"})}async function Hf(e,t){return e.connection.sendMessagePromise({type:`${st}/lookup`,code:t})}async function Lf(e,t,n,o={}){return e.connection.sendMessagePromise({type:`${st}/confirm`,code:t,...n===void 0?{}:{user_id:n},...o.replace===!0?{replace:!0}:{},...o.allowRemote===!0?{allow_remote:!0}:{}})}async function Mf(e,t,n=!1){return e.connection.sendMessagePromise({type:`${st}/offer`,...t===void 0?{}:{user_id:t},...n?{replace:!0}:{}})}async function If(e,t){return e.connection.sendMessagePromise({type:`${st}/offer_status`,offer_id:t})}async function Rf(e,t){return e.connection.sendMessagePromise({type:`${st}/offer_cancel`,offer_id:t})}var oo="wrist_assistant/client_certificate";async function $f(e){return e.connection.sendMessagePromise({type:`${oo}/status`})}async function Pf(e,t,n){return e.connection.sendMessagePromise({type:`${oo}/put`,pkcs12:t,passphrase:n})}async function Nf(e){return e.connection.sendMessagePromise({type:`${oo}/delete`})}var ke="wrist_assistant/watch_config";async function zf(e,t,n){return e.connection.sendMessagePromise({type:`${ke}/get`,owner_watch_id:t,kind:n})}async function Df(e){return e.connection.sendMessagePromise({type:`${ke}/summary`})}async function Of(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${ke}/save`,owner_watch_id:t,kind:n,base_revision:o,document:i})}async function Vf(e,t,n){return e.connection.sendMessagePromise({type:`${ke}/history`,owner_watch_id:t,kind:n})}async function Bf(e,t,n,o){return e.connection.sendMessagePromise({type:`${ke}/history_entry`,owner_watch_id:t,kind:n,revision:o})}async function Uf(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${ke}/restore`,owner_watch_id:t,kind:n,revision:o,base_revision:i})}function Wf(e,t,n){return e.connection.subscribeMessage(n,{type:`${ke}/subscribe`,owner_watch_id:t})}var io="wrist_assistant/http_actions";async function Gf(e){return e.connection.sendMessagePromise({type:`${io}/get`})}async function jf(e,t,n){return e.connection.sendMessagePromise({type:`${io}/save`,base_revision:t,document:n})}async function Kf(e,t,n,o){return e.connection.sendMessagePromise({type:`${io}/test`,action:t,global_variables:n,values:o})}var ro="wrist_assistant/cameras";async function qf(e){return e.connection.sendMessagePromise({type:`${ro}/list`})}async function Jf(e,t){return e.connection.sendMessagePromise({type:`${ro}/save`,...t})}async function Xf(e,t,n,o){return e.connection.sendMessagePromise({type:`${ro}/test`,camera:t,...n===void 0?{}:{title:n},...o===void 0?{}:{message:o}})}async function Yf(e,t){return e.connection.sendMessagePromise({type:"wrist_assistant/watch_voices/get",watch_id:t})}var Wt="wrist_assistant/page_images";async function Zf(e){return e.connection.sendMessagePromise({type:`${Wt}/list`})}async function Qf(e,t){return e.connection.sendMessagePromise({type:`${Wt}/get`,image_id:t})}async function em(e,t){return e.connection.sendMessagePromise({type:`${Wt}/upload`,data:t})}async function tm(e,t){return e.connection.sendMessagePromise({type:`${Wt}/delete`,image_id:t})}async function nm(e,t,n){return e.connection.sendMessagePromise({type:`${I}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function om(e,t,n){let o={type:`${I}/subscribe`};return t&&(o.owner_watch_id=t),e.connection.subscribeMessage(n,o)}async function im(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${I}/render_values`,templates:t})).results}async function rm(e,t){return e.connection.sendMessagePromise({type:"config_entries/get",domain:t})}async function am(e){return e.connection.sendMessagePromise({type:"cloud/status"})}async function sm(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${I}/history_series`,requests:t})).results}function gc(e){return{entity_id:e.entityId,minutes:e.minutes,points:e.points,...e.mode==="states"?{mode:"states"}:{},...e.gaps?{gaps:!0}:{},...e.entities!==void 0&&e.entities.length>0?{entities:[...e.entities],combine:e.combine??"any"}:{}}}function xc(e){return{entity_id:e.entityId,minutes:e.minutes,period:e.period,type:e.type,...e.gaps?{gaps:!0}:{}}}function lm(e){let t=new Map,n=new Map;for(let[o,i]of Object.entries(e))i.ok&&(t.set(o,i.series),typeof i.readings=="number"&&n.set(o,{readings:i.readings,averaged:i.averaged===!0}));return{series:t,readings:n}}async function dm(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${I}/statistics_series`,requests:t})).results}async function cm(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${I}/list_items`,requests:t})).results}function um(e){let t={};for(let[n,o]of no(e))t[n]=o;return{requests:t,signature:JSON.stringify(t)}}function pm(e){let t=new Map;for(let[n,o]of Object.entries(e))o.ok&&t.set(n,JSON.stringify({items:o.items,total:o.total}));return t}function hm(e,t=()=>!0){let n={};for(let i of Nn(e))t(i.entityId)&&(n[i.key]=gc(i));let o={};for(let i of zn(e))t(i.entityId)&&(o[i.key]=xc(i));return{history:n,statistics:o,signature:JSON.stringify([n,o])}}var mm={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",list:"#c0ca33",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},gm={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",list:"List",shape:"Shape",image:"Picture",tap:"Tap zone",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},xm=["text","icon","gauge","chart","timeline","list","shape","image","tap"],ym={content:"var(--wa-hue-blue)",look:"var(--wa-hue-green)",numbers:"var(--wa-hue-orange)",position:"var(--wa-hue-pink)",states:"var(--wa-hue-yellow)",tap:"var(--wa-hue-red)",home:"var(--wa-hue-blue)",place:"var(--wa-hue-grey)",complication:"var(--wa-hue-blue)",group:"var(--wa-hue-green)",locked:"var(--wa-hue-red)"},Gt={pages:"var(--wa-hue-blue)",layers:"var(--wa-hue-green)",values:"var(--wa-hue-red)"};function yc(e){switch(e){case"text":return y`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return y`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return y`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return y`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return y`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return y`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return y`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return y`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return y`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return y`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"list":return y`<circle cx="5.5" cy="7" r="1.6" /><circle cx="5.5" cy="12" r="1.6" /><circle cx="5.5" cy="17" r="1.6" /><path d="M10 7H19M10 12H19M10 17H19" />`;case"chartDots":return y`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":case"menu":return y`<path d="M4 7H20M4 12H20M4 17H20" />`;case"note":return y`<path d="M14 3.5H7A2 2 0 0 0 5 5.5V18.5A2 2 0 0 0 7 20.5H17A2 2 0 0 0 19 18.5V8.5Z" /><path d="M14 3.5V8.5H19" /><path d="M8.5 13H15.5M8.5 16.5H13" />`;case"chartTimes":case"imageTime":case"clock":return y`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return y`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return y`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return y`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"radial":return y`<circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="4.5" r="1.8" /><circle cx="19.5" cy="12" r="1.8" /><circle cx="12" cy="19.5" r="1.8" /><circle cx="4.5" cy="12" r="1.8" /><circle cx="17.3" cy="6.7" r="1.4" /><circle cx="6.7" cy="17.3" r="1.4" />`;case"pages":return y`<rect x="3" y="7" width="12" height="13" rx="2" /><path d="M8 4h11a2 2 0 0 1 2 2v11" />`;case"grip":return y`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return y`<path d="M6 9L12 15L18 9" />`;case"plus":return y`<path d="M12 5V19M5 12H19" />`;case"braces":return y`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return y`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"info":return y`<circle cx="12" cy="12" r="8.5" /><path d="M12 11V16.5" /><path d="M12 7.6V7.8" />`;case"globe":return y`<circle cx="12" cy="12" r="8.5" /><path d="M3.5 12H20.5" /><path d="M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17" />`;case"download":return y`<path d="M12 4V15" /><path d="M7 10L12 15L17 10" /><path d="M5 20H19" />`;case"check":return y`<path d="M5 12.5L9.5 17L19 7.5" />`;case"arrow":return y`<path d="M5 12H19" /><path d="M13 6L19 12L13 18" />`;case"guides":return y`<path d="M12 3V21" /><rect x="4" y="6" width="8" height="4.5" rx="1.3" /><rect x="12" y="13.5" width="8" height="4.5" rx="1.3" />`;case"paste":return y`<rect x="6" y="4.5" width="12" height="16" rx="2" /><path d="M9 4.5V3.5H15V4.5" /><path d="M9 11H15M9 15H13" />`;case"watch":return y`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"phone":return y`<rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M10.5 5.5H13.5" />`;case"foldAll":return y`<path d="M4 12H20M8.5 3.5L12 7L15.5 3.5M8.5 20.5L12 17L15.5 20.5" />`;case"unfoldAll":return y`<path d="M4 12H20M8.5 7L12 3.5L15.5 7M8.5 17L12 20.5L15.5 17" />`;case"compact":return y`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return y`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"grid":return y`<rect x="3.5" y="4" width="7.5" height="7" rx="1.6" /><rect x="13" y="4" width="7.5" height="7" rx="1.6" /><rect x="3.5" y="13" width="7.5" height="7" rx="1.6" /><rect x="13" y="13" width="7.5" height="7" rx="1.6" />`;case"lock":return y`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return y`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return y`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return y`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return y`<path d="M6 14L12 8L18 14" />`;case"down":return y`<path d="M6 10L12 16L18 10" />`;case"left":return y`<path d="M14 6L8 12L14 18" />`;case"right":return y`<path d="M10 6L16 12L10 18" />`;case"show":return y`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return y`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return y`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return y`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return y`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return y`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return y`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return y`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return y`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return y`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`;case"checklist":return y`<rect x="3" y="4" width="7" height="7" rx="1.8" /><path d="M4.9 7.4L6.3 8.8L8.4 6.4" />
        <rect x="3" y="13" width="7" height="7" rx="1.8" /><path d="M4.9 16.4L6.3 17.8L8.4 15.4" />
        <path d="M13.5 7.5H21M13.5 16.5H21" />`;case"home":return y`<path d="M4 11.5L12 4.5L20 11.5" /><path d="M6.5 9.5V19.5H17.5V9.5" /><path d="M10.2 19.5V14.8H13.8V19.5" />`;case"thumbSmall":return y`<rect x="3" y="9" width="6" height="6" rx="1.5" /><path d="M12.5 12H21" />`;case"thumbMedium":return y`<rect x="3" y="6.5" width="10" height="11" rx="2" /><path d="M16.5 12H21" />`;case"thumbLarge":return y`<rect x="3" y="4" width="14" height="16" rx="2.5" /><path d="M19.5 12H21" />`;case"alignLeft":return y`<path d="M4 3V21" /><rect x="8" y="6" width="11" height="4" rx="1" /><rect x="8" y="14" width="6" height="4" rx="1" />`;case"alignCenterX":return y`<path d="M12 3V6M12 10V14M12 18V21" /><rect x="5" y="6" width="14" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" />`;case"alignRight":return y`<path d="M20 3V21" /><rect x="5" y="6" width="11" height="4" rx="1" /><rect x="10" y="14" width="6" height="4" rx="1" />`;case"alignTop":return y`<path d="M3 4H21" /><rect x="6" y="8" width="4" height="11" rx="1" /><rect x="14" y="8" width="4" height="6" rx="1" />`;case"alignCenterY":return y`<path d="M3 12H6M10 12H14M18 12H21" /><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="8" width="4" height="8" rx="1" />`;case"alignBottom":return y`<path d="M3 20H21" /><rect x="6" y="5" width="4" height="11" rx="1" /><rect x="14" y="10" width="4" height="6" rx="1" />`;case"alignCenter":return y`<rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M12 3V7M12 17V21M3 12H7M17 12H21" />`;case"more":return y`<circle cx="6" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="18" cy="12" r="1.3" />`}}function wr(e){return O`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${yc(e)}</svg>`}var vr=C`
      background:
        linear-gradient(var(--lo-fill), var(--lo-fill)) padding-box,
        linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 33%, transparent) 30%,
          var(--lo-mid) 62%, color-mix(in srgb, var(--c) 25%, transparent) 100%) border-box;
      border: 1.5px solid transparent;
`,Ce=C`
      background: var(--lo-fill);
      border: 1px solid color-mix(in srgb, var(--c) 60%, var(--wa-card));
`,kr=C`
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
    /* Top bar: Browse, a divider, New, Import and Share at the left, then
       sync, ···, Save and its caption, the editor switches and the help. */
    header, .wa-bar { gap: 6px; min-height: 46px; border-bottom: 1px solid var(--wa-line); margin-bottom: 6px; }
    .picker > button.tb-browse {
      --c: var(--wa-hue-blue); --lo-fill: var(--wa-card); --lo-mid: var(--wa-go-mid);
      min-width: 0; max-width: none; height: 28px; gap: 7px; padding: 0 9px 0 10px; font-size: 13px; font-weight: 600;
      border-radius: 6px; box-shadow: none;
      ${Ce}
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
    /* New, Import and Share wear the lit outline, each in its own hue, with
       no fill of color: green to make one, purple to bring one in, yellow to
       send one out. Browse, before them, is blue. */
    button.tb-btn.tb-new { --c: var(--wa-hue-green); display: inline-flex; align-items: center; gap: 5px; padding: 0 11px 0 9px; }
    button.tb-btn.tb-new svg { width: 13px; height: 13px; }
    button.tb-btn.tb-import { --c: var(--wa-hue-purple); }
    button.tb-btn.tb-share { --c: var(--wa-hue-yellow); }
    button.tb-btn.tb-new, button.tb-btn.tb-import, button.tb-btn.tb-share {
      --lo-fill: var(--wa-card);
      background: var(--lo-fill); border: 1px solid color-mix(in srgb, var(--c) 60%, var(--wa-card));
    }
    button.tb-btn.tb-new:hover:not(:disabled), button.tb-btn.tb-import:hover:not(:disabled), button.tb-btn.tb-share:hover:not(:disabled) {
      --lo-fill: var(--wa-hover);
      background: var(--lo-fill);
    }
    .tb-saved { font-size: 12px; color: var(--wa-muted); white-space: nowrap; padding: 0 4px; }
    header.stacked .tb-saved, header.stacked .tb-pen, header.stacked > .tb-div,
    .wa-bar.stacked .tb-saved, .wa-bar.stacked .tb-pen, .wa-bar.stacked > .tb-div { display: none; }
    /* Stacked (a phone, or a narrow window), the bar is two tidy rows rather
       than three ragged ones: what is done to the draft on top (Browse, undo,
       redo, Save, help), and where it has got to underneath (the sync pill,
       Share, ···). The pill keeps its words whole. The empty ::after is the line break: a full
       width item of no height, so the rows carry their own margins instead
       of a row gap that would count it twice. */
    header.stacked, .wa-bar.stacked { row-gap: 0; padding-block: 4px; }
    header.stacked > *, .wa-bar.stacked > * { margin-block: 4px; }
    header.stacked::after, .wa-bar.stacked::after { content: ""; order: 1; flex: 0 0 100%; height: 0; margin: 0; }
    header.stacked > .tb-sync, header.stacked > button.tb-btn:not(.tb-more), header.stacked > .side-menu,
    .wa-bar.stacked > .tb-sync, .wa-bar.stacked > button.tb-btn:not(.tb-more), .wa-bar.stacked > .side-menu { order: 2; }
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
`,Cr=C`
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
`,Sr=C`
    button.help {
      font: inherit; font-size: 13px; font-weight: 600; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
      display: inline-grid; place-items: center; padding: 0;
      border: 0; background: var(--wa-card); color: var(--wa-ink);
      transition: background-color .12s ease-out, color .12s ease-out;
    }
    button.help:hover { background: var(--wa-hover); color: var(--wa-ink); }
    button.help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,Ar=C`
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
`,Tr=C`
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
`,Er=C`
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
    /* Outlined, so it never reads as one more filled tag beside tap and
       states: it is a job, and a click opens it. */
    .badge.need {
      font-family: inherit; line-height: 1; border: 1px solid var(--wa-need); color: var(--wa-need);
      background: color-mix(in srgb, var(--wa-need) 12%, transparent);
    }
    button.badge.need { cursor: pointer; }
    button.badge.need:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-need) 24%, transparent); }
    button.badge.need:disabled { cursor: default; }
`,_r=C`
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
`,Fr=C`
    /* Left column cards: Pages, Layers and Shared values. Each wears its hue
       in three places only: the lit outline, the filled chip behind its title
       glyph, and nothing else in it. The fill is the plain card. */
    .card.lc {
      --c: var(--wa-accent); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
      padding: 0; border-radius: var(--wa-lc-r); box-shadow: none;
      ${vr}
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
      ${Ce}
    }
    button.lc-btn:hover:not(:disabled) { --lo-fill: var(--wa-hover); ${Ce} }
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
    .pages-card .lc-note { margin: 8px 12px 0; }
    .pages-card .page-tour-bar { margin: 0 12px 10px; }
    /* The Layers card's filter line, and the rows under it. */
    .lc-filter { display: flex; align-items: center; gap: 6px; min-height: 30px; padding: 0 10px; }
    .lc-filter .lc-sub { white-space: normal; }
    .lc-filter button.lc-ghost { margin-left: auto; }
    .lc-filter button.lc-ghost + button.lc-ghost { margin-left: 0; }
`,Hr=C`
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
`,Lr=C`
    /* Background: its caption where a layer's badges sit. */
    .layer.pinned .ground-cap { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .layer.pinned.ground .grip { visibility: hidden; }
`,Mr=C`
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
`,Ir=C`
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
`,Rr=C`
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
`,$r=C`
    .tint-dot {
      display: inline-block; flex: none; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: -1px;
      background: var(--sw); box-shadow: inset 0 0 0 1px rgba(128,128,128,.5);
    }
    button.case-pick .tint-dot { margin-right: 0; }
    .tint-dot.full { background: conic-gradient(#FF453A 0 25%, #FFD60A 0 50%, #30D158 0 75%, #0A84FF 0); }
`,Pr=C`
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
`,Am=C`
      /* A see-through Background's checkerboard (.layer .thumb.clear). */
      --wa-dark-check-a: #2a2a2e;
      --wa-dark-check-b: #1a1a1d;
`,Tm=C`
    /* Canvas column: quiet header, tool strip, zoomable stage, values bar, first run. */
    /* The left cards' hues: Pages blue, Layers green, Shared values red
       (LEFT_CARD_COLOR in kinds.ts), from the palette the panel sets. */
    :host, .wa-chrome {
      --wa-lc-pages: ${Se(Gt.pages)};
      --wa-lc-layers: ${Se(Gt.layers)};
      --wa-lc-values: ${Se(Gt.values)};
    }
    .wa-chrome, .canvas-card {
      --wa-float-bg: var(--wa-card);
      --wa-float-line: var(--wa-line);
      --wa-float-shadow: none;
      --wa-float-sep: var(--wa-line-strong);
      --wa-hint: var(--wa-muted);
      --wa-chip-bg: var(--wa-card);
      --wa-chip-line: transparent;
      --wa-live: var(--wa-hue-green);
      --wa-testing: var(--wa-hue-orange);
      /* On the black face, in either skin. */
      --wa-face-muted: #8e8e93;
    }
`,Nr=C`
    .column.canvas > .card.canvas-card { min-height: 440px; container: cvcard / inline-size; }
    /* The head wraps rather than squeezes. It used to be one fixed 48px line
       with every part allowed to shrink, so in a middling width the device
       chips were clipped and the shape's name cut to nothing, with no sign
       anything was missing. Now each part (the name, the devices, the shape,
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
    /* The whole-complication actions: quiet outlined buttons that read as one
       set with the device chips beside them. Delete goes red, and while it is
       armed the choices stand in its place. */
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
    /* Add to a device makes something, so it wears the green lit outline the
       other Add buttons do. */
    .add-tool > button.cv-act {
      --c: var(--wa-hue-green); --lo-fill: var(--wa-card); --lo-mid: var(--wa-go-mid);
      height: 24px; padding: 0 9px;
      ${Ce}
    }
    .add-tool > button.cv-act:hover:not(:disabled), .add-tool > button.cv-act[aria-expanded="true"] { --lo-fill: var(--wa-hover); ${Ce} }
    button.cv-act .caret { display: inline-flex; margin-right: -3px; color: var(--wa-hint); }
    button.cv-act .caret svg { width: 11px; height: 11px; }
`,zr=C`
    button.cv-act.icon { width: 26px; padding: 0; justify-content: center; }
    button.cv-act.icon svg.ui-icon { width: 15px; height: 15px; }
    /* Undo and redo are ink while there is a step to take, and faint when
       there is none. */
    button.cv-act.undo:disabled { opacity: 1; color: var(--wa-faint); }
    .cv-del { display: inline-flex; align-items: center; gap: 6px; flex: none; }
    /* Hairlines part the head's groups: the devices, the actions, Delete,
       and the ··· menu. */
    .cv-div { width: 1px; height: 20px; flex: none; background: var(--wa-line); }
    .cv-devices { display: inline-flex; align-items: center; gap: 6px; flex: 0 8 auto; min-width: 0; }
    .case-tool.add-tool .pop-menu { left: 0; right: auto; min-width: 230px; }
    .case-tool.add-tool .place-note { padding: 6px 10px 4px; font-size: 11px; color: var(--wa-muted); }
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
    /* Several devices wrap onto more lines rather than hide past the edge. */
    .cv-head .doc-on { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; row-gap: 6px; flex: 0 1 auto; min-width: 0; }
    .cv-head .cv-devices { flex-wrap: wrap; row-gap: 6px; }
    .cv-head .doc-chip {
      height: 28px; gap: 8px; padding: 0 8px 0 10px; border-radius: 6px; min-width: 0; flex: 0 1 auto;
      background: var(--wa-chip-bg); border: 1px solid var(--wa-chip-line);
      font-size: 13px; font-weight: 500; color: var(--wa-ink);
    }
    .cv-head .doc-chip > svg { width: 13px; height: 13px; flex: none; }
    /* A device chip wears its person's color, the one Browse gives that
       person's tabs and sections (placeColorVar), so a device is one color
       everywhere: a low wash of it over the card and a thin edge of it. The
       glyph is the hue pulled a quarter toward the ink, the name is ink.
       Unassigned is nobody's, so it stays a plain card with a visible edge. */
    .cv-head .doc-chip.hued {
      background: color-mix(in srgb, var(--chip-c) 18%, var(--wa-card));
      border-color: color-mix(in srgb, var(--chip-c) 60%, var(--wa-card));
    }
    .cv-head .doc-chip.hued > svg { color: color-mix(in srgb, var(--chip-c) 75%, var(--wa-ink)); opacity: 1; }
    .cv-head .doc-chip:not(.hued) { border-color: var(--wa-line-strong); }
    .cv-head .doc-chip-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    /* The x that takes the design off a device is always there, quiet, and
       goes red only under the pointer or while it is armed. */
    .cv-head .doc-chip button.doc-trash {
      width: 18px; height: 18px; margin: 0; align-self: center; border: 0; border-radius: 9px;
      background: var(--wa-raise); color: var(--wa-ink); opacity: .85; overflow: hidden; cursor: pointer;
      transition: opacity .12s ease-out;
    }
    .cv-head .doc-chip button.doc-trash:hover:not(:disabled), .cv-head .doc-chip button.doc-trash:focus-visible { opacity: 1; color: #FF453A; background: color-mix(in srgb, #FF453A 16%, transparent); }
    .cv-head .doc-chip button.doc-trash:disabled { opacity: .3; cursor: default; }
    .cv-head .doc-chip button.doc-trash.armed { width: auto; padding: 0 7px; background: #FF453A; color: #fff; }
    /* A narrow canvas (a phone, or a column dragged in) cannot hold the head
       on one line: "Add to a device" was drawn over the shape's name and the
       Duplicate button. It folds to two rows instead: the name and its shape
       with the whole-document actions, then the devices. The ::after is the
       line break, a full width item of no height. */
    @container cvcard (max-width: 560px) {
      .cv-head { padding: 6px 12px 8px; column-gap: 8px; }
      .cv-head::after { content: ""; order: 3; flex: 0 0 100%; height: 0; }
      .cv-head .cv-slash { display: none; }
      .cv-head .tb-name { order: 0; flex: 1 1 0; }
      .cv-head .cv-what { order: 1; }
      .cv-head .cv-acts { order: 2; gap: 8px; }
      .cv-head .cv-where { order: 4; flex: 0 1 auto; }
    }
`,Dr=C`
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
`,Or=C`
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
`,Vr=C`
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
`,Br=C`
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
`,Ur=C`
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
`,Wr=C`
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
      ${vr}
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
`,Gr=C`
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
      ${Ce}
    }
    .sec-h button.sec-act:hover:not(:disabled) { --lo-fill: var(--wa-hover); ${Ce} }
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
`,Em={topBar:kr,picker:Cr,helpButton:Sr,columns:Ar,card:Tr,rows:Er,rowsTail:_r,leftCards:Fr,leftCardsTail:Hr,groundCap:Lr,richRows:Mr,canvasColumn:Ir,popMenu:Rr,tintDot:$r,sharedValueRows:Pr,canvasHead:Nr,canvasHeadTail:zr,stage:Dr,stageTools:Or,stageToolsTail:Vr,valuesFoot:Br,inspectorHead:Ur,sectionCard:Wr,sectionCardTail:Gr},_m=C`${kr}${Cr}${Sr}`,Fm=C`${Ar}${Tr}`,Hm=C`${Fr}${Hr}${Rr}`,Lm=C`${Er}${_r}${Lr}${Mr}${Pr}`,Mm=C`${Ir}${$r}${Nr}${zr}${Dr}${Or}${Vr}${Br}`,Im=C`${Ur}${Wr}${Gr}`;function Rm(e,t){let{open:n,onToggle:o}=e;return O`<section class="sec" data-sec=${e.id??F} data-open=${n?"true":"false"} data-help="on" style=${`--c:${e.color}`}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${n?"true":"false"} @click=${o}
      @keydown=${i=>{i.target===i.currentTarget&&(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),o())}}>
      <span class="swatch">${e.icon}</span>
      <span class="tt"><h4>${e.title}${e.dot?O`<span class="sec-dot" aria-hidden="true"></span>`:F}</h4>${e.summary?O`<span class="sum">${e.summary}</span>`:F}</span>
      <span class="chev">${wr("chevron")}</span>
    </div>
    ${n?O`<div class="sec-b">${e.help?O`<p class="hint">${e.help}</p>`:F}${t}</div>`:F}
  </section>`}function Nm(e,t,n){let o=n-t,i=o>0&&Number.isFinite(e)?(e-t)/o:0;return`--p:${Math.round(Math.max(0,Math.min(1,i))*1e3)/10}%`}var bc=C`
    /* Buttons: one quiet neutral shape everywhere, the ink fill kept for the
       single action that matters, and a soft ring on focus instead of a hard
       outline. No button is filled with a hue. */
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 13px; font-weight: 600; padding: 0 11px; min-height: 28px; border-radius: 6px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-field); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .toolbar button:hover:not(:disabled) { border-color: transparent; background: var(--wa-hover); }
    button.small:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); background: var(--wa-hover); }
    button.small:where(:not(.primary, .danger)) { border-color: var(--wa-line-strong); }
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
       nothing to save. Once there is something and it can be saved, it is
       solid palette green with a soft, still green glow, so it is the one
       thing in the bar asking to be pressed. The words are --wa-chip-ink,
       white on the light skin's deep green and black on the dark skin's
       bright one, which clears 4.5:1 in both. Unsaved but not savable yet
       (no slot, a refusal, mid-save) keeps the amber halo it had. The
       Watch settings page's Save carries the same two classes and so the
       same green, through the unscoped rule. */
    header button.save, .wa-bar button.save { min-height: 28px; height: 28px; padding: 0 12px; }
    header button.save:not(.dirty), .wa-bar button.save:not(.dirty) { background: var(--wa-card); color: var(--wa-faint); border-color: var(--wa-line-strong); opacity: 1; }
    header button.save.dirty, .wa-bar button.save.dirty { box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning-color, #e0a100) 35%, transparent); }
    button.primary.save.dirty:not(:disabled) {
      --wa-save-glow: 0 0 0 1px color-mix(in srgb, var(--wa-hue-green) 45%, transparent), 0 0 12px 1px color-mix(in srgb, var(--wa-hue-green) 40%, transparent);
      background: var(--wa-hue-green); color: var(--wa-chip-ink); border-color: transparent; box-shadow: var(--wa-save-glow);
    }
    button.primary.save.dirty:not(:disabled):hover { background: color-mix(in srgb, var(--wa-hue-green) 88%, var(--wa-ink)); }
    button.primary.save.dirty:not(:disabled):focus-visible { box-shadow: var(--wa-ring), var(--wa-save-glow); }
    button.danger { color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent); background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent); }
    button.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
    button.small { padding: 0 9px; font-size: 13px; min-height: 26px; border-radius: 6px; }
    button.small.lined { border-color: var(--wa-line-strong); }
    button.small.lined:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    /* An icon and its words on one line. Without this the icon, drawn as a
       block, sits on a line of its own above the words. */
    button.small:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 5px; }
    button.small > svg.ui-icon { width: 13px; height: 13px; flex: none; }
    /* An Extras switch whose layer is already on the chart: pressed, not greyed.
       Clicking it again takes the layer off. */
    .adders button.small.on, .adders button.small.on:disabled { display: inline-flex; align-items: center; gap: 5px; opacity: 1;
      color: var(--wa-ink); border-color: var(--wa-line-strong); background: var(--wa-raise); }
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

    /* Native controls: one field-grey well; a select wears a hairline so it reads
       as a box that opens, brighter under the pointer, with a neutral ring on focus, so a select in the header and
       a number field in the inspector read as one family. */
    select {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); cursor: pointer; height: 28px;
      padding: 0 26px 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background-color: var(--wa-input);
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a8f' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center; background-size: 12px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    select:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input[type=text], input[type=number], input[type=search], input[type=url], textarea {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); min-height: 28px;
      padding: 4px 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-input);
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    input[type=text]:hover:not(:disabled), input[type=number]:hover:not(:disabled), textarea:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    input[type=text]:focus-visible, input[type=number]:focus-visible, input[type=search]:focus-visible, textarea:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input::placeholder, textarea::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
    /* A box that is the one thing left to do. An empty Custom SVG layer draws
       nothing at all, and a field that looks like every other field does not
       say so: the dashed accent border points at where to paste before the
       hint under it is read. The tint goes as soon as something lands. */
    input.needs, textarea.needs {
      border-color: color-mix(in srgb, var(--wa-accent) 60%, var(--wa-line));
      border-style: dashed;
      background: color-mix(in srgb, var(--wa-accent) 8%, var(--wa-input));
    }
    input.needs:focus-visible, textarea.needs:focus-visible { border-style: solid; }
    /* Every checkbox is a switch: a pill that slides, since a tick box is the
       one control that still looked like a form from 2009. Grey in every
       card, never the card's hue: light grey when on, dark grey when off,
       with a white knob either way. */
    input[type=checkbox] {
      appearance: none; -webkit-appearance: none; margin: 0; cursor: pointer; flex: none;
      width: 32px; height: 18px; border-radius: 999px; position: relative;
      background: var(--wa-switch-off); border: 0;
      transition: background-color .15s ease-out, border-color .15s ease-out;
    }
    input[type=checkbox]::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%;
      background: #fff; box-shadow: var(--wa-seg-shadow); transition: transform .15s ease-out;
    }
    input[type=checkbox]:checked { background: var(--wa-switch-on); border-color: transparent; }
    input[type=checkbox]:checked::after { transform: translateX(14px); }
    input[type=checkbox]:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input[type=checkbox]:disabled { opacity: .45; cursor: default; }
    /* A slider: a thin grey track filled to the value in a lighter grey, and
       a white knob with a ring of the ground it sits on and a thin grey edge.
       The fill needs the value as a percent in --p, which the slider's own
       markup writes; Firefox draws it from the value itself. */
    input[type=range] {
      -webkit-appearance: none; appearance: none; height: 18px; margin: 0; padding: 0; cursor: pointer;
      background: transparent; accent-color: var(--wa-range-fill);
    }
    input[type=range]::-webkit-slider-runnable-track {
      height: 6px; border-radius: 3px;
      background: linear-gradient(var(--wa-range-fill), var(--wa-range-fill)) 0 0 / var(--p, 0%) 100% no-repeat, var(--wa-range-track);
    }
    input[type=range]::-moz-range-track { height: 6px; border-radius: 3px; background: var(--wa-range-track); }
    input[type=range]::-moz-range-progress { height: 6px; border-radius: 3px; background: var(--wa-range-fill); }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none; box-sizing: border-box; width: 18px; height: 18px; margin-top: -6px; border-radius: 50%;
      background: #fff; border: 2px solid var(--wa-range-ring, var(--wa-card)); box-shadow: 0 0 0 1.5px var(--wa-range-outline);
    }
    input[type=range]::-moz-range-thumb {
      box-sizing: border-box; width: 18px; height: 18px; border-radius: 50%;
      background: #fff; border: 2px solid var(--wa-range-ring, var(--wa-card)); box-shadow: 0 0 0 1.5px var(--wa-range-outline);
    }
    input[type=range]:focus-visible { outline: none; }
    input[type=range]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 1.5px var(--wa-range-outline), 0 0 0 4px color-mix(in srgb, var(--wa-accent) 40%, transparent); }
    input[type=range]:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 1.5px var(--wa-range-outline), 0 0 0 4px color-mix(in srgb, var(--wa-accent) 40%, transparent); }
    input[type=range]:disabled { opacity: .45; cursor: default; }
    input[type=color] { border: 1px solid var(--wa-line); border-radius: 6px; background: var(--wa-input); padding: 2px; cursor: pointer; }
`,wc=C`
    /* Two small segmented controls in the Layers title: how big the row
       pictures are, and how much each row says. */
    .seg {
      display: inline-flex; flex: none; height: 24px; padding: 2px; gap: 2px; border: 0;
      border-radius: 6px; background: var(--wa-field); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    }
    .seg button {
      font: inherit; font-size: 11px; font-weight: 600; letter-spacing: .02em; line-height: 1;
      padding: 0 6px; min-width: 22px; border: 0; border-radius: 5px; background: transparent; color: var(--wa-muted);
      cursor: pointer; display: grid; place-items: center;
      transition: color .12s ease-out, background-color .12s ease-out, box-shadow .12s ease-out;
    }
    .seg button:hover { color: var(--wa-ink); }
    .seg button.on { color: var(--wa-ink); background: var(--wa-seg-on); box-shadow: var(--wa-seg-shadow); outline: 1px solid color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); outline-offset: -1px; }
    .seg button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .seg button svg.ui-icon { width: 13px; height: 13px; }
    /* The form-sized segmented control: a setting with two to four choices
       shows them all, the way a dropdown never can. Buttons share the width
       evenly and clip a label rather than wrap it, so a row never grows a
       second line. The lit choice is a raised grey, never a hue. */
    .seg.wide { display: flex; width: 100%; min-width: 0; height: 28px; border-radius: 6px; background: var(--wa-field); box-shadow: inset 0 0 0 1px var(--wa-line-strong); }
    .seg.wide button {
      flex: 1 1 0; min-width: 0; padding: 0 4px; border-radius: 5px;
      font-size: 12px; font-weight: 500; letter-spacing: 0; line-height: 24px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: center;
      color: var(--wa-ink);
    }
    .seg.wide button.on { color: var(--wa-ink); font-weight: 600; background: var(--wa-seg-on); box-shadow: var(--wa-seg-shadow); outline: 1px solid color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); outline-offset: -1px; }
    /* The choice a setting falls back to while it has none of its own. */
    .seg.wide button.inh { color: var(--wa-ink); outline: 1px dashed var(--wa-muted); outline-offset: -3px; }
    .seg.wide button:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
    .seg.wide button:disabled, .seg.wide button:disabled:hover { color: var(--wa-muted); opacity: .38; cursor: not-allowed; }
    .field.seg-field { align-items: center; }
`,vc=C`
    /* The reset dot. One control, two places: in the gutter left of a changed
       setting's title, and beside a card's title for everything the card owns.
       It is drawn only while something is away from its default, so the dots
       are the list of what someone changed. The pseudo-element widens the hit
       area without widening the dot. */
    /* The dot wears the hue of the card it is in (--wa-sec, which a section
       card sets), one of the three places a card's hue shows. */
    button.reset-dot {
      position: absolute; left: -7px; top: 12.5px; width: 5px; height: 5px; margin: 0; padding: 0;
      border: 0; border-radius: 50%; background: var(--wa-sec, var(--wa-accent)); cursor: pointer; flex: none;
    }
    button.reset-dot::after { content: ""; position: absolute; inset: -7px; }
    button.reset-dot:hover, button.reset-dot:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-sec, var(--wa-accent)) 32%, transparent); }
`,kc=C`
    button.link { font: inherit; background: none; border: none; color: var(--wa-accent); cursor: pointer; padding: 0; }
    /* A watch editor's "Start fresh instead" while the iPhone's move may
       still come: small and quiet, under the waiting line. */
    button.link.start-fresh { align-self: flex-start; font-size: 13px; color: var(--wa-muted); text-decoration: underline; text-underline-offset: 2px; }
    button.link.start-fresh:hover:not(:disabled) { color: var(--wa-label, var(--wa-muted)); }
    button.link.start-fresh:disabled { opacity: 0.5; cursor: default; }
`,Cc=C`
    /* Form rows, the way a property sheet reads: the title in a fixed column
       on the left, the control on the right, one row per setting and every
       row at least 30px, so a card reads as an even list rather than a form.
       Contexts that lay fields out another way (the dialogs, the bars under
       the preview) set their own display over this. */
    .field {
      position: relative; display: grid; grid-template-columns: var(--wa-lab) minmax(0, 1fr); align-items: center;
      gap: 4px 8px; min-height: 30px; margin: 0; font-size: 12px;
    }
    .field > span { color: var(--wa-label, var(--wa-muted)); font-size: 12px; line-height: 1.25; min-width: 0; overflow-wrap: break-word; }
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
      height: 28px; min-height: 28px; padding: 0 9px; font-size: 13px; border-radius: 6px;
      border-color: var(--wa-line-strong); background-color: var(--wa-field);
    }
    :is(.sec-b, .value-pop) .field select { padding-right: 22px; background-position: right 6px center; background-size: 12px; }
    :is(.sec-b, .value-pop) .field textarea { font-size: 12px; padding: 5px 8px; border-radius: 6px; border-color: var(--wa-line-strong); background: var(--wa-field); }
    :is(.sec-b, .value-pop) .field input[type=number] { -moz-appearance: textfield; appearance: textfield; }
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-inner-spin-button,
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    :is(.sec-b, .value-pop) .field .ent-box input { padding-left: 28px; padding-right: 26px; }
    /* Focus is neutral, in a section card as anywhere else. */
    .field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
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
    .field.slider input[type=range] { flex: 1; min-width: 50px; height: 18px; margin: 0; }
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
    /* A color is one box: swatch, hex, and opacity in percent. */
    .color-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .color-box {
      flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; height: 28px; padding: 0 0 0 6px;
      border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field);
    }
    .color-box:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .color-box:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .color-box:has(input:disabled) { opacity: .5; }
    .color-swatch {
      position: relative; flex: none; width: 18px; height: 18px; border-radius: 50%; overflow: hidden; cursor: pointer;
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
       same way a color swatch does. */
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
`,Sc=C`
    /* Pairs and quads stack: each field is its own label-left row. */
    .grid2, .grid4 { display: block; }
    /* Two short choices on one row, the second titled in line. */
    .pair-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .pair-row > .seg.wide:first-of-type { flex: 1 1 auto; width: auto; }
    .pair-row > .seg.wide:last-of-type { flex: 0 0 64px; width: 64px; }
    .pair-row > span { position: relative; flex: none; padding-left: 8px; color: var(--wa-label, var(--wa-muted)); font-size: 12px; }
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
      .sec-b .seg.wide { height: auto; min-height: 28px; flex-wrap: wrap; }
      .sec-b .seg.wide button { flex: 1 0 auto; text-overflow: clip; }
      .sec-b .pair-row { flex-wrap: wrap; row-gap: 4px; }
      .sec-b .pair-row > .seg.wide:first-of-type { flex: 1 1 100%; }
    }
    .hint { font-size: 12px; line-height: 1.45; color: var(--wa-muted); margin: 4px 0; }
    .hint.warn { color: var(--wa-ink); }
    /* The one hint that is colored: a timed refresh is spending the redraw
       budget a tap on the face also needs, which is worth noticing. */
    .hint.budget { color: var(--warning-color, #ffa600); }
    /* The bare .err rule sits above .hint in this sheet, so a hint that is an
       error needs both class names to win the color. */
    .hint.err { color: var(--error-color, #db4437); }
`,Ac=C`
    /* Entity search, laid out the way Home Assistant's own entity list is: a
       glyph for the domain, the friendly name in full, and the things that
       tell two similar names apart (the room and the id) on a quieter second
       line. The type and the live state sit right, where the eye can run down
       one column instead of hunting.

       The glyph is the panel's own drawing, not Home Assistant's icon set, so
       a row still has a picture whatever the frontend ships. It only takes the
       accent color when the entity is doing something, which is what makes
       the one light that is on findable in a list of forty. */
    .entity-field { position: relative; }
    .ent-box { position: relative; display: flex; align-items: center; }
    .ent-box input { width: 100%; min-width: 0; padding-left: 32px; padding-right: 30px; color: var(--wa-ent); font-weight: 500; }
    .ent-box .ent-glass { position: absolute; left: 10px; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
    .ent-box .ent-glass svg { width: 14px; height: 14px; display: block; }
    .ent-box.open .ent-glass { color: var(--wa-accent); }
    /* A layer that can draw nothing until it names an entity: a chart on
       recorded history, a timeline, a picture. The empty box wears a ring in
       the entity color and keeps pulsing, so "why is my layer blank?" is
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
    /* A stand-in from a shared design, in the "pick entity" red, pulsing for
       the same reason the empty box does: it is the answer to "why does this
       layer look wrong?", marked where the answer goes. The shared value row
       that reads one wears the same pulse while a layer reading it is picked. */
    /* It opens with a bright flash, three hard beats of a thick ring, a wide
       halo and a red wash, to pull the eye across the screen, then settles
       into the quiet pulse. A click on the layer plays the flash again. */
    .ent-chosen.slot, .value-chip.slot { border-radius: 8px; box-shadow: inset 0 0 0 1px var(--wa-need); animation: wa-slot-flash .6s ease-out 3, wa-slot-pulse 1.8s ease-out 1.8s infinite; }
    .vrow.slot-lit { border-radius: 6px; animation: wa-slot-flash .6s ease-out 3, wa-slot-pulse 1.8s ease-out 1.8s infinite; }
    .column.inspector.slot-via-value :is(.ent-chosen, .value-chip).slot { animation: none; box-shadow: none; }
    .hint.need { color: var(--wa-need); }
    @keyframes wa-slot-flash {
      0% { background-color: color-mix(in srgb, var(--wa-need) 32%, transparent);
        box-shadow: inset 0 0 0 2px var(--wa-need), 0 0 0 0 color-mix(in srgb, var(--wa-need) 90%, transparent), 0 0 18px 2px color-mix(in srgb, var(--wa-need) 60%, transparent); }
      100% { background-color: color-mix(in srgb, var(--wa-need) 6%, transparent);
        box-shadow: inset 0 0 0 2px var(--wa-need), 0 0 0 10px color-mix(in srgb, var(--wa-need) 0%, transparent), 0 0 18px 2px color-mix(in srgb, var(--wa-need) 0%, transparent); }
    }
    @keyframes wa-slot-pulse {
      0% { box-shadow: inset 0 0 0 1px var(--wa-need), 0 0 0 0 color-mix(in srgb, var(--wa-need) 55%, transparent); }
      70% { box-shadow: inset 0 0 0 1px var(--wa-need), 0 0 0 7px color-mix(in srgb, var(--wa-need) 0%, transparent); }
      100% { box-shadow: inset 0 0 0 1px var(--wa-need), 0 0 0 0 color-mix(in srgb, var(--wa-need) 0%, transparent); }
    }
    @media (prefers-reduced-motion: reduce) { .ent-chosen.slot, .value-chip.slot, .vrow.slot-lit { animation: none; box-shadow: inset 0 0 0 2px var(--wa-need); } }
    @media (prefers-reduced-motion: reduce) { .column.inspector.slot-via-value :is(.ent-chosen, .value-chip).slot { box-shadow: none; } }
    /* A chosen entity: one row in place of the search box, exactly as tall as
       the box, so the label beside it and the rows under it never move when
       one swaps for the other. The name reads in the ordinary ink, the id
       after it is the quiet half and is cut first, the state sits right. The
       row is the edit target; the x beside it removes the entity. */
    .ent-anchor { position: relative; min-width: 0; }
    .ent-chosen {
      display: flex; align-items: center; height: 28px; min-width: 0; border-radius: 6px;
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
      border: 1px solid var(--wa-line); border-radius: 10px; margin-top: 6px; max-height: 340px; overflow: auto;
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
       here, so the color never has to be repeated by hand. */
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
`,Tc=C`
    @media (prefers-reduced-motion: reduce) { .ent-box.needs { animation: none; } }
`,zm=[bc,wc,vc,kc,Cc,Sc,Ac,Tc];var Ec="No connection to Home Assistant.";function jt(e,t){if(typeof e!="object"||e===null)return;let n=e[t];return typeof n=="string"&&n.trim()!==""?n.trim():void 0}function Om(e){if(typeof e=="string"&&e.trim()!=="")return{message:e.trim()};let t=typeof e=="object"&&e!==null?e.error:void 0,n=jt(e,"code")??jt(t,"code"),o=jt(e,"message")??jt(t,"message")??n??Ec;return n===void 0?{message:o}:{code:n,message:o}}function Vm(e){if(e.ok)return e.alreadySaved===!0?{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0;let t=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds pages for this watch. Start with an empty page again."};case"invalid":{let n=e.problems??[];return n.length>0?{kind:"err",text:`Not saved. Something in the pages is not right: ${n.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the pages${t===""?".":`: ${t}`}`}}case"busy":return{kind:"warn",text:"Already saving these pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${t===""?".":`: ${t}`}`}}}var jr="/cameras";function Wm(e){let t=e?.path??"";return t===jr||t.startsWith(`${jr}/`)}var Gm="https://docs.wrist-assistant.com/watch-app/cameras/#notification-snapshots",so;function jm(e){so=e}function Km(){return so?.dirty()??!1}function qm(){so?.drop()}var Kr,ao=!1;function _c(){return Kr??=import("./cameras-editor-VD2PCLC3.js").then(()=>{},e=>{throw ao=!0,e}),Kr}function Jm(e){let t=customElements.get("wa-cameras-editor")!==void 0;return!t&&!ao&&_c().then(e.onLoaded,e.onLoaded),t?O`<wa-cameras-editor .hass=${e.hass} ?narrow=${e.narrow}></wa-cameras-editor>`:O`<div class="wp-loading">
        ${ao?O`<span>The Cameras screen did not load. Reload the page to try again.</span>`:O`<span>Loading…</span>`}
      </div>`}export{Se as a,C as b,O as c,y as d,pe as e,F as f,Rc as g,So as h,Te as i,Ao as j,Xc as k,on as l,vu as m,da as n,ca as o,ku as p,Cu as q,Su as r,Au as s,Tu as t,Eu as u,_u as v,Fu as w,bn as x,L as y,ot as z,P as A,Mu as B,Iu as C,wn as D,ha as E,it as F,fa as G,Ht as H,ln as I,Fe as J,et as K,ii as L,vn as M,kn as N,Ca as O,Sa as P,ri as Q,ai as R,Cn as S,un as T,pn as U,hn as V,Ru as W,Ea as X,_a as Y,An as Z,Tn as _,Fa as $,Ha as aa,$u as ba,Pu as ca,si as da,La as ea,Nu as fa,Ma as ga,zu as ha,Na as ia,za as ja,Du as ka,Ou as la,Oa as ma,En as na,_n as oa,Fn as pa,Vu as qa,Bu as ra,Uu as sa,Wa as ta,Ga as ua,Wu as va,ja as wa,Ka as xa,Ct as ya,qa as za,Ja as Aa,Ya as Ba,Za as Ca,es as Da,ts as Ea,Mo as Fa,li as Ga,Gu as Ha,ns as Ia,Io as Ja,os as Ka,ju as La,di as Ma,ci as Na,ui as Oa,Ku as Pa,is as Qa,qu as Ra,Ju as Sa,Xu as Ta,Ln as Ua,Lt as Va,Mt as Wa,ds as Xa,cs as Ya,It as Za,Rt as _a,us as $a,ps as ab,Yu as bb,Zu as cb,Qu as db,pi as eb,hi as fb,fn as gb,ep as hb,bs as ib,Po as jb,tp as kb,np as lb,He as mb,Le as nb,ws as ob,G as pb,op as qb,vs as rb,ip as sb,rp as tb,ap as ub,ks as vb,Cs as wb,Ss as xb,sp as yb,lp as zb,As as Ab,Ts as Bb,Es as Cb,_s as Db,Fs as Eb,Hs as Fb,dp as Gb,Ls as Hb,Ms as Ib,$t as Jb,Is as Kb,cp as Lb,up as Mb,pp as Nb,hp as Ob,Me as Pb,fp as Qb,Pt as Rb,ee as Sb,te as Tb,bi as Ub,Ds as Vb,Os as Wb,Vs as Xb,wi as Yb,mp as Zb,vi as _b,Nt as $b,gp as ac,Bs as bc,Us as cc,Gs as dc,No as ec,zo as fc,xp as gc,Ks as hc,Js as ic,yp as jc,bp as kc,Si as lc,Ys as mc,Ai as nc,wp as oc,vp as pc,Zs as qc,Qs as rc,el as sc,tl as tc,kp as uc,nl as vc,ol as wc,On as xc,il as yc,rl as zc,Vn as Ac,Bn as Bc,al as Cc,sl as Dc,Cp as Ec,Ei as Fc,Sp as Gc,Ap as Hc,Pe as Ic,Un as Jc,Fi as Kc,Tp as Lc,Ep as Mc,_p as Nc,dl as Oc,Fp as Pc,Hp as Qc,Lp as Rc,Mp as Sc,ul as Tc,Ip as Uc,Rp as Vc,hl as Wc,$p as Xc,Pp as Yc,Np as Zc,zp as _c,Dp as $c,Op as ad,Vp as bd,Bp as cd,Up as dd,fl as ed,Ii as fd,Wp as gd,Gp as hd,Ri as id,Dt as jd,Do as kd,we as ld,Ot as md,$i as nd,Pi as od,jp as pd,Kp as qd,kl as rd,qp as sd,Jp as td,Xp as ud,Yp as vd,Zp as wd,Qp as xd,eh as yd,Cl as zd,th as Ad,nh as Bd,oh as Cd,ih as Dd,rh as Ed,X as Fd,Ie as Gd,ah as Hd,zl as Id,Bi as Jd,sh as Kd,Re as Ld,Vl as Md,lh as Nd,St as Od,Ul as Pd,qi as Qd,Ji as Rd,jl as Sd,Kl as Td,ql as Ud,dh as Vd,Yl as Wd,Ql as Xd,ed as Yd,td as Zd,nd as _d,id as $d,ch as ae,uh as be,ph as ce,E as de,hh as ee,fh as fe,mh as ge,gh as he,$ as ie,Xn as je,U as ke,xh as le,Yn as me,wd as ne,yh as oe,nr as pe,ne as qe,bh as re,wh as se,vh as te,W as ue,ir as ve,kd as we,Cd as xe,kh as ye,Ch as ze,Sh as Ae,Ah as Be,Th as Ce,M as De,Vt as Ee,Eh as Fe,_h as Ge,Fh as He,Ad as Ie,ar as Je,Hh as Ke,_d as Le,Fd as Me,Lh as Ne,D as Oe,A as Pe,sr as Qe,Hd as Re,lr as Se,Ld as Te,Mh as Ue,Md as Ve,Id as We,Rd as Xe,Ih as Ye,Rh as Ze,ve as _e,R as $e,$d as af,$h as bf,Oe as cf,Ph as df,Pd as ef,Q as ff,Nh as gf,zh as hf,cr as if,Dh as jf,_t as kf,Qn as lf,Oh as mf,pr as nf,Vh as of,Gd as pf,Bh as qf,Qo as rf,qd as sf,eo as tf,Uh as uf,le as vf,Wh as wf,Yd as xf,Gh as yf,jh as zf,Qd as Af,Kh as Bf,ec as Cf,qh as Df,Jh as Ef,Xh as Ff,Yh as Gf,Zh as Hf,tc as If,nc as Jf,oc as Kf,ic as Lf,rc as Mf,Qh as Nf,ef as Of,tf as Pf,Ut as Qf,sc as Rf,rf as Sf,cc as Tf,to as Uf,hc as Vf,af as Wf,mc as Xf,sf as Yf,uf as Zf,pf as _f,hf as $f,ff as ag,mf as bg,gf as cg,xf as dg,yf as eg,bf as fg,wf as gg,vf as hg,kf as ig,Cf as jg,Sf as kg,Af as lg,Tf as mg,Ef as ng,_f as og,Ff as pg,Hf as qg,Lf as rg,Mf as sg,If as tg,Rf as ug,$f as vg,Pf as wg,Nf as xg,zf as yg,Df as zg,Of as Ag,Vf as Bg,Bf as Cg,Uf as Dg,Wf as Eg,Gf as Fg,jf as Gg,Kf as Hg,qf as Ig,Jf as Jg,Xf as Kg,Yf as Lg,Zf as Mg,Qf as Ng,em as Og,tm as Pg,nm as Qg,om as Rg,im as Sg,rm as Tg,am as Ug,sm as Vg,lm as Wg,dm as Xg,cm as Yg,um as Zg,pm as _g,hm as $g,mm as ah,gm as bh,xm as ch,ym as dh,wr as eh,vr as fh,Ce as gh,Am as hh,Tm as ih,Em as jh,_m as kh,Fm as lh,Hm as mh,Lm as nh,Mm as oh,Im as ph,Rm as qh,Nm as rh,bc as sh,wc as th,vc as uh,kc as vh,Cc as wh,Sc as xh,Ac as yh,zm as zh,Om as Ah,Vm as Bh,jr as Ch,Wm as Dh,Gm as Eh,jm as Fh,Km as Gh,qm as Hh,Jm as Ih};
