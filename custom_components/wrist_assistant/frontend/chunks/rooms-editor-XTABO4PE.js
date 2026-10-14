import{a as Qt,b as Ft,c as Gt,d as Kt,e as Vt,f as jt,g as qt}from"./chunk-FMEYBIGP.js";import{j as Zt,r as fe,v as Yt}from"./chunk-Q6GFNKHN.js";import"./chunk-XDMMZFSQ.js";import"./chunk-UDRG2OIJ.js";import{a as pe,b as me,c as $t,d as Dt,e as _t,f as Ot,g as Ht,h as Pt,i as Mt,j as Wt,k as Ut}from"./chunk-WGOBJYQC.js";import{b as Et,p as Tt,w as Jt}from"./chunk-L5R4TKP4.js";import{a as It,b as Ct,d as Lt}from"./chunk-QUOL6HJ4.js";import{Lb as At,Q as kt,Rb as ue,V as St,Xa as Rt,Zb as q,h as rt,qd as Xt,rd as en,sd as tn}from"./chunk-XQ27ZRCL.js";import{Ag as et,Bg as tt,Dg as nt,Eg as ot,_h as pt,b as V,c as d,cg as Xe,d as de,eh as x,f as m,fh as it,hj as bt,i as Ye,ih as at,ii as mt,j as S,ji as ce,jj as yt,k as w,kh as st,kj as vt,li as ht,lj as xt,mh as dt,mi as le,ni as j,oh as ct,oi as ft,ph as lt,pi as gt,xi as wt,yg as P,zh as ut}from"./chunk-RYLMRUWW.js";import"./chunk-WIDK423N.js";import{i as Nt,k as he,l as M,n as I,o as Z,p as zt,q as Bt}from"./chunk-Y5WD6GQY.js";import{a as D}from"./chunk-KXSD4G27.js";import{a as f}from"./chunk-LO2NM3CE.js";var nn={version:1,note:"The panel's own table: edit it here. RoomRulesTableTests in the app repository checks the parts the watch decides against the watch's code.",keys:{sensor:"roomQuickJumpSourceEntityId",fallback:"roomQuickJumpFallbackPageId",mappings:"roomQuickJumpMappings",autoSwitch:"roomAutoSwitchEnabled",legacyQuickJump:"roomQuickJumpEnabled",zones:"pointControlRoomMappingsJSON",topSectionDoubleTap:"topSectionDoubleTapAction",handGesture:"handGestureAction",tapToToggle:"pointControlTapToToggle",liveTile:"pointControlLiveTile"},normalize:{rule:"Lower case; _ and - as spaces; anything but a-z, 0-9 and space as a space; runs of spaces as one, none at either end.",cases:[{input:"Living Room",key:"living room"},{input:"living_room",key:"living room"},{input:"Living-Room",key:"living room"},{input:"  Kitchen  ",key:"kitchen"},{input:"Kids' Room",key:"kids room"},{input:"ROOM__3",key:"room 3"},{input:"Room 2",key:"room 2"},{input:"Office/Study",key:"office study"},{input:"1st floor",key:"1st floor"},{input:"a	b",key:"a b"},{input:"Caf\xE9",key:"caf"},{input:"B\xFCro",key:"b ro"},{input:"\u0130stanbul",key:"i stanbul"},{input:"\u65E5\u672C",key:""},{input:"\uFF2C\uFF49\uFF56\uFF49\uFF4E\uFF47",key:""},{input:"",key:""},{input:"___",key:""},{input:"--",key:""},{input:"kitchen.",key:"kitchen"},{input:"Master Bedroom (Upstairs)",key:"master bedroom upstairs"}]},roomValue:{notRoom:["unknown","unavailable","none","null","on","off","true","false","home","not_home","away"],rule:"Trimmed, not empty, not one of notRoom (compared lower case), not a number as Swift's Double reads one (nan, inf, infinity and hex floats included), and with a letter in it.",source:"The watch reads a person's room from its state only. Any other sensor gives its state, or, when that is not a room, its location_name attribute.",attribute:"location_name",cases:[{input:"Kitchen",room:!0},{input:"living_room",room:!0},{input:"unknown",room:!1},{input:"Unavailable",room:!1},{input:" on ",room:!1},{input:"OFF",room:!1},{input:"home",room:!1},{input:"not_home",room:!1},{input:"Away",room:!1},{input:"none",room:!1},{input:"NULL",room:!1},{input:"true",room:!1},{input:"42",room:!1},{input:"3.5",room:!1},{input:"-1",room:!1},{input:"1e3",room:!1},{input:"1E3",room:!1},{input:"nan",room:!1},{input:"NaN",room:!1},{input:"inf",room:!1},{input:"-Infinity",room:!1},{input:"0x1F",room:!1},{input:"0x1p3",room:!1},{input:"+5",room:!1},{input:".5",room:!1},{input:"",room:!1},{input:"   ",room:!1},{input:"!!",room:!1},{input:"2nd floor",room:!0},{input:"B\xFCro",room:!0},{input:"\u65E5\u672C",room:!0},{input:"e",room:!0},{input:"Home Office",room:!0}]},switching:{keys:["roomQuickJumpSourceEntityId","roomQuickJumpEnabled","roomAutoSwitchEnabled","topSectionDoubleTapAction","handGestureAction"],triggers:[{value:"Automatic",label:"Automatic",help:"Switches when your room sensor detects a new room. Uses more battery."},{value:"Double-Tap Top",label:"Double-tap the page title",help:"Double-tap the page title or top area to switch."},{value:"Double Pinch",label:"Double Pinch",help:"Double pinch gesture to switch rooms"}],absent:{handGestureAction:"Refresh"},rule:"Picking a room sensor writes only roomQuickJumpSourceEntityId. Switch Pages by Room on is Double-Tap Top. When nothing is on, the trigger shown is Double-Tap Top.",cases:[{op:{switch:!0},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{switch:!0},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Next Page"}},{op:{switch:!0},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{switch:!1},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1}},{op:{switch:!1},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{switch:!1},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Refresh"}},{op:{switch:!1},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{switch:!1},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{switch:!1},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}},{op:{trigger:"Automatic"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0}},{op:{trigger:"Automatic"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled"}},{op:{trigger:"Automatic"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,handGestureAction:"Refresh"}},{op:{trigger:"Automatic"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{trigger:"Automatic"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled"}},{op:{trigger:"Automatic"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}},{op:{trigger:"Double-Tap Top"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{trigger:"Double-Tap Top"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Next Page"}},{op:{trigger:"Double-Tap Top"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{trigger:"Double Pinch"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{clearSensor:!0},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1}},{op:{clearSensor:!0},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{clearSensor:!0},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Refresh"}},{op:{clearSensor:!0},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{clearSensor:!0},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{clearSensor:!0},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}}],readCases:[{document:{},on:!1,trigger:"Double-Tap Top"},{document:{topSectionDoubleTapAction:"Room Jump"},on:!0,trigger:"Double-Tap Top"},{document:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},on:!0,trigger:"Double Pinch"},{document:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},on:!1,trigger:"Double-Tap Top"},{document:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},on:!0,trigger:"Double-Tap Top"},{document:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},on:!0,trigger:"Automatic"}]},fallback:{stay:"__stay__",firstAvailable:null,watchFallbackNames:["favorites","nearby","home"],rule:"Stay on current page stores the sentinel; First available page stores no key, and the watch then takes a page whose normalized name is one of watchFallbackNames, else the first page. A page id is a page's id as stored. The pages offered are the listed pages that are neither system nor hidden pages."},mappings:{rule:"roomQuickJumpMappings maps a normalized room name to a page id. A room set to no page has no key, and an empty mapping is no key at all. The watch normalizes every key before it compares, and also takes a key that contains the room or is contained by it."},pointControl:{domains:[{domain:"light",label:"Light"},{domain:"switch",label:"Switch"},{domain:"fan",label:"Fan"},{domain:"cover",label:"Cover"},{domain:"scene",label:"Scene"},{domain:"script",label:"Script"},{domain:"climate",label:"Climate"},{domain:"media_player",label:"Player"},{domain:"lock",label:"Lock"},{domain:"input_boolean",label:"Toggle"}],heading:{min:0,max:359,rule:"Degrees clockwise from north. The watch shows its compass heading, snapped to 5, for the user to type in; the panel takes a typed or dialled whole degree."},newTarget:"A target added in the panel starts at heading 0 with the entity's friendly name from its id as the label.",switches:[{key:"pointControlTapToToggle",label:"Tap to Toggle",onDetail:"Tap immediately toggles the aimed entity",offDetail:"Tap opens the point control overlay",absent:!1},{key:"pointControlLiveTile",label:"Live Point Control Tile",onDetail:"Show live needle and aimed entity on grid tile",offDetail:"Show live needle and aimed entity on grid tile",absent:!1}]},zones:{cleanCases:[{input:{kitchen:[]},output:null},{input:{den:[{entityId:"light.a",centerHeading:0}],kitchen:[]},output:{den:[{entityId:"light.a",centerHeading:0}],kitchen:[]}},{input:{den:[{entityId:" ",centerHeading:0}]},output:null},{input:{den:[{entityId:" ",centerHeading:0},{entityId:"light.a",centerHeading:10}],hall:[{entityId:"",centerHeading:0}]},output:{den:[{entityId:" ",centerHeading:0},{entityId:"light.a",centerHeading:10}]}},{input:{"living room":[{entityId:"light.tv",centerHeading:90,label:"TV"},{entityId:"switch.fan",centerHeading:180}]},output:{"living room":[{entityId:"light.tv",centerHeading:90,label:"TV"},{entityId:"switch.fan",centerHeading:180}]}}],encodeCases:[{rooms:{"living room":[{entityId:"light.tv_backlight",centerHeading:90,label:"TV / Lamp"},{entityId:"switch.fan",centerHeading:272.5}]},parsed:{"living room":[{centerHeading:90,entityId:"light.tv_backlight",label:"TV / Lamp"},{centerHeading:272.5,entityId:"switch.fan"}]},slashEscaped:!0},{rooms:{kitchen:[{entityId:"light.kitchen",centerHeading:0}]},parsed:{kitchen:[{centerHeading:0,entityId:"light.kitchen"}]},slashEscaped:!1},{rooms:{den:[]},parsed:{den:[]},slashEscaped:!1},{rooms:{b\u00FCro:[{entityId:"light.b\xFCro",centerHeading:359,label:'Schreibtisch "neu"'}]},parsed:{b\u00FCro:[{centerHeading:359,entityId:"light.b\xFCro",label:'Schreibtisch "neu"'}]},slashEscaped:!1}],decodeCases:[{json:'{"kitchen":[{"entityId":"light.a","centerHeading":0}],"living room":[{"entityId":"light.b","centerHeading":359.5,"label":"Lamp"}]}',rooms:{kitchen:[{entityId:"light.a",centerHeading:0}],"living room":[{entityId:"light.b",centerHeading:359.5,label:"Lamp"}]}},{json:'{"den":[{"entityId":"light.a","centerHeading":45,"label":"A","extra":1}]}',rooms:{den:[{entityId:"light.a",centerHeading:45,label:"A"}]}},{json:'{"den":[{"entityId":"light.a","centerHeading":45,"label":null}]}',rooms:{den:[{entityId:"light.a",centerHeading:45}]}},{json:'{"den":[]}',rooms:{den:[]}},{json:'{"den":[{"entityId":"light.a"}]}',rooms:{}},{json:'{"den":[{"entityId":"light.a","centerHeading":"45"}]}',rooms:{}},{json:'{"den":[{"entityId":"light.a","centerHeading":45}],"hall":{"entityId":"light.b"}}',rooms:{}},{json:"[]",rooms:{}},{json:"not json",rooms:{}},{json:"",rooms:{}}]}};var R=nn,u=R.keys,L=R.fallback.stay,E="Room Jump",_=R.switching.absent.handGestureAction??"Refresh",T="Room Jump",J="Disabled",ge=R.pointControl.domains.map(e=>e.domain);function y(e){return e.toLowerCase().replace(/[_-]/g," ").replace(/[^a-z0-9 ]/g," ").split(" ").filter(o=>o!=="").join(" ")}var io=/^[+-]?(?:nan|inf|infinity|(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|0x(?:[0-9a-f]+\.?[0-9a-f]*|\.[0-9a-f]+)(?:p[+-]?\d+)?)$/,ao=new Set(R.roomValue.notRoom);function C(e){let o=e.trim();if(o==="")return!1;let t=o.toLowerCase();return ao.has(t)||io.test(t)?!1:/[\p{L}\p{M}]/u.test(t)}function Y(e,o){if(o===void 0)return;let t=typeof o.state=="string"?o.state.trim():"";if(e.startsWith("person."))return C(t)?t:void 0;if(C(t))return t;let n=o.attributes?.[R.roomValue.attribute];if(typeof n=="string"&&C(n))return n.trim()}function on(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function so(e){if(!on(e))return;let{entityId:o,centerHeading:t,label:n}=e;if(!(typeof o!="string"||typeof t!="number"||!Number.isFinite(t))&&!(n!=null&&typeof n!="string"))return typeof n=="string"?{entityId:o,centerHeading:t,label:n}:{entityId:o,centerHeading:t}}function O(e){if(e==null||e==="")return{ok:!0,rooms:[]};if(typeof e!="string")return{ok:!1};let o;try{o=JSON.parse(e)}catch{return{ok:!1}}if(!on(o))return{ok:!1};let t=[];for(let[n,r]of Object.entries(o)){if(!Array.isArray(r))return{ok:!1};let i=[];for(let a of r){let s=so(a);if(s===void 0)return{ok:!1};i.push(s)}t.push([n,i])}return{ok:!0,rooms:t}}function X(e){let o=e.filter(([,t])=>t.length===0||t.some(n=>n.entityId.trim()!==""));if(!(o.length===0||o.every(([,t])=>t.length===0)))return o}function ee(e){let o={};for(let[t,n]of e)o[t]=n.map(r=>r.label===void 0?{entityId:r.entityId,centerHeading:r.centerHeading}:{entityId:r.entityId,centerHeading:r.centerHeading,label:r.label});return JSON.stringify(o).replace(/\//g,"\\/")}function we(e,o){if(e.length!==o.length)return!1;let t=new Map(o);return t.size!==o.length?!1:e.every(([n,r])=>{let i=t.get(n);return i!==void 0&&i.length===r.length&&r.every((a,s)=>a.entityId===i[s].entityId&&a.centerHeading===i[s].centerHeading&&a.label===i[s].label)})}function N(e){return Number.isFinite(e)?(Math.round(e)%360+360)%360:0}function be(e){return["N","NE","E","SE","S","SW","W","NW"][Math.floor(((e+22.5)%360+360)%360/45)%8]}function ye(e){let o=e.indexOf(".");return o<0?e:e.slice(o+1).split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function rn(e){return e.split(" ").filter(o=>o!=="").map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" ")}function A(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function B(e,o){if(e===o)return!0;if(Array.isArray(e)||Array.isArray(o))return!Array.isArray(e)||!Array.isArray(o)||e.length!==o.length?!1:e.every((t,n)=>B(t,o[n]));if(A(e)&&A(o)){let t=Object.keys(e);return t.length!==Object.keys(o).length?!1:t.every(n=>Object.hasOwn(o,n)&&B(e[n],o[n]))}return!1}var an=new Map(R.pointControl.switches.map(e=>[e.key,e.absent]));function dn(e,o,t){return Object.hasOwn(e,o)?t!==void 0&&B(e[o],t):t===void 0||an.has(o)&&an.get(o)===t}function xe(e,o){let t=structuredClone(e);for(let[n,r]of o)r===void 0?delete t[n]:t[n]=structuredClone(r);return t}function ke(e,o,t){let n=new Map(o);for(let[r,i]of t)dn(e,r,i)?n.delete(r):n.set(r,i);return n}function W(e,o){return e===void 0?[]:[...o.entries()].filter(([t,n])=>!dn(e,t,n)).map(([t])=>t)}function sn(e,o,t){let n=new Map(t);for(let r of new Set([...e.keys(),...o.keys()])){let i=e.get(r),a=o.get(r);B(i,a)||(a===void 0?n.delete(r):n.set(r,a))}return n}function ve(e){return new Map(A(e)?Object.entries(e):[])}function Se(e,o,t){let n=new Map(t);for(let[r,i]of t)if(!B(e[r],o[r])){if(r===u.mappings){let a=sn(ve(e[r]),ve(i),ve(o[r]));n.set(r,a.size===0?void 0:Object.fromEntries(a))}else if(r===u.zones){let a=O(e[r]),s=O(i),c=O(o[r]);if(!a.ok||!s.ok||!c.ok)continue;let l=X([...sn(new Map(a.rooms),new Map(s.rooms),new Map(c.rooms))]);l===void 0?n.set(r,void 0):n.set(r,we(l,c.rooms)?o[r]:ee(l))}else if(r===u.topSectionDoubleTap||r===u.handGesture){let a=r===u.topSectionDoubleTap?T:E;e[r]===a&&i!==a&&o[r]!==a&&n.delete(r)}}return n}function z(e,o){let t=e[o];return typeof t=="string"?t:void 0}function te(e,o){let t=e[o];return typeof t=="boolean"?t:void 0}function U(e){let o={},t=z(e,u.sensor);t!==void 0&&(o.roomQuickJumpSourceEntityId=t);let n=te(e,u.legacyQuickJump);n!==void 0&&(o.roomQuickJumpEnabled=n);let r=te(e,u.autoSwitch);r!==void 0&&(o.roomAutoSwitchEnabled=r);let i=z(e,u.topSectionDoubleTap);i!==void 0&&(o.topSectionDoubleTapAction=i);let a=z(e,u.handGesture);return a!==void 0&&(o.handGestureAction=a),o}function co(e){let o=U(e),t=o.topSectionDoubleTapAction===T||(o.roomQuickJumpEnabled??!1),n=(o.handGestureAction??_)===E;return t||(o.roomAutoSwitchEnabled??!1)||n}function lo(e){let o=U(e);return o.roomAutoSwitchEnabled??!1?"Automatic":(o.handGestureAction??_)===E?"Double Pinch":"Double-Tap Top"}function ne(e){let o={},t=e[u.mappings];if(A(t))for(let[r,i]of Object.entries(t))typeof i=="string"&&(o[r]=i);let n=r=>te(e,r)??R.pointControl.switches.find(i=>i.key===r)?.absent??!1;return{sensor:(z(e,u.sensor)??"").trim(),switching:co(e),trigger:lo(e),fallback:(z(e,u.fallback)??"").trim(),mappings:o,zones:O(e[u.zones]),tapToToggle:n(u.tapToToggle),liveTile:n(u.liveTile)}}function Re(e,o){let t=new Map;for(let n of R.switching.keys)e[n]!==o[n]&&t.set(n,o[n]);return t}function uo(e){delete e.roomQuickJumpSourceEntityId,e.roomQuickJumpEnabled=!1,e.roomAutoSwitchEnabled=!1,e.handGestureAction===E&&(e.handGestureAction=_),e.topSectionDoubleTapAction===T&&(e.topSectionDoubleTapAction=J)}function cn(e,o){let t=o.trim();return t!==""?new Map([[u.sensor,t]]):po(e)}function po(e){let o=U(e),t={...o};return uo(t),Re(o,t)}function ln(e,o){let t=U(e),n={...t};return o?(n.topSectionDoubleTapAction=T,n.roomQuickJumpEnabled=!1,n.roomAutoSwitchEnabled=!1,n.handGestureAction===E&&(n.handGestureAction=_)):(n.roomQuickJumpEnabled=!1,n.roomAutoSwitchEnabled=!1,n.handGestureAction===E&&(n.handGestureAction=_),n.topSectionDoubleTapAction===T&&(n.topSectionDoubleTapAction=J)),Re(t,n)}function Ae(e,o){let t=U(e),n={...t};switch(o){case"Automatic":n.roomAutoSwitchEnabled=!0,n.roomQuickJumpEnabled=!1,n.handGestureAction===E&&(n.handGestureAction=_),n.topSectionDoubleTapAction===T&&(n.topSectionDoubleTapAction=J);break;case"Double-Tap Top":n.roomAutoSwitchEnabled=!1,n.roomQuickJumpEnabled=!1,n.topSectionDoubleTapAction=T,n.handGestureAction===E&&(n.handGestureAction=_);break;case"Double Pinch":n.roomAutoSwitchEnabled=!1,n.roomQuickJumpEnabled=!1,n.topSectionDoubleTapAction===T&&(n.topSectionDoubleTapAction=J),n.handGestureAction=E;break}return Re(t,n)}function un(e){let o=e.trim();return new Map([[u.fallback,o===""?void 0:o]])}function pn(e,o){return new Map([[e,o]])}function H(e,o){let t=e.mappings[o];if(t!==void 0)return t.trim();for(let[n,r]of Object.entries(e.mappings))if(y(n)===o)return r.trim();return""}function Ee(e,o,t){let n=e[u.mappings],r=A(n)?structuredClone(n):{};for(let a of Object.keys(r))y(a)===o&&delete r[a];let i=t.trim();return i!==""&&(r[o]=i),new Map([[u.mappings,Object.keys(r).length===0?void 0:r]])}function Te(e,o){return e.filter(([t])=>y(t)===o).flatMap(([,t])=>t)}function $e(e,o,t){let n=O(e[u.zones]);if(!n.ok)return;let r=[],i=!1;for(let[s,c]of n.rooms)y(s)!==o?r.push([s,c]):i||(r.push([o,t]),i=!0);i||r.push([o,t]);let a=X(r);return a===void 0?new Map([[u.zones,void 0]]):we(a,n.rooms)?new Map:new Map([[u.zones,ee(a)]])}function mn(e,o){let t=new Map,n=ne(e);if(H(n,o)!==""||Object.keys(n.mappings).some(i=>y(i)===o))for(let[i,a]of Ee(e,o,""))t.set(i,a);let r=O(e[u.zones]);if(r.ok&&r.rooms.some(([i])=>y(i)===o)){let i=X(r.rooms.filter(([a])=>y(a)!==o));t.set(u.zones,i===void 0?void 0:ee(i))}return t}function De(e,o,t){return o.lastSeen!==void 0||H(e,o.key)!==""||Object.keys(e.mappings).some(n=>y(n)===o.key)||e.zones.ok&&e.zones.rooms.some(([n])=>y(n)===o.key)?!0:t.some(n=>y(n)===o.key)}function hn(e){return M(e).filter(o=>!Bt(o)&&!zt(o)&&I(o)!=="").map(o=>({id:I(o),name:Z(o)}))}function Q(e,o){let t=o.trim().toLowerCase();return t===""?void 0:e.find(n=>n.id.toLowerCase()===t)}function fn(e){let o=new Map,t=new Map;for(let s of e.history??[]){if(!C(s.state))continue;let c=y(s.state.trim());if(c==="")continue;let l=t.get(c);(l===void 0||s.at>l.at)&&t.set(c,{at:s.at,state:s.state.trim()})}let n=(s,c,l,p)=>{let b=y(s);if(b===""||o.has(b))return;let g=t.get(b)?.at;o.set(b,{key:b,name:l??rn(b),area:c,...g===void 0?{}:{lastSeen:g},...p===void 0||p===""?{}:{floorId:p}})};for(let s of e.areas??[])for(let c of[s.name,...s.aliases??[]]){let l=typeof c=="string"?c.trim():"";l!==""&&n(l,!0,l,s.floorId)}for(let s of e.mappingKeys??[])n(s,!1);for(let s of e.zoneKeys??[])n(s,!1);for(let[s,c]of t)o.has(s)||n(s,!1,c.state);for(let s of e.added??[])n(s,!1,s.trim());let r=[...o.values()],i=r.filter(s=>s.lastSeen!==void 0).sort((s,c)=>c.lastSeen-s.lastSeen),a=r.filter(s=>s.lastSeen===void 0).sort((s,c)=>s.name.localeCompare(c.name,void 0,{sensitivity:"base"}));return[...i,...a]}function gn(e){if(!Array.isArray(e))return[];let o=[];for(let t of e){if(!A(t)||typeof t.name!="string")continue;let n=Array.isArray(t.aliases)?t.aliases.filter(i=>typeof i=="string"):[],r=typeof t.floor_id=="string"&&t.floor_id!==""?t.floor_id:void 0;o.push({name:t.name,aliases:n,...r===void 0?{}:{floorId:r}})}return o}function wn(e){return Object.values(e??{}).flatMap(o=>{if(typeof o.name!="string"||o.name.trim()==="")return[];let t=typeof o.floor_id=="string"&&o.floor_id!==""?o.floor_id:void 0;return[{name:o.name,...t===void 0?{}:{floorId:t}}]})}function _e(e){let o=Array.isArray(e)?e:A(e)?Object.values(e):[],t=[];for(let n of o){if(!A(n)||typeof n.floor_id!="string"||n.floor_id==="")continue;let r=typeof n.name=="string"&&n.name.trim()!==""?n.name.trim():n.floor_id;t.some(i=>i.id===n.floor_id)||t.push({id:n.floor_id,name:r})}return t}function bn(e,o){if(!A(e))return[];let t=e[o];if(!Array.isArray(t))return[];let n=[];for(let r of t){if(!A(r))continue;let i=typeof r.s=="string"?r.s:typeof r.state=="string"?r.state:void 0;if(i===void 0)continue;let a,s=typeof r.lc=="number"?r.lc:typeof r.lu=="number"?r.lu:void 0;if(s!==void 0)a=s*1e3;else{let c=typeof r.last_changed=="string"?r.last_changed:typeof r.last_updated=="string"?r.last_updated:void 0,l=c===void 0?NaN:Date.parse(c);Number.isNaN(l)||(a=l)}n.push({state:i,at:a??0})}return n}var yn=24,mo=64*1024;function Oe(e,o="behavior"){return{size:new TextEncoder().encode(JSON.stringify(e)).length,limit:o==="rooms"?mo:Nt}}var ho=3;async function vn(e,o,t){let n=o,r;for(let i=1;;i++){if(i>1&&W(n.document,t).length===0)return{ok:!0,revision:n.revision,document:n.document,merged:!0,alreadySaved:!0,...r?{fresh:r}:{}};let a=xe(n.document,t);try{let{revision:s}=await e.save(n.revision,a);return{ok:!0,revision:s,document:a,merged:i>1,alreadySaved:!1,...r?{fresh:r}:{}}}catch(s){let{code:c="unknown",message:l}=D(s);if(c!=="conflict"||i>=ho)return{ok:!1,code:c,message:l,...r?{fresh:r}:{}};try{r=await e.fetch()}catch(p){let b=D(p);return{ok:!1,code:b.code??"unknown",message:b.message}}if(!(r.revision>0)||!A(r.document))return{ok:!1,code:"no_record",message:"Home Assistant holds no settings for this watch.",fresh:r};t=Se(n.document,r.document,t),n={revision:r.revision,document:r.document}}}}function He(e){return e!==void 0&&e.revision>0&&A(e.document)?e.document:void 0}var xn="No watch settings from this watch yet.",kn=`Rooms are part of the watch's settings. ${j}`,Sn="Home Assistant holds settings for this watch that this panel cannot read. Update the integration.",Rn="The point control targets stored for this watch cannot be read, so they are shown as none and left as they are. Update the integration to change them here.",oe={stay:"Stay on current page",first:"First available page"};function An(e,o="behavior"){let t=o==="rooms";if(e.ok)return e.alreadySaved?{kind:"ok",text:`Nothing left to save. The ${t?"rooms":"settings"} already had these changes, as revision ${e.revision}.`}:e.merged?{kind:"ok",text:t?"Saved. Room changes made elsewhere meanwhile were kept.":"Saved. Settings changed elsewhere meanwhile were kept."}:void 0;let n=e.message.trim();switch(e.code){case"conflict":return{kind:"warn",text:`Not saved. ${t?"This home's rooms":"The watch's settings"} kept changing elsewhere while saving. Your edits are kept, so try Save again in a moment.`};case"no_record":return{kind:"warn",text:t?"Not saved. Home Assistant no longer holds rooms for this home.":"Not saved. Home Assistant no longer holds settings for this watch."};case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:`Not saved. Home Assistant could not store the ${t?"rooms":"settings"} just now. Your edits are kept, so try again in a moment.`};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function re(e){return e===""?"first":e===L?"stay":"page"}function En(e){return ht(e)?"rooms":"behavior"}var fo=1,ur=[u.legacyQuickJump,u.sensor,u.fallback,u.mappings,u.autoSwitch,u.zones],go=[u.topSectionDoubleTap,u.handGesture,u.tapToToggle,u.liveTile];function Pe(e){return new Map([...e].filter(([o])=>!go.includes(o)))}function Tn(e){return te(e,u.autoSwitch)??!1}function $n(e,o){return Pe(o?Ae(e,"Automatic"):new Map([[u.autoSwitch,!1]]))}function Dn(){return{schemaVersion:fo}}function _n(e){let o=D(e).code;return o==="invalid"||o==="unknown_command"}var On="The double-tap on the page title, the double pinch and the point control switches come from this watch's main home.",Hn="No rooms for this home yet.",Pn="Update the integration to edit this home's rooms here.",Mn="Home Assistant holds rooms for this home that this panel cannot read. Update the integration.",In="Switch automatically";var wo=100,ie=class{constructor(o,t){this.edits=new Map;this.undoStack=[];this.redoStack=[];this.saving=!1;this.document=o,this.revision=t}get effective(){return xe(this.document,this.edits)}get pending(){return this.edits}get dirty(){return W(this.document,this.edits).length>0}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}apply(o,t){if(this.saving)return!1;let n=ke(this.document,this.edits,o);return bo(n,this.edits)?!1:((t===void 0||t!==this.coalesceKey)&&(this.undoStack.push(new Map(this.edits)),this.undoStack.length>wo&&this.undoStack.shift()),this.coalesceKey=t,this.redoStack=[],this.edits=n,!0)}endCoalesce(){this.coalesceKey=void 0}undo(){if(this.saving)return!1;let o=this.undoStack.pop();return o===void 0?!1:(this.redoStack.push(this.edits),this.edits=o,this.coalesceKey=void 0,!0)}redo(){if(this.saving)return!1;let o=this.redoStack.pop();return o===void 0?!1:(this.undoStack.push(this.edits),this.edits=o,this.coalesceKey=void 0,!0)}discard(){return this.edits.size===0||this.saving?!1:(this.undoStack.push(this.edits),this.redoStack=[],this.edits=new Map,this.coalesceKey=void 0,!0)}rebase(o,t){let n=Se(this.document,o,this.edits);return this.document=o,this.revision=t,this.edits=ke(o,new Map,n),this.undoStack=[],this.redoStack=[],this.coalesceKey=void 0,this.edits.size>0}};function bo(e,o){if(e.size!==o.size)return!1;for(let[t,n]of e)if(!o.has(t)||JSON.stringify(n)!==JSON.stringify(o.get(t)))return!1;return!0}var $=new Map;function ae(e){return $.get(e)}function Cn(e){$.delete(e)}function Me(e,o,t){let n=$.get(e);if(n===void 0){let a=new ie(o,t);return $.set(e,a),{draft:a,mergedIntoEdits:!1}}if(n.saving||t===n.revision)return{draft:n,mergedIntoEdits:!1};let r=n.dirty,i=n.rebase(o,t);return{draft:n,mergedIntoEdits:r&&i}}function Ie(e,o){let t=$.get(e);if(t===void 0){let n=new ie(o,0);return $.set(e,n),n}return t.revision>0&&!t.saving&&t.rebase(o,0),t}function Ce(){for(let e of $.values())if(e.dirty)return!0;return!1}function Ln(){for(let[e,o]of $)o.saving||$.delete(e)}async function Jn(e,o){if(e.saving)return{ok:!1,code:"busy",message:"A save is running."};let t=new Map(e.pending);e.saving=!0;let n=vn(o,{revision:e.revision,document:e.document},t);e.saveDone=n;try{let r=await n;if(e.saving=!1,r.ok)e.rebase(r.document,r.revision);else if(r.fresh!==void 0&&r.fresh.revision>0){let i=r.fresh.document;i!==void 0&&typeof i=="object"&&!Array.isArray(i)&&e.rebase(i,r.fresh.revision)}return r}finally{e.saving=!1}}var Nn="var(--wa-hue-pink)",ze={width:208,height:248};function Je(e,o){let t=e.states[o]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:o}function Be(e,o){let t=o.indexOf(".");return{entityId:o,displayName:o===""?"":Je(e,o),domain:t<0?"":o.slice(0,t)}}function We(e,o){return o.some(t=>e.dirty.has(t))}function Ue(e){return e?d`<span class="sec-dot rm-dirty" title="Changed, not saved yet" aria-label="Changed"></span>`:m}function Qe(e,o,t=!1){let n=e.uiState.get(o);return typeof n=="boolean"?n:t}function Fe(e,o,t){e.uiState.set(o,!t),e.requestUpdate()}function yo(e,o){if(o==="")return{line:Qn,tone:"none"};let t=e.states[o];if(t===void 0)return{line:"Home Assistant has no entity with this id now.",tone:"warn"};let n=Y(o,t),r=typeof t.state=="string"?t.state:"";if(n===void 0)return{line:`Now "${r}", which the watch does not read as a room.`,tone:"warn"};let i=y(n);return{line:`Now in ${n}${i===""?", whose name has no letter or digit the watch can match":""}.`,tone:i===""?"warn":"ok"}}function Ge(e,o){if(o==="")return"";let t=Y(o,e.states[o]);return t===void 0?"":y(t)}var Ne="https://github.com/agittins/bermuda",Qn="No room sensor picked. The watch looks for one by its name, such as a Bermuda area sensor. Pick one to be sure.",vo="Bermuda uses Bluetooth to tell which room your watch is in. Rooms works best with its area sensor. Add Bermuda to Home Assistant, then pick its sensor here.";function xo(e,o){if(o==="")return!1;let t=e.states[o];if((typeof t?.attributes?.device_class=="string"?t.attributes.device_class:"").toLowerCase().startsWith("bermuda"))return!0;let r=typeof t?.attributes?.friendly_name=="string"?t.attributes.friendly_name:"";return`${o} ${r}`.toLowerCase().includes("bermuda")}function ko(e){let o=e.indexOf("Bermuda");return o<0?e:d`${e.slice(0,o)}<a href=${Ne} target="_blank" rel="noopener noreferrer">Bermuda</a>${e.slice(o+7)}`}function Fn(e,o,t){let n=[...t,...e.map(r=>[r.id,r.name])];return o!==""&&!t.some(([r])=>r===o)&&Q(e,o)===void 0&&n.push([o,"A page not on this watch"]),n}function Gn(e,o){return Q(e,o)?.id??o}function So(e,o){return o===""?"":Q(e.pages,o)?.name??"A page not on this watch"}function Kn(e,o){let t=o.trim().toLowerCase();if(t!=="")return M(e.pagesDocument).find(n=>I(n).toLowerCase()===t)}function Ke(e,o,t,n,r,i=""){return d`<select class="rm-select ${i}" aria-label=${e} ?disabled=${r}
    @click=${a=>a.stopPropagation()}
    @change=${a=>{r||n(a.target.value)}}>
    ${t.map(([a,s])=>d`<option value=${a} .selected=${a===o}>${s}</option>`)}
  </select>`}function Ro(e){return e.rooms.filter(o=>De(e.view,o,e.added??[]))}function Ao(e){return e.rooms.filter(o=>o.area&&!De(e.view,o,e.added??[]))}function Eo(e,o){let t=e.uiState.get("pick"),n=e.hass!==void 0&&e.view!==void 0?Ge(e.hass,e.view.sensor):"";return o.find(r=>r.key===t)??o.find(r=>r.key===n)??o[0]}function To(e,o=[]){let t=new Set(o.map(i=>i.id)),n=o.map(i=>({name:i.name,rooms:e.filter(a=>a.floorId===i.id)})).filter(i=>i.rooms.length>0),r=e.filter(i=>i.floorId===void 0||!t.has(i.floorId));return r.length>0&&n.push({name:n.length>0?"Other":"",rooms:r}),n}function F(e,o){e.uiState.set("pick",o),e.requestUpdate()}function $o(e,o){let t=e.view.zones.ok?Te(e.view.zones.rooms,o.key).length:0;return t===0?"":t===1?"1 thing to point at":`${t} things to point at`}function Vn(e,o){let t=y(o);t!==""&&(e.addRoom(o.trim()),F(e,t))}function jn(e){return e.home===!0?Tn(e.document):e.view.switching}function zn(e){let o=re(e.view.fallback);return o==="stay"?["the watch stays on the page it is on."]:o==="first"?["the watch shows ",{bold:oe.first},"."]:["the watch shows ",{bold:qn(e,e.view.fallback)},"."]}function qn(e,o){return Q(e.pages,o)?.name??"a page not on this watch"}var Bn="Switching is off, so the watch stays on its page.";function Do(e){let o=e.view.sensor,t=jn(e),n=e.hass.states[o];if(n===void 0)return[`Home Assistant has no entity ${o} now, so the watch cannot tell which room you are in.`];let r=Y(o,n),i=r===void 0?"":y(r);if(r===void 0||i===""){let c=typeof n.state=="string"?n.state.trim():"",l=c===""?"The sensor names no room now":`The sensor says "${c}" now, which names no room`;return t?[`${l}, so `,...zn(e)]:[`${l}. ${Bn}`]}let a=e.rooms.find(c=>c.key===i)?.name??r;if(!t)return["You are in ",{bold:a},` now. ${Bn}`];let s=H(e.view,i);return s!==""?["You are in ",{bold:a}," now. The watch shows ",{bold:qn(e,s)},"."]:["You are in ",{bold:a}," now, which has no page, so ",...zn(e)]}function _o(e){return d`${e.map(o=>typeof o=="string"?o:d`<b>${o.bold}</b>`)}`}function Wn(e){let{view:o}=e;return d`<div class="rm-stack rm-sensor-field" title=${o.sensor===""?"":"Clearing the sensor turns Switch pages by room off."}>${q({hass:e.hass},"Room sensor",Be(e.hass,o.sensor),t=>{e.busy||e.write(cn(e.document,t.entityId))},"rooms:sensor",{clearable:!0})}</div>`}function Un(e){let o=e.home===!0,t=jn(e),n=o?In:"Switch pages by room",r=s=>{e.busy||e.write(o?$n(e.document,s):ln(e.document,s))},i=R.switching.triggers,a=i.find(s=>s.value===e.view.trigger)?.help??"";return d`<div class="rm-status-switch">${ue(n,t,r)}</div>
    ${o?d`<p class="rm-help rm-status-wide rm-main-house">${On}</p>`:t?d`<div class="rm-when rm-status-wide">
        <span class="rm-when-l" id="rm-when-l">Switch</span>
        <div class="seg rm-seg" role="radiogroup" aria-labelledby="rm-when-l">
          ${i.map(s=>{let c=s.value===e.view.trigger;return d`<button type="button" role="radio" aria-checked=${c?"true":"false"} class=${c?"on":""} ?disabled=${e.busy}
              @click=${()=>{!e.busy&&!c&&e.write(Ae(e.document,s.value))}}>${s.label}</button>`})}
        </div>
        <span class="rm-when-help">${a}</span>
      </div>`:m}`}var Oo=[u.sensor,u.autoSwitch,u.legacyQuickJump,u.topSectionDoubleTap,u.handGesture];function Ho(e){let{view:o}=e,t=Ue(We(e,Oo));if(o.sensor==="")return d`<section class="rm-card rm-lit rm-start" aria-label="Start here">
      <span class="rm-eyebrow">Start here${t}</span>
      <h3 class="rm-start-title">Tell the watch which room you are in</h3>
      <p class="rm-pitch">${vo}</p>
      <div class="rm-start-row">
        ${Wn(e)}
        <a class="rm-btn rm-bermuda-link" href=${Ne} target="_blank" rel="noopener noreferrer">Get Bermuda</a>
      </div>
      <p class="rm-help">${ko(Qn)}</p>
      <div class="rm-start-switch">${Un(e)}</div>
    </section>`;let n=Qe(e,"sensorOpen"),r=xo(e.hass,o.sensor),i=yo(e.hass,o.sensor);return d`<section class="rm-card rm-lit rm-status" aria-label="Right now">
    <span class="rm-ichip" aria-hidden="true">${x("home")}</span>
    <div class="rm-status-text">
      <p class="rm-now">${_o(Do(e))}${t}</p>
      <div class="rm-sensor-line">
        ${r?d`<span class="rm-bermuda-ok">${x("check")}<span>${Je(e.hass,o.sensor)}, a Bermuda sensor</span></span>`:d`<span class="rm-sensor-name">${Je(e.hass,o.sensor)}.</span>
            <span class="rm-sensor-hint"><a href=${Ne} target="_blank" rel="noopener noreferrer">Bermuda</a> works best.</span>`}
        <button type="button" class="rm-btn rm-small" aria-expanded=${n?"true":"false"}
          @click=${()=>Fe(e,"sensorOpen",n)}>${n?"Done":"Change"}</button>
      </div>
    </div>
    ${n?d`<div class="rm-sensor-edit rm-status-wide">
      ${Wn(e)}
      <div class="rm-reading"><i class="rm-dot ${i.tone}" aria-hidden="true"></i><span>${i.line}</span></div>
    </div>`:m}
    ${Un(e)}
  </section>`}var Le=.16;function Zn(e,o){return Math.round((e.screen??ze).height*o*100)/100}function Yn(e,o){let t=Kn(e,o),n=e.screen??ze,r=`--rm-screen-h: ${Zn(e,Le)}px; --rm-thumb-w: ${Math.round(n.width*Le)}px`;return t===void 0?d`<span class="rm-thumb empty" aria-hidden="true" style=${r}></span>`:d`<span class="rm-thumb" aria-hidden="true" title=${Z(t)} style=${r}>${fe({page:t,pages:[t],screen:n,states:e.hass.states,...e.icons?{icons:e.icons}:{},scale:Le})}</span>`}function Po(e,o,t,n){let r=H(e.view,o.key),i=Gn(e.pages,r),a=mn(e.document,o.key),s=a.size>0||(e.added??[]).some(p=>y(p)===o.key),c=p=>{p.stopPropagation(),!e.busy&&(e.forgetRoom?.(o.key),a.size>0&&e.write(a),e.requestUpdate())},l=$o(e,o);return d`<li class="rm-row ${t?"on":""}" @click=${()=>F(e,o.key)}>
    <span class="rm-row-room">
      <button type="button" class="rm-row-name" aria-pressed=${t?"true":"false"} title="Show this room on the watch"
        @click=${p=>{p.stopPropagation(),F(e,o.key)}}>${o.name}</button>
      ${n?d`<span class="rm-here"><i aria-hidden="true"></i>You are here</span>`:m}
      ${l===""?m:d`<span class="rm-row-sub">${l}</span>`}
    </span>
    <span class="rm-arrow" aria-hidden="true">${x("arrow")}</span>
    <span class="rm-row-page">
      ${Yn(e,r)}
      ${Ke(`Page for ${o.name}`,i,Fn(e.pages,i,[["","No page"]]),p=>{e.write(Ee(e.document,o.key,p)),F(e,o.key)},e.busy)}
    </span>
    <span class="rm-row-end">${s?d`<button type="button" class="rm-row-x" aria-label=${`Remove ${o.name}`} ?disabled=${e.busy}
      title="Take this room off: its page and its things to point at go. Undo brings them back." @click=${c}>${x("close")}</button>`:m}</span>
  </li>`}function Mo(e,o){let t=String(e.uiState.get("addRoom")??""),n=y(t),r=n!==""&&o.some(a=>a.key===n),i=()=>{n===""||r||(e.uiState.set("addRoom",""),Vn(e,t))};return d`<div class="rm-add-room">
    <input type="text" placeholder="Add a room by name" aria-label="Room name" .value=${t}
      @input=${a=>{e.uiState.set("addRoom",a.target.value),e.requestUpdate()}}
      @keydown=${a=>{a.key==="Enter"&&(a.preventDefault(),i())}} />
    <button type="button" class="rm-btn" ?disabled=${n===""||r} @click=${i}>${x("plus")}<span>Add</span></button>
  </div>
  ${t.trim()!==""&&n===""?d`<p class="rm-help warn">The watch matches room names by their letters a to z and digits, and this name has none.</p>`:m}
  ${r?d`<p class="rm-help">That room is in the list.</p>`:d`<p class="rm-help">For a name the sensor says that is not an area in Home Assistant.</p>`}`}function Io(e){let o=re(e.view.fallback),t=o==="first"?"":o==="stay"?L:Gn(e.pages,e.view.fallback);return d`<div class="rm-row rm-else">
    <span class="rm-row-room">
      <b class="rm-else-name">Anywhere else</b>
      <span class="rm-row-sub">A room with no page, or when the room cannot be told</span>
    </span>
    <span class="rm-arrow" aria-hidden="true">${x("arrow")}</span>
    <span class="rm-row-page">
      ${Yn(e,o==="page"?e.view.fallback:"")}
      ${Ke("Page anywhere else",t,Fn(e.pages,t,[[L,oe.stay],["",oe.first]]),n=>e.write(un(n)),e.busy)}
    </span>
    <span class="rm-row-end"></span>
  </div>`}function Co(e,o,t){let n=Ge(e.hass,e.view.sensor),r=Ao(e),i=To(o,e.floors),a=Qe(e,"moreOpen",o.length===0),s=r.length===0?"Add a room":`${r.length} more ${r.length===1?"area":"areas"} in Home Assistant`;return d`<section class="rm-card rm-rules" aria-label="Room pages">
    <div class="rm-rules-head">
      <span class="rm-cap">When I walk into${Ue(We(e,[u.mappings,u.fallback]))}</span>
      <span class="rm-cap rm-cap-page">the watch opens</span>
    </div>
    ${o.length===0?d`<div class="rm-none">
          <b>${e.roomsState==="loading"?"Reading your rooms":"No rooms yet"}</b>
          <span>${e.roomsState==="loading"?"The areas and what the room sensor reported.":r.length>0?"Pick an area below, or type a name.":"Type a room's name below."}</span>
        </div>`:i.map(c=>d`<div class="rm-group" role="group" aria-label=${c.name===""?"Rooms":c.name}>
          ${c.name===""?m:d`<span class="rm-floor">${c.name}</span>`}
          <ul class="rm-rows">${c.rooms.map(l=>Po(e,l,l.key===t?.key,l.key===n))}</ul>
        </div>`)}
    ${Io(e)}
    <button type="button" class="rm-fold" aria-expanded=${a?"true":"false"} @click=${()=>Fe(e,"moreOpen",a)}>
      <span class="rm-chev" aria-hidden="true">${x("right")}</span>${s}
    </button>
    ${a?d`<div class="rm-more">
      ${r.length>0?d`<div class="rm-areas">
        ${r.map(c=>d`<button type="button" class="rm-area" title=${`Add ${c.name} to your rooms`} @click=${()=>Vn(e,c.name)}>+ ${c.name}</button>`)}
        <span class="rm-help rm-areas-help">Click one to give it a page.</span>
      </div>`:m}
      ${Mo(e,o)}
    </div>`:m}
  </section>`}function Lo(e,o,t,n){let r=Math.atan2(e-t,n-o)*180/Math.PI;return N(r)}function Jo(e,o,t,n,r){let i=o[t].centerHeading,a=26,s=32,c=(g,v)=>{let k=g*Math.PI/180;return{x:s+Math.sin(k)*v,y:s-Math.cos(k)*v}},l=c(i,a-3),p=g=>{if(e.busy||g.button!==0)return;let v=g.currentTarget,k=v.getBoundingClientRect(),qe=k.width/64,se=Ze=>n(Lo((Ze.clientX-k.left)/qe,(Ze.clientY-k.top)/qe,s,s),r);se(g),v.setPointerCapture?.(g.pointerId);let K=()=>{v.removeEventListener("pointermove",se),v.removeEventListener("pointerup",K),v.removeEventListener("pointercancel",K),e.endCoalesce()};v.addEventListener("pointermove",se),v.addEventListener("pointerup",K),v.addEventListener("pointercancel",K)},b=g=>{let v=g.shiftKey?15:1;if(g.key==="ArrowRight"||g.key==="ArrowUp")n(N(i+v),r);else if(g.key==="ArrowLeft"||g.key==="ArrowDown")n(N(i-v),r);else return;g.preventDefault()};return d`<svg class="rm-dial" viewBox="0 0 64 64" role="slider" tabindex="0" aria-label="Heading"
    aria-valuemin="0" aria-valuemax="359" aria-valuenow=${Math.round(i)} aria-valuetext=${`${Math.round(i)} degrees, ${be(i)}`}
    @pointerdown=${p} @keydown=${b} @blur=${()=>e.endCoalesce()}>
    <circle class="rm-dial-face" cx=${s} cy=${s} r=${a}></circle>
    ${[0,90,180,270].map(g=>{let v=c(g,a-1),k=c(g,a-5);return de`<line class="rm-dial-tick" x1=${v.x} y1=${v.y} x2=${k.x} y2=${k.y}></line>`})}
    <text class="rm-dial-n" x=${s} y="13">N</text>
    ${o.map((g,v)=>{if(v===t)return m;let k=c(g.centerHeading,a-3);return de`<circle class="rm-dial-other" cx=${k.x} cy=${k.y} r="2"></circle>`})}
    <line class="rm-dial-needle" x1=${s} y1=${s} x2=${l.x} y2=${l.y}></line>
    <circle class="rm-dial-tip" cx=${l.x} cy=${l.y} r="3.2"></circle>
    <circle class="rm-dial-hub" cx=${s} cy=${s} r="2.2"></circle>
  </svg>`}function No(e,o,t,n){let r=t[n],i=(c,l)=>{if(e.busy)return;let p=t.flatMap((g,v)=>{if(v!==n)return[g];let k=c(g);return k===void 0?[]:[k]}),b=$e(e.document,o,p);b!==void 0&&e.write(b,l)},a=(c,l)=>i(p=>({...p,centerHeading:N(c)}),l),s=`target:${o}:${n}`;return d`<div class="rm-target">
    ${Jo(e,t,n,a,`${s}:heading`)}
    <div class="rm-target-fields">
      <div class="rm-stack">${q({hass:e.hass},"Entity",Be(e.hass,r.entityId),c=>{let l=c.entityId.trim();l===""||l===r.entityId||i(p=>({...p,entityId:l}))},`rooms:${s}:entity`,{domain:ge,clearable:!1})}</div>
      <label class="field num rm-heading">
        <span>Heading</span>
        <span class="rm-heading-box">
          <input type="number" min="0" max="359" step="1" .value=${String(Math.round(r.centerHeading))} ?disabled=${e.busy}
            aria-label="Heading in degrees"
            @change=${c=>{let l=c.target,p=Number(l.value);if(l.value.trim()===""||Number.isNaN(p)){l.value=String(Math.round(r.centerHeading));return}a(p,`${s}:typed`),e.endCoalesce()}} />
          <span class="rm-compass">° ${be(r.centerHeading)}</span>
        </span>
      </label>
      ${At("Label",r.label??"",c=>i(l=>{let p={entityId:l.entityId,centerHeading:l.centerHeading};return c!==""&&(p.label=c),p},`${s}:label`),{placeholder:ye(r.entityId)})}
    </div>
    <button type="button" class="rm-remove" title="Remove this target" aria-label="Remove this target" ?disabled=${e.busy}
      @click=${()=>i(()=>{})}>${x("close")}</button>
  </div>`}var zo="To read a heading, stand where you point from, face the target and open Heading on the watch (in Connection Health, or on the point control of a room with no targets). Type the number it shows.";function Bo(e,o){let{view:t}=e,n=e.uiState.get(`adding:${o.key}`)===!0,r=s=>d`<div class="rm-sub-h">
    <span>Things to point at</span>
    ${t.zones.ok?d`<button type="button" class="lc-btn rm-add-thing" ?disabled=${e.busy} aria-expanded=${n?"true":"false"}
      @click=${()=>{e.uiState.set(`adding:${o.key}`,!n),e.requestUpdate()}}>${n&&s>0?"Done":"+ Add a thing"}</button>`:m}
  </div>`;if(!t.zones.ok)return d`${r(0)}<p class="rm-help warn">${Rn}</p>`;let i=Te(t.zones.rooms,o.key),a=`rooms:target-add:${o.key}`;return d`${r(i.length)}
    ${i.length===0&&!n?d`<p class="rm-help">None yet. Add a lamp or a switch you point the watch at in this room.</p>`:m}
    ${i.map((s,c)=>No(e,o.key,i,c))}
    ${n?d`<div class="rm-stack rm-add-target">${q({hass:e.hass},"Add a thing",Be(e.hass,""),s=>{let c=s.entityId.trim();if(c===""||e.busy||i.some(p=>p.entityId===c))return;let l=$e(e.document,o.key,[...i,{entityId:c,centerHeading:0,label:ye(c)}]);l!==void 0&&e.write(l),e.uiState.set(`adding:${o.key}`,!1)},a,{domain:ge,clearable:!1})}</div>`:m}
    ${i.length>0?d`<p class="rm-help" title=${zo}>Heading is degrees clockwise from north. Drag the dial or type it.</p>`:m}`}function Wo(e,o,t,n){return d`<div class="rm-switch">${ue(e,o,n)}<p class="rm-help">${t}</p></div>`}function Uo(e){let{view:o}=e,t={[u.tapToToggle]:o.tapToToggle,[u.liveTile]:o.liveTile};return d`<div class="rm-point-switches" title="One value for every point control tile on this watch.">
    <div class="rm-sub-h"><span>Every room</span></div>
    ${R.pointControl.switches.map(n=>{let r=t[n.key]??n.absent;return Wo(n.label,r,r?n.onDetail:n.offDetail,i=>{e.busy||e.write(pn(n.key,i))})})}
  </div>`}function Qo(e){if(!e.zones.ok)return"The stored targets cannot be read.";let o=e.zones.rooms.map(([,n])=>n.length).filter(n=>n>0),t=o.reduce((n,r)=>n+r,0);return t===0?"Off in every room.":`${t} ${t===1?"thing":"things"} in ${o.length} ${o.length===1?"room":"rooms"}.`}function Fo(e,o,t){let n=Qe(e,"pointOpen"),r=e.home===!0,i=r?[u.zones]:[u.zones,u.tapToToggle,u.liveTile];return d`<section class="rm-card rm-point" aria-label="Point control">
    <button type="button" class="rm-point-head" aria-expanded=${n?"true":"false"} @click=${()=>Fe(e,"pointOpen",n)}>
      <span class="rm-chev" aria-hidden="true">${x("right")}</span>
      <span class="rm-point-text">
        <span class="rm-point-title">Point control${Ue(We(e,i))}</span>
        <span class="rm-point-sub">Point the watch at a lamp to control it. ${Qo(e.view)}</span>
      </span>
    </button>
    ${n?d`<div class="rm-point-body">
      ${t===void 0?d`<p class="rm-help">Add a room first, then the things you point at in it.</p>`:d`<label class="rm-point-room">
            <span>Room</span>
            ${Ke("Room for point control",t.key,o.map(a=>[a.key,a.name]),a=>F(e,a),!1)}
          </label>
          ${Bo(e,t)}`}
      ${r?m:Uo(e)}
    </div>`:m}
  </section>`}var Xn=1.15;function Go(e,o,t){let n=e.screen??ze,r=e.narrow===!0?1:Xn,i=Kn(e,o);if(i!==void 0)return fe({page:i,pages:M(e.pagesDocument),screen:n,states:e.hass.states,...e.icons?{icons:e.icons}:{},scale:r,...e.home===!0?{}:{behavior:e.document}});let a=So(e,o);return Wt(n,r,d`<div class="wp-screen rm-screen ${a===""?"blank":""}"
    style=${`width:${n.width*r}px;height:${n.height*r}px;background:${Zt({},r,n)}`}>
    <span>${a===""?t:a}</span>
  </div>`,a===""?"Watch":`Watch showing ${a}`)}function Ko(e,o){let t=e.narrow===!0?1:Xn;if(o===void 0)return d`<div class="card canvas-card lit rm-canvas" aria-label="Preview">
      <div class="rm-stage-head"><span class="rm-eyebrow">Preview</span><b class="rm-stage-title">No rooms yet</b></div>
      <div class="stage-area rm-stage-area rm-empty">
        <div class="rm-empty-watch" aria-hidden="true">${x("home")}</div>
        <span class="rm-empty-text">Add a room and give it a page. When you walk in, the watch opens that page.</span>
      </div>
    </div>`;let n=Ge(e.hass,e.view.sensor)===o.key,r=H(e.view,o.key),i=e.view.fallback,a=r!==""?r:re(i)==="page"?i:"",s=r!==""?"":a!==""?"No page for this room, so the watch opens Anywhere else.":"";return d`<div class="card canvas-card lit rm-canvas" aria-label=${`What the watch opens in ${o.name}`}>
    <div class="rm-stage-head">
      <span class="rm-eyebrow">${n?"You are here":"Preview"}</span>
      <b class="rm-stage-title">${o.name}</b>
      ${s===""?m:d`<span class="rm-stage-note">${s}</span>`}
    </div>
    <div class="stage-area rm-stage-area">
      <div class="rm-stage-body" style=${`--rm-screen-h: ${Zn(e,t)}px`}>${Go(e,a,"No page for this room. The watch uses Anywhere else.")}</div>
    </div>
    <p class="rm-stage-foot">Click a room to see what the watch opens there.</p>
  </div>`}function Ve(e){let o=Ro(e),t=Eo(e,o);return d`<div class="rm-layout" style=${`--wa-stage-hue: ${Nn}; --rm-hue: ${Nn}`}>
    <div class="rm-cell rm-cell-status">${Ho(e)}</div>
    <div class="rm-cell rm-cell-rules">${Co(e,o,t)}</div>
    <aside class="rm-side column canvas" aria-label="Preview">${Ko(e,t)}</aside>
    <div class="rm-cell rm-cell-point">${Fo(e,o,t)}</div>
  </div>`}var eo=V`
  /* A main column of rules and a sticky stage beside it, the page no wider
     than 1240px and centred. Under 1000px one column: the stage goes under
     the rules, before point control, and scrolls with the page. */
  .rm-layout {
    width: 100%; max-width: 1240px; margin: 0 auto 14px;
    display: grid; grid-template-columns: minmax(0, 1fr) 360px; grid-template-rows: auto auto 1fr;
    column-gap: 16px; row-gap: 14px; align-items: start;
  }
  .rm-cell { min-width: 0; }
  .rm-cell-status { grid-column: 1; grid-row: 1; }
  .rm-cell-rules { grid-column: 1; grid-row: 2; }
  .rm-cell-point { grid-column: 1; grid-row: 3; }
  .rm-side { grid-column: 2; grid-row: 1 / span 3; position: sticky; top: 12px; min-width: 0; }
  @container (max-width: 1000px) {
    .rm-layout { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; }
    .rm-cell-status, .rm-cell-rules, .rm-cell-point, .rm-side { grid-column: 1; grid-row: auto; }
    .rm-side { position: static; }
  }

  /* Help is one plain line: muted, never italic. */
  .rm-help { margin: 2px 0 8px; font-size: 12px; line-height: 1.45; font-style: normal; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-help.warn { color: var(--wa-amber); }
  .rm-help a, .rm-sensor-hint a { color: var(--wa-ink); }
  .rm-help code, .rm-card code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .rm-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .rm-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .rm-card .field :is(input[type=text], input[type=number], select) {
    height: 30px; min-height: 30px; padding: 0 9px; font-size: 13px; border-radius: 7px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
  .rm-card .field.check { grid-template-columns: minmax(0, 1fr) auto; min-height: 30px; padding: 0; font-size: 13px; gap: 10px; }
  .rm-card .field.check > span { color: var(--wa-ink); font-size: 13px; }
  /* A picked entity wraps its name, id and state rather than cutting them
     short; the box grows a line instead. */
  .rm-card .ent-chosen { height: auto; min-height: 28px; }
  .rm-card button.ent-pick { flex-wrap: wrap; row-gap: 0; padding-top: 3px; padding-bottom: 3px; }
  .rm-card .ent-pick :is(.ent-name, .ent-id, .ent-state) { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; max-width: none; }
  .rm-card .ent-pick .ent-id { flex: 0 1 auto; }
  .rm-dirty { display: inline-block; width: 7px; height: 7px; margin-left: 7px; vertical-align: middle; border-radius: 50%; background: var(--rm-hue); }

  /* The cards: plain, the Rooms hue only on the lit outline of the card at
     the top, the icon chip and the picked row's edge. */
  .rm-card {
    border-radius: var(--wa-lc-r, 16px); background: var(--wa-card); border: 1px solid var(--wa-line); color: var(--wa-ink);
  }
  .rm-card.rm-lit { --c: var(--rm-hue); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid); ${it} }
  /* The hue stays on the outline: the controls inside are neutral. */
  .rm-card.rm-lit > * { --c: var(--wa-accent); }
  .rm-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-muted); }
  .rm-start .rm-eyebrow { color: var(--rm-hue); }
  .rm-cap { font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-soft); }
  /* Every button and link button: a visible one pixel outline, neutral. */
  .rm-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 5px; flex: none;
    height: 32px; padding: 0 12px; border-radius: 8px; font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
    text-decoration: none; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  .rm-btn.rm-small { height: 24px; padding: 0 9px; border-radius: 6px; font-size: 12px; font-weight: 400; color: var(--wa-soft); }
  .rm-btn:hover:not(:disabled) { background: var(--wa-hover); }
  .rm-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-btn:disabled { opacity: .45; cursor: default; }
  .rm-btn svg.ui-icon { width: 13px; height: 13px; }
  select.rm-select {
    min-width: 0; max-width: 100%; height: 30px; padding: 0 8px; border-radius: 7px; font: inherit; font-size: 13px;
    color: var(--wa-ink); background-color: var(--wa-field); border: 1px solid var(--wa-line-strong); cursor: pointer;
  }
  select.rm-select:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  select.rm-select:disabled { opacity: .45; cursor: default; }

  /* Right now: the chip, the sentence and the sensor, the switch at the
     right end, When under a hairline. */
  .rm-status {
    display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
    column-gap: 16px; row-gap: 12px; padding: 16px 18px;
  }
  .rm-ichip {
    width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center;
    border: 1px solid var(--rm-hue); color: var(--rm-hue);
  }
  .rm-ichip svg.ui-icon { width: 18px; height: 18px; stroke-width: 2; }
  .rm-status-text { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
  .rm-now { margin: 0; font-size: 16px; line-height: 1.4; overflow-wrap: anywhere; }
  .rm-now b { font-weight: 600; }
  .rm-sensor-line { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 12px; color: var(--wa-muted); }
  .rm-sensor-name, .rm-sensor-hint { overflow-wrap: anywhere; }
  .rm-bermuda-ok { display: inline-flex; align-items: center; gap: 6px; color: var(--wa-green); overflow-wrap: anywhere; }
  .rm-bermuda-ok svg.ui-icon { width: 13px; height: 13px; flex: none; stroke-width: 2.4; }
  .rm-status-switch { min-width: 0; }
  .rm-status > .rm-status-switch { grid-column: 3; grid-row: 1; }
  .rm-status-wide { grid-column: 1 / -1; }
  .rm-status > .rm-help.rm-main-house { margin: 0; }
  .rm-sensor-edit { display: flex; flex-direction: column; gap: 4px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
  .rm-when { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; padding-top: 12px; border-top: 1px solid var(--wa-line); }
  .rm-when-l { font-size: 12px; color: var(--wa-muted); }
  .seg.rm-seg { flex: 0 1 auto; max-width: 100%; height: auto; min-height: 30px; flex-wrap: wrap; }
  .seg.rm-seg button { min-height: 26px; padding: 3px 11px; font-size: 12px; font-weight: 500; letter-spacing: 0; line-height: 1.2; white-space: normal; overflow-wrap: anywhere; text-align: center; }
  .seg.rm-seg button:disabled { opacity: .45; cursor: default; }
  .rm-when-help { flex: 1 1 220px; min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  @container (max-width: 560px) {
    .rm-status { grid-template-columns: auto minmax(0, 1fr); }
    .rm-status > .rm-status-switch { grid-column: 1 / -1; grid-row: auto; }
  }
  .rm-reading { display: flex; align-items: flex-start; gap: 8px; margin: 2px 0; font-size: 12.5px; line-height: 1.45; overflow-wrap: anywhere; }
  .rm-dot { flex: none; width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--wa-line-strong); }
  .rm-dot.ok { background: var(--wa-green); }
  .rm-dot.warn { background: var(--wa-amber); }

  /* Start here: no sensor picked yet. */
  .rm-start { display: flex; flex-direction: column; gap: 10px; padding: 18px; }
  .rm-start-title { margin: 0; font-size: 18px; font-weight: 500; letter-spacing: -.015em; text-transform: none; color: var(--wa-ink); overflow-wrap: anywhere; }
  .rm-pitch { margin: 0; max-width: 640px; font-size: 13px; line-height: 1.5; color: var(--wa-soft); overflow-wrap: anywhere; }
  .rm-start-row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 8px; }
  .rm-start-row > .rm-stack { flex: 1 1 280px; min-width: 0; }
  .rm-start-row > .rm-bermuda-link { margin-bottom: 2px; }
  .rm-start > .rm-help { margin: 0; }
  .rm-start-switch { display: flex; flex-direction: column; gap: 10px; padding-top: 12px; border-top: 1px solid var(--wa-line); }

  /* The rules: a head of two small capitals, the floors, a row per room. */
  .rm-rules { display: flex; flex-direction: column; overflow: hidden; }
  .rm-rules-head { display: flex; align-items: baseline; gap: 10px; padding: 14px 16px 8px; }
  .rm-rules-head > .rm-cap:first-child { flex: 1; }
  .rm-group { display: flex; flex-direction: column; }
  .rm-floor { padding: 8px 16px 4px; font-size: 11.5px; color: var(--wa-faint); overflow-wrap: anywhere; }
  ul.rm-rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
  .rm-row {
    display: flex; align-items: center; gap: 12px; padding: 8px 10px 8px 16px; cursor: pointer;
    transition: background-color .15s ease;
  }
  li.rm-row:hover { background: var(--wa-hover); }
  li.rm-row.on { background: var(--wa-raise); box-shadow: inset 2px 0 0 var(--rm-hue); }
  /* On the raised and hovered fills the controls' outline is lifted, so it
     stays visible. */
  li.rm-row:is(.on, :hover) :is(select.rm-select, button.rm-row-x) { border-color: color-mix(in srgb, var(--wa-ink) 26%, var(--wa-raise)); }
  .rm-row-room { flex: 1 1 auto; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 3px 8px; }
  button.rm-row-name {
    padding: 0; border: 0; background: transparent; font: inherit; font-size: 14px; font-weight: 500; text-align: left;
    color: var(--wa-ink); cursor: pointer; overflow-wrap: anywhere; border-radius: 4px;
  }
  button.rm-row-name:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-row-sub { flex-basis: 100%; font-size: 12px; line-height: 1.35; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-here {
    display: inline-flex; align-items: center; gap: 4px; height: 18px; padding: 0 7px; border-radius: 999px;
    font-size: 10.5px; font-weight: 500; color: var(--wa-green); border: 1px solid color-mix(in srgb, var(--wa-hue-green) 60%, transparent);
  }
  .rm-here i { width: 5px; height: 5px; border-radius: 50%; background: var(--wa-hue-green); }
  .rm-arrow { flex: none; display: inline-flex; color: var(--wa-faint); }
  .rm-arrow svg.ui-icon { width: 16px; height: 16px; }
  .rm-row-page { flex: 0 0 260px; min-width: 0; display: flex; align-items: center; gap: 8px; }
  .rm-row-page > select.rm-select { flex: 1 1 auto; }
  .rm-row-end { flex: 0 0 26px; display: flex; justify-content: flex-end; }
  button.rm-row-x {
    width: 26px; height: 26px; padding: 0; display: grid; place-items: center; border-radius: 6px; cursor: pointer;
    color: var(--wa-muted); background: transparent; border: 1px solid var(--wa-line-strong); opacity: 0;
  }
  li.rm-row:hover button.rm-row-x, li.rm-row:focus-within button.rm-row-x, li.rm-row.on button.rm-row-x { opacity: 1; }
  @media (hover: none) { button.rm-row-x { opacity: 1; } }
  button.rm-row-x:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
  button.rm-row-x:focus-visible { outline: none; opacity: 1; box-shadow: var(--wa-ring); }
  button.rm-row-x:disabled { cursor: default; }
  button.rm-row-x svg.ui-icon { width: 12px; height: 12px; }
  .rm-else { margin-top: 6px; padding-top: 12px; padding-bottom: 12px; cursor: default; border-top: 1px solid var(--wa-line); background: var(--wa-panel); }
  .rm-else-name { font-size: 14px; font-weight: 500; }
  /* One screen of the page, small, beside each picker; an empty box when
     there is none. */
  .rm-thumb { flex: none; display: block; width: var(--rm-thumb-w); }
  .rm-thumb .wa-watch { margin: 0; }
  .rm-thumb.empty { height: var(--rm-screen-h); border-radius: 6px; border: 1px dashed var(--wa-line-strong); }
  :is(.rm-stage-body, .rm-thumb) .wa-watch > .wp-screen { max-height: var(--rm-screen-h); }
  :is(.rm-stage-body, .rm-thumb) .wp-fold { display: none; }
  @container (max-width: 640px) {
    .rm-row { flex-wrap: wrap; row-gap: 8px; }
    .rm-row-room { flex-basis: calc(100% - 40px); }
    .rm-arrow { display: none; }
    .rm-row-page { flex: 1 1 auto; }
    .rm-row-end { order: 0; }
    .rm-row > .rm-row-room { order: -1; }
  }
  .rm-none { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; }
  .rm-none b { font-size: 13px; font-weight: 600; }
  .rm-none span { font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
  /* The fold under the rules: the areas not listed yet and the name field. */
  button.rm-fold {
    display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px 16px; font: inherit; font-size: 12.5px;
    text-align: left; cursor: pointer; color: var(--wa-muted); background: transparent; border: 0; border-top: 1px solid var(--wa-line);
  }
  button.rm-fold:hover { background: var(--wa-hover); color: var(--wa-ink); }
  button.rm-fold:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-chev { display: inline-flex; flex: none; transition: transform .15s ease; }
  .rm-chev svg.ui-icon { width: 12px; height: 12px; stroke-width: 2.2; }
  [aria-expanded="true"] > .rm-chev { transform: rotate(90deg); }
  .rm-more { display: flex; flex-direction: column; gap: 10px; padding: 0 16px 14px; }
  .rm-areas { display: flex; flex-wrap: wrap; gap: 6px; }
  .rm-areas-help { width: 100%; margin: 2px 0 0; }
  button.rm-area {
    min-height: 26px; padding: 2px 10px; border-radius: 999px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-soft); background: transparent; border: 1px solid var(--wa-line-strong); overflow-wrap: anywhere; text-align: left;
  }
  button.rm-area:hover { background: var(--wa-hover); color: var(--wa-ink); }
  button.rm-area:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-add-room { display: flex; gap: 6px; max-width: 480px; }
  .rm-add-room input {
    flex: 1 1 auto; min-width: 0; height: 32px; padding: 0 10px; border-radius: 8px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .rm-add-room input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .rm-more > .rm-help { margin: -4px 0 0; }

  /* Point control, folded: one line, then the picked room's targets and the
     two switches. */
  button.rm-point-head {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 13px 16px; border-radius: var(--wa-lc-r, 16px);
    font: inherit; text-align: left; cursor: pointer; color: var(--wa-ink); background: transparent; border: 0;
  }
  button.rm-point-head:hover { background: var(--wa-hover); }
  button.rm-point-head:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-point-head > .rm-chev { color: var(--wa-muted); }
  .rm-point-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .rm-point-title { font-size: 13.5px; font-weight: 500; }
  .rm-point-sub { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-point-body { display: flex; flex-direction: column; padding: 2px 16px 14px 38px; }
  @container (max-width: 560px) { .rm-point-body { padding-left: 16px; } }
  .rm-point-room { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 12px; color: var(--wa-muted); }
  .rm-point-room > select.rm-select { flex: 0 1 260px; }
  .rm-sub-h { display: flex; align-items: center; gap: 8px; margin: 12px 0 4px; font-size: 12px; color: var(--wa-muted); }
  .rm-sub-h > span { flex: 1; }
  .rm-sub-h button.lc-btn { height: 26px; font-size: 12px; font-weight: 500; border: 1px solid var(--wa-line-strong); background: transparent; }
  .rm-switch { margin-top: 6px; }
  .rm-switch .rm-help { margin: 0 0 4px; }
  .rm-point-switches { margin-top: 8px; padding-top: 2px; border-top: 1px solid var(--wa-line); }
  .rm-target {
    display: grid; grid-template-columns: 64px minmax(0, 1fr) 28px; gap: 10px; align-items: start;
    margin: 8px 0; padding: 10px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-field);
  }
  .rm-target-fields { min-width: 0; }
  .rm-dial { width: 64px; height: 64px; touch-action: none; cursor: grab; display: block; border-radius: 50%; }
  .rm-dial:active { cursor: grabbing; }
  .rm-dial:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-dial-face { fill: var(--wa-card); stroke: var(--wa-line-strong); stroke-width: 1.2; }
  .rm-dial-tick { stroke: var(--wa-muted); stroke-width: 1.2; }
  .rm-dial-n { font-size: 7px; font-weight: 700; fill: var(--wa-muted); text-anchor: middle; }
  .rm-dial-other { fill: var(--wa-muted); opacity: .5; }
  .rm-dial-needle { stroke: var(--wa-ink); stroke-width: 2; stroke-linecap: round; }
  .rm-dial-tip { fill: var(--wa-ink); }
  .rm-dial-hub { fill: var(--wa-ink); }
  .rm-heading-box { display: inline-flex; align-items: center; gap: 6px; }
  .rm-card .rm-heading-box input { width: 72px; }
  .rm-compass { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .rm-remove {
    width: 28px; height: 28px; padding: 0; display: grid; place-items: center; border-radius: 6px;
    border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  .rm-remove:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
  .rm-remove:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-remove svg.ui-icon { width: 13px; height: 13px; }
  .rm-add-target { margin: 4px 0 8px; }

  /* The stage: the lit card (the watch editors' recipe, its edge in the
     Rooms hue), the picked room over the watch, one line at its foot. */
  .column.canvas.rm-side { gap: 0; }
  .column.canvas > .card.canvas-card.rm-canvas { min-height: 0; flex: none; }
  .rm-stage-head { display: flex; flex-direction: column; gap: 2px; padding: 14px 16px 0; }
  .rm-stage-title { font-size: 16px; font-weight: 500; overflow-wrap: anywhere; }
  .rm-stage-note { font-size: 12px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .canvas-card.lit .stage-area.rm-stage-area { flex: none; align-items: center; justify-content: center; padding: 18px 12px 24px; }
  .canvas-card.lit .stage-area > .rm-stage-body { display: flex; justify-content: center; max-width: 100%; padding-bottom: 32px; }
  .rm-stage-foot { margin: 0; padding: 0 16px 16px; font-size: 12px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  /* A plain watch screen: the page's name, or why there is none, on the
     watch's black. */
  .wp-screen.rm-screen { display: grid; place-items: center; padding: 20px; text-align: center; }
  .wp-screen.rm-screen span { font-size: 15px; font-weight: 600; color: var(--wa-face-muted); overflow-wrap: anywhere; }
  .wp-screen.rm-screen.blank span { font-size: 13px; font-weight: 500; line-height: 1.4; }
  /* No rooms yet: a dashed watch and one line. */
  .canvas-card.lit .stage-area.rm-empty { flex-direction: column; gap: 18px; padding: 24px 20px 40px; text-align: center; }
  .rm-empty-watch {
    width: 180px; height: 218px; border-radius: 50px; display: grid; place-items: center;
    border: 1.5px dashed var(--wa-line-strong); color: var(--wa-stage-hue);
  }
  .rm-empty-watch svg.ui-icon { width: 42px; height: 42px; stroke-width: 1.6; }
  .rm-empty-text { max-width: 280px; font-size: 13px; line-height: 1.5; color: var(--wa-muted); }
`;tn({dirty:Ce,drop:Ln});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Ce()&&(e.preventDefault(),e.returnValue="")});var Vo=15e3,jo="watch settings",qo="rooms";function Zo(e){return`${e}\0rooms`}var oo=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),je=oo?"\u2318":"Ctrl+",Yo=820;function Xo(e){return D(e).message}function to(e){return D(e).code}function no(e){let{code:o,message:t}=D(e);return Object.assign(new Error(t),o===void 0?{}:{code:o})}function er(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function tr(e){let o=e?Date.parse(e):NaN;return Number.isNaN(o)?"":rt(Math.max(0,(Date.now()-o)/1e3))}function nr(e){return e instanceof HTMLElement?Ct(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function or(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}var G=new Map,h=class extends Ye{constructor(){super(...arguments);this.owners=[];this.narrow=!1;this.haMenu=!1;this.barActions=m;this.shellOwnsWatch=!1;this.barHost=void 0;this.iconsTick=0;this.headBar=new yt(this);this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.hostWidth=0;this.areas=[];this.areasRead=!1;this.floors=[];this.sensorHistory=[];this.unsupported=!1;this.shownFootDialogs=new WeakSet;this.ownListAsked=!1;this.savedTicker=new $t(this);this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.sensorSeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||this.load(t,!0)};this.onKeyDown=t=>{if(t.defaultPrevented)return;let n=t.composedPath();if(!n.includes(this)&&!this.headBar.holds(n)&&!or()||this.renderRoot.querySelector("dialog[open]"))return;let r=t.metaKey||t.ctrlKey,i=t.key.toLowerCase();if(r&&!t.altKey&&i==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&(this.topMenuOpen||this.watchMenuOpen)){t.preventDefault(),this.topMenuOpen=!1,this.watchMenuOpen=!1;return}if(!nr(n[0])){if(r&&!t.altKey&&i==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}t.ctrlKey&&!t.metaKey&&!t.altKey&&i==="y"&&(t.preventDefault(),this.redo())}};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let n=t.composedPath(),r=i=>n.some(a=>a instanceof HTMLElement&&a.classList.contains(i));this.topMenuOpen&&!r("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!r("rm-watch-picker")&&(this.watchMenuOpen=!1)}}get watches(){return mt(this.owners.length>0?this.owners:this.ownList??[])}get kind(){return this.kindOf(this.watchId)}kindOf(t,n=this.watches){return En(t===void 0?void 0:n.find(r=>r.owner_watch_id===t))}get draftKey(){let t=this.watchId;if(t!==void 0)return this.kind==="rooms"?Zo(t):t}get draft(){let t=this.record,n=this.draftKey;if(n===void 0||t===void 0)return;if(t.revision<=0)return this.kind==="rooms"&&this.unsupported||!this.opensReady()?void 0:ae(n)??Ie(n,this.newWatchBase());let r=He(t);if(r!==void 0)return ae(n)??Me(n,r,t.revision).draft}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!(this.kind==="rooms"&&this.unsupported)}newWatchBase(){return this.kind==="rooms"?Dn():wt()}opensReady(t=this.watches){let n=this.watchId,r=le(t.find(i=>i.owner_watch_id===n));return Ft(r,this.kindOf(n,t),n)}startFresh(){let t=this.watchId;t!==void 0&&gt(le(this.watches.find(n=>n.owner_watch_id===t)))&&(Qt(this.kind,t),this.note=void 0,this.requestUpdate())}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.stopListeningForReconnect(),this.reloadPending=!1,this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++,this.sensorSeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Xe(this.hass).then(a=>{this.ownList=a.owners},()=>{this.ownList=[]}));let r=bt(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));r!==void 0?this.openWatch(r):this.watchId!==void 0&&this.shownKind!==void 0&&this.kind!==this.shownKind&&this.openWatch(this.watchId),this.areasAsked!==this.hass.connection&&this.loadAreas();let i=this.currentSensor();i!==this.sensorHistoryFor&&this.loadSensorHistory(i)}let n=this.restoreAsk;n!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(r=>r.revision===n.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),Ht(this.renderRoot,this.shownFootDialogs),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let n of t){let r=n.contentRect.width;Math.abs(r-this.hostWidth)>=1&&(this.hostWidth=r)}}),this.sizeObserver.observe(this))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}openWatch(t,n=!1){let r=this.kindOf(t);(t!==this.watchId||r!==this.shownKind)&&(this.reloadPending=!1,this.watchId=t,this.note=void 0,this.history=[],this.pagesRecord=void 0,this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.uiState.clear(),this.unsupported=!1,n=!1),this.shownKind=r,this.startSubscription(t),this.load(t,n),this.loadPages(t)}async load(t,n=!1){let r=this.hass;if(!r)return;if(n&&this.saving){this.reloadPending=!0;return}let i=++this.loadSeq;this.stopPolling(),n||(this.record=void 0,this.loading=!0,this.loadError=void 0);let a=this.kind;try{let s=await P(r,t,a);if(i!==this.loadSeq)return;if(n&&this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(s),this.loadError=void 0}catch(s){if(i!==this.loadSeq)return;a==="rooms"&&_n(s)?(this.unsupported=!0,this.loadError=void 0):n||(this.loadError=Xo(s))}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}show(t){let n=this.draftKey;this.record=t,n!==void 0&&t.revision<=0&&Ie(n,this.newWatchBase());let r=He(t);if(n===void 0||r===void 0)return;Me(n,r,t.revision).mergedIntoEdits&&(this.note={kind:"warn",text:`${this.kind==="rooms"?"This home's rooms":"The watch's settings"} changed elsewhere. Your edits are kept on top.`}),this.requestUpdate()}async loadPages(t){let n=this.hass;if(n)try{let r=await P(n,t,"pages");t===this.watchId&&(this.pagesRecord=r)}catch{}}async loadHistory(t){let n=this.hass;if(!n||this.historyState==="unsupported")return;let r=++this.historySeq;try{let i=await tt(n,t,this.kind);if(r!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(i?.entries)?i.entries:[],this.historyState="ready"}catch(i){if(r!==this.historySeq||t!==this.watchId)return;this.historyState=to(i)==="unknown_command"?"unsupported":"error"}}async loadAreas(){let t=this.hass;if(!t)return;this.areasAsked=t.connection;let[n,r]=await Promise.allSettled([t.connection.sendMessagePromise({type:"config/area_registry/list"}),t.connection.sendMessagePromise({type:"config/floor_registry/list"})]);this.areas=n.status==="fulfilled"?gn(n.value):wn(t.areas);let i=r.status==="fulfilled"?_e(r.value):[];this.floors=i.length>0?i:_e(t.floors),this.areasRead=!0}async loadSensorHistory(t){let n=this.hass;this.sensorHistoryFor=t;let r=++this.sensorSeq;if(this.sensorHistory=[],!(!n||t===""))try{let i=await n.connection.sendMessagePromise({type:"history/history_during_period",start_time:new Date(Date.now()-yn*36e5).toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0,significant_changes_only:!1});if(r!==this.sensorSeq)return;this.sensorHistory=bn(i,t)}catch{}}startSubscription(t){let n=this.hass;if(this.endSubscription(),!n)return;let r=++this.subscribeSeq;ot(n,t,i=>{r===this.subscribeSeq&&(i.kind===this.kind&&i.revision!==(this.record?.revision??0)&&this.load(t,!0),i.kind==="pages"&&i.revision!==(this.pagesRecord?.revision??0)&&this.loadPages(t))}).then(i=>{r===this.subscribeSeq?this.unsubscribe=i:i().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||pt(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Vo))}async poll(){this.pollTimer=void 0;let t=this.hass,n=this.watchId,r=this.record;if(!(!t||n===void 0||r===void 0)){if(this.saving){this.pollIfWaiting();return}try{let i=await P(t,n,this.kind);if(n!==this.watchId||this.record!==r)return;i.revision===r.revision?this.record={...r,delivered_revision:i.delivered_revision,delivered_at:i.delivered_at,rejected_revision:i.rejected_revision,rejected_at:i.rejected_at,rejected_reason:i.rejected_reason}:this.saving?this.reloadPending=!0:(this.show(i),this.loadHistory(n))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}currentSensor(){let t=this.draft;return t===void 0?"":ne(t.effective).sensor}memoIcons(){let t=this.icons??It,n=this.iconMemo;if(n!==void 0&&n.provider===t&&n.tick===this.iconsTick)return n.icons;let r=Lt(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:r},r}screen(){let t=this.watches.find(n=>n.owner_watch_id===this.watchId);return(St(t?.screen_size)??kt).screen}viewHost(){let t=this.draft,n=this.hass,r=this.watchId;if(t===void 0||n===void 0||r===void 0)return;let i=t.effective,a=ne(i),s=G.get(r)??[],c=this.kind==="rooms",l=fn({areas:this.areas,mappingKeys:Object.keys(a.mappings),zoneKeys:a.zones.ok?a.zones.rooms.map(([p])=>p):[],history:this.sensorHistory,added:s});return{hass:n,document:i,view:a,dirty:new Set(W(t.document,t.pending)),pages:hn(he(this.pagesRecord?.document)),rooms:l,floors:this.floors,roomsState:this.areasRead?"ready":"loading",busy:t.saving,uiState:this.uiState,write:(p,b)=>{this.draft===t&&(t.apply(c?Pe(p):p,b),this.requestUpdate())},endCoalesce:()=>t.endCoalesce(),addRoom:p=>{let b=G.get(r)??[];b.includes(p)||G.set(r,[...b,p]),this.requestUpdate()},added:s,forgetRoom:p=>{let b=G.get(r)??[];G.set(r,b.filter(g=>y(g)!==p))},pagesDocument:he(this.pagesRecord?.document),screen:this.screen(),icons:this.memoIcons(),narrow:this.stacked,requestUpdate:()=>this.requestUpdate(),...c?{home:!0}:{}}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,n=this.watchId,r=this.draft,i=this.record;if(!t||n===void 0||!r||!i||r.saving||!r.dirty)return;this.note=void 0,r.endCoalesce();let a=this.kind,s=r.revision<=0,c=Jn(r,{save:(p,b)=>et(t,n,a,p,b).catch(g=>{throw no(g)}),fetch:()=>P(t,n,a).catch(p=>{throw no(p)})});this.requestUpdate();let l=await c;if(n===this.watchId){if(l.ok){let p=l.fresh??i;this.record=l.alreadySaved?p:{...p,revision:l.revision,updated_at:new Date().toISOString(),updated_by:"panel",document:l.document}}else l.fresh!==void 0&&(this.record=l.fresh);this.note=Kt(s,l.ok?void 0:l.code,An(l,a)),this.reloadPending?(this.reloadPending=!1,this.load(n,!0)):(this.pollIfWaiting(),this.loadHistory(n)),this.requestUpdate()}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let n=this.record;this.watchId===void 0||n===void 0||this.dirty||(this.restoreAsk={entry:t,baseRevision:n.revision})}async restore(){let t=this.hass,n=this.watchId,r=this.restoreAsk;if(!t||n===void 0||r===void 0||this.restoring)return;this.restoring=!0;let i=this.kind==="rooms",a=this.draftKey??n,s;try{await nt(t,n,this.kind,r.entry.revision,r.baseRevision),s={kind:"ok",text:Jt(r.entry.updated_at)},(ae(a)?.dirty??!1)||Cn(a)}catch(c){let l=to(c);l==="conflict"?s={kind:"warn",text:`Not restored. ${i?"This home's rooms":"The watch's settings"} changed somewhere else, so the newest copy is shown.`}:l==="no_record"?s={kind:"warn",text:i?"Not restored. Home Assistant no longer holds rooms for this home.":"Not restored. Home Assistant no longer holds settings for this watch."}:l==="not_found"?s={kind:"warn",text:"Not restored. That save is no longer kept."}:l==="unknown_command"?(this.historyState="unsupported",s={kind:"warn",text:"This version of the integration cannot restore an earlier save. Update it to restore one."}):s={kind:"err",text:`Could not restore: ${Rt(c)}`}}finally{this.restoring=!1,this.restoreAsk===r&&this.closeAsk()}n===this.watchId&&(this.note=s,this.load(n,!0))}render(){let t=this.watches,n=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(n,t):m}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:m}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):m}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Yo}renderTopBar(t,n){let r=t!==void 0,i=r&&this.dirty;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch rooms">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${x("menu")}</button>`:m}
      ${this.shellOwnsWatch?m:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Xt(void 0,!1)}>${x("left")}<span>Complications</span></button>`}
      ${this.barHost===void 0?d`<span class="rm-title">Rooms</span>`:m}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?m:this.renderWatchPicker(n)}
      ${this.barHost!==void 0&&r?vt({newWatch:this.newWatch,dirty:i,saved:me(this.record)}):m}
      ${this.renderSyncPill(t)}
      ${r?d`
        <button class="tb-btn icon rm-undo" ?disabled=${!t.canUndo||this.saving} title=${`Undo (${je}Z)`} aria-label="Undo"
          @click=${()=>this.undo()}>${x("undo")}</button>
        <button class="tb-btn icon rm-undo" ?disabled=${!t.canRedo||this.saving} title=${oo?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
          @click=${()=>this.redo()}>${x("redo")}</button>`:m}
      ${this.renderTopMenu(t)}
      ${r?d`<button class="primary save ${i?"dirty":""}" ?disabled=${!i||this.saving}
          title=${i?`Save (${je}S). A save reaches the watch the next time it checks.`:`Nothing to save (${je}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?m:d`<span class="tb-saved" title=${i?"Unsaved changes":""}>${me(this.record)}</span>
        ${jt(Gt({newWatch:this.newWatch,dirty:i,saving:this.saving}))}`}`:m}
      ${this.barActions}
      <button class="help" title="Help: rooms" aria-label="Help"
        @click=${()=>window.open(en,"_blank","noopener")}>?</button>
    </div>`}get noun(){return this.kind==="rooms"?qo:jo}renderSyncPill(t){let n=this.record;if(n===void 0||n.revision<=0||t===void 0)return m;let r=Oe(t.effective,this.kind),i=pe({record:n,size:r.size,limit:r.limit,noun:this.noun,historyState:this.historyState});return d`<span class="tb-sync ${i.tone==="ok"?"ok":"warn"}" title=${`${i.state}. ${i.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${i.state}</span>
    </span>`}renderTopMenu(t){if(t===void 0)return m;let n=this.topMenuOpen,r=i=>()=>{this.topMenuOpen=!1,i()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${n?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!n}}>···</button>
      ${n?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to how the screen opened. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${r(()=>this.discard())}>Discard edits</button>
      </div>`:m}
    </span>`}personColor(t){let n=Et(this.owners.length>0?this.owners:this.ownList??[]);return Tt(n.findIndex(r=>r.owners.some(i=>i.owner_watch_id===t)))}renderWatchPicker(t){if(t.length<2)return m;let n=t.find(a=>a.owner_watch_id===this.watchId),r=this.watchMenuOpen,i=a=>{let s=a===void 0?void 0:this.personColor(a);return d`<span class="pe-chip-glyph" style=${s?`--pe-person: ${s}`:m} aria-hidden="true">${x("watch")}</span>`};return d`<span class="picker rm-watch-picker">
      <button type="button" class="tb-browse rm-watch-btn" aria-haspopup="menu" aria-expanded=${r?"true":"false"}
        title="Choose the watch whose rooms are shown" @click=${()=>{this.watchMenuOpen=!r}}>
        ${i(n?.owner_watch_id)}<span class="tb-browse-l">${n?ce(n,t):"Choose a watch"}</span>
        <span class="rm-caret" aria-hidden="true">${x("chevron")}</span>
      </button>
      ${r?d`<div class="pop-menu rm-watch-menu" role="menu" aria-label="Watches">
        ${t.map(a=>{let s=a.owner_watch_id===this.watchId;return d`<button type="button" class="row rm-watch-row" role="menuitemradio" aria-checked=${s?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,s||this.openWatch(a.owner_watch_id)}}>
            ${i(a.owner_watch_id)}<span class="rm-watch-name">${ce(a,t)}</span>
            <span class="rm-watch-check" aria-hidden="true">${s?x("check"):m}</span>
          </button>`})}
      </div>`:m}
    </span>`}renderBody(t){if(t.length===0){let s=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${s?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}let n=this.kindOf(this.watchId,t)==="rooms";if(n&&this.unsupported)return d`<div class="pe-empty"><b>${Pn}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let s=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this ${n?"home's rooms":"watch's settings"}: ${this.loadError}</span>
        ${s===void 0?m:d`<button class="pe-btn" @click=${()=>{this.load(s)}}>Try again</button>`}
      </div>`}let r=this.record;if(r===void 0)return d`<div class="pe-empty">Loading…</div>`;if(r.revision<=0&&!this.opensReady(t))return d`<div class="pe-empty"><b>${n?Hn:xn}</b>
        <span>${n?j:kn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${ft}</button>
      </div>`;let i=this.draft,a=this.viewHost();return i===void 0||a===void 0?d`<div class="pe-empty"><b>${n?Mn:Sn}</b></div>`:r.revision<=0?d`${this.barHost===void 0?Vt():m}${Ve(a)}`:d`${Ve(a)}${this.renderFoot(r,i)}`}renderFoot(t,n){let r=n.effective,i=Oe(r,this.kind),a=this.noun,s=pe({record:t,size:i.size,limit:i.limit,noun:a,historyState:this.historyState}),c=this.watchId;return d`${Dt({status:s,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?_t({noun:a,record:t,entries:this.history,historyState:this.historyState,dirty:n.dirty,restoring:this.restoring,onRetry:()=>{c!==void 0&&(this.historyState="loading",this.loadHistory(c))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):m}
    ${this.rawOpen?Ot({noun:a,document:r,revision:t.revision,dirty:n.dirty,copied:this.rawCopied,onCopy:l=>{Pt(l).then(p=>{this.rawCopied=p})},onClosed:()=>{this.rawOpen=!1}}):m}`}renderRestoreAsk(t){let n=this.record,r=tr(t.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="rm-ask-title"
      @cancel=${i=>{this.restoring&&i.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="rm-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${t.entry.updated_by==="panel"?"Saved here":"From the watch"}${r?` ${r}`:""}, ${er(t.entry.size)}.</p>
      <p>${this.kind==="rooms"?"This home's rooms come back as they were in that save.":"Every watch setting comes back as it was in that save, not only the rooms."} It is saved again as a new revision${n?`, after revision ${n.revision}`:""}, and the copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[ut,at,st,dt,ct,lt,Ut,Yt,qt,V`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
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
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }
    .rm-title { font-size: 14px; font-weight: 600; letter-spacing: -.01em; padding: 0 4px; white-space: nowrap; }
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn.icon { padding: 0 8px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .tb-saved .cf-saved { margin: 0; font-size: inherit; color: inherit; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
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
    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.rm-watch-btn { max-width: 260px; }
    .rm-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .rm-watch-btn .rm-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.rm-watch-btn .rm-caret svg { width: 11px; height: 11px; }
    .pop-menu.rm-watch-menu { left: 0; right: auto; min-width: 220px; }
    .rm-watch-menu .row.rm-watch-row { display: flex; align-items: center; gap: 8px; }
    .rm-watch-row .rm-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .rm-watch-row[aria-checked="true"] { font-weight: 700; }
    .rm-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .rm-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }
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
    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    :host([narrow]) { --cf-pad: 12px; }
  `,eo,Mt,xt]}};f([S({attribute:!1})],h.prototype,"hass",2),f([S({attribute:!1})],h.prototype,"owners",2),f([S({attribute:!1})],h.prototype,"ownerId",2),f([S({type:Boolean,reflect:!0})],h.prototype,"narrow",2),f([S({attribute:!1})],h.prototype,"haMenu",2),f([S({attribute:!1})],h.prototype,"onHaMenu",2),f([S({attribute:!1})],h.prototype,"onBack",2),f([S({attribute:!1})],h.prototype,"barActions",2),f([S({attribute:!1})],h.prototype,"shellOwnsWatch",2),f([S({attribute:!1})],h.prototype,"barHost",2),f([S({attribute:!1})],h.prototype,"icons",2),f([S({attribute:!1})],h.prototype,"iconsTick",2),f([w()],h.prototype,"watchId",2),f([w()],h.prototype,"record",2),f([w()],h.prototype,"pagesRecord",2),f([w()],h.prototype,"loading",2),f([w()],h.prototype,"loadError",2),f([w()],h.prototype,"history",2),f([w()],h.prototype,"historyState",2),f([w()],h.prototype,"note",2),f([w()],h.prototype,"restoreAsk",2),f([w()],h.prototype,"restoring",2),f([w()],h.prototype,"historyOpen",2),f([w()],h.prototype,"rawOpen",2),f([w()],h.prototype,"rawCopied",2),f([w()],h.prototype,"ownList",2),f([w()],h.prototype,"topMenuOpen",2),f([w()],h.prototype,"watchMenuOpen",2),f([w()],h.prototype,"hostWidth",2),f([w()],h.prototype,"areas",2),f([w()],h.prototype,"areasRead",2),f([w()],h.prototype,"floors",2),f([w()],h.prototype,"sensorHistory",2),f([w()],h.prototype,"sensorHistoryFor",2),f([w()],h.prototype,"unsupported",2);customElements.get("wa-rooms-editor")||customElements.define("wa-rooms-editor",h);export{h as WaRoomsEditor};
