var gt=globalThis,yt=gt.ShadowRoot&&(gt.ShadyCSS===void 0||gt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,an=Symbol(),Ao=new WeakMap,Ke=class{constructor(t,n,o){if(this._$cssResult$=!0,o!==an)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(yt&&t===void 0){let o=n!==void 0&&n.length===1;o&&(t=Ao.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Ao.set(n,t))}return t}toString(){return this.cssText}},Te=e=>new Ke(typeof e=="string"?e:e+"",void 0,an),C=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((o,i,r)=>o+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new Ke(n,e,an)},bt=(e,t)=>{if(yt)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let o=document.createElement("style"),i=gt.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=n.cssText,e.appendChild(o)}},sn=yt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let o of t.cssRules)n+=o.cssText;return Te(n)})(e):e;var{is:Ta,defineProperty:Aa,getOwnPropertyDescriptor:_a,getOwnPropertyNames:Ea,getOwnPropertySymbols:Fa,getPrototypeOf:Ha}=Object,xt=globalThis,_o=xt.trustedTypes,La=_o?_o.emptyScript:"",Ia=xt.reactiveElementPolyfillSupport,qe=(e,t)=>e,Je={toAttribute(e,t){switch(t){case Boolean:e=e?La:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},wt=(e,t)=>!Ta(e,t),Eo={attribute:!0,type:String,converter:Je,reflect:!1,useDefault:!1,hasChanged:wt};Symbol.metadata??=Symbol("metadata"),xt.litPropertyMetadata??=new WeakMap;var Z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Eo){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let o=Symbol(),i=this.getPropertyDescriptor(t,o,n);i!==void 0&&Aa(this.prototype,t,i)}}static getPropertyDescriptor(t,n,o){let{get:i,set:r}=_a(this.prototype,t)??{get(){return this[n]},set(a){this[n]=a}};return{get:i,set(a){let l=i?.call(this);r?.call(this,a),this.requestUpdate(t,l,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Eo}static _$Ei(){if(this.hasOwnProperty(qe("elementProperties")))return;let t=Ha(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(qe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(qe("properties"))){let n=this.properties,o=[...Ea(n),...Fa(n)];for(let i of o)this.createProperty(i,n[i])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[o,i]of n)this.elementProperties.set(o,i)}this._$Eh=new Map;for(let[n,o]of this.elementProperties){let i=this._$Eu(n,o);i!==void 0&&this._$Eh.set(i,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let i of o)n.unshift(sn(i))}else t!==void 0&&n.push(sn(t));return n}static _$Eu(t,n){let o=n.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let o of n.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,o){this._$AK(t,o)}_$ET(t,n){let o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(i!==void 0&&o.reflect===!0){let r=(o.converter?.toAttribute!==void 0?o.converter:Je).toAttribute(n,o.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,n){let o=this.constructor,i=o._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=o.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Je;this._$Em=i;let l=a.fromAttribute(n,r.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,n,o,i=!1,r){if(t!==void 0){let a=this.constructor;if(i===!1&&(r=this[t]),o??=a.getPropertyOptions(t),!((o.hasChanged??wt)(r,n)||o.useDefault&&o.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,o))))return;this.C(t,n,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:o,reflect:i,wrapped:r},a){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??n??this[t]),r!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(n=void 0),this._$AL.set(t,n)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[i,r]of o){let{wrapped:a}=r,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,r,l)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(n)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[qe("elementProperties")]=new Map,Z[qe("finalized")]=new Map,Ia?.({ReactiveElement:Z}),(xt.reactiveElementVersions??=[]).push("2.1.2");var dn=globalThis,Fo=e=>e,vt=dn.trustedTypes,Ho=vt?vt.createPolicy("lit-html",{createHTML:e=>e}):void 0,cn="$lit$",Q=`lit$${Math.random().toFixed(9).slice(2)}$`,un="?"+Q,Ma=`<${un}>`,pe=document,Ye=()=>pe.createComment(""),Ze=e=>e===null||typeof e!="object"&&typeof e!="function",pn=Array.isArray,$o=e=>pn(e)||typeof e?.[Symbol.iterator]=="function",ln=`[ 	
\f\r]`,Xe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Lo=/-->/g,Io=/>/g,ce=RegExp(`>|${ln}(?:([^\\s"'>=/]+)(${ln}*=${ln}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Mo=/'/g,Ro=/"/g,No=/^(?:script|style|textarea|title)$/i,hn=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),$=hn(1),b=hn(2),ju=hn(3),he=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),Po=new WeakMap,ue=pe.createTreeWalker(pe,129);function Oo(e,t){if(!pn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ho!==void 0?Ho.createHTML(t):t}var Do=(e,t)=>{let n=e.length-1,o=[],i,r=t===2?"<svg>":t===3?"<math>":"",a=Xe;for(let l=0;l<n;l++){let s=e[l],h,u,d=-1,c=0;for(;c<s.length&&(a.lastIndex=c,u=a.exec(s),u!==null);)c=a.lastIndex,a===Xe?u[1]==="!--"?a=Lo:u[1]!==void 0?a=Io:u[2]!==void 0?(No.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=ce):u[3]!==void 0&&(a=ce):a===ce?u[0]===">"?(a=i??Xe,d=-1):u[1]===void 0?d=-2:(d=a.lastIndex-u[2].length,h=u[1],a=u[3]===void 0?ce:u[3]==='"'?Ro:Mo):a===Ro||a===Mo?a=ce:a===Lo||a===Io?a=Xe:(a=ce,i=void 0);let p=a===ce&&e[l+1].startsWith("/>")?" ":"";r+=a===Xe?s+Ma:d>=0?(o.push(h),s.slice(0,d)+cn+s.slice(d)+Q+p):s+Q+(d===-2?l:p)}return[Oo(e,r+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},Qe=class e{constructor({strings:t,_$litType$:n},o){let i;this.parts=[];let r=0,a=0,l=t.length-1,s=this.parts,[h,u]=Do(t,n);if(this.el=e.createElement(h,o),ue.currentNode=this.el.content,n===2||n===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=ue.nextNode())!==null&&s.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(cn)){let c=u[a++],p=i.getAttribute(d).split(Q),f=/([.?@])?(.*)/.exec(c);s.push({type:1,index:r,name:f[2],strings:p,ctor:f[1]==="."?Ct:f[1]==="?"?St:f[1]==="@"?Tt:me}),i.removeAttribute(d)}else d.startsWith(Q)&&(s.push({type:6,index:r}),i.removeAttribute(d));if(No.test(i.tagName)){let d=i.textContent.split(Q),c=d.length-1;if(c>0){i.textContent=vt?vt.emptyScript:"";for(let p=0;p<c;p++)i.append(d[p],Ye()),ue.nextNode(),s.push({type:2,index:++r});i.append(d[c],Ye())}}}else if(i.nodeType===8)if(i.data===un)s.push({type:2,index:r});else{let d=-1;for(;(d=i.data.indexOf(Q,d+1))!==-1;)s.push({type:7,index:r}),d+=Q.length-1}r++}}static createElement(t,n){let o=pe.createElement("template");return o.innerHTML=t,o}};function fe(e,t,n=e,o){if(t===he)return t;let i=o!==void 0?n._$Co?.[o]:n._$Cl,r=Ze(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(e),i._$AT(e,n,o)),o!==void 0?(n._$Co??=[])[o]=i:n._$Cl=i),i!==void 0&&(t=fe(e,i._$AS(e,t.values),i,o)),t}var kt=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:o}=this._$AD,i=(t?.creationScope??pe).importNode(n,!0);ue.currentNode=i;let r=ue.nextNode(),a=0,l=0,s=o[0];for(;s!==void 0;){if(a===s.index){let h;s.type===2?h=new Ae(r,r.nextSibling,this,t):s.type===1?h=new s.ctor(r,s.name,s.strings,this,t):s.type===6&&(h=new At(r,this,t)),this._$AV.push(h),s=o[++l]}a!==s?.index&&(r=ue.nextNode(),a++)}return ue.currentNode=pe,i}p(t){let n=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,n),n+=o.strings.length-2):o._$AI(t[n])),n++}},Ae=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,o,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=fe(this,t,n),Ze(t)?t===F||t==null||t===""?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==he&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):$o(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&Ze(this._$AH)?this._$AA.nextSibling.data=t:this.T(pe.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Qe.createElement(Oo(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(n);else{let r=new kt(i,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let n=Po.get(t.strings);return n===void 0&&Po.set(t.strings,n=new Qe(t)),n}k(t){pn(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,o,i=0;for(let r of t)i===n.length?n.push(o=new e(this.O(Ye()),this.O(Ye()),this,this.options)):o=n[i],o._$AI(r),i++;i<n.length&&(this._$AR(o&&o._$AB.nextSibling,i),n.length=i)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let o=Fo(t).nextSibling;Fo(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},me=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,o,i,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=n,this._$AM=i,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=F}_$AI(t,n=this,o,i){let r=this.strings,a=!1;if(r===void 0)t=fe(this,t,n,0),a=!Ze(t)||t!==this._$AH&&t!==he,a&&(this._$AH=t);else{let l=t,s,h;for(t=r[0],s=0;s<r.length-1;s++)h=fe(this,l[o+s],n,s),h===he&&(h=this._$AH[s]),a||=!Ze(h)||h!==this._$AH[s],h===F?t=F:t!==F&&(t+=(h??"")+r[s+1]),this._$AH[s]=h}a&&!i&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ct=class extends me{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}},St=class extends me{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}},Tt=class extends me{constructor(t,n,o,i,r){super(t,n,o,i,r),this.type=5}_$AI(t,n=this){if((t=fe(this,t,n,0)??F)===he)return;let o=this._$AH,i=t===F&&o!==F||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==F&&(o===F||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},At=class{constructor(t,n,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){fe(this,t)}},Ku={M:cn,P:Q,A:un,C:1,L:Do,R:kt,D:$o,V:fe,I:Ae,H:me,N:St,U:Tt,B:Ct,F:At},Ra=dn.litHtmlPolyfillSupport;Ra?.(Qe,Ae),(dn.litHtmlVersions??=[]).push("3.3.3");var et=(e,t,n)=>{let o=n?.renderBefore??t,i=o._$litPart$;if(i===void 0){let r=n?.renderBefore??null;o._$litPart$=i=new Ae(t.insertBefore(Ye(),r),r,void 0,n??{})}return i._$AI(e),i};var fn=globalThis,_e=class extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=et(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return he}};_e._$litElement$=!0,_e.finalized=!0,fn.litElementHydrateSupport?.({LitElement:_e});var Pa=fn.litElementPolyfillSupport;Pa?.({LitElement:_e});(fn.litElementVersions??=[]).push("4.2.2");var $a={attribute:!0,type:String,converter:Je,reflect:!1,hasChanged:wt},Na=(e=$a,t,n)=>{let{kind:o,metadata:i}=n,r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),o==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),o==="accessor"){let{name:a}=n;return{set(l){let s=t.get.call(this);t.set.call(this,l),this.requestUpdate(a,s,e,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,e,l),l}}}if(o==="setter"){let{name:a}=n;return function(l){let s=this[a];t.call(this,l),this.requestUpdate(a,s,e,!0,l)}}throw Error("Unsupported decorator location: "+o)};function zo(e){return(t,n)=>typeof n=="object"?Na(e,t,n):((o,i,r)=>{let a=i.hasOwnProperty(r);return i.constructor.createProperty(r,o),a?Object.getOwnPropertyDescriptor(i,r):void 0})(e,t,n)}function dp(e){return zo({...e,state:!0,attribute:!1})}var mn=/^(#{1,3})\s+/,tt=/^\s*\d{1,3}[.)]\s+/,nt=/^\s*[-*•]\s+/,Oa="\\*_[]()#`";function gn(e){if(typeof e!="string")return;let t=e.replace(/\r\n?/g,`
`).trim();return t===""?void 0:t.slice(0,2e3)}var Rp=`What it shows.

# Set up
1. Point [Kitchen light] at your own light.
2. \u2026

Tap it to \u2026`;function Vo(e){let t=e.trim();return/^https?:\/\/[^\s<>"']+$/i.test(t)?t:void 0}function Ee(e,t){let n=[],o=r=>{if(r==="")return;let a=n.at(-1);a?.kind==="text"?a.text+=r:n.push({kind:"text",text:r})},i=0;for(;i<e.length;){let r=e[i];if(r==="\\"&&i+1<e.length&&Oa.includes(e[i+1])){o(e[i+1]),i+=2;continue}if(r==="*"&&e[i+1]==="*"){let a=e.indexOf("**",i+2);for(;a>0&&e[a+2]==="*";)a+=1;let l=a<0?"":e.slice(i+2,a);if(l.trim()!==""&&l===l.trim()){n.push({kind:"strong",spans:Ee(l,t)}),i=a+2;continue}}if((r==="*"||r==="_")&&e[i+1]!==r){let a=r==="*"||i===0||!/[\p{L}\p{N}]/u.test(e[i-1]),l=e.indexOf(r,i+1);for(;l>0&&r==="*"&&e[l+1]==="*";)l=e.indexOf(r,l+2);let s=l<0?"":e.slice(i+1,l),h=e[l+1],u=r==="*"||h===void 0||!/[\p{L}\p{N}]/u.test(h);if(a&&u&&s.trim()!==""&&s===s.trim()){n.push({kind:"em",spans:Ee(s,t)}),i=l+1;continue}}if(r==="["){let a=e.indexOf("]",i+1),l=a<0?"":e.slice(i+1,a);if(a>0&&l.length<=80&&!l.includes("["))if(e[a+1]==="("){let s=e.indexOf(")",a+2),h=s<0?void 0:Vo(e.slice(a+2,s));if(h&&l.trim()!==""){n.push({kind:"url",text:l.trim(),href:h}),i=s+1;continue}}else{let s=l.trim()===""?void 0:t(l.trim());if(s){n.push({kind:"link",text:l.trim(),target:s}),i=a+1;continue}}}o(r),i+=1}return n}function yn(e){return e.map(t=>t.kind==="strong"||t.kind==="em"?yn(t.spans):t.text).join("")}function Da(e,t){let n=[],o=[],i,r=()=>{o.length!==0&&(n.push({kind:"para",spans:Ee(o.join(`
`),t)}),o=[])},a=()=>{i&&(n.push({kind:"list",ordered:i.ordered,items:i.items.map(l=>Ee(l,t))}),i=void 0)};for(let l of e.replace(/\r\n?/g,`
`).split(`
`)){let s=l.trim();if(s===""){r(),a();continue}let h=mn.exec(s);if(h){r(),a();let c=h[1].length;n.push({kind:"heading",level:c,spans:Ee(s.slice(h[0].length).replace(/\s+#+$/,""),t)});continue}let u=tt.test(s),d=!u&&nt.test(s);if(u||d){r(),i&&i.ordered!==u&&a(),i??={ordered:u,items:[]},i.items.push(s.replace(u?tt:nt,""));continue}if(i){i.items[i.items.length-1]+=` ${s}`;continue}o.push(s)}return r(),a(),n}function za(e){let n=(e.split(`
`).map(o=>o.trim()).find(o=>o!=="")??"").replace(mn,"").replace(tt,"").replace(nt,"");return yn(Ee(n,()=>{})).replace(/\[([^\[\]\n]{1,80})\]/g,"$1")}function Pp(e,t){let n=Da(e,()=>{}).find(a=>a.kind==="para"),o=n?.kind==="para"?yn(n.spans).replace(/\[([^\[\]\n]{1,80})\]/g,"$1").replace(/\s*\n\s*/g," ").trim():za(e);if(o.length<=t)return o;let i=o.slice(0,t-1),r=i.lastIndexOf(" ");return`${(r>t/2?i.slice(0,r):i).trimEnd()}\u2026`}function $p(e){return e.kind==="value"?"Open this shared value":e.kind==="group"?"Select this group":"Select this layer"}function Wo(e,t,n){let o=e.lastIndexOf(`
`,t-1)+1,i=n>t&&e[n-1]===`
`?n-1:n,r=e.indexOf(`
`,i);return[o,r<0?e.length:r]}function Et(e){return e.replace(mn,"").replace(tt,"").replace(nt,"").trimStart()}function Np(e,t,n,o){let[i,r]=Wo(e,t,n),a=e.slice(i,r).split(`
`),l=o?tt:nt,s=a.filter(m=>m.trim()!==""),h=s.length>0&&s.every(m=>l.test(m)),u=e.slice(0,Math.max(0,i-1)).split(`
`).at(-1)??"",d=o?Number(/^\s*(\d{1,3})[.)]\s+/.exec(u)?.[1]??0):0,p=a.map(m=>m.trim()===""&&s.length>0?m:h?Et(m):(d+=1,`${o?`${d}. `:"- "}${Et(m)}`)).join(`
`),f=e.slice(0,i)+p+e.slice(r);return t===n&&a.length===1?{text:f,start:i+p.length,end:i+p.length}:{text:f,start:i,end:i+p.length}}function Op(e,t){let[n,o]=Wo(e,t,t),i=e.slice(n,o),r=/^#\s+/.test(i.trimStart())?Et(i):`# ${Et(i)}`;return{text:e.slice(0,n)+r+e.slice(o),start:n+r.length,end:n+r.length}}function Dp(e,t,n,o){let i=e.slice(0,t),r=e.slice(n),a=e.slice(t,n);if(i.endsWith(o)&&r.startsWith(o)&&(o==="**"||!(i.endsWith("**")&&r.startsWith("**"))||i.endsWith("***")))return{text:i.slice(0,-o.length)+a+r.slice(o.length),start:t-o.length,end:n-o.length};let s=a.length-a.trimStart().length,h=a.length-a.trimEnd().length,u=a.trim(),d=`${i}${a.slice(0,s)}${o}${u}${o}${a.slice(a.length-h)}${r}`,c=t+s+o.length;return{text:d,start:c,end:c+u.length}}function Uo(e,t,n,o){let i=e.slice(0,t),r=e.slice(n),a=i===""||/\s$/.test(i)?"":" ",l=r===""||/^[\s.,;:!?)]/.test(r)?"":" ",s=`${a}${o}${l}`,h=t+s.length;return{text:i+s+r,start:h,end:h}}function zp(e,t,n,o){return Uo(e,t,n,`[${o}]`)}function Vp(e,t,n,o){let i=e.slice(t,n).replace(/[[\]\n]/g," ").trim()||o.replace(/^https?:\/\//i,"");return Uo(e,t,n,`[${i}](${o})`)}function Wp(e){let t=e.trim();if(t==="")return;let n=/^[a-z][a-z0-9+.-]*:/i.test(t)?t:/^[^\s/]+\.[^\s/]+/.test(t)?`https://${t}`:t;return Vo(n)}var yi=["rectangular","circular","corner"],Ln=["small","medium","large","xlarge"],L=[...yi,...Ln];function dt(e){return L.includes(e)}var N={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34},small:{width:162.67,height:162.67},medium:{width:344.67,height:162.67},large:{width:344.67,height:360},xlarge:{width:344.67,height:557.33}},it=["rectangular","circular","corner","inline",...Ln];var Gp=64;function jp(e,t){let n=new Set(e);return t.filter(o=>o.kind!=="preset"||!n.has(o.slot))}function In(e){return Wa(e)?10:Xi(e)?9:Va(e)?8:Ln.some(n=>e.supportedFamilies.includes(n))?7:yi.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}function Va(e){if(e.elements.some(n=>n.kind==="list"))return!0;let t=!1;return de(e,n=>{(n.kind.kind==="item"||n.kind.kind==="listStat")&&(t=!0)}),t}function Wa(e){let t=!1;return de(e,n=>{n.kind.kind==="imageTime"&&(t=!0)}),t}function Ot(e){return e==="standard"||e==="condensed"||e==="compressed"||e==="expanded"?e:void 0}var Ua=4,ct=.5;function Ba(e){return Number.isFinite(e)?Math.min(1,Math.max(ct,e)):ct}var Ga=["none","dot","triangle"],ja=["straight","smooth","step"],Ka=["light","medium","strong"],qa={light:.05,medium:.1,strong:.2};function Bo(e){return typeof e=="string"&&ja.includes(e)?e:"straight"}var Ja=["flat","fade"],Xa=["none","all","auto"],bi=4,Dt="#FFFFFF33";function wn(e){return typeof e=="string"&&Ja.includes(e)?e:"flat"}function vn(e){return typeof e=="string"&&Xa.includes(e)?e:"none"}function kn(e){return typeof e!="number"||!Number.isFinite(e)?0:Math.max(0,Math.min(bi,Math.round(e)))}function $e(e,t){return e.replace(/^#/,"").toUpperCase()===t.replace(/^#/,"").toUpperCase()}function He(e){return typeof e=="string"&&e!==""?e:Dt}var Ya=1,Za=12;function at(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.max(Ya,Math.min(Za,e))}function xi(e){return e==="all"?"all":"auto"}var Mn=1,Rn=3,Qa=.25,es=4;function wi(e){return typeof e!="number"||!Number.isFinite(e)?Rn:Math.max(1,Math.min(bi,Math.round(e)))}function vi(e){return typeof e!="number"||!Number.isFinite(e)?Mn:Math.max(Qa,Math.min(es,e))}var ts=["all","top"],Pn=1.2;function Cn(e){return typeof e!="number"||!Number.isFinite(e)?Pn:Math.max(0,e)}function Sn(e){return typeof e=="string"&&ts.includes(e)?e:"all"}function Tn(e){if(typeof e=="string")return Ka.includes(e)?e:void 0;if(e===3||e===5)return"light";if(e===7)return"medium";if(e===9)return"strong"}function Kp(e,t){if(t===void 0||e<2)return 0;let n=Math.max(3,Math.floor(e*qa[t]+.5));return n%2===0?n+1:n}var ns=[["history","Recorded history"],["statistics","Long-term statistics"]],os=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],is=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],$n="history",Nn="hour",On="mean",rs=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],as=[["clock","Time"],["date","Date"],["weekday","Weekday"],["dateTime","Weekday and time"]];function qp(e){return e==="clock"||e==="dateTime"}var Jp=[["count","Items shown"],["total","Items in total"]],ki={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},ss=[["highest","Highest reading"],["lowest","Lowest reading"],["now","Now"],["first","First reading"],["latest","Newest reading"],["threshold","Threshold"],["zero","Zero"]];function Xp(e){return e!=="threshold"&&e!=="zero"}var ls=[["above","Above"],["on","On"],["below","Inside"],["bottom","At the bottom"],["through","Through"]];function ds(e){return ss.some(([t])=>t===e)}function cs(e){return ls.some(([t])=>t===e)}function us(e){if(!g(e)||typeof e.layer!="string"||e.layer==="")return;let t={layer:e.layer.toUpperCase(),at:ds(e.at)?e.at:"highest",place:cs(e.place)?e.place:"above"},n=v(e.dx,0),o=v(e.dy,0);return n!==0&&(t.dx=n),o!==0&&(t.dy=o),t}function Ft(e,t){let n=us(e.chartAnchor);n!==void 0&&(t.chartAnchor=n)}function Ht(e,t){e.chartAnchor!==void 0&&(t.chartAnchor=ps(e.chartAnchor))}function ps(e){let t={layer:e.layer,at:e.at,place:e.place};return e.dx!==void 0&&e.dx!==0&&(t.dx=x(e.dx)),e.dy!==void 0&&e.dy!==0&&(t.dy=x(e.dy)),t}var Yp=[["linear","Linear"],["radial","Radial"]],hs=2,fs=4;function rt(e){if(!g(e)||!Array.isArray(e.stops))return;let t=[];for(let i of e.stops){if(t.length===fs)break;if(!g(i))continue;let r=A(i.colorHex);r===void 0||r===""||t.push({at:j(v(i.at,0)),colorHex:r})}if(t.length<hs)return;let n={kind:e.kind==="radial"?"radial":"linear",stops:t},o=v(e.angle,0);return n.kind==="linear"&&o!==0&&(n.angle=o),n}function Lt(e){let t={kind:e.kind,stops:e.stops.map(n=>({at:x(n.at),colorHex:n.colorHex}))};return e.kind==="linear"&&e.angle!==void 0&&e.angle!==0&&(t.angle=x(e.angle)),t}function Zp(e,t){let n=[...e.stops].sort((r,a)=>r.at-a.at),o=n[0],i=n[n.length-1];if(t<=o.at)return o.colorHex;if(t>=i.at)return i.colorHex;for(let r=1;r<n.length;r++){let a=n[r],l=n[r-1];if(t>a.at)continue;let s=a.at-l.at;return ms(l.colorHex,a.colorHex,s<=0?0:(t-l.at)/s)}return i.colorHex}function ms(e,t,n){let o=s=>{let h=s.replace(/^#/,""),u=h.length===6?`${h}FF`:h.padEnd(8,"F");return[0,2,4,6].map(d=>parseInt(u.slice(d,d+2),16)||0)},i=o(e),r=o(t),a=i.map((s,h)=>Math.round(s+(r[h]-s)*n)),l=a.map(s=>Math.max(0,Math.min(255,s)).toString(16).padStart(2,"0").toUpperCase());return a[3]===255?`#${l[0]}${l[1]}${l[2]}`:`#${l.join("")}`}function Qp(e,t){let n=e.replace(/^#/,""),o=n.length>=6?n.slice(0,6).toUpperCase():"FFFFFF",i=n.length>=8?parseInt(n.slice(6,8),16):255,r=Math.min(255,Math.max(0,Math.round(i*t)));return r===255?`#${o}`:`#${o}${r.toString(16).padStart(2,"0").toUpperCase()}`}var gs=[["up","Up"],["down","Down"],["left","Left"],["right","Right"]],Dn="up",zn=0,Vn=100,eh=.25;function th(e){return{value:e,minValue:zn,maxValue:Vn,direction:Dn}}function ys(e){if(!g(e))return;let t={value:g(e.value)?E(e.value):T("50"),minValue:v(e.minValue,zn),maxValue:v(e.maxValue,Vn),direction:ge(e.direction,gs.map(([o])=>o),Dn)};g(e.minSource)&&(t.minSource=E(e.minSource)),g(e.maxSource)&&(t.maxSource=E(e.maxSource));let n=A(e.trackColorHex);return n!==void 0&&n!==""&&(t.trackColorHex=n),t}function bs(e){let t={value:_(e.value)};return e.minValue!==zn&&(t.minValue=x(e.minValue)),e.maxValue!==Vn&&(t.maxValue=x(e.maxValue)),e.minSource!==void 0&&(t.minSource=_(e.minSource)),e.maxSource!==void 0&&(t.maxSource=_(e.maxSource)),e.direction!==Dn&&(t.direction=e.direction),e.trackColorHex!==void 0&&(t.trackColorHex=e.trackColorHex),t}function Go(e,t){let n=ys(e.level);n!==void 0&&(t.level=n)}function jo(e,t){e.level!==void 0&&(t.level=bs(e.level))}var xs=["circular","rectangular","corner","small","medium","large","xlarge"];function nh(e){return xs.includes(e)}var ws=.1,vs=3,oh=.5,ks=10,Cs=360,It=120,Ss=-2,Ts=20;function As(e){if(!g(e))return;let t=v(e.radius,NaN);if(!Number.isFinite(t))return;let n={radius:Math.min(vs,Math.max(ws,t))},o=v(e.angle,0);o!==0&&(n.angle=o);let i=_s(v(e.sweep,It));i!==It&&(n.sweep=i);let r=Es(v(e.spacing,0));return r!==0&&(n.spacing=r),e.flip===!0&&(n.flip=!0),n}function _s(e){if(!Number.isFinite(e)||e===0)return It;let t=Math.min(Cs,Math.max(ks,Math.abs(e)));return e<0?-t:t}function Es(e){return Number.isFinite(e)?Math.min(Ts,Math.max(Ss,e)):0}function Fs(e){let t={radius:x(e.radius)};return e.angle!==void 0&&e.angle!==0&&(t.angle=x(e.angle)),e.sweep!==void 0&&e.sweep!==It&&(t.sweep=x(e.sweep)),e.spacing!==void 0&&e.spacing!==0&&(t.spacing=x(e.spacing)),e.flip===!0&&(t.flip=!0),t}var Hs={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setFontDesign:"fontDesign",setFontWidth:"fontWidth",setItalic:"italic",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},Ls=12,Ko=12,Ci="#000000",ih={colorHex:Ci,radius:3,dx:0,dy:1};function Is(e){return Number.isFinite(e)?Math.min(Ls,Math.max(0,e)):0}function qo(e){return Number.isFinite(e)?Math.min(Ko,Math.max(-Ko,e)):0}function Ms(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):1}function rh(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function Si(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function Ti(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function Ai(e){let t=u=>u.icon===void 0&&u.value.kind.kind!=="literal",n=(u,d)=>e.slice(u,d).map(c=>c.icon===void 0?Ti(c.value)??"":"").join(""),o=e.findIndex(t);if(o<0)return T(n(0,e.length));let i=e.findIndex((u,d)=>d>o&&t(u)),r=e[o].value,a={...r.format},l=n(0,o)+(a.prefix??""),s=(a.suffix??"")+n(o+1,i<0?e.length:i);delete a.prefix,delete a.suffix,l!==""&&(a.prefix=l),s!==""&&(a.suffix=s);let h={kind:structuredClone(r.kind)};return Re(a)||(h.format=a),h}function ah(e){Si(e)&&(e.value=Ai(e.parts))}var Rs="svg:custom",Ps="0 0 24 24",Jo=8*1024;function sh(e){return e.symbol.kind.kind==="literal"&&e.symbol.kind.value===Rs}function Wn(e){if(e===void 0)return;let t=e.trim();if(!(t===""||t===Ps))return t}function lh(e){let t={minX:0,minY:0,width:24,height:24};if(e===void 0)return t;let n=e.trim().split(/[\s,]+/).filter(s=>s!=="");if(n.length!==4)return t;let o=n.map(s=>Number(s));if(!o.every(s=>Number.isFinite(s)))return t;let[i,r,a,l]=o;return!(a>0)||!(l>0)?t:{minX:i,minY:r,width:a,height:l}}var $s=/^[MmLlHhVvCcSsQqTtAaZz0-9eE+\-.,\s]+$/;function dh(e){let t=e.trim();if(t==="")return{ok:!1,error:"Paste an SVG path or the whole <svg> markup."};let n=t.startsWith("<"),o=n?Ns(t):t.replace(/\s+/g," ").trim();if(n&&o==="")return{ok:!1,error:"That markup has no <path> in it. Only paths can be drawn on a watch face."};if(!$s.test(o))return{ok:!1,error:"That is not an SVG path: it holds characters no path command uses."};if(!/[Mm]/.test(o))return{ok:!1,error:"An SVG path starts with a move command (M)."};let i=new TextEncoder().encode(o).length;if(i>Jo)return{ok:!1,error:`That drawing is ${Math.ceil(i/1024)} KB of path and the limit is ${Jo/1024} KB. Simplify it in a vector editor first.`};let r=n?Wn(Os(t)):void 0;return r===void 0?{ok:!0,path:o}:{ok:!0,path:o,viewBox:r}}function Ns(e){let t=[];for(let n of e.matchAll(/<path\b[^>]*>/gi)){let o=/\sd\s*=\s*("([^"]*)"|'([^']*)')/i.exec(n[0]),i=(o?.[2]??o?.[3]??"").replace(/\s+/g," ").trim();i!==""&&t.push(i)}return t.join(" ")}function Os(e){let t=/<svg\b[^>]*>/i.exec(e);if(!t)return;let n=/\sviewBox\s*=\s*("([^"]*)"|'([^']*)')/i.exec(t[0]),o=(n?.[2]??n?.[3]??"").replace(/\s+/g," ").trim();return o===""?void 0:o}var Un="#FFFFFF",zt="#FFFFFF80",Vt=3,Ds=60,zs=8,Wt="#FFFFFF",Ut=8,Vs=4,Ws=20;function ch(e){if(!Number.isFinite(e))return"";let t=e.toFixed(2);return t.includes(".")&&(t=t.replace(/0+$/,"").replace(/\.$/,"")),t==="-0"?"0":t}function uh(){return{count:0,length:Vt,colorHex:zt,majorEvery:0}}function ph(){return{show:!1,size:Ut,colorHex:Wt}}function _i(e){return e.count===0&&e.length===Vt&&$e(e.colorHex,zt)&&e.majorEvery===0}function Ei(e){return!e.show&&e.size===Ut&&$e(e.colorHex,Wt)}function Us(e){if(!g(e))return;let t={count:Math.max(0,Math.min(Ds,Math.round(v(e.count,0)))),length:Math.max(1,Math.min(zs,v(e.length,Vt))),colorHex:w(e.colorHex,zt),majorEvery:Math.max(0,Math.round(v(e.majorEvery,0)))};return _i(t)?void 0:t}function Bs(e){let t={};return e.count!==0&&(t.count=Math.round(e.count)),e.length!==Vt&&(t.length=x(e.length)),$e(e.colorHex,zt)||(t.colorHex=e.colorHex),e.majorEvery!==0&&(t.majorEvery=Math.round(e.majorEvery)),t}function Gs(e){if(!g(e))return;let t={show:e.show===!0,size:Math.max(Vs,Math.min(Ws,v(e.size,Ut))),colorHex:w(e.colorHex,Wt)};return Ei(t)?void 0:t}function js(e){let t={};return e.show&&(t.show=!0),e.size!==Ut&&(t.size=x(e.size)),$e(e.colorHex,Wt)||(t.colorHex=e.colorHex),t}function Xo(e){return typeof e=="string"&&Ga.includes(e)}function Ks(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function An(e){let t=Ks(e.marker);return{high:e.highMarker??t.high,low:e.lowMarker??t.low}}function Fi(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function Hi(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function qs(e,t){e.marker=Fi(t),Hi(t)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=t.high,e.lowMarker=t.low)}var hh=24,Js=6,Yo="#FFFFFF";function fh(e){if(e.style!=="bars")return 0;let t=e.barBorderWidth;return typeof t!="number"||!Number.isFinite(t)?0:Math.min(Math.max(t,0),Js)}function mh(e,t,n,o,i){if(i!==void 0)return{fill:i,border:i};if(!Ys(e))return{fill:e.fillColorHex??o,border:e.barBorderColorHex??Yo};let r=n.find(l=>t<=l.upTo),a=r?{color:r.colorHex,fill:r.fillColorHex,border:r.borderColorHex}:{color:e.bandAboveColorHex,fill:e.bandAboveFillColorHex,border:e.bandAboveBorderColorHex};return{fill:a.fill??e.fillColorHex??a.color,border:a.border??e.barBorderColorHex??Yo}}var Le="#FF6B35",Ie="#32D74B",Xs="#32D74B",G="#FF453A",Bn="#FF453A",Gn="#FFFFFF99";function gh(e){return[...e.bands].sort((t,n)=>t.upTo-n.upTo)}function Ys(e){return e.coloring==="bands"&&e.bands.length>0}function yh(e,t,n){for(let o of t)if(e<=o.upTo)return o.colorHex;return n}function bh(e,t){let n=Math.abs(t),o=n>=10?0:n>=1?1:2;return e.toFixed(o)}function xh(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var Zs=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],Qs=360,el=10080,wh=[...Zs,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],vh=366*24*60,tl=2,nl=120,ol=0;function jn(e){let t=Math.round(e.historyPoints);return Number.isFinite(t)?t<1?ol:Math.max(tl,Math.min(nl,t)):24}function il(e){return qn(e)!==void 0?!0:Kn(e)!==void 0&&jn(e)>0}function Kn(e){if(e.source==="history")return Li(e)}function qn(e){if(e.source==="statistics")return Li(e)}function Li(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function rl(e){let t=Kn(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${jn(e)}${e.gaps===!0?"|gaps":""}`}function al(e){let t=qn(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}${e.gaps===!0?"|gaps":""}`}function kh(e){return[...Jn(e).map(n=>n.key),...Xn(e).map(n=>n.key)].sort().join(";")}function Jn(e){let t=new Map,n=o=>{t.has(o.key)||t.set(o.key,o)};for(let o of e.elements)if(o.kind==="chart"){let i=rl(o.payload),r=Kn(o.payload);if(i===void 0||r===void 0)continue;n({key:i,entityId:r,minutes:Math.round(o.payload.historyMinutes),points:jn(o.payload),mode:"numeric",gaps:o.payload.gaps===!0})}else if(o.kind==="timeline"){let i=xl(o.payload),r=Ni(o.payload);if(i===void 0||r===void 0||bl(o.payload))continue;let a=jt(o.payload);n({key:i,entityId:r,minutes:$i(o.payload),points:Pi,mode:"states",gaps:!1,...a.length>0?{entities:a,combine:o.payload.aggregate?.combine??Bt}:{}})}return[...t.values()]}function Xn(e){let t=new Map;for(let n of e.elements){if(n.kind!=="chart")continue;let o=al(n.payload),i=qn(n.payload);o===void 0||i===void 0||t.has(o)||t.set(o,{key:o,entityId:i,minutes:Math.round(n.payload.historyMinutes),period:n.payload.statPeriod,type:n.payload.statType,gaps:n.payload.gaps===!0})}return[...t.values()]}var sl=2,ll=20,Bt="any",dl="binary_sensor",Ch=[["any","Any"],["all","All"]];function Sh(e){return e==="all"?"On when all of them are active":"On when any of them is active"}var Th=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],Ah=[["auto","Auto"],["always","Always"],["never","Never"]];function bn(e){return e==="h12"||e==="h24"?e:xe}function xn(e){return e==="always"||e==="never"?e:we}function cl(e){let t={},n=e.fontWeight;(n==="medium"||n==="semibold"||n==="bold")&&(t.fontWeight=n);let o=e.fontDesign;(o==="default"||o==="monospaced"||o==="serif")&&(t.fontDesign=o);let i=Ot(e.fontWidth);return i!==void 0&&i!=="standard"&&(t.fontWidth=i),e.italic===!0&&(t.italic=!0),e.monospacedDigits===!0&&(t.monospacedDigits=!0),t}function ul(e){return e.timeLabelCount!==void 0?Me(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:be}function Me(e){let t=Number(e);return Number.isFinite(t)?Math.max(0,Math.min(Ri,Math.round(t))):be}function _h(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(t,n)=>n/(e-1))}var Gt="#8E8E93",Ii=1,pl="#000000",hl=2,fl=1440,Yn=60,be=0,te=9,ne="#8E8E93",xe="auto",we="auto",Mi=4,Ri=12,ml=1,gl=20,yl=4,Pi=120;function Eh(e,t,n){let o=e.trim().toLowerCase();for(let i of t)if(i.match.trim().toLowerCase()===o)return i.colorHex;return n}function $i(e){let t=Math.round(e.historyMinutes);return Number.isFinite(t)?Math.max(1,Math.min(el,t)):Yn}function Ni(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function jt(e){let t=e.aggregate?.entities??[],n=[];for(let o of t){let i=typeof o=="string"?o.trim():"";i!==""&&!n.includes(i)&&n.push(i)}return n}function Fh(e){let t=[...e.aggregate?.entities??[]];for(;t.length<sl;)t.push("");return t}function bl(e){return jt(e).length>ll}function xl(e){let t=Ni(e);if(t===void 0)return;let n=`${t}|${$i(e)}|${Pi}|states`,o=jt(e);return o.length===0?n:`${n}|${e.aggregate?.combine??Bt}:${o.join(",")}`}var wl={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},vl={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function Zo(e){return wl[e.trim().toLowerCase()]??Gt}var kl=["door","garage_door","window","opening"];function Qo(e,t){let n=(t??"").trim().toLowerCase(),o=e==="binary_sensor"&&kl.includes(n),i=a=>Zo(o&&a==="on"?"open":a);return[...vl[e]??[],"unavailable","unknown"].map(a=>({id:I(),match:a,colorHex:i(a)}))}var Hh=48*1024,Oi=6,Cl=0,Kt=9,Sl=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Tl(e){let t=e.trim();if(t==="")return 0;let n=t.endsWith("==")?2:t.endsWith("=")?1:0;return Math.max(0,Math.floor(t.length*3/4)-n)}function Lh(e){return e.source==="inline"&&e.data!==void 0?Tl(e.data):0}function Ih(e){if(e.source!=="inline")return;let t=e.data;if(!(t===void 0||t===""))return`data:${e.format==="jpeg"?"image/jpeg":"image/png"};base64,${t}`}function Di(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Al(e,t){let n=t<=.5,o=e<=.5;return n?o?"topLeading":"topTrailing":o?"bottomLeading":"bottomTrailing"}var _l={top:0,left:0,bottom:0,right:0};function zi(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}function Mh(e){return e.fontDesign??"rounded"}var Rh=[["down","Down"],["across","Across"]],El=[["name","Name"],["state","State"],["lastChanged","Last changed"]],Fl=[["open","To do"],["done","Done"],["all","Everything"]],Hl=[["list","List order"],["due","Due"]],Ll=[["hourly","Hourly"],["daily","Daily"],["twiceDaily","Twice daily"]],Ph=[["entities","Entities"],["attribute","Attribute"],["template","Template"],["calendar","Calendar"],["todo","To-do list"],["forecast","Forecast"]],Il=1,Ml=12,Zn=4,Rl=1,Pl=4,Qn=1,eo=2,$l=12,Nl=8,$h=5,Ol=1,Vi=8784,Wi=24,Ui=["list","chart","timeline","chartTimes","chartDots","chartGrid","imageTime"],Nh=["rectangular","small","medium","large","xlarge"];function Oh(e){let t=Ne(e.rows);if(e.direction==="across")return{lines:1,columns:t};let n=Math.min(to(e.columns),t);return{lines:Math.ceil(t/n),columns:n}}function Ne(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Zn;return Math.min(Ml,Math.max(Il,t))}function to(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Qn;return Math.min(Pl,Math.max(Rl,t))}function Bi(e){let t=typeof e=="number"&&Number.isFinite(e)?e:eo;return Math.min($l,Math.max(0,t))}function Oe(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Wi;return Math.min(Vi,Math.max(Ol,t))}var Dh=["hours","days","weeks","months"],J={hours:1,days:24,weeks:168,months:720};function zh(e){let t=Oe(e);return t%J.months===0?{value:t/J.months,unit:"months"}:t%J.weeks===0?{value:t/J.weeks,unit:"weeks"}:t%J.days===0?{value:t/J.days,unit:"days"}:{value:t,unit:"hours"}}function Vh(e,t){let n=Number.isFinite(e)?e:1;return Oe(Math.round(n*J[t]))}function Dl(e){return Math.floor(Vi/J[e])}function Wh(e,t){let n=Math.ceil(Oe(e)/J[t]);return Math.min(Dl(t),Math.max(1,n))}function Uh(e,t){return Math.round(Oe(e)/J[t]*100)/100}var zl=["toggleEntity","runScene","runScript","addTodo","runHTTPAction","openEntity"];function Bh(e){return zl.includes(e)}function Gh(e){let t=(e??"").trim();if(t==="")return!0;try{let n=JSON.parse(t);return typeof n=="object"&&n!==null&&!Array.isArray(n)}catch{return!1}}var Vl=[["refresh","Refresh this complication"],["refreshAll","Refresh multiple complications"],["nextPage","Show next page"],["previousPage","Show previous page"],["showPage","Show one page"],["playTour","Play all pages"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["callService","Call a service"],["runHTTPAction","Run an HTTP action"],["addTodo","Add a to-do"],["openApp","Open the app"],["openPage","Open a watch app page"],["openEntity","Open an entity"],["openRoomPage","Open the room I'm in"],["timerStartPause","Start or pause a timer"],["timerCancel","Cancel a timer"],["none","Nothing"]],jh=[["Refresh",["refresh","refreshAll"]],["Pages",["nextPage","previousPage","showPage","playTour"]],["Home Assistant",["toggleEntity","runScene","runScript","callService","runHTTPAction","addTodo"]],["Open the app",["openApp","openPage","openEntity","openRoomPage"]],["Timer",["timerStartPause","timerCancel"]]],Wl=["openPage","openEntity","openRoomPage","addTodo"];function Kh(e,t=!1){let o={refresh:"Fetches new data and redraws this complication.",refreshAll:"Fetches new data for this complication and the others you pick. The other tiles redraw only when watchOS allows it.",nextPage:"Shows the next page of this complication. Needs two or more pages.",previousPage:"Shows the page before this one. Needs two or more pages.",showPage:"Shows the page you pick, such as page 1. Needs two or more pages.",playTour:"Shows every page once, then goes back to page 1. Needs two or more pages.",toggleEntity:"Turns an entity on or off, such as a light or a switch.",runScene:"Turns on a Home Assistant scene.",runScript:"Runs a Home Assistant script.",callService:"Calls any Home Assistant service, with your own data.",runHTTPAction:"Runs an HTTP action kept in Home Assistant or the Wrist Assistant app.",addTodo:"Opens the watch app to add an item to a to-do list.",openApp:"Opens Wrist Assistant.",openPage:"Opens one page of your Wrist Assistant grid. You pick the page.",openEntity:"Opens the watch app on the controls of the entity you pick. The entity needs a tile on a watch app page.",openRoomPage:"Opens the app on the page for the room it finds you in.",timerStartPause:"Starts or pauses the first timer this complication shows. Three quick taps cancel it.",timerCancel:"Works the same as Start or pause a timer: three quick taps cancel it.",none:"Does nothing. On the whole complication the watch still opens the app."}[e];return t&&Wl.includes(e)?`${o} On iPhone this only opens the app.`:o}function Ul(e){return Vl.find(([t])=>t===e.type)?.[1]??e.type}function qh(e){let t=Ul(e);if(e.type==="callService"){let o=[e.serviceDomain,e.serviceName].filter(i=>i!=="").join(".");return o===""?t:`${t}: ${o}`}if(e.type==="refreshAll"){if(e.allPlaced===!0)return`${t}: all placed`;let o=e.targets?.length??0,i=Object.keys(e.targetLayers??{}).length,r=o>0?`${t}: ${o} picked`:`${t}: none picked`;return i>0?`${r}, ${i} narrowed`:r}if(e.type==="showPage")return`${t}: ${e.page}`;if(e.type==="refresh"&&e.layerIds!==void 0){let o=e.layerIds.length;return o>0?`${t}: ${o} picked`:`${t}: none picked`}if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function Jh(e,t,n){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let o=t.trim().toUpperCase(),i=e.targets??[],r=n?o===""||i.includes(o)?[...i]:[...i,o]:i.filter(s=>s!==o),a={type:"refreshAll"};r.length>0&&(a.targets=r);let l=n?e.targetLayers:Gi(e.targetLayers,o);return l!==void 0&&(a.targetLayers={...l}),a}function Gi(e,t){if(e===void 0||!(t in e))return e;let n={...e};return delete n[t],Object.keys(n).length>0?n:void 0}function Xh(e,t,n){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let o=t.trim().toUpperCase();if(o==="")return e;let i={type:"refreshAll"};e.targets!==void 0&&e.targets.length>0&&(i.targets=[...e.targets]);let r=n?Gi(e.targetLayers,o):{...e.targetLayers??{},[o]:[]};return r!==void 0&&(i.targetLayers={...r}),i}function Yh(e,t,n,o){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let i=t.trim().toUpperCase(),r=n.trim();if(i==="")return e;let a=e.targetLayers?.[i]??[],l=o?r===""||a.includes(r)?[...a]:[...a,r]:a.filter(h=>h!==r),s={type:"refreshAll"};return e.targets!==void 0&&e.targets.length>0&&(s.targets=[...e.targets]),s.targetLayers={...e.targetLayers??{},[i]:l},s}function Zh(e,t,n){let o=t.trim(),i=e.layerIds??[];return{type:"refresh",layerIds:n?o===""||i.includes(o)?[...i]:[...i,o]:i.filter(a=>a!==o)}}function Qh(e,t=!1){if(_n(e.type))return t?e.type==="nextPage"?"Each tap shows the next page. The page stays where it was left.":e.type==="previousPage"?"Each tap shows the page before. The page stays where it was left.":e.type==="showPage"?`Each tap shows page ${e.page}. A complication with fewer pages shows its last page.`:"Plays every page once from one tap, then returns to page 1.":"This complication has one page, so this does nothing yet. Add a page in the Pages card, on the left.";if(e.type==="timerStartPause")return"Uses the first timer entity this complication shows. One tap starts or pauses it, three quick taps cancel it. With no timer entity, a tap only refreshes.";if(e.type==="timerCancel")return"This works the same as Start or pause a timer: one tap starts or pauses, three quick taps cancel. Pick Start or pause a timer to say so.";if(e.type==="openEntity")return"The watch opens the page that has this entity's tile, then opens its controls. With no tile for it, the watch says Not on a page.";if(e.type==="none")return"The watch cannot do nothing on a tap: a complication with no action still opens the app. Pick Open the app to say so, or Refresh this complication to make the tap worth something.";if(e.type==="refresh"){if(e.layerIds===void 0)return"Refreshes every layer and every page of this complication, not just the layer the tap sits on.";let a=" On a watch running an older app this tap refreshes everything instead.";return e.layerIds.length===0?"Nothing is ticked, so this tap still refreshes the whole complication. Tick the layers you want it to fetch."+a:`Fetches only the ${e.layerIds.length} ticked below. Everything else keeps what it last read, and the whole tile is redrawn.`+a}if(e.type!=="refreshAll")return;let n=" On a watch running an older app this tap does nothing.";if(e.allPlaced===!0)return"Refreshes every Wrist Assistant complication placed on the watch, not just this one."+n;let o=e.targets?.length??0,i=Object.keys(e.targetLayers??{}).length,r=i===0?"":i===1?" One complication is narrowed to the layers ticked under its own box.":` ${i} complications are narrowed to the layers ticked under their own boxes.`;return o>0?`Refreshes this complication and the ${o} picked below.`+r+n:"Nothing is picked, so this tap only refreshes this complication. Pick all placed complications or some below."+r+n}var ji="\uE000",Ki="\uE001";function ef(e){return`${ji}${e}${Ki}`}function tf(e){let t=[],n="",o=e;for(;;){let i=o.indexOf(ji);if(i<0)break;let r=o.indexOf(Ki,i+1);if(n+=o.slice(0,i),r<0||r===i+1){n+=o.slice(i),o="";break}n!==""&&t.push({text:n}),n="",t.push({symbol:o.slice(i+1,r)}),o=o.slice(r+1)}return n+=o,n!==""&&t.push({text:n}),t}function nf(e){return(e.parts?.length??0)>0}var Bl=["toggleEntity","runScene","runScript","callService","runHTTPAction","openApp"],Gl=["toggleEntity","callService"],jl=new Set(["on","open","unlocked","home","playing","heat","cool"]),qi="switch.2";function Kl(e){return Bl.includes(e)}function of(e){return e.kind==="toggle"&&Gl.includes(e.action.type)?"toggle":"button"}function rf(e){return e!==void 0&&jl.has(e.trim().toLowerCase())}var Ji=4,qt=2,ei={min:1,max:10};function ve(e){return Number.isFinite(e)?Math.min(Math.max(Math.trunc(e),1),Ji):1}function re(e){return Number.isFinite(e)?Math.min(Math.max(e,ei.min),ei.max):qt}function ql(e=2,t="tap"){return{count:ve(e),mode:t,dwell:[]}}function De(e){return e!==void 0&&e.count>1}function Jt(e){return Array.from({length:ve(e.count)},(t,n)=>n+1)}function Jl(e){if(!g(e))return;let t=ve(v(e.count,1));if(t<=1)return;let n=(Array.isArray(e.dwell)?e.dwell:[]).slice(0,t).map(o=>re(v(o,qt)));return{count:t,mode:e.mode==="tour"?"tour":"tap",dwell:n}}function Xl(e){if(!De(e))return;let t={count:ve(e.count),mode:e.mode};return e.dwell.length>0&&(t.dwell=e.dwell.map(re)),t}function Yl(e){if(typeof e!="number"||!Number.isFinite(e))return;let t=Math.trunc(e);return t>=1?t:void 0}function Xi(e){return De(e.pages)?!0:e.elements.some(t=>t.payload.page!==void 0)}function Yi(e){let t=no(e);if(De(e.pages))return{...e.pages,mode:t,dwell:[...e.pages.dwell]};let n=e.elements.map(a=>a.payload.page).filter(a=>a!==void 0),o=n.length>0?Math.max(...n):1,i=e.pages??ql(1),r={...i,mode:t,dwell:[...i.dwell]};return o<=1?r:{...r,count:ve(o)}}function Zi(e,t){return t<1||t>e.dwell.length?qt:re(e.dwell[t-1])}function af(e){return Jt(e).reduce((t,n)=>t+Zi(e,n),0)}function sf(e,t){if(!De(e))return[];let n=[],o=0;for(let i of Jt(e))n.push({atMs:t+o*1e3,page:i}),o+=Zi(e,i);return n.push({atMs:t+o*1e3,page:1}),n}function Zl(e,t){let n=e.payload.page;return n===void 0||n===t}function lf(e,t,n){return Xi(e)?t.filter(o=>Zl(o,n)):[...t]}function df(e){return _n(e.tapAction.type)?!0:e.elements.some(t=>t.kind==="tap"&&_n(t.payload.action.type))}function _n(e){return e==="nextPage"||e==="previousPage"||e==="showPage"||e==="playTour"}function cf(e,t,n){let o=z("tap"),i=o.payload,r=t==="nextPage";return i.name=r?"Next page tap area":"Prev page tap area",i.frame={x:r?.5:0,y:0,width:.5,height:1,rotationDegrees:0},i.action={type:t},n!==void 0&&(i.page=n),e.elements.unshift(o),i.id}function no(e){return e.tapAction.type==="playTour"||e.elements.some(t=>t.kind==="tap"&&t.payload.action.type==="playTour")?"tour":"tap"}function oo(e,t){let n=ve(t);if(n<=1){delete e.pages;for(let i of e.elements)delete i.payload.page;return}for(let i of e.elements)i.payload.page!==void 0&&i.payload.page>n&&(i.payload.page=n);let o=e.pages;e.pages={count:n,mode:no(e),dwell:(o?.dwell??[]).slice(0,n).map(re)}}function uf(e){let t=Yi(e).count;if(!(t>=Ji))return oo(e,t+1),t+1}function pf(e){for(let t of e.elements)t.payload.page=1;return oo(e,2),2}function hf(e,t){let n=Yi(e);if(t<1||t>n.count)return;for(let i of e.elements.filter(r=>r.payload.page===t).map(r=>r.payload.id))ee(e,i);for(let i of e.elements){let r=i.payload.page;r!==void 0&&r>t&&(i.payload.page=r-1)}let o=[...n.dwell];t<=o.length&&o.splice(t-1,1),e.pages={count:n.count,mode:n.mode,dwell:o},oo(e,n.count-1)}function ff(e,t,n){let o=e.pages;if(!De(o))return;let i=ve(o.count),r=[];for(let a=0;a<i;a++)r.push(a<o.dwell.length?re(o.dwell[a]):void 0);for(t>=1&&t<=i&&(r[t-1]=n===void 0?void 0:re(n));r.length>0&&r[r.length-1]===void 0;)r.pop();o.dwell=r.map(a=>a??qt)}function Ql(e,t){if(!(t<1||t>e.dwell.length))return re(e.dwell[t-1])}function mf(e,t){let n=e.pages;De(n)&&(n.dwell=t===void 0?[]:Jt(n).map(()=>re(t)))}function gf(e){let t=Jt(e).map(o=>Ql(e,o)),n=t[0];return n!==void 0&&t.every(o=>o===n)?n:void 0}function yf(e){return(e.tapAction.type==="playTour"?1:0)+e.elements.filter(n=>n.kind==="tap"&&n.payload.action.type==="playTour").length}function bf(e,t,n,o){for(let i of e.elements)t.has(i.payload.id)&&(n?i.payload.page===void 0&&(i.payload.page=o):delete i.payload.page)}var xf="#30D158";function g(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function w(e,t=""){return typeof e=="string"?e:t}function v(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function j(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function st(e){return e==null?void 0:v(e,0)}function A(e){return typeof e=="string"?e:void 0}function ge(e,t,n){return typeof e=="string"&&t.includes(e)?e:n}function ye(e,t,n){return t.some(([o])=>o===e)?e:n}var X=class extends Error{};function ie(e){if(typeof e.entityId!="string")throw new X("entityId is required");let t={entityId:e.entityId,displayName:w(e.displayName),domain:w(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function ti(e){if(!g(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=v(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=v(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=v(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),e.duration===!0&&(t.duration=!0),as.some(([n])=>n===e.timestamp)&&(t.timestamp=e.timestamp),e.hideMinutes===!0&&(t.hideMinutes=!0),e.hideDayPeriod===!0&&(t.hideDayPeriod=!0),e.showSeconds===!0&&(t.showSeconds=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),Re(t)?void 0:t}function Re(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.timestamp===void 0&&!e.hideMinutes&&!e.hideDayPeriod&&!e.showSeconds&&e.textCase===void 0:!0}function Qi(e){let t=w(e.function,"count"),n=g(e.scope)?e.scope:{},o;if(n.kind==="entities")o={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(g).map(ie)};else{let r=a=>Array.isArray(a)?a.filter(l=>typeof l=="string"):[];o={kind:"filter",domains:r(n.domains),areaIds:r(n.areaIds),labelIds:r(n.labelIds),floorIds:r(n.floorIds)}}let i={function:t,scope:o};if(g(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?i.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(i.stateFilter={kind:r,value:w(e.stateFilter.value)})}return typeof e.attribute=="string"&&(i.attribute=e.attribute),i}function ni(e){switch(e.kind){case"literal":return{kind:"literal",value:w(e.value)};case"entityState":return{kind:"entityState",...ie(e)};case"entityAttribute":return{kind:"entityAttribute",...ie(e),attribute:w(e.attribute)};case"entityAge":return{kind:"entityAge",...ie(e)};case"aggregate":return{kind:"aggregate",aggregate:Qi(g(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:A(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:w(e.value)};case"named":return{kind:"named",id:w(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:w(e.layer).toUpperCase(),stat:rs.some(([t])=>t===e.stat)?e.stat:"latest"};case"item":return{kind:"item",field:w(e.field)};case"listStat":return{kind:"listStat",layer:w(e.layer).toUpperCase(),stat:e.stat==="total"?"total":"count"};case"imageTime":return{kind:"imageTime",layer:w(e.layer).toUpperCase()};default:throw new X(`unknown value kind ${String(e.kind)}`)}}function E(e){if(!g(e))throw new X("value must be an object");if(g(e.kind)){let o={kind:ni(e.kind)},i=ti(e.format);return i&&(o.format=i),o}let t={kind:ni(e)},n=ti(e.format);return n&&(t.format=n),t}function er(e){return g(e)?{x:v(e.x,.25),y:v(e.y,.25),width:v(e.width,.5),height:v(e.height,.5),rotationDegrees:v(e.rotationDegrees,0)}:{...ki}}function ed(e){if(!g(e))return{kind:"isOn"};let t=w(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=g(e.value)?E(e.value):T("");break;case"between":case"timeBetween":n.value=g(e.value)?E(e.value):T(""),n.upper=g(e.upper)?E(e.upper):T("");break;case"matchesRegex":n.pattern=w(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(o=>typeof o=="string"):[];break;default:break}return n}function oi(e){if(!g(e))return{kind:"show"};let t=w(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=g(e.value)?E(e.value):T(""),t==="setIcon"&&A(e.path)&&(n.path=A(e.path));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=v(e.number,0);break;case"setFontWeight":n.weight=A(e.weight)??"regular";break;case"setFontDesign":n.design=A(e.design)??"default";break;case"setFontWidth":n.width=Ot(A(e.width))??"standard";break;case"setItalic":n.italic=e.italic!==!1;break;default:break}return n}function tr(e){return Array.isArray(e)?e.filter(g).map(t=>{let n={id:w(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(g).map(o=>{let i=g(o.when)?o.when:{};return{id:w(o.id).toUpperCase(),when:{join:i.join==="any"?"any":"all",tests:(Array.isArray(i.tests)?i.tests:[]).filter(g).map(r=>({id:w(r.id).toUpperCase(),value:g(r.value)?E(r.value):T(""),comparison:ed(r.comparison)}))},then:(Array.isArray(o.then)?o.then:[]).map(oi)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(oi)),typeof t.partId=="string"&&t.partId!==""&&(n.partId=t.partId.toUpperCase()),n}):[]}function td(e,t){return{baseColorHex:g(e)?w(e.baseColorHex,t):t}}function ut(e){return Array.isArray(e)?e.filter(g).map(t=>{let n={id:w(t.id,I()),upTo:v(t.upTo,0),colorHex:w(t.colorHex,"#FFFFFF")};return typeof t.fillColorHex=="string"&&(n.fillColorHex=t.fillColorHex),typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),n}):[]}function lt(e){let t={id:e.id,upTo:x(e.upTo),colorHex:e.colorHex};return e.fillColorHex!==void 0&&(t.fillColorHex=e.fillColorHex),e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t}function nd(e){return Array.isArray(e)?e.filter(g).map(t=>{let n={id:w(t.id,I()).toUpperCase(),value:g(t.value)?E(t.value):T("")};g(t.icon)&&(n.icon=E(t.icon)),typeof t.colorHex=="string"&&(n.colorHex=t.colorHex);let o=A(t.fontWeight);(o==="regular"||o==="medium"||o==="semibold"||o==="bold")&&(n.fontWeight=o),typeof t.fontSize=="number"&&(n.fontSize=t.fontSize);let i=A(t.fontDesign);(i==="default"||i==="rounded"||i==="monospaced"||i==="serif")&&(n.fontDesign=i);let r=Ot(A(t.fontWidth));r!==void 0&&(n.fontWidth=r),typeof t.italic=="boolean"&&(n.italic=t.italic),A(t.coloring)==="bands"&&(n.coloring="bands");let a=ut(t.bands);a.length>0&&(n.bands=a);let l=w(t.bandAboveColorHex,G);return l!==G&&(n.bandAboveColorHex=l),n}):[]}function od(e){if(Array.isArray(e.bands))return ut(e.bands);if(typeof e.bandLowerBound!="number")return[];let t=g(e.colorSlot)?w(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:I(),upTo:e.bandLowerBound,colorHex:w(e.bandLowColorHex,Xs)},{id:I(),upTo:v(e.bandUpperBound,100),colorHex:t}]}function id(e){return Array.isArray(e)?e.filter(g).map(t=>({id:w(t.id,I()).toUpperCase(),match:w(t.match,""),colorHex:w(t.colorHex,Gt)})):[]}function rd(e){if(!g(e))return;let t=[];for(let n of Array.isArray(e.entities)?e.entities:[]){let o=typeof n=="string"?n.trim():"";o!==""&&!t.includes(o)&&t.push(o)}if(t.length!==0)return{entities:t,combine:e.combine==="all"?"all":Bt}}function En(e){let t=g(e)?e:{},n={entityId:w(t.entityId),displayName:w(t.displayName),domain:w(t.domain)};return typeof t.iconName=="string"&&(n.iconName=t.iconName),n}function ii(e){return Array.isArray(e)?e.map(En).filter(t=>t.entityId!==""):[]}function ad(e){let t=g(e)?e:{},n=o=>Array.isArray(o)?o.filter(i=>typeof i=="string"):[];switch(t.kind){case"attribute":return{kind:"attribute",...En(t),attribute:w(t.attribute)};case"template":return{kind:"template",value:w(t.value)};case"calendar":return{kind:"calendar",entities:ii(t.entities),hours:Oe(t.hours)};case"todo":return{kind:"todo",entities:ii(t.entities),status:ye(A(t.status),Fl,"open"),sort:ye(A(t.sort),Hl,"list")};case"forecast":return{kind:"forecast",...En(t),type:ye(A(t.type),Ll,"hourly")};default:{let o=Qi({scope:t.scope,stateFilter:t.stateFilter}),i={kind:"entities",scope:o.scope,sort:ye(A(t.sort),El,"name"),descending:t.descending===!0,attributes:n(t.attributes)},r=w(t.deviceClass).trim();return r!==""&&(i.deviceClass=r),o.stateFilter&&(i.stateFilter=o.stateFilter),i}}}function sd(e){if(g(e))return{colorHex:w(e.colorHex,Ci),radius:Is(v(e.radius,0)),dx:qo(v(e.dx,0)),dy:qo(v(e.dy,0))}}function V(e,t){if(typeof e.id!="string")throw new X("element id is required");let n={id:e.id.toUpperCase(),colorSlot:td(e.colorSlot,t),rules:tr(e.rules),frame:er(e.frame),isHidden:e.isHidden===!0},o=Ms(v(e.opacity,1));o!==1&&(n.opacity=o);let i=sd(e.shadow);return i!==void 0&&(n.shadow=i),n}function ld(e){let t=nr(e),n=Yl(e.payload.page);return n!==void 0&&(t.payload.page=n),t}function nr(e){let t=dd(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),typeof n.name=="string"&&n.name!==""&&(t.payload.name=n.name),n.accentGroup==="accent"&&(t.payload.accentGroup="accent"),t}function dd(e){if(!g(e)||!g(e.payload))throw new X("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...V(t,"#FFFFFF"),value:g(t.value)?E(t.value):T(""),fontSize:v(t.fontSize,14),fontWeight:A(t.fontWeight)??"regular"};t.countdown===!0&&(n.countdown=!0),t.monospacedDigits===!0&&(n.monospacedDigits=!0);let o=typeof t.lineLimit=="number"?Math.round(t.lineLimit):1,i=Math.min(Ua,Math.max(1,o));i>1&&(n.lineLimit=i);let r=A(t.fontDesign);(r==="rounded"||r==="monospaced"||r==="serif")&&(n.fontDesign=r);let a=Ot(A(t.fontWidth));a!==void 0&&a!=="standard"&&(n.fontWidth=a),t.italic===!0&&(n.italic=!0);let l=Ba(v(t.minimumScale,ct));l!==ct&&(n.minimumScale=l);let s=A(t.alignment);(s==="leading"||s==="trailing")&&(n.alignment=s),A(t.coloring)==="bands"&&(n.coloring="bands");let h=ut(t.bands);h.length>0&&(n.bands=h);let u=w(t.bandAboveColorHex,G);u!==G&&(n.bandAboveColorHex=u);let d=A(t.highlight);(d==="highest"||d==="lowest"||d==="both")&&(n.highlight=d);let c=w(t.highColorHex,Le);c!==Le&&(n.highColorHex=c);let p=w(t.lowColorHex,Ie);p!==Ie&&(n.lowColorHex=p);let f=nd(t.parts);f.length>0&&(n.parts=f);let m=As(t.arc);return m!==void 0&&(n.arc=m),Ft(t,n),{kind:"text",payload:n}}case"icon":{let n={...V(t,"#FFFFFF"),symbol:g(t.symbol)?E(t.symbol):T("lightbulb"),size:v(t.size,14)},o=A(t.path);o!==void 0&&o!==""&&(n.path=o);let i=Wn(A(t.viewBox));return i!==void 0&&(n.viewBox=i),Go(t,n),Ft(t,n),{kind:"icon",payload:n}}case"gauge":{let n={...V(t,"#FFFFFF"),value:g(t.value)?E(t.value):T("50"),minValue:v(t.minValue,0),maxValue:v(t.maxValue,100),style:A(t.style)??"arc",lineWidth:v(t.lineWidth,4),trackColorHex:w(t.trackColorHex,"#FFFFFF40"),coloring:A(t.coloring)??"uniform",bands:ut(t.bands),bandAboveColorHex:w(t.bandAboveColorHex,G),thresholdColorHex:w(t.thresholdColorHex,Un)},o=st(t.thresholdValue);o!==void 0&&(n.thresholdValue=o),g(t.total)&&(n.total=E(t.total)),g(t.minSource)&&(n.minSource=E(t.minSource)),g(t.maxSource)&&(n.maxSource=E(t.maxSource));let i=rt(t.fill);i!==void 0&&(n.fill=i);let r=Us(t.ticks);r!==void 0&&(n.ticks=r);let a=Gs(t.labels);return a!==void 0&&(n.labels=a),{kind:"gauge",payload:n}}case"chart":return{kind:"chart",payload:{...V(t,"#FFFFFF"),value:g(t.value)?E(t.value):T("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(v(t.historyMinutes,0))),historyPoints:Math.round(v(t.historyPoints,24)),source:ye(A(t.source),ns,$n),statPeriod:ye(A(t.statPeriod),os,Nn),statType:ye(A(t.statType),is,On),style:ge(t.style,["bars","line","area"],"bars"),limit:Math.max(0,Math.round(v(t.limit,0))),takeFromEnd:t.takeFromEnd===!0,scale:ge(t.scale,["auto","fixed"],"auto"),minValue:v(t.minValue,0),maxValue:v(t.maxValue,100),baseline:ge(t.baseline,["lowest","zero"],"lowest"),barGap:v(t.barGap,1.5),lineWidth:v(t.lineWidth,2),highlight:ge(t.highlight,["none","highest","lowest","both"],"none"),highColorHex:w(t.highColorHex,Le),lowColorHex:w(t.lowColorHex,Ie),marker:typeof t.marker=="string"?ge(t.marker,["none","dot","pointer"],"dot"):"pointer",...Xo(t.highMarker)?{highMarker:t.highMarker}:{},...Xo(t.lowMarker)?{lowMarker:t.lowMarker}:{},coloring:ge(t.coloring,["uniform","bands"],"uniform"),bands:od(t),bandAboveColorHex:w(t.bandHighColorHex,w(t.bandAboveColorHex,G)),fillBands:t.fillBands===!0,...Bo(t.curve)!=="straight"?{curve:Bo(t.curve)}:{},...wn(t.fillStyle)!=="flat"?{fillStyle:wn(t.fillStyle)}:{},...typeof t.fillColorHex=="string"?{fillColorHex:t.fillColorHex}:{},...rt(t.areaFill)!==void 0?{areaFill:rt(t.areaFill)}:{},...Cn(t.barRadius)!==Pn?{barRadius:Cn(t.barRadius)}:{},...Sn(t.barCorners)!=="all"?{barCorners:Sn(t.barCorners)}:{},...typeof t.barBorderWidth=="number"&&Number.isFinite(t.barBorderWidth)&&t.barBorderWidth!==0?{barBorderWidth:t.barBorderWidth}:{},...typeof t.barBorderColorHex=="string"?{barBorderColorHex:t.barBorderColorHex}:{},...t.barBorderOpenBase===!0?{barBorderOpenBase:!0}:{},...typeof t.bandAboveFillColorHex=="string"?{bandAboveFillColorHex:t.bandAboveFillColorHex}:{},...typeof t.bandAboveBorderColorHex=="string"?{bandAboveBorderColorHex:t.bandAboveBorderColorHex}:{},...vn(t.pointDots)!=="none"?{pointDots:vn(t.pointDots)}:{},...at(t.pointDotSize)!==void 0?{pointDotSize:at(t.pointDotSize)}:{},...typeof t.pointDotColorHex=="string"?{pointDotColorHex:t.pointDotColorHex}:{},...kn(t.gridLines)!==0?{gridLines:kn(t.gridLines)}:{},...$e(He(t.gridColorHex),Dt)?{}:{gridColorHex:He(t.gridColorHex)},...t.zeroLine===!0?{zeroLine:!0}:{},...Tn(t.smoothing)!==void 0?{smoothing:Tn(t.smoothing)}:{},...t.gaps===!0?{gaps:!0}:{},...typeof t.thresholdValue=="number"&&Number.isFinite(t.thresholdValue)?{thresholdValue:t.thresholdValue}:{},thresholdColorHex:w(t.thresholdColorHex,Bn),...g(t.nowIndex)?{nowIndex:E(t.nowIndex)}:{},nowColorHex:w(t.nowColorHex,Gn),...t.drawsThreshold===!1?{drawsThreshold:!1}:{},...t.drawsNowLine===!1?{drawsNowLine:!1}:{},...t.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{},...A(t.scaleFrom)!==void 0?{scaleFrom:A(t.scaleFrom)}:{},timeLabelCount:Me(t.timeLabelCount),labelSize:v(t.labelSize,te),labelColorHex:w(t.labelColorHex,ne),labelsAbove:t.labelsAbove===!0,hourCycle:bn(t.hourCycle),minutes:xn(t.minutes)}};case"timeline":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i=rd(t.aggregate);return{kind:"timeline",payload:{...o,value:g(t.value)?E(t.value):T(""),...i!==void 0?{aggregate:i}:{},historyMinutes:Math.max(1,Math.round(v(t.historyMinutes,Yn))),bands:id(t.bands),otherColorHex:w(t.otherColorHex,Gt),gap:Math.min(yl,Math.max(0,v(t.gap,0))),cornerRadius:Math.max(0,v(t.cornerRadius,Ii)),timeLabelCount:ul(t),labelSize:v(t.labelSize,te),labelColorHex:w(t.labelColorHex,ne),labelsAbove:t.labelsAbove===!0,hourCycle:bn(t.hourCycle),minutes:xn(t.minutes),...t.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{}}}}case"shape":{let n={...V(t,"#FFFFFF33"),kind:A(t.kind)??"roundedRectangle",cornerRadius:v(t.cornerRadius,6),thickness:v(t.thickness,1),borderWidth:v(t.borderWidth,1)};typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex);let o=rt(t.fill);return o!==void 0&&(n.fill=o),Go(t,n),Ft(t,n),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i={...o,entity:g(t.entity)?ie(t.entity):{entityId:"",displayName:"",domain:""},source:t.source==="entityPicture"?"entityPicture":t.source==="inline"?"inline":"camera",contentMode:t.contentMode==="fit"?"fit":"fill",zoom:v(t.zoom,1),panX:v(t.panX,0),panY:v(t.panY,0),cornerRadius:v(t.cornerRadius,Oi),timestampCorner:Sl.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:v(t.timestampSize,Kt)},r=A(t.data);r!==void 0&&r!==""&&(i.data=r),t.format==="jpeg"&&(i.format="jpeg"),t.timestamp===!0&&(i.timestamp=!0);let a=st(t.timestampX),l=st(t.timestampY);return a!==void 0&&l!==void 0&&Number.isFinite(a)&&Number.isFinite(l)&&(i.timestampX=j(a),i.timestampY=j(l)),Ft(t,i),{kind:"image",payload:i}}case"tap":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i={...o,action:g(t.action)?io(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(i.openPageId=t.openPageId),typeof t.openPageName=="string"&&(i.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(i.attachedTo=t.attachedTo.toUpperCase()),{kind:"tap",payload:i}}case"chartTimes":{let{colorSlot:n,...o}=V(t,"#FFFFFF");return{kind:"chartTimes",payload:{...o,chart:w(t.chart).toUpperCase(),timeLabelCount:Me(t.timeLabelCount),labelSize:v(t.labelSize,te),labelColorHex:w(t.labelColorHex,ne),hourCycle:bn(t.hourCycle),minutes:xn(t.minutes),...cl(t)}}}case"imageTime":{let{colorSlot:n,...o}=V(t,"#FFFFFF");return{kind:"imageTime",payload:{...o,image:w(t.image).toUpperCase()}}}case"chartDots":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i=at(t.size);return{kind:"chartDots",payload:{...o,chart:w(t.chart).toUpperCase(),dots:xi(t.dots),...i!==void 0?{size:i}:{},...typeof t.colorHex=="string"?{colorHex:t.colorHex}:{}}}}case"chartGrid":{let{colorSlot:n,...o}=V(t,"#FFFFFF");return{kind:"chartGrid",payload:{...o,chart:w(t.chart).toUpperCase(),lines:wi(t.lines),colorHex:He(t.colorHex),thickness:vi(t.thickness)}}}case"list":{let{colorSlot:n,...o}=V(t,"#FFFFFF"),i=(Array.isArray(t.template)?t.template:[]).filter(r=>g(r)&&!Ui.includes(String(r.kind))).map(r=>nr(r));return{kind:"list",payload:{...o,source:ad(t.source),rows:Ne(t.rows),direction:t.direction==="across"?"across":"down",columns:to(t.columns),gap:Bi(t.gap),template:i}}}default:throw new X(`unknown element kind ${String(e.kind)}`)}}function ri(e){let t=g(e)?e:{},n={};if(g(t.placements))for(let[r,a]of Object.entries(t.placements)){if(!g(a))continue;let l={frame:er(a.frame),isHidden:a.isHidden===!0},s=st(a.size);s!==void 0&&(l.size=s),n[r.toUpperCase()]=l}let o={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:v(t.borderWidth,2),rules:tr(t.rules)};if(g(t.bezelText)&&(o.bezelText=E(t.bezelText)),t.bezelCountdown===!0&&(o.bezelCountdown=!0),g(t.curvedText)&&(o.curvedText=E(t.curvedText)),typeof t.curvedColorHex=="string"&&(o.curvedColorHex=t.curvedColorHex),g(t.parkedCurvedText)&&(o.parkedCurvedText=E(t.parkedCurvedText)),typeof t.parkedCurvedColorHex=="string"&&(o.parkedCurvedColorHex=t.parkedCurvedColorHex),g(t.bezelGauge)){let r=t.bezelGauge,a={value:g(r.value)?E(r.value):T("50"),minValue:v(r.minValue,0),maxValue:v(r.maxValue,100),colorHexes:Array.isArray(r.colorHexes)&&r.colorHexes.length>0?r.colorHexes.filter(l=>typeof l=="string"):["#34C759","#FFCC00","#FF3B30"]};g(r.minLabel)&&(a.minLabel=E(r.minLabel)),g(r.maxLabel)&&(a.maxLabel=E(r.maxLabel)),o.bezelGauge=a}typeof t.backgroundColorHex=="string"&&(o.backgroundColorHex=t.backgroundColorHex);let i=rt(t.backgroundFill);return i!==void 0&&(o.backgroundFill=i),typeof t.borderColorHex=="string"&&(o.borderColorHex=t.borderColorHex),o}function cd(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let o=e[n];typeof o=="string"&&(t[o]=ri(e[n+1]))}else if(g(e))for(let[n,o]of Object.entries(e))t[n]=ri(o);return t}function ud(e){let t={value:g(e.value)?E(e.value):T("")};if(typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),Array.isArray(e.parts)){let n=e.parts.filter(g).map(o=>{let i={id:typeof o.id=="string"&&o.id!==""?o.id.toUpperCase():I(),value:g(o.value)?E(o.value):T("")};return typeof o.symbol=="string"&&o.symbol!==""&&(i.symbol=o.symbol),i});n.length>0&&(t.parts=n)}return t}function pd(e){let t={kind:e.kind==="button"?"button":"toggle",title:g(e.title)?E(e.title):T(""),symbol:w(e.symbol,qi),coloring:e.coloring==="bands"?"bands":"uniform",bands:ut(e.bands),action:io(e.action)};return g(e.valueLabel)&&(t.valueLabel=E(e.valueLabel)),g(e.state)&&(t.state=E(e.state)),typeof e.symbolOff=="string"&&(t.symbolOff=e.symbolOff),typeof e.tintColorHex=="string"&&(t.tintColorHex=e.tintColorHex),typeof e.bandAboveColorHex=="string"&&(t.bandAboveColorHex=e.bandAboveColorHex),g(e.status)&&(t.status=E(e.status)),t}function Fn(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){if(typeof n!="string")continue;let o=n.trim().toUpperCase();o===""||t.includes(o)||t.push(o)}return t}function hd(e){if(!g(e))return;let t={};for(let[n,o]of Object.entries(e)){if(!Array.isArray(o))continue;let i=n.trim().toUpperCase();i===""||i in t||(t[i]=Fn(o))}return Object.keys(t).length>0?t:void 0}function io(e){if(!g(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":case"nextPage":case"previousPage":case"playTour":return{type:e.type};case"refresh":return Array.isArray(e.layerIds)?{type:"refresh",layerIds:Fn(e.layerIds)}:{type:"refresh"};case"refreshAll":{let t={type:"refreshAll"};if(e.allPlaced===!0)return t.allPlaced=!0,t;let n=Fn(e.targets);n.length>0&&(t.targets=n);let o=hd(e.targetLayers);return o!==void 0&&(t.targetLayers=o),t}case"showPage":return{type:"showPage",page:typeof e.page=="number"&&Number.isInteger(e.page)&&e.page>=1?e.page:1};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":case"openEntity":return{type:e.type,...ie(e)};case"callService":{let t={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(t.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(t.target=ie(e)),t}default:return{type:"none"}}}function wf(e){if(!g(e))throw new X("config must be an object");for(let l of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(l in e))throw new X(`${l} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(g).map(l=>({id:w(l.id).toUpperCase(),name:w(l.name),value:g(l.value)?E(l.value):T("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(g).map(l=>l.kind==="template"?{kind:"template",value:w(l.value)}:l.kind==="entity"?{kind:"entity",...ie(l)}:null).filter(l=>l!==null),o={schemaVersion:v(e.schemaVersion,1),id:w(e.id).toUpperCase(),name:w(e.name,"Custom"),values:t,slotIndex:v(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(ld),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(l=>typeof l=="string"),perFamily:cd(e.perFamily),dataSources:n,tapAction:io(e.tapAction)};g(e.inline)&&(o.inline=ud(e.inline)),g(e.control)&&(o.control=pd(e.control));let i=st(e.refreshMinutes);i!==void 0&&(o.refreshMinutes=i),typeof e.openPageId=="string"&&(o.openPageId=e.openPageId),typeof e.openPageName=="string"&&(o.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(o.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(o.successFlashColorHex=e.successFlashColorHex),e.httpShowResult===!0&&(o.httpShowResult=!0),e.hidden===!0&&(o.hidden=!0),typeof e.linkId=="string"&&e.linkId!==""&&(o.linkId=e.linkId.toUpperCase()),typeof e.legacyControlEntityId=="string"&&e.legacyControlEntityId!==""&&(o.legacyControlEntityId=e.legacyControlEntityId);let r=Jl(e.pages);if(r!==void 0&&(o.pages=r),Array.isArray(e.groups)){let l=e.groups.filter(g).filter(s=>typeof s.id=="string").map(s=>({id:w(s.id).toUpperCase(),name:w(s.name,"Group"),locked:s.locked!==!1,...typeof s.parentId=="string"&&s.parentId!==""?{parentId:s.parentId.toUpperCase()}:{}}));l.length>0&&(o.groups=l)}let a=gn(e.notes);return a!==void 0&&(o.notes=a),Nd(o,Array.isArray(e.elements)?e.elements:[]),B(o),o}function fd(e,t){let n=t?.kind;if(!n||n.kind!=="chartStat")return;let o=e.elements.find(i=>i.payload.id===n.layer);return o?.kind==="chart"?o:void 0}function or(e,t){return e.elements.filter(n=>n.kind==="text"&&n.payload.value.kind.kind==="chartStat"&&n.payload.value.kind.layer===t)}function se(e,t,n){ir(e,t,n);let o=lo(e,t.payload.id);if(o){Qd(e,n,o.id);return}let i=xr(e,[t.payload.id,n]),r=e.groups?.find(a=>a.id===i);r&&(r.locked=!1)}function ir(e,t,n){let o=e.elements.find(i=>i.payload.id===n);o&&(t.payload.page===void 0?delete o.payload.page:o.payload.page=t.payload.page)}var rr={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function ar(e,t,n,o){let i=N.rectangular,r=Math.min(1,(o*n*.62+4)/i.width),a=Math.min(1,n*1.3/i.height),l=e.x+t.x*e.width-t.x*r,s=e.y+t.y*e.height-t.y*a;return{x:Math.max(0,Math.min(1-r,l)),y:Math.max(0,Math.min(1-a,s)),width:r,height:a,rotationDegrees:0}}function vf(e,t,n){let o=e.elements.find(h=>h.payload.id===t);if(!o||o.kind!=="chart")return;let i=z("text"),r=n==="latest"?10:8,a={kind:{kind:"chartStat",layer:t,stat:n}};(n==="latest"||n==="delta"||n==="sum")&&(a.format={useEntityUnit:!0}),i.payload.value=a,i.payload.fontSize=r,i.payload.fontWeight="medium",i.payload.colorSlot={baseColorHex:n==="latest"?"#FFFFFF":"#FFFFFF99"};let l=n==="trend"?2:a.format?.useEntityUnit?7:4;i.payload.frame=ar(o.payload.frame,rr[n],r,l);let s=e.elements.findIndex(h=>h.payload.id===t);return e.elements.splice(s+1,0,i),se(e,o,i.payload.id),i.payload.id}var sr={highest:"arrowtriangle.up.fill",lowest:"circle.fill",now:"arrowtriangle.down.fill",first:"circle.fill",latest:"circle.fill",threshold:"circle.fill",zero:"circle.fill"},ai=6,md={"\u25B2":"arrowtriangle.up.fill","\u25BC":"arrowtriangle.down.fill","\u25CF":"circle.fill","\u25C6":"diamond.fill"};function gd(e,t){let n=(o,i)=>o!==void 0&&o!==i?o:void 0;return t==="highest"?n(e.payload.highColorHex,Le)??"#FFD60A":t==="lowest"?n(e.payload.lowColorHex,Ie)??"#FF453A":"#FFFFFF"}function ro(e){e.nowIndex===void 0&&(e.nowIndex={kind:{kind:"time",timeField:"hour"}},e.drawsNowLine=!1)}function Pe(e,t){return e.elements.filter(n=>n.payload.chartAnchor?.layer===t)}function yd(e,t,n,o="above"){let i=e.elements.find(l=>l.payload.id===t);if(!i||i.kind!=="chart")return;n==="now"&&ro(i.payload);let r=z("icon");r.payload.symbol=T(sr[n]),r.payload.size=ai,r.payload.colorSlot={baseColorHex:gd(i,n)},r.payload.frame=bd(ai),r.payload.chartAnchor={layer:t,at:n,place:o};let a=e.elements.findIndex(l=>l.payload.id===t);return e.elements.splice(a+1,0,r),se(e,i,r.payload.id),r.payload.id}function kf(e,t){let n=e.elements.findIndex(d=>d.payload.id===t),o=e.elements[n];if(!o||o.kind!=="text"||o.payload.chartAnchor===void 0)return;let i=o.payload,r=i.chartAnchor,a=d=>{let c=Ti(d);return c===void 0?void 0:md[c.trim()]},l=new Set(Lc.icon),s=d=>d.flatMap(c=>{if(c.kind==="setText"){let p=c.value===void 0?void 0:a(c.value);return p===void 0?[]:[{kind:"setIcon",value:T(p)}]}return l.has(Hs[c.kind])?[c]:[]}),h=i.rules.filter(d=>d.partId===void 0).map(d=>({...d,cases:d.cases.map(c=>({...c,then:s(c.then)})),...d.otherwise!==void 0?{otherwise:s(d.otherwise)}:{}})),u=z("icon");u.payload={...u.payload,id:i.id,colorSlot:i.colorSlot,rules:h,frame:i.frame,isHidden:i.isHidden,...i.groupId!==void 0?{groupId:i.groupId}:{},...i.name!==void 0?{name:i.name}:{},chartAnchor:r,symbol:T(a(i.value)??sr[r.at]),size:i.fontSize},e.elements[n]=u}function bd(e){let t=N.rectangular;return{x:0,y:0,width:Math.min(1,e*1.2/t.width),height:Math.min(1,e*1.3/t.height),rotationDegrees:0}}function Mt(e,t,n){let o=e.elements.find(l=>l.payload.id===t);if(!o||o.kind!=="chart")return;let i=o.payload;n==="now"&&ro(i);let r=z("shape");r.payload.kind="line",r.payload.thickness=1,r.payload.borderWidth=0,r.payload.colorSlot={baseColorHex:n==="now"?i.nowColorHex:i.thresholdColorHex},r.payload.frame=lr(i.frame,n),r.payload.chartAnchor={layer:t,at:n,place:"through"};let a=e.elements.findIndex(l=>l.payload.id===t);return e.elements.splice(a+1,0,r),se(e,o,r.payload.id),n==="now"?i.drawsNowLine=!1:i.drawsThreshold=!1,r.payload.id}function lr(e,t){let n=N.rectangular,o=3;return t==="now"?{...e,width:Math.min(e.width,o/n.width),rotationDegrees:0}:{...e,height:Math.min(e.height,o/n.height),rotationDegrees:0}}function xd(e,t){return e.elements.filter(n=>n.kind==="chartTimes"&&n.payload.chart===t)}function dr(e,t){let n=e.elements.find(a=>a.payload.id===t);if(!n||n.kind!=="chart"&&n.kind!=="timeline")return;let o=n.payload,i=z("chartTimes");i.payload.chart=t,i.payload.timeLabelCount=o.timeLabelCount>0?Me(o.timeLabelCount):Mi,i.payload.labelSize=o.labelSize,i.payload.labelColorHex=o.labelColorHex,i.payload.hourCycle=o.hourCycle,i.payload.minutes=o.minutes,i.payload.frame=$d(o.frame,o.labelSize,o.labelsAbove);let r=e.elements.findIndex(a=>a.payload.id===t);return e.elements.splice(r+1,0,i),se(e,n,i.payload.id),o.drawsTimeLabels=!1,i.payload.id}function wd(e,t){return e.elements.filter(n=>n.kind==="imageTime"&&n.payload.image===t)}function vd(e){let t=Math.min(40,Math.max(4,e));return{w:8*t*.578+t*.89,h:t*1.25}}function cr(e,t){return Math.max(0,Math.min(e/(8*.578+.89),t/1.25))}var ao="Timestamp",kd="#0000008C";function Rt(e,t){let n=e?.kind;return n?.kind==="imageTime"&&(t===void 0||n.layer.toUpperCase()===t.toUpperCase())}function Cd(e,t){return e.elements.filter(n=>n.kind==="text"&&(Rt(n.payload.value,t)||(n.payload.parts??[]).some(o=>Rt(o.value,t))))}function Sd(e,t){let n=new Set;for(let o of wd(e,t))n.add(o.payload.id);for(let o of Cd(e,t))for(let i of ur(e,o))n.add(i);return e.elements.filter(o=>n.has(o.payload.id))}function ur(e,t){let n=t.payload.groupId;if(n===void 0)return[t.payload.id];let o=yr(e,n);return o.every(r=>r.kind==="shape"||r.kind==="text"&&(Rt(r.payload.value)||(r.payload.parts??[]).some(a=>Rt(a.value))))?o.map(r=>r.payload.id):[t.payload.id]}function Cf(e,t){let n=e.elements.find(i=>i.payload.id===t);if(!n)return;let o=n.kind==="text"?ur(e,n):[t];for(let i of o)ee(e,i)}function pr(e,t,n){let o=z("shape");o.payload.kind="capsule",o.payload.colorSlot={baseColorHex:kd},o.payload.borderWidth=0,o.payload.frame={...t};let i=z("text");return i.payload.value={kind:{kind:"imageTime",layer:e},format:{timestamp:"clock",showSeconds:!0,hideDayPeriod:!0}},i.payload.colorSlot={baseColorHex:"#FFFFFF"},i.payload.fontWeight="semibold",i.payload.fontDesign="rounded",i.payload.fontSize=Math.round(Math.max(4,n)*10)/10,i.payload.frame={...t},[o,i]}function Td(e){let t=e.payload.name?.trim();if(t)return t;if(e.kind!=="image")return"Picture";let n=e.payload.entity,o=n.displayName.trim()||n.entityId.trim();return o!==""&&e.payload.source!=="inline"?o:e.payload.source==="camera"?"Camera":"Picture"}function hr(e,t){let n=P(e,t.payload.groupId);if(n)return n.id;let o={id:I(),name:Td(t),locked:!1};return e.groups=[...e.groups??[],o],t.payload.groupId=o.id,o.id}function Hn(e,t,n,o=ao,i){if(e.elements.splice(n,0,...t),i!==void 0)for(let r of t)r.payload.groupId=i;return xr(e,t.map(r=>r.payload.id),o)}function fr(e,t,n,o){let i=hr(e,t);return Hn(e,n,e.elements.indexOf(t)+1,o,i)}function Ad(e){for(let t of[...e.groups??[]]){if(t.parentId!==void 0||t.name!==ao||!t.locked||Xd(e,t.id).length>0)continue;let n=yr(e,t.id);if(n.length!==2)continue;let o=n.find(m=>m.kind==="shape"&&m.payload.kind==="capsule"),i=n.find(m=>m.kind==="text"&&m.payload.value.kind.kind==="imageTime");if(!o||!i||i.kind!=="text"||i.payload.value.kind.kind!=="imageTime")continue;let r=i.payload.value.kind.layer.toUpperCase(),a=e.elements.find(m=>m.kind==="image"&&m.payload.id.toUpperCase()===r);if(!a)continue;let l=e.elements.filter(m=>!R(e,m)),s=m=>{let y=l.map((S,H)=>m.has(S.payload.id)?H:-1).filter(S=>S>=0);if(!(y.length===0||y[y.length-1]-y[0]+1!==y.length))return[y[0],y[y.length-1]]},h=U(e,a.payload.groupId),u=h[h.length-1],d=s(u?new Set(oe(e,u.id).map(m=>m.payload.id)):new Set([a.payload.id])),c=s(new Set(n.map(m=>m.payload.id)));if(!d||!c||c[0]!==d[1]+1&&d[0]!==c[1]+1)continue;let p=hr(e,a),f=e.elements.filter(m=>!n.includes(m));f.splice(f.indexOf(a)+1,0,...n),e.elements=f,t.parentId=p,B(e),le(e)}}function _d(e,t,n=N.rectangular){let o=e.elements.find(m=>m.payload.id===t);if(!o||o.kind!=="image")return;let i=o.payload,r=vd(i.timestampSize),a=i.frame.x*n.width,l=i.frame.y*n.height,s=i.frame.width*n.width,h=i.frame.height*n.height,u,d;if(Di(i)){let m=(y,S,H,O)=>O>=H?S+(H-O)/2:Math.min(S+H-O,Math.max(S,y-O/2));u=m(a+i.timestampX*s,a,s,r.w),d=m(l+i.timestampY*h,l,h,r.h)}else u=i.timestampCorner.endsWith("Leading")?a+4:a+s-4-r.w,d=i.timestampCorner.startsWith("top")?l+4:l+h-4-r.h;let c=m=>Math.round(m*1e3)/1e3,p={x:c(u/n.width),y:c(d/n.height),width:c(r.w/n.width),height:c(r.h/n.height),rotationDegrees:0},f=pr(t,p,cr(r.w,r.h));fr(e,o,f);for(let m of f)ir(e,o,m.payload.id);return delete i.timestamp,delete i.timestampX,delete i.timestampY,i.timestampCorner="topLeading",i.timestampSize=Kt,f[1].payload.id}function Ed(e,t){let n=e.elements.find(m=>m.payload.id===t);if(!n||n.kind!=="imageTime")return;let o=n.payload,i=L.find(m=>e.perFamily[m]?.placements[t]!==void 0),a=(i===void 0?void 0:e.perFamily[i].placements[t])?.frame??o.frame,l=N[i??"rectangular"],s=cr(a.width*l.width,a.height*l.height),[h,u]=pr(o.image,o.frame,s);for(let m of[h,u])m.payload.isHidden=o.isHidden,o.opacity!==void 0&&(m.payload.opacity=o.opacity),o.page!==void 0&&(m.payload.page=o.page),o.accentGroup==="accent"&&(m.payload.accentGroup="accent");h.payload.rules=structuredClone(o.rules),u.payload.rules=structuredClone(o.rules),o.shadow!==void 0&&(h.payload.shadow=structuredClone(o.shadow));for(let m of L){let y=e.perFamily[m]?.placements[t];if(!y)continue;let S=e.perFamily[m];for(let H of[h,u])S.placements[H.payload.id]={frame:{...y.frame},isHidden:y.isHidden};delete S.placements[t]}for(let m of e.elements)m.kind==="tap"&&m.payload.attachedTo===t&&(m.payload.attachedTo=u.payload.id);let d=o.groupId,c=e.elements.indexOf(n);e.elements.splice(c,1);let p=o.name!==void 0&&o.name.trim()!==""?o.name:ao,f=e.elements.find(m=>m.kind==="image"&&m.payload.id===o.image);return f?d!==void 0&&f.payload.groupId===d?Hn(e,[h,u],c,p,d):fr(e,f,[h,u],p):Hn(e,[h,u],c,p),B(e),Ve(e),u.payload.id}function Fd(e,t){return e.elements.filter(n=>n.kind==="chartDots"&&n.payload.chart===t)}function Hd(e,t){return e.elements.filter(n=>n.kind==="chartGrid"&&n.payload.chart===t)}function Ld(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n||n.kind!=="chart")return;let o=z("chartDots");o.payload.chart=t,o.payload.dots=n.payload.pointDots==="all"?"all":"auto",o.payload.frame={...n.payload.frame};let i=e.elements.findIndex(r=>r.payload.id===t);return e.elements.splice(i+1,0,o),se(e,n,o.payload.id),o.payload.id}function Id(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n||n.kind!=="chart")return;let o=z("chartGrid");o.payload.chart=t,o.payload.frame={...n.payload.frame};let i=e.elements.findIndex(r=>r.payload.id===t);return e.elements.splice(i,0,o),se(e,n,o.payload.id),o.payload.id}var Md="#FFFFFF66";function Rd(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n||n.kind!=="chart")return;let o=z("shape");o.payload.kind="line",o.payload.thickness=1,o.payload.borderWidth=0,o.payload.colorSlot={baseColorHex:Md},o.payload.frame=lr(n.payload.frame,"threshold"),o.payload.chartAnchor={layer:t,at:"zero",place:"through"};let i=e.elements.findIndex(r=>r.payload.id===t);return e.elements.splice(i+1,0,o),se(e,n,o.payload.id),o.payload.id}function Sf(e,t,n){let o=e.elements.find(r=>r.payload.id===t);if(!o||o.kind!=="chart")return;let i=o.payload;if(n===void 0){delete i.thresholdValue,delete i.drawsThreshold;for(let r of Pe(e,t))r.payload.chartAnchor?.at==="threshold"&&ee(e,r.payload.id);return}i.thresholdValue=n,i.drawsThreshold=!1,Pe(e,t).some(r=>r.payload.chartAnchor?.at==="threshold")||Mt(e,t,"threshold")}function Tf(e,t,n){let o=e.elements.find(r=>r.payload.id===t);if(!o||o.kind!=="chart")return;let i=o.payload;if(!n){delete i.nowIndex,delete i.drawsNowLine;for(let r of Pe(e,t))r.payload.chartAnchor?.at==="now"&&ee(e,r.payload.id);return}ro(i),i.drawsNowLine=!1,Pe(e,t).some(r=>r.payload.chartAnchor?.at==="now")||Mt(e,t,"now")}function Af(e){let t=e.elements.filter(n=>n.kind==="chart"||n.kind==="timeline"||n.kind==="image");for(let n of t){let o=n.payload,i=new Set(e.elements.map(s=>s.payload.id)),r=L.find(s=>e.perFamily[s]?.placements[o.id]!==void 0),a=o.frame,l=r===void 0?void 0:e.perFamily[r].placements[o.id];if(l&&(o.frame={...l.frame}),n.kind==="chart"&&Pd(e,n.payload),n.kind==="timeline"&&n.payload.drawsTimeLabels!==!1&&n.payload.timeLabelCount>0&&dr(e,o.id),n.kind==="image"&&n.payload.timestamp===!0&&_d(e,o.id,N[r??"rectangular"]),o.frame=a,!(r===void 0||l===void 0))for(let s of e.elements)i.has(s.payload.id)||(e.perFamily[r].placements[s.payload.id]={frame:{...s.payload.frame},isHidden:l.isHidden},s.payload.isHidden=!0)}for(let n of e.elements.filter(o=>o.kind==="imageTime"))Ed(e,n.payload.id);Ad(e)}function Pd(e,t){{if(t.highlight!==void 0&&t.highlight!=="none"){let i=An(t),r=[];(t.highlight==="highest"||t.highlight==="both")&&r.push(["highest",i.high]),(t.highlight==="lowest"||t.highlight==="both")&&r.push(["lowest",i.low]);for(let[a,l]of r){let s=yd(e,t.id,a),h=e.elements.find(u=>u.payload.id===s);h?.kind==="icon"&&l!=="none"&&(h.payload.symbol=T(l==="triangle"?"arrowtriangle.up.fill":"circle.fill"))}qs(t,{high:"none",low:"none"}),t.highlight="none"}t.thresholdValue!==void 0&&t.drawsThreshold!==!1&&Mt(e,t.id,"threshold"),t.nowIndex!==void 0&&t.drawsNowLine!==!1&&Mt(e,t.id,"now"),t.drawsTimeLabels!==!1&&il(t)&&t.timeLabelCount>0&&dr(e,t.id);let n=vn(t.pointDots);if(n!=="none"){let i=Ld(e,t.id),r=e.elements.find(a=>a.payload.id===i);if(r?.kind==="chartDots"){r.payload.dots=n;let a=at(t.pointDotSize);a!==void 0&&(r.payload.size=a),typeof t.pointDotColorHex=="string"&&(r.payload.colorHex=t.pointDotColorHex)}}let o=kn(t.gridLines);if(o>0){let i=Id(e,t.id),r=e.elements.find(a=>a.payload.id===i);r?.kind==="chartGrid"&&(r.payload.lines=o,r.payload.colorHex=He(t.gridColorHex))}if(t.zeroLine===!0){let i=Rd(e,t.id),r=e.elements.find(a=>a.payload.id===i);r?.kind==="shape"&&(r.payload.colorSlot={baseColorHex:He(t.gridColorHex)})}delete t.pointDots,delete t.pointDotSize,delete t.pointDotColorHex,delete t.gridLines,delete t.gridColorHex,delete t.zeroLine}}function $d(e,t,n){let o=N.rectangular,i=Math.max(ml,Math.min(gl,t)),r=Math.min(1,i*1.2/o.height),a=Math.min(1,Math.max(0,e.width)),l=n?e.y-r:e.y+e.height;return{x:Math.max(0,Math.min(1-a,e.x)),y:Math.max(0,Math.min(1-r,l)),width:a,height:r,rotationDegrees:0}}function Nd(e,t){for(let n of t){if(!g(n)||n.kind!=="chart"||!g(n.payload))continue;let o=n.payload,i=w(o.id).toUpperCase(),r=e.elements.find(c=>c.payload.id===i);if(!r||r.kind!=="chart")continue;let a=w(o.scaleLabelColorHex,"#FFFFFF99"),l=c=>{let p=g(c)?c:{};return{fontSize:v(p.fontSize,8),colorHex:w(p.colorHex,a),pillColorHex:typeof p.pillColorHex=="string"?p.pillColorHex:void 0}},s=[],h=A(o.scaleLabels);(h==="top"||h==="range")&&s.push(["top",l(o.topLabelStyle)]),h==="range"&&s.push(["bottom",l(o.bottomLabelStyle)]);let u=A(o.latestLabel);if((u==="corner"||u==="end")&&s.push(["latest",l(o.latestLabelStyle)]),s.length===0)continue;let d=e.elements.findIndex(c=>c.payload.id===i)+1;for(let[c,p]of s){let f=ar(r.payload.frame,rr[c],p.fontSize,c==="latest"?5:4),m=[];if(p.pillColorHex!==void 0){let S=z("shape");S.payload.kind="capsule",S.payload.colorSlot={baseColorHex:p.pillColorHex},S.payload.frame={...f},m.push(S)}let y=z("text");y.payload.value={kind:{kind:"chartStat",layer:i,stat:c}},y.payload.fontSize=p.fontSize,y.payload.fontWeight="medium",y.payload.colorSlot={baseColorHex:p.colorHex},y.payload.frame=f,m.push(y),e.elements.splice(d,0,...m),d+=m.length;for(let S of m)se(e,r,S.payload.id)}}}function x(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function W(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function Od(e){let t={};return e.decimals!==void 0&&(t.decimals=x(e.decimals)),e.multiply!==void 0&&(t.multiply=x(e.multiply)),e.offset!==void 0&&(t.offset=x(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.duration&&(t.duration=!0),e.timestamp!==void 0&&(t.timestamp=e.timestamp),e.hideMinutes&&(t.hideMinutes=!0),e.hideDayPeriod&&(t.hideDayPeriod=!0),e.showSeconds&&(t.showSeconds=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function mr(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(W)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function Dd(e){switch(e.kind){case"named":return e.id.trim()==="";case"chartStat":case"listStat":case"imageTime":return e.layer.trim()==="";default:return!1}}function zd(e){if(Dd(e))return{kind:"literal",value:""};switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...W(e)};case"entityAttribute":return{kind:"entityAttribute",...W(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...W(e)};case"aggregate":return{kind:"aggregate",aggregate:mr(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat};case"item":return{kind:"item",field:e.field};case"listStat":return{kind:"listStat",layer:e.layer,stat:e.stat};case"imageTime":return{kind:"imageTime",layer:e.layer}}}function _(e){let t={kind:zd(e.kind)};return Re(e.format)||(t.format=Od(e.format)),t}function K(e){return{x:x(e.x),y:x(e.y),width:x(e.width),height:x(e.height),rotationDegrees:x(e.rotationDegrees)}}function Vd(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=_(e.value??T(""));break;case"between":case"timeBetween":t.value=_(e.value??T("")),t.upper=_(e.upper??T(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function si(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=_(e.value??T("")),e.kind==="setIcon"&&e.path&&(t.path=e.path);break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=x(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;case"setFontDesign":t.design=e.design??"default";break;case"setFontWidth":t.width=e.width??"standard";break;case"setItalic":t.italic=e.italic!==!1;break;default:break}return t}function q(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(o=>({id:o.id,when:{join:o.when.join,tests:o.when.tests.map(i=>({id:i.id,value:_(i.value),comparison:Vd(i.comparison)}))},then:o.then.map(si)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(si)),t.partId!==void 0&&(n.partId=t.partId),n})}function Wd(e){let t={id:e.id,value:_(e.value)};return e.icon!==void 0&&(t.icon=_(e.icon)),e.colorHex!==void 0&&(t.colorHex=e.colorHex),e.fontWeight!==void 0&&(t.fontWeight=e.fontWeight),e.fontSize!==void 0&&(t.fontSize=x(e.fontSize)),e.fontDesign!==void 0&&(t.fontDesign=e.fontDesign),e.fontWidth!==void 0&&(t.fontWidth=e.fontWidth),e.italic!==void 0&&(t.italic=e.italic),e.coloring!==void 0&&e.coloring!=="uniform"&&(t.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(t.bands=e.bands.map(lt)),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==G&&(t.bandAboveColorHex=e.bandAboveColorHex),t}function Ud(e){let t=gr(e);return e.payload.page!==void 0&&(t.payload.page=e.payload.page),t}function gr(e){let t=Bd(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),e.payload.name!==void 0&&(t.payload.name=e.payload.name),e.payload.accentGroup==="accent"&&(t.payload.accentGroup="accent"),t}function Bd(e){let t=n=>{let o={id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden};return n.opacity!==void 0&&n.opacity!==1&&(o.opacity=x(n.opacity)),n.shadow!==void 0&&(o.shadow={colorHex:n.shadow.colorHex,radius:x(n.shadow.radius),dx:x(n.shadow.dx),dy:x(n.shadow.dy)}),o};switch(e.kind){case"text":{let n={...t(e.payload),value:_(e.payload.value),fontSize:x(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(n.countdown=!0),e.payload.monospacedDigits===!0&&(n.monospacedDigits=!0),e.payload.lineLimit!==void 0&&e.payload.lineLimit>1&&(n.lineLimit=e.payload.lineLimit),e.payload.fontDesign!==void 0&&e.payload.fontDesign!=="default"&&(n.fontDesign=e.payload.fontDesign),e.payload.fontWidth!==void 0&&e.payload.fontWidth!=="standard"&&(n.fontWidth=e.payload.fontWidth),e.payload.italic===!0&&(n.italic=!0),e.payload.minimumScale!==void 0&&e.payload.minimumScale!==ct&&(n.minimumScale=x(e.payload.minimumScale)),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(n.alignment=e.payload.alignment);let o=e.payload;return o.coloring!==void 0&&o.coloring!=="uniform"&&(n.coloring=o.coloring),o.bands!==void 0&&o.bands.length>0&&(n.bands=o.bands.map(lt)),o.bandAboveColorHex!==void 0&&o.bandAboveColorHex!==G&&(n.bandAboveColorHex=o.bandAboveColorHex),o.highlight!==void 0&&o.highlight!=="none"&&(n.highlight=o.highlight),o.highColorHex!==void 0&&o.highColorHex!==Le&&(n.highColorHex=o.highColorHex),o.lowColorHex!==void 0&&o.lowColorHex!==Ie&&(n.lowColorHex=o.lowColorHex),o.parts!==void 0&&o.parts.length>0&&(n.parts=o.parts.map(Wd),Si(o)&&(n.value=_(Ai(o.parts)))),o.arc!==void 0&&(n.arc=Fs(o.arc)),Ht(o,n),{kind:"text",payload:n}}case"icon":{let n={...t(e.payload),symbol:_(e.payload.symbol)};e.payload.path!==void 0&&e.payload.path!==""&&(n.path=e.payload.path);let o=Wn(e.payload.viewBox);return o!==void 0&&(n.viewBox=o),n.size=x(e.payload.size),jo(e.payload,n),Ht(e.payload,n),{kind:"icon",payload:n}}case"gauge":{let n=e.payload,o={...t(n),value:_(n.value),minValue:x(n.minValue),maxValue:x(n.maxValue),style:n.style,lineWidth:x(n.lineWidth),trackColorHex:n.trackColorHex};return n.coloring!=="uniform"&&(o.coloring=n.coloring),n.bands.length>0&&(o.bands=n.bands.map(lt)),n.bandAboveColorHex!==G&&(o.bandAboveColorHex=n.bandAboveColorHex),n.thresholdValue!==void 0&&(o.thresholdValue=x(n.thresholdValue)),n.thresholdColorHex!==Un&&(o.thresholdColorHex=n.thresholdColorHex),n.total!==void 0&&(o.total=_(n.total)),n.minSource!==void 0&&(o.minSource=_(n.minSource)),n.maxSource!==void 0&&(o.maxSource=_(n.maxSource)),n.fill!==void 0&&(o.fill=Lt(n.fill)),n.ticks!==void 0&&!_i(n.ticks)&&(o.ticks=Bs(n.ticks)),n.labels!==void 0&&!Ei(n.labels)&&(o.labels=js(n.labels)),{kind:"gauge",payload:o}}case"chart":{let n=e.payload,o={...t(n),value:_(n.value),historyMinutes:Math.max(0,Math.round(n.historyMinutes)),historyPoints:Math.round(n.historyPoints),style:n.style,limit:Math.max(0,Math.round(n.limit)),takeFromEnd:n.takeFromEnd,scale:n.scale,minValue:x(n.minValue),maxValue:x(n.maxValue),baseline:n.baseline,barGap:x(n.barGap),lineWidth:x(n.lineWidth),highlight:n.highlight,highColorHex:n.highColorHex,lowColorHex:n.lowColorHex,marker:Fi(An(n)),coloring:n.coloring,bands:n.bands.map(lt),bandAboveColorHex:n.bandAboveColorHex,fillBands:n.fillBands};n.source!==$n&&(o.source=n.source),n.statPeriod!==Nn&&(o.statPeriod=n.statPeriod),n.statType!==On&&(o.statType=n.statType),n.thresholdValue!==void 0&&(o.thresholdValue=x(n.thresholdValue)),n.thresholdColorHex!==Bn&&(o.thresholdColorHex=n.thresholdColorHex),n.nowIndex!==void 0&&(o.nowIndex=_(n.nowIndex)),n.nowColorHex!==Gn&&(o.nowColorHex=n.nowColorHex),n.drawsThreshold===!1&&(o.drawsThreshold=!1),n.drawsNowLine===!1&&(o.drawsNowLine=!1),n.drawsTimeLabels===!1&&(o.drawsTimeLabels=!1),n.scaleFrom!==void 0&&(o.scaleFrom=n.scaleFrom),n.labelSize!==te&&(o.labelSize=x(n.labelSize)),n.labelColorHex!==ne&&(o.labelColorHex=n.labelColorHex),n.labelsAbove&&(o.labelsAbove=!0),n.timeLabelCount!==be&&(o.timeLabelCount=Me(n.timeLabelCount)),n.hourCycle!==xe&&(o.hourCycle=n.hourCycle),n.minutes!==we&&(o.minutes=n.minutes);let i=An(n);Hi(i)||(o.highMarker=i.high,o.lowMarker=i.low);let r=n.curve??"straight";r!=="straight"&&(o.curve=r);let a=wn(n.fillStyle);a!=="flat"&&(o.fillStyle=a),n.fillColorHex!==void 0&&(o.fillColorHex=n.fillColorHex),n.areaFill!==void 0&&(o.areaFill=Lt(n.areaFill));let l=Cn(n.barRadius);l!==Pn&&(o.barRadius=x(l));let s=Sn(n.barCorners);s!=="all"&&(o.barCorners=s);let h=Tn(n.smoothing);return h!==void 0&&(o.smoothing=h),n.gaps===!0&&(o.gaps=!0),n.barBorderWidth!==void 0&&n.barBorderWidth!==0&&(o.barBorderWidth=x(n.barBorderWidth)),n.barBorderColorHex!==void 0&&(o.barBorderColorHex=n.barBorderColorHex),n.bandAboveFillColorHex!==void 0&&(o.bandAboveFillColorHex=n.bandAboveFillColorHex),n.bandAboveBorderColorHex!==void 0&&(o.bandAboveBorderColorHex=n.bandAboveBorderColorHex),n.barBorderOpenBase===!0&&(o.barBorderOpenBase=!0),{kind:"chart",payload:o}}case"timeline":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden,value:_(n.value)},i=jt(n);return n.aggregate!==void 0&&i.length>0&&(o.aggregate={entities:i,...n.aggregate.combine!==Bt?{combine:n.aggregate.combine}:{}}),n.historyMinutes!==Yn&&(o.historyMinutes=Math.max(1,Math.round(n.historyMinutes))),n.bands.length>0&&(o.bands=n.bands.map(r=>({id:r.id,match:r.match,colorHex:r.colorHex}))),n.otherColorHex!==Gt&&(o.otherColorHex=n.otherColorHex),n.gap!==0&&(o.gap=x(n.gap)),n.cornerRadius!==Ii&&(o.cornerRadius=x(n.cornerRadius)),n.labelSize!==te&&(o.labelSize=x(n.labelSize)),n.labelColorHex!==ne&&(o.labelColorHex=n.labelColorHex),n.labelsAbove&&(o.labelsAbove=!0),n.timeLabelCount!==be&&(o.timeLabelCount=Math.max(0,Math.min(Ri,Math.round(n.timeLabelCount)))),n.hourCycle!==xe&&(o.hourCycle=n.hourCycle),n.minutes!==we&&(o.minutes=n.minutes),n.drawsTimeLabels===!1&&(o.drawsTimeLabels=!1),{kind:"timeline",payload:o}}case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:x(e.payload.cornerRadius),borderWidth:x(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(n.thickness=x(e.payload.thickness)),e.payload.fill!==void 0&&(n.fill=Lt(e.payload.fill)),jo(e.payload,n),Ht(e.payload,n),{kind:"shape",payload:n}}case"image":{let n=e.payload,o={id:n.id};(n.source!=="inline"||n.entity.entityId!=="")&&(o.entity=W(n.entity)),o.rules=q(n.rules),o.frame=K(n.frame),o.isHidden=n.isHidden,n.source!=="camera"&&(o.source=n.source),n.data!==void 0&&n.data!==""&&(o.data=n.data),n.format==="jpeg"&&(o.format="jpeg"),n.timestamp===!0&&(o.timestamp=!0),n.contentMode!=="fill"&&(o.contentMode=n.contentMode),n.zoom!==1&&(o.zoom=x(n.zoom)),n.panX!==0&&(o.panX=x(n.panX)),n.panY!==0&&(o.panY=x(n.panY)),n.cornerRadius!==Oi&&(o.cornerRadius=x(n.cornerRadius));let i=Di(n),r=i?Al(n.timestampX,n.timestampY):n.timestampCorner;return r!=="topLeading"&&(o.timestampCorner=r),n.timestampSize!==Kt&&(o.timestampSize=x(n.timestampSize)),i&&(o.timestampX=x(n.timestampX),o.timestampY=x(n.timestampY)),Ht(n,o),{kind:"image",payload:o}}case"tap":{let n=e.payload,o={id:n.id,action:so(n.action)};return n.openPageId!==void 0&&(o.openPageId=n.openPageId),n.openPageName!==void 0&&(o.openPageName=n.openPageName),n.attachedTo!==void 0&&(o.attachedTo=n.attachedTo),o.rules=q(n.rules),o.frame=K(n.frame),o.isHidden=n.isHidden,n.opacity!==void 0&&n.opacity!==1&&(o.opacity=x(n.opacity)),n.shadow!==void 0&&(o.shadow={colorHex:n.shadow.colorHex,radius:x(n.shadow.radius),dx:x(n.shadow.dx),dy:x(n.shadow.dy)}),{kind:"tap",payload:o}}case"chartTimes":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden,chart:n.chart};return n.labelSize!==te&&(o.labelSize=x(n.labelSize)),n.labelColorHex!==ne&&(o.labelColorHex=n.labelColorHex),n.timeLabelCount!==be&&(o.timeLabelCount=Me(n.timeLabelCount)),n.hourCycle!==xe&&(o.hourCycle=n.hourCycle),n.minutes!==we&&(o.minutes=n.minutes),n.fontWeight!==void 0&&n.fontWeight!=="regular"&&(o.fontWeight=n.fontWeight),n.fontDesign!==void 0&&n.fontDesign!=="rounded"&&(o.fontDesign=n.fontDesign),n.fontWidth!==void 0&&n.fontWidth!=="standard"&&(o.fontWidth=n.fontWidth),n.italic===!0&&(o.italic=!0),n.monospacedDigits===!0&&(o.monospacedDigits=!0),{kind:"chartTimes",payload:o}}case"imageTime":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden};return n.image!==""&&(o.image=n.image),{kind:"imageTime",payload:o}}case"chartDots":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden,chart:n.chart};xi(n.dots)!=="auto"&&(o.dots="all");let i=at(n.size);return i!==void 0&&(o.size=x(i)),n.colorHex!==void 0&&(o.colorHex=n.colorHex),{kind:"chartDots",payload:o}}case"chartGrid":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden,chart:n.chart},i=wi(n.lines);i!==Rn&&(o.lines=i);let r=He(n.colorHex);$e(r,Dt)||(o.colorHex=r);let a=vi(n.thickness);return a!==Mn&&(o.thickness=x(a)),{kind:"chartGrid",payload:o}}case"list":{let n=e.payload,o={id:n.id,rules:q(n.rules),frame:K(n.frame),isHidden:n.isHidden};n.opacity!==void 0&&n.opacity!==1&&(o.opacity=x(n.opacity)),n.shadow!==void 0&&(o.shadow={colorHex:n.shadow.colorHex,radius:x(n.shadow.radius),dx:x(n.shadow.dx),dy:x(n.shadow.dy)}),o.source=Gd(n.source);let i=Ne(n.rows);i!==Zn&&(o.rows=i),n.direction==="across"&&(o.direction="across");let r=to(n.columns);r!==Qn&&(o.columns=r);let a=Bi(n.gap);return a!==eo&&(o.gap=x(a)),n.template.length>0&&(o.template=n.template.map(gr)),{kind:"list",payload:o}}}}function Gd(e){switch(e.kind){case"entities":{let t={kind:"entities",scope:mr({function:"count",scope:e.scope}).scope},n=(e.deviceClass??"").trim();return n!==""&&(t.deviceClass=n),e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.sort!=="name"&&(t.sort=e.sort),e.descending&&(t.descending=!0),e.attributes.length>0&&(t.attributes=[...e.attributes]),t}case"attribute":return{kind:"attribute",...W(e),attribute:e.attribute};case"template":return{kind:"template",value:e.value};case"calendar":{let t={kind:"calendar",entities:e.entities.map(W)},n=Oe(e.hours);return n!==Wi&&(t.hours=n),t}case"todo":{let t={kind:"todo",entities:e.entities.map(W)};return e.status!=="open"&&(t.status=e.status),e.sort!=="list"&&(t.sort=e.sort),t}case"forecast":{let t={kind:"forecast",...W(e)};return e.type!=="hourly"&&(t.type=e.type),t}}}function jd(e){let t={},n=Object.keys(e.placements);if(n.length>0){let o={};for(let i of n){let r=e.placements[i],a={frame:K(r.frame)};r.isHidden&&(a.isHidden=!0),r.size!==void 0&&(a.size=x(r.size)),o[i]=a}t.placements=o}if(e.bezelText&&(t.bezelText=_(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=_(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.parkedCurvedText&&(t.parkedCurvedText=_(e.parkedCurvedText)),e.parkedCurvedColorHex!==void 0&&(t.parkedCurvedColorHex=e.parkedCurvedColorHex),e.bezelGauge){let o=e.bezelGauge,i={value:_(o.value),minValue:x(o.minValue),maxValue:x(o.maxValue),colorHexes:o.colorHexes};o.minLabel&&(i.minLabel=_(o.minLabel)),o.maxLabel&&(i.maxLabel=_(o.maxLabel)),t.bezelGauge=i}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),e.backgroundFill!==void 0&&(t.backgroundFill=Lt(e.backgroundFill)),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=x(e.borderWidth),e.rules.length>0&&(t.rules=q(e.rules)),t}function so(e){if(e.type==="callService"){let t={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(t.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(t,W(e.target)),t}if(e.type==="refreshAll"){let t={type:e.type};if(e.allPlaced===!0)return t.allPlaced=!0,t;e.targets!==void 0&&e.targets.length>0&&(t.targets=[...e.targets]);let n=Object.entries(e.targetLayers??{});if(n.length>0){let o={};for(let[i,r]of n)o[i]=[...r];t.targetLayers=o}return t}if(e.type==="refresh"){let t={type:e.type};return e.layerIds!==void 0&&(t.layerIds=[...e.layerIds]),t}return e.type==="showPage"?{type:e.type,page:e.page}:"entityId"in e?{type:e.type,...W(e)}:{type:e.type}}function Kd(e){if(e.kind==="template")return{kind:"template",value:e.value};if(e.kind==="entity")return{kind:"entity",...W(e)};let t={kind:"list",source:e.source};return e.entities!==void 0&&(t.entities=[...e.entities]),e.entity_id!==void 0&&(t.entity_id=e.entity_id),e.hours!==void 0&&(t.hours=e.hours),e.status!==void 0&&(t.status=e.status),e.sort!==void 0&&(t.sort=e.sort),e.type!==void 0&&(t.type=e.type),t.limit=e.limit,t}function qd(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=_(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),e.parts!==void 0&&e.parts.length>0&&(t.parts=e.parts.map(n=>{let o={id:n.id,value:_(n.value)};return n.symbol!==void 0&&(o.symbol=n.symbol),o})),t}function Jd(e){let t={kind:e.kind,title:_(e.title)};return e.valueLabel!==void 0&&(t.valueLabel=_(e.valueLabel)),e.state!==void 0&&(t.state=_(e.state)),t.symbol=e.symbol,e.symbolOff!==void 0&&(t.symbolOff=e.symbolOff),e.tintColorHex!==void 0&&(t.tintColorHex=e.tintColorHex),e.coloring!=="uniform"&&(t.coloring=e.coloring),e.bands.length>0&&(t.bands=e.bands.map(lt)),e.bandAboveColorHex!==void 0&&(t.bandAboveColorHex=e.bandAboveColorHex),e.status!==void 0&&(t.status=_(e.status)),t.action=so(e.action),t}function _f(e){let t=[];for(let r of L){let a=e.perFamily[r];a&&t.push(r,jd(a))}let n={schemaVersion:In(e),id:e.id,name:e.name,values:e.values.map(r=>({id:r.id,name:r.name,value:_(r.value)})),slotIndex:e.slotIndex,elements:e.elements.map(Ud),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(Kd),tapAction:so(e.tapAction)};e.inline!==void 0&&(n.inline=qd(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.httpShowResult===!0&&(n.httpShowResult=!0),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(r=>({id:r.id,name:r.name,locked:r.locked,...r.parentId!==void 0?{parentId:r.parentId}:{}})));let o=gn(e.notes);o!==void 0&&(n.notes=o),e.hidden===!0&&(n.hidden=!0),e.linkId!==void 0&&(n.linkId=e.linkId);let i=Xl(e.pages===void 0?void 0:{...e.pages,mode:no(e)});return i!==void 0&&(n.pages=i),e.control!==void 0&&(n.control=Jd(e.control)),e.legacyControlEntityId!==void 0&&e.legacyControlEntityId!==""&&(n.legacyControlEntityId=e.legacyControlEntityId),n}function Ef(e){return e.tapAction.type==="runHTTPAction"||e.elements.some(t=>t.kind==="tap"&&t.payload.action.type==="runHTTPAction")}function Ff(e){return g(e)&&e.hidden===!0}function Hf(e,t){let n={...e};return t?n.hidden=!0:delete n.hidden,n}function P(e,t){return t===void 0?void 0:e.groups?.find(n=>n.id===t)}function lo(e,t){let n=e.elements.find(o=>o.payload.id===t);return P(e,n?.payload.groupId)}function U(e,t){let n=[],o=new Set,i=P(e,t);for(;i&&!o.has(i.id);)n.push(i),o.add(i.id),i=P(e,i.parentId);return n}function Lf(e,t){return U(e,t).slice(1)}function co(e,t){let n=new Set([t]),o=!0;for(;o;){o=!1;for(let i of e.groups??[])i.parentId!==void 0&&n.has(i.parentId)&&!n.has(i.id)&&(n.add(i.id),o=!0)}return n}function Xd(e,t){return(e.groups??[]).filter(n=>n.parentId===t)}function If(e,t,n){return U(e,t.payload.groupId).some(o=>o.id===n)}function yr(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!R(e,n))}function oe(e,t){let n=co(e,t);return e.elements.filter(o=>o.payload.groupId!==void 0&&n.has(o.payload.groupId)&&!R(e,o))}function uo(e,t){let n=U(e,t);for(let o=n.length-1;o>=0;o--)if(n[o].locked)return n[o]}function Mf(e,t){return uo(e,lo(e,t)?.id)}function Rf(e,t){return uo(e,t)??P(e,t)}function Pf(e,t){let n=new Set;for(let o of t){let i=lo(e,o),r=i===void 0?void 0:uo(e,i.id);if(r)for(let a of oe(e,r.id))n.add(a.payload.id);else n.add(o)}return e.elements.filter(o=>n.has(o.payload.id)&&o.kind!=="chartDots"&&o.kind!=="chartGrid"&&o.payload.chartAnchor===void 0).map(o=>o.payload.id)}function br(e){let t=e.groups??[],n=new Map(t.map(o=>[o.id,o]));for(let o of t){if(o.parentId===void 0)continue;if(o.parentId===o.id||!n.has(o.parentId)){delete o.parentId;continue}let i=new Set,r=n.get(o.parentId);for(;r!==void 0;){if(r.id===o.id){delete o.parentId;break}if(i.has(r.id))break;i.add(r.id),r=r.parentId===void 0?void 0:n.get(r.parentId)}}}function B(e){let t=new Set((e.groups??[]).map(i=>i.id));for(let i of e.elements)i.payload.groupId!==void 0&&!t.has(i.payload.groupId)&&delete i.payload.groupId;br(e);let n=new Set;for(let i of e.elements)for(let r of U(e,i.payload.groupId))n.add(r.id);let o=(e.groups??[]).filter(i=>n.has(i.id));o.length===0?delete e.groups:e.groups=o}function le(e){if(!e.groups?.length)return;br(e);let t=e.elements.filter(u=>!R(e,u)),n=e.elements.filter(u=>R(e,u)),o=new Map;t.forEach((u,d)=>{for(let c of U(e,u.payload.groupId))o.set(c.id,Math.max(o.get(c.id)??-1,d))});let i=new Map,r=(u,d)=>{let c=i.get(u);c?c.push(d):i.set(u,[d])};t.forEach((u,d)=>r(P(e,u.payload.groupId)?.id,{at:d,el:u}));for(let u of e.groups){let d=o.get(u.id);d!==void 0&&r(P(e,u.parentId)?.id,{at:d,group:u})}let a=[],l=new Set,s=new Set,h=u=>{let d=(i.get(u)??[]).sort((c,p)=>c.at-p.at);for(let c of d)"el"in c?(a.push(c.el),l.add(c.el)):s.has(c.group.id)||(s.add(c.group.id),h(c.group.id))};h(void 0);for(let u of t)l.has(u)||a.push(u);e.elements=[...a,...n],Ve(e)}function Yd(e){let t=new Set((e.groups??[]).map(o=>o.name.trim())),n=1;for(;t.has(`Group ${n}`);)n++;return`Group ${n}`}function xr(e,t,n=Yd(e)){let o=e.elements.filter(u=>t.includes(u.payload.id)&&!R(e,u));if(o.length<2)return;let i=o.map(u=>U(e,u.payload.groupId)),r=i[0].find(u=>i.every(d=>d.includes(u))),a=new Set(o.map(u=>u.payload.id)),l=new Set,s=[];o.forEach((u,d)=>{let c=i[d],p=r===void 0?c:c.slice(0,c.indexOf(r)),f;for(let m=p.length-1;m>=0;m--)if(oe(e,p[m].id).every(y=>a.has(y.payload.id))){f=p[m];break}f?l.add(f):s.push(u)});let h={id:I(),name:n,locked:!0,...r!==void 0?{parentId:r.id}:{}};e.groups=[...e.groups??[],h];for(let u of l)u.parentId=h.id;for(let u of s)u.payload.groupId=h.id;return B(e),le(e),h.id}function Zd(e,t){let o=P(e,t)?.parentId;for(let i of e.elements)i.payload.groupId===t&&(o===void 0?delete i.payload.groupId:i.payload.groupId=o);for(let i of e.groups??[])i.parentId===t&&(o===void 0?delete i.parentId:i.parentId=o);e.groups&&(e.groups=e.groups.filter(i=>i.id!==t)),B(e)}function Qd(e,t,n){let o=e.elements.find(i=>i.payload.id===t);!o||R(e,o)||(n===void 0?delete o.payload.groupId:o.payload.groupId=n,B(e),le(e))}function $f(e,t,n){let o=P(e,t);return!o||n!==void 0&&(!P(e,n)||co(e,t).has(n))?!1:(n===void 0?delete o.parentId:o.parentId=n,B(e),le(e),!0)}function li(e,t){return P(e,t)?new Set(oe(e,t).map(n=>n.payload.id)):new Set([t])}function Pt(e,t,n,o){let i=e.filter(l=>t.has(l.payload.id)),r=e.filter(l=>!t.has(l.payload.id)),a=r.map((l,s)=>n.has(l.payload.id)?s:-1).filter(l=>l>=0);return i.length===0||a.length===0?e:(r.splice(o?a[a.length-1]+1:a[0],0,...i),r)}function Nf(e,t,n,o,i){if(t===n)return!1;let r=P(e,t);if(i!==void 0&&!P(e,i))return!1;if(r){let u=co(e,t);if(i!==void 0&&u.has(i)||P(e,n)&&u.has(n))return!1}let a=li(e,t),l=li(e,n);for(let u of a)l.delete(u);let s=e.elements.filter(u=>!R(e,u)),h=e.elements.filter(u=>R(e,u));if(!s.some(u=>a.has(u.payload.id))||!s.some(u=>l.has(u.payload.id)))return!1;if(e.elements=[...Pt(s,a,l,o),...h],r)i===void 0?delete r.parentId:r.parentId=i;else{let u=e.elements.find(d=>d.payload.id===t);i===void 0?delete u.payload.groupId:u.payload.groupId=i}return B(e),le(e),!0}function Of(e,t,n,o=()=>!0){let i=e.elements.filter(p=>!R(e,p)),r=e.elements.filter(p=>R(e,p)),a=i.findIndex(p=>p.payload.id===t);if(a<0)return;let l=a+n;for(;l>=0&&l<i.length&&!o(i[l]);)l+=n;if(l<0||l>=i.length)return;let s=i[a],h=i[l],u=P(e,s.payload.groupId),d=U(e,h.payload.groupId),c=i;if(u!==void 0&&!d.includes(u)){let p=new Set(oe(e,u.id).map(f=>f.payload.id));p.delete(t),p.size>0&&(c=Pt(i,new Set([t]),p,n===1)),u.parentId===void 0?delete s.payload.groupId:s.payload.groupId=u.parentId}else if(d[0]!==u){let p=u===void 0?d.length:d.indexOf(u);s.payload.groupId=d[p-1].id}else c=[...i],c.splice(a,1),c.splice(l,0,s);e.elements=[...c,...r],B(e),le(e)}function Df(e,t,n,o=()=>!0){let i=P(e,t);if(!i)return;let r=e.elements.filter(f=>!R(e,f)),a=e.elements.filter(f=>R(e,f)),l=new Set(oe(e,t).map(f=>f.payload.id)),s=r.map((f,m)=>l.has(f.payload.id)?m:-1).filter(f=>f>=0);if(s.length===0)return;let h=n===1?s[s.length-1]+1:s[0]-1;for(;h>=0&&h<r.length&&!o(r[h]);)h+=n;if(h<0||h>=r.length)return;let u=r[h],d=P(e,i.parentId),c=U(e,u.payload.groupId),p;if(d!==void 0&&!c.includes(d)){let f=new Set(oe(e,d.id).map(m=>m.payload.id));for(let m of l)f.delete(m);p=Pt(r,l,f,n===1),d.parentId===void 0?delete i.parentId:i.parentId=d.parentId}else{let f=d===void 0?c.length:c.indexOf(d),m=f>0?c[f-1]:void 0,y=m?new Set(oe(e,m.id).map(S=>S.payload.id)):new Set([u.payload.id]);p=Pt(r,l,y,n===1)}e.elements=[...p,...a],B(e),le(e)}var k={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","httpShowResult","groups","notes","hidden","linkId","control","legacyControlEntityId","pages"],group:["id","name","locked","parentId"],pages:["count","mode","dwell"],inline:["label","value","symbol","countdown","parts"],inlinePart:["id","value","symbol"],control:["kind","title","valueLabel","state","symbol","symbolOff","tintColorHex","coloring","bands","bandAboveColorHex","status","action"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","timestamp","hideMinutes","hideDayPeriod","showSeconds","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],chartAnchor:["layer","at","place","dx","dy"],fill:["kind","stops","angle"],fillStop:["at","colorHex"],level:["value","minValue","maxValue","minSource","maxSource","direction","trackColorHex"],gaugeTicks:["count","length","colorHex","majorEvery"],gaugeLabels:["show","size","colorHex"],arc:["radius","angle","sweep","spacing","flip"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","opacity","shadow","groupId","name","accentGroup"],elementPage:["page"],shadow:["colorHex","radius","dx","dy"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","fontDesign","fontWidth","italic","minimumScale","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts","arc","chartAnchor"],textPart:["id","value","icon","colorHex","fontWeight","fontSize","fontDesign","fontWidth","italic","coloring","bands","bandAboveColorHex"],icon:["symbol","path","viewBox","size","level","chartAnchor"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource","fill","ticks","labels"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","curve","fillStyle","fillColorHex","areaFill","barRadius","barCorners","smoothing","gaps","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","pointDots","pointDotSize","pointDotColorHex","gridLines","gridColorHex","zeroLine","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","aggregate","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes","drawsTimeLabels"],timelineAggregate:["entities","combine"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth","fill","level","chartAnchor"],image:["entity","source","data","format","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY","chartAnchor"],tap:["action","openPageId","openPageName","attachedTo","grow"],chartTimes:["chart","timeLabelCount","labelSize","labelColorHex","hourCycle","minutes","fontWeight","fontDesign","fontWidth","italic","monospacedDigits"],chartDots:["chart","dots","size","colorHex"],chartGrid:["chart","lines","colorHex","thickness"],imageTime:["image","size"],list:["source","rows","direction","columns","gap","template"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight","design","width","italic","path"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","parkedCurvedText","parkedCurvedColorHex","bezelGauge","backgroundColorHex","backgroundFill","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON","targets","allPlaced","layerIds","targetLayers","page"]},di={literal:["kind","value"],entityState:["kind",...k.entityRef],entityAttribute:["kind",...k.entityRef,"attribute"],entityAge:["kind",...k.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"],item:["kind","field"],listStat:["kind","layer","stat"],imageTime:["kind","layer"]},ec={entities:["kind","scope","deviceClass","stateFilter","sort","descending","attributes"],attribute:["kind",...k.entityRef,"attribute"],template:["kind","value"],calendar:["kind","entities","hours"],todo:["kind","entities","status","sort"],forecast:["kind",...k.entityRef,"type"]};function zf(e){let t=[],n=(d,c,p)=>{if(g(d))for(let f of Object.keys(d))c.includes(f)||t.push(`${p}.${f}`)},o=(d,c)=>{if(!g(d))return;let p=typeof d.kind=="string"?d.kind:"";n(d,di[p]??["kind"],c),p==="aggregate"&&g(d.aggregate)&&(n(d.aggregate,k.aggregate,`${c}.aggregate`),n(d.aggregate.scope,k.scope,`${c}.aggregate.scope`),g(d.aggregate.scope)&&Array.isArray(d.aggregate.scope.entities)&&d.aggregate.scope.entities.forEach((f,m)=>n(f,k.entityRef,`${c}.aggregate.scope.entities[${m}]`)),n(d.aggregate.stateFilter,k.stateFilter,`${c}.aggregate.stateFilter`))},i=(d,c)=>{if(g(d)){if(g(d.kind))n(d,k.value,c),o(d.kind,`${c}.kind`);else{let p=typeof d.kind=="string"?d.kind:"";n(d,[...di[p]??["kind"],"format"],c),p==="aggregate"&&o(d,c)}n(d.format,k.format,`${c}.format`)}},r=(d,c)=>{g(d)&&(n(d,k.fill,c),Array.isArray(d.stops)&&d.stops.forEach((p,f)=>n(p,k.fillStop,`${c}.stops[${f}]`)))},a=(d,c)=>{Array.isArray(d)&&d.forEach((p,f)=>{n(p,k.styleChange,`${c}[${f}]`),g(p)&&i(p.value,`${c}[${f}].value`)})},l=(d,c)=>{Array.isArray(d)&&d.forEach((p,f)=>{let m=`${c}[${f}]`;n(p,k.rule,m),g(p)&&(Array.isArray(p.cases)&&p.cases.forEach((y,S)=>{let H=`${m}.cases[${S}]`;n(y,k.case,H),g(y)&&(n(y.when,k.condition,`${H}.when`),g(y.when)&&Array.isArray(y.when.tests)&&y.when.tests.forEach((O,Sa)=>{let je=`${H}.when.tests[${Sa}]`;n(O,k.test,je),g(O)&&(i(O.value,`${je}.value`),n(O.comparison,k.comparison,`${je}.comparison`),g(O.comparison)&&(i(O.comparison.value,`${je}.comparison.value`),i(O.comparison.upper,`${je}.comparison.upper`)))}),a(y.then,`${H}.then`))}),a(p.otherwise,`${m}.otherwise`))})};if(!g(e))return t;n(e,k.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((d,c)=>n(d,k.group,`$.groups[${c}]`)),Array.isArray(e.values)&&e.values.forEach((d,c)=>{n(d,k.named,`$.values[${c}]`),g(d)&&i(d.value,`$.values[${c}].value`)});let s=(d,c)=>{if(!g(d))return;let p=typeof d.kind=="string"?d.kind:"";n(d,ec[p]??["kind"],c),p==="entities"&&(n(d.scope,k.scope,`${c}.scope`),g(d.scope)&&Array.isArray(d.scope.entities)&&d.scope.entities.forEach((f,m)=>n(f,k.entityRef,`${c}.scope.entities[${m}]`)),n(d.stateFilter,k.stateFilter,`${c}.stateFilter`)),(p==="calendar"||p==="todo")&&Array.isArray(d.entities)&&d.entities.forEach((f,m)=>n(f,k.entityRef,`${c}.entities[${m}]`))},h=(d,c,p=!0)=>{if(n(d,k.elementEnvelope,c),!g(d)||!g(d.payload))return;let f=typeof d.kind=="string"?d.kind:"",m=k[f]??[];n(d.payload,[...k.elementBase,...p?k.elementPage:[],...m],`${c}.payload`),n(d.payload.colorSlot,k.colorSlot,`${c}.payload.colorSlot`),n(d.payload.frame,k.frame,`${c}.payload.frame`),"chartAnchor"in d.payload&&n(d.payload.chartAnchor,k.chartAnchor,`${c}.payload.chartAnchor`),"shadow"in d.payload&&n(d.payload.shadow,k.shadow,`${c}.payload.shadow`);for(let y of["fill","areaFill"])y in d.payload&&r(d.payload[y],`${c}.payload.${y}`);if("ticks"in d.payload&&n(d.payload.ticks,k.gaugeTicks,`${c}.payload.ticks`),"labels"in d.payload&&n(d.payload.labels,k.gaugeLabels,`${c}.payload.labels`),g(d.payload.level)){let y=`${c}.payload.level`;n(d.payload.level,k.level,y);for(let S of["value","minSource","maxSource"])S in d.payload.level&&i(d.payload.level[S],`${y}.${S}`)}l(d.payload.rules,`${c}.payload.rules`);for(let y of["value","symbol","nowIndex","total","minSource","maxSource"])y in d.payload&&i(d.payload[y],`${c}.payload.${y}`);if(f==="text"&&"arc"in d.payload&&n(d.payload.arc,k.arc,`${c}.payload.arc`),f==="timeline"&&"aggregate"in d.payload&&n(d.payload.aggregate,k.timelineAggregate,`${c}.payload.aggregate`),f==="text"&&Array.isArray(d.payload.parts)&&d.payload.parts.forEach((y,S)=>{n(y,k.textPart,`${c}.payload.parts[${S}]`),g(y)&&i(y.value,`${c}.payload.parts[${S}].value`),g(y)&&"icon"in y&&i(y.icon,`${c}.payload.parts[${S}].icon`)}),f==="image"&&n(d.payload.entity,k.entityRef,`${c}.payload.entity`),f==="tap"&&n(d.payload.action,k.tapAction,`${c}.payload.action`),f==="list"){s(d.payload.source,`${c}.payload.source`);let y=Array.isArray(d.payload.template)?d.payload.template:[];y.length>Nl&&t.push(`${c}.payload.template.length`),y.forEach((S,H)=>{let O=`${c}.payload.template[${H}]`;g(S)&&Ui.includes(String(S.kind))?t.push(`${O}.kind`):h(S,O,!1)})}};Array.isArray(e.elements)&&e.elements.forEach((d,c)=>h(d,`$.elements[${c}]`));let u=[];if(Array.isArray(e.perFamily))for(let d=0;d+1<e.perFamily.length;d+=2)u.push([String(e.perFamily[d]),e.perFamily[d+1]]);else g(e.perFamily)&&u.push(...Object.entries(e.perFamily));for(let[d,c]of u){let p=`$.perFamily.${d}`;if(n(c,k.layout,p),!!g(c)){if(g(c.placements))for(let[f,m]of Object.entries(c.placements))n(m,k.placement,`${p}.placements.${f}`),g(m)&&n(m.frame,k.frame,`${p}.placements.${f}.frame`);if(i(c.bezelText,`${p}.bezelText`),i(c.curvedText,`${p}.curvedText`),i(c.parkedCurvedText,`${p}.parkedCurvedText`),"backgroundFill"in c&&r(c.backgroundFill,`${p}.backgroundFill`),g(c.bezelGauge)){let f=`${p}.bezelGauge`;n(c.bezelGauge,k.bezelGauge,f),i(c.bezelGauge.value,`${f}.value`),i(c.bezelGauge.minLabel,`${f}.minLabel`),i(c.bezelGauge.maxLabel,`${f}.maxLabel`)}l(c.rules,`${p}.rules`)}}if(g(e.inline)&&(n(e.inline,k.inline,"$.inline"),i(e.inline.value,"$.inline.value"),Array.isArray(e.inline.parts)&&e.inline.parts.forEach((d,c)=>{n(d,k.inlinePart,`$.inline.parts[${c}]`),g(d)&&i(d.value,`$.inline.parts[${c}].value`)})),g(e.pages)&&n(e.pages,k.pages,"$.pages"),g(e.control)){n(e.control,k.control,"$.control");for(let d of["title","valueLabel","state","status"])d in e.control&&i(e.control[d],`$.control.${d}`);n(e.control.action,k.tapAction,"$.control.action")}return n(e.tapAction,k.tapAction,"$.tapAction"),t}function I(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function Xt(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function wr(){return T("Text")}function Vf(e){return e?.curvedText!==void 0?"curved":"canvas"}function Wf(e,t){t==="curved"?(e.curvedText===void 0&&(e.curvedText=e.parkedCurvedText??wr(),e.parkedCurvedColorHex!==void 0&&(e.curvedColorHex=e.parkedCurvedColorHex)),delete e.parkedCurvedText,delete e.parkedCurvedColorHex):e.curvedText!==void 0&&(e.parkedCurvedText=e.curvedText,e.curvedColorHex!==void 0?e.parkedCurvedColorHex=e.curvedColorHex:delete e.parkedCurvedColorHex,delete e.curvedText,delete e.curvedColorHex)}function Uf(e){return e!==void 0&&(e.curvedText!==void 0||e.bezelText!==void 0||e.bezelGauge!==void 0)}function tc(){return{value:T("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]}}function vr(e,t,n="rectangular"){let o=nc(e,t,n===null?[]:[n]),i=o.perFamily.corner;return i&&(i.curvedText=wr(),i.bezelGauge=tc(),o.schemaVersion=In(o)),o}function nc(e,t,n){let o={};for(let r of L)n.includes(r)&&(o[r]=Xt());let i={schemaVersion:4,id:I(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:it.filter(r=>n.includes(r)),perFamily:o,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(i.inline={value:T("Text")}),i.schemaVersion=In(i),i}function oc(e){let t=Kl(e.tapAction.type)?structuredClone(e.tapAction):{type:"toggleEntity",entityId:"",displayName:"",domain:""};return{kind:"toggle",title:T(e.name.trim()||"Control"),symbol:qi,coloring:"uniform",bands:[],action:t}}function Bf(e){return e.control===void 0}function ic(e){return e.control!==void 0&&e.supportedFamilies.length===0}function rc(e,t){if(!t){if(ic(e))return;delete e.control;return}e.control===void 0&&(e.control=oc(e))}function Gf(e,t,n){let o=vr(e,t,n??null);return rc(o,!0),o}function z(e){let t=n=>({id:I(),colorSlot:{baseColorHex:n},rules:[],frame:{...ki},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:T("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:T("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:T("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:G,thresholdColorHex:Un}};case"chart":return{kind:e,payload:{...t("#FFFFFF"),value:T("13,14,16,17,19,22,24,28,30"),historyMinutes:Qs,historyPoints:24,source:$n,statPeriod:Nn,statType:On,style:"bars",curve:"smooth",fillStyle:"fade",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:Le,lowColorHex:Ie,marker:"none",coloring:"uniform",bands:[],bandAboveColorHex:G,fillBands:!1,thresholdColorHex:Bn,nowColorHex:Gn,timeLabelCount:be,labelSize:te,labelColorHex:ne,labelsAbove:!1,hourCycle:xe,minutes:we}};case"timeline":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,value:T(""),historyMinutes:fl,bands:[],otherColorHex:pl,gap:0,cornerRadius:hl,timeLabelCount:Mi,labelSize:te,labelColorHex:ne,labelsAbove:!1,hourCycle:xe,minutes:we}}}case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:Cl,timestampCorner:"topLeading",timestampSize:Kt}}}case"tap":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,action:{type:"refresh"}}}}case"chartTimes":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,chart:"",timeLabelCount:be,labelSize:te,labelColorHex:ne,hourCycle:xe,minutes:we}}}case"imageTime":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,image:""}}}case"chartDots":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,chart:"",dots:"auto"}}}case"chartGrid":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,chart:"",lines:Rn,colorHex:Dt,thickness:Mn}}}case"list":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,source:{kind:"entities",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},sort:"name",descending:!1,attributes:[]},rows:Zn,direction:"down",columns:Qn,gap:eo,template:[]}}}}}function T(e){return{kind:{kind:"literal",value:e}}}function kr(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}var ci=["circular","corner"],ui=Math.SQRT1_2;function ac(e){return e==="text"||e==="icon"?4:.5}function Cr(e,t,n,o){let i=structuredClone(e),r=N[t],a=N[n];if(t===n||!r||!a)return i;let l=ci.includes(t),s=ci.includes(n),h=l===s?1:s?ui:1/ui,u=Math.min(a.width/r.width,a.height/r.height)*h;if(h!==1){let d=i.frame,c=d.x+d.width/2,p=d.y+d.height/2;i.frame={...d,width:d.width*h,height:d.height*h,x:.5+(c-.5)*h-d.width*h/2,y:.5+(p-.5)*h-d.height*h/2}}return i.size!==void 0&&(i.size=Math.max(ac(o),Math.round(i.size*u*10)/10)),i}function sc(e,t){if(!t)return e;let n={...e.payload,frame:t.frame,isHidden:t.isHidden};return t.size!==void 0&&(e.kind==="text"?n.fontSize=t.size:e.kind==="icon"?n.size=t.size:(e.kind==="gauge"||e.kind==="chart")&&(n.lineWidth=t.size)),{kind:e.kind,payload:n}}function jf(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(o=>sc(o,n.placements[o.payload.id]))}function ze(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return e.payload.source==="inline"?void 0:{kind:{kind:"entityState",...e.payload.entity}};case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}function pt(e){let t=[],n=o=>{for(let i of o)i.value&&t.push(i.value)};for(let o of e){for(let i of o.cases){for(let r of i.when.tests)t.push(r.value),r.comparison.value&&t.push(r.comparison.value),r.comparison.upper&&t.push(r.comparison.upper);n(i.then)}o.otherwise&&n(o.otherwise)}return t}var lc=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function $t(e,t){let n,o=t;for(let i=0;o!==void 0&&i<4;i++){let r=o.kind;if(r.kind==="chartStat"){o=fd(e,o)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let a={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return n===void 0?{ref:a}:{ref:a,namedId:n}}if(r.kind!=="named")return;n=r.id.toUpperCase(),o=e.values.find(a=>a.id.toUpperCase()===n)?.value}}function dc(e,t){return $t(e,ze(t))?.ref}function cc(e,t){let n=dc(e,t),o=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&lc.includes(o)?{type:"toggleEntity",...n,domain:o}:{type:"refresh"}}function pi(e,t,n){if(zi(t)||n.width<=0||n.height<=0)return{...e};let o=t,i=e.x-o.left/n.width,r=e.x+e.width+o.right/n.width,a=e.y-o.top/n.height,l=e.y+e.height+o.bottom/n.height;return r<i&&(i=r=(i+r)/2),l<a&&(a=l=(a+l)/2),i=j(i),r=j(r),a=j(a),l=j(l),{...e,x:i,y:a,width:Math.max(0,r-i),height:Math.max(0,l-a)}}function Sr(e,t,n){let o=i=>Math.round(i*100)/100||0;return{left:o((e.x-t.x)*n.width),right:o((t.x+t.width-e.x-e.width)*n.width),top:o((e.y-t.y)*n.height),bottom:o((t.y+t.height-e.y-e.height)*n.height)}}function Kf(e,t,n,o){let i=e.elements.find(c=>c.payload.id===t);if(!i||i.kind!=="tap"||i.payload.attachedTo===void 0)return;let r=e.elements.find(c=>c.payload.id===i.payload.attachedTo);if(!r)return;let a=e.perFamily[n]?.placements[r.payload.id]?.frame??r.payload.frame,l=j(o.x),s=j(o.y),h=j(o.x+o.width),u=j(o.y+o.height),d={...o,x:l,y:s,width:Math.max(0,h-l),height:Math.max(0,u-s)};i.payload.outset=Sr(a,d,N[n])}function qf(e,t,n){let o=e.elements.find(l=>l.payload.id===t);if(!o)return;let i=e.perFamily[n];if(!i)return;let r=i.placements[t]?.frame??o.payload.frame,a=N[n];return{width:r.width*a.width,height:r.height*a.height}}function ke(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function R(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function uc(e,t){for(let n of e.elements)if(n.kind==="list"&&n.payload.template.some(o=>o.payload.id===t))return n}function Jf(e,t){let n=e.elements.find(o=>o.payload.id===t);if(!n)return uc(e,t)?.payload.id;if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let o=e.elements.find(i=>i.payload.id===n.payload.attachedTo);if(o)return o.payload.id}return n.payload.id}function Ve(e){let t=new Map(e.elements.map(i=>[i.payload.id,i])),n=new Map;for(let i of e.elements){if(i.kind!=="tap")continue;let r=i.payload.attachedTo;if(r===void 0)continue;let a=t.get(r);if(!a||a.kind==="tap"||r===i.payload.id){delete i.payload.attachedTo;continue}let l=n.get(r);l?l.push(i):n.set(r,[i])}if(n.size===0)return;for(let[i,r]of n){let a=t.get(i);for(let l of r){let s=l.payload;s.outset===void 0&&(s.outset=Sr(a.payload.frame,s.frame,N.rectangular));let h=s.outset,u=!zi(h);l.payload.frame=pi(a.payload.frame,h,N.rectangular),l.payload.isHidden=a.payload.isHidden,a.payload.page===void 0?delete l.payload.page:l.payload.page=a.payload.page;let d=yc(e,i);for(let c of L){let p=e.perFamily[c];if(!p)continue;let f=N[c],m=p.placements[i];c!==d||!m?delete p.placements[l.payload.id]:u?p.placements[l.payload.id]={frame:pi(m.frame,h,f),isHidden:m.isHidden}:p.placements[l.payload.id]={frame:{...m.frame},isHidden:m.isHidden}}}}let o=[];for(let i of e.elements){if(i.kind==="tap"&&i.payload.attachedTo!==void 0)continue;o.push(i);let r=n.get(i.payload.id);r&&o.push(...r)}e.elements=o}function Xf(e,t,n){let o=e.elements.find(l=>l.payload.id===t);if(!o||o.kind==="tap")return;let i=ke(e,t)[0];if(i)return i.payload;let r=z("tap"),a=r.payload;return a.attachedTo=t,a.outset={..._l},a.action=n??cc(e,o),e.elements.push(r),Ve(e),a}function pc(e,t){let n=ke(e,t).map(o=>o.payload.id);if(n.length!==0){e.elements=e.elements.filter(o=>!n.includes(o.payload.id));for(let o of L)for(let i of n)delete e.perFamily[o]?.placements[i]}}function ee(e,t){for(let r of or(e,t))ee(e,r.payload.id);for(let r of xd(e,t))ee(e,r.payload.id);for(let r of Fd(e,t))ee(e,r.payload.id);for(let r of Hd(e,t))ee(e,r.payload.id);for(let r of Sd(e,t))ee(e,r.payload.id);for(let r of Pe(e,t))delete r.payload.chartAnchor;let n=e.elements.find(r=>r.payload.id===t),o=n?U(e,n.payload.groupId).map(r=>r.id):[];pc(e,t),e.elements=e.elements.filter(r=>r.payload.id!==t);let i=n?.payload.chartAnchor;if(i&&(i.at==="threshold"||i.at==="now")&&!Pe(e,i.layer).some(r=>r.payload.chartAnchor?.at===i.at)){let r=e.elements.find(a=>a.payload.id===i.layer);r?.kind==="chart"&&(i.at==="threshold"?(delete r.payload.thresholdValue,delete r.payload.drawsThreshold):(delete r.payload.nowIndex,delete r.payload.drawsNowLine))}for(let r of e.elements)r.kind==="chart"&&r.payload.scaleFrom===t&&delete r.payload.scaleFrom;for(let r of L)delete e.perFamily[r]?.placements[t];if(n?.kind==="list")for(let r of n.payload.template)for(let a of L)delete e.perFamily[a]?.placements[r.payload.id];Ve(e),B(e),n&&fc(e,o.find(r=>P(e,r)!==void 0),hc(n))}function hc(e){if(e.payload.chartAnchor)return e.payload.chartAnchor.layer;switch(e.kind){case"text":{let t=e.payload.value.kind;return t.kind==="chartStat"||t.kind==="imageTime"?t.layer:void 0}case"chartTimes":return e.payload.chart;case"chartDots":return e.payload.chart;case"chartGrid":return e.payload.chart;case"imageTime":return e.payload.image;default:return}}function fc(e,t,n){if(t===void 0||n===void 0||!e.groups?.some(i=>i.id===t))return;let o=oe(e,t);o.length===1&&o[0].payload.id===n&&Zd(e,t)}function Yf(e,t){let n=e.elements.findIndex(s=>s.payload.id===t),o=e.elements[n];if(!o)return;let i=I(),r=structuredClone(o);r.payload.id=i,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let a=[r],l=[[t,i]];for(let s of ke(e,t)){let h=structuredClone(s);h.payload.id=I(),h.payload.attachedTo=i,a.push(h),l.push([s.payload.id,h.payload.id])}e.elements.splice(n+1,0,...a);for(let s of L){let h=e.perFamily[s];if(h)for(let[u,d]of l){let c=h.placements[u];c&&(h.placements[d]=structuredClone(c))}}return Ve(e),i}function mc(e,t){let n=/^(.*\S) \d+$/.exec(e)?.[1]??e,o=new Set(t),i=2;for(;o.has(`${n} ${i}`);)i++;return`${n} ${i}`}function Zf(e,t,n){let o=e.elements.findIndex(l=>l.payload.id===t),i=e.elements[o];if(!i||i.kind!=="chart")return;let r=I(),a=structuredClone(i);a.payload.id=r,a.payload.scaleFrom=t,n&&(a.payload.name=mc(n(i),e.elements.map(n))),e.elements.splice(o+1,0,a);for(let l of L){let s=e.perFamily[l],h=s?.placements[t];s&&h&&(s.placements[r]=structuredClone(h))}return r}function Tr(e,t,n){let o=new Set,i=u=>{o.add(u);for(let d of ke(e,u))o.add(d.payload.id)};for(let u of t){i(u);for(let d of or(e,u))i(d.payload.id)}let r=e.elements.filter(u=>o.has(u.payload.id)).map(u=>structuredClone(u)),a=r.flatMap(u=>u.kind==="list"?[u.payload.id,...u.payload.template.map(d=>d.payload.id)]:[u.payload.id]),l={};for(let u of L){let d=e.perFamily[u];if(!d)continue;let c={};for(let p of a){let f=d.placements[p];f&&(c[p]=structuredClone(f))}Object.keys(c).length>0&&(l[u]=c)}let s=new Set;for(let u of r)for(let d of U(e,u.payload.groupId))s.add(d.id);let h=(e.groups??[]).filter(u=>s.has(u.id)).map(u=>structuredClone(u));return{elements:r,placements:l,groups:h,...n!==void 0?{family:n}:{}}}function Qf(e,t,n){let o=t.family,i=o!==void 0&&o!==n&&dt(o);if(!dt(n))return Nt(e,t);let r=Nt(e,t,i?{nudge:!1}:{}),a=e.perFamily[n]??(e.perFamily[n]=Xt());for(let l of r){let s=e.elements.find(c=>c.payload.id===l);if(!s)continue;let h=(o!==void 0?e.perFamily[o]?.placements[l]:void 0)??L.map(c=>e.perFamily[c]?.placements[l]).find(c=>c!==void 0),u=h?.size??kr(s),d={frame:{...h?.frame??s.payload.frame},isHidden:!1,...u!==void 0?{size:u}:{}};for(let c of L)c!==n&&delete e.perFamily[c]?.placements[l];a.placements[l]=i?Cr(d,o,n,s.kind):d}return _r(e,n),r}function gc(e,t){let n=new Map,o=new Set(e.map(a=>a.id)),i=new Set,r=a=>{if(i.has(a.id))return 0;i.add(a.id);let l=t.filter(s=>s.payload.groupId===a.id).length;for(let s of e)s.parentId===a.id&&(l+=r(s));return l>=2?(n.set(a.id,I()),1):l};for(let a of e)(a.parentId===void 0||!o.has(a.parentId))&&r(a);return n}function Nt(e,t,n={}){let o=new Map;for(let p of t.elements)if(o.set(p.payload.id,I()),p.kind==="list")for(let f of p.payload.template)o.set(f.payload.id,I());let i=new Set(e.elements.map(p=>p.payload.id)),r=n.nudge!==!1&&t.elements.some(p=>i.has(p.payload.id)),a=p=>r?{...p,x:Math.min(.9,p.x+.05),y:Math.min(.9,p.y+.05)}:p,l=[];for(let p of t.elements){let f=structuredClone(p);if(f.payload.id=o.get(p.payload.id),f.kind==="tap"&&f.payload.attachedTo!==void 0){let m=o.get(f.payload.attachedTo);m?f.payload.attachedTo=m:delete f.payload.attachedTo}if(f.kind==="chart"&&f.payload.scaleFrom!==void 0){let m=o.get(f.payload.scaleFrom);m?f.payload.scaleFrom=m:i.has(f.payload.scaleFrom)||delete f.payload.scaleFrom}if(f.kind==="text")for(let m of f.payload.parts??[]){let y=m.value.kind,S=y.kind==="chartStat"?o.get(y.layer):void 0;y.kind==="chartStat"&&S&&(y.layer=S)}if(f.kind==="text"&&f.payload.value.kind.kind==="chartStat"){let m=o.get(f.payload.value.kind.layer);if(m)f.payload.value.kind.layer=m;else if(!i.has(f.payload.value.kind.layer))continue}if(f.kind==="chartTimes"||f.kind==="chartDots"||f.kind==="chartGrid"){let m=o.get(f.payload.chart);if(m)f.payload.chart=m;else if(!i.has(f.payload.chart))continue}if(f.kind==="imageTime"){let m=o.get(f.payload.image);if(m)f.payload.image=m;else if(!i.has(f.payload.image))continue}if(Ac(f,m=>{if(m.kind.kind!=="imageTime")return;let y=o.get(m.kind.layer);y&&(m.kind.layer=y)}),f.payload.chartAnchor!==void 0){let m=o.get(f.payload.chartAnchor.layer);m?f.payload.chartAnchor.layer=m:i.has(f.payload.chartAnchor.layer)||delete f.payload.chartAnchor}if(f.kind==="list")for(let m of f.payload.template){let y=o.get(m.payload.id);y&&(m.payload.id=y)}f.payload.frame=a(f.payload.frame),l.push(f)}let s=gc(t.groups,l.filter(p=>!(p.kind==="tap"&&p.payload.attachedTo!==void 0))),h=new Map(t.groups.map(p=>[p.id,p])),u=p=>{let f=new Set,m=p===void 0?void 0:h.get(p);for(;m&&!f.has(m.id);){let y=s.get(m.id);if(y)return y;f.add(m.id),m=m.parentId===void 0?void 0:h.get(m.parentId)}};for(let p of t.groups){let f=s.get(p.id);if(!f)continue;let m={...structuredClone(p),id:f},y=u(p.parentId);y?m.parentId=y:delete m.parentId,(e.groups??=[]).push(m)}for(let p of l){if(p.payload.groupId===void 0)continue;let f=u(p.payload.groupId);f?p.payload.groupId=f:delete p.payload.groupId}e.elements.push(...l);let d=new Set(l.map(p=>p.payload.id)),c=new Set(l.flatMap(p=>p.kind==="list"?p.payload.template.map(f=>f.payload.id):[]));for(let p of L){let f=t.placements[p],m=e.perFamily[p];if(!(!f||!m))for(let[y,S]of Object.entries(f)){let H=o.get(y);H!==void 0&&(c.has(H)?m.placements[H]=structuredClone(S):d.has(H)&&(m.placements[H]={...structuredClone(S),frame:a(S.frame)}))}}return Ve(e),B(e),le(e),l.filter(p=>!R(e,p)).map(p=>p.payload.id)}function Ar(e,t,n){let o=e.perFamily[t],i=o?.placements[n.payload.id];return o&&Object.keys(o.placements).length>0&&i?!i.isHidden:!n.payload.isHidden}function yc(e,t){let n=e.elements.find(r=>r.payload.id===t),i=(n&&n.kind==="tap"?n.payload.attachedTo:void 0)??t;return L.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[i]!==void 0)}function po(e,t){let n=e.perFamily[t];return n?e.elements.filter(o=>{let i=o.kind==="tap"?o.payload.attachedTo:void 0;return n.placements[i??o.payload.id]!==void 0}):[]}function em(e,t){let n=e.perFamily[t];return n?po(e,t).filter(o=>!R(e,o)&&!n.placements[o.payload.id]?.isHidden).length:0}function _r(e,t){let n=L.filter(l=>e.supportedFamilies.includes(l));if(n.length===0)return;let o=t!==void 0&&dt(t)&&n.includes(t)?t:n[0];for(let l of n)e.perFamily[l]||(e.perFamily[l]=Xt());let i=()=>e.elements.filter(l=>!R(e,l)),r=new Map,a=new Set;if(t===void 0){let l=new Map(i().map(c=>[c.payload.id,n.filter(p=>Ar(e,p,c))]));for(let[c,p]of l)p[0]&&r.set(c,p[0]);let s=new Map([...i().entries()].map(([c,p])=>[p.payload.id,c]));for(let c of n){let p=i().filter(y=>(l.get(y.payload.id)??[]).includes(c)&&r.get(y.payload.id)!==c).map(y=>y.payload.id);if(p.length===0)continue;let f=Tr(e,p,c),m=Nt(e,f,{nudge:!1});m.forEach((y,S)=>{r.set(y,c);let H=m.length===p.length?p[S]:void 0;s.set(y,H!==void 0?s.get(H)??0:s.size)})}for(let c of i())r.has(c.payload.id)||a.add(c.payload.id);let h=c=>n.indexOf(r.get(c)??o),u=i().sort((c,p)=>h(c.payload.id)-h(p.payload.id)||(s.get(c.payload.id)??0)-(s.get(p.payload.id)??0)),d=[];for(let c of u)d.push(c),d.push(...ke(e,c.payload.id));e.elements=d}for(let l of i()){let s=l.payload.id,h=n.filter(p=>e.perFamily[p].placements[s]!==void 0),u=r.get(s)??h.find(p=>!e.perFamily[p].placements[s].isHidden)??h[0]??o,d=e.perFamily[u]?.placements[s],c={frame:{...d?.frame??l.payload.frame},isHidden:a.has(s)||d?.isHidden===!0,...d?.size!==void 0?{size:d.size}:{}};l.payload.isHidden=!0;for(let p of L){let f=e.perFamily[p];f&&(p===u?f.placements[s]=c:delete f.placements[s])}}}function bc(e,t,n){let o=e.perFamily[n]??(e.perFamily[n]=Xt()),i=po(e,t).filter(s=>!R(e,s));if(i.length===0)return;let r=Tr(e,i.map(s=>s.payload.id),t),a=Nt(e,r,{nudge:!1}),l=e.perFamily[t];for(let s of a){let h=e.elements.find(p=>p.payload.id===s);if(!h)continue;let u=l?.placements[s],d=u?.size??kr(h),c={frame:{...u?.frame??h.payload.frame},isHidden:u?.isHidden??!1,...d!==void 0?{size:d}:{}};for(let p of L)p!==n&&delete e.perFamily[p]?.placements[s];o.placements[s]=Cr(c,t,n,h.kind)}_r(e,n)}var xc={small:"circular",medium:"rectangular"};function wc(e,t){let n=L.filter(r=>r!==t&&r!=="corner"&&e.supportedFamilies.includes(r)&&po(e,r).some(a=>!R(e,a))),o=dt(t)?xc[t]:void 0;if(o!==void 0&&n.includes(o))return o;let i;for(let r of n)(i===void 0||N[r].width>N[i].width)&&(i=r);return i}function tm(e,t){if(!dt(t)||!e.supportedFamilies.includes(t))return;let n=e.perFamily[t];if(n&&Object.keys(n.placements).length>0)return;let o=wc(e,t);if(o!==void 0)return bc(e,o,t),o}function vc(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n)return[];let o=[],i=$t(e,ze(n));if(i){let r=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";o.push(i.namedId===void 0?{where:r,ref:i.ref}:{where:r,ref:i.ref,namedId:i.namedId})}for(let r of ke(e,t)){let a=r.payload.action;!("entityId"in a)||a.entityId===""||o.push({where:"tap",ref:{entityId:a.entityId,displayName:a.displayName,domain:a.domain},tapId:r.payload.id})}for(let r of n.payload.rules)for(let a of r.cases)for(let l of a.when.tests){let s=$t(e,l.value);if(!s)continue;let h={where:"test",ref:s.ref,ruleId:r.id,caseId:a.id,testId:l.id};s.namedId!==void 0&&(h.namedId=s.namedId),o.push(h)}return o}function kc(e,t){return vc(e,t)[0]?.ref}function ot(e,t,n){if(!e)return;let o=e.kind;switch(o.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:o.attribute}};case"literal":return n==="text"||n==="gauge"||n==="chart"||n==="timeline"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function nm(e,t,n,o){let i=e.elements.find(l=>l.payload.id===t);if(!i||n.entityId==="")return;let r={...n,domain:n.domain||n.entityId.split(".")[0]||""},a=kc(e,t)?.entityId;if(a!==void 0&&a!==r.entityId){let l=new Set;for(let s of i.payload.rules)for(let h of s.cases)for(let u of h.when.tests){let d=u.value.kind;if(d.kind==="named"){$t(e,u.value)?.ref.entityId===a&&l.add(d.id);continue}if(!("entityId"in d)||d.entityId!==a)continue;let c=ot(u.value,r,"icon");c&&(u.value=c)}for(let s of l){let h=e.values.find(d=>d.id.toUpperCase()===s.toUpperCase()),u=h?ot(h.value,r,"icon"):void 0;u&&_c(e,s,u)}}if(i.kind==="timeline"){let l=i.payload.value.kind.kind==="entityState"?i.payload.value.kind.entityId:void 0,s=ot(i.payload.value,r,i.kind);s&&(i.payload.value=s),(i.payload.bands.length===0||l!==r.entityId)&&(i.payload.bands=i.payload.aggregate!==void 0?Qo(dl):Qo(r.domain,o)),i.payload.aggregate!==void 0&&(i.payload.aggregate={...i.payload.aggregate,entities:i.payload.aggregate.entities.map((h,u)=>u===0?r.entityId:h)})}else if(i.kind==="image")i.payload.entity=r;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let l=ot(i.payload.value,r,i.kind);l&&(i.payload.value=l)}else if(i.kind==="icon"){let l=ot(i.payload.symbol,r,i.kind);l&&(i.payload.symbol=l)}for(let l of ke(e,t)){let s=l.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var Cc={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area",chartTimes:"clock times",chartDots:"chart dots",chartGrid:"chart grid",imageTime:"timestamp",list:"list"};function hi(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function fi(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let t=e.layerKind===void 0?"":Cc[e.layerKind],n=e.layerName?`${t} "${e.layerName}"`:t;if(e.part==="listSource")return`Items of ${n}`;if(e.part==="listRow")return n===""?"List row":`Row of ${n}`;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${n}`:e.part==="gaugeMin"?`Min on ${n}`:e.part==="gaugeMax"?`Max on ${n}`:e.part==="nowIndex"?`Now marker on ${n}`:e.part==="level"?`Fill on ${n}`:e.part==="levelMin"?`Fill min on ${n}`:e.part==="levelMax"?`Fill max on ${n}`:e.part==="textPart"?`Part of ${n}`:e.part==="timelineGroup"?`Combined on ${n}`:`${hi(t)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return n===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${n}`;case"layout":{let o=hi(e.family??"");switch(e.part){case"curvedText":return`${o} curved text`;case"bezelGauge":return`${o} bezel gauge`;case"bezelGaugeMin":return`${o} bezel gauge low label`;case"bezelGaugeMax":return`${o} bezel gauge high label`;default:return`${o} bezel`}}case"inline":return"Inline";case"control":switch(e.part){case"controlValue":return"Control Center value line";case"controlState":return"Control Center state";case"controlStatus":return"Control Center status text";default:return"Control Center"}}}var Er=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g,Sc="{item.";function mi(e){return e.startsWith(Sc)}function ho(e){let t=[];for(let n of e.matchAll(Er))n[2]!==void 0&&t.push(n[2]);return t}function om(e,t){return t.size===0?e:e.replace(Er,(n,o,i)=>{let r=t.get(i);return r===void 0?n:`${o}${r}${o}`})}function Fe(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function Tc(e,t){if(t.payload.name)return t.payload.name;if(t.kind==="shape")return t.payload.kind==="roundedRectangle"?"rounded rectangle":t.payload.kind;if(t.kind==="tap")return"";if(t.kind==="image")return t.payload.entity.displayName||t.payload.entity.entityId;let n=ze(t)?.kind;if(n===void 0)return"";if(n.kind==="literal")return n.value;if("entityId"in n)return n.displayName||n.entityId;if(n.kind==="named"){let o=n.id.toUpperCase();return e.values.find(i=>i.id.toUpperCase()===o)?.name??""}return""}function ae(e,t){let n=(s,h)=>{t.value?.(s,h);let u=s.kind;if(u.kind==="jinja"){if(t.text){let c=t.text(u.value,{...h,part:"template"});c!==u.value&&(u.value=c)}return}if(u.kind==="aggregate"){let c=u.aggregate.scope;if(t.ref&&c.kind==="entities")for(let p=0;p<c.entities.length;p++){let f=t.ref(Fe(c.entities[p]),h);f&&(c.entities[p]=f)}return}if(!t.ref||!("entityId"in u))return;let d=t.ref(Fe(u),h);d&&(u.kind==="entityAttribute"?s.kind={kind:"entityAttribute",...d,attribute:u.attribute}:u.kind==="entityState"?s.kind={kind:"entityState",...d}:s.kind={kind:"entityAge",...d})},o=(s,h,u)=>{if(s.type==="callService"){if(t.ref&&s.target!==void 0&&!mi(s.target.entityId)&&s.target.entityId!==""){let c=t.ref(Fe(s.target),h);c&&(s.target=c)}if(t.text&&s.serviceDataJSON!==void 0){let c=t.text(s.serviceDataJSON,{...h,part:"serviceData"});c!==s.serviceDataJSON&&(s.serviceDataJSON=c)}return}if(!t.ref||!("entityId"in s)||s.entityId===""||mi(s.entityId))return;let d=t.ref(Fe(s),h);d&&u({type:s.type,...d})};for(let s of e.values)n(s.value,{kind:"named",valueId:s.id,valueName:s.name});let i=(s,h)=>{if(s.kind==="image"){if(t.ref){let d=t.ref(Fe(s.payload.entity),{...h,kind:"image"});d&&(s.payload.entity=d)}}else if(s.kind==="tap"){let d=s.payload;o(d.action,{...h,kind:"tap"},c=>{d.action=c})}else{let d=ze(s);if(d&&n(d,h),s.kind==="text")for(let c of s.payload.parts??[])n(c.value,{...h,part:"textPart"}),c.icon&&n(c.icon,{...h,part:"textPart"});if(s.kind==="gauge"&&s.payload.total&&n(s.payload.total,{...h,part:"total"}),s.kind==="gauge"&&s.payload.minSource&&n(s.payload.minSource,{...h,part:"gaugeMin"}),s.kind==="gauge"&&s.payload.maxSource&&n(s.payload.maxSource,{...h,part:"gaugeMax"}),s.kind==="chart"&&s.payload.nowIndex&&n(s.payload.nowIndex,{...h,part:"nowIndex"}),s.kind==="icon"||s.kind==="shape"){let c=s.payload.level;c&&(n(c.value,{...h,part:"level"}),c.minSource&&n(c.minSource,{...h,part:"levelMin"}),c.maxSource&&n(c.maxSource,{...h,part:"levelMax"}))}if(s.kind==="timeline"&&t.ref&&s.payload.aggregate!==void 0){let c=s.payload.aggregate.entities;for(let p=0;p<c.length;p++){let f=c[p]??"";if(f==="")continue;let m=t.ref({entityId:f,displayName:"",domain:f.split(".")[0]??""},{...h,part:"timelineGroup"});m&&(c[p]=m.entityId)}}if(s.kind==="list"){r(s.payload.source,{...h,part:"listSource"});let c={...h,part:"listRow"};for(let p of s.payload.template)i(p,c)}}let u={...h,kind:"rule"};for(let d of pt(s.payload.rules))n(d,u)},r=(s,h)=>{if(s.kind==="template"){if(t.text){let d=t.text(s.value,{...h,part:"template"});d!==s.value&&(s.value=d)}return}if(!t.ref)return;let u=(d,c)=>{if(d.entityId==="")return;let p=t.ref(Fe(d),h);p&&c(p)};switch(s.kind){case"entities":if(s.scope.kind==="entities"){let d=s.scope.entities;for(let c=0;c<d.length;c++)u(d[c],p=>{d[c]=p})}return;case"calendar":case"todo":{let d=s.entities;for(let c=0;c<d.length;c++)u(d[c],p=>{d[c]=p});return}case"attribute":case"forecast":u(s,d=>{s.entityId=d.entityId,s.displayName=d.displayName,s.domain=d.domain,d.iconName!==void 0?s.iconName=d.iconName:delete s.iconName});return}};for(let s of e.elements)i(s,{kind:"layer",layerId:s.payload.id,layerKind:s.kind,layerName:Tc(e,s)});let a=Object.keys(e.perFamily).sort((s,h)=>{let u=it.indexOf(s),d=it.indexOf(h);return(u<0?it.length:u)-(d<0?it.length:d)});for(let s of a){let h=e.perFamily[s];if(!h)continue;let u={kind:"layout",family:s};h.bezelText&&n(h.bezelText,{...u,part:"bezelText"}),h.curvedText&&n(h.curvedText,{...u,part:"curvedText"});let d=h.bezelGauge;d&&(n(d.value,{...u,part:"bezelGauge"}),d.minLabel&&n(d.minLabel,{...u,part:"bezelGaugeMin"}),d.maxLabel&&n(d.maxLabel,{...u,part:"bezelGaugeMax"}));let c={kind:"rule",family:s};for(let p of pt(h.rules))n(p,c)}if(e.inline){n(e.inline.value,{kind:"inline"});for(let s of e.inline.parts??[])n(s.value,{kind:"inline",part:"textPart"})}let l=e.control;if(l){let s={kind:"control"};n(l.title,s),l.valueLabel&&n(l.valueLabel,{...s,part:"controlValue"}),l.state&&n(l.state,{...s,part:"controlState"}),l.status&&n(l.status,{...s,part:"controlStatus"}),o(l.action,s,h=>{l.action=h})}o(e.tapAction,{kind:"documentTap"},s=>{e.tapAction=s})}function de(e,t){ae(e,{value:t})}function Ac(e,t){let n=vr("",0);n.elements=[e],ae(n,{value:t})}function Yt(e,t){return e.kind.kind==="named"&&e.kind.id.toUpperCase()===t.toUpperCase()}function im(e,t){let n=new Set;return de(e,(o,i)=>{Yt(o,t)&&n.add(i.layerId??`${i.kind}:${i.valueId??""}:${i.family??""}:${i.part??""}`)}),n.size}function _c(e,t,n){let o=e.values.find(c=>c.id.toUpperCase()===t.toUpperCase());if(!o)return;let r=(c=>"entityId"in c.kind&&c.kind.entityId!==""?c.kind.entityId:void 0)(o.value);o.value=n;let a="entityId"in n.kind?{entityId:n.kind.entityId,displayName:n.kind.displayName,domain:n.kind.domain}:void 0;if(r===void 0||a===void 0||a.entityId===""||a.entityId===r)return;let l=new Set;de(e,(c,p)=>{p.layerId!==void 0&&Yt(c,t)&&l.add(p.layerId)});let s=new Map(e.elements.map(c=>[c.payload.id,c])),h=c=>{let p=s.get(c);if(!p)return;let f=p.kind==="tap"&&p.payload.attachedTo!==void 0?s.get(p.payload.attachedTo)??p:p;return U(e,f.payload.groupId).at(-1)?.id},u=new Set;for(let c of l){let p=h(c);p!==void 0&&u.add(p)}let d=c=>{if(l.has(c))return!0;let p=s.get(c);if(p?.kind==="tap"&&p.payload.attachedTo!==void 0&&l.has(p.payload.attachedTo))return!0;let f=h(c);return f!==void 0&&u.has(f)};Hc(e,(c,p)=>{if(!(c.entityId!==r||p.kind==="named"||p.layerId===void 0||!d(p.layerId)))return{...a,domain:a.domain||a.entityId.split(".")[0]||""}})}function rm(e,t){let n=new Set;return de(e,(o,i)=>{i.layerId!==void 0&&Yt(o,t)&&n.add(i.layerId)}),e.elements.map(o=>o.payload.id).filter(o=>n.has(o))}function Ec(e,t){let n=new Set(e.values.map(i=>i.name.trim().toLowerCase())),o=t.trim()||"Value";if(!n.has(o.toLowerCase()))return o;for(let i=2;;i++){let r=`${o} ${i}`;if(!n.has(r.toLowerCase()))return r}}function am(e,t,n){let o={id:I(),name:Ec(e,n),value:{kind:structuredClone(t.kind)}},i={kind:{kind:"named",id:o.id}};return t.format&&!Re(t.format)&&(i.format=structuredClone(t.format)),{named:o,ref:i}}function Fc(e,t){if(t.kind.kind!=="named")return;let n=t.kind.id,o=e.values.find(a=>a.id.toUpperCase()===n.toUpperCase());if(!o)return;let i=t.format&&!Re(t.format)?t.format:o.value.format,r={kind:structuredClone(o.value.kind)};return i&&!Re(i)&&(r.format=structuredClone(i)),r}function sm(e,t){de(e,n=>{if(!Yt(n,t))return;let o=Fc(e,n);o&&(n.kind=o.kind,o.format?n.format=o.format:delete n.format)}),e.values=e.values.filter(n=>n.id.toUpperCase()!==t.toUpperCase())}function Hc(e,t){ae(e,{ref:t})}function lm(e,t){ae(e,{text:t})}function dm(e,t){let n=[],o={ref:(i,r)=>{i.entityId!==""&&n.push({entityId:i.entityId,ref:i,where:fi(r)})}};return t&&(o.text=(i,r)=>{for(let a of ho(i)){let l=a.split(".")[0]??"";t(a,l)&&n.push({entityId:a,ref:{entityId:a,displayName:"",domain:l},where:fi(r)})}return i}),ae(e,o),n}function cm(e,t,n){let o=c=>{switch(c.kind){case"control":return t.kind==="control";case"layer":case"image":case"tap":{if(t.kind!=="family")return!1;let p=e.elements.find(m=>m.payload.id===c.layerId);if(!p)return!1;let f=p.kind==="tap"&&p.payload.attachedTo!==void 0?e.elements.find(m=>m.payload.id===p.payload.attachedTo)??p:p;return Ar(e,t.family,f)}case"layout":case"rule":return t.kind==="family"&&c.family===t.family;case"documentTap":case"inline":return t.kind==="family";case"named":return!1}},i=new Set,r={value:(c,p)=>{c.kind.kind==="named"&&(o(p)||p.kind==="named"&&p.valueId!==void 0&&i.has(p.valueId))&&i.add(c.kind.id)}},a=-1;for(let c=0;c<4&&a!==i.size;c++)a=i.size,ae(e,r);let l=c=>o(c)||c.kind==="named"&&c.valueId!==void 0&&i.has(c.valueId),s=[],h=new Set,u=c=>{c===""||h.has(c)||(h.add(c),s.push(c))},d={ref:(c,p)=>{l(p)&&u(c.entityId)}};return n&&(d.text=(c,p)=>{if(l(p))for(let f of ho(c))n(f,f.split(".")[0]??"")&&u(f);return c}),ae(e,d),{entityIds:s,namedIds:[...i]}}function um(e,t,n,o=!0){let i=new Set,r=new Set,a=s=>{s.kind==="named"&&s.valueId!==void 0?r.add(s.valueId.toUpperCase()):s.layerId!==void 0&&i.add(s.layerId)},l={ref:(s,h)=>{s.entityId===t&&a(h)}};n&&(l.text=(s,h)=>{for(let u of ho(s))u===t&&n(u,u.split(".")[0]??"")&&a(h);return s}),ae(e,l);for(let s=o&&r.size>0;s;)s=!1,de(e,(h,u)=>{if(!(h.kind.kind!=="named"||!r.has(h.kind.id.toUpperCase())))if(u.kind==="named"&&u.valueId!==void 0){let d=u.valueId.toUpperCase();r.has(d)||(r.add(d),s=!0)}else u.layerId!==void 0&&i.add(u.layerId)});return Fr(e,i)}function pm(e,t){let n=new Set([t.toUpperCase()]),o=new Set;for(let i=!0;i;)i=!1,de(e,(r,a)=>{if(!(r.kind.kind!=="named"||!n.has(r.kind.id.toUpperCase())))if(a.kind==="named"&&a.valueId!==void 0){let l=a.valueId.toUpperCase();n.has(l)||(n.add(l),i=!0)}else a.layerId!==void 0&&o.add(a.layerId)});return Fr(e,o)}function Fr(e,t){let n=new Set;for(let o of e.elements)t.has(o.payload.id)&&n.add(R(e,o)&&o.kind==="tap"?o.payload.attachedTo:o.payload.id);return e.elements.map(o=>o.payload.id).filter(o=>n.has(o))}var Lc={text:["color","opacity","text","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],chartTimes:["opacity","rotation","visibility"],chartDots:["opacity","visibility"],chartGrid:["opacity","visibility"],imageTime:["opacity","rotation","visibility"],list:["opacity","rotation","visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]};function Ic(e){let t=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(t)?t:void 0}function Mc(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function Rc(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setFontDesign":return"design";case"setFontWidth":return"width";case"setItalic":return"italic";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function Pc(){return{id:I(),value:T(""),comparison:{kind:"isOn"}}}function $c(){return{id:I(),when:{join:"all",tests:[Pc()]},then:[]}}function hm(){return{id:I(),cases:[$c()]}}function gi(e,t){return e&&(e.kind.kind!=="literal"||Ic(e.kind.value)!==void 0)?e:T(t)}function fm(e,t){let n={kind:t};switch(Mc(t)){case"value":n.value=e.value??T("");break;case"between":n.value=e.value??T(""),n.upper=e.upper??T("");break;case"times":n.value=gi(e.value,"22:00"),n.upper=gi(e.upper,"06:00");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function mm(e){let t={kind:e};switch(Rc(e)){case"value":t.value=T(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"design":t.design="rounded";break;case"width":t.width="condensed";break;case"italic":t.italic=!0;break;case"none":break}return t}function Zt(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,o=0x100000001b3n,i=0xffffffffffffffffn;for(let r of t)n^=BigInt(r),n=n*o&i;return n.toString(16)}function Lr(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function Hr(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Nc(e,t,n=0){let o=t instanceof Map?t:Lr(t),i=e.kind;if(i.kind==="named"){if(n>8)return;let a=o.get(i.id.toUpperCase());return a?a.kind.kind==="named"?Nc(a,o,n+1):Hr(a.kind)?"n_"+i.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!Hr(i))return;let r=fo(i);if(r!==void 0)return"e_"+Zt(r)}function D(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Ir(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(n=>D(n.entityId)).join(", ")}])`;else{let{domains:n,areaIds:o,labelIds:i,floorIds:r}=e.scope;if(!(o.length+i.length+r.length>0))t=n.length===0?"[]":"("+n.map(l=>`(states.${l} | list)`).join(" + ")+")";else{let l=[];for(let s of o)l.push(`area_entities(${D(s)})`);for(let s of i)l.push(`label_entities(${D(s)})`);r.length>0&&l.push(`((${r.map(s=>`floor_areas(${D(s)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${l.join(" + ")})`,n.length>0&&(t+=` | selectattr('domain', 'in', [${n.map(D).join(", ")}])`),t+=")"}}return t}function Mr(e){return e?e.kind==="isOn"?" | selectattr('state', 'eq', 'on')":e.kind==="isOff"?" | selectattr('state', 'eq', 'off')":e.kind==="equals"?` | selectattr('state', 'eq', ${D(e.value)})`:` | rejectattr('state', 'eq', ${D(e.value)})`:""}function Oc(e){let t=Ir(e)+Mr(e.stateFilter);if(e.function==="count")return`(${t} | list | count)`;let n=e.attribute?`attributes.${e.attribute}`:"state",o=`${t} | map(attribute=${D(n)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${o} | sum)`;case"average":return`(${o} | average(0))`;case"min":return`(${o} | min(default=0))`;case"max":return`(${o} | max(default=0))`}}var Dc=" | rejectattr('state', 'in', ['unavailable', 'unknown'])";function Rr(e,t){let n=Ne(t);switch(e.kind){case"entities":{let o=e.stateFilter,i=o?.kind==="equals"&&(o.value==="unavailable"||o.value==="unknown"),r=(e.deviceClass??"").trim(),a=r===""?"":` | selectattr('attributes.device_class', 'eq', ${D(r)})`,l=`(${Ir(e)})${i?"":Dc}${a}${Mr(o)}`,s=e.attributes.map(d=>`, 'attr.${d}': s.attributes.get(${D(d)})`).join(""),h=e.descending?"true":"false",u=e.sort==="state"?`((ns.items | rejectattr('n', 'none') | sort(attribute='n', reverse=${h}) | list) + (ns.items | selectattr('n', 'none') | sort(attribute='state', reverse=${h}) | list))`:`(ns.items | sort(attribute='${e.sort==="lastChanged"?"lastChanged":"name"}', reverse=${h}) | list)`;return`{% set ns = namespace(items=[]) %}{% for s in ${l} %}{% set ns.items = ns.items + [{'entityId': s.entity_id, 'name': s.name[:120], 'state': s.state[:120], 'unit': s.attributes.get('unit_of_measurement'), 'domain': s.domain, 'deviceClass': s.attributes.get('device_class'), 'area': area_name(s.entity_id), 'lastChanged': (as_timestamp(s.last_changed) | round(0)), 'n': (s.state | float(none))${s}}] %}{% endfor %}{% set sorted = ${u} %}{{ {'items': sorted[:${n}], 'total': (sorted | count)} | to_json }}`}case"attribute":return`{% set a = state_attr(${D(e.entityId)}, ${D(e.attribute)}) %}{% if a is string or a is mapping or a is not iterable %}{% set a = [] %}{% endif %}{% set a = a | list %}{{ {'items': a[:${n}], 'total': (a | count)} | to_json }}`;case"template":{let o=e.value.trim();return o.length===0?void 0:o}default:return}}function bm(e,t){let n=Rr(e,t);return n===void 0?void 0:"e_"+Zt(n)}function zc(e){let t=n=>n.map(o=>o.entityId).filter(o=>o!=="");switch(e.kind){case"calendar":{let n=t(e.entities);return n.length===0?void 0:`calendar|${n.join(",")}|${e.hours}`}case"todo":{let n=t(e.entities);return n.length===0?void 0:`todo|${n.join(",")}|${e.status}|${e.sort}`}case"forecast":return e.entityId===""?void 0:`forecast|${e.entityId}|${e.type}`;default:return}}function Vc(e,t){let n=Ne(t),o=i=>i.map(r=>r.entityId).filter(r=>r!=="");switch(e.kind){case"calendar":{let i=o(e.entities);return i.length===0?void 0:{source:"calendar",entities:i,hours:e.hours,limit:n}}case"todo":{let i=o(e.entities);return i.length===0?void 0:{source:"todo",entities:i,status:e.status,sort:e.sort,limit:n}}case"forecast":return e.entityId===""?void 0:{source:"forecast",entity_id:e.entityId,type:e.type,limit:n};default:return}}function Wc(e){let t=[];for(let n of e.elements)n.kind==="list"&&t.push(n.payload);return t}function mo(e){let t=new Map;for(let n of Wc(e)){let o=zc(n.source),i=Vc(n.source,n.rows);if(o===void 0||i===void 0)continue;let r=t.get(o);r===void 0?t.set(o,i):i.limit>r.limit&&t.set(o,{...r,limit:i.limit})}return new Map([...t.entries()].sort(([n],[o])=>n<o?-1:n>o?1:0))}function fo(e){switch(e.kind){case"entityAttribute":return`state_attr(${D(e.entityId)}, ${D(e.attribute)})`;case"entityAge":{let t=D(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Oc(e.aggregate);default:return}}function Uc(e){let t=new Map,n=new Map,o=Lr(e.values),i=(s,h=0)=>{let u=s.kind;switch(u.kind){case"literal":case"dataAge":case"chartStat":case"item":case"listStat":case"imageTime":return;case"entityState":t.set(u.entityId,u);return;case"named":{if(h>8)return;let d=o.get(u.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){i(d,h+1);return}if(d.kind.kind==="entityState"){t.set(d.kind.entityId,d.kind);return}let c=fo(d.kind);if(c===void 0)return;n.set("n_"+u.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=fo(u);if(d===void 0)return;n.set("e_"+Zt(d),d)}}},r=s=>{let h=ze(s);if(h&&i(h),s.kind==="text")for(let u of s.payload.parts??[])i(u.value),u.icon&&i(u.icon);if(s.kind==="gauge"&&s.payload.total&&i(s.payload.total),s.kind==="gauge"&&s.payload.minSource&&i(s.payload.minSource),s.kind==="gauge"&&s.payload.maxSource&&i(s.payload.maxSource),s.kind==="chart"&&s.payload.nowIndex&&i(s.payload.nowIndex),s.kind==="icon"||s.kind==="shape"){let u=s.payload.level;u&&(i(u.value),u.minSource&&i(u.minSource),u.maxSource&&i(u.maxSource))}if(s.kind==="list"){let u=Rr(s.payload.source,s.payload.rows);u!==void 0&&n.set("e_"+Zt(u),u);for(let d of s.payload.template)r(d)}for(let u of pt(s.payload.rules))i(u)};for(let s of e.values)i({kind:{kind:"named",id:s.id}});for(let s of e.elements)r(s);for(let s of L){if(!e.supportedFamilies.includes(s))continue;let h=e.perFamily[s];if(h){h.bezelText&&i(h.bezelText),h.curvedText&&i(h.curvedText),h.bezelGauge&&(i(h.bezelGauge.value),h.bezelGauge.minLabel&&i(h.bezelGauge.minLabel),h.bezelGauge.maxLabel&&i(h.bezelGauge.maxLabel));for(let u of pt(h.rules))i(u)}}e.supportedFamilies.includes("inline")&&e.inline&&i(e.inline.value);let a=e.control;a&&(i(a.title),a.valueLabel&&i(a.valueLabel),a.state&&i(a.state),a.status&&i(a.status));let l={entities:t,expressions:n};return n.size>0&&(l.document=Bc(n)),l}function Bc(e){let t=[...e.keys()].sort(),n=[];for(let i of t){let r=e.get(i);r.includes("{{")||r.includes("{%")?n.push(`{% set v_${i} %}${r}{% endset %}`):n.push(`{% set v_${i} = ${r} %}`)}let o=t.map(i=>`"${i}": v_${i}`).join(", ");return n.push(`{{ { ${o} } | to_json }}`),n.join(`
`)}function xm(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,o=new Set;for(let[i,r]of Object.entries(t))r===null?o.add(i):n.set(i,Gc(r));return{values:n,nullKeys:o}}function Gc(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function wm(e){let t=Uc(e),n=[...t.entities.entries()].sort(([o],[i])=>o<i?-1:o>i?1:0).map(([,o])=>({kind:"entity",entityId:o.entityId,displayName:o.displayName,domain:o.domain,...o.iconName!==void 0?{iconName:o.iconName}:{}}));t.document&&n.push({kind:"template",value:t.document});for(let o of mo(e).values())n.push({kind:"list",...o});return n}var M="wrist_assistant/complications";async function Sm(e){return e.connection.sendMessagePromise({type:"wrist_assistant/gallery_key"})}async function Tm(e){return e.connection.sendMessagePromise({type:`${M}/parts_list`})}async function Am(e,t,n,o){let i={type:`${M}/parts_save`,name:t,text:n};return o!==void 0&&(i.part_id=o),e.connection.sendMessagePromise(i)}async function _m(e,t){return e.connection.sendMessagePromise({type:`${M}/parts_delete`,part_id:t})}async function Em(e,t,n,o={}){return e.connection.sendMessagePromise({type:"call_service",domain:t,service:n,service_data:o})}async function Fm(e){return e.connection.sendMessagePromise({type:`${M}/owners`})}async function Hm(e,t){return e.connection.sendMessagePromise({type:`${M}/list`,owner_watch_id:t})}async function Lm(e,t,n,o,i,r){return e.connection.sendMessagePromise({type:`${M}/preview_save`,owner_watch_id:t,complication_id:n,revision:o,png:i,meta:r})}async function Im(e,t,n,o){return e.connection.sendMessagePromise({type:`${M}/preview_get`,owner_watch_id:t,complication_id:n,revision:o})}async function Mm(e,t){return e.connection.sendMessagePromise({type:`${M}/nudge`,owner_watch_id:t})}async function Rm(e,t){return e.connection.sendMessagePromise({type:`${M}/watch_status`,owner_watch_id:t})}async function Pm(e,t,n){await e.connection.sendMessagePromise({type:"wrist_assistant/devices/rename",watch_id:t,name:n})}async function $m(e,t){return e.connection.sendMessagePromise({type:"wrist_assistant/devices/forget",watch_id:t,force:!0})}async function Nm(e,t,n,o){return e.connection.sendMessagePromise({type:`${M}/save`,owner_watch_id:t,document:n,base_revision:o})}async function Om(e,t,n,o){return e.connection.sendMessagePromise({type:`${M}/delete`,owner_watch_id:t,complication_id:n,base_revision:o})}async function Dm(e,t,n){return e.connection.sendMessagePromise({type:`${M}/history`,owner_watch_id:t,complication_id:n})}async function zm(e,t,n,o){return e.connection.sendMessagePromise({type:`${M}/history_get`,owner_watch_id:t,complication_id:n,revision:o})}async function Vm(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${M}/history_restore`,owner_watch_id:t,complication_id:n,revision:o,base_revision:i})}var ht="wrist_assistant/pair";async function Wm(e){return e.connection.sendMessagePromise({type:"config/auth/list"})}async function Um(e,t){return e.connection.sendMessagePromise({type:`${ht}/lookup`,code:t})}async function Bm(e,t,n,o={}){return e.connection.sendMessagePromise({type:`${ht}/confirm`,code:t,...n===void 0?{}:{user_id:n},...o.replace===!0?{replace:!0}:{},...o.allowRemote===!0?{allow_remote:!0}:{}})}async function Gm(e,t,n=!1){return e.connection.sendMessagePromise({type:`${ht}/offer`,...t===void 0?{}:{user_id:t},...n?{replace:!0}:{}})}async function jm(e,t){return e.connection.sendMessagePromise({type:`${ht}/offer_status`,offer_id:t})}async function Km(e,t){return e.connection.sendMessagePromise({type:`${ht}/offer_cancel`,offer_id:t})}var go="wrist_assistant/client_certificate";function yo(e){return e===void 0?{}:{user_id:e}}async function qm(e,t){return e.connection.sendMessagePromise({type:`${go}/status`,...yo(t)})}async function Jm(e,t,n,o){return e.connection.sendMessagePromise({type:`${go}/put`,pkcs12:t,passphrase:n,...yo(o)})}async function Xm(e,t){return e.connection.sendMessagePromise({type:`${go}/delete`,...yo(t)})}var Ce="wrist_assistant/watch_config";async function Ym(e,t,n){return e.connection.sendMessagePromise({type:`${Ce}/get`,owner_watch_id:t,kind:n})}async function Zm(e){return e.connection.sendMessagePromise({type:`${Ce}/summary`})}async function Qm(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${Ce}/save`,owner_watch_id:t,kind:n,base_revision:o,document:i})}async function eg(e,t,n){return e.connection.sendMessagePromise({type:`${Ce}/history`,owner_watch_id:t,kind:n})}async function tg(e,t,n,o){return e.connection.sendMessagePromise({type:`${Ce}/history_entry`,owner_watch_id:t,kind:n,revision:o})}async function ng(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${Ce}/restore`,owner_watch_id:t,kind:n,revision:o,base_revision:i})}function og(e,t,n){return e.connection.subscribeMessage(n,{type:`${Ce}/subscribe`,owner_watch_id:t})}var bo="wrist_assistant/http_actions";async function ig(e){return e.connection.sendMessagePromise({type:`${bo}/get`})}async function rg(e,t,n){return e.connection.sendMessagePromise({type:`${bo}/save`,base_revision:t,document:n})}async function ag(e,t,n,o){return e.connection.sendMessagePromise({type:`${bo}/test`,action:t,global_variables:n,values:o})}var xo="wrist_assistant/cameras";async function sg(e){return e.connection.sendMessagePromise({type:`${xo}/list`})}async function lg(e,t){return e.connection.sendMessagePromise({type:`${xo}/save`,...t})}async function dg(e,t,n,o){return e.connection.sendMessagePromise({type:`${xo}/test`,camera:t,...n===void 0?{}:{title:n},...o===void 0?{}:{message:o}})}async function cg(e,t){return e.connection.sendMessagePromise({type:"wrist_assistant/watch_voices/get",watch_id:t})}var Qt="wrist_assistant/page_images";async function ug(e){return e.connection.sendMessagePromise({type:`${Qt}/list`})}async function pg(e,t){return e.connection.sendMessagePromise({type:`${Qt}/get`,image_id:t})}async function hg(e,t){return e.connection.sendMessagePromise({type:`${Qt}/upload`,data:t})}async function fg(e,t){return e.connection.sendMessagePromise({type:`${Qt}/delete`,image_id:t})}async function mg(e,t,n){return e.connection.sendMessagePromise({type:`${M}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function gg(e,t,n){let o={type:`${M}/subscribe`};return t&&(o.owner_watch_id=t),e.connection.subscribeMessage(n,o)}async function yg(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${M}/render_values`,templates:t})).results}async function bg(e,t){return e.connection.sendMessagePromise({type:"config_entries/get",domain:t})}async function xg(e){return e.connection.sendMessagePromise({type:"cloud/status"})}async function wg(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${M}/history_series`,requests:t})).results}function jc(e){return{entity_id:e.entityId,minutes:e.minutes,points:e.points,...e.mode==="states"?{mode:"states"}:{},...e.gaps?{gaps:!0}:{},...e.entities!==void 0&&e.entities.length>0?{entities:[...e.entities],combine:e.combine??"any"}:{}}}function Kc(e){return{entity_id:e.entityId,minutes:e.minutes,period:e.period,type:e.type,...e.gaps?{gaps:!0}:{}}}function vg(e){let t=new Map,n=new Map;for(let[o,i]of Object.entries(e))i.ok&&(t.set(o,i.series),typeof i.readings=="number"&&n.set(o,{readings:i.readings,averaged:i.averaged===!0}));return{series:t,readings:n}}async function kg(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${M}/statistics_series`,requests:t})).results}async function Cg(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${M}/list_items`,requests:t})).results}function Sg(e){let t={};for(let[n,o]of mo(e))t[n]=o;return{requests:t,signature:JSON.stringify(t)}}function Tg(e){let t=new Map;for(let[n,o]of Object.entries(e))o.ok&&t.set(n,JSON.stringify({items:o.items,total:o.total}));return t}function Ag(e,t=()=>!0){let n={};for(let i of Jn(e))t(i.entityId)&&(n[i.key]=jc(i));let o={};for(let i of Xn(e))t(i.entityId)&&(o[i.key]=Kc(i));return{history:n,statistics:o,signature:JSON.stringify([n,o])}}var Eg={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",list:"#c0ca33",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},Fg={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",list:"List",shape:"Shape",image:"Picture",tap:"Tap zone",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},Hg=["text","icon","gauge","chart","timeline","list","shape","image","tap"],Lg={content:"var(--wa-hue-blue)",look:"var(--wa-hue-green)",numbers:"var(--wa-hue-orange)",position:"var(--wa-hue-pink)",states:"var(--wa-hue-yellow)",tap:"var(--wa-hue-red)",home:"var(--wa-hue-blue)",place:"var(--wa-hue-grey)",complication:"var(--wa-hue-blue)",group:"var(--wa-hue-green)",locked:"var(--wa-hue-red)"},en={pages:"var(--wa-hue-blue)",layers:"var(--wa-hue-green)",values:"var(--wa-hue-red)"};function qc(e){switch(e){case"text":return b`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return b`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return b`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return b`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return b`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return b`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return b`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"list":return b`<circle cx="5.5" cy="7" r="1.6" /><circle cx="5.5" cy="12" r="1.6" /><circle cx="5.5" cy="17" r="1.6" /><path d="M10 7H19M10 12H19M10 17H19" />`;case"chartDots":return b`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":case"menu":return b`<path d="M4 7H20M4 12H20M4 17H20" />`;case"note":return b`<path d="M14 3.5H7A2 2 0 0 0 5 5.5V18.5A2 2 0 0 0 7 20.5H17A2 2 0 0 0 19 18.5V8.5Z" /><path d="M14 3.5V8.5H19" /><path d="M8.5 13H15.5M8.5 16.5H13" />`;case"chartTimes":case"imageTime":case"clock":return b`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return b`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return b`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return b`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"radial":return b`<circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="4.5" r="1.8" /><circle cx="19.5" cy="12" r="1.8" /><circle cx="12" cy="19.5" r="1.8" /><circle cx="4.5" cy="12" r="1.8" /><circle cx="17.3" cy="6.7" r="1.4" /><circle cx="6.7" cy="17.3" r="1.4" />`;case"pages":return b`<rect x="3" y="7" width="12" height="13" rx="2" /><path d="M8 4h11a2 2 0 0 1 2 2v11" />`;case"grip":return b`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return b`<path d="M6 9L12 15L18 9" />`;case"plus":return b`<path d="M12 5V19M5 12H19" />`;case"braces":return b`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return b`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"info":return b`<circle cx="12" cy="12" r="8.5" /><path d="M12 11V16.5" /><path d="M12 7.6V7.8" />`;case"globe":return b`<circle cx="12" cy="12" r="8.5" /><path d="M3.5 12H20.5" /><path d="M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17" />`;case"download":return b`<path d="M12 4V15" /><path d="M7 10L12 15L17 10" /><path d="M5 20H19" />`;case"check":return b`<path d="M5 12.5L9.5 17L19 7.5" />`;case"arrow":return b`<path d="M5 12H19" /><path d="M13 6L19 12L13 18" />`;case"guides":return b`<path d="M12 3V21" /><rect x="4" y="6" width="8" height="4.5" rx="1.3" /><rect x="12" y="13.5" width="8" height="4.5" rx="1.3" />`;case"paste":return b`<rect x="6" y="4.5" width="12" height="16" rx="2" /><path d="M9 4.5V3.5H15V4.5" /><path d="M9 11H15M9 15H13" />`;case"watch":return b`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"phone":return b`<rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M10.5 5.5H13.5" />`;case"qr":return b`<rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14H16.5V16.5M20 14V14.01M14 20H14.01M17.5 20H20V17.5" />`;case"keyboard":return b`<rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10H6.51M10 10H10.01M14 10H14.01M17.5 10H17.51M8 14.5H16" />`;case"foldAll":return b`<path d="M4 12H20M8.5 3.5L12 7L15.5 3.5M8.5 20.5L12 17L15.5 20.5" />`;case"unfoldAll":return b`<path d="M4 12H20M8.5 7L12 3.5L15.5 7M8.5 17L12 20.5L15.5 17" />`;case"compact":return b`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return b`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"grid":return b`<rect x="3.5" y="4" width="7.5" height="7" rx="1.6" /><rect x="13" y="4" width="7.5" height="7" rx="1.6" /><rect x="3.5" y="13" width="7.5" height="7" rx="1.6" /><rect x="13" y="13" width="7.5" height="7" rx="1.6" />`;case"lock":return b`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return b`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return b`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return b`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return b`<path d="M6 14L12 8L18 14" />`;case"down":return b`<path d="M6 10L12 16L18 10" />`;case"left":return b`<path d="M14 6L8 12L14 18" />`;case"right":return b`<path d="M10 6L16 12L10 18" />`;case"show":return b`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return b`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return b`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return b`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return b`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return b`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return b`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return b`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return b`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return b`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`;case"checklist":return b`<rect x="3" y="4" width="7" height="7" rx="1.8" /><path d="M4.9 7.4L6.3 8.8L8.4 6.4" />
        <rect x="3" y="13" width="7" height="7" rx="1.8" /><path d="M4.9 16.4L6.3 17.8L8.4 15.4" />
        <path d="M13.5 7.5H21M13.5 16.5H21" />`;case"home":return b`<path d="M4 11.5L12 4.5L20 11.5" /><path d="M6.5 9.5V19.5H17.5V9.5" /><path d="M10.2 19.5V14.8H13.8V19.5" />`;case"thumbSmall":return b`<rect x="3" y="9" width="6" height="6" rx="1.5" /><path d="M12.5 12H21" />`;case"thumbMedium":return b`<rect x="3" y="6.5" width="10" height="11" rx="2" /><path d="M16.5 12H21" />`;case"thumbLarge":return b`<rect x="3" y="4" width="14" height="16" rx="2.5" /><path d="M19.5 12H21" />`;case"alignLeft":return b`<path d="M4 3V21" /><rect x="8" y="6" width="11" height="4" rx="1" /><rect x="8" y="14" width="6" height="4" rx="1" />`;case"alignCenterX":return b`<path d="M12 3V6M12 10V14M12 18V21" /><rect x="5" y="6" width="14" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" />`;case"alignRight":return b`<path d="M20 3V21" /><rect x="5" y="6" width="11" height="4" rx="1" /><rect x="10" y="14" width="6" height="4" rx="1" />`;case"alignTop":return b`<path d="M3 4H21" /><rect x="6" y="8" width="4" height="11" rx="1" /><rect x="14" y="8" width="4" height="6" rx="1" />`;case"alignCenterY":return b`<path d="M3 12H6M10 12H14M18 12H21" /><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="8" width="4" height="8" rx="1" />`;case"alignBottom":return b`<path d="M3 20H21" /><rect x="6" y="5" width="4" height="11" rx="1" /><rect x="14" y="10" width="4" height="6" rx="1" />`;case"alignCenter":return b`<rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M12 3V7M12 17V21M3 12H7M17 12H21" />`;case"mic":return b`<rect x="9" y="3.5" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" /><path d="M12 18V20.5" />`;case"sliders":return b`<path d="M4 8H11M15 8H20M4 16H7M11 16H20" /><circle cx="13" cy="8" r="2" /><circle cx="9" cy="16" r="2" />`;case"more":return b`<circle cx="6" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="18" cy="12" r="1.3" />`}}function Pr(e){return $`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${qc(e)}</svg>`}var $r=C`
      background:
        linear-gradient(var(--lo-fill), var(--lo-fill)) padding-box,
        linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 33%, transparent) 30%,
          var(--lo-mid) 62%, color-mix(in srgb, var(--c) 25%, transparent) 100%) border-box;
      border: 1.5px solid transparent;
