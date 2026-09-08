var Bd=Object.defineProperty;var Gd=Object.getOwnPropertyDescriptor;var H=(e,n,t,i)=>{for(var a=i>1?void 0:i?Gd(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&Bd(n,t,a),a};var ni=globalThis,ii=ni.ShadowRoot&&(ni.ShadyCSS===void 0||ni.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,oa=Symbol(),Yr=new WeakMap,yn=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==oa)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(ii&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=Yr.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&Yr.set(t,n))}return n}toString(){return this.cssText}},ce=e=>new yn(typeof e=="string"?e:e+"",void 0,oa),sa=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new yn(t,e,oa)},Xr=(e,n)=>{if(ii)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=ni.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},la=ii?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return ce(t)})(e):e;var{is:Ud,defineProperty:Kd,getOwnPropertyDescriptor:Wd,getOwnPropertyNames:qd,getOwnPropertySymbols:jd,getPrototypeOf:Yd}=Object,ai=globalThis,Jr=ai.trustedTypes,Xd=Jr?Jr.emptyScript:"",Jd=ai.reactiveElementPolyfillSupport,bn=(e,n)=>e,vn={toAttribute(e,n){switch(n){case Boolean:e=e?Xd:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},ri=(e,n)=>!Ud(e,n),Zr={attribute:!0,type:String,converter:vn,reflect:!1,useDefault:!1,hasChanged:ri};Symbol.metadata??=Symbol("metadata"),ai.litPropertyMetadata??=new WeakMap;var qe=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=Zr){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&Kd(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=Wd(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(n,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Zr}static _$Ei(){if(this.hasOwnProperty(bn("elementProperties")))return;let n=Yd(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(bn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bn("properties"))){let t=this.properties,i=[...qd(t),...jd(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(la(a))}else n!==void 0&&t.push(la(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Xr(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:vn).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:vn;this._$Em=a;let s=o.fromAttribute(t,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??ri)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};qe.elementStyles=[],qe.shadowRootOptions={mode:"open"},qe[bn("elementProperties")]=new Map,qe[bn("finalized")]=new Map,Jd?.({ReactiveElement:qe}),(ai.reactiveElementVersions??=[]).push("2.1.2");var fa=globalThis,Qr=e=>e,oi=fa.trustedTypes,eo=oi?oi.createPolicy("lit-html",{createHTML:e=>e}):void 0,oo="$lit$",lt=`lit$${Math.random().toFixed(9).slice(2)}$`,so="?"+lt,Zd=`<${so}>`,Rt=document,xn=()=>Rt.createComment(""),kn=e=>e===null||typeof e!="object"&&typeof e!="function",ga=Array.isArray,Qd=e=>ga(e)||typeof e?.[Symbol.iterator]=="function",da=`[ 	
\f\r]`,wn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,to=/-->/g,no=/>/g,Ft=RegExp(`>|${da}(?:([^\\s"'>=/]+)(${da}*=${da}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),io=/'/g,ao=/"/g,lo=/^(?:script|style|textarea|title)$/i,ya=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),p=ya(1),b=ya(2),Tm=ya(3),It=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),ro=new WeakMap,Mt=Rt.createTreeWalker(Rt,129);function co(e,n){if(!ga(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return eo!==void 0?eo.createHTML(n):n}var ec=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=wn;for(let s=0;s<t;s++){let l=e[s],d,u,c=-1,h=0;for(;h<l.length&&(o.lastIndex=h,u=o.exec(l),u!==null);)h=o.lastIndex,o===wn?u[1]==="!--"?o=to:u[1]!==void 0?o=no:u[2]!==void 0?(lo.test(u[2])&&(a=RegExp("</"+u[2],"g")),o=Ft):u[3]!==void 0&&(o=Ft):o===Ft?u[0]===">"?(o=a??wn,c=-1):u[1]===void 0?c=-2:(c=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?Ft:u[3]==='"'?ao:io):o===ao||o===io?o=Ft:o===to||o===no?o=wn:(o=Ft,a=void 0);let m=o===Ft&&e[s+1].startsWith("/>")?" ":"";r+=o===wn?l+Zd:c>=0?(i.push(d),l.slice(0,c)+oo+l.slice(c)+lt+m):l+lt+(c===-2?s:m)}return[co(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},$n=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,s=n.length-1,l=this.parts,[d,u]=ec(n,t);if(this.el=e.createElement(d,i),Mt.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(a=Mt.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let c of a.getAttributeNames())if(c.endsWith(oo)){let h=u[o++],m=a.getAttribute(c).split(lt),g=/([.?@])?(.*)/.exec(h);l.push({type:1,index:r,name:g[2],strings:m,ctor:g[1]==="."?ua:g[1]==="?"?pa:g[1]==="@"?ha:Xt}),a.removeAttribute(c)}else c.startsWith(lt)&&(l.push({type:6,index:r}),a.removeAttribute(c));if(lo.test(a.tagName)){let c=a.textContent.split(lt),h=c.length-1;if(h>0){a.textContent=oi?oi.emptyScript:"";for(let m=0;m<h;m++)a.append(c[m],xn()),Mt.nextNode(),l.push({type:2,index:++r});a.append(c[h],xn())}}}else if(a.nodeType===8)if(a.data===so)l.push({type:2,index:r});else{let c=-1;for(;(c=a.data.indexOf(lt,c+1))!==-1;)l.push({type:7,index:r}),c+=lt.length-1}r++}}static createElement(n,t){let i=Rt.createElement("template");return i.innerHTML=n,i}};function Yt(e,n,t=e,i){if(n===It)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=kn(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=Yt(e,a._$AS(e,n.values),a,i)),n}var ca=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??Rt).importNode(t,!0);Mt.currentNode=a;let r=Mt.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new Cn(r,r.nextSibling,this,n):l.type===1?d=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(d=new ma(r,this,n)),this._$AV.push(d),l=i[++s]}o!==l?.index&&(r=Mt.nextNode(),o++)}return Mt.currentNode=Rt,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},Cn=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=Yt(this,n,t),kn(n)?n===f||n==null||n===""?(this._$AH!==f&&this._$AR(),this._$AH=f):n!==this._$AH&&n!==It&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Qd(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==f&&kn(this._$AH)?this._$AA.nextSibling.data=n:this.T(Rt.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=$n.createElement(co(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new ca(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=ro.get(n.strings);return t===void 0&&ro.set(n.strings,t=new $n(n)),t}k(n){ga(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(xn()),this.O(xn()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=Qr(n).nextSibling;Qr(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Xt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=Yt(this,n,t,0),o=!kn(n)||n!==this._$AH&&n!==It,o&&(this._$AH=n);else{let s=n,l,d;for(n=r[0],l=0;l<r.length-1;l++)d=Yt(this,s[i+l],t,l),d===It&&(d=this._$AH[l]),o||=!kn(d)||d!==this._$AH[l],d===f?n=f:n!==f&&(n+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!a&&this.j(n)}j(n){n===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},ua=class extends Xt{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===f?void 0:n}},pa=class extends Xt{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==f)}},ha=class extends Xt{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=Yt(this,n,t,0)??f)===It)return;let i=this._$AH,a=n===f&&i!==f||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==f&&(i===f||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},ma=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){Yt(this,n)}};var tc=fa.litHtmlPolyfillSupport;tc?.($n,Cn),(fa.litHtmlVersions??=[]).push("3.3.3");var uo=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new Cn(n.insertBefore(xn(),r),r,void 0,t??{})}return a._$AI(e),a};var ba=globalThis,dt=class extends qe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=uo(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return It}};dt._$litElement$=!0,dt.finalized=!0,ba.litElementHydrateSupport?.({LitElement:dt});var nc=ba.litElementPolyfillSupport;nc?.({LitElement:dt});(ba.litElementVersions??=[]).push("4.2.2");var ic={attribute:!0,type:String,converter:vn,reflect:!1,hasChanged:ri},ac=(e=ic,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(s){let l=n.get.call(this);n.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=t;return function(s){let l=this[o];n.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function Jt(e){return(n,t)=>typeof t=="object"?ac(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function L(e){return Jt({...e,state:!0,attribute:!1})}var _e="wrist_assistant/complications";async function po(e){return e.connection.sendMessagePromise({type:`${_e}/owners`})}async function ho(e,n){return e.connection.sendMessagePromise({type:`${_e}/list`,owner_watch_id:n})}async function mo(e,n){return e.connection.sendMessagePromise({type:`${_e}/nudge`,owner_watch_id:n})}async function fo(e,n){return e.connection.sendMessagePromise({type:`${_e}/watch_status`,owner_watch_id:n})}async function go(e,n,t,i){return e.connection.sendMessagePromise({type:`${_e}/save`,owner_watch_id:n,document:t,base_revision:i})}async function yo(e,n,t,i){return e.connection.sendMessagePromise({type:`${_e}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function bo(e,n,t){return e.connection.sendMessagePromise({type:`${_e}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function vo(e,n,t){let i={type:`${_e}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function wo(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${_e}/render_values`,templates:n})).results}async function xo(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${_e}/history_series`,requests:n})).results}async function ko(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${_e}/statistics_series`,requests:n})).results}var te=["rectangular","circular","corner"],he={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},rc=["rectangular","circular","corner","inline"];var xa=64;function _o(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<xa;i++)if(!t.has(i))return i;return-1}function In(e){return te.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var oc=[["history","Recorded history"],["statistics","Long-term statistics"]],ci=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],ka=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],$a="history",An="hour",Hn="mean",Zt=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],je={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},Fe={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},Qt="#FFFFFF",ui=24,Ln="#FF6B35",_n="#32D74B",Ca="#32D74B",ht="#FF453A",en="#FF453A",tn="#FFFFFF99";function Nn(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function No(e){return e.coloring==="bands"&&e.bands.length>0}function Sa(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function Ea(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}function zo(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var Ht=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],pi=360,hi=10080,zn=[...Ht,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],Ta=366*24*60,Fa=2,Pn=120,Ma=0;function Ra(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?n<1?Ma:Math.max(Fa,Math.min(Pn,n)):24}function mi(e){return Aa(e)!==void 0?!0:Ia(e)!==void 0&&Ra(e)>0}function Ia(e){if(e.source==="history")return Po(e)}function Aa(e){if(e.source==="statistics")return Po(e)}function Po(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Lt(e){let n=Ia(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${Ra(e)}`}function _t(e){let n=Aa(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}`}function Oo(e){return[...Ha(e).map(t=>t.key),...La(e).map(t=>t.key)].sort().join(";")}function Ha(e){let n=new Map,t=i=>{n.has(i.key)||n.set(i.key,i)};for(let i of e.elements)if(i.kind==="chart"){let a=Lt(i.payload),r=Ia(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:Math.round(i.payload.historyMinutes),points:Ra(i.payload),mode:"numeric"})}else if(i.kind==="timeline"){let a=bt(i.payload),r=Uo(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:Be(i.payload),points:yt,mode:"states"})}return[...n.values()]}function La(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=_t(t.payload),a=Aa(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),period:t.payload.statPeriod,type:t.payload.statType})}return[...n.values()]}var Do=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],Vo=[["auto","Auto"],["always","Always"],["never","Never"]];function $o(e){return e==="h12"||e==="h24"?e:Mn}function Co(e){return e==="always"||e==="never"?e:Rn}function sc(e){return e.timeLabelCount!==void 0?On(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:Fn}function On(e){let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.min(Dn,Math.round(n))):Fn}function _a(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(n,t)=>t/(e-1))}var gt="#8E8E93",Bo=1,lc="#000000",dc=2,cc=1440,Na=60,Fn=0,mt=9,ft="#8E8E93",Mn="auto",Rn="auto",uc=4,Dn=12,Vn=1,Bn=20,fi=4,yt=120;function Go(e,n,t){let i=e.trim().toLowerCase();for(let a of n)if(a.match.trim().toLowerCase()===i)return a.colorHex;return t}function Be(e){let n=Math.round(e.historyMinutes);return Number.isFinite(n)?Math.max(1,Math.min(hi,n)):Na}function Uo(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function bt(e){let n=Uo(e);if(n!==void 0)return`${n}|${Be(e)}|${yt}|states`}var pc={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},za={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function li(e){return pc[e.trim().toLowerCase()]??gt}var hc=["door","garage_door","window","opening"];function Pa(e,n){let t=(n??"").trim().toLowerCase(),i=e==="binary_sensor"&&hc.includes(t),a=o=>li(i&&o==="on"?"open":o);return[...za[e]??[],"unavailable","unknown"].map(o=>({id:X(),match:o,colorHex:a(o)}))}var nn=6,an=9,mc=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Ye(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Oa(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var Da={top:0,left:0,bottom:0,right:0};function gi(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var fc=["toggleEntity","runScene","runScript","addTodo","runHTTPAction"];function Ko(e){return fc.includes(e)}function Wo(e){let n=(e??"").trim();if(n==="")return!0;try{let t=JSON.parse(n);return typeof t=="object"&&t!==null&&!Array.isArray(t)}catch{return!1}}var Va=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"],["callService","Call a service"]];function Xe(e){let n=Va.find(([i])=>i===e.type)?.[1]??e.type;if(e.type==="callService"){let i=[e.serviceDomain,e.serviceName].filter(a=>a!=="").join(".");return i===""?n:`${n}: ${i}`}if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function M(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function K(e,n=""){return typeof e=="string"?e:n}function W(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function Oe(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Tn(e){return e==null?void 0:W(e,0)}function le(e){return typeof e=="string"?e:void 0}function va(e,n,t){return n.some(([i])=>i===e)?e:t}var De=class extends Error{};function ut(e){if(typeof e.entityId!="string")throw new De("entityId is required");let n={entityId:e.entityId,displayName:K(e.displayName),domain:K(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function So(e){if(!M(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=W(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=W(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=W(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),e.duration===!0&&(n.duration=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),Ge(n)?void 0:n}function Ge(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.textCase===void 0:!0}function gc(e){let n=K(e.function,"count"),t=M(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(M).map(ut)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(M(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:K(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Eo(e){switch(e.kind){case"literal":return{kind:"literal",value:K(e.value)};case"entityState":return{kind:"entityState",...ut(e)};case"entityAttribute":return{kind:"entityAttribute",...ut(e),attribute:K(e.attribute)};case"entityAge":return{kind:"entityAge",...ut(e)};case"aggregate":return{kind:"aggregate",aggregate:gc(M(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:le(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:K(e.value)};case"named":return{kind:"named",id:K(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:K(e.layer).toUpperCase(),stat:Zt.some(([n])=>n===e.stat)?e.stat:"latest"};default:throw new De(`unknown value kind ${String(e.kind)}`)}}function ue(e){if(!M(e))throw new De("value must be an object");if(M(e.kind)){let i={kind:Eo(e.kind)},a=So(e.format);return a&&(i.format=a),i}let n={kind:Eo(e)},t=So(e.format);return t&&(n.format=t),n}function qo(e){return M(e)?{x:W(e.x,.25),y:W(e.y,.25),width:W(e.width,.5),height:W(e.height,.5),rotationDegrees:W(e.rotationDegrees,0)}:{...je}}function yc(e){if(!M(e))return{kind:"isOn"};let n=K(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=M(e.value)?ue(e.value):F("");break;case"between":case"timeBetween":t.value=M(e.value)?ue(e.value):F(""),t.upper=M(e.upper)?ue(e.upper):F("");break;case"matchesRegex":t.pattern=K(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function To(e){if(!M(e))return{kind:"show"};let n=K(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=M(e.value)?ue(e.value):F("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=W(e.number,0);break;case"setFontWeight":t.weight=le(e.weight)??"regular";break;default:break}return t}function jo(e){return Array.isArray(e)?e.filter(M).map(n=>{let t={id:K(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(M).map(i=>{let a=M(i.when)?i.when:{};return{id:K(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(M).map(r=>({id:K(r.id).toUpperCase(),value:M(r.value)?ue(r.value):F(""),comparison:yc(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(To)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(To)),t}):[]}function bc(e,n){return{baseColorHex:M(e)?K(e.baseColorHex,n):n}}function Yo(e){return Array.isArray(e)?e.filter(M).map(n=>({id:K(n.id,X()),upTo:W(n.upTo,0),colorHex:K(n.colorHex,"#FFFFFF")})):[]}function vc(e){if(Array.isArray(e.bands))return Yo(e.bands);if(typeof e.bandLowerBound!="number")return[];let n=M(e.colorSlot)?K(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:X(),upTo:e.bandLowerBound,colorHex:K(e.bandLowColorHex,Ca)},{id:X(),upTo:W(e.bandUpperBound,100),colorHex:n}]}function wc(e){return Array.isArray(e)?e.filter(M).map(n=>({id:K(n.id,X()).toUpperCase(),match:K(n.match,""),colorHex:K(n.colorHex,gt)})):[]}function ct(e,n){if(typeof e.id!="string")throw new De("element id is required");return{id:e.id.toUpperCase(),colorSlot:bc(e.colorSlot,n),rules:jo(e.rules),frame:qo(e.frame),isHidden:e.isHidden===!0}}function xc(e){let n=kc(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),n}function kc(e){if(!M(e)||!M(e.payload))throw new De("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...ct(n,"#FFFFFF"),value:M(n.value)?ue(n.value):F(""),fontSize:W(n.fontSize,14),fontWeight:le(n.fontWeight)??"regular"};n.countdown===!0&&(t.countdown=!0),n.monospacedDigits===!0&&(t.monospacedDigits=!0);let i=typeof n.lineLimit=="number"?Math.round(n.lineLimit):1;Math.min(2,Math.max(1,i))===2&&(t.lineLimit=2);let a=le(n.alignment);return(a==="leading"||a==="trailing")&&(t.alignment=a),{kind:"text",payload:t}}case"icon":{let t={...ct(n,"#FFFFFF"),symbol:M(n.symbol)?ue(n.symbol):F("lightbulb"),size:W(n.size,14)},i=le(n.path);return i!==void 0&&i!==""&&(t.path=i),{kind:"icon",payload:t}}case"gauge":{let t={...ct(n,"#FFFFFF"),value:M(n.value)?ue(n.value):F("50"),minValue:W(n.minValue,0),maxValue:W(n.maxValue,100),style:le(n.style)??"arc",lineWidth:W(n.lineWidth,4),trackColorHex:K(n.trackColorHex,"#FFFFFF40"),coloring:le(n.coloring)??"uniform",bands:Yo(n.bands),bandAboveColorHex:K(n.bandAboveColorHex,ht),thresholdColorHex:K(n.thresholdColorHex,Qt)},i=Tn(n.thresholdValue);return i!==void 0&&(t.thresholdValue=i),M(n.total)&&(t.total=ue(n.total)),{kind:"gauge",payload:t}}case"chart":return{kind:"chart",payload:{...ct(n,"#FFFFFF"),value:M(n.value)?ue(n.value):F("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(W(n.historyMinutes,0))),historyPoints:Math.round(W(n.historyPoints,24)),source:va(le(n.source),oc,$a),statPeriod:va(le(n.statPeriod),ci,An),statType:va(le(n.statType),ka,Hn),style:le(n.style)??"bars",limit:Math.max(0,Math.round(W(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:le(n.scale)??"auto",minValue:W(n.minValue,0),maxValue:W(n.maxValue,100),baseline:le(n.baseline)??"lowest",barGap:W(n.barGap,1.5),lineWidth:W(n.lineWidth,2),highlight:le(n.highlight)??"none",highColorHex:K(n.highColorHex,Ln),lowColorHex:K(n.lowColorHex,_n),marker:le(n.marker)??"pointer",coloring:le(n.coloring)??"uniform",bands:vc(n),bandAboveColorHex:K(n.bandHighColorHex,K(n.bandAboveColorHex,ht)),fillBands:n.fillBands===!0,...typeof n.thresholdValue=="number"&&Number.isFinite(n.thresholdValue)?{thresholdValue:n.thresholdValue}:{},thresholdColorHex:K(n.thresholdColorHex,en),...M(n.nowIndex)?{nowIndex:ue(n.nowIndex)}:{},nowColorHex:K(n.nowColorHex,tn),...le(n.scaleFrom)!==void 0?{scaleFrom:le(n.scaleFrom)}:{},timeLabelCount:On(n.timeLabelCount),labelSize:W(n.labelSize,mt),labelColorHex:K(n.labelColorHex,ft),labelsAbove:n.labelsAbove===!0,hourCycle:$o(n.hourCycle),minutes:Co(n.minutes)}};case"timeline":{let{colorSlot:t,...i}=ct(n,"#FFFFFF");return{kind:"timeline",payload:{...i,value:M(n.value)?ue(n.value):F(""),historyMinutes:Math.max(1,Math.round(W(n.historyMinutes,Na))),bands:wc(n.bands),otherColorHex:K(n.otherColorHex,gt),gap:Math.min(fi,Math.max(0,W(n.gap,0))),cornerRadius:Math.max(0,W(n.cornerRadius,Bo)),timeLabelCount:sc(n),labelSize:W(n.labelSize,mt),labelColorHex:K(n.labelColorHex,ft),labelsAbove:n.labelsAbove===!0,hourCycle:$o(n.hourCycle),minutes:Co(n.minutes)}}}case"shape":{let t={...ct(n,"#FFFFFF33"),kind:le(n.kind)??"roundedRectangle",cornerRadius:W(n.cornerRadius,6),thickness:W(n.thickness,1),borderWidth:W(n.borderWidth,1)};return typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=ct(n,"#FFFFFF"),a={...i,entity:ut(M(n.entity)?n.entity:{}),source:n.source==="entityPicture"?"entityPicture":"camera",contentMode:n.contentMode==="fit"?"fit":"fill",zoom:W(n.zoom,1),panX:W(n.panX,0),panY:W(n.panY,0),cornerRadius:W(n.cornerRadius,nn),timestampCorner:mc.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:W(n.timestampSize,an)};n.timestamp===!0&&(a.timestamp=!0);let r=Tn(n.timestampX),o=Tn(n.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=Oe(r),a.timestampY=Oe(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=ct(n,"#FFFFFF"),a={...i,action:M(n.action)?Xo(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new De(`unknown element kind ${String(e.kind)}`)}}function Fo(e){let n=M(e)?e:{},t={};if(M(n.placements))for(let[a,r]of Object.entries(n.placements)){if(!M(r))continue;let o={frame:qo(r.frame),isHidden:r.isHidden===!0},s=Tn(r.size);s!==void 0&&(o.size=s),t[a.toUpperCase()]=o}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:W(n.borderWidth,2),rules:jo(n.rules)};if(M(n.bezelText)&&(i.bezelText=ue(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),M(n.curvedText)&&(i.curvedText=ue(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),M(n.bezelGauge)){let a=n.bezelGauge,r={value:M(a.value)?ue(a.value):F("50"),minValue:W(a.minValue,0),maxValue:W(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};M(a.minLabel)&&(r.minLabel=ue(a.minLabel)),M(a.maxLabel)&&(r.maxLabel=ue(a.maxLabel)),i.bezelGauge=r}return typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function $c(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=Fo(e[t+1]))}else if(M(e))for(let[t,i]of Object.entries(e))n[t]=Fo(i);return n}function Cc(e){let n={value:M(e.value)?ue(e.value):F("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function Xo(e){if(!M(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...ut(e)};case"callService":{let n={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(n.target=ut(e)),n}default:return{type:"none"}}}function yi(e){if(!M(e))throw new De("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new De(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(M).map(r=>({id:K(r.id).toUpperCase(),name:K(r.name),value:M(r.value)?ue(r.value):F("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(M).map(r=>r.kind==="template"?{kind:"template",value:K(r.value)}:r.kind==="entity"?{kind:"entity",...ut(r)}:null).filter(r=>r!==null),i={schemaVersion:W(e.schemaVersion,1),id:K(e.id).toUpperCase(),name:K(e.name,"Custom"),values:n,slotIndex:W(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(xc),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:$c(e.perFamily),dataSources:t,tapAction:Xo(e.tapAction)};M(e.inline)&&(i.inline=Cc(e.inline));let a=Tn(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(M).filter(o=>typeof o.id=="string").map(o=>({id:K(o.id).toUpperCase(),name:K(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return Ec(i,Array.isArray(e.elements)?e.elements:[]),Ne(i),i}function Ba(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function Nt(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function Sc(e,n){let t=di(e,Un(n))?.ref;return t?.displayName||t?.entityId||"Chart"}function Jo(e,n,t){let i=Je(e,n.payload.id);if(i){Ua(e,t,i.id);return}let a=Ga(e,[n.payload.id,t],Sc(e,n)),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var Zo={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function Qo(e,n,t,i){let a=he.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),s=e.x+n.x*e.width-n.x*r,l=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function es(e,n,t){let i=e.elements.find(d=>d.payload.id===n);if(!i||i.kind!=="chart")return;let a=Ve("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};(t==="latest"||t==="delta"||t==="sum")&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"};let s=t==="trend"?2:o.format?.useEntityUnit?7:4;a.payload.frame=Qo(i.payload.frame,Zo[t],r,s);let l=e.elements.findIndex(d=>d.payload.id===n);return e.elements.splice(l+1,0,a),Jo(e,i,a.payload.id),a.payload.id}function Ec(e,n){for(let t of n){if(!M(t)||t.kind!=="chart"||!M(t.payload))continue;let i=t.payload,a=K(i.id).toUpperCase(),r=e.elements.find(h=>h.payload.id===a);if(!r||r.kind!=="chart")continue;let o=K(i.scaleLabelColorHex,"#FFFFFF99"),s=h=>{let m=M(h)?h:{};return{fontSize:W(m.fontSize,8),colorHex:K(m.colorHex,o),pillColorHex:typeof m.pillColorHex=="string"?m.pillColorHex:void 0}},l=[],d=le(i.scaleLabels);(d==="top"||d==="range")&&l.push(["top",s(i.topLabelStyle)]),d==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let u=le(i.latestLabel);if((u==="corner"||u==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let c=e.elements.findIndex(h=>h.payload.id===a)+1;for(let[h,m]of l){let g=Qo(r.payload.frame,Zo[h],m.fontSize,h==="latest"?5:4),v=[];if(m.pillColorHex!==void 0){let S=Ve("shape");S.payload.kind="capsule",S.payload.colorSlot={baseColorHex:m.pillColorHex},S.payload.frame={...g},v.push(S)}let $=Ve("text");$.payload.value={kind:{kind:"chartStat",layer:a,stat:h}},$.payload.fontSize=m.fontSize,$.payload.fontWeight="medium",$.payload.colorSlot={baseColorHex:m.colorHex},$.payload.frame=g,v.push($),e.elements.splice(c,0,...v),c+=v.length;for(let S of v)Jo(e,r,S.payload.id)}}}function j(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function pt(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Tc(e){let n={};return e.decimals!==void 0&&(n.decimals=j(e.decimals)),e.multiply!==void 0&&(n.multiply=j(e.multiply)),e.offset!==void 0&&(n.offset=j(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.duration&&(n.duration=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function Fc(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(pt)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function Mc(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...pt(e)};case"entityAttribute":return{kind:"entityAttribute",...pt(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...pt(e)};case"aggregate":return{kind:"aggregate",aggregate:Fc(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function oe(e){let n={kind:Mc(e.kind)};return Ge(e.format)||(n.format=Tc(e.format)),n}function Sn(e){return{x:j(e.x),y:j(e.y),width:j(e.width),height:j(e.height),rotationDegrees:j(e.rotationDegrees)}}function Rc(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=oe(e.value??F(""));break;case"between":case"timeBetween":n.value=oe(e.value??F("")),n.upper=oe(e.upper??F(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function Mo(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=oe(e.value??F(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=j(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;default:break}return n}function En(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:oe(a.value),comparison:Rc(a.comparison)}))},then:i.then.map(Mo)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(Mo)),t})}function Ic(e){let n=Ac(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),n}function Ac(e){let n=t=>({id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:En(t.rules),frame:Sn(t.frame),isHidden:t.isHidden});switch(e.kind){case"text":{let t={...n(e.payload),value:oe(e.payload.value),fontSize:j(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(t.countdown=!0),e.payload.monospacedDigits===!0&&(t.monospacedDigits=!0),e.payload.lineLimit===2&&(t.lineLimit=2),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(t.alignment=e.payload.alignment),{kind:"text",payload:t}}case"icon":{let t={...n(e.payload),symbol:oe(e.payload.symbol)};return e.payload.path!==void 0&&e.payload.path!==""&&(t.path=e.payload.path),t.size=j(e.payload.size),{kind:"icon",payload:t}}case"gauge":{let t=e.payload,i={...n(t),value:oe(t.value),minValue:j(t.minValue),maxValue:j(t.maxValue),style:t.style,lineWidth:j(t.lineWidth),trackColorHex:t.trackColorHex};return t.coloring!=="uniform"&&(i.coloring=t.coloring),t.bands.length>0&&(i.bands=t.bands.map(a=>({id:a.id,upTo:j(a.upTo),colorHex:a.colorHex}))),t.bandAboveColorHex!==ht&&(i.bandAboveColorHex=t.bandAboveColorHex),t.thresholdValue!==void 0&&(i.thresholdValue=j(t.thresholdValue)),t.thresholdColorHex!==Qt&&(i.thresholdColorHex=t.thresholdColorHex),t.total!==void 0&&(i.total=oe(t.total)),{kind:"gauge",payload:i}}case"chart":{let t=e.payload,i={...n(t),value:oe(t.value),historyMinutes:Math.max(0,Math.round(t.historyMinutes)),historyPoints:Math.round(t.historyPoints),style:t.style,limit:Math.max(0,Math.round(t.limit)),takeFromEnd:t.takeFromEnd,scale:t.scale,minValue:j(t.minValue),maxValue:j(t.maxValue),baseline:t.baseline,barGap:j(t.barGap),lineWidth:j(t.lineWidth),highlight:t.highlight,highColorHex:t.highColorHex,lowColorHex:t.lowColorHex,marker:t.marker,coloring:t.coloring,bands:t.bands.map(a=>({id:a.id,upTo:j(a.upTo),colorHex:a.colorHex})),bandAboveColorHex:t.bandAboveColorHex,fillBands:t.fillBands};return t.source!==$a&&(i.source=t.source),t.statPeriod!==An&&(i.statPeriod=t.statPeriod),t.statType!==Hn&&(i.statType=t.statType),t.thresholdValue!==void 0&&(i.thresholdValue=j(t.thresholdValue)),t.thresholdColorHex!==en&&(i.thresholdColorHex=t.thresholdColorHex),t.nowIndex!==void 0&&(i.nowIndex=oe(t.nowIndex)),t.nowColorHex!==tn&&(i.nowColorHex=t.nowColorHex),t.scaleFrom!==void 0&&(i.scaleFrom=t.scaleFrom),t.labelSize!==mt&&(i.labelSize=j(t.labelSize)),t.labelColorHex!==ft&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==Fn&&(i.timeLabelCount=On(t.timeLabelCount)),t.hourCycle!==Mn&&(i.hourCycle=t.hourCycle),t.minutes!==Rn&&(i.minutes=t.minutes),{kind:"chart",payload:i}}case"timeline":{let t=e.payload,i={id:t.id,rules:En(t.rules),frame:Sn(t.frame),isHidden:t.isHidden,value:oe(t.value)};return t.historyMinutes!==Na&&(i.historyMinutes=Math.max(1,Math.round(t.historyMinutes))),t.bands.length>0&&(i.bands=t.bands.map(a=>({id:a.id,match:a.match,colorHex:a.colorHex}))),t.otherColorHex!==gt&&(i.otherColorHex=t.otherColorHex),t.gap!==0&&(i.gap=j(t.gap)),t.cornerRadius!==Bo&&(i.cornerRadius=j(t.cornerRadius)),t.labelSize!==mt&&(i.labelSize=j(t.labelSize)),t.labelColorHex!==ft&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==Fn&&(i.timeLabelCount=Math.max(0,Math.min(Dn,Math.round(t.timeLabelCount)))),t.hourCycle!==Mn&&(i.hourCycle=t.hourCycle),t.minutes!==Rn&&(i.minutes=t.minutes),{kind:"timeline",payload:i}}case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:j(e.payload.cornerRadius),borderWidth:j(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(t.thickness=j(e.payload.thickness)),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id,entity:pt(t.entity),rules:En(t.rules),frame:Sn(t.frame),isHidden:t.isHidden};t.source!=="camera"&&(i.source=t.source),t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=j(t.zoom)),t.panX!==0&&(i.panX=j(t.panX)),t.panY!==0&&(i.panY=j(t.panY)),t.cornerRadius!==nn&&(i.cornerRadius=j(t.cornerRadius));let a=Ye(t),r=a?Oa(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==an&&(i.timestampSize=j(t.timestampSize)),a&&(i.timestampX=j(t.timestampX),i.timestampY=j(t.timestampY)),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:ts(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=En(t.rules),i.frame=Sn(t.frame),i.isHidden=t.isHidden,{kind:"tap",payload:i}}}}function Hc(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:Sn(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=j(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=oe(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=oe(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:oe(i.value),minValue:j(i.minValue),maxValue:j(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=oe(i.minLabel)),i.maxLabel&&(a.maxLabel=oe(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=j(e.borderWidth),e.rules.length>0&&(n.rules=En(e.rules)),n}function ts(e){if(e.type==="callService"){let n={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(n,pt(e.target)),n}return"entityId"in e?{type:e.type,...pt(e)}:{type:e.type}}function Lc(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=oe(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function bi(e){let n=[];for(let i of te){let a=e.perFamily[i];a&&n.push(i,Hc(a))}let t={schemaVersion:In(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:oe(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(Ic),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...pt(i)}),tapAction:ts(e.tapAction)};return e.inline!==void 0&&(t.inline=Lc(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),t}function Je(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function Ze(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!de(e,t))}function Ne(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function rn(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!de(e,r)),t=e.elements.filter(r=>de(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=n.filter(d=>d.payload.groupId===s);for(let d=l.length-1;d>=0;d--)i.unshift(l[d]),a.add(l[d].payload.id)}e.elements=[...i,...t],vt(e)}function Ga(e,n,t="Group"){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!de(e,r));if(i.length<2)return;let a={id:X(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return Ne(e),rn(e),a.id}function Gn(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;Ne(e)}function Ua(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||de(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,Ne(e),rn(e))}var Q={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","alignment"],icon:["symbol","path","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth"],image:["entity","source","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON"]},Ro={literal:["kind","value"],entityState:["kind",...Q.entityRef],entityAttribute:["kind",...Q.entityRef,"attribute"],entityAge:["kind",...Q.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function ns(e){let n=[],t=(l,d,u)=>{if(M(l))for(let c of Object.keys(l))d.includes(c)||n.push(`${u}.${c}`)},i=(l,d)=>{if(!M(l))return;let u=typeof l.kind=="string"?l.kind:"";t(l,Ro[u]??["kind"],d),u==="aggregate"&&M(l.aggregate)&&(t(l.aggregate,Q.aggregate,`${d}.aggregate`),t(l.aggregate.scope,Q.scope,`${d}.aggregate.scope`),M(l.aggregate.scope)&&Array.isArray(l.aggregate.scope.entities)&&l.aggregate.scope.entities.forEach((c,h)=>t(c,Q.entityRef,`${d}.aggregate.scope.entities[${h}]`)),t(l.aggregate.stateFilter,Q.stateFilter,`${d}.aggregate.stateFilter`))},a=(l,d)=>{if(M(l)){if(M(l.kind))t(l,Q.value,d),i(l.kind,`${d}.kind`);else{let u=typeof l.kind=="string"?l.kind:"";t(l,[...Ro[u]??["kind"],"format"],d),u==="aggregate"&&i(l,d)}t(l.format,Q.format,`${d}.format`)}},r=(l,d)=>{Array.isArray(l)&&l.forEach((u,c)=>{t(u,Q.styleChange,`${d}[${c}]`),M(u)&&a(u.value,`${d}[${c}].value`)})},o=(l,d)=>{Array.isArray(l)&&l.forEach((u,c)=>{let h=`${d}[${c}]`;t(u,Q.rule,h),M(u)&&(Array.isArray(u.cases)&&u.cases.forEach((m,g)=>{let v=`${h}.cases[${g}]`;t(m,Q.case,v),M(m)&&(t(m.when,Q.condition,`${v}.when`),M(m.when)&&Array.isArray(m.when.tests)&&m.when.tests.forEach(($,S)=>{let T=`${v}.when.tests[${S}]`;t($,Q.test,T),M($)&&(a($.value,`${T}.value`),t($.comparison,Q.comparison,`${T}.comparison`),M($.comparison)&&(a($.comparison.value,`${T}.comparison.value`),a($.comparison.upper,`${T}.comparison.upper`)))}),r(m.then,`${v}.then`))}),r(u.otherwise,`${h}.otherwise`))})};if(!M(e))return n;t(e,Q.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((l,d)=>t(l,Q.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((l,d)=>{t(l,Q.named,`$.values[${d}]`),M(l)&&a(l.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((l,d)=>{let u=`$.elements[${d}]`;if(t(l,Q.elementEnvelope,u),!M(l)||!M(l.payload))return;let c=typeof l.kind=="string"?l.kind:"",h=Q[c]??[];t(l.payload,[...Q.elementBase,...h],`${u}.payload`),t(l.payload.colorSlot,Q.colorSlot,`${u}.payload.colorSlot`),t(l.payload.frame,Q.frame,`${u}.payload.frame`),o(l.payload.rules,`${u}.payload.rules`);for(let m of["value","symbol","nowIndex","total"])m in l.payload&&a(l.payload[m],`${u}.payload.${m}`);c==="image"&&t(l.payload.entity,Q.entityRef,`${u}.payload.entity`),c==="tap"&&t(l.payload.action,Q.tapAction,`${u}.payload.action`)});let s=[];if(Array.isArray(e.perFamily))for(let l=0;l+1<e.perFamily.length;l+=2)s.push([String(e.perFamily[l]),e.perFamily[l+1]]);else M(e.perFamily)&&s.push(...Object.entries(e.perFamily));for(let[l,d]of s){let u=`$.perFamily.${l}`;if(t(d,Q.layout,u),!!M(d)){if(M(d.placements))for(let[c,h]of Object.entries(d.placements))t(h,Q.placement,`${u}.placements.${c}`),M(h)&&t(h.frame,Q.frame,`${u}.placements.${c}.frame`);if(a(d.bezelText,`${u}.bezelText`),a(d.curvedText,`${u}.curvedText`),M(d.bezelGauge)){let c=`${u}.bezelGauge`;t(d.bezelGauge,Q.bezelGauge,c),a(d.bezelGauge.value,`${c}.value`),a(d.bezelGauge.minLabel,`${c}.minLabel`),a(d.bezelGauge.maxLabel,`${c}.maxLabel`)}o(d.rules,`${u}.rules`)}}return M(e.inline)&&(t(e.inline,Q.inline,"$.inline"),a(e.inline.value,"$.inline.value")),t(e.tapAction,Q.tapAction,"$.tapAction"),n}function X(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function Qe(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function is(e,n,t=[...te]){let i={};for(let r of te)t.includes(r)&&(i[r]=Qe());let a={schemaVersion:4,id:X(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:rc.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:F("Text")}),a.schemaVersion=In(a),a}function Ve(e){let n=t=>({id:X(),colorSlot:{baseColorHex:t},rules:[],frame:{...je},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:F("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:F("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:F("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:ht,thresholdColorHex:Qt}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:F("13,14,16,17,19,22,24,28,30"),historyMinutes:pi,historyPoints:24,source:$a,statPeriod:An,statType:Hn,style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:Ln,lowColorHex:_n,marker:"pointer",coloring:"uniform",bands:[],bandAboveColorHex:ht,fillBands:!1,thresholdColorHex:en,nowColorHex:tn,timeLabelCount:Fn,labelSize:mt,labelColorHex:ft,labelsAbove:!1,hourCycle:Mn,minutes:Rn}};case"timeline":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,value:F(""),historyMinutes:cc,bands:[],otherColorHex:lc,gap:0,cornerRadius:dc,timeLabelCount:uc,labelSize:mt,labelColorHex:ft,labelsAbove:!1,hourCycle:Mn,minutes:Rn}}}case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:nn,timestampCorner:"topLeading",timestampSize:an}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function F(e){return{kind:{kind:"literal",value:e}}}function vi(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return}}var Io=["circular","corner"],Ao=Math.SQRT1_2;function _c(e){return e==="text"||e==="icon"?4:.5}function Ka(e,n,t,i){let a=structuredClone(e),r=he[n],o=he[t];if(n===t||!r||!o)return a;let s=Io.includes(n),l=Io.includes(t),d=s===l?1:l?Ao:1/Ao,u=Math.min(o.width/r.width,o.height/r.height)*d;if(d!==1){let c=a.frame,h=c.x+c.width/2,m=c.y+c.height/2;a.frame={...c,width:c.width*d,height:c.height*d,x:.5+(h-.5)*d-c.width*d/2,y:.5+(m-.5)*d-c.height*d/2}}return a.size!==void 0&&(a.size=Math.max(_c(i),Math.round(a.size*u*10)/10)),a}function as(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>{let a=t.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Un(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function Wa(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var qa=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function di(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=Ba(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function ja(e,n){return di(e,Un(n))?.ref}function Ya(e,n){let t=ja(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&qa.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function Ho(e,n,t){if(gi(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,s=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=Oe(a),r=Oe(r),o=Oe(o),s=Oe(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function rs(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function os(e,n,t,i){let a=e.elements.find(h=>h.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,s=Oe(i.x),l=Oe(i.y),d=Oe(i.x+i.width),u=Oe(i.y+i.height),c={...i,x:s,y:l,width:Math.max(0,d-s),height:Math.max(0,u-l)};a.payload.outset=rs(o,c,he[t])}function ss(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=he[t];return{width:r.width*o.width,height:r.height*o.height}}function Me(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function de(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function Xa(e,n){let t=e.elements.find(i=>i.payload.id===n);if(t){if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}}function vt(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=t.get(r);s?s.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=rs(o.payload.frame,l.frame,he.rectangular));let d=l.outset,u=!gi(d);s.payload.frame=Ho(o.payload.frame,d,he.rectangular),s.payload.isHidden=o.payload.isHidden;let c=zc(e,a);for(let h of te){let m=e.perFamily[h];if(!m)continue;let g=he[h],v=m.placements[a];h!==c||!v?delete m.placements[s.payload.id]:u?m.placements[s.payload.id]={frame:Ho(v.frame,d,g),isHidden:v.isHidden}:m.placements[s.payload.id]={frame:{...v.frame},isHidden:v.isHidden}}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function wi(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind==="tap")return;let a=Me(e,n)[0];if(a)return a.payload;let r=Ve("tap"),o=r.payload;return o.attachedTo=n,o.outset={...Da},o.action=t??Ya(e,i),e.elements.push(r),vt(e),o}function xi(e,n){let t=Me(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of te)for(let a of t)delete e.perFamily[i]?.placements[a]}}function et(e,n){for(let t of Nt(e,n))et(e,t.payload.id);xi(e,n),e.elements=e.elements.filter(t=>t.payload.id!==n);for(let t of e.elements)t.kind==="chart"&&t.payload.scaleFrom===n&&delete t.payload.scaleFrom;for(let t of te)delete e.perFamily[t]?.placements[n];vt(e),Ne(e)}function ls(e,n){let t=e.elements.findIndex(l=>l.payload.id===n),i=e.elements[t];if(!i)return;let a=X(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[n,a]];for(let l of Me(e,n)){let d=structuredClone(l);d.payload.id=X(),d.payload.attachedTo=a,o.push(d),s.push([l.payload.id,d.payload.id])}e.elements.splice(t+1,0,...o);for(let l of te){let d=e.perFamily[l];if(d)for(let[u,c]of s){let h=d.placements[u];h&&(d.placements[c]=structuredClone(h))}}return vt(e),a}function ds(e,n){let t=e.elements.findIndex(o=>o.payload.id===n),i=e.elements[t];if(!i||i.kind!=="chart")return;let a=X(),r=structuredClone(i);r.payload.id=a,r.payload.scaleFrom=n,e.elements.splice(t+1,0,r);for(let o of te){let s=e.perFamily[o],l=s?.placements[n];s&&l&&(s.placements[a]=structuredClone(l))}return a}function on(e,n,t){let i=new Set,a=d=>{i.add(d);for(let u of Me(e,d))i.add(u.payload.id)};for(let d of n){a(d);for(let u of Nt(e,d))a(u.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o={};for(let d of te){let u=e.perFamily[d];if(!u)continue;let c={};for(let h of r){let m=u.placements[h.payload.id];m&&(c[h.payload.id]=structuredClone(m))}Object.keys(c).length>0&&(o[d]=c)}let s=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),l=(e.groups??[]).filter(d=>s.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:o,groups:l,...t!==void 0?{family:t}:{}}}function cs(e,n,t){let i=n.family,a=i!==void 0&&i!==t&&te.includes(i);if(!te.includes(t))return At(e,n);let r=At(e,n,a?{nudge:!1}:{}),o=e.perFamily[t]??(e.perFamily[t]=Qe());for(let s of r){let l=e.elements.find(h=>h.payload.id===s);if(!l)continue;let d=(i!==void 0?e.perFamily[i]?.placements[s]:void 0)??te.map(h=>e.perFamily[h]?.placements[s]).find(h=>h!==void 0),u=d?.size??vi(l),c={frame:{...d?.frame??l.payload.frame},isHidden:!1,...u!==void 0?{size:u}:{}};for(let h of te)h!==t&&delete e.perFamily[h]?.placements[s];o.placements[s]=a?Ka(c,i,t,l.kind):c}return sn(e,t),r}function At(e,n,t={}){let i=new Map;for(let d of n.elements)i.set(d.payload.id,X());let a=new Set(e.elements.map(d=>d.payload.id)),r=t.nudge!==!1&&n.elements.some(d=>a.has(d.payload.id)),o=d=>r?{...d,x:Math.min(.9,d.x+.05),y:Math.min(.9,d.y+.05)}:d,s=[];for(let d of n.elements){let u=structuredClone(d);if(u.payload.id=i.get(d.payload.id),u.kind==="tap"&&u.payload.attachedTo!==void 0){let c=i.get(u.payload.attachedTo);c?u.payload.attachedTo=c:delete u.payload.attachedTo}if(u.kind==="chart"&&u.payload.scaleFrom!==void 0){let c=i.get(u.payload.scaleFrom);c?u.payload.scaleFrom=c:a.has(u.payload.scaleFrom)||delete u.payload.scaleFrom}if(u.kind==="text"&&u.payload.value.kind.kind==="chartStat"){let c=i.get(u.payload.value.kind.layer);if(c)u.payload.value.kind.layer=c;else if(!a.has(u.payload.value.kind.layer))continue}u.payload.frame=o(u.payload.frame),s.push(u)}let l=new Map;for(let d of n.groups){if(s.filter(h=>h.payload.groupId===d.id&&!(h.kind==="tap"&&h.payload.attachedTo!==void 0)).length<2)continue;let c=X();l.set(d.id,c),(e.groups??=[]).push({...structuredClone(d),id:c})}for(let d of s){if(d.payload.groupId===void 0)continue;let u=l.get(d.payload.groupId);u?d.payload.groupId=u:delete d.payload.groupId}e.elements.push(...s);for(let d of te){let u=n.placements[d],c=e.perFamily[d];if(!(!u||!c))for(let[h,m]of Object.entries(u)){let g=i.get(h);g&&s.some(v=>v.payload.id===g)&&(c.placements[g]={...structuredClone(m),frame:o(m.frame)})}}return vt(e),Ne(e),rn(e),s.filter(d=>!de(e,d)).map(d=>d.payload.id)}function Nc(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?!a.isHidden:!t.payload.isHidden}function zc(e,n){let t=e.elements.find(r=>r.payload.id===n),a=(t&&t.kind==="tap"?t.payload.attachedTo:void 0)??n;return te.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[a]!==void 0)}function Ue(e,n){let t=e.perFamily[n];return t?e.elements.filter(i=>{let a=i.kind==="tap"?i.payload.attachedTo:void 0;return t.placements[a??i.payload.id]!==void 0}):[]}function us(e,n){let t=e.perFamily[n];return t?Ue(e,n).filter(i=>!de(e,i)&&!t.placements[i.payload.id]?.isHidden).length:0}function sn(e,n){let t=te.filter(s=>e.supportedFamilies.includes(s));if(t.length===0)return;let i=n!==void 0&&t.includes(n)?n:t[0];for(let s of t)e.perFamily[s]||(e.perFamily[s]=Qe());let a=()=>e.elements.filter(s=>!de(e,s)),r=new Map,o=new Set;if(n===void 0){let s=new Map(a().map(h=>[h.payload.id,t.filter(m=>Nc(e,m,h))]));for(let[h,m]of s)m[0]&&r.set(h,m[0]);let l=new Map([...a().entries()].map(([h,m])=>[m.payload.id,h]));for(let h of t){let m=a().filter($=>(s.get($.payload.id)??[]).includes(h)&&r.get($.payload.id)!==h).map($=>$.payload.id);if(m.length===0)continue;let g=on(e,m,h),v=At(e,g,{nudge:!1});v.forEach(($,S)=>{r.set($,h);let T=v.length===m.length?m[S]:void 0;l.set($,T!==void 0?l.get(T)??0:l.size)})}for(let h of a())r.has(h.payload.id)||o.add(h.payload.id);let d=h=>t.indexOf(r.get(h)??i),u=a().sort((h,m)=>d(h.payload.id)-d(m.payload.id)||(l.get(h.payload.id)??0)-(l.get(m.payload.id)??0)),c=[];for(let h of u)c.push(h),c.push(...Me(e,h.payload.id));e.elements=c}for(let s of a()){let l=s.payload.id,d=t.filter(m=>e.perFamily[m].placements[l]!==void 0),u=r.get(l)??d.find(m=>!e.perFamily[m].placements[l].isHidden)??d[0]??i,c=e.perFamily[u]?.placements[l],h={frame:{...c?.frame??s.payload.frame},isHidden:o.has(l)||c?.isHidden===!0,...c?.size!==void 0?{size:c.size}:{}};s.payload.isHidden=!0;for(let m of te){let g=e.perFamily[m];g&&(m===u?g.placements[l]=h:delete g.placements[l])}}}function ki(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=di(e,Un(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of Me(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=di(e,s.value);if(!l)continue;let d={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(d.namedId=l.namedId),i.push(d)}return i}function wa(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"||t==="timeline"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function ps(e,n,t,i){let a=e.elements.find(o=>o.payload.id===n);if(!a||t.entityId==="")return;let r={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(a.kind==="timeline"){let o=a.payload.value.kind.kind==="entityState"?a.payload.value.kind.entityId:void 0,s=wa(a.payload.value,r,a.kind);s&&(a.payload.value=s),(a.payload.bands.length===0||o!==r.entityId)&&(a.payload.bands=Pa(r.domain,i))}else if(a.kind==="image")a.payload.entity=r;else if(a.kind==="text"||a.kind==="gauge"||a.kind==="chart"){let o=wa(a.payload.value,r,a.kind);o&&(a.payload.value=o)}else if(a.kind==="icon"){let o=wa(a.payload.symbol,r,a.kind);o&&(a.payload.symbol=o)}for(let o of Me(e,n)){let s=o.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var $i={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},hs=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","timeBetween","contains","startsWith","endsWith","matchesRegex","isOneOf"];function zt(e){let n=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(n)?n:void 0}function Pt(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function Ci(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function Ja(){return{id:X(),value:F(""),comparison:{kind:"isOn"}}}function Za(){return{id:X(),when:{join:"all",tests:[Ja()]},then:[]}}function Kn(){return{id:X(),cases:[Za()]}}function Lo(e,n){return e&&(e.kind.kind!=="literal"||zt(e.kind.value)!==void 0)?e:F(n)}function Qa(e,n){let t={kind:n};switch(Pt(n)){case"value":t.value=e.value??F("");break;case"between":t.value=e.value??F(""),t.upper=e.upper??F("");break;case"times":t.value=Lo(e.value,"22:00"),t.upper=Lo(e.upper,"06:00");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function Ot(e){let n={kind:e};switch(Ci(e)){case"value":n.value=F(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"none":break}return n}function ms(e){if(e.appliedToken===void 0)return{kind:"unsupported"};if(e.token===e.appliedToken){let n=!e.polling&&typeof e.lastPollSeconds=="number"?e.lastPollSeconds:void 0;return n===void 0?{kind:"sent"}:{kind:"sent",awaySeconds:n}}return e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Pc(e){if(e<60)return"just now";let n=Math.floor(e/60);if(n<60)return`${n} min ago`;let t=Math.floor(n/60);if(t<24)return`${t} h ago`;let i=Math.floor(t/24);return`${i} ${i===1?"day":"days"} ago`}function fs(e){switch(e.kind){case"unsupported":return{label:"Update the watch app",note:"to receive this",title:"This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",resend:!1};case"sent":return e.awaySeconds===void 0?{label:"On watch",title:"The watch has applied every change here.",resend:!1}:{label:"On watch",note:`last seen ${Pc(e.awaySeconds)}`,title:"The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function ys(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function bs(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function gs(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function tr(e,n,t=0){let i=n instanceof Map?n:bs(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?tr(o,i,t+1):gs(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!gs(a))return;let r=er(a);if(r!==void 0)return"e_"+ys(r)}function ze(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Oc(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(o=>ze(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:s,labelIds:l,floorIds:d}=e.scope;if(!(s.length+l.length+d.length>0))n=o.length===0?"[]":"("+o.map(c=>`(states.${c} | list)`).join(" + ")+")";else{let c=[];for(let h of s)c.push(`area_entities(${ze(h)})`);for(let h of l)c.push(`label_entities(${ze(h)})`);d.length>0&&c.push(`((${d.map(h=>`floor_areas(${ze(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${c.join(" + ")})`,o.length>0&&(n+=` | selectattr('domain', 'in', [${o.map(ze).join(", ")}])`),n+=")"}}let t=n,i=e.stateFilter;if(i&&(i.kind==="isOn"?t+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?t+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?t+=` | selectattr('state', 'eq', ${ze(i.value)})`:t+=` | rejectattr('state', 'eq', ${ze(i.value)})`),e.function==="count")return`(${t} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${t} | map(attribute=${ze(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function er(e){switch(e.kind){case"entityAttribute":return`state_attr(${ze(e.entityId)}, ${ze(e.attribute)})`;case"entityAge":{let n=ze(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Oc(e.aggregate);default:return}}function Si(e){let n=new Map,t=new Map,i=bs(e.values),a=(o,s=0)=>{let l=o.kind;switch(l.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":n.set(l.entityId,l);return;case"named":{if(s>8)return;let d=i.get(l.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,s+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let u=er(d.kind);if(u===void 0)return;t.set("n_"+l.id.toLowerCase().replace(/-/g,""),u);return}default:{let d=er(l);if(d===void 0)return;t.set("e_"+ys(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let s=Un(o);s&&a(s),o.kind==="gauge"&&o.payload.total&&a(o.payload.total),o.kind==="chart"&&o.payload.nowIndex&&a(o.payload.nowIndex);for(let l of Wa(o.payload.rules))a(l)}for(let o of te){if(!e.supportedFamilies.includes(o))continue;let s=e.perFamily[o];if(s){s.bezelText&&a(s.bezelText),s.curvedText&&a(s.curvedText),s.bezelGauge&&(a(s.bezelGauge.value),s.bezelGauge.minLabel&&a(s.bezelGauge.minLabel),s.bezelGauge.maxLabel&&a(s.bezelGauge.maxLabel));for(let l of Wa(s.rules))a(l)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:n,expressions:t};return t.size>0&&(r.document=Dc(t)),r}function Dc(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function vs(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,Vc(r));return{values:t,nullKeys:i}}function Vc(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function nr(e){let n=Si(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return n.document&&t.push({kind:"template",value:n.document}),t}function Bc(e,n){if(e.values.length!==0)switch(n){case"latest":return e.values[e.values.length-1];case"highest":return Math.max(...e.values);case"lowest":return Math.min(...e.values);case"average":return e.values.reduce((t,i)=>t+i,0)/e.values.length;case"top":return e.domainMax;case"bottom":return e.domainMin;case"first":return e.values[0];case"delta":return e.values[e.values.length-1]-e.values[0];case"sum":return e.values.reduce((t,i)=>t+i,0);case"trend":{let t=e.values[e.values.length-1]-e.values[0],i=Number(Ea(t,e.domainMax-e.domainMin));return i>0?1:i<0?-1:0}}}var Gc=10800;function Uc(e,n,t){let i=n==="always"||n==="auto"&&t<=Gc;return new Intl.DateTimeFormat(void 0,{hour:"numeric",...i?{minute:"2-digit"}:{},...e==="h12"?{hourCycle:"h12"}:{},...e==="h24"?{hourCycle:"h23"}:{}})}function ks(e,n,t,i,a){if(e<=0||n.length===0)return[];let r=Uc(t,i,e);return n.map(o=>({position:o,text:r.format(new Date(a-e*1e3*(1-o)))}))}function Kc(e,n){return bt(e)===void 0?[]:ks(Be(e)*60,_a(e.timeLabelCount),e.hourCycle,e.minutes,n)}function Wc(e,n){return mi(e)?ks(Math.round(e.historyMinutes)*60,_a(On(e.timeLabelCount)),e.hourCycle,e.minutes,n):[]}function Dt(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function tt(e){let n=e.trim(),t=Dt(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:Dt(i)}function qc(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function jc(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function Yc(e){let n=e.trim(),t=Dt(n);if(t!==void 0)return t;let i=0,a=n.indexOf(",");if(a>=0){let s=n.slice(0,a).trim().split(" "),l=s.length===2?Dt(s[0]):void 0;if(l===void 0||s[1]!=="day"&&s[1]!=="days")return;i=l,n=n.slice(a+1).trim()}let r=n.split(":");if(r.length!==2&&r.length!==3)return;let o=0;for(let s=0;s<r.length;s++){let l=Dt(r[s]);if(l===void 0)return;o+=l*Math.pow(60,r.length-1-s)}return i*86400+o}function Xc(e){let n=Math.trunc(Math.min(Math.max(0,e)||0,863913600)),i=[[Math.trunc(n/86400),"d"],[Math.trunc(n%86400/3600),"h"],[Math.trunc(n%3600/60),"m"],[n%60,"s"]].filter(([a])=>a>0).slice(0,2).map(([a,r])=>`${a}${r}`);return i.length===0?"0s":i.join(" ")}function Jc(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function Zc(e,n,t){if(Ge(n))return e;let i=n,a=e,r=Dt(e.trim()),o=i.duration?Yc(e):void 0;if(o!==void 0)a=Xc(o);else if(i.relativeTime&&r!==void 0)a=jc(r);else{let s=tt(e);if(s!==void 0){let l=s*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==s&&(a=Number.isInteger(l)?String(l):qc(l))}}switch(i.useEntityUnit&&t&&(a+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=Jc(a);break}return a}function ln(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Wn(e,n=240){let t=[],i="",a=!1,r=()=>{if(i!==""){let o=Number(i);Number.isFinite(o)&&t.push(o)}i=""};for(let o of e){if(t.length>=n)break;if(o>="0"&&o<="9")i+=o,a=!0;else if(o===".")i.includes(".")&&r(),i+=".",a=!0;else if(o==="-"||o==="+"){let s=!a;r(),s&&(i+=o),a=!1}else r(),a=!1}return t.length<n&&r(),t}function ws(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1,n.thresholdValue!==void 0&&Number.isFinite(n.thresholdValue)&&(t=Math.min(t,n.thresholdValue),i=Math.max(i,n.thresholdValue))),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function Qc(e,n,t){let i=e.thresholdValue;if(!(i===void 0||!Number.isFinite(i)||!(t>n)||i<n||i>t))return(i-n)/(t-n)}function qn(e,n=yt){let t=[];for(let i of e.split(" ")){if(t.length>=n)break;if(i==="")continue;let a=i.indexOf(":");if(a<=0)continue;let r=Number(i.slice(0,a));!Number.isFinite(r)||r<0||t.push({offsetSeconds:Math.round(r),state:eu(i.slice(a+1))})}return t}function eu(e){try{return decodeURIComponent(e)}catch{return e}}function tu(e,n,t){if(e.length===0||!(n>0))return[];let i=[];for(let r=0;r<e.length;r++){let o=e[r],s=Math.min(1,Math.max(0,o.offsetSeconds/n)),l=e[r+1],d=l===void 0?1:Math.min(1,Math.max(s,l.offsetSeconds/n));if(!(d>s))continue;let u=t(o.state),c=i[i.length-1];c!==void 0&&c.colorHex===u?c.end=d:i.push({start:s,end:d,colorHex:u})}let a=i[i.length-1];return a!==void 0&&(a.end=1),i}function xs(e,n,t){if(Number.isNaN(e))return t;let i=e<0?-Math.round(-e):Math.round(e);return Math.min(t,Math.max(n,i))}function nu(e,n,t){if(e===void 0)return 0;let i=tt(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}var nt=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&this.settleCharts(t)}chartReadings(n){let t=this.chartSeries(n),i=ws(t,n),a={values:t,domainMin:i.min,domainMax:i.max},r=this.chartEntity(n);return r&&(a.entity=r),a}chartSeries(n){let t=Lt(n),i=_t(n),a;t!==void 0?a=this.ctx.historySeries?.get(t)??"":i!==void 0?a=this.ctx.historySeries?.get(i)??"":a=this.resolve(n.value)??"";let r=Wn(a);return n.limit>0&&r.length>n.limit?n.takeFromEnd?r.slice(r.length-n.limit):r.slice(0,n.limit):r}chartEntity(n){let t=this.dereference(n.value);if(!(!t||!("entityId"in t.kind)))return{entityId:t.kind.entityId,displayName:t.kind.displayName,domain:t.kind.domain}}chartNowIndex(n,t){if(n.nowIndex===void 0||t===0)return;let i=this.resolve(n.nowIndex);if(i===void 0)return;let a=tt(i);if(!(a===void 0||!Number.isFinite(a)))return Math.min(Math.max(Math.round(a),0),t-1)}settleCharts(n){let t=new Map,i=[];for(let s of n.elements)s.kind!=="chart"||t.has(s.payload.id)||(t.set(s.payload.id,s.payload),i.push(s.payload.id));let a=new Map;for(let s of i)a.set(s,this.chartSeries(t.get(s)));let r=new Map,o=(s,l)=>{let d=r.get(s);if(d)return d;let u=t.get(s);if(!u)return{min:0,max:1};let c=u.scaleFrom,h=c!==void 0&&c!==s&&t.has(c)&&!l.has(c)?o(c,new Set([...l,c])):ws(a.get(s)??[],u);return r.set(s,h),h};for(let s of i){let l=t.get(s),d=o(s,new Set([s])),u={values:a.get(s)??[],domainMin:d.min,domainMax:d.max},c=this.chartEntity(l);c&&(u.entity=c),this.charts.set(s,u)}}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!Ge(a)?a:s.format,t=s}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){if(t.stat==="trend")return;let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?Bc(a,t.kind.stat):void 0;a&&r!==void 0&&(i=t.kind.stat==="trend"?zo(r):Ea(r,a.domainMax-a.domainMin));break}default:{let a=tr(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return Zc(i,t.format,this.directEntityUnit(t))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=Dt(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?ln(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=tt(i),r=()=>this.resolve(t.value),o=()=>{let l=r();return l===void 0?void 0:tt(l)},s=l=>{let d=o();return a===void 0||d===void 0?!1:l(a,d)};switch(t.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,d)=>l>d);case"greaterOrEqual":return s((l,d)=>l>=d);case"lessThan":return s((l,d)=>l<d);case"lessOrEqual":return s((l,d)=>l<=d);case"between":{let l=o(),d=this.resolve(t.upper),u=d===void 0?void 0:tt(d);if(a===void 0||l===void 0||u===void 0)return!1;let[c,h]=l<=u?[l,u]:[u,l];return a>=c&&a<=h}case"timeBetween":{let l=zt(i),d=r(),u=this.resolve(t.upper),c=d===void 0?void 0:zt(d),h=u===void 0?void 0:zt(u);return l===void 0||c===void 0||h===void 0||c===h?!1:c<h?l>=c&&l<h:l>=c||l<h}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set(Fe[s.kind],s)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveElement(n,t){let i=n.payload,a=this.applyRules(i.rules,t),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,s=this.styleNumber(a,"rotation"),l=s===void 0?i.frame:{...i.frame,rotationDegrees:s},d=this.styleNumber(a,"opacity")??1,u={id:i.id,isHidden:o,frame:l,opacity:d};switch(n.kind){case"text":{let c=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,h=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,m={kind:"text",...u,text:this.styleText(a,"text")??h??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??n.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex,monospacedDigits:n.payload.monospacedDigits===!0,lineLimit:n.payload.lineLimit===2?2:1,alignment:n.payload.alignment??"center"};return c!==void 0&&(m.countdownEnd=c),m}case"icon":{let c=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle",h=this.styleText(a,"icon"),m=n.payload.symbol.kind.kind==="literal",g=h===void 0&&m&&n.payload.path!==""?n.payload.path:void 0,v=h??c;g===void 0&&v.startsWith("mdi:")&&(v="questionmark.circle");let $={kind:"icon",...u,symbol:v,size:this.styleNumber(a,"fontSize")??n.payload.size,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex};return g!==void 0&&($.path=g),$}case"gauge":{let c=n.payload,h=this.styleText(a,"gaugeValue")??this.resolve(c.value),m=this.styleNumber(a,"gaugeMin")??c.minValue,g=this.styleNumber(a,"gaugeMax")??c.maxValue,v=h===void 0?void 0:tt(h),$=this.styleColor(a,"color")??c.colorSlot.baseColorHex;c.coloring==="bands"&&c.bands.length>0&&v!==void 0&&($=Sa(v,Nn(c),c.bandAboveColorHex));let S=g-m;if(c.total){let C=tt(this.resolve(c.total)??"");C!==void 0&&(S=C)}let T=xs(S,1,ui),k={kind:"gauge",...u,fraction:nu(h,m,g),style:c.style,lineWidth:c.lineWidth,colorHex:$,trackColorHex:c.trackColorHex,thresholdColorHex:c.thresholdColorHex,dotCount:T,filledCount:xs(v??0,0,T)};if(c.thresholdValue!==void 0&&g!==m){let C=(c.thresholdValue-m)/(g-m);C>=0&&C<=1&&(k.thresholdFraction=C)}return k}case"chart":{let c=n.payload,h=this.charts.get(c.id)??this.chartReadings(c),m=h.values,g={min:h.domainMin,max:h.domainMax},v=this.styleColor(a,"color")??c.colorSlot.baseColorHex,$=Nn(c),S=No(c)?m.map(_=>Sa(_,$,c.bandAboveColorHex)):[],T={kind:"chart",...u,values:m,style:c.style,domainMin:g.min,domainMax:g.max,baseline:c.baseline,barGap:c.barGap,lineWidth:c.lineWidth,colorHex:v,highColorHex:c.highColorHex,lowColorHex:c.lowColorHex,marker:c.marker,pointColorHexes:S,fillBands:c.fillBands,thresholdColorHex:c.thresholdColorHex,nowColorHex:c.nowColorHex,labels:Wc(c,this.nowMs()),labelSize:c.labelSize,labelColorHex:c.labelColorHex,labelsAbove:c.labelsAbove};if(m.length>0){let _=c.highlight==="highest"||c.highlight==="both",D=c.highlight==="lowest"||c.highlight==="both",V=_?m.indexOf(Math.max(...m)):-1,ie=D?m.indexOf(Math.min(...m)):-1;V>=0&&(T.highIndex=V),ie>=0&&ie!==V&&(T.lowIndex=ie)}let k=Qc(c,g.min,g.max);k!==void 0&&(T.thresholdY=k);let C=this.chartNowIndex(c,m.length);return C!==void 0&&(T.nowIndex=C),T}case"timeline":{let c=n.payload,h=bt(c),m=h===void 0?"":this.ctx.historySeries?.get(h)??"",g=qn(m,yt),v=tu(g,Be(c)*60,S=>Go(S,c.bands,c.otherColorHex));return{kind:"timeline",...u,runs:v,gap:c.gap,cornerRadius:c.cornerRadius,labels:Kc(c,this.nowMs()),labelSize:c.labelSize,labelColorHex:c.labelColorHex,labelsAbove:c.labelsAbove}}case"shape":{let c={kind:"shape",...u,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,thickness:n.payload.thickness,fillColorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??n.payload.borderWidth},h=this.styleColor(a,"borderColor")??n.payload.borderColorHex;return h!==void 0&&(c.borderColorHex=h),c}case"image":{let c={kind:"image",...u,entityId:n.payload.entity.entityId,source:n.payload.source,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};Ye(n.payload)&&(c.timestampX=n.payload.timestampX,c.timestampY=n.payload.timestampY);let h=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return h!==void 0&&(c.url=h),c}case"tap":{let c={kind:"tap",...u,frame:n.payload.frame,opacity:1,action:n.payload.action};return n.payload.openPageId!==void 0&&(c.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(c.attachedTo=n.payload.attachedTo),c}}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=as(n,t).map(v=>this.resolveElement(v,i)),o=a?this.applyRules(a.rules,i):new Map,s={family:t,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},l=this.styleText(o,"text"),d=a?.bezelCountdown&&l===void 0?this.countdownEnd(a.bezelText):void 0,u=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,c=l??u??this.resolve(a?.bezelText);c!==void 0&&(s.bezelText=c),d!==void 0&&(s.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(s.curvedText=h),a?.curvedColorHex!==void 0&&(s.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let v=a.bezelGauge,$=this.resolve(v.value),S=$===void 0?void 0:tt($);if(S!==void 0){let T=Math.min(v.minValue,v.maxValue),k=Math.max(v.minValue,v.maxValue),C={value:Math.min(k,Math.max(T,S)),minValue:T,maxValue:k===T?T+1:k,colorHexes:v.colorHexes},_=this.resolve(v.minLabel);_!==void 0&&(C.minLabel=_);let D=this.resolve(v.maxLabel);D!==void 0&&(C.maxLabel=D),s.bezelGauge=C}}let m=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;m!==void 0&&(s.backgroundColorHex=m);let g=this.styleColor(o,"borderColor")??a?.borderColorHex;return g!==void 0&&(s.borderColorHex=g),s}};function iu(e,n,t){let i=new nt(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function Ei(e,n,t){let i=new nt(n),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=iu(e.inline,n,e)),a}var we=he,Yn=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:we,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],dn=Yn.find(e=>e.measured);function Is(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return Yn.find(a=>a.screen.width===t&&a.screen.height===i)}function Mi(e,n){let t=we[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var au={regular:400,medium:500,semibold:600,bold:700},ru=1.15;function Ke(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function ve(e,n,t="#FFFFFF"){let i=Ke(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}function As(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}var Fi=e=>e*.55;function ou(e,n){switch(e){case"leading":return{anchor:"start",x:n.x};case"trailing":return{anchor:"end",x:n.x+n.w};default:return{anchor:"middle",x:n.cx}}}function su(e,n){let t=e.split(/\s+/).filter(r=>r!=="");if(t.length<2)return[e];let i="",a=0;for(let r=0;r<t.length-1;r++){let o=i===""?t[r]:`${i} ${t[r]}`;if(i!==""&&o.length>n)break;i=o,a=r+1}return a===0&&(i=t[0],a=1),[i,t.slice(a).join(" ")]}function lu(e,n,t){if(t<=0||e.length*Fi(n)<=t)return e;let i=t-.8*n,a=Math.max(1,Math.floor(i/Fi(n)));return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function du(e,n){let t=ve(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:ln((e.countdownEnd-Date.now())/1e3)});let i=e.lineLimit===2&&n.w>0?su(e.text,n.w/Fi(e.fontSize)):[e.text],a=Math.max(...i.map(h=>h.length))*Fi(e.fontSize),r=a>n.w&&n.w>0?Math.max(.5,n.w/a):1,o=e.fontSize*r,s=i.map(h=>lu(h,o,n.w)),{anchor:l,x:d}=ou(e.alignment,n),u=o*1.15,c=s.length>1?b`${s.map((h,m)=>b`<tspan x=${d} y=${n.cy+(m-(s.length-1)/2)*u}>${h}</tspan>`)}`:s[0];return b`<text x=${d} y=${n.cy} text-anchor=${l} dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${au[e.fontWeight]??400}
    style=${e.monospacedDigits?"font-variant-numeric: tabular-nums":f}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${c}</text>`}var ir=2;function cu(e,n){let t=ve(e.colorHex,"stroke"),i=ve(e.trackColorHex,"stroke","#FFFFFF"),a=ve(e.thresholdColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="dots"){let m=n.w>=n.h,g=Math.max(1,e.dotCount),v=m?n.w:n.h,$=m?n.h:n.w,S=Math.max(1,Math.min($,v/g-ir)),T=g*S+(g-1)*ir,k=(m?n.cx:n.cy)-T/2+S/2;return b`${Array.from({length:g},(C,_)=>{let D=k+_*(S+ir),V=_<e.filledCount?t:i;return b`<circle cx=${m?D:n.cx} cy=${m?n.cy:D} r=${S/2}
        fill=${V.stroke} fill-opacity=${V["stroke-opacity"]} />`})}`}if(e.style==="bar"){let m=n.w,g=Math.max(r,m*e.fraction),v=1;return b`
      <rect x=${n.x} y=${n.cy-r/2} width=${m} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-r/2} width=${g} height=${r} rx=${r/2}
        fill=${t.stroke} fill-opacity=${t["stroke-opacity"]} />
      ${e.thresholdFraction===void 0?f:b`<rect x=${n.x+Math.min(m-v,Math.max(0,m*e.thresholdFraction-v/2))}
            y=${n.cy-r/2} width=${v} height=${r}
            fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} />`}`}let o=Math.min(n.w,n.h),s=Math.max(0,o/2-r/2),l=2*Math.PI*s,d=e.style==="ring"?1:.75,u=e.style==="ring"?-90:135,c=l*d,h=l*d*e.fraction;return b`
    <g transform="rotate(${u} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${c} ${l}" />
      ${e.fraction>0?b`<circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
            stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
            stroke-dasharray="${h} ${l}" />`:f}
      ${e.thresholdFraction===void 0?f:uu(n,s,r,d*360*e.thresholdFraction,e.thresholdColorHex)}
    </g>`}function uu(e,n,t,i,a){let r=ve(a,"stroke","#FFFFFF"),o=i*Math.PI/180,s=Math.cos(o),l=Math.sin(o),d=t/2+1;return b`<line x1=${e.cx+s*(n-d)} y1=${e.cy+l*(n-d)}
    x2=${e.cx+s*(n+d)} y2=${e.cy+l*(n+d)}
    stroke-width="1" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} />`}var pu=5;function hu(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0||e.lowIndex!==void 0,r=e.marker==="none"||!a?0:pu,o=e.style==="bars"?0:e.lineWidth/2,s=n.x,l=Math.max(n.w,0),d=n.y+r+o,u=Math.max(n.h-r-o*2,1),c=d+u,h=Math.max(e.domainMax-e.domainMin,Number.EPSILON),m=e.baseline==="lowest",g=m?u*.12:0,v=Math.min(Math.max(e.barGap,0),l/(i*2)),$=Math.max((l-v*(i-1))/i,.5),S=k=>Math.min(1,Math.max(0,(k-e.domainMin)/h)),T=k=>c-S(k)*u;return{count:t.length,barWidth:$,plotTop:d,plotBottom:c,plotLeft:s,plotRight:s+l,baselineY:m?c:T(0),yAtFraction(k){return c-Math.min(Math.max(k,0),1)*u},barRect(k){let C=s+k*($+v),_=t[k],D,V;if(m){let ie=g+S(_)*(u-g);D=c-ie,V=c}else D=T(_),V=m?c:T(0),D>V&&([D,V]=[V,D]);return{x:C,y:D,w:$,h:Math.max(V-D,.5)}},point(k){let C=Math.max(l-o*2,0);return{x:t.length>1?s+o+C*k/(t.length-1):s+l/2,y:T(t[k])}},markerCenter(k,C){let _=C?this.barRect(k):void 0;return{x:_?_.x+_.w/2:this.point(k).x,y:n.y+r/2}}}}function mu(e,n){let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Hs(e,n),o=r?Ls(e,n,t,i):void 0;if(e.values.length===0)return o===void 0?f:b`${o}`;let s=fu(e,a);return o===void 0?s:b`${s}${o}`}function fu(e,n){let t=hu(e,n),i=ve(e.colorHex,"fill"),a=ve(e.highColorHex,"fill",e.colorHex),r=ve(e.lowColorHex,"fill",e.colorHex),o=(u,c)=>b`<circle cx=${u.x} cy=${u.y} r="1.7" fill=${c.fill} fill-opacity=${c["fill-opacity"]} />`,s=[],l=e.pointColorHexes.length===t.count,d=u=>l?ve(e.pointColorHexes[u],"fill",e.colorHex):i;if(e.style==="bars")for(let u=0;u<t.count;u++){let c=t.barRect(u),h=u===e.highIndex?a:u===e.lowIndex?r:d(u),m=Math.min(1.2,c.w/2,c.h/2);s.push(b`<rect x=${c.x} y=${c.y} width=${c.w} height=${c.h} rx=${m}
        fill=${h.fill} fill-opacity=${h["fill-opacity"]} />`)}else{let u=Array.from({length:t.count},(h,m)=>t.point(m)),c=u.map((h,m)=>`${m===0?"M":"L"}${h.x} ${h.y}`).join(" ");if(e.style==="area")if(e.fillBands&&l&&t.count>1)for(let h=0;h<t.count-1;h++){let m=u[h],g=u[h+1],v=d(h+1),$=`M${m.x} ${m.y} L${g.x} ${g.y} L${g.x} ${t.baselineY} L${m.x} ${t.baselineY} Z`;s.push(b`<path d=${$} fill=${v.fill}
            fill-opacity=${v["fill-opacity"]*.28} stroke="none" />`)}else{let h=`${c} L${u[u.length-1].x} ${t.baselineY} L${u[0].x} ${t.baselineY} Z`;s.push(b`<path d=${h} fill=${i.fill}
          fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}if(l&&t.count>1)for(let h=0;h<t.count-1;h++){let m=u[h],g=u[h+1],v=d(h+1);s.push(b`<path d=${`M${m.x} ${m.y} L${g.x} ${g.y}`} fill="none"
          stroke=${v.fill} stroke-opacity=${v["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else s.push(b`<path d=${c} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
        stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&s.push(o(u[e.highIndex],a)),e.lowIndex!==void 0&&s.push(o(u[e.lowIndex],r))}if(e.marker!=="none"){let u=e.style==="bars";if(e.highIndex!==void 0){let c=t.markerCenter(e.highIndex,u);s.push(e.marker==="pointer"?b`<path d=${`M${c.x} ${c.y-1.8} L${c.x+2.2} ${c.y+1.8} L${c.x-2.2} ${c.y+1.8} Z`}
            fill=${a.fill} fill-opacity=${a["fill-opacity"]} />`:o(c,a))}e.lowIndex!==void 0&&s.push(o(t.markerCenter(e.lowIndex,u),r))}if(e.thresholdY!==void 0){let u=t.yAtFraction(e.thresholdY),c=ve(e.thresholdColorHex,"fill",e.colorHex);s.push(b`<path d=${`M${t.plotLeft} ${u} L${t.plotRight} ${u}`} fill="none"
      stroke=${c.fill} stroke-opacity=${c["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`)}if(e.nowIndex!==void 0&&e.nowIndex<t.count){let u=t.markerCenter(e.nowIndex,e.style==="bars").x,c=ve(e.nowColorHex,"fill",e.colorHex);s.push(b`<path d=${`M${u} ${t.plotTop} L${u} ${t.plotBottom}`} fill="none"
      stroke=${c.fill} stroke-opacity=${c["fill-opacity"]} stroke-width="1" />`)}return b`${s}`}var jn=1;function Hs(e,n){let t=Math.max(Vn,Math.min(Bn,e.labelSize)),i=t*1.2,a=e.labels.length>0&&n.h-i-jn>=2,r=a?{...n,y:e.labelsAbove?n.y+i+jn:n.y,h:n.h-i-jn,cy:(e.labelsAbove?n.y+i+jn:n.y)+(n.h-i-jn)/2}:n;return{labelSize:t,rowHeight:i,body:r,showsLabels:a}}function Ls(e,n,t,i){let a=(e.labelsAbove?n.y:n.y+n.h-i)+i/2,r=ve(e.labelColorHex,"fill");return e.labels.map((o,s)=>{let d=s===e.labels.length-1?"end":s===0?"start":"middle",u=n.x+o.position*n.w;return b`<text x=${u} y=${a} text-anchor=${d} dominant-baseline="central"
      font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size=${t} font-weight="400"
      fill=${r.fill} fill-opacity=${r["fill-opacity"]}>${o.text}</text>`})}function gu(e,n){if(e.runs.length===0&&e.labels.length===0||n.w<=0||n.h<=0)return f;let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Hs(e,n),o=Math.max(0,Math.min(e.gap,n.w/Math.max(1,e.runs.length))),s=e.runs.map((l,d)=>{let u=n.x+l.start*n.w,c=(l.end-l.start)*n.w,h=d===e.runs.length-1,m=Math.max(h?c:Math.min(c,.5),c-(h?0:o)),g=Math.max(0,Math.min(e.cornerRadius,m/2,a.h/2)),v=ve(l.colorHex,"fill");return b`<rect x=${u} y=${a.y} width=${m} height=${a.h} rx=${g}
      fill=${v.fill} fill-opacity=${v["fill-opacity"]} />`});return r?b`${s}${Ls(e,n,t,i)}`:b`${s}`}function yu(e,n){let t=ve(e.fillColorHex,"fill"),i=e.borderColorHex?Ke(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",s=i?i.opacity:0;switch(e.shapeKind){case"circle":{let l=Math.min(n.w,n.h)/2-r;return b`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,l)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"capsule":{let l=Math.min(n.w,n.h)/2;return b`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${l}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"roundedRectangle":return b`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${e.cornerRadius}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"rectangle":return b`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"line":{let l=n.w>=n.h,d=Math.max(0,Math.min(e.thickness,l?n.h:n.w)),u=l?n.x:n.cx-d/2,c=l?n.cy-d/2:n.y;return b`<rect x=${u} y=${c} width=${l?n.w:d} height=${l?d:n.h}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]} stroke="none" />`}}}function bu(e,n,t){if(e.path!==void 0&&e.path!==""){let o=ve(e.colorHex,"fill"),s=e.size*ru;return b`<g transform="translate(${n.cx-s/2} ${n.cy-s/2}) scale(${s/24})">
      <path d=${e.path} fill=${o.fill} fill-opacity=${o["fill-opacity"]} /></g>`}let i=t.render(e.symbol,e.size,e.colorHex);if(i)return b`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${i}</g>`;let a=ve(e.colorHex,"stroke"),r=e.size;return b`
    <rect x=${n.cx-r/2} y=${n.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var dr=.25,vu=8;function wu(e,n,t,i,a,r,o,s){let l={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return l;let d=Math.min(Math.max(Number.isFinite(r)?r:1,dr),vu),u=Math.max(e/t,n/i),c=Math.min(e/t,n/i),h=(a==="fit"?c:u)*d,m=t*h,g=i*h,v=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),$=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(m-e)/2*(1+v)+0,y:-(g-n)/2*(1+$)+0,width:m,height:g}}function Ri(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var Ti=4;function Ii(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?n.x+Ti:n.x+n.w-Ti-a,d=e.timestampCorner.startsWith("top")?n.y+Ti:n.y+n.h-Ti-r;return{x:l,y:d,w:a,h:r,size:i,label:t}}let s=(l,d,u,c)=>c>=u?d+(u-c)/2:Math.min(d+u-c,Math.max(d,l-c/2));return{x:s(n.x+e.timestampX*n.w,n.x,n.w,a),y:s(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function xu(e,n){if(e==="camera")return"camera.fill";switch(n.split(".")[0]){case"camera":return"camera.fill";case"person":return"person.crop.circle";case"media_player":return"music.note";default:return"photo"}}function ku(e,n,t){let i=t.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?Ii(e,n,Ri(new Date)):void 0,s=o?b`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:f,l=3,d=o&&t.timestampActiveId===e.id?b`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,m,g])=>b`<rect data-ts-corner=${h} x=${m-l/2} y=${g-l/2} width=${l} height=${l}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:f,u=e.url?t.imageSizes?.size(e.url):void 0,c;if(e.url&&u){let h=wu(n.w,n.h,u.width,u.height,e.contentMode,e.zoom,e.panX,e.panY);c=b`<image href=${e.url} x=${n.x+h.x} y=${n.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?c=b`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:c=b`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render(xu(e.source,e.entityId),14,"#FFFFFF99")??f}</g>`;return b`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${c}${s}</g>${d}`}function $u(e,n,t,i,a){if(!i)return f;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?Cu(a,n):void 0;return b`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?b`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${rr} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?b`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??f}</g>`:f}`}var rr=5;function Cu(e,n){let t=rr*.55,i=n.w-2;if(n.h<rr*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function or(e,n,t){if(e.isHidden&&!t.showHidden)return f;let i=t.tapReview===!0,a=t.tapAreas===!0||i,r=i?t.tapFocusId:void 0,o=r!==void 0&&e.id===r,s=r!==void 0;if(e.kind==="tap"&&!a)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||s&&!o))return f;let l=As(e,n),d=i&&(!s||o),u;switch(e.kind){case"text":u=du(e,l);break;case"icon":u=bu(e,l,t.icons);break;case"gauge":u=cu(e,l);break;case"chart":u=mu(e,l);break;case"timeline":u=gu(e,l);break;case"shape":u=yu(e,l);break;case"image":u=ku(e,l,t);break;case"tap":u=$u(e,l,t.icons,a,d?Xe(e.action):void 0);break}let c=i&&(e.kind!=="tap"||s&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*c,m=t.highlightId===e.id,g=m||t.highlightIds?.includes(e.id)===!0,v=t.handles===!0&&(!s||o),$=g?b`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,S=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?b`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,T=b`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="transparent" stroke="none" />`,k=3,C=m&&v?[["nw",l.x,l.y],["ne",l.x+l.w,l.y],["sw",l.x,l.y+l.h],["se",l.x+l.w,l.y+l.h]].map(([_,D,V])=>b`<rect data-handle=${_} x=${D-k/2} y=${V-k/2} width=${k} height=${k}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${_}-resize" />`):f;return b`<g data-element-id=${e.id} opacity=${h} style=${v?"cursor:move":f}
    transform="rotate(${e.frame.rotationDegrees} ${l.cx} ${l.cy})">${T}${u}${S}${$}${C}</g>`}function Ai(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function cr(e,n){return(n?23.5:34)*e}var $s=10.5;function _s(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function Cs(e,n){let t=0;for(let i of e)t+=_s(i,n);return t}function Ss(e,n,t){let i=e.toUpperCase(),a=d=>_s(d,t),r=.9*t,o=0;for(let d of i)o+=a(d);if(o<=n)return i;let s=0,l="";for(let d of i){if(s+a(d)+r>n)break;l+=d,s+=a(d)}return`${l.replace(/\s+$/,"")}\u2026`}function sr(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function lr(e,n,t,i){let a=sr(e,n,t),r=sr(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function Ns(e,n,t,i){let{dial:a}=Ai(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:lr(a,t,i.start,i.end),length:t*r}}function Su(e,n){let t=Ai(e,!0);return Ns(e,n,t.dial.r,t.labelArc)}var Es=18.5,Eu=113,Tu={start:-71,end:-36},Ts=104,Fu=6.2,Fs={start:-77,end:-30.5};function Ms(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function Rs(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=Ms(e[i]),o=Ms(e[i+1]),s=(l,d)=>Math.round(l+(d-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var ar=11;function Mu(e,n,t){let{dial:i}=Ai(n,!0),a=Ts*n,r=180/(Math.PI*Ts),o=e.minLabel!==void 0?Cs(e.minLabel,ar)*r:0,s=e.maxLabel!==void 0?Cs(e.maxLabel,ar)*r:0,l=Fs.start+(o>0?Math.max(0,o-1.8):0),d=Fs.end-(s>0?Math.max(0,s-1.8):0),u=d-l,c=24,h=[];for(let S=0;S<c;S++){let T=l+u*S/c,k=Math.min(d,l+u*(S+1)/c+.4);h.push(b`<path d=${lr(i,a,T,k)} fill="none"
      stroke=${Rs(e.colorHexes,(S+.5)/c)} stroke-width=${Fu*n}
      stroke-linecap=${S===0||S===c-1?"round":"butt"} />`)}let m=(e.value-e.minValue)/(e.maxValue-e.minValue),g=sr(i,a,l+u*m),v=1.5,$=(S,T,k,C)=>b`
    <defs><path id=${S} d=${lr(i,a,T,k)} /></defs>
    <text font-size=${ar*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${S}" startOffset="50%" text-anchor="middle">${C}</textPath></text>`;return b`${h}
    <circle cx=${g.x} cy=${g.y} r=${3.2*n} fill=${Rs(e.colorHexes,m)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?$(`${t}-gmin`,l-v-Math.max(o,3),l-v,e.minLabel):f}
    ${e.maxLabel!==void 0?$(`${t}-gmax`,d+v,d+v+Math.max(s,3),e.maxLabel):f}`}function Hi(e,n){let t=e.family in we?e.family:"rectangular",i=n.slot??we[t],a=we[t],r=Mi(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,s=Ke(e.backgroundColorHex),l=Ke(e.borderColorHex),d=e.borderWidth*r.scale;if(t==="corner"){let g=r.scale,v=!!e.bezelText||!!e.bezelGauge,$=e.curvedText??"",S=$!=="",T=Ai(g,v),k=cr(g,v),C=k/(a.width*g),_=T.tile.cx-k/2,D=T.tile.cy-k/2,V=`M 0 0 H ${T.quad.width-T.cornerRadius} A ${T.cornerRadius} ${T.cornerRadius} 0 0 1 ${T.quad.width} ${T.cornerRadius} V ${T.quad.height} H 0 Z`,ie=f;if(e.bezelGauge)ie=Mu(e.bezelGauge,g,o);else if(e.bezelText){let R=Su(g,`${o}-bezel`),U=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?ln((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;ie=b`<defs><path id=${R.id} d=${R.d} /></defs>
        <text font-size=${$s*g} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${R.id}" startOffset="50%" text-anchor="middle">${Ss(U,R.length,$s*g)}</textPath></text>`}let w=f;if(S){let R=Ke(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},U=Ns(g,`${o}-curved`,Eu*g,Tu);w=b`<defs><path id=${U.id} d=${U.d} /></defs>
        <text font-size=${Es*g} font-weight="600" fill=${R.color} fill-opacity=${R.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${U.id}" startOffset="50%" text-anchor="middle">${Ss($,U.length,Es*g*.88)}</textPath></text>`}else{let R=e.borderWidth*r.scale*C,U=l?b`<circle cx=${k/2} cy=${k/2} r=${k/2-R/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${R} />`:f;w=b`<g transform="translate(${_} ${D})">
        <g clip-path=${`url(#${o})`}>
          ${s?b`<rect width=${k} height=${k} fill=${s.color} fill-opacity=${s.opacity} />`:f}
          <g data-design-box transform="scale(${r.scale*C})">
            ${e.elements.map(O=>or(O,a,n))}
          </g>
        </g>
        <circle cx=${k/2} cy=${k/2} r=${k/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*g} stroke-dasharray=${`${2*g} ${2*g}`} />
        ${U}
      </g>`}return b`<svg viewBox=${`0 0 ${T.quad.width} ${T.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${T.quad.width} height=${T.quad.height}>
      <defs><clipPath id=${o}><circle cx=${k/2} cy=${k/2} r=${k/2} /></clipPath></defs>
      <path d=${V} fill="#000000" />
      ${ie}
      ${w}
    </svg>`}let u=b`<rect width=${i.width} height=${i.height} />`,c=l?b`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${d} />`:f,h=b`<rect width=${i.width} height=${i.height} fill="#000000" />`,m=`0 0 ${i.width} ${i.height}`;return b`<svg viewBox=${m} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${u}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${s?b`<rect width=${i.width} height=${i.height} fill=${s.color} fill-opacity=${s.opacity} />`:f}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(g=>or(g,a,n))}
      </g>
    </g>
    ${c}
  </svg>`}var Ru=.14;function Iu(e,n){let t=As(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function Au(e,n,t){let i=e.family in we?e.family:"rectangular",a=we[i],r=e.elements.filter(h=>n.includes(h.id)),o=1/0,s=1/0,l=-1/0,d=-1/0;for(let h of r){let m=Iu(h,a),g=h.frame.rotationDegrees%180===0?0:Math.hypot(m.w,m.h)/2;o=Math.min(o,g?m.cx-g:m.x),s=Math.min(s,g?m.cy-g:m.y),l=Math.max(l,g?m.cx+g:m.x+m.w),d=Math.max(d,g?m.cy+g:m.y+m.h)}let u=l-o,c=d-s;if(r.length===0||!(u>0)||!(c>0))o=0,s=0,u=a.width,c=a.height;else{let h=Math.max(2,Math.max(u,c)*Ru);o-=h,s-=h,u+=2*h,c+=2*h}if(u/c<t){let h=c*t;o-=(h-u)/2,u=h}else{let h=u/t;s-=(h-c)/2,c=h}return{x:o,y:s,w:u,h:c}}function zs(e,n,t){let i=e.family in we?e.family:"rectangular",a=we[i],r=Au(e,n,t.width/t.height),o=Ke(e.backgroundColorHex),s=Ke(e.borderColorHex),l=e.borderWidth,d={icons:t.icons,showHidden:!0,tapAreas:!0,...t.imageSizes?{imageSizes:t.imageSizes}:{}},u=e.elements.filter(m=>n.includes(m.id)),c=s&&l>0?i==="rectangular"?b`<rect x=${l/2} y=${l/2} width=${a.width-l} height=${a.height-l} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:b`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-l/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:f,h=i==="rectangular"?b`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:b`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return b`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${u.map(m=>or(m,a,d))}
    ${c}
  </svg>`}function J(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var Vt=["rectangular","circular","corner","inline"];function cn(e){return te.includes(e)}function Ps(e){return Vt.filter(n=>e.supportedFamilies.includes(n))}function ur(e){return te.find(n=>e.supportedFamilies.includes(n))}function Li(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function Hu(){return{value:F("")}}function Os(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=Vt.filter(t=>t===n||e.supportedFamilies.includes(t))),cn(n)?e.perFamily[n]||(e.perFamily[n]=Qe()):e.inline||(e.inline=Hu()),e.schemaVersion=In(e)}function Ds(e,n){if(Li(e,n)){if(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),cn(n)){for(let t of Ue(e,n))et(e,t.payload.id);delete e.perFamily[n],Ne(e)}else delete e.inline;e.schemaVersion=In(e)}}function Vs(e,n){let t=[];if(!cn(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=Ue(e,n).filter(r=>!de(e,r)).length;return a>0&&t.push(`${a} layer${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var me={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},un={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",shape:"Shape",image:"Picture",tap:"Tap area"},pr=["text","icon","gauge","chart","timeline","shape","image","tap"],ee={states:"#f9a825",tap:me.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var Bs="2.8.0";function hr(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function Lu(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function Gs(e,n=Bs){let t=hr(e),i=hr(n);return!t||!i?!1:Lu(t,i)>=0}function Us(e,n=Bs){return`${hr(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${n} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var Ks="52a9d81d0fd7";var Ws="11fa18406cea";var ke="mdi:";function _u(e){return e.trim().replace(/\./g,"-")}function Nu(e){return e.trim().replace(/-/g,".")}var _i=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>Nu(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=_u(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Ke(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return b`<svg x="0" y="0" width=${t} height=${t} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},Ni=class{constructor(n,t="symbol-icons.json.gz",i=Ks){this.onReady=n;this.file=t;this.digest=i;this.icons=new Map;this.state="idle"}path(n){return this.load(),this.icons.get(n.trim())?.[0]}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=Ke(i)??{color:"#FFFFFF",opacity:1};return b`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`${this.file}?v=${this.digest}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`${this.file}: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}},mr=class{constructor(n,t){this.sf=n;this.mdi=new Ni(t,"mdi-icons.json.gz",Ws)}render(n,t,i){return(n.trim().startsWith(ke)?this.mdi:this.sf).render(n,t,i)}available(){return this.sf.available()}names(){return this.sf.names()}mdiNames(){return this.mdi.names()}mdiPath(n){return this.mdi.path(n)}};function qs(e){let n=_i.available()?new _i(e):new Ni(e);return new mr(n,e)}function js(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var Pi=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],Oi=[...new Set(Pi.flatMap(e=>e.symbols))],zu={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function Pu(e){return`${e.replace(/\./g," ")} ${(zu[e]??[]).join(" ")}`}function fr(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=Pu(a);if(!t.every(s=>r.includes(s)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var zi=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}pack(n){return this.browsing.get(n)?.pack}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t,pack:this.pack(n)}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t,pack:this.pack(n)}),this.onChange()}setPack(n,t){this.browsing.set(n,{query:"",category:this.category(n),pack:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var Ou=100;function Ys(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var Bt=class e{constructor(n,t){this.config=n;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=t,sn(n),vt(n),this.baseline=JSON.stringify(bi(n))}static fromDocument(n,t){return new e(yi(n),t)}get dirty(){return JSON.stringify(bi(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t,i){let a=Date.now();t!==void 0&&t===this.coalesceKey&&a<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>Ou&&this.past.shift(),this.future=[]),this.coalesceKey=t,this.coalesceUntil=t===void 0?0:a+800;let o=structuredClone(this.config);n(o),sn(o,i),vt(o),this.config=o}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let n=this.past.pop();n&&(this.future.push(this.config),this.config=n,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push(this.config),this.config=n,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=nr(n),bi(n)}commit(){let n=structuredClone(this.config);return n.dataSources=nr(n),new e(n,null)}};var Di=class{constructor(){this.watched=new Map;this.onScroll=n=>this.mark(n.currentTarget);this.observer=new ResizeObserver(()=>{for(let n of this.watched.keys())this.mark(n)})}refresh(n){let t=new Set(n.filter(i=>i!=null));for(let[i,a]of[...this.watched])t.has(i)||this.drop(i,a);for(let i of t){let a=this.watched.get(i);a||(a=new Set,this.watched.set(i,a),i.addEventListener("scroll",this.onScroll,{passive:!0}),this.observer.observe(i));for(let r of a)r.parentElement!==i&&(this.observer.unobserve(r),a.delete(r));for(let r of i.children)a.has(r)||(a.add(r),this.observer.observe(r));this.mark(i)}}disconnect(){for(let[n,t]of[...this.watched])this.drop(n,t);this.observer.disconnect()}drop(n,t){n.removeEventListener("scroll",this.onScroll),this.observer.unobserve(n);for(let i of t)this.observer.unobserve(i);this.watched.delete(n)}mark(n){let t=n.scrollHeight-n.clientHeight,i=t>1;n.toggleAttribute("data-more-above",i&&n.scrollTop>1),n.toggleAttribute("data-more-below",i&&n.scrollTop<t-1)}};var pn={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",timeBetween:"is between times",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},it={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},Js=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Zs={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},gr=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],Du=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function yr(e){return Du.includes(e)}function Vu(e){return gr.includes(e)}function Bu(e,n){return JSON.stringify(oe(e))===JSON.stringify(oe(n))}function br(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!Vu(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${pn[l.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=l.value;else if(!Bu(t,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=Xs(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${it[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(n.otherwise){let r=Xs(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${it[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:Gu(i,n.otherwise),numberMode:i.length>0&&i.every(r=>yr(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function Xs(e){let n=new Set;for(let t of e){let i=Fe[t.kind];if(n.has(i))return i;n.add(i)}}function Gu(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(Fe[a.kind]);for(let i of n??[])t.add(Fe[i.kind]);return Js.filter(i=>t.has(i))}function Qs(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return Js.filter(a=>i.has(a)&&t.includes(a))}function Vi(e,n){return e.find(t=>Fe[t.kind]===n)}function el(e,n,t,i){let a=n.map(o=>({id:o.caseId??X(),when:{join:o.join??"all",tests:[{id:o.testId??X(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??X(),cases:a};return t&&(r.otherwise=t),r}function Xn(e){if(e.length===0)return"No states yet.";let n=br(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function tl(e){let n=e[0];return n||(n={id:X(),cases:[]},e.push(n)),n}function nl(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function il(e,n,t){let i=tl(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:X(),when:{join:"all",tests:[{id:X(),value:structuredClone(n),comparison:Ku(a,t)}]},then:[]})}function al(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),nl(e))}function vr(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function wr(e,n){if(n){tl(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,nl(e))}function rl(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function ol(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>Fe[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function Uu(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function sl(e,n=Uu){let t=()=>n(e.value??F(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??F(""))}`;case"timeBetween":return`${t()} to ${n(e.upper??F(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Pt(e.kind)==="value"?`${pn[e.kind]} ${t()}`:pn[e.kind]}}function Ku(e,n){if(!e)return n?{kind:"lessThan",value:F("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??F("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??F("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??F("0")};default:return{kind:e.kind,...Pt(e.kind)==="value"?{value:F("")}:{}}}}var ll={text:"text",icon:"icon",gauge:"color",chart:"color",timeline:"visibility",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function dl(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function Wu(e){switch(e){case"text":return b`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return b`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return b`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return b`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return b`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return b`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return b`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return b`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return b`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return b`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return b`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return b`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return b`<path d="M6 9L12 15L18 9" />`;case"plus":return b`<path d="M12 5V19M5 12H19" />`;case"watch":return b`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return b`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return b`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return b`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return b`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return b`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return b`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return b`<path d="M6 14L12 8L18 14" />`;case"down":return b`<path d="M6 10L12 16L18 10" />`;case"show":return b`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return b`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return b`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return b`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return b`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return b`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return b`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return b`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return b`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return b`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`}}function N(e){return p`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Wu(e)}</svg>`}var We="color-mix(in srgb, var(--k) 45%, #6b7280)",Bi='system-ui, -apple-system, "Segoe UI", sans-serif';function cl(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=u=>{let c=u*Math.PI/180;return{x:(e-t*Math.cos(c)).toFixed(2),y:(n-t*Math.sin(c)).toFixed(2)}},s=o(135),l=o(r),d=r-135>180?1:0;return`M${s.x} ${s.y}A${t} ${t} 0 ${d} 1 ${l.x} ${l.y}`}function xr(e,n,t,i){return b`<g fill="none" stroke-linecap="round">
    <path d=${cl(e,n,t,1)} stroke=${We} stroke-width="2.6" opacity=".5" />
    <path d=${cl(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function qu(e){switch(e){case"text":return b`<g font-family=${Bi} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${We}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${We}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${We}>1.2 kW</text>
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
        ${xr(22,24,12,.28)}
        ${xr(60,24,12,.62)}
        ${xr(98,24,12,.92)}
        <text x="60" y="27" font-family=${Bi} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return b`<g>
        <g opacity=".4" fill=${We}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;case"timeline":return b`<g>
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${We} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${We} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${We} opacity=".55" />
        <text x="6" y="39" font-family=${Bi} font-size="7" fill=${We}>1h ago</text>
        <text x="114" y="39" font-family=${Bi} font-size="7" text-anchor="end" fill=${We}>now</text>
      </g>`;case"shape":return b`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="6" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <rect x="40" y="11" width="2.5" height="24" fill="var(--k)" stroke="none" />
        <circle cx="63" cy="23" r="11" />
        <rect x="83" y="16" width="31" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
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
      </g>`}}function ul(e){return p`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${qu(e)}</svg>`}function hn(e,n){let t=new DOMPoint(n.clientX,n.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=t.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function kr(e,n){let t={...e,...n};return $r({...t,x:wt(t.x),y:wt(t.y),width:Math.max(.04,wt(t.width)),height:Math.max(.04,wt(t.height))})}function $r(e){let n=Math.min(.96,Math.max(-e.width+.04,e.x)),t=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:n,y:t}}var wt=e=>Math.round(e*1e3)/1e3,pl=10;function Cr(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return $r({...e,x:wt(a),y:wt(r)})}function hl(e,n,t,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?wt(a(e.x+n/i.w)):e.x,y:i.h>0?wt(a(e.y+t/i.h)):e.y}}function Gi(e,n,t,i,a){let r=hn(e,t),o={...i.frame},s=o;e.setPointerCapture(t.pointerId);let l=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==t.pointerId)return;let m=hn(e,h),g=(m.x-r.x)/n.width,v=(m.y-r.y)/n.height,$;if(!i.handle)$=$r({...o,x:l(o.x+g),y:l(o.y+v)});else{let{x:S,y:T,width:k,height:C}=o,_=o.x+o.width,D=o.y+o.height;i.handle.includes("e")&&(k=Math.max(.04,o.width+g)),i.handle.includes("s")&&(C=Math.max(.04,o.height+v)),i.handle.includes("w")&&(k=Math.max(.04,o.width-g),S=_-k),i.handle.includes("n")&&(C=Math.max(.04,o.height-v),T=D-C),$={...o,x:l(S),y:l(T),width:l(k),height:l(C)}}s=$,a.onFrame(i.elementId,$,!1)},u=h=>{h.pointerId===t.pointerId&&(c(),a.onFrame(i.elementId,s,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",u),e.removeEventListener("pointercancel",u);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",u),e.addEventListener("pointercancel",u),c}function ml(e,n,t,i,a){let r=hn(e,t),o=i;e.setPointerCapture(t.pointerId);let s=h=>Math.round(h*1e3)/1e3,l=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==t.pointerId)return;let m=hn(e,h),g=n.w>0?l(i.x+(m.x-r.x)/n.w):i.x,v=n.h>0?l(i.y+(m.y-r.y)/n.h):i.y;o={x:s(g),y:s(v)},a(o.x,o.y,!1)},u=h=>{h.pointerId===t.pointerId&&(c(),a(o.x,o.y,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",u),e.removeEventListener("pointercancel",u);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",u),e.addEventListener("pointercancel",u),c}function fl(e,n,t,i,a){let r=hn(e,n),o=1;e.setPointerCapture(n.pointerId);let s=u=>{if(u.pointerId!==n.pointerId)return;let c=hn(e,u),h=(c.x-r.x)*(t.includes("e")?1:-1),m=(c.y-r.y)*(t.includes("s")?1:-1),g=i.w>0?(i.w+h)/i.w:1,v=i.h>0?(i.h+m)/i.h:1,$=Math.abs(g-1)>=Math.abs(v-1)?g:v;o=Math.max(.05,$),a(o,!1)},l=u=>{u.pointerId===n.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",s),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",s),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),d}var gl="sun.sun";function yl(e){let n=e?.[gl],t=typeof n?.attributes?.friendly_name=="string"?n.attributes.friendly_name.trim():"";return{entityId:gl,displayName:t||"Sun",domain:"sun"}}var bl=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],ju=[0,1,2,3,4];function vl(e){let n=[];for(let t of e??[]){let i=t.trim();if(i==="")continue;let a=Number(i);Number.isInteger(a)&&a>=0&&a<=6&&!n.includes(a)&&n.push(a)}return n.sort((t,i)=>t-i)}function Sr(e){return[...new Set(e)].filter(n=>n>=0&&n<=6).sort((n,t)=>n-t).map(String)}var wl=[{kind:"afterSunset",label:"After sunset",hint:"True from sunset to sunrise, from the sun entity's own state."},{kind:"daytime",label:"Daytime",hint:"True while the sun is up."},{kind:"sunElevation",label:"Sun below an angle",hint:"The sun's elevation in degrees, below a number you set. 0 is the horizon."},{kind:"weekday",label:"Weekday is one of",hint:"A row of days, starting on Monday to Friday."},{kind:"timeBetween",label:"Time between",hint:"A clock window that may wrap midnight, starting at 22:00 to 06:00."}];function Yu(e){return[xl(e,"below_horizon")]}function Xu(e){return[xl(e,"above_horizon")]}function xl(e,n){return{id:X(),value:{kind:{kind:"entityState",...e}},comparison:{kind:"equals",value:F(n)}}}function Ju(e,n=0){return[{id:X(),value:{kind:{kind:"entityAttribute",...e,attribute:"elevation"}},comparison:{kind:"lessThan",value:F(String(n))}}]}function Zu(e=ju){return[{id:X(),value:{kind:{kind:"time",timeField:"weekday"}},comparison:{kind:"isOneOf",options:Sr(e)}}]}function Qu(e="22:00",n="06:00"){return[{id:X(),value:{kind:{kind:"time",timeField:"now"}},comparison:{kind:"timeBetween",value:F(e),upper:F(n)}}]}function kl(e,n){switch(e){case"afterSunset":return Yu(n);case"daytime":return Xu(n);case"sunElevation":return Ju(n);case"weekday":return Zu();case"timeBetween":return Qu()}}function ep(e){switch(e){case"light":return b`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return b`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return b`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return b`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return b`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return b`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return b`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return b`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return b`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return b`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return b`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return b`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return b`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return b`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return b`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return b`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return b`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return b`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return b`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return b`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return b`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return b`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return b`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return b`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return b`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return b`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return b`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return b`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return b`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return b`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return b`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function Er(e){return p`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ep(e)}</svg>`}var tp={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function $l(e){let n=tp[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var np=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function Tr(e){return np.has(e.trim().toLowerCase())}var Hr=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function fe(e){return n=>e(n.target.value)}function Wl(e){return e===void 0||e.atDefault?f:p`<button type="button" class="icon tiny reset" title=${e.title} aria-label=${e.title}
    @click=${n=>{n.preventDefault(),n.stopPropagation(),e.reset()}}>${N("reset")}</button>`}function rt(e,n){let t=Wl(n);return t===f?p`<span>${e}</span>`:p`<span class="has-reset">${e}${t}</span>`}function fn(e,n,t,i=a=>String(a)){if(n===void 0)return;let a=n;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>t(a)}}function pe(e,n,t,i={}){return p`<label class="field">${rt(e,fn(n,i.def,t,a=>a===""?"empty":a))}
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${fe(t)} /></label>`}function ql(e,n,t,i=3){return p`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${fe(t)}></textarea></label>`}function ne(e,n,t,i={}){let a=n===void 0||Number.isNaN(n)?"":String(n),r=p`<input type="number" .value=${a} step=${i.step??"any"} min=${i.min??f} max=${i.max??f}
      @input=${fe(o=>{if(o.trim()===""){i.optional&&t(void 0);return}let s=Number(o);Number.isNaN(s)||t(s)})} />`;return p`<label class="field">${rt(e,fn(n,i.def,t))}${r}</label>`}function Re(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return p`<label class="field">${rt(e,fn(n,a.def,i,r))}
    <select @change=${fe(o=>i(o))}>
      ${t.map(([o,s])=>p`<option value=${o} ?selected=${o===n}>${s}</option>`)}
    </select></label>`}function Z(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return p`<div class="field seg-field">${rt(e,fn(n,a.def,i,r))}
    <div class="seg wide" role="radiogroup" aria-label=${e}>
      ${t.map(([o,s])=>p`<button type="button" role="radio" aria-checked=${o===n?"true":"false"}
        class=${o===n?"on":""} title=${a.titles?.[o]??f}
        @click=${()=>{o!==n&&i(o)}}>${s}</button>`)}
    </div></div>`}function Zn(e,n,t,i){let a=i.format??(r=>String(Math.round(r*100)/100));return p`<div class="field slider">${rt(e,fn(n,i.def,t,a))}
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)}
        @input=${fe(r=>{let o=Number(r);Number.isNaN(o)||t(o)})} />
      <span class="slider-value mono">${a(n)}</span>
    </div></div>`}function Ui(e,n,t,i,a,r){let o=s=>Math.round(s*1e3)/10;return ne(e,o(n),s=>t((s??0)/100),{min:a,max:r,step:.5,def:o(i)})}function Ce(e,n,t,i){return p`<label class="field check"><input type="checkbox" .checked=${n} @change=${a=>t(a.target.checked)} />${rt(e,fn(n,i,t,a=>a?"on":"off"))}</label>`}function se(e,n,t,i=!1,a){let r=(n??"").replace(/^#/,""),o=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(r),s=o?`#${r.slice(0,6)}`:"#ffffff",l=o&&r.length===8?Math.round(parseInt(r.slice(6,8),16)/255*100):100,d=(c,h)=>{let m=c.replace(/^#/,"").toUpperCase();return h>=100?`#${m}`:`#${m}${Math.round(h/100*255).toString(16).padStart(2,"0").toUpperCase()}`},u=a===void 0?void 0:{atDefault:ip(n,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>t(a??void 0)};return p`<div class="field color">${rt(e,u)}
    <div class="color-row">
      ${i?p`<input type="checkbox" title="Enabled" .checked=${n!==void 0} @change=${c=>t(c.target.checked?d(s,l):void 0)} />`:f}
      <input type="color" .value=${s} ?disabled=${i&&n===void 0} @input=${fe(c=>t(d(c,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&n===void 0} @input=${fe(c=>t(d(s,Number(c))))} />
      <input type="text" class="mono hex" .value=${n??""} placeholder="#RRGGBB" ?disabled=${i&&n===void 0}
        @input=${fe(c=>{let h=c.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h)&&t(h.startsWith("#")?h.toUpperCase():`#${h.toUpperCase()}`)})} />
    </div></div>`}function ip(e,n){return e===void 0||n===void 0?e===n:e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function jl(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function ap(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=t?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function Cl(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var Yl=50;function rp(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function op(e,n,t=Yl,i){let a=n.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,d)=>r(l)-r(d))).slice(0,t);let o=a.split(/\s+/),s=[];for(let l of e){let d=l.entityId.toLowerCase(),u=l.name.toLowerCase(),c=(l.area??"").toLowerCase(),h=-1;d===a?h=0:d.startsWith(a)?h=1:u.startsWith(a)?h=2:d.includes(a)?h=3:u.includes(a)?h=4:o.length>1&&o.every(m=>d.includes(m)||u.includes(m))?h=5:c!==""&&(c.includes(a)||o.length>1&&o.every(m=>d.includes(m)||u.includes(m)||c.includes(m)))&&(h=6),h>=0&&s.push({c:l,rank:h})}return s.sort((l,d)=>l.rank-d.rank||r(l.c)-r(d.c)||l.c.name.localeCompare(d.c.name)||l.c.entityId.localeCompare(d.c.entityId)),s.slice(0,t).map(l=>l.c)}var sp=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function Xl(e){return sp.test(e.trim())}function lp(e,n,t){let i=e.trim();if(i!==n.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in t)return jl(t,i);if(Xl(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var Ut=new Map;function He(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function Jl(e){return Ut.has(e)}function at(e,n,t,i,a,r={}){let o=e.hass.states,s=Ut.get(a),l=s?op(ap(o,r.domain,Cl(e.hass)),s.query,Yl,r.preferNumeric?rp:void 0):[],d=s?Math.max(0,Math.min(s.index,l.length-1)):0,u=t.entityId?o[t.entityId]:void 0,c=(k,C,_=0)=>{Ut.set(a,{query:C,index:_}),He(k)},h=k=>{Ut.delete(a),He(k)},m=k=>{let C=lp(k,t,o);C&&i(C)},g=(k,C)=>{i(jl(o,k.entityId)),h(C)},v=()=>Math.max(0,Math.min(Ut.get(a)?.index??0,l.length-1)),$=k=>{let C=k.target;if(k.key==="ArrowDown"||k.key==="ArrowUp"){k.preventDefault();let _=Ut.get(a);if(!_){c(C,C.value);return}let D=k.key==="ArrowDown"?v()+1:v()-1;c(C,_.query,Math.max(0,Math.min(l.length-1,D))),dp(C);return}if(k.key==="Enter"){k.preventDefault();let _=l[v()];s&&_?g(_,C):(m(C.value),h(C));return}if(k.key==="Escape"){if(!s)return;k.preventDefault(),k.stopPropagation(),h(C)}},S=t.entityId?Cl(e.hass)?.(t.entityId):void 0,T=t.entityId===""?p`<div class="hint">Type part of a name, a room, or an id.</div>`:u?p`<div class="entity-current">
          <span class="ent-ico ${Tr(u.state)?"on":""}">${Er(t.domain||t.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof u.attributes.friendly_name=="string"?u.attributes.friendly_name:t.entityId}</span>
          ${S?p`<span class="ent-area">${S}</span>`:f}
          <span class="ent-state">${u.state}</span>
        </div>`:p`<div class="hint warn">Not in Home Assistant right now.</div>`;return p`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-box ${s?"open":""} ${r.needed&&t.entityId===""?"needs":""}">
      <span class="ent-glass">${N("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:t.entityId}
        placeholder="Search by name, room, or id"
        @focus=${k=>{let C=k.target;c(C,t.entityId),C.select()}}
        @input=${k=>{let C=k.target;c(C,C.value)}}
        @keydown=${$}
        @blur=${k=>{let C=k.target;s&&m(C.value),h(C)}} />
      ${(s?s.query:t.entityId)===""?f:p`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${k=>k.preventDefault()}
        @click=${k=>{let C=k.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),Ut.set(a,{query:"",index:0}),He(C),C?.focus()}}>${N("close")}</button>`}
    </div>
    ${s?p`<div class="entity-results" role="listbox">
          ${l.length===0?p`<div class="hint" style="padding:6px 8px">${Xl(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map((k,C)=>p`<button type="button" role="option" aria-selected=${C===d?"true":"false"} class="ent ${C===d?"hl":""}"
                @mousedown=${_=>_.preventDefault()} @click=${_=>g(k,_.target)}>
                <span class="ent-ico ${Tr(k.state)?"on":""}">${Er(k.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${k.name}</span>
                  <span class="ent-sub">
                    ${k.area?p`<span class="ent-area">${k.area}</span>`:f}
                    <span class="ent-id mono">${k.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${$l(k.domain)}</span>
                  <span class="ent-state">${k.state}</span>
                </span>
              </button>`)}
        </div>`:T}
  </div>`}function dp(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var Sl=120;function cp(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(Pi.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(Oi),fromPack:!1}}function El(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function up(e){return[{value:"",label:`Starter set (${El(Oi,e)})`},...Pi.map(n=>({value:n.name,label:`${n.name} (${El(n.symbols,e)})`}))]}function pp(e){return e.length>0?e.length:Oi.length}function Tl(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function Ki(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return p`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??p`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function Zl(e,n,t,i,a){let r=e.symbols,o=r.isOpen(i),s=r.query(i),l=e.icons.names(),d=l??[],u=new Set(d),c=n.trim(),h=c.startsWith(ke),m=a!==void 0,g=m?r.pack(i)??(h?"mdi":"sf"):"sf",v=hp(c,u),$=k=>{t(k),a?.(k.startsWith(ke)?e.icons.mdiPath?.(k):void 0),r.noteUsed(k)},S=k=>{if(t(k),!m)return;let C=k.trim();a?.(C.startsWith(ke)?e.icons.mdiPath?.(C):void 0)},T=f;if(o&&g==="mdi"){let k=e.icons.mdiNames?.(),C=mp(k??[],s),_=C.slice(0,Sl),D=r.recent.filter(V=>V.startsWith(ke));T=p`<div class="sym-browse">
      ${Fl(r,i,g)}
      <div class="sym-controls">
        <input type="search" placeholder="Search Material Design icons" .value=${s} @input=${fe(V=>r.setQuery(i,V))} />
      </div>
      ${D.length===0?f:p`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${D.map(V=>Ki(e,V,V===c,$))}</div>`}
      <div class="sym-grid">${_.map(V=>Ki(e,V,V===c,$))}</div>
      ${k===void 0?p`<div class="hint">Loading the Material Design catalogue.</div>`:C.length===0?p`<div class="hint">Nothing matches that search. Any <code>mdi:</code> name can still be typed above.</div>`:p`<div class="hint">${Tl(_.length,C.length,!0,k.length)}</div>`}
      ${k!==void 0&&h&&!k.includes(c)?p`<div class="hint warn">There is no <code>${c}</code> in this build's Material Design set, so the watch draws a question mark.</div>`:f}
    </div>`}else if(o){let k=r.category(i),C=cp(k,s,d,u),_=fr(C.names,s),D=C.fromPack?_.slice(0,Sl):_,V=r.recent.filter(w=>!w.startsWith(ke)),ie=u.size===0?V:V.filter(w=>u.has(w));T=p`<div class="sym-browse">
      ${m?Fl(r,i,g):f}
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${s} @input=${fe(w=>r.setQuery(i,w))} />
        <select @change=${fe(w=>r.setCategory(i,w))}>
          ${up(u).map(w=>p`<option value=${w.value} ?selected=${w.value===k}>${w.label}</option>`)}
        </select>
      </div>
      ${ie.length===0?f:p`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${ie.map(w=>Ki(e,w,w===c,$))}</div>`}
      <div class="sym-grid">${D.map(w=>Ki(e,w,w===c,$))}</div>
      ${_.length===0?p`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:p`<div class="hint">
            ${Tl(D.length,_.length,s.trim()!=="",pp(d))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?p`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:p`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return p`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${fe(S)} @change=${fe(k=>{let C=k.trim();C.startsWith(ke)?e.icons.mdiPath?.(C)!==void 0&&r.noteUsed(k):(u.size===0||u.has(C))&&r.noteUsed(k)})} /></label>
    ${v?p`<div class="hint warn">The installed icon pack has no <code>${c}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>r.toggle(i)}>${o?"Hide symbols":"Browse symbols"}</button>
    ${T}`}function hp(e,n){let t=e.trim();return t!==""&&!t.startsWith(ke)&&n.size>0&&!n.has(t)}function mp(e,n){let t=n.trim(),i=t.startsWith(ke)?t.slice(ke.length):t,a=e.map(r=>r.startsWith(ke)?r.slice(ke.length):r);return fr(a,i).map(r=>ke+r)}function Fl(e,n,t){return p`<div class="seg wide" role="radiogroup" aria-label="Icon set">
    ${[["sf","SF Symbols"],["mdi","Material Design Icons"]].map(([a,r])=>p`<button type="button" role="radio" aria-checked=${a===t?"true":"false"}
      class=${a===t?"on":""}
      @click=${()=>{a!==t&&e.setPack(n,a)}}>${r}</button>`)}
  </div>`}var fp=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"],["chartStat","A chart's number"]],gp=[["bars","Bars"],["line","Line"],["area","Area"]],yp=[["auto","Auto"],["fixed","Fixed range"]],bp=[["lowest","Lowest value"],["zero","Zero"]],Ql=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],vp=[["none","None"],["pointer","Triangle & dot"],["dot","Dots"]],Ml=[["uniform","One colour"],["bands","By value"]];function Rl(e){let n=[Ca,"#FFD60A"];if(e.length<2)return n.map((o,s)=>({id:X(),upTo:(s+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,s)=>({id:X(),upTo:r(t+a*(s+1)/3),colorHex:o}))}function wp(e){if(e.length===0)return 0;let n=Math.min(...e),t=Math.max(...e),i=t-n;return Number(((n+t)/2).toFixed(i>=10?0:2))}function xp(e,n){let t=Nn({bands:e}),i=t.at(-1),a=e.length>1?Math.abs(t[1].upTo-t[0].upTo):10;return{id:X(),upTo:(i?.upTo??0)+(a||10),colorHex:n}}function Il(e,n,t){return p`
    ${e.bands.map((i,a)=>p`
      <div class="row-inline">
        ${ne("Up to",i.upTo,r=>t(o=>{let s=o.bands[a];s&&(s.upTo=r??0)},`bup${i.id}`))}
        ${se("Colour",i.colorHex,r=>t(o=>{let s=o.bands[a];s&&(s.colorHex=r??"#FFFFFF")},`bcol${i.id}`))}
        <button class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${()=>t(r=>{r.bands=r.bands.filter((o,s)=>s!==a)})}>${N("close")}</button>
      </div>`)}
    <button class="small" @click=${()=>t(i=>{i.bands=[...i.bands,xp(i.bands,n)]})}>Add band</button>
    ${se("And the rest",e.bandAboveColorHex,i=>t(a=>{a.bandAboveColorHex=i??ht},"babove"),!1,ht)}`}function kp(e,n,t,i){let a=new Map,r=new Map,o=(d,u)=>{let c=d.trim();if(c==="")return;let h=c.toLowerCase();r.has(h)||r.set(h,c),a.set(h,(a.get(h)??0)+u)};e.forEach((d,u)=>{let c=e[u+1],h=c===void 0?n:c.offsetSeconds;o(d.state,Math.max(0,h-d.offsetSeconds))}),t!==void 0&&o(t,0),(za[i??""]??[]).forEach(d=>o(d,0));let s=["unavailable","unknown"];return[...[...a.entries()].filter(([d])=>!s.includes(d)).sort((d,u)=>u[1]-d[1]).map(([d])=>r.get(d)??d),...s]}function $p(e,n,t=[],i="wa-timeline-states"){let a=new Set(e.bands.map(o=>o.match.trim().toLowerCase())),r=t.find(o=>!a.has(o.toLowerCase()))??"";return p`
    ${e.bands.map((o,s)=>p`
      <div class="row-inline">
        ${pe("State",o.match,l=>n(d=>{let u=d.bands[s];u&&(u.match=l)},`tmatch${o.id}`),{placeholder:"on",list:i})}
        ${se("Colour",o.colorHex,l=>n(d=>{let u=d.bands[s];u&&(u.colorHex=l??gt)},`tcol${o.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${()=>n(l=>{l.bands=l.bands.filter((d,u)=>u!==s)})}>${N("close")}</button>
      </div>`)}
    <datalist id=${i}>${t.map(o=>p`<option value=${o}></option>`)}</datalist>
    <button class="small" @click=${()=>n(o=>{o.bands=[...o.bands,{id:X(),match:r,colorHex:li(r)}]})}>${r===""?"Add state":`Add ${r}`}</button>
    ${se("Otherwise",e.otherColorHex,o=>n(s=>{s.otherColorHex=o??gt},"tother"),!1,gt)}`}var Cp=[["arc","Arc"],["ring","Ring"],["bar","Bar"],["dots","Dots"]],Sp={arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar",dots:"One dot per unit, the first few filled"};function Al(e){let n=e.value.kind;if(n.kind==="aggregate"){let{stateFilter:t,...i}=n.aggregate;return{kind:{kind:"aggregate",aggregate:{...i,function:"count"}}}}return F(String(Math.max(1,Math.round(e.maxValue-e.minValue))))}var Ep=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function Tp(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"}}}function ae(e,n,t,i){if(i.inline||!Fp())return p`<div class="value-editor">${nd(e,n,t,i)}</div>`;let a=Lr(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,s=ge(n,ye(e)),l="entityId"in n.kind;return p`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?f:p`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?f:p`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${ed(e,a,r,n,t,i)}
  </div>`}function ed(e,n,t,i,a,r){return p`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${td}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${Qn.has(n)?nd(e,i,a,r):f}
  </div>`}function ye(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function Lr(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function Fp(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var Qn=new Set,Jn=new WeakMap;function Mp(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function Rp(e,n){let t=e instanceof Node?e:null;if(!t)return;let i=t.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(n)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function td(e){let n=e.currentTarget,t=e.newState==="open",i=Jn.get(n);if(i&&(i(),Jn.delete(n)),!t){Qn.delete(n.id)&&He(n);return}let a=Mp(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){Jn.get(n)?.(),Jn.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}Fr(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),Jn.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Fr(n,a.getBoundingClientRect()),Qn.has(n.id)||(Qn.add(n.id),He(n),requestAnimationFrame(()=>{n.isConnected&&Fr(n,a.getBoundingClientRect())}))}function Fr(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=Ip({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Gt=8,Wi=6,Hl=140;function Ip(e,n,t){let i=t.height-e.bottom-Wi-Gt,a=e.top-Wi-Gt,r=n.height>i&&a>i&&i<Hl,o=Math.max(Hl,r?a:i),s=Math.min(n.height,o),l=Math.max(Gt,Math.min(e.left,t.width-n.width-Gt)),d=r?Math.max(Gt,e.top-Wi-s):Math.max(Gt,Math.min(e.bottom+Wi,t.height-s-Gt));return{left:l,top:d,maxHeight:o,above:r}}function nd(e,n,t,i){let a=n.kind,r=u=>t({...n,kind:u}),o=i.key,s=fp.filter(([u])=>i.allowNamed!==!1||u!=="named"),l=f;switch(a.kind){case"literal":l=i.symbol?Zl(e,a.value,u=>r({...a,value:u}),o,i.setSymbolPath):pe("Text",a.value,u=>r({...a,value:u}));break;case"entityState":case"entityAge":l=at(e,"Entity",a,u=>r({...a,...u}),`${o}-entity`);break;case"entityAttribute":{let u=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),c=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=p`${at(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${pe("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:c,mono:!0})}
        <datalist id=${c}>${u.map(h=>p`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":l=Hp(e,a.aggregate,u=>r({...a,aggregate:u}),o);break;case"time":l=Re("Field",a.timeField,Ep,u=>r({...a,timeField:u}));break;case"dataAge":l=p`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":l=p`${ql("Template",a.value,u=>r({...a,value:u}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":l=e.config.values.length===0?p`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:Re("Value",a.id,[["","(choose)"],...e.config.values.map(u=>[u.id,u.name||u.id.slice(0,8)])],u=>r({...a,id:u}));break;case"chartStat":{let u=ye(e),c=e.config.elements.filter(h=>h.kind==="chart");l=c.length===0?p`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:p`
          ${Re("Chart",a.layer,[["","(choose)"],...c.map(h=>[h.payload.id,Ie(h,u)])],h=>r({...a,layer:h}))}
          ${Re("Number",a.stat,[...Zt],h=>r({...a,stat:h}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Unit to print the entity's unit after it."}</div>`;break}}let d=i.showResolved?e.resolve(n):void 0;return p`
    ${Re("Source",a.kind,s,u=>r(Tp(a,u)))}
    ${l}
    ${i.noFormat?f:Ap(n.format,u=>t(Ge(u)?{kind:n.kind}:{...n,format:u}))}
    ${i.showResolved?p`<div class="hint">Now: ${d===void 0?p`<span class="warn">unresolved</span>`:p`<code>${d}</code>`}</div>`:f}`}function Ap(e,n){let t=e??{},i=a=>{let r={...t,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];n(r)};return p`<details class="sub" ?open=${!Ge(e)}>
    <summary>Format${Ge(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${ne("Decimals",t.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${ne("Multiply",t.multiply,a=>i({multiply:a}),{optional:!0})}
      ${ne("Offset",t.offset,a=>i({offset:a}),{optional:!0})}
      ${Z("Case",t.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${pe("Prefix",t.prefix??"",a=>i({prefix:a}))}
      ${pe("Suffix",t.suffix??"",a=>i({suffix:a}))}
    </div>
    ${Ce("Append the entity's unit",!!t.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${Z("Seconds as",t.duration?"duration":t.relativeTime?"relativeTime":"",[["","None"],["relativeTime","Time ago"],["duration","Duration"]],a=>i({relativeTime:a==="relativeTime",duration:a==="duration"}),{titles:{relativeTime:"45s, 2m, 3h",duration:"1h 23m, 45s"}})}
  </details>`}function Hp(e,n,t,i){let a=s=>s.join(", "),r=s=>s.split(",").map(l=>l.trim()).filter(Boolean),o=n.scope;return p`
    ${Re("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],s=>t({...n,function:s}))}
    ${Z("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],s=>t({...n,scope:s==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?p`<div class="grid2">
          ${pe("Domains",a(o.domains),s=>t({...n,scope:{...o,domains:r(s)}}),{placeholder:"light, switch"})}
          ${pe("Area ids",a(o.areaIds),s=>t({...n,scope:{...o,areaIds:r(s)}}))}
          ${pe("Label ids",a(o.labelIds),s=>t({...n,scope:{...o,labelIds:r(s)}}))}
          ${pe("Floor ids",a(o.floorIds),s=>t({...n,scope:{...o,floorIds:r(s)}}))}
        </div>`:p`${o.entities.map((s,l)=>p`<div class="row-inline">
            ${at(e,`Entity ${l+1}`,s,d=>{let u=[...o.entities];u[l]=d,t({...n,scope:{...o,entities:u}})},`${i}-agg-${l}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,scope:{...o,entities:o.entities.filter((d,u)=>u!==l)}})}>${N("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${Re("Only count when",n.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],s=>{let l={...n};s===""?delete l.stateFilter:s==="equals"||s==="notEquals"?l.stateFilter={kind:s,value:n.stateFilter&&"value"in n.stateFilter?n.stateFilter.value:""}:l.stateFilter={kind:s},t(l)})}
    ${n.stateFilter&&"value"in n.stateFilter?pe("State",n.stateFilter.value,s=>t({...n,stateFilter:{kind:n.stateFilter.kind,value:s}})):f}
    ${n.function==="count"?f:pe("Attribute (blank = state)",n.attribute??"",s=>{let l={...n};s?l.attribute=s:delete l.attribute,t(l)})}`}var id=Va,Lp=id.filter(([e])=>e!=="none");function _p(e){if("entityId"in e)return{entityId:e.entityId,displayName:e.displayName,domain:e.domain};if(e.type==="callService")return e.target}function ad(e,n){let t=_p(n)??{entityId:"",displayName:"",domain:""};if(e==="callService"){let i=n.type==="callService"?{...n}:{type:"callService",serviceDomain:"",serviceName:""};return t.entityId!==""&&(i.target=t),i}return Ko(e)?{type:e,...t}:{type:e}}var Np=[["Open a cover","cover","open_cover",""],["Close a cover","cover","close_cover",""],["Stop a cover","cover","stop_cover",""],["Lock","lock","lock",""],["Unlock","lock","unlock",""],["Light brightness","light","turn_on",'{"brightness_pct": 50}'],["Climate target","climate","set_temperature",'{"temperature": 21}'],["Play / pause","media_player","media_play_pause",""],["Start a vacuum","vacuum","start",""],["Send a vacuum home","vacuum","return_to_base",""]];function rd(e,n,t,i){let a=n.serviceDataJSON??"",r=Wo(a),o=n.target??{entityId:"",displayName:"",domain:""};return p`
    <div class="gen-row">
      ${pe("Domain",n.serviceDomain,s=>t({...n,serviceDomain:s.trim()},"svc-domain"),{placeholder:"light"})}
      ${pe("Service",n.serviceName,s=>t({...n,serviceName:s.trim()},"svc-name"),{placeholder:"turn_on"})}
    </div>
    <div class="chips">
      ${Np.map(([s,l,d,u])=>p`
        <button class="small" title=${`Fill in ${l}.${d}`}
          @click=${()=>{let c={...n,serviceDomain:l,serviceName:d};u===""?delete c.serviceDataJSON:c.serviceDataJSON=u,t(c)}}>${s}</button>`)}
    </div>
    ${at(e,"Target entity (optional)",o,s=>{let l={...n};s.entityId===""?delete l.target:l.target=s,t(l,"svc-entity")},`${i}-svc-entity`)}
    ${ql("Data (JSON)",a,s=>{let l={...n};s.trim()===""?delete l.serviceDataJSON:l.serviceDataJSON=s,t(l,"svc-data")},3)}
    ${r?p`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`:p`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`}function zp(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function od(e){let n=e.config,t=n.tapAction,i=zp(e.savedName,n.name),a=n.refreshMinutes??0,r=Ll.map(s=>[String(s),_l(s)]);Ll.includes(a)||r.push([String(a),_l(a)]);let o=n.showSuccessFlash??!0;return p`
    <div class="gen-row">
      ${pe("Name",n.name,s=>e.update(l=>{l.name=s},"name"))}
      ${Re("Refresh",String(a),r,s=>e.update(l=>{l.refreshMinutes=Number(s)||0},"refresh"))}
      ${Re("Tap action",t.type,id,s=>e.update(l=>{l.tapAction=ad(s,l.tapAction),s!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${o} title="Flash when a tap works"
            @change=${s=>e.update(l=>{l.showSuccessFlash=s.target.checked})} />
          ${o?p`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??Pp).slice(0,7)}
                @input=${fe(s=>e.update(l=>{l.successFlashColorHex=s.toUpperCase()},"flash"))} />`:p`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${i?p`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in t?at(e,"Target",t,s=>e.update(l=>{l.tapAction={type:t.type,...s}},"tap-entity"),"general-tap"):f}
    ${t.type==="callService"?rd(e,t,(s,l)=>e.update(d=>{d.tapAction=s},l),"general-tap"):f}
    ${t.type==="openPage"?Op(e):f}`}var Pp="#808080",Ll=[0,15,30,60,120];function _l(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function Op(e){let n=e.config;return sd(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function sd(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?p`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:p`${Re("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?f:p`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function ld(e,n){let t=e.config.values.findIndex(a=>a.id===n.id),i=`nv-${n.id}`;return p`
    ${pe("Name",n.name,a=>e.update(r=>{r.values[t].name=a},`${i}-name`))}
    ${ae(e,n.value,a=>e.update(r=>{r.values[t].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${Nl(e.config,n.id)} layer${Nl(e.config,n.id)===1?"":"s"}.</div>`}function Nl(e,n){return JSON.stringify(e.elements).split(`"${n}"`).length-1+JSON.stringify(e.perFamily).split(`"${n}"`).length-1}function dd(){return{id:X(),name:"Value",value:F("")}}function Ee(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function xe(e,n,t,i,a=!1){let r=e.elements.find(u=>u.payload.id===t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let s=Ee(e,n,r),d={...o.placements[t]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};a&&delete d.size,o.placements[t]=d}function qi(e,n,t,i,a){let r=n.payload.id,o=vi(n)??a.min,s=Ee(e.config,t,n).size??o;return ne(`${i} (pt)`,s,l=>e.update(d=>xe(d,t,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min,...a.def===void 0?{}:{def:a.def}})}function cd(e,n,t){let i=e.perFamily[t]??(e.perFamily[t]=Qe()),a=Ue(e,n).filter(l=>!de(e,l));if(a.length===0)return;let r=on(e,a.map(l=>l.payload.id),n),o=At(e,r,{nudge:!1}),s=e.perFamily[n];for(let l of o){let d=e.elements.find(m=>m.payload.id===l);if(!d)continue;let u=s?.placements[l],c=u?.size??vi(d),h={frame:{...u?.frame??d.payload.frame},isHidden:u?.isHidden??!1,...c!==void 0?{size:c}:{}};for(let m of te)m!==t&&delete e.perFamily[m]?.placements[l];i.placements[l]=Ka(h,n,t,d.kind)}sn(e,t)}function ta(e,n){return us(e,n)}function Dp(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function Vp(e){return e.kind==="image"||e.kind==="tap"||e.kind==="timeline"?void 0:e.payload.colorSlot.baseColorHex}function ud(e,n,t){let i=Dp(t.map(l=>Ee(e,n,l).isHidden)),a=t.map(Vp),r=t.length>0&&a.every(l=>l!==void 0),o=a[0],s=r&&o!==void 0&&a.every(l=>l!==void 0&&l.toUpperCase()===o.toUpperCase());return{hiddenHere:i,colourable:r,colour:s?o:void 0}}var _r=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]],Bp=[["leading","Left"],["center","Center"],["trailing","Right"]],Gp=[["1","1"],["2","2"]];function Up(e,n,t){let i=n.payload.id,a=ki(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"&&n.payload.source==="camera",s={...o?{domain:"camera"}:{},needed:zl(n)},l=d=>{let u=e.hass.states[d]?.attributes?.device_class;return typeof u=="string"?u:void 0};return p`
    ${at(e,o?"Camera":"Entity",r,d=>e.update(u=>ps(u,i,d,l(d.entityId)),`${t}-entity`),`${t}-layer-entity`,s)}
    <div class="hint ${zl(n)?"warn":""}">${qp(n,a)}</div>`}function zl(e){return e.kind==="timeline"?e.payload.value.kind.kind!=="entityState":e.kind==="chart"?e.payload.historyMinutes>0&&e.payload.value.kind.kind!=="entityState":e.kind==="image"?e.payload.entity.entityId==="":!1}function Kp(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function Wp(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function qp(e,n){let t=Kp(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=n.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":e.kind==="timeline"?"the states":"the text"),n.some(d=>d.where==="tap")&&o.push("the tap");let l=n.filter(d=>d.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${Wp(o)}.${r}`}function jp(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function Yp(e,n){let t=e.timestamp===!0,i=Ye(e),a=r=>n(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Ye(o)&&(o.timestampCorner=Oa(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return p`
    ${Ce("Show timestamp",t,r=>n(o=>{r?o.timestamp=!0:delete o.timestamp}),!1)}
    ${t?p`
      ${Z("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?f:Z("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>n(o=>{o.timestampCorner=r}))}
      ${ne("Text size (pt)",e.timestampSize,r=>n(o=>{o.timestampSize=Math.min(40,Math.max(4,r??an))},"tssize"),{step:1,min:4,max:40,def:an})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:f}`}function Zi(e,n){if(e===n)return!0;if(typeof e!=typeof n||e===null||n===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(n))return!1;if(Array.isArray(e))return e.length===n.length&&e.every((a,r)=>Zi(a,n[r]));let t=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(n).filter(a=>n[a]!==void 0);return t.length!==i.length?!1:t.every(a=>Zi(e[a],n[a]))}function Pl(e,n,t){return t.some(i=>!Zi(e[i],n[i]))}function Ol(e,n,t){let i=e,a=n;for(let r of t)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function Se(e,n,t,i,a={}){let r=a.alwaysOpen===!0,o=r||e.openSections.has(n),s=()=>e.toggleSection(n),l=p`<span class="swatch">${N(a.icon??"content")}</span>
      <span class="tt"><h4>${t}${Wl(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${t} back to its defaults`,reset:a.reset})}</h4>${a.summary?p`<span class="sum">${a.summary}</span>`:f}</span>`;return p`<section class="sec ${a.cardClass??""}" data-open=${o?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    ${r?p`<div class="sec-h pinned">${l}</div>`:p`<div class="sec-h" role="button" tabindex="0" aria-expanded=${o?"true":"false"} @click=${s}
          @keydown=${d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),s())}}>
          ${l}
          <span class="chev">${N("chevron")}</span>
        </div>`}
    ${o?p`<div class="sec-b ${a.bodyClass??""}">${i}</div>`:f}
  </section>`}function Xp(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function Jp(e){if(e<60)return`${Math.max(0,Math.round(e))}s`;let n=Math.round(e/60);if(n<90)return`${n}m`;let t=Math.floor(n/60),i=n%60;return i===0?`${t}h`:`${t}h ${i}m`}function Zp(e,n){let t=he[e==="inline"?"rectangular":e],i=n.height*t.height>n.width*t.width,a=Math.round((n.rotationDegrees%180+180)%180)===90;return i!==a}function Qp(e,n,t){let i=Zp(e,n),a=he[e==="inline"?"rectangular":e],r=n.height*a.height>n.width*a.width;return p`<div class="grid2">
    ${Z("Direction",i?"vertical":"horizontal",[["horizontal","Horizontal"],["vertical","Vertical"]],o=>{t({rotationDegrees:o==="vertical"===r?0:90},"line-dir")},{titles:{horizontal:"Lying along the frame",vertical:"Standing up, as a divider"}})}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`}function eh(e){let n=e.filter(i=>i.state!=="unavailable"&&i.state!=="unknown");return n.length===0?!1:n.filter(i=>i.state.trim()!==""&&Number.isFinite(Number(i.state))).length*2>n.length}function th(e,n,t=4){if(e.length===0)return"nothing";let i=[];for(let o=0;o<e.length;o++){let s=e[o],l=e[o+1]?.offsetSeconds??n,d=Math.max(0,l-s.offsetSeconds),u=i[i.length-1];u!==void 0&&u.state.trim().toLowerCase()===s.state.trim().toLowerCase()?u.seconds+=d:i.push({state:s.state,seconds:d})}let a=i.slice(-t),r=a.map(o=>`${o.state||"(blank)"} ${Jp(o.seconds)}`).join(", ");return i.length>a.length?`\u2026 ${r}`:r}function mn(e,n=Ht){let t=n.find(s=>s.minutes===e);if(t)return t.label;let i=Math.floor(e/1440),a=Math.floor(e%1440/60),r=e%60,o=[];return i>0&&o.push(`${i}d`),a>0&&o.push(`${a}h`),(r>0||o.length===0)&&o.push(`${r}m`),`Last ${o.join(" ")}`}var Ji=new Set;function Ir(e,n,t=Ht){return Ji.has(e)||!t.some(i=>i.minutes===n)}function Mr(e,n,t,i,a=Ht){let r=Ir(e,n,a);return p`<label class="field">${rt("Span",{atDefault:n===t&&!r,title:`Back to ${mn(t,a)}`,reset:()=>{Ji.delete(e),i(t)}})}
      <select @change=${o=>{let s=o.target.value;s==="custom"?(Ji.add(e),He(o.target)):(Ji.delete(e),i(Number(s)||pi))}}>
        ${a.map(({minutes:o,label:s})=>p`<option value=${String(o)} ?selected=${!r&&o===n}>${s}</option>`)}
        <option value="custom" ?selected=${r}>Custom…</option>
      </select></label>`}function Rr(e,n,t=!1){let i=t?Ta:hi,a=Math.floor(i/1440),r=t?zn:Ht,o=Math.floor(e/1440),s=Math.floor(e%1440/60),l=e%60,d=(u,c,h)=>n(Math.min(i,Math.max(1,Math.round(u)*1440+Math.round(c)*60+Math.round(h))));return p`<div class="grid3 span-parts">
      ${ne("Days",o,u=>d(u??0,s,l),{step:1,min:0,max:a})}
      ${ne("Hours",s,u=>d(o,u??0,l),{step:1,min:0,max:23})}
      ${ne("Minutes",l,u=>d(o,s,u??0),{step:1,min:0,max:59})}
    </div>
    <div class="hint">${t?p`${mn(e,r)}, up to 366 days. Statistics rows are never
          purged, so the limit is about what fits on a complication rather than about what
          the recorder still holds.`:p`${mn(e,r)}, up to 7 days: the recorder keeps
          ten by default, and a longer span would quietly come back short.`}</div>`}function nh(e){if(e.historyMinutes<=0)return"";if(e.source!=="statistics")return` \xB7 ${mn(e.historyMinutes)}`;let n=ci.find(([t])=>t===e.statPeriod)?.[1]??e.statPeriod;return` \xB7 ${mn(e.historyMinutes,zn)} \xB7 per ${n.toLowerCase()}`}function Nr(e,n){let t=ye(e);switch(n.kind){case"text":return xt(ge(n.payload.value,t),48);case"icon":return xt(ge(n.payload.symbol,t),48);case"gauge":return xt(ge(n.payload.value,t),48);case"chart":return xt(`${ge(n.payload.value,t)}${nh(n.payload)}`,48);case"timeline":return xt(`${ge(n.payload.value,t)} \xB7 ${mn(Be(n.payload))}`,48);case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":return n.payload.entity.displayName||n.payload.entity.entityId||(n.payload.source==="camera"?"No camera yet":"No entity yet");case"tap":return Xe(n.payload.action)}}function Qi(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${$e(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${$e(e.payload.colorSlot.baseColorHex)}`;case"gauge":{let n=e.payload,t=n.style==="dots"?`${n.bands.length>0&&n.coloring==="bands"?"banded":$e(n.colorSlot.baseColorHex)} dots`:`${n.lineWidth} pt line \xB7 ${n.coloring==="bands"&&n.bands.length>0?`${n.bands.length+1} colour bands`:$e(n.colorSlot.baseColorHex)}`;return`${n.style} \xB7 ${t}${n.thresholdValue===void 0?"":` \xB7 threshold ${n.thresholdValue}`}`}case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${Ql.find(([n])=>n===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"timeline":{let n=e.payload;return`${n.bands.length===0?`one colour (${$e(n.otherColorHex)})`:`${n.bands.length} ${n.bands.length===1?"state":"states"} coloured`}${n.gap>0?` \xB7 ${n.gap} pt gap`:""} \xB7 corners ${n.cornerRadius} pt`}case"shape":return e.payload.kind==="line"?`${$e(e.payload.colorSlot.baseColorHex)} \xB7 ${e.payload.thickness} pt thick`:`${$e(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function zr(e,n,t,i={}){let a=n.payload.id,r=`el-${a}`,o=Ee(e.config,t,n),s=o.frame,l=(u,c)=>e.update(h=>xe(h,t,a,{frame:kr(s,u)}),`${r}-${c}-${t}`),d=!Zi(s,je)||o.isHidden;return Se(e,"placement","Position",p`
    <div class="grid4">
      ${Ui("Left",s.x,u=>l({x:u},"x"),je.x,-100,100)}
      ${Ui("Top",s.y,u=>l({y:u},"y"),je.y,-100,100)}
      ${Ui("Width",s.width,u=>l({width:u},"w"),je.width,4,200)}
      ${Ui("Height",s.height,u=>l({height:u},"h"),je.height,4,200)}
    </div>
    ${Zn("Rotation",s.rotationDegrees,u=>l({rotationDegrees:u},"rot"),{min:-180,max:180,step:1,def:0,format:u=>`${Math.round(u)}\xB0`})}
    ${Ce("Hidden",o.isHidden,u=>e.update(c=>xe(c,t,a,{isHidden:u})),!1)}
    <div class="hint">On the ${J(t)} shape only. Arrow keys nudge 1 pt, shift for 10.</div>`,{color:ee.place,icon:"place",summary:`${Math.round(s.width*100)}% wide \xB7 ${J(t)}`,...i.inline?{alwaysOpen:!0,cardClass:"place-bar",bodyClass:"place-row"}:{},...d?{resetTitle:`Put this layer back to the middle of the ${J(t)} face at half size, unrotated and shown`,reset:()=>e.update(u=>xe(u,t,a,{frame:{...je},isHidden:!1}))}:{}})}function Pr(e,n,t={}){let i=t.placeholder;if(i===void 0&&(n===void 0||n.kind==="tap"))return f;let a=n!==void 0&&n.kind!=="tap"?n:void 0,r=a?Me(e.config,a.payload.id)[0]:void 0,o=r===void 0,s=i===void 0&&a!==void 0?ch(e,a,`el-${a.payload.id}`):p`
      <label class="field check"><input type="checkbox" disabled .checked=${!1} /><span>Tappable</span></label>
      <div class="hint">${i}</div>`;return Se(e,"tappable","Tap",s,{color:ee.tap,icon:"tap",summary:r?Xe(r.payload.action):"Not tappable",...t.inline?{alwaysOpen:!0,cardClass:`tap-bar${o?" muted-bar":""}`,bodyClass:"tap-row"}:{},...r&&a?{reset:()=>e.update(l=>xi(l,a.payload.id))}:{}})}function Dl(e,n,t,i,a){return p`
    ${Zn("Times",e.timeLabelCount,r=>n(o=>{o.timeLabelCount=Math.max(0,Math.min(Dn,Math.round(r)))},`${i}count`),{min:0,max:Dn,step:1,def:t.timeLabelCount,format:r=>r<=0?"None":String(Math.round(r))})}
    ${e.timeLabelCount<=0?f:p`
      <div class="grid2">
        ${ne("Time size (pt)",e.labelSize,r=>n(o=>{o.labelSize=Math.min(Bn,Math.max(Vn,r??mt))},`${i}size`),{step:.5,min:Vn,max:Bn,def:t.labelSize})}
        ${se("Time colour",e.labelColorHex,r=>n(o=>{o.labelColorHex=r??ft},`${i}colour`),!1,t.labelColorHex)}
      </div>
      ${Z("Row",e.labelsAbove?"above":"below",[["below","Below"],["above","Above"]],r=>n(o=>{o.labelsAbove=r==="above"}),{def:t.labelsAbove===!0?"above":"below"})}
      ${Z("Clock",e.hourCycle,Do,r=>n(o=>{o.hourCycle=r}),{titles:{auto:"Whatever clock the watch is set to"},def:t.hourCycle})}
      ${Z("Minutes",e.minutes,Vo,r=>n(o=>{o.minutes=r}),{titles:{auto:"Kept up to a three hour span, dropped past it"},def:t.minutes})}
      ${a}`}`}function pd(e,n,t,i={}){let a=n.payload.id,r=e.config.elements.findIndex(y=>y.payload.id===a),o=`el-${a}`,s=(y,x)=>e.update(z=>y(z.elements[r]),x?`${o}-${x}`:void 0),l=Ee(e.config,t,n),d=l.frame,u=(y,x)=>e.update(z=>xe(z,t,a,{frame:kr(d,y)}),`${o}-${x}-${t}`),c=Ve(n.kind).payload,h=c.colorSlot?.baseColorHex??"#FFFFFF",m=y=>c[y],g,v;switch(n.kind){case"text":{let y=Ba(e.config,n.payload.value);g=p`
        ${ae(e,n.payload.value,x=>s(z=>{z.payload.value=x},"value"),{showResolved:!0,label:"Text",key:`${o}-value`})}
        ${y?p`<div class="hint">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(y.payload.id)}>${Ie(y,ye(e))}</button>. It stays in the chart's group and moves with it.</div>`:f}
        ${Ce("Live countdown",n.payload.countdown===!0,x=>s(z=>{let P=z.payload;x?P.countdown=!0:delete P.countdown}),c.countdown===!0)}
        ${n.payload.countdown?p`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,v=p`<div class="grid2">
          ${qi(e,n,t,"Font size",{step:1,min:4,def:m("fontSize")})}
          ${Z("Weight",n.payload.fontWeight,_r,x=>s(z=>{z.payload.fontWeight=x}),{def:c.fontWeight})}
          ${Z("Align",n.payload.alignment??"center",Bp,x=>s(z=>{let P=z.payload;x==="center"?delete P.alignment:P.alignment=x}),{def:"center"})}
          ${Z("Lines",n.payload.lineLimit===2?"2":"1",Gp,x=>s(z=>{let P=z.payload;x==="2"?P.lineLimit=2:delete P.lineLimit}),{def:"1"})}
        </div>
        ${Ce("Monospaced digits",n.payload.monospacedDigits===!0,x=>s(z=>{let P=z.payload;x?P.monospacedDigits=!0:delete P.monospacedDigits}),c.monospacedDigits===!0)}
        ${n.payload.monospacedDigits?p`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>`:f}`;break}case"icon":g=p`
        ${ae(e,n.payload.symbol,y=>s(x=>{x.payload.symbol=y},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${o}-symbol`,setSymbolPath:y=>s(x=>{let z=x.payload;y?z.path=y:delete z.path},"symbol")})}
        <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`,v=qi(e,n,t,"Icon size",{step:1,min:4,def:m("size")});break;case"gauge":{let y=n.payload,x=(P,B)=>s(G=>P(G.payload),B),z=y.style==="dots";g=p`
        ${ae(e,y.value,P=>x(B=>{B.value=P},"value"),{showResolved:!0,label:"Reading",key:`${o}-value`})}
        ${z?p`
            ${ae(e,y.total??Al(y),P=>x(B=>{B.total=P},"total"),{showResolved:!0,label:"Total",key:`${o}-total`})}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${ui} dots are drawn.</div>`:p`
            <div class="grid2">
              ${ne("Min",y.minValue,P=>x(B=>{B.minValue=P??0},"min"),{def:c.minValue})}
              ${ne("Max",y.maxValue,P=>x(B=>{B.maxValue=P??100},"max"),{def:c.maxValue})}
            </div>`}`,v=p`
        <div class="grid2">
          ${Z("Style",y.style,Cp,P=>x(B=>{P==="dots"&&B.total===void 0&&(B.total=Al(B)),P!=="dots"&&delete B.total,B.style=P}),{titles:Sp,def:c.style})}
          ${z?f:qi(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        ${se(z?"Empty dot colour":"Track colour",y.trackColorHex,P=>x(B=>{B.trackColorHex=P??"#FFFFFF40"},"track"),!1,c.trackColorHex)}
        ${Z("Colour",y.coloring,Ml,P=>x(B=>{B.coloring=P,P==="bands"&&B.bands.length===0&&(B.bands=Rl([B.minValue,B.maxValue]))}),{def:c.coloring})}
        ${y.coloring==="bands"?p`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${Il(y,y.colorSlot.baseColorHex,x)}`:f}
        ${z?f:p`
          <div class="grid2">
            ${ne("Threshold",y.thresholdValue,P=>x(B=>{P===void 0?delete B.thresholdValue:B.thresholdValue=P},"thr"),{optional:!0})}
            ${y.thresholdValue===void 0?f:se("Threshold colour",y.thresholdColorHex,P=>x(B=>{B.thresholdColorHex=P??Qt},"thrcol"),!1,Qt)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>`}`;break}case"chart":{let y=n.payload,x=(E,I)=>s(jt=>E(jt.payload),I),z=c.historyMinutes,P=c.historyPoints,B=y.historyMinutes>0,G=B&&y.source==="statistics",q=B&&!G,Y=B?G?"statistics":"history":"value",Ae=G?zn:Ht,st=Lt(y)??_t(y),be=y.value.kind.kind==="entityState",re=st===void 0?void 0:e.historySeries(st),Te=B&&be?re??"":e.resolve(y.value)??"",Le=y.historyPoints<1,jr=Ir(a,y.historyMinutes,Ae),Pe=Wn(Te),Tt=y.limit>0&&Pe.length>y.limit?y.takeFromEnd?Pe.slice(Pe.length-y.limit):Pe.slice(0,y.limit):Pe,Dd=!B&&be&&Pe.length===1,aa=e.config.elements.filter(E=>E.kind==="chart"&&E.payload.id!==a),Vd=ye(e),ra=y.scaleFrom!==void 0&&aa.some(E=>E.payload.id===y.scaleFrom);g=p`
        ${ae(e,y.value,E=>x(I=>{I.value=E},"value"),{label:"Readings",key:`${o}-value`})}
        ${Z("Draw",Y,[["history","Recorded history"],["statistics","Long-term statistics"],["value","The value itself"]],E=>x(I=>{if(E==="value"){I.historyMinutes=0;return}I.source=E==="statistics"?"statistics":"history";let jt=I.historyMinutes||pi;I.historyMinutes=E==="statistics"?Math.min(jt,Ta):Math.min(jt,hi)}),{titles:{history:"Read the entity's recorded states from the recorder and plot them",statistics:"Plot the recorder's pre-aggregated rows, which reach back a year",value:"Plot the numbers the value holds right now, such as a forecast list"},def:c.historyMinutes>0?"history":"value"})}
        ${G?p`
            ${be?f:p`<div class="hint warn">Statistics need an entity.
              A typed-in value, a template or a shared value has no rows to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Mr(a,y.historyMinutes,z,E=>x(I=>{I.historyMinutes=E}),zn)}
              ${Z("Per",y.statPeriod,ci,E=>x(I=>{I.statPeriod=E}),{def:An})}
            </div>
            ${jr?Rr(y.historyMinutes,E=>x(I=>{I.historyMinutes=E},"span"),!0):f}
            ${Z("Read",y.statType,ka,E=>x(I=>{I.statType=E}),{def:Hn})}
            <div class="hint">One bar per period, oldest first, newest ${Pn} kept.
              Change suits energy (kWh per hour), Mean suits temperature.</div>
            ${y.statPeriod==="5minute"?p`<div class="hint warn">Five-minute rows are compacted into hourly ones after
                about ten days, so a longer span here comes back with only its recent tail.</div>`:f}
            ${be&&re===void 0?p`<div class="hint">Reading the statistics…</div>`:f}
            ${be&&re===""?p`<div class="hint warn">No long-term statistics for this entity in that span.
                Only an entity with a state class (measurement, total or total_increasing) gets
                them, and a brand new one has none yet.</div>`:f}`:f}
        ${q?p`
            ${be?f:p`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Mr(a,y.historyMinutes,z,E=>x(I=>{I.historyMinutes=E}))}
              <div class="field readings-field">${rt("Readings",{atDefault:y.historyPoints===P,title:`Back to ${P<1?"every one":`${P} averaged`}`,reset:()=>x(E=>{E.historyPoints=P})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Readings">
                    <button type="button" role="radio" aria-checked=${Le?"false":"true"} class=${Le?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{Le&&x(E=>{E.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${Le?"true":"false"} class=${Le?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{Le||x(E=>{E.historyPoints=Ma})}}>Every one</button>
                  </div>
                  ${Le?f:p`<span class="readings-into">into</span>
                    <input type="number" class="short" aria-label="How many time slots" .value=${String(y.historyPoints)}
                      title="How many equal time slots the span is averaged into, so how many bars or points get drawn"
                      step="1" min=${Fa} max=${Pn}
                      @input=${fe(E=>{let I=Number(E);E.trim()!==""&&Number.isFinite(I)&&I>=1&&x(jt=>{jt.historyPoints=Math.round(I)},"hpoints")})} />
                    <span class="readings-unit">slots</span>`}
                </div>
              </div>
            </div>
            ${jr?Rr(y.historyMinutes,E=>x(I=>{I.historyMinutes=E},"span")):f}
            <div class="hint">${Le?p`Every state the recorder holds in that span, oldest first, one reading per change,
                  and a chatty sensor keeps its newest ${Pn}. The time axis follows
                  the changes, so a quiet hour draws narrower than a busy one.`:p`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${be&&re===void 0?p`<div class="hint">Reading the history…</div>`:f}
            ${be&&re===""?p`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:f}`:f}
        ${B?f:p`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${Pe.length===0&&!(B&&(!be||re===void 0||re===""))?p`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:f}
        ${Pe.length>0?p`<div class="hint">Reads <span class="nums">${Xp(Tt)}</span>${Pe.length===Tt.length?p` · ${Tt.length} ${Tt.length===1?"value":"values"}`:p` · ${Tt.length} of ${Pe.length}`}</div>`:f}
        ${Dd?p`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:f}
        <div class="grid2">
          ${ne("Use",y.limit,E=>x(I=>{I.limit=Math.max(0,Math.round(E??0))},"limit"),{step:1,min:0,def:c.limit})}
          ${Z("From",y.takeFromEnd?"end":"start",[["start","The first"],["end","The last"]],E=>x(I=>{I.takeFromEnd=E==="end"}),{def:c.takeFromEnd===!0?"end":"start"})}
        </div>
        <div class="hint">${B?"Trims the series after it arrives, so 0 draws every reading fetched above.":"A forecast sensor often carries 24 or 48 entries. 0 draws all of them."}</div>`,v=p`
        <div class="grid2">
          ${Z("Style",y.style,gp,E=>x(I=>{I.style=E}),{def:c.style})}
          ${y.style==="bars"?ne("Bar gap (pt)",y.barGap,E=>x(I=>{I.barGap=Math.max(0,E??0)},"gap"),{step:.5,min:0,def:c.barGap}):qi(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        <div class="grid2">
          ${Z("Scale",y.scale,yp,E=>x(I=>{I.scale=E}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:c.scale})}
          ${Z("Baseline",y.baseline,bp,E=>x(I=>{I.baseline=E}),{def:c.baseline})}
        </div>
        ${aa.length===0?f:Re("Same scale as",ra?y.scaleFrom:"",[["","Its own"],...aa.map(E=>[E.payload.id,Ie(E,Vd)])],E=>x(I=>{E?I.scaleFrom=E:delete I.scaleFrom}),{def:""})}
        ${ra?p`<div class="hint">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`:f}
        ${!ra&&y.scale==="fixed"?p`<div class="grid2">
              ${ne("Min",y.minValue,E=>x(I=>{I.minValue=E??0},"cmin"),{def:c.minValue})}
              ${ne("Max",y.maxValue,E=>x(I=>{I.maxValue=E??100},"cmax"),{def:c.maxValue})}
            </div>`:f}
        <div class="hint">${y.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
          @click=${()=>{let E;e.update(I=>{E=ds(I,a)}),E&&e.selectLayer(E)}}>
          ${N("plus")}<span>Second series</span></button>
        ${Z("Colour",y.coloring,Ml,E=>x(I=>{I.coloring=E,E==="bands"&&I.bands.length===0&&(I.bands=Rl(Tt))}),{def:c.coloring})}
        ${y.coloring==="bands"?p`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${y.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${Il(y,y.colorSlot.baseColorHex,x)}
          ${y.style==="area"?p`${Ce("Fill follows the bands",y.fillBands,E=>x(I=>{I.fillBands=E}),c.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:f}`:f}
        <div class="grid2">
          ${Z("Highlight",y.highlight,Ql,E=>x(I=>{I.highlight=E}),{def:c.highlight})}
          ${y.highlight==="none"?f:Z("Marker",y.marker,vp,E=>x(I=>{I.marker=E}),{def:c.marker})}
        </div>
        ${y.highlight==="none"?f:p`
          <div class="grid2">
            ${y.highlight==="lowest"?f:se("Highest colour",y.highColorHex,E=>x(I=>{I.highColorHex=E??Ln},"hicol"),!1,Ln)}
            ${y.highlight==="highest"?f:se("Lowest colour",y.lowColorHex,E=>x(I=>{I.lowColorHex=E??_n},"locol"),!1,_n)}
          </div>
          <div class="hint">A marker is worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}
        ${Ce("Threshold line",y.thresholdValue!==void 0,E=>x(I=>{E?I.thresholdValue=wp(Tt):delete I.thresholdValue}))}
        ${y.thresholdValue===void 0?f:p`
          <div class="grid2">
            ${ne("At",y.thresholdValue,E=>x(I=>{I.thresholdValue=E??0},"thval"))}
            ${se("Line colour",y.thresholdColorHex,E=>x(I=>{I.thresholdColorHex=E??en},"thcol"),!1,en)}
          </div>
          <div class="hint">${y.scale==="fixed"?"A threshold outside Min and Max draws nothing: the plot keeps the range you asked for.":"The plot stretches to include the line, so a series that never reaches it still shows how far off it is."}</div>`}
        ${Ce("\u201CNow\u201D marker",y.nowIndex!==void 0,E=>x(I=>{E?I.nowIndex={kind:{kind:"time",timeField:"hour"}}:delete I.nowIndex}))}
        ${y.nowIndex===void 0?f:p`
          ${ae(e,y.nowIndex,E=>x(I=>{I.nowIndex=E},"nowidx"),{showResolved:!0,label:"Reading number",key:`${o}-nowindex`})}
          ${se("Marker colour",y.nowColorHex,E=>x(I=>{I.nowColorHex=E??tn},"nowcol"),!1,tn)}
          <div class="hint">Counted from 0, so Hour puts the line on reading 14 at 2 pm, which is what a
            24-reading price or forecast chart wants. Rounded, and clamped to the readings drawn.</div>`}
        ${mi(y)?Dl(y,x,c,"cl",p`
            <div class="hint">Clock times from the start of the span to now, evenly spaced, in a row of
              their own. The right edge is now and the left edge is the start of the span, so a slot
              the recorder had nothing for shifts the earlier times a little.</div>`):Le&&q?p`<div class="hint">Clock times need evenly spaced readings, so they are offered when
              Readings is Average rather than Every one.</div>`:p`<div class="hint">Clock times need a recorded span, so they are offered when Draw is
              Recorded history.</div>`}`;break}case"timeline":{let y=n.payload,x=(re,Te)=>s(Le=>re(Le.payload),Te),z=c.historyMinutes,P=y.value.kind.kind==="entityState",B=bt(y),G=B===void 0?void 0:e.historySeries(B),q=Be(y)*60,Y=qn(G??"",yt),Ae=Ir(a,y.historyMinutes),st=y.value.kind.kind==="entityState"?y.value.kind.entityId:void 0,be=kp(Y,q,st===void 0?void 0:e.hass.states[st]?.state,st?.split(".")[0]);g=p`
        ${ae(e,y.value,re=>x(Te=>{Te.value=re},"value"),{label:"States",key:`${o}-value`})}
        ${P?f:p`<div class="hint warn">A timeline draws an entity's recorded
          past, so it needs one named above. A typed-in value, a template or a shared value has no
          past to read, and this layer stays blank until States names an entity.</div>`}
        ${Mr(a,y.historyMinutes,z,re=>x(Te=>{Te.historyMinutes=re}))}
        ${Ae?Rr(y.historyMinutes,re=>x(Te=>{Te.historyMinutes=re},"span")):f}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${yt} changes are drawn, and a
          busier span keeps its newest.</div>
        ${P&&G===void 0?p`<div class="hint">Reading the history…</div>`:f}
        ${P&&G===""?p`<div class="hint warn">Nothing recorded for this entity in that span. Either it is
            excluded from the recorder, or it has not been seen in that long.</div>`:f}
        ${Y.length>0?p`<div class="hint">Reads <span class="nums">${th(Y,q)}</span></div>`:f}
        ${eh(Y)?p`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`:f}`,v=p`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${$p(y,x,be,`wa-tl-states-${o.replace(/[^a-z0-9]/gi,"")}`)}
        ${be.length>2?p`<div class="hint">Seen in this span: <span class="nums">${be.filter(re=>re!=="unavailable"&&re!=="unknown").join(", ")}</span>. Click into a State box to pick one.</div>`:f}
        <div class="grid2">
          ${ne("Gap (pt)",y.gap,re=>x(Te=>{Te.gap=Math.min(fi,Math.max(0,re??0))},"tgap"),{step:.5,min:0,max:fi,def:c.gap})}
          ${ne("Corner radius (pt)",y.cornerRadius,re=>x(Te=>{Te.cornerRadius=Math.max(0,re??0)},"tradius"),{step:.5,min:0,def:c.cornerRadius})}
        </div>
        <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
          the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
          door or a light usually wants.</div>
        ${Dl(y,x,c,"tl",p`
          <div class="hint">Clock times from the start of the span to now, evenly spaced. Four is what
            the history page on the watch shows. Auto follows the watch's own clock and drops the
            minutes past a three hour span.</div>`)}`;break}case"shape":g=p`<div class="grid2">
          ${Z("Shape",n.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"],["line","Line"]],y=>s(x=>{x.payload.kind=y}),{titles:{roundedRectangle:"Rounded rectangle",line:"A rule along the frame's long side"},def:c.kind})}
          ${n.payload.kind==="roundedRectangle"?ne("Corner radius (pt)",n.payload.cornerRadius,y=>s(x=>{x.payload.cornerRadius=y??6},"radius"),{step:.5,min:0,def:c.cornerRadius}):f}
        </div>
        ${n.payload.kind==="line"?Qp(t,d,u):f}`,v=n.payload.kind==="line"?ne("Thickness (pt)",n.payload.thickness,y=>s(x=>{x.payload.thickness=y??1},"thick"),{step:.5,min:.5,def:c.thickness}):p`
        ${se("Border colour",n.payload.borderColorHex,y=>s(x=>{y===void 0?delete x.payload.borderColorHex:x.payload.borderColorHex=y},"border"),!0,null)}
        ${n.payload.borderColorHex!==void 0?ne("Border width (pt)",n.payload.borderWidth,y=>s(x=>{x.payload.borderWidth=y??1},"bw"),{step:.5,min:0,def:c.borderWidth}):f}`;break;case"image":{let y=n.payload,x=(G,q)=>s(Y=>G(Y.payload),q),z=y.entity.entityId?e.hass.states[y.entity.entityId]?.attributes?.entity_picture:void 0,P=typeof z=="string"?z:void 0,B=P!==void 0&&!P.startsWith("/");g=p`
        ${Z("Source",y.source,[["camera","Camera"],["entityPicture","Entity picture"]],G=>x(q=>{q.source=G}),{titles:{camera:"A snapshot from a camera entity",entityPicture:"The picture an entity already carries: a person's photo, cover art, a weather icon"},def:c.source})}
        ${y.source==="camera"?p`
            ${y.entity.entityId&&!y.entity.entityId.startsWith("camera.")?p`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>`:f}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`:p`
            ${y.entity.entityId&&P===void 0?p`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>`:f}
            ${B?p`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>`:f}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`,v=p`
        ${Z("Picture",y.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],G=>x(q=>{q.contentMode=G}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:c.contentMode})}
        ${Zn("Zoom",y.zoom,G=>x(q=>{q.zoom=G},"zoom"),{min:dr,max:4,step:.05,def:1,format:G=>`${G.toFixed(2)}x`})}
        ${Zn("Pan left/right",y.panX,G=>x(q=>{q.panX=G},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${Zn("Pan up/down",y.panY,G=>x(q=>{q.panY=G},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${jp(y)}</div>
        ${ne("Corner radius (pt)",y.cornerRadius,G=>x(q=>{q.cornerRadius=Math.max(0,G??nn)},"imgradius"),{step:1,min:0,def:nn})}`;break}case"tap":{g=p`
        ${hd(e,n.payload,(y,x)=>s(z=>y(z.payload),x),o)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let $=n.kind==="image"||n.kind==="tap"||n.kind==="timeline"?void 0:se(n.kind==="shape"?"Fill colour":"Colour",n.payload.colorSlot.baseColorHex,y=>s(x=>{x.kind!=="image"&&x.kind!=="tap"&&x.kind!=="timeline"&&(x.payload.colorSlot.baseColorHex=y??"#FFFFFF")},"color"),!1,h),S=ja(e.config,n),T=S?{kind:{kind:"entityState",...S}}:void 0,k=me[n.kind],C=n.kind==="image"?n.payload.timestamp===!0:!1,_=ah[n.kind],D=rh[n.kind],V=Pl(n.payload,c,_),ie=n.kind==="text"?"fontSize":n.kind==="icon"?"size":n.kind==="gauge"||n.kind==="chart"?"lineWidth":void 0,w=e.config.perFamily[t]?.placements[a]?.size!==void 0,R=Pl(n.payload,c,D)||ie!==void 0&&l.size!==void 0&&l.size!==c[ie],U=Nt(e.config,a),O=(y,x)=>()=>s(z=>Ol(z.payload,c,y),x);return p`
    ${Se(e,"content","Content",p`${n.kind==="tap"?f:Up(e,n,o)}${g}`,{color:k,icon:"content",summary:Nr(e,n),...V?{reset:O(_,"reset-content")}:{}})}
    ${v===void 0&&$===void 0?f:Se(e,"look",n.kind==="image"?"Picture":"Look",p`${v??f}${$??f}`,{color:k,icon:n.kind==="image"?"image":"look",...Qi(n)?{summary:Qi(n)}:{},...R?{reset:()=>e.update(y=>{Ol(y.elements[r].payload,c,D),w&&xe(y,t,a,{},!0)})}:{}})}
    ${n.kind==="chart"?Se(e,"numbers","Numbers",dh(e,n),{color:me.text,icon:"text",summary:lh(e,n),...U.length>0?{reset:()=>e.update(y=>{for(let x of Nt(y,a))et(y,x.payload.id)})}:{}}):f}
    ${n.kind==="image"?Se(e,"timestamp","Timestamp",Yp(n.payload,(y,x)=>s(z=>y(z.payload),x)),{color:k,icon:"clock",summary:C?`Shown \xB7 ${n.payload.timestampSize} pt`:"Hidden",...C?{reset:O(ih,"reset-stamp")}:{}}):f}
    ${i.tap===!1?f:Pr(e,n)}
    ${Se(e,"states","States",wd(e,n.payload.rules,n.kind,y=>y.elements.find(x=>x.payload.id===a)?.payload.rules,`rules-${a}`,T),{color:ee.states,icon:"states",summary:Xn(n.payload.rules).replace(/\.$/,""),...n.payload.rules.length>0?{reset:()=>s(y=>{y.payload.rules=[]})}:{}})}
    ${i.placement===!1?f:zr(e,n,t)}`}var ih=["timestamp","timestampCorner","timestampSize"],ah={text:["value","countdown"],icon:["symbol","path"],gauge:["value","minValue","maxValue","total"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","limit","takeFromEnd"],timeline:["value","historyMinutes"],shape:["kind","cornerRadius"],image:["entity","source"],tap:["action","openPageName"]},rh={text:["fontSize","fontWeight","colorSlot","alignment","lineLimit","monospacedDigits"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","colorSlot","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes"],timeline:["bands","otherColorHex","gap","cornerRadius","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes"],shape:["colorSlot","borderColorHex","borderWidth","thickness"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[]};function hd(e,n,t,i){let a=n.action;return p`
    ${Re("Tap action",a.type,Lp,r=>t(o=>{o.action=ad(r,o.action),r!=="openPage"&&(delete o.openPageId,delete o.openPageName)}))}
    ${"entityId"in a?at(e,"Target",a,r=>t(o=>{o.action={type:a.type,...r}},"tap-entity"),`${i}-tap`):f}
    ${a.type==="callService"?rd(e,a,(r,o)=>t(s=>{s.action=r},o),`${i}-tap`):f}
    ${a.type==="openPage"?sd(e,n.openPageId,n.openPageName,(r,o)=>t(s=>{if(r===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=r,o?s.openPageName=o:delete s.openPageName},"tap-page")):f}`}var oh=24;function sh(e,n){let t=[],i=1/0;for(let r of te){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=ss(e.config,n,r);o&&(t.push(`${J(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return f;let a=i<oh;return p`<div class=${a?"hint warn":"hint"}>${t.join(" \xB7 ")}${a?p`<br />That is small for a wrist. Show the tap area and drag its corners out.`:f}</div>`}function lh(e,n){let t=Nt(e.config,n.payload.id);return t.length===0?"None yet":t.map(i=>{let a=i.payload.value.kind;return a.kind==="chartStat"?(Zt.find(([r])=>r===a.stat)?.[1]??"number").toLowerCase():"number"}).join(" \xB7 ")}function dh(e,n){let t=ye(e),i=Nt(e.config,n.payload.id),a=o=>e.update(s=>{es(s,n.payload.id,o)}),r=new Set(i.map(o=>o.payload.value.kind.kind==="chartStat"?o.payload.value.kind.stat:""));return p`
    ${i.length===0?p`<div class="hint">A chart with no numbers on it shows that a reading moved, not what it moved to. Add one and it appears as a text layer in this chart's group: drag it anywhere, give it any size or colour, and it prints the live value.</div>`:p`
        <div class="chart-numbers">
          ${i.map(o=>p`
            <div class="num-row">
              <button class="small" title="Edit this number" @click=${()=>e.selectLayer(o.payload.id)}>
                <b>${e.resolve(o.payload.value)??"--"}</b> · <span class="ent-tok">${Ie(o,t)}</span>
              </button>
              <button class="icon danger" title="Delete this number" aria-label="Delete this number"
                @click=${()=>e.update(s=>et(s,o.payload.id))}>${N("close")}</button>
            </div>`)}
        </div>
        <div class="hint">Each number is a text layer in this chart's group. Click one to edit it; drag it on the preview to move it. The × deletes it, and Undo brings it back.</div>`}
    <div class="hint"><b>Add</b></div>
    <div class="adders">
      ${Zt.map(([o,s])=>p`
        <button class="small" title=${r.has(o)?`Add another ${s.toLowerCase()}`:`Add the ${s.toLowerCase()}`}
          @click=${()=>a(o)}>${N("plus")}<span>${s}</span></button>`)}
    </div>
    <div class="hint">The newest reading, the change and the total start with the entity's unit after them. The change is the newest reading minus the first, and the trend arrow is that change as ↑, ↓ or →, flat when it is too small for the chart to print. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>`}function ch(e,n,t){if(n.kind==="tap")return f;let i=n.payload.id,a=Me(e.config,i)[0],r=(s,l)=>e.update(d=>{let u=d.elements.find(c=>c.kind==="tap"&&c.payload.attachedTo===i);u&&s(u.payload)},l?`${t}-${l}`:void 0),o=Ya(e.config,n);return p`
    ${Ce("Tappable",a!==void 0,s=>e.update(l=>{s?wi(l,i):xi(l,i)}))}
    ${a?p`<div class="value-editor">
          ${hd(e,a.payload,r,`${t}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${gi(a.payload.outset)?f:p`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(s=>{s.outset={...Da}})}>${N("reset")}</button>`}
          </div>
        </div>
        ${sh(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:p`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Xe(o)}</b>.</div>`}`}function Vl(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function Ie(e,n){switch(e.kind){case"text":return Vl(ge(e.payload.value,n));case"icon":return Vl(ge(e.payload.symbol,n));case"gauge":return ge(e.payload.value,n);case"chart":return ge(e.payload.value,n);case"timeline":return ge(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let t=e.payload.entity;return t.displayName||t.entityId||(e.payload.source==="camera"?"camera":"picture")}case"tap":{let t=e.payload.action,i="entityId"in t?t.displayName||t.entityId:t.type==="callService"?[t.serviceDomain,t.serviceName].filter(a=>a!=="").join("."):t.type==="openPage"&&e.payload.openPageName||"";return i?`${t.type} \xB7 ${i}`:t.type}}}function md(e,n){let t=Ze(e.config,n.id),i=ye(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(d=>d.id===n.id);l&&r(l)},o?`group-${n.id}-${o}`:void 0);return Se(e,"content","Group",p`
    ${pe("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${Ce("Move as one on the watch",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="hint">${t.length} layer${t.length===1?"":"s"}: ${t.map(r=>Ie(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>Gn(r,n.id))}>Ungroup</button>
    </div>`,{color:ee.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function fd(e,n){if(n==="inline")return uh(e);let t=e.config.perFamily[n];if(!t)return p`<div class="hint">No settings stored for ${J(n)} yet.</div>
      <button class="small" @click=${()=>e.update(s=>{s.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${J(n)} settings</button>`;let i=(s,l)=>e.update(d=>s(d.perFamily[n]),l?`fam-${n}-${l}`:void 0),a=ta(e.config,n),r=t.backgroundColorHex?$e(t.backgroundColorHex):"transparent",o=t.borderColorHex?`${t.borderWidth} pt ${$e(t.borderColorHex)} border`:"no border";return p`
    ${Se(e,"look",`${J(n)} shape`,p`
      ${se("Background (blank = transparent)",t.backgroundColorHex,s=>i(l=>{s===void 0?delete l.backgroundColorHex:l.backgroundColorHex=s},"bg"),!0,null)}
      ${se("Border colour",t.borderColorHex,s=>i(l=>{s===void 0?delete l.borderColorHex:l.borderColorHex=s},"border"),!0,null)}
      ${ne("Border width (pt)",t.borderWidth,s=>i(l=>{l.borderWidth=s??2},"bw"),{step:.5,min:0,def:2})}`,{color:ee.place,icon:"shape",summary:`${r} \xB7 ${o}`,...t.backgroundColorHex!==void 0||t.borderColorHex!==void 0||t.borderWidth!==2?{reset:()=>i(s=>{delete s.backgroundColorHex,delete s.borderColorHex,s.borderWidth=2},"reset-look")}:{}})}
    ${n==="corner"?Se(e,"corner","Corner content",ph(e,t,i),{color:ee.place,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas",...t.curvedText!==void 0||t.bezelText!==void 0||t.bezelGauge!==void 0?{reset:()=>i(s=>{delete s.curvedText,delete s.bezelText,delete s.bezelGauge},"reset-corner")}:{}}):f}
    ${Se(e,"states","Shape states",wd(e,t.rules,"layout",s=>s.perFamily[n]?.rules,`rules-${n}`),{color:ee.states,icon:"states",summary:Xn(t.rules).replace(/\.$/,""),...t.rules.length>0?{reset:()=>i(s=>{s.rules=[]},"reset-states")}:{}})}
    ${Se(e,"placements","Layers",p`
      <div class="hint">${a===0?`Nothing is on the ${J(n)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`:`${a} layer${a===1?" is":"s are"} on the ${J(n)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,{color:ee.place,icon:"place",summary:a===0?"Nothing on it":`${a} layer${a===1?"":"s"}`})}`}function uh(e){let n=e.config.inline;if(!n)return p`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=ye(e);return p`
    ${Se(e,"content","Inline text",p`
      ${pe("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${ae(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${Ce("Live countdown",n.countdown===!0,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${n.countdown?p`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,{color:me.text,icon:"text",summary:xt(`${n.label?`${n.label}: `:""}${ge(n.value,i)}`,48)})}
    ${Se(e,"symbol","Symbol",p`
      ${Zl(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</div>`,{color:me.icon,icon:"icon",summary:n.symbol||"None"})}`}function ph(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return p`
    ${Z("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=F("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?p`
      ${ae(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${se("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    ${Z("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=F("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:F("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?p`
      ${ae(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${Ce("Live countdown",n.bezelCountdown===!0,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${a==="gauge"&&n.bezelGauge?hh(e,n.bezelGauge,t):f}`}function hh(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return p`
    ${ae(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${ne("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${ne("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${se("Arc colour (min end)",i[0],a(0))}
    ${se("Arc colour (middle)",i[1],a(1))}
    ${se("Arc colour (max end)",i[2],a(2))}
    ${Ce("End number labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let s=o.bezelGauge;r?(s.minLabel=F(String(s.minValue)),s.maxLabel=F(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${n.minLabel?ae(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${n.maxLabel?ae(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var mg=te.map(e=>[e,J(e)]),Or={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},mh=Object.keys(Or);function fh(e){let n=$i[e];return mh.filter(t=>n.includes(Fe[t]))}var gh={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function ji(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function xt(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function yh(e){if(!e||Ge(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.duration&&n.push("as a duration"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function ge(e,n){return`${gd(e,n)}${yh(e.format)}`}function gd(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${xt(t.value,40)}"`:"(empty)";case"entityState":return ji(t,n);case"entityAttribute":return t.attribute?`${ji(t,n)} \xB7 ${t.attribute}`:ji(t,n);case"entityAge":return`age of ${ji(t,n)}`;case"aggregate":return bh(t.aggregate);case"time":return gh[t.timeField];case"dataAge":return"data age";case"jinja":return t.value?`template ${xt(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(Zt.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?gd(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function bh(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function ea(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function vh(e,n,t,i,a){let r=(o,s)=>e.update(l=>{let d=i(l);d&&o(d)},s?`${a}-${s}`:void 0);return p`
    ${n.length===0?p`<div class="hint">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:f}
    ${n.map((o,s)=>wh(e,o,s,n.length,t,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(Kn())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function wh(e,n,t,i,a,r,o){let s=e.liveBranch(n),l=e.forced.get(n.id)??"live",d=c=>l==="live"?c==="live":l==="otherwise"?c==="otherwise":l.caseId===c,u=(c,h)=>r(m=>{let g=m.find(v=>v.id===n.id);g&&c(g)},h);return p`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(c=>ea(c,t,t-1))}>${N("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(c=>ea(c,t,t+1))}>${N("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(c=>{let h=c.findIndex(m=>m.id===n.id);h>=0&&c.splice(h,1)})}>${N("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
      ${n.cases.map((c,h)=>p`<button class="${d(c.id)?"active":""} ${s===c.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:c.id})}>Case ${h+1}</button>`)}
      ${n.otherwise?p`<button class="${d("otherwise")?"active":""} ${s==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:f}
    </div>
    ${n.cases.map((c,h)=>xh(e,c,h,n,a,u,`${o}-${c.id}`))}
    <div class="adders"><button class="small" @click=${()=>u(c=>{c.cases.push(Za())})}>+ case</button></div>
    ${Ce("Otherwise (when no case matches)",n.otherwise!==void 0,c=>u(h=>{c?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${n.otherwise?p`<div class="case-box otherwise">
          <div class="hint">${s==="otherwise"?p`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${yd(e,n.otherwise,a,c=>u(h=>{h.otherwise&&c(h.otherwise)}),`${o}-otherwise`)}
        </div>`:f}
  </div>`}function xh(e,n,t,i,a,r,o){let s=(d,u)=>r(c=>{let h=c.cases.find(m=>m.id===n.id);h&&d(h)},u),l=e.liveBranch(i)===n.id;return p`<div class="case-box ${l?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${l?p` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(d=>ea(d.cases,t,t-1))}>${N("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(d=>ea(d.cases,t,t+1))}>${N("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let u=d.cases.findIndex(c=>c.id===n.id);u>=0&&d.cases.splice(u,1)})}>${N("delete")}</button>
    </div>
    <div class="row-inline">
      ${Z("When",n.when.join,[["all","All of these are true"],["any","Any of these is true"]],d=>s(u=>{u.when.join=d}))}
    </div>
    ${n.when.tests.length===0?p`<div class="hint">No tests: this case always matches.</div>`:f}
    ${n.when.tests.map((d,u)=>kh(e,d,u,c=>s(h=>{let m=h.when.tests.find(g=>g.id===d.id);m&&c(m)}),()=>s(c=>{c.when.tests=c.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders">
      <button class="small" @click=${()=>s(d=>{d.when.tests.push(Ja())})}>+ test</button>
      <select class="adder" @change=${d=>{let u=d.target,c=u.value;if(u.value="",!c)return;let h=kl(c,yl(e.hass?.states));s(m=>{m.when.tests.push(...h)})}}>
        <option value="">+ preset…</option>
        ${wl.map(d=>p`<option value=${d.kind} title=${d.hint}>${d.label}</option>`)}
      </select>
    </div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${yd(e,n.then,a,d=>s(u=>d(u.then)),`${o}-then`)}
  </div>`}function kh(e,n,t,i,a,r){let o=(c,h)=>i(c,h?`${r}-${h}`:void 0),s=n.comparison,l=Pt(s.kind),d=e.evaluateTest(n),u=f;switch(l){case"value":u=ae(e,s.value??F(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":u=p`${ae(e,s.value??F(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${ae(e,s.upper??F(""),c=>o(h=>{h.comparison.upper=c},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":u=p`${pe("Pattern",s.pattern??"",c=>o(h=>{h.comparison.pattern=c},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!$h(s.pattern)?p`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"times":u=p`<div class="row-inline">
          ${Bl(e,"From",s.value??F("22:00"),c=>o(h=>{h.comparison.value=c},"rhs"),`${r}-rhs`)}
          ${Bl(e,"To",s.upper??F("06:00"),c=>o(h=>{h.comparison.upper=c},"upper"),`${r}-upper`)}
        </div>
        <div class="hint">The start is included and the end is not. An end earlier than the start wraps midnight, so 22:00 to 06:00 is the night. Equal times match nothing.</div>`;break;case"options":u=Ch(n.value)?Sh(s.options??[],c=>o(h=>{h.comparison.options=Sr(c)},"options")):pe("Options (comma separated)",(s.options??[]).join(", "),c=>o(h=>{h.comparison.options=c.split(",").map(m=>m.trim()).filter(Boolean)},"options"));break;case"none":break}return p`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${N("delete")}</button>
    </div>
    ${s.kind==="isStale"?p`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:ae(e,n.value,c=>o(h=>{h.value=c},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${Re("Comparison",s.kind,hs.map(c=>[c,pn[c]]),c=>o(h=>{h.comparison=Qa(h.comparison,c)}))}
    ${u}
  </div>`}function $h(e){try{return new RegExp(e),!0}catch{return!1}}function Bl(e,n,t,i,a){if(t.kind.kind!=="literal")return ae(e,t,i,{showResolved:!0,label:n,key:a});let r=t.kind.value,o=zt(r)??"";return p`<label class="field"><span>${n}</span>
    <input type="time" .value=${o}
      @input=${fe(s=>i({...t,kind:{kind:"literal",value:s}}))} />
    ${r!==""&&o===""?p`<div class="hint warn">"${r}" is not a 24-hour HH:MM time. The test stays false until it is.</div>`:f}</label>`}function Ch(e){return e.kind.kind==="time"&&e.kind.timeField==="weekday"}function Sh(e,n){let t=vl(e),i=a=>n(t.includes(a)?t.filter(r=>r!==a):[...t,a]);return p`<div class="field seg-field"><span>Days</span>
    <div class="seg wide" role="group" aria-label="Days">
      ${bl.map((a,r)=>p`<button type="button" role="checkbox" aria-checked=${t.includes(r)?"true":"false"}
        class=${t.includes(r)?"on":""} @click=${()=>i(r)}>${a}</button>`)}
    </div></div>`}function yd(e,n,t,i,a){let r=fh(t);return p`
    ${n.length===0?p`<div class="hint">No changes.</div>`:f}
    ${n.map((o,s)=>Eh(e,o,s,t,(l,d)=>i(u=>{u[s]&&l(u[s])},d?`${a}-${s}-${d}`:void 0),()=>i(l=>{l.splice(s,1)}),`${a}-${s}`))}
    <select class="adder" @change=${o=>{let s=o.target,l=s.value;s.value="",l&&i(d=>{d.push(Ot(l))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>p`<option value=${o}>${Or[o]}</option>`)}
    </select>`}var bd=["setColor","setBorderColor","setBackgroundColor"];function Eh(e,n,t,i,a,r,o){let s=!$i[i].includes(Fe[n.kind]);return p`<div class="change-box">
    <div class="rule-head">
      <span>${Or[n.kind]}${s?p` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${N("delete")}</button>
    </div>
    ${vd(e,n,a,o)}
  </div>`}function vd(e,n,t,i){let a=Ci(n.kind),r=f;if(a==="value"){let o=n.value??F("");if(bd.includes(n.kind)){let s=o.kind.kind==="literal";r=p`${s?se("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>t(d=>{d.value=F(l??"#FFFFFF")},"color")):ae(e,o,l=>t(d=>{d.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:F("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?f:p`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=ae(e,o,s=>t(l=>{l.value=s},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1}:{step:.5,min:0};r=ne(n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Degrees":n.kind==="setFontSize"?"Points":"Value",n.number??0,s=>t(l=>{l.number=s??0},"number"),o)}else a==="weight"&&(r=Z("Weight",n.weight??"regular",_r,o=>t(s=>{s.weight=o})));return r}var Ar=new Set,Yi=new Map,Xi=new Map,Gl=new Map;function wd(e,n,t,i,a,r){let o=br(n);return!o.ok||Ar.has(a)?p`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${l=>{Ar.delete(a),He(l.target)}}>Show as table</button>
        ${o.ok?f:p`<span class="hint">${o.reason}</span>`}
      </div>
      ${vh(e,n,t,i,a)}`:Th(e,o.table,n[0],t,i,a,r)}function Th(e,n,t,i,a,r,o){let s=(w,R)=>e.update(U=>{let O=a(U);O&&w(O)},R?`${r}-${R}`:void 0),l=n.value??Gl.get(r)??o,d=n.rows.length===0,u=n.numberMode||d&&l!==void 0&&!dl(l)&&Fh(e.resolve(l)),c=$i[i],h=Yi.get(r)??new Set,m=n.columns.length===0&&h.size===0?[ll[i]]:[],g=Qs(n.columns,[...h,...m.filter(w=>w!==void 0)],c),v=t?e.liveBranch(t):"none",$=t?e.forced.get(t.id)??"live":"live",S=w=>$!=="live"&&($==="otherwise"?w==="otherwise":$.caseId===w),T=w=>{t&&e.setForced(t.id,S(w)?"live":w==="otherwise"?"otherwise":{caseId:w})},k=w=>{Gl.set(r,w),n.rows.length!==0&&s(R=>rl(R,w),"lhs")},C=()=>s(w=>il(w,l??F(""),u)),_=n.rows.map((w,R)=>Kl(e,{key:`${r}-${w.caseId}`,label:sl(w.comparison,U=>ge(U,ye(e))),columns:g,changes:w.changes,live:v===w.caseId,forced:S(w.caseId),onForce:()=>T(w.caseId),when:Hh(e,w.comparison,`${r}-${w.caseId}`,(U,O)=>s(y=>{let x=y[0]?.cases.find(z=>z.id===w.caseId)?.when.tests[0];x&&U(x.comparison)},O&&`${w.caseId}-${O}`)),updChanges:(U,O)=>s(y=>{let x=y[0]?.cases.find(z=>z.id===w.caseId);x&&U(x.then)},O&&`${w.caseId}-${O}`),acts:p`
      <button class="icon" title="Move up" ?disabled=${R===0} @click=${()=>s(U=>vr(U,R,R-1))}>${N("up")}</button>
      <button class="icon" title="Move down" ?disabled=${R===n.rows.length-1} @click=${()=>s(U=>vr(U,R,R+1))}>${N("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>s(U=>al(U,w.caseId))}>${N("delete")}</button>`})),D=n.otherwise===void 0?f:Kl(e,{key:`${r}-otherwise`,label:"Otherwise",columns:g,changes:n.otherwise,live:v==="otherwise",forced:S("otherwise"),onForce:()=>T("otherwise"),when:p`<span class="when-otherwise">Otherwise</span>`,updChanges:(w,R)=>s(U=>{let O=U[0]?.otherwise;O&&w(O)},R),acts:p`<button class="icon" title="Remove the Otherwise row" @click=${()=>s(w=>wr(w,!1))}>${N("close")}</button>`}),V=Xi.get(r),ie=Mh.filter(w=>c.includes(w)&&!g.includes(w));return p`
    <div class="states">
      ${ae(e,l??F(""),k,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${l===void 0?p`<div class="hint">Choose what these states look at.</div>`:f}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${g.map(w=>p`<th>
              <span>${it[w]}</span>
              <button class="icon" title=${`Remove the ${it[w]} column`}
                @click=${R=>{Xi.set(r,w),He(R.target)}}>${N("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${_}
          ${D}
          ${n.rows.length===0&&n.otherwise===void 0?p`<tr><td class="empty-row" colspan=${g.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:f}
        </tbody>
      </table>
      ${V===void 0?f:p`<div class="hint warn confirm-row">
        Remove the ${it[V]} column? Its ${Ul(n,V)} value${Ul(n,V)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${w=>{Xi.delete(r),Yi.get(r)?.delete(V),He(w.target),s(R=>ol(R,V))}}>Remove</button>
        <button class="small" @click=${w=>{Xi.delete(r),He(w.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${C}>+ state</button>
        ${n.otherwise===void 0?p`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>s(w=>wr(w,!0))}>+ otherwise</button>`:f}
        <span class="spacer"></span>
        ${$==="live"?f:p`<button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button>`}
        ${ie.length===0?f:p`<select class="chip-add" title="Add a column" @change=${w=>{let R=w.target,U=R.value;if(R.value="",!U)return;let O=Yi.get(r)??new Set;O.add(U),Yi.set(r,O),He(R)}}>
          <option value="" selected>+ column…</option>
          ${ie.map(w=>p`<option value=${w}>${it[w]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${u?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${w=>{Ar.add(r),He(w.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function Fh(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var Mh=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function Ul(e,n){let t=0;for(let i of e.rows)Vi(i.changes,n)&&(t+=1);return e.otherwise&&Vi(e.otherwise,n)&&(t+=1),t}function Rh(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function Kl(e,n){return p`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{Rh(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>p`<td>${Ih(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function Ih(e,n,t,i,a){let r=Vi(t,n),o=Lr(a);if(!r)return p`<button type="button" class="cell empty" title=${`Set ${it[n]} for this state`}
      @click=${d=>{i(u=>{u.push(Ot(Zs[n]))}),Rp(d.target,o)}}>unchanged</button>`;let s=(d,u)=>i(c=>{let h=c.find(m=>Fe[m.kind]===n);h&&d(h)},u&&`${n}-${u}`),l=it[n];return p`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${Ah(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${td}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${Qn.has(o)?p`${n==="visibility"?Z("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>s(u=>{u.kind=d})):vd(e,r,s,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(u=>{let c=u.findIndex(h=>Fe[h.kind]===n);c>=0&&u.splice(c,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:f}
    </div>`}function Ah(e,n){if(n.kind==="hide")return p`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return p`<span class="cell-word">Shown</span>`;let t=Ci(n.kind);if(t==="number")return p`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return p`<span class="cell-word">${_r.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;let i=n.value??F(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(bd.includes(n.kind))return p`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?$e(a):ge(i,ye(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return p`${r??f}<span class="cell-word">${a}</span>`}return p`<span class="cell-word">${ge(i,ye(e))}</span>`}function $e(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function Hh(e,n,t,i){let a=Pt(n.kind),r=yr(n.kind),o=(s,l,d,u)=>_h(e,s,l,`${t}-${d}`,r,u,d==="rhs"?"Compare with":"Upper bound");return p`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${fe(s=>i(l=>{let d=Qa(l,s);l.kind=d.kind,d.value!==void 0?l.value=d.value:delete l.value,d.upper!==void 0?l.upper=d.upper:delete l.upper}))}>
      ${gr.map(s=>p`<option value=${s} ?selected=${s===n.kind}>${Lh(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??F(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):f}
    ${a==="between"?p`<span class="when-and">to</span>${o(n.upper??F(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:f}
  </span>`}function Lh(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return pn[e]}}function _h(e,n,t,i,a,r,o){let s=Lr(i),l={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return p`<span class="rhs">
      ${ae(e,n,t,{...l,compact:!0})}
    </span>`;let d=n.kind.value;return p`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${fe(u=>t({...n,kind:{kind:"literal",value:u}}))} />
    <button type="button" class="icon more" popovertarget=${s} title="Compare with an entity or a template instead">…</button>
    ${ed(e,s,o,n,t,l)}
  </span>`}var ei=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:qa,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"doorHistory",title:"Door history",blurb:"A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",domains:["binary_sensor","cover"],layerCount:2},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function Cd(e){return ei.find(n=>n.kind===e)??ei[0]}var xd="#FF9F0A",na="#8E8E93",Nh=["#FF453A","#FFD60A","#34C759"],Sd=["#0A84FF","#34C759","#FF9F0A"];function zh(e){return e?.attributes?.device_class==="battery"?Nh:Sd}var Ph={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function Oh(e){let n=e.iconName?.trim();return n?{off:n,on:n}:Ph[Dr(e)]??{off:"circle",on:"circle.fill"}}function Dh(e){switch(Dr(e)){case"lock":return{kind:"equals",value:F("locked")};case"cover":case"valve":return{kind:"equals",value:F("open")};case"media_player":return{kind:"equals",value:F("playing")};default:return{kind:"isOn"}}}function Dr(e){return e.domain||e.entityId.split(".")[0]||""}function Ct(e){return{...e,domain:Dr(e)}}function Vh(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function gn(e){return Math.round(e*1e4)/1e4}function Wt(e,n,t){return Math.min(t,Math.max(n,e))}function Vr(e,n,t){let i=we[e],a=Wt(gn(n/i.width),0,1),r=Wt(gn(t/i.height),0,1);return{x:gn((1-a)/2),y:gn((1-r)/2),width:a,height:r,rotationDegrees:0}}function Bh(e){let n=we[e],t=Wt(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:Vr(e,t*1.3,t*1.3),size:t}}function Gh(e){let n=we[e],t=Wt(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:Vr(e,n.width*.88,t*1.7),size:t}}function Uh(e){let n=we[e],t=Math.min(n.width,n.height)*.9;return{frame:Vr(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function Ed(e){let n=e==="rectangular";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function Kh(e){let n=we[e],t=Wt(Math.round(n.height*.2),6,14);return{frame:{x:.06,y:.56,width:.88,height:gn(t/n.height),rotationDegrees:0}}}function Wh(e){let n=we[e],t=Wt(Math.round(Math.min(n.width,n.height)*.26),8,15);return{frame:{x:.06,y:.2,width:.88,height:gn(Wt(t*1.5/n.height,0,1)),rotationDegrees:0},size:t}}function qh(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function jh(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function kt(e,n,t,i){let a=i(t);n.payload.frame=a.frame,jh(n,a.size);let r=e.perFamily[t]??(e.perFamily[t]=Qe());r.placements[n.payload.id]={frame:a.frame,isHidden:!1,...a.size!==void 0?{size:a.size}:{}}}function $t(e){return Ve(e)}function Br(e,n){let t={kind:{kind:"entityState",...Ct(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function kd(e){let n=Ot("setIcon");return n.value=F(e),n}function Kt(e){let n=Ot("setColor");return n.value=F(e),n}function Yh(e,n){let t=Kn(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...Ct(e)}},a.comparison=Dh(e);let r=n.on!==n.off;return i.then=r?[kd(n.on),Kt(xd)]:[Kt(xd)],t.otherwise=r?[kd(n.off),Kt(na)]:[Kt(na)],t}function Xh(e){let n=Kn(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...Ct(e)}},i.comparison={kind:"isUnavailable"};let a=Ot("setOpacity");return a.number=.35,t.then=[a],n}function $d(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function Jh(e,n,t=Sd){let i=n.max-n.min,a=$d(n.min+i/3),r=$d(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:F(a)},changes:[Kt(t[0])]},{comparison:{kind:"between",value:F(a),upper:F(r)},changes:[Kt(t[1])]},{comparison:{kind:"greaterThan",value:F(r)},changes:[Kt(t[2])]}];return el(Br(e),o)}function Zh(e,n,t){let i=$t("icon"),a=Oh(n);return i.payload.symbol=F(a.off),i.payload.colorSlot.baseColorHex=na,i.payload.rules=[Yh(n,a)],kt(e,i,t.family,Bh),e.elements.push(i),wi(e,i.payload.id,{type:"toggleEntity",...Ct(n)}),i.payload.id}function Qh(e,n,t){let i=$t("text");return i.payload.value=Br(n,t.state),i.payload.rules=[Xh(n)],kt(e,i,t.family,Gh),e.elements.push(i),i.payload.id}function em(e,n,t){let i=$t("gauge");i.payload.value=Br(n);let a=Vh(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[Jh(n,a,zh(t.state))],kt(e,i,t.family,Uh),e.elements.push(i),i.payload.id}function tm(e,n,t){let i=$t("chart");return i.payload.value={kind:{kind:"entityState",...Ct(n)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",kt(e,i,t.family,Ed),e.elements.push(i),i.payload.id}function nm(e,n,t){let i=$t("chart");return i.payload.value={kind:{kind:"entityState",...Ct(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",kt(e,i,t.family,Ed),e.elements.push(i),i.payload.id}function im(e,n,t){let i=Ct(n),a=$t("text");a.payload.value=F(i.displayName||i.entityId),a.payload.colorSlot.baseColorHex=na,kt(e,a,t.family,Wh),e.elements.push(a);let r=t.state?.attributes?.device_class,o=$t("timeline");return o.payload.value={kind:{kind:"entityState",...i}},o.payload.bands=Pa(i.domain,typeof r=="string"?r:void 0),kt(e,o,t.family,Kh),e.elements.push(o),o.payload.id}function am(e,n,t){let i=$t("image");return i.payload.entity=Ct(n),kt(e,i,t.family,qh),e.elements.push(i),i.payload.id}function Td(e,n,t,i){switch(n){case"toggle":return Zh(e,t,i);case"status":return Qh(e,t,i);case"gauge":return em(e,t,i);case"chart":return tm(e,t,i);case"history":return nm(e,t,i);case"doorHistory":return im(e,t,i);case"camera":return am(e,t,i)}}var om=3e4,sm=500,lm=3e4,Fd="preset-entity",dm={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Gr(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function cm(e){return e.kind==="family"?"look":"content"}function Ur(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}function Md(){return p`<span class="hstep" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13" /><path d="M12 6l6 6-6 6" /></svg></span>`}function um(e){let n=b`<rect x="3" y="2" width="38" height="48" rx="11" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" />`,t=e==="rectangular"?b`<rect x="8" y="21" width="28" height="10" rx="3" fill="currentColor" />`:e==="circular"?b`<circle cx="22" cy="26" r="8" fill="currentColor" />`:e==="corner"?b`<path d="M9 18a9 9 0 0 1 9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <circle cx="11.5" cy="11.5" r="3" fill="currentColor" />`:b`<rect x="10" y="7" width="24" height="5" rx="2.5" fill="currentColor" />`;return p`<svg class="shape-art" viewBox="0 0 44 52" aria-hidden="true">${n}${t}</svg>`}var Rd=300,Id=360,Ad=44,Hd=22,pm=[1,1.7,2.6],hm=["S","M","L"],Ld=["Small","Medium","Large"],_d="wrist-assistant-panel.layers.v1",ot=34,qt=200,mm=720,ia=320,fm=80,gm=56,Nd="wrist-assistant-panel.columns.v2",Kr=e=>Math.max(qt,Math.min(mm,Math.round(e))),zd=e=>e.metaKey||e.ctrlKey||e.shiftKey,ym=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,ti=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",St=ti==="Cmd"?"\u2318":"Ctrl+",Wr=ti==="Cmd"?"\u21E7":"Shift+";function Pd(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-fm;if(i>=qt*2+ia){let r=i-ia,o=n,s=t;if(o+s>r){let l=r/(o+s);o=Math.max(qt,Math.floor(o*l)),s=Math.max(qt,Math.floor(s*l));let d=o+s-r;d>0&&(o>=s?o=Math.max(qt,o-d):s=Math.max(qt,s-d))}return{columns:3,left:o,right:s}}let a=e-gm;return a>=qt+ia?{columns:2,left:Math.min(n,a-ia),right:t}:{columns:1,left:n,right:t}}var A=class A extends dt{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Rd;this.colRight=Id;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.sendStatusKnown=!1;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.pickerFilter="all";this.testValues=new Map;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newOpen=!1;this.newName="";this.recordPreviews=new Map;this.previewCase=dn.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=qs(()=>this.requestUpdate());this.imageSizes=js(()=>this.requestUpdate());this.symbols=new zi(()=>this.requestUpdate());this.keyHandler=t=>this.onKey(t);this.heldArrows=new Set;this.keyUpHandler=t=>{this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.fades=new Di;this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.newKeys=t=>{t.key==="Enter"&&(this.newName.trim()===""||this.newFamily===void 0||this.newNameProblem()!==void 0||(t.preventDefault(),this.createNew()))};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||Jl(Fd)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=sa`
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
      --wa-text: ${ce(me.text)};
      --wa-icon: ${ce(me.icon)};
      --wa-gauge: ${ce(me.gauge)};
      --wa-shape: ${ce(me.shape)};
      --wa-image: ${ce(me.image)};
      --wa-tap: ${ce(me.tap)};
      --wa-states: ${ce(ee.states)};
      --wa-place: ${ce(ee.place)};
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
      --wa-reset: #FFD60A;
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
    .picker .menu .row.locked { opacity: .6; cursor: default; }
    .picker .menu .pk-badge { font-size: 11px; opacity: .7; white-space: nowrap; }
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
       and the Layers card takes the rest, scrolling its own rows, so the shape
       row stays pinned to the foot of the column instead of floating mid-air. */
    .column.left { display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
    .column.left .card { flex: none; }
    .column.left .card.layers-card {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; padding: 10px 8px 8px;
      --thumb-w: ${Ad}px; --thumb-h: ${Hd}px;
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
    .layers {
      display: flex; flex-direction: column; gap: 2px; flex: 1 1 auto; min-height: 0;
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
    .layer.held { background: color-mix(in srgb, ${ce(ee.group)} 12%, var(--wa-panel)); }
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
    /* The shape row is pinned to the foot of the list, under a hairline that
       runs the full width of the card: it is the ground everything else is
       drawn on, not another layer in the stack. */
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
    .layer .lockbtn.on { opacity: 1; color: ${ce(ee.locked)}; }
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
    .layer.drop-before { border-top: ${ot}px solid transparent; }
    .layer.drop-after { border-bottom: ${ot}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${ot}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${ot}px; }
    .layer.drop-after::after { bottom: -${ot}px; }

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
    .seg.wide { display: flex; width: 100%; min-width: 0; height: 28px; border-radius: 7px; background: var(--wa-panel); }
    .seg.wide button {
      flex: 1 1 0; min-width: 0; padding: 0 8px;
      font-size: 12px; font-weight: 600; letter-spacing: 0; line-height: 24px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: center;
    }
    .seg.wide button.on { color: var(--wa-ink); background: var(--wa-card); box-shadow: 0 1px 2px rgba(0,0,0,.08); font-weight: 600; }
    .seg.wide button:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c, var(--wa-accent)) 60%, transparent); }
    .field.seg-field { align-items: center; }
    /* Readings: which of two ways to count, then how many when it is a count. */
    .readings-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .readings-row .seg.wide { flex: 1 1 auto; width: auto; }
    /* Three digits is the most this box ever holds. The type selector is
       there to outrank the ".field input[type=number]" full-width rule. */
    .field .readings-row input.short[type=number] { width: 56px; flex: none; text-align: right; }
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
    /* The complication bar: one line saying what this whole face is, tinted in
       the complication's own colour so it never reads as part of the canvas. */
    .card.comp-bar {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 8px 12px; flex: none;
      background: color-mix(in srgb, ${ce(ee.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${ce(ee.complication)} 25%, var(--wa-card));
    }
    .card.comp-bar .panel-title { margin: 0; flex: none; }
    .card.comp-bar .spacer { flex: 1; min-width: 0; }
    .card.comp-bar .settings { flex: 1 1 auto; min-width: 0; max-width: none; }
    .card.comp-bar .acts { display: flex; align-items: center; gap: 2px; flex: none; }
    .canvas-bar {
      display: flex; align-items: center; gap: 4px; padding: 8px 10px; flex-wrap: wrap; font-size: 13px; flex: none;
      border-bottom: 1px solid var(--wa-line); background: var(--wa-raised);
    }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
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
       and what the house is telling it right now. */
    /* Where the selected layer sits, under the face rather than in the far
       column: the same tinted card, laid out as one row so it costs the canvas
       two lines instead of a scroll. */
    .place-wrap { flex: none; }
    .sec.place-bar, .sec.tap-bar { margin: 0; border-radius: var(--wa-r-md); }
    .sec.place-bar .sec-h, .sec.tap-bar .sec-h { height: 34px; cursor: default; }
    .sec.place-bar .sec-h:hover, .sec.tap-bar .sec-h:hover { background: transparent; }
    .sec.place-bar .sec-b.place-row, .sec.tap-bar .sec-b.tap-row {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; padding: 0 0 10px;
    }
    /* A bar with nothing to say yet: neutral ground and a neutral mark, with
       the words at 60%, so it reads as a place a setting will appear rather
       than as a setting that is on. The toggle itself stays at full strength,
       since switching it on is the whole point of the row being there. */
    .sec.muted-bar,
    .sec.muted-bar[data-open="true"] {
      background: color-mix(in srgb, var(--wa-muted) 6%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-muted) 20%, var(--wa-card));
    }
    .sec.muted-bar .sec-h .swatch { background: var(--wa-muted); }
    .sec.muted-bar .sec-h h4, .sec.muted-bar .sec-h .sum, .sec.muted-bar .sec-b .hint { opacity: .6; }
    /* The Tap row: the toggle, then whatever the action needs, all on one line.
       tappableSection puts its fields in a .value-editor block, so that block
       is what has to lie down rather than stack. */
    .sec-b.tap-row > :is(.field, .value-editor, .hint) { margin-top: 0; padding-top: 0; border-top: 0; }
    .tap-row .field.check { display: flex; align-items: center; gap: 8px; flex: none; margin: 0; }
    .tap-row .value-editor {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px;
      flex: 1 1 320px; min-width: 260px; margin: 0; padding-left: 10px;
    }
    .tap-row .value-editor .field { display: flex; align-items: center; gap: 6px; margin: 0; width: auto; min-width: 0; }
    .tap-row .value-editor .field > span { flex: none; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); white-space: nowrap; }
    .tap-row .value-editor .field select { width: 150px; }
    .tap-row .value-editor .field.entity-field { flex: 1 1 200px; max-width: 300px; }
    .tap-row .value-editor .field.entity-field input { width: 100%; }
    .tap-row .value-editor .chips { flex: none; }
    /* The prose, muted, at the end of the line or on a line of its own. */
    .sec-b.tap-row > .hint { margin: 0; min-width: 0; color: var(--wa-muted); }
    /* Off, the one short hint sits on the line beside the toggle; on, the long
       one drops under the fields it explains. */
    .sec-b.tap-row > .value-editor ~ .hint:last-child { flex-basis: 100%; }
    /* A row, so the hairlines that separate a card's stacked blocks go. */
    .sec-b.place-row > :is(.field, .grid4, .hint) { margin-top: 0; padding-top: 0; border-top: 0; }
    .place-row .grid4 { display: flex; gap: 6px; flex: none; }
    .place-row .grid4 .field { width: 74px; }
    .place-row .field { margin: 0; }
    .place-row .field.slider { display: flex; align-items: center; gap: 8px; flex: 1 1 200px; min-width: 170px; }
    .place-row .field.slider > span { flex: none; }
    .place-row .field.slider .slider-row { flex: 1; min-width: 0; }
    .place-row .field.check { display: flex; align-items: center; gap: 8px; flex: none; }
    /* The one line of prose sits at the far end, or drops under the row when
       there is no room for it there. */
    .sec-b.place-row > .hint { margin: 0 0 0 auto; text-align: right; flex: 1 1 220px; min-width: 180px; }
    .under-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 8px; flex: none; }
    .card.tint-values {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${ce(ee.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${ce(ee.complication)} 25%, var(--wa-card));
    }
    .card.tint-states {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${ce(ee.states)} 12%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${ce(ee.states)} 35%, var(--wa-card));
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
    .settings { max-width: 1100px; }
    .settings .gen-row { display: grid; grid-template-columns: minmax(160px, 1.3fr) minmax(130px, .8fr) minmax(150px, 1fr) minmax(220px, 1.4fr); gap: 4px 18px; align-items: start; }
    .settings .gen-row .field { display: flex; flex-direction: column; align-items: stretch; gap: 5px; margin: 4px 0; min-width: 0; }
    .settings .gen-row .field > span { font-size: 12px; }
    .settings .flash-row { display: flex; align-items: center; gap: 10px; min-height: 32px; min-width: 0; }
    .settings .flash-row input.flash-color { width: 36px; height: 28px; padding: 2px; }
    .settings .flash-row .muted { color: var(--wa-muted); font-size: 13px; }
    .settings .entity-field, .settings .hint { max-width: 800px; }
    /* generalEditor draws stacked label-over-control rows everywhere else; on
       the complication bar the same fields lie down in one line, label beside
       control. The row's own box drops out of the layout so its fields join
       the bar's flex line directly, and whatever a tap action needs lands
       beside them instead of under them. */
    .settings.inline { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-width: 0; }
    .settings.inline .gen-row { display: contents; }
    .settings.inline .field { flex-direction: row; align-items: center; gap: 6px; margin: 0; width: auto; min-width: 0; }
    .settings.inline .field > span { flex: none; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); white-space: nowrap; }
    .settings.inline .field input[type=text] { width: 150px; }
    .settings.inline .field select { width: 150px; }
    .settings.inline .field.flash-cell .flash-row { min-height: 0; }
    .settings.inline .field.entity-field, .settings.inline .field.value-chip-field { flex: 1 1 200px; max-width: 300px; }
    .settings.inline .field.entity-field input { width: 100%; }
    /* The rename warning is a second line under the row, not a cell in it. */
    .settings.inline .hint { flex-basis: 100%; margin: 2px 0 0; max-width: none; }
    /* Shared values: a chip per named value, laid out as a titled sub-section
       of the settings rather than a loose row of boxes. The whole chip opens
       the editor, so it carries the hover and selected states a row would, and
       the delete button stays out of the way until the pointer is on it. */
    .values-list .empty { font-size: 12px; color: var(--wa-muted); margin: 0; padding: 4px 0; text-align: left; }
    .values-list .data { display: flex; flex-direction: column; gap: 6px; }
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
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .values-list .datum .meta.none { font-family: inherit; font-style: italic; color: var(--wa-muted); }
    .values-list .datum button.icon { opacity: 0; pointer-events: none; flex: none; }
    .values-list .datum:hover button.icon, .values-list .datum:focus-within button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum button.icon:hover:not(:disabled), .values-list .datum button.icon:focus-visible { opacity: 1; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
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
    .vchip input { width: 110px; min-height: 24px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
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
    .column.inspector { padding: 10px 16px 12px; }
    .insp-head { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0; position: sticky; top: 0; background: var(--wa-card); z-index: 5; }
    .crumbs { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
    .crumbs button { font: inherit; font-size: 12.5px; font-weight: 600; background: transparent; border: 0; padding: 3px 6px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .5; }
    .here {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 6px; border-radius: 6px;
      background: color-mix(in srgb, var(--k) 14%, transparent); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
      color: var(--wa-ink); font-weight: 500;
    }
    .kchip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: var(--k); padding: 1px 5px; border-radius: 3px; }
    .insp-head .expand {
      flex: none; font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 0; padding: 0 9px; min-height: 26px; border-radius: 8px;
    }
    .insp-head .expand:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .insp-body { padding: 0 0 24px; }
    .empty-insp { padding: 40px 20px; text-align: center; color: var(--wa-muted); display: flex; flex-direction: column; gap: 10px; align-items: center; font-size: 13px; }
    .empty-insp svg { width: 40px; height: 40px; opacity: .5; }
    .empty-insp b { color: var(--wa-ink); font-weight: 500; font-size: 14px; }
    /* One card per section, washed in that section's colour: the ring and the
       ground are the same hue at two strengths, so a stack of five cards reads
       as five subjects without a single border between them. */
    .sec {
      --c: var(--wa-accent);
      border: 0; border-radius: 9px; padding: 0 12px; margin: 6px 0 0; overflow: hidden;
      background: color-mix(in srgb, var(--c) 8%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 28%, var(--wa-card));
      transition: box-shadow .12s ease-out;
    }
    .sec[data-open="true"] { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 45%, var(--wa-card)); }
    .sec-h { display: flex; align-items: center; gap: 8px; height: 42px; margin: 0 -12px; padding: 0 12px; cursor: pointer; transition: background-color .12s ease-out; }
    .sec-h:hover { background: color-mix(in srgb, var(--c) 10%, transparent); }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--c); }
    .sec-h .swatch { width: 20px; height: 20px; border-radius: 5px; background: var(--c); border: 0; color: #fff; flex: none; display: grid; place-items: center; }
    .sec-h .swatch svg { width: 12px; height: 12px; stroke-width: 2.4; }
    /* Title and summary on one line: the summary is what the card says while
       it is shut, so it belongs beside the title, not under it. */
    .sec-h .tt { display: flex; flex-direction: row; align-items: center; gap: 8px; min-width: 0; flex: 1; }
    /* A row, so a card's reset button sits against its title rather than out
       at the far edge beside the chevron, which reads as a header action for
       the card as a whole instead of a way back for what is in it. */
    .sec-h h4 { margin: 0; flex: none; font-size: 13.5px; font-weight: 700; letter-spacing: 0; display: flex; align-items: center; gap: 2px; white-space: nowrap; }
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
    .sec-h .sum { margin-left: auto; max-width: 150px; color: var(--wa-muted); font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sec-h .chev { color: var(--wa-line-strong); flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 15px; height: 15px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 2px 0 14px; }
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
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } .ent-box.needs { animation: none; } }
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.loadListView(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners(),this.watchStatusTimer=window.setInterval(()=>{this.refreshWatchStatus()},lm)}loadColumnWidths(){try{let t=window.localStorage.getItem(Nd);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=Kr(i.left)),typeof i.right=="number"&&(this.colRight=Kr(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(Nd,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadListView(){try{let t=window.localStorage.getItem(_d);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(_d,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return p`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=Rd:this.colRight=Id,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=Pd(this.panelWidth,this.colLeft,this.colRight),s=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=c=>{if(c.pointerId!==i.pointerId)return;let h=c.clientX-r,m=Kr(t==="left"?s+h:s-h);t==="left"?this.colLeft=m:this.colRight=m},d=c=>{c.pointerId===i.pointerId&&(u(),this.saveColumnWidths())},u=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),this.fades.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.watchStatusTimer!==void 0&&window.clearInterval(this.watchStatusTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=[t.rectangular,t.circular,t.corner].filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||Gr(i)!==Gr(this.inspect))&&(this.openSections=new Set(Hr))}}updated(t){this.fades.refresh([this.renderRoot.querySelector(".column.inspector"),this.renderRoot.querySelector(".layers"),this.renderRoot.querySelector(".column.canvas")]);let i=Gr(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}t.key==="Escape"&&(this.timestampActiveId=void 0);let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!ym.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!o){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!o){this.deleteSelection()&&t.preventDefault();return}let s=dm[t.key];if(s&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(s.dx,s.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!r?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!r&&(t.preventDefault(),this.redo()),r||o))return;let d=t.key.toLowerCase(),u=!0;d==="a"?this.selectAll():d==="c"?this.copySelection():d==="x"?this.copySelection()&&this.deleteSelection():d==="v"?this.pasteClip():d==="d"?this.duplicateSelection():d==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():d==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):u=!1,u&&t.preventDefault()}selectedIds(){let t=this.draft?.config;if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?Ze(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();return!this.canEdit||t.length===0?!1:(this.mutate(i=>{for(let a of t)et(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0?!1:(this.clipboard=on(t,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.clipboard,i=this.canvasFamily,a=[];this.mutate(r=>{a=cs(r,t,i)}),this.selectRows(a)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=on(t,i),r=[];this.mutate(o=>{r=At(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=Ue(t,this.canvasFamily).filter(a=>!de(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?Je(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>Gn(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>t.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!Ee(t,a,s).isHidden);this.mutate(s=>{for(let l of i)xe(s,a,l,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(c=>!de(a,c)),o=a.elements.filter(c=>de(a,c)),s=r.findIndex(c=>c.payload.id===t),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let d=r[l],u=r[s];d.payload.groupId!==u.payload.groupId&&(u.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=u.payload.groupId),a.elements=[...r,...o],Ne(a),rn(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await po(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${Et(t)}`}}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0,this.sendStatusKnown=!1;let i=Is(this.owners.find(a=>a.owner_watch_id===t)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await vo(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await ho(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,this.polling=t.polling??!1,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${Et(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=Bt.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=ns(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=Et(i)}this.scheduleTemplates(0)}startNew(t){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new Bt(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return _o(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}async refreshWatchStatus(){if(!(!this.ownerId||this.sendPending))try{let t=await fo(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0}catch{}}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await mo(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,typeof t.applied_token=="number"&&t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=Et(t)}}renderSendButton(){let t=ms({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending,lastPollSeconds:this.lastPollSeconds});if(t.kind==="unsupported"&&!this.sendStatusKnown)return f;let i=fs(t),a=i.resend&&this.hass.user?.is_admin?p`<button class="ghost" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return p`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}</span>${i.note?p`<span class="send-note" title=${i.title}>${i.note}</span>`:f}${a}`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<xa}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i,this.canvasFamily),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=Si(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=Oo(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(sm))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new nt(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),historySeries:i=>this.historySeries.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}}}}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||Gs(t.app_version):!0}get canvasFamily(){if(cn(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&ur(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;!t||t.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Ps(t)[0]??"rectangular")}addHere(t){this.mutate(t)}static sizeWords(t){let i=he[t];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(t,i,a){if(t.elements.length===0||!cn(this.activeFamily))return f;if(Ue(t,i).length>0)return f;let r=te.filter(o=>o!==i&&t.supportedFamilies.includes(o)).filter(o=>ta(t,o)>0);return p`<div class="blank-shape">
      <b>Nothing is on the ${J(i)} shape yet.</b>
      <div class="hint">Each shape has its own layers. The ones on the other shapes belong to
        those shapes, so they are not listed here and nothing you do here can reach them. Add
        layers below, or take a copy of another shape's arrangement.</div>
      ${a&&r.length>0?p`<div class="adders">
            ${r.map(o=>p`<button class="small primary"
              title=${`Put a copy of every layer on the ${J(o)} shape here, where it sits there, scaled to this canvas`}
              @click=${()=>this.mutate(s=>cd(s,o,i))}>Copy the ${J(o)} layout</button>`)}
          </div>
          <div class="hint">The copies are layers of their own: editing one here changes nothing on
            the ${J(r[0])} shape. They are scaled on the way in, because a point is a
            point and this canvas is ${A.sizeWords(i)} against
            ${A.sizeWords(r[0])}, so sizes come down to match and a round
            shape pulls the layout in off its rim. Expect to nudge it by hand afterwards.</div>`:f}
    </div>`}addShape(t){this.mutate(i=>Os(i,t)),this.activeFamily=t,this.inspect={kind:"family"}}removeShape(t){let i=this.draft?.config;if(!i||!Li(i,t))return;let a=Vs(i,t);a.length>0&&!window.confirm(`Remove the ${J(t)} shape? This deletes ${a.join(", ")}. They are on this shape only, so nothing else in the complication loses anything.`)||(this.mutate(r=>Ds(r,t)),this.ensureActiveFamily())}createNew(){let t=this.newFamily,i=this.newName.trim();!t||i===""||this.newNameProblem()!==void 0||(this.closeNewDialog(),this.startNew(is(i,this.freeSlot(),[t])))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let s=structuredClone(i.config);s.id=X(),s.slotIndex=o,i=new Bt(s,null)}let a=i.encoded(),r=await go(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=Bt.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Et(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let t=await yo(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!t.ok){t.error==="conflict"?this.conflict={current:t.current??null,message:t.message??"This complication changed on the server."}:this.saveError=t.message??t.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(t){this.saveError=Et(t)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=X(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await bo(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Et(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},om)}async refreshHistorySeries(){let t=this.draft?.config,i=t?Ha(t):[],a=t?La(t):[];if(i.length===0&&a.length===0){this.historySeries.size>0&&(this.historySeries=new Map);return}let r={};for(let s of i)r[s.key]={entity_id:s.entityId,minutes:s.minutes,points:s.points,...s.mode==="states"?{mode:"states"}:{}};let o={};for(let s of a)o[s.key]={entity_id:s.entityId,minutes:s.minutes,period:s.period,type:s.type};try{let[s,l]=await Promise.all([xo(this.hass,r),ko(this.hass,o).catch(()=>({}))]),d=new Map;for(let[u,c]of Object.entries({...s,...l}))c.ok&&d.set(u,c.series);this.historySeries=d}catch{}}async refreshTemplates(){this.refreshHistorySeries();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await wo(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=vs(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Et(i)}}entityStateFor(t,i,a){let r=this.hass.states[t];if(!r)return;let o=r.attributes,s=t.split(".")[0]??"",l={entityId:t,state:(a?this.testValues.get(t):void 0)??r.state,unitOfMeasurement:typeof o.unit_of_measurement=="string"?o.unit_of_measurement:void 0,iconName:i,domain:s};if(s==="timer"){l.timerState=r.state,typeof o.finishes_at=="string"&&(l.finishesAt=o.finishes_at);let d=bm(o.remaining);d!==void 0&&(l.remaining=d)}return typeof o.entity_picture=="string"&&(l.entityPicture=o.entity_picture),l}buildContext(){let t=new Map;for(let[i,a]of this.compiled?.entities??[]){let r=this.entityStateFor(i,a.iconName??"",!0);r&&t.set(i,r)}return{entityStates:t,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return p`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${t?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let t=this.showTaps;return p`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return p`<button class="pick only-icon" ?disabled=${t} aria-label="Expand the preview"
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}>${N("expand")}</button>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return f;let o=a.slots[t],s=t==="corner"?104/124:o.width/o.height;return p`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
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
    </dialog>`}renderHelpDialog(){let t=St,i=Wr,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${ti}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a folder to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=s=>s.map(([l,d])=>p`<tr><th scope="row"><kbd>${l}</kbd></th><td>${d}</td></tr>`);return p`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
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
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.draft?.config;if(!i)return;let r=t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?Xa(i,r):void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(t,i){if(this.picking){i.preventDefault(),this.pickAt(t,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,s=a.closest("svg"),l=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=l!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let S=this.focusTapId();if(S!==void 0&&o===S&&s&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,s,S,r??void 0);return}let T=this.hitLayerId(i);T?this.inspect={kind:"layer",id:T}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(t!==this.activeFamily){this.activeFamily=t;return}let u=zd(i);if(!u&&this.multi.size>0&&(this.multi=new Set),!o||!s)return;let c=Xa(this.draft.config,o),h=this.draft.config.elements.find(S=>S.payload.id===c);if(!c||!h)return;if(u){i.preventDefault(),this.togglePick(c);return}let m=Je(this.draft.config,c),g=m!==void 0&&this.inspect.kind==="group"&&this.inspect.id===m.id;if(m&&(m.locked||g)&&!r&&!d){this.beginGroupGesture(t,i,s,m);return}if((this.inspect.kind!=="layer"||this.inspect.id!==c)&&(this.inspect={kind:"layer",id:c},r))return;i.preventDefault();let v=Ee(this.draft.config,t,h).frame,$=this.gestureCanvas(t);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=c;let S=h.payload,T=he[t],k=v.width*T.width,C=v.height*T.height,_={x:0,y:0,w:k,h:C,cx:k/2,cy:C/2},D=Ii(S,_,Ri(new Date));if(this.cancelGesture?.(),l){let R=$.width/T.width,U=S.timestampSize;this.cancelGesture=fl(s,i,l,{w:D.w*R,h:D.h*R},(O,y)=>{let x=Math.min(40,Math.max(4,Math.round(U*O)));this.mutate(z=>{let P=z.elements.find(B=>B.payload.id===c);P?.kind==="image"&&(P.payload.timestampSize=x)},`ts-size-${c}`),y&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let V={x:0,y:0,w:v.width*$.width,h:v.height*$.height},ie=Ye(S)?{x:S.timestampX,y:S.timestampY}:{x:(D.x+D.w/2)/_.w,y:(D.y+D.h/2)/_.h},w=!1;this.cancelGesture=ml(s,V,i,ie,(R,U,O)=>{O||(w=!0),w&&this.mutate(y=>{let x=y.elements.find(z=>z.payload.id===c);x?.kind==="image"&&(x.payload.timestampX=R,x.payload.timestampY=U)},`ts-${c}`),O&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=Gi(s,$,i,{elementId:c,frame:v,handle:r??void 0},{onFrame:(S,T,k)=>{this.mutate(C=>xe(C,t,S,{frame:T}),`drag-${S}-${t}`),k&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r){let o=this.draft?.config;if(!o)return;let s=Ze(o,r.id);if(s.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let l=new Map(s.map($=>[$.payload.id,Ee(o,t,$).frame])),d=[...l.values()],u=Math.min(...d.map($=>$.x)),c=Math.min(...d.map($=>$.y)),h=Math.max(...d.map($=>$.x+$.width)),m=Math.max(...d.map($=>$.y+$.height)),g={x:u,y:c,width:h-u,height:m-c,rotationDegrees:0},v=$=>Math.round($*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=Gi(a,this.gestureCanvas(t),i,{elementId:r.id,frame:g},{onFrame:($,S,T)=>{let k=S.x-g.x,C=S.y-g.y;this.mutate(_=>{for(let[D,V]of l)xe(_,t,D,{frame:{...V,x:v(V.x+k),y:v(V.y+C)}})},`drag-group-${r.id}-${t}`),T&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(t,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?pl:1,s=t*o,l=i*o,d=this.canvasFamily,u=he[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,s,l))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,u,`nudge-multi-${d}`,s,l);if(this.inspect.kind==="group"){let $=this.inspect.id;return this.nudgeMany(Ze(r,$).map(S=>S.payload.id),d,u,`nudge-group-${$}-${d}`,s,l)}if(this.inspect.kind!=="layer")return!1;let c=this.inspect.id,h=r.elements.find($=>$.payload.id===c);if(!h)return!1;let m=Je(r,c);if(m?.locked)return this.nudgeMany(Ze(r,m.id).map($=>$.payload.id),d,u,`nudge-group-${m.id}-${d}`,s,l);let g=Ee(r,d,h).frame,v=Cr(g,s,l,u);return(v.x!==g.x||v.y!==g.y)&&this.mutate($=>xe($,d,c,{frame:v}),`nudge-${c}-${d}`),!0}nudgeMany(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return!1;let d=C=>Math.round(C*1e3)/1e3,u=new Map;for(let C of t){let _=l.elements.find(D=>D.payload.id===C);_&&u.set(C,Ee(l,i,_).frame)}if(u.size===0)return!1;let c=[...u.values()],h=Math.min(...c.map(C=>C.x)),m=Math.min(...c.map(C=>C.y)),g=Math.max(...c.map(C=>C.x+C.width)),v=Math.max(...c.map(C=>C.y+C.height)),$={x:h,y:m,width:g-h,height:v-m,rotationDegrees:0},S=Cr($,o,s,a),T=S.x-$.x,k=S.y-$.y;return(T!==0||k!==0)&&this.mutate(C=>{for(let[_,D]of u)xe(C,i,_,{frame:{...D,x:d(D.x+T),y:d(D.y+k)}})},r),!0}nudgeTimestamp(t,i,a,r){let o=this.draft?.config,s=o?.elements.find($=>$.payload.id===t);if(!o||s?.kind!=="image"||s.payload.timestamp!==!0)return!1;let l=s.payload,d=he[i],u=Ee(o,i,s).frame,c=u.width*d.width,h=u.height*d.height,m=Ii(l,{x:0,y:0,w:c,h,cx:c/2,cy:h/2},Ri(new Date)),g=Ye(l)?{x:l.timestampX,y:l.timestampY}:{x:c>0?(m.x+m.w/2)/c:.5,y:h>0?(m.y+m.h/2)/h:.5},v=hl(g,a,r,{w:c,h});return(v.x!==g.x||v.y!==g.y)&&this.mutate($=>{let S=$.elements.find(T=>T.payload.id===t);S?.kind==="image"&&(S.payload.timestampX=v.x,S.payload.timestampY=v.y)},`nudge-ts-${t}`),!0}gestureCanvas(t){let i=Mi(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=cr(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:Me(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(c=>c.payload.id===r);if(!s||!l)return;let d=de(s,l),u=Ee(s,t,l).frame;this.cancelGesture?.(),this.cancelGesture=Gi(a,this.gestureCanvas(t),i,{elementId:r,frame:u,handle:o},{onFrame:(c,h,m)=>{this.mutate(g=>{d?os(g,c,t,h):xe(g,t,c,{frame:h})},`tap-box-${c}-${t}`),m&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:Pd(this.panelWidth,this.colLeft,this.colRight),r=this.records.find(o=>o.id===this.selectedId);return p`
      <header>
        <label>Choose watch
          <select @change=${o=>{this.selectOwner(o.target.value)}}>
            ${this.owners.map(o=>p`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id===this.ownerId}>
              ${Od(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
        ${Md()}
        <label class="pick-label" for="wa-picker">Choose complication</label>
        ${this.renderPicker()}
        ${this.hass.user?.is_admin?p`<span class="hor" aria-hidden="true">or</span>${Md()}`:f}
        ${this.renderNewButton()}
        <span class="spacer"></span>
        <button class="help" title="Keys and mouse tips" aria-label="Keys and mouse tips" @click=${()=>{this.helpOpen=!0}}>?</button>
        <div class="toolbar hbox hist">
          <button class="icon" @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${N("undo")}</button>
          <span class="hdiv"></span>
          <button class="icon" @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${N("redo")}</button>
        </div>
        <div class="hbox status">
          <span class="dirty-dot ${i?"":r?"clean":"none"}" title=${i?"Unsaved changes":r?"Saved":"Not saved yet"}></span>
          ${this.renderSendButton()}
          <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":t?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
        </div>
      </header>
      ${this.loadError?p`<div class="card error">${this.loadError}</div>`:f}
      ${this.helpOpen?this.renderHelpDialog():f}
      ${this.newOpen?this.renderNewDialog():f}
      ${this.watchSupported?p`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:p`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${Us(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(J).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(t){return p`<span class="shape-dots">${Vt.map(i=>p`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${J(i)}></span>`)}</span>`}static{this.FILTER_FROM_ROWS=8}recordPreview(t){let i=this.recordPreviews.get(t.id);if(i&&i.revision===t.revision)return i;try{let a=yi(t.document),r={revision:t.revision,config:a,entities:[...Si(a).entities.values()]};return this.recordPreviews.set(t.id,r),r}catch{this.recordPreviews.delete(t.id);return}}renderRowArt(t){let i=this.recordPreview(t);if(!i)return p`<span class="pk-art"></span>`;let a=i.config,o=(this.pickerFilter!=="all"&&a.supportedFamilies.includes(this.pickerFilter)?this.pickerFilter:void 0)??ur(a)??"inline",s=new Map;for(let u of i.entities){let c=this.entityStateFor(u.entityId,u.iconName??"",!1);c&&s.set(u.entityId,c)}let l=Ei(a,{entityStates:s,templateResults:new Map,namedValues:a.values});if(o==="inline")return p`<span class="pk-art inline">${this.renderInlinePreview(l.inline,!0)}</span>`;let d=l[o];return d?p`<span class="pk-art ${o}">${Hi(d,{icons:this.icons,imageSizes:this.imageSizes,slot:dn.slots[o]})}</span>`:p`<span class="pk-art"></span>`}renderPickerFilter(t){let i=r=>r.kind==="record"?Ur(r.record):r.families,a=(r,o,s)=>p`<button
      class="pk-chip ${this.pickerFilter===r?"on":""}" ?disabled=${s===0}
      aria-pressed=${this.pickerFilter===r?"true":"false"}
      @click=${()=>{this.pickerFilter=r}}>${o}<span class="pk-count">${s}</span></button>`;return p`<div class="pk-filter">
      ${a("all","All",t.length)}
      ${Vt.map(r=>a(r,J(r),t.filter(o=>i(o).includes(r)).length))}
    </div>`}renderPicker(){let t=this.draft,i=this.records.find(d=>d.id===this.selectedId),a=t?t.config.name.trim()||"Untitled":"No complication",r=t?t.config.supportedFamilies:[],o=this.pickerRows(),s=this.pickerFilter,l=s==="all"?o:o.filter(d=>(d.kind==="record"?Ur(d.record):d.families).includes(s));return p`<div class="picker">
      <button id="wa-picker" aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?p`<span class="pk-rev">r${i.revision}</span>`:t&&t.baseRevision===null?p`<span class="pk-rev">unsaved</span>`:f}
        ${N("chevron")}
      </button>
      ${this.pickerOpen?p`<div class="menu" role="listbox">
        ${o.length>=A.FILTER_FROM_ROWS?this.renderPickerFilter(o):f}
        ${o.length===0&&!(t&&t.baseRevision===null)?p`<div class="empty">No complications for this watch yet.</div>`:f}
        ${o.length>0&&l.length===0?p`<div class="empty">Nothing on this watch has a ${s==="all"?"":J(s)} shape.</div>`:f}
        ${l.map(d=>d.kind==="record"?p`<button class="row" role="option" aria-current=${d.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(d.record)}}>
              ${this.renderRowArt(d.record)}
              <span class="pk-name">${String(d.record.document?.name??"Untitled")}</span>
              ${this.shapeDots(Ur(d.record))}
              <span class="pk-badge">r${d.record.revision}</span>
            </button>`:p`<div class="row locked" title=${d.title}>
              <span class="pk-art"></span>
              <span class="pk-name">${d.name}</span>
              ${this.shapeDots(d.families)}
              <span class="pk-badge">${d.badge}</span>
            </div>`)}
        ${t&&t.baseRevision===null?p`<div class="row" aria-current="true"><span class="pk-art"></span><span class="pk-name">${a}</span>${this.shapeDots(r)}<span class="pk-badge">unsaved</span></div>`:f}
      </div>`:f}
    </div>`}togglePicker(t=!this.pickerOpen){this.pickerOpen=t,t?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderNewButton(){if(!this.hass.user?.is_admin)return f;let t=this.freeSlot()<0;return p`<div class="newc">
      <button class="new-btn primary" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.newOpen?"true":"false"}
        title=${t?"This watch has no free slot. Delete a complication first.":"Make a new complication"}
        @click=${()=>this.openNewDialog()}>${N("plus")}<span>New</span></button>
      ${t?p`<span class="newc-full">watch is full</span>`:f}
    </div>`}takenNames(){let t=[...this.records.map(i=>String(i.document?.name??"")),...this.occupied.map(i=>"name"in i&&typeof i.name=="string"?i.name:"")];return new Set(t.map(i=>i.trim().toLowerCase()).filter(i=>i!==""))}newNameProblem(){let t=this.newName.trim();if(t!==""&&this.takenNames().has(t.toLowerCase()))return"A complication on this watch already has that name."}renderNewDialog(){let t=this.newNameProblem(),i=this.newName.trim()!=="",a=i&&t===void 0&&this.newFamily!==void 0;return p`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${()=>{this.newOpen=!1}}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeNewDialog()}>${N("close")}</button>
      </div>
      <div class="new-body">
        <div class="field">
          <span>Name</span>
          <input type="text" .value=${this.newName} placeholder="Kitchen at a glance" maxlength="60"
            aria-label="Complication name" aria-invalid=${t?"true":"false"}
            @input=${r=>{this.newName=r.target.value}} />
        </div>
        ${t?p`<div class="hint err">${t}</div>`:p`<div class="hint">This is what the name shows on the watch face picker, so make it one you will recognise there.</div>`}
        <div class="field new-shapes">
          <span>Shape</span>
          <div class="shape-cards" role="radiogroup" aria-label="Shape">
            ${Vt.map(r=>p`<button type="button" role="radio" class="shape-card ${this.newFamily===r?"on":""}"
              aria-checked=${this.newFamily===r?"true":"false"}
              @click=${()=>{this.newFamily=r}}>
              ${um(r)}
              <span class="shape-card-name">${J(r)}</span>
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
    </dialog>`}openNewDialog(){this.freeSlot()<0||(this.newOpen=!0,this.newName="",this.newFamily=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.new-dialog");t&&(t.open||t.showModal(),t.querySelector("input[type=text]")?.focus())}))}closeNewDialog(){let t=this.renderRoot.querySelector("dialog.new-dialog");t?.open?t.close():this.newOpen=!1}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(p`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(p`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(p`<div class="banner err"><b>Save rejected.</b> ${a.message}
        ${a.current?p` The server has revision ${a.current.revision}, saved ${a.current.updatedAt} by ${a.current.updatedBy||"unknown"}.`:" The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
          <button class="small" @click=${()=>{this.conflict=void 0}}>Keep editing</button>
        </div></div>`)}else this.remoteRevision!==void 0&&t.push(p`<div class="banner warn">${this.remoteRevision===-1?"This complication was deleted on the server while you were editing.":`Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
        </div></div>`);return this.saveError&&t.push(p`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`),t}renderOrphanBanner(){let t=this.selectedOwner;if(!t?.is_orphan)return;let i=this.owners.filter(a=>!a.is_orphan);return p`<div class="banner warn">
      <b>This watch is no longer registered.</b> Reinstalling the watch app gives the watch a new id, and these
      ${t.complication_count} complication${t.complication_count===1?"":"s"} stayed behind under the old one.
      ${this.hass.user?.is_admin?i.length===0?p`<div class="hint">No registered watch to move them to. Open Wrist Assistant on the watch first.</div>`:p`<div class="acts">
              <select @change=${a=>{this.moveTarget=a.target.value||void 0}}>
                <option value="" ?selected=${!this.moveTarget}>Move all to…</option>
                ${i.map(a=>p`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${Od(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:p`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?p`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return f;if(this.activeFamily==="inline")return f;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return p`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
        <span class="swatch">${N("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?f:p`<span class="mini">${pr.length} kinds · ${ei.length} presets</span>`}
        ${a?p`<span class="tool-set" @click=${s=>s.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Names"],["expanded","Samples"]].map(([s,l])=>p`
                  <button class=${this.addDetail===s?"on":""} title=${l} aria-label=${l} aria-pressed=${this.addDetail===s?"true":"false"}
                    @click=${()=>{this.addDetail=s,this.saveListView()}}>${N(s)}</button>`)}
              </span>
            </span>`:f}
        <span class="chev">${N("chevron")}</span>
      </h2>
      ${a?p`
          <div class="add-grid ${r?"":"lean"}">
            ${pr.map(s=>p`<button class="add" style=${`--k:${me[s]}`} ?disabled=${i} title=${`Add a blank ${un[s].toLowerCase()} layer`}
              @click=${()=>{let l=Ve(s);this.addHere(d=>{d.elements.push(l)}),this.inspect={kind:"layer",id:l.payload.id}}}
              >${r?p`<span class="well">${ul(s)}</span>`:f}<span class="add-name">${r?N(s):p`<span class="k"></span>`}<span>${un[s]}</span></span></button>`)}
          </div>
          <div class="presets">
            <span class="presets-l">Presets</span>
            ${ei.map(s=>p`<button class="preset" title=${s.blurb}
              ?disabled=${t.elements.length+s.layerCount>64}
              @click=${()=>this.openPreset(s.kind)}>${s.title}</button>`)}
          </div>`:f}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let s=o.elements.filter(g=>!de(o,g)),l=o.elements.filter(g=>de(o,g)),d=[...s].reverse(),u=d.find(g=>g.payload.id===i);if(!u)return;let c=o.groups?.find(g=>g.id===t),h=c?d.filter(g=>g.payload.groupId===c.id):d.filter(g=>g.payload.id===t);if(h.length===0||h.includes(u))return;d=d.filter(g=>!h.includes(g));let m;if((c||r)&&u.payload.groupId!==void 0){let g=d.filter(v=>v.payload.groupId===u.payload.groupId);m=a?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else m=d.indexOf(u)+(a?0:1);if(d.splice(m,0,...h),!c){let g=h[0],v=r?void 0:u.payload.groupId;v===void 0?delete g.payload.groupId:g.payload.groupId=v}o.elements=[...d.reverse(),...l],Ne(o),rn(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?ot:0),l=o.bottom-(r.classList.contains("drop-after")?ot:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(zd(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(l=>!de(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(t);if(o<0||s<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=Ga(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return f;if(this.activeFamily==="inline")return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(w,R)=>this.moveLayer(w,R),o=w=>{let R;this.mutate(U=>{R=ls(U,w)}),R&&(this.inspect={kind:"layer",id:R})},s=w=>{this.mutate(R=>et(R,w)),this.inspect.kind==="layer"&&this.inspect.id===w&&(this.inspect={kind:"general"})},l=Ue(t,a).filter(w=>!de(t,w)).reverse(),d=ye(this.host()),u=new nt(this.buildContext(),this.draft?.config),c=t.perFamily[this.activeFamily],h=this.inspect.kind==="family",m=`${c?.backgroundColorHex?$e(c.backgroundColorHex):"transparent"} \xB7 ${c?.borderColorHex?`${c.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(w=>t.elements.some(R=>R.payload.id===w)).length,v=Ei(t,this.buildContext(),this.forced)[a],$=pm[this.thumbStep],S=Math.round(Ad*$),T=Math.round(Hd*$),k=w=>v?p`<span class="thumb">${zs(v,w,{icons:this.icons,imageSizes:this.imageSizes,width:S,height:T})}</span>`:p`<span class="thumb"></span>`,C=this.layerDetail==="expanded",_=(w,R,U=!1)=>{let O=w.payload.id,y=this.inspect.kind==="layer"&&this.inspect.id===O,x=Ee(t,a,w),z=x.isHidden,P=Me(t,O)[0],B=Xn(w.payload.rules),G=this.picking&&this.pickHoverId===O,q=this.rowDrag(O,i);return p`<div class="layer ${y?"hl":""} ${U?"held":""} ${G?"pick":""} ${z?"dim":""} ${this.multi.has(O)?"multi":""} ${R?"kid":""} ${C?"rich":""}"
        style=${`--k:${me[w.kind]}`} tabindex="0" draggable=${q.draggable}
        @pointerenter=${()=>{this.listHoverIds=[O]}}
        @pointerleave=${()=>this.leaveRow([O])}
        @click=${Y=>this.clickRow(O,Y)}
        @keydown=${Y=>{Y.key==="Enter"&&(this.inspect={kind:"layer",id:O})}}
        @dragstart=${q.onStart} @dragend=${q.onEnd} @dragover=${q.onOver} @drop=${q.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${N("grip")}</span>
        <span class="bar"></span>
        ${k([O])}
        <span class="name">
          <b>${Ie(w,d)}</b>
          <small><span class="kind">${un[w.kind]}</span> · ${xm(w,u,this.historySeries,x.size)}</small>
          ${C?p`<span class="facts">${vm(this.host(),a,w,x).map(Y=>p`<span class="fact"><b>${Y.label}</b> ${Y.value}</span>`)}</span>`:f}
        </span>
        <span class="right">
          <span class="badges">
            ${P?p`<span class="badge tap" title=${`Tappable \xB7 ${Ie(P,d)}`}>tap</span>`:f}
            ${w.payload.rules.length===0?f:p`<span class="badge states" title=${B}>${B.replace(/\.$/,"").toLowerCase()}</span>`}
            ${z?p`<span class="badge">hidden</span>`:f}
          </span>
          ${i?p`<span class="acts">
            <button class="icon" title=${`Bring forward (${St}])`} aria-label="Bring forward" @click=${Y=>{Y.stopPropagation(),r(O,1)}}>${N("up")}</button>
            <button class="icon" title=${`Send back (${St}[)`} aria-label="Send back" @click=${Y=>{Y.stopPropagation(),r(O,-1)}}>${N("down")}</button>
            <button class="icon" title=${`${x.isHidden?"Show":"Hide"} (${Wr}${St}H)`} aria-label=${x.isHidden?"Show this layer":"Hide this layer"} @click=${Y=>{Y.stopPropagation(),this.mutate(Ae=>xe(Ae,a,O,{isHidden:!x.isHidden}))}}>${N(x.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${St}D)`} aria-label="Duplicate" @click=${Y=>{Y.stopPropagation(),o(O)}}>${N("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${Y=>{Y.stopPropagation(),s(O)}}>${N("delete")}</button>
          </span>`:f}
        </span>
      </div>`},D=(w,R)=>{let U=this.inspect.kind==="group"&&this.inspect.id===w.id,O=!this.collapsed.has(w.id),y=this.rowDrag(w.id,i),x=R[0],z=R[R.length-1],P=G=>{let q=G.currentTarget,Y=q.getBoundingClientRect(),Ae=Y.top+(q.classList.contains("drop-before")?ot:0),st=Y.bottom-(q.classList.contains("drop-after")?ot:0),be=(G.clientY-Ae)/Math.max(1,st-Ae);return be<.25?"drop-before":!O&&be>.75?"drop-after":"drop-into"},B=R.map(G=>G.payload.id);return p`<div class="layer group ${U?"hl":""} ${C?"rich":""}" style=${`--k:${ee.group}`} tabindex="0" draggable=${y.draggable}
        @pointerenter=${()=>{this.listHoverIds=B}}
        @pointerleave=${()=>this.leaveRow(B)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:w.id}}}
        @keydown=${G=>{G.key==="Enter"&&(this.inspect={kind:"group",id:w.id})}}
        @dragstart=${y.onStart} @dragend=${y.onEnd}
        @dragover=${G=>{!this.dragId||this.dragId===w.id||(G.preventDefault(),this.markDrop(G.currentTarget,P(G)))}}
        @drop=${G=>{G.preventDefault();let q=P(G);this.clearDragMarks();let Y=this.dragId;if(this.dragId=void 0,!(!Y||!x||!z)){if(q==="drop-before"){this.reorderLayer(Y,x.payload.id,!0,!0);return}if(q==="drop-after"){this.reorderLayer(Y,z.payload.id,!1,!0);return}this.isGroupId(Y)||(this.reorderLayer(Y,x.payload.id,!0),this.mutate(Ae=>Ua(Ae,Y,w.id)))}}}>
        <span class="grip" title="Drag to reorder the whole group.">${N("grip")}</span>
        <span class="bar"></span>
        <span class="folder">${N("folder")}</span>
        <span class="name">
          <b>${w.name}</b>
          <small><span class="kind">Group</span> · ${R.length} layer${R.length===1?"":"s"} · ${w.locked?"locked":"unlocked"}</small>
          ${C?p`<span class="facts"><span class="fact"><b>Holds</b> ${R.map(G=>Ie(G,d)).join(", ")}</span></span>`:f}
        </span>
        <span class="right">
          ${i?p`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${Wr}${St}G)`} aria-label="Ungroup" @click=${G=>{G.stopPropagation(),this.mutate(q=>Gn(q,w.id)),U&&(this.inspect={kind:"general"})}}>${N("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${w.locked?"on":""}" ?disabled=${!i}
            title=${w.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${w.locked?"Unlock the group":"Lock the group"}
            @click=${G=>{G.stopPropagation(),this.mutate(q=>{let Y=q.groups?.find(Ae=>Ae.id===w.id);Y&&(Y.locked=!Y.locked)})}}>${N(w.locked?"lock":"unlock")}</button>
          <button class="chev" aria-expanded=${O?"true":"false"} title=${O?"Fold the group":"Unfold the group"}
            @click=${G=>{G.stopPropagation();let q=new Set(this.collapsed);O?q.add(w.id):q.delete(w.id),this.collapsed=q}}>${N("chevron")}</button>
        </span>
      </div>`},V=[],ie=new Set;for(let w=0;w<l.length;w++){let R=l[w],U=R.payload.groupId,O=U===void 0?void 0:t.groups?.find(z=>z.id===U);if(!O){V.push(_(R,!1));continue}if(ie.has(O.id))continue;ie.add(O.id);let y=l.filter(z=>z.payload.groupId===O.id);V.push(D(O,y));let x=this.inspect.kind==="group"&&this.inspect.id===O.id;this.collapsed.has(O.id)||V.push(p`<div class="group-kids">${y.map(z=>_(z,!0,x))}</div>`)}return p`<div class="card layers-card" style=${`--thumb-w:${S}px;--thumb-h:${T}px`}>
      <h2 class="panel-title tools" style=${`--c:${ee.place}`}><span class="swatch">${N("layers")}</span>Layers
        <span class="mini">top draws last</span><span class="spacer"></span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([w,R])=>p`
              <button class=${this.layerDetail===w?"on":""} title=${R} aria-label=${R} aria-pressed=${this.layerDetail===w?"true":"false"}
                @click=${()=>{this.layerDetail=w,this.saveListView()}}>${N(w)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${hm.map((w,R)=>p`
              <button class=${this.thumbStep===R?"on":""} title=${`${Ld[R]} row pictures`}
                aria-label=${`${Ld[R]} row pictures`} aria-pressed=${this.thumbStep===R?"true":"false"}
                @click=${()=>{this.thumbStep=R,this.saveListView()}}>${w}</button>`)}
          </span>
        </span>
      </h2>
      ${g>=2&&i?p`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${St}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?p`<div class="hint">${ti}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:f}
      ${t.elements.length===0?p`<div class="empty">No layers yet. Add one above.</div>`:f}
      ${this.renderShapeIsBlank(t,a,i)}
      <div class="layers">
      ${V}
      </div>
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${ee.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${w=>{w.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${w=>{this.dragId&&(w.preventDefault(),this.markDrop(w.currentTarget,"drop-before"))}}
        @drop=${w=>{w.preventDefault(),this.clearDragMarks();let R=this.dragId,U=[...l].reverse().find(O=>O.payload.id!==R&&O.payload.groupId!==R);R&&U&&this.reorderLayer(R,U.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${N("shape")}</span>
        <span class="bar"></span>
        ${k([])}
        <span class="name">
          <b>${J(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${m}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
    </div>`}renderInlineHasNoLayers(){return p`<div class="card">
      <h2 class="panel-title"><span class="swatch">${N("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderPresetDialog(){let t=this.presetKind?Cd(this.presetKind):void 0,i=this.presetEntity;return p`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?f:p`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${at(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Fd,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){this.canEdit&&(this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=Td(s,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return p`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.draft?.config;if(!t)return p`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=Ei(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return p`
      ${this.renderComplicationBar()}
      <div class="card canvas-card">
        <div class="canvas-bar">
          ${this.renderShapeTabs(t,i)}
          <span class="spacer"></span>
          <span class="inbox" title=${`Layouts are made in the ${dn.label} box. Smaller cases scale it down.`}>
            <span class="pre">Preview as</span>
            <select aria-label="Preview as" @change=${o=>{this.previewCase=o.target.value}}>
              ${Yn.map(o=>p`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
            </select>
          </span>
          <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderZoomButton()}</span>
        </div>
        <div class="stage">
          ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
          ${this.renderUnder(t,r)}
        </div>
        ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):f}
      </div>
      ${this.renderPlaceBar(t)}
      <div class="under-grid">
        ${this.renderSharedValues(t)}
        ${this.renderValuesRow()}
      </div>
      ${this.renderTapBar(t)}`}barLayer(t){if(this.inspect.kind!=="layer"||this.multi.size>=2||this.activeFamily==="inline")return;let i=this.inspect.id;return t.elements.find(a=>a.payload.id===i)}renderPlaceBar(t){let i=this.barLayer(t);return i?p`<div class="place-wrap" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
      @change=${()=>this.draft?.endGesture()}>${zr(this.host(),i,this.canvasFamily,{inline:!0})}</div>`:f}renderTapBar(t){let i=this.barLayer(t),a=i===void 0?"Select a layer to make it tappable.":i.kind==="tap"?"This is a tap area. Select the layer it belongs to.":void 0,r={inline:!0,...a!==void 0?{placeholder:a}:{}};return p`<div class="place-wrap" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
      @change=${()=>this.draft?.endGesture()}>${Pr(this.host(),i,r)}</div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.draft?.config,l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?Je(s,o)?.id:void 0,d=s&&l!==void 0&&(this.inspect.kind==="group"||Je(s,o)?.locked)?Ze(s,l).map(g=>g.payload.id):[],u=[...new Set([...d,...this.multi])],c=a.slots[t],h=this.focusTapId(),m={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:c,highlightId:h??o,...u.length>0&&!this.showTaps?{highlightIds:u}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:this.listHoverIds.length>0?{hoverIds:this.listHoverIds}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return p`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${g=>this.onPreviewPointerDown(t,g)}
      @pointermove=${g=>this.onPickMove(g)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${Hi(r,m)}
    </div>`}renderUnder(t,i){let a=ye(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(c=>c.payload.id===r.id):void 0,s;if(this.showTaps)s=p`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Xe(t.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let c=t.groups?.find(m=>m.id===r.id),h=c?Ze(t,c.id).length:0;s=c?p`editing group <b>${c.name}</b>. Drag to move all ${h} layers.${c.locked?"":" Click one layer to move it alone."}`:""}else if(o){let c=Je(t,o.payload.id);s=c?.locked?p`editing <b>${Ie(o,a)}</b> in <b>${c.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:p`editing <b>${Ie(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else s="click a layer to edit it";if(i==="inline")return p`<div class="under"><b>Inline</b><span class="dot">·</span><span class="tail">${s}</span></div>`;let l=this.currentCase().slots[i],d=Mi(l,i),u=Math.round(d.scale*100);return p`<div class="under">
      <b>${J(i)}</b>
      <span class="size">${l.width} × ${l.height} pt${u!==100?` \xB7 ${u}%`:""}</span>
      <span class="dot">·</span>
      <span class="tail">${s}</span>
    </div>`}renderInlinePreview(t,i){let a;if(!t)a=p`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?ln((t.countdownEnd-r)/1e3):t.text,s=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=p`<div class="inline-line">${s??f}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:p`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderComplicationBar(){let t=this.host();return p`<div class="card comp-bar" style=${`--c:${ee.complication}`} @change=${()=>this.draft?.endGesture()}>
      <div class="settings inline" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${od(t)}</div>
      <span class="spacer"></span>
      <span class="acts">
        <button class="ghost" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?p`
          <button class="ghost" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?p`<button class="ghost danger" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="ghost" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:p`<button class="ghost danger" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:f}
      </span>
    </div>`}renderSharedValues(t){let i=t.values,a=new nt(this.buildContext(),this.draft?.config),r=ye(this.host());return p`<div class="card tint-values values-list" style=${`--c:${ee.complication}`}>
      <h2 class="panel-title"><span class="swatch">${N("content")}</span>Shared values
        <span class="mini" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">defined once, read by several layers</span>
        <span class="spacer"></span>
        ${this.canEdit?p`<button class="small" @click=${()=>{let o=dd();this.mutate(s=>{s.values.push(o)}),this.inspect={kind:"data",id:o.id}}}>Add</button>`:f}
      </h2>
      ${i.length===0?p`<p class="empty">No shared values yet.</p>`:p`<div class="data">
      ${i.map(o=>{let s=a.resolve({kind:{kind:"named",id:o.id}}),l=this.inspect.kind==="data"&&this.inspect.id===o.id;return p`<div class="datum vrow ${l?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:o.id}}}>
          <span class="nm">${o.name||"(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${s===void 0?"none":""}" title=${ge(o.value,r)}>${s??"unresolved"}</span>
          ${this.canEdit?p`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${d=>{d.stopPropagation(),this.mutate(u=>{u.values=u.values.filter(c=>c.id!==o.id)}),l&&(this.inspect={kind:"general"})}}>${N("delete")}</button>`:f}
        </div>`})}
      </div>`}
    </div>`}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapeTabs(t,i){let a=t.supportedFamilies;return Vt.map(r=>{if(!a.includes(r))return p`<button class="tab off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${J(r)} shape`} @click=${()=>this.addShape(r)}>
          ${N("plus")}${J(r)}
        </button>`;let o=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let u=i[r];s=u?Hi(u,{icons:this.icons,imageSizes:this.imageSizes,slot:dn.slots[r]}):f}let l=r!=="inline"&&ta(t,r)===0&&t.elements.length>0,d=this.canEdit&&Li(t,r);return p`<span class="tab-wrap">
        <button class="tab ${r}" aria-pressed=${o?"true":"false"} title=${`Edit the ${J(r)} shape`}
          @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
          <span class="art">${s}</span>
          <span class="lbl">${J(r)}</span>${l?p`<small>nothing shown</small>`:f}${o?p`<small>editing</small>`:f}
        </button>
        ${this.canEdit?p`<button class="icon danger tab-x" ?disabled=${!d}
          title=${d?`Remove the ${J(r)} shape`:"The only shape. Add another before removing it."}
          aria-label=${`Remove the ${J(r)} shape`}
          @click=${u=>{u.stopPropagation(),this.removeShape(r)}}>${N("delete")}</button>`:f}
      </span>`})}renderValuesRow(){let t=this.draft?.config;if(!t)return f;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return p`<div class="card tint-states" style=${`--c:${ee.states}`}>
      <h2 class="panel-title"><span class="swatch">${N("states")}</span>Values on the watch
        <span class="mini">live · click one to try another</span><span class="spacer"></span>
        ${a?p`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0?p`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:p`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],s=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,l=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${l}`:"not in Home Assistant",u=this.testValues.get(r),h=t.elements.find(g=>ki(t,g.payload.id).some(v=>v.ref.entityId===r))?.kind??"text",m=this.editingValue===r;return p`<button class="vchip vrow ${u!==void 0?"testing":""}" style=${`--k:${me[h]}`}
            title=${u!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${g=>{g.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="kbar"></span><b>${s}</b><span class="spacer"></span>
            ${m?p`<input type="text" .value=${u??o?.state??""} aria-label=${`Test value for ${s}`}
                  @keydown=${g=>{g.key==="Enter"&&g.target.blur(),g.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${g=>this.commitTestValue(r,g.target.value)} />`:p`<span class="val">${u!==void 0?`${u}${l}`:d}</span>`}
          </button>`})}
      </div>`}
    </div>`}commitTestValue(t,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[t]?.state;a===""||a===o?r.delete(t):r.set(t,a),this.testValues=r}currentCase(){return Yn.find(t=>t.label===this.previewCase)??dn}previewSlot(t){return this.currentCase().slots[t]}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":J(this.activeFamily),s=a.kind==="family"&&i===void 0?p`<span class="here" style=${`--k:${ee.place}`}>${o} shape</span>`:p`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=f,d=f;if(i!==void 0)l=p`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let u=t.elements.find(c=>c.payload.id===a.id);if(u){l=p`<span class="here" style=${`--k:${me[u.kind]}`}><span class="kchip">${un[u.kind]}</span>${Ie(u,ye(this.host()))}</span>`;let c=Je(t,u.payload.id);c&&(d=p`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:c.id}}} title="Edit the group">${c.name}</button>`)}}else if(a.kind==="group"){let u=t.groups?.find(c=>c.id===a.id);u&&(l=p`<span class="here" style=${`--k:${ee.group}`}><span class="kchip">Group</span>${u.name}</span>`)}else if(a.kind==="data"){let u=t.values.find(c=>c.id===a.id);u&&(l=p`<span class="here" style=${`--k:${ee.complication}`}><span class="kchip">Value</span>${u.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(l=p`<span class="mini">nothing selected</span>`);return p`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${s}${d}
      ${l===f?f:p`<span class="sep">›</span>${l}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let t=this.draft?.config;if(!t)return f;let i=this.pickedElements(t);if(i.length>=2)return p`
        <div class="insp-head">${this.crumbs(t,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(t,i)}</div>`;let a=this.host(),r=this.inspect,o=f,s=!0;if(r.kind==="layer"){let d=t.elements.find(u=>u.payload.id===r.id);if(!d)return this.inspect={kind:"general"},f;o=pd(a,d,this.canvasFamily,{placement:!1,tap:!1})}else if(r.kind==="group"){let d=t.groups?.find(u=>u.id===r.id);if(!d)return this.inspect={kind:"general"},f;s=!1,o=md(a,d)}else if(r.kind==="data"){let d=t.values.find(u=>u.id===r.id);if(!d)return this.inspect={kind:"general"},f;s=!1,o=p`<div class="sec" data-open="true" style=${`--c:${ee.complication}`}>
        <div class="sec-h"><span class="swatch">${N("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${ld(a,d)}</div>
      </div>`}else r.kind==="family"?o=fd(a,this.activeFamily):(s=!1,o=p`<div class="empty-insp">${N("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let l=this.openSections.size>1;return p`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${s?p`<button class="expand" @click=${()=>{this.openSections=l?new Set([cm(r)]):new Set(Hr)}}>${l?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(t,i,a){return p`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${t}${i==="mixed"?p` <span class="mixed">(mixed)</span>`:f}</span></label>`}multiEditor(t,i){let a=this.canvasFamily,r=ye(this.host()),o=new nt(this.buildContext(),this.draft?.config),s=ud(t,a,i),l=i.length,d=[...i].reverse(),u=h=>this.mutate(m=>{for(let g of i)xe(m,a,g.payload.id,{isHidden:h})}),c=h=>this.mutate(m=>{for(let g of i){let v=m.elements.find($=>$.payload.id===g.payload.id);v&&v.kind!=="image"&&v.kind!=="tap"&&v.kind!=="timeline"&&(v.payload.colorSlot.baseColorHex=h)}},"multi-colour");return p`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${N("layers")}</span>
          <span class="tt"><h4>${l} layers picked</h4><span class="sum">Edits here land on all ${l}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(h=>p`<div class="row" style=${`--k:${me[h.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${h.kind==="icon"?p`<span class="glyph">${this.icons.render(o.resolve(h.payload.symbol)??"questionmark",16,h.payload.colorSlot.baseColorHex)??f}</span>`:f}
                <b>${Ie(h,r)}</b><span class="kind">${un[h.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${ti}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" title=${`Group (${St}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${ee.place}`}>
        <div class="sec-h"><span class="swatch">${N("place")}</span>
          <span class="tt"><h4>All ${l} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck("Hidden",s.hiddenHere,u)}
          ${s.colourable?p`${se("Colour",s.colour,h=>{h!==void 0&&c(h)})}
              ${s.colour===void 0?p`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:f}`:p`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">These layers are on the ${J(a)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let t=this.draft;if(!t)return f;let i=this.records.find(r=>r.id===this.selectedId),a=Ys({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return p`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${t.dirty?p` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?p`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:f}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?p`<pre>${JSON.stringify(t.encoded(),null,2)}</pre>`:f}
      </div>
    </details>`}};H([Jt({attribute:!1})],A.prototype,"hass",2),H([Jt({type:Boolean})],A.prototype,"narrow",2),H([Jt({attribute:!1})],A.prototype,"panel",2),H([L()],A.prototype,"colLeft",2),H([L()],A.prototype,"colRight",2),H([L()],A.prototype,"panelWidth",2),H([L()],A.prototype,"owners",2),H([L()],A.prototype,"ownerId",2),H([L()],A.prototype,"records",2),H([L()],A.prototype,"selectedId",2),H([L()],A.prototype,"draft",2),H([L()],A.prototype,"readOnlyReason",2),H([L()],A.prototype,"parseError",2),H([L()],A.prototype,"maxSchemaVersion",2),H([L()],A.prototype,"presets",2),H([L()],A.prototype,"occupied",2),H([L()],A.prototype,"serverToken",2),H([L()],A.prototype,"appliedToken",2),H([L()],A.prototype,"sendStatusKnown",2),H([L()],A.prototype,"polling",2),H([L()],A.prototype,"lastPollSeconds",2),H([L()],A.prototype,"sendPending",2),H([L()],A.prototype,"pages",2),H([L()],A.prototype,"templateResults",2),H([L()],A.prototype,"historySeries",2),H([L()],A.prototype,"templateError",2),H([L()],A.prototype,"templateFetchedAt",2),H([L()],A.prototype,"forced",2),H([L()],A.prototype,"showRaw",2),H([L()],A.prototype,"inspect",2),H([L()],A.prototype,"openSections",2),H([L()],A.prototype,"pickerOpen",2),H([L()],A.prototype,"pickerFilter",2),H([L()],A.prototype,"testValues",2),H([L()],A.prototype,"editingValue",2),H([L()],A.prototype,"thumbStep",2),H([L()],A.prototype,"layerDetail",2),H([L()],A.prototype,"addOpen",2),H([L()],A.prototype,"addDetail",2),H([L()],A.prototype,"multi",2),H([L()],A.prototype,"collapsed",2),H([L()],A.prototype,"activeFamily",2),H([L()],A.prototype,"picking",2),H([L()],A.prototype,"pickHoverId",2),H([L()],A.prototype,"listHoverIds",2),H([L()],A.prototype,"zoomed",2),H([L()],A.prototype,"helpOpen",2),H([L()],A.prototype,"showTaps",2),H([L()],A.prototype,"timestampActiveId",2),H([L()],A.prototype,"savedName",2),H([L()],A.prototype,"presetKind",2),H([L()],A.prototype,"presetEntity",2),H([L()],A.prototype,"newOpen",2),H([L()],A.prototype,"newName",2),H([L()],A.prototype,"newFamily",2),H([L()],A.prototype,"previewCase",2),H([L()],A.prototype,"loadError",2),H([L()],A.prototype,"saveError",2),H([L()],A.prototype,"saving",2),H([L()],A.prototype,"conflict",2),H([L()],A.prototype,"remoteRevision",2),H([L()],A.prototype,"confirmDelete",2),H([L()],A.prototype,"moveTarget",2),H([L()],A.prototype,"moving",2),H([L()],A.prototype,"moveError",2),H([L()],A.prototype,"version",2);var qr=A;function Et(e){return String(e?.message??e)}function bm(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function Od(e){let n=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function vm(e,n,t,i){let a=[{label:"Shows",value:Nr(e,t)}],r=Qi(t);return r&&a.push({label:"Looks",value:r}),i.frame.rotationDegrees!==0&&a.push({label:"Turned",value:`${Math.round(i.frame.rotationDegrees)}\xB0`}),a}function wm(e){return e<120?`${e} min`:e%1440===0?`${e/1440} d`:e%60===0?`${e/60} h`:`${e} min`}function xm(e,n,t,i){let a=r=>p`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return p`${a(n.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${$e(e.payload.colorSlot.baseColorHex)}`;case"gauge":return p`${a(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=Lt(e.payload)??_t(e.payload),o=r!==void 0?t.get(r)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Wn(o).length} values`}case"timeline":{let r=bt(e.payload),o=r===void 0?[]:qn(t.get(r)??""),s=Math.max(0,o.length-1);return`${wm(Be(e.payload))} \xB7 ${s} ${s===1?"change":"changes"}`}case"shape":return`${$e(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return Xe(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",qr);export{qr as WristAssistantPanel,Pd as columnFit,vm as layerFacts};
