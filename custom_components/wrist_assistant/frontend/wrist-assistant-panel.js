var il=Object.defineProperty;var al=Object.getOwnPropertyDescriptor;var A=(e,n,t,i)=>{for(var a=i>1?void 0:i?al(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&il(n,t,a),a};var yn=globalThis,bn=yn.ShadowRoot&&(yn.ShadyCSS===void 0||yn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yi=Symbol(),Va=new WeakMap,Kt=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==yi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(bn&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=Va.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&Va.set(t,n))}return n}toString(){return this.cssText}},se=e=>new Kt(typeof e=="string"?e:e+"",void 0,yi),bi=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new Kt(t,e,yi)},Ba=(e,n)=>{if(bn)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=yn.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},vi=bn?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return se(t)})(e):e;var{is:rl,defineProperty:ol,getOwnPropertyDescriptor:sl,getOwnPropertyNames:ll,getOwnPropertySymbols:dl,getPrototypeOf:cl}=Object,vn=globalThis,Ga=vn.trustedTypes,pl=Ga?Ga.emptyScript:"",ul=vn.reactiveElementPolyfillSupport,Wt=(e,n)=>e,jt={toAttribute(e,n){switch(n){case Boolean:e=e?pl:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},xn=(e,n)=>!rl(e,n),Ua={attribute:!0,type:String,converter:jt,reflect:!1,useDefault:!1,hasChanged:xn};Symbol.metadata??=Symbol("metadata"),vn.litPropertyMetadata??=new WeakMap;var Ne=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=Ua){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&ol(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=sl(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(n,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Ua}static _$Ei(){if(this.hasOwnProperty(Wt("elementProperties")))return;let n=cl(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Wt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Wt("properties"))){let t=this.properties,i=[...ll(t),...dl(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(vi(a))}else n!==void 0&&t.push(vi(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ba(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:jt).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:jt;this._$Em=a;let s=o.fromAttribute(t,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??xn)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};Ne.elementStyles=[],Ne.shadowRootOptions={mode:"open"},Ne[Wt("elementProperties")]=new Map,Ne[Wt("finalized")]=new Map,ul?.({ReactiveElement:Ne}),(vn.reactiveElementVersions??=[]).push("2.1.2");var Ei=globalThis,Ka=e=>e,wn=Ei.trustedTypes,Wa=wn?wn.createPolicy("lit-html",{createHTML:e=>e}):void 0,Za="$lit$",Ze=`lit$${Math.random().toFixed(9).slice(2)}$`,Qa="?"+Ze,hl=`<${Qa}>`,st=document,Yt=()=>st.createComment(""),Jt=e=>e===null||typeof e!="object"&&typeof e!="function",Ti=Array.isArray,ml=e=>Ti(e)||typeof e?.[Symbol.iterator]=="function",xi=`[ 	
\f\r]`,qt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ja=/-->/g,qa=/>/g,rt=RegExp(`>|${xi}(?:([^\\s"'>=/]+)(${xi}*=${xi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ya=/'/g,Ja=/"/g,er=/^(?:script|style|textarea|title)$/i,Fi=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),u=Fi(1),b=Fi(2),Bp=Fi(3),lt=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Xa=new WeakMap,ot=st.createTreeWalker(st,129);function tr(e,n){if(!Ti(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wa!==void 0?Wa.createHTML(n):n}var fl=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=qt;for(let s=0;s<t;s++){let l=e[s],d,c,p=-1,h=0;for(;h<l.length&&(o.lastIndex=h,c=o.exec(l),c!==null);)h=o.lastIndex,o===qt?c[1]==="!--"?o=ja:c[1]!==void 0?o=qa:c[2]!==void 0?(er.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=rt):c[3]!==void 0&&(o=rt):o===rt?c[0]===">"?(o=a??qt,p=-1):c[1]===void 0?p=-2:(p=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?rt:c[3]==='"'?Ja:Ya):o===Ja||o===Ya?o=rt:o===ja||o===qa?o=qt:(o=rt,a=void 0);let f=o===rt&&e[s+1].startsWith("/>")?" ":"";r+=o===qt?l+hl:p>=0?(i.push(d),l.slice(0,p)+Za+l.slice(p)+Ze+f):l+Ze+(p===-2?s:f)}return[tr(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},Xt=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,s=n.length-1,l=this.parts,[d,c]=fl(n,t);if(this.el=e.createElement(d,i),ot.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(a=ot.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let p of a.getAttributeNames())if(p.endsWith(Za)){let h=c[o++],f=a.getAttribute(p).split(Ze),g=/([.?@])?(.*)/.exec(h);l.push({type:1,index:r,name:g[2],strings:f,ctor:g[1]==="."?ki:g[1]==="?"?$i:g[1]==="@"?Ci:Ft}),a.removeAttribute(p)}else p.startsWith(Ze)&&(l.push({type:6,index:r}),a.removeAttribute(p));if(er.test(a.tagName)){let p=a.textContent.split(Ze),h=p.length-1;if(h>0){a.textContent=wn?wn.emptyScript:"";for(let f=0;f<h;f++)a.append(p[f],Yt()),ot.nextNode(),l.push({type:2,index:++r});a.append(p[h],Yt())}}}else if(a.nodeType===8)if(a.data===Qa)l.push({type:2,index:r});else{let p=-1;for(;(p=a.data.indexOf(Ze,p+1))!==-1;)l.push({type:7,index:r}),p+=Ze.length-1}r++}}static createElement(n,t){let i=st.createElement("template");return i.innerHTML=n,i}};function Tt(e,n,t=e,i){if(n===lt)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=Jt(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=Tt(e,a._$AS(e,n.values),a,i)),n}var wi=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??st).importNode(t,!0);ot.currentNode=a;let r=ot.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new Zt(r,r.nextSibling,this,n):l.type===1?d=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(d=new Si(r,this,n)),this._$AV.push(d),l=i[++s]}o!==l?.index&&(r=ot.nextNode(),o++)}return ot.currentNode=st,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},Zt=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=Tt(this,n,t),Jt(n)?n===m||n==null||n===""?(this._$AH!==m&&this._$AR(),this._$AH=m):n!==this._$AH&&n!==lt&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):ml(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==m&&Jt(this._$AH)?this._$AA.nextSibling.data=n:this.T(st.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=Xt.createElement(tr(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new wi(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=Xa.get(n.strings);return t===void 0&&Xa.set(n.strings,t=new Xt(n)),t}k(n){Ti(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(Yt()),this.O(Yt()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=Ka(n).nextSibling;Ka(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ft=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=m}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=Tt(this,n,t,0),o=!Jt(n)||n!==this._$AH&&n!==lt,o&&(this._$AH=n);else{let s=n,l,d;for(n=r[0],l=0;l<r.length-1;l++)d=Tt(this,s[i+l],t,l),d===lt&&(d=this._$AH[l]),o||=!Jt(d)||d!==this._$AH[l],d===m?n=m:n!==m&&(n+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!a&&this.j(n)}j(n){n===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},ki=class extends Ft{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===m?void 0:n}},$i=class extends Ft{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==m)}},Ci=class extends Ft{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=Tt(this,n,t,0)??m)===lt)return;let i=this._$AH,a=n===m&&i!==m||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==m&&(i===m||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Si=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){Tt(this,n)}};var gl=Ei.litHtmlPolyfillSupport;gl?.(Xt,Zt),(Ei.litHtmlVersions??=[]).push("3.3.3");var nr=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new Zt(n.insertBefore(Yt(),r),r,void 0,t??{})}return a._$AI(e),a};var Ri=globalThis,Qe=class extends Ne{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=nr(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return lt}};Qe._$litElement$=!0,Qe.finalized=!0,Ri.litElementHydrateSupport?.({LitElement:Qe});var yl=Ri.litElementPolyfillSupport;yl?.({LitElement:Qe});(Ri.litElementVersions??=[]).push("4.2.2");var bl={attribute:!0,type:String,converter:jt,reflect:!1,hasChanged:xn},vl=(e=bl,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(s){let l=n.get.call(this);n.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=t;return function(s){let l=this[o];n.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function Rt(e){return(n,t)=>typeof t=="object"?vl(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function H(e){return Rt({...e,state:!0,attribute:!1})}var De="wrist_assistant/complications";async function ir(e){return e.connection.sendMessagePromise({type:`${De}/owners`})}async function ar(e,n){return e.connection.sendMessagePromise({type:`${De}/list`,owner_watch_id:n})}async function rr(e,n){return e.connection.sendMessagePromise({type:`${De}/nudge`,owner_watch_id:n})}async function or(e,n,t,i){return e.connection.sendMessagePromise({type:`${De}/save`,owner_watch_id:n,document:t,base_revision:i})}async function sr(e,n,t,i){return e.connection.sendMessagePromise({type:`${De}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function lr(e,n,t){return e.connection.sendMessagePromise({type:`${De}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function dr(e,n,t){let i={type:`${De}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function cr(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${De}/render_values`,templates:n})).results}async function pr(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${De}/history_series`,requests:n})).results}var Q=["rectangular","circular","corner"],de={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},xl=["rectangular","circular","corner","inline"];var Mi=64;function kr(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<Mi;i++)if(!t.has(i))return i;return-1}function Qt(e){return Q.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var Mt=[["latest","Newest reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["top","Top of the scale"],["bottom","Bottom of the scale"]],Ve={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},$e={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},en="#FF6B35",tn="#32D74B",Ii="#32D74B",nn="#FF453A";function It(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function $r(e){return e.coloring==="bands"&&e.bands.length>0}function Cr(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function Sr(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}var Tn=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],Fn=360,Er=10080,Ai=2,Rn=120,Hi=0;function Tr(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?n<1?Hi:Math.max(Ai,Math.min(Rn,n)):24}function Fr(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function ut(e){let n=Fr(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${Tr(e)}`}function Rr(e){return Li(e).map(n=>n.key).sort().join(";")}function Li(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=ut(t.payload),a=Fr(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),points:Tr(t.payload)})}return[...n.values()]}var At=6,Ht=9,wl=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Be(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function zi(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var _i={top:0,left:0,bottom:0,right:0};function Mn(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var Pi=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"]];function Ge(e){let n=Pi.find(([i])=>i===e.type)?.[1]??e.type;if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function F(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function G(e,n=""){return typeof e=="string"?e:n}function B(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function He(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Sn(e){return e==null?void 0:B(e,0)}function ke(e){return typeof e=="string"?e:void 0}var Le=class extends Error{};function ct(e){if(typeof e.entityId!="string")throw new Le("entityId is required");let n={entityId:e.entityId,displayName:G(e.displayName),domain:G(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function ur(e){if(!F(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=B(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=B(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=B(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),_e(n)?void 0:n}function _e(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&e.textCase===void 0:!0}function kl(e){let n=G(e.function,"count"),t=F(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(F).map(ct)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(F(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:G(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function hr(e){switch(e.kind){case"literal":return{kind:"literal",value:G(e.value)};case"entityState":return{kind:"entityState",...ct(e)};case"entityAttribute":return{kind:"entityAttribute",...ct(e),attribute:G(e.attribute)};case"entityAge":return{kind:"entityAge",...ct(e)};case"aggregate":return{kind:"aggregate",aggregate:kl(F(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:ke(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:G(e.value)};case"named":return{kind:"named",id:G(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:G(e.layer).toUpperCase(),stat:Mt.some(([n])=>n===e.stat)?e.stat:"latest"};default:throw new Le(`unknown value kind ${String(e.kind)}`)}}function le(e){if(!F(e))throw new Le("value must be an object");if(F(e.kind)){let i={kind:hr(e.kind)},a=ur(e.format);return a&&(i.format=a),i}let n={kind:hr(e)},t=ur(e.format);return t&&(n.format=t),n}function Mr(e){return F(e)?{x:B(e.x,.25),y:B(e.y,.25),width:B(e.width,.5),height:B(e.height,.5),rotationDegrees:B(e.rotationDegrees,0)}:{...Ve}}function $l(e){if(!F(e))return{kind:"isOn"};let n=G(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=F(e.value)?le(e.value):M("");break;case"between":t.value=F(e.value)?le(e.value):M(""),t.upper=F(e.upper)?le(e.upper):M("");break;case"matchesRegex":t.pattern=G(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function mr(e){if(!F(e))return{kind:"show"};let n=G(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=F(e.value)?le(e.value):M("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=B(e.number,0);break;case"setFontWeight":t.weight=ke(e.weight)??"regular";break;default:break}return t}function Ir(e){return Array.isArray(e)?e.filter(F).map(n=>{let t={id:G(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(F).map(i=>{let a=F(i.when)?i.when:{};return{id:G(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(F).map(r=>({id:G(r.id).toUpperCase(),value:F(r.value)?le(r.value):M(""),comparison:$l(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(mr)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(mr)),t}):[]}function Cl(e,n){return{baseColorHex:F(e)?G(e.baseColorHex,n):n}}function Sl(e){if(Array.isArray(e.bands))return e.bands.filter(F).map(t=>({id:G(t.id,Y()),upTo:B(t.upTo,0),colorHex:G(t.colorHex,"#FFFFFF")}));if(typeof e.bandLowerBound!="number")return[];let n=F(e.colorSlot)?G(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:Y(),upTo:e.bandLowerBound,colorHex:G(e.bandLowColorHex,Ii)},{id:Y(),upTo:B(e.bandUpperBound,100),colorHex:n}]}function dt(e,n){if(typeof e.id!="string")throw new Le("element id is required");return{id:e.id.toUpperCase(),colorSlot:Cl(e.colorSlot,n),rules:Ir(e.rules),frame:Mr(e.frame),isHidden:e.isHidden===!0}}function El(e){let n=Tl(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),n}function Tl(e){if(!F(e)||!F(e.payload))throw new Le("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...dt(n,"#FFFFFF"),value:F(n.value)?le(n.value):M(""),fontSize:B(n.fontSize,14),fontWeight:ke(n.fontWeight)??"regular"};return n.countdown===!0&&(t.countdown=!0),{kind:"text",payload:t}}case"icon":return{kind:"icon",payload:{...dt(n,"#FFFFFF"),symbol:F(n.symbol)?le(n.symbol):M("lightbulb"),size:B(n.size,14)}};case"gauge":return{kind:"gauge",payload:{...dt(n,"#FFFFFF"),value:F(n.value)?le(n.value):M("50"),minValue:B(n.minValue,0),maxValue:B(n.maxValue,100),style:ke(n.style)??"arc",lineWidth:B(n.lineWidth,4),trackColorHex:G(n.trackColorHex,"#FFFFFF40")}};case"chart":return{kind:"chart",payload:{...dt(n,"#FFFFFF"),value:F(n.value)?le(n.value):M("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(B(n.historyMinutes,0))),historyPoints:Math.round(B(n.historyPoints,24)),style:ke(n.style)??"bars",limit:Math.max(0,Math.round(B(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:ke(n.scale)??"auto",minValue:B(n.minValue,0),maxValue:B(n.maxValue,100),baseline:ke(n.baseline)??"lowest",barGap:B(n.barGap,1.5),lineWidth:B(n.lineWidth,2),highlight:ke(n.highlight)??"none",highColorHex:G(n.highColorHex,en),lowColorHex:G(n.lowColorHex,tn),marker:ke(n.marker)??"pointer",coloring:ke(n.coloring)??"uniform",bands:Sl(n),bandAboveColorHex:G(n.bandHighColorHex,G(n.bandAboveColorHex,nn)),fillBands:n.fillBands===!0}};case"shape":{let t={...dt(n,"#FFFFFF33"),kind:ke(n.kind)??"roundedRectangle",cornerRadius:B(n.cornerRadius,6),borderWidth:B(n.borderWidth,1)};return typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=dt(n,"#FFFFFF"),a={...i,entity:ct(F(n.entity)?n.entity:{}),contentMode:n.contentMode==="fit"?"fit":"fill",zoom:B(n.zoom,1),panX:B(n.panX,0),panY:B(n.panY,0),cornerRadius:B(n.cornerRadius,At),timestampCorner:wl.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:B(n.timestampSize,Ht)};n.timestamp===!0&&(a.timestamp=!0);let r=Sn(n.timestampX),o=Sn(n.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=He(r),a.timestampY=He(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=dt(n,"#FFFFFF"),a={...i,action:F(n.action)?Ar(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new Le(`unknown element kind ${String(e.kind)}`)}}function fr(e){let n=F(e)?e:{},t={};if(F(n.placements))for(let[a,r]of Object.entries(n.placements)){if(!F(r))continue;let o={frame:Mr(r.frame),isHidden:r.isHidden===!0},s=Sn(r.size);s!==void 0&&(o.size=s),t[a.toUpperCase()]=o}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:B(n.borderWidth,2),rules:Ir(n.rules)};if(F(n.bezelText)&&(i.bezelText=le(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),F(n.curvedText)&&(i.curvedText=le(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),F(n.bezelGauge)){let a=n.bezelGauge,r={value:F(a.value)?le(a.value):M("50"),minValue:B(a.minValue,0),maxValue:B(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};F(a.minLabel)&&(r.minLabel=le(a.minLabel)),F(a.maxLabel)&&(r.maxLabel=le(a.maxLabel)),i.bezelGauge=r}return typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function Fl(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=fr(e[t+1]))}else if(F(e))for(let[t,i]of Object.entries(e))n[t]=fr(i);return n}function Rl(e){let n={value:F(e.value)?le(e.value):M("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function Ar(e){if(!F(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...ct(e)};default:return{type:"none"}}}function Hr(e){if(!F(e))throw new Le("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new Le(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(F).map(r=>({id:G(r.id).toUpperCase(),name:G(r.name),value:F(r.value)?le(r.value):M("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(F).map(r=>r.kind==="template"?{kind:"template",value:G(r.value)}:r.kind==="entity"?{kind:"entity",...ct(r)}:null).filter(r=>r!==null),i={schemaVersion:B(e.schemaVersion,1),id:G(e.id).toUpperCase(),name:G(e.name,"Custom"),values:n,slotIndex:B(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(El),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:Fl(e.perFamily),dataSources:t,tapAction:Ar(e.tapAction)};F(e.inline)&&(i.inline=Rl(e.inline));let a=Sn(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(F).filter(o=>typeof o.id=="string").map(o=>({id:G(o.id).toUpperCase(),name:G(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return Il(i,Array.isArray(e.elements)?e.elements:[]),We(i),i}function Oi(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function ht(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function Ml(e,n){let t=En(e,rn(n))?.ref;return t?.displayName||t?.entityId||"Chart"}function Lr(e,n,t){let i=Ue(e,n.payload.id);if(i){Di(e,t,i.id);return}let a=Ni(e,[n.payload.id,t],Ml(e,n)),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var zr={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1}};function _r(e,n,t,i){let a=de.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),s=e.x+n.x*e.width-n.x*r,l=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function Pr(e,n,t){let i=e.elements.find(l=>l.payload.id===n);if(!i||i.kind!=="chart")return;let a=ze("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};t==="latest"&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"},a.payload.frame=_r(i.payload.frame,zr[t],r,t==="latest"?7:4);let s=e.elements.findIndex(l=>l.payload.id===n);return e.elements.splice(s+1,0,a),Lr(e,i,a.payload.id),a.payload.id}function Il(e,n){for(let t of n){if(!F(t)||t.kind!=="chart"||!F(t.payload))continue;let i=t.payload,a=G(i.id).toUpperCase(),r=e.elements.find(h=>h.payload.id===a);if(!r||r.kind!=="chart")continue;let o=G(i.scaleLabelColorHex,"#FFFFFF99"),s=h=>{let f=F(h)?h:{};return{fontSize:B(f.fontSize,8),colorHex:G(f.colorHex,o),pillColorHex:typeof f.pillColorHex=="string"?f.pillColorHex:void 0}},l=[],d=ke(i.scaleLabels);(d==="top"||d==="range")&&l.push(["top",s(i.topLabelStyle)]),d==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let c=ke(i.latestLabel);if((c==="corner"||c==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let p=e.elements.findIndex(h=>h.payload.id===a)+1;for(let[h,f]of l){let g=_r(r.payload.frame,zr[h],f.fontSize,h==="latest"?5:4),w=[];if(f.pillColorHex!==void 0){let E=ze("shape");E.payload.kind="capsule",E.payload.colorSlot={baseColorHex:f.pillColorHex},E.payload.frame={...g},w.push(E)}let k=ze("text");k.payload.value={kind:{kind:"chartStat",layer:a,stat:h}},k.payload.fontSize=f.fontSize,k.payload.fontWeight="medium",k.payload.colorSlot={baseColorHex:f.colorHex},k.payload.frame=g,w.push(k),e.elements.splice(p,0,...w),p+=w.length;for(let E of w)Lr(e,r,E.payload.id)}}}function j(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function pt(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Al(e){let n={};return e.decimals!==void 0&&(n.decimals=j(e.decimals)),e.multiply!==void 0&&(n.multiply=j(e.multiply)),e.offset!==void 0&&(n.offset=j(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function Hl(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(pt)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function Ll(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...pt(e)};case"entityAttribute":return{kind:"entityAttribute",...pt(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...pt(e)};case"aggregate":return{kind:"aggregate",aggregate:Hl(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function ie(e){let n={kind:Ll(e.kind)};return _e(e.format)||(n.format=Al(e.format)),n}function $n(e){return{x:j(e.x),y:j(e.y),width:j(e.width),height:j(e.height),rotationDegrees:j(e.rotationDegrees)}}function zl(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=ie(e.value??M(""));break;case"between":n.value=ie(e.value??M("")),n.upper=ie(e.upper??M(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function gr(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=ie(e.value??M(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=j(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;default:break}return n}function Cn(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:ie(a.value),comparison:zl(a.comparison)}))},then:i.then.map(gr)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(gr)),t})}function _l(e){let n=Pl(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),n}function Pl(e){let n=t=>({id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:Cn(t.rules),frame:$n(t.frame),isHidden:t.isHidden});switch(e.kind){case"text":{let t={...n(e.payload),value:ie(e.payload.value),fontSize:j(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(t.countdown=!0),{kind:"text",payload:t}}case"icon":return{kind:"icon",payload:{...n(e.payload),symbol:ie(e.payload.symbol),size:j(e.payload.size)}};case"gauge":return{kind:"gauge",payload:{...n(e.payload),value:ie(e.payload.value),minValue:j(e.payload.minValue),maxValue:j(e.payload.maxValue),style:e.payload.style,lineWidth:j(e.payload.lineWidth),trackColorHex:e.payload.trackColorHex}};case"chart":return{kind:"chart",payload:{...n(e.payload),value:ie(e.payload.value),historyMinutes:Math.max(0,Math.round(e.payload.historyMinutes)),historyPoints:Math.round(e.payload.historyPoints),style:e.payload.style,limit:Math.max(0,Math.round(e.payload.limit)),takeFromEnd:e.payload.takeFromEnd,scale:e.payload.scale,minValue:j(e.payload.minValue),maxValue:j(e.payload.maxValue),baseline:e.payload.baseline,barGap:j(e.payload.barGap),lineWidth:j(e.payload.lineWidth),highlight:e.payload.highlight,highColorHex:e.payload.highColorHex,lowColorHex:e.payload.lowColorHex,marker:e.payload.marker,coloring:e.payload.coloring,bands:e.payload.bands.map(t=>({id:t.id,upTo:j(t.upTo),colorHex:t.colorHex})),bandAboveColorHex:e.payload.bandAboveColorHex,fillBands:e.payload.fillBands}};case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:j(e.payload.cornerRadius),borderWidth:j(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id,entity:pt(t.entity),rules:Cn(t.rules),frame:$n(t.frame),isHidden:t.isHidden};t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=j(t.zoom)),t.panX!==0&&(i.panX=j(t.panX)),t.panY!==0&&(i.panY=j(t.panY)),t.cornerRadius!==At&&(i.cornerRadius=j(t.cornerRadius));let a=Be(t),r=a?zi(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==Ht&&(i.timestampSize=j(t.timestampSize)),a&&(i.timestampX=j(t.timestampX),i.timestampY=j(t.timestampY)),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:Or(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=Cn(t.rules),i.frame=$n(t.frame),i.isHidden=t.isHidden,{kind:"tap",payload:i}}}}function Ol(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:$n(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=j(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=ie(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=ie(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:ie(i.value),minValue:j(i.minValue),maxValue:j(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=ie(i.minLabel)),i.maxLabel&&(a.maxLabel=ie(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=j(e.borderWidth),e.rules.length>0&&(n.rules=Cn(e.rules)),n}function Or(e){return"entityId"in e?{type:e.type,...pt(e)}:{type:e.type}}function Nl(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=ie(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function In(e){let n=[];for(let i of Q){let a=e.perFamily[i];a&&n.push(i,Ol(a))}let t={schemaVersion:Qt(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:ie(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(_l),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...pt(i)}),tapAction:Or(e.tapAction)};return e.inline!==void 0&&(t.inline=Nl(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),t}function Ue(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function Ke(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!ce(e,t))}function We(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function Lt(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!ce(e,r)),t=e.elements.filter(r=>ce(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=n.filter(d=>d.payload.groupId===s);for(let d=l.length-1;d>=0;d--)i.unshift(l[d]),a.add(l[d].payload.id)}e.elements=[...i,...t],et(e)}function Ni(e,n,t="Group"){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!ce(e,r));if(i.length<2)return;let a={id:Y(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return We(e),Lt(e),a.id}function an(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;We(e)}function Di(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||ce(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,We(e),Lt(e))}var W={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex"],chart:["value","historyMinutes","historyPoints","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],shape:["kind","cornerRadius","borderColorHex","borderWidth"],image:["entity","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},yr={literal:["kind","value"],entityState:["kind",...W.entityRef],entityAttribute:["kind",...W.entityRef,"attribute"],entityAge:["kind",...W.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function Nr(e){let n=[],t=(l,d,c)=>{if(F(l))for(let p of Object.keys(l))d.includes(p)||n.push(`${c}.${p}`)},i=(l,d)=>{if(!F(l))return;let c=typeof l.kind=="string"?l.kind:"";t(l,yr[c]??["kind"],d),c==="aggregate"&&F(l.aggregate)&&(t(l.aggregate,W.aggregate,`${d}.aggregate`),t(l.aggregate.scope,W.scope,`${d}.aggregate.scope`),F(l.aggregate.scope)&&Array.isArray(l.aggregate.scope.entities)&&l.aggregate.scope.entities.forEach((p,h)=>t(p,W.entityRef,`${d}.aggregate.scope.entities[${h}]`)),t(l.aggregate.stateFilter,W.stateFilter,`${d}.aggregate.stateFilter`))},a=(l,d)=>{if(F(l)){if(F(l.kind))t(l,W.value,d),i(l.kind,`${d}.kind`);else{let c=typeof l.kind=="string"?l.kind:"";t(l,[...yr[c]??["kind"],"format"],d),c==="aggregate"&&i(l,d)}t(l.format,W.format,`${d}.format`)}},r=(l,d)=>{Array.isArray(l)&&l.forEach((c,p)=>{t(c,W.styleChange,`${d}[${p}]`),F(c)&&a(c.value,`${d}[${p}].value`)})},o=(l,d)=>{Array.isArray(l)&&l.forEach((c,p)=>{let h=`${d}[${p}]`;t(c,W.rule,h),F(c)&&(Array.isArray(c.cases)&&c.cases.forEach((f,g)=>{let w=`${h}.cases[${g}]`;t(f,W.case,w),F(f)&&(t(f.when,W.condition,`${w}.when`),F(f.when)&&Array.isArray(f.when.tests)&&f.when.tests.forEach((k,E)=>{let T=`${w}.when.tests[${E}]`;t(k,W.test,T),F(k)&&(a(k.value,`${T}.value`),t(k.comparison,W.comparison,`${T}.comparison`),F(k.comparison)&&(a(k.comparison.value,`${T}.comparison.value`),a(k.comparison.upper,`${T}.comparison.upper`)))}),r(f.then,`${w}.then`))}),r(c.otherwise,`${h}.otherwise`))})};if(!F(e))return n;t(e,W.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((l,d)=>t(l,W.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((l,d)=>{t(l,W.named,`$.values[${d}]`),F(l)&&a(l.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((l,d)=>{let c=`$.elements[${d}]`;if(t(l,W.elementEnvelope,c),!F(l)||!F(l.payload))return;let p=typeof l.kind=="string"?l.kind:"",h=W[p]??[];t(l.payload,[...W.elementBase,...h],`${c}.payload`),t(l.payload.colorSlot,W.colorSlot,`${c}.payload.colorSlot`),t(l.payload.frame,W.frame,`${c}.payload.frame`),o(l.payload.rules,`${c}.payload.rules`);for(let f of["value","symbol"])f in l.payload&&a(l.payload[f],`${c}.payload.${f}`);p==="image"&&t(l.payload.entity,W.entityRef,`${c}.payload.entity`),p==="tap"&&t(l.payload.action,W.tapAction,`${c}.payload.action`)});let s=[];if(Array.isArray(e.perFamily))for(let l=0;l+1<e.perFamily.length;l+=2)s.push([String(e.perFamily[l]),e.perFamily[l+1]]);else F(e.perFamily)&&s.push(...Object.entries(e.perFamily));for(let[l,d]of s){let c=`$.perFamily.${l}`;if(t(d,W.layout,c),!!F(d)){if(F(d.placements))for(let[p,h]of Object.entries(d.placements))t(h,W.placement,`${c}.placements.${p}`),F(h)&&t(h.frame,W.frame,`${c}.placements.${p}.frame`);if(a(d.bezelText,`${c}.bezelText`),a(d.curvedText,`${c}.curvedText`),F(d.bezelGauge)){let p=`${c}.bezelGauge`;t(d.bezelGauge,W.bezelGauge,p),a(d.bezelGauge.value,`${p}.value`),a(d.bezelGauge.minLabel,`${p}.minLabel`),a(d.bezelGauge.maxLabel,`${p}.maxLabel`)}o(d.rules,`${c}.rules`)}}return F(e.inline)&&(t(e.inline,W.inline,"$.inline"),a(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((l,d)=>t(l,W.dataSource,`$.dataSources[${d}]`)),t(e.tapAction,W.tapAction,"$.tapAction"),n}function Y(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function zt(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function Dr(e,n,t=[...Q]){let i={};for(let r of Q)t.includes(r)&&(i[r]=zt());let a={schemaVersion:4,id:Y(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:xl.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:M("Text")}),a.schemaVersion=Qt(a),a}function ze(e){let n=t=>({id:Y(),colorSlot:{baseColorHex:t},rules:[],frame:{...Ve},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:M("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:M("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:M("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40"}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:M("13,14,16,17,19,22,24,28,30"),historyMinutes:Fn,historyPoints:24,style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:en,lowColorHex:tn,marker:"pointer",coloring:"uniform",bands:[],bandAboveColorHex:nn,fillBands:!1}};case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:At,timestampCorner:"topLeading",timestampSize:Ht}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function M(e){return{kind:{kind:"literal",value:e}}}function An(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"shape":return;case"image":return;case"tap":return}}var br=["circular","corner"],vr=Math.SQRT1_2;function Dl(e){return e==="text"||e==="icon"?4:.5}function Vi(e,n,t,i){let a=structuredClone(e),r=de[n],o=de[t];if(n===t||!r||!o)return a;let s=br.includes(n),l=br.includes(t),d=s===l?1:l?vr:1/vr,c=Math.min(o.width/r.width,o.height/r.height)*d;if(d!==1){let p=a.frame,h=p.x+p.width/2,f=p.y+p.height/2;a.frame={...p,width:p.width*d,height:p.height*d,x:.5+(h-.5)*d-p.width*d/2,y:.5+(f-.5)*d-p.height*d/2}}return a.size!==void 0&&(a.size=Math.max(Dl(i),Math.round(a.size*c*10)/10)),a}function Vr(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>{let a=t.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function rn(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function Bi(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var Gi=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function En(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=Oi(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function Ui(e,n){return En(e,rn(n))?.ref}function Ki(e,n){let t=Ui(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&Gi.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function xr(e,n,t){if(Mn(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,s=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=He(a),r=He(r),o=He(o),s=He(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function Br(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function Gr(e,n,t,i){let a=e.elements.find(h=>h.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,s=He(i.x),l=He(i.y),d=He(i.x+i.width),c=He(i.y+i.height),p={...i,x:s,y:l,width:Math.max(0,d-s),height:Math.max(0,c-l)};a.payload.outset=Br(o,p,de[t])}function Ur(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=de[t];return{width:r.width*o.width,height:r.height*o.height}}function Ce(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function ce(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function Wi(e,n){let t=e.elements.find(i=>i.payload.id===n);if(t){if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}}function et(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=t.get(r);s?s.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=Br(o.payload.frame,l.frame,de.rectangular));let d=l.outset,c=!Mn(d);s.payload.frame=xr(o.payload.frame,d,de.rectangular),s.payload.isHidden=o.payload.isHidden;for(let p of Q){let h=e.perFamily[p];if(!h)continue;let f=de[p],g=h.placements[a];if(c){let w=g?.frame??o.payload.frame,k=g?.isHidden??o.payload.isHidden;h.placements[s.payload.id]={frame:xr(w,d,f),isHidden:k}}else g?h.placements[s.payload.id]={frame:{...g.frame},isHidden:g.isHidden}:delete h.placements[s.payload.id]}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function Hn(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind==="tap")return;let a=Ce(e,n)[0];if(a)return a.payload;let r=ze("tap"),o=r.payload;return o.attachedTo=n,o.outset={..._i},o.action=t??Ki(e,i),e.elements.push(r),et(e),o}function Ln(e,n){let t=Ce(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of Q)for(let a of t)delete e.perFamily[i]?.placements[a]}}function mt(e,n){for(let t of ht(e,n))mt(e,t.payload.id);Ln(e,n),e.elements=e.elements.filter(t=>t.payload.id!==n);for(let t of Q)delete e.perFamily[t]?.placements[n];et(e),We(e)}function Kr(e,n){let t=e.elements.findIndex(l=>l.payload.id===n),i=e.elements[t];if(!i)return;let a=Y(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[n,a]];for(let l of Ce(e,n)){let d=structuredClone(l);d.payload.id=Y(),d.payload.attachedTo=a,o.push(d),s.push([l.payload.id,d.payload.id])}e.elements.splice(t+1,0,...o);for(let l of Q){let d=e.perFamily[l];if(d)for(let[c,p]of s){let h=d.placements[c];h&&(d.placements[p]=structuredClone(h))}}return et(e),a}function ji(e,n,t){let i=new Set,a=d=>{i.add(d);for(let c of Ce(e,d))i.add(c.payload.id)};for(let d of n){a(d);for(let c of ht(e,d))a(c.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o={};for(let d of Q){let c=e.perFamily[d];if(!c)continue;let p={};for(let h of r){let f=c.placements[h.payload.id];f&&(p[h.payload.id]=structuredClone(f))}Object.keys(p).length>0&&(o[d]=p)}let s=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),l=(e.groups??[]).filter(d=>s.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:o,groups:l,...t!==void 0?{family:t}:{}}}function Wr(e,n,t){if(!Q.includes(t))return[];let i=e.perFamily[t];if(i||(i=zt(),e.perFamily[t]=i),Object.keys(i.placements).length===0)for(let s of e.elements)i.placements[s.payload.id]={frame:{...s.payload.frame},isHidden:s.payload.isHidden};let a=new Set(e.elements.map(s=>s.payload.id)),r=n.family===void 0?void 0:n.placements[n.family],o=[];for(let s of n.elements){let l=s.payload.id;if(!a.has(l))continue;let d=r?.[l],c=d?.size??An(s),p={frame:{...d?.frame??s.payload.frame},isHidden:!1,...c!==void 0?{size:c}:{}};i.placements[l]=n.family===void 0?p:Vi(p,n.family,t,s.kind),o.push(l)}return o.filter(s=>{let l=e.elements.find(d=>d.payload.id===s);return l!==void 0&&!ce(e,l)})}function qi(e,n){let t=new Map;for(let l of n.elements)t.set(l.payload.id,Y());let i=new Set(e.elements.map(l=>l.payload.id)),a=n.elements.some(l=>i.has(l.payload.id)),r=l=>a?{...l,x:Math.min(.9,l.x+.05),y:Math.min(.9,l.y+.05)}:l,o=[];for(let l of n.elements){let d=structuredClone(l);if(d.payload.id=t.get(l.payload.id),d.kind==="tap"&&d.payload.attachedTo!==void 0){let c=t.get(d.payload.attachedTo);c?d.payload.attachedTo=c:delete d.payload.attachedTo}if(d.kind==="text"&&d.payload.value.kind.kind==="chartStat"){let c=t.get(d.payload.value.kind.layer);if(c)d.payload.value.kind.layer=c;else if(!i.has(d.payload.value.kind.layer))continue}d.payload.frame=r(d.payload.frame),o.push(d)}let s=new Map;for(let l of n.groups){if(o.filter(p=>p.payload.groupId===l.id&&!(p.kind==="tap"&&p.payload.attachedTo!==void 0)).length<2)continue;let c=Y();s.set(l.id,c),(e.groups??=[]).push({...structuredClone(l),id:c})}for(let l of o){if(l.payload.groupId===void 0)continue;let d=s.get(l.payload.groupId);d?l.payload.groupId=d:delete l.payload.groupId}e.elements.push(...o);for(let l of Q){let d=n.placements[l],c=e.perFamily[l];if(!(!d||!c))for(let[p,h]of Object.entries(d)){let f=t.get(p);f&&o.some(g=>g.payload.id===f)&&(c.placements[f]={...structuredClone(h),frame:r(h.frame)})}}return et(e),We(e),Lt(e),o.filter(l=>!ce(e,l)).map(l=>l.payload.id)}function zn(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=En(e,rn(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of Ce(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=En(e,s.value);if(!l)continue;let d={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(d.namedId=l.namedId),i.push(d)}return i}function wr(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function jr(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||t.entityId==="")return;let a={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(i.kind==="image")i.payload.entity=a;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let r=wr(i.payload.value,a,i.kind);r&&(i.payload.value=r)}else if(i.kind==="icon"){let r=wr(i.payload.symbol,a,i.kind);r&&(i.payload.symbol=r)}for(let r of Ce(e,n)){let o=r.payload;"entityId"in o.action&&(o.action={type:o.action.type,...a})}}var _n={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},qr=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function ft(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function Pn(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function Yi(){return{id:Y(),value:M(""),comparison:{kind:"isOn"}}}function Ji(){return{id:Y(),when:{join:"all",tests:[Yi()]},then:[]}}function on(){return{id:Y(),cases:[Ji()]}}function Xi(e,n){let t={kind:n};switch(ft(n)){case"value":t.value=e.value??M("");break;case"between":t.value=e.value??M(""),t.upper=e.upper??M("");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function gt(e){let n={kind:e};switch(Pn(e)){case"value":n.value=M(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"none":break}return n}function Yr(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Jr(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function Zr(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function Qr(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function Xr(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Qi(e,n,t=0){let i=n instanceof Map?n:Qr(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Qi(o,i,t+1):Xr(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!Xr(a))return;let r=Zi(a);if(r!==void 0)return"e_"+Zr(r)}function Re(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Vl(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(o=>Re(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:s,labelIds:l,floorIds:d}=e.scope;if(!(s.length+l.length+d.length>0))n=o.length===0?"[]":"("+o.map(p=>`(states.${p} | list)`).join(" + ")+")";else{let p=[];for(let h of s)p.push(`area_entities(${Re(h)})`);for(let h of l)p.push(`label_entities(${Re(h)})`);d.length>0&&p.push(`((${d.map(h=>`floor_areas(${Re(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${p.join(" + ")})`,o.length>0&&(n+=` | selectattr('domain', 'in', [${o.map(Re).join(", ")}])`),n+=")"}}let t=n,i=e.stateFilter;if(i&&(i.kind==="isOn"?t+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?t+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?t+=` | selectattr('state', 'eq', ${Re(i.value)})`:t+=` | rejectattr('state', 'eq', ${Re(i.value)})`),e.function==="count")return`(${t} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${t} | map(attribute=${Re(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function Zi(e){switch(e.kind){case"entityAttribute":return`state_attr(${Re(e.entityId)}, ${Re(e.attribute)})`;case"entityAge":{let n=Re(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Vl(e.aggregate);default:return}}function ea(e){let n=new Map,t=new Map,i=Qr(e.values),a=(o,s=0)=>{let l=o.kind;switch(l.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":n.set(l.entityId,l);return;case"named":{if(s>8)return;let d=i.get(l.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,s+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let c=Zi(d.kind);if(c===void 0)return;t.set("n_"+l.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=Zi(l);if(d===void 0)return;t.set("e_"+Zr(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let s=rn(o);s&&a(s);for(let l of Bi(o.payload.rules))a(l)}for(let o of Q){if(!e.supportedFamilies.includes(o))continue;let s=e.perFamily[o];if(s){s.bezelText&&a(s.bezelText),s.curvedText&&a(s.curvedText),s.bezelGauge&&(a(s.bezelGauge.value),s.bezelGauge.minLabel&&a(s.bezelGauge.minLabel),s.bezelGauge.maxLabel&&a(s.bezelGauge.maxLabel));for(let l of Bi(s.rules))a(l)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:n,expressions:t};return t.size>0&&(r.document=Bl(t)),r}function Bl(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function eo(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,Gl(r));return{values:t,nullKeys:i}}function Gl(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function ta(e){let n=ea(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return n.document&&t.push({kind:"template",value:n.document}),t}function Ul(e,n){if(e.values.length!==0)switch(n){case"latest":return e.values[e.values.length-1];case"highest":return Math.max(...e.values);case"lowest":return Math.min(...e.values);case"average":return e.values.reduce((t,i)=>t+i,0)/e.values.length;case"top":return e.domainMax;case"bottom":return e.domainMin}}function On(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function _t(e){let n=e.trim(),t=On(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:On(i)}function Kl(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function Wl(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function jl(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function ql(e,n,t){if(_e(n))return e;let i=n,a=e,r=On(e.trim());if(i.relativeTime&&r!==void 0)a=Wl(r);else{let o=_t(e);if(o!==void 0){let s=o*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=s.toFixed(Math.max(0,i.decimals)):s!==o&&(a=Number.isInteger(s)?String(s):Kl(s))}}switch(i.useEntityUnit&&t&&(a+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=jl(a);break}return a}function Pt(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function sn(e,n=240){let t=[],i="",a=!1,r=()=>{if(i!==""){let o=Number(i);Number.isFinite(o)&&t.push(o)}i=""};for(let o of e){if(t.length>=n)break;if(o>="0"&&o<="9")i+=o,a=!0;else if(o===".")i.includes(".")&&r(),i+=".",a=!0;else if(o==="-"||o==="+"){let s=!a;r(),s&&(i+=o),a=!1}else r(),a=!1}return t.length<n&&r(),t}function Yl(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function Jl(e,n,t){if(e===void 0)return 0;let i=_t(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}var je=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&this.settleCharts(t)}chartReadings(n){let t=ut(n),i=t!==void 0?this.ctx.historySeries?.get(t)??"":this.resolve(n.value)??"",a=sn(i);n.limit>0&&a.length>n.limit&&(a=n.takeFromEnd?a.slice(a.length-n.limit):a.slice(0,n.limit));let r=Yl(a,n),o={values:a,domainMin:r.min,domainMax:r.max},s=this.dereference(n.value);return s&&"entityId"in s.kind&&(o.entity={entityId:s.kind.entityId,displayName:s.kind.displayName,domain:s.kind.domain}),o}settleCharts(n){for(let t of n.elements)t.kind==="chart"&&this.charts.set(t.payload.id,this.chartReadings(t.payload))}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!_e(a)?a:s.format,t=s}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?Ul(a,t.kind.stat):void 0;i=a&&r!==void 0?Sr(r,a.domainMax-a.domainMin):void 0;break}default:{let a=Qi(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return ql(i,t.format,this.directEntityUnit(t))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=On(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?Pt(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=_t(i),r=()=>this.resolve(t.value),o=()=>{let l=r();return l===void 0?void 0:_t(l)},s=l=>{let d=o();return a===void 0||d===void 0?!1:l(a,d)};switch(t.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,d)=>l>d);case"greaterOrEqual":return s((l,d)=>l>=d);case"lessThan":return s((l,d)=>l<d);case"lessOrEqual":return s((l,d)=>l<=d);case"between":{let l=o(),d=this.resolve(t.upper),c=d===void 0?void 0:_t(d);if(a===void 0||l===void 0||c===void 0)return!1;let[p,h]=l<=c?[l,c]:[c,l];return a>=p&&a<=h}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set($e[s.kind],s)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveElement(n,t){let i=n.payload,a=this.applyRules(i.rules,t),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,s=this.styleNumber(a,"rotation"),l=s===void 0?i.frame:{...i.frame,rotationDegrees:s},d=this.styleNumber(a,"opacity")??1,c={id:i.id,isHidden:o,frame:l,opacity:d};switch(n.kind){case"text":{let p=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,h=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,f={kind:"text",...c,text:this.styleText(a,"text")??h??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??n.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex};return p!==void 0&&(f.countdownEnd=p),f}case"icon":{let p=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle";return{kind:"icon",...c,symbol:this.styleText(a,"icon")??p,size:this.styleNumber(a,"fontSize")??n.payload.size,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex}}case"gauge":{let p=this.styleText(a,"gaugeValue")??this.resolve(n.payload.value),h=this.styleNumber(a,"gaugeMin")??n.payload.minValue,f=this.styleNumber(a,"gaugeMax")??n.payload.maxValue;return{kind:"gauge",...c,fraction:Jl(p,h,f),style:n.payload.style,lineWidth:n.payload.lineWidth,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex,trackColorHex:n.payload.trackColorHex}}case"chart":{let p=n.payload,h=this.charts.get(p.id)??this.chartReadings(p),f=h.values,g={min:h.domainMin,max:h.domainMax},w=this.styleColor(a,"color")??p.colorSlot.baseColorHex,k=It(p),E=$r(p)?f.map(v=>Cr(v,k,p.bandAboveColorHex)):[],T={kind:"chart",...c,values:f,style:p.style,domainMin:g.min,domainMax:g.max,baseline:p.baseline,barGap:p.barGap,lineWidth:p.lineWidth,colorHex:w,highColorHex:p.highColorHex,lowColorHex:p.lowColorHex,marker:p.marker,pointColorHexes:E,fillBands:p.fillBands};if(f.length>0){let v=p.highlight==="highest"||p.highlight==="both",C=p.highlight==="lowest"||p.highlight==="both",P=v?f.indexOf(Math.max(...f)):-1,N=C?f.indexOf(Math.min(...f)):-1;P>=0&&(T.highIndex=P),N>=0&&N!==P&&(T.lowIndex=N)}return T}case"shape":{let p={kind:"shape",...c,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,fillColorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??n.payload.borderWidth},h=this.styleColor(a,"borderColor")??n.payload.borderColorHex;return h!==void 0&&(p.borderColorHex=h),p}case"image":{let p={kind:"image",...c,entityId:n.payload.entity.entityId,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};Be(n.payload)&&(p.timestampX=n.payload.timestampX,p.timestampY=n.payload.timestampY);let h=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return h!==void 0&&(p.url=h),p}case"tap":{let p={kind:"tap",...c,frame:n.payload.frame,opacity:1,action:n.payload.action};return n.payload.openPageId!==void 0&&(p.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(p.attachedTo=n.payload.attachedTo),p}}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=Vr(n,t).map(w=>this.resolveElement(w,i)),o=a?this.applyRules(a.rules,i):new Map,s={family:t,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},l=this.styleText(o,"text"),d=a?.bezelCountdown&&l===void 0?this.countdownEnd(a.bezelText):void 0,c=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,p=l??c??this.resolve(a?.bezelText);p!==void 0&&(s.bezelText=p),d!==void 0&&(s.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(s.curvedText=h),a?.curvedColorHex!==void 0&&(s.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let w=a.bezelGauge,k=this.resolve(w.value),E=k===void 0?void 0:_t(k);if(E!==void 0){let T=Math.min(w.minValue,w.maxValue),v=Math.max(w.minValue,w.maxValue),C={value:Math.min(v,Math.max(T,E)),minValue:T,maxValue:v===T?T+1:v,colorHexes:w.colorHexes},P=this.resolve(w.minLabel);P!==void 0&&(C.minLabel=P);let N=this.resolve(w.maxLabel);N!==void 0&&(C.maxLabel=N),s.bezelGauge=C}}let f=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;f!==void 0&&(s.backgroundColorHex=f);let g=this.styleColor(o,"borderColor")??a?.borderColorHex;return g!==void 0&&(s.borderColorHex=g),s}};function Xl(e,n,t){let i=new je(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function na(e,n,t){let i=new je(n),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=Xl(e.inline,n,e)),a}var ve=de,ln=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:ve,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],dn=ln.find(e=>e.measured);function co(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return ln.find(a=>a.screen.width===t&&a.screen.height===i)}function Dn(e,n){let t=ve[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var Zl={regular:400,medium:500,semibold:600,bold:700};function Pe(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function qe(e,n,t="#FFFFFF"){let i=Pe(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}function po(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}function Ql(e,n){let t=qe(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:Pt((e.countdownEnd-Date.now())/1e3)});let i=l=>l*.55,a=e.text.length*i(e.fontSize),r=a>n.w&&n.w>0?Math.max(.5,n.w/a):1,o=e.fontSize*r,s=e.text;if(n.w>0&&s.length*i(o)>n.w){let l=n.w-.8*o,d=Math.max(1,Math.floor(l/i(o)));s=`${s.slice(0,d).replace(/\s+$/,"")}\u2026`}return b`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${Zl[e.fontWeight]??400}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${s}</text>`}function ed(e,n){let t=qe(e.colorHex,"stroke"),i=qe(e.trackColorHex,"stroke","#FFFFFF"),a=e.lineWidth;if(e.style==="bar"){let h=n.w,f=Math.max(a,h*e.fraction);return b`
      <rect x=${n.x} y=${n.cy-a/2} width=${h} height=${a} rx=${a/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-a/2} width=${f} height=${a} rx=${a/2}
        fill=${t.stroke} fill-opacity=${t["stroke-opacity"]} />`}let r=Math.min(n.w,n.h),o=Math.max(0,r/2-a/2),s=2*Math.PI*o,l=e.style==="ring"?1:.75,d=e.style==="ring"?-90:135,c=s*l,p=s*l*e.fraction;return b`
    <g transform="rotate(${d} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${c} ${s}" />
      ${e.fraction>0?b`<circle cx=${n.cx} cy=${n.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
            stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
            stroke-dasharray="${p} ${s}" />`:m}
    </g>`}var td=5;function nd(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0||e.lowIndex!==void 0,r=e.marker==="none"||!a?0:td,o=e.style==="bars"?0:e.lineWidth/2,s=n.x,l=Math.max(n.w,0),d=n.y+r+o,c=Math.max(n.h-r-o*2,1),p=d+c,h=Math.max(e.domainMax-e.domainMin,Number.EPSILON),f=e.baseline==="lowest",g=f?c*.12:0,w=Math.min(Math.max(e.barGap,0),l/(i*2)),k=Math.max((l-w*(i-1))/i,.5),E=v=>Math.min(1,Math.max(0,(v-e.domainMin)/h)),T=v=>p-E(v)*c;return{count:t.length,barWidth:k,plotTop:d,plotBottom:p,baselineY:f?p:T(0),barRect(v){let C=s+v*(k+w),P=t[v],N,q;if(f){let oe=g+E(P)*(c-g);N=p-oe,q=p}else N=T(P),q=f?p:T(0),N>q&&([N,q]=[q,N]);return{x:C,y:N,w:k,h:Math.max(q-N,.5)}},point(v){let C=Math.max(l-o*2,0);return{x:t.length>1?s+o+C*v/(t.length-1):s+l/2,y:T(t[v])}},markerCenter(v,C){let P=C?this.barRect(v):void 0;return{x:P?P.x+P.w/2:this.point(v).x,y:n.y+r/2}}}}function id(e,n){if(e.values.length===0)return m;let t=nd(e,n),i=qe(e.colorHex,"fill"),a=qe(e.highColorHex,"fill",e.colorHex),r=qe(e.lowColorHex,"fill",e.colorHex),o=(c,p)=>b`<circle cx=${c.x} cy=${c.y} r="1.7" fill=${p.fill} fill-opacity=${p["fill-opacity"]} />`,s=[],l=e.pointColorHexes.length===t.count,d=c=>l?qe(e.pointColorHexes[c],"fill",e.colorHex):i;if(e.style==="bars")for(let c=0;c<t.count;c++){let p=t.barRect(c),h=c===e.highIndex?a:c===e.lowIndex?r:d(c),f=Math.min(1.2,p.w/2,p.h/2);s.push(b`<rect x=${p.x} y=${p.y} width=${p.w} height=${p.h} rx=${f}
        fill=${h.fill} fill-opacity=${h["fill-opacity"]} />`)}else{let c=Array.from({length:t.count},(h,f)=>t.point(f)),p=c.map((h,f)=>`${f===0?"M":"L"}${h.x} ${h.y}`).join(" ");if(e.style==="area")if(e.fillBands&&l&&t.count>1)for(let h=0;h<t.count-1;h++){let f=c[h],g=c[h+1],w=d(h+1),k=`M${f.x} ${f.y} L${g.x} ${g.y} L${g.x} ${t.baselineY} L${f.x} ${t.baselineY} Z`;s.push(b`<path d=${k} fill=${w.fill}
            fill-opacity=${w["fill-opacity"]*.28} stroke="none" />`)}else{let h=`${p} L${c[c.length-1].x} ${t.baselineY} L${c[0].x} ${t.baselineY} Z`;s.push(b`<path d=${h} fill=${i.fill}
          fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}if(l&&t.count>1)for(let h=0;h<t.count-1;h++){let f=c[h],g=c[h+1],w=d(h+1);s.push(b`<path d=${`M${f.x} ${f.y} L${g.x} ${g.y}`} fill="none"
          stroke=${w.fill} stroke-opacity=${w["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else s.push(b`<path d=${p} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
        stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&s.push(o(c[e.highIndex],a)),e.lowIndex!==void 0&&s.push(o(c[e.lowIndex],r))}if(e.marker!=="none"){let c=e.style==="bars";if(e.highIndex!==void 0){let p=t.markerCenter(e.highIndex,c);s.push(e.marker==="pointer"?b`<path d=${`M${p.x} ${p.y-1.8} L${p.x+2.2} ${p.y+1.8} L${p.x-2.2} ${p.y+1.8} Z`}
            fill=${a.fill} fill-opacity=${a["fill-opacity"]} />`:o(p,a))}e.lowIndex!==void 0&&s.push(o(t.markerCenter(e.lowIndex,c),r))}return b`${s}`}function ad(e,n){let t=qe(e.fillColorHex,"fill"),i=e.borderColorHex?Pe(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",s=i?i.opacity:0;switch(e.shapeKind){case"circle":{let l=Math.min(n.w,n.h)/2-r;return b`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,l)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"capsule":{let l=Math.min(n.w,n.h)/2;return b`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${l}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"roundedRectangle":return b`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${e.cornerRadius}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"rectangle":return b`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}}function rd(e,n,t){let i=t.render(e.symbol,e.size,e.colorHex);if(i)return b`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${i}</g>`;let a=qe(e.colorHex,"stroke"),r=e.size;return b`
    <rect x=${n.cx-r/2} y=${n.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var la=.25,od=8;function sd(e,n,t,i,a,r,o,s){let l={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return l;let d=Math.min(Math.max(Number.isFinite(r)?r:1,la),od),c=Math.max(e/t,n/i),p=Math.min(e/t,n/i),h=(a==="fit"?p:c)*d,f=t*h,g=i*h,w=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),k=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(f-e)/2*(1+w)+0,y:-(g-n)/2*(1+k)+0,width:f,height:g}}function Vn(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var Nn=4;function Bn(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?n.x+Nn:n.x+n.w-Nn-a,d=e.timestampCorner.startsWith("top")?n.y+Nn:n.y+n.h-Nn-r;return{x:l,y:d,w:a,h:r,size:i,label:t}}let s=(l,d,c,p)=>p>=c?d+(c-p)/2:Math.min(d+c-p,Math.max(d,l-p/2));return{x:s(n.x+e.timestampX*n.w,n.x,n.w,a),y:s(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function ld(e,n,t){let i=t.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?Bn(e,n,Vn(new Date)):void 0,s=o?b`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:m,l=3,d=o&&t.timestampActiveId===e.id?b`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,f,g])=>b`<rect data-ts-corner=${h} x=${f-l/2} y=${g-l/2} width=${l} height=${l}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:m,c=e.url?t.imageSizes?.size(e.url):void 0,p;if(e.url&&c){let h=sd(n.w,n.h,c.width,c.height,e.contentMode,e.zoom,e.panX,e.panY);p=b`<image href=${e.url} x=${n.x+h.x} y=${n.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?p=b`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:p=b`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render("camera.fill",14,"#FFFFFF99")??m}</g>`;return b`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${p}${s}</g>${d}`}function dd(e,n,t,i,a){if(!i)return m;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?cd(a,n):void 0;return b`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?b`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${aa} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?b`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??m}</g>`:m}`}var aa=5;function cd(e,n){let t=aa*.55,i=n.w-2;if(n.h<aa*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function ra(e,n,t){if(e.isHidden&&!t.showHidden)return m;let i=t.tapReview===!0,a=t.tapAreas===!0||i,r=i?t.tapFocusId:void 0,o=r!==void 0&&e.id===r,s=r!==void 0;if(e.kind==="tap"&&!a)return m;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||s&&!o))return m;let l=po(e,n),d=i&&(!s||o),c;switch(e.kind){case"text":c=Ql(e,l);break;case"icon":c=rd(e,l,t.icons);break;case"gauge":c=ed(e,l);break;case"chart":c=id(e,l);break;case"shape":c=ad(e,l);break;case"image":c=ld(e,l,t);break;case"tap":c=dd(e,l,t.icons,a,d?Ge(e.action):void 0);break}let p=i&&(e.kind!=="tap"||s&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*p,f=t.highlightId===e.id,g=f||t.highlightIds?.includes(e.id)===!0,w=t.handles===!0&&(!s||o),k=g?b`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:m,E=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?b`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m,T=b`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="transparent" stroke="none" />`,v=3,C=f&&w?[["nw",l.x,l.y],["ne",l.x+l.w,l.y],["sw",l.x,l.y+l.h],["se",l.x+l.w,l.y+l.h]].map(([P,N,q])=>b`<rect data-handle=${P} x=${N-v/2} y=${q-v/2} width=${v} height=${v}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${P}-resize" />`):m;return b`<g data-element-id=${e.id} opacity=${h} style=${w?"cursor:move":m}
    transform="rotate(${e.frame.rotationDegrees} ${l.cx} ${l.cy})">${T}${c}${E}${k}${C}</g>`}function Gn(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function da(e,n){return(n?23.5:34)*e}var to=10.5;function uo(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function no(e,n){let t=0;for(let i of e)t+=uo(i,n);return t}function io(e,n,t){let i=e.toUpperCase(),a=d=>uo(d,t),r=.9*t,o=0;for(let d of i)o+=a(d);if(o<=n)return i;let s=0,l="";for(let d of i){if(s+a(d)+r>n)break;l+=d,s+=a(d)}return`${l.replace(/\s+$/,"")}\u2026`}function oa(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function sa(e,n,t,i){let a=oa(e,n,t),r=oa(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function ho(e,n,t,i){let{dial:a}=Gn(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:sa(a,t,i.start,i.end),length:t*r}}function pd(e,n){let t=Gn(e,!0);return ho(e,n,t.dial.r,t.labelArc)}var ao=18.5,ud=113,hd={start:-71,end:-36},ro=104,md=6.2,oo={start:-77,end:-30.5};function so(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function lo(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=so(e[i]),o=so(e[i+1]),s=(l,d)=>Math.round(l+(d-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var ia=11;function fd(e,n,t){let{dial:i}=Gn(n,!0),a=ro*n,r=180/(Math.PI*ro),o=e.minLabel!==void 0?no(e.minLabel,ia)*r:0,s=e.maxLabel!==void 0?no(e.maxLabel,ia)*r:0,l=oo.start+(o>0?Math.max(0,o-1.8):0),d=oo.end-(s>0?Math.max(0,s-1.8):0),c=d-l,p=24,h=[];for(let E=0;E<p;E++){let T=l+c*E/p,v=Math.min(d,l+c*(E+1)/p+.4);h.push(b`<path d=${sa(i,a,T,v)} fill="none"
      stroke=${lo(e.colorHexes,(E+.5)/p)} stroke-width=${md*n}
      stroke-linecap=${E===0||E===p-1?"round":"butt"} />`)}let f=(e.value-e.minValue)/(e.maxValue-e.minValue),g=oa(i,a,l+c*f),w=1.5,k=(E,T,v,C)=>b`
    <defs><path id=${E} d=${sa(i,a,T,v)} /></defs>
    <text font-size=${ia*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${E}" startOffset="50%" text-anchor="middle">${C}</textPath></text>`;return b`${h}
    <circle cx=${g.x} cy=${g.y} r=${3.2*n} fill=${lo(e.colorHexes,f)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?k(`${t}-gmin`,l-w-Math.max(o,3),l-w,e.minLabel):m}
    ${e.maxLabel!==void 0?k(`${t}-gmax`,d+w,d+w+Math.max(s,3),e.maxLabel):m}`}function ca(e,n){let t=e.family in ve?e.family:"rectangular",i=n.slot??ve[t],a=ve[t],r=Dn(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,s=Pe(e.backgroundColorHex),l=Pe(e.borderColorHex),d=e.borderWidth*r.scale;if(t==="corner"){let g=r.scale,w=!!e.bezelText||!!e.bezelGauge,k=e.curvedText??"",E=k!=="",T=Gn(g,w),v=da(g,w),C=v/(a.width*g),P=T.tile.cx-v/2,N=T.tile.cy-v/2,q=`M 0 0 H ${T.quad.width-T.cornerRadius} A ${T.cornerRadius} ${T.cornerRadius} 0 0 1 ${T.quad.width} ${T.cornerRadius} V ${T.quad.height} H 0 Z`,oe=m;if(e.bezelGauge)oe=fd(e.bezelGauge,g,o);else if(e.bezelText){let S=pd(g,`${o}-bezel`),O=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?Pt((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;oe=b`<defs><path id=${S.id} d=${S.d} /></defs>
        <text font-size=${to*g} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${S.id}" startOffset="50%" text-anchor="middle">${io(O,S.length,to*g)}</textPath></text>`}let x=m;if(E){let S=Pe(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},O=ho(g,`${o}-curved`,ud*g,hd);x=b`<defs><path id=${O.id} d=${O.d} /></defs>
        <text font-size=${ao*g} font-weight="600" fill=${S.color} fill-opacity=${S.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${O.id}" startOffset="50%" text-anchor="middle">${io(k,O.length,ao*g*.88)}</textPath></text>`}else{let S=e.borderWidth*r.scale*C,O=l?b`<circle cx=${v/2} cy=${v/2} r=${v/2-S/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${S} />`:m;x=b`<g transform="translate(${P} ${N})">
        <g clip-path=${`url(#${o})`}>
          ${s?b`<rect width=${v} height=${v} fill=${s.color} fill-opacity=${s.opacity} />`:m}
          <g data-design-box transform="scale(${r.scale*C})">
            ${e.elements.map(L=>ra(L,a,n))}
          </g>
        </g>
        <circle cx=${v/2} cy=${v/2} r=${v/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*g} stroke-dasharray=${`${2*g} ${2*g}`} />
        ${O}
      </g>`}return b`<svg viewBox=${`0 0 ${T.quad.width} ${T.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${T.quad.width} height=${T.quad.height}>
      <defs><clipPath id=${o}><circle cx=${v/2} cy=${v/2} r=${v/2} /></clipPath></defs>
      <path d=${q} fill="#000000" />
      ${oe}
      ${x}
    </svg>`}let c=b`<rect width=${i.width} height=${i.height} />`,p=l?b`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${d} />`:m,h=b`<rect width=${i.width} height=${i.height} fill="#000000" />`,f=`0 0 ${i.width} ${i.height}`;return b`<svg viewBox=${f} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${c}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${s?b`<rect width=${i.width} height=${i.height} fill=${s.color} fill-opacity=${s.opacity} />`:m}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(g=>ra(g,a,n))}
      </g>
    </g>
    ${p}
  </svg>`}var gd=.14;function yd(e,n){let t=po(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function bd(e,n,t){let i=e.family in ve?e.family:"rectangular",a=ve[i],r=e.elements.filter(h=>n.includes(h.id)),o=1/0,s=1/0,l=-1/0,d=-1/0;for(let h of r){let f=yd(h,a),g=h.frame.rotationDegrees%180===0?0:Math.hypot(f.w,f.h)/2;o=Math.min(o,g?f.cx-g:f.x),s=Math.min(s,g?f.cy-g:f.y),l=Math.max(l,g?f.cx+g:f.x+f.w),d=Math.max(d,g?f.cy+g:f.y+f.h)}let c=l-o,p=d-s;if(r.length===0||!(c>0)||!(p>0))o=0,s=0,c=a.width,p=a.height;else{let h=Math.max(2,Math.max(c,p)*gd);o-=h,s-=h,c+=2*h,p+=2*h}if(c/p<t){let h=p*t;o-=(h-c)/2,c=h}else{let h=c/t;s-=(h-p)/2,p=h}return{x:o,y:s,w:c,h:p}}function mo(e,n,t){let i=e.family in ve?e.family:"rectangular",a=ve[i],r=bd(e,n,t.width/t.height),o=Pe(e.backgroundColorHex),s=Pe(e.borderColorHex),l=e.borderWidth,d={icons:t.icons,showHidden:!0,tapAreas:!0,...t.imageSizes?{imageSizes:t.imageSizes}:{}},c=e.elements.filter(f=>n.includes(f.id)),p=s&&l>0?i==="rectangular"?b`<rect x=${l/2} y=${l/2} width=${a.width-l} height=${a.height-l} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:b`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-l/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:m,h=i==="rectangular"?b`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:b`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return b`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${c.map(f=>ra(f,a,d))}
    ${p}
  </svg>`}function U(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var Ot=["rectangular","circular","corner","inline"];function yt(e){return Q.includes(e)}function fo(e){return Ot.filter(n=>e.supportedFamilies.includes(n))}function go(e){return Q.find(n=>e.supportedFamilies.includes(n))}function Un(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function vd(){return{value:M("")}}function xd(e){let n=zt();for(let t of e.elements)n.placements[t.payload.id]={frame:{...t.payload.frame},isHidden:!0};return n}function yo(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=Ot.filter(t=>t===n||e.supportedFamilies.includes(t))),yt(n)?e.perFamily[n]||(e.perFamily[n]=xd(e)):e.inline||(e.inline=vd()),e.schemaVersion=Qt(e)}function bo(e,n){Un(e,n)&&(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),yt(n)?delete e.perFamily[n]:delete e.inline,e.schemaVersion=Qt(e))}function vo(e,n){let t=[];if(!yt(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=Object.values(i.placements).filter(r=>!r.isHidden).length;return a>0&&t.push(`${a} placed layer${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var re={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},Nt={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",shape:"Shape",image:"Picture",tap:"Tap area"},pa=["text","icon","gauge","chart","shape","image","tap"],X={states:"#f9a825",tap:re.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var xo="2.8.0";function ua(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function wd(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function wo(e,n=xo){let t=ua(e),i=ua(n);return!t||!i?!1:wd(t,i)>=0}function ko(e,n=xo){return`${ua(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${n} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var $o="52a9d81d0fd7";function kd(e){return e.trim().replace(/\./g,"-")}function $d(e){return e.trim().replace(/-/g,".")}var Kn=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>$d(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=kd(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Pe(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return b`<svg x="0" y="0" width=${t} height=${t} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},ha=class{constructor(n){this.onReady=n;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=Pe(i)??{color:"#FFFFFF",opacity:1};return b`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`symbol-icons.json.gz?v=${$o}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`symbol file: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function Co(e){return Kn.available()?new Kn(e):new ha(e)}function So(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var jn=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],qn=[...new Set(jn.flatMap(e=>e.symbols))],Cd={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function Sd(e){return`${e.replace(/\./g," ")} ${(Cd[e]??[]).join(" ")}`}function Eo(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=Sd(a);if(!t.every(s=>r.includes(s)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var Wn=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var Ed=100;function To(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var bt=class e{constructor(n,t){this.config=n;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=t,et(n),this.baseline=JSON.stringify(In(n))}static fromDocument(n,t){return new e(Hr(n),t)}get dirty(){return JSON.stringify(In(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t){let i=Date.now();t!==void 0&&t===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>Ed&&this.past.shift(),this.future=[]),this.coalesceKey=t,this.coalesceUntil=t===void 0?0:i+800;let r=structuredClone(this.config);n(r),et(r),this.config=r}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let n=this.past.pop();n&&(this.future.push(this.config),this.config=n,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push(this.config),this.config=n,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=ta(n),In(n)}commit(){let n=structuredClone(this.config);return n.dataSources=ta(n),new e(n,null)}};var Dt={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Ye={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},Ro=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Mo={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},ma=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],Td=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function fa(e){return Td.includes(e)}function Fd(e){return ma.includes(e)}function Rd(e,n){return JSON.stringify(ie(e))===JSON.stringify(ie(n))}function ga(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!Fd(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${Dt[l.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=l.value;else if(!Rd(t,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=Fo(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Ye[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(n.otherwise){let r=Fo(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Ye[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:Md(i,n.otherwise),numberMode:i.length>0&&i.every(r=>fa(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function Fo(e){let n=new Set;for(let t of e){let i=$e[t.kind];if(n.has(i))return i;n.add(i)}}function Md(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add($e[a.kind]);for(let i of n??[])t.add($e[i.kind]);return Ro.filter(i=>t.has(i))}function Io(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return Ro.filter(a=>i.has(a)&&t.includes(a))}function Yn(e,n){return e.find(t=>$e[t.kind]===n)}function Ao(e,n,t,i){let a=n.map(o=>({id:o.caseId??Y(),when:{join:o.join??"all",tests:[{id:o.testId??Y(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??Y(),cases:a};return t&&(r.otherwise=t),r}function cn(e){if(e.length===0)return"No states yet.";let n=ga(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function Ho(e){let n=e[0];return n||(n={id:Y(),cases:[]},e.push(n)),n}function Lo(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function zo(e,n,t){let i=Ho(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:Y(),when:{join:"all",tests:[{id:Y(),value:structuredClone(n),comparison:Ad(a,t)}]},then:[]})}function _o(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),Lo(e))}function ya(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function ba(e,n){if(n){Ho(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,Lo(e))}function Po(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function Oo(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>$e[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function Id(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function No(e,n=Id){let t=()=>n(e.value??M(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??M(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return ft(e.kind)==="value"?`${Dt[e.kind]} ${t()}`:Dt[e.kind]}}function Ad(e,n){if(!e)return n?{kind:"lessThan",value:M("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??M("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??M("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??M("0")};default:return{kind:e.kind,...ft(e.kind)==="value"?{value:M("")}:{}}}}var Do={text:"text",icon:"icon",gauge:"color",chart:"color",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function Vo(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function Hd(e){switch(e){case"text":return b`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return b`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return b`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return b`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"shape":return b`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return b`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return b`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return b`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return b`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return b`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return b`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return b`<path d="M6 9L12 15L18 9" />`;case"plus":return b`<path d="M12 5V19M5 12H19" />`;case"watch":return b`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return b`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return b`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return b`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return b`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return b`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return b`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return b`<path d="M6 14L12 8L18 14" />`;case"down":return b`<path d="M6 10L12 16L18 10" />`;case"show":return b`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return b`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return b`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return b`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return b`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return b`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return b`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`}}function z(e){return u`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Hd(e)}</svg>`}var pn="color-mix(in srgb, var(--k) 45%, #6b7280)",Bo='system-ui, -apple-system, "Segoe UI", sans-serif';function Go(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=c=>{let p=c*Math.PI/180;return{x:(e-t*Math.cos(p)).toFixed(2),y:(n-t*Math.sin(p)).toFixed(2)}},s=o(135),l=o(r),d=r-135>180?1:0;return`M${s.x} ${s.y}A${t} ${t} 0 ${d} 1 ${l.x} ${l.y}`}function va(e,n,t,i){return b`<g fill="none" stroke-linecap="round">
    <path d=${Go(e,n,t,1)} stroke=${pn} stroke-width="2.6" opacity=".5" />
    <path d=${Go(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function Ld(e){switch(e){case"text":return b`<g font-family=${Bo} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${pn}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${pn}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${pn}>1.2 kW</text>
      </g>`;case"icon":return b`<g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
      </g>`;case"gauge":return b`<g>
        ${va(22,24,12,.28)}
        ${va(60,24,12,.62)}
        ${va(98,24,12,.92)}
        <text x="60" y="27" font-family=${Bo} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return b`<g>
        <g opacity=".4" fill=${pn}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;case"shape":return b`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="8" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <circle cx="60" cy="23" r="11" />
        <rect x="80" y="16" width="32" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
      </g>`;case"image":return b`<g>
        <rect x="26" y="7" width="68" height="32" rx="5" fill="var(--k)" fill-opacity=".16"
          stroke="var(--k)" stroke-width="1.8" />
        <circle cx="44" cy="18" r="4" fill="var(--k)" opacity=".75" />
        <path d="M28 37L47 24L60 32L74 20L92 37Z" fill="var(--k)" opacity=".55" />
      </g>`;case"tap":return b`<g>
        <rect x="30" y="6" width="60" height="34" rx="8" fill="var(--k)" fill-opacity=".12"
          stroke="var(--k)" stroke-width="1.6" stroke-dasharray="5 4" />
        <g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(48 9) scale(1)">
          <path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" />
          <path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />
        </g>
      </g>`}}function Uo(e){return u`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${Ld(e)}</svg>`}function Vt(e,n){let t=new DOMPoint(n.clientX,n.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=t.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function Ko(e,n){let t={...e,...n};return xa({...t,x:tt(t.x),y:tt(t.y),width:Math.max(.04,tt(t.width)),height:Math.max(.04,tt(t.height))})}function xa(e){let n=Math.min(.96,Math.max(-e.width+.04,e.x)),t=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:n,y:t}}var tt=e=>Math.round(e*1e3)/1e3,Wo=10;function wa(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return xa({...e,x:tt(a),y:tt(r)})}function jo(e,n,t,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?tt(a(e.x+n/i.w)):e.x,y:i.h>0?tt(a(e.y+t/i.h)):e.y}}function Jn(e,n,t,i,a){let r=Vt(e,t),o={...i.frame},s=o;e.setPointerCapture(t.pointerId);let l=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==t.pointerId)return;let f=Vt(e,h),g=(f.x-r.x)/n.width,w=(f.y-r.y)/n.height,k;if(!i.handle)k=xa({...o,x:l(o.x+g),y:l(o.y+w)});else{let{x:E,y:T,width:v,height:C}=o,P=o.x+o.width,N=o.y+o.height;i.handle.includes("e")&&(v=Math.max(.04,o.width+g)),i.handle.includes("s")&&(C=Math.max(.04,o.height+w)),i.handle.includes("w")&&(v=Math.max(.04,o.width-g),E=P-v),i.handle.includes("n")&&(C=Math.max(.04,o.height-w),T=N-C),k={...o,x:l(E),y:l(T),width:l(v),height:l(C)}}s=k,a.onFrame(i.elementId,k,!1)},c=h=>{h.pointerId===t.pointerId&&(p(),a.onFrame(i.elementId,s,!0))},p=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),p}function qo(e,n,t,i,a){let r=Vt(e,t),o=i;e.setPointerCapture(t.pointerId);let s=h=>Math.round(h*1e3)/1e3,l=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==t.pointerId)return;let f=Vt(e,h),g=n.w>0?l(i.x+(f.x-r.x)/n.w):i.x,w=n.h>0?l(i.y+(f.y-r.y)/n.h):i.y;o={x:s(g),y:s(w)},a(o.x,o.y,!1)},c=h=>{h.pointerId===t.pointerId&&(p(),a(o.x,o.y,!0))},p=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),p}function Yo(e,n,t,i,a){let r=Vt(e,n),o=1;e.setPointerCapture(n.pointerId);let s=c=>{if(c.pointerId!==n.pointerId)return;let p=Vt(e,c),h=(p.x-r.x)*(t.includes("e")?1:-1),f=(p.y-r.y)*(t.includes("s")?1:-1),g=i.w>0?(i.w+h)/i.w:1,w=i.h>0?(i.h+f)/i.h:1,k=Math.abs(g-1)>=Math.abs(w-1)?g:w;o=Math.max(.05,k),a(o,!1)},l=c=>{c.pointerId===n.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",s),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",s),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),d}function zd(e){switch(e){case"light":return b`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return b`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return b`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return b`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return b`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return b`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return b`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return b`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return b`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return b`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return b`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return b`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return b`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return b`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return b`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return b`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return b`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return b`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return b`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return b`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return b`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return b`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return b`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return b`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return b`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return b`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return b`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return b`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return b`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return b`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return b`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function ka(e){return u`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${zd(e)}</svg>`}var _d={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function Jo(e){let n=_d[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var Pd=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function $a(e){return Pd.has(e.trim().toLowerCase())}var Ta=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function he(e){return n=>e(n.target.value)}function ps(e){return e===void 0||e.atDefault?m:u`<button type="button" class="icon tiny reset" title=${e.title} aria-label=${e.title}
    @click=${n=>{n.preventDefault(),n.stopPropagation(),e.reset()}}>${z("reset")}</button>`}function Je(e,n){let t=ps(n);return t===m?u`<span>${e}</span>`:u`<span class="has-reset">${e}${t}</span>`}function Bt(e,n,t,i=a=>String(a)){if(n===void 0)return;let a=n;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>t(a)}}function ue(e,n,t,i={}){return u`<label class="field">${Je(e,Bt(n,i.def,t,a=>a===""?"empty":a))}
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??m}
      class=${i.mono?"mono":""} @input=${he(t)} /></label>`}function Od(e,n,t,i=3){return u`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${he(t)}></textarea></label>`}function ee(e,n,t,i={}){let a=n===void 0||Number.isNaN(n)?"":String(n),r=u`<input type="number" .value=${a} step=${i.step??"any"} min=${i.min??m} max=${i.max??m}
      @input=${he(o=>{if(o.trim()===""){i.optional&&t(void 0);return}let s=Number(o);Number.isNaN(s)||t(s)})} />`;return u`<label class="field">${Je(e,Bt(n,i.def,t))}${r}</label>`}function Se(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return u`<label class="field">${Je(e,Bt(n,a.def,i,r))}
    <select @change=${he(o=>i(o))}>
      ${t.map(([o,s])=>u`<option value=${o} ?selected=${o===n}>${s}</option>`)}
    </select></label>`}function te(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return u`<div class="field seg-field">${Je(e,Bt(n,a.def,i,r))}
    <div class="seg wide" role="radiogroup" aria-label=${e}>
      ${t.map(([o,s])=>u`<button type="button" role="radio" aria-checked=${o===n?"true":"false"}
        class=${o===n?"on":""} title=${a.titles?.[o]??m}
        @click=${()=>{o!==n&&i(o)}}>${s}</button>`)}
    </div></div>`}function Xn(e,n,t,i){let a=i.format??(r=>String(Math.round(r*100)/100));return u`<div class="field slider">${Je(e,Bt(n,i.def,t,a))}
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)}
        @input=${he(r=>{let o=Number(r);Number.isNaN(o)||t(o)})} />
      <span class="slider-value mono">${a(n)}</span>
    </div></div>`}function Zn(e,n,t,i,a,r){let o=s=>Math.round(s*1e3)/10;return ee(e,o(n),s=>t((s??0)/100),{min:a,max:r,step:.5,def:o(i)})}function Ie(e,n,t,i){return u`<label class="field check"><input type="checkbox" .checked=${n} @change=${a=>t(a.target.checked)} />${Je(e,Bt(n,i,t,a=>a?"on":"off"))}</label>`}function pe(e,n,t,i=!1,a){let r=(n??"").replace(/^#/,""),o=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(r),s=o?`#${r.slice(0,6)}`:"#ffffff",l=o&&r.length===8?Math.round(parseInt(r.slice(6,8),16)/255*100):100,d=(p,h)=>{let f=p.replace(/^#/,"").toUpperCase();return h>=100?`#${f}`:`#${f}${Math.round(h/100*255).toString(16).padStart(2,"0").toUpperCase()}`},c=a===void 0?void 0:{atDefault:Nd(n,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>t(a??void 0)};return u`<div class="field color">${Je(e,c)}
    <div class="color-row">
      ${i?u`<input type="checkbox" title="Enabled" .checked=${n!==void 0} @change=${p=>t(p.target.checked?d(s,l):void 0)} />`:m}
      <input type="color" .value=${s} ?disabled=${i&&n===void 0} @input=${he(p=>t(d(p,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&n===void 0} @input=${he(p=>t(d(s,Number(p))))} />
      <input type="text" class="mono hex" .value=${n??""} placeholder="#RRGGBB" ?disabled=${i&&n===void 0}
        @input=${he(p=>{let h=p.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h)&&t(h.startsWith("#")?h.toUpperCase():`#${h.toUpperCase()}`)})} />
    </div></div>`}function Nd(e,n){return e===void 0||n===void 0?e===n:e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function us(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function Dd(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=t?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function Xo(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var hs=50;function Vd(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function Bd(e,n,t=hs,i){let a=n.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,d)=>r(l)-r(d))).slice(0,t);let o=a.split(/\s+/),s=[];for(let l of e){let d=l.entityId.toLowerCase(),c=l.name.toLowerCase(),p=(l.area??"").toLowerCase(),h=-1;d===a?h=0:d.startsWith(a)?h=1:c.startsWith(a)?h=2:d.includes(a)?h=3:c.includes(a)?h=4:o.length>1&&o.every(f=>d.includes(f)||c.includes(f))?h=5:p!==""&&(p.includes(a)||o.length>1&&o.every(f=>d.includes(f)||c.includes(f)||p.includes(f)))&&(h=6),h>=0&&s.push({c:l,rank:h})}return s.sort((l,d)=>l.rank-d.rank||r(l.c)-r(d.c)||l.c.name.localeCompare(d.c.name)||l.c.entityId.localeCompare(d.c.entityId)),s.slice(0,t).map(l=>l.c)}var Gd=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function ms(e){return Gd.test(e.trim())}function Ud(e,n,t){let i=e.trim();if(i!==n.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in t)return us(t,i);if(ms(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var xt=new Map;function Ee(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function fs(e){return xt.has(e)}function nt(e,n,t,i,a,r={}){let o=e.hass.states,s=xt.get(a),l=s?Bd(Dd(o,r.domain,Xo(e.hass)),s.query,hs,r.preferNumeric?Vd:void 0):[],d=s?Math.max(0,Math.min(s.index,l.length-1)):0,c=t.entityId?o[t.entityId]:void 0,p=(v,C,P=0)=>{xt.set(a,{query:C,index:P}),Ee(v)},h=v=>{xt.delete(a),Ee(v)},f=v=>{let C=Ud(v,t,o);C&&i(C)},g=(v,C)=>{i(us(o,v.entityId)),h(C)},w=()=>Math.max(0,Math.min(xt.get(a)?.index??0,l.length-1)),k=v=>{let C=v.target;if(v.key==="ArrowDown"||v.key==="ArrowUp"){v.preventDefault();let P=xt.get(a);if(!P){p(C,C.value);return}let N=v.key==="ArrowDown"?w()+1:w()-1;p(C,P.query,Math.max(0,Math.min(l.length-1,N))),Kd(C);return}if(v.key==="Enter"){v.preventDefault();let P=l[w()];s&&P?g(P,C):(f(C.value),h(C));return}if(v.key==="Escape"){if(!s)return;v.preventDefault(),v.stopPropagation(),h(C)}},E=t.entityId?Xo(e.hass)?.(t.entityId):void 0,T=t.entityId===""?u`<div class="hint">Type part of a name, a room, or an id.</div>`:c?u`<div class="entity-current">
          <span class="ent-ico ${$a(c.state)?"on":""}">${ka(t.domain||t.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:t.entityId}</span>
          ${E?u`<span class="ent-area">${E}</span>`:m}
          <span class="ent-state">${c.state}</span>
        </div>`:u`<div class="hint warn">Not in Home Assistant right now.</div>`;return u`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-box ${s?"open":""}">
      <span class="ent-glass">${z("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:t.entityId}
        placeholder="Search by name, room, or id"
        @focus=${v=>{let C=v.target;p(C,t.entityId),C.select()}}
        @input=${v=>{let C=v.target;p(C,C.value)}}
        @keydown=${k}
        @blur=${v=>{let C=v.target;s&&f(C.value),h(C)}} />
      ${(s?s.query:t.entityId)===""?m:u`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${v=>v.preventDefault()}
        @click=${v=>{let C=v.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),xt.set(a,{query:"",index:0}),Ee(C),C?.focus()}}>${z("close")}</button>`}
    </div>
    ${s?u`<div class="entity-results" role="listbox">
          ${l.length===0?u`<div class="hint" style="padding:6px 8px">${ms(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map((v,C)=>u`<button type="button" role="option" aria-selected=${C===d?"true":"false"} class="ent ${C===d?"hl":""}"
                @mousedown=${P=>P.preventDefault()} @click=${P=>g(v,P.target)}>
                <span class="ent-ico ${$a(v.state)?"on":""}">${ka(v.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${v.name}</span>
                  <span class="ent-sub">
                    ${v.area?u`<span class="ent-area">${v.area}</span>`:m}
                    <span class="ent-id mono">${v.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${Jo(v.domain)}</span>
                  <span class="ent-state">${v.state}</span>
                </span>
              </button>`)}
        </div>`:T}
  </div>`}function Kd(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var Wd=120;function jd(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(jn.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(qn),fromPack:!1}}function Zo(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function qd(e){return[{value:"",label:`Starter set (${Zo(qn,e)})`},...jn.map(n=>({value:n.name,label:`${n.name} (${Zo(n.symbols,e)})`}))]}function Yd(e){return e.length>0?e.length:qn.length}function Jd(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function Qo(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return u`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??u`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function gs(e,n,t,i){let a=e.symbols,r=a.isOpen(i),o=a.query(i),s=e.icons.names(),l=s??[],d=new Set(l),c=n.trim(),p=c!==""&&d.size>0&&!d.has(c),h=g=>{t(g),a.noteUsed(g)},f=m;if(r){let g=a.category(i),w=jd(g,o,l,d),k=Eo(w.names,o),E=w.fromPack?k.slice(0,Wd):k,T=d.size===0?a.recent:a.recent.filter(v=>d.has(v));f=u`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${he(v=>a.setQuery(i,v))} />
        <select @change=${he(v=>a.setCategory(i,v))}>
          ${qd(d).map(v=>u`<option value=${v.value} ?selected=${v.value===g}>${v.label}</option>`)}
        </select>
      </div>
      ${T.length===0?m:u`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${T.map(v=>Qo(e,v,v===c,h))}</div>`}
      <div class="sym-grid">${E.map(v=>Qo(e,v,v===c,h))}</div>
      ${k.length===0?u`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:u`<div class="hint">
            ${Jd(E.length,k.length,o.trim()!=="",Yd(l))}
          </div>`}
      ${e.icons.available()?s!==void 0&&s.length===0?u`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:m:u`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return u`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${he(t)} @change=${he(g=>{(d.size===0||d.has(g.trim()))&&a.noteUsed(g)})} /></label>
    ${p?u`<div class="hint warn">The installed icon pack has no <code>${c}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:m}
    <button type="button" class="link" @click=${()=>a.toggle(i)}>${r?"Hide symbols":"Browse symbols"}</button>
    ${f}`}var Xd=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"],["chartStat","A chart's number"]],Zd=[["bars","Bars"],["line","Line"],["area","Area"]],Qd=[["auto","Auto"],["fixed","Fixed range"]],ec=[["lowest","Lowest value"],["zero","Zero"]],ys=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],tc=[["none","None"],["pointer","Triangle & dot"],["dot","Dots"]],nc=[["uniform","One colour"],["bands","By value"]];function ic(e){let n=[Ii,"#FFD60A"];if(e.length<2)return n.map((o,s)=>({id:Y(),upTo:(s+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,s)=>({id:Y(),upTo:r(t+a*(s+1)/3),colorHex:o}))}function ac(e){let n=It(e).at(-1),t=e.bands.length>1?Math.abs(It(e)[1].upTo-It(e)[0].upTo):10;return{id:Y(),upTo:(n?.upTo??0)+(t||10),colorHex:e.colorSlot.baseColorHex}}var rc=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function oc(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"}}}function ae(e,n,t,i){if(i.inline||!sc())return u`<div class="value-editor">${xs(e,n,t,i)}</div>`;let a=Fa(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,s=ge(n,me(e)),l="entityId"in n.kind;return u`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?m:u`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?m:u`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${bs(e,a,r,n,t,i)}
  </div>`}function bs(e,n,t,i,a,r){return u`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${vs}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${hn.has(n)?xs(e,i,a,r):m}
  </div>`}function me(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function Fa(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function sc(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var hn=new Set,un=new WeakMap;function lc(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function dc(e,n){let t=e instanceof Node?e:null;if(!t)return;let i=t.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(n)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function vs(e){let n=e.currentTarget,t=e.newState==="open",i=un.get(n);if(i&&(i(),un.delete(n)),!t){hn.delete(n.id)&&Ee(n);return}let a=lc(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){un.get(n)?.(),un.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}Ca(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),un.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Ca(n,a.getBoundingClientRect()),hn.has(n.id)||(hn.add(n.id),Ee(n),requestAnimationFrame(()=>{n.isConnected&&Ca(n,a.getBoundingClientRect())}))}function Ca(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=cc({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var vt=8,Qn=6,es=140;function cc(e,n,t){let i=t.height-e.bottom-Qn-vt,a=e.top-Qn-vt,r=n.height>i&&a>i&&i<es,o=Math.max(es,r?a:i),s=Math.min(n.height,o),l=Math.max(vt,Math.min(e.left,t.width-n.width-vt)),d=r?Math.max(vt,e.top-Qn-s):Math.max(vt,Math.min(e.bottom+Qn,t.height-s-vt));return{left:l,top:d,maxHeight:o,above:r}}function xs(e,n,t,i){let a=n.kind,r=c=>t({...n,kind:c}),o=i.key,s=Xd.filter(([c])=>i.allowNamed!==!1||c!=="named"),l=m;switch(a.kind){case"literal":l=i.symbol?gs(e,a.value,c=>r({...a,value:c}),o):ue("Text",a.value,c=>r({...a,value:c}));break;case"entityState":case"entityAge":l=nt(e,"Entity",a,c=>r({...a,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),p=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=u`${nt(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${ue("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:p,mono:!0})}
        <datalist id=${p}>${c.map(h=>u`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":l=uc(e,a.aggregate,c=>r({...a,aggregate:c}),o);break;case"time":l=Se("Field",a.timeField,rc,c=>r({...a,timeField:c}));break;case"dataAge":l=u`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":l=u`${Od("Template",a.value,c=>r({...a,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":l=e.config.values.length===0?u`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:Se("Value",a.id,[["","(choose)"],...e.config.values.map(c=>[c.id,c.name||c.id.slice(0,8)])],c=>r({...a,id:c}));break;case"chartStat":{let c=me(e),p=e.config.elements.filter(h=>h.kind==="chart");l=p.length===0?u`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:u`
          ${Se("Chart",a.layer,[["","(choose)"],...p.map(h=>[h.payload.id,Te(h,c)])],h=>r({...a,layer:h}))}
          ${Se("Number",a.stat,[...Mt],h=>r({...a,stat:h}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Unit to print the entity's unit after it."}</div>`;break}}let d=i.showResolved?e.resolve(n):void 0;return u`
    ${Se("Source",a.kind,s,c=>r(oc(a,c)))}
    ${l}
    ${i.noFormat?m:pc(n.format,c=>t(_e(c)?{kind:n.kind}:{...n,format:c}))}
    ${i.showResolved?u`<div class="hint">Now: ${d===void 0?u`<span class="warn">unresolved</span>`:u`<code>${d}</code>`}</div>`:m}`}function pc(e,n){let t=e??{},i=a=>{let r={...t,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];n(r)};return u`<details class="sub" ?open=${!_e(e)}>
    <summary>Format${_e(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${ee("Decimals",t.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${ee("Multiply",t.multiply,a=>i({multiply:a}),{optional:!0})}
      ${ee("Offset",t.offset,a=>i({offset:a}),{optional:!0})}
      ${te("Case",t.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${ue("Prefix",t.prefix??"",a=>i({prefix:a}))}
      ${ue("Suffix",t.suffix??"",a=>i({suffix:a}))}
    </div>
    ${Ie("Append the entity's unit",!!t.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${Ie("Show as relative time (45s, 2m, 3h)",!!t.relativeTime,a=>i({relativeTime:a}))}
  </details>`}function uc(e,n,t,i){let a=s=>s.join(", "),r=s=>s.split(",").map(l=>l.trim()).filter(Boolean),o=n.scope;return u`
    ${Se("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],s=>t({...n,function:s}))}
    ${te("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],s=>t({...n,scope:s==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?u`<div class="grid2">
          ${ue("Domains",a(o.domains),s=>t({...n,scope:{...o,domains:r(s)}}),{placeholder:"light, switch"})}
          ${ue("Area ids",a(o.areaIds),s=>t({...n,scope:{...o,areaIds:r(s)}}))}
          ${ue("Label ids",a(o.labelIds),s=>t({...n,scope:{...o,labelIds:r(s)}}))}
          ${ue("Floor ids",a(o.floorIds),s=>t({...n,scope:{...o,floorIds:r(s)}}))}
        </div>`:u`${o.entities.map((s,l)=>u`<div class="row-inline">
            ${nt(e,`Entity ${l+1}`,s,d=>{let c=[...o.entities];c[l]=d,t({...n,scope:{...o,entities:c}})},`${i}-agg-${l}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,scope:{...o,entities:o.entities.filter((d,c)=>c!==l)}})}>${z("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${Se("Only count when",n.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],s=>{let l={...n};s===""?delete l.stateFilter:s==="equals"||s==="notEquals"?l.stateFilter={kind:s,value:n.stateFilter&&"value"in n.stateFilter?n.stateFilter.value:""}:l.stateFilter={kind:s},t(l)})}
    ${n.stateFilter&&"value"in n.stateFilter?ue("State",n.stateFilter.value,s=>t({...n,stateFilter:{kind:n.stateFilter.kind,value:s}})):m}
    ${n.function==="count"?m:ue("Attribute (blank = state)",n.attribute??"",s=>{let l={...n};s?l.attribute=s:delete l.attribute,t(l)})}`}var ws=Pi,hc=ws.filter(([e])=>e!=="none");function mc(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function ks(e){let n=e.config,t=n.tapAction,i=l=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(l),a=mc(e.savedName,n.name),r=n.refreshMinutes??0,o=ts.map(l=>[String(l),ns(l)]);ts.includes(r)||o.push([String(r),ns(r)]);let s=n.showSuccessFlash??!0;return u`
    <div class="gen-row">
      ${ue("Name",n.name,l=>e.update(d=>{d.name=l},"name"))}
      ${Se("Refresh",String(r),o,l=>e.update(d=>{d.refreshMinutes=Number(l)||0},"refresh"))}
      ${Se("Tap action",t.type,ws,l=>e.update(d=>{d.tapAction=i(l)?{type:l,..."entityId"in d.tapAction?{entityId:d.tapAction.entityId,displayName:d.tapAction.displayName,domain:d.tapAction.domain}:{entityId:"",displayName:"",domain:""}}:{type:l},l!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${s} title="Flash when a tap works"
            @change=${l=>e.update(d=>{d.showSuccessFlash=l.target.checked})} />
          ${s?u`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??fc).slice(0,7)}
                @input=${he(l=>e.update(d=>{d.successFlashColorHex=l.toUpperCase()},"flash"))} />`:u`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${a?u`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:m}
    ${"entityId"in t?nt(e,"Target",t,l=>e.update(d=>{d.tapAction={type:t.type,...l}},"tap-entity"),"general-tap"):m}
    ${t.type==="openPage"?gc(e):m}`}var fc="#808080",ts=[0,15,30,60,120];function ns(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function gc(e){let n=e.config;return $s(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function $s(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?u`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:u`${Se("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?m:u`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function Cs(e,n){let t=e.config.values.findIndex(a=>a.id===n.id),i=`nv-${n.id}`;return u`
    ${ue("Name",n.name,a=>e.update(r=>{r.values[t].name=a},`${i}-name`))}
    ${ae(e,n.value,a=>e.update(r=>{r.values[t].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${is(e.config,n.id)} layer${is(e.config,n.id)===1?"":"s"}.</div>`}function is(e,n){return JSON.stringify(e.elements).split(`"${n}"`).length-1+JSON.stringify(e.perFamily).split(`"${n}"`).length-1}function Ss(){return{id:Y(),name:"Value",value:M("")}}function fe(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function we(e,n,t,i,a=!1){let r=e.elements.find(c=>c.payload.id===t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let s=fe(e,n,r),d={...o.placements[t]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};if(a&&delete d.size,Object.keys(o.placements).length===0)for(let c of e.elements)c.payload.id!==t&&(o.placements[c.payload.id]={frame:{...c.payload.frame},isHidden:c.payload.isHidden});o.placements[t]=d}function ei(e,n,t,i,a){let r=n.payload.id,o=An(n)??a.min,s=fe(e.config,t,n).size??o;return ee(`${i} (pt)`,s,l=>e.update(d=>we(d,t,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min,...a.def===void 0?{}:{def:a.def}})}function Es(e,n,t){for(let i of Q)i===t||!e.supportedFamilies.includes(i)||we(e,i,n,{isHidden:!0})}function Ts(e,n,t){let i=e.perFamily[t]??(e.perFamily[t]=zt()),a={};for(let r of e.elements){let o=fe(e,n,r),s=o.size??An(r),l={frame:{...o.frame},isHidden:o.isHidden,...s!==void 0?{size:s}:{}};a[r.payload.id]=Vi(l,n,t,r.kind)}i.placements=a}function li(e,n){return e.elements.filter(t=>!fe(e,n,t).isHidden).length}function as(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function yc(e){return e.kind==="image"||e.kind==="tap"?void 0:e.payload.colorSlot.baseColorHex}function Fs(e,n,t){let i=as(t.map(d=>fe(e,n,d).isHidden)),a=as(t.map(d=>d.payload.isHidden)),r=t.map(yc),o=t.length>0&&r.every(d=>d!==void 0),s=r[0],l=o&&s!==void 0&&r.every(d=>d!==void 0&&d.toUpperCase()===s.toUpperCase());return{hiddenHere:i,hiddenEverywhere:a,colourable:o,colour:l?s:void 0}}var Ra=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function bc(e,n,t){let i=n.payload.id,a=zn(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"?{domain:"camera"}:{};return u`
    ${nt(e,n.kind==="image"?"Camera":"Entity",r,s=>e.update(l=>jr(l,i,s),`${t}-entity`),`${t}-layer-entity`,o)}
    <div class="hint">${wc(n,a)}</div>`}function vc(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function xc(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function wc(e,n){let t=vc(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=n.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":"the text"),n.some(d=>d.where==="tap")&&o.push("the tap");let l=n.filter(d=>d.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${xc(o)}.${r}`}function kc(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function $c(e,n){let t=e.timestamp===!0,i=Be(e),a=r=>n(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Be(o)&&(o.timestampCorner=zi(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return u`
    ${Ie("Show timestamp",t,r=>n(o=>{r?o.timestamp=!0:delete o.timestamp}),!1)}
    ${t?u`
      ${te("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?m:te("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>n(o=>{o.timestampCorner=r}))}
      ${ee("Text size (pt)",e.timestampSize,r=>n(o=>{o.timestampSize=Math.min(40,Math.max(4,r??Ht))},"tssize"),{step:1,min:4,max:40,def:Ht})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:m}`}function ri(e,n){if(e===n)return!0;if(typeof e!=typeof n||e===null||n===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(n))return!1;if(Array.isArray(e))return e.length===n.length&&e.every((a,r)=>ri(a,n[r]));let t=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(n).filter(a=>n[a]!==void 0);return t.length!==i.length?!1:t.every(a=>ri(e[a],n[a]))}function rs(e,n,t){return t.some(i=>!ri(e[i],n[i]))}function os(e,n,t){let i=e,a=n;for(let r of t)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function xe(e,n,t,i,a={}){let r=e.openSections.has(n),o=()=>e.toggleSection(n);return u`<section class="sec" data-open=${r?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${r?"true":"false"} @click=${o}
      @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
      <span class="swatch">${z(a.icon??"content")}</span>
      <span class="tt"><h4>${t}${ps(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${t} back to its defaults`,reset:a.reset})}</h4>${a.summary?u`<span class="sum">${a.summary}</span>`:m}</span>
      <span class="chev">${z("chevron")}</span>
    </div>
    ${r?u`<div class="sec-b">${i}</div>`:m}
  </section>`}function Cc(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function Sa(e){let n=Tn.find(o=>o.minutes===e);if(n)return n.label;let t=Math.floor(e/1440),i=Math.floor(e%1440/60),a=e%60,r=[];return t>0&&r.push(`${t}d`),i>0&&r.push(`${i}h`),(a>0||r.length===0)&&r.push(`${a}m`),`Last ${r.join(" ")}`}var ti=new Set;function Ma(e,n){let t=me(e);switch(n.kind){case"text":return wt(ge(n.payload.value,t),48);case"icon":return wt(ge(n.payload.symbol,t),48);case"gauge":return wt(ge(n.payload.value,t),48);case"chart":return wt(`${ge(n.payload.value,t)}${n.payload.historyMinutes>0?` \xB7 ${Sa(n.payload.historyMinutes)}`:""}`,48);case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":return n.payload.entity.displayName||n.payload.entity.entityId||"No camera yet";case"tap":return Ge(n.payload.action)}}function oi(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${Me(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${Me(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${e.payload.style} \xB7 ${e.payload.lineWidth} pt line \xB7 ${Me(e.payload.colorSlot.baseColorHex)}`;case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${ys.find(([n])=>n===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"shape":return`${Me(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function Rs(e,n,t){let i=n.payload.id,a=e.config.elements.findIndex(y=>y.payload.id===i),r=`el-${i}`,o=(y,$)=>e.update(D=>y(D.elements[a]),$?`${r}-${$}`:void 0),s=fe(e.config,t,n),l=s.frame,d=(y,$)=>e.update(D=>we(D,t,i,{frame:Ko(l,y)}),`${r}-${$}-${t}`),c=ze(n.kind).payload,p=c.colorSlot?.baseColorHex??"#FFFFFF",h=y=>c[y],f,g;switch(n.kind){case"text":{let y=Oi(e.config,n.payload.value);f=u`
        ${ae(e,n.payload.value,$=>o(D=>{D.payload.value=$},"value"),{showResolved:!0,label:"Text",key:`${r}-value`})}
        ${y?u`<div class="hint">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(y.payload.id)}>${Te(y,me(e))}</button>. It stays in the chart's group and moves with it.</div>`:m}
        ${Ie("Live countdown",n.payload.countdown===!0,$=>o(D=>{let Z=D.payload;$?Z.countdown=!0:delete Z.countdown}),c.countdown===!0)}
        ${n.payload.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:m}`,g=u`<div class="grid2">
          ${ei(e,n,t,"Font size",{step:1,min:4,def:h("fontSize")})}
          ${te("Weight",n.payload.fontWeight,Ra,$=>o(D=>{D.payload.fontWeight=$}),{def:c.fontWeight})}
        </div>`;break}case"icon":f=u`
        ${ae(e,n.payload.symbol,y=>o($=>{$.payload.symbol=y},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,g=ei(e,n,t,"Icon size",{step:1,min:4,def:h("size")});break;case"gauge":f=u`
        ${ae(e,n.payload.value,y=>o($=>{$.payload.value=y},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        <div class="grid2">
          ${ee("Min",n.payload.minValue,y=>o($=>{$.payload.minValue=y??0},"min"),{def:c.minValue})}
          ${ee("Max",n.payload.maxValue,y=>o($=>{$.payload.maxValue=y??100},"max"),{def:c.maxValue})}
        </div>`,g=u`
        <div class="grid2">
          ${te("Style",n.payload.style,[["arc","Arc"],["ring","Ring"],["bar","Bar"]],y=>o($=>{$.payload.style=y}),{titles:{arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar"},def:c.style})}
          ${ei(e,n,t,"Line width",{step:.5,min:.5,def:h("lineWidth")})}
        </div>
        ${pe("Track colour",n.payload.trackColorHex,y=>o($=>{$.payload.trackColorHex=y??"#FFFFFF40"},"track"),!1,c.trackColorHex)}`;break;case"chart":{let y=n.payload,$=(R,_)=>o(be=>R(be.payload),_),D=ut(y),Z=c.historyMinutes,K=c.historyPoints,J=y.historyMinutes>0,V=y.value.kind.kind==="entityState",ye=D===void 0?void 0:e.historySeries(D),ui=J&&V?ye??"":e.resolve(y.value)??"",Fe=y.historyPoints<1,tl=Tn.some(R=>R.minutes===y.historyMinutes),gn=ti.has(i)||!tl,hi=Math.floor(y.historyMinutes/1440),mi=Math.floor(y.historyMinutes%1440/60),fi=y.historyMinutes%60,gi=(R,_,be)=>$(Et=>{Et.historyMinutes=Math.min(Er,Math.max(1,Math.round(R)*1440+Math.round(_)*60+Math.round(be)))},"span"),Ae=sn(ui),St=y.limit>0&&Ae.length>y.limit?y.takeFromEnd?Ae.slice(Ae.length-y.limit):Ae.slice(0,y.limit):Ae,nl=!J&&V&&Ae.length===1;f=u`
        ${ae(e,y.value,R=>$(_=>{_.value=R},"value"),{label:"Readings",key:`${r}-value`})}
        ${te("Draw",J?"history":"value",[["history","Recorded history"],["value","The value itself"]],R=>$(_=>{_.historyMinutes=R==="history"?_.historyMinutes||Fn:0}),{titles:{history:"Read the entity's past from the recorder and plot it",value:"Plot the numbers the value holds right now, such as a forecast list"},def:c.historyMinutes>0?"history":"value"})}
        ${J?u`
            ${V?m:u`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              <label class="field">${Je("Span",{atDefault:y.historyMinutes===Z&&!gn,title:`Back to ${Sa(Z)}`,reset:()=>{ti.delete(i),$(R=>{R.historyMinutes=Z})}})}
                <select @change=${R=>{let _=R.target.value;_==="custom"?(ti.add(i),Ee(R.target)):(ti.delete(i),$(be=>{be.historyMinutes=Number(_)||Fn}))}}>
                  ${Tn.map(({minutes:R,label:_})=>u`<option value=${String(R)} ?selected=${!gn&&R===y.historyMinutes}>${_}</option>`)}
                  <option value="custom" ?selected=${gn}>Custom…</option>
                </select></label>
              <div class="field readings-field">${Je("Readings",{atDefault:y.historyPoints===K,title:`Back to ${K<1?"every one":`${K} averaged`}`,reset:()=>$(R=>{R.historyPoints=K})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Readings">
                    <button type="button" role="radio" aria-checked=${Fe?"false":"true"} class=${Fe?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{Fe&&$(R=>{R.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${Fe?"true":"false"} class=${Fe?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{Fe||$(R=>{R.historyPoints=Hi})}}>Every one</button>
                  </div>
                  ${Fe?m:u`<input type="number" class="short" aria-label="How many readings" .value=${String(y.historyPoints)}
                    step="1" min=${Ai} max=${Rn}
                    @input=${he(R=>{let _=Number(R);R.trim()!==""&&Number.isFinite(_)&&_>=1&&$(be=>{be.historyPoints=Math.round(_)},"hpoints")})} />`}
                </div>
              </div>
            </div>
            ${gn?u`<div class="grid3 span-parts">
                ${ee("Days",hi,R=>gi(R??0,mi,fi),{step:1,min:0,max:7})}
                ${ee("Hours",mi,R=>gi(hi,R??0,fi),{step:1,min:0,max:23})}
                ${ee("Minutes",fi,R=>gi(hi,mi,R??0),{step:1,min:0,max:59})}
              </div>
              <div class="hint">${Sa(y.historyMinutes)}, up to 7 days: the recorder keeps
                ten by default, and a longer span would quietly come back short.</div>`:m}
            <div class="hint">${Fe?u`Every state the recorder holds in that span, oldest first, one reading per change,
                  and a chatty sensor keeps its newest ${Rn}. The time axis follows
                  the changes, so a quiet hour draws narrower than a busy one.`:u`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${V&&ye===void 0?u`<div class="hint">Reading the history…</div>`:m}
            ${V&&ye===""?u`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:m}`:u`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${Ae.length===0&&!(J&&(!V||ye===void 0||ye===""))?u`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:m}
        ${Ae.length>0?u`<div class="hint">Reads <span class="nums">${Cc(St)}</span>${Ae.length===St.length?u` · ${St.length} ${St.length===1?"value":"values"}`:u` · ${St.length} of ${Ae.length}`}</div>`:m}
        ${nl?u`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:m}
        <div class="grid2">
          ${ee("Use",y.limit,R=>$(_=>{_.limit=Math.max(0,Math.round(R??0))},"limit"),{step:1,min:0,def:c.limit})}
          ${te("From",y.takeFromEnd?"end":"start",[["start","The first"],["end","The last"]],R=>$(_=>{_.takeFromEnd=R==="end"}),{def:c.takeFromEnd===!0?"end":"start"})}
        </div>
        <div class="hint">${J?"Trims the series after it arrives, so 0 draws every reading fetched above.":"A forecast sensor often carries 24 or 48 entries. 0 draws all of them."}</div>`,g=u`
        <div class="grid2">
          ${te("Style",y.style,Zd,R=>$(_=>{_.style=R}),{def:c.style})}
          ${y.style==="bars"?ee("Bar gap (pt)",y.barGap,R=>$(_=>{_.barGap=Math.max(0,R??0)},"gap"),{step:.5,min:0,def:c.barGap}):ei(e,n,t,"Line width",{step:.5,min:.5,def:h("lineWidth")})}
        </div>
        <div class="grid2">
          ${te("Scale",y.scale,Qd,R=>$(_=>{_.scale=R}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:c.scale})}
          ${te("Baseline",y.baseline,ec,R=>$(_=>{_.baseline=R}),{def:c.baseline})}
        </div>
        ${y.scale==="fixed"?u`<div class="grid2">
              ${ee("Min",y.minValue,R=>$(_=>{_.minValue=R??0},"cmin"),{def:c.minValue})}
              ${ee("Max",y.maxValue,R=>$(_=>{_.maxValue=R??100},"cmax"),{def:c.maxValue})}
            </div>`:m}
        <div class="hint">${y.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        ${te("Colour",y.coloring,nc,R=>$(_=>{_.coloring=R,R==="bands"&&_.bands.length===0&&(_.bands=ic(St))}),{def:c.coloring})}
        ${y.coloring==="bands"?u`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${y.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${y.bands.map((R,_)=>u`
            <div class="row-inline">
              ${ee("Up to",R.upTo,be=>$(Et=>{let at=Et.bands[_];at&&(at.upTo=be??0)},`bup${R.id}`))}
              ${pe("Colour",R.colorHex,be=>$(Et=>{let at=Et.bands[_];at&&(at.colorHex=be??"#FFFFFF")},`bcol${R.id}`))}
              <button class="icon" title="Remove this band" aria-label="Remove this band"
                @click=${()=>$(be=>{be.bands=be.bands.filter((Et,at)=>at!==_)})}>${z("close")}</button>
            </div>`)}
          <button class="small" @click=${()=>$(R=>{R.bands=[...R.bands,ac(R)]})}>Add band</button>
          ${pe("And the rest",y.bandAboveColorHex,R=>$(_=>{_.bandAboveColorHex=R??nn},"babove"),!1,nn)}
          ${y.style==="area"?u`${Ie("Fill follows the bands",y.fillBands,R=>$(_=>{_.fillBands=R}),c.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:m}`:m}
        <div class="grid2">
          ${te("Highlight",y.highlight,ys,R=>$(_=>{_.highlight=R}),{def:c.highlight})}
          ${y.highlight==="none"?m:te("Marker",y.marker,tc,R=>$(_=>{_.marker=R}),{def:c.marker})}
        </div>
        ${y.highlight==="none"?m:u`
          <div class="grid2">
            ${y.highlight==="lowest"?m:pe("Highest colour",y.highColorHex,R=>$(_=>{_.highColorHex=R??en},"hicol"),!1,en)}
            ${y.highlight==="highest"?m:pe("Lowest colour",y.lowColorHex,R=>$(_=>{_.lowColorHex=R??tn},"locol"),!1,tn)}
          </div>
          <div class="hint">A marker is worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}`;break}case"shape":f=u`<div class="grid2">
          ${te("Shape",n.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"]],y=>o($=>{$.payload.kind=y}),{titles:{roundedRectangle:"Rounded rectangle"},def:c.kind})}
          ${n.payload.kind==="roundedRectangle"?ee("Corner radius (pt)",n.payload.cornerRadius,y=>o($=>{$.payload.cornerRadius=y??6},"radius"),{step:.5,min:0,def:c.cornerRadius}):m}
        </div>`,g=u`
        ${pe("Border colour",n.payload.borderColorHex,y=>o($=>{y===void 0?delete $.payload.borderColorHex:$.payload.borderColorHex=y},"border"),!0,null)}
        ${n.payload.borderColorHex!==void 0?ee("Border width (pt)",n.payload.borderWidth,y=>o($=>{$.payload.borderWidth=y??1},"bw"),{step:.5,min:0,def:c.borderWidth}):m}`;break;case"image":{let y=n.payload,$=(D,Z)=>o(K=>D(K.payload),Z);f=u`
        ${y.entity.entityId&&!y.entity.entityId.startsWith("camera.")?u`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>`:m}
        <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`,g=u`
        ${te("Picture",y.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],D=>$(Z=>{Z.contentMode=D}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:c.contentMode})}
        ${Xn("Zoom",y.zoom,D=>$(Z=>{Z.zoom=D},"zoom"),{min:la,max:4,step:.05,def:1,format:D=>`${D.toFixed(2)}x`})}
        ${Xn("Pan left/right",y.panX,D=>$(Z=>{Z.panX=D},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${Xn("Pan up/down",y.panY,D=>$(Z=>{Z.panY=D},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${kc(y)}</div>
        ${ee("Corner radius (pt)",y.cornerRadius,D=>$(Z=>{Z.cornerRadius=Math.max(0,D??At)},"imgradius"),{step:1,min:0,def:At})}`;break}case"tap":{f=u`
        ${Ms(e,n.payload,(y,$)=>o(D=>y(D.payload),$),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let w=n.kind==="image"||n.kind==="tap"?void 0:pe(n.kind==="shape"?"Fill colour":"Colour",n.payload.colorSlot.baseColorHex,y=>o($=>{$.kind!=="image"&&$.kind!=="tap"&&($.payload.colorSlot.baseColorHex=y??"#FFFFFF")},"color"),!1,p),k=Ui(e.config,n),E=k?{kind:{kind:"entityState",...k}}:void 0,T=re[n.kind],v=n.kind==="tap"?void 0:Ce(e.config,i)[0],C=n.kind==="image"?n.payload.timestamp===!0:!1,P=Ec[n.kind],N=Tc[n.kind],q=rs(n.payload,c,P),oe=n.kind==="text"?"fontSize":n.kind==="icon"?"size":n.kind==="gauge"||n.kind==="chart"?"lineWidth":void 0,x=e.config.perFamily[t]?.placements[i]?.size!==void 0,S=rs(n.payload,c,N)||oe!==void 0&&s.size!==void 0&&s.size!==c[oe],O=!ri(l,Ve)||s.isHidden,L=ht(e.config,i),ne=(y,$)=>()=>o(D=>os(D.payload,c,y),$);return u`
    ${xe(e,"content","Content",u`${n.kind==="tap"?m:bc(e,n,r)}${f}`,{color:T,icon:"content",summary:Ma(e,n),...q?{reset:ne(P,"reset-content")}:{}})}
    ${g===void 0&&w===void 0?m:xe(e,"look",n.kind==="image"?"Picture":"Look",u`${g??m}${w??m}`,{color:T,icon:n.kind==="image"?"image":"look",...oi(n)?{summary:oi(n)}:{},...S?{reset:()=>e.update(y=>{os(y.elements[a].payload,c,N),x&&we(y,t,i,{},!0)})}:{}})}
    ${n.kind==="chart"?xe(e,"numbers","Numbers",Ic(e,n),{color:re.text,icon:"text",summary:Mc(e,n),...L.length>0?{reset:()=>e.update(y=>{for(let $ of ht(y,i))mt(y,$.payload.id)})}:{}}):m}
    ${n.kind==="image"?xe(e,"timestamp","Timestamp",$c(n.payload,(y,$)=>o(D=>y(D.payload),$)),{color:T,icon:"clock",summary:C?`Shown \xB7 ${n.payload.timestampSize} pt`:"Hidden",...C?{reset:ne(Sc,"reset-stamp")}:{}}):m}
    ${n.kind==="tap"?m:xe(e,"tappable","Tap",Ac(e,n,r),{color:X.tap,icon:"tap",summary:v?Ge(v.payload.action):"Not tappable",...v?{reset:()=>e.update(y=>Ln(y,i))}:{}})}
    ${xe(e,"states","States",Ps(e,n.payload.rules,n.kind,y=>y.elements.find($=>$.payload.id===i)?.payload.rules,`rules-${i}`,E),{color:X.states,icon:"states",summary:cn(n.payload.rules).replace(/\.$/,""),...n.payload.rules.length>0?{reset:()=>o(y=>{y.payload.rules=[]})}:{}})}
    ${xe(e,"placement","Place",u`
      <div class="grid4">
        ${Zn("Left",l.x,y=>d({x:y},"x"),Ve.x,-100,100)}
        ${Zn("Top",l.y,y=>d({y},"y"),Ve.y,-100,100)}
        ${Zn("Width",l.width,y=>d({width:y},"w"),Ve.width,4,200)}
        ${Zn("Height",l.height,y=>d({height:y},"h"),Ve.height,4,200)}
      </div>
      ${Xn("Rotation",l.rotationDegrees,y=>d({rotationDegrees:y},"rot"),{min:-180,max:180,step:1,def:0,format:y=>`${Math.round(y)}\xB0`})}
      <div class="hint">Drag the layer on the ${U(t)} preview to move it, or pull a
        corner to resize it, and the four boxes above follow. Arrow keys nudge the selection 1 pt,
        shift-arrows 10 pt. The eye on the layer's row hides it.</div>
      <div class="hint">Everything about where this layer sits, how big it is drawn and whether it
        shows belongs to the ${U(t)} shape alone. Pick another shape above to place
        the same layer differently there.</div>`,{color:X.place,icon:"place",summary:`${Math.round(l.width*100)}% wide \xB7 ${U(t)}${s.fromPlacement?"":" \xB7 shared frame"}`,...O?{resetTitle:`Put this layer back to the middle of the ${U(t)} face at half size, unrotated and shown`,reset:()=>e.update(y=>we(y,t,i,{frame:{...Ve},isHidden:!1}))}:{}})}`}var Sc=["timestamp","timestampCorner","timestampSize"],Ec={text:["value","countdown"],icon:["symbol"],gauge:["value","minValue","maxValue"],chart:["value","historyMinutes","historyPoints","limit","takeFromEnd"],shape:["kind","cornerRadius"],image:["entity"],tap:["action","openPageName"]},Tc={text:["fontSize","fontWeight","colorSlot"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","colorSlot"],shape:["colorSlot","borderColorHex","borderWidth"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[]};function Ms(e,n,t,i){let a=n.action,r=o=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(o);return u`
    ${Se("Tap action",a.type,hc,o=>t(s=>{s.action=r(o)?{type:o,..."entityId"in s.action?{entityId:s.action.entityId,displayName:s.action.displayName,domain:s.action.domain}:{entityId:"",displayName:"",domain:""}}:{type:o},o!=="openPage"&&(delete s.openPageId,delete s.openPageName)}))}
    ${"entityId"in a?nt(e,"Target",a,o=>t(s=>{s.action={type:a.type,...o}},"tap-entity"),`${i}-tap`):m}
    ${a.type==="openPage"?$s(e,n.openPageId,n.openPageName,(o,s)=>t(l=>{if(o===void 0){delete l.openPageId,delete l.openPageName;return}l.openPageId=o,s?l.openPageName=s:delete l.openPageName},"tap-page")):m}`}var Fc=24;function Rc(e,n){let t=[],i=1/0;for(let r of Q){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=Ur(e.config,n,r);o&&(t.push(`${U(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return m;let a=i<Fc;return u`<div class=${a?"hint warn":"hint"}>${t.join(" \xB7 ")}${a?u`<br />That is small for a wrist. Show the tap area and drag its corners out.`:m}</div>`}function Mc(e,n){let t=ht(e.config,n.payload.id);return t.length===0?"None yet":t.map(i=>{let a=i.payload.value.kind;return a.kind==="chartStat"?(Mt.find(([r])=>r===a.stat)?.[1]??"number").toLowerCase():"number"}).join(" \xB7 ")}function Ic(e,n){let t=me(e),i=ht(e.config,n.payload.id),a=o=>e.update(s=>{Pr(s,n.payload.id,o)}),r=new Set(i.map(o=>o.payload.value.kind.kind==="chartStat"?o.payload.value.kind.stat:""));return u`
    ${i.length===0?u`<div class="hint">A chart with no numbers on it shows that a reading moved, not what it moved to. Add one and it appears as a text layer in this chart's group: drag it anywhere, give it any size or colour, and it prints the live value.</div>`:u`
        <div class="chart-numbers">
          ${i.map(o=>u`
            <div class="num-row">
              <button class="small" title="Edit this number" @click=${()=>e.selectLayer(o.payload.id)}>
                <b>${e.resolve(o.payload.value)??"--"}</b> · <span class="ent-tok">${Te(o,t)}</span>
              </button>
              <button class="icon danger" title="Delete this number" aria-label="Delete this number"
                @click=${()=>e.update(s=>mt(s,o.payload.id))}>${z("close")}</button>
            </div>`)}
        </div>
        <div class="hint">Each number is a text layer in this chart's group. Click one to edit it; drag it on the preview to move it. The × deletes it, and Undo brings it back.</div>`}
    <div class="hint"><b>Add</b></div>
    <div class="adders">
      ${Mt.map(([o,s])=>u`
        <button class="small" title=${r.has(o)?`Add another ${s.toLowerCase()}`:`Add the ${s.toLowerCase()}`}
          @click=${()=>a(o)}>${z("plus")}<span>${s}</span></button>`)}
    </div>
    <div class="hint">The newest reading starts with the entity's unit after it. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>`}function Ac(e,n,t){if(n.kind==="tap")return m;let i=n.payload.id,a=Ce(e.config,i)[0],r=(s,l)=>e.update(d=>{let c=d.elements.find(p=>p.kind==="tap"&&p.payload.attachedTo===i);c&&s(c.payload)},l?`${t}-${l}`:void 0),o=Ki(e.config,n);return u`
    ${Ie("Tappable",a!==void 0,s=>e.update(l=>{s?Hn(l,i):Ln(l,i)}))}
    ${a?u`<div class="value-editor">
          ${Ms(e,a.payload,r,`${t}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${Mn(a.payload.outset)?m:u`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(s=>{s.outset={..._i}})}>${z("reset")}</button>`}
          </div>
        </div>
        ${Rc(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:u`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Ge(o)}</b>.</div>`}`}function ss(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function Te(e,n){switch(e.kind){case"text":return ss(ge(e.payload.value,n));case"icon":return ss(ge(e.payload.symbol,n));case"gauge":return ge(e.payload.value,n);case"chart":return ge(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let t=e.payload.entity;return t.displayName||t.entityId||"camera"}case"tap":{let t=e.payload.action,i="entityId"in t?t.displayName||t.entityId:t.type==="openPage"&&e.payload.openPageName||"";return i?`${t.type} \xB7 ${i}`:t.type}}}function Is(e,n){let t=Ke(e.config,n.id),i=me(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(d=>d.id===n.id);l&&r(l)},o?`group-${n.id}-${o}`:void 0);return xe(e,"content","Group",u`
    ${ue("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${Ie("Move as one on the watch",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="hint">${t.length} layer${t.length===1?"":"s"}: ${t.map(r=>Te(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>an(r,n.id))}>Ungroup</button>
    </div>`,{color:X.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function As(e,n){if(n==="inline")return Hc(e);let t=e.config.perFamily[n];if(!t)return u`<div class="hint">No settings stored for ${U(n)} yet.</div>
      <button class="small" @click=${()=>e.update(s=>{s.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${U(n)} settings</button>`;let i=(s,l)=>e.update(d=>s(d.perFamily[n]),l?`fam-${n}-${l}`:void 0),a=li(e.config,n),r=t.backgroundColorHex?Me(t.backgroundColorHex):"transparent",o=t.borderColorHex?`${t.borderWidth} pt ${Me(t.borderColorHex)} border`:"no border";return u`
    ${xe(e,"look",`${U(n)} shape`,u`
      ${pe("Background (blank = transparent)",t.backgroundColorHex,s=>i(l=>{s===void 0?delete l.backgroundColorHex:l.backgroundColorHex=s},"bg"),!0,null)}
      ${pe("Border colour",t.borderColorHex,s=>i(l=>{s===void 0?delete l.borderColorHex:l.borderColorHex=s},"border"),!0,null)}
      ${ee("Border width (pt)",t.borderWidth,s=>i(l=>{l.borderWidth=s??2},"bw"),{step:.5,min:0,def:2})}`,{color:X.place,icon:"shape",summary:`${r} \xB7 ${o}`,...t.backgroundColorHex!==void 0||t.borderColorHex!==void 0||t.borderWidth!==2?{reset:()=>i(s=>{delete s.backgroundColorHex,delete s.borderColorHex,s.borderWidth=2},"reset-look")}:{}})}
    ${n==="corner"?xe(e,"corner","Corner content",Lc(e,t,i),{color:X.place,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas",...t.curvedText!==void 0||t.bezelText!==void 0||t.bezelGauge!==void 0?{reset:()=>i(s=>{delete s.curvedText,delete s.bezelText,delete s.bezelGauge},"reset-corner")}:{}}):m}
    ${xe(e,"states","Shape states",Ps(e,t.rules,"layout",s=>s.perFamily[n]?.rules,`rules-${n}`),{color:X.states,icon:"states",summary:cn(t.rules).replace(/\.$/,""),...t.rules.length>0?{reset:()=>i(s=>{s.rules=[]},"reset-states")}:{}})}
    ${xe(e,"placements","Placements",u`
      <div class="hint">${a===0?`Nothing is on the ${U(n)} shape. The Layers card offers to copy another shape's whole arrangement onto it.`:`${a} layer${a===1?" is":"s are"} on the ${U(n)} shape, each with its own frame and size here.`}</div>`,{color:X.place,icon:"place",summary:a===0?"Nothing placed":`${a} layer${a===1?"":"s"} placed`})}`}function Hc(e){let n=e.config.inline;if(!n)return u`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=me(e);return u`
    ${xe(e,"content","Inline text",u`
      ${ue("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${ae(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${Ie("Live countdown",n.countdown===!0,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${n.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:m}`,{color:re.text,icon:"text",summary:wt(`${n.label?`${n.label}: `:""}${ge(n.value,i)}`,48)})}
    ${xe(e,"symbol","Symbol",u`
      ${gs(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</div>`,{color:re.icon,icon:"icon",summary:n.symbol||"None"})}`}function Lc(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return u`
    ${te("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=M("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?u`
      ${ae(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${pe("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:m}
    ${te("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=M("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:M("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?u`
      ${ae(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${Ie("Live countdown",n.bezelCountdown===!0,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:m}
    ${a==="gauge"&&n.bezelGauge?zc(e,n.bezelGauge,t):m}`}function zc(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return u`
    ${ae(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${ee("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${ee("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${pe("Arc colour (min end)",i[0],a(0))}
    ${pe("Arc colour (middle)",i[1],a(1))}
    ${pe("Arc colour (max end)",i[2],a(2))}
    ${Ie("End number labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let s=o.bezelGauge;r?(s.minLabel=M(String(s.minValue)),s.maxLabel=M(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${n.minLabel?ae(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):m}
    ${n.maxLabel?ae(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):m}`}var xh=Q.map(e=>[e,U(e)]),Ia={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},_c=Object.keys(Ia);function Pc(e){let n=_n[e];return _c.filter(t=>n.includes($e[t]))}var Oc={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function ni(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function wt(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function Nc(e){if(!e||_e(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function ge(e,n){return`${Hs(e,n)}${Nc(e.format)}`}function Hs(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${wt(t.value,40)}"`:"(empty)";case"entityState":return ni(t,n);case"entityAttribute":return t.attribute?`${ni(t,n)} \xB7 ${t.attribute}`:ni(t,n);case"entityAge":return`age of ${ni(t,n)}`;case"aggregate":return Dc(t.aggregate);case"time":return Oc[t.timeField];case"dataAge":return"data age";case"jinja":return t.value?`template ${wt(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(Mt.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Hs(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function Dc(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function si(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function Vc(e,n,t,i,a){let r=(o,s)=>e.update(l=>{let d=i(l);d&&o(d)},s?`${a}-${s}`:void 0);return u`
    ${n.length===0?u`<div class="hint">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:m}
    ${n.map((o,s)=>Bc(e,o,s,n.length,t,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(on())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function Bc(e,n,t,i,a,r,o){let s=e.liveBranch(n),l=e.forced.get(n.id)??"live",d=p=>l==="live"?p==="live":l==="otherwise"?p==="otherwise":l.caseId===p,c=(p,h)=>r(f=>{let g=f.find(w=>w.id===n.id);g&&p(g)},h);return u`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(p=>si(p,t,t-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(p=>si(p,t,t+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(p=>{let h=p.findIndex(f=>f.id===n.id);h>=0&&p.splice(h,1)})}>${z("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
      ${n.cases.map((p,h)=>u`<button class="${d(p.id)?"active":""} ${s===p.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:p.id})}>Case ${h+1}</button>`)}
      ${n.otherwise?u`<button class="${d("otherwise")?"active":""} ${s==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:m}
    </div>
    ${n.cases.map((p,h)=>Gc(e,p,h,n,a,c,`${o}-${p.id}`))}
    <div class="adders"><button class="small" @click=${()=>c(p=>{p.cases.push(Ji())})}>+ case</button></div>
    ${Ie("Otherwise (when no case matches)",n.otherwise!==void 0,p=>c(h=>{p?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${n.otherwise?u`<div class="case-box otherwise">
          <div class="hint">${s==="otherwise"?u`<b>Active now.</b> `:m}Changes when no case matches:</div>
          ${Ls(e,n.otherwise,a,p=>c(h=>{h.otherwise&&p(h.otherwise)}),`${o}-otherwise`)}
        </div>`:m}
  </div>`}function Gc(e,n,t,i,a,r,o){let s=(d,c)=>r(p=>{let h=p.cases.find(f=>f.id===n.id);h&&d(h)},c),l=e.liveBranch(i)===n.id;return u`<div class="case-box ${l?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${l?u` <span class="ok">· active now</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(d=>si(d.cases,t,t-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(d=>si(d.cases,t,t+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let c=d.cases.findIndex(p=>p.id===n.id);c>=0&&d.cases.splice(c,1)})}>${z("delete")}</button>
    </div>
    <div class="row-inline">
      ${te("When",n.when.join,[["all","All of these are true"],["any","Any of these is true"]],d=>s(c=>{c.when.join=d}))}
    </div>
    ${n.when.tests.length===0?u`<div class="hint">No tests: this case always matches.</div>`:m}
    ${n.when.tests.map((d,c)=>Uc(e,d,c,p=>s(h=>{let f=h.when.tests.find(g=>g.id===d.id);f&&p(f)}),()=>s(p=>{p.when.tests=p.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>s(d=>{d.when.tests.push(Yi())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${Ls(e,n.then,a,d=>s(c=>d(c.then)),`${o}-then`)}
  </div>`}function Uc(e,n,t,i,a,r){let o=(p,h)=>i(p,h?`${r}-${h}`:void 0),s=n.comparison,l=ft(s.kind),d=e.evaluateTest(n),c=m;switch(l){case"value":c=ae(e,s.value??M(""),p=>o(h=>{h.comparison.value=p},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":c=u`${ae(e,s.value??M(""),p=>o(h=>{h.comparison.value=p},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${ae(e,s.upper??M(""),p=>o(h=>{h.comparison.upper=p},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":c=u`${ue("Pattern",s.pattern??"",p=>o(h=>{h.comparison.pattern=p},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!Kc(s.pattern)?u`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:m}`;break;case"options":c=ue("Options (comma separated)",(s.options??[]).join(", "),p=>o(h=>{h.comparison.options=p.split(",").map(f=>f.trim()).filter(Boolean)},"options"));break;case"none":break}return u`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${z("delete")}</button>
    </div>
    ${s.kind==="isStale"?u`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:ae(e,n.value,p=>o(h=>{h.value=p},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${Se("Comparison",s.kind,qr.map(p=>[p,Dt[p]]),p=>o(h=>{h.comparison=Xi(h.comparison,p)}))}
    ${c}
  </div>`}function Kc(e){try{return new RegExp(e),!0}catch{return!1}}function Ls(e,n,t,i,a){let r=Pc(t);return u`
    ${n.length===0?u`<div class="hint">No changes.</div>`:m}
    ${n.map((o,s)=>Wc(e,o,s,t,(l,d)=>i(c=>{c[s]&&l(c[s])},d?`${a}-${s}-${d}`:void 0),()=>i(l=>{l.splice(s,1)}),`${a}-${s}`))}
    <select class="adder" @change=${o=>{let s=o.target,l=s.value;s.value="",l&&i(d=>{d.push(gt(l))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>u`<option value=${o}>${Ia[o]}</option>`)}
    </select>`}var zs=["setColor","setBorderColor","setBackgroundColor"];function Wc(e,n,t,i,a,r,o){let s=!_n[i].includes($e[n.kind]);return u`<div class="change-box">
    <div class="rule-head">
      <span>${Ia[n.kind]}${s?u` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${z("delete")}</button>
    </div>
    ${_s(e,n,a,o)}
  </div>`}function _s(e,n,t,i){let a=Pn(n.kind),r=m;if(a==="value"){let o=n.value??M("");if(zs.includes(n.kind)){let s=o.kind.kind==="literal";r=u`${s?pe("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>t(d=>{d.value=M(l??"#FFFFFF")},"color")):ae(e,o,l=>t(d=>{d.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:M("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?m:u`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=ae(e,o,s=>t(l=>{l.value=s},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1}:{step:.5,min:0};r=ee(n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Degrees":n.kind==="setFontSize"?"Points":"Value",n.number??0,s=>t(l=>{l.number=s??0},"number"),o)}else a==="weight"&&(r=te("Weight",n.weight??"regular",Ra,o=>t(s=>{s.weight=o})));return r}var Ea=new Set,ii=new Map,ai=new Map,ls=new Map;function Ps(e,n,t,i,a,r){let o=ga(n);return!o.ok||Ea.has(a)?u`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${l=>{Ea.delete(a),Ee(l.target)}}>Show as table</button>
        ${o.ok?m:u`<span class="hint">${o.reason}</span>`}
      </div>
      ${Vc(e,n,t,i,a)}`:jc(e,o.table,n[0],t,i,a,r)}function jc(e,n,t,i,a,r,o){let s=(x,S)=>e.update(O=>{let L=a(O);L&&x(L)},S?`${r}-${S}`:void 0),l=n.value??ls.get(r)??o,d=n.rows.length===0,c=n.numberMode||d&&l!==void 0&&!Vo(l)&&qc(e.resolve(l)),p=_n[i],h=ii.get(r)??new Set,f=n.columns.length===0&&h.size===0?[Do[i]]:[],g=Io(n.columns,[...h,...f.filter(x=>x!==void 0)],p),w=t?e.liveBranch(t):"none",k=t?e.forced.get(t.id)??"live":"live",E=x=>k!=="live"&&(k==="otherwise"?x==="otherwise":k.caseId===x),T=x=>{t&&e.setForced(t.id,E(x)?"live":x==="otherwise"?"otherwise":{caseId:x})},v=x=>{ls.set(r,x),n.rows.length!==0&&s(S=>Po(S,x),"lhs")},C=()=>s(x=>zo(x,l??M(""),c)),P=n.rows.map((x,S)=>cs(e,{key:`${r}-${x.caseId}`,label:No(x.comparison,O=>ge(O,me(e))),columns:g,changes:x.changes,live:w===x.caseId,forced:E(x.caseId),onForce:()=>T(x.caseId),when:Qc(e,x.comparison,`${r}-${x.caseId}`,(O,L)=>s(ne=>{let y=ne[0]?.cases.find($=>$.id===x.caseId)?.when.tests[0];y&&O(y.comparison)},L&&`${x.caseId}-${L}`)),updChanges:(O,L)=>s(ne=>{let y=ne[0]?.cases.find($=>$.id===x.caseId);y&&O(y.then)},L&&`${x.caseId}-${L}`),acts:u`
      <button class="icon" title="Move up" ?disabled=${S===0} @click=${()=>s(O=>ya(O,S,S-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${S===n.rows.length-1} @click=${()=>s(O=>ya(O,S,S+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>s(O=>_o(O,x.caseId))}>${z("delete")}</button>`})),N=n.otherwise===void 0?m:cs(e,{key:`${r}-otherwise`,label:"Otherwise",columns:g,changes:n.otherwise,live:w==="otherwise",forced:E("otherwise"),onForce:()=>T("otherwise"),when:u`<span class="when-otherwise">Otherwise</span>`,updChanges:(x,S)=>s(O=>{let L=O[0]?.otherwise;L&&x(L)},S),acts:u`<button class="icon" title="Remove the Otherwise row" @click=${()=>s(x=>ba(x,!1))}>${z("close")}</button>`}),q=ai.get(r),oe=Yc.filter(x=>p.includes(x)&&!g.includes(x));return u`
    <div class="states">
      ${ae(e,l??M(""),v,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${l===void 0?u`<div class="hint">Choose what these states look at.</div>`:m}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${g.map(x=>u`<th>
              <span>${Ye[x]}</span>
              <button class="icon" title=${`Remove the ${Ye[x]} column`}
                @click=${S=>{ai.set(r,x),Ee(S.target)}}>${z("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${P}
          ${N}
          ${n.rows.length===0&&n.otherwise===void 0?u`<tr><td class="empty-row" colspan=${g.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:m}
        </tbody>
      </table>
      ${q===void 0?m:u`<div class="hint warn confirm-row">
        Remove the ${Ye[q]} column? Its ${ds(n,q)} value${ds(n,q)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${x=>{ai.delete(r),ii.get(r)?.delete(q),Ee(x.target),s(S=>Oo(S,q))}}>Remove</button>
        <button class="small" @click=${x=>{ai.delete(r),Ee(x.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${C}>+ state</button>
        ${n.otherwise===void 0?u`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>s(x=>ba(x,!0))}>+ otherwise</button>`:m}
        <span class="spacer"></span>
        ${k==="live"?m:u`<button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button>`}
        ${oe.length===0?m:u`<select class="chip-add" title="Add a column" @change=${x=>{let S=x.target,O=S.value;if(S.value="",!O)return;let L=ii.get(r)??new Set;L.add(O),ii.set(r,L),Ee(S)}}>
          <option value="" selected>+ column…</option>
          ${oe.map(x=>u`<option value=${x}>${Ye[x]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${c?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${x=>{Ea.add(r),Ee(x.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function qc(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var Yc=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function ds(e,n){let t=0;for(let i of e.rows)Yn(i.changes,n)&&(t+=1);return e.otherwise&&Yn(e.otherwise,n)&&(t+=1),t}function Jc(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function cs(e,n){return u`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{Jc(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>u`<td>${Xc(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function Xc(e,n,t,i,a){let r=Yn(t,n),o=Fa(a);if(!r)return u`<button type="button" class="cell empty" title=${`Set ${Ye[n]} for this state`}
      @click=${d=>{i(c=>{c.push(gt(Mo[n]))}),dc(d.target,o)}}>unchanged</button>`;let s=(d,c)=>i(p=>{let h=p.find(f=>$e[f.kind]===n);h&&d(h)},c&&`${n}-${c}`),l=Ye[n];return u`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${Zc(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${vs}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${hn.has(o)?u`${n==="visibility"?te("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>s(c=>{c.kind=d})):_s(e,r,s,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let p=c.findIndex(h=>$e[h.kind]===n);p>=0&&c.splice(p,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:m}
    </div>`}function Zc(e,n){if(n.kind==="hide")return u`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return u`<span class="cell-word">Shown</span>`;let t=Pn(n.kind);if(t==="number")return u`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return u`<span class="cell-word">${Ra.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;let i=n.value??M(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(zs.includes(n.kind))return u`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?Me(a):ge(i,me(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return u`${r??m}<span class="cell-word">${a}</span>`}return u`<span class="cell-word">${ge(i,me(e))}</span>`}function Me(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function Qc(e,n,t,i){let a=ft(n.kind),r=fa(n.kind),o=(s,l,d,c)=>tp(e,s,l,`${t}-${d}`,r,c,d==="rhs"?"Compare with":"Upper bound");return u`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${he(s=>i(l=>{let d=Xi(l,s);l.kind=d.kind,d.value!==void 0?l.value=d.value:delete l.value,d.upper!==void 0?l.upper=d.upper:delete l.upper}))}>
      ${ma.map(s=>u`<option value=${s} ?selected=${s===n.kind}>${ep(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??M(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):m}
    ${a==="between"?u`<span class="when-and">to</span>${o(n.upper??M(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:m}
  </span>`}function ep(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return Dt[e]}}function tp(e,n,t,i,a,r,o){let s=Fa(i),l={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return u`<span class="rhs">
      ${ae(e,n,t,{...l,compact:!0})}
    </span>`;let d=n.kind.value;return u`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${he(c=>t({...n,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${s} title="Compare with an entity or a template instead">…</button>
    ${bs(e,s,o,n,t,l)}
  </span>`}var mn=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:Gi,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function Vs(e){return mn.find(n=>n.kind===e)??mn[0]}var Os="#FF9F0A",Aa="#8E8E93",np=["#FF453A","#FFD60A","#34C759"],Bs=["#0A84FF","#34C759","#FF9F0A"];function ip(e){return e?.attributes?.device_class==="battery"?np:Bs}var ap={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function rp(e){let n=e.iconName?.trim();return n?{off:n,on:n}:ap[Ha(e)]??{off:"circle",on:"circle.fill"}}function op(e){switch(Ha(e)){case"lock":return{kind:"equals",value:M("locked")};case"cover":case"valve":return{kind:"equals",value:M("open")};case"media_player":return{kind:"equals",value:M("playing")};default:return{kind:"isOn"}}}function Ha(e){return e.domain||e.entityId.split(".")[0]||""}function $t(e){return{...e,domain:Ha(e)}}function sp(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function di(e){return Math.round(e*1e4)/1e4}function ci(e,n,t){return Math.min(t,Math.max(n,e))}function La(e,n,t){let i=ve[e],a=ci(di(n/i.width),0,1),r=ci(di(t/i.height),0,1);return{x:di((1-a)/2),y:di((1-r)/2),width:a,height:r,rotationDegrees:0}}function lp(e){let n=ve[e],t=ci(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:La(e,t*1.3,t*1.3),size:t}}function dp(e){let n=ve[e],t=ci(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:La(e,n.width*.88,t*1.7),size:t}}function cp(e){let n=ve[e],t=Math.min(n.width,n.height)*.9;return{frame:La(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function Gs(e){let n=e==="rectangular";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function pp(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function up(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function Gt(e,n,t,i){let a=i(t);n.payload.frame=a.frame,up(n,a.size);for(let r of Q){if(r===t||r==="inline")continue;let o=e.perFamily[r];if(!o)continue;let s=i(r);JSON.stringify(s)!==JSON.stringify(a)&&(o.placements[n.payload.id]={frame:s.frame,isHidden:!1,...s.size!==void 0?{size:s.size}:{}})}}function Ut(e){return ze(e)}function za(e,n){let t={kind:{kind:"entityState",...$t(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function Ns(e){let n=gt("setIcon");return n.value=M(e),n}function kt(e){let n=gt("setColor");return n.value=M(e),n}function hp(e,n){let t=on(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...$t(e)}},a.comparison=op(e);let r=n.on!==n.off;return i.then=r?[Ns(n.on),kt(Os)]:[kt(Os)],t.otherwise=r?[Ns(n.off),kt(Aa)]:[kt(Aa)],t}function mp(e){let n=on(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...$t(e)}},i.comparison={kind:"isUnavailable"};let a=gt("setOpacity");return a.number=.35,t.then=[a],n}function Ds(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function fp(e,n,t=Bs){let i=n.max-n.min,a=Ds(n.min+i/3),r=Ds(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:M(a)},changes:[kt(t[0])]},{comparison:{kind:"between",value:M(a),upper:M(r)},changes:[kt(t[1])]},{comparison:{kind:"greaterThan",value:M(r)},changes:[kt(t[2])]}];return Ao(za(e),o)}function gp(e,n,t){let i=Ut("icon"),a=rp(n);return i.payload.symbol=M(a.off),i.payload.colorSlot.baseColorHex=Aa,i.payload.rules=[hp(n,a)],Gt(e,i,t.family,lp),e.elements.push(i),Hn(e,i.payload.id,{type:"toggleEntity",...$t(n)}),i.payload.id}function yp(e,n,t){let i=Ut("text");return i.payload.value=za(n,t.state),i.payload.rules=[mp(n)],Gt(e,i,t.family,dp),e.elements.push(i),i.payload.id}function bp(e,n,t){let i=Ut("gauge");i.payload.value=za(n);let a=sp(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[fp(n,a,ip(t.state))],Gt(e,i,t.family,cp),e.elements.push(i),i.payload.id}function vp(e,n,t){let i=Ut("chart");return i.payload.value={kind:{kind:"entityState",...$t(n)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",Gt(e,i,t.family,Gs),e.elements.push(i),i.payload.id}function xp(e,n,t){let i=Ut("chart");return i.payload.value={kind:{kind:"entityState",...$t(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",Gt(e,i,t.family,Gs),e.elements.push(i),i.payload.id}function wp(e,n,t){let i=Ut("image");return i.payload.entity=$t(n),Gt(e,i,t.family,pp),e.elements.push(i),i.payload.id}function Us(e,n,t,i){switch(n){case"toggle":return gp(e,t,i);case"status":return yp(e,t,i);case"gauge":return bp(e,t,i);case"chart":return vp(e,t,i);case"history":return xp(e,t,i);case"camera":return wp(e,t,i)}}var $p=3e4,Cp=500,Ks="preset-entity",Sp={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function _a(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function Ep(e){return e.kind==="family"?"look":"content"}function Tp(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}var Ws=300,js=400,qs=52,Ys=36,Fp=[1,1.7,2.6],Rp=["S","M","L"],Js=["Small","Medium","Large"],Xs="wrist-assistant-panel.layers.v1",Xe=34,Ct=200,Mp=720,pi=320,Ip=80,Ap=56,Zs="wrist-assistant-panel.columns.v2",Pa=e=>Math.max(Ct,Math.min(Mp,Math.round(e))),Qs=e=>e.metaKey||e.ctrlKey||e.shiftKey,Hp=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,fn=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",Oe=fn==="Cmd"?"\u2318":"Ctrl+",Oa=fn==="Cmd"?"\u21E7":"Shift+";function el(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-Ip;if(i>=Ct*2+pi){let r=i-pi,o=n,s=t;if(o+s>r){let l=r/(o+s);o=Math.max(Ct,Math.floor(o*l)),s=Math.max(Ct,Math.floor(s*l));let d=o+s-r;d>0&&(o>=s?o=Math.max(Ct,o-d):s=Math.max(Ct,s-d))}return{columns:3,left:o,right:s}}let a=e-Ap;return a>=Ct+pi?{columns:2,left:Math.min(n,a-pi),right:t}:{columns:1,left:n,right:t}}var I=class I extends Qe{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Ws;this.colRight=js;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=dn.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=Co(()=>this.requestUpdate());this.imageSizes=So(()=>this.requestUpdate());this.symbols=new Wn(()=>this.requestUpdate());this.keyHandler=t=>this.onKey(t);this.heldArrows=new Set;this.keyUpHandler=t=>{this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||fs(Ks)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=bi`
    :host {
      /* Column so the footer can sit under a layout that takes the rest of the
         height, rather than being pushed off the bottom of the page. */
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Inter", Roboto, sans-serif);
      font-size: 14px;
      /* Colours the whole editor shares: one per layer kind, one per section
         that is not about a kind. Set once so a badge, a bar and a card agree. */
      --wa-text: ${se(re.text)};
      --wa-icon: ${se(re.icon)};
      --wa-gauge: ${se(re.gauge)};
      --wa-shape: ${se(re.shape)};
      --wa-image: ${se(re.image)};
      --wa-tap: ${se(re.tap)};
      --wa-states: ${se(X.states)};
      --wa-place: ${se(X.place)};
      /* The skin. Light follows the Home Assistant theme it sits in; the dark
         block below replaces these with the editor's own deep palette. The
         rest of the sheet only ever reads these names, so the two skins can
         never drift apart in anything but colour. */
      --wa-bg: var(--primary-background-color, #f3f4f8);
      --wa-card: var(--card-background-color, #fff);
      --wa-panel: var(--secondary-background-color, rgba(127,127,127,.12));
      --wa-raised: color-mix(in srgb, var(--wa-panel) 55%, var(--wa-card));
      --wa-input: var(--wa-card);
      --wa-line: var(--divider-color, rgba(127,127,127,.3));
      --wa-line-strong: color-mix(in srgb, var(--wa-line) 60%, var(--wa-ink));
      --wa-ink: var(--primary-text-color, #1c1c1e);
      --wa-muted: var(--secondary-text-color, rgba(127,127,127,.9));
      --wa-accent: var(--primary-color, #6d5dfc);
      --wa-accent-ink: var(--wa-accent-ink);
      /* Reset buttons, in one colour of their own. Pinned rather than taken
         from the theme's warning colour, which is orange or red in plenty of
         themes: these mark a setting someone changed, not a problem. Darker
         on a light card, where a bright yellow all but disappears. */
      --wa-reset: #B07D00;
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
      --wa-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 20px rgba(0,0,0,.06);
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
      --wa-reset: #FFD60A;
      --wa-ent: #5fd4c4;
      --wa-val: #ffc45c;
      --wa-ent-bg: color-mix(in srgb, var(--wa-ent) 14%, transparent);
      --wa-val-bg: color-mix(in srgb, var(--wa-val) 16%, transparent);
      --wa-shadow: 0 1px 2px rgba(0,0,0,.45), 0 10px 30px rgba(0,0,0,.35);
      --wa-shadow-pop: 0 16px 48px rgba(0,0,0,.6);
      color-scheme: dark;
      scrollbar-color: rgba(255,255,255,.14) transparent;
    }
    * { box-sizing: border-box; }
    svg { display: block; }
    :host([dark]) ::selection { background: color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--wa-line);
      background: var(--wa-card);
      color: var(--wa-ink);
      flex-wrap: wrap;
      position: relative;
      z-index: 20;
    }
    header h1 { display: inline-flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; letter-spacing: -.01em; margin: 0 8px 0 0; white-space: nowrap; }
    header h1 .mark {
      width: 28px; height: 28px; border-radius: 9px; display: grid; place-items: center; flex: none;
      background: color-mix(in srgb, var(--wa-accent) 18%, transparent); color: var(--wa-accent);
      border: 1px solid color-mix(in srgb, var(--wa-accent) 35%, transparent);
    }
    header h1 .mark svg { width: 16px; height: 16px; }
    header .spacer { flex: 1; }
    header label { font-size: 13px; display: inline-flex; align-items: center; gap: 8px; color: var(--wa-muted); }
    header label select { max-width: 260px; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Buttons: one quiet shape everywhere, the accent fill kept for the single
       action that matters, and a soft ring on focus instead of a hard outline. */
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 13px; font-weight: 500; padding: 7px 13px; border-radius: 10px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .toolbar button:hover:not(:disabled), button.small:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .toolbar button:focus-visible, button.primary:focus-visible, button.small:focus-visible, button.danger:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .toolbar button:disabled, button:disabled { opacity: .45; cursor: default; }
    button.primary { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; font-weight: 600; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-accent) 88%, #fff); }
    /* Save is the header's one call to action. It is quiet while there is
       nothing to save and lit, with the unsaved halo, once there is, so the
       button, the dirty dot and the footer line all say "unsaved" the same
       way. */
    header button.save { min-height: 32px; padding: 7px 16px; }
    header button.save:not(.dirty) { background: var(--wa-raised); color: var(--wa-muted); border-color: var(--wa-line); }
    header button.save.dirty { box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning-color, #ffa600) 40%, transparent), 0 6px 18px color-mix(in srgb, var(--wa-accent) 35%, transparent); }
    button.danger { color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent); background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent); }
    button.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
    button.small { padding: 5px 11px; font-size: 12.5px; min-height: 28px; border-radius: 9px; }
    button.icon {
      font: inherit; border: none; background: none; cursor: pointer; color: inherit;
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0; border-radius: 8px; opacity: .75;
      transition: background-color .12s ease-out, opacity .12s ease-out;
    }
    button.icon:hover:not(:disabled) { opacity: 1; background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    button.icon:focus-visible { opacity: 1; outline: none; box-shadow: var(--wa-ring); }
    button.icon.danger:hover:not(:disabled) { color: var(--error-color, #e5484d); background: color-mix(in srgb, var(--error-color, #e5484d) 14%, transparent); }
    svg.ui-icon { width: 17px; height: 17px; display: block; }
    .dirty-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--warning-color, #ffa600); margin-left: 6px; vertical-align: middle; box-shadow: 0 0 8px var(--warning-color, #ffa600); }

    /* Native controls: the same dark well, hairline and focus ring as the
       buttons, so a select in the header and a number field in the inspector
       read as one family. */
    select {
      font: inherit; font-size: 13px; color: var(--wa-ink); cursor: pointer;
      padding: 6px 28px 6px 10px; border-radius: 9px; border: 1px solid var(--wa-line); background-color: var(--wa-input);
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238d92a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center; background-size: 14px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    select:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input[type=text], input[type=number], input[type=search], input[type=url], textarea {
      font: inherit; font-size: 13px; color: var(--wa-ink);
      padding: 6px 10px; border-radius: 9px; border: 1px solid var(--wa-line); background: var(--wa-input);
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
      width: 34px; height: 20px; border-radius: 999px; position: relative;
      background: color-mix(in srgb, var(--wa-ink) 14%, transparent); border: 1px solid var(--wa-line);
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
      display: inline-flex; align-items: center; gap: 8px; font: inherit; font-size: 13.5px; font-weight: 500;
      padding: 7px 10px 7px 12px; border-radius: 10px; cursor: pointer; color: var(--wa-ink);
      border: 1px solid var(--wa-line); background: var(--wa-raised); min-width: 220px; max-width: 380px;
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker .pk-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
    .picker .pk-rev { color: var(--wa-muted); font-weight: 400; font-size: 12px; white-space: nowrap; }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
    .picker .menu {
      position: absolute; top: calc(100% + 8px); left: 0; z-index: 50; width: 360px; max-height: 60vh; overflow: auto;
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 6px;
    }
    .picker .menu .row {
      display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; font: inherit; font-size: 13px;
      background: transparent; border: 0; color: inherit; padding: 8px 10px; border-radius: 8px; cursor: pointer;
    }
    .picker .menu .row:hover { background: var(--wa-panel); }
    .picker .menu .row[aria-current="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .picker .menu .row.locked { opacity: .6; cursor: default; }
    .picker .menu .pk-badge { font-size: 11px; opacity: .7; white-space: nowrap; }
    .picker .menu .new { margin-top: 6px; border-top: 1px solid var(--wa-line); padding-top: 10px; color: var(--wa-accent); font-weight: 500; }
    .picker .menu .new-shape { padding: 4px 10px 8px; }
    .picker .menu .new-shape .hint { margin: 4px 0 8px; }
    .shape-dots { display: inline-flex; gap: 3px; align-items: center; flex: none; }
    .shape-dot { width: 14px; height: 10px; border-radius: 2px; background: currentColor; opacity: .3; display: inline-block; }
    .shape-dot.circular { width: 10px; border-radius: 50%; }
    .shape-dot.corner { width: 10px; border-radius: 0 6px 0 0; }
    .shape-dot.inline { width: 16px; height: 4px; }
    .shape-dot.on { opacity: 1; }

    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 280px) 8px minmax(0, 1fr) 8px var(--wa-right, 400px);
      column-gap: 8px;
      row-gap: 16px;
      padding: 16px;
      flex: 1 1 auto;
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
      grid-template-columns: var(--wa-left, 280px) 8px minmax(0, 1fr);
      overflow: auto;
    }
    .layout.cols-2 > .column.inspector { grid-column: 1 / -1; }
    .layout.cols-2 > .gutter.right { display: none; }
    .layout.cols-1 { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 > .column { grid-column: auto; }
    .layout.cols-1 > .gutter { display: none; }
    .column { overflow: auto; min-height: 0; }
    .card {
      background: var(--wa-card);
      border: 1px solid var(--wa-line);
      border-radius: var(--wa-r-lg);
      box-shadow: var(--wa-shadow);
      padding: 16px 18px;
    }
    .column.left { display: flex; flex-direction: column; gap: 14px; }
    .column.left .card { flex: none; }
    /* Card titles read as titles: sentence case, a little heavier, the ink
       colour. Their side notes stay small and muted. */
    .panel-title {
      display: flex; align-items: center; gap: 8px; margin: 0 0 12px;
      font-size: 15px; font-weight: 600; letter-spacing: -.01em; color: var(--wa-ink);
    }
    .panel-title .spacer { flex: 1; }
    .panel-title .mini { font-weight: 400; font-size: 12px; color: var(--wa-muted); letter-spacing: 0; }
    .panel-title button.small { font-weight: 500; letter-spacing: 0; }

    /* Status and the raw document: one line at the foot of the panel, shut by
       default, saying only whether the work is saved. */
    details.foot { flex: none; border-top: 1px solid var(--wa-line); background: var(--wa-card); }
    details.foot > summary { display: flex; align-items: center; gap: 8px; padding: 9px 16px; font-size: 13px; cursor: pointer; list-style: none; color: var(--wa-muted); }
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
    .add-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    /* Compact: the samples go and the buttons shrink to tinted name chips, so
       seven kinds take two short rows instead of three tall ones. */
    .add-grid.lean { grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 6px; }
    .add-grid.lean button.add { padding: 7px 9px; border-radius: 10px; }
    .add-grid.lean button.add .add-name { justify-content: flex-start; }
    button.add {
      display: flex; flex-direction: column; align-items: stretch; gap: 7px; padding: 7px 7px 8px; border-radius: 12px;
      font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--wa-ink); white-space: nowrap;
      background: color-mix(in srgb, var(--k) 12%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--k) 34%, transparent);
      transition: background-color .12s ease-out, border-color .12s ease-out, transform .12s ease-out, box-shadow .12s ease-out;
    }
    button.add:hover:not(:disabled) {
      background: color-mix(in srgb, var(--k) 22%, var(--wa-card)); border-color: color-mix(in srgb, var(--k) 62%, transparent);
      box-shadow: 0 4px 14px color-mix(in srgb, var(--k) 20%, transparent);
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
    .presets-l { margin: 14px 0 8px; font-size: 12px; color: var(--wa-muted); }
    .presets { display: flex; flex-wrap: wrap; gap: 6px; }
    button.preset {
      font: inherit; font-size: 12px; padding: 5px 11px; border-radius: 999px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-muted);
      transition: color .12s ease-out, border-color .12s ease-out;
    }
    button.preset:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }

    /* Layers: one row per layer, coloured by kind, the shape pinned last.
       The picture size is a variable on the list, set by the S/M/L control in
       the card's title bar, so one change resizes every row's picture and the
       column that holds it. */
    .layers { display: flex; flex-direction: column; gap: 6px; --thumb-w: ${qs}px; --thumb-h: ${Ys}px; }
    /* Every row is its own outlined container at rest. The border is what
       tells one row from the next, so nothing here may set it to transparent. */
    .layer {
      display: grid; grid-template-columns: 16px 4px var(--thumb-w) minmax(0, 1fr) auto; align-items: center; gap: 8px;
      padding: 7px 8px 7px 5px; border-radius: var(--wa-r-md);
      border: 1px solid var(--wa-line); background: var(--wa-raised); background-clip: padding-box;
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out,
        border-top-width .1s ease-out, border-bottom-width .1s ease-out;
    }
    /* A group's members keep their own outline, one shade deeper, so they read
       as nested and still separate from each other. */
    .layer.kid { background: var(--wa-panel); }
    .layer:hover { background: var(--wa-panel); border-color: color-mix(in srgb, var(--k) 45%, var(--wa-line)); }
    /* The selected row lights up in its kind's colour and casts a little of
       it, so the eye lands on it from across the panel. */
    .layer.hl {
      border-color: var(--k); background: color-mix(in srgb, var(--k) 12%, var(--wa-card));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--k) 22%, transparent), 0 6px 18px color-mix(in srgb, var(--k) 18%, transparent);
    }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.pick { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    /* A member of the selected group: lit in the folder's colour, without
       the selected row's glow, so the group reads as one block. */
    .layer.held {
      border-color: color-mix(in srgb, ${se(X.group)} 70%, var(--wa-line));
      background: color-mix(in srgb, ${se(X.group)} 10%, var(--wa-panel));
    }
    .layer.held .thumb { border-color: color-mix(in srgb, ${se(X.group)} 60%, var(--wa-line)); }
    .layer .grip { color: var(--wa-muted); opacity: .5; display: grid; place-items: center; cursor: grab; }
    .layer:hover .grip { opacity: .9; }
    .layer .grip svg { width: 14px; height: 14px; }
    .layer .bar { width: 4px; height: 28px; border-radius: 2px; background: var(--k); box-shadow: 0 0 6px color-mix(in srgb, var(--k) 50%, transparent); }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: var(--thumb-w); height: var(--thumb-h); border-radius: 8px; overflow: hidden; flex: none;
      background: #000; border: 1px solid var(--wa-line-strong); box-sizing: border-box; display: block;
    }
    .layer .thumb svg { display: block; width: 100%; height: 100%; }
    .layer.hl .thumb { border-color: color-mix(in srgb, var(--k) 70%, var(--wa-line)); }
    .layer.dim .thumb { opacity: .6; }
    .layer .name { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
    .layer .name b { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .name small .val-tok { color: var(--wa-val); }
    .layer .kind { font-size: 10.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--k); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 999px; background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-muted); white-space: nowrap; }
    .badge.tap { color: var(--wa-tap); background: color-mix(in srgb, var(--wa-tap) 16%, transparent); }
    .badge.states { color: color-mix(in srgb, var(--wa-states) 75%, var(--wa-ink)); background: color-mix(in srgb, var(--wa-states) 18%, transparent); }
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
      height: 0; min-height: 0; margin-top: -3px; margin-bottom: -3px;
      padding-top: 0; padding-bottom: 0; border-top-width: 0; border-bottom-width: 0;
      opacity: 0; overflow: hidden;
    }
    .layer.pinned { border-style: dashed; }
    .layer.pinned.hl { border-style: solid; }
    .layer.pinned .grip { cursor: default; opacity: .8; }
    .layer.pinned .bar { background: repeating-linear-gradient(180deg, var(--k) 0 3px, transparent 3px 6px); }
    .group-cta {
      display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 8px; margin-bottom: 6px; border-radius: 8px;
      border: 1px solid color-mix(in srgb, var(--wa-accent) 30%, transparent);
      background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
    }
    .group-cta .spacer { flex: 1; }
    /* Picked for grouping: an accent ring, since the kind colour is taken. */
    .layer.multi { border-color: var(--wa-accent); box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* A folder row: the chevron folds it, the lock says whether it moves as
       one, and its members sit indented under a guide line. */
    .layer.group .chev {
      font: inherit; background: transparent; border: 0; color: var(--wa-muted); padding: 0; cursor: pointer;
      width: 16px; height: 16px; display: grid; place-items: center;
    }
    .layer.group .chev svg { width: 14px; height: 14px; transition: transform .15s ease-out; }
    .layer.group .chev[aria-expanded="false"] svg { transform: rotate(-90deg); }
    .layer.group .bar { background: repeating-linear-gradient(180deg, var(--k) 0 5px, transparent 5px 8px); }
    .layer.group.drop-into { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer .lockbtn { width: 24px; height: 24px; opacity: .55; }
    .layer .lockbtn svg.ui-icon { width: 15px; height: 15px; }
    .layer .lockbtn.on { opacity: 1; color: ${se(X.locked)}; filter: drop-shadow(0 0 4px ${se(X.locked)}); }
    .layer:hover .lockbtn, .layer.hl .lockbtn { opacity: 1; }
    .group-kids {
      margin: 0 0 0 14px; padding-left: 10px; display: flex; flex-direction: column; gap: 6px;
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
    .layer.drop-before { border-top: ${Xe}px solid transparent; }
    .layer.drop-after { border-bottom: ${Xe}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${Xe}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${Xe}px; }
    .layer.drop-after::after { bottom: -${Xe}px; }

    /* Expanded rows say more: a third line with where the layer sits on the
       face, its meta free to wrap, and the badges kept beside the buttons
       rather than swapped for them. */
    .layer.rich .name small { white-space: normal; overflow: visible; text-overflow: clip; }
    .layer.rich .facts { display: flex; flex-wrap: wrap; gap: 2px 8px; margin-top: 2px; font-size: 11.5px; color: var(--wa-muted); }
    .layer.rich .facts .fact { white-space: nowrap; }
    .layer.rich .facts .fact b { font-weight: 600; color: var(--wa-ink); opacity: .75; }
    .layer.rich .right { flex-wrap: wrap; justify-content: flex-end; gap: 4px; }
    .layer.rich:hover .badges, .layer.rich.hl .badges, .layer.rich:focus-within .badges { display: inline-flex; }

    /* Two small segmented controls in the Layers title: how big the row
       pictures are, and how much each row says. */
    .seg { display: inline-flex; flex: none; border: 1px solid var(--wa-line); border-radius: 999px; overflow: hidden; background: var(--wa-raised); }
    .seg button {
      font: inherit; font-size: 11px; font-weight: 600; letter-spacing: .02em; line-height: 1;
      padding: 4px 8px; min-width: 22px; border: 0; background: transparent; color: var(--wa-muted);
      cursor: pointer; display: grid; place-items: center;
      transition: color .12s ease-out, background-color .12s ease-out;
    }
    .seg button + button { border-left: 1px solid var(--wa-line); }
    .seg button:hover { color: var(--wa-ink); background: var(--wa-panel); }
    .seg button.on { color: var(--wa-ink); background: color-mix(in srgb, var(--wa-accent) 22%, transparent); }
    .seg button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .seg button svg.ui-icon { width: 14px; height: 14px; }
    /* The form-sized segmented control: a setting with two to four choices
       shows them all, the way a dropdown never can. Buttons share the width
       evenly and clip a label rather than wrap it, so a row never grows a
       second line, and the tint takes the section's colour where there is one. */
    .seg.wide { display: flex; width: 100%; min-width: 0; border-radius: 8px; background: var(--wa-raised); }
    .seg.wide button {
      flex: 1 1 0; min-width: 0; padding: 5px 8px; min-height: 28px;
      font-size: 12px; font-weight: 500; letter-spacing: 0; line-height: 1.2;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: center;
    }
    .seg.wide button.on { color: var(--wa-ink); background: color-mix(in srgb, var(--c, var(--wa-accent)) 24%, transparent); font-weight: 600; }
    .seg.wide button:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c, var(--wa-accent)) 60%, transparent); }
    .field.seg-field { align-items: center; }
    /* Readings: which of two ways to count, then how many when it is a count. */
    .readings-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .readings-row .seg.wide { flex: 1 1 auto; width: auto; }
    /* Three digits is the most this box ever holds. The type selector is
       there to outrank the ".field input[type=number]" full-width rule. */
    .field .readings-row input.short[type=number] { width: 60px; flex: none; text-align: right; }
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
    .column.canvas > .card.canvas-card { padding: 0; overflow: hidden; }
    .banner { padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; background: var(--wa-panel); }
    .banner.warn { border-left: 4px solid var(--warning-color, #ffa600); }
    .banner.err { border-left: 4px solid var(--error-color, #db4437); }
    .banner .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .canvas-bar { display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-bottom: 1px solid var(--wa-line); flex-wrap: wrap; font-size: 13px; }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
    .canvas-bar .hint { margin: 0; }
    /* The three face toggles wrap as one block, so a narrow bar never leaves
       one of them stranded on the line above the other two. */
    .canvas-bar .face-tools { display: inline-flex; gap: 6px; flex: none; }
    .canvas-bar label { display: inline-flex; align-items: center; gap: 8px; color: var(--wa-muted); }
    .canvas-bar label select { color: var(--wa-ink); font-weight: 500; }
    button.pick {
      font: inherit; font-size: 12.5px; font-weight: 500; padding: 5px 12px; border-radius: 999px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out;
    }
    button.pick:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    button.pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.pick.on { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    button.pick .glyph { font-size: 13px; line-height: 1; }
    /* The stage: a faint dot grid under a soft accent glow, so the watch face
       sits on a work surface rather than on the card. */
    .stage {
      display: grid; justify-items: center; padding: 30px 24px 20px;
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
    .under { text-align: center; font-size: 13px; color: var(--wa-muted); margin-top: 12px; }
    .under b { color: var(--wa-ink); font-weight: 500; }
    .strip { padding: 0 22px 26px; }
    .strip-row { padding: 20px 0 22px; }
    .strip-row + .strip-row { border-top: 1px solid var(--wa-line); }
    .strip-row .help { font-size: 12px; color: var(--wa-muted); margin-top: 8px; }
    /* A card title opens with a tinted mark, the same one the inspector's
       cards wear, so every column speaks the same language. */
    .panel-title .swatch {
      width: 26px; height: 26px; border-radius: 8px; flex: none; display: grid; place-items: center;
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 18%, transparent);
      border: 1px solid color-mix(in srgb, var(--c, var(--wa-accent)) 35%, transparent);
      color: var(--c, var(--wa-accent));
    }
    .panel-title .swatch svg { width: 15px; height: 15px; }
    .settings { max-width: 1100px; }
    .settings .gen-row { display: grid; grid-template-columns: minmax(160px, 1.3fr) minmax(130px, .8fr) minmax(150px, 1fr) minmax(220px, 1.4fr); gap: 4px 18px; align-items: start; }
    .settings .gen-row .field { display: flex; flex-direction: column; align-items: stretch; gap: 5px; margin: 4px 0; min-width: 0; }
    .settings .gen-row .field > span { font-size: 12px; }
    .settings .flash-row { display: flex; align-items: center; gap: 10px; min-height: 32px; min-width: 0; }
    .settings .flash-row input.flash-color { width: 36px; height: 28px; padding: 2px; }
    .settings .flash-row .muted { color: var(--wa-muted); font-size: 13px; }
    .settings .entity-field, .settings .hint { max-width: 800px; }
    /* Shared values: a chip per named value, laid out as a titled sub-section
       of the settings rather than a loose row of boxes. The whole chip opens
       the editor, so it carries the hover and selected states a row would, and
       the delete button stays out of the way until the pointer is on it. */
    .values-list { margin-top: 14px; }
    .values-head { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
    .values-head .sub { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted); }
    .values-head .help { margin: 0; }
    .values-list .data { display: flex; flex-wrap: wrap; gap: 8px; }
    .values-list .empty { font-size: 12px; color: var(--wa-muted); margin: 0; }
    .values-list .datum {
      gap: 8px; max-width: 320px; padding: 5px 5px 5px 10px; border-radius: 10px;
      background: var(--wa-card); border: 1px solid var(--wa-line);
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    .values-list .datum + .datum { box-shadow: none; }
    .values-list .datum:hover { border-color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 7%, var(--wa-card)); }
    /* Selected: the same tint the inspector gives its complication section. */
    .values-list .datum.hl { border-color: var(--c); background: color-mix(in srgb, var(--c) 12%, var(--wa-card)); }
    .values-list .datum .name { flex: none; min-width: 0; max-width: 160px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .values-list .datum .meta {
      flex: none; min-width: 0; max-width: 140px; opacity: 1; color: var(--wa-muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px;
      background: var(--wa-panel); border-radius: 999px; padding: 1px 8px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .values-list .datum .meta.none { font-family: inherit; font-style: italic; background: transparent; padding: 1px 0; }
    .values-list .datum button.icon { width: 24px; height: 24px; opacity: 0; pointer-events: none; }
    .values-list .datum button.icon svg.ui-icon { width: 15px; height: 15px; }
    .values-list .datum:hover button.icon, .values-list .datum:focus-within button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum button.icon:hover:not(:disabled), .values-list .datum button.icon:focus-visible { opacity: 1; }
    .tiles { display: flex; gap: 10px; flex-wrap: wrap; }
    .tile-wrap { position: relative; display: flex; }
    .tile-wrap .tile-x { position: absolute; top: 4px; right: 4px; opacity: .45; }
    .tile-wrap:hover .tile-x, .tile-wrap .tile-x:focus-visible { opacity: 1; }
    .tile-wrap .tile-x:disabled { opacity: .2; cursor: not-allowed; }
    button.tile {
      width: 180px; height: 104px; border-radius: var(--wa-r-md); background: var(--wa-raised); border: 1px solid var(--wa-line);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
      color: var(--wa-muted); font: inherit; font-size: 13px; padding: 8px; cursor: pointer; overflow: hidden;
      transition: border-color .12s ease-out, box-shadow .12s ease-out, color .12s ease-out;
    }
    button.tile:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    button.tile:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tile[aria-pressed="true"] { border-color: var(--wa-accent); color: var(--wa-ink); box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 22%, transparent), 0 8px 24px color-mix(in srgb, var(--wa-accent) 20%, transparent); }
    button.tile.off { border-style: dashed; background: transparent; }
    .tile .art { width: 160px; height: 62px; display: grid; place-items: center; pointer-events: none; }
    .tile .art svg { display: block; max-width: 100%; max-height: 62px; width: auto; height: auto; background: #000; border-radius: 6px; }
    .tile.circular .art svg { border-radius: 50%; }
    .tile.corner .art svg { background: #2c2c2e; }
    .tile .art .inline-line { font-size: 11px; padding: 3px 10px; min-width: 0; display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; background: #000; color: #fff; }
    .tile .art .inline-line svg { background: transparent; border-radius: 0; }
    .tile .ghost { border: 1.5px dashed var(--wa-line); }
    .tile .ghost.rectangular { width: 130px; height: 48px; border-radius: 8px; }
    .tile .ghost.circular { width: 52px; height: 52px; border-radius: 50%; }
    .tile .ghost.corner { width: 52px; height: 52px; border-radius: 50% 0 0 0; border-right: 0; border-bottom: 0; }
    .tile .ghost.inline { width: 120px; height: 20px; border-radius: 10px; }
    .tile .lbl { font-weight: 500; display: flex; gap: 6px; align-items: center; white-space: nowrap; }
    .tile .lbl small { font-weight: 400; opacity: .7; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .chips.values { gap: 8px; }
    .vchip {
      display: inline-flex; align-items: center; gap: 8px; font: inherit; font-size: 13px; color: inherit;
      background: var(--wa-card); border: 1px solid var(--wa-line); border-radius: 999px; padding: 5px 12px 5px 6px; cursor: pointer;
    }
    .vchip:hover { border-color: var(--wa-accent); }
    .vchip .dom { width: 22px; height: 22px; border-radius: 50%; background: color-mix(in srgb, var(--k) 20%, transparent); color: var(--k); display: grid; place-items: center; flex: none; }
    .vchip .dom svg { width: 13px; height: 13px; }
    .vchip b { font-weight: 600; color: var(--wa-ent); }
    .vchip .val {
      color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .95em;
      border-bottom: 1px dashed color-mix(in srgb, var(--wa-val) 50%, transparent);
    }
    .vchip.testing { border-color: var(--wa-states); }
    .vchip.testing .val { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); border-bottom-color: var(--wa-states); }
    .vchip input { width: 110px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
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

    /* The layers this complication has that this shape does not draw. Under
       the list and shut, so the list above stays a reading of the preview
       beside it, and quiet: these rows are a way back in, not the work. */
      list-style: none; cursor: pointer; font-size: 12px; color: var(--wa-muted);
      padding: 4px 6px; border-radius: var(--wa-r-sm); display: flex; align-items: center; gap: 6px;
    }
      display: grid; grid-template-columns: 4px minmax(0, 1fr) auto; align-items: center; gap: 8px;
      padding: 5px 8px; border-radius: var(--wa-r-sm); cursor: pointer; font-size: 13px;
      border: 1px dashed var(--wa-line); background: transparent; color: var(--wa-muted);
    }

    /* The inspector: crumbs on top, then one card per section of the thing
       selected, tinted by what it is. */
    .column.inspector { padding: 0; }
    .insp-head { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--wa-line); position: sticky; top: 0; background: var(--wa-card); z-index: 5; }
    .crumbs { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13px; color: var(--wa-muted); }
    .crumbs button { font: inherit; font-size: 13px; background: transparent; border: 0; padding: 3px 6px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .5; }
    .here {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 6px; border-radius: 6px;
      background: color-mix(in srgb, var(--k) 14%, transparent); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
      color: var(--wa-ink); font-weight: 500;
    }
    .kchip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: var(--k); padding: 1px 5px; border-radius: 3px; }
    .insp-head .expand { flex: none; font: inherit; font-size: 12px; font-weight: 500; color: var(--wa-accent); background: transparent; border: 0; padding: 3px 4px; cursor: pointer; }
    .insp-body { padding: 14px 14px 30px; }
    .empty-insp { padding: 40px 20px; text-align: center; color: var(--wa-muted); display: flex; flex-direction: column; gap: 10px; align-items: center; font-size: 13px; }
    .empty-insp svg { width: 40px; height: 40px; opacity: .5; }
    .empty-insp b { color: var(--wa-ink); font-weight: 500; font-size: 14px; }
    .sec {
      --c: var(--wa-accent);
      border: 1px solid color-mix(in srgb, var(--c) 28%, var(--wa-line)); border-radius: var(--wa-r-md);
      background: var(--wa-card); margin-bottom: 10px; overflow: hidden;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .sec[data-open="true"] { border-color: color-mix(in srgb, var(--c) 55%, var(--wa-line)); box-shadow: 0 4px 16px color-mix(in srgb, var(--c) 10%, transparent); }
    .sec-h { display: flex; align-items: center; gap: 10px; padding: 11px 12px; background: color-mix(in srgb, var(--c) 12%, var(--wa-card)); cursor: pointer; transition: background-color .12s ease-out; }
    .sec-h:hover { background: color-mix(in srgb, var(--c) 20%, var(--wa-card)); }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--c); }
    .sec-h .swatch { width: 28px; height: 28px; border-radius: 8px; background: color-mix(in srgb, var(--c) 20%, transparent); border: 1px solid color-mix(in srgb, var(--c) 35%, transparent); color: var(--c); flex: none; display: grid; place-items: center; }
    .sec-h .swatch svg { width: 15px; height: 15px; }
    .sec-h .tt { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    /* A row, so a card's reset button sits against its title rather than out
       at the far edge beside the chevron, which reads as a header action for
       the card as a whole instead of a way back for what is in it. */
    .sec-h h4 { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; display: flex; align-items: center; gap: 2px; }
    /* Reset buttons. One control, two places: beside a setting's title, and in
       a card's header for everything the card owns. It is drawn only while
       something is away from its default, so its presence is the "changed"
       mark, and a card with no buttons in it is a card nobody touched. */
    /* Yellow, and a heavier stroke than the other glyphs: at 13px the shared
       1.7 reads as a hairline, and this one has to be spotted rather than
       looked for. Same colour in a card header as beside a setting, so the
       two are obviously the same control at two scopes. */
    button.icon.reset { flex: none; color: var(--wa-reset); opacity: .9; }
    button.icon.reset svg.ui-icon { stroke-width: 2.6; }
    button.icon.reset:hover:not(:disabled) { opacity: 1; background: color-mix(in srgb, var(--wa-reset) 20%, transparent); }
    button.icon.reset:focus-visible { box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-reset) 40%, transparent); }
    /* Small enough to sit on a 13px label line without pushing it around. */
    button.icon.tiny { width: 20px; height: 20px; border-radius: 6px; margin: -4px 0; }
    button.icon.tiny svg.ui-icon { width: 13px; height: 13px; }
    /* The button sits snug after the title text rather than at the right end
       of the label column: half these fields put the label above the control
       and half beside it, and a right-aligned button lands next to the wrong
       label in the first kind. The title keeps its place either way. */
    .field > span.has-reset { display: flex; align-items: center; justify-content: flex-start; gap: 2px; }
    .sec-h .sum { color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sec-h .chev { color: var(--wa-muted); opacity: .7; flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 16px; height: 16px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 10px 12px 14px; }
    /* A section is a stack of blocks, not one run of prose. Every control
       block after the first draws a hairline above itself, and the hint that
       explains a block stays under it on the same side of the line, so the
       eye gets "control, then why" in pairs instead of a wall.

       Only direct children are ruled: the fields inside a .grid2 are one
       block and must not be cut apart from each other. */
    .sec-b > :is(.field, .grid2, .grid3, .grid4, .chart-numbers, .adders, .states-switch, .value-editor, details.sub) {
      margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--wa-line);
    }
    .sec-b > :is(.field, .grid2, .grid3, .grid4, .chart-numbers, .adders, .states-switch, .value-editor, details.sub):first-child {
      margin-top: 0; padding-top: 0; border-top: 0;
    }
    /* The custom span's day/hour/minute row belongs to the Span picker above
       it, so it tucks under without a rule of its own. */
    .sec-b > .grid3.span-parts { margin-top: 4px; padding-top: 0; border-top: 0; }
    /* A run of band rows is one block: the rule goes above the first of them,
       and the rest just stack. */
    .sec-b > .row-inline { margin-top: 6px; }
    .sec-b > :not(.row-inline) + .row-inline { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
    /* A hint belongs to the block above it, so it never carries a rule and it
       sits tight under what it explains. */
    .sec-b > .hint { margin: 5px 0 0; }
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
    /* One row per number: the whole label opens that text layer, and the ×
       at the end deletes it. Two buttons, because one cannot sit inside the
       other. */
    .chart-numbers { display: flex; flex-direction: column; gap: 4px; }
    .chart-numbers .num-row { display: flex; align-items: center; gap: 4px; }
    .chart-numbers .num-row > button.small { flex: 1; min-width: 0; justify-content: flex-start; text-align: left; }
    .chart-numbers .num-row > button.icon { flex: none; }
    dialog.preset-dialog {
      width: min(420px, calc(100vw - 32px)); padding: 16px 18px 18px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.preset-dialog::backdrop { background: rgba(0,0,0,.45); }
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
    .help-head { display: flex; align-items: center; gap: 8px; padding: 14px 18px; border-bottom: 1px solid var(--wa-line); }
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
    .send { font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
    .send.sent { color: var(--success-color, #43a047); }
    .send.sending { opacity: .7; }
    .send.offline { color: var(--warning-color, #ffa600); }
    header .send.sent { color: inherit; }
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

    /* Form controls: label on the left, control on the right, the way a
       settings page reads. Fields that carry their own machinery (the entity
       search, the value chip) keep the label above, so nothing inside them
       has to fit a half-width column. */
    .field {
      display: grid; grid-template-columns: minmax(84px, 32%) minmax(0, 1fr); align-items: center;
      gap: 4px 10px; margin: 6px 0; font-size: 13px;
    }
    .field > span { color: var(--wa-muted); font-size: 13px; line-height: 1.25; }
    .field input[type=text], .field input[type=number], .field select, .field textarea { width: 100%; min-width: 0; }
    /* Inside a tinted section the focus ring takes the section's colour. */
    .field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .field .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .field.slider .slider-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .field.slider input[type=range] { flex: 1; min-width: 60px; }
    .field.slider .slider-value { min-width: 44px; text-align: right; opacity: .85; }
    .field.check { grid-template-columns: auto minmax(0, 1fr); gap: 10px; }
    .field.check > span { color: inherit; }
    .field.check .mixed { color: var(--wa-muted); font-size: 12px; }
    .field.entity-field, .field.value-chip-field { display: flex; flex-direction: column; gap: 4px; align-items: stretch; }
    .field.entity-field > span, .field.value-chip-field > span { font-size: 12px; }
    .color-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .color-row input[type=color] { width: 34px; height: 28px; }
    .color-row input[type=range] { flex: 1; min-width: 40px; }
    .color-row input.hex { width: 90px; flex: none; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0 6px; }
    .grid2 .field, .grid4 .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
    .grid2 .field > span, .grid4 .field > span { font-size: 12px; }
    .grid4 input[type=number] { text-align: right; padding-left: 4px; padding-right: 6px; }
    .row-inline { display: flex; align-items: flex-end; gap: 4px; }
    .row-inline .field { flex: 1; }
    .hint { font-size: 12px; color: var(--wa-muted); margin: 4px 0; }
    .hint.warn { color: var(--wa-ink); }
    details.sub { margin: 6px 0; }
    details.sub summary { font-size: 12px; opacity: .8; cursor: pointer; }
    .chip { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 2px 8px; border: 1px solid var(--wa-line); border-radius: 999px; }
    button.chip { font: inherit; font-size: 12px; background: transparent; color: inherit; cursor: pointer; }
    button.chip.active { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .chip-add { font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px dashed var(--wa-line); background: transparent; color: inherit; cursor: pointer; }
    .value-editor { border-left: 2px solid var(--wa-line); padding-left: 10px; margin: 4px 0 8px; }

    /* Value chip: one line saying what a value is, with the full form behind it.
       The form lives in a popover, which the browser draws in the top layer, so
       a scrolling card cannot clip it. Its position is set in editors.ts. */
    .value-chip-field { gap: 4px; }
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
    .value-pop .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }

    /* States table: one rule as rows. A two-state light is two lines, so the
       row has to stay one line: every control in it is sized to the text it
       holds rather than to the column. */
    .states-table { width: 100%; border-collapse: collapse; margin: 8px 0 4px; font-size: 13px; }
    .states-table th {
      text-align: left; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
      opacity: .6; padding: 2px 6px; border-bottom: 1px solid var(--wa-line); white-space: nowrap;
    }
    .states-table th button.icon { opacity: 0; }
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
    .states-foot .spacer { flex: 1; }
    .states-switch { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
    .states-switch .hint { margin: 0; }
    .confirm-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .value-chip-field.compact { margin: 0; }
    .value-chip-field.compact button.value-chip { padding: 3px 8px; font-size: 13px; max-width: 190px; }

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
      display: flex; gap: 8px; align-items: center; font-size: 12px; margin-top: 6px;
      padding: 6px 8px; border-radius: var(--wa-r-sm);
      border: 1px solid color-mix(in srgb, var(--wa-ent) 28%, var(--wa-line)); background: var(--wa-ent-bg);
    }
    .entity-current .ent-ico { width: 24px; height: 24px; border-radius: 7px; background: color-mix(in srgb, var(--wa-ent) 18%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico.on { background: color-mix(in srgb, var(--wa-ent) 28%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico svg { width: 14px; height: 14px; }
    .entity-current .ent-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-ent); font-weight: 600; }
    .entity-current .ent-area { flex: none; color: var(--wa-muted); }
    .entity-current .ent-state { flex: none; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* The two tokens, wherever a run of ordinary prose has to name an entity
       or print what it reads. Everything that shows a live value ends up
       here, so the colour never has to be repeated by hand. */
    .ent-tok { color: var(--wa-ent); font-weight: 600; }
    .val-tok, .entity-current .ent-state, .vchip .val, .chart-numbers b, .hint .nums {
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
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.loadListView(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let t=window.localStorage.getItem(Zs);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=Pa(i.left)),typeof i.right=="number"&&(this.colRight=Pa(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(Zs,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadListView(){try{let t=window.localStorage.getItem(Xs);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(Xs,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return u`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=Ws:this.colRight=js,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=el(this.panelWidth,this.colLeft,this.colRight),s=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=p=>{if(p.pointerId!==i.pointerId)return;let h=p.clientX-r,f=Pa(t==="left"?s+h:s-h);t==="left"?this.colLeft=f:this.colRight=f},d=p=>{p.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=[t.rectangular,t.circular,t.corner].filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||_a(i)!==_a(this.inspect))&&(this.openSections=new Set(Ta))}}updated(t){let i=_a(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}t.key==="Escape"&&(this.timestampActiveId=void 0);let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!Hp.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!o){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!o){this.deleteSelection()&&t.preventDefault();return}let s=Sp[t.key];if(s&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(s.dx,s.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!r?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!r&&(t.preventDefault(),this.redo()),r||o))return;let d=t.key.toLowerCase(),c=!0;d==="a"?this.selectAll():d==="c"?this.copySelection():d==="x"?this.copySelection()&&this.deleteSelection():d==="v"?this.pasteClip():d==="d"?this.duplicateSelection():d==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():d==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):c=!1,c&&t.preventDefault()}selectedIds(){let t=this.draft?.config;if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?Ke(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();return!this.canEdit||t.length===0?!1:(this.mutate(i=>{for(let a of t)mt(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0?!1:(this.clipboard=ji(t,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.draft?.config,i=this.clipboard,a=this.canvasFamily,r=new Set(t?.elements.map(l=>l.payload.id)??[]),o=t!==void 0&&i.family!==void 0&&i.family!==a&&i.elements.length>0&&i.elements.every(l=>r.has(l.payload.id)),s=[];this.mutate(l=>{s=o?Wr(l,i,a):qi(l,i)}),this.selectRows(s)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=ji(t,i),r=[];this.mutate(o=>{r=qi(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=t.elements.filter(a=>!ce(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?Ue(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>an(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>t.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!fe(t,a,s).isHidden);this.mutate(s=>{for(let l of i)we(s,a,l,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(p=>!ce(a,p)),o=a.elements.filter(p=>ce(a,p)),s=r.findIndex(p=>p.payload.id===t),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let d=r[l],c=r[s];d.payload.groupId!==c.payload.groupId&&(c.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=c.payload.groupId),a.elements=[...r,...o],We(a),Lt(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await ir(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${it(t)}`}}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=co(this.owners.find(a=>a.owner_watch_id===t)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await dr(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await ar(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token,this.polling=t.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${it(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=bt.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=Nr(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=it(i)}this.scheduleTemplates(0)}startNew(t){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new bt(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return kr(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await rr(this.hass,this.ownerId);this.polling=t.polling,this.serverToken=t.token,this.appliedToken=t.applied_token,t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=it(t)}}renderSendButton(){let t=Yr({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(t.kind==="unsupported")return m;let i=Jr(t),a=i.resend&&this.hass.user?.is_admin?u`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:m;return u`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}${a}</span>`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<Mi}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=ea(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=Rr(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(Cp))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new je(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),historySeries:i=>this.historySeries.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}}}}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||wo(t.app_version):!0}get canvasFamily(){if(yt(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&go(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;!t||t.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=fo(t)[0]??"rectangular")}addHere(t){let i=new Set(this.draft?.config.elements.map(r=>r.payload.id)??[]),a=this.canvasFamily;this.mutate(r=>{if(t(r),!(r.supportedFamilies.filter(o=>yt(o)).length<2))for(let o of r.elements)i.has(o.payload.id)||Es(r,o.payload.id,a)})}static sizeWords(t){let i=de[t];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(t,i,a){if(t.elements.length===0||!yt(this.activeFamily))return m;if(li(t,i)>0)return m;let r=Q.filter(o=>o!==i&&t.supportedFamilies.includes(o)).filter(o=>li(t,o)>0);return u`<div class="blank-shape">
      <b>Nothing is on the ${U(i)} shape yet.</b>
      <div class="hint">Layers belong to the whole complication, so the ones on the other shapes
        are still listed here, dimmed. The eye on one of those rows puts it on this shape. Or copy
        rows on another shape with ${Oe}C, come
        back here and paste them with ${Oe}V: they land where they sit there, and no second
        copy of the layer is made.</div>
      ${a&&r.length>0?u`<div class="adders">
            ${r.map(o=>u`<button class="small primary"
              title=${`Put every layer on the ${U(i)} shape where it sits on the ${U(o)} one, scaled to this canvas`}
              @click=${()=>this.mutate(s=>Ts(s,o,i))}>Copy the ${U(o)} layout</button>`)}
          </div>
          <div class="hint">Either way the layers are scaled on the way in: a point is a point, and
            this canvas is ${I.sizeWords(i)} against ${I.sizeWords(r[0])}, so
            sizes come down to match and a round shape pulls the layout in off its rim. Expect to
            nudge it by hand afterwards.</div>`:m}
    </div>`}addShape(t){this.mutate(i=>yo(i,t)),this.activeFamily=t,this.inspect={kind:"family"}}removeShape(t){let i=this.draft?.config;if(!i||!Un(i,t))return;let a=vo(i,t);a.length>0&&!window.confirm(`Remove the ${U(t)} layout? This drops ${a.join(", ")}.`)||(this.mutate(r=>bo(r,t)),this.ensureActiveFamily())}createNew(t){this.newShapeChooser=!1,this.startNew(Dr("New complication",this.freeSlot(),[t]))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let s=structuredClone(i.config);s.id=Y(),s.slotIndex=o,i=new bt(s,null)}let a=i.encoded(),r=await or(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=bt.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=it(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let t=await sr(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!t.ok){t.error==="conflict"?this.conflict={current:t.current??null,message:t.message??"This complication changed on the server."}:this.saveError=t.message??t.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(t){this.saveError=it(t)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=Y(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await lr(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=it(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},$p)}async refreshHistorySeries(){let t=this.draft?.config,i=t?Li(t):[];if(i.length===0){this.historySeries.size>0&&(this.historySeries=new Map);return}let a={};for(let r of i)a[r.key]={entity_id:r.entityId,minutes:r.minutes,points:r.points};try{let r=await pr(this.hass,a),o=new Map;for(let[s,l]of Object.entries(r))l.ok&&o.set(s,l.series);this.historySeries=o}catch{}}async refreshTemplates(){this.refreshHistorySeries();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await cr(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=eo(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=it(i)}}buildContext(){let t=new Map;for(let i of this.compiled?.entities.keys()??[]){let a=this.hass.states[i];if(!a)continue;let r=a.attributes,o=i.split(".")[0]??"",s={entityId:i,state:this.testValues.get(i)??a.state,unitOfMeasurement:typeof r.unit_of_measurement=="string"?r.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){s.timerState=a.state,typeof r.finishes_at=="string"&&(s.finishesAt=r.finishes_at);let l=Lp(r.remaining);l!==void 0&&(s.remaining=l)}o==="camera"&&typeof r.entity_picture=="string"&&(s.entityPicture=r.entity_picture),t.set(i,s)}return{entityStates:t,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return u`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${t?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let t=this.showTaps;return u`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return u`<button class="pick" ?disabled=${t}
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}><span class="glyph">⤢</span>Expand</button>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return m;let o=a.slots[t],s=t==="corner"?104/124:o.width/o.height;return u`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
      <div class="zoom-bar">
        ${this.renderUnder(r,t)}
        <span class="spacer"></span>
        ${this.renderPickButton()}
        ${this.renderShowTapsButton()}
        <button class="pick" title="Back to the editor (Escape)" @click=${()=>{this.zoomed=!1}}><span class="glyph">⤡</span>Close</button>
      </div>
      <div class="zoom-stage" style=${`--wa-ratio:${s}`}>
        ${this.renderBigPreview(t,i,a)}
      </div>
    </dialog>`}renderHelpDialog(){let t=Oe,i=Oa,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${fn}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a folder to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=s=>s.map(([l,d])=>u`<tr><th scope="row"><kbd>${l}</kbd></th><td>${d}</td></tr>`);return u`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
      <div class="help-head">
        <h2>Keys and mouse</h2>
        <span class="spacer"></span>
        <button class="pick" title="Close (Escape)" @click=${()=>{this.helpOpen=!1}}>Close</button>
      </div>
      <div class="help-body">
        <section>
          <h3>Keys</h3>
          <table><tbody>${o(a)}</tbody></table>
          <p class="hint">Keys act on layers only while nothing is being typed into. In a field they keep their usual meaning.</p>
        </section>
        <section>
          <h3>Mouse</h3>
          <table><tbody>${o(r)}</tbody></table>
        </section>
      </div>
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.draft?.config;if(!i)return;let r=t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?Wi(i,r):void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(t,i){if(this.picking){i.preventDefault(),this.pickAt(t,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,s=a.closest("svg"),l=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=l!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let E=this.focusTapId();if(E!==void 0&&o===E&&s&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,s,E,r??void 0);return}let T=this.hitLayerId(i);T?this.inspect={kind:"layer",id:T}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(t!==this.activeFamily){this.activeFamily=t;return}let c=Qs(i);if(!c&&this.multi.size>0&&(this.multi=new Set),!o||!s)return;let p=Wi(this.draft.config,o),h=this.draft.config.elements.find(E=>E.payload.id===p);if(!p||!h)return;if(c){i.preventDefault(),this.togglePick(p);return}let f=Ue(this.draft.config,p),g=f!==void 0&&this.inspect.kind==="group"&&this.inspect.id===f.id;if(f&&(f.locked||g)&&!r&&!d){this.beginGroupGesture(t,i,s,f);return}if((this.inspect.kind!=="layer"||this.inspect.id!==p)&&(this.inspect={kind:"layer",id:p},r))return;i.preventDefault();let w=fe(this.draft.config,t,h).frame,k=this.gestureCanvas(t);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=p;let E=h.payload,T=de[t],v=w.width*T.width,C=w.height*T.height,P={x:0,y:0,w:v,h:C,cx:v/2,cy:C/2},N=Bn(E,P,Vn(new Date));if(this.cancelGesture?.(),l){let S=k.width/T.width,O=E.timestampSize;this.cancelGesture=Yo(s,i,l,{w:N.w*S,h:N.h*S},(L,ne)=>{let y=Math.min(40,Math.max(4,Math.round(O*L)));this.mutate($=>{let D=$.elements.find(Z=>Z.payload.id===p);D?.kind==="image"&&(D.payload.timestampSize=y)},`ts-size-${p}`),ne&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let q={x:0,y:0,w:w.width*k.width,h:w.height*k.height},oe=Be(E)?{x:E.timestampX,y:E.timestampY}:{x:(N.x+N.w/2)/P.w,y:(N.y+N.h/2)/P.h},x=!1;this.cancelGesture=qo(s,q,i,oe,(S,O,L)=>{L||(x=!0),x&&this.mutate(ne=>{let y=ne.elements.find($=>$.payload.id===p);y?.kind==="image"&&(y.payload.timestampX=S,y.payload.timestampY=O)},`ts-${p}`),L&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=Jn(s,k,i,{elementId:p,frame:w,handle:r??void 0},{onFrame:(E,T,v)=>{this.mutate(C=>we(C,t,E,{frame:T}),`drag-${E}-${t}`),v&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r){let o=this.draft?.config;if(!o)return;let s=Ke(o,r.id);if(s.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let l=new Map(s.map(k=>[k.payload.id,fe(o,t,k).frame])),d=[...l.values()],c=Math.min(...d.map(k=>k.x)),p=Math.min(...d.map(k=>k.y)),h=Math.max(...d.map(k=>k.x+k.width)),f=Math.max(...d.map(k=>k.y+k.height)),g={x:c,y:p,width:h-c,height:f-p,rotationDegrees:0},w=k=>Math.round(k*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=Jn(a,this.gestureCanvas(t),i,{elementId:r.id,frame:g},{onFrame:(k,E,T)=>{let v=E.x-g.x,C=E.y-g.y;this.mutate(P=>{for(let[N,q]of l)we(P,t,N,{frame:{...q,x:w(q.x+v),y:w(q.y+C)}})},`drag-group-${r.id}-${t}`),T&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(t,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Wo:1,s=t*o,l=i*o,d=this.canvasFamily,c=de[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,s,l))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,s,l);if(this.inspect.kind==="group"){let k=this.inspect.id;return this.nudgeMany(Ke(r,k).map(E=>E.payload.id),d,c,`nudge-group-${k}-${d}`,s,l)}if(this.inspect.kind!=="layer")return!1;let p=this.inspect.id,h=r.elements.find(k=>k.payload.id===p);if(!h)return!1;let f=Ue(r,p);if(f?.locked)return this.nudgeMany(Ke(r,f.id).map(k=>k.payload.id),d,c,`nudge-group-${f.id}-${d}`,s,l);let g=fe(r,d,h).frame,w=wa(g,s,l,c);return(w.x!==g.x||w.y!==g.y)&&this.mutate(k=>we(k,d,p,{frame:w}),`nudge-${p}-${d}`),!0}nudgeMany(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return!1;let d=C=>Math.round(C*1e3)/1e3,c=new Map;for(let C of t){let P=l.elements.find(N=>N.payload.id===C);P&&c.set(C,fe(l,i,P).frame)}if(c.size===0)return!1;let p=[...c.values()],h=Math.min(...p.map(C=>C.x)),f=Math.min(...p.map(C=>C.y)),g=Math.max(...p.map(C=>C.x+C.width)),w=Math.max(...p.map(C=>C.y+C.height)),k={x:h,y:f,width:g-h,height:w-f,rotationDegrees:0},E=wa(k,o,s,a),T=E.x-k.x,v=E.y-k.y;return(T!==0||v!==0)&&this.mutate(C=>{for(let[P,N]of c)we(C,i,P,{frame:{...N,x:d(N.x+T),y:d(N.y+v)}})},r),!0}nudgeTimestamp(t,i,a,r){let o=this.draft?.config,s=o?.elements.find(k=>k.payload.id===t);if(!o||s?.kind!=="image"||s.payload.timestamp!==!0)return!1;let l=s.payload,d=de[i],c=fe(o,i,s).frame,p=c.width*d.width,h=c.height*d.height,f=Bn(l,{x:0,y:0,w:p,h,cx:p/2,cy:h/2},Vn(new Date)),g=Be(l)?{x:l.timestampX,y:l.timestampY}:{x:p>0?(f.x+f.w/2)/p:.5,y:h>0?(f.y+f.h/2)/h:.5},w=jo(g,a,r,{w:p,h});return(w.x!==g.x||w.y!==g.y)&&this.mutate(k=>{let E=k.elements.find(T=>T.payload.id===t);E?.kind==="image"&&(E.payload.timestampX=w.x,E.payload.timestampY=w.y)},`nudge-ts-${t}`),!0}gestureCanvas(t){let i=Dn(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=da(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:Ce(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(p=>p.payload.id===r);if(!s||!l)return;let d=ce(s,l),c=fe(s,t,l).frame;this.cancelGesture?.(),this.cancelGesture=Jn(a,this.gestureCanvas(t),i,{elementId:r,frame:c,handle:o},{onFrame:(p,h,f)=>{this.mutate(g=>{d?Gr(g,p,t,h):we(g,t,p,{frame:h})},`tap-box-${p}-${t}`),f&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:el(this.panelWidth,this.colLeft,this.colRight);return u`
      <header>
        <h1><span class="mark">${z("watch")}</span>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${i?u`<span class="dirty-dot" title="Unsaved changes"></span>`:m}
        <div class="toolbar">
          <button @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
        </div>
        <span class="spacer"></span>
        <button class="help" title="Keys and mouse tips" aria-label="Keys and mouse tips" @click=${()=>{this.helpOpen=!0}}>?</button>
        ${this.renderSendButton()}
        <label>Watch
          <select @change=${r=>{this.selectOwner(r.target.value)}}>
            ${this.owners.map(r=>u`<option value=${r.owner_watch_id} ?selected=${r.owner_watch_id===this.ownerId}>
              ${Na(r)} (${r.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":t?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
      </header>
      ${this.loadError?u`<div class="card error">${this.loadError}</div>`:m}
      ${this.helpOpen?this.renderHelpDialog():m}
      ${this.watchSupported?u`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:u`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${ko(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(U).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(t){return u`<span class="shape-dots">${Ot.map(i=>u`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${U(i)}></span>`)}</span>`}renderPicker(){let t=this.draft,i=this.records.find(l=>l.id===this.selectedId),a=t?t.config.name.trim()||"Untitled":"No complication",r=t?t.config.supportedFamilies:[],o=this.pickerRows(),s=this.freeSlot();return u`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?u`<span class="pk-rev">r${i.revision}</span>`:t&&t.baseRevision===null?u`<span class="pk-rev">unsaved</span>`:m}
        ${z("chevron")}
      </button>
      ${this.pickerOpen?u`<div class="menu" role="listbox">
        ${o.length===0&&!(t&&t.baseRevision===null)?u`<div class="empty">No complications for this watch yet.</div>`:m}
        ${o.map(l=>l.kind==="record"?u`<button class="row" role="option" aria-current=${l.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(l.record)}}>
              ${this.shapeDots(Tp(l.record))}
              <span class="pk-name">${String(l.record.document?.name??"Untitled")}</span>
              <span class="pk-badge">r${l.record.revision}</span>
            </button>`:u`<div class="row locked" title=${l.title}>
              ${this.shapeDots(l.families)}
              <span class="pk-name">${l.name}</span>
              <span class="pk-badge">${l.badge}</span>
            </div>`)}
        ${t&&t.baseRevision===null?u`<div class="row" aria-current="true">${this.shapeDots(r)}<span class="pk-name">${a}</span><span class="pk-badge">unsaved</span></div>`:m}
        ${this.hass.user?.is_admin?u`
          <button class="row new" ?disabled=${s<0} @click=${()=>{this.newShapeChooser=!this.newShapeChooser}}>
            ${z("plus")}<span class="pk-name">New complication</span>${s<0?u`<span class="pk-badge">watch is full</span>`:m}
          </button>
          ${this.newShapeChooser&&s>=0?u`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${Ot.map(l=>u`<button class="small ${l==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(l)}}>${U(l)}</button>`)}
            </div>
          </div>`:m}`:m}
      </div>`:m}
    </div>`}togglePicker(t=!this.pickerOpen){this.pickerOpen=t,t||(this.newShapeChooser=!1),t?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(u`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(u`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(u`<div class="banner err"><b>Save rejected.</b> ${a.message}
        ${a.current?u` The server has revision ${a.current.revision}, saved ${a.current.updatedAt} by ${a.current.updatedBy||"unknown"}.`:" The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
          <button class="small" @click=${()=>{this.conflict=void 0}}>Keep editing</button>
        </div></div>`)}else this.remoteRevision!==void 0&&t.push(u`<div class="banner warn">${this.remoteRevision===-1?"This complication was deleted on the server while you were editing.":`Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
        </div></div>`);return this.saveError&&t.push(u`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`),t}renderOrphanBanner(){let t=this.selectedOwner;if(!t?.is_orphan)return;let i=this.owners.filter(a=>!a.is_orphan);return u`<div class="banner warn">
      <b>This watch is no longer registered.</b> Reinstalling the watch app gives the watch a new id, and these
      ${t.complication_count} complication${t.complication_count===1?"":"s"} stayed behind under the old one.
      ${this.hass.user?.is_admin?i.length===0?u`<div class="hint">No registered watch to move them to. Open Wrist Assistant on the watch first.</div>`:u`<div class="acts">
              <select @change=${a=>{this.moveTarget=a.target.value||void 0}}>
                <option value="" ?selected=${!this.moveTarget}>Move all to…</option>
                ${i.map(a=>u`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${Na(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:u`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?u`<div class="err">${this.moveError}</div>`:m}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return m;if(this.activeFamily==="inline")return m;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return u`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
        <span class="swatch">${z("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?m:u`<span class="mini">${pa.length} kinds · ${mn.length} presets</span>`}
        ${a?u`<span class="tool-set" @click=${s=>s.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Compact buttons: the name of each kind, no sample"],["expanded","Expanded buttons: a sample of what each kind draws"]].map(([s,l])=>u`
                  <button class=${this.addDetail===s?"on":""} title=${l} aria-label=${l} aria-pressed=${this.addDetail===s?"true":"false"}
                    @click=${()=>{this.addDetail=s,this.saveListView()}}>${z(s)}</button>`)}
              </span>
            </span>`:m}
        <span class="chev">${z("chevron")}</span>
      </h2>
      ${a?u`
          <div class="add-grid ${r?"":"lean"}">
            ${pa.map(s=>u`<button class="add" style=${`--k:${re[s]}`} ?disabled=${i} title=${`Add a blank ${Nt[s].toLowerCase()} layer`}
              @click=${()=>{let l=ze(s);this.addHere(d=>{d.elements.push(l)}),this.inspect={kind:"layer",id:l.payload.id}}}
              >${r?u`<span class="well">${Uo(s)}</span>`:m}<span class="add-name">${z(s)}<span>${Nt[s]}</span></span></button>`)}
          </div>
          <div class="presets-l">Or start from a preset</div>
          <div class="presets">
            ${mn.map(s=>u`<button class="preset" title=${s.blurb}
              ?disabled=${t.elements.length+s.layerCount>64}
              @click=${()=>this.openPreset(s.kind)}>${s.title}</button>`)}
          </div>`:m}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let s=o.elements.filter(g=>!ce(o,g)),l=o.elements.filter(g=>ce(o,g)),d=[...s].reverse(),c=d.find(g=>g.payload.id===i);if(!c)return;let p=o.groups?.find(g=>g.id===t),h=p?d.filter(g=>g.payload.groupId===p.id):d.filter(g=>g.payload.id===t);if(h.length===0||h.includes(c))return;d=d.filter(g=>!h.includes(g));let f;if((p||r)&&c.payload.groupId!==void 0){let g=d.filter(w=>w.payload.groupId===c.payload.groupId);f=a?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else f=d.indexOf(c)+(a?0:1);if(d.splice(f,0,...h),!p){let g=h[0],w=r?void 0:c.payload.groupId;w===void 0?delete g.payload.groupId:g.payload.groupId=w}o.elements=[...d.reverse(),...l],We(o),Lt(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?Xe:0),l=o.bottom-(r.classList.contains("drop-after")?Xe:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(Qs(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(l=>!ce(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(t);if(o<0||s<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=Ni(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return m;if(this.activeFamily==="inline")return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(x,S)=>this.moveLayer(x,S),o=x=>{let S;this.mutate(O=>{S=Kr(O,x)}),S&&(this.inspect={kind:"layer",id:S})},s=x=>{this.mutate(S=>mt(S,x)),this.inspect.kind==="layer"&&this.inspect.id===x&&(this.inspect={kind:"general"})},l=[...t.elements].filter(x=>!ce(t,x)).reverse(),d=me(this.host()),c=new je(this.buildContext(),this.draft?.config),p=t.perFamily[this.activeFamily],h=this.inspect.kind==="family",f=`${p?.backgroundColorHex?Me(p.backgroundColorHex):"transparent"} \xB7 ${p?.borderColorHex?`${p.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(x=>t.elements.some(S=>S.payload.id===x)).length,w=na(t,this.buildContext(),this.forced)[a],k=Fp[this.thumbStep],E=Math.round(qs*k),T=Math.round(Ys*k),v=x=>w?u`<span class="thumb">${mo(w,x,{icons:this.icons,imageSizes:this.imageSizes,width:E,height:T})}</span>`:u`<span class="thumb"></span>`,C=this.layerDetail==="expanded",P=(x,S,O=!1)=>{let L=x.payload.id,ne=this.inspect.kind==="layer"&&this.inspect.id===L,y=fe(t,a,x),$=y.isHidden,D=Ce(t,L)[0],Z=cn(x.payload.rules),K=this.picking&&this.pickHoverId===L,J=this.rowDrag(L,i);return u`<div class="layer ${ne?"hl":""} ${O?"held":""} ${K?"pick":""} ${$?"dim":""} ${this.multi.has(L)?"multi":""} ${S?"kid":""} ${C?"rich":""}"
        style=${`--k:${re[x.kind]}`} tabindex="0" draggable=${J.draggable}
        @pointerenter=${()=>{this.listHoverIds=[L]}}
        @pointerleave=${()=>this.leaveRow([L])}
        @click=${V=>this.clickRow(L,V)}
        @keydown=${V=>{V.key==="Enter"&&(this.inspect={kind:"layer",id:L})}}
        @dragstart=${J.onStart} @dragend=${J.onEnd} @dragover=${J.onOver} @drop=${J.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${z("grip")}</span>
        <span class="bar"></span>
        ${v([L])}
        <span class="name">
          <b>${Te(x,d)}</b>
          <small><span class="kind">${Nt[x.kind]}</span> · ${_p(x,c,this.historySeries,y.size)}</small>
          ${C?u`<span class="facts">${zp(this.host(),a,x,y).map(V=>u`<span class="fact"><b>${V.label}</b> ${V.value}</span>`)}</span>`:m}
        </span>
        <span class="right">
          <span class="badges">
            ${D?u`<span class="badge tap" title=${`Tappable \xB7 ${Te(D,d)}`}>tap</span>`:m}
            ${x.payload.rules.length===0?m:u`<span class="badge states" title=${Z}>${Z.replace(/\.$/,"").toLowerCase()}</span>`}
            ${$?u`<span class="badge">hidden</span>`:m}
          </span>
          ${i?u`<span class="acts">
            <button class="icon" title=${`Bring forward (${Oe}])`} aria-label="Bring forward" @click=${V=>{V.stopPropagation(),r(L,1)}}>${z("up")}</button>
            <button class="icon" title=${`Send back (${Oe}[)`} aria-label="Send back" @click=${V=>{V.stopPropagation(),r(L,-1)}}>${z("down")}</button>
            <button class="icon" title=${`${y.isHidden?"Show":"Hide"} (${Oa}${Oe}H)`} aria-label=${y.isHidden?"Show this layer":"Hide this layer"} @click=${V=>{V.stopPropagation(),this.mutate(ye=>we(ye,a,L,{isHidden:!y.isHidden}))}}>${z(y.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${Oe}D)`} aria-label="Duplicate" @click=${V=>{V.stopPropagation(),o(L)}}>${z("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${V=>{V.stopPropagation(),s(L)}}>${z("delete")}</button>
          </span>`:m}
        </span>
      </div>`},N=(x,S)=>{let O=this.inspect.kind==="group"&&this.inspect.id===x.id,L=!this.collapsed.has(x.id),ne=this.rowDrag(x.id,i),y=S[0],$=S[S.length-1],D=K=>{let J=K.currentTarget,V=J.getBoundingClientRect(),ye=V.top+(J.classList.contains("drop-before")?Xe:0),ui=V.bottom-(J.classList.contains("drop-after")?Xe:0),Fe=(K.clientY-ye)/Math.max(1,ui-ye);return Fe<.25?"drop-before":!L&&Fe>.75?"drop-after":"drop-into"},Z=S.map(K=>K.payload.id);return u`<div class="layer group ${O?"hl":""} ${C?"rich":""}" style=${`--k:${X.group}`} tabindex="0" draggable=${ne.draggable}
        @pointerenter=${()=>{this.listHoverIds=Z}}
        @pointerleave=${()=>this.leaveRow(Z)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:x.id}}}
        @keydown=${K=>{K.key==="Enter"&&(this.inspect={kind:"group",id:x.id})}}
        @dragstart=${ne.onStart} @dragend=${ne.onEnd}
        @dragover=${K=>{!this.dragId||this.dragId===x.id||(K.preventDefault(),this.markDrop(K.currentTarget,D(K)))}}
        @drop=${K=>{K.preventDefault();let J=D(K);this.clearDragMarks();let V=this.dragId;if(this.dragId=void 0,!(!V||!y||!$)){if(J==="drop-before"){this.reorderLayer(V,y.payload.id,!0,!0);return}if(J==="drop-after"){this.reorderLayer(V,$.payload.id,!1,!0);return}this.isGroupId(V)||(this.reorderLayer(V,y.payload.id,!0),this.mutate(ye=>Di(ye,V,x.id)))}}}>
        <button class="chev" aria-expanded=${L?"true":"false"} title=${L?"Fold the group":"Unfold the group"}
          @click=${K=>{K.stopPropagation();let J=new Set(this.collapsed);L?J.add(x.id):J.delete(x.id),this.collapsed=J}}>${z("chevron")}</button>
        <span class="bar"></span>
        ${v(S.map(K=>K.payload.id))}
        <span class="name">
          <b>${x.name}</b>
          <small><span class="kind">Group</span> · ${S.length} layer${S.length===1?"":"s"} · ${x.locked?"moves as one":"unlocked"}</small>
          ${C?u`<span class="facts"><span class="fact"><b>Holds</b> ${S.map(K=>Te(K,d)).join(", ")}</span></span>`:m}
        </span>
        <span class="right">
          ${i?u`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${Oa}${Oe}G)`} aria-label="Ungroup" @click=${K=>{K.stopPropagation(),this.mutate(J=>an(J,x.id)),O&&(this.inspect={kind:"general"})}}>${z("ungroup")}</button>
          </span>`:m}
          <button class="icon lockbtn ${x.locked?"on":""}" ?disabled=${!i}
            title=${x.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${x.locked?"Unlock the group":"Lock the group"}
            @click=${K=>{K.stopPropagation(),this.mutate(J=>{let V=J.groups?.find(ye=>ye.id===x.id);V&&(V.locked=!V.locked)})}}>${z(x.locked?"lock":"unlock")}</button>
        </span>
      </div>`},q=[],oe=new Set;for(let x=0;x<l.length;x++){let S=l[x],O=S.payload.groupId,L=O===void 0?void 0:t.groups?.find($=>$.id===O);if(!L){q.push(P(S,!1));continue}if(oe.has(L.id))continue;oe.add(L.id);let ne=l.filter($=>$.payload.groupId===L.id);q.push(N(L,ne));let y=this.inspect.kind==="group"&&this.inspect.id===L.id;this.collapsed.has(L.id)||q.push(u`<div class="group-kids">${ne.map($=>P($,!0,y))}</div>`)}return u`<div class="card">
      <h2 class="panel-title tools"><span class="swatch">${z("layers")}</span>Layers<span class="spacer"></span>
        <span class="mini">top draws last</span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([x,S])=>u`
              <button class=${this.layerDetail===x?"on":""} title=${S} aria-label=${S} aria-pressed=${this.layerDetail===x?"true":"false"}
                @click=${()=>{this.layerDetail=x,this.saveListView()}}>${z(x)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${Rp.map((x,S)=>u`
              <button class=${this.thumbStep===S?"on":""} title=${`${Js[S]} row pictures`}
                aria-label=${`${Js[S]} row pictures`} aria-pressed=${this.thumbStep===S?"true":"false"}
                @click=${()=>{this.thumbStep=S,this.saveListView()}}>${x}</button>`)}
          </span>
        </span>
      </h2>
      ${g>=2&&i?u`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${Oe}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?u`<div class="hint">${fn}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:m}
      ${t.elements.length===0?u`<div class="empty">No layers yet. Add one above.</div>`:m}
      ${this.renderShapeIsBlank(t,a,i)}
      <div class="layers" style=${`--thumb-w:${E}px;--thumb-h:${T}px`}>
      ${q}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${X.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${x=>{x.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${x=>{this.dragId&&(x.preventDefault(),this.markDrop(x.currentTarget,"drop-before"))}}
        @drop=${x=>{x.preventDefault(),this.clearDragMarks();let S=this.dragId,O=[...l].reverse().find(L=>L.payload.id!==S&&L.payload.groupId!==S);S&&O&&this.reorderLayer(S,O.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${z("shape")}</span>
        <span class="bar"></span>
        ${v([])}
        <span class="name">
          <b>${U(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${f}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderInlineHasNoLayers(){return u`<div class="card">
      <h2 class="panel-title"><span class="swatch">${z("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderPresetDialog(){let t=this.presetKind?Vs(this.presetKind):void 0,i=this.presetEntity;return u`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?m:u`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${nt(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Ks,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){this.canEdit&&(this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=Us(s,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return u`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.draft?.config;if(!t)return u`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=na(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return u`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${ln.map(o=>u`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${dn.label} box. Smaller cases scale it down.</span>
        <span class="spacer"></span>
        <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderZoomButton()}</span>
      </div>
      <div class="stage">
        ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
        ${this.renderUnder(t,r)}
      </div>
      ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):m}
      <div class="strip">
        ${this.renderSettingsRow(t)}
        ${this.renderShapesRow(t,i)}
        ${this.renderValuesRow()}
      </div>
    </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return m;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.draft?.config,l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?Ue(s,o)?.id:void 0,d=s&&l!==void 0&&(this.inspect.kind==="group"||Ue(s,o)?.locked)?Ke(s,l).map(g=>g.payload.id):[],c=[...new Set([...d,...this.multi])],p=a.slots[t],h=this.focusTapId(),f={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:p,highlightId:h??o,...c.length>0&&!this.showTaps?{highlightIds:c}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:this.listHoverIds.length>0?{hoverIds:this.listHoverIds}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return u`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${g=>this.onPreviewPointerDown(t,g)}
      @pointermove=${g=>this.onPickMove(g)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${ca(r,f)}
    </div>`}renderUnder(t,i){let a=me(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(p=>p.payload.id===r.id):void 0,s;if(this.showTaps)s=u`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Ge(t.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let p=t.groups?.find(f=>f.id===r.id),h=p?Ke(t,p.id).length:0;s=p?u`editing group <b>${p.name}</b>. Drag to move all ${h} layers.${p.locked?"":" Click one layer to move it alone."}`:""}else if(o){let p=Ue(t,o.payload.id);s=p?.locked?u`editing <b>${Te(o,a)}</b> in <b>${p.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:u`editing <b>${Te(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else s="click a layer to edit it";if(i==="inline")return u`<div class="under"><b>Inline</b> · ${s}</div>`;let l=this.currentCase().slots[i],d=Dn(l,i),c=Math.round(d.scale*100);return u`<div class="under"><b>${U(i)}</b> · ${l.width} × ${l.height} pt${c!==100?` \xB7 ${c}%`:""} · ${s}</div>`}renderInlinePreview(t,i){let a;if(!t)a=u`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?Pt((t.countdownEnd-r)/1e3):t.text,s=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=u`<div class="inline-line">${s??m}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:u`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSettingsRow(t){let i=this.host(),a=this.records.find(c=>c.id===this.selectedId),r=this.selectedOwner,o=[a?`Revision ${a.revision}`:"Not saved yet",r?Na(r):void 0].filter(Boolean).join(" \xB7 "),s=t.values,l=new je(this.buildContext(),this.draft?.config),d=me(i);return u`<div class="strip-row" style=${`--c:${X.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${z("watch")}</span>Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?u`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?u`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:u`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:m}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${ks(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?u`<button class="small" @click=${()=>{let c=Ss();this.mutate(p=>{p.values.push(c)}),this.inspect={kind:"data",id:c.id}}}>Add</button>`:m}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${s.length===0?u`<p class="empty">No shared values yet.</p>`:u`<div class="data">
        ${s.map(c=>{let p=l.resolve({kind:{kind:"named",id:c.id}}),h=this.inspect.kind==="data"&&this.inspect.id===c.id;return u`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:c.id}}}>
            <span class="name">${c.name||"(unnamed)"}</span>
            <span class="meta ${p===void 0?"none":""}" title=${ge(c.value,d)}>${p??"unresolved"}</span>
            ${this.canEdit?u`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${f=>{f.stopPropagation(),this.mutate(g=>{g.values=g.values.filter(w=>w.id!==c.id)}),h&&(this.inspect={kind:"general"})}}>${z("delete")}</button>`:m}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(t,i){let a=t.supportedFamilies;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${X.place}`}><span class="swatch">${z("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${Ot.map(r=>{if(!a.includes(r))return u`<button class="tile off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${U(r)} shape`} @click=${()=>this.addShape(r)}>
              <span class="art"><span class="ghost ${r}"></span></span>
              <span class="lbl">+ Add ${U(r)}</span>
            </button>`;let s=r===this.activeFamily,l;if(r==="inline")l=this.renderInlinePreview(i.inline,!0);else{let p=i[r];l=p?ca(p,{icons:this.icons,imageSizes:this.imageSizes,slot:dn.slots[r]}):m}let d=r!=="inline"&&t.elements.every(p=>fe(t,r,p).isHidden||p.payload.isHidden)&&t.elements.length>0,c=this.canEdit&&Un(t,r);return u`<div class="tile-wrap">
            <button class="tile ${r}" aria-pressed=${s?"true":"false"} title=${`Edit the ${U(r)} shape`}
              @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${l}</span>
              <span class="lbl">${U(r)}${d?u`<small>· nothing shown</small>`:m}${s?u`<small>· editing</small>`:m}</span>
            </button>
            ${this.canEdit?u`<button class="icon danger tile-x" ?disabled=${!c}
              title=${c?`Remove the ${U(r)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${U(r)} shape`}
              @click=${p=>{p.stopPropagation(),this.removeShape(r)}}>${z("delete")}</button>`:m}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let t=this.draft?.config;if(!t)return m;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${X.states}`}><span class="swatch">${z("states")}</span>Values on the watch<span class="spacer"></span>
        ${a?u`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:m}
      </h2>
      ${i.length===0?u`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:u`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],s=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,l=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${l}`:"not in Home Assistant",c=this.testValues.get(r),h=t.elements.find(g=>zn(t,g.payload.id).some(w=>w.ref.entityId===r))?.kind??"text",f=this.editingValue===r;return u`<button class="vchip ${c!==void 0?"testing":""}" style=${`--k:${re[h]}`}
            title=${c!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${g=>{g.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${z(h)}</span><b>${s}</b>
            ${f?u`<input type="text" .value=${c??o?.state??""} aria-label=${`Test value for ${s}`}
                  @keydown=${g=>{g.key==="Enter"&&g.target.blur(),g.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${g=>this.commitTestValue(r,g.target.value)} />`:u`<span class="val">${c!==void 0?`${c}${l}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(t,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[t]?.state;a===""||a===o?r.delete(t):r.set(t,a),this.testValues=r}currentCase(){return ln.find(t=>t.label===this.previewCase)??dn}previewSlot(t){return this.currentCase().slots[t]}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":U(this.activeFamily),s=a.kind==="family"&&i===void 0?u`<span class="here" style=${`--k:${X.place}`}>${o} shape</span>`:u`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=m,d=m;if(i!==void 0)l=u`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let c=t.elements.find(p=>p.payload.id===a.id);if(c){l=u`<span class="here" style=${`--k:${re[c.kind]}`}><span class="kchip">${Nt[c.kind]}</span>${Te(c,me(this.host()))}</span>`;let p=Ue(t,c.payload.id);p&&(d=u`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:p.id}}} title="Edit the group">${p.name}</button>`)}}else if(a.kind==="group"){let c=t.groups?.find(p=>p.id===a.id);c&&(l=u`<span class="here" style=${`--k:${X.group}`}><span class="kchip">Group</span>${c.name}</span>`)}else if(a.kind==="data"){let c=t.values.find(p=>p.id===a.id);c&&(l=u`<span class="here" style=${`--k:${X.complication}`}><span class="kchip">Value</span>${c.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(l=u`<span class="mini">nothing selected</span>`);return u`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${s}${d}
      ${l===m?m:u`<span class="sep">›</span>${l}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let t=this.draft?.config;if(!t)return m;let i=this.pickedElements(t);if(i.length>=2)return u`
        <div class="insp-head">${this.crumbs(t,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(t,i)}</div>`;let a=this.host(),r=this.inspect,o=m,s=!0;if(r.kind==="layer"){let d=t.elements.find(c=>c.payload.id===r.id);if(!d)return this.inspect={kind:"general"},m;o=Rs(a,d,this.canvasFamily)}else if(r.kind==="group"){let d=t.groups?.find(c=>c.id===r.id);if(!d)return this.inspect={kind:"general"},m;s=!1,o=Is(a,d)}else if(r.kind==="data"){let d=t.values.find(c=>c.id===r.id);if(!d)return this.inspect={kind:"general"},m;s=!1,o=u`<div class="sec" data-open="true" style=${`--c:${X.complication}`}>
        <div class="sec-h"><span class="swatch">${z("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${Cs(a,d)}</div>
      </div>`}else r.kind==="family"?o=As(a,this.activeFamily):(s=!1,o=u`<div class="empty-insp">${z("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let l=this.openSections.size>1;return u`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${s?u`<button class="expand" @click=${()=>{this.openSections=l?new Set([Ep(r)]):new Set(Ta)}}>${l?"One at a time":"Open all"}</button>`:m}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(t,i,a){return u`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${t}${i==="mixed"?u` <span class="mixed">(mixed)</span>`:m}</span></label>`}multiEditor(t,i){let a=this.canvasFamily,r=me(this.host()),o=new je(this.buildContext(),this.draft?.config),s=Fs(t,a,i),l=i.length,d=[...i].reverse(),c=h=>this.mutate(f=>{for(let g of i)we(f,a,g.payload.id,{isHidden:h})}),p=h=>this.mutate(f=>{for(let g of i){let w=f.elements.find(k=>k.payload.id===g.payload.id);w&&w.kind!=="image"&&w.kind!=="tap"&&(w.payload.colorSlot.baseColorHex=h)}},"multi-colour");return u`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${z("layers")}</span>
          <span class="tt"><h4>${l} layers picked</h4><span class="sum">Edits here land on all ${l}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(h=>u`<div class="row" style=${`--k:${re[h.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${h.kind==="icon"?u`<span class="glyph">${this.icons.render(o.resolve(h.payload.symbol)??"questionmark",16,h.payload.colorSlot.baseColorHex)??m}</span>`:m}
                <b>${Te(h,r)}</b><span class="kind">${Nt[h.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${fn}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" title=${`Group (${Oe}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${X.place}`}>
        <div class="sec-h"><span class="swatch">${z("place")}</span>
          <span class="tt"><h4>All ${l} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${U(a)}`,s.hiddenHere,c)}
          ${s.colourable?u`${pe("Colour",s.colour,h=>{h!==void 0&&p(h)})}
              ${s.colour===void 0?u`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:m}`:u`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Hiding, like size and place, belongs to the ${U(a)} shape alone.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let t=this.draft;if(!t)return m;let i=this.records.find(r=>r.id===this.selectedId),a=To({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return u`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${t.dirty?u` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?u`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:m}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?u`<pre>${JSON.stringify(t.encoded(),null,2)}</pre>`:m}
      </div>
    </details>`}};A([Rt({attribute:!1})],I.prototype,"hass",2),A([Rt({type:Boolean})],I.prototype,"narrow",2),A([Rt({attribute:!1})],I.prototype,"panel",2),A([H()],I.prototype,"colLeft",2),A([H()],I.prototype,"colRight",2),A([H()],I.prototype,"panelWidth",2),A([H()],I.prototype,"owners",2),A([H()],I.prototype,"ownerId",2),A([H()],I.prototype,"records",2),A([H()],I.prototype,"selectedId",2),A([H()],I.prototype,"draft",2),A([H()],I.prototype,"readOnlyReason",2),A([H()],I.prototype,"parseError",2),A([H()],I.prototype,"maxSchemaVersion",2),A([H()],I.prototype,"presets",2),A([H()],I.prototype,"occupied",2),A([H()],I.prototype,"serverToken",2),A([H()],I.prototype,"appliedToken",2),A([H()],I.prototype,"polling",2),A([H()],I.prototype,"sendPending",2),A([H()],I.prototype,"pages",2),A([H()],I.prototype,"templateResults",2),A([H()],I.prototype,"historySeries",2),A([H()],I.prototype,"templateError",2),A([H()],I.prototype,"templateFetchedAt",2),A([H()],I.prototype,"forced",2),A([H()],I.prototype,"showRaw",2),A([H()],I.prototype,"inspect",2),A([H()],I.prototype,"openSections",2),A([H()],I.prototype,"pickerOpen",2),A([H()],I.prototype,"testValues",2),A([H()],I.prototype,"editingValue",2),A([H()],I.prototype,"thumbStep",2),A([H()],I.prototype,"layerDetail",2),A([H()],I.prototype,"addOpen",2),A([H()],I.prototype,"addDetail",2),A([H()],I.prototype,"multi",2),A([H()],I.prototype,"collapsed",2),A([H()],I.prototype,"activeFamily",2),A([H()],I.prototype,"picking",2),A([H()],I.prototype,"pickHoverId",2),A([H()],I.prototype,"listHoverIds",2),A([H()],I.prototype,"zoomed",2),A([H()],I.prototype,"helpOpen",2),A([H()],I.prototype,"showTaps",2),A([H()],I.prototype,"timestampActiveId",2),A([H()],I.prototype,"savedName",2),A([H()],I.prototype,"presetKind",2),A([H()],I.prototype,"presetEntity",2),A([H()],I.prototype,"newShapeChooser",2),A([H()],I.prototype,"previewCase",2),A([H()],I.prototype,"loadError",2),A([H()],I.prototype,"saveError",2),A([H()],I.prototype,"saving",2),A([H()],I.prototype,"conflict",2),A([H()],I.prototype,"remoteRevision",2),A([H()],I.prototype,"confirmDelete",2),A([H()],I.prototype,"moveTarget",2),A([H()],I.prototype,"moving",2),A([H()],I.prototype,"moveError",2),A([H()],I.prototype,"version",2);var Da=I;function it(e){return String(e?.message??e)}function Lp(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function Na(e){let n=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function zp(e,n,t,i){let a=de[n],r=i.frame,o=d=>Math.round(d),s=[{label:"Shows",value:Ma(e,t)}],l=oi(t);return l&&s.push({label:"Looks",value:l}),s.push({label:"At",value:`${o(r.x*a.width)}, ${o(r.y*a.height)} pt`}),s.push({label:"Size",value:`${o(r.width*a.width)} x ${o(r.height*a.height)} pt`}),r.rotationDegrees!==0&&s.push({label:"Turned",value:`${Math.round(r.rotationDegrees)}\xB0`}),i.fromPlacement&&s.push({label:"Frame",value:`${U(n)} only`}),s}function _p(e,n,t,i){let a=r=>u`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return u`${a(n.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${Me(e.payload.colorSlot.baseColorHex)}`;case"gauge":return u`${a(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=ut(e.payload),o=r!==void 0?t.get(r)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${sn(o).length} values`}case"shape":return`${Me(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return Ge(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",Da);export{Da as WristAssistantPanel,el as columnFit,zp as layerFacts};