`,Se=C`
      background: var(--lo-fill);
      border: 1px solid color-mix(in srgb, var(--c) 60%, var(--wa-card));
`,Nr=C`
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
      ${Se}
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
    /* After a save: where it has got to, one line. Amber when the reader has
       to do something (open the watch app). It stays when the bar stacks,
       on the second row, since on a phone it is the only place it is said. */
    .tb-after {
      font-size: 12px; color: var(--wa-muted); white-space: nowrap; padding: 0 4px;
      min-width: 0; max-width: 340px; overflow: hidden; text-overflow: ellipsis;
    }
    .tb-after.warn { color: var(--wa-amber); font-weight: 500; }
    header.stacked > .tb-after, .wa-bar.stacked > .tb-after { order: 2; }
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
`,Or=C`
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
`,Dr=C`
    button.help {
      font: inherit; font-size: 13px; font-weight: 600; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
      display: inline-grid; place-items: center; padding: 0;
      border: 0; background: var(--wa-card); color: var(--wa-ink);
      transition: background-color .12s ease-out, color .12s ease-out;
    }
    button.help:hover { background: var(--wa-hover); color: var(--wa-ink); }
    button.help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,zr=C`
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
`,Vr=C`
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
`,Wr=C`
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
`,Ur=C`
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
`,Br=C`
    /* Left column cards: Pages, Layers and Shared values. Each wears its hue
       in three places only: the lit outline, the filled chip behind its title
       glyph, and nothing else in it. The fill is the plain card. */
    .card.lc {
      --c: var(--wa-accent); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
      padding: 0; border-radius: var(--wa-lc-r); box-shadow: none;
      ${$r}
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
      ${Se}
    }
    button.lc-btn:hover:not(:disabled) { --lo-fill: var(--wa-hover); ${Se} }
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
`,Gr=C`
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
`,jr=C`
    /* Background: its caption where a layer's badges sit. */
    .layer.pinned .ground-cap { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .layer.pinned.ground .grip { visibility: hidden; }
`,Kr=C`
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
`,qr=C`
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
`,Jr=C`
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
`,Xr=C`
    .tint-dot {
      display: inline-block; flex: none; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: -1px;
      background: var(--sw); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ink) 45%, transparent);
    }
    button.case-pick .tint-dot { margin-right: 0; }
    .tint-dot.full { background: conic-gradient(#FF453A 0 25%, #FFD60A 0 50%, #30D158 0 75%, #0A84FF 0); }
`,Yr=C`
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
`,Og=C`
      /* A see-through Background's checkerboard (.layer .thumb.clear). */
      --wa-dark-check-a: #2a2a2e;
      --wa-dark-check-b: #1a1a1d;
`,Dg=C`
    /* Canvas column: quiet header, tool strip, zoomable stage, values bar, first run. */
    /* The left cards' hues: Pages blue, Layers green, Shared values red
       (LEFT_CARD_COLOR in kinds.ts), from the palette the panel sets. */
    :host, .wa-chrome {
      --wa-lc-pages: ${Te(en.pages)};
      --wa-lc-layers: ${Te(en.layers)};
      --wa-lc-values: ${Te(en.values)};
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
`,Zr=C`
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
      ${Se}
    }
    .add-tool > button.cv-act:hover:not(:disabled), .add-tool > button.cv-act[aria-expanded="true"] { --lo-fill: var(--wa-hover); ${Se} }
    button.cv-act .caret { display: inline-flex; margin-right: -3px; color: var(--wa-hint); }
    button.cv-act .caret svg { width: 11px; height: 11px; }
`,Qr=C`
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
`,ea=C`
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
`,ta=C`
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
`,na=C`
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
`,Jc=C`
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
`,oa=C`
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
`,ia=C`
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
`,ra=C`
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
      ${$r}
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
`,aa=C`
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
      ${Se}
    }
    .sec-h button.sec-act:hover:not(:disabled) { --lo-fill: var(--wa-hover); ${Se} }
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
`,zg={topBar:Nr,picker:Or,helpButton:Dr,columns:zr,card:Vr,rows:Wr,rowsTail:Ur,leftCards:Br,leftCardsTail:Gr,groundCap:jr,richRows:Kr,canvasColumn:qr,popMenu:Jr,tintDot:Xr,sharedValueRows:Yr,canvasHead:Zr,canvasHeadTail:Qr,stage:ea,stageTools:ta,stageToolsTail:na,valuesFoot:oa,inspectorHead:ia,sectionCard:ra,sectionCardTail:aa},Vg=C`${Nr}${Or}${Dr}`,Wg=C`${zr}${Vr}`,Ug=C`${Br}${Gr}${Jr}`,Bg=C`${Wr}${Ur}${jr}${Kr}${Yr}`,Gg=C`${qr}${Xr}${Zr}${Qr}${ea}${ta}${na}${oa}${Jc}`,jg=C`${ia}${ra}${aa}`;function Kg(e,t){let{open:n,onToggle:o}=e;return $`<section class="sec" data-sec=${e.id??F} data-open=${n?"true":"false"} data-help="on" style=${`--c:${e.color}`}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${n?"true":"false"} @click=${o}
      @keydown=${i=>{i.target===i.currentTarget&&(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),o())}}>
      <span class="swatch">${e.icon}</span>
      <span class="tt"><h4>${e.title}${e.dot?$`<span class="sec-dot" aria-hidden="true"></span>`:F}</h4>${e.summary?$`<span class="sum">${e.summary}</span>`:F}</span>
      <span class="chev">${Pr("chevron")}</span>
    </div>
    ${n?$`<div class="sec-b">${e.help?$`<p class="hint">${e.help}</p>`:F}${t}</div>`:F}
  </section>`}function Xg(e,t,n){let o=n-t,i=o>0&&Number.isFinite(e)?(e-t)/o:0;return`--p:${Math.round(Math.max(0,Math.min(1,i))*1e3)/10}%`}var Xc=C`
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
`,Yc=C`
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
`,Zc=C`
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
`,Qc=C`
    button.link { font: inherit; background: none; border: none; color: var(--wa-accent); cursor: pointer; padding: 0; }
    /* A watch editor's "Start fresh instead" while the iPhone's move may
       still come: small and quiet, under the waiting line. */
    button.link.start-fresh { align-self: flex-start; font-size: 13px; color: var(--wa-muted); text-decoration: underline; text-underline-offset: 2px; }
    button.link.start-fresh:hover:not(:disabled) { color: var(--wa-label, var(--wa-muted)); }
    button.link.start-fresh:disabled { opacity: 0.5; cursor: default; }
`,eu=C`
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
`,tu=C`
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
    /* The Auto refresh warning: its one amber line and a Why? button on the
       same row, and the reasons under them, in plain muted text, once opened. */
    .budget-why { margin: 4px 0; min-width: 0; }
    .budget-why > summary {
      display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; cursor: pointer; list-style: none;
    }
    .budget-why > summary::-webkit-details-marker { display: none; }
    .budget-why > summary > .hint { margin: 0; flex: 0 1 auto; min-width: 0; overflow-wrap: anywhere; }
    .budget-why > summary:focus-visible { outline: none; }
    .budget-why > summary:focus-visible > .why-btn { box-shadow: var(--wa-ring); }
    .why-btn {
      display: inline-flex; align-items: center; flex: none; box-sizing: border-box; min-height: 20px; padding: 0 7px;
      border-radius: 5px; font-size: 11.5px; font-weight: 600; line-height: 1;
      color: var(--wa-ink); background: var(--wa-field); border: 1px solid var(--wa-line-strong);
    }
    .budget-why > summary:hover > .why-btn, .budget-why[open] > summary > .why-btn { background: var(--wa-hover); }
    .budget-why > .hint { margin: 6px 0 0; overflow-wrap: anywhere; }
    /* The bare .err rule sits above .hint in this sheet, so a hint that is an
       error needs both class names to win the color. */
    .hint.err { color: var(--error-color, #db4437); }
`,nu=C`
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

    /* Icon field, drawn the way Home Assistant draws its own: a box showing
       the chosen glyph and its name, with a caret, and a list that drops
       open under it. The list spans the whole row, label column included,
       and sits in the flow rather than floating, so no card or popover can
       cut it off. The box is the height of a text box, so the label beside
       it and the rows under it never move when one swaps for the other. */
    .field.sym-field.no-label { grid-template-columns: minmax(0, 1fr); }
    .sym-line-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .sym-box {
      flex: 1; min-width: 0; display: flex; align-items: center; height: 30px; border-radius: 7px;
      background: var(--wa-field); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
      transition: box-shadow .12s ease-out;
    }
    .sym-box:hover { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .sym-box.open { box-shadow: inset 0 0 0 1px var(--wa-accent), var(--wa-ring); }
    button.sym-pick {
      flex: 1; min-width: 0; height: 100%; display: flex; align-items: center; gap: 8px;
      font: inherit; font-size: 12.5px; text-align: left; padding: 0 8px 0 4px; border: 0; border-radius: 7px;
      background: none; color: var(--wa-ink); cursor: pointer;
    }
    button.sym-pick:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .sym-now {
      flex: none; width: 22px; height: 22px; border-radius: 5px; display: grid; place-items: center;
      background: color-mix(in srgb, var(--wa-ink) 9%, transparent); color: var(--wa-ink);
    }
    .sym-now svg { width: 16px; height: 16px; display: block; }
    .sym-now svg path { fill: currentColor; fill-opacity: 1; }
    .sym-now.none { color: var(--wa-muted); }
    /* The icon's own color, when one is chosen, on the glyph in the box and on
       every glyph in the list, so the pick is seen the way the watch draws it. */
    .sym-field.tinted .sym-now:not(.none), .sym-field.tinted .sym-glyph { color: var(--sym-tint); }
    .sym-field.tinted button.sym .sym-glyph { opacity: 1; }
    .sym-now.none svg.ui-icon { width: 13px; height: 13px; }
    .sym-now.none svg.ui-icon path { fill: none; }
    .sym-now-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sym-now-name.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .sym-now-name.empty { color: var(--wa-muted); }
    .sym-caret { flex: none; display: grid; place-items: center; color: var(--wa-muted); transition: transform .12s ease-out; }
    .sym-caret svg { width: 13px; height: 13px; display: block; }
    .sym-box.open .sym-caret { transform: rotate(180deg); color: var(--wa-accent); }
    button.sym-clear {
      flex: none; width: 24px; height: 24px; margin-right: 3px; display: grid; place-items: center;
      padding: 0; border: none; border-radius: 5px; background: none; color: var(--wa-muted); cursor: pointer;
    }
    button.small.sym-source { flex: none; height: 30px; padding: 0 10px; font-size: 12px; white-space: nowrap; }
    button.sym-clear:hover { background: var(--wa-panel); color: var(--wa-ink); }
    button.sym-clear svg { width: 12px; height: 12px; display: block; }
    .sym-field > .sym-menu {
      grid-column: 1 / -1; margin: 2px 0 4px; padding: 8px; border-radius: 10px;
      border: 1px solid var(--wa-line-strong, var(--wa-line)); background: var(--wa-raised, var(--wa-card));
      box-shadow: 0 10px 28px rgba(0,0,0,.22);
    }
    /* One row per icon in the list: the glyph, then its name, like Home
       Assistant's own list. The picked one wears the card's hue. */
    .sym-list { display: flex; flex-direction: column; gap: 1px; }
    .sym-list + .sym-list { margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--wa-line); }
    /* The well's own frame would be a box in a box inside the dropdown. */
    .sym-menu .sym-well { padding: 2px; border: 0; border-radius: 0; background: none; box-shadow: none; }
    button.sym.sym-line {
      aspect-ratio: auto; justify-content: flex-start; gap: 12px; width: 100%; min-height: 34px; padding: 4px 8px;
      font: inherit; text-align: left;
    }
    button.sym.sym-line .sym-glyph { flex: none; }
    .sym-line-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
    button.sym.sym-line:active { transform: none; }
    /* The browser: a search bar, then a framed well that scrolls, then a
       quiet count. Tiles are glyphs only, square, and the picked one wears
       the hue of the card it is in (--wa-sec), like the card's other marks. */
    .sym-browse { --sym-hi: var(--wa-sec, var(--wa-ink)); display: flex; flex-direction: column; gap: 8px; margin: 4px 0 6px; min-width: 0; }
    .sym-bar { display: flex; gap: 6px; min-width: 0; }
    .sym-search { position: relative; flex: 1; min-width: 0; display: flex; align-items: center; }
    .sym-search > svg { position: absolute; left: 9px; width: 14px; height: 14px; color: var(--wa-muted); pointer-events: none; }
    .sym-search > input[type=search] {
      width: 100%; min-width: 0; height: 32px; box-sizing: border-box; padding: 0 10px 0 29px; border-radius: 9px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 12.5px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .sym-search > input[type=search]:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .sym-search > input[type=search]::placeholder { color: var(--wa-muted); }
    .sym-bar > select.sym-set { flex: none; max-width: 46%; height: 32px; border-radius: 9px; font-size: 12.5px; }
    .sym-well {
      position: relative; max-height: 320px; overflow-y: auto; overscroll-behavior: contain;
      padding: 8px; border-radius: 12px; border: 1px solid var(--wa-line);
      background: color-mix(in srgb, var(--wa-panel) 55%, transparent);
      box-shadow: inset 0 1px 2px color-mix(in srgb, #000 18%, transparent);
      scrollbar-width: thin; scrollbar-color: var(--wa-line-strong) transparent;
    }
    .sym-sec {
      font-size: 10px; font-weight: 650; letter-spacing: .07em; text-transform: uppercase; color: var(--wa-muted);
      padding: 2px 4px 6px;
    }
    .sym-sec:not(:first-child) { margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
    .sym-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 3px; }
    /* One line of recents, cut to what fits rather than scrolled sideways:
       every row past the first is zero tall and clipped. */
    .sym-grid.recent { grid-template-rows: auto; grid-auto-rows: 0; row-gap: 0; overflow: hidden; }
    .sym-well.named .sym-grid { grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); }
    button.sym {
      display: flex; align-items: center; justify-content: center; aspect-ratio: 1; min-width: 0; padding: 0; margin: 0;
      background: transparent; border: 0; border-radius: 9px; cursor: pointer; color: var(--wa-ink);
      transition: background-color .1s ease-out, box-shadow .1s ease-out, transform .1s ease-out;
    }
    .sym-well.named button.sym { aspect-ratio: auto; min-height: 34px; padding: 4px 6px; }
    button.sym .sym-glyph { opacity: .78; transition: opacity .1s ease-out; }
    button.sym:hover { background: var(--wa-hover); }
    button.sym:hover .sym-glyph, button.sym.on .sym-glyph { opacity: 1; }
    button.sym:active { transform: scale(.94); }
    button.sym:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.sym.on {
      background: color-mix(in srgb, var(--sym-hi) 20%, transparent);
      box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--sym-hi) 80%, transparent);
    }
    .sym-glyph { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; }
    .sym-glyph svg { width: 20px; height: 20px; }
    .sym-glyph svg path { fill: currentColor; fill-opacity: 1; }
    .sym-count { font-size: 11px; color: var(--wa-muted); margin: -2px 2px 0; }
    .sym-name { font-size: 10px; line-height: 1.15; text-align: center; opacity: .85; overflow-wrap: anywhere; max-height: 24px; overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { button.sym, button.sym .sym-glyph { transition: none; } button.sym:active { transform: none; } }
`,ou=C`
    @media (prefers-reduced-motion: reduce) { .ent-box.needs { animation: none; } }
`,Yg=[Xc,Yc,Zc,Qc,eu,tu,nu,ou];var la="2.8.0";var da="2.8.0",Qg="2.8.0",ca="2.8.0";function iu(e,t=ca){if(t===null)return!1;let n=Y(t);if(!n)return!1;let o=Y(e);return o?tn(o,n)>=0:!0}function ey(e,t=ca){return ua(e)?!0:iu(e?.app_version,t)}var ru="library";function ua(e){return e?.device_kind==="library"||e?.owner_watch_id===ru}function ft(e){return ua(e)?"library":e?.device_kind==="iphone"?"iphone":"watch"}function ty(e){let t=ft(e);return t==="library"?"Not on a device list":t==="iphone"?"iPhone":"watch"}function Y(e){if(typeof e!="string")return;let t=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(t)return[Number(t[1]),Number(t[2]),Number(t[3]??0)]}function tn(e,t){for(let n=0;n<3;n++)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return 0}function sa(e,t=la){let n=Y(e),o=Y(t);return!n||!o?!1:tn(n,o)>=0}function ny(e,t=null){if(t===null)return;let n=Y(e),o=Y(t);return!n||!o||tn(n,o)>=0?void 0:`Needs Wrist Assistant ${o[2]===0?`${o[0]}.${o[1]}`:o.join(".")} or later on your watch.`}var au="3.0.0";function pa(e){let t=Y(e);if(!t)return e;let n=Y(au),o=tn(t,n)<0?n:t;return o[2]===0?`${o[0]}.${o[1]}`:o.join(".")}function su(e,t=la){return`${Y(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The editor needs ${pa(t)} or later. Update Wrist Assistant on your iPhone; the watch app updates with it.`}function lu(e,t=da){return`${Y(e)?`This iPhone runs Wrist Assistant ${e}.`:"This iPhone has not reported its Wrist Assistant version yet."} Lock Screen and Home Screen complications need ${pa(t)} or later. Update Wrist Assistant on your iPhone.`}function oy(e){let t=ft(e);return t==="library"?!0:t==="iphone"?sa(e?.app_version,da):sa(e?.app_version)}function iy(e){let t=ft(e);return t==="library"?"":t==="iphone"?lu(e?.app_version):su(e?.app_version)}var ha={version:1,sections:[{id:"connection",title:"Connection",settings:[{key:"serverMode",type:"enum",label:"Where to connect",help:"Auto uses your home Wi-Fi when you are home and the internet when you are out. Leave it on Auto unless something is wrong.",default:"Auto",options:[{value:"Auto",label:"Auto"},{value:"Local",label:"Home only"},{value:"Remote",label:"Away only"}]},{key:"deltaTimeout",type:"enum",label:"Wait for updates",help:"How long the watch keeps a request open while it waits for changes. Longer uses less battery.",default:"45s",options:[{value:"25s",label:"25s"},{value:"35s",label:"35s"},{value:"45s",label:"45s"},{value:"55s",label:"55s"}]}]},{id:"gestures",title:"Gestures",settings:[{key:"handGestureAction",type:"enum",label:"Double pinch",help:"Tap your thumb and finger together twice. Jump to a room uses the Double pinch trigger in Rooms. Switch home needs two or more homes on this watch.",default:"Refresh",options:[{value:"Disabled",label:"Nothing"},{value:"Point Control",label:"Toggle what you point at"},{value:"Activate Scene",label:"Turn on a scene"},{value:"Run Script",label:"Run a script"},{value:"Next Page",label:"Next page"},{value:"Previous Page",label:"Previous page"},{value:"Room Jump",label:"Jump to a room"},{value:"Toggle First Tile",label:"Toggle the first tile"},{value:"Refresh",label:"Refresh the page"},{value:"Switch Instance",label:"Switch home"}]},{key:"handGestureSceneTargetId",type:"entity",domain:"scene",label:"Scene",help:"The scene a double pinch turns on. With none, it turns on the scene you point at.",default:"",showIf:{key:"handGestureAction",equals:"Activate Scene"}},{key:"handGestureScriptTargetId",type:"entity",domain:"script",label:"Script",help:"The script a double pinch runs. With none, it runs the script you point at.",default:"",showIf:{key:"handGestureAction",equals:"Run Script"}},{key:"topSectionDoubleTapAction",type:"enum",label:"Double-tap the page title",help:"Tap the name at the top of a page twice. Switch home needs two or more homes on this watch.",default:"Disabled",options:[{value:"Disabled",label:"Nothing"},{value:"Toggle Aimed Entity (Point Control)",label:"Toggle what you point at"},{value:"Room Jump",label:"Jump to a room"},{value:"Activate Scene",label:"Turn on a scene"},{value:"Run Script",label:"Run a script"},{value:"Refresh",label:"Refresh the page"},{value:"Next Page",label:"Next page"},{value:"Previous Page",label:"Previous page"},{value:"Toggle First Tile",label:"Toggle the first tile"},{value:"Switch Instance",label:"Switch home"}]},{key:"topSectionDoubleTapSceneTargetId",type:"entity",domain:"scene",label:"Scene",help:"The scene a double-tap turns on.",default:"",showIf:{key:"topSectionDoubleTapAction",equals:"Activate Scene"}},{key:"topSectionDoubleTapScriptTargetId",type:"entity",domain:"script",label:"Script",help:"The script a double-tap runs.",default:"",showIf:{key:"topSectionDoubleTapAction",equals:"Run Script"}},{key:"pullDownAction",type:"enum",label:"Pull down from the top",help:"Drag down from the top of a page.",default:"Refresh",options:[{value:"Disabled",label:"Nothing"},{value:"Refresh",label:"Refresh the page"},{value:"Next Page",label:"Next page"},{value:"Previous Page",label:"Previous page"},{value:"Room Jump",label:"Jump to a room"},{value:"Activate Scene",label:"Turn on a scene"},{value:"Run Script",label:"Run a script"},{value:"Toggle First Tile",label:"Toggle the first tile"}]},{key:"pullDownSceneTargetId",type:"entity",domain:"scene",label:"Scene",help:"The scene a pull down turns on.",default:"",showIf:{key:"pullDownAction",equals:"Activate Scene"}},{key:"pullDownScriptTargetId",type:"entity",domain:"script",label:"Script",help:"The script a pull down runs.",default:"",showIf:{key:"pullDownAction",equals:"Run Script"}},{key:"longPressDuration",type:"enum",label:"Hold time",help:"How long you press a tile before its extra options open.",default:"Short",options:[{value:"Super Fast",label:"Very short (75 ms)"},{value:"Short",label:"Short (150 ms)"},{value:"Normal",label:"Normal (200 ms)"},{value:"Long",label:"Long (300 ms)"},{value:"Extra Long",label:"Very long (1 s)"}]},{key:"entityRadialVerticalQuickRadialGestureEnabled",type:"bool",label:"Quick menu gesture",help:"Inside a control's ring menu, a fast gesture opens the quick menu.",default:!0},{key:"entityRadialVerticalQuickRadialGestureTrigger",type:"enum",label:"Gesture",help:"The movement that opens the quick menu.",default:"Swipe Up/Down",options:[{value:"Up/Down x2",label:"Up and down twice"},{value:"Swipe Up/Down",label:"Swipe and back"},{value:"Clockwise",label:"Circle"}],showIf:{key:"entityRadialVerticalQuickRadialGestureEnabled",equals:!0}},{key:"entityRadialVerticalQuickRadialGestureSpeed",type:"enum",label:"Gesture speed",help:"How fast you must finish the gesture.",default:"Fast",options:[{value:"Fast",label:"Fast"},{value:"Normal",label:"Normal"},{value:"Slow",label:"Slow"},{value:"Very Slow",label:"Very slow"}],showIf:{key:"entityRadialVerticalQuickRadialGestureEnabled",equals:!0}}]},{id:"motion",title:"Wrist twists",settings:[{key:"motionGestureSensitivity",type:"enum",label:"Wrist twists",help:"Twist your wrist quickly to run an action. High reacts to gentler twists.",default:"Off",options:[{value:"Off",label:"Off"},{value:"Low",label:"Low"},{value:"Medium",label:"Medium"},{value:"High",label:"High"}]},{key:"motionGestureSensitivityLevel",type:"number",label:"Fine tune",help:"From 1, a firm twist, to 10, a gentle one. Low, Medium and High set 4, 6 and 8.",default:4,min:1,max:10,step:.5,showIf:{key:"motionGestureSensitivity",notEquals:"Off"}},{key:"motionGestureActionsJSON",type:"motionGestures",label:"What each twist does",help:"A scene or script with none picked uses the one you point at.",default:"",gestures:[{value:"Twist Clockwise",label:"Twist clockwise"},{value:"Twist Counter-Clockwise",label:"Twist counterclockwise"}],options:[{value:"Disabled",label:"Nothing"},{value:"Toggle Aimed Entity",label:"Toggle what you point at"},{value:"Run Script",label:"Run a script"},{value:"Activate Scene",label:"Turn on a scene"},{value:"Refresh",label:"Refresh the page"},{value:"Next Page",label:"Next page"},{value:"Previous Page",label:"Previous page"},{value:"Toggle First Tile",label:"Toggle the first tile"}],sceneKey:"motionGestureSceneTargetsJSON",scriptKey:"motionGestureScriptTargetsJSON",showIf:{key:"motionGestureSensitivity",notEquals:"Off"}}]},{id:"navigation",title:"Pages",settings:[{key:"pageTitleMode",type:"enum",label:"Page name",help:"The name of the page, at the top of the screen. Auto shows it for two seconds when the page opens.",default:"On",options:[{value:"Off",label:"Hide"},{value:"On",label:"Show"},{value:"Auto",label:"Auto"}]},{key:"showPageIndicator",type:"bool",label:"Page dots",help:"Small dots that show which page you are on.",default:!0},{key:"pageIndicatorStyle",type:"enum",label:"Dot shape",default:"Dots",options:[{value:"Lines",label:"Lines"},{value:"Dots",label:"Dots"},{value:"Dash",label:"Dash"}],showIf:{key:"showPageIndicator",equals:!0}},{key:"pageIndicatorOpacity",type:"enum",label:"Dot brightness",help:"How easy the dots are to see.",default:"Subtle",options:[{value:"Subtle",label:"Subtle"},{value:"Medium",label:"Medium"},{value:"Bright",label:"Bright"}],showIf:{key:"showPageIndicator",equals:!0}},{key:"pageIndicatorPosition",type:"enum",label:"Dot position",default:"Bottom",options:[{value:"Bottom",label:"Bottom"},{value:"Top",label:"Top"}],showIf:{key:"showPageIndicator",equals:!0}},{key:"pageIndicatorSize",type:"enum",label:"Dot size",default:"Small",options:[{value:"Small",label:"Small"},{value:"Medium",label:"Medium"},{value:"Large",label:"Large"}],showIf:{key:"showPageIndicator",equals:!0}},{key:"pageIndicatorColorHex",type:"color",label:"Dot color",help:"White unless you pick another color.",default:"#FFFFFF",showIf:{key:"showPageIndicator",equals:!0}},{key:"bottomEdgePageSwipeSensitivity",type:"enum",label:"Swipe the bottom edge",help:"Slide along the bottom of the screen to go to the next page. Higher needs a shorter swipe.",default:"High",options:[{value:"Off",label:"Off"},{value:"Low",label:"Low"},{value:"Medium",label:"Medium"},{value:"High",label:"High"},{value:"Max",label:"Max"}]},{key:"wrapPages",type:"bool",label:"Loop pages",help:"After the last page, go back to the first.",default:!1},{key:"pageTransitionStyle",type:"enum",label:"Page animation",help:"The movement you see when the page changes.",default:"None",options:[{value:"Default",label:"Default"},{value:"Slide",label:"Slide"},{value:"Fade",label:"Fade"},{value:"None",label:"None"}]},{key:"popupBackgroundMaterial",type:"enum",label:"Popup background",help:"How much you can see through the panel behind a control.",default:"Regular",options:[{value:"Ultra Thin",label:"Ultra thin (most see-through)"},{value:"Thin",label:"Thin"},{value:"Regular",label:"Regular"},{value:"Thick",label:"Thick"},{value:"Ultra Thick",label:"Ultra thick (most solid)"}]}]},{id:"controls",title:"Controls",settings:[{key:"showControlEntityName",type:"bool",label:"Show the device name",help:"Shows the name under the dial on lights, thermostats, fans, shades and numbers, so you know which one is open.",default:!0},{key:"sliderCrownSensitivity",type:"enum",label:"Digital Crown speed",help:"How fast brightness and other sliders move when you turn the crown.",default:"Normal",options:[{value:"Precise",label:"Precise"},{value:"Normal",label:"Normal"},{value:"Fast",label:"Fast"}]},{key:"showPendingAnimation",type:"bool",label:"Bounce while waiting",help:"The icon bounces until Home Assistant confirms the change.",default:!0},{key:"pendingAnimationDisabledDomains",type:"domains",label:"Which devices bounce",help:"Lit types bounce. Tap a type to turn it on or off.",default:[],initial:["automation","fan","input_boolean","input_number","input_select","light","media_player","switch","timer"],options:[{value:"light",label:"Lights"},{value:"switch",label:"Switches"},{value:"lock",label:"Locks"},{value:"cover",label:"Covers"},{value:"valve",label:"Valves"},{value:"climate",label:"Climate"},{value:"fan",label:"Fans"},{value:"media_player",label:"Media players"},{value:"vacuum",label:"Vacuums"},{value:"timer",label:"Timers"},{value:"input_boolean",label:"Toggle helpers"},{value:"input_number",label:"Number helpers"},{value:"input_select",label:"Dropdown helpers"},{value:"automation",label:"Automations"},{value:"alarm_control_panel",label:"Alarm panels"}],showIf:{key:"showPendingAnimation",equals:!0}},{key:"dismissControlsOnClose",type:"bool",label:"Start fresh when you come back",help:"When you leave the app, close open controls and peeked pages, so you come back to your main page.",default:!0},{key:"pointControlShowHUD",type:"bool",label:"Point Control label",help:"While Point Control runs, show the name of the device you point at. You set up what to point at in Rooms.",default:!1},{key:"automationTriggerSkipConditions",type:"bool",label:"Run automations right away",help:"When you run an automation from the watch, do its actions without checking its conditions first. Its triggers are always skipped.",default:!0}]},{id:"camera",title:"Cameras",settings:[{key:"cameraStreamMode",type:"enum",label:"Camera view",help:"Live video changes to still pictures by itself if a camera cannot stream. Pick Still pictures only if live video has trouble on your network.",default:"Auto",options:[{value:"Auto",label:"Live video"},{value:"Polling",label:"Still pictures"}]},{key:"cameraRefreshRate",type:"enum",label:"How often pictures update",help:"Used when live video is not available. Faster uses more battery.",default:"1s",options:[{value:"0.5s",label:"0.5s"},{value:"1s",label:"1s"},{value:"2s",label:"2s"},{value:"3s",label:"3s"},{value:"5s",label:"5s"}]},{key:"cameraHDRefreshRate",type:"enum",label:"How often HD pictures update",help:"The same, for full-screen HD pictures.",default:"2s",options:[{value:"0.5s",label:"0.5s"},{value:"1s",label:"1s"},{value:"2s",label:"2s"},{value:"3s",label:"3s"},{value:"5s",label:"5s"}]},{key:"cameraSwipeSensitivity",type:"enum",label:"Swipe to the next camera",help:"Slide along the bottom edge to change camera.",default:"Medium",options:[{value:"Off",label:"Off"},{value:"Low",label:"Low"},{value:"Medium",label:"Medium"},{value:"High",label:"High"}]},{key:"cameraSwipeWrap",type:"bool",label:"Loop cameras",help:"After the last camera, go back to the first.",default:!1},{key:"cameraRefreshOnOpen",type:"bool",label:"New picture when a page opens",help:"Get a fresh picture each time a page with a camera opens. Each camera tile can change this under Refresh on open in Pages.",default:!0},{key:"cameraRefreshOnOpenDebounce",type:"enum",label:"Skip if newer than",help:"Keep the picture you have if it is newer than this.",default:"10s",options:[{value:"5s",label:"5s"},{value:"10s",label:"10s"},{value:"30s",label:"30s"},{value:"60s",label:"60s"}],showIf:{key:"cameraRefreshOnOpen",equals:!0}},{key:"cameraRefreshOnPageOpenDelay",type:"enum",label:"Wait before loading",help:"If you swipe away before this time, nothing loads.",default:"Off",options:[{value:"Off",label:"Off"},{value:"250ms",label:"250ms"},{value:"500ms",label:"500ms"},{value:"1s",label:"1s"}],showIf:{key:"cameraRefreshOnOpen",equals:!0}},{key:"cameraShowLoadingDots",type:"bool",label:"Loading dots",help:"Small dots at the top of the page while cameras load.",default:!0}]}]};var Be=ha;function mt(e=Be){return e.sections.flatMap(t=>t.settings)}var cu=/^#?[0-9a-fA-F]{6}$/;function nn(e){let t=e.trim().replace(/^#/,"").slice(0,6);return cu.test(t)?`#${t.toUpperCase()}`:void 0}function vo(e,t){let n=t?.[e.key];switch(e.type){case"bool":return typeof n=="boolean"?n:e.default;case"color":return typeof n=="string"&&nn(n)!==void 0?nn(n):e.default;case"number":return typeof n=="number"&&Number.isFinite(n)?n:e.default;case"domains":return Array.isArray(n)&&n.every(o=>typeof o=="string")?on(n):on(e.default);case"motionGestures":return ga(e,t);case"enum":{let o=uu[e.key];return o!==void 0?typeof n=="string"&&(e.options??[]).some(r=>r.value===n.trim())?n.trim():o(t??{}):typeof n=="string"?n.trim():e.default}case"entity":return typeof n=="string"?n.trim():e.default}}var uu={pageTitleMode:e=>e.showPageTitle===!1?"Off":e.pageTitleStyle==="Auto"?"Auto":"On",topSectionDoubleTapAction:e=>e.roomQuickJumpEnabled===!0?"Room Jump":"Disabled"};function on(e){return Array.isArray(e)?[...new Set(e.filter(t=>typeof t=="string"))].sort((t,n)=>t<n?-1:t>n?1:0):[]}function rn(e,t){return e===t?!0:typeof e!="object"||typeof t!="object"?!1:We(e)===We(t)}function We(e){return Array.isArray(e)?`[${e.map(We).join(",")}]`:typeof e=="object"&&e!==null?`{${Object.keys(e).sort().map(n=>`${JSON.stringify(n)}:${We(e[n])}`).join(",")}}`:JSON.stringify(e)}var pu="Point Control Toggle",hu="Toggle Aimed Entity";function wo(e){if(typeof e!="string"||e==="")return{};let t;try{t=JSON.parse(e)}catch{return{}}if(typeof t!="object"||t===null||Array.isArray(t))return{};let n=Object.entries(t);return n.every(([,o])=>typeof o=="string")?Object.fromEntries(n):{}}function fu(e){let t={};for(let n of Object.keys(e).sort())t[n]=e[n];return JSON.stringify(t).replace(/\//g,"\\/")}function ga(e,t){let n=wo(t?.[e.key]);for(let[o,i]of Object.entries(n))i===pu&&(n[o]=hu);return{actions:n,scenes:e.sceneKey===void 0?{}:wo(t?.[e.sceneKey]),scripts:e.scriptKey===void 0?{}:wo(t?.[e.scriptKey])}}function dy(e,t){return e.actions[t]??"Disabled"}function cy(e,t,n){return{...e,actions:{...e.actions,[t]:n}}}function uy(e,t,n,o){let i=o.trim(),r={...e[t]};return i===""?delete r[n]:r[n]=i,{...e,[t]:r}}function mu(e,t=new Map,n=Be){let o=new Map;for(let i of mt(n))o.set(i.key,t.has(i.key)?t.get(i.key):vo(i,e));return o}function gu(e,t){let n=e.showIf;if(n===void 0)return!0;if(!t.has(n.key))return!1;let o=t.get(n.key);return n.notEquals!==void 0?!rn(o,n.notEquals):rn(o,n.equals)}function yu(e,t){return e.type==="color"&&typeof t=="string"?nn(t)??t:e.type==="domains"?on(t):t}function fa(e,t,n,o){let i=yu(n,o);rn(i,vo(n,t))?e.delete(n.key):e.set(n.key,i)}function py(e,t,n,o,i=Be){let r=new Map(e);fa(r,t,n,o);let a=new Map(mt(i).map(l=>[l.key,l]));for(let[l,s]of xu(n.key,o,mu(t,r,i))){let h=a.get(l);h!==void 0&&fa(r,t,h,s)}return r}var ma={Low:4,Medium:6,High:8};function bu(e){return e<5?"Low":e<7?"Medium":"High"}function xu(e,t,n){return e==="motionGestureSensitivity"&&typeof t=="string"&&ma[t]!==void 0?[["motionGestureSensitivityLevel",ma[t]]]:e==="motionGestureSensitivityLevel"&&typeof t=="number"&&n.get("motionGestureSensitivity")!=="Off"?[["motionGestureSensitivity",bu(t)]]:[]}function hy(e,t,n=Be){let o=new Map(mt(n).map(i=>[i.key,i]));return[...t.entries()].filter(([i,r])=>{let a=o.get(i);return a!==void 0&&!rn(vo(a,e),r)}).map(([i])=>i)}function wu(e,t,n){e==="topSectionDoubleTapAction"&&t!=="Room Jump"&&n.roomQuickJumpEnabled===!0&&(n.roomQuickJumpEnabled=!1),e==="pageTitleMode"&&(t==="Off"||t==="On"||t==="Auto")&&(n.showPageTitle=t!=="Off",t==="Auto"?n.pageTitleStyle="Auto":t==="On"&&n.pageTitleStyle==="Auto"&&(n.pageTitleStyle="Pill"))}function vu(e,t,n,o){if(typeof n!="object"||Array.isArray(n))return;let i=n,r=ga(e,t),a=[[e.key,"actions"],[e.sceneKey,"scenes"],[e.scriptKey,"scripts"]];for(let[l,s]of a)l===void 0||We(r[s])===We(i[s])||(Object.keys(i[s]).length===0?delete o[l]:o[l]=fu(i[s]))}function fy(e,t,n=Be){let o=structuredClone(e),i=new Map(mt(n).map(r=>[r.key,r]));for(let[r,a]of t){let l=i.get(r);if(l!==void 0){if(l.type==="entity"&&typeof a=="string"&&a.trim()==="")delete o[r];else if(l.type==="color"&&typeof a=="string"){let s=nn(a);s!==void 0&&(o[r]=s)}else if(l.type==="domains"){let s=on(a);s.length===0?delete o[r]:o[r]=s}else l.type==="motionGestures"?vu(l,e,a,o):o[r]=typeof a=="string"?a.trim():a;wu(r,a,o)}}return o}function my(e,t){let n=e.options??[];return typeof t!="string"||t===""||n.some(o=>o.value===t)?n:[...n,{value:t,label:t}]}function gy(e){return e===void 0||e.revision<=0?"none":e.delivered_revision>=e.revision?"delivered":"waiting"}function yy(e){return e===void 0||e.revision<=0?!1:e.rejected_revision===e.revision}function by(e){return e==="panel"?"saved here":"from the watch"}function xy(e,t){return`Saved ${e==="panel"?"here":"from the watch"}${t?` ${t}`:""}`}var wy="Waiting for the watch",vy="Synced",ku="Open Wrist Assistant on the watch to get it.",ky=`Waiting. ${ku}`;function Cu(e){let t=e?.code;return typeof t=="string"?t:void 0}function Cy(e){let t=e;for(let o of[t?.revision,t?.data?.revision])if(typeof o=="number"&&Number.isInteger(o)&&o>=0)return o;let n=typeof t?.message=="string"?/stored revision is (\d+)/i.exec(t.message):null;return n?Number(n[1]):void 0}function Sy(e){return e.filter(t=>ft(t)==="watch"&&!t.is_orphan)}function Ty(e,t){let n=e.device_name??e.owner_watch_id;return t.filter(i=>(i.device_name??i.owner_watch_id)===n).length>1&&e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}var Ay="This watch takes its settings from its main home. Change them there.";function _y(e){return e?.main_house===!1}function Ey(e){return e?.has_iphone===!0?"wait":"start"}var Fy="Waiting for your iPhone. Update Wrist Assistant on your iPhone and open it once. Your watch setup moves here by itself.",Hy="Start fresh instead",Su="Your iPhone's setup will not move. Start fresh?";function Ly(e,t=n=>window.confirm(n)){return e==="start"||t(Su)}var ko="New watch. The watch keeps what it has until you save here. Your first Save replaces it.",ya="Nothing to save yet. Make a change first.",Iy="Home Assistant holds pages for this watch that this panel cannot read. Update the integration.",My="Home Assistant holds settings for this watch that this panel cannot read. Update the integration.";function Ry(e,t){return e!==void 0&&e.revision>0&&t(e.document)===void 0}var Py="Pair this watch first: on the Home tab, choose Pair a device.",$y="Pair this watch first, under Pair a device on this page.",Tu=1,Au={crownSensitivity:"Normal",crownSwitchesPages:!1,doubleTapSpeed:"Fast",hapticIntensity:"Medium"};function Ny(e=Be){let t={schemaVersion:Tu};for(let o of mt(e))(o.type==="entity"||o.type==="motionGestures")&&o.default===""||(t[o.key]=structuredClone(o.initial??o.default));for(let[o,i]of Object.entries(Au))Object.hasOwn(t,o)||(t[o]=structuredClone(i));let n={};for(let o of Object.keys(t).sort((i,r)=>i<r?-1:i>r?1:0))n[o]=t[o];return n}var _u=6,Oy="Pair a device";var Dy=["Point the iPhone's Camera at this code.","Tap the link. Wrist Assistant opens, or its App Store page when the app is not on the iPhone yet.","Tap Pair in Wrist Assistant."],zy=["Open Wrist Assistant on the watch or iPhone.","Choose Pair with Home Assistant.","Type the code it shows here, then Look up."];function Eu(e){return e.kind==="iphone"?"iphone":"watch"}function Ge(e){return e==="iphone"?"iPhone":"watch"}function Fu(e){return e==="iphone"?"iPhone":"Apple Watch"}var Vy="No pairing with that code. Codes last 10 minutes.";function ba(e){return`This ${Ge(e)} is already paired. Pairing again gives it a new key.`}var Wy=ba("watch");function xa(e){return`This ${Ge(e)} was paired by another user.`}var Uy=xa("watch");function Co(e){return`This ${Ge(e)} is paired to another person. Only an administrator can replace that pairing.`}var By=Co("watch");function Hu(e,t){return e.paired_by_other_user===!0&&!t}function Gy(e){return e.trim().toUpperCase().replace(/[\s-]+/g,"").replace(/[^A-Z2-9]/g,"")}function jy(e){return e.length===_u&&/^[A-Z2-9]+$/.test(e)}function Ue(e){let t=e?.trim();return t||void 0}function Ky(e,t=!0){let n=Eu(e);if(Hu(e,t))return[Co(n)];let o=[];return e.already_paired===!0&&o.push(ba(n)),e.paired_by_other_user===!0&&o.push(xa(n)),o}function wa(e){return`The request came from outside your network. Only pair ${e==="iphone"?"an iPhone":"a watch"} you expect.`}var qy=wa("watch");function Jy(e){let t=Ue(e.remote),n=e.age_seconds,o="";if(typeof n=="number"&&Number.isFinite(n)){let i=Math.max(0,Math.round(n));o=i>90?` ${Math.floor(i/60)} min ago`:` ${i} s ago`}if(!(o===""&&t===void 0))return`Requested${o}${t===void 0?"":` from ${t}`}`}function Lu(e){let t=e.trim().toLowerCase();if(t.startsWith("[")&&t.endsWith("]")&&(t=t.slice(1,-1)),t.startsWith("::ffff:")&&t.includes(".")&&(t=t.slice(7)),t.startsWith("10.")||t.startsWith("192.168.")||t.startsWith("127."))return!0;let n=/^172\.(\d{1,3})\./.exec(t);if(n){let o=Number(n[1]);return o>=16&&o<=31}return t==="::1"||t.startsWith("fe80:")||t.includes(":")&&(t.startsWith("fc")||t.startsWith("fd"))}function Iu(e,t="watch"){let n=Ue(e);if(!(n===void 0||Lu(n)))return wa(t)}function Xy(e,t={}){return{replace:e.needs_replace===!0||e.already_paired===!0||e.paired_by_other_user===!0||t.replace===!0,remote:e.needs_allow_remote===!0||Iu(e.remote)!==void 0||t.remote===!0}}var Mu="Replace its pairing";function Ru(e){return`I expect this ${Ge(e)}`}function Pu(e,t){return e===void 0||e.length<2?!0:t!==void 0&&e.some(n=>n.id===t)}function Yy(e,t,n,o){return Pu(n,o)&&(!e.replace||t.replace)&&(!e.remote||t.remote)}function Zy(e,t,n="watch"){let o=Ue(t);return`Paired ${Ue(e)??Fu(n)}${o===void 0?"":` for ${o}`}.`}function $u(e){return`Whose ${Ge(e)} is this?`}var Qy=$u("watch");function Nu(e){return e==="iphone"?"The iPhone runs with this person's rights.":"The watch runs with this person's rights, and their iPhone gets its Fast alerts."}var eb=Nu("watch"),tb="Choose a person";function Ou(e){return e.is_owner===!0||(e.group_ids??[]).includes("system-admin")}function nb(e){return e?.is_admin===!0}function ob(e,t){let n=e.filter(a=>a.is_active!==!1&&a.system_generated!==!0),o=a=>{let l=Ue(a.name)??Ue(a.username)??a.id,s=Ou(a);return{id:a.id,label:`${l}${a.id===t?" (you)":""} \xB7 ${s?"Admin":"User"}`,name:l,admin:s}},i=n.filter(a=>a.id===t).map(o),r=n.filter(a=>a.id!==t).map(o).sort((a,l)=>a.name.localeCompare(l.name));return[...i,...r]}function ib(e,t){return t!=null&&e.some(n=>n.id===t)?t:e.length===1?e[0]?.id:void 0}function rb(e,t){return e===void 0||e===t?void 0:e}function ab(e,t){if(!(e===void 0||e.length<2||t==null))return e.find(n=>n.id===t)?.name}function sb(e,t,n="watch"){let o=Cu(e);if(o==="unknown_command")return t==="offer"?"Update the Wrist Assistant integration to pair an iPhone with a QR code.":"Update the Wrist Assistant integration to pair a watch with a code.";if(o==="needs_replace")return`This ${Ge(n)} is already paired. Tick ${Mu} to pair it again.`;if(o==="paired_by_other_user")return Co(n);if(o==="needs_allow_remote")return`The request came from outside your network. Tick ${Ru(n)} to pair it.`;let i=String(e?.message??e);return t==="offer"?`Could not show a QR code: ${i}`:t==="lookup"?`Could not look up that code: ${i}`:`Could not pair: ${i}`}var lb=2e3,db="Show QR code",cb="Replace an iPhone paired for someone else",ub="Only for an iPhone already paired here for another person, such as a phone handed on. Without it, that iPhone is refused.",pb="More options",hb="Pair this iPhone instead";function fb(e){return e!==void 0&&/\biPhone\b/.test(e)}var mb="This code ran out. Show a new one.";function gb(e){let t=Math.max(0,Math.ceil(e));return`Runs out in ${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}function Du(e,t){return e.find(n=>n.owner_watch_id===t)?.owner_watch_id??e[0]?.owner_watch_id}function yb(e,t,n,o){if(t===void 0||!e.some(i=>i.owner_watch_id===t)){let i=Du(e,n);return i!==t?i:void 0}if(!(!o||n===void 0||n===t))return e.some(i=>i.owner_watch_id===n)?n:void 0}function bb(e,t){let n=[];for(let o of e.settings){if(!gu(o,t))continue;let i=n[n.length-1];o.showIf!==void 0&&i!==void 0&&o.showIf.key===i.setting.key?i.dependents.push(o):n.push({setting:o,dependents:[]})}return n}var zu="New watch, not saved yet",va=class{constructor(t){this.owner=t}get root(){return this.box?.shadowRoot??void 0}draw(t,n){if(t===void 0){this.clear();return}let o=this.box;if(o===void 0){o=document.createElement("div"),o.className="wa-head-bar";let i=o.attachShadow({mode:"open"});bt(i,this.owner.constructor.elementStyles),this.box=o}o.parentNode!==t&&t.append(o),et(n(),o.shadowRoot,{host:this.owner})}clear(){let t=this.box;t!==void 0&&(this.box=void 0,t.shadowRoot&&et(F,t.shadowRoot,{host:this.owner}),t.remove())}holds(t){let n=this.root;return n!==void 0&&t.includes(n)}query(t,n){return(this.root??t).querySelector(n)}};function kb(e){if(e.newWatch){let n=e.dirty?ko:`${ko} ${ya}`;return $`<span class="tb-status new" role="status" title=${n}><i class="tb-status-dot" aria-hidden="true"></i><span>${zu}</span></span>`}if(e.dirty){let n=e.changes,o=n===void 0||n<=0?"Unsaved changes":`${n} ${n===1?"change":"changes"}`;return $`<span class="tb-status unsaved" role="status" title="Not saved yet"><i class="tb-status-dot" aria-hidden="true"></i><span>${o}</span></span>`}let t=e.saved;return t===void 0||t===F||t===""?F:$`<span class="tb-status" role="status">${t}</span>`}var Cb=C`
  .wa-bar.in-head {
    display: flex; align-items: center; justify-content: flex-end; flex-wrap: nowrap; gap: 8px;
    min-height: 0; padding: 0; margin: 0; border: 0; background: none; position: static; z-index: auto;
  }
  .wa-bar.in-head > .spacer { display: none; }
  .wa-bar.in-head > * { margin-block: 0; }
  .wa-bar.in-head :is(button.tb-btn, button.help, button.cv-act, button.cm-btn, button.primary.save, button.primary) {
    height: 32px; min-height: 32px; box-sizing: border-box; border-radius: 9px; flex: none;
    font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink); box-shadow: none;
  }
  .wa-bar.in-head :is(button.tb-btn, button.cm-btn) { padding: 0 11px; }
  .wa-bar.in-head :is(button.help, button.tb-btn.icon, button.cv-act.icon, button.tb-btn.tb-more) {
    width: 32px; padding: 0; display: inline-grid; place-items: center;
  }
  .wa-bar.in-head button.tb-btn.tb-more { letter-spacing: .04em; }
  .wa-bar.in-head :is(button.tb-btn, button.help, button.cv-act, button.cm-btn, button.primary):hover:not(:disabled) {
    background: var(--wa-hover); border-color: var(--wa-line-strong);
  }
  .wa-bar.in-head :is(button.tb-btn, button.help, button.cv-act, button.cm-btn, button.primary):focus-visible {
    outline: none; box-shadow: var(--wa-ring);
  }
  .wa-bar.in-head :is(button.tb-btn, button.cv-act, button.cm-btn):disabled { opacity: .45; cursor: default; }
  .wa-bar.in-head button.primary.save { padding: 0 16px; color: var(--wa-faint); opacity: 1; }
  .wa-bar.in-head button.primary.save:disabled { cursor: default; }
  .wa-bar.in-head button.primary.save.dirty:not(:disabled) {
    color: var(--wa-ink); background: var(--wa-card); border-color: var(--wa-hue-green); box-shadow: none;
  }
  .wa-bar.in-head button.primary.save.dirty:not(:disabled):hover { background: var(--wa-hover); }
  .wa-bar.in-head button.primary.save.dirty:not(:disabled):focus-visible { box-shadow: var(--wa-ring); }
  .wa-bar.in-head .tb-sync { height: 32px; font-size: 12px; font-weight: 500; max-width: none; }
  .wa-bar.in-head .tb-status {
    display: inline-flex; align-items: center; gap: 7px; min-width: 0;
    font-size: 12px; line-height: 1.3; color: var(--wa-muted); overflow-wrap: anywhere;
  }
  .wa-bar.in-head .tb-status .cf-saved { margin: 0; font-size: inherit; color: inherit; }
  .wa-bar.in-head .tb-status-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .wa-bar.in-head .tb-status:is(.new, .unsaved) { color: var(--wa-hue-orange); }
  .wa-bar.in-head .tb-status:is(.new, .unsaved) .tb-status-dot { background: var(--wa-hue-orange); }
  .wa-bar.in-head .tb-note { font-size: 12px; color: var(--wa-muted); min-width: 0; overflow-wrap: anywhere; }
  .wa-bar.in-head .pop-menu { z-index: 60; }
  /* A phone: the bar sits beside the watch on the first line and may take
     two lines of its own, the buttons on top and the words under them. */
  @media (max-width: 640px) {
    .wa-bar.in-head { flex-wrap: wrap; gap: 4px 6px; }
    .wa-bar.in-head::before { content: ""; order: 1; flex: 0 0 100%; height: 0; }
    .wa-bar.in-head > :is(.tb-status, .tb-sync, .tb-note) { order: 2; flex: 0 1 auto; text-align: right; }
    .wa-bar.in-head .tb-sync { height: auto; }
  }
