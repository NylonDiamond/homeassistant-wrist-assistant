var bf=Object.defineProperty;var xf=Object.getOwnPropertyDescriptor;var L=(e,n,t,i)=>{for(var a=i>1?void 0:i?xf(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&bf(n,t,a),a};var Ga=globalThis,Ua=Ga.ShadowRoot&&(Ga.ShadyCSS===void 0||Ga.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Oo=Symbol(),Md=new WeakMap,Di=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==Oo)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(Ua&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=Md.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&Md.set(t,n))}return n}toString(){return this.cssText}},Ie=e=>new Di(typeof e=="string"?e:e+"",void 0,Oo),Bo=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new Di(t,e,Oo)},Ad=(e,n)=>{if(Ua)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=Ga.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},Vo=Ua?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return Ie(t)})(e):e;var{is:wf,defineProperty:vf,getOwnPropertyDescriptor:kf,getOwnPropertyNames:$f,getOwnPropertySymbols:Cf,getPrototypeOf:Sf}=Object,Ka=globalThis,Hd=Ka.trustedTypes,Tf=Hd?Hd.emptyScript:"",Ef=Ka.reactiveElementPolyfillSupport,Oi=(e,n)=>e,Bi={toAttribute(e,n){switch(n){case Boolean:e=e?Tf:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},Wa=(e,n)=>!wf(e,n),Fd={attribute:!0,type:String,converter:Bi,reflect:!1,useDefault:!1,hasChanged:Wa};Symbol.metadata??=Symbol("metadata"),Ka.litPropertyMetadata??=new WeakMap;var Ht=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=Fd){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&vf(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=kf(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(n,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Fd}static _$Ei(){if(this.hasOwnProperty(Oi("elementProperties")))return;let n=Sf(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Oi("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Oi("properties"))){let t=this.properties,i=[...$f(t),...Cf(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(Vo(a))}else n!==void 0&&t.push(Vo(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ad(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:Bi).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Bi;this._$Em=a;let s=o.fromAttribute(t,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??Wa)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};Ht.elementStyles=[],Ht.shadowRootOptions={mode:"open"},Ht[Oi("elementProperties")]=new Map,Ht[Oi("finalized")]=new Map,Ef?.({ReactiveElement:Ht}),(Ka.reactiveElementVersions??=[]).push("2.1.2");var Uo=globalThis,Id=e=>e,ja=Uo.trustedTypes,Ld=ja?ja.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ko="$lit$",Ft=`lit$${Math.random().toFixed(9).slice(2)}$`,Wo="?"+Ft,Rf=`<${Wo}>`,En=document,Gi=()=>En.createComment(""),Ui=e=>e===null||typeof e!="object"&&typeof e!="function",jo=Array.isArray,Od=e=>jo(e)||typeof e?.[Symbol.iterator]=="function",Go=`[ 	
\f\r]`,Vi=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_d=/-->/g,Pd=/>/g,Sn=RegExp(`>|${Go}(?:([^\\s"'>=/]+)(${Go}*=${Go}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Nd=/'/g,zd=/"/g,Bd=/^(?:script|style|textarea|title)$/i,qo=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),h=qo(1),w=qo(2),_k=qo(3),It=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Dd=new WeakMap,Tn=En.createTreeWalker(En,129);function Vd(e,n){if(!jo(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ld!==void 0?Ld.createHTML(n):n}var Gd=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=Vi;for(let s=0;s<t;s++){let l=e[s],d,c,u=-1,p=0;for(;p<l.length&&(o.lastIndex=p,c=o.exec(l),c!==null);)p=o.lastIndex,o===Vi?c[1]==="!--"?o=_d:c[1]!==void 0?o=Pd:c[2]!==void 0?(Bd.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=Sn):c[3]!==void 0&&(o=Sn):o===Sn?c[0]===">"?(o=a??Vi,u=-1):c[1]===void 0?u=-2:(u=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?Sn:c[3]==='"'?zd:Nd):o===zd||o===Nd?o=Sn:o===_d||o===Pd?o=Vi:(o=Sn,a=void 0);let m=o===Sn&&e[s+1].startsWith("/>")?" ":"";r+=o===Vi?l+Rf:u>=0?(i.push(d),l.slice(0,u)+Ko+l.slice(u)+Ft+m):l+Ft+(u===-2?s:m)}return[Vd(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},Ki=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,s=n.length-1,l=this.parts,[d,c]=Gd(n,t);if(this.el=e.createElement(d,i),Tn.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=Tn.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(Ko)){let p=c[o++],m=a.getAttribute(u).split(Ft),g=/([.?@])?(.*)/.exec(p);l.push({type:1,index:r,name:g[2],strings:m,ctor:g[1]==="."?Ya:g[1]==="?"?Xa:g[1]==="@"?Ja:Mn}),a.removeAttribute(u)}else u.startsWith(Ft)&&(l.push({type:6,index:r}),a.removeAttribute(u));if(Bd.test(a.tagName)){let u=a.textContent.split(Ft),p=u.length-1;if(p>0){a.textContent=ja?ja.emptyScript:"";for(let m=0;m<p;m++)a.append(u[m],Gi()),Tn.nextNode(),l.push({type:2,index:++r});a.append(u[p],Gi())}}}else if(a.nodeType===8)if(a.data===Wo)l.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf(Ft,u+1))!==-1;)l.push({type:7,index:r}),u+=Ft.length-1}r++}}static createElement(n,t){let i=En.createElement("template");return i.innerHTML=n,i}};function Rn(e,n,t=e,i){if(n===It)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=Ui(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=Rn(e,a._$AS(e,n.values),a,i)),n}var qa=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??En).importNode(t,!0);Tn.currentNode=a;let r=Tn.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new pi(r,r.nextSibling,this,n):l.type===1?d=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(d=new Za(r,this,n)),this._$AV.push(d),l=i[++s]}o!==l?.index&&(r=Tn.nextNode(),o++)}return Tn.currentNode=En,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},pi=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=Rn(this,n,t),Ui(n)?n===f||n==null||n===""?(this._$AH!==f&&this._$AR(),this._$AH=f):n!==this._$AH&&n!==It&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Od(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==f&&Ui(this._$AH)?this._$AA.nextSibling.data=n:this.T(En.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=Ki.createElement(Vd(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new qa(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=Dd.get(n.strings);return t===void 0&&Dd.set(n.strings,t=new Ki(n)),t}k(n){jo(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(Gi()),this.O(Gi()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=Id(n).nextSibling;Id(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Mn=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=Rn(this,n,t,0),o=!Ui(n)||n!==this._$AH&&n!==It,o&&(this._$AH=n);else{let s=n,l,d;for(n=r[0],l=0;l<r.length-1;l++)d=Rn(this,s[i+l],t,l),d===It&&(d=this._$AH[l]),o||=!Ui(d)||d!==this._$AH[l],d===f?n=f:n!==f&&(n+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!a&&this.j(n)}j(n){n===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Ya=class extends Mn{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===f?void 0:n}},Xa=class extends Mn{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==f)}},Ja=class extends Mn{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=Rn(this,n,t,0)??f)===It)return;let i=this._$AH,a=n===f&&i!==f||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==f&&(i===f||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Za=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){Rn(this,n)}},Ud={M:Ko,P:Ft,A:Wo,C:1,L:Gd,R:qa,D:Od,V:Rn,I:pi,H:Mn,N:Xa,U:Ja,B:Ya,F:Za},Mf=Uo.litHtmlPolyfillSupport;Mf?.(Ki,pi),(Uo.litHtmlVersions??=[]).push("3.3.3");var Qa=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new pi(n.insertBefore(Gi(),r),r,void 0,t??{})}return a._$AI(e),a};var Yo=globalThis,Yt=class extends Ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Qa(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return It}};Yt._$litElement$=!0,Yt.finalized=!0,Yo.litElementHydrateSupport?.({LitElement:Yt});var Af=Yo.litElementPolyfillSupport;Af?.({LitElement:Yt});(Yo.litElementVersions??=[]).push("4.2.2");var Hf={attribute:!0,type:String,converter:Bi,reflect:!1,hasChanged:Wa},Ff=(e=Hf,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(s){let l=n.get.call(this);n.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=t;return function(s){let l=this[o];n.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function hi(e){return(n,t)=>typeof t=="object"?Ff(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function P(e){return hi({...e,state:!0,attribute:!1})}var se=["rectangular","circular","corner"],ce={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},ji=["rectangular","circular","corner","inline"];var ns=64;function oc(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<ns;i++)if(!t.has(i))return i;return-1}function sc(e,n){let t=new Set(e);return n.filter(i=>i.kind!=="preset"||!t.has(i.slot))}function _n(e){return se.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var If=["none","dot","triangle"],Lf=["straight","smooth","step"],_f=["light","medium","strong"],Pf={light:.05,medium:.1,strong:.2};function Kd(e){return typeof e=="string"&&Lf.includes(e)?e:"straight"}var Nf=["flat","fade"],zf=["none","all","auto"],lc=4,Pt="#FFFFFF33";function Qt(e){return typeof e=="string"&&Nf.includes(e)?e:"flat"}function es(e){return typeof e=="string"&&zf.includes(e)?e:"none"}function ts(e){return typeof e!="number"||!Number.isFinite(e)?0:Math.max(0,Math.min(lc,Math.round(e)))}function dc(e,n){return e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function Xt(e){return typeof e=="string"&&e!==""?e:Pt}var Df=1,Of=12;function gt(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.max(Df,Math.min(Of,e))}function sr(e){return e==="all"?"all":"auto"}var nn=1,an=3,lr=.25,dr=4;function Pn(e){return typeof e!="number"||!Number.isFinite(e)?an:Math.max(1,Math.min(lc,Math.round(e)))}function Nn(e){return typeof e!="number"||!Number.isFinite(e)?nn:Math.max(lr,Math.min(dr,e))}var Bf=["all","top"],fi=1.2;function en(e){return typeof e!="number"||!Number.isFinite(e)?fi:Math.max(0,e)}function tn(e){return typeof e=="string"&&Bf.includes(e)?e:"all"}function st(e){if(typeof e=="string")return _f.includes(e)?e:void 0;if(e===3||e===5)return"light";if(e===7)return"medium";if(e===9)return"strong"}function cc(e,n){if(n===void 0||e<2)return 0;let t=Math.max(3,Math.floor(e*Pf[n]+.5));return t%2===0?t+1:t}var Vf=[["history","Recorded history"],["statistics","Long-term statistics"]],cr=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],is=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],as="history",Zi="hour",Qi="mean",bt=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],ea={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},xt=[["highest","Highest reading"],["lowest","Lowest reading"],["now","Now"],["first","First reading"],["latest","Newest reading"],["threshold","Threshold"],["zero","Zero"]];function Nt(e){return e!=="threshold"&&e!=="zero"}var ur=[["above","Above"],["on","On"],["below","Inside"],["bottom","At the bottom"],["through","Through"]];function Gf(e){return xt.some(([n])=>n===e)}function Uf(e){return ur.some(([n])=>n===e)}function Kf(e){if(!U(e)||typeof e.layer!="string"||e.layer==="")return;let n={layer:e.layer.toUpperCase(),at:Gf(e.at)?e.at:"highest",place:Uf(e.place)?e.place:"above"},t=ee(e.dx,0),i=ee(e.dy,0);return t!==0&&(n.dx=t),i!==0&&(n.dy=i),n}function tr(e,n){let t=Kf(e.chartAnchor);t!==void 0&&(n.chartAnchor=t)}function nr(e,n){e.chartAnchor!==void 0&&(n.chartAnchor=Wf(e.chartAnchor))}function Wf(e){let n={layer:e.layer,at:e.at,place:e.place};return e.dx!==void 0&&e.dx!==0&&(n.dx=Q(e.dx)),e.dy!==void 0&&e.dy!==0&&(n.dy=Q(e.dy)),n}var Oe={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"};function uc(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function lt(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function zn(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function ta(e){let n=c=>c.value.kind.kind!=="literal",t=(c,u)=>e.slice(c,u).map(p=>zn(p.value)??"").join(""),i=e.findIndex(n);if(i<0)return G(t(0,e.length));let a=e.findIndex((c,u)=>u>i&&n(c)),r=e[i].value,o={...r.format},s=t(0,i)+(o.prefix??""),l=(o.suffix??"")+t(i+1,a<0?e.length:a);delete o.prefix,delete o.suffix,s!==""&&(o.prefix=s),l!==""&&(o.suffix=l);let d={kind:structuredClone(r.kind)};return Pe(o)||(d.format=o),d}function pc(e){lt(e)&&(e.value=ta(e.parts))}var gi="#FFFFFF";function Wd(e){return typeof e=="string"&&If.includes(e)}function jf(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function Yi(e){let n=jf(e.marker);return{high:e.highMarker??n.high,low:e.lowMarker??n.low}}function hc(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function mc(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function qf(e,n){e.marker=hc(n),mc(n)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=n.high,e.lowMarker=n.low)}var pr=24,hr=6,Xi="#FFFFFF";function rs(e){if(e.style!=="bars")return 0;let n=e.barBorderWidth;return typeof n!="number"||!Number.isFinite(n)?0:Math.min(Math.max(n,0),hr)}function fc(e,n,t,i,a){if(a!==void 0)return{fill:a,border:a};if(!na(e))return{fill:e.fillColorHex??i,border:e.barBorderColorHex??Xi};let r=t.find(s=>n<=s.upTo),o=r?{color:r.colorHex,fill:r.fillColorHex,border:r.borderColorHex}:{color:e.bandAboveColorHex,fill:e.bandAboveFillColorHex,border:e.bandAboveBorderColorHex};return{fill:o.fill??e.fillColorHex??o.color,border:o.border??e.barBorderColorHex??Xi}}var tt="#FF6B35",nt="#32D74B",os="#32D74B",he="#FF453A",ss="#FF453A",ls="#FFFFFF99";function rn(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function na(e){return e.coloring==="bands"&&e.bands.length>0}function mr(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function ia(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}function gc(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var Dn=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],fr=360,gr=10080,aa=[...Dn,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],ds=366*24*60,yr=2,zt=120,cs=0;function us(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?n<1?cs:Math.max(yr,Math.min(zt,n)):24}function On(e){return hs(e)!==void 0?!0:ps(e)!==void 0&&us(e)>0}function ps(e){if(e.source==="history")return yc(e)}function hs(e){if(e.source==="statistics")return yc(e)}function yc(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function wt(e){let n=ps(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${us(e)}${e.gaps===!0?"|gaps":""}`}function vt(e){let n=hs(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}${e.gaps===!0?"|gaps":""}`}function bc(e){return[...ms(e).map(t=>t.key),...fs(e).map(t=>t.key)].sort().join(";")}function ms(e){let n=new Map,t=i=>{n.has(i.key)||n.set(i.key,i)};for(let i of e.elements)if(i.kind==="chart"){let a=wt(i.payload),r=ps(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:Math.round(i.payload.historyMinutes),points:us(i.payload),mode:"numeric",gaps:i.payload.gaps===!0})}else if(i.kind==="timeline"){let a=qe(i.payload),r=Cc(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:dt(i.payload),points:dn,mode:"states",gaps:!1})}return[...n.values()]}function fs(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=vt(t.payload),a=hs(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),period:t.payload.statPeriod,type:t.payload.statType,gaps:t.payload.gaps===!0})}return[...n.values()]}var xc=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],wc=[["auto","Auto"],["always","Always"],["never","Never"]];function Xo(e){return e==="h12"||e==="h24"?e:Hn}function Jo(e){return e==="always"||e==="never"?e:Fn}function Yf(e){return e.timeLabelCount!==void 0?yt(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:An}function yt(e){let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.min(Bn,Math.round(n))):An}function ra(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(n,t)=>t/(e-1))}var on="#8E8E93",vc=1,Xf="#000000",Jf=2,Zf=1440,gs=60,An=0,it=9,at="#8E8E93",Hn="auto",Fn="auto",kc=4,Bn=12,sn=1,ln=20,br=4,dn=120;function $c(e,n,t){let i=e.trim().toLowerCase();for(let a of n)if(a.match.trim().toLowerCase()===i)return a.colorHex;return t}function dt(e){let n=Math.round(e.historyMinutes);return Number.isFinite(n)?Math.max(1,Math.min(gr,n)):gs}function Cc(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function qe(e){let n=Cc(e);if(n!==void 0)return`${n}|${dt(e)}|${dn}|states`}var Qf={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},oa={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function ar(e){return Qf[e.trim().toLowerCase()]??on}var eg=["door","garage_door","window","opening"];function ys(e,n){let t=(n??"").trim().toLowerCase(),i=e==="binary_sensor"&&eg.includes(t),a=o=>ar(i&&o==="on"?"open":o);return[...oa[e]??[],"unavailable","unknown"].map(o=>({id:te(),match:o,colorHex:a(o)}))}var yi=6,xr=9,tg=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function wr(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function ng(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var bs={top:0,left:0,bottom:0,right:0};function vr(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var ig=["toggleEntity","runScene","runScript","addTodo","runHTTPAction"];function Sc(e){return ig.includes(e)}function Tc(e){let n=(e??"").trim();if(n==="")return!0;try{let t=JSON.parse(n);return typeof t=="object"&&t!==null&&!Array.isArray(t)}catch{return!1}}var xs=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"],["callService","Call a service"]];function Dt(e){let n=xs.find(([i])=>i===e.type)?.[1]??e.type;if(e.type==="callService"){let i=[e.serviceDomain,e.serviceName].filter(a=>a!=="").join(".");return i===""?n:`${n}: ${i}`}if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function U(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Y(e,n=""){return typeof e=="string"?e:n}function ee(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function ft(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function qi(e){return e==null?void 0:ee(e,0)}function Ee(e){return typeof e=="string"?e:void 0}function mi(e,n,t){return typeof e=="string"&&n.includes(e)?e:t}function Zo(e,n,t){return n.some(([i])=>i===e)?e:t}var rt=class extends Error{};function Jt(e){if(typeof e.entityId!="string")throw new rt("entityId is required");let n={entityId:e.entityId,displayName:Y(e.displayName),domain:Y(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function jd(e){if(!U(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=ee(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=ee(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=ee(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),e.duration===!0&&(n.duration=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),Pe(n)?void 0:n}function Pe(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.textCase===void 0:!0}function ag(e){let n=Y(e.function,"count"),t=U(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(U).map(Jt)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(U(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:Y(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function qd(e){switch(e.kind){case"literal":return{kind:"literal",value:Y(e.value)};case"entityState":return{kind:"entityState",...Jt(e)};case"entityAttribute":return{kind:"entityAttribute",...Jt(e),attribute:Y(e.attribute)};case"entityAge":return{kind:"entityAge",...Jt(e)};case"aggregate":return{kind:"aggregate",aggregate:ag(U(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:Ee(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:Y(e.value)};case"named":return{kind:"named",id:Y(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:Y(e.layer).toUpperCase(),stat:bt.some(([n])=>n===e.stat)?e.stat:"latest"};default:throw new rt(`unknown value kind ${String(e.kind)}`)}}function we(e){if(!U(e))throw new rt("value must be an object");if(U(e.kind)){let i={kind:qd(e.kind)},a=jd(e.format);return a&&(i.format=a),i}let n={kind:qd(e)},t=jd(e.format);return t&&(n.format=t),n}function Ec(e){return U(e)?{x:ee(e.x,.25),y:ee(e.y,.25),width:ee(e.width,.5),height:ee(e.height,.5),rotationDegrees:ee(e.rotationDegrees,0)}:{...ea}}function rg(e){if(!U(e))return{kind:"isOn"};let n=Y(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=U(e.value)?we(e.value):G("");break;case"between":case"timeBetween":t.value=U(e.value)?we(e.value):G(""),t.upper=U(e.upper)?we(e.upper):G("");break;case"matchesRegex":t.pattern=Y(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function Yd(e){if(!U(e))return{kind:"show"};let n=Y(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=U(e.value)?we(e.value):G("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=ee(e.number,0);break;case"setFontWeight":t.weight=Ee(e.weight)??"regular";break;default:break}return t}function Rc(e){return Array.isArray(e)?e.filter(U).map(n=>{let t={id:Y(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(U).map(i=>{let a=U(i.when)?i.when:{};return{id:Y(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(U).map(r=>({id:Y(r.id).toUpperCase(),value:U(r.value)?we(r.value):G(""),comparison:rg(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Yd)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(Yd)),typeof n.partId=="string"&&n.partId!==""&&(t.partId=n.partId.toUpperCase()),t}):[]}function og(e,n){return{baseColorHex:U(e)?Y(e.baseColorHex,n):n}}function rr(e){return Array.isArray(e)?e.filter(U).map(n=>{let t={id:Y(n.id,te()),upTo:ee(n.upTo,0),colorHex:Y(n.colorHex,"#FFFFFF")};return typeof n.fillColorHex=="string"&&(t.fillColorHex=n.fillColorHex),typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),t}):[]}function ir(e){let n={id:e.id,upTo:Q(e.upTo),colorHex:e.colorHex};return e.fillColorHex!==void 0&&(n.fillColorHex=e.fillColorHex),e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n}function sg(e){return Array.isArray(e)?e.filter(U).map(n=>{let t={id:Y(n.id,te()).toUpperCase(),value:U(n.value)?we(n.value):G("")};typeof n.colorHex=="string"&&(t.colorHex=n.colorHex);let i=Ee(n.fontWeight);(i==="regular"||i==="medium"||i==="semibold"||i==="bold")&&(t.fontWeight=i),typeof n.fontSize=="number"&&(t.fontSize=n.fontSize),Ee(n.coloring)==="bands"&&(t.coloring="bands");let a=rr(n.bands);a.length>0&&(t.bands=a);let r=Y(n.bandAboveColorHex,he);return r!==he&&(t.bandAboveColorHex=r),t}):[]}function lg(e){if(Array.isArray(e.bands))return rr(e.bands);if(typeof e.bandLowerBound!="number")return[];let n=U(e.colorSlot)?Y(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:te(),upTo:e.bandLowerBound,colorHex:Y(e.bandLowColorHex,os)},{id:te(),upTo:ee(e.bandUpperBound,100),colorHex:n}]}function dg(e){return Array.isArray(e)?e.filter(U).map(n=>({id:Y(n.id,te()).toUpperCase(),match:Y(n.match,""),colorHex:Y(n.colorHex,on)})):[]}function et(e,n){if(typeof e.id!="string")throw new rt("element id is required");return{id:e.id.toUpperCase(),colorSlot:og(e.colorSlot,n),rules:Rc(e.rules),frame:Ec(e.frame),isHidden:e.isHidden===!0}}function cg(e){let n=ug(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),typeof t.name=="string"&&t.name!==""&&(n.payload.name=t.name),n}function ug(e){if(!U(e)||!U(e.payload))throw new rt("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...et(n,"#FFFFFF"),value:U(n.value)?we(n.value):G(""),fontSize:ee(n.fontSize,14),fontWeight:Ee(n.fontWeight)??"regular"};n.countdown===!0&&(t.countdown=!0),n.monospacedDigits===!0&&(t.monospacedDigits=!0);let i=typeof n.lineLimit=="number"?Math.round(n.lineLimit):1;Math.min(2,Math.max(1,i))===2&&(t.lineLimit=2);let a=Ee(n.alignment);(a==="leading"||a==="trailing")&&(t.alignment=a),Ee(n.coloring)==="bands"&&(t.coloring="bands");let r=rr(n.bands);r.length>0&&(t.bands=r);let o=Y(n.bandAboveColorHex,he);o!==he&&(t.bandAboveColorHex=o);let s=Ee(n.highlight);(s==="highest"||s==="lowest"||s==="both")&&(t.highlight=s);let l=Y(n.highColorHex,tt);l!==tt&&(t.highColorHex=l);let d=Y(n.lowColorHex,nt);d!==nt&&(t.lowColorHex=d);let c=sg(n.parts);return c.length>0&&(t.parts=c),tr(n,t),{kind:"text",payload:t}}case"icon":{let t={...et(n,"#FFFFFF"),symbol:U(n.symbol)?we(n.symbol):G("lightbulb"),size:ee(n.size,14)},i=Ee(n.path);return i!==void 0&&i!==""&&(t.path=i),tr(n,t),{kind:"icon",payload:t}}case"gauge":{let t={...et(n,"#FFFFFF"),value:U(n.value)?we(n.value):G("50"),minValue:ee(n.minValue,0),maxValue:ee(n.maxValue,100),style:Ee(n.style)??"arc",lineWidth:ee(n.lineWidth,4),trackColorHex:Y(n.trackColorHex,"#FFFFFF40"),coloring:Ee(n.coloring)??"uniform",bands:rr(n.bands),bandAboveColorHex:Y(n.bandAboveColorHex,he),thresholdColorHex:Y(n.thresholdColorHex,gi)},i=qi(n.thresholdValue);return i!==void 0&&(t.thresholdValue=i),U(n.total)&&(t.total=we(n.total)),U(n.minSource)&&(t.minSource=we(n.minSource)),U(n.maxSource)&&(t.maxSource=we(n.maxSource)),{kind:"gauge",payload:t}}case"chart":return{kind:"chart",payload:{...et(n,"#FFFFFF"),value:U(n.value)?we(n.value):G("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(ee(n.historyMinutes,0))),historyPoints:Math.round(ee(n.historyPoints,24)),source:Zo(Ee(n.source),Vf,as),statPeriod:Zo(Ee(n.statPeriod),cr,Zi),statType:Zo(Ee(n.statType),is,Qi),style:mi(n.style,["bars","line","area"],"bars"),limit:Math.max(0,Math.round(ee(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:mi(n.scale,["auto","fixed"],"auto"),minValue:ee(n.minValue,0),maxValue:ee(n.maxValue,100),baseline:mi(n.baseline,["lowest","zero"],"lowest"),barGap:ee(n.barGap,1.5),lineWidth:ee(n.lineWidth,2),highlight:mi(n.highlight,["none","highest","lowest","both"],"none"),highColorHex:Y(n.highColorHex,tt),lowColorHex:Y(n.lowColorHex,nt),marker:typeof n.marker=="string"?mi(n.marker,["none","dot","pointer"],"dot"):"pointer",...Wd(n.highMarker)?{highMarker:n.highMarker}:{},...Wd(n.lowMarker)?{lowMarker:n.lowMarker}:{},coloring:mi(n.coloring,["uniform","bands"],"uniform"),bands:lg(n),bandAboveColorHex:Y(n.bandHighColorHex,Y(n.bandAboveColorHex,he)),fillBands:n.fillBands===!0,...Kd(n.curve)!=="straight"?{curve:Kd(n.curve)}:{},...Qt(n.fillStyle)!=="flat"?{fillStyle:Qt(n.fillStyle)}:{},...typeof n.fillColorHex=="string"?{fillColorHex:n.fillColorHex}:{},...en(n.barRadius)!==fi?{barRadius:en(n.barRadius)}:{},...tn(n.barCorners)!=="all"?{barCorners:tn(n.barCorners)}:{},...typeof n.barBorderWidth=="number"&&Number.isFinite(n.barBorderWidth)&&n.barBorderWidth!==0?{barBorderWidth:n.barBorderWidth}:{},...typeof n.barBorderColorHex=="string"?{barBorderColorHex:n.barBorderColorHex}:{},...n.barBorderOpenBase===!0?{barBorderOpenBase:!0}:{},...typeof n.bandAboveFillColorHex=="string"?{bandAboveFillColorHex:n.bandAboveFillColorHex}:{},...typeof n.bandAboveBorderColorHex=="string"?{bandAboveBorderColorHex:n.bandAboveBorderColorHex}:{},...es(n.pointDots)!=="none"?{pointDots:es(n.pointDots)}:{},...gt(n.pointDotSize)!==void 0?{pointDotSize:gt(n.pointDotSize)}:{},...typeof n.pointDotColorHex=="string"?{pointDotColorHex:n.pointDotColorHex}:{},...ts(n.gridLines)!==0?{gridLines:ts(n.gridLines)}:{},...dc(Xt(n.gridColorHex),Pt)?{}:{gridColorHex:Xt(n.gridColorHex)},...n.zeroLine===!0?{zeroLine:!0}:{},...st(n.smoothing)!==void 0?{smoothing:st(n.smoothing)}:{},...n.gaps===!0?{gaps:!0}:{},...typeof n.thresholdValue=="number"&&Number.isFinite(n.thresholdValue)?{thresholdValue:n.thresholdValue}:{},thresholdColorHex:Y(n.thresholdColorHex,ss),...U(n.nowIndex)?{nowIndex:we(n.nowIndex)}:{},nowColorHex:Y(n.nowColorHex,ls),...n.drawsThreshold===!1?{drawsThreshold:!1}:{},...n.drawsNowLine===!1?{drawsNowLine:!1}:{},...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{},...Ee(n.scaleFrom)!==void 0?{scaleFrom:Ee(n.scaleFrom)}:{},timeLabelCount:yt(n.timeLabelCount),labelSize:ee(n.labelSize,it),labelColorHex:Y(n.labelColorHex,at),labelsAbove:n.labelsAbove===!0,hourCycle:Xo(n.hourCycle),minutes:Jo(n.minutes)}};case"timeline":{let{colorSlot:t,...i}=et(n,"#FFFFFF");return{kind:"timeline",payload:{...i,value:U(n.value)?we(n.value):G(""),historyMinutes:Math.max(1,Math.round(ee(n.historyMinutes,gs))),bands:dg(n.bands),otherColorHex:Y(n.otherColorHex,on),gap:Math.min(br,Math.max(0,ee(n.gap,0))),cornerRadius:Math.max(0,ee(n.cornerRadius,vc)),timeLabelCount:Yf(n),labelSize:ee(n.labelSize,it),labelColorHex:Y(n.labelColorHex,at),labelsAbove:n.labelsAbove===!0,hourCycle:Xo(n.hourCycle),minutes:Jo(n.minutes),...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{}}}}case"shape":{let t={...et(n,"#FFFFFF33"),kind:Ee(n.kind)??"roundedRectangle",cornerRadius:ee(n.cornerRadius,6),thickness:ee(n.thickness,1),borderWidth:ee(n.borderWidth,1)};return typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),tr(n,t),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=et(n,"#FFFFFF"),a={...i,entity:Jt(U(n.entity)?n.entity:{}),source:n.source==="entityPicture"?"entityPicture":"camera",contentMode:n.contentMode==="fit"?"fit":"fill",zoom:ee(n.zoom,1),panX:ee(n.panX,0),panY:ee(n.panY,0),cornerRadius:ee(n.cornerRadius,yi),timestampCorner:tg.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:ee(n.timestampSize,xr)};n.timestamp===!0&&(a.timestamp=!0);let r=qi(n.timestampX),o=qi(n.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=ft(r),a.timestampY=ft(o)),tr(n,a),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=et(n,"#FFFFFF"),a={...i,action:U(n.action)?Mc(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}case"chartTimes":{let{colorSlot:t,...i}=et(n,"#FFFFFF");return{kind:"chartTimes",payload:{...i,chart:Y(n.chart).toUpperCase(),timeLabelCount:yt(n.timeLabelCount),labelSize:ee(n.labelSize,it),labelColorHex:Y(n.labelColorHex,at),hourCycle:Xo(n.hourCycle),minutes:Jo(n.minutes)}}}case"imageTime":{let{colorSlot:t,...i}=et(n,"#FFFFFF");return{kind:"imageTime",payload:{...i,image:Y(n.image).toUpperCase()}}}case"chartDots":{let{colorSlot:t,...i}=et(n,"#FFFFFF"),a=gt(n.size);return{kind:"chartDots",payload:{...i,chart:Y(n.chart).toUpperCase(),dots:sr(n.dots),...a!==void 0?{size:a}:{},...typeof n.colorHex=="string"?{colorHex:n.colorHex}:{}}}}case"chartGrid":{let{colorSlot:t,...i}=et(n,"#FFFFFF");return{kind:"chartGrid",payload:{...i,chart:Y(n.chart).toUpperCase(),lines:Pn(n.lines),colorHex:Xt(n.colorHex),thickness:Nn(n.thickness)}}}default:throw new rt(`unknown element kind ${String(e.kind)}`)}}function Xd(e){let n=U(e)?e:{},t={};if(U(n.placements))for(let[a,r]of Object.entries(n.placements)){if(!U(r))continue;let o={frame:Ec(r.frame),isHidden:r.isHidden===!0},s=qi(r.size);s!==void 0&&(o.size=s),t[a.toUpperCase()]=o}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:ee(n.borderWidth,2),rules:Rc(n.rules)};if(U(n.bezelText)&&(i.bezelText=we(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),U(n.curvedText)&&(i.curvedText=we(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),U(n.bezelGauge)){let a=n.bezelGauge,r={value:U(a.value)?we(a.value):G("50"),minValue:ee(a.minValue,0),maxValue:ee(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};U(a.minLabel)&&(r.minLabel=we(a.minLabel)),U(a.maxLabel)&&(r.maxLabel=we(a.maxLabel)),i.bezelGauge=r}return typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function pg(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=Xd(e[t+1]))}else if(U(e))for(let[t,i]of Object.entries(e))n[t]=Xd(i);return n}function hg(e){let n={value:U(e.value)?we(e.value):G("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function Mc(e){if(!U(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Jt(e)};case"callService":{let n={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(n.target=Jt(e)),n}default:return{type:"none"}}}function bi(e){if(!U(e))throw new rt("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new rt(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(U).map(r=>({id:Y(r.id).toUpperCase(),name:Y(r.name),value:U(r.value)?we(r.value):G("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(U).map(r=>r.kind==="template"?{kind:"template",value:Y(r.value)}:r.kind==="entity"?{kind:"entity",...Jt(r)}:null).filter(r=>r!==null),i={schemaVersion:ee(e.schemaVersion,1),id:Y(e.id).toUpperCase(),name:Y(e.name,"Custom"),values:n,slotIndex:ee(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(cg),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:pg(e.perFamily),dataSources:t,tapAction:Mc(e.tapAction)};U(e.inline)&&(i.inline=hg(e.inline));let a=qi(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),e.hidden===!0&&(i.hidden=!0),Array.isArray(e.groups)){let r=e.groups.filter(U).filter(o=>typeof o.id=="string").map(o=>({id:Y(o.id).toUpperCase(),name:Y(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return kg(i,Array.isArray(e.elements)?e.elements:[]),ut(i),i}function ws(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function cn(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function mg(e,n){let t=or(e,Kn(n))?.ref;return t?.displayName||t?.entityId||(n.kind==="image"?"Picture":n.kind==="timeline"?"Timeline":"Chart")}function Ot(e,n,t){let i=ot(e,n.payload.id);if(i){sa(e,t,i.id);return}let a=Ms(e,[n.payload.id,t],mg(e,n)),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var Ac={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function Hc(e,n,t,i){let a=ce.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),s=e.x+n.x*e.width-n.x*r,l=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function Fc(e,n,t){let i=e.elements.find(d=>d.payload.id===n);if(!i||i.kind!=="chart")return;let a=Re("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};(t==="latest"||t==="delta"||t==="sum")&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"};let s=t==="trend"?2:o.format?.useEntityUnit?7:4;a.payload.frame=Hc(i.payload.frame,Ac[t],r,s);let l=e.elements.findIndex(d=>d.payload.id===n);return e.elements.splice(l+1,0,a),Ot(e,i,a.payload.id),a.payload.id}var Ic={highest:"arrowtriangle.up.fill",lowest:"circle.fill",now:"arrowtriangle.down.fill",first:"circle.fill",latest:"circle.fill",threshold:"circle.fill",zero:"circle.fill"},Jd=6,fg={"\u25B2":"arrowtriangle.up.fill","\u25BC":"arrowtriangle.down.fill","\u25CF":"circle.fill","\u25C6":"diamond.fill"};function gg(e,n){let t=(i,a)=>i!==void 0&&i!==a?i:void 0;return n==="highest"?t(e.payload.highColorHex,tt)??"#FFD60A":n==="lowest"?t(e.payload.lowColorHex,nt)??"#FF453A":"#FFFFFF"}function vs(e){e.nowIndex===void 0&&(e.nowIndex={kind:{kind:"time",timeField:"hour"}},e.drawsNowLine=!1)}function De(e,n){return e.elements.filter(t=>t.payload.chartAnchor?.layer===n)}function ks(e,n,t,i="above"){let a=e.elements.find(s=>s.payload.id===n);if(!a||a.kind!=="chart")return;t==="now"&&vs(a.payload);let r=Re("icon");r.payload.symbol=G(Ic[t]),r.payload.size=Jd,r.payload.colorSlot={baseColorHex:gg(a,t)},r.payload.frame=yg(Jd),r.payload.chartAnchor={layer:n,at:t,place:i};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),Ot(e,a,r.payload.id),r.payload.id}function Lc(e,n){let t=e.elements.findIndex(u=>u.payload.id===n),i=e.elements[t];if(!i||i.kind!=="text"||i.payload.chartAnchor===void 0)return;let a=i.payload,r=a.chartAnchor,o=u=>{let p=zn(u);return p===void 0?void 0:fg[p.trim()]},s=new Set(da.icon),l=u=>u.flatMap(p=>{if(p.kind==="setText"){let m=p.value===void 0?void 0:o(p.value);return m===void 0?[]:[{kind:"setIcon",value:G(m)}]}return s.has(Oe[p.kind])?[p]:[]}),d=a.rules.filter(u=>u.partId===void 0).map(u=>({...u,cases:u.cases.map(p=>({...p,then:l(p.then)})),...u.otherwise!==void 0?{otherwise:l(u.otherwise)}:{}})),c=Re("icon");c.payload={...c.payload,id:a.id,colorSlot:a.colorSlot,rules:d,frame:a.frame,isHidden:a.isHidden,...a.groupId!==void 0?{groupId:a.groupId}:{},...a.name!==void 0?{name:a.name}:{},chartAnchor:r,symbol:G(o(a.value)??Ic[r.at]),size:a.fontSize},e.elements[t]=c}function yg(e){let n=ce.rectangular;return{x:0,y:0,width:Math.min(1,e*1.2/n.width),height:Math.min(1,e*1.3/n.height),rotationDegrees:0}}function In(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;t==="now"&&vs(a);let r=Re("shape");r.payload.kind="line",r.payload.thickness=1,r.payload.borderWidth=0,r.payload.colorSlot={baseColorHex:t==="now"?a.nowColorHex:a.thresholdColorHex},r.payload.frame=_c(a.frame,t),r.payload.chartAnchor={layer:n,at:t,place:"through"};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),Ot(e,i,r.payload.id),t==="now"?a.drawsNowLine=!1:a.drawsThreshold=!1,r.payload.id}function _c(e,n){let t=ce.rectangular,i=3;return n==="now"?{...e,width:Math.min(e.width,i/t.width),rotationDegrees:0}:{...e,height:Math.min(e.height,i/t.height),rotationDegrees:0}}function un(e,n){return e.elements.filter(t=>t.kind==="chartTimes"&&t.payload.chart===n)}function Vn(e,n){let t=e.elements.find(o=>o.payload.id===n);if(!t||t.kind!=="chart"&&t.kind!=="timeline")return;let i=t.payload,a=Re("chartTimes");a.payload.chart=n,a.payload.timeLabelCount=i.timeLabelCount>0?yt(i.timeLabelCount):kc,a.payload.labelSize=i.labelSize,a.payload.labelColorHex=i.labelColorHex,a.payload.hourCycle=i.hourCycle,a.payload.minutes=i.minutes,a.payload.frame=vg(i.frame,i.labelSize,i.labelsAbove);let r=e.elements.findIndex(o=>o.payload.id===n);return e.elements.splice(r+1,0,a),Ot(e,t,a.payload.id),i.drawsTimeLabels=!1,a.payload.id}function $s(e,n){return e.elements.filter(t=>t.kind==="imageTime"&&t.payload.image===n)}function bg(e){let n=Math.min(40,Math.max(4,e));return{w:8*n*.578+n*.89,h:n*1.25}}function Cs(e,n){return Math.max(0,Math.min(e/(8*.578+.89),n/1.25))}function Ss(e,n,t=ce.rectangular){let i=e.elements.find(y=>y.payload.id===n);if(!i||i.kind!=="image")return;let a=i.payload,r=Re("imageTime");r.payload.image=n;let o=bg(a.timestampSize),s=a.frame.x*t.width,l=a.frame.y*t.height,d=a.frame.width*t.width,c=a.frame.height*t.height,u,p;if(wr(a)){let y=(b,$,k,v)=>v>=k?$+(k-v)/2:Math.min($+k-v,Math.max($,b-v/2));u=y(s+a.timestampX*d,s,d,o.w),p=y(l+a.timestampY*c,l,c,o.h)}else u=a.timestampCorner.endsWith("Leading")?s+4:s+d-4-o.w,p=a.timestampCorner.startsWith("top")?l+4:l+c-4-o.h;let m=y=>Math.round(y*1e3)/1e3;r.payload.frame={x:m(u/t.width),y:m(p/t.height),width:m(o.w/t.width),height:m(o.h/t.height),rotationDegrees:0};let g=e.elements.findIndex(y=>y.payload.id===n);return e.elements.splice(g+1,0,r),Ot(e,i,r.payload.id),delete a.timestamp,delete a.timestampX,delete a.timestampY,a.timestampCorner="topLeading",a.timestampSize=xr,r.payload.id}function Gn(e,n){return e.elements.filter(t=>t.kind==="chartDots"&&t.payload.chart===n)}function Un(e,n){return e.elements.filter(t=>t.kind==="chartGrid"&&t.payload.chart===n)}function Ts(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Re("chartDots");i.payload.chart=n,i.payload.dots=t.payload.pointDots==="all"?"all":"auto",i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),Ot(e,t,i.payload.id),i.payload.id}function Es(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Re("chartGrid");i.payload.chart=n,i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a,0,i),Ot(e,t,i.payload.id),i.payload.id}var xg="#FFFFFF66";function Rs(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Re("shape");i.payload.kind="line",i.payload.thickness=1,i.payload.borderWidth=0,i.payload.colorSlot={baseColorHex:xg},i.payload.frame=_c(t.payload.frame,"threshold"),i.payload.chartAnchor={layer:n,at:"zero",place:"through"};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),Ot(e,t,i.payload.id),i.payload.id}function Pc(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(t===void 0){delete a.thresholdValue,delete a.drawsThreshold;for(let r of De(e,n))r.payload.chartAnchor?.at==="threshold"&&ge(e,r.payload.id);return}a.thresholdValue=t,a.drawsThreshold=!1,De(e,n).some(r=>r.payload.chartAnchor?.at==="threshold")||In(e,n,"threshold")}function Nc(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(!t){delete a.nowIndex,delete a.drawsNowLine;for(let r of De(e,n))r.payload.chartAnchor?.at==="now"&&ge(e,r.payload.id);return}vs(a),a.drawsNowLine=!1,De(e,n).some(r=>r.payload.chartAnchor?.at==="now")||In(e,n,"now")}function zc(e){let n=e.elements.filter(t=>t.kind==="chart"||t.kind==="timeline"||t.kind==="image");for(let t of n){let i=t.payload,a=new Set(e.elements.map(l=>l.payload.id)),r=se.find(l=>e.perFamily[l]?.placements[i.id]!==void 0),o=i.frame,s=r===void 0?void 0:e.perFamily[r].placements[i.id];if(s&&(i.frame={...s.frame}),t.kind==="chart"&&wg(e,t.payload),t.kind==="timeline"&&t.payload.drawsTimeLabels!==!1&&t.payload.timeLabelCount>0&&Vn(e,i.id),t.kind==="image"&&t.payload.timestamp===!0&&Ss(e,i.id,ce[r===void 0||r==="inline"?"rectangular":r]),i.frame=o,!(r===void 0||s===void 0))for(let l of e.elements)a.has(l.payload.id)||(e.perFamily[r].placements[l.payload.id]={frame:{...l.payload.frame},isHidden:s.isHidden},l.payload.isHidden=!0)}}function wg(e,n){{if(n.highlight!==void 0&&n.highlight!=="none"){let a=Yi(n),r=[];(n.highlight==="highest"||n.highlight==="both")&&r.push(["highest",a.high]),(n.highlight==="lowest"||n.highlight==="both")&&r.push(["lowest",a.low]);for(let[o,s]of r){let l=ks(e,n.id,o),d=e.elements.find(c=>c.payload.id===l);d?.kind==="icon"&&s!=="none"&&(d.payload.symbol=G(s==="triangle"?"arrowtriangle.up.fill":"circle.fill"))}qf(n,{high:"none",low:"none"}),n.highlight="none"}n.thresholdValue!==void 0&&n.drawsThreshold!==!1&&In(e,n.id,"threshold"),n.nowIndex!==void 0&&n.drawsNowLine!==!1&&In(e,n.id,"now"),n.drawsTimeLabels!==!1&&On(n)&&n.timeLabelCount>0&&Vn(e,n.id);let t=es(n.pointDots);if(t!=="none"){let a=Ts(e,n.id),r=e.elements.find(o=>o.payload.id===a);if(r?.kind==="chartDots"){r.payload.dots=t;let o=gt(n.pointDotSize);o!==void 0&&(r.payload.size=o),typeof n.pointDotColorHex=="string"&&(r.payload.colorHex=n.pointDotColorHex)}}let i=ts(n.gridLines);if(i>0){let a=Es(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="chartGrid"&&(r.payload.lines=i,r.payload.colorHex=Xt(n.gridColorHex))}if(n.zeroLine===!0){let a=Rs(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="shape"&&(r.payload.colorSlot={baseColorHex:Xt(n.gridColorHex)})}delete n.pointDots,delete n.pointDotSize,delete n.pointDotColorHex,delete n.gridLines,delete n.gridColorHex,delete n.zeroLine}}function vg(e,n,t){let i=ce.rectangular,a=Math.max(sn,Math.min(ln,n)),r=Math.min(1,a*1.2/i.height),o=Math.min(1,Math.max(0,e.width)),s=t?e.y-r:e.y+e.height;return{x:Math.max(0,Math.min(1-o,e.x)),y:Math.max(0,Math.min(1-r,s)),width:o,height:r,rotationDegrees:0}}function kg(e,n){for(let t of n){if(!U(t)||t.kind!=="chart"||!U(t.payload))continue;let i=t.payload,a=Y(i.id).toUpperCase(),r=e.elements.find(p=>p.payload.id===a);if(!r||r.kind!=="chart")continue;let o=Y(i.scaleLabelColorHex,"#FFFFFF99"),s=p=>{let m=U(p)?p:{};return{fontSize:ee(m.fontSize,8),colorHex:Y(m.colorHex,o),pillColorHex:typeof m.pillColorHex=="string"?m.pillColorHex:void 0}},l=[],d=Ee(i.scaleLabels);(d==="top"||d==="range")&&l.push(["top",s(i.topLabelStyle)]),d==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let c=Ee(i.latestLabel);if((c==="corner"||c==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let u=e.elements.findIndex(p=>p.payload.id===a)+1;for(let[p,m]of l){let g=Hc(r.payload.frame,Ac[p],m.fontSize,p==="latest"?5:4),y=[];if(m.pillColorHex!==void 0){let $=Re("shape");$.payload.kind="capsule",$.payload.colorSlot={baseColorHex:m.pillColorHex},$.payload.frame={...g},y.push($)}let b=Re("text");b.payload.value={kind:{kind:"chartStat",layer:a,stat:p}},b.payload.fontSize=m.fontSize,b.payload.fontWeight="medium",b.payload.colorSlot={baseColorHex:m.colorHex},b.payload.frame=g,y.push(b),e.elements.splice(u,0,...y),u+=y.length;for(let $ of y)Ot(e,r,$.payload.id)}}}function Q(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function Zt(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function $g(e){let n={};return e.decimals!==void 0&&(n.decimals=Q(e.decimals)),e.multiply!==void 0&&(n.multiply=Q(e.multiply)),e.offset!==void 0&&(n.offset=Q(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.duration&&(n.duration=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function Cg(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(Zt)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function Sg(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...Zt(e)};case"entityAttribute":return{kind:"entityAttribute",...Zt(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...Zt(e)};case"aggregate":return{kind:"aggregate",aggregate:Cg(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function pe(e){let n={kind:Sg(e.kind)};return Pe(e.format)||(n.format=$g(e.format)),n}function Lt(e){return{x:Q(e.x),y:Q(e.y),width:Q(e.width),height:Q(e.height),rotationDegrees:Q(e.rotationDegrees)}}function Tg(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=pe(e.value??G(""));break;case"between":case"timeBetween":n.value=pe(e.value??G("")),n.upper=pe(e.upper??G(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function Zd(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=pe(e.value??G(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=Q(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;default:break}return n}function _t(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:pe(a.value),comparison:Tg(a.comparison)}))},then:i.then.map(Zd)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(Zd)),n.partId!==void 0&&(t.partId=n.partId),t})}function Eg(e){let n={id:e.id,value:pe(e.value)};return e.colorHex!==void 0&&(n.colorHex=e.colorHex),e.fontWeight!==void 0&&(n.fontWeight=e.fontWeight),e.fontSize!==void 0&&(n.fontSize=Q(e.fontSize)),e.coloring!==void 0&&e.coloring!=="uniform"&&(n.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(n.bands=e.bands.map(ir)),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==he&&(n.bandAboveColorHex=e.bandAboveColorHex),n}function Rg(e){let n=Mg(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),e.payload.name!==void 0&&(n.payload.name=e.payload.name),n}function Mg(e){let n=t=>({id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:_t(t.rules),frame:Lt(t.frame),isHidden:t.isHidden});switch(e.kind){case"text":{let t={...n(e.payload),value:pe(e.payload.value),fontSize:Q(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(t.countdown=!0),e.payload.monospacedDigits===!0&&(t.monospacedDigits=!0),e.payload.lineLimit===2&&(t.lineLimit=2),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(t.alignment=e.payload.alignment);let i=e.payload;return i.coloring!==void 0&&i.coloring!=="uniform"&&(t.coloring=i.coloring),i.bands!==void 0&&i.bands.length>0&&(t.bands=i.bands.map(ir)),i.bandAboveColorHex!==void 0&&i.bandAboveColorHex!==he&&(t.bandAboveColorHex=i.bandAboveColorHex),i.highlight!==void 0&&i.highlight!=="none"&&(t.highlight=i.highlight),i.highColorHex!==void 0&&i.highColorHex!==tt&&(t.highColorHex=i.highColorHex),i.lowColorHex!==void 0&&i.lowColorHex!==nt&&(t.lowColorHex=i.lowColorHex),i.parts!==void 0&&i.parts.length>0&&(t.parts=i.parts.map(Eg),lt(i)&&(t.value=pe(ta(i.parts)))),nr(i,t),{kind:"text",payload:t}}case"icon":{let t={...n(e.payload),symbol:pe(e.payload.symbol)};return e.payload.path!==void 0&&e.payload.path!==""&&(t.path=e.payload.path),t.size=Q(e.payload.size),nr(e.payload,t),{kind:"icon",payload:t}}case"gauge":{let t=e.payload,i={...n(t),value:pe(t.value),minValue:Q(t.minValue),maxValue:Q(t.maxValue),style:t.style,lineWidth:Q(t.lineWidth),trackColorHex:t.trackColorHex};return t.coloring!=="uniform"&&(i.coloring=t.coloring),t.bands.length>0&&(i.bands=t.bands.map(ir)),t.bandAboveColorHex!==he&&(i.bandAboveColorHex=t.bandAboveColorHex),t.thresholdValue!==void 0&&(i.thresholdValue=Q(t.thresholdValue)),t.thresholdColorHex!==gi&&(i.thresholdColorHex=t.thresholdColorHex),t.total!==void 0&&(i.total=pe(t.total)),t.minSource!==void 0&&(i.minSource=pe(t.minSource)),t.maxSource!==void 0&&(i.maxSource=pe(t.maxSource)),{kind:"gauge",payload:i}}case"chart":{let t=e.payload,i={...n(t),value:pe(t.value),historyMinutes:Math.max(0,Math.round(t.historyMinutes)),historyPoints:Math.round(t.historyPoints),style:t.style,limit:Math.max(0,Math.round(t.limit)),takeFromEnd:t.takeFromEnd,scale:t.scale,minValue:Q(t.minValue),maxValue:Q(t.maxValue),baseline:t.baseline,barGap:Q(t.barGap),lineWidth:Q(t.lineWidth),highlight:t.highlight,highColorHex:t.highColorHex,lowColorHex:t.lowColorHex,marker:hc(Yi(t)),coloring:t.coloring,bands:t.bands.map(ir),bandAboveColorHex:t.bandAboveColorHex,fillBands:t.fillBands};t.source!==as&&(i.source=t.source),t.statPeriod!==Zi&&(i.statPeriod=t.statPeriod),t.statType!==Qi&&(i.statType=t.statType),t.thresholdValue!==void 0&&(i.thresholdValue=Q(t.thresholdValue)),t.thresholdColorHex!==ss&&(i.thresholdColorHex=t.thresholdColorHex),t.nowIndex!==void 0&&(i.nowIndex=pe(t.nowIndex)),t.nowColorHex!==ls&&(i.nowColorHex=t.nowColorHex),t.drawsThreshold===!1&&(i.drawsThreshold=!1),t.drawsNowLine===!1&&(i.drawsNowLine=!1),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),t.scaleFrom!==void 0&&(i.scaleFrom=t.scaleFrom),t.labelSize!==it&&(i.labelSize=Q(t.labelSize)),t.labelColorHex!==at&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==An&&(i.timeLabelCount=yt(t.timeLabelCount)),t.hourCycle!==Hn&&(i.hourCycle=t.hourCycle),t.minutes!==Fn&&(i.minutes=t.minutes);let a=Yi(t);mc(a)||(i.highMarker=a.high,i.lowMarker=a.low);let r=t.curve??"straight";r!=="straight"&&(i.curve=r);let o=Qt(t.fillStyle);o!=="flat"&&(i.fillStyle=o),t.fillColorHex!==void 0&&(i.fillColorHex=t.fillColorHex);let s=en(t.barRadius);s!==fi&&(i.barRadius=Q(s));let l=tn(t.barCorners);l!=="all"&&(i.barCorners=l);let d=st(t.smoothing);return d!==void 0&&(i.smoothing=d),t.gaps===!0&&(i.gaps=!0),t.barBorderWidth!==void 0&&t.barBorderWidth!==0&&(i.barBorderWidth=Q(t.barBorderWidth)),t.barBorderColorHex!==void 0&&(i.barBorderColorHex=t.barBorderColorHex),t.bandAboveFillColorHex!==void 0&&(i.bandAboveFillColorHex=t.bandAboveFillColorHex),t.bandAboveBorderColorHex!==void 0&&(i.bandAboveBorderColorHex=t.bandAboveBorderColorHex),t.barBorderOpenBase===!0&&(i.barBorderOpenBase=!0),{kind:"chart",payload:i}}case"timeline":{let t=e.payload,i={id:t.id,rules:_t(t.rules),frame:Lt(t.frame),isHidden:t.isHidden,value:pe(t.value)};return t.historyMinutes!==gs&&(i.historyMinutes=Math.max(1,Math.round(t.historyMinutes))),t.bands.length>0&&(i.bands=t.bands.map(a=>({id:a.id,match:a.match,colorHex:a.colorHex}))),t.otherColorHex!==on&&(i.otherColorHex=t.otherColorHex),t.gap!==0&&(i.gap=Q(t.gap)),t.cornerRadius!==vc&&(i.cornerRadius=Q(t.cornerRadius)),t.labelSize!==it&&(i.labelSize=Q(t.labelSize)),t.labelColorHex!==at&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==An&&(i.timeLabelCount=Math.max(0,Math.min(Bn,Math.round(t.timeLabelCount)))),t.hourCycle!==Hn&&(i.hourCycle=t.hourCycle),t.minutes!==Fn&&(i.minutes=t.minutes),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),{kind:"timeline",payload:i}}case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:Q(e.payload.cornerRadius),borderWidth:Q(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(t.thickness=Q(e.payload.thickness)),nr(e.payload,t),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id,entity:Zt(t.entity),rules:_t(t.rules),frame:Lt(t.frame),isHidden:t.isHidden};t.source!=="camera"&&(i.source=t.source),t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=Q(t.zoom)),t.panX!==0&&(i.panX=Q(t.panX)),t.panY!==0&&(i.panY=Q(t.panY)),t.cornerRadius!==yi&&(i.cornerRadius=Q(t.cornerRadius));let a=wr(t),r=a?ng(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==xr&&(i.timestampSize=Q(t.timestampSize)),a&&(i.timestampX=Q(t.timestampX),i.timestampY=Q(t.timestampY)),nr(t,i),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:Dc(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=_t(t.rules),i.frame=Lt(t.frame),i.isHidden=t.isHidden,{kind:"tap",payload:i}}case"chartTimes":{let t=e.payload,i={id:t.id,rules:_t(t.rules),frame:Lt(t.frame),isHidden:t.isHidden,chart:t.chart};return t.labelSize!==it&&(i.labelSize=Q(t.labelSize)),t.labelColorHex!==at&&(i.labelColorHex=t.labelColorHex),t.timeLabelCount!==An&&(i.timeLabelCount=yt(t.timeLabelCount)),t.hourCycle!==Hn&&(i.hourCycle=t.hourCycle),t.minutes!==Fn&&(i.minutes=t.minutes),{kind:"chartTimes",payload:i}}case"imageTime":{let t=e.payload,i={id:t.id,rules:_t(t.rules),frame:Lt(t.frame),isHidden:t.isHidden};return t.image!==""&&(i.image=t.image),{kind:"imageTime",payload:i}}case"chartDots":{let t=e.payload,i={id:t.id,rules:_t(t.rules),frame:Lt(t.frame),isHidden:t.isHidden,chart:t.chart};sr(t.dots)!=="auto"&&(i.dots="all");let a=gt(t.size);return a!==void 0&&(i.size=Q(a)),t.colorHex!==void 0&&(i.colorHex=t.colorHex),{kind:"chartDots",payload:i}}case"chartGrid":{let t=e.payload,i={id:t.id,rules:_t(t.rules),frame:Lt(t.frame),isHidden:t.isHidden,chart:t.chart},a=Pn(t.lines);a!==an&&(i.lines=a);let r=Xt(t.colorHex);dc(r,Pt)||(i.colorHex=r);let o=Nn(t.thickness);return o!==nn&&(i.thickness=Q(o)),{kind:"chartGrid",payload:i}}}}function Ag(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:Lt(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=Q(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=pe(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=pe(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:pe(i.value),minValue:Q(i.minValue),maxValue:Q(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=pe(i.minLabel)),i.maxLabel&&(a.maxLabel=pe(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=Q(e.borderWidth),e.rules.length>0&&(n.rules=_t(e.rules)),n}function Dc(e){if(e.type==="callService"){let n={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(n,Zt(e.target)),n}return"entityId"in e?{type:e.type,...Zt(e)}:{type:e.type}}function Hg(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=pe(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function xi(e){let n=[];for(let i of se){let a=e.perFamily[i];a&&n.push(i,Ag(a))}let t={schemaVersion:_n(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:pe(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(Rg),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...Zt(i)}),tapAction:Dc(e.tapAction)};return e.inline!==void 0&&(t.inline=Hg(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),e.hidden===!0&&(t.hidden=!0),t}function Oc(e){return U(e)&&e.hidden===!0}function Bc(e,n){let t={...e};return n?t.hidden=!0:delete t.hidden,t}function Vc(e,n,t){let i=[],a=[];for(let r of e){let o=n(r);o!==void 0&&o.hidden&&o.id!==t?a.push(r):i.push(r)}return{shown:i,hidden:a}}function ot(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function ct(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!ve(e,t))}function Gc(e,n){let t=new Set;for(let i of n){let a=ot(e,i);if(a)for(let r of ct(e,a.id))t.add(r.payload.id);else t.add(i)}return e.elements.filter(i=>t.has(i.payload.id)&&i.kind!=="chartDots"&&i.kind!=="chartGrid"&&i.payload.chartAnchor===void 0).map(i=>i.payload.id)}function ut(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function wi(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!ve(e,r)),t=e.elements.filter(r=>ve(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=n.filter(d=>d.payload.groupId===s);for(let d=l.length-1;d>=0;d--)i.unshift(l[d]),a.add(l[d].payload.id)}e.elements=[...i,...t],pn(e)}function Ms(e,n,t="Group"){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!ve(e,r));if(i.length<2)return;let a={id:te(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return ut(e),wi(e),a.id}function vi(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;ut(e)}function sa(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||ve(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,ut(e),wi(e))}var oe={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups","hidden"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],chartAnchor:["layer","at","place","dx","dy"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId","name"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts","chartAnchor"],textPart:["id","value","colorHex","fontWeight","fontSize","coloring","bands","bandAboveColorHex"],icon:["symbol","path","size","chartAnchor"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","curve","fillStyle","fillColorHex","barRadius","barCorners","smoothing","gaps","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","pointDots","pointDotSize","pointDotColorHex","gridLines","gridColorHex","zeroLine","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes","drawsTimeLabels"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth","chartAnchor"],image:["entity","source","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY","chartAnchor"],tap:["action","openPageId","openPageName","attachedTo","grow"],chartTimes:["chart","timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["chart","dots","size","colorHex"],chartGrid:["chart","lines","colorHex","thickness"],imageTime:["image","size"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON"]},Qd={literal:["kind","value"],entityState:["kind",...oe.entityRef],entityAttribute:["kind",...oe.entityRef,"attribute"],entityAge:["kind",...oe.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function kr(e){let n=[],t=(l,d,c)=>{if(U(l))for(let u of Object.keys(l))d.includes(u)||n.push(`${c}.${u}`)},i=(l,d)=>{if(!U(l))return;let c=typeof l.kind=="string"?l.kind:"";t(l,Qd[c]??["kind"],d),c==="aggregate"&&U(l.aggregate)&&(t(l.aggregate,oe.aggregate,`${d}.aggregate`),t(l.aggregate.scope,oe.scope,`${d}.aggregate.scope`),U(l.aggregate.scope)&&Array.isArray(l.aggregate.scope.entities)&&l.aggregate.scope.entities.forEach((u,p)=>t(u,oe.entityRef,`${d}.aggregate.scope.entities[${p}]`)),t(l.aggregate.stateFilter,oe.stateFilter,`${d}.aggregate.stateFilter`))},a=(l,d)=>{if(U(l)){if(U(l.kind))t(l,oe.value,d),i(l.kind,`${d}.kind`);else{let c=typeof l.kind=="string"?l.kind:"";t(l,[...Qd[c]??["kind"],"format"],d),c==="aggregate"&&i(l,d)}t(l.format,oe.format,`${d}.format`)}},r=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{t(c,oe.styleChange,`${d}[${u}]`),U(c)&&a(c.value,`${d}[${u}].value`)})},o=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{let p=`${d}[${u}]`;t(c,oe.rule,p),U(c)&&(Array.isArray(c.cases)&&c.cases.forEach((m,g)=>{let y=`${p}.cases[${g}]`;t(m,oe.case,y),U(m)&&(t(m.when,oe.condition,`${y}.when`),U(m.when)&&Array.isArray(m.when.tests)&&m.when.tests.forEach((b,$)=>{let k=`${y}.when.tests[${$}]`;t(b,oe.test,k),U(b)&&(a(b.value,`${k}.value`),t(b.comparison,oe.comparison,`${k}.comparison`),U(b.comparison)&&(a(b.comparison.value,`${k}.comparison.value`),a(b.comparison.upper,`${k}.comparison.upper`)))}),r(m.then,`${y}.then`))}),r(c.otherwise,`${p}.otherwise`))})};if(!U(e))return n;t(e,oe.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((l,d)=>t(l,oe.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((l,d)=>{t(l,oe.named,`$.values[${d}]`),U(l)&&a(l.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((l,d)=>{let c=`$.elements[${d}]`;if(t(l,oe.elementEnvelope,c),!U(l)||!U(l.payload))return;let u=typeof l.kind=="string"?l.kind:"",p=oe[u]??[];t(l.payload,[...oe.elementBase,...p],`${c}.payload`),t(l.payload.colorSlot,oe.colorSlot,`${c}.payload.colorSlot`),t(l.payload.frame,oe.frame,`${c}.payload.frame`),"chartAnchor"in l.payload&&t(l.payload.chartAnchor,oe.chartAnchor,`${c}.payload.chartAnchor`),o(l.payload.rules,`${c}.payload.rules`);for(let m of["value","symbol","nowIndex","total","minSource","maxSource"])m in l.payload&&a(l.payload[m],`${c}.payload.${m}`);u==="text"&&Array.isArray(l.payload.parts)&&l.payload.parts.forEach((m,g)=>{t(m,oe.textPart,`${c}.payload.parts[${g}]`),U(m)&&a(m.value,`${c}.payload.parts[${g}].value`)}),u==="image"&&t(l.payload.entity,oe.entityRef,`${c}.payload.entity`),u==="tap"&&t(l.payload.action,oe.tapAction,`${c}.payload.action`)});let s=[];if(Array.isArray(e.perFamily))for(let l=0;l+1<e.perFamily.length;l+=2)s.push([String(e.perFamily[l]),e.perFamily[l+1]]);else U(e.perFamily)&&s.push(...Object.entries(e.perFamily));for(let[l,d]of s){let c=`$.perFamily.${l}`;if(t(d,oe.layout,c),!!U(d)){if(U(d.placements))for(let[u,p]of Object.entries(d.placements))t(p,oe.placement,`${c}.placements.${u}`),U(p)&&t(p.frame,oe.frame,`${c}.placements.${u}.frame`);if(a(d.bezelText,`${c}.bezelText`),a(d.curvedText,`${c}.curvedText`),U(d.bezelGauge)){let u=`${c}.bezelGauge`;t(d.bezelGauge,oe.bezelGauge,u),a(d.bezelGauge.value,`${u}.value`),a(d.bezelGauge.minLabel,`${u}.minLabel`),a(d.bezelGauge.maxLabel,`${u}.maxLabel`)}o(d.rules,`${c}.rules`)}}return U(e.inline)&&(t(e.inline,oe.inline,"$.inline"),a(e.inline.value,"$.inline.value")),t(e.tapAction,oe.tapAction,"$.tapAction"),n}function te(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function Bt(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function Uc(e,n,t=[...se]){let i={};for(let r of se)t.includes(r)&&(i[r]=Bt());let a={schemaVersion:4,id:te(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:ji.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:G("Text")}),a.schemaVersion=_n(a),a}function Re(e){let n=t=>({id:te(),colorSlot:{baseColorHex:t},rules:[],frame:{...ea},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:G("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:G("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:G("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:he,thresholdColorHex:gi}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:G("13,14,16,17,19,22,24,28,30"),historyMinutes:fr,historyPoints:24,source:as,statPeriod:Zi,statType:Qi,style:"bars",curve:"smooth",fillStyle:"fade",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:tt,lowColorHex:nt,marker:"none",coloring:"uniform",bands:[],bandAboveColorHex:he,fillBands:!1,thresholdColorHex:ss,nowColorHex:ls,timeLabelCount:An,labelSize:it,labelColorHex:at,labelsAbove:!1,hourCycle:Hn,minutes:Fn}};case"timeline":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,value:G(""),historyMinutes:Zf,bands:[],otherColorHex:Xf,gap:0,cornerRadius:Jf,timeLabelCount:kc,labelSize:it,labelColorHex:at,labelsAbove:!1,hourCycle:Hn,minutes:Fn}}}case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:yi,timestampCorner:"topLeading",timestampSize:xr}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}case"chartTimes":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",timeLabelCount:An,labelSize:it,labelColorHex:at,hourCycle:Hn,minutes:Fn}}}case"imageTime":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,image:""}}}case"chartDots":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",dots:"auto"}}}case"chartGrid":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",lines:an,colorHex:Pt,thickness:nn}}}}}function G(e){return{kind:{kind:"literal",value:e}}}function $r(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return}}var ec=["circular","corner"],tc=Math.SQRT1_2;function Fg(e){return e==="text"||e==="icon"?4:.5}function Cr(e,n,t,i){let a=structuredClone(e),r=ce[n],o=ce[t];if(n===t||!r||!o)return a;let s=ec.includes(n),l=ec.includes(t),d=s===l?1:l?tc:1/tc,c=Math.min(o.width/r.width,o.height/r.height)*d;if(d!==1){let u=a.frame,p=u.x+u.width/2,m=u.y+u.height/2;a.frame={...u,width:u.width*d,height:u.height*d,x:.5+(p-.5)*d-u.width*d/2,y:.5+(m-.5)*d-u.height*d/2}}return a.size!==void 0&&(a.size=Math.max(Fg(i),Math.round(a.size*c*10)/10)),a}function Kc(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>{let a=t.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Kn(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return}}function Ji(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var As=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function or(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=ws(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function Hs(e,n){return or(e,Kn(n))?.ref}function Fs(e,n){let t=Hs(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&As.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function nc(e,n,t){if(vr(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,s=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=ft(a),r=ft(r),o=ft(o),s=ft(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function Wc(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function jc(e,n,t,i){let a=e.elements.find(p=>p.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(p=>p.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,s=ft(i.x),l=ft(i.y),d=ft(i.x+i.width),c=ft(i.y+i.height),u={...i,x:s,y:l,width:Math.max(0,d-s),height:Math.max(0,c-l)};a.payload.outset=Wc(o,u,ce[t])}function qc(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=ce[t];return{width:r.width*o.width,height:r.height*o.height}}function Ye(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function ve(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function Sr(e,n){let t=e.elements.find(i=>i.payload.id===n);if(t){if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}}function pn(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=t.get(r);s?s.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=Wc(o.payload.frame,l.frame,ce.rectangular));let d=l.outset,c=!vr(d);s.payload.frame=nc(o.payload.frame,d,ce.rectangular),s.payload.isHidden=o.payload.isHidden;let u=Ng(e,a);for(let p of se){let m=e.perFamily[p];if(!m)continue;let g=ce[p],y=m.placements[a];p!==u||!y?delete m.placements[s.payload.id]:c?m.placements[s.payload.id]={frame:nc(y.frame,d,g),isHidden:y.isHidden}:m.placements[s.payload.id]={frame:{...y.frame},isHidden:y.isHidden}}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function Tr(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind==="tap")return;let a=Ye(e,n)[0];if(a)return a.payload;let r=Re("tap"),o=r.payload;return o.attachedTo=n,o.outset={...bs},o.action=t??Fs(e,i),e.elements.push(r),pn(e),o}function Er(e,n){let t=Ye(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of se)for(let a of t)delete e.perFamily[i]?.placements[a]}}function ge(e,n){for(let a of cn(e,n))ge(e,a.payload.id);for(let a of un(e,n))ge(e,a.payload.id);for(let a of Gn(e,n))ge(e,a.payload.id);for(let a of Un(e,n))ge(e,a.payload.id);for(let a of $s(e,n))ge(e,a.payload.id);for(let a of De(e,n))delete a.payload.chartAnchor;let t=e.elements.find(a=>a.payload.id===n);Er(e,n),e.elements=e.elements.filter(a=>a.payload.id!==n);let i=t?.payload.chartAnchor;if(i&&(i.at==="threshold"||i.at==="now")&&!De(e,i.layer).some(a=>a.payload.chartAnchor?.at===i.at)){let a=e.elements.find(r=>r.payload.id===i.layer);a?.kind==="chart"&&(i.at==="threshold"?(delete a.payload.thresholdValue,delete a.payload.drawsThreshold):(delete a.payload.nowIndex,delete a.payload.drawsNowLine))}for(let a of e.elements)a.kind==="chart"&&a.payload.scaleFrom===n&&delete a.payload.scaleFrom;for(let a of se)delete e.perFamily[a]?.placements[n];pn(e),ut(e),t&&Lg(e,t.payload.groupId,Ig(t))}function Ig(e){if(e.payload.chartAnchor)return e.payload.chartAnchor.layer;switch(e.kind){case"text":return e.payload.value.kind.kind==="chartStat"?e.payload.value.kind.layer:void 0;case"chartTimes":return e.payload.chart;case"chartDots":return e.payload.chart;case"chartGrid":return e.payload.chart;case"imageTime":return e.payload.image;default:return}}function Lg(e,n,t){if(n===void 0||t===void 0||!e.groups?.some(a=>a.id===n))return;let i=ct(e,n);i.length===1&&i[0].payload.id===t&&vi(e,n)}function Yc(e,n){let t=e.elements.findIndex(l=>l.payload.id===n),i=e.elements[t];if(!i)return;let a=te(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[n,a]];for(let l of Ye(e,n)){let d=structuredClone(l);d.payload.id=te(),d.payload.attachedTo=a,o.push(d),s.push([l.payload.id,d.payload.id])}e.elements.splice(t+1,0,...o);for(let l of se){let d=e.perFamily[l];if(d)for(let[c,u]of s){let p=d.placements[c];p&&(d.placements[u]=structuredClone(p))}}return pn(e),a}function _g(e,n){let t=/^(.*\S) \d+$/.exec(e)?.[1]??e,i=new Set(n),a=2;for(;i.has(`${t} ${a}`);)a++;return`${t} ${a}`}function Xc(e,n,t){let i=e.elements.findIndex(s=>s.payload.id===n),a=e.elements[i];if(!a||a.kind!=="chart")return;let r=te(),o=structuredClone(a);o.payload.id=r,o.payload.scaleFrom=n,t&&(o.payload.name=_g(t(a),e.elements.map(t))),e.elements.splice(i+1,0,o);for(let s of se){let l=e.perFamily[s],d=l?.placements[n];l&&d&&(l.placements[r]=structuredClone(d))}return r}function ki(e,n,t){let i=new Set,a=d=>{i.add(d);for(let c of Ye(e,d))i.add(c.payload.id)};for(let d of n){a(d);for(let c of cn(e,d))a(c.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o={};for(let d of se){let c=e.perFamily[d];if(!c)continue;let u={};for(let p of r){let m=c.placements[p.payload.id];m&&(u[p.payload.id]=structuredClone(m))}Object.keys(u).length>0&&(o[d]=u)}let s=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),l=(e.groups??[]).filter(d=>s.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:o,groups:l,...t!==void 0?{family:t}:{}}}function Jc(e,n,t){let i=n.family,a=i!==void 0&&i!==t&&se.includes(i);if(!se.includes(t))return Ln(e,n);let r=Ln(e,n,a?{nudge:!1}:{}),o=e.perFamily[t]??(e.perFamily[t]=Bt());for(let s of r){let l=e.elements.find(p=>p.payload.id===s);if(!l)continue;let d=(i!==void 0?e.perFamily[i]?.placements[s]:void 0)??se.map(p=>e.perFamily[p]?.placements[s]).find(p=>p!==void 0),c=d?.size??$r(l),u={frame:{...d?.frame??l.payload.frame},isHidden:!1,...c!==void 0?{size:c}:{}};for(let p of se)p!==t&&delete e.perFamily[p]?.placements[s];o.placements[s]=a?Cr(u,i,t,l.kind):u}return $i(e,t),r}function Ln(e,n,t={}){let i=new Map;for(let d of n.elements)i.set(d.payload.id,te());let a=new Set(e.elements.map(d=>d.payload.id)),r=t.nudge!==!1&&n.elements.some(d=>a.has(d.payload.id)),o=d=>r?{...d,x:Math.min(.9,d.x+.05),y:Math.min(.9,d.y+.05)}:d,s=[];for(let d of n.elements){let c=structuredClone(d);if(c.payload.id=i.get(d.payload.id),c.kind==="tap"&&c.payload.attachedTo!==void 0){let u=i.get(c.payload.attachedTo);u?c.payload.attachedTo=u:delete c.payload.attachedTo}if(c.kind==="chart"&&c.payload.scaleFrom!==void 0){let u=i.get(c.payload.scaleFrom);u?c.payload.scaleFrom=u:a.has(c.payload.scaleFrom)||delete c.payload.scaleFrom}if(c.kind==="text")for(let u of c.payload.parts??[]){let p=u.value.kind,m=p.kind==="chartStat"?i.get(p.layer):void 0;p.kind==="chartStat"&&m&&(p.layer=m)}if(c.kind==="text"&&c.payload.value.kind.kind==="chartStat"){let u=i.get(c.payload.value.kind.layer);if(u)c.payload.value.kind.layer=u;else if(!a.has(c.payload.value.kind.layer))continue}if(c.kind==="chartTimes"||c.kind==="chartDots"||c.kind==="chartGrid"){let u=i.get(c.payload.chart);if(u)c.payload.chart=u;else if(!a.has(c.payload.chart))continue}if(c.kind==="imageTime"){let u=i.get(c.payload.image);if(u)c.payload.image=u;else if(!a.has(c.payload.image))continue}if(c.payload.chartAnchor!==void 0){let u=i.get(c.payload.chartAnchor.layer);u?c.payload.chartAnchor.layer=u:a.has(c.payload.chartAnchor.layer)||delete c.payload.chartAnchor}c.payload.frame=o(c.payload.frame),s.push(c)}let l=new Map;for(let d of n.groups){if(s.filter(p=>p.payload.groupId===d.id&&!(p.kind==="tap"&&p.payload.attachedTo!==void 0)).length<2)continue;let u=te();l.set(d.id,u),(e.groups??=[]).push({...structuredClone(d),id:u})}for(let d of s){if(d.payload.groupId===void 0)continue;let c=l.get(d.payload.groupId);c?d.payload.groupId=c:delete d.payload.groupId}e.elements.push(...s);for(let d of se){let c=n.placements[d],u=e.perFamily[d];if(!(!c||!u))for(let[p,m]of Object.entries(c)){let g=i.get(p);g&&s.some(y=>y.payload.id===g)&&(u.placements[g]={...structuredClone(m),frame:o(m.frame)})}}return pn(e),ut(e),wi(e),s.filter(d=>!ve(e,d)).map(d=>d.payload.id)}function Pg(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?!a.isHidden:!t.payload.isHidden}function Ng(e,n){let t=e.elements.find(r=>r.payload.id===n),a=(t&&t.kind==="tap"?t.payload.attachedTo:void 0)??n;return se.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[a]!==void 0)}function kt(e,n){let t=e.perFamily[n];return t?e.elements.filter(i=>{let a=i.kind==="tap"?i.payload.attachedTo:void 0;return t.placements[a??i.payload.id]!==void 0}):[]}function Zc(e,n){let t=e.perFamily[n];return t?kt(e,n).filter(i=>!ve(e,i)&&!t.placements[i.payload.id]?.isHidden).length:0}function $i(e,n){let t=se.filter(s=>e.supportedFamilies.includes(s));if(t.length===0)return;let i=n!==void 0&&t.includes(n)?n:t[0];for(let s of t)e.perFamily[s]||(e.perFamily[s]=Bt());let a=()=>e.elements.filter(s=>!ve(e,s)),r=new Map,o=new Set;if(n===void 0){let s=new Map(a().map(p=>[p.payload.id,t.filter(m=>Pg(e,m,p))]));for(let[p,m]of s)m[0]&&r.set(p,m[0]);let l=new Map([...a().entries()].map(([p,m])=>[m.payload.id,p]));for(let p of t){let m=a().filter(b=>(s.get(b.payload.id)??[]).includes(p)&&r.get(b.payload.id)!==p).map(b=>b.payload.id);if(m.length===0)continue;let g=ki(e,m,p),y=Ln(e,g,{nudge:!1});y.forEach((b,$)=>{r.set(b,p);let k=y.length===m.length?m[$]:void 0;l.set(b,k!==void 0?l.get(k)??0:l.size)})}for(let p of a())r.has(p.payload.id)||o.add(p.payload.id);let d=p=>t.indexOf(r.get(p)??i),c=a().sort((p,m)=>d(p.payload.id)-d(m.payload.id)||(l.get(p.payload.id)??0)-(l.get(m.payload.id)??0)),u=[];for(let p of c)u.push(p),u.push(...Ye(e,p.payload.id));e.elements=u}for(let s of a()){let l=s.payload.id,d=t.filter(m=>e.perFamily[m].placements[l]!==void 0),c=r.get(l)??d.find(m=>!e.perFamily[m].placements[l].isHidden)??d[0]??i,u=e.perFamily[c]?.placements[l],p={frame:{...u?.frame??s.payload.frame},isHidden:o.has(l)||u?.isHidden===!0,...u?.size!==void 0?{size:u.size}:{}};s.payload.isHidden=!0;for(let m of se){let g=e.perFamily[m];g&&(m===c?g.placements[l]=p:delete g.placements[l])}}}function Rr(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=or(e,Kn(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of Ye(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=or(e,s.value);if(!l)continue;let d={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(d.namedId=l.namedId),i.push(d)}return i}function Qo(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"||t==="timeline"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function Qc(e,n,t,i){let a=e.elements.find(o=>o.payload.id===n);if(!a||t.entityId==="")return;let r={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(a.kind==="timeline"){let o=a.payload.value.kind.kind==="entityState"?a.payload.value.kind.entityId:void 0,s=Qo(a.payload.value,r,a.kind);s&&(a.payload.value=s),(a.payload.bands.length===0||o!==r.entityId)&&(a.payload.bands=ys(r.domain,i))}else if(a.kind==="image")a.payload.entity=r;else if(a.kind==="text"||a.kind==="gauge"||a.kind==="chart"){let o=Qo(a.payload.value,r,a.kind);o&&(a.payload.value=o)}else if(a.kind==="icon"){let o=Qo(a.payload.symbol,r,a.kind);o&&(a.payload.symbol=o)}for(let o of Ye(e,n)){let s=o.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var zg={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area",chartTimes:"clock times",chartDots:"chart dots",chartGrid:"chart grid",imageTime:"timestamp"};function ic(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function ac(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let n=e.layerKind===void 0?"":zg[e.layerKind],t=e.layerName?`${n} "${e.layerName}"`:n;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${t}`:e.part==="gaugeMin"?`Min on ${t}`:e.part==="gaugeMax"?`Max on ${t}`:e.part==="nowIndex"?`Now marker on ${t}`:e.part==="textPart"?`Part of ${t}`:`${ic(n)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return t===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${t}`;case"layout":{let i=ic(e.family??"");switch(e.part){case"curvedText":return`${i} curved text`;case"bezelGauge":return`${i} bezel gauge`;case"bezelGaugeMin":return`${i} bezel gauge low label`;case"bezelGaugeMax":return`${i} bezel gauge high label`;default:return`${i} bezel`}}case"inline":return"Inline"}}var eu=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g;function Dg(e){let n=[];for(let t of e.matchAll(eu))t[2]!==void 0&&n.push(t[2]);return n}function Is(e,n){return n.size===0?e:e.replace(eu,(t,i,a)=>{let r=n.get(a);return r===void 0?t:`${i}${r}${i}`})}function Wi(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Og(e,n){if(n.payload.name)return n.payload.name;if(n.kind==="shape")return n.payload.kind==="roundedRectangle"?"rounded rectangle":n.payload.kind;if(n.kind==="tap")return"";if(n.kind==="image")return n.payload.entity.displayName||n.payload.entity.entityId;let t=Kn(n)?.kind;if(t===void 0)return"";if(t.kind==="literal")return t.value;if("entityId"in t)return t.displayName||t.entityId;if(t.kind==="named"){let i=t.id.toUpperCase();return e.values.find(a=>a.id.toUpperCase()===i)?.name??""}return""}function Mr(e,n){let t=(r,o)=>{n.value?.(r,o);let s=r.kind;if(s.kind==="jinja"){if(n.text){let d=n.text(s.value,{...o,part:"template"});d!==s.value&&(s.value=d)}return}if(s.kind==="aggregate"){let d=s.aggregate.scope;if(n.ref&&d.kind==="entities")for(let c=0;c<d.entities.length;c++){let u=n.ref(Wi(d.entities[c]),o);u&&(d.entities[c]=u)}return}if(!n.ref||!("entityId"in s))return;let l=n.ref(Wi(s),o);l&&(s.kind==="entityAttribute"?r.kind={kind:"entityAttribute",...l,attribute:s.attribute}:s.kind==="entityState"?r.kind={kind:"entityState",...l}:r.kind={kind:"entityAge",...l})},i=(r,o,s)=>{if(r.type==="callService"){if(n.ref&&r.target!==void 0&&r.target.entityId!==""){let d=n.ref(Wi(r.target),o);d&&(r.target=d)}if(n.text&&r.serviceDataJSON!==void 0){let d=n.text(r.serviceDataJSON,{...o,part:"serviceData"});d!==r.serviceDataJSON&&(r.serviceDataJSON=d)}return}if(!n.ref||!("entityId"in r)||r.entityId==="")return;let l=n.ref(Wi(r),o);l&&s({type:r.type,...l})};for(let r of e.values)t(r.value,{kind:"named",valueId:r.id,valueName:r.name});for(let r of e.elements){let o={kind:"layer",layerId:r.payload.id,layerKind:r.kind,layerName:Og(e,r)};if(r.kind==="image"){if(n.ref){let l=n.ref(Wi(r.payload.entity),{...o,kind:"image"});l&&(r.payload.entity=l)}}else if(r.kind==="tap"){let l=r.payload;i(l.action,{...o,kind:"tap"},d=>{l.action=d})}else{let l=Kn(r);if(l&&t(l,o),r.kind==="text")for(let d of r.payload.parts??[])t(d.value,{...o,part:"textPart"});r.kind==="gauge"&&r.payload.total&&t(r.payload.total,{...o,part:"total"}),r.kind==="gauge"&&r.payload.minSource&&t(r.payload.minSource,{...o,part:"gaugeMin"}),r.kind==="gauge"&&r.payload.maxSource&&t(r.payload.maxSource,{...o,part:"gaugeMax"}),r.kind==="chart"&&r.payload.nowIndex&&t(r.payload.nowIndex,{...o,part:"nowIndex"})}let s={...o,kind:"rule"};for(let l of Ji(r.payload.rules))t(l,s)}let a=Object.keys(e.perFamily).sort((r,o)=>{let s=ji.indexOf(r),l=ji.indexOf(o);return(s<0?ji.length:s)-(l<0?ji.length:l)});for(let r of a){let o=e.perFamily[r];if(!o)continue;let s={kind:"layout",family:r};o.bezelText&&t(o.bezelText,{...s,part:"bezelText"}),o.curvedText&&t(o.curvedText,{...s,part:"curvedText"});let l=o.bezelGauge;l&&(t(l.value,{...s,part:"bezelGauge"}),l.minLabel&&t(l.minLabel,{...s,part:"bezelGaugeMin"}),l.maxLabel&&t(l.maxLabel,{...s,part:"bezelGaugeMax"}));let d={kind:"rule",family:r};for(let c of Ji(o.rules))t(c,d)}e.inline&&t(e.inline.value,{kind:"inline"}),i(e.tapAction,{kind:"documentTap"},r=>{e.tapAction=r})}function Vt(e,n){Mr(e,{value:n})}function tu(e,n){return e.kind.kind==="named"&&e.kind.id.toUpperCase()===n.toUpperCase()}function la(e,n){let t=new Set;return Vt(e,(i,a)=>{tu(i,n)&&t.add(a.layerId??`${a.kind}:${a.valueId??""}:${a.family??""}:${a.part??""}`)}),t.size}function Bg(e,n){let t=new Set(e.values.map(a=>a.name.trim().toLowerCase())),i=n.trim()||"Value";if(!t.has(i.toLowerCase()))return i;for(let a=2;;a++){let r=`${i} ${a}`;if(!t.has(r.toLowerCase()))return r}}function Ls(e,n,t){let i={id:te(),name:Bg(e,t),value:{kind:structuredClone(n.kind)}},a={kind:{kind:"named",id:i.id}};return n.format&&!Pe(n.format)&&(a.format=structuredClone(n.format)),{named:i,ref:a}}function _s(e,n){if(n.kind.kind!=="named")return;let t=n.kind.id,i=e.values.find(o=>o.id.toUpperCase()===t.toUpperCase());if(!i)return;let a=n.format&&!Pe(n.format)?n.format:i.value.format,r={kind:structuredClone(i.value.kind)};return a&&!Pe(a)&&(r.format=structuredClone(a)),r}function Ps(e,n){Vt(e,t=>{if(!tu(t,n))return;let i=_s(e,t);i&&(t.kind=i.kind,i.format?t.format=i.format:delete t.format)}),e.values=e.values.filter(t=>t.id.toUpperCase()!==n.toUpperCase())}function Ns(e,n){Mr(e,{ref:n})}function Ci(e,n){Mr(e,{text:n})}function zs(e,n){let t=[],i={ref:(a,r)=>{a.entityId!==""&&t.push({entityId:a.entityId,ref:a,where:ac(r)})}};return n&&(i.text=(a,r)=>{for(let o of Dg(a)){let s=o.split(".")[0]??"";n(o,s)&&t.push({entityId:o,ref:{entityId:o,displayName:"",domain:s},where:ac(r)})}return a}),Mr(e,i),t}var da={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],chartTimes:["opacity","rotation","visibility"],chartDots:["opacity","visibility"],chartGrid:["opacity","visibility"],imageTime:["opacity","rotation","visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},nu=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","timeBetween","contains","startsWith","endsWith","matchesRegex","isOneOf"];function Wn(e){let n=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(n)?n:void 0}function jn(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function Ar(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function Ds(){return{id:te(),value:G(""),comparison:{kind:"isOn"}}}function Os(){return{id:te(),when:{join:"all",tests:[Ds()]},then:[]}}function ca(){return{id:te(),cases:[Os()]}}function rc(e,n){return e&&(e.kind.kind!=="literal"||Wn(e.kind.value)!==void 0)?e:G(n)}function Bs(e,n){let t={kind:n};switch(jn(n)){case"value":t.value=e.value??G("");break;case"between":t.value=e.value??G(""),t.upper=e.upper??G("");break;case"times":t.value=rc(e.value,"22:00"),t.upper=rc(e.upper,"06:00");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function qn(e){let n={kind:e};switch(Ar(e)){case"value":n.value=G(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"none":break}return n}var pt="wrist_assistant/complications";async function iu(e){return e.connection.sendMessagePromise({type:"wrist_assistant/gallery_key"})}async function au(e){return e.connection.sendMessagePromise({type:`${pt}/owners`})}async function ru(e,n){return e.connection.sendMessagePromise({type:`${pt}/list`,owner_watch_id:n})}async function ou(e,n){return e.connection.sendMessagePromise({type:`${pt}/nudge`,owner_watch_id:n})}async function su(e,n){return e.connection.sendMessagePromise({type:`${pt}/watch_status`,owner_watch_id:n})}async function Vs(e,n,t,i){return e.connection.sendMessagePromise({type:`${pt}/save`,owner_watch_id:n,document:t,base_revision:i})}async function lu(e,n,t,i){return e.connection.sendMessagePromise({type:`${pt}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function du(e,n,t){return e.connection.sendMessagePromise({type:`${pt}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function cu(e,n,t){let i={type:`${pt}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function uu(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${pt}/render_values`,templates:n})).results}async function pu(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${pt}/history_series`,requests:n})).results}function Vg(e){return{entity_id:e.entityId,minutes:e.minutes,points:e.points,...e.mode==="states"?{mode:"states"}:{},...e.gaps?{gaps:!0}:{}}}function Gg(e){return{entity_id:e.entityId,minutes:e.minutes,period:e.period,type:e.type,...e.gaps?{gaps:!0}:{}}}function hu(e){let n=new Map,t=new Map;for(let[i,a]of Object.entries(e))a.ok&&(n.set(i,a.series),typeof a.readings=="number"&&t.set(i,{readings:a.readings,averaged:a.averaged===!0}));return{series:n,readings:t}}async function mu(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${pt}/statistics_series`,requests:n})).results}function Gs(e,n=()=>!0){let t={};for(let a of ms(e))n(a.entityId)&&(t[a.key]=Vg(a));let i={};for(let a of fs(e))n(a.entityId)&&(i[a.key]=Gg(a));return{history:t,statistics:i,signature:JSON.stringify([t,i])}}var Hr="shared:";function Us(e){return Hr+e.toUpperCase()}function gu(e){return e.values.filter(n=>n.value.kind.kind!=="entityState"&&la(e,n.id)>0)}function yu(e,n){return n.size===0?e:e.map(t=>{let i=n.get(Us(t.id));if(i===void 0)return t;let a={kind:{kind:"literal",value:i}};return t.value.format&&(a.format=t.value.format),{...t,value:a}})}var Ug=["unavailable","unknown"],Kg={automation:["on","off"],script:["on","off"],remote:["on","off"],update:["on","off"],timer:["idle","active","paused"],sun:["above_horizon","below_horizon"],valve:["open","closed","opening","closing"],lawn_mower:["mowing","docked","paused","returning","error"],weather:["sunny","clear-night","partlycloudy","cloudy","rainy","pouring","snowy","snowy-rainy","fog","windy","windy-variant","lightning","lightning-rainy","hail","exceptional"]},Wg=new Set(["\xB0C","\xB0F"]);function fu(e){return Array.isArray(e)&&e.length>0&&e.every(n=>typeof n=="string")?e:void 0}function ua(e){let n=typeof e=="number"?e:typeof e=="string"&&e.trim()!==""?Number(e):NaN;return Number.isFinite(n)?n:void 0}function jg(e){let n=e?.trim().match(/\.(\d+)$/)?.[1]?.length??0;return n===0?1:10**-Math.min(n,4)}function qg(e){let n=10**Math.floor(Math.log10(e));return([1,2,2.5,5,10].find(i=>i*n>=e)??10)*n}function Yg(e){let n=new Set,t=[];for(let i of e)i===void 0||i===""||n.has(i)||(n.add(i),t.push(i));return t}function bu(e,n,t){let i=e.split(".")[0]??"",a=n?.attributes??{},o=fu(a.options)??(i==="climate"?fu(a.hvac_modes):void 0)??oa[i]??Kg[i];if(o)return{kind:"choice",options:Yg([...o,n?.state,t,...Ug])};let s=ua(n?.state),l=typeof a.unit_of_measurement=="string"?a.unit_of_measurement:void 0;if(s===void 0&&l===void 0&&i!=="input_number"&&i!=="number")return{kind:"text"};let d=ua(t),c=ua(a.min),u=ua(a.max),p=ua(a.step),m,g;if(c!==void 0&&u!==void 0&&u>c)m=c,g=u;else if(l==="%")m=0,g=100;else{let b=qg(Math.max(Math.abs(s??0)*2,10));m=(s??0)<0||l!==void 0&&Wg.has(l)?-b:0,g=b}d!==void 0&&(m=Math.min(m,d),g=Math.max(g,d));let y=p!==void 0&&p>0?p:jg(n?.state);return{kind:"number",min:m,max:g,step:y}}function xu(e){if(e.appliedToken===void 0)return{kind:"unsupported"};if(e.token===e.appliedToken){let n=!e.polling&&typeof e.lastPollSeconds=="number"?e.lastPollSeconds:void 0;return n===void 0?{kind:"sent"}:{kind:"sent",awaySeconds:n}}return e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Xg(e){if(e<60)return"just now";let n=Math.floor(e/60);if(n<60)return`${n} min ago`;let t=Math.floor(n/60);if(t<24)return`${t} h ago`;let i=Math.floor(t/24);return`${i} ${i===1?"day":"days"} ago`}function wu(e){switch(e.kind){case"unsupported":return{label:"Update the watch app",note:"to receive this",title:"This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",resend:!1};case"sent":return e.awaySeconds===void 0?{label:"On watch",title:"The watch has applied every change here.",resend:!1}:{label:"On watch",note:`last seen ${Xg(e.awaySeconds)}`,title:"The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function ku(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function $u(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function vu(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Si(e,n,t=0){let i=n instanceof Map?n:$u(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Si(o,i,t+1):vu(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!vu(a))return;let r=pa(a);if(r!==void 0)return"e_"+ku(r)}function ht(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Jg(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(o=>ht(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:s,labelIds:l,floorIds:d}=e.scope;if(!(s.length+l.length+d.length>0))n=o.length===0?"[]":"("+o.map(u=>`(states.${u} | list)`).join(" + ")+")";else{let u=[];for(let p of s)u.push(`area_entities(${ht(p)})`);for(let p of l)u.push(`label_entities(${ht(p)})`);d.length>0&&u.push(`((${d.map(p=>`floor_areas(${ht(p)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${u.join(" + ")})`,o.length>0&&(n+=` | selectattr('domain', 'in', [${o.map(ht).join(", ")}])`),n+=")"}}let t=n,i=e.stateFilter;if(i&&(i.kind==="isOn"?t+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?t+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?t+=` | selectattr('state', 'eq', ${ht(i.value)})`:t+=` | rejectattr('state', 'eq', ${ht(i.value)})`),e.function==="count")return`(${t} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${t} | map(attribute=${ht(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function pa(e){switch(e.kind){case"entityAttribute":return`state_attr(${ht(e.entityId)}, ${ht(e.attribute)})`;case"entityAge":{let n=ht(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Jg(e.aggregate);default:return}}function ha(e){let n=new Map,t=new Map,i=$u(e.values),a=(o,s=0)=>{let l=o.kind;switch(l.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":n.set(l.entityId,l);return;case"named":{if(s>8)return;let d=i.get(l.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,s+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let c=pa(d.kind);if(c===void 0)return;t.set("n_"+l.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=pa(l);if(d===void 0)return;t.set("e_"+ku(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let s=Kn(o);if(s&&a(s),o.kind==="text")for(let l of o.payload.parts??[])a(l.value);o.kind==="gauge"&&o.payload.total&&a(o.payload.total),o.kind==="gauge"&&o.payload.minSource&&a(o.payload.minSource),o.kind==="gauge"&&o.payload.maxSource&&a(o.payload.maxSource),o.kind==="chart"&&o.payload.nowIndex&&a(o.payload.nowIndex);for(let l of Ji(o.payload.rules))a(l)}for(let o of se){if(!e.supportedFamilies.includes(o))continue;let s=e.perFamily[o];if(s){s.bezelText&&a(s.bezelText),s.curvedText&&a(s.curvedText),s.bezelGauge&&(a(s.bezelGauge.value),s.bezelGauge.minLabel&&a(s.bezelGauge.minLabel),s.bezelGauge.maxLabel&&a(s.bezelGauge.maxLabel));for(let l of Ji(s.rules))a(l)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:n,expressions:t};return t.size>0&&(r.document=Zg(t)),r}function Zg(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function Cu(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,Qg(r));return{values:t,nullKeys:i}}function Qg(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function Ks(e){let n=ha(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return n.document&&t.push({kind:"template",value:n.document}),t}function ey(e,n){let t=e.holes.length===0?e.values:e.values.filter((i,a)=>!e.holes[a]);if(t.length!==0)switch(n){case"latest":return t[t.length-1];case"highest":return Math.max(...t);case"lowest":return Math.min(...t);case"average":return t.reduce((i,a)=>i+a,0)/t.length;case"top":return e.domainMax;case"bottom":return e.domainMin;case"first":return t[0];case"delta":return t[t.length-1]-t[0];case"sum":return t.reduce((i,a)=>i+a,0);case"trend":{let i=t[t.length-1]-t[0],a=Number(ia(i,e.domainMax-e.domainMin));return a>0?1:a<0?-1:0}}}var ty=10800;function ny(e,n,t){let i=n==="always"||n==="auto"&&t<=ty;return new Intl.DateTimeFormat(void 0,{hour:"numeric",...i?{minute:"2-digit"}:{},...e==="h12"?{hourCycle:"h12"}:{},...e==="h24"?{hourCycle:"h23"}:{}})}function Fr(e,n,t,i,a){if(e<=0||n.length===0)return[];let r=ny(t,i,e);return n.map(o=>({position:o,text:r.format(new Date(a-e*1e3*(1-o)))}))}function iy(e,n){return qe(e)===void 0?[]:Fr(dt(e)*60,ra(e.timeLabelCount),e.hourCycle,e.minutes,n)}function ay(e,n){return On(e)?Fr(Math.round(e.historyMinutes)*60,ra(yt(e.timeLabelCount)),e.hourCycle,e.minutes,n):[]}function ry(e,n,t,i){return n===void 0&&i!==void 0?qe(i)===void 0?[]:Fr(dt(i)*60,ra(yt(e.timeLabelCount)),e.hourCycle,e.minutes,t):n===void 0||!On(n)?[]:Fr(Math.round(n.historyMinutes)*60,ra(yt(e.timeLabelCount)),e.hourCycle,e.minutes,t)}function Yn(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function Xe(e){let n=e.trim(),t=Yn(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:Yn(i)}function oy(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function sy(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function ly(e){let n=e.trim(),t=Yn(n);if(t!==void 0)return t;let i=0,a=n.indexOf(",");if(a>=0){let s=n.slice(0,a).trim().split(" "),l=s.length===2?Yn(s[0]):void 0;if(l===void 0||s[1]!=="day"&&s[1]!=="days")return;i=l,n=n.slice(a+1).trim()}let r=n.split(":");if(r.length!==2&&r.length!==3)return;let o=0;for(let s=0;s<r.length;s++){let l=Yn(r[s]);if(l===void 0)return;o+=l*Math.pow(60,r.length-1-s)}return i*86400+o}function dy(e){let n=Math.trunc(Math.min(Math.max(0,e)||0,863913600)),i=[[Math.trunc(n/86400),"d"],[Math.trunc(n%86400/3600),"h"],[Math.trunc(n%3600/60),"m"],[n%60,"s"]].filter(([a])=>a>0).slice(0,2).map(([a,r])=>`${a}${r}`);return i.length===0?"0s":i.join(" ")}function cy(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function uy(e,n,t){if(Pe(n))return e;let i=n,a=e,r=Yn(e.trim()),o=i.duration?ly(e):void 0;if(o!==void 0)a=dy(o);else if(i.relativeTime&&r!==void 0)a=sy(r);else{let s=Xe(e);if(s!==void 0){let l=s*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==s&&(a=Number.isInteger(l)?String(l):oy(l))}}switch(i.useEntityUnit&&t&&(a+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=cy(a);break}return a}function Ti(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Je(e,n=240){return Mu(e,n).map(t=>t.value)}function js(e,n=240){let t=[];for(let s of e.split(",")){if(t.length>=n)break;if(s.trim()===""){t.push(void 0);continue}for(let l of Je(s,n-t.length))t.push(l)}let i=t.find(s=>s!==void 0);if(i===void 0)return{values:[],holes:[]};let a=[],r=[],o=i;for(let s of t)s===void 0?(a.push(o),r.push(!0)):(o=s,a.push(s),r.push(!1));return{values:a,holes:Ru(r)}}function Ru(e){return e.some(n=>n)?e:[]}function Mu(e,n=240){let t=[],i="",a=0,r=!1,o=0,s=()=>{if(i!==""){let l=Number(i);Number.isFinite(l)&&t.push({value:l,start:a,end:a+i.length})}i=""};for(let l of e){if(t.length>=n)break;if(l>="0"&&l<="9")i===""&&(a=o),i+=l,r=!0;else if(l===".")i.includes(".")&&s(),i===""&&(a=o),i+=".",r=!0;else if(l==="-"||l==="+"){let d=!r;s(),d&&(a=o,i=l),r=!1}else s(),r=!1;o+=l.length}return t.length<n&&s(),t}function Su(e,n,t){let i=Mu(e),a=i.map(y=>y.value),r=t.highlight??"none",o=-1,s=-1;a.length>0&&((r==="highest"||r==="both")&&(o=a.indexOf(Math.max(...a))),(r==="lowest"||r==="both")&&(s=a.indexOf(Math.min(...a))),s===o&&(s=-1));let l=t.coloring==="bands"?rn({bands:t.bands??[]}):[],d=t.bandAboveColorHex??he,c=t.highColorHex??tt,u=t.lowColorHex??nt,p=[],m=(y,b)=>{if(y==="")return;let $=p.at(-1);$&&$.colorHex===b?$.text+=y:p.push({text:y,colorHex:b})},g=0;return i.forEach((y,b)=>{m(e.slice(g,y.start),n);let $=b===o?c:b===s?u:l.length>0?mr(y.value,l,d):n,k=e[y.end-1]==="."?y.end-1:y.end;m(e.slice(y.start,k),$),g=k}),m(e.slice(g),n),p}function Tu(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1,n.thresholdValue!==void 0&&Number.isFinite(n.thresholdValue)&&(t=Math.min(t,n.thresholdValue),i=Math.max(i,n.thresholdValue))),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function py(e,n,t){let i=e.thresholdValue;if(!(i===void 0||!Number.isFinite(i)||!(t>n)||i<n||i>t))return(i-n)/(t-n)}function fa(e,n=dn){let t=[];for(let i of e.split(" ")){if(t.length>=n)break;if(i==="")continue;let a=i.indexOf(":");if(a<=0)continue;let r=Number(i.slice(0,a));!Number.isFinite(r)||r<0||t.push({offsetSeconds:Math.round(r),state:hy(i.slice(a+1))})}return t}function hy(e){try{return decodeURIComponent(e)}catch{return e}}function my(e,n,t){if(e.length===0||!(n>0))return[];let i=[];for(let r=0;r<e.length;r++){let o=e[r],s=Math.min(1,Math.max(0,o.offsetSeconds/n)),l=e[r+1],d=l===void 0?1:Math.min(1,Math.max(s,l.offsetSeconds/n));if(!(d>s))continue;let c=t(o.state),u=i[i.length-1];u!==void 0&&u.colorHex===c?u.end=d:i.push({start:s,end:d,colorHex:c})}let a=i[i.length-1];return a!==void 0&&(a.end=1),i}function Eu(e,n,t){if(Number.isNaN(e))return t;let i=e<0?-Math.round(-e):Math.round(e);return Math.min(t,Math.max(n,i))}function fy(e,n,t){if(e===void 0)return 0;let i=Xe(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}var $t=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.chartElements=new Map;this.timelineElements=new Map;this.imageElements=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&this.settleCharts(t)}chartReadings(n){let{values:t,holes:i}=this.chartSeries(n),a=Tu(t,n),r={values:t,holes:i,domainMin:a.min,domainMax:a.max},o=this.chartEntity(n);return o&&(r.entity=o),r}chartSeries(n){let t=wt(n),i=vt(n),a,r=t??i;r!==void 0?a=this.ctx.historySeries?.get(r)??"":a=this.resolve(n.value)??"";let{values:o,holes:s}=r!==void 0?js(a):{values:Je(a),holes:[]},l=r===void 0?void 0:this.testedReading(n);if(l!==void 0&&(o=[...o.slice(0,-1),l],s.length>0&&(s=[...s.slice(0,-1),!1])),n.limit>0&&o.length>n.limit){let d=c=>n.takeFromEnd?c.slice(c.length-n.limit):c.slice(0,n.limit);o=d(o),s.length>0&&(s=d(s))}return s=Ru(s),{values:qs(o,st(n.smoothing),s),holes:s}}testedReading(n){let t=this.chartEntity(n);if(!t||!this.ctx.testedEntities?.has(t.entityId))return;let i=this.ctx.entityStates.get(t.entityId)?.state;return i===void 0?void 0:Xe(i)}chartEntity(n){let t=this.dereference(n.value);if(!(!t||!("entityId"in t.kind)))return{entityId:t.kind.entityId,displayName:t.kind.displayName,domain:t.kind.domain}}chartNowIndex(n,t){if(n.nowIndex===void 0||t===0)return;let i=this.resolve(n.nowIndex);if(i===void 0)return;let a=Xe(i);if(!(a===void 0||!Number.isFinite(a)))return Math.min(Math.max(Math.round(a),0),t-1)}settleCharts(n){let t=new Map,i=[];for(let s of n.elements)s.kind==="timeline"&&this.timelineElements.set(s.payload.id,s.payload),s.kind==="image"&&this.imageElements.set(s.payload.id,s.payload),!(s.kind!=="chart"||t.has(s.payload.id))&&(t.set(s.payload.id,s.payload),i.push(s.payload.id));let a=new Map;for(let s of i)a.set(s,this.chartSeries(t.get(s)));let r=new Map,o=(s,l)=>{let d=r.get(s);if(d)return d;let c=t.get(s);if(!c)return{min:0,max:1};let u=c.scaleFrom,p=u!==void 0&&u!==s&&t.has(u)&&!l.has(u)?o(u,new Set([...l,u])):Tu(a.get(s)?.values??[],c);return r.set(s,p),p};for(let s of i){let l=t.get(s),d=o(s,new Set([s])),c={values:a.get(s)?.values??[],holes:a.get(s)?.holes??[],domainMin:d.min,domainMax:d.max},u=this.chartEntity(l);u&&(c.entity=u),this.charts.set(s,c),this.chartElements.set(s,l)}}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!Pe(a)?a:s.format,t=s}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){if(t.stat==="trend")return;let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?ey(a,t.kind.stat):void 0;a&&r!==void 0&&(i=t.kind.stat==="trend"?gc(r):ia(r,a.domainMax-a.domainMin));break}default:{let a=Si(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return uy(i,t.format,this.directEntityUnit(t))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=Yn(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}canCountDown(n){if(!n)return!1;let t=this.dereference(n);if(t?.kind.kind==="entityState"){let i=t.kind.entityId;if(i.startsWith("timer.")||this.ctx.entityStates.get(i)?.timerState!==void 0)return!0}return this.countdownEnd(n)!==void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?Ti(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=Xe(i),r=()=>this.resolve(t.value),o=()=>{let l=r();return l===void 0?void 0:Xe(l)},s=l=>{let d=o();return a===void 0||d===void 0?!1:l(a,d)};switch(t.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,d)=>l>d);case"greaterOrEqual":return s((l,d)=>l>=d);case"lessThan":return s((l,d)=>l<d);case"lessOrEqual":return s((l,d)=>l<=d);case"between":{let l=o(),d=this.resolve(t.upper),c=d===void 0?void 0:Xe(d);if(a===void 0||l===void 0||c===void 0)return!1;let[u,p]=l<=c?[l,c]:[c,l];return a>=u&&a<=p}case"timeBetween":{let l=Wn(i),d=r(),c=this.resolve(t.upper),u=d===void 0?void 0:Wn(d),p=c===void 0?void 0:Wn(c);return l===void 0||u===void 0||p===void 0||u===p?!1:u<p?l>=u&&l<p:l>=u||l<p}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set(Oe[s.kind],s)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveTextParts(n,t,i,a){let r=[];for(let o of n){let s=this.applyRules(t.filter(d=>d.partId===o.id),a);if(s.get("visibility")?.kind==="hide")continue;let l={text:this.styleText(s,"text")??this.resolve(o.value)??"--",fontSize:this.styleNumber(s,"fontSize")??o.fontSize??i.fontSize,fontWeight:s.get("fontWeight")?.weight??o.fontWeight??i.fontWeight,colorHex:this.styleColor(s,"color")??o.colorHex??i.colorHex};o.coloring==="bands"&&(o.bands?.length??0)>0&&(l.spans=Su(l.text,l.colorHex,o)),r.push(l)}return r}resolveElement(n,t){let i=n.payload,a=n.kind==="text"?i.rules.filter(p=>p.partId===void 0):i.rules,r=this.applyRules(a,t),o=r.get("visibility"),s=o?o.kind==="hide":i.isHidden,l=this.styleNumber(r,"rotation"),d=l===void 0?i.frame:{...i.frame,rotationDegrees:l},c=this.styleNumber(r,"opacity")??1,u={id:i.id,isHidden:s,frame:d,opacity:c};switch(i.chartAnchor!==void 0&&(u.chartAnchor=i.chartAnchor),n.kind){case"text":{let p=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,m=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,g=lt(n.payload)&&!r.has("text"),y={kind:"text",...u,text:g?"":this.styleText(r,"text")??m??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(r,"fontSize")??n.payload.fontSize,fontWeight:r.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex,monospacedDigits:n.payload.monospacedDigits===!0,lineLimit:n.payload.lineLimit===2?2:1,alignment:n.payload.alignment??"center"};return p!==void 0&&(y.countdownEnd=p),g?(y.parts=this.resolveTextParts(n.payload.parts,i.rules,y,t),y.text=y.parts.map(b=>b.text).join(""),y):(uc(n.payload)&&(y.spans=Su(y.text,y.colorHex,n.payload)),y)}case"icon":{let p=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle",m=this.styleText(r,"icon"),g=n.payload.symbol.kind.kind==="literal",y=m===void 0&&g&&n.payload.path!==""?n.payload.path:void 0,b=m??p;y===void 0&&b.startsWith("mdi:")&&(b="questionmark.circle");let $={kind:"icon",...u,symbol:b,size:this.styleNumber(r,"fontSize")??n.payload.size,colorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex};return y!==void 0&&($.path=y),$}case"gauge":{let p=n.payload,m=this.styleText(r,"gaugeValue")??this.resolve(p.value),g=(M,A,F)=>M??(A?Xe(this.resolve(A)??""):void 0)??F,y=g(this.styleNumber(r,"gaugeMin"),p.minSource,p.minValue),b=g(this.styleNumber(r,"gaugeMax"),p.maxSource,p.maxValue),$=m===void 0?void 0:Xe(m),k=this.styleColor(r,"color")??p.colorSlot.baseColorHex;p.coloring==="bands"&&p.bands.length>0&&$!==void 0&&(k=mr($,rn(p),p.bandAboveColorHex));let v=b-y;if(p.total){let M=Xe(this.resolve(p.total)??"");M!==void 0&&(v=M)}let C=Eu(v,1,pr),R={kind:"gauge",...u,fraction:fy(m,y,b),style:p.style,lineWidth:p.lineWidth,colorHex:k,trackColorHex:p.trackColorHex,thresholdColorHex:p.thresholdColorHex,dotCount:C,filledCount:Eu($??0,0,C)};if(p.thresholdValue!==void 0&&b!==y){let M=(p.thresholdValue-y)/(b-y);M>=0&&M<=1&&(R.thresholdFraction=M)}return R}case"chart":{let p=n.payload,m=this.charts.get(p.id)??this.chartReadings(p),g=m.values,y=m.holes,b={min:m.domainMin,max:m.domainMax},$=this.styleColor(r,"color")??p.colorSlot.baseColorHex,k=rn(p),v=na(p)?g.map(j=>mr(j,k,p.bandAboveColorHex)):[],C=p.highlight==="highest"||p.highlight==="both",R=p.highlight==="lowest"||p.highlight==="both",M=Yi(p),A={kind:"chart",...u,values:g,holes:y,style:p.style,domainMin:b.min,domainMax:b.max,baseline:p.baseline,barGap:p.barGap,lineWidth:p.lineWidth,colorHex:$,highColorHex:p.highColorHex,lowColorHex:p.lowColorHex,marker:p.marker,highMarker:C?M.high:"none",lowMarker:R?M.low:"none",pointColorHexes:v,fillBands:p.fillBands,curve:p.curve??"straight",smoothing:st(p.smoothing)??"off",fillStyle:Qt(p.fillStyle),...p.fillColorHex!==void 0?{fillColorHex:p.fillColorHex}:{},barRadius:en(p.barRadius),barCorners:tn(p.barCorners),barBorderWidth:rs(p),barFillColorHexes:[],barBorderColorHexes:[],barBorderOpenBase:rs(p)>0&&p.barBorderOpenBase===!0,thresholdColorHex:p.thresholdColorHex,drawsThreshold:p.drawsThreshold!==!1,nowColorHex:p.nowColorHex,drawsNowLine:p.drawsNowLine!==!1,labels:p.drawsTimeLabels===!1?[]:ay(p,this.nowMs()),labelSize:p.labelSize,labelColorHex:p.labelColorHex,labelsAbove:p.labelsAbove},F=y.length===0?g:g.filter((j,K)=>!y[K]);if(F.length>0){let j=O=>g.findIndex((z,H)=>z===O&&y[H]!==!0),K=C?j(Math.max(...F)):-1,q=R?j(Math.min(...F)):-1;K>=0&&(A.highIndex=K),q>=0&&q!==K&&(A.lowIndex=q)}if(p.style==="bars"){let j=g.map((K,q)=>fc(p,K,k,$,q===A.highIndex?p.highColorHex:q===A.lowIndex?p.lowColorHex:void 0));A.barFillColorHexes=j.map(K=>K.fill),A.barBorderWidth>0&&(A.barBorderColorHexes=j.map(K=>K.border))}let E=py(p,b.min,b.max);E!==void 0&&(A.thresholdY=E);let N=this.chartNowIndex(p,g.length);return N!==void 0&&(A.nowIndex=N),A}case"timeline":{let p=n.payload,m=qe(p),g=m===void 0?"":this.ctx.historySeries?.get(m)??"",y=fa(g,dn),b=my(y,dt(p)*60,k=>$c(k,p.bands,p.otherColorHex));return{kind:"timeline",...u,runs:b,gap:p.gap,cornerRadius:p.cornerRadius,labels:p.drawsTimeLabels===!1?[]:iy(p,this.nowMs()),labelSize:p.labelSize,labelColorHex:p.labelColorHex,labelsAbove:p.labelsAbove}}case"shape":{let p={kind:"shape",...u,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,thickness:n.payload.thickness,fillColorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(r,"borderWidth")??n.payload.borderWidth},m=this.styleColor(r,"borderColor")??n.payload.borderColorHex;return m!==void 0&&(p.borderColorHex=m),p}case"image":{let p={kind:"image",...u,entityId:n.payload.entity.entityId,source:n.payload.source,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};wr(n.payload)&&(p.timestampX=n.payload.timestampX,p.timestampY=n.payload.timestampY);let m=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return m!==void 0&&(p.url=m),p}case"tap":{let p={kind:"tap",...u,frame:n.payload.frame,opacity:1,action:n.payload.action};return n.payload.openPageId!==void 0&&(p.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(p.attachedTo=n.payload.attachedTo),p}case"chartTimes":{let p=n.payload;return{kind:"chartTimes",...u,labels:ry(p,this.chartElements.get(p.chart),this.nowMs(),this.timelineElements.get(p.chart)),labelSize:p.labelSize,labelColorHex:p.labelColorHex}}case"imageTime":{let p=n.payload,m=this.imageElements.get(p.image),g={kind:"imageTime",...u,image:p.image,linked:m!==void 0},y=m===void 0?void 0:this.ctx.entityStates.get(m.entity.entityId)?.entityPicture;return y!==void 0&&(g.url=y),g}case"chartDots":{let p=n.payload,m=gt(p.size),g={kind:"chartDots",...u,chart:p.chart,dots:sr(p.dots),diameter:0,indices:[]};return m!==void 0&&(g.size=m),p.colorHex!==void 0&&(g.colorHex=p.colorHex),g}case"chartGrid":{let p=n.payload;return{kind:"chartGrid",...u,chart:p.chart,lines:Pn(p.lines),colorHex:Xt(p.colorHex),thickness:Nn(p.thickness),draws:!1}}}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=ce[t==="inline"?"rectangular":t],o=[...vy(wy(Kc(n,t).map(b=>this.resolveElement(b,i)),r),r)],s=a?this.applyRules(a.rules,i):new Map,l={family:t,elements:o,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(s,"borderWidth")??a?.borderWidth??2},d=this.styleText(s,"text"),c=a?.bezelCountdown&&d===void 0?this.countdownEnd(a.bezelText):void 0,u=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,p=d??u??this.resolve(a?.bezelText);p!==void 0&&(l.bezelText=p),c!==void 0&&(l.bezelCountdownEnd=c);let m=this.resolve(a?.curvedText);if(m!==void 0&&(l.curvedText=m),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let b=a.bezelGauge,$=this.resolve(b.value),k=$===void 0?void 0:Xe($);if(k!==void 0){let v=Math.min(b.minValue,b.maxValue),C=Math.max(b.minValue,b.maxValue),R={value:Math.min(C,Math.max(v,k)),minValue:v,maxValue:C===v?v+1:C,colorHexes:b.colorHexes},M=this.resolve(b.minLabel);M!==void 0&&(R.minLabel=M);let A=this.resolve(b.maxLabel);A!==void 0&&(R.maxLabel=A),l.bezelGauge=R}}let g=this.styleColor(s,"backgroundColor")??a?.backgroundColorHex;g!==void 0&&(l.backgroundColorHex=g);let y=this.styleColor(s,"borderColor")??a?.borderColorHex;return y!==void 0&&(l.borderColorHex=y),l}};function gy(e,n,t){let i=new $t(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function hn(e,n,t){let i=new $t(n),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=gy(e.inline,n,e)),a}function ga(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}var Ws=5,yy=1.7,by=1.8;function xy(e,n,t,i,a,r){return e==="bars"||t===0?!1:n==="all"||t===1?!0:Math.max(i-a*2,0)/(t-1)>=3*r}function wy(e,n){if(!e.some(r=>r.kind==="chartDots"||r.kind==="chartGrid"))return[...e];let t=new Map;for(let r of e)r.kind==="chart"&&t.set(r.id,r);let i=new Map,a=e.map(r=>{if(r.kind==="chartGrid"){let u=t.get(r.chart);return u===void 0?{...r,draws:!1}:{...r,frame:u.frame,draws:u.values.length>0}}if(r.kind!=="chartDots")return r;let o=t.get(r.chart);if(o===void 0)return{...r,diameter:0,indices:[]};let s=r.size??o.lineWidth*by,l=Math.max(o.frame.width*n.width,0),d=xy(o.style,r.dots,o.values.length,l,o.lineWidth/2,s);d&&!r.isHidden&&i.set(o.id,Math.max(i.get(o.id)??0,s));let c=d?o.values.map((u,p)=>p).filter(u=>o.holes[u]!==!0&&u!==o.highIndex&&u!==o.lowIndex):[];return{...r,frame:o.frame,diameter:s,indices:c}});return i.size===0?a:a.map(r=>{if(r.kind!=="chart")return r;let o=i.get(r.id);return o===void 0?r:{...r,dotDiameter:o}})}function Au(e){if(e.domainMin<0&&e.domainMax>0)return(0-e.domainMin)/(e.domainMax-e.domainMin)}function Hu(e,n){let t=Math.max(0,Math.min(4,Math.round(n))),i=e.plotBottom-e.plotTop;return Array.from({length:t},(a,r)=>e.plotTop+i*(r+1)/(t+1))}function Ir(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0?e.highMarker:"none",r=e.lowIndex!==void 0?e.lowMarker:"none",o=n.x,s=Math.max(n.w,0),l=e.style==="bars"?0:e.lineWidth/2,d=e.dotDiameter!==void 0&&e.style!=="bars"?Math.max(l,e.dotDiameter/2):l,c=A=>A==="triangle"?Ws+d:A==="dot"?Math.max(d,yy):d,u=c(a),p=c(r),m=n.y+u,g=Math.max(n.h-u-p,1),y=m+g,b=Math.max(e.domainMax-e.domainMin,Number.EPSILON),$=e.baseline==="lowest",k=$?g*.12:0,v=Math.min(Math.max(e.barGap,0),s/(i*2)),C=Math.max((s-v*(i-1))/i,.5),R=A=>Math.min(1,Math.max(0,(A-e.domainMin)/b)),M=A=>y-R(A)*g;return{count:t.length,barWidth:C,plotTop:m,plotBottom:y,plotLeft:o,plotRight:o+s,baselineY:$?y:M(0),inset:d,yAtFraction(A){return y-Math.min(Math.max(A,0),1)*g},barRect(A){let F=o+A*(C+v),E=t[A],N,j;if($){let K=k+R(E)*(g-k);N=y-K,j=y}else N=M(E),j=$?y:M(0),N>j&&([N,j]=[j,N]);return{x:F,y:N,w:C,h:Math.max(j-N,.5)}},point(A){let F=Math.max(s-d*2,0);return{x:t.length>1?o+d+F*A/(t.length-1):o+s/2,y:M(t[A])}},markerCenter(A,F,E="high"){let N=F?this.barRect(A):void 0,j=N?N.x+N.w/2:this.point(A).x,K=E==="high"?a:r,q=E==="high"?K==="triangle"?n.y+Ws/2:m:K==="triangle"?n.y+n.h-Ws/2:y;return{x:j,y:q}}}}function Fu(e,n){let t=e.length;if(t<2)return[];let i=[];if(n==="step"){for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1];i.push({kind:"step",start:s,corner:{x:l.x,y:s.y},end:l})}return i}if(n!=="smooth"){for(let o=0;o<t-1;o++)i.push({kind:"straight",start:e[o],end:e[o+1]});return i}let a=[];for(let o=0;o<t-1;o++){let s=e[o+1].x-e[o].x;a.push(s===0?0:(e[o+1].y-e[o].y)/s)}let r=new Array(t).fill(0);r[0]=a[0],r[t-1]=a[t-2];for(let o=1;o<t-1;o++)r[o]=a[o-1]*a[o]<=0?0:(a[o-1]+a[o])/2;for(let o=0;o<t-1;o++){if(a[o]===0){r[o]=0,r[o+1]=0;continue}let s=r[o]/a[o],l=r[o+1]/a[o],d=s*s+l*l;if(d>9){let c=3/Math.sqrt(d);r[o]=c*s*a[o],r[o+1]=c*l*a[o]}}for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1],d=l.x-s.x;i.push({kind:"smooth",start:s,c1:{x:s.x+d/3,y:s.y+r[o]*d/3},c2:{x:l.x-d/3,y:l.y-r[o+1]*d/3},end:l})}return i}function qs(e,n,t=[]){let i=e.length,a=cc(i,n);if(a===0)return e;let r=Math.floor(a/2),o=r/2,s=u=>t[u]===!0,l=e.map((u,p)=>{if(s(p))return u;let m=0,g=0;for(let y=Math.max(0,p-r);y<=Math.min(i-1,p+r);y++){if(s(y))continue;let b=y-p,$=Math.exp(-(b*b)/(2*o*o));m+=e[y]*$,g+=$}return m/g}),d=l.find((u,p)=>!s(p));if(d===void 0)return l;let c=d;return l.map((u,p)=>s(p)?c:(c=u,u))}function Iu(e,n){let t=[],i=[];for(let a=0;a<e;a++)n[a]===!0?(i.length>0&&t.push(i),i=[]):i.push(a);return i.length>0&&t.push(i),t}var ma=1;function Xn(e,n){let t=Math.max(sn,Math.min(ln,e.labelSize)),i=t*1.2,a=e.labels.length>0&&n.h-i-ma>=2,r=a?{...n,y:e.labelsAbove?n.y+i+ma:n.y,h:n.h-i-ma,cy:(e.labelsAbove?n.y+i+ma:n.y)+(n.h-i-ma)/2}:n;return{labelSize:t,rowHeight:i,body:r,showsLabels:a}}function vy(e,n){if(!e.some(i=>i.chartAnchor!==void 0))return e;let t=new Map;for(let i of e)i.kind==="chart"&&t.set(i.id,i);return t.size===0?e:e.map(i=>{let a=i.chartAnchor;if(a===void 0)return i;let r=t.get(a.layer);if(r===void 0)return i;if(a.at==="zero"&&Au(r)===void 0)return{...i,isHidden:!0};let o=$y(i.frame,a,r,n);return o===void 0?i:{...i,frame:o}})}function ky(e,n){let t=n.values;if(t.length===0)return;let i=t.map((a,r)=>r).filter(a=>n.holes.length===0||!n.holes[a]);if(i.length!==0)switch(e){case"highest":return i.reduce((a,r)=>t[r]>t[a]?r:a);case"lowest":return i.reduce((a,r)=>t[r]<t[a]?r:a);case"first":return i[0];case"latest":return i[i.length-1];case"now":return n.nowIndex===void 0?void 0:Math.min(Math.max(n.nowIndex,0),t.length-1);case"threshold":return;case"zero":return}}function $y(e,n,t,i){if(i.width<=0||i.height<=0)return;let a=ga(t,i);if(a.w<=0||a.h<=0)return;let r=Xn(t,a).body;if(r.w<=0||r.h<=0)return;let o=Ir(t,r),s,l;if(Nt(n.at)){let $=ky(n.at,t);if($===void 0)return;if(t.style==="bars"){let k=o.barRect($);s=k.x+k.w/2,l=k.y}else{let k=o.point($);s=k.x,l=k.y}}else{let $=n.at==="zero"?Au(t):t.thresholdY;if($===void 0)return;l=o.yAtFraction($)}let d=Math.max(e.width,0)*i.width,c=Math.max(e.height,0)*i.height,u=.75,p=($,k,v)=>k>v?(k+v)/2:Math.min(Math.max($,k),v),m={...e};if(s!==void 0){let $=p(s+(n.dx??0),r.x+d/2,r.x+r.w-d/2);m.x=($-d/2)/i.width}if(n.place==="through"){if(s!==void 0)m.y=o.plotTop/i.height,m.height=(o.plotBottom-o.plotTop)/i.height;else{m.x=o.plotLeft/i.width,m.width=(o.plotRight-o.plotLeft)/i.width;let $=p(l+(n.dy??0),r.y+c/2,r.y+r.h-c/2);m.y=($-c/2)/i.height}return m}let g=n.place==="on"?l:n.place==="below"?l+u+c/2:n.place==="bottom"?o.plotBottom-u-c/2:l-u-c/2,y=p(g,r.y+c/2,r.y+r.h-c/2),b=p(y+(n.dy??0),c/2,i.height-c/2);return m.y=(b-c/2)/i.height,m}var Ys=[.01,.025,.05,.1];function Ei(e,n){return!(n.width>0&&n.height>0)||n.width===n.height?{x:e,y:e}:n.width>n.height?{x:e*n.height/n.width,y:e}:{x:e,y:e*n.width/n.height}}function Xs(e){return typeof e=="number"?{x:e,y:e}:e}function Js(e){return e.x>0&&e.y>0}var Lu=1e-6;function ya(e,n){return Math.round((e-.5)/n)*n+.5-e}function _u(e,n,t){let a=[e,e+n/2,e+n].map(r=>ya(r,t)).reduce((r,o)=>Math.abs(o)<Math.abs(r)?o:r);return ue(e+a)}function Cy(e,n){let t=Xs(n);return Js(t)?Ri({...e,x:_u(e.x,e.width,t.x),y:_u(e.y,e.height,t.y)}):e}function Pu(e,n,t,i={x:!0,y:!0}){let a=Xs(t);if(!Js(a))return e;let{x:r,y:o,width:s,height:l}=e,d=r+s,c=o+l;if(i.x&&n.includes("e")&&(s=Math.max(Ke,ue(d+ya(d,a.x)-r))),i.x&&n.includes("w")){let u=Math.min(ue(r+ya(r,a.x)),d-Ke);s=ue(d-u),r=ue(u)}if(i.y&&n.includes("s")&&(l=Math.max(Ke,ue(c+ya(c,a.y)-o))),i.y&&n.includes("n")){let u=Math.min(ue(o+ya(o,a.y)),c-Ke);l=ue(c-u),o=ue(u)}return{...e,x:r,y:o,width:s,height:l}}function Zs(e,n,t,i){let a=Xs(i);if(!Js(a))return e;let r=(o,s,l)=>{if(s===0)return o;let d=(o-.5)/l,c=s>0?Math.floor(d+Lu)+1:Math.ceil(d-Lu)-1,u=ue(c*l+.5);for(let p=0;p<1e3&&(s>0?u<=o:u>=o);p++)c+=s,u=ue(c*l+.5);return u};return Ri({...e,x:r(e.x,Math.sign(n),a.x),y:r(e.y,Math.sign(t),a.y)})}var Ke=.04,Lr=.04;function Nu(e,n){let t=()=>{let a=e.getScreenCTM();return a&&a.a!==0&&a.d!==0?{x:a.a,y:a.d}:void 0},i=t()??{x:1,y:1};return a=>(i=t()??i,{x:(a.clientX-n.clientX)/i.x,y:(a.clientY-n.clientY)/i.y})}function _r(e,n){let t={...e,...n};return Ri({...t,x:ue(t.x),y:ue(t.y),width:Math.max(Ke,ue(t.width)),height:Math.max(Ke,ue(t.height))})}function Qs(e,n){let t=n==="down"?e.x:ue((1-e.width)/2),i=n==="across"?e.y:ue((1-e.height)/2);return Ri({...e,x:t,y:i})}function zu(e,n){let t=Qs(e,n);return t.x===e.x&&t.y===e.y}function Ri(e){let n=Math.min(1-Lr,Math.max(-e.width+Lr,e.x)),t=Math.min(1-Lr,Math.max(-e.height+Lr,e.y));return{...e,x:n,y:t}}var ue=e=>Math.round(e*1e3)/1e3,Du=10;function Pr(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return Ri({...e,x:ue(a),y:ue(r)})}function Sy(e,n,t,i){let a=n.width,r=n.height,o=e.width*a,s=e.height*r,l=Math.min(o,s),d=e.x*a+(o-l)/2,c=e.y*r+(s-l)/2,u=t.includes("e")?1:-1,p=t.includes("s")?1:-1,m=Ke*Math.max(a,r),g=Math.max(m,l+(u*i.x+p*i.y)/2),y=u>0?d:d+l-g,b=p>0?c:c+l-g;return{...e,x:ue(y/a),y:ue(b/r),width:ue(g/a),height:ue(g/r)}}function Ty(e,n,t,i,a=!1){let r=n.width,o=n.height;if(a||e.width*r>=e.height*o){let p=a?Ke:Math.max(Ke,e.height*o/r),m=e.x+e.width,g=t.includes("e")?Math.max(p,e.width+i.x/r):Math.max(p,e.width-i.x/r),y=t.includes("e")?e.x:m-g;return{...e,x:ue(y),width:ue(g)}}let l=Math.max(Ke,e.width*r/o),d=e.y+e.height,c=t.includes("s")?Math.max(l,e.height+i.y/o):Math.max(l,e.height-i.y/o),u=t.includes("s")?e.y:d-c;return{...e,y:ue(u),height:ue(c)}}function Nr(e,n,t,i,a){let r=Nu(e,t),o={...i.handle&&i.outline?i.outline:i.frame},s={...i.frame};e.setPointerCapture(t.pointerId);let l=p=>Math.round(p*1e3)/1e3,d=p=>{if(p.pointerId!==t.pointerId)return;let m=r(p),g=m.x/n.width,y=m.y/n.height,b,$=i.snap!==void 0&&i.snap.on!==p.altKey?i.snap.step:void 0;if(!i.handle)b=Ri({...o,x:l(o.x+g),y:l(o.y+y)}),$!==void 0&&(b=Cy(b,$));else if(i.square)b=Sy(o,n,i.handle,m);else if(i.line||i.bar){if(b=Ty(o,n,i.handle,m,i.bar===!0),$!==void 0){let k=i.bar===!0||b.width*n.width>=b.height*n.height;b=Pu(b,i.handle,$,{x:k,y:!k})}}else{let{x:k,y:v,width:C,height:R}=o,M=o.x+o.width,A=o.y+o.height;i.handle.includes("e")&&(C=Math.max(Ke,o.width+g)),i.handle.includes("s")&&(R=Math.max(Ke,o.height+y)),i.handle.includes("w")&&(C=Math.max(Ke,o.width-g),k=M-C),i.handle.includes("n")&&(R=Math.max(Ke,o.height-y),v=A-R),b={...o,x:l(k),y:l(v),width:l(C),height:l(R)},$!==void 0&&(b=Pu(b,i.handle,$))}s=b,a.onFrame(i.elementId,b,!1)},c=p=>{p.pointerId===t.pointerId&&(u(),a.onFrame(i.elementId,s,!0))},u=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),u}function Ou(e,n,t,i,a){let r=Nu(e,n),o=1;e.setPointerCapture(n.pointerId);let s=c=>{if(c.pointerId!==n.pointerId)return;let u=r(c),p=u.x*(t.includes("e")?1:-1),m=u.y*(t.includes("s")?1:-1),g=i.w>0?(i.w+p)/i.w:1,y=i.h>0?(i.h+m)/i.h:1,b=Math.abs(g-1)>=Math.abs(y-1)?g:y;o=Math.max(.05,b),a(o,!1)},l=c=>{c.pointerId===n.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",s),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",s),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),d}var Ne=ce,xa=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:Ne,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Mi=xa.find(e=>e.measured);function ep(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return xa.find(a=>a.screen.width===t&&a.screen.height===i)}function Br(e,n){let t=Ne[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var sl=[{label:"Orange",hex:"#FF9F0A"},{label:"Red",hex:"#FF453A"},{label:"Green",hex:"#30D158"},{label:"Blue",hex:"#0A84FF"},{label:"Purple",hex:"#BF5AF2"},{label:"White",hex:"#FFFFFF"}];function Ey(e){switch(e){case"text":case"imageTime":case"tap":return"plain";case"image":return"picture";default:return"accent"}}function Ry(e,n){let t=We(n)??{color:"#FFFFFF",opacity:1},i=l=>(parseInt(t.color.slice(1+l*2,3+l*2),16)/255).toFixed(4),[a,r,o]=e==="plain"?["1","1","1"]:[i(0),i(1),i(2)];return`0 0 0 0 ${a} 0 0 0 0 ${r} 0 0 0 0 ${o} ${e==="picture"?"0.2126 0.7152 0.0722 0 0":"0 0 0 1 0"}`}function My(e,n){return w`${["accent","plain","picture"].map(i=>w`<filter id=${`${e}-${i}`} filterUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000"
    color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=${Ry(i,n)} /></filter>`)}`}function Jn(e,n,t){return t===void 0?e:w`<g filter=${`url(#${t}-${n})`}>${e}</g>`}function Bu(e,n){if(n===void 0||!(n>0))return f;let t=Ei(n,e),i=[],a=n<.025,r=l=>l===0?"rgba(10,132,255,0.6)":a&&l%10!==0?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.14)",o=Math.floor(.5/t.x+1e-6);for(let l=-o;l<=o;l++){let d=(.5+l*t.x)*e.width;d<=0||d>=e.width||i.push(w`<line x1=${d} y1="0" x2=${d} y2=${e.height} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}let s=Math.floor(.5/t.y+1e-6);for(let l=-s;l<=s;l++){let d=(.5+l*t.y)*e.height;d<=0||d>=e.height||i.push(w`<line x1="0" y1=${d} x2=${e.width} y2=${d} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}return w`<g class="snap-grid" pointer-events="none">${i}</g>`}var nl={regular:400,medium:500,semibold:600,bold:700},tp=1.15;function We(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function ye(e,n,t="#FFFFFF"){let i=We(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}var Gt=e=>e*.55;function np(e,n){switch(e){case"leading":return{anchor:"start",x:n.x};case"trailing":return{anchor:"end",x:n.x+n.w};default:return{anchor:"middle",x:n.cx}}}function Ay(e,n){let t=e.split(/\s+/).filter(r=>r!=="");if(t.length<2)return[e];let i="",a=0;for(let r=0;r<t.length-1;r++){let o=i===""?t[r]:`${i} ${t[r]}`;if(i!==""&&o.length>n)break;i=o,a=r+1}return a===0&&(i=t[0],a=1),[i,t.slice(a).join(" ")]}function Hy(e,n,t){if(t<=0||e.length*Gt(n)<=t)return e;let i=t-.8*n,a=Math.max(1,Math.floor(i/Gt(n)));return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function Fy(e,n){if(!n||n.map(i=>i.text).join("")!==e)return;let t=[];for(let i of n)for(let a=0;a<i.text.length;a++)t.push(i.colorHex);return t}function ip(e,n){if(n.length<2)return[0];let t=[...e.matchAll(/\S+/g)].map(i=>i.index);return[t[0]??0,t[n[0].split(" ").length]??e.length]}function ap(e,n,t,i,a){let r=[],o=n,s=a,l=d=>d<t.length&&/\s/.test(t[d]);for(let d of e){let c=s;if(/\s/.test(d))for(l(o)&&(c=i[o]);l(o);)o++;else{for(;l(o);)o++;t.startsWith(d,o)&&(c=i[o],o+=d.length)}s=c;let u=r.at(-1);u&&u.look===c?u.text+=d:r.push({text:d,look:c})}return r}function Iy(e){let n=[];for(let t of e){let i=t.spans!==void 0&&t.spans.map(a=>a.text).join("")===t.text?t.spans:[{text:t.text,colorHex:t.colorHex}];for(let a of i){let r={fontSize:t.fontSize,fontWeight:t.fontWeight,colorHex:a.colorHex};for(let o=0;o<a.text.length;o++)n.push(r)}}return n}function rp(e,n){return e.reduce((t,i)=>t+i.text.length*Gt(i.look.fontSize*n),0)}function Ly(e,n,t){let i=[...e.matchAll(/\S+/g)];if(i.length<2)return[e];let a=l=>n[l]?.fontSize??0,r=0,o=0;for(let l=0;l<i.length-1;l++){let d=i[l].index??0,c=o===0?0:Gt(a(d-1));for(let u=d;u<d+i[l][0].length;u++)c+=Gt(a(u));if(o>0&&r+c>t)break;r+=c,o=l+1}let s=l=>l.map(d=>d[0]).join(" ");return[s(i.slice(0,o)),s(i.slice(o))]}function _y(e,n,t){if(t<=0||rp(e,n)<=t)return[...e];let i=[],a=0,r=0;e:for(let s of e){let l=s.look.fontSize*n,d=t-.8*l,c="";for(let u of s.text){if(r>0&&a+u.length*Gt(l)>d){c!==""&&i.push({text:c,look:s.look});break e}c+=u,a+=u.length*Gt(l),r+=1}i.push({text:c,look:s.look})}for(;i.length>0;){let s=i.at(-1);if(s.text=s.text.replace(/\s+$/,""),s.text!=="")break;i.pop()}let o=i.at(-1);return o?o.text+="\u2026":e[0]&&i.push({text:"\u2026",look:e[0].look}),i}function Py(e,n,t){let i=Iy(n),a=e.lineLimit===2&&t.w>0?Ly(e.text,i,t.w):[e.text],r=ip(e.text,a),o=a.map((k,v)=>ap(k,r[v]??0,e.text,i,i[0])),s=Math.max(...o.map(k=>rp(k,1))),l=s>t.w&&t.w>0?Math.max(.5,t.w/s):1,d=o.map(k=>_y(k,l,t.w)),{anchor:c,x:u}=np(e.alignment,t),p=Math.max(0,...d.flat().map(k=>k.look.fontSize))*l||e.fontSize*l,m=.35*p,g=p*1.15,y=k=>k.map(v=>{let C=ye(v.look.colorHex,"fill");return w`<tspan font-size=${v.look.fontSize*l} font-weight=${nl[v.look.fontWeight]??400} fill=${C.fill} fill-opacity=${C["fill-opacity"]}>${v.text}</tspan>`}),b=ye(e.colorHex,"fill"),$=d.length>1?w`${d.map((k,v)=>w`<tspan x=${u} y=${t.cy+m+(v-(d.length-1)/2)*g}>${y(k)}</tspan>`)}`:y(d[0]);return w`<text x=${u} y=${t.cy+m} text-anchor=${c}
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${e.fontSize*l} font-weight=${nl[e.fontWeight]??400}
    style=${e.monospacedDigits?"font-variant-numeric: tabular-nums":f}
    fill=${b.fill} fill-opacity=${b["fill-opacity"]}>${$}</text>`}function Ny(e,n){if(e.parts!==void 0&&e.countdownEnd===void 0&&e.parts.map(y=>y.text).join("")===e.text)return e.text===""?f:Py(e,e.parts,n);let t=ye(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:Ti((e.countdownEnd-Date.now())/1e3)});let i=e.lineLimit===2&&n.w>0?Ay(e.text,n.w/Gt(e.fontSize)):[e.text],a=Math.max(...i.map(y=>y.length))*Gt(e.fontSize),r=a>n.w&&n.w>0?Math.max(.5,n.w/a):1,o=e.fontSize*r,s=i.map(y=>Hy(y,o,n.w)),{anchor:l,x:d}=np(e.alignment,n),c=Fy(e.text,e.spans),u=c?ip(e.text,i):[],p=(y,b)=>c?ap(y,u[b]??0,e.text,c,e.colorHex).map($=>{let k=ye($.look,"fill");return w`<tspan fill=${k.fill} fill-opacity=${k["fill-opacity"]}>${$.text}</tspan>`}):y,m=o*1.15,g=s.length>1?w`${s.map((y,b)=>w`<tspan x=${d} y=${n.cy+(b-(s.length-1)/2)*m}>${p(y,b)}</tspan>`)}`:p(s[0],0);return w`<text x=${d} y=${n.cy} text-anchor=${l} dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${nl[e.fontWeight]??400}
    style=${e.monospacedDigits?"font-variant-numeric: tabular-nums":f}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${g}</text>`}var il=2;function op(e,n){let t=n.w>=n.h,i=Math.max(1,e.dotCount),a=t?n.w:n.h,r=t?n.h:n.w,o=Math.max(1,Math.min(r,a/i-il)),s=i*o+(i-1)*il;return{horizontal:t,count:i,d:o,span:s}}function zy(e,n){let t=ye(e.colorHex,"stroke"),i=ye(e.trackColorHex,"stroke","#FFFFFF"),a=ye(e.thresholdColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="dots"){let{horizontal:m,count:g,d:y,span:b}=op(e,n),$=(m?n.cx:n.cy)-b/2+y/2;return w`${Array.from({length:g},(k,v)=>{let C=$+v*(y+il),R=v<e.filledCount?t:i;return w`<circle cx=${m?C:n.cx} cy=${m?n.cy:C} r=${y/2}
        fill=${R.stroke} fill-opacity=${R["stroke-opacity"]} />`})}`}if(e.style==="bar"){let m=n.w,g=Math.max(r,m*e.fraction),y=1;return w`
      <rect x=${n.x} y=${n.cy-r/2} width=${m} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-r/2} width=${g} height=${r} rx=${r/2}
        fill=${t.stroke} fill-opacity=${t["stroke-opacity"]} />
      ${e.thresholdFraction===void 0?f:w`<rect x=${n.x+Math.min(m-y,Math.max(0,m*e.thresholdFraction-y/2))}
            y=${n.cy-r/2} width=${y} height=${r}
            fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} />`}`}let o=Math.min(n.w,n.h),s=Math.max(0,o/2-r/2),l=2*Math.PI*s,d=e.style==="ring"?1:.75,c=e.style==="ring"?-90:135,u=l*d,p=l*d*e.fraction;return w`
    <g transform="rotate(${c} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${u} ${l}" />
      ${e.fraction>0?w`<circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
            stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
            stroke-dasharray="${p} ${l}" />`:f}
      ${e.thresholdFraction===void 0?f:Dy(n,s,r,d*360*e.thresholdFraction,e.thresholdColorHex)}
    </g>`}function Dy(e,n,t,i,a){let r=ye(a,"stroke","#FFFFFF"),o=i*Math.PI/180,s=Math.cos(o),l=Math.sin(o),d=t/2+1;return w`<line x1=${e.cx+s*(n-d)} y1=${e.cy+l*(n-d)}
    x2=${e.cx+s*(n+d)} y2=${e.cy+l*(n+d)}
    stroke-width="1" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} />`}function Oy(e,n){let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Xn(e,n),o=r?ll(e,n,t,i):void 0;if(e.values.length===0)return o===void 0?f:w`${o}`;let s=Vy(e,a);return o===void 0?s:w`${s}${o}`}function el(e){switch(e.kind){case"smooth":return`C${e.c1.x} ${e.c1.y} ${e.c2.x} ${e.c2.y} ${e.end.x} ${e.end.y}`;case"step":return`L${e.corner.x} ${e.corner.y} L${e.end.x} ${e.end.y}`;case"straight":return`L${e.end.x} ${e.end.y}`}}var Vu=0;function sp(){return Vu+=1,Vu.toString(36)}function zr(e,n,t){let{x:i,y:a,w:r,h:o}=e,s=Math.max(0,n);if(s===0)return`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o} L${i} ${a+o} Z`;if(s>o){let l=Math.sqrt(o*(2*s-o)),d=i+s-l,c=i+r-s+l;return t?`M${d} ${a} L${c} ${a} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${d} ${a} Z`:`M${d} ${a+o} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${c} ${a+o} Z`}return t?`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o-s} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${i} ${a+o-s} Z`:`M${i} ${a+o} L${i} ${a+s} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${i+r} ${a+s} L${i+r} ${a+o} Z`}function By(e,n,t,i){let a=n.x,r=n.x+n.w;if(i){let l=e.y,d=n.y+n.h;return t===0?`M${a} ${l} L${a} ${d} L${r} ${d} L${r} ${l}`:`M${a} ${l} L${a} ${d-t} A${t} ${t} 0 0 0 ${a+t} ${d} L${r-t} ${d} A${t} ${t} 0 0 0 ${r} ${d-t} L${r} ${l}`}let o=e.y+e.h,s=n.y;return t===0?`M${a} ${o} L${a} ${s} L${r} ${s} L${r} ${o}`:`M${a} ${o} L${a} ${s+t} A${t} ${t} 0 0 1 ${a+t} ${s} L${r-t} ${s} A${t} ${t} 0 0 1 ${r} ${s+t} L${r} ${o}`}function Vy(e,n){let t=Ir(e,n),i=sp(),a=ye(e.colorHex,"fill"),r=ye(e.highColorHex,"fill",e.colorHex),o=ye(e.lowColorHex,"fill",e.colorHex),s=(g,y)=>w`<circle cx=${g.x} cy=${g.y} r="1.7" fill=${y.fill} fill-opacity=${y["fill-opacity"]} />`,l=[],d=new Map,c=e.pointColorHexes.length===t.count,u=g=>c?ye(e.pointColorHexes[g],"fill",e.colorHex):a,p=g=>{let y=We(g)??We(e.colorHex)??{color:"#FFFFFF",opacity:1};if(e.fillStyle!=="fade")return{fill:y.color,opacity:y.opacity*.28};let b=Gy(i,e.id,g),$=t.baselineY<=t.plotTop?t.plotBottom:t.plotTop;return d.has(b)||d.set(b,w`<linearGradient id=${b} gradientUnits="userSpaceOnUse" x1="0" y1=${$} x2="0" y2=${t.baselineY}>
        <stop offset="0" stop-color=${y.color} stop-opacity=${y.opacity*.28} />
        <stop offset="1" stop-color=${y.color} stop-opacity="0" /></linearGradient>`),{fill:`url(#${b})`,opacity:1}};if(e.style==="bars")for(let g=0;g<t.count;g++){if(e.holes[g]===!0)continue;let y=t.barRect(g),b=e.barFillColorHexes.length===t.count?e.barFillColorHexes[g]:void 0,$=b!==void 0?ye(b,"fill",e.colorHex):g===e.highIndex?r:g===e.lowIndex?o:u(g),k=e.barCorners==="top"?Math.min(Math.max(e.barRadius,0),y.w/2):Math.min(Math.max(e.barRadius,0),y.w/2,y.h/2),v=e.baseline==="zero"&&e.values[g]<0,C=e.barCorners==="top"&&v,R=e.barBorderWidth>0&&e.barBorderColorHexes.length===t.count?e.barBorderColorHexes[g]:void 0,M=e.barBorderWidth,A=R!==void 0&&(y.w<=2*M||y.h<=2*M),F=A?ye(R,"fill",e.colorHex):$;if(e.barCorners==="top"?l.push(w`<path d=${zr(y,k,C)}
          fill=${F.fill} fill-opacity=${F["fill-opacity"]} />`):l.push(w`<rect x=${y.x} y=${y.y} width=${y.w} height=${y.h} rx=${k}
          fill=${F.fill} fill-opacity=${F["fill-opacity"]} />`),R!==void 0&&!A){let E=ye(R,"fill",e.colorHex),N={x:y.x+M/2,y:y.y+M/2,w:y.w-M,h:y.h-M},j=e.barCorners==="top"?Math.min(Math.max(k-M/2,0),N.w/2):Math.min(Math.max(k-M/2,0),N.w/2,N.h/2);if(e.barBorderOpenBase){let q=`${i}bb${g}`,O=e.barCorners==="top"?w`<path d=${zr(y,k,C)} />`:w`<rect x=${y.x} y=${y.y} width=${y.w} height=${y.h} rx=${k} />`;d.set(q,w`<clipPath id=${q}>${O}</clipPath>`),l.push(w`<path d=${By(y,N,j,v)} fill="none" stroke=${E.fill} stroke-opacity=${E["fill-opacity"]} stroke-width=${M} clip-path=${`url(#${q})`} />`);continue}let K=e.barCorners==="top"?zr(N,j,C):zr(N,0,!1);e.barCorners==="top"||j===0?l.push(w`<path d=${K} fill="none" stroke=${E.fill} stroke-opacity=${E["fill-opacity"]} stroke-width=${M} />`):l.push(w`<rect x=${N.x} y=${N.y} width=${N.w} height=${N.h} rx=${j}
            fill="none" stroke=${E.fill} stroke-opacity=${E["fill-opacity"]} stroke-width=${M} />`)}}else{let g=Array.from({length:t.count},(k,v)=>t.point(v)),y=e.holes.length>0,$=Iu(t.count,e.holes).filter(k=>!y||k.length>1).map(k=>{let v=k.map(M=>g[M]),C=Fu(v,e.curve),R=`M${v[0].x} ${v[0].y}${C.map(M=>` ${el(M)}`).join("")}`;return{run:k,pts:v,legs:C,line:R}});if(e.style==="area")for(let{run:k,pts:v,legs:C,line:R}of $)if(e.fillBands&&c&&k.length>1&&e.fillColorHex===void 0)for(let M=0;M<C.length;M++){let A=v[M],F=v[M+1],E=p(e.pointColorHexes[k[M+1]]),N=`M${A.x} ${A.y} ${el(C[M])} L${F.x} ${t.baselineY} L${A.x} ${t.baselineY} Z`;l.push(w`<path d=${N} fill=${E.fill} fill-opacity=${E.opacity} stroke="none" />`)}else{let M=p(e.fillColorHex??e.colorHex),A=`${R} L${v[v.length-1].x} ${t.baselineY} L${v[0].x} ${t.baselineY} Z`;l.push(w`<path d=${A} fill=${M.fill} fill-opacity=${M.opacity} stroke="none" />`)}for(let{run:k,pts:v,legs:C,line:R}of $)if(c&&k.length>1)for(let M=0;M<C.length;M++){let A=v[M],F=u(k[M+1]);l.push(w`<path d=${`M${A.x} ${A.y} ${el(C[M])}`} fill="none"
            stroke=${F.fill} stroke-opacity=${F["fill-opacity"]}
            stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(w`<path d=${R} fill="none" stroke=${a.fill} stroke-opacity=${a["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(s(g[e.highIndex],r)),e.lowIndex!==void 0&&l.push(s(g[e.lowIndex],o))}let m=(g,y,b,$)=>{if(g===void 0||y==="none")return;let k=t.markerCenter(g,e.style==="bars",$);l.push(y==="triangle"?w`<path d=${`M${k.x} ${k.y-1.8} L${k.x+2.2} ${k.y+1.8} L${k.x-2.2} ${k.y+1.8} Z`}
          fill=${b.fill} fill-opacity=${b["fill-opacity"]} />`:s(k,b))};if(m(e.highIndex,e.highMarker,r,"high"),m(e.lowIndex,e.lowMarker,o,"low"),e.drawsThreshold&&e.thresholdY!==void 0){let g=t.yAtFraction(e.thresholdY),y=ye(e.thresholdColorHex,"fill",e.colorHex);l.push(w`<path d=${`M${t.plotLeft} ${g} L${t.plotRight} ${g}`} fill="none"
      stroke=${y.fill} stroke-opacity=${y["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`)}if(e.drawsNowLine&&e.nowIndex!==void 0&&e.nowIndex<t.count){let g=t.markerCenter(e.nowIndex,e.style==="bars").x,y=ye(e.nowColorHex,"fill",e.colorHex);l.push(w`<path d=${`M${g} ${t.plotTop} L${g} ${t.plotBottom}`} fill="none"
      stroke=${y.fill} stroke-opacity=${y["fill-opacity"]} stroke-width="1" />`)}return d.size===0?w`${l}`:w`<defs>${[...d.values()]}</defs>${l}`}function Gy(e,n,t){return`chartfade-${e}-${n}-${t}`.replace(/[^0-9A-Za-z_-]/g,"")}function ll(e,n,t,i){let a=(e.labelsAbove?n.y:n.y+n.h-i)+i/2,r=ye(e.labelColorHex,"fill");return e.labels.map((o,s)=>{let d=s===e.labels.length-1?"end":s===0?"start":"middle",c=n.x+o.position*n.w;return w`<text x=${c} y=${a} text-anchor=${d} dominant-baseline="central"
      font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size=${t} font-weight="400"
      fill=${r.fill} fill-opacity=${r["fill-opacity"]}>${o.text}</text>`})}function Uy(e,n){if(e.runs.length===0&&e.labels.length===0||n.w<=0||n.h<=0)return f;let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Xn(e,n),o=Math.max(0,Math.min(e.gap,n.w/Math.max(1,e.runs.length))),s=e.runs.map((l,d)=>{let c=n.x+l.start*n.w,u=(l.end-l.start)*n.w,p=d===e.runs.length-1,m=Math.max(p?u:Math.min(u,.5),u-(p?0:o)),g=Math.max(0,Math.min(e.cornerRadius,m/2,a.h/2)),y=ye(l.colorHex,"fill");return w`<rect x=${c} y=${a.y} width=${m} height=${a.h} rx=${g}
      fill=${y.fill} fill-opacity=${y["fill-opacity"]} />`});return r?w`${s}${ll(e,n,t,i)}`:w`${s}`}function Ky(e,n){if(e.labels.length===0||n.w<=0||n.h<=0)return f;let{labelSize:t,rowHeight:i}=Xn({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),a={...n,y:n.cy-i/2,h:i};return w`${ll({labels:e.labels,labelColorHex:e.labelColorHex,labelsAbove:!1},a,t,i)}`}function lp(e,n){if(!(e===void 0||n.w<=0||n.h<=0))return{chart:e,g:Ir(e,Xn(e,n).body)}}function Wy(e,n,t,i=!1,a=0){let r=lp(t,n);if(e.indices.length===0||r===void 0)return f;let o=r.chart,s=o.pointColorHexes.length===o.values.length,l=Math.max(e.diameter/2,a),d=new Map,c=l+1.2,u="";for(let m of e.indices){if(m>=o.values.length)continue;let g=r.g.point(m),y=e.colorHex??(s?o.pointColorHexes[m]:o.colorHex);d.set(y,`${d.get(y)??""}M${g.x-l} ${g.y} a${l} ${l} 0 1 0 ${2*l} 0 a${l} ${l} 0 1 0 ${-2*l} 0 Z`),i&&(u+=`M${g.x-c} ${g.y} a${c} ${c} 0 1 0 ${2*c} 0 a${c} ${c} 0 1 0 ${-2*c} 0 Z`)}let p=i&&u!==""?w`<path d=${u} fill="none" stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f;return w`${p}${[...d].map(([m,g])=>{let y=ye(m,"fill",o.colorHex);return w`<path d=${g} fill=${y.fill} fill-opacity=${y["fill-opacity"]} stroke="transparent" stroke-width="3" />`})}`}function jy(e,n,t,i=!1,a=0){let r=lp(t,n);if(!e.draws||r===void 0)return f;let o=We(e.colorHex)??{color:"#FFFFFF",opacity:.2},s=Hu(r.g,e.lines);return w`${s.map(l=>w`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none"
    stroke=${o.color} stroke-opacity=${Math.max(o.opacity,a>0?.6:0)} stroke-width=${Math.max(e.thickness,a)} />`)}${i?s.map(l=>w`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none" stroke="#0A84FF"
        stroke-width="1" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />`):f}`}function Gu(e){let n=Math.min(e.w,e.h);return{x:e.cx-n/2,y:e.cy-n/2,w:n,h:n,cx:e.cx,cy:e.cy}}var ba=4;function qy(e,n){let t=e.w>=e.h,i=t?e.h:e.w,a=Math.min(i,Math.max(ba,Math.max(0,n)));return t?{x:e.x,y:e.cy-a/2,w:e.w,h:a,cx:e.cx,cy:e.cy}:{x:e.cx-a/2,y:e.y,w:a,h:e.h,cx:e.cx,cy:e.cy}}function dp(e,n){if(e.kind==="shape")return e.shapeKind==="circle"?Gu(n):e.shapeKind==="line"?qy(n,e.thickness):n;if(e.kind==="icon"){let t=Math.max(ba,dl(e));return{x:n.cx-t/2,y:n.cy-t/2,w:t,h:t,cx:n.cx,cy:n.cy}}if(e.kind==="chartTimes"){if(e.labels.length===0||n.w<=0||n.h<=0)return n;let{rowHeight:t}=Xn({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),i=Math.max(ba,t);return{x:n.x,y:n.cy-i/2,w:n.w,h:i,cx:n.cx,cy:n.cy}}if(e.kind==="imageTime"){let t=Cs(n.w,n.h);if(!e.linked||t<=0)return n;let i=ul(new Date).length*t*.578+t*.89,a=t*1.25;return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}if(e.kind!=="gauge")return n;switch(e.style){case"ring":case"arc":return Gu(n);case"bar":{let t=Math.max(ba,e.lineWidth);return{x:n.x,y:n.cy-t/2,w:n.w,h:t,cx:n.cx,cy:n.cy}}case"dots":{let{horizontal:t,d:i,span:a}=op(e,n),r=Math.max(ba,i);return t?{x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,cx:n.cx,cy:n.cy}:{x:n.cx-r/2,y:n.cy-a/2,w:r,h:a,cx:n.cx,cy:n.cy}}default:return n}}function cp(e,n,t){return e.kind==="shape"?e.shapeKind==="circle"?{square:!0}:e.shapeKind==="line"?{line:!0}:{}:e.kind==="chartTimes"?{bar:!0}:e.kind==="imageTime"?Uu(e,n,t):e.kind!=="gauge"?{}:e.style==="ring"||e.style==="arc"?{square:!0}:e.style==="bar"?{bar:!0}:e.style!=="dots"?{}:Uu(e,n,t)}function Uu(e,n,t){if(t.width<=0||t.height<=0)return{};let i=dp({...e,frame:n},ga({...e,frame:n},t));return{outline:{...n,x:i.x/t.width,y:i.y/t.height,width:i.w/t.width,height:i.h/t.height}}}function dl(e){return e.path!==void 0&&e.path!==""?e.size*tp:e.size}function Yy(e,n){let t=ye(e.fillColorHex,"fill"),i=e.borderColorHex?We(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",s=i?i.opacity:0;switch(e.shapeKind){case"circle":{let l=Math.min(n.w,n.h)/2-r;return w`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,l)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"capsule":{let l=Math.min(n.w,n.h)/2;return w`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${l}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"roundedRectangle":return w`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${e.cornerRadius}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"rectangle":return w`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"line":{let l=n.w>=n.h,d=Math.max(0,Math.min(e.thickness,l?n.h:n.w)),c=l?n.x:n.cx-d/2,u=l?n.cy-d/2:n.y;return w`<rect x=${c} y=${u} width=${l?n.w:d} height=${l?d:n.h}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]} stroke="none" />`}}}function Xy(e,n,t){if(e.path!==void 0&&e.path!==""){let o=ye(e.colorHex,"fill"),s=e.size*tp;return w`<g transform="translate(${n.cx-s/2} ${n.cy-s/2}) scale(${s/24})">
      <path d=${e.path} fill=${o.fill} fill-opacity=${o["fill-opacity"]} /></g>`}let i=t.render(e.symbol,e.size,e.colorHex);if(i)return w`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${i}</g>`;let a=ye(e.colorHex,"stroke"),r=e.size;return w`
    <rect x=${n.cx-r/2} y=${n.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var cl=.25,Jy=8;function Zy(e,n,t,i,a,r,o,s){let l={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return l;let d=Math.min(Math.max(Number.isFinite(r)?r:1,cl),Jy),c=Math.max(e/t,n/i),u=Math.min(e/t,n/i),p=(a==="fit"?u:c)*d,m=t*p,g=i*p,y=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),b=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(m-e)/2*(1+y)+0,y:-(g-n)/2*(1+b)+0,width:m,height:g}}function ul(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var Dr=4;function Qy(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?n.x+Dr:n.x+n.w-Dr-a,d=e.timestampCorner.startsWith("top")?n.y+Dr:n.y+n.h-Dr-r;return{x:l,y:d,w:a,h:r,size:i,label:t}}let s=(l,d,c,u)=>u>=c?d+(c-u)/2:Math.min(d+c-u,Math.max(d,l-u/2));return{x:s(n.x+e.timestampX*n.w,n.x,n.w,a),y:s(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function eb(e,n){if(e==="camera")return"camera.fill";switch(n.split(".")[0]){case"camera":return"camera.fill";case"person":return"person.crop.circle";case"media_player":return"music.note";default:return"photo"}}function tb(e,n,t){let i=t.icons,a=`imgclip-${sp()}-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?Qy(e,n,ul(new Date)):void 0,s=o?up(o):f,l=e.url?t.imageSizes?.size(e.url):void 0,d;if(e.url&&l){let c=Zy(n.w,n.h,l.width,l.height,e.contentMode,e.zoom,e.panX,e.panY);d=w`<image href=${e.url} x=${n.x+c.x} y=${n.y+c.y} width=${c.width} height=${c.height}
      preserveAspectRatio="none" />`}else e.url?d=w`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:d=w`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render(eb(e.source,e.entityId),14,"#FFFFFF99")??f}</g>`;return w`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${d}${s}</g>`}function up(e,n=1){return w`<g opacity=${n}>
    <rect x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx=${e.h/2} fill="#000000" fill-opacity="0.55" />
    <text x=${e.x+e.w/2} y=${e.y+e.h/2} text-anchor="middle" dominant-baseline="central"
      font-size=${e.size} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${e.label}</text></g>`}function nb(e,n){if(!e.linked)return f;let t=ul(new Date),i=Cs(n.w,n.h);if(i<=0)return f;let a=t.length*i*.578+i*.89,r=i*1.25;return up({x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,size:i,label:t},e.url===void 0?.5:1)}function ib(e,n,t,i,a){if(!i)return f;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?ab(a,n):void 0;return w`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?w`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${al} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?w`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??f}</g>`:f}`}var al=5;function ab(e,n){let t=al*.55,i=n.w-2;if(n.h<al*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function pp(e){let n=new Map;for(let t of e)t.kind==="chart"&&n.set(t.id,t);return n}function Or(e,n,t,i=new Map,a,r="body"){if(e.isHidden&&!t.showHidden)return f;let o=t.tapReview===!0,s=t.tapAreas===!0||o,l=o?t.tapFocusId:void 0,d=l!==void 0&&e.id===l,c=l!==void 0;if(e.kind==="tap"&&!s)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!o||c&&!d))return f;let u=ga(e,n),p=o&&(!c||d),m;if(r==="body")switch(e.kind){case"text":m=Ny(e,u);break;case"icon":m=Xy(e,u,t.icons);break;case"gauge":m=zy(e,u);break;case"chart":m=Oy(e,u);break;case"timeline":m=Uy(e,u);break;case"chartTimes":m=Ky(e,u);break;case"imageTime":m=nb(e,u);break;case"chartDots":m=Wy(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minDotRadius);break;case"chartGrid":m=jy(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minGridStroke);break;case"shape":m=Yy(e,u);break;case"image":m=tb(e,u,t);break;case"tap":m=ib(e,u,t.icons,s,p?Dt(e.action):void 0);break}e.kind!=="tap"&&(m=Jn(m,Ey(e.kind),a));let g=o&&(e.kind!=="tap"||c&&!d)?.35:1,y=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*g,b=t.highlightId===e.id,$=b||t.highlightIds?.includes(e.id)===!0,k=e.kind==="chartDots"||e.kind==="chartGrid",v=e.chartAnchor?.place==="through",C=t.handles===!0&&(!c||d)&&!k&&!v,R=dp(e,u),M=$&&!k?w`<rect x=${R.x} y=${R.y} width=${R.w} height=${R.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,A=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?w`<rect x=${R.x} y=${R.y} width=${R.w} height=${R.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,F=k?f:w`<rect x=${R.x} y=${R.y} width=${R.w} height=${R.h} fill="transparent" stroke="none" />`,E=3,N=R,j=b&&C?[["nw",N.x-E,N.y-E],["ne",N.x+N.w,N.y-E],["sw",N.x-E,N.y+N.h],["se",N.x+N.w,N.y+N.h]].map(([K,q,O])=>w`<rect data-handle=${K} x=${q} y=${O} width=${E} height=${E}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${K}-resize" />`):f;return r==="handles"?j===f?f:w`<g data-element-id=${e.id} opacity=${y} transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${j}</g>`:w`<g data-element-id=${e.id} opacity=${y} style=${C?"cursor:move":e.kind==="chartDots"?"cursor:pointer":f}
    pointer-events=${e.kind==="chartGrid"?"none":f}
    transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${F}${m}${A}${M}</g>`}function Vr(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function pl(e,n){return(n?23.5:34)*e}var Ku=10.5;function hp(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function Wu(e,n){let t=0;for(let i of e)t+=hp(i,n);return t}function ju(e,n,t){let i=e.toUpperCase(),a=d=>hp(d,t),r=.9*t,o=0;for(let d of i)o+=a(d);if(o<=n)return i;let s=0,l="";for(let d of i){if(s+a(d)+r>n)break;l+=d,s+=a(d)}return`${l.replace(/\s+$/,"")}\u2026`}function rl(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function ol(e,n,t,i){let a=rl(e,n,t),r=rl(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function mp(e,n,t,i){let{dial:a}=Vr(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:ol(a,t,i.start,i.end),length:t*r}}function rb(e,n){let t=Vr(e,!0);return mp(e,n,t.dial.r,t.labelArc)}var qu=18.5,ob=113,sb={start:-71,end:-36},Yu=104,lb=6.2,Xu={start:-77,end:-30.5};function Ju(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function Zu(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=Ju(e[i]),o=Ju(e[i+1]),s=(l,d)=>Math.round(l+(d-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var tl=11;function db(e,n,t){let{dial:i}=Vr(n,!0),a=Yu*n,r=180/(Math.PI*Yu),o=e.minLabel!==void 0?Wu(e.minLabel,tl)*r:0,s=e.maxLabel!==void 0?Wu(e.maxLabel,tl)*r:0,l=Xu.start+(o>0?Math.max(0,o-1.8):0),d=Xu.end-(s>0?Math.max(0,s-1.8):0),c=d-l,u=24,p=[];for(let $=0;$<u;$++){let k=l+c*$/u,v=Math.min(d,l+c*($+1)/u+.4);p.push(w`<path d=${ol(i,a,k,v)} fill="none"
      stroke=${Zu(e.colorHexes,($+.5)/u)} stroke-width=${lb*n}
      stroke-linecap=${$===0||$===u-1?"round":"butt"} />`)}let m=(e.value-e.minValue)/(e.maxValue-e.minValue),g=rl(i,a,l+c*m),y=1.5,b=($,k,v,C)=>w`
    <defs><path id=${$} d=${ol(i,a,k,v)} /></defs>
    <text font-size=${tl*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${$}" startOffset="50%" text-anchor="middle">${C}</textPath></text>`;return w`${p}
    <circle cx=${g.x} cy=${g.y} r=${3.2*n} fill=${Zu(e.colorHexes,m)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?b(`${t}-gmin`,l-y-Math.max(o,3),l-y,e.minLabel):f}
    ${e.maxLabel!==void 0?b(`${t}-gmax`,d+y,d+y+Math.max(s,3),e.maxLabel):f}`}function Ai(e,n){let t=e.family in Ne?e.family:"rectangular",i=n.slot??Ne[t],a=Ne[t],r=Br(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,s=We(e.backgroundColorHex),l=We(e.borderColorHex),d=e.borderWidth*r.scale,c=e.elements,u=pp(c),p=n.tint===void 0?void 0:`${o}-tint`,m=p===void 0?f:My(p,n.tint);if(t==="corner"){let k=r.scale,v=!!e.bezelText||!!e.bezelGauge,C=e.curvedText??"",R=C!=="",M=Vr(k,v),A=pl(k,v),F=A/(a.width*k),E=M.tile.cx-A/2,N=M.tile.cy-A/2,j=`M 0 0 H ${M.quad.width-M.cornerRadius} A ${M.cornerRadius} ${M.cornerRadius} 0 0 1 ${M.quad.width} ${M.cornerRadius} V ${M.quad.height} H 0 Z`,K=f;if(e.bezelGauge)K=db(e.bezelGauge,k,o);else if(e.bezelText){let O=rb(k,`${o}-bezel`),z=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?Ti((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;K=w`<defs><path id=${O.id} d=${O.d} /></defs>
        <text font-size=${Ku*k} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${O.id}" startOffset="50%" text-anchor="middle">${ju(z,O.length,Ku*k)}</textPath></text>`}let q=f;if(R){let O=We(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},z=mp(k,`${o}-curved`,ob*k,sb);q=w`<defs><path id=${z.id} d=${z.d} /></defs>
        <text font-size=${qu*k} font-weight="600" fill=${O.color} fill-opacity=${O.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${z.id}" startOffset="50%" text-anchor="middle">${ju(C,z.length,qu*k*.88)}</textPath></text>`}else{let O=e.borderWidth*r.scale*F,z=l?w`<circle cx=${A/2} cy=${A/2} r=${A/2-O/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${O} />`:f;q=w`<g transform="translate(${E} ${N})">
        <g clip-path=${`url(#${o})`}>
          ${s?Jn(w`<rect width=${A} height=${A} fill=${s.color} fill-opacity=${s.opacity} />`,"plain",p):f}
          <g data-design-box transform="scale(${r.scale*F})">
            ${c.map(H=>Or(H,a,n,u,p))}
            ${Bu(a,n.grid)}
          </g>
        </g>
        <circle cx=${A/2} cy=${A/2} r=${A/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*k} stroke-dasharray=${`${2*k} ${2*k}`} />
        ${Jn(z,"plain",p)}
        <g transform="scale(${r.scale*F})">${Qu(c,a,n,u)}</g>
      </g>`}return w`<svg viewBox=${`0 0 ${M.quad.width} ${M.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${M.quad.width} height=${M.quad.height}>
      <defs><clipPath id=${o}><circle cx=${A/2} cy=${A/2} r=${A/2} /></clipPath>${m}</defs>
      <path d=${j} fill="#000000" />
      ${Jn(K,"accent",p)}
      ${R?Jn(q,"accent",p):q}
    </svg>`}let g=w`<rect width=${i.width} height=${i.height} />`,y=l?w`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${d} />`:f,b=w`<rect width=${i.width} height=${i.height} fill="#000000" />`,$=`0 0 ${i.width} ${i.height}`;return w`<svg viewBox=${$} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${g}</clipPath>${m}</defs>
    <g clip-path=${`url(#${o})`}>
      ${b}
      ${s?Jn(w`<rect width=${i.width} height=${i.height} fill=${s.color} fill-opacity=${s.opacity} />`,"plain",p):f}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${c.map(k=>Or(k,a,n,u,p))}
            ${Bu(a,n.grid)}
      </g>
    </g>
    ${Jn(y,"plain",p)}
    <g transform="translate(${r.x} ${r.y}) scale(${r.scale})">${Qu(c,a,n,u)}</g>
  </svg>`}function Qu(e,n,t,i){if(t.handles!==!0||t.highlightId===void 0)return f;let a=e.find(r=>r.id===t.highlightId);return a===void 0?f:Or(a,n,t,i,void 0,"handles")}var cb=.14;function ub(e,n){let t=ga(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function pb(e,n,t){let i=e.family in Ne?e.family:"rectangular",a=Ne[i],r=e.elements.filter(p=>n.includes(p.id)),o=1/0,s=1/0,l=-1/0,d=-1/0;for(let p of r){let m=ub(p,a),g=p.frame.rotationDegrees%180===0?0:Math.hypot(m.w,m.h)/2;o=Math.min(o,g?m.cx-g:m.x),s=Math.min(s,g?m.cy-g:m.y),l=Math.max(l,g?m.cx+g:m.x+m.w),d=Math.max(d,g?m.cy+g:m.y+m.h)}let c=l-o,u=d-s;if(r.length===0||!(c>0)||!(u>0))o=0,s=0,c=a.width,u=a.height;else{let p=Math.max(2,Math.max(c,u)*cb);o-=p,s-=p,c+=2*p,u+=2*p}if(c/u<t){let p=u*t;o-=(p-c)/2,c=p}else{let p=c/t;s-=(p-u)/2,u=p}return{x:o,y:s,w:c,h:u}}function fp(e,n,t){let i=e.family in Ne?e.family:"rectangular",a=Ne[i],r=pb(e,n,t.width/t.height),o=We(e.backgroundColorHex),s=We(e.borderColorHex),l=e.borderWidth,d={icons:t.icons,showHidden:!0,tapAreas:!0,minDotRadius:r.w/40,minGridStroke:r.w/110,...t.imageSizes?{imageSizes:t.imageSizes}:{}},c=e.elements.filter(m=>n.includes(m.id)),u=s&&l>0?i==="rectangular"?w`<rect x=${l/2} y=${l/2} width=${a.width-l} height=${a.height-l} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:w`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-l/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:f,p=i==="rectangular"?w`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:w`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return w`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${p}
    ${c.map(m=>Or(m,a,d,pp(e.elements)))}
    ${u}
  </svg>`}function ne(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var mn=["rectangular","circular","corner","inline"];function Hi(e){return se.includes(e)}function Zn(e){return mn.filter(n=>e.supportedFamilies.includes(n))}function hl(e){return se.find(n=>e.supportedFamilies.includes(n))}function Gr(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function hb(){return{value:G("")}}function gp(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=mn.filter(t=>t===n||e.supportedFamilies.includes(t))),Hi(n)?e.perFamily[n]||(e.perFamily[n]=Bt()):e.inline||(e.inline=hb()),e.schemaVersion=_n(e)}function yp(e,n){if(Gr(e,n)){if(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),Hi(n)){for(let t of kt(e,n))ge(e,t.payload.id);delete e.perFamily[n],ut(e)}else delete e.inline;e.schemaVersion=_n(e)}}function bp(e,n){let t=[];if(!Hi(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=kt(e,n).filter(r=>!ve(e,r)).length;return a>0&&t.push(`${a} layer${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var Ze={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},fn={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",shape:"Shape",image:"Picture",tap:"Tap area",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},ml=["text","icon","gauge","chart","timeline","shape","image","tap"],J={content:"#4a7fe8",look:"#a15fe0",numbers:"#26a69a",position:"#66bb6a",states:"#f9a825",tap:Ze.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var xp="2.8.0";function wa(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function wp(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function vp(e,n=xp){let t=wa(e),i=wa(n);return!t||!i?!1:wp(t,i)>=0}function fl(e,n=null){if(n===null)return;let t=wa(e),i=wa(n);return!t||!i||wp(t,i)>=0?void 0:`Needs Wrist Assistant ${i[2]===0?`${i[0]}.${i[1]}`:i.join(".")} or later on your watch.`}function kp(e,n=xp){return`${wa(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The editor needs ${n}, coming soon to the App Store.`}var $p="52a9d81d0fd7";var Cp="11fa18406cea";var je="mdi:";function mb(e){return e.trim().replace(/\./g,"-")}function fb(e){return e.trim().replace(/-/g,".")}var Ur=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>fb(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=mb(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=We(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return w`<svg x="0" y="0" width=${t} height=${t} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},Kr=class{constructor(n,t="symbol-icons.json.gz",i=$p){this.onReady=n;this.file=t;this.digest=i;this.icons=new Map;this.state="idle"}path(n){return this.load(),this.icons.get(n.trim())?.[0]}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=We(i)??{color:"#FFFFFF",opacity:1};return w`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`${this.file}?v=${this.digest}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`${this.file}: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}},gl=class{constructor(n,t){this.sf=n;this.mdi=new Kr(t,"mdi-icons.json.gz",Cp)}render(n,t,i){return(n.trim().startsWith(je)?this.mdi:this.sf).render(n,t,i)}available(){return this.sf.available()}names(){return this.sf.names()}mdiNames(){return this.mdi.names()}mdiPath(n){return this.mdi.path(n)}};function Sp(e){let n=Ur.available()?new Ur(e):new Kr(e);return new gl(n,e)}function Tp(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var jr=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],qr=[...new Set(jr.flatMap(e=>e.symbols))],gb={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function yb(e){return`${e.replace(/\./g," ")} ${(gb[e]??[]).join(" ")}`}function yl(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=yb(a);if(!t.every(s=>r.includes(s)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var Wr=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}pack(n){return this.browsing.get(n)?.pack}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t,pack:this.pack(n)}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t,pack:this.pack(n)}),this.onChange()}setPack(n,t){this.browsing.set(n,{query:"",category:this.category(n),pack:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var bb=100;function Ep(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var Qn=class e{constructor(n,t){this.config=n;this.testValues=new Map;this.past=[];this.future=[];this.coalesceUntil=0;this.held=!1;this.heldStepTaken=!1;this.baseRevision=t,$i(n),pn(n),zc(n),this.baseline=JSON.stringify(xi(n))}static fromDocument(n,t){return new e(bi(n),t)}get dirty(){return JSON.stringify(xi(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t,i){this.takeStep(t);let a=structuredClone(this.config);n(a),$i(a,i),pn(a),this.config=a}setTestValues(n,t){this.takeStep(t),this.testValues=n}takeStep(n){let t=Date.now();(this.held?this.heldStepTaken:n!==void 0&&n===this.coalesceKey&&t<this.coalesceUntil)||(this.past.push({config:structuredClone(this.config),testValues:this.testValues}),this.past.length>bb&&this.past.shift(),this.future=[]),this.heldStepTaken=this.held,this.coalesceKey=n,this.coalesceUntil=n===void 0?0:t+800}markDirty(){this.baseline=""}beginGesture(){this.endGesture(),this.held=!0}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0,this.held=!1,this.heldStepTaken=!1}undo(){let n=this.past.pop();n&&(this.future.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=Ks(n),xi(n)}commit(){let n=structuredClone(this.config);return n.dataSources=Ks(n),new e(n,null)}};var Yr=class{constructor(){this.watched=new Map;this.onScroll=n=>this.mark(n.currentTarget);this.observer=new ResizeObserver(()=>{for(let n of this.watched.keys())this.mark(n)})}refresh(n){let t=new Set(n.filter(i=>i!=null));for(let[i,a]of[...this.watched])t.has(i)||this.drop(i,a);for(let i of t){let a=this.watched.get(i);a||(a=new Set,this.watched.set(i,a),i.addEventListener("scroll",this.onScroll,{passive:!0}),this.observer.observe(i));for(let r of a)r.parentElement!==i&&(this.observer.unobserve(r),a.delete(r));for(let r of i.children)a.has(r)||(a.add(r),this.observer.observe(r));this.mark(i)}}disconnect(){for(let[n,t]of[...this.watched])this.drop(n,t);this.observer.disconnect()}drop(n,t){n.removeEventListener("scroll",this.onScroll),this.observer.unobserve(n);for(let i of t)this.observer.unobserve(i);this.watched.delete(n)}mark(n){let t=n.scrollHeight-n.clientHeight,i=t>1;n.toggleAttribute("data-more-above",i&&n.scrollTop>1),n.toggleAttribute("data-more-below",i&&n.scrollTop<t-1)}};var Fi={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",timeBetween:"is between times",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Ct={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},Mp=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Ap={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},bl=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],xb=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function xl(e){return xb.includes(e)}function wb(e){return bl.includes(e)}function vb(e,n){return JSON.stringify(pe(e))===JSON.stringify(pe(n))}function wl(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!wb(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${Fi[l.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=l.value;else if(!vb(t,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=Rp(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Ct[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(n.otherwise){let r=Rp(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Ct[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:kb(i,n.otherwise),numberMode:i.length>0&&i.every(r=>xl(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function Rp(e){let n=new Set;for(let t of e){let i=Oe[t.kind];if(n.has(i))return i;n.add(i)}}function kb(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(Oe[a.kind]);for(let i of n??[])t.add(Oe[i.kind]);return Mp.filter(i=>t.has(i))}function Hp(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return Mp.filter(a=>i.has(a)&&t.includes(a))}function Xr(e,n){return e.find(t=>Oe[t.kind]===n)}function Fp(e,n,t,i){let a=n.map(o=>({id:o.caseId??te(),when:{join:o.join??"all",tests:[{id:o.testId??te(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??te(),cases:a};return t&&(r.otherwise=t),r}function va(e){if(e.length===0)return"No states yet.";let n=wl(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function Ip(e){return`No states yet. This ${e==="layout"?"shape":"layer"} looks the same whatever the value is.`}function Jr(e){return{state:`When the value matches, change how this ${e==="layout"?"shape":"layer"} looks.`,otherwise:"The look when no state above matches.",column:"Adds a column, so every state can change it."}}function Lp(e){let n=e[0];return n||(n={id:te(),cases:[]},e.push(n)),n}function _p(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function Pp(e,n,t){let i=Lp(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:te(),when:{join:"all",tests:[{id:te(),value:structuredClone(n),comparison:Cb(a,t)}]},then:[]})}function Np(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),_p(e))}function vl(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function kl(e,n){if(n){Lp(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,_p(e))}function zp(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function Dp(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>Oe[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function $b(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function Op(e,n=$b){let t=()=>n(e.value??G(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??G(""))}`;case"timeBetween":return`${t()} to ${n(e.upper??G(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return jn(e.kind)==="value"?`${Fi[e.kind]} ${t()}`:Fi[e.kind]}}function Cb(e,n){if(!e)return n?{kind:"lessThan",value:G("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??G("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??G("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??G("0")};default:return{kind:e.kind,...jn(e.kind)==="value"?{value:G("")}:{}}}}var Bp={text:"text",icon:"icon",gauge:"color",chart:"color",timeline:"visibility",shape:"color",image:"visibility",tap:"visibility",chartTimes:"visibility",chartDots:"visibility",chartGrid:"visibility",imageTime:"visibility",layout:"backgroundColor"};function Vp(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function Sb(e){switch(e){case"text":return w`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return w`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return w`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return w`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return w`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return w`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return w`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return w`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return w`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return w`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"chartDots":return w`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":return w`<path d="M4 7H20M4 12H20M4 17H20" />`;case"chartTimes":case"imageTime":case"clock":return w`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return w`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return w`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return w`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return w`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return w`<path d="M6 9L12 15L18 9" />`;case"plus":return w`<path d="M12 5V19M5 12H19" />`;case"braces":return w`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return w`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"info":return w`<circle cx="12" cy="12" r="8.5" /><path d="M12 11V16.5" /><path d="M12 7.6V7.8" />`;case"watch":return w`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return w`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return w`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return w`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return w`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return w`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return w`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return w`<path d="M6 14L12 8L18 14" />`;case"down":return w`<path d="M6 10L12 16L18 10" />`;case"left":return w`<path d="M14 6L8 12L14 18" />`;case"right":return w`<path d="M10 6L16 12L10 18" />`;case"show":return w`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return w`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return w`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return w`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return w`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return w`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return w`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return w`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return w`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return w`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`}}function V(e){return h`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Sb(e)}</svg>`}var St="color-mix(in srgb, var(--k) 45%, #6b7280)",Ii='system-ui, -apple-system, "Segoe UI", sans-serif';function Gp(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=c=>{let u=c*Math.PI/180;return{x:(e-t*Math.cos(u)).toFixed(2),y:(n-t*Math.sin(u)).toFixed(2)}},s=o(135),l=o(r),d=r-135>180?1:0;return`M${s.x} ${s.y}A${t} ${t} 0 ${d} 1 ${l.x} ${l.y}`}function $l(e,n,t,i){return w`<g fill="none" stroke-linecap="round">
    <path d=${Gp(e,n,t,1)} stroke=${St} stroke-width="2.6" opacity=".5" />
    <path d=${Gp(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function Tb(e){switch(e){case"text":return w`<g font-family=${Ii} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${St}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${St}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${St}>1.2 kW</text>
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
        ${$l(22,24,12,.28)}
        ${$l(60,24,12,.62)}
        ${$l(98,24,12,.92)}
        <text x="60" y="27" font-family=${Ii} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return w`<g>
        <g opacity=".4" fill=${St}>
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
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${St} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${St} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${St} opacity=".55" />
        <text x="6" y="39" font-family=${Ii} font-size="7" fill=${St}>1h ago</text>
        <text x="114" y="39" font-family=${Ii} font-size="7" text-anchor="end" fill=${St}>now</text>
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
      </g>`;case"chartTimes":return w`<g font-family=${Ii} font-size="8" fill="var(--k)">
        <text x="6" y="27">9 AM</text>
        <text x="60" y="27" text-anchor="middle">1 PM</text>
        <text x="114" y="27" text-anchor="end">5 PM</text>
      </g>`;case"chartDots":return w`<g fill="var(--k)">
        <circle cx="20" cy="30" r="3" /><circle cx="45" cy="18" r="3" /><circle cx="70" cy="24" r="3" /><circle cx="95" cy="12" r="3" />
      </g>`;case"chartGrid":return w`<g stroke="var(--k)" stroke-width="1.4" opacity=".7">
        <path d="M10 12H110M10 23H110M10 34H110" />
      </g>`;case"imageTime":return w`<g>
        <rect x="30" y="14" width="60" height="18" rx="9" fill="var(--k)" fill-opacity=".3" />
        <text x="60" y="27" text-anchor="middle" font-family=${Ii} font-size="10" fill="var(--k)">3:41:07</text>
      </g>`}}function Up(e){return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${Tb(e)}</svg>`}var Kp={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Wp=e=>(...n)=>({_$litDirective$:e,values:n}),Zr=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,t,i){this._$Ct=n,this._$AM=t,this._$Ci=i}_$AS(n,t){return this.update(n,t)}update(n,t){return this.render(...t)}};var{I:Eb}=Ud,jp=e=>e;var qp=()=>document.createComment(""),Li=(e,n,t)=>{let i=e._$AA.parentNode,a=n===void 0?e._$AB:n._$AA;if(t===void 0){let r=i.insertBefore(qp(),a),o=i.insertBefore(qp(),a);t=new Eb(r,o,e,e.options)}else{let r=t._$AB.nextSibling,o=t._$AM,s=o!==e;if(s){let l;t._$AQ?.(e),t._$AM=e,t._$AP!==void 0&&(l=e._$AU)!==o._$AU&&t._$AP(l)}if(r!==a||s){let l=t._$AA;for(;l!==r;){let d=jp(l).nextSibling;jp(i).insertBefore(l,a),l=d}}}return t},gn=(e,n,t=e)=>(e._$AI(n,t),e),Rb={},Yp=(e,n=Rb)=>e._$AH=n,Xp=e=>e._$AH,Qr=e=>{e._$AR(),e._$AA.remove()};var Jp=(e,n,t)=>{let i=new Map;for(let a=n;a<=t;a++)i.set(e[a],a);return i},Zp=Wp(class extends Zr{constructor(e){if(super(e),e.type!==Kp.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,n,t){let i;t===void 0?t=n:n!==void 0&&(i=n);let a=[],r=[],o=0;for(let s of e)a[o]=i?i(s,o):o,r[o]=t(s,o),o++;return{values:r,keys:a}}render(e,n,t){return this.dt(e,n,t).values}update(e,[n,t,i]){let a=Xp(e),{values:r,keys:o}=this.dt(n,t,i);if(!Array.isArray(a))return this.ut=o,r;let s=this.ut??=[],l=[],d,c,u=0,p=a.length-1,m=0,g=r.length-1;for(;u<=p&&m<=g;)if(a[u]===null)u++;else if(a[p]===null)p--;else if(s[u]===o[m])l[m]=gn(a[u],r[m]),u++,m++;else if(s[p]===o[g])l[g]=gn(a[p],r[g]),p--,g--;else if(s[u]===o[g])l[g]=gn(a[u],r[g]),Li(e,l[g+1],a[u]),u++,g--;else if(s[p]===o[m])l[m]=gn(a[p],r[m]),Li(e,a[u],a[p]),p--,m++;else if(d===void 0&&(d=Jp(o,m,g),c=Jp(s,u,p)),d.has(s[u]))if(d.has(s[p])){let y=c.get(o[m]),b=y!==void 0?a[y]:null;if(b===null){let $=Li(e,a[u]);gn($,r[m]),l[m]=$}else l[m]=gn(b,r[m]),Li(e,a[u],b),a[y]=null;m++}else Qr(a[p]),p--;else Qr(a[u]),u++;for(;m<=g;){let y=Li(e,l[g+1]);gn(y,r[m]),l[m++]=y}for(;u<=p;){let y=a[u++];y!==null&&Qr(y)}return this.ut=o,Yp(e,l),It}});var Qp="sun.sun";function eh(e){let n=e?.[Qp],t=typeof n?.attributes?.friendly_name=="string"?n.attributes.friendly_name.trim():"";return{entityId:Qp,displayName:t||"Sun",domain:"sun"}}var th=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],Mb=[0,1,2,3,4];function nh(e){let n=[];for(let t of e??[]){let i=t.trim();if(i==="")continue;let a=Number(i);Number.isInteger(a)&&a>=0&&a<=6&&!n.includes(a)&&n.push(a)}return n.sort((t,i)=>t-i)}function Cl(e){return[...new Set(e)].filter(n=>n>=0&&n<=6).sort((n,t)=>n-t).map(String)}var ih=[{kind:"afterSunset",label:"After sunset",hint:"True from sunset to sunrise, from the sun entity's own state."},{kind:"daytime",label:"Daytime",hint:"True while the sun is up."},{kind:"sunElevation",label:"Sun below an angle",hint:"The sun's elevation in degrees, below a number you set. 0 is the horizon."},{kind:"weekday",label:"Weekday is one of",hint:"A row of days, starting on Monday to Friday."},{kind:"timeBetween",label:"Time between",hint:"A clock window that may wrap midnight, starting at 22:00 to 06:00."}];function Ab(e){return[ah(e,"below_horizon")]}function Hb(e){return[ah(e,"above_horizon")]}function ah(e,n){return{id:te(),value:{kind:{kind:"entityState",...e}},comparison:{kind:"equals",value:G(n)}}}function Fb(e,n=0){return[{id:te(),value:{kind:{kind:"entityAttribute",...e,attribute:"elevation"}},comparison:{kind:"lessThan",value:G(String(n))}}]}function Ib(e=Mb){return[{id:te(),value:{kind:{kind:"time",timeField:"weekday"}},comparison:{kind:"isOneOf",options:Cl(e)}}]}function Lb(e="22:00",n="06:00"){return[{id:te(),value:{kind:{kind:"time",timeField:"now"}},comparison:{kind:"timeBetween",value:G(e),upper:G(n)}}]}function rh(e,n){switch(e){case"afterSunset":return Ab(n);case"daytime":return Hb(n);case"sunElevation":return Fb(n);case"weekday":return Ib();case"timeBetween":return Lb()}}function Sl(e){delete e.coloring,delete e.bands,delete e.bandAboveColorHex,delete e.highlight,delete e.highColorHex,delete e.lowColorHex}function Ca(e){for(let n of e)delete n.partId}function oh(e,n=te()){if(e.parts!==void 0&&e.parts.length>0)return e.parts[0].id;let t={id:n,value:structuredClone(e.value)};return e.coloring==="bands"&&(e.bands?.length??0)>0&&(t.coloring="bands",t.bands=e.bands,e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==he&&(t.bandAboveColorHex=e.bandAboveColorHex)),Sl(e),e.parts=[t],e.value=ta(e.parts),n}function eo(e,n=[]){let t=e.parts??[];if(e.countdown===!0||t.length===0)return delete e.parts,Ca(e.rules),{ok:!0,joined:!1,moved:[]};if(t.length===1){let a=t[0],r=[];return e.value=a.value,a.fontSize!==void 0&&(e.fontSize=a.fontSize,r.push("fontSize")),a.fontWeight!==void 0&&(e.fontWeight=a.fontWeight,r.push("fontWeight")),a.colorHex!==void 0&&(e.colorSlot.baseColorHex=a.colorHex,r.push("color")),Sl(e),a.coloring!==void 0&&a.coloring!=="uniform"&&(e.coloring=a.coloring),a.bands!==void 0&&a.bands.length>0&&(e.bands=a.bands),a.bandAboveColorHex!==void 0&&(e.bandAboveColorHex=a.bandAboveColorHex),a.coloring==="bands"&&(a.bands?.length??0)>0&&r.push("bands"),delete e.parts,Ca(e.rules),{ok:!0,joined:!1,moved:r}}let i=Tl(t,n);return i.ok?(e.value=i.value,Sl(e),delete e.parts,Ca(e.rules),{ok:!0,joined:!0}):i}function ka(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function $a(e){return e.includes("{")?`{% raw %}${e}{% endraw %}`:e}function _b(e,n){let t=e,i=e.format;for(let r=0;t.kind.kind==="named";r++){if(r>8)return;let o=t.kind.id.toUpperCase(),s=n.find(l=>l.id.toUpperCase()===o)?.value;if(!s)return;i=Pe(i)?s.format:i,t=s}let a={kind:t.kind};return Pe(i)||(a.format=i),a}function Pb(e,n){let t=_b(e,n);if(!t)return{blocked:"kind"};let i=zn(t);if(i!==void 0)return $a(i);let a=t.kind,r=t.format??{};if(r.relativeTime||r.duration)return{blocked:"format"};let o="",s;switch(a.kind){case"entityState":s=`states(${ka(a.entityId)})`;break;case"jinja":{if(a.value.trim()==="")return"";let c=a.value.includes("{{")||a.value.includes("{%"),u=r.decimals===void 0&&r.multiply===void 0&&r.offset===void 0&&!r.textCase;if(c&&u)return $a(r.prefix??"")+a.value+$a(r.suffix??"");c?(o=`{% set wa_text %}${a.value}{% endset %}`,s="wa_text"):s=`(${a.value})`;break}case"entityAttribute":case"entityAge":case"aggregate":case"time":{let c=pa(a);if(c===void 0)return{blocked:"kind"};s=c;break}default:return{blocked:"kind"}}if(r.decimals!==void 0||r.multiply!==void 0||r.offset!==void 0){let c=`(${s} | float(0))`;r.multiply!==void 0&&(c=`(${c} * ${r.multiply})`),r.offset!==void 0&&(c=`(${c} + ${r.offset})`),s=r.decimals!==void 0?`${ka(`%.${Math.max(0,Math.trunc(r.decimals))}f`)} | format(${c})`:c}let l=r.useEntityUnit&&"entityId"in a?a.entityId:void 0;l!==void 0&&(o+=`{% set wa_unit = state_attr(${ka(l)}, 'unit_of_measurement') %}`);let d="('' if not wa_unit else (wa_unit if wa_unit[:1] in ['\xB0', '%'] else ' ' ~ wa_unit))";if(r.textCase){let c=r.textCase==="upper"?"upper":r.textCase==="lower"?"lower":"title",u=[...r.prefix?[ka(r.prefix)]:[],`(${s})`,...l!==void 0?[d]:[],...r.suffix?[ka(r.suffix)]:[]].join(" ~ ");return`${o}{{ (${u}) | ${c} }}`}return o+$a(r.prefix??"")+`{{ ${s} }}`+(l!==void 0?`{{ ${d} }}`:"")+$a(r.suffix??"")}function Tl(e,n=[]){if(e.every(a=>a.value.kind.kind==="literal"))return{ok:!0,value:ta(e)};let t=[],i=[];return e.forEach((a,r)=>{let o=Pb(a.value,n);typeof o=="string"?t.push(o):i.push({index:r,partId:a.id,reason:o.blocked})}),i.length>0?{ok:!1,blocked:i}:{ok:!0,value:{kind:{kind:"jinja",value:t.join("")}}}}var io=[["threshold","Threshold line"],["now","Now line"],["zero","Zero line"],["grid","Grid lines"],["dots","Dots"],["times","Clock times"]],lh=[{label:"Newest",stat:"latest",marker:"latest"},{label:"First",stat:"first",marker:"first"},{label:"Highest",stat:"highest",marker:"highest"},{label:"Lowest",stat:"lowest",marker:"lowest"},{label:"Average",stat:"average"},{label:"Change",stat:"delta"},{label:"Total",stat:"sum"},{label:"Trend",stat:"trend"},{label:"Top of scale",stat:"top"},{label:"Bottom of scale",stat:"bottom"},{label:"Now",marker:"now"}],ei="color-mix(in srgb, var(--k) 30%, #6b7280)",no='system-ui, -apple-system, "Segoe UI", sans-serif',bn=40,to=6,Nb=[22,17,11,16,27,23,35,31];function zb(e={}){let n=(e.values??[]).filter(p=>Number.isFinite(p)),t=n.length>=2,i=t?n:Nb,a=Math.min(...i),r=Math.max(...i);t&&e.threshold!==void 0&&Number.isFinite(e.threshold)&&(a=Math.min(a,e.threshold),r=Math.max(r,e.threshold)),r===a&&(r+=1,a-=1);let o=p=>to+(r-p)/(r-a)*(bn-to),s=i.length,l=i.map((p,m)=>10+m*100/(s-1)),d=i.map(o),c=p=>Math.min(bn,Math.max(to,p)),u=t&&e.now!==void 0&&Number.isFinite(e.now)?Math.min(s-1,Math.max(0,Math.round(e.now))):Math.round((s-1)*.6);return{xs:l,ys:d,y:o,real:t,zeroY:c(o(0)),thresholdY:c(o(t&&e.threshold!==void 0?e.threshold:(a+r)/2)),averageY:o(i.reduce((p,m)=>p+m,0)/s),column:{highest:i.indexOf(Math.max(...i)),lowest:i.indexOf(Math.min(...i)),first:0,latest:s-1,now:u}}}function Db(e){let n=e.xs.map((t,i)=>`${i===0?"M":"L"}${t.toFixed(1)} ${e.ys[i].toFixed(1)}`).join("");return w`
    <path d=${`${n}L${e.xs[e.xs.length-1]} ${bn}L${e.xs[0]} ${bn}Z`} fill=${ei} opacity=".18" />
    <path d=${n} fill="none" stroke=${ei} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`}function Ob(e){let n=Math.min(10,Math.max(1,100/e.xs.length*.7));return w`${e.xs.map((t,i)=>{let a=Math.min(e.ys[i],bn-1);return w`<rect x=${t-n/2} y=${a} width=${n} height=${bn-a} rx=${Math.min(2,n/2)} fill=${ei} opacity=".45" />`})}`}function Bb(){return w`${[[4,30,.35],[35,18,.7],[54,10,.35],[65,26,.7],[92,24,.35]].map(([n,t,i])=>w`<rect x=${n} y="10" width=${t} height="16" rx="3" fill=${ei} opacity=${i} />`)}`}function Vb(){return w`
    <rect x="3" y="3" width="114" height="40" rx="5" fill=${ei} opacity=".22" />
    <circle cx="30" cy="16" r="6" fill=${ei} opacity=".6" />
    <path d="M3 43L3 36L34 20L56 32L80 16L117 38L117 43Z" fill=${ei} opacity=".5" />`}function yn(e,n,t=2.6){return w`<circle cx=${e.xs[n]} cy=${e.ys[n]} r=${t} fill="var(--k)" />`}function Tt(e,n=!1){if(e===void 0||e==="")return"";let t=e.length*5.8+5,i=n?36:13;return w`<rect x="2" y=${i-9.5} width=${t} height="12.5" rx="3" fill="#000" fill-opacity=".7" />
    <text x="4.5" y=${i} font-family=${no} font-size="10" font-weight="700" fill="var(--k)">${e}</text>`}function Sa(e,n=!1){return w`<path d=${`M4 ${e}H116`} stroke="var(--k)" stroke-width="1.4" stroke-dasharray=${n?"4 3":"none"} />`}function sh(e){return w`<g font-family=${no} font-size="6.5" fill="var(--k)">
    <text x="4" y=${e}>9 AM</text><text x="60" y=${e} text-anchor="middle">1 PM</text><text x="116" y=${e} text-anchor="end">5 PM</text>
  </g>`}function Gb(e,n,t){if(e==="timeline:times")return sh(38);if(e==="image:time")return w`<rect x="70" y="30" width="42" height="10" rx="5" fill="#000" fill-opacity=".55" stroke="var(--k)" stroke-width=".8" />
      <text x="91" y="37.5" text-anchor="middle" font-family=${no} font-size="7" fill="var(--k)">3:41:07</text>`;let[i,a]=e.split(":"),r=Math.min(2.2,Math.max(.8,40/n.xs.length));if(i==="draw")switch(a){case"threshold":return Sa(n.thresholdY,!0);case"now":return w`<path d=${`M${n.xs[n.column.now]} 4V${bn+2}`} stroke="var(--k)" stroke-width="1.4" />`;case"zero":return w`${Sa(n.zeroY)}<text x="115" y=${Math.max(9,n.zeroY-3)} text-anchor="end" font-family=${no} font-size="6.5" fill="var(--k)">0</text>`;case"times":return sh(45);case"dots":return w`${n.xs.map((d,c)=>yn(n,c,r))}`;case"grid":return w`<path d="M4 10H116M4 20H116M4 30H116M4 40H116" stroke="var(--k)" stroke-width=".8" opacity=".7" />`}if(i==="number"){let d=n.real?t[a]:void 0,{first:c,latest:u}=n.column;switch(a){case"latest":return w`${yn(n,u)}${Tt(d)}`;case"first":return w`${yn(n,c)}${Tt(d)}`;case"highest":return w`${yn(n,n.column.highest)}${Tt(d)}`;case"lowest":return w`${yn(n,n.column.lowest)}${Tt(d)}`;case"average":return w`${Sa(n.averageY,!0)}${Tt(d)}`;case"delta":return w`<path d=${`M${n.xs[c]} ${n.ys[c]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />
        ${yn(n,c)}${yn(n,u)}${Tt(d)}`;case"sum":return w`${n.xs.map((p,m)=>yn(n,m,r))}${Tt(d)}`;case"trend":return w`<path d=${`M${n.xs[c]} ${n.ys[c]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />${Tt(d)}`;case"top":return w`${Sa(to)}${Tt(d,!0)}`;case"bottom":return w`${Sa(bn)}${Tt(d)}`}}let o=n.column[a]??0,s=n.xs[o],l=Math.max(5,n.ys[o]-7);return a==="highest"?w`<path d=${`M${s} ${l-4}L${s+4} ${l+3}L${s-4} ${l+3}Z`} fill="var(--k)" />`:a==="now"?w`<path d=${`M${s-4} ${l-3}L${s+4} ${l-3}L${s} ${l+4}Z`} fill="var(--k)" />`:w`<circle cx=${s} cy=${l} r="3" fill="var(--k)" />`}function El(e){return e==="timeline:times"?"timeline":e==="image:time"?"image":"chart"}function dh(e,n,t=!1,i={}){let a=zb(i),r=e==="timeline"?Bb():e==="image"?Vb():t?Ob(a):Db(a),o=n!==void 0&&El(n)===e?Gb(n,a,i.texts??{}):"";return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${r}${o}</svg>`}function ch(e){if(e==="timeline:times")return"Clock times";if(e==="image:time")return"Timestamp";let[n,t]=e.split(":");return n==="draw"?io.find(([i])=>i===t)?.[1]??t:n==="number"?`${bt.find(([i])=>i===t)?.[1]??t} number`:`${xt.find(([i])=>i===t)?.[1]??"Reading"} marker`}var Ub={"draw:threshold":"A flat line at a value you pick, so a reading over it stands out.","draw:now":"An upright line through the reading that counts as now.","draw:zero":"A flat line where zero falls. It is drawn only when the readings cross zero.","draw:times":"The clock times of the chart's span, spread under the plot.","draw:dots":"A dot on every reading. Line and area charts only.","draw:grid":"Faint rules across the plot, to read heights against.","number:latest":"A text layer printing the newest reading, with the entity's unit after it.","number:first":"A text layer printing the oldest reading in the span.","number:highest":"A text layer printing the highest reading in the span.","number:lowest":"A text layer printing the lowest reading in the span.","number:average":"A text layer printing the average of every reading in the span.","number:delta":"A text layer printing the newest reading minus the first, with the unit after it.","number:sum":"A text layer printing every reading in the span added up, with the unit after it.","number:trend":"A text layer printing the change as an arrow: up, down, or flat when it is too small to print.","number:top":"A text layer printing the value at the top of the plot. On a Fixed scale, this is Max.","number:bottom":"A text layer printing the value at the bottom of the plot. On a Fixed scale, this is Min.","marker:highest":"An icon over the highest reading. It starts as a triangle.","marker:lowest":"An icon over the lowest reading. It starts as a dot.","marker:now":"An icon over the reading that counts as now.","marker:first":"An icon over the oldest reading.","marker:latest":"An icon over the newest reading.","marker:threshold":"An icon at the threshold's height.","marker:zero":"An icon at zero's height.","timeline:times":"The clock times of the timeline's span, spread under the strip.","image:time":"The time the picture was fetched, so a picture that stops updating reads as stale."};function Rl(e){return Ub[e]}function uh(e){let n=na(e),t=e.fillColorHex!==void 0;if(e.style==="bars"){let i=e.barBorderWidth!==void 0;if(!n)return{main:"Bar colour",...t?{fill:{label:"Fill colour",empty:"Bar colour",note:"Fills every bar in place of Bar colour, even when a state changes the colour. Clear it to fill in Bar colour.",warn:!0}}:{},...i?{border:{label:"Border colour",empty:"White"}}:{}};let a={};return i?(a.fill={label:"Band fill",empty:"Each band's colour",...t?{note:"Every band with no fill of its own fills in this."}:{}},a.border={label:"Band border",empty:"White",note:"Every band with no border of its own uses this."}):t&&(a.fill={label:"Band fill",empty:"Each band's colour",note:"This fill wins over every band's colour. Clear it to fill each bar in its band's colour.",warn:!0}),a}return e.style==="line"?n?{}:{main:"Line colour"}:n?t?{fill:{label:"Fill colour",empty:"Band colours",...e.fillBands?{note:"A fill colour wins over Band fill. Clear it to fill each stretch in its band's colour.",warn:!0}:{}}}:e.fillBands?{}:{main:"Fill colour"}:{main:"Line colour",fill:{label:"Fill colour",empty:"Line colour"}}}function Kb(e){switch(e){case"light":return w`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return w`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return w`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return w`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return w`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return w`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return w`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return w`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return w`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return w`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return w`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return w`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return w`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return w`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return w`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return w`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return w`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return w`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return w`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return w`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return w`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return w`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return w`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return w`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return w`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return w`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return w`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return w`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return w`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return w`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return w`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return w`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return w`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return w`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function Ml(e){return h`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Kb(e)}</svg>`}var Wb={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function ph(e){let n=Wb[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var jb=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function Al(e){return jb.has(e.trim().toLowerCase())}function qb(e,n,t){let i=Cr({frame:{...e.frame},isHidden:!1},e.family,n,t).frame;return _r(i,{})}var Gl=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function ke(e){return n=>e(n.target.value)}function Ut(e,n){let t=n===void 0?fl(e.watchAppVersion):fl(e.watchAppVersion,n);return t===void 0?f:h`<div class="hint keep">${t}</div>`}function La(e){if(e===void 0||e.atDefault)return f;let n=`Changed. Click to reset. ${e.title.replace(/\.$/,"")}.`;return h`<button type="button" class="reset-dot" title=${n} aria-label=${n}
    @pointerdown=${t=>t.stopPropagation()}
    @click=${t=>{t.preventDefault(),t.stopPropagation(),e.reset()}}></button>`}function Ge(e,n,t){let i=La(n),a=[i===f?"":"changed",t?"scrub":""].filter(r=>r!=="").join(" ");return h`<span class=${a===""?f:a} title=${t?"Drag left or right to change":f}
    @pointerdown=${t??f}>${e}${i}</span>`}var wo="wa-scrub-start",vo="wa-scrub-end",Yb=3,Xb=3;function Jb(e,n){return e!==void 0&&Number.isFinite(e)?e:Math.max(0,n.min??0)}function Zb(e,n,t={}){let i=n!==void 0&&n>0?n:10**-Math.min(2,zl(e));return t.coarse?i*10:t.fine?i/10:i}function Qb(e,n,t,i){let a=e+Math.round((n-e)/t)*t;return i.min!==void 0&&(a=Math.max(i.min,a)),i.max!==void 0&&(a=Math.min(i.max,a)),Number(a.toFixed(Math.min(10,Math.max(zl(t),zl(e)))))}function zl(e){if(!Number.isFinite(e)||Number.isInteger(e))return 0;let n=String(e),t=/e-(\d+)$/.exec(n);return t?Number(t[1])+(n.split("e")[0].split(".")[1]??"").length:(n.split(".")[1]??"").length}function Nh(e,n,t,i,a,r){let o=Jb(t,a),s=n.clientX,l=s,d=o,c=o,u=!1,p=g=>{if(!u){if(Math.abs(g.clientX-s)<Yb)return;u=!0,l=g.clientX,e.classList.add("scrubbing"),e.dispatchEvent(new CustomEvent(wo,{bubbles:!0,composed:!0}))}let y=Zb(o,a.step,{coarse:g.shiftKey,fine:g.altKey});d+=(g.clientX-l)/Xb*y,l=g.clientX,a.min!==void 0&&(d=Math.max(a.min,d)),a.max!==void 0&&(d=Math.min(a.max,d));let b=Qb(o,d,y,a);b!==c&&(c=b,i(b))},m=g=>{if(e.removeEventListener("pointermove",p),e.removeEventListener("pointerup",m),e.removeEventListener("pointercancel",m),u){e.classList.remove("scrubbing"),e.dispatchEvent(new CustomEvent(vo,{bubbles:!0,composed:!0}));let y=b=>{b.preventDefault(),b.stopPropagation()};e.addEventListener("click",y,{capture:!0,once:!0}),setTimeout(()=>e.removeEventListener("click",y,{capture:!0}),0)}r(u,g)};e.setPointerCapture(n.pointerId),e.addEventListener("pointermove",p),e.addEventListener("pointerup",m),e.addEventListener("pointercancel",m)}function ko(e,n,t){return i=>{if(i.button!==0||!i.isPrimary)return;let a=i.currentTarget;a.closest(".field")?.querySelector("input[type=number]")?.disabled||(i.preventDefault(),Nh(a,i,e,n,t,()=>{}))}}function _a(e,n,t){return i=>{let a=i.currentTarget;i.button!==0||!i.isPrimary||a.disabled||a.matches(":focus")||(i.preventDefault(),Nh(a,i,e,n,t,(r,o)=>{r||o.type!=="pointerup"||(a.focus(),a.select())}))}}function wn(e,n,t,i=a=>String(a)){if(n===void 0)return;let a=n;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>t(a)}}function Ae(e,n,t,i={}){return h`<label class="field">${Ge(e,wn(n,i.def,t,a=>a===""?"empty":a))}
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${ke(t)} /></label>`}function zh(e,n,t,i=3){return h`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${ke(t)}></textarea></label>`}function ae(e,n,t,i={}){let a=i.def===null?{atDefault:n===void 0,title:"Back to none",reset:()=>t(void 0)}:wn(n,i.def,t);return h`<label class="field num">${Ge(e,a,ko(n,t,i))}${$o(n,t,i)}</label>`}function $o(e,n,t){let i=e===void 0||Number.isNaN(e)?"":String(e),a=h`<input type="number" .value=${i} step=${t.step??"any"} min=${t.min??f} max=${t.max??f}
      aria-label=${t.ariaLabel??f} placeholder=${t.placeholder??f}
      data-scrub @pointerdown=${_a(e,n,t)}
      @input=${ke(r=>{if(r.trim()===""){t.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} />`;return t.unit===void 0&&t.lead===void 0?a:h`<span class=${t.lead===void 0?"num-box":"num-box lead"} style=${`--wa-unit:${t.unit?.length??0}`}>${t.lead===void 0?f:h`<span class="lead" aria-hidden="true">${t.lead}</span>`}${a}${t.unit===void 0?f:h`<span class="unit" aria-hidden="true">${t.unit}</span>`}</span>`}function Se(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<label class="field">${Ge(e,wn(n,a.def,i,r))}
    <select @change=${ke(o=>i(o))}>
      ${t.map(([o,s])=>h`<option value=${o} ?selected=${o===n}>${s}</option>`)}
    </select></label>`}function ie(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<div class="field seg-field">${Ge(e,wn(n,a.def,o=>i(o,null),r))}
    ${fo(e,n,t,i,a)}</div>`}function fo(e,n,t,i,a={}){return h`<div class="seg wide" role="radiogroup" aria-label=${e}>
      ${t.map(([r,o])=>{let s=n===void 0&&r===a.inherited,l=s?`${a.titles?.[r]??o} (from the layer)`:a.titles?.[r];return h`<button type="button" role="radio" aria-checked=${r===n?"true":"false"}
        class=${r===n?"on":s?"inh":""} title=${l??f} ?disabled=${a.disabled?.[r]===!0}
        @click=${d=>{r!==n&&i(r,d.currentTarget)}}>${o}</button>`})}
    </div>`}function ex(e,n){let t=i=>wn(i.value,i.def,i.set,a=>i.options.find(([r])=>r===a)?.[1]??a);return h`<div class="field seg-field pair">${Ge(e.label,t(e))}
    <div class="pair-row">
      ${fo(e.label,e.value,e.options,e.set,e)}
      ${Ge(n.label,t(n))}
      ${fo(n.label,n.value,n.options,n.set,n)}
    </div></div>`}function ai(e,n,t,i){let a=i.format??(o=>String(Math.round(o*100)/100)),r=o=>{o!==void 0&&o>=i.min&&o<=i.max&&t(o)};return h`<div class="field slider num">${Ge(e,wn(n,i.def,t,a),ko(n,t,i))}
    <div class="slider-row">
      ${i.range===!1?f:h`<input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)} aria-label=${e}
        @input=${ke(o=>{let s=Number(o);Number.isNaN(s)||t(s)})} />`}
      ${$o(n,r,{step:i.step,min:i.min,max:i.max,ariaLabel:e,...i.unit===void 0?{}:{unit:i.unit}})}
    </div></div>`}function Ve(e,n,t,i,a={}){return h`<label class="field check">${Ge(e,wn(n,i,t,r=>r?"on":"off"))}<input type="checkbox" .checked=${n} ?disabled=${a.disabled===!0} @change=${r=>t(r.target.checked)} /></label>`}function be(e,n,t,i=!1,a){let{rgb:r,alpha:o}=Dh(n),s=a===void 0?void 0:{atDefault:Kl(n,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>t(a??void 0)},l=i&&n===void 0;return h`<div class="field color">${Ge(e,s)}
    <div class="color-row">
      ${i?h`<input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${n!==void 0} @change=${d=>t(d.target.checked?ho(r,o):void 0)} />`:f}
      ${Co(e,n,t,l)}
    </div></div>`}function Dh(e){let n=(e??"").replace(/^#/,""),t=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n);return{valid:t,swatch:t?`#${n}`:"transparent",rgb:t?`#${n.slice(0,6)}`:"#ffffff",alpha:t&&n.length===8?Math.round(parseInt(n.slice(6,8),16)/255*100):100}}function ho(e,n){let t=e.replace(/^#/,"").toUpperCase();return n>=100?`#${t}`:`#${t}${Math.round(n/100*255).toString(16).padStart(2,"0").toUpperCase()}`}function Co(e,n,t,i=!1,a="#RRGGBB"){let{valid:r,swatch:o,rgb:s,alpha:l}=Dh(n);return h`<span class="color-box">
      <span class="color-swatch" style=${`--sw:${i||!r?"transparent":o}`} title="Pick a colour">
        <input type="color" .value=${s} ?disabled=${i} aria-label=${`${e}: pick a colour`} @input=${ke(d=>t(ho(d,l)))} />
      </span>
      <input type="text" class="mono hex" .value=${n??""} placeholder=${a} spellcheck="false" aria-label=${`${e}: hex`} ?disabled=${i}
        @input=${ke(d=>{let c=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(c)&&t(c.startsWith("#")?c.toUpperCase():`#${c.toUpperCase()}`)})} />
      <span class="num-box alpha" style="--wa-unit:1">
        <input type="number" min="0" max="100" step="1" .value=${String(l)} title="Opacity" aria-label=${`${e}: opacity`} ?disabled=${i}
          data-scrub @pointerdown=${_a(l,d=>t(ho(s,d)),{step:1,min:0,max:100})}
          @input=${ke(d=>{let c=Number(d);d.trim()!==""&&c>=0&&c<=100&&t(ho(s,Math.round(c)))})} />
        <span class="unit" aria-hidden="true">%</span>
      </span>
    </span>`}function Ul(e,n,t,i){let a={atDefault:n===void 0,title:`Back to ${t.toLowerCase()}`,reset:()=>i(void 0)};return h`<div class="field color">${Ge(e,a)}
    <div class="color-row">${Co(e,n,i,!1,t)}</div></div>`}function Hl(e,n,t){return h`${Ul(e.label,n,e.empty,t)}${e.note===void 0?f:h`<div class=${e.warn?"hint warn":"hint"}>${e.note}</div>`}`}function Kl(e,n){return e===void 0||n===void 0?e===n:e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function So(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function tx(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=t?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function hh(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var Oh=50;function nx(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function ix(e,n,t=Oh,i){let a=n.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,d)=>r(l)-r(d))).slice(0,t);let o=a.split(/\s+/),s=[];for(let l of e){let d=l.entityId.toLowerCase(),c=l.name.toLowerCase(),u=(l.area??"").toLowerCase(),p=-1;d===a?p=0:d.startsWith(a)?p=1:c.startsWith(a)?p=2:d.includes(a)?p=3:c.includes(a)?p=4:o.length>1&&o.every(m=>d.includes(m)||c.includes(m))?p=5:u!==""&&(u.includes(a)||o.length>1&&o.every(m=>d.includes(m)||c.includes(m)||u.includes(m)))&&(p=6),p>=0&&s.push({c:l,rank:p})}return s.sort((l,d)=>l.rank-d.rank||r(l.c)-r(d.c)||l.c.name.localeCompare(d.c.name)||l.c.entityId.localeCompare(d.c.entityId)),s.slice(0,t).map(l=>l.c)}var ax=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function Bh(e){return ax.test(e.trim())}function rx(e,n,t){let i=e.trim();if(i!==n.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in t)return So(t,i);if(Bh(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var ni=new Map;function He(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function Wl(e){return ni.has(e)}function Et(e,n,t,i,a,r={}){let o=e.hass.states,s=ni.get(a),l=s?ix(tx(o,r.domain,hh(e.hass)),s.query,Oh,r.preferNumeric?nx:void 0):[],d=s?Math.max(0,Math.min(s.index,l.length-1)):0,c=t.entityId?o[t.entityId]:void 0,u=(v,C,R=0)=>{ni.set(a,{query:C,index:R}),He(v)},p=v=>{ni.delete(a),He(v)},m=v=>{let C=rx(v,t,o);C&&i(C)},g=(v,C)=>{i(So(o,v.entityId)),p(C)},y=()=>Math.max(0,Math.min(ni.get(a)?.index??0,l.length-1)),b=v=>{let C=v.target;if(v.key==="ArrowDown"||v.key==="ArrowUp"){v.preventDefault();let R=ni.get(a);if(!R){u(C,C.value);return}let M=v.key==="ArrowDown"?y()+1:y()-1;u(C,R.query,Math.max(0,Math.min(l.length-1,M))),ox(C);return}if(v.key==="Enter"){v.preventDefault();let R=l[y()];s&&R?g(R,C):(m(C.value),p(C));return}if(v.key==="Escape"){if(!s)return;v.preventDefault(),v.stopPropagation(),p(C)}},$=t.entityId?hh(e.hass)?.(t.entityId):void 0,k=t.entityId===""?h`<div class="hint">Type part of a name, a room, or an id.</div>`:c?h`<div class="entity-current">
          <span class="ent-ico ${Al(c.state)?"on":""}">${Ml(t.domain||t.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:t.entityId}</span>
          ${$?h`<span class="ent-area">${$}</span>`:f}
          <span class="ent-state">${c.state}</span>
        </div>`:h`<div class="hint warn">Not in Home Assistant right now.</div>`;return h`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-box ${s?"open":""} ${r.needed&&t.entityId===""?"needs":""}">
      <span class="ent-glass">${V("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:t.entityId}
        placeholder="Search by name, room, or id"
        @focus=${v=>{let C=v.target;u(C,t.entityId),C.select()}}
        @input=${v=>{let C=v.target;u(C,C.value)}}
        @keydown=${b}
        @blur=${v=>{let C=v.target;s&&m(C.value),p(C)}} />
      ${(s?s.query:t.entityId)===""?f:h`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${v=>v.preventDefault()}
        @click=${v=>{let C=v.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),ni.set(a,{query:"",index:0}),He(C),C?.focus()}}>${V("close")}</button>`}
    </div>
    ${s?h`<div class="entity-results" role="listbox">
          ${l.length===0?h`<div class="hint keep" style="padding:6px 8px">${Bh(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map((v,C)=>h`<button type="button" role="option" aria-selected=${C===d?"true":"false"} class="ent ${C===d?"hl":""}"
                @mousedown=${R=>R.preventDefault()} @click=${R=>g(v,R.target)}>
                <span class="ent-ico ${Al(v.state)?"on":""}">${Ml(v.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${v.name}</span>
                  <span class="ent-sub">
                    ${v.area?h`<span class="ent-area">${v.area}</span>`:f}
                    <span class="ent-id mono">${v.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${ph(v.domain)}</span>
                  <span class="ent-state">${v.state}</span>
                </span>
              </button>`)}
        </div>`:k}
  </div>`}function ox(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var mh=120;function sx(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(jr.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(qr),fromPack:!1}}function fh(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function lx(e){return[{value:"",label:`Starter set (${fh(qr,e)})`},...jr.map(n=>({value:n.name,label:`${n.name} (${fh(n.symbols,e)})`}))]}function dx(e){return e.length>0?e.length:qr.length}function gh(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function ao(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return h`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??h`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function Vh(e,n,t,i,a){let r=e.symbols,o=r.isOpen(i),s=r.query(i),l=e.icons.names(),d=l??[],c=new Set(d),u=n.trim(),p=u.startsWith(je),m=a!==void 0,g=m?r.pack(i)??(p?"mdi":"sf"):"sf",y=cx(u,c),b=v=>{t(v),a?.(v.startsWith(je)?e.icons.mdiPath?.(v):void 0),r.noteUsed(v)},$=v=>{if(t(v),!m)return;let C=v.trim();a?.(C.startsWith(je)?e.icons.mdiPath?.(C):void 0)},k=f;if(o&&g==="mdi"){let v=e.icons.mdiNames?.(),C=ux(v??[],s),R=C.slice(0,mh),M=r.recent.filter(A=>A.startsWith(je));k=h`<div class="sym-browse">
      ${yh(r,i,g)}
      <div class="sym-controls">
        <input type="search" placeholder="Search Material Design icons" .value=${s} @input=${ke(A=>r.setQuery(i,A))} />
      </div>
      ${M.length===0?f:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${M.map(A=>ao(e,A,A===u,b))}</div>`}
      <div class="sym-grid">${R.map(A=>ao(e,A,A===u,b))}</div>
      ${v===void 0?h`<div class="hint keep">Loading the Material Design catalogue.</div>`:C.length===0?h`<div class="hint keep">Nothing matches that search. Any<code>mdi:</code> name can still be typed above.</div>`:h`<div class="hint keep">${gh(R.length,C.length,!0,v.length)}</div>`}
      ${v!==void 0&&p&&!v.includes(u)?h`<div class="hint warn">There is no <code>${u}</code> in this build's Material Design set, so the watch draws a question mark.</div>`:f}
    </div>`}else if(o){let v=r.category(i),C=sx(v,s,d,c),R=yl(C.names,s),M=C.fromPack?R.slice(0,mh):R,A=r.recent.filter(E=>!E.startsWith(je)),F=c.size===0?A:A.filter(E=>c.has(E));k=h`<div class="sym-browse">
      ${m?yh(r,i,g):f}
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${s} @input=${ke(E=>r.setQuery(i,E))} />
        <select @change=${ke(E=>r.setCategory(i,E))}>
          ${lx(c).map(E=>h`<option value=${E.value} ?selected=${E.value===v}>${E.label}</option>`)}
        </select>
      </div>
      ${F.length===0?f:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${F.map(E=>ao(e,E,E===u,b))}</div>`}
      <div class="sym-grid">${M.map(E=>ao(e,E,E===u,b))}</div>
      ${R.length===0?h`<div class="hint keep">Nothing matches that search. Anyname can still be typed above.</div>`:h`<div class="hint keep">
            ${gh(M.length,R.length,s.trim()!=="",dx(d))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?h`<div class="hint keep">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:h`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return h`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${ke($)} @change=${ke(v=>{let C=v.trim();C.startsWith(je)?e.icons.mdiPath?.(C)!==void 0&&r.noteUsed(v):(c.size===0||c.has(C))&&r.noteUsed(v)})} /></label>
    ${y?h`<div class="hint warn">The installed icon pack has no <code>${u}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>r.toggle(i)}>${o?"Hide symbols":"Browse symbols"}</button>
    ${k}`}function cx(e,n){let t=e.trim();return t!==""&&!t.startsWith(je)&&n.size>0&&!n.has(t)}function ux(e,n){let t=n.trim(),i=t.startsWith(je)?t.slice(je.length):t,a=e.map(r=>r.startsWith(je)?r.slice(je.length):r);return yl(a,i).map(r=>je+r)}function yh(e,n,t){return h`<div class="seg wide" role="radiogroup" aria-label="Icon set">
    ${[["sf","SF Symbols"],["mdi","Material Design Icons"]].map(([a,r])=>h`<button type="button" role="radio" aria-checked=${a===t?"true":"false"}
      class=${a===t?"on":""}
      @click=${()=>{a!==t&&e.setPack(n,a)}}>${r}</button>`)}
  </div>`}var px=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Time since entity changed"],["aggregate","Several entities combined"],["chartStat","Number from a chart"],["time","Clock and date"],["dataAge","Time since last refresh"],["jinja","Template (Jinja)"],["named","Shared value"]],hx={literal:"Words or a number you type. It never changes.",entityState:"What Home Assistant shows for the entity, like 21.5 or on.",entityAttribute:"One detail the entity carries besides its state, like a light's brightness.",entityAge:"Seconds since the entity's state last changed. Set Seconds as, under Format, to read 5m instead of 300.",aggregate:"Count several entities, or take the sum, average, lowest or highest of their states.",time:"The time or date, read each time the complication refreshes.",dataAge:"Seconds since the watch last fetched values."},mx=[["straight","Straight"],["smooth","Smooth"],["step","Step"]],fx=[["flat","Flat"],["fade","Fade"]],Gh=[["auto","Auto"],["all","All"]],gx=[["off","Off"],["light","Light"],["medium","Medium"],["strong","Strong"]],Uh=[["bars","Bars"],["line","Line"],["area","Area"]],yx=[["auto","Auto"],["fixed","Fixed range"]],bx=[["lowest","Lowest value"],["zero","Zero"]],xx=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],Dl=[["uniform","One colour"],["bands","By value"]];function go(e){let n=[os,"#FFD60A"];if(e.length<2)return n.map((o,s)=>({id:te(),upTo:(s+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,s)=>({id:te(),upTo:r(t+a*(s+1)/3),colorHex:o}))}function jl(e){if(e.length===0)return 0;let n=Math.min(...e),t=Math.max(...e),i=t-n;return Number(((n+t)/2).toFixed(i>=10?0:2))}function wx(e,n){let t=rn({bands:e}),i=t.at(-1),a=e.length>1?Math.abs(t[1].upTo-t[0].upTo):10;return{id:te(),upTo:(i?.upTo??0)+(a||10),colorHex:n}}function bh(e,n,t,i){return h`<span class="band-cell">${Co(e,n,t)}${La(i)}</span>`}function vx(e,n){let t=(typeof n=="number"?[n]:n??[]).filter(s=>Number.isFinite(s)),i=[...e,...t];if(i.length===0)return{lo:-1,hi:1};let a=Math.min(...i),r=Math.max(...i),o=r>a?(r-a)*.12:Math.abs(a)/2||1;return{lo:a-o,hi:r+o}}var kx=.1;function $x(e,n,t,i=kx){let a=[...e].sort((k,v)=>k-v),r=k=>Math.max(n,Math.min(t,k)),o=[n,...a.map(r),t],s=t-n||1,l=o.slice(1).map((k,v)=>Math.max(0,k-o[v])/s),d=Math.min(i,1/l.length),c=l.map(k=>k<d),u=c.filter(Boolean).length,p=l.reduce((k,v,C)=>k+(c[C]?0:v),0),m=1-u*d,g=l.length-u,y=l.map((k,v)=>c[v]?d:p>0?k/p*m:m/g),b=y.map((k,v)=>y.slice(0,v).reduce((C,R)=>C+R,0));return{shares:y,at:k=>{let v=r(k),C=o.length-2;for(let A=0;A<o.length-1;A++)if(v<=o[A+1]){C=A;break}let R=o[C+1]-o[C],M=R>0?(v-o[C])/R:0;return Math.max(0,Math.min(100,(b[C]+M*y[C])*100))}}}function ro(e){return Math.abs(e)>=1e3||Number.isInteger(e)?String(Math.round(e*100)/100):String(Number(e.toPrecision(4)))}function Cx(e,n){let t=e.flatMap(m=>m.upTo===void 0?[]:[m.upTo]),{lo:i,hi:a}=vx(t,n),{shares:r,at:o}=$x(t,i,a),s=typeof n=="number"&&Number.isFinite(n)?n:void 0,l=typeof n=="object"?n.filter(m=>Number.isFinite(m)):[],d=l.length>0?Math.min(...l):void 0,c=l.length>0?Math.max(...l):void 0,u=-1/0,p=[...t].sort((m,g)=>m-g).flatMap(m=>{let g=o(m);return g-u<12?[]:(u=g,[h`<span style=${`left:${g}%`}>${ro(m)}</span>`])});return h`<div class="band-bar">
    <div class="bb" aria-hidden="true">${e.map((m,g)=>h`<i class=${m.border===void 0?"":"bordered"}
      style=${`flex-grow:${r[g]??0};--f:${m.fill}${m.border===void 0?"":`;--b:${m.border}`}`}></i>`)}</div>
    ${d===void 0||c===void 0?f:h`<span class="span" style=${`left:${o(d)}%;width:${o(c)-o(d)}%`}
      title=${d===c?`Reads ${ro(d)}`:`Reads ${ro(d)} to ${ro(c)}`}></span>`}
    ${s===void 0?f:h`<span class="now" style=${`left:${o(s)}%`} title=${`Now ${s}`}></span>`}
    ${p.length===0?f:h`<div class="ticks" aria-hidden="true">${p}</div>`}
  </div>`}function yo(e,n,t,i,a){let r=rn({bands:e.bands}),o=typeof i=="number"&&Number.isFinite(i)?i:void 0,s=o===void 0?void 0:r.find(b=>o<=b.upTo)?.id??"above",l=(b,$)=>k=>{let v=k.bands.find(C=>C.id===b);v&&$(v)},d=e.bandAboveColorHex,c={atDefault:Kl(d,he),title:`Back to ${he}`,reset:()=>t(b=>{b.bandAboveColorHex=he})},u=a?.border===!0,p=(b,$,k,v,C)=>{if(!u)return Co(b,$.colorHex,E=>k(E??"#FFFFFF"));let R=a?.fillHex,M=a?.borderHex,A=$.fillColorHex===void 0?void 0:{atDefault:!1,title:"Back to the chart fill colour",reset:()=>v(void 0)},F=$.borderColorHex===void 0?void 0:{atDefault:!1,title:`Back to ${M===void 0?"white":"the chart border colour"}`,reset:()=>C(void 0)};return h`
      ${bh(`${b} fill`,$.fillColorHex??R??$.colorHex,E=>{E!==void 0&&(k(E),v(R===void 0?void 0:E))},A)}
      ${bh(`${b} border`,$.borderColorHex??M??Xi,E=>C(E),F)}`},m=(b,$)=>{let k=r[b];return h`<input type="number" class="band-up" step="any" .value=${String(k.upTo)} aria-label=${$}
      title=${`Band ${b+1} runs up to and including this number`}
      data-scrub @pointerdown=${_a(k.upTo,v=>t(l(k.id,C=>{C.upTo=v})),{...b>0?{min:r[b-1].upTo}:{},...b<r.length-1?{max:r[b+1].upTo}:{}})}
      @change=${ke(v=>{let C=Number(v);v.trim()!==""&&Number.isFinite(C)&&t(l(k.id,R=>{R.upTo=C}))})} />`},g=(b,$)=>({...b===void 0?{}:{upTo:b},fill:u?$.fillColorHex??a?.fillHex??$.colorHex:$.colorHex,...u?{border:$.borderColorHex??a?.borderHex??Xi}:{}}),y=[...r.map(b=>g(b.upTo,b)),g(void 0,{colorHex:d,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}})];return h`<div class=${u?"bands split":"bands"}>
    ${Cx(y,o??(typeof i=="object"?i:void 0))}
    ${!u||r.length===0?f:h`<div class="band-row band-head" aria-hidden="true">
      <span></span><span>Fill</span><span>Border</span><span></span>
    </div>`}
    ${r.map((b,$)=>h`
      <div class="band-row ${s===b.id?"hit":""}">
        <span class="range">${$===0?h`<span class="le">Less than</span>${m($,"Less than")}`:h`${m($-1,"From")}<span class="to">to</span>${m($,"Up to")}`}</span>
        ${p(`Up to ${b.upTo}`,b,k=>t(l(b.id,v=>{v.colorHex=k}),`bcol${b.id}`),k=>t(l(b.id,v=>{k===void 0?delete v.fillColorHex:v.fillColorHex=k}),`bfill${b.id}`),k=>t(l(b.id,v=>{k===void 0?delete v.borderColorHex:v.borderColorHex=k}),`bborder${b.id}`))}
        <button type="button" class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${()=>t(k=>{k.bands=k.bands.filter(v=>v.id!==b.id)})}>${V("close")}</button>
      </div>`)}
    <div class="band-row ${s==="above"?"hit":""}">${La(c)}
      <span class="range">${r.length===0?h`<span class="else">Every value</span>`:h`<span class="le">Greater than</span>${m(r.length-1,"Greater than")}`}</span>
      ${p("Above the last band",{colorHex:d,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}},b=>t($=>{$.bandAboveColorHex=b},"babove"),b=>t($=>{b===void 0?delete $.bandAboveFillColorHex:$.bandAboveFillColorHex=b},"bafill"),b=>t($=>{b===void 0?delete $.bandAboveBorderColorHex:$.bandAboveBorderColorHex=b},"baborder"))}
      <span></span>
    </div>
    <button type="button" class="link add-band" @click=${()=>t(b=>{b.bands=[...b.bands,wx(b.bands,n)]})}>+ Band</button>
  </div>`}function Sx(e,n,t,i){let a=new Map,r=new Map,o=(d,c)=>{let u=d.trim();if(u==="")return;let p=u.toLowerCase();r.has(p)||r.set(p,u),a.set(p,(a.get(p)??0)+c)};e.forEach((d,c)=>{let u=e[c+1],p=u===void 0?n:u.offsetSeconds;o(d.state,Math.max(0,p-d.offsetSeconds))}),t!==void 0&&o(t,0),(oa[i??""]??[]).forEach(d=>o(d,0));let s=["unavailable","unknown"];return[...[...a.entries()].filter(([d])=>!s.includes(d)).sort((d,c)=>c[1]-d[1]).map(([d])=>r.get(d)??d),...s]}function Tx(e,n,t=[],i="wa-timeline-states"){let a=new Set(e.bands.map(o=>o.match.trim().toLowerCase())),r=t.find(o=>!a.has(o.toLowerCase()))??"";return h`
    ${e.bands.map((o,s)=>h`
      <div class="row-inline">
        ${Ae("State",o.match,l=>n(d=>{let c=d.bands[s];c&&(c.match=l)},`tmatch${o.id}`),{placeholder:"on",list:i})}
        ${be("Colour",o.colorHex,l=>n(d=>{let c=d.bands[s];c&&(c.colorHex=l??on)},`tcol${o.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${()=>n(l=>{l.bands=l.bands.filter((d,c)=>c!==s)})}>${V("close")}</button>
      </div>`)}
    <datalist id=${i}>${t.map(o=>h`<option value=${o}></option>`)}</datalist>
    <button class="small" @click=${()=>n(o=>{o.bands=[...o.bands,{id:te(),match:r,colorHex:ar(r)}]})}>${r===""?"Add state":`Add ${r}`}</button>
    ${be("Otherwise",e.otherColorHex,o=>n(s=>{s.otherColorHex=o??on},"tother"),!1,on)}`}var Ex=[["arc","Arc"],["ring","Ring"],["bar","Bar"],["dots","Dots"]],Rx={arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar",dots:"One dot per unit, the first few filled"};function xh(e){let n=e.value.kind;if(n.kind==="aggregate"){let{stateFilter:t,...i}=n.aggregate;return{kind:{kind:"aggregate",aggregate:{...i,function:"count"}}}}return G(String(Math.max(1,Math.round(e.maxValue-e.minValue))))}var Mx=[["now","Time (14:05)"],["hour","Hour"],["minute","Minute"],["weekday","Day of the week (0 is Monday)"],["day","Day of the month"],["month","Month number"],["timestamp","Unix timestamp (seconds)"]];function Ax(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"}}}function le(e,n,t,i){if(i.inline||!Hx())return h`<div class="value-editor">${qh(e,n,t,i)}</div>`;let a=To(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,s=Me(n,me(e)),l="entityId"in n.kind;return h`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact||i.noLabel?f:h`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?f:h`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${Kh(e,a,r,n,t,i)}
  </div>`}function Kh(e,n,t,i,a,r){return h`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${jh}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${Aa.has(n)?qh(e,i,a,r):f}
  </div>`}function me(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function To(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function Hx(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var Aa=new Set,Ta=new WeakMap;function Fx(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function Wh(e,n,t=!1){let i=e instanceof Node?e:null;if(!i)return;let a=i.getRootNode();!(a instanceof ShadowRoot)&&!(a instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let r=a.querySelector(`#${CSS.escape(n)}`);r&&typeof r.showPopover=="function"&&!r.matches(":popover-open")&&r.showPopover(),r&&t&&requestAnimationFrame(()=>requestAnimationFrame(()=>{r.querySelector("textarea, input[type=text], input[type=search], input:not([type])")?.focus()}))}))}function jh(e){let n=e.currentTarget,t=e.newState==="open",i=Ta.get(n);if(i&&(i(),Ta.delete(n)),!t){Aa.delete(n.id)&&He(n);return}let a=Fx(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){Ta.get(n)?.(),Ta.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}Fl(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),Ta.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Fl(n,a.getBoundingClientRect()),Aa.has(n.id)||(Aa.add(n.id),He(n),requestAnimationFrame(()=>{n.isConnected&&Fl(n,a.getBoundingClientRect())}))}function Fl(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=Ix({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var ti=8,oo=6,wh=140;function Ix(e,n,t){let i=t.height-e.bottom-oo-ti,a=e.top-oo-ti,r=n.height>i&&a>i&&i<wh,o=Math.max(wh,r?a:i),s=Math.min(n.height,o),l=Math.max(ti,Math.min(e.left,t.width-n.width-ti)),d=r?Math.max(ti,e.top-oo-s):Math.max(ti,Math.min(e.bottom+oo,t.height-s-ti));return{left:l,top:d,maxHeight:o,above:r}}function qh(e,n,t,i){let a=n.kind,r=c=>t({...n,kind:c}),o=i.key,s=px.filter(([c])=>i.allowNamed!==!1||c!=="named"),l=f;switch(a.kind){case"literal":l=i.symbol?Vh(e,a.value,c=>r({...a,value:c}),o,i.setSymbolPath):Ae("Text",a.value,c=>r({...a,value:c}));break;case"entityState":case"entityAge":l=Et(e,"Entity",a,c=>r({...a,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),u=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=h`${Et(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`)}
        ${Ae("Attribute",a.attribute,p=>r({...a,attribute:p}),{list:u,mono:!0})}
        <datalist id=${u}>${c.map(p=>h`<option value=${p}></option>`)}</datalist>`;break}case"aggregate":l=Bx(e,a.aggregate,c=>r({...a,aggregate:c}),o);break;case"time":l=Se("Field",a.timeField,Mx,c=>r({...a,timeField:c}));break;case"dataAge":break;case"jinja":l=h`${zh("Template",a.value,c=>r({...a,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":{let c=e.config.values.find(p=>p.id===a.id),u=c?la(e.config,c.id):0;l=e.config.values.length===0?h`<div class="hint keep">No shared values yet.
            <button type="button" class="link" @click=${()=>Dx(e,n,t)}>Start an empty one</button>,
            or choose another source and click Make shared.</div>`:h`${Se("Value",a.id,[["","(choose)"],...e.config.values.map(p=>[p.id,p.name||p.id.slice(0,8)])],p=>r({...a,id:p}))}
          ${c?h`<div class="hint keep">Read by ${u} ${u===1?"layer":"layers"}.
            <button type="button" class="link" @click=${()=>e.selectValue(c.id)}>Edit it</button> to change them all, or
            <button type="button" class="link" @click=${()=>{let p=_s(e.config,n);p&&t(p)}}>stop sharing</button>
            to give this one its own copy.</div>`:f}`;break}case"chartStat":{let c=me(e),u=e.config.elements.filter(p=>p.kind==="chart");l=u.length===0?h`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:h`
          ${Se("Chart",a.layer,[["","(choose)"],...u.map(p=>[p.payload.id,Fe(p,c)])],p=>r({...a,layer:p}))}
          ${Se("Number",a.stat,[...bt],p=>r({...a,stat:p}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Add unit to print the entity's unit after it."}</div>`;break}}let d=hx[a.kind];return h`
    ${Se("Source",a.kind,s,c=>r(Ax(a,c)))}
    ${d?h`<div class="hint">${d}</div>`:f}
    ${l}
    ${Nx(n,i)?h`<div class="hint keep">
      <button type="button" class="link" title="Move this into a shared value that other layers can read too" @click=${()=>zx(e,n,t)}>Make shared</button>
      so other layers can read this too.</div>`:f}
    ${i.noFormat?f:Ox(n.format,c=>t(Pe(c)?{kind:n.kind}:{...n,format:c}),_x(Lx(e,n)))}
    ${i.showResolved?Px(e,n,e.resolve(i.resolveAs??n)):f}`}function Lx(e,n){let t=n.kind;for(let i=0;t.kind==="named"&&i<8;i++){let a=t.id.toUpperCase(),r=e.config.values.find(o=>o.id.toUpperCase()===a);if(!r)return;t=r.value.kind}return t.kind==="named"?void 0:t}function _x(e){if(!e)return{numbers:!0,textCase:!0,unit:!0,seconds:!0};switch(e.kind){case"literal":{let n=Xe(e.value)!==void 0;return{numbers:n,textCase:!n,unit:!1,seconds:n}}case"entityState":case"entityAttribute":case"jinja":case"named":return{numbers:!0,textCase:!0,unit:e.kind!=="jinja"&&e.kind!=="named",seconds:!0};case"entityAge":case"dataAge":return{numbers:!0,textCase:!1,unit:!1,seconds:!0};case"aggregate":return{numbers:!0,textCase:!1,unit:!1,seconds:!1};case"chartStat":{let n=e.stat==="trend";return{numbers:!n,textCase:!1,unit:!n,seconds:!1}}case"time":return{numbers:e.timeField!=="now",textCase:!1,unit:!1,seconds:!1}}}function Px(e,n,t){let i=t===void 0?h`<span class="readout-v now-v none">${Yh(e,n)}</span>`:t.trim()===""?h`<span class="readout-v now-v none">Empty</span>`:h`<span class="readout-v now-v"><span class="now-tok">${t}</span></span>`;return h`<div class="field readout now-field"><span>Now</span>${i}</div>`}function Yh(e,n){let t=n.kind;switch(t.kind){case"entityState":case"entityAttribute":case"entityAge":return t.entityId===""?"Pick an entity":e.hass.states[t.entityId]?t.kind==="entityAttribute"&&t.attribute.trim()===""?"Pick an attribute":t.kind==="entityState"?"No reading":"Waiting for Home Assistant":"No such entity";case"chartStat":return t.layer===""?"Pick a chart":"The chart has no readings yet";case"named":{if(t.id==="")return"Pick a shared value";let i=t.id.toUpperCase(),a=e.config.values.find(r=>r.id.toUpperCase()===i);return a?Yh(e,a.value):"That shared value is gone"}case"jinja":return t.value.trim()===""?"Type a template":"Waiting for Home Assistant";default:return"Waiting for Home Assistant"}}function Nx(e,n){if(n.allowNamed===!1||n.noShare)return!1;let t=e.kind;return t.kind==="named"?!1:t.kind==="literal"||t.kind==="jinja"?t.value.trim()!=="":"entityId"in t?t.entityId!=="":t.kind==="chartStat"?t.layer!=="":!0}function zx(e,n,t){let i=Pa(n,me(e)).replace(/^"(.*)"$/,"$1"),{named:a,ref:r}=Ls(e.config,n,Be(i,24));e.beginGesture(),e.update(o=>{o.values.push(a)}),t(r),e.endGesture()}function Dx(e,n,t){let{named:i,ref:a}=Ls(e.config,{...n,kind:{kind:"literal",value:""}},"");i.name="",e.beginGesture(),e.update(r=>{r.values.push(i)}),t(a),e.endGesture(),e.selectValue(i.id)}function Ox(e,n,t){let i=e??{},a=s=>{let l={...i,...s};for(let d of Object.keys(l))(l[d]===void 0||l[d]===!1||l[d]==="")&&delete l[d];n(l)},r=Pe(e),o={decimals:t.numbers||i.decimals!==void 0,multiply:t.numbers||i.multiply!==void 0,offset:t.numbers||i.offset!==void 0,textCase:t.textCase||i.textCase!==void 0,unit:t.unit||!!i.useEntityUnit,seconds:t.seconds||!!i.relativeTime||!!i.duration};return h`<details class="sub format" ?open=${!r}>
    <summary>Format${r?h`<span class="sum-note">as it comes</span>`:h`<span class="sum-note">${fm(e).replace(/^ \((.*)\)$/,"$1")}</span>`}</summary>
    <div class="grid2">
      ${o.decimals?ae("Decimals",i.decimals,s=>a({decimals:s}),{step:1,min:0,max:6,optional:!0,placeholder:"as is"}):f}
      ${o.multiply?ae("Multiply",i.multiply,s=>a({multiply:s}),{optional:!0,placeholder:"1"}):f}
      ${o.offset?ae("Plus",i.offset,s=>a({offset:s}),{optional:!0,placeholder:"0"}):f}
      ${o.textCase?ie("Case",i.textCase??"",[["","As is"],["upper","ABC"],["lower","abc"],["capitalized","Abc"]],s=>a({textCase:s||void 0}),{titles:{"":"Leave the letters as they are",upper:"UPPER CASE",lower:"lower case",capitalized:"Capital First Letters"}}):f}
      ${Ae("Before",i.prefix??"",s=>a({prefix:s}),{placeholder:"text in front"})}
      ${Ae("After",i.suffix??"",s=>a({suffix:s}),{placeholder:"text after"})}
    </div>
    ${o.unit?Ve("Add unit",!!i.useEntityUnit,s=>a({useEntityUnit:s})):f}
    ${o.seconds?ie("Seconds as",i.duration?"duration":i.relativeTime?"relativeTime":"",[["","Number"],["relativeTime","Short"],["duration","Duration"]],s=>a({relativeTime:s==="relativeTime",duration:s==="duration"}),{titles:{"":"300",relativeTime:"One unit: 45s, 5m, 3h",duration:"Two units: 1h 23m, 5m 0s"}}):f}
  </details>`}function Bx(e,n,t,i){let a=s=>s.join(", "),r=s=>s.split(",").map(l=>l.trim()).filter(Boolean),o=n.scope;return h`
    ${Se("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],s=>t({...n,function:s}))}
    ${ie("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],s=>t({...n,scope:s==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?h`<div class="grid2">
          ${Ae("Domains",a(o.domains),s=>t({...n,scope:{...o,domains:r(s)}}),{placeholder:"light, switch"})}
          ${Ae("Area ids",a(o.areaIds),s=>t({...n,scope:{...o,areaIds:r(s)}}))}
          ${Ae("Label ids",a(o.labelIds),s=>t({...n,scope:{...o,labelIds:r(s)}}))}
          ${Ae("Floor ids",a(o.floorIds),s=>t({...n,scope:{...o,floorIds:r(s)}}))}
        </div>`:h`${o.entities.map((s,l)=>h`<div class="row-inline">
            ${Et(e,`Entity ${l+1}`,s,d=>{let c=[...o.entities];c[l]=d,t({...n,scope:{...o,entities:c}})},`${i}-agg-${l}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,scope:{...o,entities:o.entities.filter((d,c)=>c!==l)}})}>${V("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${Se("Only count when",n.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],s=>{let l={...n};s===""?delete l.stateFilter:s==="equals"||s==="notEquals"?l.stateFilter={kind:s,value:n.stateFilter&&"value"in n.stateFilter?n.stateFilter.value:""}:l.stateFilter={kind:s},t(l)})}
    ${n.stateFilter&&"value"in n.stateFilter?Ae("State",n.stateFilter.value,s=>t({...n,stateFilter:{kind:n.stateFilter.kind,value:s}})):f}
    ${n.function==="count"?f:Ae("Attribute (blank = state)",n.attribute??"",s=>{let l={...n};s?l.attribute=s:delete l.attribute,t(l)})}`}var Xh=xs,Vx=Xh.filter(([e])=>e!=="none");function Gx(e){if("entityId"in e)return{entityId:e.entityId,displayName:e.displayName,domain:e.domain};if(e.type==="callService")return e.target}function Jh(e,n){let t=Gx(n)??{entityId:"",displayName:"",domain:""};if(e==="callService"){let i=n.type==="callService"?{...n}:{type:"callService",serviceDomain:"",serviceName:""};return t.entityId!==""&&(i.target=t),i}return Sc(e)?{type:e,...t}:{type:e}}var Ux=[["Open a cover","cover","open_cover",""],["Close a cover","cover","close_cover",""],["Stop a cover","cover","stop_cover",""],["Lock","lock","lock",""],["Unlock","lock","unlock",""],["Light brightness","light","turn_on",'{"brightness_pct": 50}'],["Climate target","climate","set_temperature",'{"temperature": 21}'],["Play / pause","media_player","media_play_pause",""],["Start a vacuum","vacuum","start",""],["Send a vacuum home","vacuum","return_to_base",""]];function Zh(e,n,t,i){let a=n.serviceDataJSON??"",r=Tc(a),o=n.target??{entityId:"",displayName:"",domain:""};return h`
    <div class="gen-row">
      ${Ae("Domain",n.serviceDomain,s=>t({...n,serviceDomain:s.trim()},"svc-domain"),{placeholder:"light"})}
      ${Ae("Service",n.serviceName,s=>t({...n,serviceName:s.trim()},"svc-name"),{placeholder:"turn_on"})}
    </div>
    <div class="chips">
      ${Ux.map(([s,l,d,c])=>h`
        <button class="small" title=${`Fill in ${l}.${d}`}
          @click=${()=>{let u={...n,serviceDomain:l,serviceName:d};c===""?delete u.serviceDataJSON:u.serviceDataJSON=c,t(u)}}>${s}</button>`)}
    </div>
    ${Et(e,"Target entity (optional)",o,s=>{let l={...n};s.entityId===""?delete l.target:l.target=s,t(l,"svc-entity")},`${i}-svc-entity`)}
    ${zh("Data (JSON)",a,s=>{let l={...n};s.trim()===""?delete l.serviceDataJSON:l.serviceDataJSON=s,t(l,"svc-data")},3)}
    ${r?h`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`:h`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`}function Kx(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function Qh(e){let n=e.config,t=n.tapAction,i=Kx(e.savedName,n.name),a=n.refreshMinutes??0,r=vh.map(s=>[String(s),kh(s)]);vh.includes(a)||r.push([String(a),kh(a)]);let o=n.showSuccessFlash??!0;return h`
    <div class="gen-row">
      ${Ae("Name",n.name,s=>e.update(l=>{l.name=s},"name"))}
      ${Se("Refresh",String(a),r,s=>e.update(l=>{l.refreshMinutes=Number(s)||0},"refresh"))}
      ${Se("Tap action",t.type,Xh,s=>e.update(l=>{l.tapAction=Jh(s,l.tapAction),s!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${o} title="Flash when a tap works"
            @change=${s=>e.update(l=>{l.showSuccessFlash=s.target.checked})} />
          ${o?h`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??Wx).slice(0,7)}
                @input=${ke(s=>e.update(l=>{l.successFlashColorHex=s.toUpperCase()},"flash"))} />`:h`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${i?h`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in t?Et(e,"Target",t,s=>e.update(l=>{l.tapAction={type:t.type,...s}},"tap-entity"),"general-tap"):f}
    ${t.type==="callService"?Zh(e,t,(s,l)=>e.update(d=>{d.tapAction=s},l),"general-tap"):f}
    ${t.type==="openPage"?jx(e):f}`}var Wx="#808080",vh=[0,15,30,60,120];function kh(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function jx(e){let n=e.config;return em(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function em(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?h`<div class="hint keep">No pages reported yet. Open the watch app once so it can send its page list.</div>`:h`${Se("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?f:h`<div class="hint keep">Without a page the tap falls back to the complication list.</div>`}`}function tm(e,n){let t=e.config.values.findIndex(o=>o.id===n.id),i=`nv-${n.id}`,a=la(e.config,n.id),r={kind:{kind:"named",id:n.id}};return h`
    ${Ae("Name",n.name,o=>e.update(s=>{s.values[t].name=o},`${i}-name`),{placeholder:"Name it, like Outside temp"})}
    ${le(e,n.value,o=>e.update(s=>{s.values[t].value=o},i),{allowNamed:!1,showResolved:!0,resolveAs:r,inline:!0,key:i})}
    <div class="field readout"><span>Used by</span><span class="readout-v">${a===0?"No layers yet":`${a} ${a===1?"layer":"layers"}`}</span></div>`}function nm(){return{id:te(),name:"",value:G("")}}function _e(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function $e(e,n,t,i,a=!1){let r=e.elements.find(c=>c.payload.id===t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let s=_e(e,n,r),d={...o.placements[t]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};a&&delete d.size,o.placements[t]=d}function xn(e,n,t,i,a){let r=n.payload.id,o=$r(n)??a.min,s=_e(e.config,t,n).size??o;return ae(i,s,l=>e.update(d=>$e(d,t,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min,unit:"pt",...a.def===void 0?{}:{def:a.def}})}function im(e,n,t){let i=e.perFamily[t]??(e.perFamily[t]=Bt()),a=kt(e,n).filter(l=>!ve(e,l));if(a.length===0)return;let r=ki(e,a.map(l=>l.payload.id),n),o=Ln(e,r,{nudge:!1}),s=e.perFamily[n];for(let l of o){let d=e.elements.find(m=>m.payload.id===l);if(!d)continue;let c=s?.placements[l],u=c?.size??$r(d),p={frame:{...c?.frame??d.payload.frame},isHidden:c?.isHidden??!1,...u!==void 0?{size:u}:{}};for(let m of se)m!==t&&delete e.perFamily[m]?.placements[l];i.placements[l]=Cr(p,n,t,d.kind)}$i(e,t)}function Eo(e,n){return Zc(e,n)}function qx(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function ii(e){return e.kind==="image"||e.kind==="tap"||e.kind==="timeline"||e.kind==="chartTimes"||e.kind==="chartDots"||e.kind==="chartGrid"||e.kind==="imageTime"?void 0:e.payload.colorSlot.baseColorHex}function am(e,n,t){let i=qx(t.map(l=>_e(e,n,l).isHidden)),a=t.map(ii),r=t.length>0&&a.every(l=>l!==void 0),o=a[0],s=r&&o!==void 0&&a.every(l=>l!==void 0&&l.toUpperCase()===o.toUpperCase());return{hiddenHere:i,colourable:r,colour:s?o:void 0}}var _i=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]],Yx=[["leading","Left"],["center","Center"],["trailing","Right"]],Xx=[["1","1"],["2","2"]];function rm(e,n,t){let i=n.payload.id,a=Rr(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"&&n.payload.source==="camera",s={...o?{domain:"camera"}:{},needed:$h(n)},l=d=>{let c=e.hass.states[d]?.attributes?.device_class;return typeof c=="string"?c:void 0};return h`
    ${Et(e,o?"Camera":"Entity",r,d=>e.update(c=>Qc(c,i,d,l(d.entityId)),`${t}-entity`),`${t}-layer-entity`,s)}
    <div class="hint ${$h(n)?"warn":""}">${Zx(n,a)}</div>`}function $h(e){return e.kind==="timeline"?e.payload.value.kind.kind!=="entityState":e.kind==="chart"?e.payload.historyMinutes>0&&e.payload.value.kind.kind!=="entityState":e.kind==="image"?e.payload.entity.entityId==="":!1}function Jx(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function Ro(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Zx(e,n){let t=Jx(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline"))?i==="named"?" Its content comes through a shared value, so change that shared value to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=n.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":e.kind==="timeline"?"the states":"the text"),n.some(d=>d.where==="tap")&&o.push("the tap");let l=n.filter(d=>d.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${Ro(o)}.${r}`}function Qx(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function Fa(e,n){if(e===n)return!0;if(typeof e!=typeof n||e===null||n===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(n))return!1;if(Array.isArray(e))return e.length===n.length&&e.every((a,r)=>Fa(a,n[r]));let t=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(n).filter(a=>n[a]!==void 0);return t.length!==i.length?!1:t.every(a=>Fa(e[a],n[a]))}function Il(e,n,t){return t.some(i=>!Fa(e[i],n[i]))}function so(e,n,t){let i=e,a=n;for(let r of t)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function Te(e,n,t,i,a={}){let r=a.alwaysOpen===!0,o=r||e.openSections.has(n),s=e.helpSections.has(n),l=()=>e.toggleSection(n),d=()=>{!s&&!o&&e.toggleSection(n),e.toggleHelp(n)},c=s?`Hide the help in ${t}`:`Show help for ${t}`,u=h`<span class="swatch">${V(a.icon??"content")}</span>
      <span class="tt"><h4>${t}${La(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${t} back to its defaults`,reset:a.reset})}</h4>${a.summary?h`<span class="sum">${a.summary}</span>`:f}</span>
      <button type="button" class="sec-help ${s?"on":""}" aria-pressed=${s?"true":"false"} title=${c} aria-label=${c}
        @click=${p=>{p.stopPropagation(),d()}}>?</button>`;return h`<section class="sec" data-open=${o?"true":"false"} data-help=${s?"on":"off"} style=${a.color?`--c:${a.color}`:""}>
    ${r?h`<div class="sec-h pinned">${u}</div>`:h`<div class="sec-h" role="button" tabindex="0" aria-expanded=${o?"true":"false"} @click=${l}
          @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),l())}}>
          ${u}
          <span class="chev">${V("chevron")}</span>
        </div>`}
    ${o?h`<div class="sec-b">${i}</div>`:f}
  </section>`}function ew(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function tw(e){if(e<60)return`${Math.max(0,Math.round(e))}s`;let n=Math.round(e/60);if(n<90)return`${n}m`;let t=Math.floor(n/60),i=n%60;return i===0?`${t}h`:`${t}h ${i}m`}function nw(e,n){let t=ce[e==="inline"?"rectangular":e],i=n.height*t.height>n.width*t.width,a=Math.round((n.rotationDegrees%180+180)%180)===90;return i!==a}function iw(e,n,t){let i=nw(e,n),a=ce[e==="inline"?"rectangular":e],r=n.height*a.height>n.width*a.width;return h`<div class="grid2">
    ${ie("Direction",i?"vertical":"horizontal",[["horizontal","Horizontal"],["vertical","Vertical"]],o=>{t({rotationDegrees:o==="vertical"===r?0:90},"line-dir")},{titles:{horizontal:"Lying along the frame",vertical:"Standing up, as a divider"}})}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`}function aw(e){let n=e.filter(i=>i.state!=="unavailable"&&i.state!=="unknown");return n.length===0?!1:n.filter(i=>i.state.trim()!==""&&Number.isFinite(Number(i.state))).length*2>n.length}function rw(e,n,t=4){if(e.length===0)return"nothing";let i=[];for(let o=0;o<e.length;o++){let s=e[o],l=e[o+1]?.offsetSeconds??n,d=Math.max(0,l-s.offsetSeconds),c=i[i.length-1];c!==void 0&&c.state.trim().toLowerCase()===s.state.trim().toLowerCase()?c.seconds+=d:i.push({state:s.state,seconds:d})}let a=i.slice(-t),r=a.map(o=>`${o.state||"(blank)"} ${tw(o.seconds)}`).join(", ");return i.length>a.length?`\u2026 ${r}`:r}function ri(e,n=Dn){let t=n.find(s=>s.minutes===e);if(t)return t.label;let i=Math.floor(e/1440),a=Math.floor(e%1440/60),r=e%60,o=[];return i>0&&o.push(`${i}d`),a>0&&o.push(`${a}h`),(r>0||o.length===0)&&o.push(`${r}m`),`Last ${o.join(" ")}`}function ow(e,n,t){if(!e||n===void 0||!n.averaged)return;let i=t.replace(/^Last\s+/,""),a=/^\d/.test(i)?`all ${i}`:`the whole ${i}`;return`This span has ${n.readings} readings, more than ${zt}, so they are averaged into ${zt} even slots to cover ${a}.`}var mo=new Set;function Ol(e,n,t=Dn){return mo.has(e)||!t.some(i=>i.minutes===n)}function Ll(e,n,t,i,a=Dn){let r=Ol(e,n,a);return h`<label class="field">${Ge("Span",{atDefault:n===t&&!r,title:`Back to ${ri(t,a)}`,reset:()=>{mo.delete(e),i(t)}})}
      <select @change=${o=>{let s=o.target.value;s==="custom"?(mo.add(e),He(o.target)):(mo.delete(e),i(Number(s)||fr))}}>
        ${a.map(({minutes:o,label:s})=>h`<option value=${String(o)} ?selected=${!r&&o===n}>${s}</option>`)}
        <option value="custom" ?selected=${r}>Custom…</option>
      </select></label>`}function _l(e,n,t=!1){let i=t?ds:gr,a=Math.floor(i/1440),r=t?aa:Dn,o=Math.floor(e/1440),s=Math.floor(e%1440/60),l=e%60,d=(c,u,p)=>n(Math.min(i,Math.max(1,Math.round(c)*1440+Math.round(u)*60+Math.round(p))));return h`<div class="grid3 span-parts">
      ${ae("Days",o,c=>d(c??0,s,l),{step:1,min:0,max:a})}
      ${ae("Hours",s,c=>d(o,c??0,l),{step:1,min:0,max:23})}
      ${ae("Minutes",l,c=>d(o,s,c??0),{step:1,min:0,max:59})}
    </div>
    <div class="hint">${t?h`${ri(e,r)}, up to 366 days. Statistics rows are never
          purged, so the limit is about what fits on a complication rather than about what
          the recorder still holds.`:h`${ri(e,r)}, up to 7 days: the recorder keeps
          ten by default, and a longer span would quietly come back short.`}</div>`}function sw(e){if(e.historyMinutes<=0)return"";if(e.source!=="statistics")return` \xB7 ${ri(e.historyMinutes)}`;let n=cr.find(([t])=>t===e.statPeriod)?.[1]??e.statPeriod;return` \xB7 ${ri(e.historyMinutes,aa)} \xB7 per ${n.toLowerCase()}`}function ql(e,n){let t=me(e);switch(n.kind){case"text":{let i=n.payload.parts?.length??0;return lt(n.payload)?`Rich text, ${i} part${i===1?"":"s"}`:Be(Me(n.payload.value,t),48)}case"icon":return Be(Me(n.payload.symbol,t),48);case"gauge":return Be(Me(n.payload.value,t),48);case"chart":return Be(`${Me(n.payload.value,t)}${sw(n.payload)}`,48);case"timeline":return Be(`${Me(n.payload.value,t)} \xB7 ${ri(dt(n.payload))}`,48);case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":return n.payload.entity.displayName||n.payload.entity.entityId||(n.payload.source==="camera"?"No camera yet":"No entity yet");case"tap":return Dt(n.payload.action);case"chartTimes":{let i=e.config.elements.find(a=>a.payload.id===n.payload.chart);return i?.kind==="chart"||i?.kind==="timeline"?Be(`Times of ${Me(i.payload.value,t)}`,48):"No chart or timeline"}case"imageTime":{let i=e.config.elements.find(a=>a.payload.id===n.payload.image);return i?.kind==="image"?Be(`Time of ${Fe(i,t)}`,48):"No picture"}case"chartDots":case"chartGrid":{let i=e.config.elements.find(r=>r.payload.id===n.payload.chart),a=n.kind==="chartDots"?"Dots on":"Grid behind";return i?.kind==="chart"?Be(`${a} ${Me(i.payload.value,t)}`,48):"No chart"}}}function bo(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${Le(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${Le(e.payload.colorSlot.baseColorHex)}`;case"gauge":{let n=e.payload,t=n.style==="dots"?`${n.bands.length>0&&n.coloring==="bands"?"banded":Le(n.colorSlot.baseColorHex)} dots`:`${n.lineWidth} pt line \xB7 ${n.coloring==="bands"&&n.bands.length>0?`${n.bands.length+1} colour bands`:Le(n.colorSlot.baseColorHex)}`;return`${n.style} \xB7 ${t}${n.thresholdValue===void 0?"":` \xB7 threshold ${n.thresholdValue}`}`}case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}`;case"timeline":{let n=e.payload;return`${n.bands.length===0?`one colour (${Le(n.otherColorHex)})`:`${n.bands.length} ${n.bands.length===1?"state":"states"} coloured`}${n.gap>0?` \xB7 ${n.gap} pt gap`:""} \xB7 corners ${n.cornerRadius} pt`}case"shape":return e.payload.kind==="line"?`${Le(e.payload.colorSlot.baseColorHex)} \xB7 ${e.payload.thickness} pt thick`:`${Le(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return;case"chartTimes":return`${e.payload.timeLabelCount<=0?"no":e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt \xB7 ${Le(e.payload.labelColorHex)}`;case"imageTime":return;case"chartDots":{let n=e.payload;return`${n.dots==="all"?"all":"auto"} \xB7 ${n.size===void 0?"automatic size":`${n.size} pt`} \xB7 ${n.colorHex===void 0?"series colour":Le(n.colorHex)}`}case"chartGrid":{let n=e.payload;return`${n.lines} ${n.lines===1?"line":"lines"} \xB7 ${n.thickness} pt \xB7 ${Le(n.colorHex)}`}}}function Ea(e,n,t,i,a,r){let o=Math.round(t*1e3)/10,s=l=>i(l/100);return h`<label class="pf">
    <span class="pl" title=${`${n}. Drag left or right to change it.`}
      @pointerdown=${ko(o,s,{step:.5,min:a,max:r})}>${e}</span>
    <input type="number" step="0.5" min=${a} max=${r} .value=${String(o)} aria-label=${`${n} in percent`}
      data-scrub @pointerdown=${_a(o,s,{step:.5,min:a,max:r})}
      @input=${ke(l=>{let d=Number(l);l.trim()!==""&&Number.isFinite(d)&&s(d)})} />
    <span class="unit" aria-hidden="true">%</span>
  </label>`}function lw(e,n,t){let i=n.payload.id,a=`el-${i}`,r=_e(e.config,t,n),o=r.frame,s=(c,u)=>e.update(p=>$e(p,t,i,{frame:_r(o,c)}),`${a}-${u}-${t}`),l=!Fa(o,ea)||r.isHidden,d=n.payload.chartAnchor;if(n.kind==="chartDots"||n.kind==="chartGrid"){let c=e.config.elements.find(u=>u.payload.id===n.payload.chart);return Te(e,"placement","Position",h`
      <div class="hint keep">${n.kind==="chartDots"?"Dots sit":"Grid lines sit"} on their chart, so they move,
        size and turn with it. To change where they are, change the chart.</div>
      ${c?h`<div class="field list-field"><span>Chart</span>
        <div class="chips"><button class="small" @click=${()=>e.selectLayer(c.payload.id)}>Select the chart</button></div>
      </div>`:f}
      ${Ve("Hidden",r.isHidden,u=>e.update(p=>$e(p,t,i,{isHidden:u})),!1)}`,{color:J.position,icon:"place",summary:`On the chart \xB7 ${ne(t)}`})}return d?.place==="through"?Te(e,"placement","Position",h`
      <div class="hint keep">A line sits on its chart at the reading it follows, and runs the whole plot. To
        change where it is, change the reading below or the chart. Thickness and colour are in Look.</div>
      ${Th(e,n,t)}
      ${o.rotationDegrees!==0?ai("Rotation",o.rotationDegrees,c=>s({rotationDegrees:c},"rot"),{min:-180,max:180,step:1,def:0,format:c=>`${Math.round(c)}\xB0`,unit:"\xB0",range:!1}):f}
      ${Ve("Hidden",r.isHidden,c=>e.update(u=>$e(u,t,i,{isHidden:c})),!1)}`,{color:J.position,icon:"place",summary:`On the chart \xB7 ${ne(t)}`}):Te(e,"placement","Position",h`
    ${Th(e,n,t)}
    ${d===void 0?h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${Ea("X","Left",o.x,c=>s({x:c},"x"),-100,100)}
        ${Ea("Y","Top",o.y,c=>s({y:c},"y"),-100,100)}
      </div>
    </div>
    ${Sh(e,n,t,o,["across","down","both"])}
    </div>`:Nt(d.at)?f:h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${Ea("X","Left",o.x,c=>s({x:c},"x"),-100,100)}
      </div>
    </div>
    ${Sh(e,n,t,o,["across"])}
    </div>`}
    <div class="field xy-field"><span>Size</span>
      <div class="xy">
        ${Ea("W","Width",o.width,c=>s({width:c},"w"),4,200)}
        ${Ea("H","Height",o.height,c=>s({height:c},"h"),4,200)}
      </div>
    </div>
    ${ai("Rotation",o.rotationDegrees,c=>s({rotationDegrees:c},"rot"),{min:-180,max:180,step:1,def:0,format:c=>`${Math.round(c)}\xB0`,unit:"\xB0",range:!1})}
    ${Ve("Hidden",r.isHidden,c=>e.update(u=>$e(u,t,i,{isHidden:c})),!1)}
    <div class="hint">${d===void 0?"X, Y, W and H are":"W and H are"} a percent of the face, on the ${ne(t)} shape only. Drag a letter left or right to change its number. Arrow keys nudge 1 pt, shift for 10.${d===void 0?" Copy position and Paste position repeat a spot on another layer, on any shape.":""}</div>`,{color:J.position,icon:"place",summary:`${Math.round(o.width*100)}% wide \xB7 ${ne(t)}`,...l?{resetTitle:`Put this layer back to the middle of the ${ne(t)} face at half size, unrotated and shown`,reset:()=>e.update(c=>$e(c,t,i,{frame:{...ea},isHidden:!1}))}:{}})}var Ch={across:{label:"Center across",title:"Move this layer to the middle of the face, left to right"},down:{label:"Center up and down",title:"Move this layer to the middle of the face, top to bottom"},both:{label:"Center",title:"Move this layer to the middle of the face"}};function Sh(e,n,t,i,a){let r=n.payload.id,o=(c,u)=>e.update(p=>$e(p,t,r,{frame:c}),`el-${r}-${u}-${t}`),s=e.copiedPosition,l=n.payload.chartAnchor!==void 0,d=s!==void 0&&s.family===t&&Fa(s.frame,i);return h`<div class="field list-field"><span>Line up</span>
    <div class="chips">
      ${a.map(c=>h`<button class="small" title=${Ch[c].title}
        ?disabled=${zu(i,c)}
        @click=${()=>o(Qs(i,c),`center-${c}`)}>${Ch[c].label}</button>`)}
    </div>
  </div>
  ${l?f:h`<div class="field list-field"><span>Copy</span>
    <div class="chips">
      <button class="small" title="Copy this layer's X, Y, W, H and rotation, to paste onto another layer"
        @click=${()=>e.copyPosition({frame:{...i},family:t})}>${d?"Copied":"Copy position"}</button>
      <button class="small" ?disabled=${s===void 0||d}
        title=${s===void 0?"Copy a position from a layer first":s.family===t||t!=="rectangular"&&s.family!=="rectangular"?`Put this layer where the copied one sits on the ${ne(s.family)} face`:`Put this layer where the copied one sits on the ${ne(s.family)} face, scaled for this shape`}
        @click=${()=>s&&o(qb(s,t,n.kind),"paste")}>Paste position</button>
    </div>
  </div>`}`}function Th(e,n,t){let i=n.payload.chartAnchor;if(i===void 0)return f;let a=n.payload.id,r=`el-${a}-anchor`,o=e.config.elements.filter(c=>c.kind==="chart"),s=(c,u)=>e.update(p=>{let m=p.elements.find(g=>g.payload.id===a);m?.payload.chartAnchor&&c(m.payload.chartAnchor)},u?`${r}-${u}`:void 0),l=me(e),d=!o.some(c=>c.payload.id===i.layer);return h`
    <div class="fgroup">
    ${o.length<2?f:Se("Follows",i.layer,o.map(c=>[c.payload.id,Fe(c,l)]),c=>s(u=>{u.layer=c}))}
    ${Se("Reading",i.at,xt,c=>e.update(u=>{let p=u.elements.find(g=>g.payload.id===a);if(!p?.payload.chartAnchor)return;p.payload.chartAnchor.at=c;let m=u.elements.find(g=>g.payload.id===i.layer);m?.kind==="chart"&&(c==="threshold"&&m.payload.thresholdValue===void 0&&(m.payload.thresholdValue=jl(Je(e.resolve(m.payload.value)??"")),m.payload.drawsThreshold=!1),c==="now"&&m.payload.nowIndex===void 0&&(m.payload.nowIndex={kind:{kind:"time",timeField:"hour"}},m.payload.drawsNowLine=!1))}),{def:"highest"})}
    ${om(e,i,r)}
    ${i.place==="through"?f:Se("Sits",i.place,ur.filter(([c])=>c!=="through"),c=>s(u=>{u.place=c}),{def:"above"})}
    </div>
    <div class="grid2">
      ${i.dx?ae("Nudge X",i.dx,c=>s(u=>{c?u.dx=c:delete u.dx},"dx"),{step:.5,def:0,unit:"pt"}):f}
      ${i.place==="through"&&!i.dy?f:ae("Nudge Y",i.dy??0,c=>s(u=>{c?u.dy=c:delete u.dy},"dy"),{step:.5,def:0,unit:"pt"})}
    </div>
    ${i.place==="through"?f:h`
    <div class="field list-field"><span>Marker</span>
      <div class="chips">
        <button class="small" title="Stop following the chart and leave this layer where it is"
          @click=${()=>e.update(c=>{let u=c.elements.find(p=>p.payload.id===a);u&&delete u.payload.chartAnchor})}><span>Unpin</span></button>
        <span class="muted">Stops following the chart, so you can move it anywhere.</span>
        ${n.kind==="text"?h`<button class="small" title="Swap this text marker for an icon of the same shape, keeping where it sits"
              @click=${()=>e.update(c=>{Lc(c,a)})}><span>Use an icon</span></button>`:f}
      </div>
    </div>`}
    ${d?h`<div class="hint keep">The chart this followed is not in this document any more, so the layer
          draws where its own frame puts it. Pick another chart above${i.place==="through"?", or delete the line":", or unpin it"}.</div>`:i.place==="through"?f:h`<div class="hint">This layer follows that reading on the ${ne(t)} face and every
          other one: wherever the bar lands, it goes. It is held inside the plot, so a big glyph over a tall
          bar is pushed down rather than off the top, and the bars never give up height to make room. Nudge Y
          can still lift it past the top of the chart, as far as the edge of the face.</div>`}`}function om(e,n,t){let i=e.config.elements.find(l=>l.payload.id===n.layer);if(i?.kind!=="chart")return f;let a=i.payload,r=(l,d)=>e.update(c=>{let u=c.elements.find(p=>p.payload.id===n.layer);u?.kind==="chart"&&l(u.payload)},`${t}-${d}`),o=De(e.config,n.layer).filter(l=>l.payload.chartAnchor?.at===n.at).length,s=o>1?` ${o} layers follow this ${n.at==="now"?"reading":"threshold"}, and they all move with this number.`:"";if(n.at==="threshold"){let l=jl(Je(e.resolve(a.value)??""));return h`
      <div class="grid2">
        ${ae("Threshold at",a.thresholdValue??l,d=>r(c=>{c.thresholdValue=d??l,c.drawsThreshold=!1},"thval"),{def:l})}
      </div>
      <div class="hint">${a.scale==="fixed"?"A threshold outside the chart's Min and Max draws nothing: the plot keeps the range you asked for.":"The plot stretches to include the threshold, so a series that never reaches it still shows how far off it is."}${s}</div>`}return n.at==="now"?h`
      ${le(e,a.nowIndex??{kind:{kind:"time",timeField:"hour"}},l=>r(d=>{d.nowIndex=l,d.drawsNowLine=!1},"nowidx"),{showResolved:!0,label:"Now is reading",key:`${t}-nowindex`})}
      <div class="hint">Counted from 0, so Hour puts now on reading 14 at 2 pm, which is what a 24-reading
        price or forecast chart wants. Rounded, and clamped to the readings drawn.${s}</div>`:n.at==="zero"?h`<div class="hint">Drawn only while the plot runs from below zero to above it, like a
      temperature or a battery charging and discharging. On readings that stay on one side of zero, zero
      sits on the edge of the plot or outside it, and nothing draws.</div>`:f}function dw(e,n){if(n.kind==="tap")return f;let t=n.payload.id,i=Ye(e.config,t)[0];return Te(e,"tappable","Tap",Pw(e,n,`el-${t}`),{color:J.tap,icon:"tap",summary:i?Dt(i.payload.action):"Not tappable",...i?{reset:()=>e.update(a=>Er(a,t))}:{}})}function cw(e,n,t,i,a){return h`
    ${ai("Times",e.timeLabelCount,r=>n(o=>{o.timeLabelCount=Math.max(0,Math.min(Bn,Math.round(r)))},`${i}count`),{min:0,max:Bn,step:1,def:t.timeLabelCount,format:r=>r<=0?"None":String(Math.round(r)),range:!1})}
    ${e.timeLabelCount<=0?f:h`
      <div class="fgroup">
      <div class="grid2">
        ${ae("Time size",e.labelSize,r=>n(o=>{o.labelSize=Math.min(ln,Math.max(sn,r??it))},`${i}size`),{step:.5,min:sn,max:ln,def:t.labelSize,unit:"pt"})}
        ${be("Time colour",e.labelColorHex,r=>n(o=>{o.labelColorHex=r??at},`${i}colour`),!1,t.labelColorHex)}
      </div>
      ${e.labelsAbove===void 0?f:ie("Row",e.labelsAbove?"above":"below",[["below","Below"],["above","Above"]],r=>n(o=>{o.labelsAbove=r==="above"}),{def:t.labelsAbove===!0?"above":"below"})}
      </div>
      <div class="fgroup">
      ${ie("Clock",e.hourCycle,xc,r=>n(o=>{o.hourCycle=r}),{titles:{auto:"Whatever clock the watch is set to"},def:t.hourCycle})}
      ${ie("Minutes",e.minutes,wc,r=>n(o=>{o.minutes=r}),{titles:{auto:"Kept up to a three hour span, dropped past it"},def:t.minutes})}
      ${a}
      </div>`}`}var uw=[["number","Number"],["entity","Entity"]];function pw(e,n){return(n==="min"?e.minSource:e.maxSource)===void 0?"number":"entity"}function hw(e,n,t){let i=n==="min"?"minSource":"maxSource";t==="number"?delete e[i]:e[i]===void 0&&(e[i]={kind:{kind:"entityState",entityId:"",displayName:"",domain:""}})}function mw(e,n,t,i,a){let r=o=>{let s=o==="min",l=s?"Min":"Max",d=pw(n,o),c=s?n.minValue:n.maxValue,u=y=>a(b=>{s?b.minValue=y??0:b.maxValue=y??100},o),p={number:`${l} is a fixed number`,entity:`${l} reads a number from an entity`},m=h`<div class="gauge-end-head">
      ${Ge(l,d==="number"?wn(c,t[o],u):void 0)}
      <span class="seg" role="radiogroup" aria-label=${`${l} comes from`}>
        ${uw.map(([y,b])=>h`<button type="button" role="radio" aria-checked=${y===d?"true":"false"}
          class=${y===d?"on":""} title=${p[y]}
          @click=${()=>{y!==d&&a($=>hw($,o,y))}}>${b}</button>`)}
      </span>
    </div>`,g=s?n.minSource:n.maxSource;return d==="number"||g===void 0?h`<div class="field gauge-end">${m}${$o(c,u,{ariaLabel:l})}</div>`:h`<div class="field gauge-end">${m}${le(e,g,y=>a(b=>{s?b.minSource=y:b.maxSource=y},`${o}src`),{showResolved:!0,noLabel:!0,label:l,key:`${i}-${o}source`})}</div>
      <div class="hint">If the entity has no number, the gauge uses ${String(c)}.</div>`};return n.minSource===void 0&&n.maxSource===void 0?h`<div class="grid2 gauge-ends">${r("min")}${r("max")}</div>`:h`${r("min")}${r("max")}`}function fw(e,n,t,i){let a=n.coloring??"uniform",r=n.highlight??"none",o=(c,u)=>t(p=>{let m={bands:p.bands??[],bandAboveColorHex:p.bandAboveColorHex??he};c(m),m.bands.length>0?p.bands=m.bands:delete p.bands,m.bandAboveColorHex!==he?p.bandAboveColorHex=m.bandAboveColorHex:delete p.bandAboveColorHex},u),s=(c,u,p)=>t(m=>{p===void 0||p===u?delete m[c]:m[c]=p},c),l=r==="highest"?"The highest number takes its own colour":r==="lowest"?"The lowest number takes its own colour":"The highest and lowest numbers take their own colours",d=a==="bands"?Je(e.resolve(n.value)??""):[];return h`
    <div class="fgroup">
    ${ie("Colour",a,Dl,c=>t(u=>{if(c==="uniform"){delete u.coloring;return}u.coloring=c,(u.bands?.length??0)===0&&(u.bands=go(Je(e.resolve(u.value)??"")))}),{def:"uniform"})}
    ${i}
    ${a==="bands"?h`
      <div class="hint">Each number in the text takes the colour of the band it falls in, and other text keeps the layer colour.</div>
      ${yo({bands:n.bands??[],bandAboveColorHex:n.bandAboveColorHex??he},n.colorSlot.baseColorHex,o,d.length===1?d[0]:void 0)}`:f}
    </div>
    <div class="fgroup">
    ${ie("Highlight",r,xx,c=>t(u=>{c==="none"?delete u.highlight:u.highlight=c}),{def:"none"})}
    ${r==="none"?f:h`
      <div class="grid2">
        ${r==="lowest"?f:be("Highest colour",n.highColorHex??tt,c=>s("highColorHex",tt,c),!1,tt)}
        ${r==="highest"?f:be("Lowest colour",n.lowColorHex??nt,c=>s("lowColorHex",nt,c),!1,nt)}
      </div>
      ${a==="bands"?f:h`<div class="hint">${l}, and other text keeps the layer colour.</div>`}`}
    </div>`}var Ma=new Map,Ra=new Map,Kt=new Map,lo=new Map,Pl=4,Nl=40,gw=[["layer","Layer"],["pick","Pick"],["bands","By value"]],yw=[["plain","Plain"],["rich","Rich"]],bw={plain:"One line: typed words, a live value or a template",rich:"Parts, each with its own colour, weight and size"};function Yl(e,n,t,i){let a=t!==void 0&&e.canCountDown(t);return!n&&!a?f:h`${Ve("Count down",n,i)}
    <div class="hint">Ticks down to the value's time on the watch, once a second: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>
    ${n&&!a?h`<div class="hint warn">This value is not a timer or a future time, so nothing counts down. The watch shows it as plain text.</div>`:f}`}function xw(e){return e.countdown===!0?"countdown":lt(e)?"rich":"plain"}function ww(e){return(e.match(/ +|[^ ]+/g)??[]).map(n=>({text:n,space:n.startsWith(" ")}))}function vw(e,n){let t=zn(e);return t!==void 0?{kind:"text",label:t}:e.kind.kind==="jinja"?{kind:"template",label:Be(e.kind.value,40)||"template"}:{kind:"value",label:Pa(e,n)}}function sm(e,n,t){let i=zn(e.value),a=i===void 0?Be(Pa(e.value,t),28):i.trim()===""?i===""?"empty":"spaces":`"${Be(i,24)}"`;return`Part ${n+1}: ${a}`}function kw(e,n,t){let i=[["","Whole text"],...e.map((a,r)=>[a.id,sm(a,r,t)])];return n!==void 0&&!e.some(a=>a.id===n)&&i.push([n,"A part that is gone"]),i}function Bl(e){return e.coloring==="bands"?"bands":e.colorHex===void 0?"layer":"pick"}function $w(e,n){if(Bl(e)==="bands"&&(e.bands?.length??0)>0){let t=[...rn({bands:e.bands}).map(r=>r.colorHex),e.bandAboveColorHex??he],i=100/t.length,a=r=>`${Math.round(r*10)/10}%`;return`conic-gradient(${t.map((r,o)=>`${r} ${a(o*i)} ${a((o+1)*i)}`).join(", ")})`}return e.colorHex??n}function Eh(e){let n=r=>r.length===1?`Part ${r[0].index+1}`:`Parts ${Ro(r.map(o=>String(o.index+1)))}`,t=e.filter(r=>r.reason==="kind"),i=e.filter(r=>r.reason==="format"),a=[];return t.length>0&&a.push(`${n(t)} ${t.length===1?"shows":"show"} a value a template cannot read, such as data age or a chart's number.`),i.length>0&&a.push(`${n(i)} ${i.length===1?"uses":"use"} a relative time or duration format, which a template cannot print.`),`Rich text stays on, because the parts cannot join into one line. ${a.join(" ")} Change or remove ${e.length===1?"that part":"those parts"} first.`}var Cw={fontSize:"font size",fontWeight:"weight",color:"colour",bands:"colour bands"};function Sw(e){return e.joined?e.template?"Rich text is off. The parts joined into one template, so the live values still update.":"Rich text is off. The parts joined into one line of text.":e.moved.length===0?"Rich text is off.":`Rich text is off. The part's ${Ro(e.moved.map(n=>Cw[n]))} moved into Look.`}function Tw(e,n,t,i,a){let r=n.payload,o=r.id,s=xw(r),l=(r.parts?.length??0)>0,d=ws(e.config,r.value),c=Kt.get(o),u=c&&c.rich===l?c:void 0,p=s==="rich"&&(r.parts?.length??0)>=2?Ra.get(o):void 0,m=(b,$)=>{let k=!(r.parts??[]).every(C=>C.value.kind.kind==="literal"),v=eo(structuredClone(r),e.config.values);if(Ra.delete(o),!v.ok){Kt.set(o,{text:Eh(v.blocked),rich:!0,warn:!0}),He($);return}Kt.set(o,{text:Sw(v.joined?{joined:!0,template:k}:v),rich:!1}),i(C=>{eo(C,e.config.values),b==="countdown"&&(C.countdown=!0)})},g=(b,$)=>{if(Ra.delete(o),s==="rich"){let k=b==="countdown"?"countdown":"plain",v=r.parts??[];if(v.length<2){m(k,$);return}let C=Tl(v,e.config.values);C.ok?(Kt.delete(o),Ra.set(o,k)):Kt.set(o,{text:Eh(C.blocked),rich:!0,warn:!0}),He($);return}if(b==="rich"){let k=r.parts?.[0]?.id??te();Ma.set(o,k),Kt.delete(o),i(v=>{delete v.countdown,oh(v,k)});return}Kt.delete(o),i(k=>{if(b==="countdown"){k.countdown=!0;return}(k.parts?.length??0)>0&&eo(k,e.config.values),delete k.countdown})},y=p==="countdown"?"Switch to Countdown?":"Switch to Plain?";return h`
    ${ie("Type",s==="rich"?"rich":"plain",yw,g,{titles:bw})}
    <div class="hint">Plain shows one line: typed words, a live value or a template. Rich splits the text into parts, and each part has its own colour, weight and size.</div>
    ${p===void 0?f:h`<div class="rich-confirm" role="alertdialog" aria-label=${y}>
        <b>${y}</b>
        <div>The parts join into one line, so every word and value stays. The part styles go away. Undo brings them back.${r.rules.some(b=>b.partId!==void 0)?" States that change one part will change the whole text.":""}</div>
        <div class="acts">
          <button class="small primary" @click=${b=>m(p,b.currentTarget)}>Switch</button>
          <button class="small" @click=${b=>{Ra.delete(o),He(b.currentTarget)}}>Keep Rich</button>
        </div>
      </div>`}
    ${u?h`<div class=${u.warn?"hint warn":"rich-note"}>${u.text}</div>`:f}
    ${s==="rich"?Ew(e,n,t,i,a):h`
        ${rm(e,n,a)}
        ${le(e,r.value,b=>i($=>{$.value=b},"value"),{showResolved:!0,label:s==="countdown"?"Until":"Text",key:`${a}-value`})}
        ${Yl(e,s==="countdown",r.value,b=>g(b?"countdown":"plain",null))}
        ${d?h`<div class="hint keep">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(d.payload.id)}>${Fe(d,me(e))}</button>. It stays in the chart's group and moves with it.</div>`:f}`}`}function Ew(e,n,t,i,a){let r=n.payload,o=r.parts??[],s=r.id,l=me(e),d=Math.max(0,o.findIndex(O=>O.id===Ma.get(s))),c=o[d],u=o.length,p=r.colorSlot.baseColorHex,m=_e(e.config,t,n).size??r.fontSize,g=(O,z)=>{Kt.delete(s),i(H=>{O(H),pc(H)},z)},y=(O,z)=>g(H=>{let X=H.parts?.find(x=>x.id===c.id);X&&O(X)},z?`part-${c.id}-${z}`:void 0),b=(O,z)=>{Ma.set(s,O),Kt.delete(s),He(z)},$=(O,z)=>{let H=te();Ma.set(s,H),g(X=>{(X.parts??=[]).push({id:H,value:O})}),Wh(z,To(`${a}-part-${H}`),!0)},k=O=>g(z=>{z.parts&&Ia(z.parts,d,O)}),v=()=>{let O=o[d+1]??o[d-1];O&&Ma.set(s,O.id),g(z=>{z.parts=(z.parts??[]).filter(H=>H.id!==c.id)})},C=o.map((O,z)=>{let H=vw(O.value,l),X=O.id===c.id,x=Bl(O),S=H.kind==="value"?e.resolve(O.value):void 0,_=O.fontWeight===void 0?void 0:_i.find(([B])=>B===O.fontWeight)?.[1];return h`<button type="button" role="option" aria-selected=${X?"true":"false"} class="part-chip ${H.kind} ${X?"on":""}"
      aria-label=${sm(O,z,l)} @click=${B=>b(O.id,B.currentTarget)}>
      <span class="part-dot" style=${`background:${$w(O,p)}`}
        title=${x==="bands"?"By value, with its own bands":x==="pick"?"Its own colour":"The layer colour"}></span>
      ${H.kind==="text"?h`<span class="part-txt">${H.label===""?h`<span class="part-empty">empty</span>`:ww(H.label).map(B=>B.space?h`<span class="part-sp">${"\xB7".repeat(B.text.length)}</span>`:B.text)}</span>`:h`<span class="part-txt">${H.label}</span>`}
      ${S===void 0?f:h`<span class="part-now">${S}</span>`}
      ${_===void 0?f:h`<span class="part-flag" title="Its own weight">${_}</span>`}
      ${O.fontSize===void 0?f:h`<span class="part-flag" title="Its own font size">${O.fontSize} pt</span>`}
    </button>`}),R=r.rules.some(O=>O.partId===c.id),M=c.value.kind.kind==="literal",A=Bl(c),F=c.fontSize!==void 0,E=_i.find(([O])=>O===r.fontWeight)?.[1]??r.fontWeight,N=O=>{O>=Pl&&O<=Nl&&y(z=>{z.fontSize=O},"size")},j=A==="bands"?Je(e.resolve(c.value)??""):[],K={layer:"Use the layer colour",...M&&A!=="bands"?{bands:"By value needs a live value"}:{}},q=(O,z)=>y(H=>{let X={bands:H.bands??[],bandAboveColorHex:H.bandAboveColorHex??he};O(X),X.bands.length>0?H.bands=X.bands:delete H.bands,X.bandAboveColorHex!==he?H.bandAboveColorHex=X.bandAboveColorHex:delete H.bandAboveColorHex},z);return h`<div class="rich-parts">
    <div class="field parts-field"><span>Parts</span>
      <div class="part-chips" role="listbox" aria-label="Parts">${C}</div>
      <div class="part-adds">
        <button type="button" class="small" title="Add a part of typed words"
          @click=${O=>$(G(""),O.currentTarget)}>${V("text")}<span>Add text</span></button>
        <button type="button" class="small" title="Add a part that shows a live value"
          @click=${O=>$({kind:{kind:"entityState",entityId:"",displayName:"",domain:""}},O.currentTarget)}>${V("braces")}<span>Add value</span></button>
      </div>
    </div>
    <div class="part-editor">
      <div class="part-head">
        <span class="part-title"><b>Part ${d+1}</b> of ${u} · ${M?"Text":"Value"}</span>
        <span class="spacer"></span>
        <button type="button" class="icon" title="Move left" aria-label="Move left" ?disabled=${d===0} @click=${()=>k(d-1)}>${V("left")}</button>
        <button type="button" class="icon" title="Move right" aria-label="Move right" ?disabled=${d===u-1} @click=${()=>k(d+1)}>${V("right")}</button>
        <button type="button" class="icon danger" aria-label="Remove this part" ?disabled=${u===1||R}
          title=${u===1?"A rich text layer keeps at least one part":R?"A state changes this part":"Remove this part"}
          @click=${v}>${V("delete")}</button>
      </div>
      ${R&&u>1?h`<div class="hint keep">A state changes this part. Change or delete that state first.</div>`:f}
      ${le(e,c.value,O=>y(z=>{z.value=O},"value"),{showResolved:!0,label:M?"Text":"Shows",key:`${a}-part-${c.id}`})}
      ${M?h`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>`:f}
      ${ie("Colour",A,gw,O=>y(z=>{if(O==="layer"){delete z.colorHex,delete z.coloring;return}if(O==="pick"){delete z.coloring,z.colorHex=Kl(p,"#FFFFFF")?"#64D2FF":p;return}delete z.colorHex,z.coloring="bands",(z.bands?.length??0)===0&&(z.bands=go(Je(e.resolve(z.value)??"")))}),{def:"layer",titles:K,...M&&A!=="bands"?{disabled:{bands:!0}}:{}})}
      ${A==="pick"?be("Part colour",c.colorHex,O=>y(z=>{z.colorHex=O??p},"color")):f}
      ${A==="bands"?h`
        ${yo({bands:c.bands??[],bandAboveColorHex:c.bandAboveColorHex??he},c.colorHex??p,q,j.length===1?j[0]:void 0)}
        <div class="hint">These bands belong to this part. Another value in the same layer keeps its own.</div>`:f}
      <div class="field seg-field">${Ge("Weight",c.fontWeight===void 0?void 0:{atDefault:!1,title:`Back to the layer weight (${E})`,reset:()=>y(O=>{delete O.fontWeight})})}
        ${fo("Weight",c.fontWeight,_i,O=>y(z=>{z.fontWeight=O}),{inherited:r.fontWeight})}
      </div>
      <label class="field num part-size">${Ge("Font size",F?{atDefault:!1,title:`Back to the layer size (${m} pt)`,reset:()=>y(O=>{delete O.fontSize})}:void 0,ko(c.fontSize??m,N,{step:1,min:Pl,max:Nl}))}
        ${$o(c.fontSize,O=>{O===void 0?y(z=>{delete z.fontSize},"size"):N(O)},{step:1,min:Pl,max:Nl,optional:!0,unit:"pt",placeholder:String(m),ariaLabel:F?"Part font size":`Part font size, ${m} pt from the layer`,...F?{}:{lead:V("link")}})}
      </label>
    </div>
  </div>`}function lm(e,n,t,i={}){let a=n.payload.id,r=e.config.elements.findIndex(x=>x.payload.id===a),o=`el-${a}`,s=(x,S)=>e.update(_=>x(_.elements[r]),S?`${o}-${S}`:void 0),l=_e(e.config,t,n),d=l.frame,c=(x,S)=>e.update(_=>$e(_,t,a,{frame:_r(d,x)}),`${o}-${S}-${t}`),u=Re(n.kind).payload,p=u.colorSlot?.baseColorHex??"#FFFFFF",m=x=>u[x],g=!1,y=x=>ii(n)===void 0?f:be(x,ii(n),S=>s(_=>{ii(_)!==void 0&&(_.payload.colorSlot.baseColorHex=S??"#FFFFFF")},"color"),!1,p),b,$={},k=[],v,C;switch(n.kind){case"text":{let x=(S,_)=>s(B=>S(B.payload),_);v=Tw(e,n,t,x,o),g=!n.payload.countdown&&!lt(n.payload),C=h`
        <div class="fgroup">
        ${xn(e,n,t,"Font size",{step:1,min:4,def:m("fontSize")})}
        ${ie("Weight",n.payload.fontWeight,_i,S=>s(_=>{_.payload.fontWeight=S}),{def:u.fontWeight})}
        ${ex({label:"Align",value:n.payload.alignment??"center",options:Yx,def:"center",set:S=>s(_=>{let B=_.payload;S==="center"?delete B.alignment:B.alignment=S})},{label:"Lines",value:n.payload.lineLimit===2?"2":"1",options:Xx,def:"1",set:S=>s(_=>{let B=_.payload;S==="2"?B.lineLimit=2:delete B.lineLimit})})}
        ${Ve("Mono digits",n.payload.monospacedDigits===!0,S=>s(_=>{let B=_.payload;S?B.monospacedDigits=!0:delete B.monospacedDigits}),u.monospacedDigits===!0)}
        ${n.payload.monospacedDigits?h`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>`:f}
        </div>
        ${g?fw(e,n.payload,x,y("Main colour")):f}`;break}case"icon":v=h`
        ${le(e,n.payload.symbol,x=>s(S=>{S.payload.symbol=x},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${o}-symbol`,setSymbolPath:x=>s(S=>{let _=S.payload;x?_.path=x:delete _.path},"symbol")})}
        <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`,C=xn(e,n,t,"Icon size",{step:1,min:4,def:m("size")});break;case"gauge":{let x=n.payload,S=(B,W)=>s(Z=>B(Z.payload),W),_=x.style==="dots";v=h`
        ${le(e,x.value,B=>S(W=>{W.value=B},"value"),{showResolved:!0,label:"Reading",key:`${o}-value`})}
        ${_?h`
            ${le(e,x.total??xh(x),B=>S(W=>{W.total=B},"total"),{showResolved:!0,label:"Total",key:`${o}-total`})}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${pr} dots are drawn.</div>`:h`<div class="fgroup">${mw(e,x,{min:u.minValue,max:u.maxValue},o,S)}</div>`}`,g=!0,C=h`
        <div class="grid2">
          ${ie("Style",x.style,Ex,B=>S(W=>{B==="dots"&&W.total===void 0&&(W.total=xh(W)),B!=="dots"&&delete W.total,W.style=B}),{titles:Rx,def:u.style})}
          ${_?f:xn(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        <div class="fgroup">
        ${be(_?"Empty dot colour":"Track colour",x.trackColorHex,B=>S(W=>{W.trackColorHex=B??"#FFFFFF40"},"track"),!1,u.trackColorHex)}
        ${ie("Colour",x.coloring,Dl,B=>S(W=>{W.coloring=B,B==="bands"&&W.bands.length===0&&(W.bands=go([W.minValue,W.maxValue]))}),{def:u.coloring})}
        ${y("Main colour")}
        ${x.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${yo(x,x.colorSlot.baseColorHex,S,Je(e.resolve(x.value)??"")[0])}`:f}
        </div>
        ${_?f:h`
          <div class="fgroup">
          <div class="grid2">
            ${ae("Threshold",x.thresholdValue,B=>S(W=>{B===void 0?delete W.thresholdValue:W.thresholdValue=B},"thr"),{optional:!0,def:null})}
            ${x.thresholdValue===void 0?f:be("Threshold colour",x.thresholdColorHex,B=>S(W=>{W.thresholdColorHex=B??gi},"thrcol"),!1,gi)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>
          </div>`}`;break}case"chart":{let x=n.payload,S=(T,D)=>s(de=>T(de.payload),D),_=u.historyMinutes,B=u.historyPoints,W=x.historyMinutes>0,Z=W&&x.source==="statistics",re=W&&!Z,Ce=W?Z?"statistics":"history":"value",At=Z?aa:Dn,jt=wt(x)??vt(x),ze=x.value.kind.kind==="entityState",xe=jt===void 0?void 0:e.historySeries(jt),Ue=W&&ze?xe??"":e.resolve(x.value)??"",Qe=x.historyPoints<1,uf=re&&ze&&jt!==void 0?e.historyReadings?.(jt):void 0,$d=ow(Qe,uf,ri(x.historyMinutes)),Cd=Ol(a,x.historyMinutes,At),Lo=W&&ze?js(Ue):{values:Je(Ue),holes:[]},ci=Lo.values,Sd=T=>x.limit>0&&T.length>x.limit?x.takeFromEnd?T.slice(T.length-x.limit):T.slice(0,x.limit):T,pf=Sd(ci),mt=qs(pf,st(x.smoothing),Lo.holes.length>0?Sd(Lo.holes):[]),hf=!W&&ze&&ci.length===1,_o=e.config.elements.filter(T=>T.kind==="chart"&&T.payload.id!==a),Td=me(e),Ba=x.scaleFrom!==void 0&&_o.some(T=>T.payload.id===x.scaleFrom);v=h`
        ${le(e,x.value,T=>S(D=>{D.value=T},"value"),{label:"Readings",noShare:!0,key:`${o}-value`})}
        <div class="fgroup">
        ${ie("Draw",Ce,[["history","Recorded history"],["statistics","Long-term statistics"],["value","The value itself"]],T=>S(D=>{if(T==="value"){D.historyMinutes=0;return}D.source=T==="statistics"?"statistics":"history";let de=D.historyMinutes||fr;D.historyMinutes=T==="statistics"?Math.min(de,ds):Math.min(de,gr)}),{titles:{history:"Read the entity's recorded states from the recorder and plot them",statistics:"Plot the recorder's pre-aggregated rows, which reach back a year",value:"Plot the numbers the value holds right now, such as a forecast list"},def:u.historyMinutes>0?"history":"value"})}
        ${Z?h`
            ${ze?f:h`<div class="hint warn">Statistics need an entity.
              A typed-in value, a template or a shared value has no rows to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Ll(a,x.historyMinutes,_,T=>S(D=>{D.historyMinutes=T}),aa)}
              ${ie("Per",x.statPeriod,cr,T=>S(D=>{D.statPeriod=T}),{def:Zi})}
            </div>
            ${Cd?_l(x.historyMinutes,T=>S(D=>{D.historyMinutes=T},"span"),!0):f}
            ${ie("Read",x.statType,is,T=>S(D=>{D.statType=T}),{def:Qi})}
            <div class="hint">One bar per period, oldest first, newest ${zt} kept.
              Change suits energy (kWh per hour), Mean suits temperature.</div>
            ${x.statPeriod==="5minute"?h`<div class="hint warn">Five-minute rows are compacted into hourly ones after
                about ten days, so a longer span here comes back with only its recent tail.</div>`:f}
            ${ze&&xe===void 0?h`<div class="hint keep">Reading the statistics…</div>`:f}
            ${ze&&xe===""?h`<div class="hint warn">No long-term statistics for this entity in that span.
                Only an entity with a state class (measurement, total or total_increasing) gets
                them, and a brand new one has none yet.</div>`:f}`:f}
        ${re?h`
            ${ze?f:h`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Ll(a,x.historyMinutes,_,T=>S(D=>{D.historyMinutes=T}))}
              <div class="field readings-field">${Ge("Points",{atDefault:x.historyPoints===B,title:`Back to ${B<1?"every one":`${B} averaged`}`,reset:()=>S(T=>{T.historyPoints=B})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Points">
                    <button type="button" role="radio" aria-checked=${Qe?"false":"true"} class=${Qe?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{Qe&&S(T=>{T.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${Qe?"true":"false"} class=${Qe?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{Qe||S(T=>{T.historyPoints=cs})}}>Every one</button>
                  </div>
                  ${Qe?f:h`<span class="readings-into">into</span>
                    <input type="number" class="short" aria-label="How many time slots" .value=${String(x.historyPoints)}
                      title="How many equal time slots the span is averaged into, so how many bars or points get drawn"
                      step="1" min=${yr} max=${zt}
                      data-scrub @pointerdown=${_a(x.historyPoints,T=>S(D=>{D.historyPoints=Math.round(T)},"hpoints"),{step:1,min:yr,max:zt})}
                      @input=${ke(T=>{let D=Number(T);T.trim()!==""&&Number.isFinite(D)&&D>=1&&S(de=>{de.historyPoints=Math.round(D)},"hpoints")})} />
                    <span class="readings-unit">slots</span>`}
                </div>
              </div>
            </div>
            ${Cd?_l(x.historyMinutes,T=>S(D=>{D.historyMinutes=T},"span")):f}
            <div class="hint">${Qe?h`Every state the recorder holds in that span, oldest first, one reading per change.
                  The time axis follows the changes, so a quiet hour draws narrower than a busy one.
                  A span with more than ${zt} readings is averaged into
                  ${zt} even slots instead, so the chart still covers all of it.`:h`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${$d===void 0?f:h`<div class="hint keep">${$d}</div>`}
            ${ze&&xe===void 0?h`<div class="hint keep">Reading the history…</div>`:f}
            ${ze&&xe===""?h`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:f}`:f}
        ${W?h`
            ${Ve("Show gaps",x.gaps===!0,T=>S(D=>{T?D.gaps=!0:delete D.gaps}),u.gaps===!0)}
            ${Ut(e)}
            <div class="hint">Breaks the line, and leaves the bar out, wherever the entity was unavailable,
              instead of carrying the last reading across the outage.</div>`:f}
        ${W?f:h`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        </div>
        ${ci.length===0&&!(W&&(!ze||xe===void 0||xe===""))?h`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:f}
        ${ci.length>0?h`<div class="field readout"><span>Reads</span>
              <span class="readout-v"><span class="nums">${ew(mt)}</span>${ci.length===mt.length?h` · ${mt.length} ${mt.length===1?"value":"values"}`:h` · ${mt.length} of ${ci.length}`}</span></div>`:f}
        ${hf?h`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:f}
        ${W&&x.limit<=0?f:h`
        <div class="grid2">
          ${ae("Only draw",x.limit,T=>S(D=>{D.limit=Math.max(0,Math.round(T??0))},"limit"),{step:1,min:0,def:u.limit,unit:"readings"})}
          ${x.limit<=0?f:ie("Keep",x.takeFromEnd?"end":"start",W?[["start","Oldest"],["end","Newest"]]:[["start","First"],["end","Last"]],T=>S(D=>{D.takeFromEnd=T==="end"}),{def:u.takeFromEnd===!0?"end":"start"})}
        </div>
        ${W?h`<div class="hint warn">Span and slots already set how much is drawn, so set this to 0.
              Trimming here draws only ${x.limit} of the readings fetched above, while clock times still label the whole span.</div>`:h`<div class="hint">${x.limit<=0?"0 draws every reading. Type a number to draw only that many.":`Draws only ${x.limit} of the numbers: the first or the last ones. A forecast sensor often carries 24 or 48.`}</div>`}`}
        ${Se("Smooth data",st(x.smoothing)??"off",gx,T=>S(D=>{let de=st(T);de===void 0?delete D.smoothing:D.smoothing=de}),{def:st(u.smoothing)??"off"})}
        ${Ut(e)}
        <div class="hint">Averages each reading with its neighbours, weighted towards the middle, so a
          jumpy sensor draws a calm line. The strength scales with the number of readings: over 120
          readings, Light, Medium and Strong average 7, 13 or 25 of them. The chart's own numbers
          read the smoothed series too: its stats, highlights and bands. A text layer pointed at the entity itself still shows the raw value.</div>`,g=!0;let mf=(()=>{if(Ba)return!0;if(x.scale==="fixed")return x.minValue<0&&x.maxValue>0;let T=mt.filter(Va=>Number.isFinite(Va));if(T.length===0)return!0;let D=Math.min(...T,x.thresholdValue??1/0),de=Math.max(...T,x.thresholdValue??-1/0);return D<0&&de>0})(),qt=uh(x);k=mt,C=h`
        <div class="grid2">
          ${ie("Style",x.style,Uh,T=>S(D=>{D.style=T}),{def:u.style})}
          ${x.style==="bars"?ae("Bar gap",x.barGap,T=>S(D=>{D.barGap=Math.max(0,T??0)},"gap"),{step:.5,min:0,def:u.barGap,unit:"pt"}):xn(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        ${x.style==="bars"?h`
          <div class="fgroup">
          <div class="grid2">
            ${ae("Corner radius",en(x.barRadius),T=>S(D=>{let de=Math.max(0,T??fi);de===fi?delete D.barRadius:D.barRadius=de},"barradius"),{step:.5,min:0,def:en(u.barRadius),unit:"pt"})}
          </div>
          ${Ve("Round top only",tn(x.barCorners)==="top",T=>S(D=>{T?D.barCorners="top":delete D.barCorners}),tn(u.barCorners)==="top")}
          ${Ut(e)}
          <div class="hint">Round top only rounds the end away from the baseline, so a bar hanging
            below zero rounds its bottom.</div>
          </div>
          <div class="fgroup">
          ${qt.fill===void 0?f:Hl(qt.fill,x.fillColorHex,T=>S(D=>{T===void 0?delete D.fillColorHex:D.fillColorHex=T},"fillcol"))}
          ${Ve("Border",x.barBorderWidth!==void 0,T=>S(D=>{T?D.barBorderWidth=1:delete D.barBorderWidth}),!1)}
          ${x.barBorderWidth===void 0?f:h`
            ${ae("Border width",x.barBorderWidth,T=>S(D=>{D.barBorderWidth=Math.min(Math.max(T??1,0),hr)},"barborderw"),{step:.5,min:0,max:hr,def:1,unit:"pt"})}
            ${qt.border===void 0?f:Hl(qt.border,x.barBorderColorHex,T=>S(D=>{T===void 0?delete D.barBorderColorHex:D.barBorderColorHex=T},"barbordercol"))}
            ${Ve("Open at base",x.barBorderOpenBase===!0,T=>S(D=>{T?D.barBorderOpenBase=!0:delete D.barBorderOpenBase}),!1)}`}
          ${Ut(e)}
          <div class="hint">The border is drawn inside each bar, so bars keep their size. A highlighted
            bar fills and borders in its highlight colour.${x.barBorderOpenBase===!0?" Open at base leaves the border off the edge on the baseline, so a bar hanging below zero leaves its top open.":" Open at base leaves the border off the edge on the baseline."}${x.coloring==="bands"?" Each band can set its own fill and border below.":""}</div>
          </div>`:h`
          <div class="fgroup">
          ${ie("Curve",x.curve??"straight",mx,T=>S(D=>{T==="straight"?delete D.curve:D.curve=T}),{titles:{straight:"A straight line from each reading to the next",smooth:"A smooth line that never rises past the highest reading or dips under the lowest",step:"Each reading holds flat until the next one, the way a state does"},def:u.curve??"straight"})}
          ${Ut(e)}
          </div>
          ${x.style==="area"?h`
            <div class="fgroup">
            ${ie("Fill",Qt(x.fillStyle),fx,T=>S(D=>{T==="flat"?delete D.fillStyle:D.fillStyle=T}),{titles:{flat:"One even wash under the line",fade:"Strongest at the top of the plot, fading to clear at the baseline"},def:Qt(u.fillStyle)})}
            ${qt.fill===void 0?f:Hl(qt.fill,x.fillColorHex,T=>S(D=>{T===void 0?delete D.fillColorHex:D.fillColorHex=T},"fillcol"))}
            ${Ut(e)}
            </div>`:f}`}
        <div class="fgroup">
        <div class="grid2">
          ${ie("Scale",x.scale,yx,T=>S(D=>{D.scale=T}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:u.scale})}
          ${ie("Baseline",x.baseline,bx,T=>S(D=>{D.baseline=T}),{def:u.baseline})}
        </div>
        ${_o.length===0?f:Se("Same scale as",Ba?x.scaleFrom:"",[["","Its own"],..._o.map(T=>[T.payload.id,Fe(T,Td)])],T=>S(D=>{T?D.scaleFrom=T:delete D.scaleFrom}),{def:""})}
        ${Ba?h`<div class="hint keep">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`:f}
        ${!Ba&&x.scale==="fixed"?h`<div class="grid2">
              ${ae("Min",x.minValue,T=>S(D=>{D.minValue=T??0},"cmin"),{def:u.minValue})}
              ${ae("Max",x.maxValue,T=>S(D=>{D.maxValue=T??100},"cmax"),{def:u.maxValue})}
            </div>`:f}
        <div class="hint">${x.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        </div>
        <div class="field"><span>Series</span>
          <div class="row-acts">
            <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
              @click=${()=>{let T;e.update(D=>{T=Xc(D,a,de=>Fe(de,Td))}),T&&e.selectLayer(T)}}>${V("plus")}<span>Add a second series</span></button>
          </div>
        </div>
        <div class="fgroup">
        ${ie("Colour",x.coloring,Dl,T=>S(D=>{D.coloring=T,T==="bands"&&D.bands.length===0&&(D.bands=go(mt))}),{def:u.coloring})}
        ${qt.main===void 0?f:y(qt.main)}
        ${x.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${x.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${yo(x,x.colorSlot.baseColorHex,S,mt,x.style==="bars"?{...x.fillColorHex===void 0?{}:{fillHex:x.fillColorHex},...x.barBorderColorHex===void 0?{}:{borderHex:x.barBorderColorHex},border:x.barBorderWidth!==void 0}:void 0)}
          ${x.style==="area"?h`${Ve("Band fill",x.fillBands,T=>S(D=>{D.fillBands=T}),u.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:f}`:f}
        </div>`;let Po=(T,D)=>De(T,a).filter(de=>de.payload.chartAnchor?.at===D&&de.payload.chartAnchor.place==="through"),Ed=(T,D)=>De(T,a).some(de=>de.payload.chartAnchor?.at===D),Rd={threshold:T=>Po(T,"threshold"),now:T=>Po(T,"now"),zero:T=>Po(T,"zero"),times:T=>un(T,a),dots:T=>Gn(T,a),grid:T=>Un(T,a)},ff={threshold:T=>{Ed(T,"threshold")?In(T,a,"threshold"):Pc(T,a,x.thresholdValue??jl(mt))},now:T=>{Ed(T,"now")?In(T,a,"now"):Nc(T,a,!0)},zero:T=>{Rs(T,a)},times:T=>{Vn(T,a)},dots:T=>{Ts(T,a)},grid:T=>{Es(T,a)}},ui={};On(x)||(ui.times=Qe&&re?"Clock times need evenly spaced readings. Set Points to Average.":"Clock times need a recorded span. Set Draw to Recorded history."),x.style==="bars"&&(ui.dots="Dots need a line or area chart. Set Style to Line or Area.");let No=T=>Rd[T](e.config).length>0;$={};for(let[T,D]of Object.entries(ui))$[`draw:${T}`]=D;let gf=([T,D])=>{let de=No(T),Va=de?void 0:ui[T],zo=`draw:${T}`;return h`<div class="xr-row" role="row" data-extra=${zo}>
          <span role="cell"><span class="xr-name">${D}</span></span>
          <span role="cell"></span>
          <span role="cell"><button type="button" class="xtog ${de?"on":""}" role="switch" aria-checked=${de?"true":"false"}
            aria-label=${D} ?disabled=${Va!==void 0} data-extra=${zo}
            title=${Jl(zo,Va??(de?`Remove the ${D.toLowerCase()} from this chart`:`Add ${D.toLowerCase()} to this chart`))}
            @click=${()=>e.update(Do=>{if(de)for(let yf of Rd[T](Do))ge(Do,yf.payload.id);else ff[T](Do)})}>${de?h`<span aria-hidden="true">✓</span>`:V("plus")}</button></span>
          <span role="cell"></span>
        </div>`};b=h`
        <div class="field list-field"><span>On the plot</span>
          <div class="xreadings" role="table" aria-label="On the plot" @pointerover=${Pi} @focusin=${Pi}>
            <div class="xr-row xr-head" role="row">
              <span role="columnheader"><span class="xr-name">Layer</span></span><span role="columnheader"></span>
              <span role="columnheader">Show</span><span role="columnheader"></span>
            </div>
            ${io.map(gf)}
          </div>
        </div>
        ${io.filter(([T])=>ui[T]!==void 0&&!No(T)).map(([T])=>h`<div class="hint keep">${ui[T]}</div>`)}
        ${No("zero")&&!mf?h`<div class="hint warn">These readings never cross zero, so the zero line is not drawn.</div>`:f}
        ${Ut(e)}`;break}case"timeline":{let x=n.payload,S=(xe,Ue)=>s(Qe=>xe(Qe.payload),Ue),_=u.historyMinutes,B=x.value.kind.kind==="entityState",W=qe(x),Z=W===void 0?void 0:e.historySeries(W),re=dt(x)*60,Ce=fa(Z??"",dn),At=Ol(a,x.historyMinutes),jt=x.value.kind.kind==="entityState"?x.value.kind.entityId:void 0,ze=Sx(Ce,re,jt===void 0?void 0:e.hass.states[jt]?.state,jt?.split(".")[0]);v=h`
        ${le(e,x.value,xe=>S(Ue=>{Ue.value=xe},"value"),{label:"States",noShare:!0,key:`${o}-value`})}
        ${B?f:h`<div class="hint warn">A timeline draws an entity's recorded
          past, so it needs one named above. A typed-in value, a template or a shared value has no
          past to read, and this layer stays blank until States names an entity.</div>`}
        <div class="fgroup">
        ${Ll(a,x.historyMinutes,_,xe=>S(Ue=>{Ue.historyMinutes=xe}))}
        ${At?_l(x.historyMinutes,xe=>S(Ue=>{Ue.historyMinutes=xe},"span")):f}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${dn} changes are drawn, and a
          busier span keeps its newest.</div>
        ${B&&Z===void 0?h`<div class="hint keep">Reading the history…</div>`:f}
        ${B&&Z===""?h`<div class="hint warn">Nothing recorded for this entity in that span. Either it is
            excluded from the recorder, or it has not been seen in that long.</div>`:f}
        </div>
        ${Ce.length>0?h`<div class="field readout"><span>Reads</span><span class="readout-v"><span class="nums">${rw(Ce,re)}</span></span></div>`:f}
        ${aw(Ce)?h`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`:f}`,C=h`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${Tx(x,S,ze,`wa-tl-states-${o.replace(/[^a-z0-9]/gi,"")}`)}
        ${ze.length>2?h`<div class="hint keep">Seen in this span: <span class="nums">${ze.filter(xe=>xe!=="unavailable"&&xe!=="unknown").join(", ")}</span>. Click into a State box to pick one.</div>`:f}
        <div class="grid2">
          ${ae("Gap",x.gap,xe=>S(Ue=>{Ue.gap=Math.min(br,Math.max(0,xe??0))},"tgap"),{step:.5,min:0,max:br,def:u.gap,unit:"pt"})}
          ${ae("Corner radius",x.cornerRadius,xe=>S(Ue=>{Ue.cornerRadius=Math.max(0,xe??0)},"tradius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"})}
        </div>
        <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
          the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
          door or a light usually wants.</div>
`;break}case"shape":v=h`<div class="grid2">
          ${ie("Shape",n.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"],["line","Line"]],x=>s(S=>{S.payload.kind=x}),{titles:{roundedRectangle:"Rounded rectangle",line:"A rule along the frame's long side"},def:u.kind})}
          ${n.payload.kind==="roundedRectangle"?ae("Corner radius",n.payload.cornerRadius,x=>s(S=>{S.payload.cornerRadius=x??6},"radius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"}):f}
        </div>
        ${n.payload.kind==="line"?iw(t,d,c):f}`,C=n.payload.kind==="line"?ae("Thickness",n.payload.thickness,x=>s(S=>{S.payload.thickness=x??1},"thick"),{step:.5,min:.5,def:u.thickness,unit:"pt"}):h`
        <div class="fgroup">
        ${be("Border colour",n.payload.borderColorHex,x=>s(S=>{x===void 0?delete S.payload.borderColorHex:S.payload.borderColorHex=x},"border"),!0,null)}
        ${n.payload.borderColorHex!==void 0?ae("Border width",n.payload.borderWidth,x=>s(S=>{S.payload.borderWidth=x??1},"bw"),{step:.5,min:0,def:u.borderWidth,unit:"pt"}):f}
        </div>`;break;case"image":{let x=n.payload,S=(Z,re)=>s(Ce=>Z(Ce.payload),re),_=x.entity.entityId?e.hass.states[x.entity.entityId]?.attributes?.entity_picture:void 0,B=typeof _=="string"?_:void 0,W=B!==void 0&&!B.startsWith("/");v=h`
        ${ie("Source",x.source,[["camera","Camera"],["entityPicture","Entity picture"]],Z=>S(re=>{re.source=Z}),{titles:{camera:"A snapshot from a camera entity",entityPicture:"The picture an entity already carries: a person's photo, cover art, a weather icon"},def:u.source})}
        ${x.source==="camera"?h`
            ${x.entity.entityId&&!x.entity.entityId.startsWith("camera.")?h`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>`:f}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`:h`
            ${x.entity.entityId&&B===void 0?h`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>`:f}
            ${W?h`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>`:f}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`,C=h`
        <div class="fgroup">
        ${ie("Picture",x.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],Z=>S(re=>{re.contentMode=Z}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:u.contentMode})}
        ${ai("Zoom",x.zoom,Z=>S(re=>{re.zoom=Z},"zoom"),{min:cl,max:4,step:.05,def:1,format:Z=>`${Z.toFixed(2)}x`,unit:"x"})}
        ${ai("Pan left/right",x.panX,Z=>S(re=>{re.panX=Z},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${ai("Pan up/down",x.panY,Z=>S(re=>{re.panY=Z},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class=${x.contentMode==="fit"&&x.zoom===1?"hint keep":"hint"}>${Qx(x)}</div>
        </div>
        ${ae("Corner radius",x.cornerRadius,Z=>S(re=>{re.cornerRadius=Math.max(0,Z??yi)},"imgradius"),{step:1,min:0,def:yi,unit:"pt"})}`;break}case"tap":{v=h`
        ${Xl(e,n.payload,(x,S)=>s(_=>x(_.payload),S),o)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}case"chartTimes":{let x=n.payload,S=(Z,re)=>s(Ce=>Z(Ce.payload),re),_=e.config.elements.find(Z=>Z.payload.id===x.chart),B=_?.kind==="chart"||_?.kind==="timeline"?_:void 0,W=B?.kind==="timeline"?"timeline":"chart";v=h`
        <div class="field readout"><span>${B?.kind==="timeline"?"Timeline":"Chart"}</span><span class="readout-v">${B?h`<button class="small" title=${`Select that ${W}`} @click=${()=>e.selectLayer(B.payload.id)}>${Fe(B,me(e))}</button>`:"None"}</span></div>
        ${B===void 0?h`<div class="hint warn">The chart or timeline these times belonged to is gone, so this layer draws nothing.</div>`:B.kind==="timeline"?qe(B.payload)===void 0?h`<div class="hint warn">That timeline names no entity yet, so it has no span to label and
                  this layer draws nothing.</div>`:f:On(B.payload)?f:h`<div class="hint warn">That chart has no evenly spaced span to label, so this layer draws
                  nothing. Clock times are drawn when its Draw is Recorded history with Points on Average,
                  or Long-term statistics.</div>`}
        <div class="hint">The clock times of that ${W}'s span, spread across this layer's width and centred
          in its height. Move and size it like any other layer.</div>`,C=cw(x,S,u,"ct",h`
        <div class="hint">Evenly spaced from the start of the ${W}'s span to now. Auto follows the watch's
          own clock and drops the minutes past a three hour span.</div>`);break}case"imageTime":{let x=n.payload,S=e.config.elements.find(B=>B.payload.id===x.image),_=S?.kind==="image"?S:void 0;v=h`
        <div class="field readout"><span>Picture</span><span class="readout-v">${_?h`<button class="small" title="Select that picture" @click=${()=>e.selectLayer(_.payload.id)}>${Fe(_,me(e))}</button>`:"None"}</span></div>
        ${_===void 0?h`<div class="hint warn">The picture this time belonged to is gone, so this layer draws nothing.</div>`:f}
        <div class="hint">The time that picture was fetched, not the time now: a picture that stops updating
          keeps its old time, so a stale one reads as stale. The watch shows nothing here until the picture
          has been fetched once. Move and size it like any other layer: the chip grows to fill the frame.</div>`;break}case"chartDots":{let x=n.payload,S=(re,Ce)=>s(At=>re(At.payload),Ce),_=e.config.elements.find(re=>re.payload.id===x.chart),B=_?.kind==="chart"?_:void 0,W=B===void 0?void 0:_e(e.config,t,B).size??B.payload.lineWidth,Z=W===void 0?void 0:Math.round(W*18)/10;v=h`
        ${Rh(e,B)}
        ${B===void 0?h`<div class="hint warn">The chart these dots belonged to is gone, so this layer draws nothing.</div>`:B.payload.style==="bars"?h`<div class="hint warn">That chart draws bars, so this layer draws nothing. Dots are drawn on a
                line or area chart.</div>`:f}
        <div class="hint">This layer always sits on its chart: it draws in the chart's box whatever its own frame
          says, with a dot on each reading the chart draws.</div>
        ${Ut(e)}`,C=h`
        ${ie("Dots",x.dots,Gh,re=>S(Ce=>{Ce.dots=re}),{titles:{auto:"A dot on every reading while they sit far enough apart to tell apart, none on a crowded chart",all:"A dot on every reading"},def:"auto"})}
        <div class="grid2">
          ${ae("Dot size",x.size??Z,re=>S(Ce=>{let At=gt(re);At===void 0||At===Z?delete Ce.size:Ce.size=At},"dotsize"),{step:.5,min:1,max:12,...Z===void 0?{}:{def:Z},unit:"pt"})}
          ${Ul("Dot colour",x.colorHex,"Series colour",re=>S(Ce=>{re===void 0?delete Ce.colorHex:Ce.colorHex=re},"dotcol"))}
        </div>
        <div class="hint">Auto leaves the dots off once the readings sit too close to tell apart. Left alone, a dot
          is a little wider than the chart's line and takes the colour the series has at its reading.</div>`;break}case"chartGrid":{let x=n.payload,S=(W,Z)=>s(re=>W(re.payload),Z),_=e.config.elements.find(W=>W.payload.id===x.chart),B=_?.kind==="chart"?_:void 0;v=h`
        ${Rh(e,B)}
        ${B===void 0?h`<div class="hint warn">The chart these grid lines belonged to is gone, so this layer draws nothing.</div>`:f}
        <div class="hint">This layer always sits on its chart: it draws across the chart's plot whatever its own
          frame says. Where it sits in Layers decides whether the lines are behind the series or in front.</div>
        ${Ut(e)}`,C=h`
        <div class="grid2">
          ${ae("Lines",x.lines,W=>S(Z=>{Z.lines=Pn(W??an)},"lines"),{step:1,min:1,max:4,def:an})}
          ${ae("Thickness",x.thickness,W=>S(Z=>{Z.thickness=Nn(W??nn)},"thick"),{step:.25,min:lr,max:dr,def:nn,unit:"pt"})}
        </div>
        ${be("Colour",x.colorHex,W=>S(Z=>{Z.colorHex=W??Pt},"gridcol"),!1,Pt)}
        <div class="hint">Equal rows across the plot, never on its top or bottom edge.</div>`;break}}let R=g||ii(n)===void 0?void 0:y(n.kind==="shape"?"Fill colour":n.kind==="text"&&lt(n.payload)?"Layer colour":"Colour"),M=Hs(e.config,n),A=M?{kind:{kind:"entityState",...M}}:void 0,F=n.kind==="text"&&(n.payload.parts?.length??0)>0?n.payload.parts:void 0,E=Mw[n.kind],N=Aw[n.kind],j=Il(n.payload,u,E),K=n.kind==="text"?"fontSize":n.kind==="icon"?"size":n.kind==="gauge"||n.kind==="chart"?"lineWidth":void 0,q=e.config.perFamily[t]?.placements[a]?.size!==void 0,O=Il(n.payload,u,N)||K!==void 0&&l.size!==void 0&&l.size!==u[K],z=cn(e.config,a),H=(x,S)=>()=>s(_=>so(_.payload,u,x),S),X=h`<section class="sec name-sec" data-open="true" style=${`--c:${J.place}`}>
    <div class="sec-h pinned">
      <span class="swatch">${V("text")}</span>
      <h4>Name${La(n.payload.name===void 0?void 0:{atDefault:!1,title:"Go back to the automatic title",reset:()=>s(x=>{delete x.payload.name},"reset-name")})}</h4>
      <input type="text" aria-label="Layer name" .value=${n.payload.name??""} placeholder=${um(n,me(e))}
        @input=${ke(x=>s(S=>{let _=zw(x);_===void 0?delete S.payload.name:S.payload.name=_},"name"))} />
    </div>
  </section>`;return h`
    ${X}
    ${Te(e,"content","Content",h`${n.kind==="tap"||n.kind==="text"||n.kind==="chartTimes"||n.kind==="chartDots"||n.kind==="chartGrid"||n.kind==="imageTime"?f:rm(e,n,o)}${v}`,{color:J.content,icon:"content",summary:ql(e,n),...j?{reset:()=>s(x=>{so(x.payload,u,E),x.kind==="text"&&Ca(x.payload.rules)},"reset-content")}:{}})}
    ${C===void 0&&R===void 0?f:Te(e,"look",n.kind==="image"?"Picture":"Look",h`${C??f}${R??f}`,{color:J.look,icon:n.kind==="image"?"image":"look",...bo(n)?{summary:bo(n)}:{},...O?{reset:()=>e.update(x=>{so(x.elements[r].payload,u,N),q&&$e(x,t,a,{},!0)})}:{}})}
    ${n.kind==="chart"?Te(e,"numbers","Extras",Lw(e,n,b,$,k),{color:J.numbers,icon:"text",summary:Iw(e,n),...z.length>0||De(e.config,a).length>0||un(e.config,a).length>0||Gn(e.config,a).length>0||Un(e.config,a).length>0||Il(n.payload,u,Mh)?{reset:()=>e.update(x=>{for(let _ of cn(x,a))ge(x,_.payload.id);for(let _ of De(x,a))ge(x,_.payload.id);for(let _ of un(x,a))ge(x,_.payload.id);for(let _ of Gn(x,a))ge(x,_.payload.id);for(let _ of Un(x,a))ge(x,_.payload.id);let S=x.elements.find(_=>_.payload.id===a);S&&so(S.payload,u,Mh)})}:{}}):f}
    ${n.kind==="timeline"||n.kind==="image"?Rw(e,n):f}
    ${Te(e,"states","States",xm(e,n.payload.rules,n.kind,x=>x.elements.find(S=>S.payload.id===a)?.payload.rules,`rules-${a}`,A,F),{color:J.states,icon:"states",summary:va(n.payload.rules).replace(/\.$/,""),...n.payload.rules.length>0?{reset:()=>s(x=>{x.payload.rules=[]})}:{}})}
    ${i.placement===!1?f:lw(e,n,t)}
    ${i.tap===!1?f:dw(e,n)}`}function Rw(e,n){let t=n.payload.id,i=n.kind==="timeline",a=i?un(e.config,t):$s(e.config,t),r=i?"Clock times":"Timestamp",o=e.activeFamily,s=()=>e.update(p=>{let m=p.elements.find(y=>y.payload.id===t);if(!m)return;let g=m.payload.frame;m.payload.frame={..._e(p,o,m).frame},i?Vn(p,t):Ss(p,t,ce[o==="inline"?"rectangular":o]),m.payload.frame=g}),l=a.length>0,d=a.map(p=>({el:p,lead:V("clock"),title:r,kind:i?"Times":"Timestamp"})),c=i?"timeline:times":"image:time",u=h`
    ${cm(i?"timeline":"image")}
    <div class="field list-field"><span>Draw</span>
      <div class="adders" @pointerover=${Pi} @focusin=${Pi}>
        <button class="small ${l?"on":""}" ?disabled=${l} aria-pressed=${l?"true":"false"} data-extra=${c}
          title=${Jl(c,l?`${r} is on this ${i?"timeline":"picture"}. Remove it in the list below.`:`Add ${r.toLowerCase()}`)}
          @click=${s}>${l?h`<span aria-hidden="true">✓</span>`:V("plus")}<span>${r}</span></button>
      </div>
    </div>
    <div class="hint">${i?"Adds the clock times of this timeline's span as their own layer in its group, so you can drag them anywhere and give them any size or colour.":"Adds the time the picture was fetched as its own layer in its group, so you can drag it anywhere, inside the picture or beside it."}</div>
    ${l?h`
      ${Zl(e,d,{icon:"close",danger:!0,label:p=>`Delete this ${p}`,run:p=>e.update(m=>ge(m,p))})}
      <div class="hint">Click the row to open its main settings here. More settings selects that layer. The ×
        deletes it, and Undo brings it back.</div>`:f}`;return Te(e,"numbers","Extras",u,{color:J.numbers,icon:"clock",summary:l?`${r} layer`:"None yet",...l?{reset:()=>e.update(p=>{for(let m of a)ge(p,m.payload.id)})}:{}})}var Mw={text:["value","countdown","parts"],icon:["symbol","path"],gauge:["value","minValue","maxValue","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","limit","takeFromEnd"],timeline:["value","historyMinutes"],shape:["kind","cornerRadius"],image:["entity","source"],tap:["action","openPageName"],chartTimes:[],chartDots:[],chartGrid:[],imageTime:[]},Aw={text:["fontSize","fontWeight","colorSlot","alignment","lineLimit","monospacedDigits","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","coloring","bands","bandAboveColorHex","fillBands","curve","fillStyle","fillColorHex","barRadius","barCorners","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","scaleFrom","colorSlot"],timeline:["bands","otherColorHex","gap","cornerRadius"],shape:["colorSlot","borderColorHex","borderWidth","thickness"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[],chartTimes:["timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["dots","size","colorHex"],chartGrid:["lines","colorHex","thickness"],imageTime:[]};function Rh(e,n){return h`<div class="field readout"><span>Chart</span><span class="readout-v">${n?h`<button class="small" title="Select that chart" @click=${()=>e.selectLayer(n.payload.id)}>${Fe(n,me(e))}</button>`:"None"}</span></div>`}var Mh=["highlight","highColorHex","lowColorHex","marker","highMarker","lowMarker","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes"];function Xl(e,n,t,i){let a=n.action;return h`
    ${Se("Tap action",a.type,Vx,r=>t(o=>{o.action=Jh(r,o.action),r!=="openPage"&&(delete o.openPageId,delete o.openPageName)}))}
    ${"entityId"in a?Et(e,"Target",a,r=>t(o=>{o.action={type:a.type,...r}},"tap-entity"),`${i}-tap`):f}
    ${a.type==="callService"?Zh(e,a,(r,o)=>t(s=>{s.action=r},o),`${i}-tap`):f}
    ${a.type==="openPage"?em(e,n.openPageId,n.openPageName,(r,o)=>t(s=>{if(r===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=r,o?s.openPageName=o:delete s.openPageName},"tap-page")):f}`}var Hw=24;function Fw(e,n){let t=[],i=1/0;for(let r of se){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=qc(e.config,n,r);o&&(t.push(`${ne(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return f;let a=i<Hw;return h`<div class="field readout"><span>Tap size</span><span class="readout-v">${t.join(" \xB7 ")}</span></div>
    ${a?h`<div class="hint warn">That is small for a wrist. Show the tap area and drag its corners out.</div>`:f}`}function Iw(e,n){let t=n.payload,i=cn(e.config,t.id),a=De(e.config,t.id),r=un(e.config,t.id),o=Gn(e.config,t.id),s=Un(e.config,t.id);if(i.length===0&&a.length===0&&r.length===0&&o.length===0&&s.length===0)return"None yet";let l=[...i.map(d=>{let c=d.payload.value.kind;return c.kind==="chartStat"?(bt.find(([u])=>u===c.stat)?.[1]??"number").toLowerCase():"number"})];for(let d of a){let{at:c,place:u}=d.payload.chartAnchor,p=(xt.find(([m])=>m===c)?.[1]??"reading").toLowerCase();l.push(u==="through"?`${p} line`:`${p} marker`)}for(let d of r)l.push("times layer");for(let d of o)l.push("dots layer");for(let d of s)l.push("grid layer");return l.join(" \xB7 ")}function Lw(e,n,t,i={},a=[]){let r=n.payload.id,o=me(e),s=cn(e.config,r),l=un(e.config,r),d=Gn(e.config,r),c=Un(e.config,r),u=De(e.config,r),p={};for(let[F]of bt){let E=e.resolve({kind:{kind:"chartStat",layer:r,stat:F}});E!==void 0&&E.trim()!==""&&(p[F]=E)}let m=a.filter(F=>Number.isFinite(F)),g=n.payload.nowIndex===void 0?NaN:Number(e.resolve(n.payload.nowIndex)),y=Number.isFinite(g)&&a.length>0?Math.min(a.length-1,Math.max(0,Math.round(g))):void 0,b=y===void 0||!Number.isFinite(a[y])||m.length===0?void 0:ia(a[y],Math.max(...m)-Math.min(...m)),$={values:a,texts:p,...y===void 0?{}:{now:y},...n.payload.thresholdValue===void 0?{}:{threshold:n.payload.thresholdValue}},k=(F,E)=>cn(F,r).filter(N=>N.payload.value.kind.kind==="chartStat"&&N.payload.value.kind.stat===E),v=(F,E)=>De(F,r).filter(N=>N.payload.chartAnchor?.at===E&&N.payload.chartAnchor.place!=="through"),C=(F,E,N,j,K,q,O)=>h`
    <button type="button" class="xtog ${E>0?"on":""}" role="switch" aria-checked=${E>0?"true":"false"}
      aria-label=${K} data-extra=${F}
      title=${Jl(F,E===0?N:E===1?j:`${j}: all ${E} of them`)}
      @click=${()=>e.update(z=>{if(E>0)for(let H of O(z))ge(z,H.payload.id);else q(z)})}>${E>0?h`<span aria-hidden="true">✓</span>`:V("plus")}</button>`,R=h`<div class="xreadings" role="table" aria-label="Readings" @pointerover=${Pi} @focusin=${Pi}>
    <div class="xr-row xr-head" role="row">
      <span role="columnheader"><span class="xr-name">Reading</span></span><span role="columnheader"></span>
      <span role="columnheader">Number</span><span role="columnheader">Marker</span>
    </div>
    ${lh.map(F=>{let E=F.stat!==void 0?p[F.stat]:b,N=F.stat===void 0?"":(bt.find(([q])=>q===F.stat)?.[1]??F.label).toLowerCase(),j=F.marker==="now"?"the reading at now":`the ${(xt.find(([q])=>q===F.marker)?.[1]??F.label).toLowerCase()}`,K=F.stat!==void 0?`number:${F.stat}`:F.marker!==void 0?`marker:${F.marker}`:void 0;return h`<div class="xr-row" role="row" data-extra=${K??f}>
        <span role="cell"><span class="xr-name">${F.label}</span></span>
        <span role="cell"><span class="xr-v nums">${E??""}</span></span>
        <span role="cell">${F.stat===void 0?f:C(`number:${F.stat}`,k(e.config,F.stat).length,`Print the ${N} as a number`,`Remove the ${N} number`,`${F.label} number`,q=>{Fc(q,r,F.stat)},q=>k(q,F.stat))}</span>
        <span role="cell">${F.marker===void 0?f:C(`marker:${F.marker}`,v(e.config,F.marker).length,`Put a marker over ${j}`,`Remove the marker over ${j}`,`${F.label} marker`,q=>{ks(q,r,F.marker)},q=>v(q,F.marker))}</span>
      </div>`})}
  </div>`,M=[...s.map(F=>({el:F,lead:e.resolve(F.payload.value)??"--",title:Fe(F,o),kind:"Number"})),...u.map(F=>{let{at:E,place:N}=F.payload.chartAnchor,j=xt.find(([q])=>q===E)?.[1]??"Reading";if(N==="through")return{el:F,lead:E==="now"?"\u2502":"\u2500",title:E==="zero"?"Zero":j,kind:"Line"};let K=F.kind==="text"?e.resolve(F.payload.value)??"\u25CF":F.kind==="icon"?Nw(e.resolve(F.payload.symbol)):"\u25C6";return{el:F,lead:K,title:j,kind:"Marker"}}),...l.map(F=>({el:F,lead:V("clock"),title:"Clock times",kind:"Times"})),...d.map(F=>({el:F,lead:V("chartDots"),title:"Reading dots",kind:"Dots"})),...c.map(F=>({el:F,lead:V("chartGrid"),title:"Grid lines",kind:"Grid"}))],A=M.length;return h`
    <div class="hint keep">Each one you switch on is a layer in this chart's group.</div>
    ${cm("chart",i,n.payload.style==="bars",$)}
    ${t??f}
    <div class="field list-field"><span>Readings</span>${R}</div>
    <div class="hint">A number is a text layer that prints the reading. A marker is an icon over it, pushed down
      rather than off the chart when the bar is tall. Newest, Change and Total start with the entity's unit.</div>
    ${A===0?f:h`
      <div class="shown-head">On this chart <span class="shown-count">${A}</span></div>
      ${Zl(e,M,{icon:"close",danger:!0,label:F=>`Delete this ${F}`,run:F=>e.update(E=>ge(E,F))})}
      <div class="hint">Click a row to set its value, colour and size here. More settings selects that layer.
        On the preview, click right on a dot to pick the dots.</div>`}`}var Ha,dm="wrist-assistant-extras-preview",Mo=(()=>{try{return window.localStorage.getItem(dm)!=="off"}catch{return!0}})();function Ah(e,n){Mo=e;try{window.localStorage.setItem(dm,e?"on":"off")}catch{}He(n)}function Pi(e){if(!Mo)return;let n=e.target?.closest?.("[data-extra]")?.getAttribute("data-extra");!n||n===Ha||(Ha=n,He(e.currentTarget))}function Jl(e,n){return Mo?n:`${Rl(e)} ${n}.`}function cm(e,n={},t=!1,i={}){if(!Mo)return h`<button class="link xprev-show" @click=${l=>Ah(!0,l.currentTarget)}>
      ${V("show")}<span>Show preview</span></button>`;let a=e==="timeline"?"timeline:times":e==="image"?"image:time":void 0,r=Ha!==void 0&&El(Ha)===e?Ha:a,o=r===void 0?void 0:n[r],s=e==="image"?"picture":e;return h`<div class="xprev">
    <span class="well">${dh(e,r,t,i)}</span>
    <span class="xprev-t">
      <b>${r===void 0?"Preview":ch(r)}</b>
      <span>${r===void 0?`Point at a ${e==="chart"?"switch":"button"} below to see what it adds to the ${s}.`:Rl(r)}</span>
      ${o?h`<span class="xprev-why">${o}</span>`:f}
    </span>
    <button class="icon xprev-hide" title="Hide the preview" aria-label="Hide the preview"
      @click=${l=>Ah(!1,l.currentTarget)}>${V("hide")}</button>
  </div>`}function Zl(e,n,t){return h`<div class="chart-numbers">${Zp(n,a=>a.el.payload.id,({el:a,lead:r,title:o,kind:s})=>{let l=a.payload.id,d=s.toLowerCase();return h`
    <div class="num-row">
      <details class="num-item"
        @pointerenter=${()=>e.peekLayer(l,!0)}
        @pointerleave=${()=>e.peekLayer(l,!1)}>
        <summary class="num-pick" title=${`Show the settings for this ${d}`}>
          <span class="num-lead">${r}</span>
          <span class="num-text"><span class="num-title">${o}</span><span class="num-kind">${s}</span></span>
          <span class="chev">${V("chevron")}</span>
        </summary>
        <div class="num-body">
          ${_w(e,a)}
          <div class="chips"><button class="small" title=${`Select this ${d} to see all of its settings`}
            @click=${()=>e.selectLayer(l)}><span>More settings</span></button></div>
        </div>
      </details>
      <button class="icon ${t.danger?"danger":""}" title=${t.label(d)} aria-label=${t.label(d)}
        @click=${()=>{e.peekLayer(l,!1),t.run(l)}}>${V(t.icon)}</button>
    </div>`})}</div>`}function _w(e,n){let t=n.payload.id,i=`quick-${t}`,a=e.activeFamily,r=(c,u)=>e.update(p=>{let m=p.elements.find(g=>g.payload.id===t);m&&c(m)},`${i}-${u}`),o=Re(n.kind).payload,s=ii(n),l=s===void 0?f:be("Colour",s,c=>r(u=>{ii(u)!==void 0&&(u.payload.colorSlot.baseColorHex=c??"#FFFFFF")},"colour"),!1,o.colorSlot?.baseColorHex??"#FFFFFF"),d=n.payload.chartAnchor;switch(n.kind){case"text":{let c=n.payload.value.kind;return h`
        ${c.kind==="chartStat"?Se("Number",c.stat,[...bt],u=>r(p=>{p.kind==="text"&&p.payload.value.kind.kind==="chartStat"&&(p.payload.value={...p.payload.value,kind:{...p.payload.value.kind,stat:u}})},"stat")):d||lt(n.payload)?f:le(e,n.payload.value,u=>r(p=>{p.kind==="text"&&(p.payload.value=u)},"value"),{showResolved:!0,label:n.payload.countdown?"Until":"Text",key:`${i}-value`})}
        ${d&&d.place!=="through"?Hh(e,t,d,r):f}
        <div class="grid2">
          ${xn(e,n,a,"Font size",{step:1,min:4,def:o.fontSize})}
          ${n.payload.countdown||lt(n.payload)?f:l}
        </div>`}case"icon":return h`
        ${d?Hh(e,t,d,r):le(e,n.payload.symbol,c=>r(u=>{u.kind==="icon"&&(u.payload.symbol=c)},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${i}-symbol`,setSymbolPath:c=>r(u=>{u.kind==="icon"&&(c?u.payload.path=c:delete u.payload.path)},"symbol")})}
        <div class="grid2">
          ${xn(e,n,a,"Icon size",{step:1,min:4,def:o.size})}
          ${l}
        </div>`;case"shape":return n.payload.kind!=="line"?h`
          <div class="grid2">
            ${n.payload.kind==="roundedRectangle"?ae("Corner radius",n.payload.cornerRadius,c=>r(u=>{u.kind==="shape"&&(u.payload.cornerRadius=c??6)},"radius"),{step:.5,min:0,def:o.cornerRadius,unit:"pt"}):f}
            ${l}
          </div>`:h`
        ${d?om(e,d,i):f}
        <div class="grid2">
          ${ae("Thickness",n.payload.thickness,c=>r(u=>{u.kind==="shape"&&(u.payload.thickness=c??1)},"thick"),{step:.5,min:.5,def:o.thickness,unit:"pt"})}
          ${l}
        </div>`;case"gauge":{let c=n.payload;return h`
        ${le(e,c.value,u=>r(p=>{p.kind==="gauge"&&(p.payload.value=u)},"value"),{showResolved:!0,label:"Reading",key:`${i}-value`})}
        <div class="grid2">
          ${c.style==="dots"?f:xn(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"chart":{let c=n.payload;return h`
        ${le(e,c.value,u=>r(p=>{p.kind==="chart"&&(p.payload.value=u)},"value"),{label:"Readings",noShare:!0,key:`${i}-value`})}
        ${ie("Style",c.style,Uh,u=>r(p=>{p.kind==="chart"&&(p.payload.style=u)},"style"),{def:o.style})}
        <div class="grid2">
          ${c.style==="bars"?f:xn(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"timeline":return h`
        ${le(e,n.payload.value,c=>r(u=>{u.kind==="timeline"&&(u.payload.value=c)},"value"),{label:"States",noShare:!0,key:`${i}-value`})}`;case"image":{let c=n.payload;return h`
        ${ie("Source",c.source,[["camera","Camera"],["entityPicture","Entity picture"]],u=>r(p=>{p.kind==="image"&&(p.payload.source=u)},"source"),{def:o.source})}
        ${ie("Picture",c.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],u=>r(p=>{p.kind==="image"&&(p.payload.contentMode=u)},"mode"),{def:o.contentMode})}`}case"tap":return Xl(e,n.payload,(c,u)=>r(p=>{p.kind==="tap"&&c(p.payload)},u??"action"),i);case"chartTimes":{let c=n.payload;return h`
        ${ai("Times",c.timeLabelCount,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.timeLabelCount=Math.max(0,Math.min(Bn,Math.round(u))))},"count"),{min:0,max:Bn,step:1,def:o.timeLabelCount,format:u=>u<=0?"None":String(Math.round(u)),range:!1})}
        <div class="grid2">
          ${ae("Time size",c.labelSize,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelSize=Math.min(ln,Math.max(sn,u??it)))},"size"),{step:.5,min:sn,max:ln,def:o.labelSize,unit:"pt"})}
          ${be("Time colour",c.labelColorHex,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelColorHex=u??at)},"colour"),!1,o.labelColorHex)}
        </div>`}case"imageTime":return h``;case"chartDots":{let c=n.payload,u=e.config.elements.find(g=>g.payload.id===c.chart),p=u?.kind==="chart"?_e(e.config,a,u).size??u.payload.lineWidth:void 0,m=p===void 0?void 0:Math.round(p*18)/10;return h`
        ${ie("Dots",c.dots,Gh,g=>r(y=>{y.kind==="chartDots"&&(y.payload.dots=g)},"mode"),{def:"auto"})}
        <div class="grid2">
          ${ae("Dot size",c.size??m,g=>r(y=>{if(y.kind!=="chartDots")return;let b=gt(g);b===void 0||b===m?delete y.payload.size:y.payload.size=b},"size"),{step:.5,min:1,max:12,...m===void 0?{}:{def:m},unit:"pt"})}
          ${Ul("Dot colour",c.colorHex,"Series colour",g=>r(y=>{y.kind==="chartDots"&&(g===void 0?delete y.payload.colorHex:y.payload.colorHex=g)},"colour"))}
        </div>`}case"chartGrid":{let c=n.payload;return h`
        <div class="grid2">
          ${ae("Lines",c.lines,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.lines=Pn(u??an))},"lines"),{step:1,min:1,max:4,def:an})}
          ${ae("Thickness",c.thickness,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.thickness=Nn(u??nn))},"thick"),{step:.25,min:lr,max:dr,def:nn,unit:"pt"})}
        </div>
        ${be("Colour",c.colorHex,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.colorHex=u??Pt)},"colour"),!1,Pt)}`}default:return h`${l}`}}function Hh(e,n,t,i){let a=xt.filter(([r])=>Nt(r)||r===t.at);return h`
    <div class="grid2">
      ${Se("Reading",t.at,a,r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.at=r)},"at"))}
      ${Se("Sits",t.place,ur.filter(([r])=>r!=="through"),r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.place=r)},"place"))}
    </div>`}function Pw(e,n,t){if(n.kind==="tap")return f;let i=n.payload.id,a=Ye(e.config,i)[0],r=(s,l)=>e.update(d=>{let c=d.elements.find(u=>u.kind==="tap"&&u.payload.attachedTo===i);c&&s(c.payload)},l?`${t}-${l}`:void 0),o=Fs(e.config,n);return h`
    ${Ve("Tappable",a!==void 0,s=>e.update(l=>{s?Tr(l,i):Er(l,i)}))}
    ${a?h`<div class="value-editor">
          ${Xl(e,a.payload,r,`${t}-attached`)}
          <div class="field"><span>Tap area</span>
            <div class="chips">
              <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
                title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
                @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide":"Show"}</button>
              ${vr(a.payload.outset)?f:h`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                    @click=${()=>r(s=>{s.outset={...bs}})}>${V("reset")}</button>`}
            </div>
          </div>
        </div>
        ${Fw(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:h`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Dt(o)}</b>.</div>`}`}function Fh(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function Nw(e){return e===void 0?"\u25C6":e.includes("up")?"\u25B2":e.includes("down")?"\u25BC":e.startsWith("circle")?"\u25CF":"\u25C6"}function Fe(e,n){return e.payload.name?e.payload.name:um(e,n)}function zw(e){let n=e.trim();return n===""?void 0:n}function um(e,n){let t=e.payload.chartAnchor;if(t!==void 0){let i=xt.find(([a])=>a===t.at)?.[1]??"Reading";return t.place==="through"?`${i} line`:`${i} marker`}switch(e.kind){case"text":return Fh(Me(e.payload.value,n));case"icon":return Fh(Me(e.payload.symbol,n));case"gauge":return Me(e.payload.value,n);case"chart":return Me(e.payload.value,n);case"timeline":return Me(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let i=e.payload.entity;return i.displayName||i.entityId||(e.payload.source==="camera"?"camera":"picture")}case"tap":{let i=e.payload.action,a="entityId"in i?i.displayName||i.entityId:i.type==="callService"?[i.serviceDomain,i.serviceName].filter(r=>r!=="").join("."):i.type==="openPage"&&e.payload.openPageName||"";return a?`${i.type} \xB7 ${a}`:i.type}case"chartTimes":return"Clock times";case"chartDots":return"Reading dots";case"chartGrid":return"Grid lines";case"imageTime":return"Timestamp"}}function pm(e,n){let t=ct(e.config,n.id),i=me(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(d=>d.id===n.id);l&&r(l)},o?`group-${n.id}-${o}`:void 0);return Te(e,"content","Group",h`
    ${Ae("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${Ve("Move as one",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="shown-head">Layers <span class="shown-count">${t.length}</span></div>
    ${Zl(e,t.map(r=>({el:r,lead:V(r.kind),title:Fe(r,i),kind:fn[r.kind]})),{icon:"ungroup",label:r=>`Take this ${r} out of the group`,run:r=>e.update(o=>sa(o,r,void 0))})}
    <div class="row-acts">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>vi(r,n.id))}>Ungroup</button>
    </div>
    <div class="hint">Click a row to open its main settings here. More settings selects that layer for the rest.
      The button beside a row takes that layer out of the group and keeps it on the face.</div>`,{color:J.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function hm(e,n){if(n==="inline")return Dw(e);let t=e.config.perFamily[n];if(!t)return h`<div class="hint">No settings stored for ${ne(n)} yet.</div>
      <button class="small" @click=${()=>e.update(s=>{s.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${ne(n)} settings</button>`;let i=(s,l)=>e.update(d=>s(d.perFamily[n]),l?`fam-${n}-${l}`:void 0),a=Eo(e.config,n),r=t.backgroundColorHex?Le(t.backgroundColorHex):"transparent",o=t.borderColorHex?`${t.borderWidth} pt ${Le(t.borderColorHex)} border`:"no border";return h`
    ${Te(e,"look",`${ne(n)} shape`,h`
      ${be("Background (blank = transparent)",t.backgroundColorHex,s=>i(l=>{s===void 0?delete l.backgroundColorHex:l.backgroundColorHex=s},"bg"),!0,null)}
      <div class="fgroup">
      ${be("Border colour",t.borderColorHex,s=>i(l=>{s===void 0?delete l.borderColorHex:l.borderColorHex=s},"border"),!0,null)}
      ${ae("Border width",t.borderWidth,s=>i(l=>{l.borderWidth=s??2},"bw"),{step:.5,min:0,def:2,unit:"pt"})}
      </div>`,{color:J.look,icon:"shape",summary:`${r} \xB7 ${o}`,...t.backgroundColorHex!==void 0||t.borderColorHex!==void 0||t.borderWidth!==2?{reset:()=>i(s=>{delete s.backgroundColorHex,delete s.borderColorHex,s.borderWidth=2},"reset-look")}:{}})}
    ${n==="corner"?Te(e,"corner","Corner content",Ow(e,t,i),{color:J.content,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas",...t.curvedText!==void 0||t.bezelText!==void 0||t.bezelGauge!==void 0?{reset:()=>i(s=>{delete s.curvedText,delete s.bezelText,delete s.bezelGauge},"reset-corner")}:{}}):f}
    ${Te(e,"states","Shape states",xm(e,t.rules,"layout",s=>s.perFamily[n]?.rules,`rules-${n}`),{color:J.states,icon:"states",summary:va(t.rules).replace(/\.$/,""),...t.rules.length>0?{reset:()=>i(s=>{s.rules=[]},"reset-states")}:{}})}
    ${Te(e,"placements","Layers",h`
      <div class="hint keep">${a===0?`Nothing is on the ${ne(n)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`:`${a} layer${a===1?" is":"s are"} on the ${ne(n)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,{color:J.position,icon:"place",summary:a===0?"Nothing on it":`${a} layer${a===1?"":"s"}`})}`}function Dw(e){let n=e.config.inline;if(!n)return h`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=me(e);return h`
    ${Te(e,"content","Inline text",h`
      ${Ae("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${le(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${Yl(e,n.countdown===!0,n.value,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}`,{color:J.content,icon:"text",summary:Be(`${n.label?`${n.label}: `:""}${Me(n.value,i)}`,48)})}
    ${Te(e,"symbol","Symbol",h`
      ${Vh(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="field readout"><span>On the face</span><span class="readout-v">${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</span></div>`,{color:J.look,icon:"icon",summary:n.symbol||"None"})}`}function Ow(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return h`
    <div class="fgroup">
    ${ie("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=G("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?h`
      ${le(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${be("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    </div>
    <div class="fgroup">
    ${ie("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=G("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:G("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?h`
      ${le(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${Yl(e,n.bezelCountdown===!0,n.bezelText,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${a==="gauge"&&n.bezelGauge?Bw(e,n.bezelGauge,t):f}
    </div>`}function Bw(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return h`
    ${le(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${ae("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${ae("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${be("Arc colour (min end)",i[0],a(0))}
    ${be("Arc colour (middle)",i[1],a(1))}
    ${be("Arc colour (max end)",i[2],a(2))}
    ${Ve("End labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let s=o.bezelGauge;r?(s.minLabel=G(String(s.minValue)),s.maxLabel=G(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${n.minLabel?le(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${n.maxLabel?le(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var tC=se.map(e=>[e,ne(e)]),Ql={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},Vw=Object.keys(Ql),xo=["color","text","fontSize","fontWeight","visibility"];function Gw(e,n=!1){let t=da[e].filter(i=>!n||xo.includes(i));return Vw.filter(i=>t.includes(Oe[i]))}function mm(e,n,t,i){let a=n!==void 0&&!e.some(r=>r.id===n);return h`<label class="field"><span>Changes</span>
      <select @change=${r=>i(r.target.value,r.target)}>
        ${kw(e,n,t).map(([r,o])=>h`<option value=${r} ?selected=${r===(n??"")}>${o}</option>`)}
      </select></label>
    ${a?h`<div class="hint warn">The part this changed has been removed, so it changes nothing. Pick another part or Whole text.</div>`:f}`}var Uw={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function co(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function Be(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function fm(e){if(!e||Pe(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.duration&&n.push("as a duration"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function Me(e,n){return`${Pa(e,n)}${fm(e.format)}`}function Pa(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${Be(t.value,40)}"`:"(empty)";case"entityState":return co(t,n);case"entityAttribute":return t.attribute?`${co(t,n)} \xB7 ${t.attribute}`:co(t,n);case"entityAge":return`age of ${co(t,n)}`;case"aggregate":return Kw(t.aggregate);case"time":return Uw[t.timeField];case"dataAge":return"data age";case"jinja":return t.value?`template ${Be(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(bt.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Pa(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function Kw(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function Ia(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function Ww(e,n,t,i,a,r){let o=(s,l)=>e.update(d=>{let c=i(d);c&&s(c)},l?`${a}-${l}`:void 0);return h`
    ${n.length===0?h`<div class="hint keep">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:f}
    ${n.map((s,l)=>jw(e,s,l,n.length,t,o,`${a}-${s.id}`,r))}
    <div class="adders"><button class="small" @click=${()=>o(s=>{s.push(ca())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function jw(e,n,t,i,a,r,o,s){let l=e.liveBranch(n),d=e.forced.get(n.id)??"live",c=m=>d==="live"?m==="live":d==="otherwise"?m==="otherwise":d.caseId===m,u=(m,g)=>r(y=>{let b=y.find($=>$.id===n.id);b&&m(b)},g),p=s!==void 0&&n.partId!==void 0;return h`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(m=>Ia(m,t,t-1))}>${V("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(m=>Ia(m,t,t+1))}>${V("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(m=>{let g=m.findIndex(y=>y.id===n.id);g>=0&&m.splice(g,1)})}>${V("delete")}</button>
    </div>
    ${s===void 0?f:mm(s,n.partId,me(e),m=>u(g=>{m?g.partId=m:delete g.partId}))}
    <div class="field"><span>Preview</span>
      <div class="branches">
        <button class=${c("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
        ${n.cases.map((m,g)=>h`<button class="${c(m.id)?"active":""} ${l===m.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:m.id})}>Case ${g+1}</button>`)}
        ${n.otherwise?h`<button class="${c("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:f}
      </div>
    </div>
    ${n.cases.map((m,g)=>qw(e,m,g,n,a,u,`${o}-${m.id}`,p))}
    <div class="adders"><button class="small" @click=${()=>u(m=>{m.cases.push(Os())})}>+ case</button></div>
    ${Ve("Otherwise",n.otherwise!==void 0,m=>u(g=>{m?g.otherwise=g.otherwise??[]:delete g.otherwise}))}
    ${n.otherwise?h`<div class="case-box otherwise">
          <div class="hint keep">${l==="otherwise"?h`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${gm(e,n.otherwise,a,m=>u(g=>{g.otherwise&&m(g.otherwise)}),`${o}-otherwise`,p)}
        </div>`:f}
  </div>`}function qw(e,n,t,i,a,r,o,s=!1){let l=(c,u)=>r(p=>{let m=p.cases.find(g=>g.id===n.id);m&&c(m)},u),d=e.liveBranch(i)===n.id;return h`<div class="case-box ${d?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${d?h` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(c=>Ia(c.cases,t,t-1))}>${V("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(c=>Ia(c.cases,t,t+1))}>${V("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(c=>{let u=c.cases.findIndex(p=>p.id===n.id);u>=0&&c.cases.splice(u,1)})}>${V("delete")}</button>
    </div>
    <div class="row-inline">
      ${ie("When",n.when.join,[["all","All of these are true"],["any","Any of these is true"]],c=>l(u=>{u.when.join=c}))}
    </div>
    ${n.when.tests.length===0?h`<div class="hint keep">No tests: this case always matches.</div>`:f}
    ${n.when.tests.map((c,u)=>Yw(e,c,u,p=>l(m=>{let g=m.when.tests.find(y=>y.id===c.id);g&&p(g)}),()=>l(p=>{p.when.tests=p.when.tests.filter(m=>m.id!==c.id)}),`${o}-${c.id}`))}
    <div class="adders">
      <button class="small" @click=${()=>l(c=>{c.when.tests.push(Ds())})}>+ test</button>
      <select class="adder" @change=${c=>{let u=c.target,p=u.value;if(u.value="",!p)return;let m=rh(p,eh(e.hass?.states));l(g=>{g.when.tests.push(...m)})}}>
        <option value="">+ preset…</option>
        ${ih.map(c=>h`<option value=${c.kind} title=${c.hint}>${c.label}</option>`)}
      </select>
    </div>
    <div class="hint keep" style="margin-top:8px">Then:</div>
    ${gm(e,n.then,a,c=>l(u=>c(u.then)),`${o}-then`,s)}
  </div>`}function Yw(e,n,t,i,a,r){let o=(u,p)=>i(u,p?`${r}-${p}`:void 0),s=n.comparison,l=jn(s.kind),d=e.evaluateTest(n),c=f;switch(l){case"value":c=le(e,s.value??G(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":c=h`${le(e,s.value??G(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${le(e,s.upper??G(""),u=>o(p=>{p.comparison.upper=u},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":c=h`${Ae("Pattern",s.pattern??"",u=>o(p=>{p.comparison.pattern=u},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!Xw(s.pattern)?h`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"times":c=h`<div class="row-inline">
          ${Ih(e,"From",s.value??G("22:00"),u=>o(p=>{p.comparison.value=u},"rhs"),`${r}-rhs`)}
          ${Ih(e,"To",s.upper??G("06:00"),u=>o(p=>{p.comparison.upper=u},"upper"),`${r}-upper`)}
        </div>
        <div class="hint">The start is included and the end is not. An end earlier than the start wraps midnight, so 22:00 to 06:00 is the night. Equal times match nothing.</div>`;break;case"options":c=Jw(n.value)?Zw(s.options??[],u=>o(p=>{p.comparison.options=Cl(u)},"options")):Ae("Options (comma separated)",(s.options??[]).join(", "),u=>o(p=>{p.comparison.options=u.split(",").map(m=>m.trim()).filter(Boolean)},"options"));break;case"none":break}return h`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${V("delete")}</button>
    </div>
    ${s.kind==="isStale"?h`<div class="hint keep">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:le(e,n.value,u=>o(p=>{p.value=u},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${Se("Comparison",s.kind,nu.map(u=>[u,Fi[u]]),u=>o(p=>{p.comparison=Bs(p.comparison,u)}))}
    ${c}
  </div>`}function Xw(e){try{return new RegExp(e),!0}catch{return!1}}function Ih(e,n,t,i,a){if(t.kind.kind!=="literal")return le(e,t,i,{showResolved:!0,label:n,key:a});let r=t.kind.value,o=Wn(r)??"";return h`<label class="field"><span>${n}</span>
    <input type="time" .value=${o}
      @input=${ke(s=>i({...t,kind:{kind:"literal",value:s}}))} />
    ${r!==""&&o===""?h`<div class="hint warn">"${r}" is not a 24-hour HH:MM time. The test stays false until it is.</div>`:f}</label>`}function Jw(e){return e.kind.kind==="time"&&e.kind.timeField==="weekday"}function Zw(e,n){let t=nh(e),i=a=>n(t.includes(a)?t.filter(r=>r!==a):[...t,a]);return h`<div class="field seg-field"><span>Days</span>
    <div class="seg wide" role="group" aria-label="Days">
      ${th.map((a,r)=>h`<button type="button" role="checkbox" aria-checked=${t.includes(r)?"true":"false"}
        class=${t.includes(r)?"on":""} @click=${()=>i(r)}>${a}</button>`)}
    </div></div>`}function gm(e,n,t,i,a,r=!1){let o=Gw(t,r);return h`
    ${n.length===0?h`<div class="hint keep">No changes.</div>`:f}
    ${n.map((s,l)=>Qw(e,s,l,t,(d,c)=>i(u=>{u[l]&&d(u[l])},c?`${a}-${l}-${c}`:void 0),()=>i(d=>{d.splice(l,1)}),`${a}-${l}`,r))}
    <select class="adder" @change=${s=>{let l=s.target,d=l.value;l.value="",d&&i(c=>{c.push(qn(d))})}}>
      <option value="">+ change…</option>
      ${o.map(s=>h`<option value=${s}>${Ql[s]}</option>`)}
    </select>`}var ym=["setColor","setBorderColor","setBackgroundColor"];function Qw(e,n,t,i,a,r,o,s=!1){let l=!da[i].includes(Oe[n.kind]),d=s&&!l&&!xo.includes(Oe[n.kind]);return h`<div class="change-box">
    <div class="rule-head">
      <span>${Ql[n.kind]}${l?h` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:d?h` <span class="no">(ignored by a part)</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${V("delete")}</button>
    </div>
    ${d?h`<div class="hint keep">A part only takes colour, text, size, weight, hide and show. Pick Whole text to use this change.</div>`:f}
    ${bm(e,n,a,o)}
  </div>`}function bm(e,n,t,i){let a=Ar(n.kind),r=f;if(a==="value"){let o=n.value??G("");if(ym.includes(n.kind)){let s=o.kind.kind==="literal";r=h`${s?be("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>t(d=>{d.value=G(l??"#FFFFFF")},"color")):le(e,o,l=>t(d=>{d.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:G("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?f:h`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=le(e,o,s=>t(l=>{l.value=s},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1,unit:"\xB0"}:n.kind==="setFontSize"||n.kind==="setBorderWidth"?{step:.5,min:0,unit:"pt"}:{step:.5,min:0},s=n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Angle":n.kind==="setFontSize"?"Size":n.kind==="setBorderWidth"?"Width":"Value";r=ae(s,n.number??0,l=>t(d=>{d.number=l??0},"number"),o)}else a==="weight"&&(r=ie("Weight",n.weight??"regular",_i,o=>t(s=>{s.weight=o})));return r}var Vl=new Set,uo=new Map,po=new Map,Lh=new Map;function xm(e,n,t,i,a,r,o){let s=wl(n);return!s.ok||Vl.has(a)?h`
      <div class="states-switch">
        <button class="link" ?disabled=${!s.ok} title=${s.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${d=>{Vl.delete(a),He(d.target)}}>Show as table</button>
        ${s.ok?f:h`<span class="hint keep">${s.reason}</span>`}
      </div>
      ${Ww(e,n,t,i,a,o)}`:ev(e,s.table,n[0],t,i,a,r,o)}function ev(e,n,t,i,a,r,o,s){let l=(H,X)=>e.update(x=>{let S=a(x);S&&H(S)},X?`${r}-${X}`:void 0),d=n.value??Lh.get(r)??o,c=n.rows.length===0,u=n.numberMode||c&&d!==void 0&&!Vp(d)&&tv(e.resolve(d)),p=da[i],m=uo.get(r)??new Set,g=n.columns.length===0&&m.size===0?[Bp[i]]:[],y=Hp(n.columns,[...m,...g.filter(H=>H!==void 0)],p),b=lo.get(r),$=t?t.partId:s?.some(H=>H.id===b)?b:void 0,k=s!==void 0&&$!==void 0,v=k?p.filter(H=>xo.includes(H)):p,C=k?y.filter(H=>!xo.includes(H)):[],R=(H,X)=>{if(!t){H?lo.set(r,H):lo.delete(r),He(X);return}l(x=>{let S=x[0];S&&(H?S.partId=H:delete S.partId)})},M=t?e.liveBranch(t):"none",A=t?e.forced.get(t.id)??"live":"live",F=H=>A!=="live"&&(A==="otherwise"?H==="otherwise":A.caseId===H),E=H=>{t&&e.setForced(t.id,F(H)?"live":H==="otherwise"?"otherwise":{caseId:H})},N=H=>{Lh.set(r,H),n.rows.length!==0&&l(X=>zp(X,H),"lhs")},j=()=>{lo.delete(r),l(H=>{Pp(H,d??G(""),u),$!==void 0&&H[0]&&H[0].partId===void 0&&(H[0].partId=$)})},K=n.rows.map((H,X)=>Ph(e,{key:`${r}-${H.caseId}`,label:Op(H.comparison,x=>Me(x,me(e))),columns:y,changes:H.changes,live:M===H.caseId,forced:F(H.caseId),onForce:()=>E(H.caseId),when:ov(e,H.comparison,`${r}-${H.caseId}`,(x,S)=>l(_=>{let B=_[0]?.cases.find(W=>W.id===H.caseId)?.when.tests[0];B&&x(B.comparison)},S&&`${H.caseId}-${S}`)),updChanges:(x,S)=>l(_=>{let B=_[0]?.cases.find(W=>W.id===H.caseId);B&&x(B.then)},S&&`${H.caseId}-${S}`),acts:h`
      <button class="icon" title="Move up" ?disabled=${X===0} @click=${()=>l(x=>vl(x,X,X-1))}>${V("up")}</button>
      <button class="icon" title="Move down" ?disabled=${X===n.rows.length-1} @click=${()=>l(x=>vl(x,X,X+1))}>${V("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(x=>Np(x,H.caseId))}>${V("delete")}</button>`})),q=n.otherwise===void 0?f:Ph(e,{key:`${r}-otherwise`,label:"Otherwise",columns:y,changes:n.otherwise,live:M==="otherwise",forced:F("otherwise"),onForce:()=>E("otherwise"),when:h`<span class="when-otherwise">Otherwise</span>`,updChanges:(H,X)=>l(x=>{let S=x[0]?.otherwise;S&&H(S)},X),acts:h`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(H=>kl(H,!1))}>${V("close")}</button>`}),O=po.get(r),z=nv.filter(H=>v.includes(H)&&!y.includes(H));return h`
    <div class="states">
      ${le(e,d??G(""),N,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${d===void 0?h`<div class="hint keep">Choose what these states look at.</div>`:f}
      ${s===void 0?f:mm(s,$,me(e),R)}
      <div class="states-scroll"><table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${y.map(H=>h`<th>
              <span>${Ct[H]}</span>
              <button class="icon" title=${`Remove the ${Ct[H]} column`}
                @click=${X=>{po.set(r,H),He(X.target)}}>${V("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${K}
          ${q}
          ${n.rows.length===0&&n.otherwise===void 0?h`<tr><td class="empty-row" colspan=${y.length+2}>${Ip(i)}</td></tr>`:f}
        </tbody>
      </table></div>
      ${C.length===0?f:h`<div class="hint warn">A part ignores ${Ro(C.map(H=>Ct[H]))}. Pick Whole text to use ${C.length===1?"it":"them"}.</div>`}
      ${O===void 0?f:h`<div class="hint warn confirm-row">
        Remove the ${Ct[O]} column? Its ${_h(n,O)} value${_h(n,O)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${H=>{po.delete(r),uo.get(r)?.delete(O),He(H.target),l(X=>Dp(X,O))}}>Remove</button>
        <button class="small" @click=${H=>{po.delete(r),He(H.target)}}>Cancel</button>
      </div>`}
      <div class="states-add">
        <button class="small" title="Add a row to the table: a value to match under When, and the look it gets" @click=${j}>${V("plus")}<span>Add a state</span></button>
        <span class="states-add-note">${Jr(i).state}</span>
        ${n.otherwise===void 0?h`<button class="small" title="Add an Otherwise row at the bottom of the table" @click=${()=>l(H=>kl(H,!0))}>${V("plus")}<span>Add otherwise</span></button>
            <span class="states-add-note">${Jr(i).otherwise}</span>`:f}
        ${z.length===0?f:h`<select class="chip-add" title="Add a column to the table" aria-label="Change another setting" @change=${H=>{let X=H.target,x=X.value;if(X.value="",!x)return;let S=uo.get(r)??new Set;S.add(x),uo.set(r,S),He(X)}}>
          <option value="" selected>Change another setting…</option>
          ${z.map(H=>h`<option value=${H}>${Ct[H]}</option>`)}
        </select>
        <span class="states-add-note">${Jr(i).column}</span>`}
      </div>
      ${A==="live"?f:h`<div class="field"><span>Preview</span>
        <div class="row-acts"><button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button></div>
      </div>`}
      <div class="hint">${u?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${H=>{Vl.add(r),He(H.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function tv(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var nv=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function _h(e,n){let t=0;for(let i of e.rows)Xr(i.changes,n)&&(t+=1);return e.otherwise&&Xr(e.otherwise,n)&&(t+=1),t}function iv(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function Ph(e,n){return h`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{iv(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>h`<td>${av(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function av(e,n,t,i,a){let r=Xr(t,n),o=To(a);if(!r)return h`<button type="button" class="cell empty" title=${`Set ${Ct[n]} for this state`}
      @click=${d=>{i(c=>{c.push(qn(Ap[n]))}),Wh(d.target,o)}}>unchanged</button>`;let s=(d,c)=>i(u=>{let p=u.find(m=>Oe[m.kind]===n);p&&d(p)},c&&`${n}-${c}`),l=Ct[n];return h`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${rv(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${jh}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${Aa.has(o)?h`${n==="visibility"?ie("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>s(c=>{c.kind=d})):bm(e,r,s,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let u=c.findIndex(p=>Oe[p.kind]===n);u>=0&&c.splice(u,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:f}
    </div>`}function rv(e,n){if(n.kind==="hide")return h`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return h`<span class="cell-word">Shown</span>`;let t=Ar(n.kind);if(t==="number")return h`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return h`<span class="cell-word">${_i.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;let i=n.value??G(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(ym.includes(n.kind))return h`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?Le(a):Me(i,me(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return h`${r??f}<span class="cell-word">${a}</span>`}return h`<span class="cell-word">${Me(i,me(e))}</span>`}function Le(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function ov(e,n,t,i){let a=jn(n.kind),r=xl(n.kind),o=(s,l,d,c)=>lv(e,s,l,`${t}-${d}`,r,c,d==="rhs"?"Compare with":"Upper bound");return h`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${ke(s=>i(l=>{let d=Bs(l,s);l.kind=d.kind,d.value!==void 0?l.value=d.value:delete l.value,d.upper!==void 0?l.upper=d.upper:delete l.upper}))}>
      ${bl.map(s=>h`<option value=${s} ?selected=${s===n.kind}>${sv(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??G(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):f}
    ${a==="between"?h`<span class="when-and">to</span>${o(n.upper??G(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:f}
  </span>`}function sv(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return Fi[e]}}function lv(e,n,t,i,a,r,o){let s=To(i),l={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return h`<span class="rhs">
      ${le(e,n,t,{...l,compact:!0})}
    </span>`;let d=n.kind.value;return h`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${ke(c=>t({...n,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${s} title="Compare with an entity or a template instead">…</button>
    ${Kh(e,s,o,n,t,l)}
  </span>`}var Na=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:As,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"doorHistory",title:"Door history",blurb:"A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",domains:["binary_sensor","cover"],layerCount:2},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function $m(e){return Na.find(n=>n.kind===e)??Na[0]}var wm="#FF9F0A",Ao="#8E8E93",dv=["#FF453A","#FFD60A","#34C759"],Cm=["#0A84FF","#34C759","#FF9F0A"];function cv(e){return e?.attributes?.device_class==="battery"?dv:Cm}var uv={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function pv(e){let n=e.iconName?.trim();return n?{off:n,on:n}:uv[ed(e)]??{off:"circle",on:"circle.fill"}}function hv(e){switch(ed(e)){case"lock":return{kind:"equals",value:G("locked")};case"cover":case"valve":return{kind:"equals",value:G("open")};case"media_player":return{kind:"equals",value:G("playing")};default:return{kind:"isOn"}}}function ed(e){return e.domain||e.entityId.split(".")[0]||""}function $n(e){return{...e,domain:ed(e)}}function mv(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function Ni(e){return Math.round(e*1e4)/1e4}function si(e,n,t){return Math.min(t,Math.max(n,e))}function td(e,n,t){let i=Ne[e],a=si(Ni(n/i.width),0,1),r=si(Ni(t/i.height),0,1);return{x:Ni((1-a)/2),y:Ni((1-r)/2),width:a,height:r,rotationDegrees:0}}function fv(e){let n=Ne[e],t=si(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:td(e,t*1.3,t*1.3),size:t}}function gv(e){let n=Ne[e],t=si(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:td(e,n.width*.88,t*1.7),size:t}}function yv(e){let n=Ne[e],t=Math.min(n.width,n.height)*.9;return{frame:td(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function Sm(e){let n=e==="rectangular";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function bv(e){let n=Ne[e],t=si(Math.round(n.height*.2),6,14);return{frame:{x:.06,y:.56,width:.88,height:Ni(t/n.height),rotationDegrees:0}}}function xv(e){let n=Ne[e],t=si(Math.round(Math.min(n.width,n.height)*.26),8,15);return{frame:{x:.06,y:.2,width:.88,height:Ni(si(t*1.5/n.height,0,1)),rotationDegrees:0},size:t}}function wv(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function vv(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function vn(e,n,t,i){let a=i(t);n.payload.frame=a.frame,vv(n,a.size);let r=e.perFamily[t]??(e.perFamily[t]=Bt());r.placements[n.payload.id]={frame:a.frame,isHidden:!1,...a.size!==void 0?{size:a.size}:{}}}function kn(e){return Re(e)}function nd(e,n){let t={kind:{kind:"entityState",...$n(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function vm(e){let n=qn("setIcon");return n.value=G(e),n}function oi(e){let n=qn("setColor");return n.value=G(e),n}function kv(e,n){let t=ca(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...$n(e)}},a.comparison=hv(e);let r=n.on!==n.off;return i.then=r?[vm(n.on),oi(wm)]:[oi(wm)],t.otherwise=r?[vm(n.off),oi(Ao)]:[oi(Ao)],t}function $v(e){let n=ca(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...$n(e)}},i.comparison={kind:"isUnavailable"};let a=qn("setOpacity");return a.number=.35,t.then=[a],n}function km(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function Cv(e,n,t=Cm){let i=n.max-n.min,a=km(n.min+i/3),r=km(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:G(a)},changes:[oi(t[0])]},{comparison:{kind:"between",value:G(a),upper:G(r)},changes:[oi(t[1])]},{comparison:{kind:"greaterThan",value:G(r)},changes:[oi(t[2])]}];return Fp(nd(e),o)}function Sv(e,n,t){let i=kn("icon"),a=pv(n);return i.payload.symbol=G(a.off),i.payload.colorSlot.baseColorHex=Ao,i.payload.rules=[kv(n,a)],vn(e,i,t.family,fv),e.elements.push(i),Tr(e,i.payload.id,{type:"toggleEntity",...$n(n)}),i.payload.id}function Tv(e,n,t){let i=kn("text");return i.payload.value=nd(n,t.state),i.payload.rules=[$v(n)],vn(e,i,t.family,gv),e.elements.push(i),i.payload.id}function Ev(e,n,t){let i=kn("gauge");i.payload.value=nd(n);let a=mv(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[Cv(n,a,cv(t.state))],vn(e,i,t.family,yv),e.elements.push(i),i.payload.id}function Rv(e,n,t){let i=kn("chart");return i.payload.value={kind:{kind:"entityState",...$n(n)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",vn(e,i,t.family,Sm),e.elements.push(i),i.payload.id}function Mv(e,n,t){let i=kn("chart");return i.payload.value={kind:{kind:"entityState",...$n(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",vn(e,i,t.family,Sm),e.elements.push(i),i.payload.id}function Av(e,n,t){let i=$n(n),a=kn("text");a.payload.value=G(i.displayName||i.entityId),a.payload.colorSlot.baseColorHex=Ao,vn(e,a,t.family,xv),e.elements.push(a);let r=t.state?.attributes?.device_class,o=kn("timeline");return o.payload.value={kind:{kind:"entityState",...i}},o.payload.bands=ys(i.domain,typeof r=="string"?r:void 0),vn(e,o,t.family,bv),e.elements.push(o),o.payload.id}function Hv(e,n,t){let i=kn("image");return i.payload.entity=$n(n),vn(e,i,t.family,wv),e.elements.push(i),i.payload.id}function Tm(e,n,t,i){switch(n){case"toggle":return Sv(e,t,i);case"status":return Tv(e,t,i);case"gauge":return Ev(e,t,i);case"chart":return Rv(e,t,i);case"history":return Mv(e,t,i);case"doorHistory":return Av(e,t,i);case"camera":return Hv(e,t,i)}}var Fv=/^[a-z0-9_]+\.shared_(\d+)$/;function za(e){return Fv.test(e)}function Iv(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function Mm(e,n){let i=(e.domain||n.split(".")[0]||"").toLowerCase().replace(/[^a-z0-9_]/g,"");return i===""?"entity":i}function Am(e,n){let t=new Map;for(let i of zs(e,(a,r)=>n.has(r))){if(i.entityId==="")continue;let a=t.get(i.entityId);if(!a){let r=Mm(i.ref,i.entityId),o=t.size+1;a={placeholderId:`${r}.shared_${o}`,domain:r,label:`${Iv(r.replace(/_/g," "))} ${o}`,originalId:i.entityId,where:[]},t.set(i.entityId,a)}a.where.includes(i.where)||a.where.push(i.where)}return[...t.values()]}function zi(e,n){let t=structuredClone(e),i=new Map,a=new Map;for(let r of n)i.set(r.originalId,{entityId:r.placeholderId,displayName:r.label,domain:r.domain}),a.set(r.originalId,r.placeholderId);Ns(t,r=>{let o=i.get(r.entityId);return o?{...o}:void 0}),Ci(t,r=>Is(r,a)),delete t.openPageId,delete t.openPageName,t.tapAction.type==="openPage"&&(t.tapAction={type:"none"});for(let r of t.elements)r.kind==="tap"&&(delete r.payload.openPageId,delete r.payload.openPageName,r.payload.action.type==="openPage"&&(r.payload.action={type:"none"}));return t.dataSources=[],t}function Ho(e){let n=!1;return Vt(e,t=>{let i=t.kind;if(i.kind!=="aggregate")return;let a=i.aggregate.scope;a.kind==="filter"&&a.areaIds.length+a.labelIds.length+a.floorIds.length>0&&(n=!0)}),n}function Lv(e,n="  "){let t=(i,a)=>{if(i===null||typeof i!="object")return JSON.stringify(i)??"null";let r=a+n;if(Array.isArray(i))return i.length===0?"[]":`[
${i.map(d=>r+t(d,r)).join(`,
`)}
${a}]`;let o=i,s=Object.keys(o).filter(d=>o[d]!==void 0).sort();return s.length===0?"{}":`{
${s.map(d=>`${r}${JSON.stringify(d)}: ${t(o[d],r)}`).join(`,
`)}
${a}}`};return t(e,"")}function Da(e,n,t=[]){let i=n==="share"?zi(e,t):e,a=xi(i);return delete a.id,delete a.slotIndex,n==="share"&&delete a.hidden,a.dataSources=[],`${Lv(a)}
`}function Hm(e){let t=(e.name===""?"Complication":e.name).split(/[^\p{L}\p{N}]+/u).filter(i=>i!=="").join("-");return`${t===""?"Complication":t}.json`}var _v="There is nothing to read here. Paste a complication first.",Pv="This is not valid JSON. Check for a missing brace or a stray comma.",Nv="This is valid JSON but not a complication. A complication starts with { and ends with }.",zv="This does not look like a complication.",Em="It was made by a newer panel, so update the Wrist Assistant integration before importing it.",Dv="00000000-0000-4000-8000-000000000000";function Ov(e){let n=/^([A-Za-z]+) is required$/.exec(e);return n?`It is missing "${n[1]}".`:e}function Fm(e,n){let t=e.trim();if(t==="")return{ok:!1,error:_v};let i;try{i=JSON.parse(t)}catch{return{ok:!1,error:Pv}}if(typeof i!="object"||i===null||Array.isArray(i))return{ok:!1,error:Nv};let a=i,r=a.schemaVersion;if(typeof r=="number"&&r>n)return{ok:!1,error:`This complication is schema v${r}; this panel understands up to v${n}. ${Em}`};let o={...a,id:Dv,slotIndex:0},s;try{s=bi(o)}catch(d){let c=d instanceof rt||d instanceof Error?d.message:String(d);return{ok:!1,error:`${zv}

${Ov(c)}`}}delete s.hidden;let l=kr(a);if(l.length>0){let d=l.slice(0,3).join(", "),c=l.length>3?`, and ${l.length-3} more`:"";return{ok:!1,error:`This complication uses keys this panel does not know: ${d}${c}. ${Em}`}}return{ok:!0,config:s,raw:i}}function id(e,n){let t=new Set;for(let o of Object.keys(n)){let s=o.split(".")[0]??"";s!==""&&t.add(s)}let i=o=>Object.prototype.hasOwnProperty.call(n,o),a=new Map,r=zs(e,(o,s)=>za(o)||t.has(s));for(let o of r){if(o.entityId==="")continue;let s=za(o.entityId);if(!s&&i(o.entityId))continue;let l=a.get(o.entityId);l||(l={entityId:o.entityId,domain:Mm(o.ref,o.entityId),label:o.ref.displayName||o.entityId,where:[],required:s},a.set(o.entityId,l)),l.label===o.entityId&&o.ref.displayName!==""&&(l.label=o.ref.displayName),l.where.includes(o.where)||l.where.push(o.where)}return[...a.values()]}function ad(e,n){let t=structuredClone(e);Ns(t,a=>{let r=n.get(a.entityId);if(r)return{entityId:r.entityId,displayName:r.displayName,domain:r.domain||r.entityId.split(".")[0]||""}});let i=new Map;for(let[a,r]of n)i.set(a,r.entityId);return Ci(t,a=>Is(a,i)),t}function Im(e,n){let t=e.trim();if(t==="")return"";let i=a=>n.has(a.toLowerCase());if(!i(t))return t;for(let a=2;a<=99;a+=1){let r=`${t} ${a}`;if(!i(r))return r}return t}var Bv={rectangular:"Rectangular",circular:"Circular",corner:"Corner",inline:"Inline"};function Lm(e,n){return{layers:e.elements.length,families:Zn(e).map(t=>Bv[t]??t),slots:n.filter(t=>t.required).length,missing:n.filter(t=>!t.required).length}}var _m="import";function Rm(e){let n="";for(let t=0;t<e.length;t+=32768)n+=String.fromCharCode(...e.subarray(t,t+32768));return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Vv(e){if(!/^[A-Za-z0-9_-]*$/.test(e)||e.length%4===1)return;let n=e.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((e.length+3)%4);try{let t=atob(n),i=new Uint8Array(t.length);for(let a=0;a<t.length;a+=1)i[a]=t.charCodeAt(a);return i}catch{return}}async function Pm(e,n){let t=new Blob([e]).stream().pipeThrough(n);return new Uint8Array(await new Response(t).arrayBuffer())}async function Nm(e,n={}){let t=new TextEncoder().encode(e);if(n.compress!==!1&&typeof CompressionStream=="function")try{return`z${Rm(await Pm(t,new CompressionStream("gzip")))}`}catch{}return`t${Rm(t)}`}async function rd(e){let n=Vv(e.slice(1));if(!n)return;let t=new TextDecoder("utf-8",{fatal:!0});try{if(e.startsWith("t"))return t.decode(n);if(e.startsWith("z")&&typeof DecompressionStream=="function")return t.decode(await Pm(n,new DecompressionStream("gzip")))}catch{}}function zm(e,n){return`${e.split("#")[0]??e}#${_m}=${n}`}function od(e){let n=e.startsWith("#")?e.slice(1):e,t=`${_m}=`;if(!n.startsWith(t))return;let i=n.slice(t.length);return i.length>1?i:void 0}function Dm(e){let n=e.trim();if(n===""||/\s/.test(n)||n.startsWith("{"))return;let t=n.indexOf("#");return t<0?void 0:od(n.slice(t))}var sd="This share link is damaged or cut short. Ask for it again, or paste the text instead.";function ld(e){if(!e.parsed)return"Paste a complication first.";let n=e.name.trim();if(n==="")return"Give it a name first.";if(e.taken.has(n.toLowerCase()))return"A complication on this watch already has that name.";if(e.unchosen===1)return"One entity still needs choosing.";if(e.unchosen>1)return`${e.unchosen} entities still need choosing.`}function Om(e,n){return e?.ok===!0&&!n}var dd="https://wrist-assistant.com/api/gallery",Gv=["rectangular","circular","corner","inline"],cd=["weather","energy","climate","security","media","health","calendar","transport","lights","sensors","battery","other"],Bm={weather:"Weather",energy:"Energy",climate:"Climate",security:"Security",media:"Media",health:"Health",calendar:"Calendar",transport:"Transport",lights:"Lights",sensors:"Sensors",battery:"Battery",other:"Other"},fe={title:60,description:500,authorName:40,tags:5,slots:40,slotLabel:60,previews:4,shareTextBytes:64*1024,pngBytes:150*1024,bodyBytes:1024*1024},Uv=/^[a-z0-9_]+\.shared_[0-9]+$/;function Vm(e,n={}){let t=structuredClone(e),i=(a,r)=>r===void 0||r.trim()===""?a:r.trim();t.name=i(t.name,n.name);for(let a of t.groups??[])a.name=i(a.name,n.groupNames?.get(a.id));for(let a of t.values)a.name=i(a.name,n.valueNames?.get(a.id));return t}function Gm(e){return cd.includes(e)}function Um(e){return new TextEncoder().encode(e).length}function ud(e,n,t,i={}){let a=[];for(let r of t.tags)Gm(r)&&!a.includes(r)&&a.push(r);return{shareText:Da(Vm(e,{...i,name:t.title}),"share",n),title:t.title.trim(),description:t.description.trim(),authorName:t.authorName.trim(),tags:a,families:Zn(e).filter(r=>Gv.includes(r)),slots:n.map(r=>({id:r.placeholderId,label:r.label.trim()})),panelVersion:t.panelVersion}}var Kv=new Set(["id","kind","type","join","domain","domains","entityId","displayName","supportedFamilies","perFamily","fontWeight","weight","alignment","style","cornerBodyShape","function","baseline","coloring","highlight","marker","highMarker","lowMarker","scale","at","place","barCorners","curve","smoothing","dots","fillStyle","stat","source","statType","statPeriod","hourCycle","minutes","timeField","timestampCorner","contentMode","symbol","path","serviceDomain","serviceName","attachedTo","layer","chart","image","scaleFrom","groupId","partId","areaIds","labelIds","floorIds"]),Wv=/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/,jv=/^#[0-9A-Fa-f]{3,8}$/,qv=/^-?\d+(\.\d+)?$/;function li(e,n){if(n===void 0)return;let t=n.trim();t!==""&&!e.includes(t)&&e.push(t)}function Km(e,n,t={}){let i=Vm(e,t),a=zi(i,n),r=[],o=[],s=[],l=[],d=[],c=[],u=new Set,p=[],m=[],g=[];for(let R of a.elements)li(r,R.payload.name);(a.groups??[]).forEach((R,M)=>{li(o,R.name),m.push({kind:"group",id:R.id,value:R.name,original:e.groups?.[M]?.name??R.name})}),a.values.forEach((R,M)=>{li(s,R.name),g.push({kind:"shared",id:R.id,value:R.name,original:e.values[M]?.name??R.name})});for(let R of n)li(l,R.label);let y=n.map(R=>({kind:"slot",id:R.placeholderId,value:R.label,original:R.label}));Vt(a,R=>{R.kind.kind==="jinja"&&li(d,R.kind.value)}),Ci(a,(R,M)=>(M.part==="serviceData"&&li(c,R),R));let b=R=>{R?.kind.kind==="literal"&&u.add(R.kind.value.trim())},$=R=>{for(let M of R){for(let A of M.cases)for(let F of A.then)F.kind==="setIcon"&&b(F.value);for(let A of M.otherwise??[])A.kind==="setIcon"&&b(A.value)}};for(let R of a.elements)R.kind==="icon"&&b(R.payload.symbol),$(R.payload.rules);for(let R of Object.values(a.perFamily))R&&$(R.rules);let k=new Set([a.name.trim(),...r,...o,...s,...l,...d,...c,...u]),v=(R,M)=>{if(typeof R=="string"){let A=R.trim();if(A===""||k.has(A)||Kv.has(M)||M.endsWith("Hex")||Wv.test(A)||jv.test(A)||qv.test(A)||za(A))return;li(p,A);return}if(Array.isArray(R)){for(let A of R)v(A,M);return}if(R!==null&&typeof R=="object")for(let[A,F]of Object.entries(R))v(F,A)};return v(JSON.parse(Da(i,"share",n)),""),[{label:"Layer names",values:r},{label:"Group names",values:o,rows:m},{label:"Shared value names",values:s,rows:g},{label:"Slot labels",values:l,rows:y},{label:"Template text",values:d},{label:"Service data",values:c},{label:"Other text",values:p}].filter(R=>R.values.length>0)}function Yv(e,n){let t=[];for(let i of e.matchAll(/[a-z0-9_]+(?:\.[a-z0-9_]+)+/g)){let a=i.index??0,r=a>0?e[a-1]:"",o=i[0].split(".");for(let s=0;s+1<o.length;s++){if(!n.has(o[s]))continue;let l=`${o[s]}.${o[s+1]}`,d=s++;if(za(l))continue;!(d===0&&(r==="'"||r==='"')&&o.length===2)&&!t.includes(l)&&t.push(l)}}return t}function pd(e,n,t,i,a={}){let r=[],o=ud(e,n,t,a);Ho(e)&&r.push("It reads entities by area, label or floor. Those belong to your Home Assistant, so pick the entities themselves before sending it to the gallery."),o.title===""&&r.push("Give it a title."),o.title.length>fe.title&&r.push(`The title is longer than ${fe.title} characters.`),o.description.length>fe.description&&r.push(`The description is longer than ${fe.description} characters.`),o.authorName.length>fe.authorName&&r.push(`The nickname is longer than ${fe.authorName} characters.`),t.tags.length>fe.tags&&r.push(`Pick at most ${fe.tags} tags.`),t.tags.some(c=>!Gm(c))&&r.push("One of the tags is not a gallery tag."),o.families.length===0&&r.push("It has no shape the gallery can show."),o.slots.length>fe.slots&&r.push(`It reads ${o.slots.length} entities. The gallery takes at most ${fe.slots}.`);for(let c of o.slots)Uv.test(c.id)||r.push(`The gallery cannot take the slot ${c.id}, because its domain has characters other than letters and underscores.`),c.label.length>fe.slotLabel&&r.push(`The label for ${c.id} is longer than ${fe.slotLabel} characters.`);let s=Um(o.shareText);s>fe.shareTextBytes&&r.push(`It is too big for the gallery: its text is ${Math.ceil(s/1024)} KB and the limit is ${fe.shareTextBytes/1024} KB.`);let l=n.filter(c=>c.originalId!==""&&o.shareText.includes(c.originalId)),d=new Set;i&&Ci(zi(e,n),c=>{for(let u of Yv(c,i))d.add(u);return c});for(let c of l)d.add(c.originalId);return d.size>0&&r.push(`Template or service data text names ${[...d].join(", ")} in a way sharing cannot replace. Write it in quotes, like states('sensor.example'), so it becomes a slot.`),r}var Xv=["bad_json","too_large","invalid_field","schema_too_new","bad_png","rate_limited","not_found","forbidden","server_error"],Rt=class extends Error{constructor(t,i,a,r){super(a?`${t}: ${a}`:t);this.code=t;this.status=i;this.detail=a;this.retryAfter=r;this.name="GalleryError"}},Jv={shareText:"complication text",title:"title",description:"description",authorName:"nickname",tags:"tags",families:"shapes",slots:"slot labels",previews:"preview pictures",panelVersion:"panel version"};function Fo(e){if(!(e instanceof Rt))return"Something went wrong. Try again.";switch(e.code){case"rate_limited":return"That is as many uploads as the gallery takes in a day. Try again tomorrow.";case"too_large":return"It is too big for the gallery.";case"invalid_field":{let n=e.detail===void 0?void 0:Jv[e.detail.split(/[.[\s]/)[0]??""]??e.detail;return n===void 0?"The gallery did not accept one of the fields.":`The gallery did not accept the ${n}.`}case"schema_too_new":return"The gallery does not take complications made by this panel version yet.";case"bad_png":return"A preview picture could not be read. Close this and try again.";case"bad_json":return"The gallery could not read the upload. Update the Wrist Assistant integration and try again.";case"not_found":return"That upload is not in the gallery any more.";case"forbidden":return"The gallery did not accept this Home Assistant's key.";case"network":return"Could not reach the gallery. Check the connection and try again.";case"server_error":return"The gallery had a problem. Try again later."}}async function Zv(e){let n="server_error",t;try{let a=await e.json();typeof a.error=="string"&&Xv.includes(a.error)&&(n=a.error),typeof a.detail=="string"&&(t=a.detail)}catch{}e.status===429&&(n="rate_limited");let i=Number(e.headers.get("retry-after"));return new Rt(n,e.status,t,Number.isFinite(i)&&i>0?i:void 0)}async function hd(e,n,t,i,a){let r={"X-Gallery-Key":i};a!==void 0&&(r["content-type"]="application/json");let o;try{o=await e(n,{method:t,headers:r,body:a,credentials:"omit",mode:"cors"})}catch{throw new Rt("network",0)}if(!o.ok)throw await Zv(o);return o}async function Wm(e,n,t,i=dd){let a=JSON.stringify(t);if(Um(a)>fe.bodyBytes)throw new Rt("too_large",0);let o=await(await hd(e,`${i}/submissions`,"POST",n,a)).json();return{id:String(o.id??""),status:String(o.status??"pending")}}async function jm(e,n,t=dd){let a=await(await hd(e,`${t}/mine`,"GET",n)).json();return Array.isArray(a.items)?a.items:[]}async function qm(e,n,t,i=dd){await hd(e,`${i}/mine/${encodeURIComponent(t)}`,"DELETE",n)}var Ym={pending:"Waiting for review",approved:"In the gallery",rejected:"Not accepted",removed:"Removed"};var Qv=2,ek=[Qv,1.5,1];function tk(e){let n=structuredClone(e);return n.elements=n.elements.filter(t=>t.kind!=="image"&&t.kind!=="imageTime"),n}function nk(e,n,t,i){let a=new Map;for(let c of t){let u=i.entityState(c.originalId);if(!u)continue;let p={...u,entityId:c.placeholderId,iconName:""};delete p.entityPicture,a.set(c.placeholderId,p)}let r=[],o=[];Vt(e,c=>{r.push(c)}),Vt(n,c=>{o.push(c)});let s=new Map;for(let c=0;c<Math.min(r.length,o.length);c++){let u=Si(r[c],e.values),p=Si(o[c],n.values);if(u===void 0||p===void 0)continue;let m=i.templateResults.get(u);m!==void 0&&s.set(p,m)}let l=new Map,d=(c,u)=>{if(c===void 0||u===void 0)return;let p=i.historySeries.get(c);p!==void 0&&l.set(u,p)};for(let c=0;c<Math.min(e.elements.length,n.elements.length);c++){let u=e.elements[c],p=n.elements[c];u.kind==="chart"&&p.kind==="chart"?(d(wt(u.payload),wt(p.payload)),d(vt(u.payload),vt(p.payload))):u.kind==="timeline"&&p.kind==="timeline"&&d(qe(u.payload),qe(p.payload))}return{entityStates:a,templateResults:s,historySeries:l,namedValues:n.values}}async function Xm(e,n,t,i){let a=zi(e,n),r=nk(e,a,n,t),o=hn(tk(a),r),s=[];for(let l of se){let d=l,c=o[d];if(!c)continue;let u=await ik(Ai(c,{icons:i,slot:ce[d]}));if(s.push({family:l,png:u}),s.length===fe.previews)break}return s}async function ik(e){let n=document.createElement("div");Qa(e,n);let t=n.querySelector("svg");if(!t)throw new Error("nothing was drawn");let i=Number(t.getAttribute("width")),a=Number(t.getAttribute("height"));if(!(i>0)||!(a>0))throw new Error("the drawing has no size");let r=new XMLSerializer().serializeToString(t),o=await ak(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`);for(let s of ek){let l=document.createElement("canvas");l.width=Math.round(i*s),l.height=Math.round(a*s);let d=l.getContext("2d");if(!d)throw new Error("no canvas");d.drawImage(o,0,0,l.width,l.height);let c=await new Promise(u=>l.toBlob(u,"image/png"));if(c&&c.size<=fe.pngBytes)return rk(c)}throw new Error("the picture is too large")}function ak(e){return new Promise((n,t)=>{let i=new Image;i.onload=()=>n(i),i.onerror=()=>t(new Error("the drawing could not be loaded")),i.src=e})}async function rk(e){let n=new Uint8Array(await e.arrayBuffer()),t="";for(let i=0;i<n.length;i+=32768)t+=String.fromCharCode(...n.subarray(i,i+32768));return btoa(t)}var sk="wrist-assistant-panel.picker-hidden.v1:",md=(e,n)=>window.fetch(e,n),xd="wrist-assistant-gallery-nickname";function lk(){try{return window.localStorage.getItem(xd)??""}catch{return""}}function dk(e){try{e===""?window.localStorage.removeItem(xd):window.localStorage.setItem(xd,e)}catch{}}var ck=3e4,uk=500,pk=3e4,Jm="preset-entity";function Zm(e){return`import-entity-${e}`}var hk={entityId:"",displayName:"",domain:""},mk=new Map,fk={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function fd(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function gk(e){return e.kind==="family"?"look":"content"}function gd(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}function Qm(){return h`<span class="hstep" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13" /><path d="M12 6l6 6-6 6" /></svg></span>`}function yk(e){let n=w`<rect x="3" y="2" width="38" height="48" rx="11" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" />`,t=e==="rectangular"?w`<rect x="8" y="21" width="28" height="10" rx="3" fill="currentColor" />`:e==="circular"?w`<circle cx="22" cy="26" r="8" fill="currentColor" />`:e==="corner"?w`<path d="M9 18a9 9 0 0 1 9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <circle cx="11.5" cy="11.5" r="3" fill="currentColor" />`:w`<rect x="10" y="7" width="24" height="5" rx="2.5" fill="currentColor" />`;return h`<svg class="shape-art" viewBox="0 0 44 52" aria-hidden="true">${n}${t}</svg>`}var ef=300,tf=360,wd=44,vd=22,cf=[1,1.7,2.6],bk=["S","M","L"],nf=["Small","Medium","Large"];function xk(){return cf.map((e,n)=>{let t=Math.round(wd*e),i=Math.round(vd*e),a=`.layers-card.s${n}`;return`
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
`)}var af="wrist-assistant-panel.layers.v1",rf="wrist-assistant-panel.grid.v1",Wt=34,di=200,wk=720,Io=320,vk=80,kk=56,of="wrist-assistant-panel.columns.v3",yd=e=>Math.max(di,Math.min(wk,Math.round(e))),sf=e=>e.metaKey||e.ctrlKey||e.shiftKey;function $k(e,n,t){let a=e.querySelector(`g[data-element-id="${CSS.escape(n)}"]`)?.firstElementChild;if(!a||a.tagName.toLowerCase()!=="rect")return!1;let r=a.getBoundingClientRect();return t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom}var Ck=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,Sk=3,Oa=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",Cn=Oa==="Cmd"?"\u2318":"Ctrl+",bd=Oa==="Cmd"?"\u21E7":"Shift+";function lf(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-vk;if(i>=di*2+Io){let r=i-Io,o=n,s=t;if(o+s>r){let l=r/(o+s);o=Math.max(di,Math.floor(o*l)),s=Math.max(di,Math.floor(s*l));let d=o+s-r;d>0&&(o>=s?o=Math.max(di,o-d):s=Math.max(di,s-d))}return{columns:3,left:o,right:s}}let a=e-kk;return a>=di+Io?{columns:2,left:Math.min(n,a-Io),right:t}:{columns:1,left:n,right:t}}var I=class I extends Yt{constructor(){super(...arguments);this.narrow=!1;this.colLeft=ef;this.colRight=tf;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.sendStatusKnown=!1;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.historyReadings=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.helpSections=new Set;this.scrubStart=()=>this.draft?.beginGesture();this.scrubEnd=()=>this.draft?.endGesture();this.pickerOpen=!1;this.pickerFilter="all";this.pickerHiddenOpen=!1;this.sharedHelp=!1;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.snapGrid=!0;this.gridStep=.01;this.showGridLines=!1;this.altHeld=!1;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newOpen=!1;this.newName="";this.shareOpen=!1;this.shareMode="share";this.shareLabels=new Map;this.shareNote="";this.shareTextOpen=!1;this.galleryOpen=!1;this.galleryGroupNames=new Map;this.galleryValueNames=new Map;this.galleryTitle="";this.galleryDescription="";this.galleryTags=new Set;this.galleryNickname="";this.galleryConfirmed=!1;this.galleryPreviewNote="";this.gallerySending=!1;this.gallerySent=!1;this.galleryError="";this.galleryUploadsError="";this.galleryPreviewRun=0;this.importOpen=!1;this.importText="";this.importName="";this.importMap=new Map;this.importDrop=!1;this.importDragDepth=0;this.importTextShown=!1;this.importHistory=new Map;this.importHistoryRun=0;this.helpTab="basics";this.linkReady=!1;this.recordPreviews=new Map;this.previewCase=Mi.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=Sp(()=>this.requestUpdate());this.imageSizes=Tp(()=>this.requestUpdate());this.symbols=new Wr(()=>this.requestUpdate());this.keyHandler=t=>{t.key==="Alt"&&(this.altHeld=!0),this.onKey(t)};this.blurHandler=()=>{this.altHeld=!1};this.heldArrows=new Set;this.keyUpHandler=t=>{t.key==="Alt"&&(this.altHeld=!1),this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.fades=new Yr;this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.menuOutside=t=>{let i=this.openMenu;if(i===void 0)return;t.composedPath().some(r=>r instanceof HTMLElement&&r.dataset.menu===i)||this.toggleMenu(i,!1)};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.newKeys=t=>{t.key==="Enter"&&(this.newName.trim()===""||this.newFamily===void 0||this.newNameProblem()!==void 0||(t.preventDefault(),this.createNew()))};this.importDragEnter=t=>{this.dragReadable(t)&&(t.preventDefault(),this.importDragDepth+=1,this.importDrop=!0)};this.importDragOver=t=>{this.dragReadable(t)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))};this.importDragLeave=()=>{this.importDragDepth!==0&&(this.importDragDepth-=1,this.importDragDepth===0&&(this.importDrop=!1))};this.importDropped=t=>{this.importDragDepth=0,this.importDrop=!1;let i=t.dataTransfer?.files?.[0];if(i){t.preventDefault(),this.readImportBlob(i);return}let a=t.dataTransfer?.getData("text/plain")??"";a!==""&&(t.preventDefault(),this.setImportText(a))};this.takeShareLink=()=>{let t=od(window.location.hash);t!==void 0&&(history.replaceState(history.state,"",`${window.location.pathname}${window.location.search}`),this.pendingLink=t,this.linkReady&&this.openPendingLink())};this.importKeys={handleEvent:t=>{if(t.key!=="Enter"||t.target instanceof HTMLTextAreaElement)return;let i=this.importParse,a=i?.ok?i.config:void 0;if(!a)return;let r=id(a,this.hass.states);r.some(s=>Wl(Zm(s.entityId)))||ld({parsed:!0,name:this.importName,taken:this.takenNames(),unchosen:this.unchosenCount(r)})!==void 0||(t.preventDefault(),t.stopPropagation(),this.doImport())},capture:!0};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||Wl(Jm)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0};this.pressing=!1;this.pressStart=()=>{this.pressing=!0};this.pressEnd=()=>{window.setTimeout(()=>{this.pressing=!1})};this.sharedValueFocus=t=>{this.pressing||this.sharedValueOutside(t)};this.sharedValueOutside=t=>{if(this.openValue===void 0)return;let i=t.composedPath(),a=i[0];if(a instanceof HTMLElement&&a.classList.contains("values-list"))return;i.some(o=>o instanceof HTMLElement&&o.classList.contains("vitem")&&o.classList.contains("open"))||this.setOpenValue(void 0)}}get testValues(){return this.draft?.testValues??mk}static{this.styles=Bo`
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
      --wa-text: ${Ie(Ze.text)};
      --wa-icon: ${Ie(Ze.icon)};
      --wa-gauge: ${Ie(Ze.gauge)};
      --wa-shape: ${Ie(Ze.shape)};
      --wa-image: ${Ie(Ze.image)};
      --wa-tap: ${Ie(Ze.tap)};
      --wa-states: ${Ie(J.states)};
      --wa-place: ${Ie(J.place)};
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
    .shape-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
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
    .shape-dots { display: inline-flex; gap: 3px; align-items: center; flex: none; }
    .shape-dot { width: 14px; height: 10px; border-radius: 2px; background: currentColor; opacity: .3; display: inline-block; }
    .shape-dot.circular { width: 10px; border-radius: 50%; }
    .shape-dot.corner { width: 10px; border-radius: 0 6px 0 0; }
    .shape-dot.inline { width: 16px; height: 4px; }
    .shape-dot.on { opacity: 1; }

    /* Share and Import. Both are wider than New: one holds a whole document as
       text, the other a row for every entity the design reads. Both scroll
       inside themselves, so a design with twenty slots still has its buttons
       on screen. */
    dialog.share-dialog, dialog.import-dialog, dialog.gallery-dialog {
      width: min(560px, calc(100vw - 32px)); max-height: calc(100vh - 40px); padding: 0;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
      display: flex; flex-direction: column;
    }
    dialog.share-dialog::backdrop, dialog.import-dialog::backdrop, dialog.gallery-dialog::backdrop { background: rgba(0,0,0,.45); }
    /* The body scrolls between a head and a foot that stay put. It holds the
       inspector's own cards (.sec, pinned open), so a dialog reads the way a
       layer's settings do: one tinted box per subject, label-left rows, and
       rows that belong together in a hairline .fgroup. Most of these cards
       hold a list rather than rows, so their loose notes run the full width. */
    .xfer-body {
      padding: 12px 14px 14px; overflow: auto; flex: 1 1 auto; min-height: 0;
      display: flex; flex-direction: column; gap: 10px; container: xfer / inline-size;
    }
    .xfer-body > .sec { margin: 0; flex: none; }
    .xfer-sec { --wa-col: 0px; }
    .xfer-sec .sec-b { padding-bottom: 12px; }
    .xfer-sec .sec-h > :is(button.small, button.link) { flex: none; margin-left: auto; font-size: 12px; }
    .xfer-sec .sec-b .field { padding: 2px 0; }
    /* A row's note stays under its control, not under its title. */
    .xfer-sec .field > .hint { grid-column: 2; margin: 0 0 2px; }
    /* Rows in one box, parted by hairlines in the card's colour. */
    .fgroup.xfer-rows { padding: 0 8px; }
    .xfer-rows > * + * { border-top: 1px solid color-mix(in srgb, var(--c) 16%, transparent); }
    /* A note for the whole dialog rather than one card: a tinted strip wearing
       the same mark as a card header. */
    .xfer-callout {
      --c: var(--wa-accent);
      display: flex; align-items: flex-start; gap: 9px; padding: 9px 12px; border-radius: 9px; flex: none;
      font-size: 12px; line-height: 1.45; color: var(--wa-ink);
      background: color-mix(in srgb, var(--c) 7%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 24%, var(--wa-card));
    }
    .xfer-callout > span:last-child { min-width: 0; }
    /* Share or Backup as two tiles side by side: each choice has a sentence
       that needs reading before picking it. */
    .xfer-modes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; padding-top: 2px; }
    .xfer-mode {
      display: flex; gap: 8px; align-items: flex-start; padding: 9px 10px; border-radius: 8px; cursor: pointer; font-size: 12.5px;
      background: var(--wa-card); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .xfer-mode:hover { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 55%, var(--wa-line-strong)); }
    .xfer-mode.on { background: color-mix(in srgb, var(--c) 10%, var(--wa-card)); box-shadow: inset 0 0 0 1.5px var(--c); }
    .xfer-mode:has(input:focus-visible) { box-shadow: inset 0 0 0 1.5px var(--c), var(--wa-ring); }
    .xfer-mode input { flex: none; margin: 2px 0 0; accent-color: var(--c); }
    .xfer-mode b { font-weight: 650; }
    .xfer-mode .hint { display: block; margin: 2px 0 0; }
    /* The document itself. Monospace and never wrapped: a wrapped line reads as
       a line break that is not in the text, and this text gets pasted. */
    .xfer-text {
      display: block; width: 100%; box-sizing: border-box; resize: vertical; white-space: pre; overflow: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; line-height: 1.45;
      border-color: transparent; border-radius: 7px; background: var(--wa-field);
    }
    /* Where a document is pasted or dropped: a dashed well, lit along with the
       dialog while a file is over it. */
    .xfer-text.xfer-well {
      padding: 10px 12px; border: 1.5px dashed color-mix(in srgb, var(--c) 45%, var(--wa-line-strong));
      background: color-mix(in srgb, var(--c) 4%, var(--wa-card));
    }
    dialog.import-dialog.dropping .xfer-well { border-color: var(--wa-accent); }
    /* One slot per row: the id the reader will see, in a title column wide
       enough for one, the label they will read beside it, and under the label
       every place in the design that uses it. */
    .xfer-slots { --wa-lab: 132px; }
    .xfer-slot .sid {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
      color: var(--wa-ent); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .xfer-file { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .xfer-file .hint { margin: 0; }
    .xfer-problem { white-space: pre-line; }
    .xfer-link { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .xfer-text + .xfer-link-field { margin-top: 8px; }
    /* What the pasted text turned out to be: each shape drawn small, beside
       its name and the counts that matter before importing. */
    .xfer-preview {
      display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 0 0 8px; padding: 10px 12px;
      border-radius: 8px; background: var(--wa-field);
    }
    .xfer-arts { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .pk-art.xfer-art { width: auto; min-width: 48px; max-width: 150px; height: 56px; }
    .pk-art.xfer-art svg { max-height: 56px; }
    .pk-art.xfer-art .inline-line { font-size: 11px; padding: 3px 8px; }
    .xfer-facts { display: flex; flex-direction: column; gap: 2px; min-width: 0; font-size: 13px; }
    .xfer-facts span { font-size: 12px; color: var(--wa-muted); }
    /* The whole dialog is the drop target, lit while a file is over it. */
    dialog.import-dialog.dropping { border-color: var(--wa-accent); box-shadow: 0 0 0 2px var(--wa-accent), 0 12px 40px rgba(0,0,0,.4); }
    .xfer-drop {
      position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; border-radius: 12px;
      background: color-mix(in srgb, var(--wa-accent) 16%, transparent); font-size: 14px; font-weight: 600;
    }
    .xfer-drop span { padding: 8px 14px; border-radius: 8px; background: var(--wa-card); }
    .link-note { margin: 4px 12px 0; display: flex; align-items: center; gap: 10px; }
    /* One entity per row: the search beside its title, its notes under the
       search. */
    .xfer-ent { padding: 4px 0 6px; }
    .xfer-ent > .hint { margin: 2px 0 0 calc(var(--wa-lab) + 8px); }
    .xfer-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 12px 18px 14px; border-top: 1px solid var(--wa-line); flex: none; }
    .xfer-foot .spacer { flex: 1; }
    .xfer-foot .note { font-size: 12px; color: var(--wa-muted); }
    .xfer-foot .note.err, .gal-err { color: var(--error-color, #db4437); }
    /* Share's other ways out sit together, set off from Copy by a hairline. */
    .xfer-acts { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 6px; padding-right: 8px; border-right: 1px solid var(--wa-line); }
    /* Share to gallery. The public card is the part to read before sending:
       every piece of free text in the upload, grouped, in the text's own
       characters, so nothing reads as tidier than what will be posted. */
    .gal-name { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
    .gal-name input[type=text] {
      flex: 1 1 auto; min-width: 0; height: 26px; min-height: 26px; padding: 0 8px; font-size: 12px;
      border-radius: 6px; border-color: transparent; background-color: var(--wa-field);
    }
    .gal-name .sid {
      flex: none; max-width: 45%; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
      color: var(--wa-ent); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .gal-tags { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0; }
    .gal-previews { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-height: 56px; padding: 10px; border-radius: 8px; background: var(--wa-field); }
    .gal-previews .hint { margin: 0; }
    .gal-previews img { height: 56px; width: auto; max-width: 100%; border-radius: 8px; background: #000; }
    .gal-public { margin: 0; padding: 0; list-style: none; }
    .gal-public > li.fgroup { padding: 6px 8px 8px; }
    .gal-public li > b { display: block; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); margin-bottom: 3px; }
    .gal-public .gal-val {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
      white-space: pre-wrap; overflow-wrap: anywhere;
    }
    .gal-blockers { flex: none; }
    .gal-blockers ul { margin: 0; padding-left: 18px; }
    /* The promise closes the card it is about: the words left, the switch right. */
    .xfer-sec .field.gal-confirm {
      grid-template-columns: minmax(0, 1fr) auto; margin-top: 8px; padding-top: 10px;
      border-top: 1px solid color-mix(in srgb, var(--c) 24%, transparent);
    }
    .xfer-sec .field.gal-confirm > span { color: var(--wa-ink); font-size: 12.5px; font-weight: 600; }
    .xfer-sec .field.gal-confirm:has(> input:disabled) > span { color: var(--wa-muted); }
    .gal-up { padding: 7px 0; }
    .gal-up .srow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .gal-up .spacer { flex: 1; }
    .gal-up b { font-weight: 600; font-size: 12.5px; overflow-wrap: anywhere; }
    .gal-up .hint { margin: 3px 0 0; }
    .gal-status {
      font-size: 11px; font-weight: 600; line-height: 18px; padding: 0 8px; border-radius: 999px; white-space: nowrap;
      color: var(--wa-muted); background: var(--wa-field);
    }
    .gal-status.approved { color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }
    .gal-status.rejected { color: var(--error-color, #db4437); background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent); }
    /* A narrow dialog stacks its rows the way a narrow inspector does: the
       title on its own line, the control under it. A switch keeps its words
       beside it. */
    @container xfer (max-width: 440px) {
      .xfer-modes { grid-template-columns: minmax(0, 1fr); }
      dialog .xfer-sec .sec-b .field:not(.check) { grid-template-columns: minmax(0, 1fr); gap: 4px; }
      dialog .xfer-sec .sec-b .field:not(.check) > * { grid-column: 1 / -1; }
      dialog .xfer-sec .sec-b .field:not(.check) > span:first-child { padding-top: 0; }
      dialog .xfer-sec .xfer-ent > .hint { margin-left: 0; }
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
      --thumb-w: ${wd}px; --thumb-h: ${vd}px;
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
    /* A member of the selected group: lit in the folder's colour, without
       the selected row's ring, so the group reads as one block. */
    .layer.held { background: color-mix(in srgb, ${Ie(J.group)} 12%, var(--wa-panel)); }
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
    .layer .lockbtn.on { opacity: 1; color: ${Ie(J.locked)}; }
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
    .layer.drop-before { border-top: ${Wt}px solid transparent; }
    .layer.drop-after { border-bottom: ${Wt}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${Wt}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${Wt}px; }
    .layer.drop-after::after { bottom: -${Wt}px; }

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
    ${Ie(xk())}

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
    .canvas-bar .face-tools { display: inline-flex; gap: 6px; flex: none; }
    /* With snapping on, the button and its size read as one accent pill. */
    .grid-tool { display: inline-flex; align-items: center; position: relative; }
    .grid-tool.on button.pick { border-radius: 8px 0 0 8px; padding-right: 8px; }
    button.grid-step, button.grid-lines {
      height: 30px; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
      border: 0; border-left: 1px solid color-mix(in srgb, var(--wa-accent-ink) 30%, transparent);
      background-color: color-mix(in srgb, var(--wa-accent) 82%, #000); color: var(--wa-accent-ink);
    }
    button.grid-step { padding: 0 6px 0 8px; border-radius: 0; display: inline-flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums; }
    button.grid-step svg { width: 12px; height: 12px; opacity: .8; }
    button.grid-lines { width: 30px; padding: 0; display: inline-grid; place-items: center; border-radius: 0 8px 8px 0; }
    button.grid-lines[aria-pressed="false"] { color: color-mix(in srgb, var(--wa-accent-ink) 60%, transparent); }
    button.grid-lines svg { width: 15px; height: 15px; }
    button.grid-step:focus-visible, button.grid-lines:focus-visible { outline: none; box-shadow: var(--wa-ring); }
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
      background: color-mix(in srgb, ${Ie(J.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Ie(J.complication)} 25%, var(--wa-card));
    }
    .card.tint-states {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${Ie(J.states)} 12%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Ie(J.states)} 35%, var(--wa-card));
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
    .zoom-stage .preview.corner svg {
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
  `}firstUpdated(t){super.firstUpdated(t),this.renderRoot.addEventListener("change",i=>{let a=i.target;a?.tagName==="SELECT"&&a.blur()})}connectedCallback(){super.connectedCallback(),this.clearLegacyPickerHidden(),this.loadColumnWidths(),this.loadListView(),this.loadGrid(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("blur",this.blurHandler),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("pointerdown",this.pressStart,{capture:!0}),window.addEventListener("pointerup",this.pressEnd,{capture:!0}),window.addEventListener("pointercancel",this.pressEnd,{capture:!0}),window.addEventListener("click",this.sharedValueOutside,{capture:!0}),window.addEventListener("focusin",this.sharedValueFocus),this.addEventListener(wo,this.scrubStart),this.addEventListener(vo,this.scrubEnd),window.addEventListener("hashchange",this.takeShareLink),this.takeShareLink(),this.loadOwners(),this.watchStatusTimer=window.setInterval(()=>{this.refreshWatchStatus()},pk)}loadColumnWidths(){try{let t=window.localStorage.getItem(of);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=yd(i.left)),typeof i.right=="number"&&(this.colRight=yd(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(of,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadGrid(){try{let t=window.localStorage.getItem(rf);if(!t)return;let i=JSON.parse(t);typeof i.on=="boolean"&&(this.snapGrid=i.on),Ys.includes(i.step)&&(this.gridStep=i.step),typeof i.lines=="boolean"&&(this.showGridLines=i.lines)}catch{}}setGrid(t,i,a=this.showGridLines){this.snapGrid=t,this.gridStep=i,this.showGridLines=a;try{window.localStorage.setItem(rf,JSON.stringify({on:t,step:i,lines:a}))}catch{}}snapTarget(t){return{snap:{step:Ei(this.gridStep,ce[t]),on:this.snapGrid}}}loadListView(){try{let t=window.localStorage.getItem(af);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(af,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return h`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=ef:this.colRight=tf,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=lf(this.panelWidth,this.colLeft,this.colRight),s=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=u=>{if(u.pointerId!==i.pointerId)return;let p=u.clientX-r,m=yd(t==="left"?s+p:s-p);t==="left"?this.colLeft=m:this.colRight=m},d=u=>{u.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),this.fades.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("blur",this.blurHandler),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("pointerdown",this.pressStart,{capture:!0}),window.removeEventListener("pointerup",this.pressEnd,{capture:!0}),window.removeEventListener("pointercancel",this.pressEnd,{capture:!0}),window.removeEventListener("click",this.sharedValueOutside,{capture:!0}),window.removeEventListener("focusin",this.sharedValueFocus),this.removeEventListener(wo,this.scrubStart),this.removeEventListener(vo,this.scrubEnd),window.removeEventListener("hashchange",this.takeShareLink),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.watchStatusTimer!==void 0&&window.clearInterval(this.watchStatusTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=[t.rectangular,t.circular,t.corner].filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||fd(i)!==fd(this.inspect))&&(this.openSections=new Set(Gl),this.rowHoverId=void 0)}}updated(t){this.fades.refresh([this.renderRoot.querySelector(".column.inspector"),this.renderRoot.querySelector(".layers"),this.renderRoot.querySelector(".column.canvas")]);let i=fd(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!Ck.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!o){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!o){this.deleteSelection()&&t.preventDefault();return}let s=fk[t.key];if(s&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(s.dx,s.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!r?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!r&&(t.preventDefault(),this.redo()),r||o))return;let d=t.key.toLowerCase(),c=!0;d==="a"?this.selectAll():d==="c"?this.copySelection():d==="x"?this.copySelection()&&this.deleteSelection():d==="v"?this.pasteClip():d==="d"?this.duplicateSelection():d==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():d==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):c=!1,c&&t.preventDefault()}selectedIds(){let t=this.draft?.config;if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?ct(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();return!this.canEdit||t.length===0?!1:(this.mutate(i=>{for(let a of t)ge(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0?!1:(this.clipboard=ki(t,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.clipboard,i=this.canvasFamily,a=[];this.mutate(r=>{a=Jc(r,t,i)}),this.selectRows(a)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=ki(t,i),r=[];this.mutate(o=>{r=Ln(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=kt(t,this.canvasFamily).filter(a=>!ve(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?ot(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>vi(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>t.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!_e(t,a,s).isHidden);this.mutate(s=>{for(let l of i)$e(s,a,l,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(u=>!ve(a,u)),o=a.elements.filter(u=>ve(a,u)),s=r.findIndex(u=>u.payload.id===t),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let d=r[l],c=r[s];d.payload.groupId!==c.payload.groupId&&(c.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=c.payload.groupId),a.elements=[...r,...o],ut(a),wi(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await au(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${Mt(t)}`}this.linkReady=!0,this.openPendingLink()}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.pickerConfirmDelete=void 0,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0,this.sendStatusKnown=!1;let i=ep(this.owners.find(a=>a.owner_watch_id===t)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await cu(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await ru(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,this.polling=t.polling??!1,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${Mt(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=Qn.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=kr(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=Mt(i)}this.scheduleTemplates(0)}startNew(t){return this.draft?.dirty&&!this.confirmDiscard()?!1:(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new Qn(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0),!0)}freeSlot(){return oc(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}async refreshWatchStatus(){if(!(!this.ownerId||this.sendPending))try{let t=await su(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0}catch{}}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await ou(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,typeof t.applied_token=="number"&&t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=Mt(t)}}renderSendButton(){let t=xu({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending,lastPollSeconds:this.lastPollSeconds});if(t.kind==="unsupported"&&!this.sendStatusKnown)return f;let i=wu(t),a=i.resend&&this.hass.user?.is_admin?h`<button class="ghost" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return h`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}</span>${i.note?h`<span class="send-note" title=${i.title}>${i.note}</span>`:f}${a}`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<ns}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i,this.canvasFamily),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=ha(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=bc(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(uk))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new $t(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,watchAppVersion:this.selectedOwner?.app_version,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),canCountDown:i=>t.canCountDown(i),historySeries:i=>this.historySeries.get(i),historyReadings:i=>this.historyReadings.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),helpSections:this.helpSections,toggleHelp:i=>this.toggleHelp(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}},peekLayer:(i,a)=>{a?this.rowHoverId=i:this.rowHoverId===i&&(this.rowHoverId=void 0)},selectValue:i=>this.openSharedValue(i),beginGesture:()=>this.draft?.beginGesture(),copiedPosition:this.copiedPosition,copyPosition:i=>{this.copiedPosition=i}}}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}toggleHelp(t){let i=new Set(this.helpSections);i.has(t)?i.delete(t):i.add(t),this.helpSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||vp(t.app_version):!0}get canvasFamily(){if(Hi(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&hl(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;!t||t.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Zn(t)[0]??"rectangular")}addHere(t){this.mutate(t)}static sizeWords(t){let i=ce[t];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(t,i,a){if(t.elements.length===0||!Hi(this.activeFamily))return f;if(kt(t,i).length>0)return f;let r=se.filter(o=>o!==i&&t.supportedFamilies.includes(o)).filter(o=>Eo(t,o)>0);return h`<div class="blank-shape">
      <b>Nothing is on the ${ne(i)} shape yet.</b>
      <div class="hint">Each shape has its own layers. The ones on the other shapes belong to
        those shapes, so they are not listed here and nothing you do here can reach them. Add
        layers below, or take a copy of another shape's arrangement.</div>
      ${a&&r.length>0?h`<div class="adders">
            ${r.map(o=>h`<button class="small primary"
              title=${`Put a copy of every layer on the ${ne(o)} shape here, where it sits there, scaled to this canvas`}
              @click=${()=>this.mutate(s=>im(s,o,i))}>Copy the ${ne(o)} layout</button>`)}
          </div>
          <div class="hint">The copies are layers of their own: editing one here changes nothing on
            the ${ne(r[0])} shape. They are scaled on the way in, because a point is a
            point and this canvas is ${I.sizeWords(i)} against
            ${I.sizeWords(r[0])}, so sizes come down to match and a round
            shape pulls the layout in off its rim. Expect to nudge it by hand afterwards.</div>`:f}
    </div>`}addShape(t){this.mutate(i=>gp(i,t)),this.activeFamily=t,this.inspect={kind:"family"}}removeShape(t){let i=this.draft?.config;if(!i||!Gr(i,t))return;let a=bp(i,t);a.length>0&&!window.confirm(`Remove the ${ne(t)} shape? This deletes ${a.join(", ")}. They are on this shape only, so nothing else in the complication loses anything.`)||(this.mutate(r=>yp(r,t)),this.ensureActiveFamily())}createNew(){let t=this.newFamily,i=this.newName.trim();!t||i===""||this.newNameProblem()!==void 0||(this.closeNewDialog(),this.startNew(Uc(i,this.freeSlot(),[t])))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let s=this.freeSlot();if(s<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=te(),l.slotIndex=s,i=new Qn(l,null)}let a=i.encoded(),r=await Vs(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id;let o=this.draft.testValues;this.draft=Qn.fromDocument(r.record.document,r.record.revision),this.draft.testValues=o,this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Mt(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}await this.deleteSaved(this.selectedId,this.draft.baseRevision)}}async deleteSaved(t,i){if(!this.ownerId)return;let a=t===this.selectedId;this.saving=!0;try{let r=await lu(this.hass,this.ownerId,t,i);if(!r.ok){r.error==="conflict"&&a?this.conflict={current:r.current??null,message:r.message??"This complication changed on the server."}:this.saveError=r.message??r.error??"Delete failed";return}a&&(this.clearDraft(),this.selectedId=void 0),await this.loadRecords()}catch(r){this.saveError=Mt(r)}finally{this.saving=!1,this.confirmDelete=!1,this.pickerConfirmDelete=void 0}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=te(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await du(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Mt(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},ck)}async refreshHistorySeries(){let t=this.draft?.config,i=t?Gs(t):void 0;if(!i||Object.keys(i.history).length===0&&Object.keys(i.statistics).length===0){this.historySeries.size>0&&(this.historySeries=new Map),this.historyReadings.size>0&&(this.historyReadings=new Map);return}try{let a=await this.fetchSeries(i);this.historySeries=a.series,this.historyReadings=a.readings}catch{}}async fetchSeries(t){let[i,a]=await Promise.all([pu(this.hass,t.history),mu(this.hass,t.statistics).catch(()=>({}))]);return hu({...i,...a})}static{this.IMPORT_HISTORY_DELAY_MS=350}scheduleImportHistory(){this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=window.setTimeout(()=>{this.importHistoryTimer=void 0,this.refreshImportHistory()},I.IMPORT_HISTORY_DELAY_MS)}async refreshImportHistory(){let t=this.importOpen?this.importPreview()?.config:void 0,i=t?Gs(t,r=>this.hass.states[r]!==void 0):void 0;if(i?.signature===this.importHistoryAsked)return;let a=++this.importHistoryRun;if(this.importHistoryAsked=i?.signature,!i||Object.keys(i.history).length===0&&Object.keys(i.statistics).length===0){this.importHistory.size>0&&(this.importHistory=new Map);return}try{let r=await this.fetchSeries(i);if(a!==this.importHistoryRun)return;this.importHistory=r.series}catch{a===this.importHistoryRun&&(this.importHistoryAsked=void 0)}}async refreshTemplates(){this.refreshHistorySeries();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await uu(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=Cu(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Mt(i)}}entityStateFor(t,i,a){let r=this.hass.states[t];if(!r)return;let o=r.attributes,s=t.split(".")[0]??"",l={entityId:t,state:(a?this.testValues.get(t):void 0)??r.state,unitOfMeasurement:typeof o.unit_of_measurement=="string"?o.unit_of_measurement:void 0,iconName:i,domain:s};if(s==="timer"){l.timerState=r.state,typeof o.finishes_at=="string"&&(l.finishesAt=o.finishes_at);let d=Tk(o.remaining);d!==void 0&&(l.remaining=d)}return typeof o.entity_picture=="string"&&(l.entityPicture=o.entity_picture),l}buildContext(t=!0){let i=new Map;for(let[r,o]of this.compiled?.entities??[]){let s=this.entityStateFor(r,o.iconName??"",t);s&&i.set(r,s)}let a=this.draft?.config.values??[];return{entityStates:i,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:t?yu(a,this.testValues):a,dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3,testedEntities:t?new Set(this.testValues.keys()):new Set}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return h`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${t?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let t=this.showTaps;return h`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderTintTool(){let t=this.previewTint,i=sl.find(o=>o.hex===t),a=!this.draft||this.parseError!==void 0,r=o=>{this.toggleMenu("tint",!1),this.previewTint=o};return h`<span class="inbox tint-box ${t!==void 0?"on":""}"
      title="Many watch faces draw complications in one colour. Colours become the face's tint, text and background turn white, and only how see-through each part is survives.">
      <span class="pre">Colour</span>
      <span class="case-tool" data-menu="tint">
        <button class="case-pick" ?disabled=${a} aria-haspopup="listbox" aria-expanded=${this.openMenu==="tint"?"true":"false"}
          aria-label=${`Preview colour, ${i?`${i.label} tinted face`:"full colour"}`} @click=${()=>this.toggleMenu("tint")}>
          ${i?h`<i class="tint-dot" style=${`--sw:${i.hex}`}></i>${i.label} tint`:"Full colour"}${V("chevron")}
        </button>
        ${this.openMenu==="tint"?h`<div class="pop-menu" role="listbox" aria-label="Preview colour">
          <button class="row" role="option" aria-selected=${t===void 0?"true":"false"} @click=${()=>r(void 0)}>
            <i class="tint-dot full"></i>Full colour</button>
          ${sl.map(o=>h`<button class="row" role="option" aria-selected=${o.hex===t?"true":"false"}
            @click=${()=>r(o.hex)}><i class="tint-dot" style=${`--sw:${o.hex}`}></i>${o.label} tint</button>`)}
        </div>`:f}
      </span>
    </span>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return h`<button class="pick only-icon" ?disabled=${t} aria-label="Expand the preview"
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}>${V("expand")}</button>`}renderGridButton(){let t=this.snapGrid,i=this.showGridLines,a=!this.draft||this.parseError!==void 0||this.activeFamily==="inline",r=i?w`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="1.9" />`:w`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><path d="M2.5 13.5l11-11" />`;return h`<span class="grid-tool ${t?"on":""}" data-menu="grid">
      <button class="pick ${t?"on":""}" ?disabled=${a} aria-pressed=${t?"true":"false"}
        title=${t?"Layers snap to the grid when you drag them, and arrow keys move one grid step. Hold Alt to drag freely. Click to turn it off.":"Snap layers to a grid when you drag them. Without it, hold Alt while dragging to snap."}
        @click=${()=>this.setGrid(!t,this.gridStep)}><span class="glyph">▦</span>Snap to grid</button>
      ${t?h`<button class="grid-step" ?disabled=${a} aria-haspopup="listbox" aria-expanded=${this.openMenu==="grid"?"true":"false"}
        aria-label=${`Grid size, ${this.gridStep*100}%`} title="Grid size"
        @click=${()=>this.toggleMenu("grid")}>${this.gridStep*100}%${V("chevron")}</button>
      ${this.openMenu==="grid"?h`<div class="pop-menu" role="listbox" aria-label="Grid size">
        ${Ys.map(o=>h`<button class="row" role="option" aria-selected=${o===this.gridStep?"true":"false"}
          @click=${()=>{this.toggleMenu("grid",!1),this.setGrid(!0,o)}}>${o*100}%</button>`)}
      </div>`:f}
      <button class="grid-lines" ?disabled=${a} aria-pressed=${i?"true":"false"}
        aria-label=${i?"Hide the grid lines":"Show the grid lines"}
        title=${i?"Hide the grid lines. Layers still snap.":"Show the grid lines. Layers snap either way."}
        @click=${()=>this.setGrid(!0,this.gridStep,!i)}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${r}</svg>
      </button>`:f}
    </span>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return f;let o=a.slots[t],s=t==="corner"?104/124:o.width/o.height;return h`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
      <div class="zoom-bar">
        ${this.renderUnder(r,t)}
        <span class="spacer"></span>
        ${this.renderTintTool()}
        ${this.renderPickButton()}
        ${this.renderShowTapsButton()}
        ${this.renderGridButton()}
        <button class="pick" title="Back to the editor (Escape)" @click=${()=>{this.zoomed=!1}}><span class="glyph">⤡</span>Close</button>
      </div>
      <div class="zoom-stage" style=${`--wa-ratio:${s}`}>
        ${this.renderBigPreview(t,i,a)}
      </div>
    </dialog>`}renderHelpDialog(){let t=Cn,i=bd,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${Oa}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a group to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Snap to grid","On by default at 1%. Layers snap to the grid when you drag them, and arrows move one grid step. The eye beside the size shows or hides the lines; snapping works either way"],["Alt-drag","Flips Snap to grid for that drag: snaps with it off, moves freely with it on"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=[["Shapes","Rectangular, Circular, Corner and Inline are the kinds of slot on a watch face. The watch offers a complication only in slots whose shape it has."],["Shape tabs","Above the preview. Click one to edit that shape, or a dashed one to add it."],["Canvas shapes","Rectangular, Circular and Corner each hold their own layers. A layer belongs to one shape, so editing it never changes another. An empty shape can take a copy of another shape's layers."],["Corner","Its Corner content card picks big curved text or a canvas of layers."],["Inline","One line of text with an optional symbol before it. It has no layers."],["The shape itself","The bottom row of the Layers list: its background, border and Shape states."]],s=[["Text","A value: typed words, an entity, a template, a shared value and more. It can count down to a time."],["Icon","An SF Symbol or Material Design icon, or the entity's own icon."],["Gauge","A number drawn between a minimum and a maximum."],["Chart","Recent history as bars, a line or an area."],["Timeline","Which state an entity was in over time, as a coloured strip."],["Shape","A rectangle, rounded rectangle, capsule, circle or line."],["Picture","A camera snapshot, or an entity's picture such as a person's avatar or album art."],["Tap area","Invisible. A tap inside it runs its own action. Outside it, the complication's tap action applies."],["Extras","Clock times, chart dots, a chart grid and a picture's timestamp are added from their layer's Extras card."],["Order","The top of the Layers list draws on top. Drag a row to reorder."],["Groups",`A set of layers kept together in the list. Pick some and press ${t}G. Locked, the group moves as one on the face. Unlocked, each layer moves alone. The watch never sees groups.`]],l=[["Content","What the layer shows, starting with its entity or value."],["Look","How it is drawn: size, colour and style. On a picture the card is called Picture."],["Extras","Charts, timelines and pictures only: labels, markers, clock times, dots, grid lines or a timestamp."],["States","Changes that apply while a value matches, described below."],["Position","Where the layer sits on the shape being edited, and its size."],["Tap","What a tap on the layer does."],["?","In a card's header: shows that card's help text."]],d=[["By value","Gauges, charts and text can colour by value instead of one colour. Each band colours readings up to its number, lowest band first. Readings above every band take the Above the last band colour."],["Timeline colours","A timeline colours each state from its own table."],["States","Rows that test a value, like is on or is greater than, each with the changes it makes: icon, text, colour, visibility and more. Rows are checked top to bottom and the first match wins. Otherwise applies when none match."],["Shape states","The same table, on the shape itself."],["Shared values","Like a variable: set it once under the Layers card, and every layer that reads it follows. On a layer, set Source to Shared value, or click Make shared."],["Values on the watch","Every entity and shared value the complication reads, with its live reading. Slide, pick or type another value to watch the preview and the states react. Nothing is saved, and Live or Back to live returns to the real reading."]],c=[["Save",`Writes the complication to Home Assistant (${t}S). A new one says Save new until then. Only an administrator can save.`],["The dot","Beside Save: unsaved changes, saved, or not saved yet. The footer says the same in words."],["Reaching the watch","The watch pulls saved changes by itself while Wrist Assistant is open on this home. There is no separate send step."],["Hide","The eye beside a complication in the list. It stops the watch offering that complication when you edit a face, and faces already using it keep it. Hidden ones fold into Hidden at the bottom of the list. For the open complication it saves with Save; for any other it saves at once."]],u=[["On watch","The watch has applied every change. With last seen beside it, the watch is not listening now, so a later save waits until the app is open again."],["Sending\u2026","Waiting for the watch to pull and confirm."],["Not on watch yet","The watch is connected but has not confirmed the latest change. Resend wakes it again."],["Open the watch app to sync","The watch is not listening. Open Wrist Assistant on the watch, or switch it to this home, and it pulls at once. Resend tries to wake it."],["Update the watch app","This watch has never reported a change. Its app is older than custom complications, or it has not opened this home yet."]],p=[["Share","In the top bar. Turns the open complication into text anyone can import. Your entity ids and names become numbered slots, and you can label each one."],["Backup","The other choice in Share: an exact copy, entity ids and names included. For your records, or another watch in this home."],["Copy link","A link to this panel with the text inside it. Opening it here fills in the Import dialog. On another home, paste the link into Import."],["Import","Beside New. Paste text or a link, choose a file, or drop one on the dialog. Check the preview, choose your own entity for each slot, then Import. It opens as unsaved work and reaches the watch at the first Save."]],m=$=>$.map(([k,v])=>h`<tr><th scope="row"><kbd>${k}</kbd></th><td>${v}</td></tr>`),g=($,k)=>h`<section>
      <h3>${$}</h3>
      <table class="terms"><tbody>${k.map(([v,C])=>h`<tr><th scope="row">${v}</th><td>${C}</td></tr>`)}</tbody></table>
    </section>`,y=($,k)=>h`<button role="tab" id=${`wa-help-${$}`} aria-selected=${this.helpTab===$?"true":"false"}
      @click=${()=>{this.helpTab=$}}>${k}</button>`,b;return this.helpTab==="keys"?b=h`
        <section>
          <h3>Keys</h3>
          <table><tbody>${m(a)}</tbody></table>
          <p class="hint">Keys act on layers only while nothing is being typed into. In a field they keep their usual meaning.</p>
        </section>
        <section>
          <h3>Mouse</h3>
          <table><tbody>${m(r)}</tbody></table>
        </section>`:this.helpTab==="sync"?b=h`<div>${g("Saving",c)}${g("Watch status",u)}</div>${g("Share and import",p)}`:b=h`<div>${g("Shapes",o)}${g("Cards",l)}</div><div>${g("Layers",s)}${g("Colour, states and values",d)}</div>`,h`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
      <div class="help-head">
        <h2>Help</h2>
        <span class="spacer"></span>
        <a href="https://docs.wrist-assistant.com/" target="_blank" rel="noopener noreferrer">Wrist Assistant docs</a>
        <button class="pick" title="Close (Escape)" @click=${()=>{this.helpOpen=!1}}>Close</button>
      </div>
      <div class="help-tabs" role="tablist" aria-label="Help topics">
        ${y("basics","Basics")}${y("keys","Keys and mouse")}${y("sync","Syncing and sharing")}
      </div>
      <div class="help-body" role="tabpanel" aria-labelledby=${`wa-help-${this.helpTab}`}>${b}</div>
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.draft?.config;if(!i)return;let r=t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?Sr(i,r):void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(t,i){let a=this.renderRoot,r="activeElement"in a?a.activeElement:null;if(r&&typeof r.blur=="function"&&!i.currentTarget?.contains(r)&&r.blur(),this.picking){i.preventDefault(),this.pickAt(t,i);return}let o=i.target,s=o.closest("[data-handle]")?.getAttribute("data-handle")??null,l=o.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,d=o.closest("svg.complication");if(this.showTaps){let z=this.focusTapId();if(z!==void 0&&l===z&&d&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,d,z,s??void 0);return}let H=this.hitLayerId(i);H?this.inspect={kind:"layer",id:H}:l===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(t!==this.activeFamily){this.activeFamily=t;return}let c=sf(i),u=l!==void 0?Sr(this.draft.config,l):void 0;if(!c&&!s&&d&&this.multi.size>=2&&u!==void 0&&this.multi.has(u)){let z=Gc(this.draft.config,this.multi);if(i.preventDefault(),z.length===0)return;this.beginMoveGesture(t,i,d,z,`drag-pick-${t}`,()=>{this.multi=new Set,this.inspect={kind:"layer",id:u}});return}if(!c&&this.multi.size>0&&(this.multi=new Set),!l||!d)return;let p=Sr(this.draft.config,l),m=this.draft.config.elements.find(z=>z.payload.id===p);if(!p||!m)return;if(c){i.preventDefault(),this.togglePick(p);return}let g,y=this.inspect.kind==="layer"?this.inspect.id:void 0;if(y!==void 0&&y!==p&&!s){let z=this.draft.config.elements.find(X=>X.payload.id===y);z!==void 0&&z.kind!=="chartDots"&&z.kind!=="chartGrid"&&z.payload.chartAnchor?.place!=="through"&&ot(this.draft.config,y)?.locked!==!0&&$k(d,y,i)&&(g=p,p=y,m=z)}let b=ot(this.draft.config,p),$=b!==void 0&&this.inspect.kind==="group"&&this.inspect.id===b.id;if(b&&(b.locked||$)&&!s){let z=$||this.inspect.kind==="layer"&&ot(this.draft.config,this.inspect.id)?.id===b.id;this.beginGroupGesture(t,i,d,b,z?p:void 0);return}if((this.inspect.kind!=="layer"||this.inspect.id!==p)&&(this.inspect={kind:"layer",id:p},s)||m.payload.chartAnchor?.place==="through")return;i.preventDefault();let k=_e(this.draft.config,t,m).frame,v=this.gestureCanvas(t),C=m.payload.chartAnchor,R=C!==void 0&&!Nt(C.at)&&C.place!=="through",M=C!==void 0&&Nt(C.at)&&C.place==="through",A=ce[t],F={dx:C?.dx??0,dy:C?.dy??0},E=C!==void 0&&!s?hn(this.draft.config,this.buildContext(),this.forced)[t]?.elements.find(z=>z.id===p)?.frame:void 0,N=E??k,j=z=>Math.round(z*10)/10;this.cancelGesture?.();let K=!1,q=s!==null?hn(this.draft.config,this.buildContext(),this.forced)[t]?.elements.find(z=>z.id===p):void 0;if(s!==null&&q?.kind==="icon"){let z=dl(q)/2,H=q.size;this.cancelGesture=Ou(d,i,s,{w:z,h:z},(X,x)=>{this.mutate(S=>{$e(S,t,p,{size:Math.max(1,Math.round(H*X))})},`drag-${p}-${t}`),x&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let O=q!==void 0?cp(q,N,v):{};this.cancelGesture=Nr(d,v,i,{elementId:p,frame:N,handle:s??void 0,...O,...C===void 0?this.snapTarget(t):{}},{onFrame:(z,H,X)=>{if(X||(K=!0),X&&!K&&g!==void 0){this.inspect={kind:"layer",id:g},this.cancelGesture=void 0;return}this.mutate(x=>{if(C===void 0){$e(x,t,z,{frame:H});return}let S=E?{width:k.width,height:k.height}:{width:H.width,height:H.height};$e(x,t,z,{frame:{...H,...S,x:R?H.x:k.x,y:k.y}});let _=x.elements.find(Z=>Z.payload.id===z)?.payload.chartAnchor;if(_===void 0)return;let B=F.dx,W=M?F.dy:j(F.dy+(H.y-N.y)*A.height);B?_.dx=B:delete _.dx,W?_.dy=W:delete _.dy},`drag-${z}-${t}`),X&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r,o){let s=this.draft?.config;if(!s)return;let l=ct(s,r.id);if(l.length===0)return;o===void 0&&(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let d=o===void 0?void 0:()=>{this.inspect={kind:"layer",id:o}};this.beginMoveGesture(t,i,a,l.map(c=>c.payload.id),`drag-group-${r.id}-${t}`,d)}beginMoveGesture(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return;let d=l.elements.filter(M=>r.includes(M.payload.id));if(d.length===0)return;let c=new Map(d.map(M=>[M.payload.id,_e(l,t,M).frame])),u=[...c.values()],p=Math.min(...u.map(M=>M.x)),m=Math.min(...u.map(M=>M.y)),g=Math.max(...u.map(M=>M.x+M.width)),y=Math.max(...u.map(M=>M.y+M.height)),b={x:p,y:m,width:g-p,height:y-m,rotationDegrees:0},$=M=>Math.round(M*1e3)/1e3;this.cancelGesture?.();let k=!1,v=M=>{M.pointerId===i.pointerId&&Math.hypot(M.clientX-i.clientX,M.clientY-i.clientY)>Sk&&(k=!0)};a.addEventListener("pointermove",v);let C=()=>a.removeEventListener("pointermove",v),R=Nr(a,this.gestureCanvas(t),i,{elementId:o,frame:b,...this.snapTarget(t)},{onFrame:(M,A,F)=>{if(F&&C(),!F&&!k)return;if(F&&!k&&s!==void 0){s(),this.cancelGesture=void 0;return}let E=A.x-b.x,N=A.y-b.y;this.mutate(j=>{for(let[K,q]of c)$e(j,t,K,{frame:{...q,x:$(q.x+E),y:$(q.y+N)}})},o),F&&(this.draft?.endGesture(),this.cancelGesture=void 0)}});this.cancelGesture=()=>{C(),R()}}nudge(t,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Du:1,s=t*o,l=i*o,d=this.canvasFamily,c=ce[d];if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,s,l);if(this.inspect.kind==="group"){let $=this.inspect.id;return this.nudgeMany(ct(r,$).map(k=>k.payload.id),d,c,`nudge-group-${$}-${d}`,s,l)}if(this.inspect.kind!=="layer")return!1;let u=this.inspect.id,p=r.elements.find($=>$.payload.id===u);if(!p||p.payload.chartAnchor?.place==="through")return!1;let m=ot(r,u);if(m?.locked)return this.nudgeMany(ct(r,m.id).map($=>$.payload.id),d,c,`nudge-group-${m.id}-${d}`,s,l);let g=_e(r,d,p).frame,y=p.payload.chartAnchor;if(y!==void 0){let $=!Nt(y.at);return l===0&&!($&&s!==0)||this.mutate(k=>{$&&s!==0&&$e(k,d,u,{frame:Pr(g,s,0,c)});let v=k.elements.find(R=>R.payload.id===u)?.payload.chartAnchor;if(v===void 0||l===0)return;let C=Math.round(((v.dy??0)+l)*10)/10;C?v.dy=C:delete v.dy},`nudge-${u}-${d}`),!0}let b=this.snapGrid?Zs(g,s,l,Ei(this.gridStep,c)):Pr(g,s,l,c);return(b.x!==g.x||b.y!==g.y)&&this.mutate($=>$e($,d,u,{frame:b}),`nudge-${u}-${d}`),!0}nudgeMany(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return!1;let d=C=>Math.round(C*1e3)/1e3,c=new Map;for(let C of t){let R=l.elements.find(M=>M.payload.id===C);R&&c.set(C,_e(l,i,R).frame)}if(c.size===0)return!1;let u=[...c.values()],p=Math.min(...u.map(C=>C.x)),m=Math.min(...u.map(C=>C.y)),g=Math.max(...u.map(C=>C.x+C.width)),y=Math.max(...u.map(C=>C.y+C.height)),b={x:p,y:m,width:g-p,height:y-m,rotationDegrees:0},$=this.snapGrid?Zs(b,o,s,Ei(this.gridStep,a)):Pr(b,o,s,a),k=$.x-b.x,v=$.y-b.y;return(k!==0||v!==0)&&this.mutate(C=>{for(let[R,M]of c)$e(C,i,R,{frame:{...M,x:d(M.x+k),y:d(M.y+v)}})},r),!0}gestureCanvas(t){let i=Br(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=pl(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:Ye(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(u=>u.payload.id===r);if(!s||!l)return;let d=ve(s,l),c=_e(s,t,l).frame;this.cancelGesture?.(),this.cancelGesture=Nr(a,this.gestureCanvas(t),i,{elementId:r,frame:c,handle:o,...this.snapTarget(t)},{onFrame:(u,p,m)=>{this.mutate(g=>{d?jc(g,u,t,p):$e(g,t,u,{frame:p})},`tap-box-${u}-${t}`),m&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:lf(this.panelWidth,this.colLeft,this.colRight),r=this.records.find(o=>o.id===this.selectedId);return h`
      <header>
        <label>Choose watch
          <select @change=${o=>{this.selectOwner(o.target.value)}}>
            ${this.owners.map(o=>h`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id===this.ownerId}>
              ${df(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
        ${Qm()}
        <label class="pick-label" for="wa-picker">Choose complication</label>
        ${this.renderPicker()}
        ${this.hass.user?.is_admin?h`<span class="hor" aria-hidden="true">or</span>${Qm()}`:f}
        ${this.renderNewButton()}
        ${t?h`<button class="new-btn" aria-haspopup="dialog" aria-expanded=${this.shareOpen?"true":"false"}
          title="Share or back up this complication as text, a file or a link"
          @click=${()=>this.openShareDialog()}><span>Share</span></button>`:f}
        <span class="spacer"></span>
        <button class="help" title="Help" aria-label="Help" @click=${()=>{this.helpOpen=!0}}>?</button>
        <div class="toolbar hbox hist">
          <button class="icon" @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${V("undo")}</button>
          <span class="hdiv"></span>
          <button class="icon" @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${V("redo")}</button>
        </div>
        <div class="hbox status">
          <span class="dirty-dot ${i?"":r?"clean":"none"}" title=${i?"Unsaved changes":r?"Saved":"Not saved yet"}></span>
          ${this.renderSendButton()}
          <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":t?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
        </div>
      </header>
      ${this.loadError?h`<div class="card error">${this.loadError}</div>`:f}
      ${this.linkNote?h`<div class="banner warn link-note"><span>${this.linkNote}</span>
        <button class="link" @click=${()=>{this.linkNote=void 0}}>Dismiss</button></div>`:f}
      ${this.helpOpen?this.renderHelpDialog():f}
      ${this.newOpen?this.renderNewDialog():f}
      ${this.shareOpen?this.renderShareDialog():f}
      ${this.galleryOpen?this.renderGalleryDialog():f}
      ${this.importOpen?this.renderImportDialog():f}
      ${this.watchSupported?h`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}${this.renderSharedValues()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:this.renderWatchGate()}`}renderWatchGate(){let t=this.selectedOwner,i=t?.complication_count??0,a=i===0?"Nothing on this watch changes until then.":`Your ${i} complication${i===1?"":"s"} keep${i===1?"s":""} working until then.`;return h`<div class="gate">
      <div class="gate-card">
        <div class="gate-glyph">${V("watch")}</div>
        <div class="gate-eyebrow">Watch app update coming soon</div>
        <h2 class="gate-title">This watch needs the new app.</h2>
        <p class="gate-lead">${kp(t?.app_version)}</p>
        <ol class="gate-steps">
          <li>
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
          </li>
        </ol>
        <div class="gate-foot">${a}</div>
      </div>
    </div>`}pickerRows(){let t=this.records.map(a=>({slot:Number(a.document?.slotIndex??0),kind:"record",record:a}));return[...t,...sc(t.map(a=>a.slot),this.occupied).map(a=>a.kind==="custom"?{slot:a.slot,kind:"locked",name:a.name||"Unnamed complication",badge:a.home||"Other home",title:`A complication on ${a.home?`the ${a.home} home`:"another home"}${a.families?.length?` (${a.families.map(ne).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:a.families??[]}:{slot:a.slot,kind:"locked",name:a.name||"Unnamed preset",badge:"iPhone",title:"Still on the iPhone. Open the Wrist Assistant app on the iPhone to move it here.",families:[]})].sort((a,r)=>a.slot-r.slot)}shapeDots(t){return h`<span class="shape-dots">${mn.map(i=>h`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${ne(i)}></span>`)}</span>`}static{this.FILTER_FROM_ROWS=8}recordPreview(t){let i=this.recordPreviews.get(t.id);if(i&&i.revision===t.revision)return i;try{let a=bi(t.document),r={revision:t.revision,config:a,entities:[...ha(a).entities.values()]};return this.recordPreviews.set(t.id,r),r}catch{this.recordPreviews.delete(t.id);return}}renderRowArt(t){let i=this.recordPreview(t);if(!i)return h`<span class="pk-art"></span>`;let a=i.config,o=(this.pickerFilter!=="all"&&a.supportedFamilies.includes(this.pickerFilter)?this.pickerFilter:void 0)??hl(a)??"inline";return this.renderConfigArts(a,i.entities,[o],"pk-art")[0]}renderConfigArts(t,i,a,r,o){let s=new Map;for(let d of i){let c=this.entityStateFor(d.entityId,d.iconName??"",!1);c&&s.set(d.entityId,c)}let l=hn(t,{entityStates:s,templateResults:new Map,...o?{historySeries:o}:{},namedValues:t.values});return a.map(d=>{if(d==="inline")return h`<span class="${r} inline">${this.renderInlinePreview(l.inline,!0)}</span>`;let c=l[d];return c?h`<span class="${r} ${d}">${Ai(c,{icons:this.icons,imageSizes:this.imageSizes,slot:Mi.slots[d]})}</span>`:h`<span class=${r}></span>`})}renderPickerFilter(t){let i=r=>r.kind==="record"?gd(r.record):r.families,a=(r,o,s)=>h`<button
      class="pk-chip ${this.pickerFilter===r?"on":""}" ?disabled=${s===0}
      aria-pressed=${this.pickerFilter===r?"true":"false"}
      @click=${()=>{this.pickerFilter=r}}>${o}<span class="pk-count">${s}</span></button>`;return h`<div class="pk-filter">
      ${a("all","All",t.length)}
      ${mn.map(r=>a(r,ne(r),t.filter(o=>i(o).includes(r)).length))}
    </div>`}renderPicker(){let t=this.draft,i=t?t.config.name.trim()||"Untitled":"No complication",a=t?t.config.supportedFamilies:[],r=this.pickerRows(),o=this.pickerFilter,s=o==="all"?r:r.filter(d=>(d.kind==="record"?gd(d.record):d.families).includes(o)),l=Vc(s,d=>d.kind==="record"?{id:d.record.id,hidden:this.rowHidden(d.record)}:void 0,this.selectedId);return h`<div class="picker">
      <button id="wa-picker" aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(a)}
        <span class="pk-name">${i}</span>
        ${t&&t.baseRevision===null?h`<span class="pk-rev">unsaved</span>`:f}
        ${V("chevron")}
      </button>
      ${this.pickerOpen?h`<div class="menu" role="listbox">
        ${r.length>=I.FILTER_FROM_ROWS?this.renderPickerFilter(r):f}
        ${r.length===0&&!(t&&t.baseRevision===null)?h`<div class="empty">No complications for this watch yet.</div>`:f}
        ${r.length>0&&s.length===0?h`<div class="empty">Nothing on this watch has a ${o==="all"?"":ne(o)} shape.</div>`:f}
        ${l.shown.map(d=>this.renderPickerRow(d))}
        ${t&&t.baseRevision===null?h`<div class="row" aria-current="true"><span class="pk-art"></span><span class="pk-name">${i}</span>${this.shapeDots(a)}<span class="pk-badge">unsaved</span></div>`:f}
        ${l.hidden.length>0?h`
          <button type="button" class="pk-hidden-head" aria-expanded=${this.pickerHiddenOpen?"true":"false"}
            @click=${()=>{this.pickerHiddenOpen=!this.pickerHiddenOpen}}>
            ${V("chevron")}<span>Hidden (${l.hidden.length})</span>
          </button>
          ${this.pickerHiddenOpen?l.hidden.map(d=>this.renderPickerRow(d)):f}`:f}
      </div>`:f}
    </div>`}renderPickerRow(t){if(t.kind!=="record")return h`<button type="button" class="row locked" role="option" aria-disabled="true" title=${t.title}
          @click=${()=>{this.pickerNote=this.pickerNote===t.slot?void 0:t.slot}}>
          <span class="pk-art"></span>
          <span class="pk-name">${t.name}</span>
          ${this.shapeDots(t.families)}
          <span class="pk-badge">${t.badge}</span>
        </button>
        ${this.pickerNote===t.slot?h`<div class="pk-note">${t.title}</div>`:f}`;let i=t.record,a=i.id===this.selectedId,r=this.rowHidden(i),o=String(i.document?.name??"Untitled"),s=a?this.canEdit:!!this.hass.user?.is_admin,l=s,d=this.pickerConfirmDelete===i.id,c=u=>u.stopPropagation();return h`<div class="row rec ${r?"dim":""}" aria-current=${a?"true":"false"}>
      <button type="button" class="pick" role="option" aria-selected=${a?"true":"false"}
        @click=${()=>{this.togglePicker(!1),this.selectRecord(i)}}>
        ${this.renderRowArt(i)}
        <span class="pk-name">${o}</span>
        ${this.shapeDots(gd(i))}
      </button>
      <span class="pk-acts">
        ${d?h`<button type="button" class="ghost danger small" ?disabled=${this.saving}
              @click=${u=>{c(u),a?this.deleteCurrent():this.deleteSaved(i.id,i.revision)}}>Really delete</button>
            <button type="button" class="ghost small" @click=${u=>{c(u),this.pickerConfirmDelete=void 0}}>Cancel</button>`:h`${l?h`<button type="button" class="icon" ?disabled=${!a&&this.saving}
              title=${r?"Hidden from the watch's complication list. Show it there again.":"Hide from the watch's complication list. Faces already using it keep it."}
              aria-label=${r?`Show ${o} in the watch's complication list`:`Hide ${o} from the watch's complication list`}
              @click=${u=>{c(u),this.setPickerHidden(i,!r)}}>${V(r?"hide":"show")}</button>`:f}
            ${s?h`<button type="button" class="icon danger" title="Delete this complication" aria-label=${`Delete ${o}`}
              ?disabled=${this.saving} @click=${u=>{c(u),this.pickerConfirmDelete=i.id}}>${V("delete")}</button>`:f}`}
      </span>
    </div>`}rowHidden(t){return t.id===this.selectedId&&this.draft?this.draft.config.hidden===!0:Oc(t.document)}async setPickerHidden(t,i){if(this.ownerId){if(t.id===this.selectedId){this.mutate(a=>{i?a.hidden=!0:delete a.hidden});return}if(!(!this.hass.user?.is_admin||this.saving||!t.document)){this.saving=!0,this.saveError=void 0;try{let a=Bc(t.document,i),r=await Vs(this.hass,this.ownerId,a,t.revision);if(!r.ok){this.saveError=r.error==="conflict"?`${String(t.document.name??"That complication")} changed on the server. Try again.`:r.message??r.error??"Save failed";return}this.beginSendWait(),await this.loadRecords()}catch(a){this.saveError=Mt(a)}finally{this.saving=!1}}}}clearLegacyPickerHidden(){try{let t=window.localStorage,i=[];for(let a=0;a<t.length;a++){let r=t.key(a);r?.startsWith(sk)&&i.push(r)}for(let a of i)t.removeItem(a)}catch{}}toggleMenu(t,i=this.openMenu!==t){this.openMenu=i?t:this.openMenu===t?void 0:this.openMenu,this.openMenu!==void 0?window.addEventListener("pointerdown",this.menuOutside,{capture:!0}):window.removeEventListener("pointerdown",this.menuOutside,{capture:!0})}togglePicker(t=!this.pickerOpen){this.pickerOpen=t,t||(this.pickerNote=void 0,this.pickerConfirmDelete=void 0),t?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderNewButton(){if(!this.hass.user?.is_admin)return f;let t=this.freeSlot()<0;return h`<div class="newc">
      <button class="new-btn primary" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.newOpen?"true":"false"}
        title=${t?"This watch has no free slot. Delete a complication first.":"Make a new complication"}
        @click=${()=>this.openNewDialog()}>${V("plus")}<span>New</span></button>
      <button class="new-btn" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.importOpen?"true":"false"}
        title=${t?"This watch has no free slot. Delete a complication first.":"Paste a complication somebody shared"}
        @click=${()=>this.openImportDialog()}><span>Import</span></button>
      ${t?h`<span class="newc-full">watch is full</span>`:f}
    </div>`}takenNames(){let t=[...this.records.map(i=>String(i.document?.name??"")),...this.occupied.map(i=>"name"in i&&typeof i.name=="string"?i.name:"")];return new Set(t.map(i=>i.trim().toLowerCase()).filter(i=>i!==""))}newNameProblem(){let t=this.newName.trim();if(t!==""&&this.takenNames().has(t.toLowerCase()))return"A complication on this watch already has that name."}renderNewDialog(){let t=this.newNameProblem(),i=this.newName.trim()!=="",a=i&&t===void 0&&this.newFamily!==void 0;return h`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${()=>{this.newOpen=!1}}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeNewDialog()}>${V("close")}</button>
      </div>
      <div class="new-body">
        <div class="field">
          <span>Name</span>
          <input type="text" .value=${this.newName} placeholder="Kitchen at a glance" maxlength="60"
            aria-label="Complication name" aria-invalid=${t?"true":"false"}
            @input=${r=>{this.newName=r.target.value}} />
        </div>
        ${t?h`<div class="hint err">${t}</div>`:h`<div class="hint">This is what the name shows on the watch face picker, so make it one you will recognise there.</div>`}
        <div class="field new-shapes">
          <span>Shape</span>
          <div class="shape-cards" role="radiogroup" aria-label="Shape">
            ${mn.map(r=>h`<button type="button" role="radio" class="shape-card ${this.newFamily===r?"on":""}"
              aria-checked=${this.newFamily===r?"true":"false"}
              @click=${()=>{this.newFamily=r}}>
              ${yk(r)}
              <span class="shape-card-name">${ne(r)}</span>
            </button>`)}
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
    </dialog>`}openNewDialog(){this.freeSlot()<0||(this.newOpen=!0,this.newName="",this.newFamily=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.new-dialog");t&&(t.open||t.showModal(),t.querySelector("input[type=text]")?.focus())}))}closeNewDialog(){let t=this.renderRoot.querySelector("dialog.new-dialog");t?.open?t.close():this.newOpen=!1}knownDomains(){let t=new Set;for(let i of Object.keys(this.hass.states)){let a=i.split(".")[0]??"";a!==""&&t.add(a)}return t}currentShareSlots(){let t=this.draft?.config;return t?Am(t,this.knownDomains()).map(i=>{let a=this.shareLabels.get(i.placeholderId);return a===void 0?i:{...i,label:a}}):[]}renderShareDialog(){let t=this.draft?.config;if(!t)return f;let i=this.currentShareSlots(),a=Da(t,this.shareMode,i),r=this.shareLink?.text===a?this.shareLink:void 0,o=(l,d,c)=>h`<label class="xfer-mode ${this.shareMode===l?"on":""}">
      <input type="radio" name="wa-share-mode" .checked=${this.shareMode===l}
        @change=${()=>{this.shareMode=l,this.shareNote=""}} />
      <span><b>${d}</b><span class="hint">${c}</span></span>
    </label>`,s=h`<button class="link xfer-show" aria-expanded=${this.shareTextOpen?"true":"false"}
      @click=${()=>{this.shareTextOpen=!this.shareTextOpen}}>${this.shareTextOpen?"Hide text":"Show text"}</button>`;return h`<dialog class="share-dialog" @close=${()=>{this.shareOpen=!1}}>
      <div class="new-head">
        <h2>Share this complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Close" aria-label="Close" @click=${()=>this.closeShareDialog()}>${V("close")}</button>
      </div>
      <div class="xfer-body">
        ${this.dialogCard("What to share","link",J.complication,h`<div class="xfer-modes">
          ${o("share","Share","Entity ids and friendly names are replaced by numbered slots, so nothing about your home travels with it. Whoever imports it picks their own entities.")}
          ${o("backup","Backup","An exact copy, your entity ids and names included. For your own records, or another watch in this home.")}
        </div>`)}
        ${this.shareMode==="share"?this.renderShareSlots(i):f}
        ${this.dialogCard("Text","braces",J.place,this.shareTextOpen||r?h`
          ${this.shareTextOpen?h`<textarea class="xfer-text" rows="14" readonly aria-label="The text to share" .value=${a}></textarea>`:f}
          ${r?h`<div class="field xfer-link-field">
            <span>Link</span>
            <input class="xfer-link" type="text" readonly aria-label="Share link" .value=${r.url}
              @focus=${l=>l.target.select()} />
            <div class="hint">Opening it on this Home Assistant fills in the Import dialog. Someone on another home pastes it into their own Import dialog instead.</div>
          </div>`:f}`:f,{tool:s})}
      </div>
      <div class="xfer-foot">
        <button class="small" @click=${()=>this.closeShareDialog()}>Close</button>
        ${this.shareNote===""?f:h`<span class="note">${this.shareNote}</span>`}
        <span class="spacer"></span>
        <span class="xfer-acts">
          ${this.hass.user?.is_admin?h`<button class="small" aria-haspopup="dialog"
            title="Send it to the public gallery on wrist-assistant.com, with the entities replaced as in Share"
            @click=${()=>this.openGalleryDialog()}>Share to gallery</button>`:f}
          <button class="small" @click=${()=>this.downloadShareText(a)}>Download</button>
          <button class="small" title="A link that opens Import with this text filled in" @click=${()=>{this.copyShareLink(a)}}>Copy link</button>
        </span>
        <button class="primary" @click=${()=>{this.copyShareText(a)}}>Copy</button>
      </div>
    </dialog>`}dialogCard(t,i,a,r,o={}){return h`<section class="sec xfer-sec ${o.cls??""}" style=${`--c:${a}`}>
      <div class="sec-h pinned">
        <span class="swatch">${V(i)}</span>
        <span class="tt"><h4>${t}</h4></span>
        ${o.tool??f}
      </div>
      ${r===f?f:h`<div class="sec-b">${r}</div>`}
    </section>`}renderShareSlots(t){return t.length===0?this.dialogCard("Slots","content",J.content,h`<div class="hint">This design reads no entities, so there is nothing to replace.</div>`):this.dialogCard("Slots","content",J.content,h`
      <div class="fgroup xfer-rows">
        ${t.map(i=>h`<div class="field xfer-slot">
          <span class="sid" title=${i.placeholderId}>${i.placeholderId}</span>
          <input type="text" maxlength="40" aria-label=${`Label for ${i.placeholderId}`} .value=${i.label}
            @input=${a=>this.setShareLabel(i.placeholderId,a.target.value)} />
          <div class="hint">${i.where.join(", ")}</div>
        </div>`)}
      </div>
      <div class="hint">These names are all the other side has while it picks its own entities, so say what each one is for.</div>`,{cls:"xfer-slots"})}setShareLabel(t,i){let a=new Map(this.shareLabels);a.set(t,i),this.shareLabels=a}openShareDialog(){this.draft&&(this.shareOpen=!0,this.shareMode="share",this.shareLabels=new Map,this.shareNote="",this.shareTextOpen=!1,this.shareLink=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.share-dialog");t&&!t.open&&t.showModal()}))}closeShareDialog(){let t=this.renderRoot.querySelector("dialog.share-dialog");t?.open?t.close():this.shareOpen=!1}galleryMeta(){return{title:this.galleryTitle,description:this.galleryDescription,authorName:this.galleryNickname,tags:[...this.galleryTags],panelVersion:this.panel?.config?.version??""}}openGalleryDialog(){let t=this.draft?.config;!t||!this.hass.user?.is_admin||(this.galleryOpen=!0,this.galleryTitle=t.name.trim().slice(0,fe.title),this.galleryDescription="",this.galleryTags=new Set,this.galleryNickname=lk(),this.galleryConfirmed=!1,this.gallerySending=!1,this.gallerySent=!1,this.galleryError="",this.galleryPreviews=void 0,this.galleryPreviewNote="",this.galleryConfirmDelete=void 0,this.galleryGroupNames=new Map,this.galleryValueNames=new Map,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.gallery-dialog");i&&!i.open&&i.showModal()}),this.makeGalleryPreviews(t,this.currentShareSlots()),this.loadGalleryUploads())}galleryOverrides(){return{name:this.galleryTitle,groupNames:this.galleryGroupNames,valueNames:this.galleryValueNames}}setGalleryName(t,i){if(t.kind==="slot"){this.setShareLabel(t.id,i),window.clearTimeout(this.galleryRedrawTimer),this.galleryRedrawTimer=window.setTimeout(()=>{let r=this.draft?.config;!r||!this.galleryOpen||this.gallerySent||(this.galleryPreviews=void 0,this.galleryPreviewNote="",this.makeGalleryPreviews(r,this.currentShareSlots()))},500);return}let a=new Map(t.kind==="group"?this.galleryGroupNames:this.galleryValueNames);a.set(t.id,i),t.kind==="group"?this.galleryGroupNames=a:this.galleryValueNames=a}closeGalleryDialog(){let t=this.renderRoot.querySelector("dialog.gallery-dialog");t?.open?t.close():this.galleryOpen=!1}async makeGalleryPreviews(t,i){let a=++this.galleryPreviewRun;try{let r=await Xm(t,i,{entityState:o=>this.entityStateFor(o,"",!1),templateResults:this.templateResults,historySeries:this.historySeries},this.icons);if(a!==this.galleryPreviewRun)return;this.galleryPreviews=r}catch{if(a!==this.galleryPreviewRun)return;this.galleryPreviews=[],this.galleryPreviewNote="The preview pictures could not be made. It can still be sent without them."}}async ensureGalleryKey(){return this.galleryKey===void 0&&(this.galleryKey=(await iu(this.hass)).key),this.galleryKey}async loadGalleryUploads(){this.galleryUploadsError="";try{let t=await this.ensureGalleryKey();this.galleryUploads=await jm(md,t)}catch(t){this.galleryUploads=[],this.galleryUploadsError=t instanceof Rt?Fo(t):"Could not read this Home Assistant's gallery key."}}async sendToGallery(){let t=this.draft?.config;if(!t||this.gallerySending||this.gallerySent||!this.galleryConfirmed||this.galleryPreviews===void 0)return;let i=this.currentShareSlots(),a=this.galleryMeta(),r=this.galleryOverrides();if(!(pd(t,i,a,this.knownDomains(),r).length>0)){this.gallerySending=!0,this.galleryError="";try{let o=await this.ensureGalleryKey();await Wm(md,o,{...ud(t,i,a,r),previews:this.galleryPreviews}),this.gallerySent=!0,dk(a.authorName.trim()),this.loadGalleryUploads()}catch(o){this.galleryError=o instanceof Rt?Fo(o):"Could not read this Home Assistant's gallery key. Try again."}finally{this.gallerySending=!1}}}async deleteGalleryUpload(t){if(this.galleryConfirmDelete!==t){this.galleryConfirmDelete=t;return}this.galleryDeleting=t,this.galleryUploadsError="";try{let i=await this.ensureGalleryKey();await qm(md,i,t),this.galleryUploads=this.galleryUploads?.filter(a=>a.id!==t)}catch(i){this.galleryUploadsError=i instanceof Rt?Fo(i):"Could not delete it. Try again."}finally{this.galleryDeleting=void 0,this.galleryConfirmDelete=void 0}}toggleGalleryTag(t){let i=new Set(this.galleryTags);i.has(t)?i.delete(t):i.size<fe.tags&&i.add(t),this.galleryTags=i}renderGalleryDialog(){let t=this.draft?.config;if(!t)return f;let i=this.currentShareSlots(),a=this.galleryOverrides(),r=pd(t,i,this.galleryMeta(),this.knownDomains(),a),o=Km(t,i,a),s=this.gallerySending||this.gallerySent,l=r.length===0&&this.galleryConfirmed&&this.galleryPreviews!==void 0&&!s,d=this.gallerySent?"Already sent":r.length>0?r[0]:this.galleryPreviews===void 0?"Drawing the preview pictures":this.galleryConfirmed?"Send it for review":"Tick the box above first",c=this.galleryPreviews;return h`<dialog class="gallery-dialog" @close=${()=>{this.galleryOpen=!1}}>
      <div class="new-head">
        <h2>Share to gallery</h2>
        <span class="spacer"></span>
        <button class="icon" title="Close" aria-label="Close" @click=${()=>this.closeGalleryDialog()}>${V("close")}</button>
      </div>
      <div class="xfer-body">
        <div class="xfer-callout">
          <span class="swatch">${V("info")}</span>
          <span class="gal-lead">The gallery on wrist-assistant.com is public. After a review, anyone can find this complication there and add it to their own Home Assistant. Your entities are replaced by the slots you named in Share.</span>
        </div>
        ${this.dialogCard("Listing","text",J.content,h`
          <label class="field">
            <span>Title</span>
            <input type="text" maxlength=${fe.title} .value=${this.galleryTitle} ?disabled=${s}
              @input=${u=>{this.galleryTitle=u.target.value}} />
          </label>
          <label class="field">
            <span>Description</span>
            <textarea rows="3" maxlength=${fe.description} .value=${this.galleryDescription} ?disabled=${s}
              @input=${u=>{this.galleryDescription=u.target.value}}></textarea>
          </label>
          <div class="field list-field">
            <span>Tags</span>
            <div class="gal-tags">
              ${cd.map(u=>{let p=this.galleryTags.has(u);return h`<button class="pk-chip ${p?"on":""}" aria-pressed=${p?"true":"false"}
                  ?disabled=${s||!p&&this.galleryTags.size>=fe.tags}
                  @click=${()=>this.toggleGalleryTag(u)}>${Bm[u]}</button>`})}
            </div>
            <div class="hint">Up to ${fe.tags}, so people can find it.</div>
          </div>
          <label class="field">
            <span>Nickname</span>
            <input type="text" maxlength=${fe.authorName} placeholder="Optional" .value=${this.galleryNickname} ?disabled=${s}
              @input=${u=>{this.galleryNickname=u.target.value}} />
            <div class="hint">Shown beside it in the gallery. Leave it empty to post without a name.</div>
          </label>`)}
        ${this.dialogCard("Preview","image",J.look,h`
          <div class="gal-previews">
            ${c===void 0?h`<span class="hint">Drawing…</span>`:c.length===0?h`<span class="hint">${this.galleryPreviewNote||"Inline has no picture, so this one goes without."}</span>`:c.map(u=>h`<img alt=${`${u.family} preview`} src=${`data:image/png;base64,${u.png}`} />`)}
          </div>
          <div class="hint">Drawn with your current values. Picture layers are left out.</div>`)}
        ${this.dialogCard("This will be public","show",J.states,h`
          <ul class="gal-public">
            ${o.map(u=>h`<li class="fgroup"><b>${u.label}</b>${u.rows?u.rows.map(p=>h`<div class="gal-name">
                ${p.kind==="slot"?h`<span class="sid" title=${p.id}>${p.id}</span>`:f}
                <input type="text" maxlength=${p.kind==="slot"?40:f} .value=${p.value} placeholder=${p.original}
                  aria-label=${`${u.label}: ${p.kind==="slot"?p.id:p.original}`} ?disabled=${s}
                  @input=${m=>this.setGalleryName(p,m.target.value)} />
              </div>`):u.values.map(p=>h`<div class="gal-val">${p}</div>`)}</li>`)}
          </ul>
          <div class="hint">Read it through. Anything here that names a person, a place or a device in your home will be posted as written. Group and shared value names changed here apply to the gallery copy only, and an empty one keeps its name. Slot labels are the ones from Share.</div>
          <label class="field check gal-confirm">
            <span>I made this and it has no private information</span>
            <input type="checkbox" .checked=${this.galleryConfirmed} ?disabled=${s}
              @change=${u=>{this.galleryConfirmed=u.target.checked}} />
          </label>`)}
        ${r.length>0?h`<div class="banner warn gal-blockers"><ul>${r.map(u=>h`<li>${u}</li>`)}</ul></div>`:f}
        ${this.renderGalleryUploads()}
      </div>
      <div class="xfer-foot">
        ${this.gallerySent?h`<span class="note">Sent. It will show in the gallery after review.</span>`:this.galleryError!==""?h`<span class="note err">${this.galleryError}</span>`:f}
        <span class="spacer"></span>
        <button class="small" @click=${()=>this.closeGalleryDialog()}>Close</button>
        <button class="primary" ?disabled=${!l} title=${d}
          @click=${()=>{this.sendToGallery()}}>${this.gallerySending?"Sending\u2026":this.gallerySent?"Sent":"Send"}</button>
      </div>
    </dialog>`}renderGalleryUploads(){let t=this.galleryUploads;return this.dialogCard("My gallery uploads","layers",J.place,h`
      ${this.galleryUploadsError!==""?h`<div class="hint err gal-err">${this.galleryUploadsError}</div>`:f}
      ${t===void 0?h`<div class="hint">Loading…</div>`:t.length===0?this.galleryUploadsError===""?h`<div class="hint">Nothing sent from this Home Assistant yet.</div>`:f:h`<div class="fgroup xfer-rows">${t.map(i=>{let a=this.galleryConfirmDelete===i.id,r=this.galleryDeleting===i.id;return h`<div class="gal-up">
              <div class="srow">
                <b>${i.title}</b>
                <span class="gal-status ${i.status}">${Ym[i.status]??i.status}</span>
                <span class="spacer"></span>
                ${a&&!r?h`<button class="small" @click=${()=>{this.galleryConfirmDelete=void 0}}>Keep</button>`:f}
                <button class="small ${a?"danger":""}" ?disabled=${this.galleryDeleting!==void 0}
                  title=${a?"Removes it from the gallery for good":"Remove it from the gallery"}
                  @click=${()=>{this.deleteGalleryUpload(i.id)}}>${r?"Deleting\u2026":a?"Delete for good":"Delete"}</button>
              </div>
              ${i.status==="rejected"&&i.rejectReason?h`<div class="hint">Reason: ${i.rejectReason}</div>`:f}
            </div>`})}</div>`}`,{cls:"gal-mine"})}async copyShareText(t,i="dialog.share-dialog textarea",a="Copied."){try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(t),this.shareNote=a;return}}catch{}i==="dialog.share-dialog textarea"&&!this.shareTextOpen&&(this.shareTextOpen=!0,await this.updateComplete);let r=this.renderRoot.querySelector(i);r?.focus(),r?.select();let o=!1;try{o=document.execCommand("copy")}catch{o=!1}this.shareNote=o?a:"Press Cmd+C or Ctrl+C to copy."}async copyShareLink(t){let i=await Nm(t),a=zm(`${window.location.origin}${window.location.pathname}`,i);this.shareLink={text:t,url:a},await this.updateComplete,await this.copyShareText(a,"dialog.share-dialog input.xfer-link","Link copied.")}downloadShareText(t){let i=this.draft?.config;if(!i)return;let a=Hm(i),r=URL.createObjectURL(new Blob([t],{type:"application/json"})),o=document.createElement("a");o.href=r,o.download=a,o.click(),window.setTimeout(()=>URL.revokeObjectURL(r),0),this.shareNote=`Saved as ${a}.`}renderImportDialog(){let t=this.importParse,i=t?.ok?t.config:void 0,a=i?id(i,this.hass.states):[],r=ld({parsed:i!==void 0,name:this.importName,taken:this.takenNames(),unchosen:this.unchosenCount(a)}),o=Om(t,this.importTextShown);return h`<dialog class="import-dialog ${this.importDrop?"dropping":""}" @keydown=${this.importKeys} @close=${()=>this.importClosed()}
      @dragenter=${this.importDragEnter} @dragover=${this.importDragOver} @dragleave=${this.importDragLeave} @drop=${this.importDropped}>
      <div class="new-head">
        <h2>Import a complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeImportDialog()}>${V("close")}</button>
      </div>
      <div class="xfer-body">
        ${o?this.dialogCard("Shared text loaded","braces",J.place,f,{tool:h`<button type="button" class="small" @click=${()=>{this.importTextShown=!0}}>Show text</button>`}):this.dialogCard("Shared text","braces",J.place,h`
            <textarea class="xfer-text xfer-well" rows="8" placeholder="Paste the shared text or a share link here"
              aria-label="Shared complication text or link" .value=${this.importText}
              @input=${s=>this.setImportText(s.target.value)}></textarea>
            <div class="xfer-file">
              <button type="button" class="small"
                @click=${s=>s.currentTarget.parentElement?.querySelector("input[type=file]")?.click()}>Choose a file</button>
              <span class="hint">or drop one on this dialog</span>
              <input type="file" hidden accept=".json,application/json,text/plain"
                @change=${s=>{this.readImportFile(s)}} />
            </div>
            ${t&&!t.ok?h`<div class="hint err xfer-problem" role="alert">${t.error}</div>`:f}`,{tool:i?h`<button type="button" class="small" @click=${()=>{this.importTextShown=!1}}>Hide text</button>`:f})}
        ${!o&&this.importText.trim()===""?h`<div class="xfer-callout">
              <span class="swatch">${V("info")}</span>
              <span>Find designs other people made at <a href="https://wrist-assistant.com/gallery/" target="_blank" rel="noopener">wrist-assistant.com/gallery</a>.</span>
            </div>`:f}
        ${i?this.renderImportPreview(i,a):f}
        ${i?this.renderImportDetails(i,a):f}
      </div>
      <div class="xfer-foot">
        <span class="spacer"></span>
        <button class="small" @click=${()=>this.closeImportDialog()}>Cancel</button>
        <button class="primary" ?disabled=${r!==void 0}
          title=${r??"Save it to this watch and open it in the editor"} @click=${()=>{this.doImport()}}>Import</button>
      </div>
      ${this.importDrop?h`<div class="xfer-drop" aria-hidden="true"><span>Drop to read the file</span></div>`:f}
    </dialog>`}renderImportPreview(t,i){let a=Lm(t,i),r=a.layers===1?"1 layer":`${a.layers} layers`,o=a.slots===0?"no entities to choose":a.slots===1?"1 entity to choose":`${a.slots} entities to choose`,s=a.missing===0?"":` \xB7 ${a.missing} not in your Home Assistant`,l=this.importPreview(),d=this.importName.trim(),c=d!==""&&this.takenNames().has(d.toLowerCase());return this.dialogCard("Complication","watch",J.complication,h`
      <div class="xfer-preview">
        <div class="xfer-arts">${l?this.renderConfigArts(l.config,l.entities,Zn(t),"pk-art xfer-art",this.importHistory):f}</div>
        <div class="xfer-facts">
          <b>${t.name.trim()||"Untitled"}</b>
          <span>${a.families.join(" \xB7 ")}</span>
          <span>${r} · ${o}${s}</span>
        </div>
      </div>
      <div class="field">
        <span>Name</span>
        <input type="text" maxlength="60" aria-label="Complication name" aria-invalid=${c?"true":"false"}
          .value=${this.importName}
          @input=${u=>{this.importName=u.target.value}} />
        ${c?h`<div class="hint err">A complication on this watch already has that name.</div>`:h`<div class="hint">Import saves it to this watch and opens it in the editor.</div>`}
      </div>`)}dragReadable(t){let i=t.dataTransfer?[...t.dataTransfer.types]:[];return i.includes("Files")||i.includes("text/plain")}unchosenCount(t){return t.filter(i=>i.required&&!this.importMap.has(i.entityId)).length}renderImportDetails(t,i){return this.dialogCard("Entities","content",J.content,h`
      ${i.length===0?h`<div class="hint">Every entity this design reads is already in your Home Assistant.</div>`:h`<div class="fgroup xfer-rows">${i.map(a=>this.renderImportRow(a))}</div>`}
      ${Ho(t)?h`<div class="hint warn">This design filters by areas, labels or floors from the sender's home. Check its aggregate layers after import.</div>`:f}`)}renderImportRow(t){let i=this.importMap.get(t.entityId);return h`<div class="xfer-ent">
      ${Et({hass:this.hass},t.label,i??hk,a=>this.setImportEntity(t.entityId,a),Zm(t.entityId),{compact:!0,domain:t.domain,needed:t.required&&i===void 0})}
      <div class="hint">${t.where.join(", ")}</div>
      <div class="hint">${t.required?"Choose the entity this design should read.":"Not in your Home Assistant right now; leave it to keep the id."}</div>
    </div>`}setImportEntity(t,i){let a=new Map(this.importMap);i.entityId===""?a.delete(t):a.set(t,So(this.hass.states,i.entityId)),this.importMap=a,this.scheduleImportHistory()}importPreview(){let t=this.importParse;if(!t?.ok)return;let i=this.importPreviewCache;if(i&&i.parse===t&&i.map===this.importMap)return i;let a=ad(t.config,this.importMap),r;try{r=[...ha(a).entities.values()]}catch{r=[]}return this.importPreviewCache={parse:t,map:this.importMap,config:a,entities:r},this.importPreviewCache}setImportText(t){this.importText=t;let i=Dm(t);if(i!==void 0){this.importParse=void 0,this.importMap=new Map,this.importName="",rd(i).then(o=>{this.importText===t&&(o===void 0?this.importParse={ok:!1,error:sd}:this.setImportText(o))});return}let a=this.importParse?.ok?JSON.stringify(this.importParse.config):void 0,r=t.trim()===""?void 0:Fm(t,this.maxSchemaVersion);if(this.importParse=r,this.scheduleImportHistory(),!r?.ok){this.importMap=new Map,this.importName="";return}JSON.stringify(r.config)!==a&&(this.importMap=new Map,this.importName=Im(r.config.name,this.takenNames()))}async readImportFile(t){let i=t.target,a=i.files?.[0];a&&(await this.readImportBlob(a),i.value="")}async readImportBlob(t){try{this.setImportText(await t.text())}catch(i){this.importParse={ok:!1,error:`That file could not be read: ${Mt(i)}`}}}async openPendingLink(){let t=this.pendingLink;if(t===void 0)return;if(this.pendingLink=void 0,!this.hass.user?.is_admin){this.linkNote="This link holds a shared complication. Only a Home Assistant administrator can import it.";return}let i=await rd(t);if(i===void 0){this.linkNote=sd;return}if(!this.ownerId){this.linkNote="This link holds a shared complication, but no watch has connected to this Home Assistant yet.";return}if(this.freeSlot()<0){this.linkNote="This link holds a shared complication, but this watch has no free slot. Delete a complication, then open the link again.";return}this.linkNote=void 0,this.openImportDialog(),this.setImportText(i)}async doImport(){let t=this.importParse;if(!t?.ok)return;let i=ad(t.config,this.importMap);i.id=te(),i.name=this.importName.trim(),i.slotIndex=this.freeSlot(),i.dataSources=[],i.schemaVersion=_n(i),this.startNew(i)&&(this.draft?.markDirty(),this.closeImportDialog(),await this.save())}openImportDialog(){!this.hass.user?.is_admin||this.freeSlot()<0||(this.importOpen=!0,this.importText="",this.importParse=void 0,this.importName="",this.importMap=new Map,this.importTextShown=!1,this.importHistory=new Map,this.importHistoryAsked=void 0,this.importPreviewCache=void 0,this.importDrop=!1,this.importDragDepth=0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.import-dialog");t&&(t.open||t.showModal(),t.querySelector("textarea")?.focus())}))}closeImportDialog(){let t=this.renderRoot.querySelector("dialog.import-dialog");t?.open?t.close():this.importClosed()}importClosed(){this.importOpen=!1,this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=void 0,this.importHistoryRun+=1}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(h`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(h`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(h`<div class="banner err"><b>Save rejected.</b> ${a.message}
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
                ${i.map(a=>h`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${df(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:h`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?h`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return f;if(this.activeFamily==="inline")return f;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return h`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
        <span class="swatch">${V("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?f:h`<span class="mini">${ml.length} kinds · ${Na.length} presets</span>`}
        ${a?h`<span class="tool-set" @click=${s=>s.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Names"],["expanded","Samples"]].map(([s,l])=>h`
                  <button class=${this.addDetail===s?"on":""} title=${l} aria-label=${l} aria-pressed=${this.addDetail===s?"true":"false"}
                    @click=${()=>{this.addDetail=s,this.saveListView()}}>${V(s)}</button>`)}
              </span>
            </span>`:f}
        <span class="chev">${V("chevron")}</span>
      </h2>
      ${a?h`
          <div class="add-grid ${r?"":"lean"}">
            ${ml.map(s=>h`<button class="add" style=${`--k:${Ze[s]}`} ?disabled=${i} title=${`Add a blank ${fn[s].toLowerCase()} layer`}
              @click=${()=>{let l=Re(s);this.addHere(d=>{d.elements.push(l),l.kind==="timeline"&&Vn(d,l.payload.id)}),this.inspect={kind:"layer",id:l.payload.id}}}
              >${r?h`<span class="well">${Up(s)}</span>`:f}<span class="add-name">${r?V(s):h`<span class="k"></span>`}<span>${fn[s]}</span></span></button>`)}
          </div>
          <div class="presets">
            <span class="presets-l">Presets</span>
            ${Na.map(s=>h`<button class="preset" title=${s.blurb}
              ?disabled=${t.elements.length+s.layerCount>64}
              @click=${()=>this.openPreset(s.kind)}>${s.title}</button>`)}
          </div>`:f}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let s=o.elements.filter(g=>!ve(o,g)),l=o.elements.filter(g=>ve(o,g)),d=[...s].reverse(),c=d.find(g=>g.payload.id===i);if(!c)return;let u=o.groups?.find(g=>g.id===t),p=u?d.filter(g=>g.payload.groupId===u.id):d.filter(g=>g.payload.id===t);if(p.length===0||p.includes(c))return;d=d.filter(g=>!p.includes(g));let m;if((u||r)&&c.payload.groupId!==void 0){let g=d.filter(y=>y.payload.groupId===c.payload.groupId);m=a?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else m=d.indexOf(c)+(a?0:1);if(d.splice(m,0,...p),!u){let g=p[0],y=r?void 0:c.payload.groupId;y===void 0?delete g.payload.groupId:g.payload.groupId=y}o.elements=[...d.reverse(),...l],ut(o),wi(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?Wt:0),l=o.bottom-(r.classList.contains("drop-after")?Wt:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(sf(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(l=>!ve(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(t);if(o<0||s<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=Ms(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return f;if(this.activeFamily==="inline")return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(E,N)=>this.moveLayer(E,N),o=E=>{let N;this.mutate(j=>{N=Yc(j,E)}),N&&(this.inspect={kind:"layer",id:N})},s=E=>{this.mutate(N=>ge(N,E)),this.inspect.kind==="layer"&&this.inspect.id===E&&(this.inspect={kind:"general"})},l=kt(t,a).filter(E=>!ve(t,E)).reverse(),d=me(this.host()),c=new $t(this.buildContext(),this.draft?.config),u=t.perFamily[this.activeFamily],p=this.inspect.kind==="family",m=`${u?.backgroundColorHex?Le(u.backgroundColorHex):"transparent"} \xB7 ${u?.borderColorHex?`${u.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(E=>t.elements.some(N=>N.payload.id===E)).length,y=hn(t,this.buildContext(),this.forced)[a],b=cf[this.thumbStep],$=Math.round(wd*b),k=Math.round(vd*b),v=E=>y?h`<span class="thumb">${fp(y,E,{icons:this.icons,imageSizes:this.imageSizes,width:$,height:k})}</span>`:h`<span class="thumb"></span>`,C=this.layerDetail==="expanded",R=(E,N,j=!1)=>{let K=E.payload.id,q=this.inspect.kind==="layer"&&this.inspect.id===K,O=_e(t,a,E),z=O.isHidden,H=Ye(t,K)[0],X=va(E.payload.rules),x=this.picking&&this.pickHoverId===K,S=this.rowDrag(K,i);return h`<div class="layer ${q?"hl":""} ${j?"held":""} ${x?"pick":""} ${z?"dim":""} ${this.multi.has(K)?"multi":""} ${N?"kid":""} ${C?"rich":""}"
        style=${`--k:${Ze[E.kind]}`} tabindex="0" draggable=${S.draggable}
        @pointerenter=${()=>{this.listHoverIds=[K]}}
        @pointerleave=${()=>this.leaveRow([K])}
        @click=${_=>this.clickRow(K,_)}
        @keydown=${_=>{_.key==="Enter"&&(this.inspect={kind:"layer",id:K})}}
        @dragstart=${S.onStart} @dragend=${S.onEnd} @dragover=${S.onOver} @drop=${S.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a group to put it inside.">${V("grip")}</span>
        <span class="bar"></span>
        ${v([K])}
        <span class="name">
          <b>${Fe(E,d)}</b>
          <small><span class="kind">${fn[E.kind]}</span> · ${Mk(E,c,this.historySeries,O.size)}</small>
          ${C?h`<span class="facts">${Ek(this.host(),a,E,O).map(_=>h`<span class="fact"><b>${_.label}</b> ${_.value}</span>`)}</span>`:f}
        </span>
        <span class="right">
          <span class="badges">
            ${H?h`<span class="badge tap" title=${`Tappable \xB7 ${Fe(H,d)}`}>tap</span>`:f}
            ${E.payload.rules.length===0?f:h`<span class="badge states" title=${X}>${X.replace(/\.$/,"").toLowerCase()}</span>`}
            ${z?h`<span class="badge">hidden</span>`:f}
          </span>
          ${i?h`<span class="acts">
            <button class="icon" title=${`Bring forward (${Cn}])`} aria-label="Bring forward" @click=${_=>{_.stopPropagation(),r(K,1)}}>${V("up")}</button>
            <button class="icon" title=${`Send back (${Cn}[)`} aria-label="Send back" @click=${_=>{_.stopPropagation(),r(K,-1)}}>${V("down")}</button>
            <button class="icon" title=${`${O.isHidden?"Show":"Hide"} (${bd}${Cn}H)`} aria-label=${O.isHidden?"Show this layer":"Hide this layer"} @click=${_=>{_.stopPropagation(),this.mutate(B=>$e(B,a,K,{isHidden:!O.isHidden}))}}>${V(O.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${Cn}D)`} aria-label="Duplicate" @click=${_=>{_.stopPropagation(),o(K)}}>${V("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${_=>{_.stopPropagation(),s(K)}}>${V("delete")}</button>
          </span>`:f}
        </span>
      </div>`},M=(E,N)=>{let j=this.inspect.kind==="group"&&this.inspect.id===E.id,K=!this.collapsed.has(E.id),q=this.rowDrag(E.id,i),O=N[0],z=N[N.length-1],H=x=>{let S=x.currentTarget,_=S.getBoundingClientRect(),B=_.top+(S.classList.contains("drop-before")?Wt:0),W=_.bottom-(S.classList.contains("drop-after")?Wt:0),Z=(x.clientY-B)/Math.max(1,W-B);return Z<.25?"drop-before":!K&&Z>.75?"drop-after":"drop-into"},X=N.map(x=>x.payload.id);return h`<div class="layer group ${j?"hl":""} ${C?"rich":""}" style=${`--k:${J.group}`} tabindex="0" draggable=${q.draggable}
        @pointerenter=${()=>{this.listHoverIds=X}}
        @pointerleave=${()=>this.leaveRow(X)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:E.id}}}
        @keydown=${x=>{x.key==="Enter"&&(this.inspect={kind:"group",id:E.id})}}
        @dragstart=${q.onStart} @dragend=${q.onEnd}
        @dragover=${x=>{!this.dragId||this.dragId===E.id||(x.preventDefault(),this.markDrop(x.currentTarget,H(x)))}}
        @drop=${x=>{x.preventDefault();let S=H(x);this.clearDragMarks();let _=this.dragId;if(this.dragId=void 0,!(!_||!O||!z)){if(S==="drop-before"){this.reorderLayer(_,O.payload.id,!0,!0);return}if(S==="drop-after"){this.reorderLayer(_,z.payload.id,!1,!0);return}this.isGroupId(_)||(this.reorderLayer(_,O.payload.id,!0),this.mutate(B=>sa(B,_,E.id)))}}}>
        <span class="grip" title="Drag to reorder the whole group.">${V("grip")}</span>
        <span class="bar"></span>
        <span class="folder">${V("folder")}</span>
        <span class="name">
          <b>${E.name}</b>
          <small><span class="kind">Group</span> · ${N.length} layer${N.length===1?"":"s"} · ${E.locked?"locked":"unlocked"}</small>
          ${C?h`<span class="facts"><span class="fact"><b>Holds</b> ${N.map(x=>Fe(x,d)).join(", ")}</span></span>`:f}
        </span>
        <span class="right">
          ${i?h`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${bd}${Cn}G)`} aria-label="Ungroup" @click=${x=>{x.stopPropagation(),this.mutate(S=>vi(S,E.id)),j&&(this.inspect={kind:"general"})}}>${V("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${E.locked?"on":""}" ?disabled=${!i}
            title=${E.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${E.locked?"Unlock the group":"Lock the group"}
            @click=${x=>{x.stopPropagation(),this.mutate(S=>{let _=S.groups?.find(B=>B.id===E.id);_&&(_.locked=!_.locked)})}}>${V(E.locked?"lock":"unlock")}</button>
          <button class="chev" aria-expanded=${K?"true":"false"} title=${K?"Fold the group":"Unfold the group"}
            @click=${x=>{x.stopPropagation();let S=new Set(this.collapsed);K?S.add(E.id):S.delete(E.id),this.collapsed=S}}>${V("chevron")}</button>
        </span>
      </div>`},A=[],F=new Set;for(let E=0;E<l.length;E++){let N=l[E],j=N.payload.groupId,K=j===void 0?void 0:t.groups?.find(z=>z.id===j);if(!K){A.push(R(N,!1));continue}if(F.has(K.id))continue;F.add(K.id);let q=l.filter(z=>z.payload.groupId===K.id);A.push(M(K,q));let O=this.inspect.kind==="group"&&this.inspect.id===K.id;this.collapsed.has(K.id)||A.push(h`<div class="group-kids">${q.map(z=>R(z,!0,O))}</div>`)}return h`<div class="card layers-card s${this.thumbStep}" style=${`--thumb-w:${$}px;--thumb-h:${k}px`}>
      <h2 class="panel-title tools" style=${`--c:${J.place}`}><span class="swatch">${V("layers")}</span>Layers
        <span class="mini">top draws last</span><span class="spacer"></span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([E,N])=>h`
              <button class=${this.layerDetail===E?"on":""} title=${N} aria-label=${N} aria-pressed=${this.layerDetail===E?"true":"false"}
                @click=${()=>{this.layerDetail=E,this.saveListView()}}>${V(E)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${bk.map((E,N)=>h`
              <button class=${this.thumbStep===N?"on":""} title=${`${nf[N]} row pictures`}
                aria-label=${`${nf[N]} row pictures`} aria-pressed=${this.thumbStep===N?"true":"false"}
                @click=${()=>{this.thumbStep=N,this.saveListView()}}>${E}</button>`)}
          </span>
        </span>
      </h2>
      ${g>=2&&i?h`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${Cn}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?h`<div class="hint">${Oa}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:f}
      ${t.elements.length===0?h`<div class="empty">No layers yet. Add one above.</div>`:f}
      ${this.renderShapeIsBlank(t,a,i)}
      <div class="layers">
      ${A}
      </div>
      <div class="layer pinned ${p?"hl":""}" style=${`--k:${J.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${E=>{E.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${E=>{this.dragId&&(E.preventDefault(),this.markDrop(E.currentTarget,"drop-before"))}}
        @drop=${E=>{E.preventDefault(),this.clearDragMarks();let N=this.dragId,j=[...l].reverse().find(K=>K.payload.id!==N&&K.payload.groupId!==N);N&&j&&this.reorderLayer(N,j.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${V("shape")}</span>
        <span class="bar"></span>
        ${v([])}
        <span class="name">
          <b>${ne(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${m}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
    </div>`}renderInlineHasNoLayers(){return h`<div class="card">
      <h2 class="panel-title"><span class="swatch">${V("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderPresetDialog(){let t=this.presetKind?$m(this.presetKind):void 0,i=this.presetEntity;return h`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?f:h`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${Et(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Jm,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){this.canEdit&&(this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=Tm(s,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return h`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.draft?.config;if(!t)return h`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=hn(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return h`
      <div class="card canvas-card">
        <div class="canvas-bar">
          <div class="bar-row shapes">${this.renderShapeTabs(t,i)}</div>
          <div class="bar-row tools">
          <span class="inbox" title=${`Layouts are made in the ${Mi.label} box. Smaller cases scale it down.`}>
            <span class="pre">Preview as</span>
            <span class="case-tool" data-menu="case">
              <button class="case-pick" aria-haspopup="listbox" aria-expanded=${this.openMenu==="case"?"true":"false"}
                aria-label=${`Preview as ${a.label}`} @click=${()=>this.toggleMenu("case")}>
                ${a.label}${a.measured?"":" (estimated)"}${V("chevron")}
              </button>
              ${this.openMenu==="case"?h`<div class="pop-menu" role="listbox" aria-label="Preview as">
                ${xa.map(o=>h`<button class="row" role="option" aria-selected=${o.label===a.label?"true":"false"}
                  @click=${()=>{this.toggleMenu("case",!1),this.previewCase=o.label}}>${o.label}${o.measured?"":" (estimated)"}</button>`)}
              </div>`:f}
            </span>
          </span>
          ${r==="inline"?f:this.renderTintTool()}
          <span class="bar-sep" aria-hidden="true"></span>
          <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderGridButton()}</span>
          <span class="spacer"></span>
          ${this.renderZoomButton()}
          </div>
        </div>
        <div class="stage">
          ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
          ${this.renderUnder(t,r)}
        </div>
        ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):f}
      </div>
      <div class="under-grid">
        ${this.renderValuesRow()}
      </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.draft?.config,l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?ot(s,o)?.id:void 0,d=s&&l!==void 0&&(this.inspect.kind==="group"||ot(s,o)?.locked)?ct(s,l).map(b=>b.payload.id):[],c=[...new Set([...d,...this.multi])],u=a.slots[t],p=this.focusTapId(),m=!this.picking&&!this.showTaps&&this.rowHoverId!==void 0&&s?.elements.some(b=>b.payload.id===this.rowHoverId)?this.rowHoverId:void 0,g=m!==void 0?[]:this.listHoverIds,y={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:u,highlightId:p??m??o,...c.length>0&&!this.showTaps&&m===void 0?{highlightIds:c}:{},...this.showGridLines&&(this.snapGrid||this.altHeld&&this.canEdit)?{grid:this.gridStep}:{},tapReview:this.showTaps,...this.previewTint!==void 0?{tint:this.previewTint}:{},...p!==void 0?{tapFocusId:p}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||p!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:g.length>0?{hoverIds:g}:{}};return h`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${b=>this.onPreviewPointerDown(t,b)}
      @pointermove=${b=>this.onPickMove(b)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${Ai(r,y)}
    </div>`}renderUnder(t,i){let a=me(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(u=>u.payload.id===r.id):void 0,s;if(this.showTaps)s=h`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Dt(t.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let u=t.groups?.find(m=>m.id===r.id),p=u?ct(t,u.id).length:0;s=u?h`editing group <b>${u.name}</b>. Drag to move all ${p} layers.${u.locked?"":" Click one layer to move it alone."}`:""}else if(o){let u=ot(t,o.payload.id);s=u?.locked?h`editing <b>${Fe(o,a)}</b> in <b>${u.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:h`editing <b>${Fe(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.${this.snapGrid?" It snaps to the grid. Hold Alt to drag freely.":" Hold Alt while dragging to snap to the grid."}`}else s="click a layer to edit it";if(i==="inline")return h`<div class="under"><b>Inline</b><span class="dot">·</span><span class="tail">${s}</span></div>`;let l=this.currentCase().slots[i],d=Br(l,i),c=Math.round(d.scale*100);return h`<div class="under">
      <b>${ne(i)}</b>
      <span class="size">${l.width} × ${l.height} pt${c!==100?` \xB7 ${c}%`:""}</span>
      <span class="dot">·</span>
      <span class="tail">${s}</span>
    </div>`}renderInlinePreview(t,i){let a;if(!t)a=h`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?Ti((t.countdownEnd-r)/1e3):t.text,s=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=h`<div class="inline-line">${s??f}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:h`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSharedValues(){let t=this.draft?.config;if(!t)return f;let i=t.values,a=this.canEdit?h`<button class="small" @click=${()=>{let c=nm();this.mutate(u=>{u.values.push(c)}),this.openSharedValue(c.id)}}>Add</button>`:f,r="Like a variable: set it once, and every layer that reads it follows.",o=h`<h2 class="panel-title"><span class="swatch">${V("content")}</span>Shared values
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
      </div>`:f}`;if(i.length===0)return h`<div class="card tint-values values-list ${this.sharedHelp?"":"empty-list"}" style=${`--c:${J.complication}`}>
        ${o}
      </div>`;let s=this.host(),l=new $t(this.buildContext(),this.draft?.config),d=me(s);return h`<div class="card tint-values values-list" style=${`--c:${J.complication}`}>
      ${o}
      <div class="data">
      ${i.map(c=>{let u=l.resolve({kind:{kind:"named",id:c.id}}),p=this.openValue===c.id,m=()=>{this.setOpenValue(p?void 0:c.id)};return h`<div class="vitem ${p?"open":""}"><div class="datum vrow ${p?"hl":""}" role="button" tabindex="0" aria-expanded=${p?"true":"false"}
            title=${p?"Close":"Edit this shared value"}
            @click=${m}
            @keydown=${g=>{(g.key==="Enter"||g.key===" ")&&g.target===g.currentTarget&&(g.preventDefault(),m())}}>
          <span class="nm">${c.name||"(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${u===void 0?"none":""}" title=${Me(c.value,d)}>${u??"unresolved"}</span>
          ${this.canEdit?h`<button class="icon danger" title="Delete. Layers that read it keep their own copy." aria-label="Delete value" @click=${g=>{g.stopPropagation(),this.mutate(y=>{Ps(y,c.id)}),p&&(this.openValue=void 0)}}>${V("delete")}</button>`:f}
        </div>
        ${p?h`<div class="value-open">${tm(s,c)}</div>`:f}</div>`})}
      </div>
    </div>`}setOpenValue(t){let i=this.openValue;if(this.openValue=t,i===void 0||i===t)return;let a=this.draft?.config.values.find(r=>r.id===i);a&&a.name.trim()===""&&this.mutate(r=>{Ps(r,i)})}openSharedValue(t){this.renderRoot.querySelectorAll(":popover-open").forEach(a=>a.hidePopover()),this.setOpenValue(t);let i=this.draft?.config.values.find(a=>a.id===t)?.name.trim()==="";this.updateComplete.then(()=>{this.renderRoot.querySelector(".values-list .datum.hl")?.scrollIntoView({block:"start",behavior:"smooth"}),i&&this.renderRoot.querySelector(".values-list .value-open input[type=text]")?.focus({preventScroll:!0})})}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapeTabs(t,i){let a=t.supportedFamilies,r=mn.filter(o=>!a.includes(o));return h`<div class="shape-seg" role="group" aria-label="Shapes">${this.renderHaveTabs(t,i)}</div>
      ${r.length>0?h`<span class="shape-adds">${r.map(o=>h`<button class="tab off ${o}" ?disabled=${!this.canEdit}
        title=${`Add the ${ne(o)} shape`} @click=${()=>this.addShape(o)}>${V("plus")}${ne(o)}</button>`)}</span>`:f}`}renderHaveTabs(t,i){let a=t.supportedFamilies;return mn.filter(r=>a.includes(r)).map(r=>{let o=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?Ai(c,{icons:this.icons,imageSizes:this.imageSizes,slot:Mi.slots[r]}):f}let l=r!=="inline"&&Eo(t,r)===0&&t.elements.length>0,d=this.canEdit&&Gr(t,r);return h`<span class="tab-wrap">
        <button class="tab ${r}" aria-pressed=${o?"true":"false"} title=${`Edit the ${ne(r)} shape`}
          @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
          <span class="art">${s}</span>
          <span class="lbl">${ne(r)}</span>${l?h`<small>nothing shown</small>`:f}
        </button>
        ${this.canEdit?h`<button class="icon danger tab-x" ?disabled=${!d}
          title=${d?`Remove the ${ne(r)} shape`:"The only shape. Add another before removing it."}
          aria-label=${`Remove the ${ne(r)} shape`}
          @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${V("delete")}</button>`:f}
      </span>`})}renderValuesRow(){let t=this.draft?.config;if(!t)return f;let i=[...this.compiled?.entities.keys()??[]],a=gu(t),r=this.testValues.size>0;return h`<div class="card tint-states" style=${`--c:${J.states}`}>
      <h2 class="panel-title"><span class="swatch">${V("states")}</span>Values on the watch
        <span class="mini">live · slide, pick or type one to try another</span><span class="spacer"></span>
        ${r?h`<span class="testing-pill">Testing with your values <button @click=${()=>{this.editingValue=void 0,this.applyTestValues(new Map)}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0&&a.length===0?h`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:h`<div class="chips values">
        ${i.map(o=>{let s=this.hass.states[o],l=typeof s?.attributes.friendly_name=="string"?s.attributes.friendly_name:o,d=typeof s?.attributes.unit_of_measurement=="string"?` ${s.attributes.unit_of_measurement}`:"",c=s?`${s.state}${d}`:"not in Home Assistant",u=this.testValues.get(o),m=t.elements.find(g=>Rr(t,g.payload.id).some(y=>y.ref.entityId===o))?.kind??"text";return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${Ze[m]}`}
            title=${u!==void 0?`Live value: ${c}`:""}>
            <span class="kbar"></span><b>${l}</b><span class="spacer"></span>
            ${this.renderTestControl(o,l,s,u,d,c)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the live value: ${c}`} @click=${()=>this.setTestValue(o,void 0)}>Live</button>`:f}
          </div>`})}
        ${a.map(o=>{let s=Us(o.id),l=this.sharedRaw(o.id)??"",d=l===""?"empty":l,c=o.name||"(unnamed)",u=this.testValues.get(s),p={entity_id:s,state:l,attributes:{},last_changed:"",last_updated:""};return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${J.complication}`}
            title=${u!==void 0?`Saved value: ${d}`:""}>
            <span class="kbar"></span><b>${c}</b><span class="vtag" title="A shared value. Trying one here is not saved; change it in Shared values to keep it.">shared</span><span class="spacer"></span>
            ${this.renderTestControl(s,c,p,u,"",d)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the saved value: ${d}`} @click=${()=>this.setTestValue(s,void 0)}>Live</button>`:f}
          </div>`})}
      </div>`}
    </div>`}renderTestControl(t,i,a,r,o,s){let l=r??a?.state??"",d=bu(t,a,r);if(d.kind==="choice")return h`<span class="test-ctl"><select aria-label=${`Test value for ${i}`} @change=${m=>this.setTestValue(t,m.target.value)}>
        ${d.options.map(m=>h`<option value=${m} ?selected=${m===l}>${m}</option>`)}
      </select></span>`;let c=this.editingValue===t?h`<input type="text" .value=${l} aria-label=${`Test value for ${i}`}
          @keydown=${m=>{m.key==="Enter"&&m.target.blur(),m.key==="Escape"&&(this.editingValue=void 0)}}
          @blur=${m=>this.commitTestValue(t,m.target.value)} />`:h`<button type="button" class="val" title="Click to type a value"
          @click=${()=>{this.editingValue=t,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input[type=text]")?.focus())}}>${r!==void 0?`${r}${o}`:s}</button>`;if(d.kind==="text")return h`<span class="test-ctl">${c}</span>`;let u=Number(l),p=l.trim()!==""&&Number.isFinite(u)?u:d.min;return h`<span class="test-ctl">
      <input type="range" min=${d.min} max=${d.max} step=${d.step} .value=${String(p)}
        aria-label=${`Slide the test value for ${i}`}
        @input=${m=>this.setTestValue(t,m.target.value,`test-${t}`)}
        @change=${()=>this.draft?.endGesture()} />
      ${c}
    </span>`}commitTestValue(t,i){this.editingValue=void 0,this.setTestValue(t,i)}setTestValue(t,i,a){let r=i?.trim()??"",o=new Map(this.testValues),s=t.startsWith(Hr)?this.sharedRaw(t.slice(Hr.length)):this.hass.states[t]?.state;r===""||r===s?o.delete(t):o.set(t,r),this.applyTestValues(o,a)}sharedRaw(t){let i=this.draft?.config;if(!i)return;let a=this.buildContext(!1),r=a.namedValues.map(o=>({...o,value:{kind:o.value.kind}}));return new $t({...a,namedValues:r},i).resolve({kind:{kind:"named",id:t}})}applyTestValues(t,i){let a=this.draft;!a||t.size===a.testValues.size&&[...t].every(([o,s])=>a.testValues.get(o)===s)||(a.setTestValues(t,i),this.version++)}currentCase(){return xa.find(t=>t.label===this.previewCase)??Mi}previewSlot(t){return this.currentCase().slots[t]}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":ne(this.activeFamily),s=a.kind==="family"&&i===void 0?h`<span class="here" style=${`--k:${J.place}`}>${o} shape</span>`:h`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=f,d=f;if(i!==void 0)l=h`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span><span class="nm">${i} layers</span></span>`;else if(a.kind==="layer"){let c=t.elements.find(u=>u.payload.id===a.id);if(c){l=h`<span class="here" style=${`--k:${Ze[c.kind]}`} title=${Fe(c,me(this.host()))}><span class="kchip">${fn[c.kind]}</span></span>`;let u=ot(t,c.payload.id);u&&(d=h`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:u.id}}} title="Edit the group">${u.name}</button>`)}}else if(a.kind==="group"){let c=t.groups?.find(u=>u.id===a.id);c&&(l=h`<span class="here" style=${`--k:${J.group}`} title=${c.name}><span class="kchip">Group</span></span>`)}return h`<div class="crumbs">
      <button title="Edit the complication" @click=${()=>{this.multi=new Set,this.inspect={kind:"general"}}}>${r}</button><span class="sep">›</span>${s}${d}
      ${l===f?f:h`<span class="sep">›</span>${l}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}complicationHead(t){let i=t.name.trim()||"Complication";return h`<div class="insp-head comp-head">
      <div class="crumbs"><span class="here" style=${`--k:${J.complication}`}>${i}</span></div>
      <span class="comp-acts">
        <button class="ghost" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?h`
          <button class="ghost" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?h`<button class="ghost danger" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="ghost" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:h`<button class="ghost danger" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:f}
      </span>
    </div>`}renderInspector(){let t=this.draft?.config;if(!t)return f;let i=this.pickedElements(t);if(i.length>=2)return h`
        <div class="insp-head">${this.crumbs(t,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(t,i)}</div>`;let a=this.host(),r=this.inspect,o=this.canEdit?"":"pointer-events:none;opacity:.6";if(r.kind==="general")return h`
        ${this.complicationHead(t)}
        <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>
          ${Te(a,"complication","Complication",Qh(a),{color:J.complication,icon:"watch",alwaysOpen:!0})}
          <p class="insp-note">Click a layer on the watch or in the list to edit it. The shape's own background and border are the bottom row of the list.</p>
        </div>`;let s=f,l=!0;if(r.kind==="layer"){let c=t.elements.find(u=>u.payload.id===r.id);if(!c)return this.inspect={kind:"general"},f;s=lm(a,c,this.canvasFamily,{placement:!0,tap:!0})}else if(r.kind==="group"){let c=t.groups?.find(u=>u.id===r.id);if(!c)return this.inspect={kind:"general"},f;l=!1,s=pm(a,c)}else s=hm(a,this.activeFamily);let d=this.openSections.size>1;return h`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${l?h`<button class="expand" @click=${()=>{this.openSections=d?new Set([gk(r)]):new Set(Gl)}}>${d?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>${s}</div>`}triCheck(t,i,a){return h`<label class="field check">
      <span>${t}${i==="mixed"?h` <span class="mixed">(mixed)</span>`:f}</span>
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} /></label>`}multiEditor(t,i){let a=this.canvasFamily,r=this.host(),o=me(r),s=new $t(this.buildContext(),this.draft?.config),l=am(t,a,i),d=i.length,c=[...i].reverse(),u=m=>this.mutate(g=>{for(let y of i)$e(g,a,y.payload.id,{isHidden:m})}),p=m=>this.mutate(g=>{for(let y of i){let b=g.elements.find($=>$.payload.id===y.payload.id);b&&b.kind!=="image"&&b.kind!=="tap"&&b.kind!=="timeline"&&b.kind!=="chartTimes"&&b.kind!=="chartDots"&&b.kind!=="chartGrid"&&b.kind!=="imageTime"&&(b.payload.colorSlot.baseColorHex=m)}},"multi-colour");return h`
      ${Te(r,"picked",`${d} layers picked`,h`
          <div class="field list-field"><span>Layers</span>
            <div class="picked">
              ${c.map(m=>h`<div class="row" style=${`--k:${Ze[m.kind]}`}>
                <span class="bar"></span>
                <span class="name">
                  ${m.kind==="icon"?h`<span class="glyph">${this.icons.render(s.resolve(m.payload.symbol)??"questionmark",16,m.payload.colorSlot.baseColorHex)??f}</span>`:f}
                  <b>${Fe(m,o)}</b><span class="kind">${fn[m.kind]}</span>
                </span>
              </div>`)}
            </div>
            <div class="row-acts">
              <button class="small primary" title=${`Group (${Cn}G)`} @click=${()=>this.groupPicked()}>Group them</button>
              <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
            </div>
          </div>
          <div class="hint">${Oa}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>`,{color:"var(--wa-accent)",icon:"layers",summary:`Edits here land on all ${d}`,alwaysOpen:!0})}
      ${Te(r,"picked-common",`All ${d} at once`,h`
          ${this.triCheck("Hidden",l.hiddenHere,u)}
          ${l.colourable?h`${be("Colour",l.colour,m=>{m!==void 0&&p(m)})}
              ${l.colour===void 0?h`<div class="hint keep">These layers are different colours. Pick one to give them all the same.</div>`:f}`:h`<div class="hint keep">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">These layers are on the ${ne(a)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>`,{color:J.place,icon:"place",summary:"The settings every picked layer has",alwaysOpen:!0})}`}renderFooter(){let t=this.draft;if(!t)return f;let i=this.records.find(r=>r.id===this.selectedId),a=Ep({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return h`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${t.dirty?h` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?h`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:f}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?h`<pre>${JSON.stringify(t.encoded(),null,2)}</pre>`:f}
      </div>
    </details>`}};L([hi({attribute:!1})],I.prototype,"hass",2),L([hi({type:Boolean})],I.prototype,"narrow",2),L([hi({attribute:!1})],I.prototype,"panel",2),L([P()],I.prototype,"colLeft",2),L([P()],I.prototype,"colRight",2),L([P()],I.prototype,"panelWidth",2),L([P()],I.prototype,"owners",2),L([P()],I.prototype,"ownerId",2),L([P()],I.prototype,"records",2),L([P()],I.prototype,"selectedId",2),L([P()],I.prototype,"draft",2),L([P()],I.prototype,"readOnlyReason",2),L([P()],I.prototype,"parseError",2),L([P()],I.prototype,"maxSchemaVersion",2),L([P()],I.prototype,"presets",2),L([P()],I.prototype,"occupied",2),L([P()],I.prototype,"serverToken",2),L([P()],I.prototype,"appliedToken",2),L([P()],I.prototype,"sendStatusKnown",2),L([P()],I.prototype,"polling",2),L([P()],I.prototype,"lastPollSeconds",2),L([P()],I.prototype,"sendPending",2),L([P()],I.prototype,"pages",2),L([P()],I.prototype,"templateResults",2),L([P()],I.prototype,"historySeries",2),L([P()],I.prototype,"historyReadings",2),L([P()],I.prototype,"templateError",2),L([P()],I.prototype,"templateFetchedAt",2),L([P()],I.prototype,"forced",2),L([P()],I.prototype,"showRaw",2),L([P()],I.prototype,"inspect",2),L([P()],I.prototype,"openSections",2),L([P()],I.prototype,"helpSections",2),L([P()],I.prototype,"pickerOpen",2),L([P()],I.prototype,"pickerFilter",2),L([P()],I.prototype,"pickerNote",2),L([P()],I.prototype,"pickerHiddenOpen",2),L([P()],I.prototype,"pickerConfirmDelete",2),L([P()],I.prototype,"openValue",2),L([P()],I.prototype,"sharedHelp",2),L([P()],I.prototype,"editingValue",2),L([P()],I.prototype,"thumbStep",2),L([P()],I.prototype,"layerDetail",2),L([P()],I.prototype,"addOpen",2),L([P()],I.prototype,"addDetail",2),L([P()],I.prototype,"multi",2),L([P()],I.prototype,"copiedPosition",2),L([P()],I.prototype,"snapGrid",2),L([P()],I.prototype,"gridStep",2),L([P()],I.prototype,"showGridLines",2),L([P()],I.prototype,"openMenu",2),L([P()],I.prototype,"altHeld",2),L([P()],I.prototype,"collapsed",2),L([P()],I.prototype,"activeFamily",2),L([P()],I.prototype,"picking",2),L([P()],I.prototype,"pickHoverId",2),L([P()],I.prototype,"listHoverIds",2),L([P()],I.prototype,"rowHoverId",2),L([P()],I.prototype,"zoomed",2),L([P()],I.prototype,"helpOpen",2),L([P()],I.prototype,"showTaps",2),L([P()],I.prototype,"savedName",2),L([P()],I.prototype,"presetKind",2),L([P()],I.prototype,"presetEntity",2),L([P()],I.prototype,"newOpen",2),L([P()],I.prototype,"newName",2),L([P()],I.prototype,"newFamily",2),L([P()],I.prototype,"shareOpen",2),L([P()],I.prototype,"shareMode",2),L([P()],I.prototype,"shareLabels",2),L([P()],I.prototype,"shareNote",2),L([P()],I.prototype,"shareTextOpen",2),L([P()],I.prototype,"galleryOpen",2),L([P()],I.prototype,"galleryGroupNames",2),L([P()],I.prototype,"galleryValueNames",2),L([P()],I.prototype,"galleryTitle",2),L([P()],I.prototype,"galleryDescription",2),L([P()],I.prototype,"galleryTags",2),L([P()],I.prototype,"galleryNickname",2),L([P()],I.prototype,"galleryConfirmed",2),L([P()],I.prototype,"galleryPreviews",2),L([P()],I.prototype,"galleryPreviewNote",2),L([P()],I.prototype,"gallerySending",2),L([P()],I.prototype,"gallerySent",2),L([P()],I.prototype,"galleryError",2),L([P()],I.prototype,"galleryUploads",2),L([P()],I.prototype,"galleryUploadsError",2),L([P()],I.prototype,"galleryConfirmDelete",2),L([P()],I.prototype,"galleryDeleting",2),L([P()],I.prototype,"importOpen",2),L([P()],I.prototype,"importText",2),L([P()],I.prototype,"importParse",2),L([P()],I.prototype,"importName",2),L([P()],I.prototype,"importMap",2),L([P()],I.prototype,"importDrop",2),L([P()],I.prototype,"importTextShown",2),L([P()],I.prototype,"importHistory",2),L([P()],I.prototype,"shareLink",2),L([P()],I.prototype,"helpTab",2),L([P()],I.prototype,"linkNote",2),L([P()],I.prototype,"previewCase",2),L([P()],I.prototype,"previewTint",2),L([P()],I.prototype,"loadError",2),L([P()],I.prototype,"saveError",2),L([P()],I.prototype,"saving",2),L([P()],I.prototype,"conflict",2),L([P()],I.prototype,"remoteRevision",2),L([P()],I.prototype,"confirmDelete",2),L([P()],I.prototype,"moveTarget",2),L([P()],I.prototype,"moving",2),L([P()],I.prototype,"moveError",2),L([P()],I.prototype,"version",2);var kd=I;function Mt(e){return String(e?.message??e)}function Tk(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function df(e){let n=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function Ek(e,n,t,i){let a=[{label:"Shows",value:ql(e,t)}],r=bo(t);return r&&a.push({label:"Looks",value:r}),i.frame.rotationDegrees!==0&&a.push({label:"Turned",value:`${Math.round(i.frame.rotationDegrees)}\xB0`}),a}function Rk(e){return e<120?`${e} min`:e%1440===0?`${e/1440} d`:e%60===0?`${e/60} h`:`${e} min`}function Mk(e,n,t,i){let a=r=>h`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return h`${a(n.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${Le(e.payload.colorSlot.baseColorHex)}`;case"gauge":return h`${a(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=wt(e.payload)??vt(e.payload),o=r!==void 0?t.get(r)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Je(o).length} values`}case"timeline":{let r=qe(e.payload),o=r===void 0?[]:fa(t.get(r)??""),s=Math.max(0,o.length-1);return`${Rk(dt(e.payload))} \xB7 ${s} ${s===1?"change":"changes"}`}case"shape":return`${Le(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return e.payload.contentMode==="fill"?"fill":"fit";case"tap":return Dt(e.payload.action);case"chartTimes":return`${e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt`;case"chartDots":return`${e.payload.dots==="all"?"every reading":"auto"}${e.payload.size===void 0?"":` \xB7 ${e.payload.size} pt`}`;case"chartGrid":return`${e.payload.lines} ${e.payload.lines===1?"line":"lines"} \xB7 ${e.payload.thickness} pt`;case"imageTime":return}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",kd);export{kd as WristAssistantPanel,lf as columnFit,Ek as layerFacts};