`;var ka="/cameras";function Ab(e){let t=e?.path??"";return t===ka||t.startsWith(`${ka}/`)}var _b="https://docs.wrist-assistant.com/watch-app/cameras/#notification-snapshots",To;function Eb(e){To=e}function Fb(){return To?.dirty()??!1}function Hb(){To?.drop()}var Ca,So=!1;function Vu(){return Ca??=import("./cameras-editor-455ZXF5L.js").then(()=>{},e=>{throw So=!0,e}),Ca}function Lb(e){let t=customElements.get("wa-cameras-editor")!==void 0;return!t&&!So&&Vu().then(e.onLoaded,e.onLoaded),t?$`<wa-cameras-editor .hass=${e.hass} ?narrow=${e.narrow} .barHost=${e.barHost}></wa-cameras-editor>`:$`<div class="wp-loading">
        ${So?$`<span>The Cameras screen did not load. Reload the page to try again.</span>`:$`<span>Loading…</span>`}
      </div>`}export{Te as a,C as b,$ as c,b as d,he as e,F as f,Ku as g,et as h,_e as i,zo as j,dp as k,gn as l,Rp as m,Da as n,za as o,Pp as p,$p as q,Np as r,Op as s,Dp as t,zp as u,Vp as v,Wp as w,Ln as x,L as y,dt as z,N as A,Gp as B,jp as C,In as D,Ua as E,ct as F,Ba as G,Dt as H,wn as I,He as J,at as K,xi as L,Mn as M,Rn as N,Qa as O,es as P,wi as Q,vi as R,Pn as S,Cn as T,Sn as U,Tn as V,Kp as W,os as X,is as Y,Nn as Z,On as _,rs as $,as as aa,qp as ba,Jp as ca,ki as da,ss as ea,Xp as fa,ls as ga,Yp as ha,hs as ia,fs as ja,Zp as ka,Qp as la,gs as ma,Dn as na,zn as oa,Vn as pa,eh as qa,th as ra,nh as sa,ws as ta,vs as ua,oh as va,ks as wa,Cs as xa,It as ya,Ss as za,Ts as Aa,_s as Ba,Es as Ca,Hs as Da,Ls as Ea,Ko as Fa,Ci as Ga,ih as Ha,Is as Ia,qo as Ja,Ms as Ka,rh as La,Si as Ma,Ti as Na,Ai as Oa,ah as Pa,Rs as Qa,sh as Ra,lh as Sa,dh as Ta,Un as Ua,zt as Va,Vt as Wa,Ds as Xa,zs as Ya,Wt as Za,Ut as _a,Vs as $a,Ws as ab,ch as bb,uh as cb,ph as db,_i as eb,Ei as fb,An as gb,hh as hb,Js as ib,Yo as jb,fh as kb,mh as lb,Le as mb,Ie as nb,Xs as ob,G as pb,gh as qb,Ys as rb,yh as sb,bh as tb,xh as ub,Zs as vb,Qs as wb,el as xb,wh as yb,vh as zb,tl as Ab,nl as Bb,ol as Cb,il as Db,rl as Eb,al as Fb,kh as Gb,sl as Hb,ll as Ib,Bt as Jb,dl as Kb,Ch as Lb,Sh as Mb,Th as Nb,Ah as Ob,Me as Pb,_h as Qb,Gt as Rb,te as Sb,ne as Tb,Ri as Ub,ml as Vb,gl as Wb,yl as Xb,Pi as Yb,Eh as Zb,$i as _b,jt as $b,Fh as ac,bl as bc,xl as cc,vl as dc,Zo as ec,Qo as fc,Hh as gc,Cl as hc,Tl as ic,Lh as jc,Ih as kc,Di as lc,_l as mc,zi as nc,Mh as oc,Rh as pc,El as qc,Fl as rc,Hl as sc,Ll as tc,Ph as uc,Il as vc,Ml as wc,Zn as xc,Rl as yc,Pl as zc,Qn as Ac,eo as Bc,$l as Cc,Nl as Dc,$h as Ec,Wi as Fc,Nh as Gc,Oh as Hc,Ne as Ic,to as Jc,Bi as Kc,Dh as Lc,zh as Mc,Vh as Nc,Dl as Oc,Wh as Pc,Uh as Qc,Bh as Rc,Gh as Sc,Vl as Tc,jh as Uc,Kh as Vc,Ul as Wc,qh as Xc,Jh as Yc,Xh as Zc,Yh as _c,Zh as $c,Qh as ad,ef as bd,tf as cd,nf as dd,Bl as ed,qi as fd,of as gd,rf as hd,Ji as id,qt as jd,ei as kd,ve as ld,Jt as md,Xi as nd,Yi as od,af as pd,sf as qd,Zl as rd,lf as sd,df as td,cf as ud,uf as vd,pf as wd,hf as xd,ff as yd,Ql as zd,mf as Ad,gf as Bd,yf as Cd,bf as Dd,xf as Ed,X as Fd,Re as Gd,wf as Hd,fd as Id,or as Jd,vf as Kd,Pe as Ld,yd as Md,kf as Nd,Mt as Od,xd as Pd,dr as Qd,cr as Rd,kd as Sd,Cd as Td,Sd as Ud,Cf as Vd,_d as Wd,Fd as Xd,Hd as Yd,Ld as Zd,Id as _d,Rd as $d,Sf as ae,Tf as be,Af as ce,_ as de,_f as ee,Ef as fe,Ff as ge,Hf as he,P as ie,lo as je,U as ke,Lf as le,co as me,Xd as ne,If as oe,yr as pe,oe as qe,Mf as re,Rf as se,Pf as te,B as ue,xr as ve,Zd as we,Qd as xe,$f as ye,Nf as ze,Of as Ae,Df as Be,zf as Ce,I as De,Xt as Ee,Vf as Fe,Wf as Ge,Uf as He,tc as Ie,vr as Je,Bf as Ke,ic as Le,rc as Me,Gf as Ne,z as Oe,T as Pe,kr as Qe,ac as Re,Cr as Se,sc as Te,jf as Ue,lc as Ve,dc as We,cc as Xe,Kf as Ye,qf as Ze,ke as _e,R as $e,uc as af,Jf as bf,Ve as cf,Xf as df,pc as ef,ee as ff,Yf as gf,Zf as hf,Tr as if,Qf as jf,Nt as kf,po as lf,em as mf,_r as nf,tm as of,vc as pf,nm as qf,fi as rf,Sc as sf,ho as tf,om as uf,de as vf,im as wf,_c as xf,rm as yf,am as zf,Fc as Af,sm as Bf,Hc as Cf,lm as Df,dm as Ef,cm as Ff,um as Gf,pm as Hf,Lc as If,Ic as Jf,Mc as Kf,Rc as Lf,Pc as Mf,hm as Nf,fm as Of,mm as Pf,Zt as Qf,Nc as Rf,bm as Sf,zc as Tf,fo as Uf,Uc as Vf,xm as Wf,Gc as Xf,wm as Yf,Sm as Zf,Tm as _f,Am as $f,_m as ag,Em as bg,Fm as cg,Hm as dg,Lm as eg,Im as fg,Mm as gg,Rm as hg,Pm as ig,$m as jg,Nm as kg,Om as lg,Dm as mg,zm as ng,Vm as og,Wm as pg,Um as qg,Bm as rg,Gm as sg,jm as tg,Km as ug,qm as vg,Jm as wg,Xm as xg,Ym as yg,Zm as zg,Qm as Ag,eg as Bg,tg as Cg,ng as Dg,og as Eg,ig as Fg,rg as Gg,ag as Hg,sg as Ig,lg as Jg,dg as Kg,cg as Lg,ug as Mg,pg as Ng,hg as Og,fg as Pg,mg as Qg,gg as Rg,yg as Sg,bg as Tg,xg as Ug,wg as Vg,vg as Wg,kg as Xg,Cg as Yg,Sg as Zg,Tg as _g,Ag as $g,Eg as ah,Fg as bh,Hg as ch,Lg as dh,Pr as eh,$r as fh,Se as gh,Og as hh,Dg as ih,zg as jh,Vg as kh,Wg as lh,Ug as mh,Bg as nh,Gg as oh,jg as ph,Kg as qh,Xg as rh,Xc as sh,Yc as th,Zc as uh,Qc as vh,eu as wh,tu as xh,nu as yh,Yg as zh,ha as Ah,Qg as Bh,iu as Ch,ey as Dh,ru as Eh,ua as Fh,ft as Gh,ty as Hh,Y as Ih,tn as Jh,sa as Kh,ny as Lh,oy as Mh,iy as Nh,Be as Oh,vo as Ph,on as Qh,ga as Rh,dy as Sh,cy as Th,uy as Uh,mu as Vh,py as Wh,hy as Xh,fy as Yh,my as Zh,gy as _h,yy as $h,by as ai,xy as bi,wy as ci,vy as di,ku as ei,ky as fi,Cu as gi,Cy as hi,Sy as ii,Ty as ji,Ay as ki,_y as li,Ey as mi,Fy as ni,Hy as oi,Ly as pi,ko as qi,ya as ri,Iy as si,My as ti,Ry as ui,Py as vi,$y as wi,Ny as xi,_u as yi,Oy as zi,Dy as Ai,zy as Bi,Eu as Ci,Vy as Di,Hu as Ei,Gy as Fi,jy as Gi,Ky as Hi,Jy as Ii,Iu as Ji,Xy as Ki,Mu as Li,Ru as Mi,Pu as Ni,Yy as Oi,Zy as Pi,$u as Qi,Nu as Ri,tb as Si,nb as Ti,ob as Ui,ib as Vi,rb as Wi,ab as Xi,sb as Yi,lb as Zi,db as _i,cb as $i,ub as aj,pb as bj,hb as cj,fb as dj,mb as ej,gb as fj,Du as gj,yb as hj,bb as ij,va as jj,kb as kj,Cb as lj,ka as mj,Ab as nj,_b as oj,Eb as pj,Fb as qj,Hb as rj,Lb as sj};
