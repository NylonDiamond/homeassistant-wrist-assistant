import{a as Nt,b as Bt,c as zt,d as Wt,e as Ut,f as Qt,g as Gt}from"./chunk-FMEYBIGP.js";import{j as Ft,r as me,v as Kt}from"./chunk-Z6RYOK74.js";import"./chunk-XDMMZFSQ.js";import"./chunk-UDRG2OIJ.js";import{a as le,b as ue,c as St,d as Rt,e as At,f as Tt,g as Et,h as Dt,i as $t,j as Lt,k as Jt}from"./chunk-JQRIRWFV.js";import{b as kt,p as xt,w as Mt}from"./chunk-B7FFX3YM.js";import{a as Ot,b as _t,d as Ht}from"./chunk-QUOL6HJ4.js";import{Lb as bt,Nb as de,Ob as yt,Q as ft,Rb as vt,V as gt,Xa as wt,Zb as V,h as Ye,qd as Vt,rd as jt,sd as qt}from"./chunk-5UIFSWX4.js";import{Ag as Ve,Bg as je,Dg as qe,Eg as Ze,_h as rt,b as F,c,cg as Ke,d as ae,eh as k,f as m,hj as ut,i as Fe,ih as Xe,ii as at,j as R,ji as se,jj as pt,k as w,kh as et,kj as mt,li as st,lj as ht,mh as tt,mi as ce,ni as K,oh as nt,oi as ct,ph as ot,pi as dt,xi as lt,yg as M,zh as it}from"./chunk-RYLMRUWW.js";import"./chunk-WIDK423N.js";import{i as Pt,k as pe,l as P,n as I,o as j,p as It,q as Ct}from"./chunk-Y5WD6GQY.js";import{a as $}from"./chunk-KXSD4G27.js";import{a as f}from"./chunk-LO2NM3CE.js";var Zt={version:1,note:"The panel's own table: edit it here. RoomRulesTableTests in the app repository checks the parts the watch decides against the watch's code.",keys:{sensor:"roomQuickJumpSourceEntityId",fallback:"roomQuickJumpFallbackPageId",mappings:"roomQuickJumpMappings",autoSwitch:"roomAutoSwitchEnabled",legacyQuickJump:"roomQuickJumpEnabled",zones:"pointControlRoomMappingsJSON",topSectionDoubleTap:"topSectionDoubleTapAction",handGesture:"handGestureAction",tapToToggle:"pointControlTapToToggle",liveTile:"pointControlLiveTile"},normalize:{rule:"Lower case; _ and - as spaces; anything but a-z, 0-9 and space as a space; runs of spaces as one, none at either end.",cases:[{input:"Living Room",key:"living room"},{input:"living_room",key:"living room"},{input:"Living-Room",key:"living room"},{input:"  Kitchen  ",key:"kitchen"},{input:"Kids' Room",key:"kids room"},{input:"ROOM__3",key:"room 3"},{input:"Room 2",key:"room 2"},{input:"Office/Study",key:"office study"},{input:"1st floor",key:"1st floor"},{input:"a	b",key:"a b"},{input:"Caf\xE9",key:"caf"},{input:"B\xFCro",key:"b ro"},{input:"\u0130stanbul",key:"i stanbul"},{input:"\u65E5\u672C",key:""},{input:"\uFF2C\uFF49\uFF56\uFF49\uFF4E\uFF47",key:""},{input:"",key:""},{input:"___",key:""},{input:"--",key:""},{input:"kitchen.",key:"kitchen"},{input:"Master Bedroom (Upstairs)",key:"master bedroom upstairs"}]},roomValue:{notRoom:["unknown","unavailable","none","null","on","off","true","false","home","not_home","away"],rule:"Trimmed, not empty, not one of notRoom (compared lower case), not a number as Swift's Double reads one (nan, inf, infinity and hex floats included), and with a letter in it.",source:"The watch reads a person's room from its state only. Any other sensor gives its state, or, when that is not a room, its location_name attribute.",attribute:"location_name",cases:[{input:"Kitchen",room:!0},{input:"living_room",room:!0},{input:"unknown",room:!1},{input:"Unavailable",room:!1},{input:" on ",room:!1},{input:"OFF",room:!1},{input:"home",room:!1},{input:"not_home",room:!1},{input:"Away",room:!1},{input:"none",room:!1},{input:"NULL",room:!1},{input:"true",room:!1},{input:"42",room:!1},{input:"3.5",room:!1},{input:"-1",room:!1},{input:"1e3",room:!1},{input:"1E3",room:!1},{input:"nan",room:!1},{input:"NaN",room:!1},{input:"inf",room:!1},{input:"-Infinity",room:!1},{input:"0x1F",room:!1},{input:"0x1p3",room:!1},{input:"+5",room:!1},{input:".5",room:!1},{input:"",room:!1},{input:"   ",room:!1},{input:"!!",room:!1},{input:"2nd floor",room:!0},{input:"B\xFCro",room:!0},{input:"\u65E5\u672C",room:!0},{input:"e",room:!0},{input:"Home Office",room:!0}]},switching:{keys:["roomQuickJumpSourceEntityId","roomQuickJumpEnabled","roomAutoSwitchEnabled","topSectionDoubleTapAction","handGestureAction"],triggers:[{value:"Automatic",label:"Automatic",help:"Switches when your room sensor detects a new room. Uses more battery."},{value:"Double-Tap Top",label:"Double-tap the page title",help:"Double-tap the page title or top area to switch."},{value:"Double Pinch",label:"Double Pinch",help:"Double pinch gesture to switch rooms"}],absent:{handGestureAction:"Refresh"},rule:"Picking a room sensor writes only roomQuickJumpSourceEntityId. Switch Pages by Room on is Double-Tap Top. When nothing is on, the trigger shown is Double-Tap Top.",cases:[{op:{switch:!0},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{switch:!0},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Next Page"}},{op:{switch:!0},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{switch:!1},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1}},{op:{switch:!1},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{switch:!1},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Refresh"}},{op:{switch:!1},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{switch:!1},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{switch:!1},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}},{op:{trigger:"Automatic"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0}},{op:{trigger:"Automatic"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled"}},{op:{trigger:"Automatic"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,handGestureAction:"Refresh"}},{op:{trigger:"Automatic"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{trigger:"Automatic"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled"}},{op:{trigger:"Automatic"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}},{op:{trigger:"Double-Tap Top"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{trigger:"Double-Tap Top"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Next Page"}},{op:{trigger:"Double-Tap Top"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{trigger:"Double Pinch"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{clearSensor:!0},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1}},{op:{clearSensor:!0},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{clearSensor:!0},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Refresh"}},{op:{clearSensor:!0},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{clearSensor:!0},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{clearSensor:!0},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}}],readCases:[{document:{},on:!1,trigger:"Double-Tap Top"},{document:{topSectionDoubleTapAction:"Room Jump"},on:!0,trigger:"Double-Tap Top"},{document:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},on:!0,trigger:"Double Pinch"},{document:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},on:!1,trigger:"Double-Tap Top"},{document:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},on:!0,trigger:"Double-Tap Top"},{document:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},on:!0,trigger:"Automatic"}]},fallback:{stay:"__stay__",firstAvailable:null,watchFallbackNames:["favorites","nearby","home"],rule:"Stay on current page stores the sentinel; First available page stores no key, and the watch then takes a page whose normalized name is one of watchFallbackNames, else the first page. A page id is a page's id as stored. The pages offered are the listed pages that are neither system nor hidden pages."},mappings:{rule:"roomQuickJumpMappings maps a normalized room name to a page id. A room set to no page has no key, and an empty mapping is no key at all. The watch normalizes every key before it compares, and also takes a key that contains the room or is contained by it."},pointControl:{domains:[{domain:"light",label:"Light"},{domain:"switch",label:"Switch"},{domain:"fan",label:"Fan"},{domain:"cover",label:"Cover"},{domain:"scene",label:"Scene"},{domain:"script",label:"Script"},{domain:"climate",label:"Climate"},{domain:"media_player",label:"Player"},{domain:"lock",label:"Lock"},{domain:"input_boolean",label:"Toggle"}],heading:{min:0,max:359,rule:"Degrees clockwise from north. The watch shows its compass heading, snapped to 5, for the user to type in; the panel takes a typed or dialled whole degree."},newTarget:"A target added in the panel starts at heading 0 with the entity's friendly name from its id as the label.",switches:[{key:"pointControlTapToToggle",label:"Tap to Toggle",onDetail:"Tap immediately toggles the aimed entity",offDetail:"Tap opens the point control overlay",absent:!1},{key:"pointControlLiveTile",label:"Live Point Control Tile",onDetail:"Show live needle and aimed entity on grid tile",offDetail:"Show live needle and aimed entity on grid tile",absent:!1}]},zones:{cleanCases:[{input:{kitchen:[]},output:null},{input:{den:[{entityId:"light.a",centerHeading:0}],kitchen:[]},output:{den:[{entityId:"light.a",centerHeading:0}],kitchen:[]}},{input:{den:[{entityId:" ",centerHeading:0}]},output:null},{input:{den:[{entityId:" ",centerHeading:0},{entityId:"light.a",centerHeading:10}],hall:[{entityId:"",centerHeading:0}]},output:{den:[{entityId:" ",centerHeading:0},{entityId:"light.a",centerHeading:10}]}},{input:{"living room":[{entityId:"light.tv",centerHeading:90,label:"TV"},{entityId:"switch.fan",centerHeading:180}]},output:{"living room":[{entityId:"light.tv",centerHeading:90,label:"TV"},{entityId:"switch.fan",centerHeading:180}]}}],encodeCases:[{rooms:{"living room":[{entityId:"light.tv_backlight",centerHeading:90,label:"TV / Lamp"},{entityId:"switch.fan",centerHeading:272.5}]},parsed:{"living room":[{centerHeading:90,entityId:"light.tv_backlight",label:"TV / Lamp"},{centerHeading:272.5,entityId:"switch.fan"}]},slashEscaped:!0},{rooms:{kitchen:[{entityId:"light.kitchen",centerHeading:0}]},parsed:{kitchen:[{centerHeading:0,entityId:"light.kitchen"}]},slashEscaped:!1},{rooms:{den:[]},parsed:{den:[]},slashEscaped:!1},{rooms:{b\u00FCro:[{entityId:"light.b\xFCro",centerHeading:359,label:'Schreibtisch "neu"'}]},parsed:{b\u00FCro:[{centerHeading:359,entityId:"light.b\xFCro",label:'Schreibtisch "neu"'}]},slashEscaped:!1}],decodeCases:[{json:'{"kitchen":[{"entityId":"light.a","centerHeading":0}],"living room":[{"entityId":"light.b","centerHeading":359.5,"label":"Lamp"}]}',rooms:{kitchen:[{entityId:"light.a",centerHeading:0}],"living room":[{entityId:"light.b",centerHeading:359.5,label:"Lamp"}]}},{json:'{"den":[{"entityId":"light.a","centerHeading":45,"label":"A","extra":1}]}',rooms:{den:[{entityId:"light.a",centerHeading:45,label:"A"}]}},{json:'{"den":[{"entityId":"light.a","centerHeading":45,"label":null}]}',rooms:{den:[{entityId:"light.a",centerHeading:45}]}},{json:'{"den":[]}',rooms:{den:[]}},{json:'{"den":[{"entityId":"light.a"}]}',rooms:{}},{json:'{"den":[{"entityId":"light.a","centerHeading":"45"}]}',rooms:{}},{json:'{"den":[{"entityId":"light.a","centerHeading":45}],"hall":{"entityId":"light.b"}}',rooms:{}},{json:"[]",rooms:{}},{json:"not json",rooms:{}},{json:"",rooms:{}}]}};var S=Zt,u=S.keys,L=S.fallback.stay,A="Room Jump",O=S.switching.absent.handGestureAction??"Refresh",E="Room Jump",J="Disabled",he=S.pointControl.domains.map(e=>e.domain);function y(e){return e.toLowerCase().replace(/[_-]/g," ").replace(/[^a-z0-9 ]/g," ").split(" ").filter(o=>o!=="").join(" ")}var jn=/^[+-]?(?:nan|inf|infinity|(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|0x(?:[0-9a-f]+\.?[0-9a-f]*|\.[0-9a-f]+)(?:p[+-]?\d+)?)$/,qn=new Set(S.roomValue.notRoom);function C(e){let o=e.trim();if(o==="")return!1;let t=o.toLowerCase();return qn.has(t)||jn.test(t)?!1:/[\p{L}\p{M}]/u.test(t)}function fe(e,o){if(o===void 0)return;let t=typeof o.state=="string"?o.state.trim():"";if(e.startsWith("person."))return C(t)?t:void 0;if(C(t))return t;let n=o.attributes?.[S.roomValue.attribute];if(typeof n=="string"&&C(n))return n.trim()}function Yt(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Zn(e){if(!Yt(e))return;let{entityId:o,centerHeading:t,label:n}=e;if(!(typeof o!="string"||typeof t!="number"||!Number.isFinite(t))&&!(n!=null&&typeof n!="string"))return typeof n=="string"?{entityId:o,centerHeading:t,label:n}:{entityId:o,centerHeading:t}}function _(e){if(e==null||e==="")return{ok:!0,rooms:[]};if(typeof e!="string")return{ok:!1};let o;try{o=JSON.parse(e)}catch{return{ok:!1}}if(!Yt(o))return{ok:!1};let t=[];for(let[n,i]of Object.entries(o)){if(!Array.isArray(i))return{ok:!1};let r=[];for(let s of i){let a=Zn(s);if(a===void 0)return{ok:!1};r.push(a)}t.push([n,r])}return{ok:!0,rooms:t}}function q(e){let o=e.filter(([,t])=>t.length===0||t.some(n=>n.entityId.trim()!==""));if(!(o.length===0||o.every(([,t])=>t.length===0)))return o}function Z(e){let o={};for(let[t,n]of e)o[t]=n.map(i=>i.label===void 0?{entityId:i.entityId,centerHeading:i.centerHeading}:{entityId:i.entityId,centerHeading:i.centerHeading,label:i.label});return JSON.stringify(o).replace(/\//g,"\\/")}function ge(e,o){if(e.length!==o.length)return!1;let t=new Map(o);return t.size!==o.length?!1:e.every(([n,i])=>{let r=t.get(n);return r!==void 0&&r.length===i.length&&i.every((s,a)=>s.entityId===r[a].entityId&&s.centerHeading===r[a].centerHeading&&s.label===r[a].label)})}function N(e){return Number.isFinite(e)?(Math.round(e)%360+360)%360:0}function Y(e){return["N","NE","E","SE","S","SW","W","NW"][Math.floor(((e+22.5)%360+360)%360/45)%8]}function we(e){let o=e.indexOf(".");return o<0?e:e.slice(o+1).split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function Xt(e){return e.split(" ").filter(o=>o!=="").map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" ")}function T(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function z(e,o){if(e===o)return!0;if(Array.isArray(e)||Array.isArray(o))return!Array.isArray(e)||!Array.isArray(o)||e.length!==o.length?!1:e.every((t,n)=>z(t,o[n]));if(T(e)&&T(o)){let t=Object.keys(e);return t.length!==Object.keys(o).length?!1:t.every(n=>Object.hasOwn(o,n)&&z(e[n],o[n]))}return!1}var en=new Map(S.pointControl.switches.map(e=>[e.key,e.absent]));function nn(e,o,t){return Object.hasOwn(e,o)?t!==void 0&&z(e[o],t):t===void 0||en.has(o)&&en.get(o)===t}function ye(e,o){let t=structuredClone(e);for(let[n,i]of o)i===void 0?delete t[n]:t[n]=structuredClone(i);return t}function ve(e,o,t){let n=new Map(o);for(let[i,r]of t)nn(e,i,r)?n.delete(i):n.set(i,r);return n}function W(e,o){return e===void 0?[]:[...o.entries()].filter(([t,n])=>!nn(e,t,n)).map(([t])=>t)}function tn(e,o,t){let n=new Map(t);for(let i of new Set([...e.keys(),...o.keys()])){let r=e.get(i),s=o.get(i);z(r,s)||(s===void 0?n.delete(i):n.set(i,s))}return n}function be(e){return new Map(T(e)?Object.entries(e):[])}function ke(e,o,t){let n=new Map(t);for(let[i,r]of t)if(!z(e[i],o[i])){if(i===u.mappings){let s=tn(be(e[i]),be(r),be(o[i]));n.set(i,s.size===0?void 0:Object.fromEntries(s))}else if(i===u.zones){let s=_(e[i]),a=_(r),l=_(o[i]);if(!s.ok||!a.ok||!l.ok)continue;let d=q([...tn(new Map(s.rooms),new Map(a.rooms),new Map(l.rooms))]);d===void 0?n.set(i,void 0):n.set(i,ge(d,l.rooms)?o[i]:Z(d))}else if(i===u.topSectionDoubleTap||i===u.handGesture){let s=i===u.topSectionDoubleTap?E:A;e[i]===s&&r!==s&&o[i]!==s&&n.delete(i)}}return n}function B(e,o){let t=e[o];return typeof t=="string"?t:void 0}function X(e,o){let t=e[o];return typeof t=="boolean"?t:void 0}function U(e){let o={},t=B(e,u.sensor);t!==void 0&&(o.roomQuickJumpSourceEntityId=t);let n=X(e,u.legacyQuickJump);n!==void 0&&(o.roomQuickJumpEnabled=n);let i=X(e,u.autoSwitch);i!==void 0&&(o.roomAutoSwitchEnabled=i);let r=B(e,u.topSectionDoubleTap);r!==void 0&&(o.topSectionDoubleTapAction=r);let s=B(e,u.handGesture);return s!==void 0&&(o.handGestureAction=s),o}function Yn(e){let o=U(e),t=o.topSectionDoubleTapAction===E||(o.roomQuickJumpEnabled??!1),n=(o.handGestureAction??O)===A;return t||(o.roomAutoSwitchEnabled??!1)||n}function Xn(e){let o=U(e);return o.roomAutoSwitchEnabled??!1?"Automatic":(o.handGestureAction??O)===A?"Double Pinch":"Double-Tap Top"}function ee(e){let o={},t=e[u.mappings];if(T(t))for(let[i,r]of Object.entries(t))typeof r=="string"&&(o[i]=r);let n=i=>X(e,i)??S.pointControl.switches.find(r=>r.key===i)?.absent??!1;return{sensor:(B(e,u.sensor)??"").trim(),switching:Yn(e),trigger:Xn(e),fallback:(B(e,u.fallback)??"").trim(),mappings:o,zones:_(e[u.zones]),tapToToggle:n(u.tapToToggle),liveTile:n(u.liveTile)}}function xe(e,o){let t=new Map;for(let n of S.switching.keys)e[n]!==o[n]&&t.set(n,o[n]);return t}function eo(e){delete e.roomQuickJumpSourceEntityId,e.roomQuickJumpEnabled=!1,e.roomAutoSwitchEnabled=!1,e.handGestureAction===A&&(e.handGestureAction=O),e.topSectionDoubleTapAction===E&&(e.topSectionDoubleTapAction=J)}function on(e,o){let t=o.trim();return t!==""?new Map([[u.sensor,t]]):to(e)}function to(e){let o=U(e),t={...o};return eo(t),xe(o,t)}function rn(e,o){let t=U(e),n={...t};return o?(n.topSectionDoubleTapAction=E,n.roomQuickJumpEnabled=!1,n.roomAutoSwitchEnabled=!1,n.handGestureAction===A&&(n.handGestureAction=O)):(n.roomQuickJumpEnabled=!1,n.roomAutoSwitchEnabled=!1,n.handGestureAction===A&&(n.handGestureAction=O),n.topSectionDoubleTapAction===E&&(n.topSectionDoubleTapAction=J)),xe(t,n)}function Se(e,o){let t=U(e),n={...t};switch(o){case"Automatic":n.roomAutoSwitchEnabled=!0,n.roomQuickJumpEnabled=!1,n.handGestureAction===A&&(n.handGestureAction=O),n.topSectionDoubleTapAction===E&&(n.topSectionDoubleTapAction=J);break;case"Double-Tap Top":n.roomAutoSwitchEnabled=!1,n.roomQuickJumpEnabled=!1,n.topSectionDoubleTapAction=E,n.handGestureAction===A&&(n.handGestureAction=O);break;case"Double Pinch":n.roomAutoSwitchEnabled=!1,n.roomQuickJumpEnabled=!1,n.topSectionDoubleTapAction===E&&(n.topSectionDoubleTapAction=J),n.handGestureAction=A;break}return xe(t,n)}function an(e){let o=e.trim();return new Map([[u.fallback,o===""?void 0:o]])}function sn(e,o){return new Map([[e,o]])}function H(e,o){let t=e.mappings[o];if(t!==void 0)return t.trim();for(let[n,i]of Object.entries(e.mappings))if(y(n)===o)return i.trim();return""}function Re(e,o,t){let n=e[u.mappings],i=T(n)?structuredClone(n):{};for(let s of Object.keys(i))y(s)===o&&delete i[s];let r=t.trim();return r!==""&&(i[o]=r),new Map([[u.mappings,Object.keys(i).length===0?void 0:i]])}function te(e,o){return e.filter(([t])=>y(t)===o).flatMap(([,t])=>t)}function Ae(e,o,t){let n=_(e[u.zones]);if(!n.ok)return;let i=[],r=!1;for(let[a,l]of n.rooms)y(a)!==o?i.push([a,l]):r||(i.push([o,t]),r=!0);r||i.push([o,t]);let s=q(i);return s===void 0?new Map([[u.zones,void 0]]):ge(s,n.rooms)?new Map:new Map([[u.zones,Z(s)]])}function cn(e,o){let t=new Map,n=ee(e);if(H(n,o)!==""||Object.keys(n.mappings).some(r=>y(r)===o))for(let[r,s]of Re(e,o,""))t.set(r,s);let i=_(e[u.zones]);if(i.ok&&i.rooms.some(([r])=>y(r)===o)){let r=q(i.rooms.filter(([s])=>y(s)!==o));t.set(u.zones,r===void 0?void 0:Z(r))}return t}function Te(e,o,t){return o.lastSeen!==void 0||H(e,o.key)!==""||Object.keys(e.mappings).some(n=>y(n)===o.key)||e.zones.ok&&e.zones.rooms.some(([n])=>y(n)===o.key)?!0:t.some(n=>y(n)===o.key)}function dn(e){return P(e).filter(o=>!Ct(o)&&!It(o)&&I(o)!=="").map(o=>({id:I(o),name:j(o)}))}function ne(e,o){let t=o.trim().toLowerCase();return t===""?void 0:e.find(n=>n.id.toLowerCase()===t)}function ln(e){let o=new Map,t=new Map;for(let a of e.history??[]){if(!C(a.state))continue;let l=y(a.state.trim());if(l==="")continue;let d=t.get(l);(d===void 0||a.at>d.at)&&t.set(l,{at:a.at,state:a.state.trim()})}let n=(a,l,d)=>{let p=y(a);if(p===""||o.has(p))return;let v=t.get(p)?.at;o.set(p,{key:p,name:d??Xt(p),area:l,...v===void 0?{}:{lastSeen:v}})};for(let a of e.areas??[])for(let l of[a.name,...a.aliases??[]]){let d=typeof l=="string"?l.trim():"";d!==""&&n(d,!0,d)}for(let a of e.mappingKeys??[])n(a,!1);for(let a of e.zoneKeys??[])n(a,!1);for(let[a,l]of t)o.has(a)||n(a,!1,l.state);for(let a of e.added??[])n(a,!1,a.trim());let i=[...o.values()],r=i.filter(a=>a.lastSeen!==void 0).sort((a,l)=>l.lastSeen-a.lastSeen),s=i.filter(a=>a.lastSeen===void 0).sort((a,l)=>a.name.localeCompare(l.name,void 0,{sensitivity:"base"}));return[...r,...s]}function un(e){if(!Array.isArray(e))return[];let o=[];for(let t of e){if(!T(t)||typeof t.name!="string")continue;let n=Array.isArray(t.aliases)?t.aliases.filter(i=>typeof i=="string"):[];o.push({name:t.name,aliases:n})}return o}function pn(e,o){if(!T(e))return[];let t=e[o];if(!Array.isArray(t))return[];let n=[];for(let i of t){if(!T(i))continue;let r=typeof i.s=="string"?i.s:typeof i.state=="string"?i.state:void 0;if(r===void 0)continue;let s,a=typeof i.lc=="number"?i.lc:typeof i.lu=="number"?i.lu:void 0;if(a!==void 0)s=a*1e3;else{let l=typeof i.last_changed=="string"?i.last_changed:typeof i.last_updated=="string"?i.last_updated:void 0,d=l===void 0?NaN:Date.parse(l);Number.isNaN(d)||(s=d)}n.push({state:r,at:s??0})}return n}var mn=24,no=64*1024;function Ee(e,o="behavior"){return{size:new TextEncoder().encode(JSON.stringify(e)).length,limit:o==="rooms"?no:Pt}}var oo=3;async function hn(e,o,t){let n=o,i;for(let r=1;;r++){if(r>1&&W(n.document,t).length===0)return{ok:!0,revision:n.revision,document:n.document,merged:!0,alreadySaved:!0,...i?{fresh:i}:{}};let s=ye(n.document,t);try{let{revision:a}=await e.save(n.revision,s);return{ok:!0,revision:a,document:s,merged:r>1,alreadySaved:!1,...i?{fresh:i}:{}}}catch(a){let{code:l="unknown",message:d}=$(a);if(l!=="conflict"||r>=oo)return{ok:!1,code:l,message:d,...i?{fresh:i}:{}};try{i=await e.fetch()}catch(p){let v=$(p);return{ok:!1,code:v.code??"unknown",message:v.message}}if(!(i.revision>0)||!T(i.document))return{ok:!1,code:"no_record",message:"Home Assistant holds no settings for this watch.",fresh:i};t=ke(n.document,i.document,t),n={revision:i.revision,document:i.document}}}}function De(e){return e!==void 0&&e.revision>0&&T(e.document)?e.document:void 0}var fn="No watch settings from this watch yet.",gn=`Rooms are part of the watch's settings. ${K}`,wn="Home Assistant holds settings for this watch that this panel cannot read. Update the integration.",bn="The point control targets stored for this watch cannot be read, so they are shown as none and left as they are. Update the integration to change them here.",$e={stay:"Stay on current page",first:"First available page"};function yn(e,o="behavior"){let t=o==="rooms";if(e.ok)return e.alreadySaved?{kind:"ok",text:`Nothing left to save. The ${t?"rooms":"settings"} already had these changes, as revision ${e.revision}.`}:e.merged?{kind:"ok",text:t?"Saved. Room changes made elsewhere meanwhile were kept.":"Saved. Settings changed elsewhere meanwhile were kept."}:void 0;let n=e.message.trim();switch(e.code){case"conflict":return{kind:"warn",text:`Not saved. ${t?"This home's rooms":"The watch's settings"} kept changing elsewhere while saving. Your edits are kept, so try Save again in a moment.`};case"no_record":return{kind:"warn",text:t?"Not saved. Home Assistant no longer holds rooms for this home.":"Not saved. Home Assistant no longer holds settings for this watch."};case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:`Not saved. Home Assistant could not store the ${t?"rooms":"settings"} just now. Your edits are kept, so try again in a moment.`};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function vn(e){return e===""?"first":e===L?"stay":"page"}function kn(e){return st(e)?"rooms":"behavior"}var io=1,Xo=[u.legacyQuickJump,u.sensor,u.fallback,u.mappings,u.autoSwitch,u.zones],ro=[u.topSectionDoubleTap,u.handGesture,u.tapToToggle,u.liveTile];function Oe(e){return new Map([...e].filter(([o])=>!ro.includes(o)))}function _e(e){return X(e,u.autoSwitch)??!1}function xn(e,o){return Oe(o?Se(e,"Automatic"):new Map([[u.autoSwitch,!1]]))}function Sn(){return{schemaVersion:io}}function Rn(e){let o=$(e).code;return o==="invalid"||o==="unknown_command"}var An="The double-tap on the page title, the double pinch and the point control switches come from this watch's main home.",Tn="No rooms for this home yet.",En="Update the integration to edit this home's rooms here.",Dn="Home Assistant holds rooms for this home that this panel cannot read. Update the integration.",$n="Switch automatically";var ao=100,oe=class{constructor(o,t){this.edits=new Map;this.undoStack=[];this.redoStack=[];this.saving=!1;this.document=o,this.revision=t}get effective(){return ye(this.document,this.edits)}get pending(){return this.edits}get dirty(){return W(this.document,this.edits).length>0}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}apply(o,t){if(this.saving)return!1;let n=ve(this.document,this.edits,o);return so(n,this.edits)?!1:((t===void 0||t!==this.coalesceKey)&&(this.undoStack.push(new Map(this.edits)),this.undoStack.length>ao&&this.undoStack.shift()),this.coalesceKey=t,this.redoStack=[],this.edits=n,!0)}endCoalesce(){this.coalesceKey=void 0}undo(){if(this.saving)return!1;let o=this.undoStack.pop();return o===void 0?!1:(this.redoStack.push(this.edits),this.edits=o,this.coalesceKey=void 0,!0)}redo(){if(this.saving)return!1;let o=this.redoStack.pop();return o===void 0?!1:(this.undoStack.push(this.edits),this.edits=o,this.coalesceKey=void 0,!0)}discard(){return this.edits.size===0||this.saving?!1:(this.undoStack.push(this.edits),this.redoStack=[],this.edits=new Map,this.coalesceKey=void 0,!0)}rebase(o,t){let n=ke(this.document,o,this.edits);return this.document=o,this.revision=t,this.edits=ve(o,new Map,n),this.undoStack=[],this.redoStack=[],this.coalesceKey=void 0,this.edits.size>0}};function so(e,o){if(e.size!==o.size)return!1;for(let[t,n]of e)if(!o.has(t)||JSON.stringify(n)!==JSON.stringify(o.get(t)))return!1;return!0}var D=new Map;function ie(e){return D.get(e)}function On(e){D.delete(e)}function He(e,o,t){let n=D.get(e);if(n===void 0){let s=new oe(o,t);return D.set(e,s),{draft:s,mergedIntoEdits:!1}}if(n.saving||t===n.revision)return{draft:n,mergedIntoEdits:!1};let i=n.dirty,r=n.rebase(o,t);return{draft:n,mergedIntoEdits:i&&r}}function Me(e,o){let t=D.get(e);if(t===void 0){let n=new oe(o,0);return D.set(e,n),n}return t.revision>0&&!t.saving&&t.rebase(o,0),t}function Pe(){for(let e of D.values())if(e.dirty)return!0;return!1}function _n(){for(let[e,o]of D)o.saving||D.delete(e)}async function Hn(e,o){if(e.saving)return{ok:!1,code:"busy",message:"A save is running."};let t=new Map(e.pending);e.saving=!0;let n=hn(o,{revision:e.revision,document:e.document},t);e.saveDone=n;try{let i=await n;if(e.saving=!1,i.ok)e.rebase(i.document,i.revision);else if(i.fresh!==void 0&&i.fresh.revision>0){let r=i.fresh.document;r!==void 0&&typeof r=="object"&&!Array.isArray(r)&&e.rebase(r,i.fresh.revision)}return i}finally{e.saving=!1}}var Ie="var(--wa-hue-pink)",Ce={width:208,height:248};function Pn(e,o){let t=e.states[o]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:o}function Le(e,o){let t=o.indexOf(".");return{entityId:o,displayName:o===""?"":Pn(e,o),domain:t<0?"":o.slice(0,t)}}function Je(e,o){return o.some(t=>e.dirty.has(t))}function Ne(e){return e?c`<span class="sec-dot" title="Changed, not saved yet" aria-label="Changed"></span>`:m}function co(e,o){if(o==="")return{line:"No room sensor. The watch guesses the room from its sensors, which works best with a Bermuda area sensor.",tone:"none"};let t=e.states[o];if(t===void 0)return{line:"Home Assistant has no entity with this id now.",tone:"warn"};let n=fe(o,t),i=typeof t.state=="string"?t.state:"";if(n===void 0)return{line:`Now "${i}", which the watch does not read as a room.`,tone:"warn"};let r=y(n);return{line:`Now in ${n}${r===""?", whose name has no letter or digit the watch can match":""}.`,tone:r===""?"warn":"ok"}}function lo(e,o){if(o==="")return"";let t=fe(o,e.states[o]);return t===void 0?"":y(t)}var uo="https://github.com/agittins/bermuda",po="Works best with a Bermuda area sensor.";function mo(e){let o=e.indexOf("Bermuda");return o<0?e:c`${e.slice(0,o)}<a href=${uo} target="_blank" rel="noopener noreferrer">Bermuda</a>${e.slice(o+7)}`}function In(e,o,t){let n=[...t,...e.map(i=>[i.id,i.name])];return o!==""&&!t.some(([i])=>i===o)&&ne(e,o)===void 0&&n.push([o,"A page not on this watch"]),n}function Cn(e,o){return ne(e,o)?.id??o}function Be(e,o){return o===""?"":ne(e.pages,o)?.name??"A page not on this watch"}function Ln(e,o){let t=o.trim().toLowerCase();if(t!=="")return P(e.pagesDocument).find(n=>I(n).toLowerCase()===t)}function Jn(e){return e.rooms.filter(o=>Te(e.view,o,e.added??[]))}function ho(e){return e.rooms.filter(o=>o.area&&!Te(e.view,o,e.added??[]))}function fo(e,o){let t=e.uiState.get("pick");return o.find(n=>n.key===t)??o[0]}function Nn(e,o){e.uiState.set("pick",o),e.requestUpdate()}function go(e){return e===0?"nothing to point at":e===1?"1 thing to point at":`${e} things to point at`}function wo(e,o){let t=Be(e,H(e.view,o.key)),n=e.view.zones.ok?te(e.view.zones.rooms,o.key).length:0;return`${t===""?"No page yet":`Opens ${t}`} \xB7 ${go(n)}`}function bo(e,o,t,n){return c`<li>
    <button type="button" class="rm-room ${t?"on":""}" aria-pressed=${t?"true":"false"} @click=${()=>Nn(e,o.key)}>
      <span class="rm-chip" aria-hidden="true">${k("home")}</span>
      <span class="rm-room-text">
        <span class="rm-room-top"><b class="rm-room-name">${o.name}</b>${n?c`<span class="rm-here"><i aria-hidden="true"></i>You are here</span>`:m}</span>
        <span class="rm-room-sub">${wo(e,o)}</span>
      </span>
    </button>
  </li>`}function Bn(e,o){let t=y(o);t!==""&&(e.addRoom(o.trim()),Nn(e,t))}function yo(e){let o=String(e.uiState.get("addRoom")??""),t=y(o),n=Jn(e),i=t!==""&&n.some(s=>s.key===t),r=()=>{t===""||i||(e.uiState.set("addRoom",""),Bn(e,o))};return c`<div class="rm-add-room">
    <input type="text" placeholder="Add a room by name" aria-label="Room name" .value=${o}
      @input=${s=>{e.uiState.set("addRoom",s.target.value),e.requestUpdate()}}
      @keydown=${s=>{s.key==="Enter"&&(s.preventDefault(),r())}} />
    <button type="button" class="lc-btn rm-add" ?disabled=${t===""||i} @click=${r}>${k("plus")}<span>Add</span></button>
  </div>
  ${o.trim()!==""&&t===""?c`<p class="rm-help warn">The watch matches room names by their letters a to z and digits, and this name has none.</p>`:m}
  ${i?c`<p class="rm-help">That room is in the list.</p>`:m}`}function vo(e,o,t){let n=lo(e.hass,e.view.sensor),i=ho(e);return c`<section class="card lc rm-rooms-card" aria-label="Your rooms" style=${`--c: ${Ie}`}>
    <div class="lc-head">
      <span class="swatch">${k("home")}</span><span class="lc-title">Your rooms</span>
      <span class="lc-sub">${o.length}</span>${Ne(Je(e,[u.mappings,u.zones]))}
    </div>
    <div class="rm-rooms-body">
      ${o.length===0?c`<div class="rm-none">
            <b>${e.roomsState==="loading"?"Reading your rooms":"No rooms yet"}</b>
            <span>${e.roomsState==="loading"?"The areas and what the room sensor reported.":i.length>0?"Pick an area below, or type a name.":"Type a room's name below."}</span>
          </div>`:c`<ul class="rm-rooms" aria-label="Rooms">${o.map(r=>bo(e,r,r.key===t?.key,r.key===n))}</ul>`}
      ${yo(e)}
      ${i.length>0?c`<div class="rm-areas">
        <span class="rm-areas-l">From your Home Assistant areas</span>
        ${i.map(r=>c`<button type="button" class="rm-area" title=${`Add ${r.name} to your rooms`} @click=${()=>Bn(e,r.name)}>+ ${r.name}</button>`)}
      </div>`:m}
    </div>
  </section>`}var zn=1.15,Mn=.2;function Wn(e,o){return Math.round((e.screen??Ce).height*o*100)/100}function ko(e,o){let t=e.screen??Ce,n=e.narrow===!0?1:zn,i=Ln(e,o);if(i!==void 0)return me({page:i,pages:P(e.pagesDocument),screen:t,states:e.hass.states,...e.icons?{icons:e.icons}:{},scale:n,...e.home===!0?{}:{behavior:e.document}});let r=Be(e,o);return Lt(t,n,c`<div class="wp-screen rm-screen"
    style=${`width:${t.width*n}px;height:${t.height*n}px;background:${Ft({},n,t)}`}>
    <span>${r===""?"No page yet":r}</span>
  </div>`,r===""?"Watch":`Watch showing ${r}`)}function xo(e,o){if(!e.view.zones.ok)return c`<span class="rm-step-none">Cannot be read</span>`;let t=te(e.view.zones.rooms,o.key);return t.length===0?c`<span class="rm-step-none">Nothing yet</span>`:c`<ul class="rm-points">${t.map(n=>c`<li>
    <span class="rm-point-chip" aria-hidden="true">${k("tap")}</span>
    <span class="rm-point-name">${n.label??Pn(e.hass,n.entityId)}</span>
    <span class="rm-point-dir">${Math.round(n.centerHeading)}° ${Y(n.centerHeading)}</span>
  </li>`)}</ul>`}function So(e,o){if(o===void 0)return c`<div class="card canvas-card lit rm-canvas" aria-label="Rooms">
      <div class="stage-area rm-stage-area rm-empty">
        <div class="rm-empty-watch" aria-hidden="true">${k("home")}</div>
        <div class="rm-empty-text">
          <b>Your watch can follow you around the house</b>
          <span>Add a room and give it a page. When you walk in, the watch opens that page. Point the watch at a lamp to control it.</span>
        </div>
        <ol class="rm-steps">
          <li><b>1</b>Add a room</li>
          <li><b>2</b>Pick its page</li>
          <li><b>3</b>Pick a room sensor</li>
        </ol>
      </div>
    </div>`;let t=H(e.view,o.key),n=Be(e,t),i=e.home===!0?_e(e.document):e.view.switching;return c`<div class="card canvas-card lit rm-canvas" aria-label=${`What the watch does in ${o.name}`}>
    <div class="rm-stage-head">
      <b class="rm-stage-title">${o.name}</b>
      <span class="rm-stage-sub">What the watch does when you walk in</span>
    </div>
    <div class="stage-area rm-stage-area">
      <div class="rm-flow">
        <div class="rm-flow-side rm-flow-in">
          <div class="rm-step">
            <span class="rm-step-l">1 · Sensor says</span>
            <code class="rm-key" title="The room sensor's state that names this room. The watch matches its letters and digits.">${o.key}</code>
          </div>
          <div class="rm-step">
            <span class="rm-step-l">2 · Watch opens</span>
            <span class="rm-step-v ${n===""?"none":""}">${n===""?"No page yet":n}</span>
            ${i?m:c`<span class="rm-step-note">${e.home===!0?"Switch automatically is off":"Switch pages by room is off"}</span>`}
          </div>
          <span class="rm-wire" aria-hidden="true"><i></i></span>
        </div>
        <div class="rm-stage-body" style=${`--rm-screen-h: ${Wn(e,e.narrow===!0?1:zn)}px`}>${ko(e,t)}</div>
        <div class="rm-flow-side rm-flow-out">
          <span class="rm-wire" aria-hidden="true"><i></i></span>
          <div class="rm-step">
            <span class="rm-step-l">3 · Point at</span>
            ${xo(e,o)}
          </div>
        </div>
      </div>
    </div>
  </div>`}function Ro(e,o,t,n){let i=Math.atan2(e-t,n-o)*180/Math.PI;return N(i)}function Ao(e,o,t,n,i){let r=o[t].centerHeading,s=26,a=32,l=(g,b)=>{let x=g*Math.PI/180;return{x:a+Math.sin(x)*b,y:a-Math.cos(x)*b}},d=l(r,s-3),p=g=>{if(e.busy||g.button!==0)return;let b=g.currentTarget,x=b.getBoundingClientRect(),Qe=x.width/64,re=Ge=>n(Ro((Ge.clientX-x.left)/Qe,(Ge.clientY-x.top)/Qe,a,a),i);re(g),b.setPointerCapture?.(g.pointerId);let G=()=>{b.removeEventListener("pointermove",re),b.removeEventListener("pointerup",G),b.removeEventListener("pointercancel",G),e.endCoalesce()};b.addEventListener("pointermove",re),b.addEventListener("pointerup",G),b.addEventListener("pointercancel",G)},v=g=>{let b=g.shiftKey?15:1;if(g.key==="ArrowRight"||g.key==="ArrowUp")n(N(r+b),i);else if(g.key==="ArrowLeft"||g.key==="ArrowDown")n(N(r-b),i);else return;g.preventDefault()};return c`<svg class="rm-dial" viewBox="0 0 64 64" role="slider" tabindex="0" aria-label="Heading"
    aria-valuemin="0" aria-valuemax="359" aria-valuenow=${Math.round(r)} aria-valuetext=${`${Math.round(r)} degrees, ${Y(r)}`}
    @pointerdown=${p} @keydown=${v} @blur=${()=>e.endCoalesce()}>
    <circle class="rm-dial-face" cx=${a} cy=${a} r=${s}></circle>
    ${[0,90,180,270].map(g=>{let b=l(g,s-1),x=l(g,s-5);return ae`<line class="rm-dial-tick" x1=${b.x} y1=${b.y} x2=${x.x} y2=${x.y}></line>`})}
    <text class="rm-dial-n" x=${a} y="13">N</text>
    ${o.map((g,b)=>{if(b===t)return m;let x=l(g.centerHeading,s-3);return ae`<circle class="rm-dial-other" cx=${x.x} cy=${x.y} r="2"></circle>`})}
    <line class="rm-dial-needle" x1=${a} y1=${a} x2=${d.x} y2=${d.y}></line>
    <circle class="rm-dial-tip" cx=${d.x} cy=${d.y} r="3.2"></circle>
    <circle class="rm-dial-hub" cx=${a} cy=${a} r="2.2"></circle>
  </svg>`}function To(e,o,t,n){let i=t[n],r=(l,d)=>{if(e.busy)return;let p=t.flatMap((g,b)=>{if(b!==n)return[g];let x=l(g);return x===void 0?[]:[x]}),v=Ae(e.document,o,p);v!==void 0&&e.write(v,d)},s=(l,d)=>r(p=>({...p,centerHeading:N(l)}),d),a=`target:${o}:${n}`;return c`<div class="rm-target">
    ${Ao(e,t,n,s,`${a}:heading`)}
    <div class="rm-target-fields">
      <div class="rm-stack">${V({hass:e.hass},"Entity",Le(e.hass,i.entityId),l=>{let d=l.entityId.trim();d===""||d===i.entityId||r(p=>({...p,entityId:d}))},`rooms:${a}:entity`,{domain:he,clearable:!1})}</div>
      <label class="field num rm-heading">
        <span>Heading</span>
        <span class="rm-heading-box">
          <input type="number" min="0" max="359" step="1" .value=${String(Math.round(i.centerHeading))} ?disabled=${e.busy}
            aria-label="Heading in degrees"
            @change=${l=>{let d=l.target,p=Number(d.value);if(d.value.trim()===""||Number.isNaN(p)){d.value=String(Math.round(i.centerHeading));return}s(p,`${a}:typed`),e.endCoalesce()}} />
          <span class="rm-compass">° ${Y(i.centerHeading)}</span>
        </span>
      </label>
      ${bt("Label",i.label??"",l=>r(d=>{let p={entityId:d.entityId,centerHeading:d.centerHeading};return l!==""&&(p.label=l),p},`${a}:label`),{placeholder:we(i.entityId)})}
    </div>
    <button type="button" class="rm-remove" title="Remove this target" aria-label="Remove this target" ?disabled=${e.busy}
      @click=${()=>r(()=>{})}>${k("close")}</button>
  </div>`}var Eo="To read a heading, stand where you point from, face the target and open Heading on the watch (in Connection Health, or on the point control of a room with no targets). Type the number it shows.";function Do(e,o){let{view:t}=e,n=e.uiState.get(`adding:${o.key}`)===!0,i=a=>c`<div class="rm-sub-h">
    <span>Things to point at</span>
    ${t.zones.ok?c`<button type="button" class="lc-btn rm-add-thing" ?disabled=${e.busy} aria-expanded=${n?"true":"false"}
      @click=${()=>{e.uiState.set(`adding:${o.key}`,!n),e.requestUpdate()}}>${n&&a>0?"Done":"+ Add a thing"}</button>`:m}
  </div>`;if(!t.zones.ok)return c`${i(0)}<p class="rm-help warn">${bn}</p>`;let r=te(t.zones.rooms,o.key),s=`rooms:target-add:${o.key}`;return c`${i(r.length)}
    ${r.length===0&&!n?c`<p class="rm-help">None yet. Add a lamp or a switch you point the watch at in this room.</p>`:m}
    ${r.map((a,l)=>To(e,o.key,r,l))}
    ${n?c`<div class="rm-stack rm-add-target">${V({hass:e.hass},"Add a thing",Le(e.hass,""),a=>{let l=a.entityId.trim();if(l===""||e.busy||r.some(p=>p.entityId===l))return;let d=Ae(e.document,o.key,[...r,{entityId:l,centerHeading:0,label:we(l)}]);d!==void 0&&e.write(d),e.uiState.set(`adding:${o.key}`,!1)},s,{domain:he,clearable:!1})}</div>`:m}
    ${r.length>0?c`<p class="rm-help" title=${Eo}>Heading is degrees clockwise from north. Drag the dial or type it.</p>`:m}`}function $o(e,o){let t=Ln(e,o);if(t===void 0)return m;let n=e.screen??Ce;return c`<span class="rm-thumb" aria-hidden="true" title=${j(t)} style=${`--rm-screen-h: ${Wn(e,Mn)}px`}>${me({page:t,pages:[t],screen:n,states:e.hass.states,...e.icons?{icons:e.icons}:{},scale:Mn})}</span>`}function Oo(e,o){let t=H(e.view,o.key),n=Cn(e.pages,t),i=()=>{if(e.busy)return;let r=cn(e.document,o.key);e.forgetRoom?.(o.key),r.size>0&&e.write(r),e.requestUpdate()};return c`<section class="sec rm-card rm-room-card" data-open="true" aria-label=${o.name} style=${`--c: ${Ie}`}>
    <div class="sec-h pinned">
      <span class="swatch">${k("home")}</span>
      <span class="tt"><h4>${o.name}${Ne(Je(e,[u.mappings,u.zones]))}</h4></span>
      <button type="button" class="rm-danger" ?disabled=${e.busy}
        title="Take this room off: its page and its things to point at go. Undo brings them back." @click=${i}>Remove</button>
    </div>
    <div class="sec-b">
      ${o.key!==o.name.toLowerCase()?c`<p class="rm-help">The sensor has to say <code>${o.key}</code>, in any case or spacing.</p>`:m}
      <div class="rm-page-pick">
        ${$o(e,t)}
        <div class="rm-stack">${de("Page to open",n,In(e.pages,n,[["","None"]]),r=>{e.busy||e.write(Re(e.document,o.key,r))},{snapBack:!0})}</div>
      </div>
      ${Do(e,o)}
    </div>
  </section>`}function ze(e,o,t,n){return c`<div class="rm-switch">${vt(e,o,n)}<p class="rm-help">${t}</p></div>`}function _o(e){let{view:o}=e,t=o.sensor===""?void 0:co(e.hass,o.sensor);return c`<div class="rm-stack" title=${o.sensor===""?"":"Clearing the sensor turns Switch pages by room off."}>${V({hass:e.hass},"Room sensor",Le(e.hass,o.sensor),n=>{e.busy||e.write(on(e.document,n.entityId))},"rooms:sensor",{clearable:!0})}</div>
    ${t?c`<div class="rm-reading"><i class="rm-dot ${t.tone}" aria-hidden="true"></i><span>${t.line}</span></div>`:m}
    <p class="rm-help">${mo(po)}</p>`}function Un(e){let o=vn(e.view.fallback),t=o==="first"?"":o==="stay"?L:Cn(e.pages,e.view.fallback);return c`<div class="rm-stack">${de("Fallback page",t,In(e.pages,t,[[L,$e.stay],["",$e.first]]),n=>{e.busy||e.write(an(n))},{snapBack:!0})}</div>
    <p class="rm-help">When the room cannot be told, or has no page.</p>`}function Ho(e){let{view:o}=e,t=S.switching.triggers,n=t.find(i=>i.value===o.trigger)?.help??"";return c`${ze("Switch pages by room",o.switching,"Jump to the page you give a room.",i=>{e.busy||e.write(rn(e.document,i))})}
    ${o.switching?c`<div class="rm-sub-group">
      <div class="rm-stack">${yt("When",o.trigger,t.map(i=>[i.value,i.label]),i=>{e.busy||e.write(Se(e.document,i))})}</div>
      <p class="rm-help">${n}</p>
      ${Un(e)}
    </div>`:m}`}function Mo(e){let o=_e(e.document),t=S.switching.triggers.find(n=>n.value==="Automatic")?.help??"";return c`${ze($n,o,t,n=>{e.busy||e.write(xn(e.document,n))})}
    <div class="rm-sub-group">${Un(e)}</div>`}function Po(e){let{view:o}=e,t={[u.tapToToggle]:o.tapToToggle,[u.liveTile]:o.liveTile};return c`<div class="rm-point-switches" title="One value for every point control tile on this watch.">
    <div class="rm-sub-h"><span>Point control</span></div>
    ${S.pointControl.switches.map(n=>{let i=t[n.key]??n.absent;return ze(n.label,i,i?n.onDetail:n.offDetail,r=>{e.busy||e.write(sn(n.key,r))})})}
  </div>`}function Io(e){let o=e.home===!0,t=o?[u.sensor,u.autoSwitch,u.legacyQuickJump,u.fallback]:[u.sensor,u.autoSwitch,u.legacyQuickJump,u.topSectionDoubleTap,u.handGesture,u.fallback,u.tapToToggle,u.liveTile];return c`<section class="sec rm-card rm-every" data-open="true" aria-label="Every room">
    <div class="sec-h pinned"><span class="tt"><h4>Every room${Ne(Je(e,t))}</h4></span></div>
    <div class="sec-b">
      ${o?c`<p class="rm-help rm-main-house">${An}</p>`:m}
      ${_o(e)}
      ${o?Mo(e):Ho(e)}
      ${o?m:Po(e)}
    </div>
  </section>`}function We(e){let o=Jn(e),t=fo(e,o);return c`<div class="rm-layout" style=${`--wa-stage-hue: ${Ie}`}>
    <div class="rm-col rm-list-col">${vo(e,o,t)}</div>
    <div class="rm-col column canvas rm-stage-col">${So(e,t)}</div>
    <div class="rm-col rm-insp-col">
      ${t===void 0?m:Oo(e,t)}
      ${Io(e)}
    </div>
  </div>`}var Qn=F`
  /* Three columns: the rooms, the stage, the inspector. Under 1100px the
     inspector goes under the other two, under 820px everything is one
     column in reading order. */
  .rm-layout {
    display: grid; grid-template-columns: minmax(240px, 290px) minmax(0, 1fr) minmax(300px, 360px);
    gap: 10px; align-items: start; margin-bottom: 14px;
  }
  @container (max-width: 1100px) {
    .rm-layout { grid-template-columns: minmax(240px, 290px) minmax(0, 1fr); }
    .rm-layout > .rm-insp-col { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 0 10px; align-items: start; }
  }
  @container (max-width: 820px) {
    .rm-layout { grid-template-columns: minmax(0, 1fr); }
    .rm-layout > .rm-insp-col { grid-column: auto; display: flex; align-items: stretch; }
  }
  .rm-col { min-width: 0; display: flex; flex-direction: column; }
  .rm-insp-col > .sec:first-child { margin-top: 0; }
  @container (max-width: 1100px) { .rm-insp-col > .sec { margin-top: 0; } }
  @container (max-width: 820px) { .rm-insp-col > .sec + .sec { margin-top: 10px; } }

  /* Help is one plain line: muted, never italic. */
  .rm-help { margin: 2px 0 8px; font-size: 12px; line-height: 1.45; font-style: normal; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-help.warn { color: var(--wa-amber); }
  .rm-help a { color: var(--wa-ink); }
  .rm-help code, .rm-key, .rm-room-card code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .rm-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .rm-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .rm-card .field :is(input[type=text], input[type=number], select) {
    height: 30px; min-height: 30px; padding: 0 9px; font-size: 13px; border-radius: 7px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
  .rm-card .field.check { grid-template-columns: minmax(0, 1fr) auto; min-height: 30px; padding: 0; font-size: 13px; }
  .rm-card .field.check > span { color: var(--wa-ink); font-size: 13px; }
  /* A picked entity wraps its name, id and state rather than cutting them
     short; the box grows a line instead. */
  .rm-card .ent-chosen { height: auto; min-height: 28px; }
  .rm-card button.ent-pick { flex-wrap: wrap; row-gap: 0; padding-top: 3px; padding-bottom: 3px; }
  .rm-card .ent-pick :is(.ent-name, .ent-id, .ent-state) { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; max-width: none; }
  .rm-card .ent-pick .ent-id { flex: 0 1 auto; }
  /* When's three choices wrap their words rather than cut them short. */
  .rm-card .seg.wide { height: auto; min-height: 28px; }
  .rm-card .seg.wide button { height: auto; min-height: 28px; padding: 4px 6px; white-space: normal; overflow: visible; text-overflow: clip; line-height: 1.2; overflow-wrap: anywhere; }

  /* The left card: the rooms, the add field and the areas. */
  .rm-rooms-card .lc-head .sec-dot { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--c); }
  .rm-rooms-body { display: flex; flex-direction: column; gap: 10px; padding: 0 10px 12px; }
  ul.rm-rooms { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
  button.rm-room {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 7px; border-radius: 10px;
    border: 1px solid var(--wa-line); background: transparent; color: var(--wa-ink);
    font: inherit; text-align: left; cursor: pointer;
  }
  button.rm-room:hover { background: var(--wa-hover); }
  button.rm-room.on { background: var(--wa-raise); border-color: var(--wa-line-strong); }
  button.rm-room:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-chip {
    flex: none; width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center;
    background: var(--wa-field); border: 1px solid var(--wa-line); color: var(--wa-muted);
  }
  .rm-room.on .rm-chip { border-color: var(--c); color: var(--c); }
  .rm-chip svg.ui-icon { width: 15px; height: 15px; }
  .rm-room-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .rm-room-top { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 7px; }
  .rm-room-name { font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
  .rm-room-sub { font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-here {
    display: inline-flex; align-items: center; gap: 4px; height: 18px; padding: 0 7px; border-radius: 999px;
    font-size: 10.5px; font-weight: 500; color: var(--wa-ink); border: 1px solid color-mix(in srgb, var(--wa-hue-green) 60%, transparent);
  }
  .rm-here i { width: 5px; height: 5px; border-radius: 50%; background: var(--wa-hue-green); }
  .rm-none { display: flex; flex-direction: column; gap: 4px; padding: 14px 8px; text-align: center; }
  .rm-none b { font-size: 13px; font-weight: 600; }
  .rm-none span { font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
  .rm-add-room { display: flex; gap: 6px; }
  .rm-add-room input {
    flex: 1 1 auto; min-width: 0; height: 30px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .rm-add-room input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  button.lc-btn.rm-add { height: 30px; }
  .rm-rooms-body > .rm-help { margin: -4px 0 0; }
  .rm-areas { display: flex; flex-wrap: wrap; gap: 5px; }
  .rm-areas-l { width: 100%; font-size: 11.5px; color: var(--wa-muted); }
  button.rm-area {
    min-height: 24px; padding: 2px 9px; border-radius: 999px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong); overflow-wrap: anywhere; text-align: left;
  }
  button.rm-area:hover { background: var(--wa-hover); }
  button.rm-area:focus-visible { outline: none; box-shadow: var(--wa-ring); }

  /* The stage: what the watch does when you walk into the picked room. */
  .column.canvas.rm-stage-col { gap: 0; }
  .column.canvas > .card.canvas-card.rm-canvas { min-height: 560px; flex: none; }
  @container (max-width: 820px) { .column.canvas > .card.canvas-card.rm-canvas { min-height: 0; } }
  .rm-stage-head { display: flex; flex-direction: column; gap: 2px; padding: 14px 18px 0; }
  .rm-stage-title { font-size: 18px; font-weight: 500; letter-spacing: -.015em; overflow-wrap: anywhere; }
  .rm-stage-sub { font-size: 12px; color: var(--wa-muted); }
  .canvas-card.lit .stage-area.rm-stage-area { flex: 1 1 auto; justify-content: center; padding: 20px 18px 60px; container: rmstage / inline-size; }
  .rm-flow { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 18px; }
  .rm-flow-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .rm-flow-in { align-items: flex-end; text-align: right; }
  .rm-flow-out { align-items: flex-start; }
  .rm-step { display: flex; flex-direction: column; gap: 5px; min-width: 0; align-items: inherit; }
  .rm-step-l { font-size: 10.5px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-muted); }
  .rm-key {
    display: inline-flex; align-items: center; min-height: 28px; padding: 3px 11px; border-radius: 8px; font-size: 12px;
    color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong); overflow-wrap: anywhere;
  }
  .rm-step-v { font-size: 14px; font-weight: 500; overflow-wrap: anywhere; }
  .rm-step-v.none, .rm-step-none { font-size: 13px; font-weight: 400; color: var(--wa-muted); }
  .rm-step-note { font-size: 11.5px; color: var(--wa-amber); }
  /* The wire from the steps to the watch: a hairline ending in a dot in the
     Rooms hue. */
  .rm-wire { display: flex; align-items: center; width: 70px; height: 7px; }
  .rm-wire::before { content: ""; flex: 1; height: 1px; background: var(--wa-line-strong); }
  .rm-wire i { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--wa-stage-hue); }
  .rm-flow-out .rm-wire { flex-direction: row-reverse; }
  .canvas-card.lit .stage-area > .rm-flow .rm-stage-body { display: flex; justify-content: center; padding-bottom: 32px; }
  ul.rm-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
  ul.rm-points li { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 13px; }
  .rm-point-chip {
    flex: none; width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center;
    border: 1px solid var(--wa-line-strong); color: var(--wa-soft);
  }
  .rm-point-chip svg.ui-icon { width: 12px; height: 12px; }
  .rm-point-name { overflow-wrap: anywhere; min-width: 0; }
  .rm-point-dir { font-size: 11.5px; color: var(--wa-muted); }
  /* One screen of the page: a taller page is cut at the screen's foot, as
     the watch opens it, rather than drawn on down past the case. */
  :is(.rm-stage-body, .rm-thumb) .wa-watch > .wp-screen { max-height: var(--rm-screen-h); }
  :is(.rm-stage-body, .rm-thumb) .wp-fold { display: none; }
  /* A plain watch screen: the page's name on the watch's black. */
  .wp-screen.rm-screen { display: grid; place-items: center; padding: 20px; text-align: center; }
  .wp-screen.rm-screen span { font-size: 15px; font-weight: 600; color: var(--wa-face-muted); overflow-wrap: anywhere; }
  /* A narrow stage: the steps over the watch, the targets under it. */
  @container rmstage (max-width: 600px) {
    .rm-flow { grid-template-columns: minmax(0, 1fr); justify-items: center; }
    .rm-flow-in, .rm-flow-out { align-items: center; text-align: center; }
    .rm-wire { display: none; }
    .canvas-card.lit .stage-area > .rm-flow .rm-stage-body { padding-bottom: 20px; }
  }
  /* No rooms yet: the dashed watch, the line and the three steps. */
  .canvas-card.lit .stage-area.rm-empty { align-items: center; gap: 22px; padding: 30px 24px 70px; text-align: center; }
  .rm-empty-watch {
    width: 200px; height: 242px; border-radius: 56px; display: grid; place-items: center;
    border: 1.5px dashed var(--wa-line-strong); color: var(--wa-stage-hue);
  }
  .rm-empty-watch svg.ui-icon { width: 46px; height: 46px; stroke-width: 1.6; }
  .rm-empty-text { display: flex; flex-direction: column; gap: 6px; max-width: 440px; }
  .rm-empty-text b { font-size: 20px; font-weight: 500; letter-spacing: -.02em; }
  .rm-empty-text span { font-size: 13px; line-height: 1.5; color: var(--wa-muted); }
  ol.rm-steps { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
  ol.rm-steps li {
    display: flex; align-items: center; gap: 8px; min-height: 32px; padding: 4px 12px; border-radius: 9px;
    font-size: 12.5px; color: var(--wa-soft); border: 1px solid var(--wa-line-strong);
  }
  ol.rm-steps b { font-weight: 600; color: var(--wa-stage-hue); }

  /* The inspector's cards: the picked room in the Rooms hue, Every room
     plain. */
  .rm-card .sec-h { height: auto; min-height: 40px; }
  .rm-card .sec-h h4 { white-space: normal; overflow-wrap: anywhere; flex: 0 1 auto; }
  .rm-card .sec-h .tt { min-width: 0; }
  .sec.rm-every { --c: var(--wa-line-strong); background: var(--wa-card); border: 1px solid var(--wa-line); }
  button.rm-danger {
    flex: none; height: 26px; padding: 0 9px; border-radius: 6px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-hue-red); background: transparent; border: 1px solid color-mix(in srgb, var(--wa-hue-red) 50%, transparent);
  }
  button.rm-danger:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-hue-red) 10%, transparent); }
  button.rm-danger:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-danger:disabled { opacity: .45; cursor: default; }
  .rm-page-pick { display: flex; align-items: flex-end; gap: 10px; }
  .rm-page-pick > .rm-stack { flex: 1; min-width: 0; }
  .rm-thumb { flex: none; display: block; margin-bottom: 4px; }
  .rm-thumb .wa-watch { margin: 0; }
  .rm-sub-h { display: flex; align-items: center; gap: 8px; margin: 12px 0 4px; font-size: 12px; color: var(--wa-muted); }
  .rm-sub-h > span { flex: 1; }
  .rm-sub-h button.lc-btn { height: 26px; font-size: 12px; font-weight: 500; }
  .rm-switch { margin-top: 6px; }
  .rm-switch .rm-help { margin: 0 0 4px; }
  .rm-sub-group { margin: 2px 0 6px; padding-left: 10px; border-left: 1px solid var(--wa-line); }
  .rm-point-switches { margin-top: 6px; padding-top: 2px; border-top: 1px solid var(--wa-line); }
  .rm-point-switches > .rm-sub-h { margin-top: 8px; }
  .rm-reading { display: flex; align-items: flex-start; gap: 8px; margin: 4px 0 2px; font-size: 12.5px; line-height: 1.45; overflow-wrap: anywhere; }
  .rm-dot { flex: none; width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--wa-line-strong); }
  .rm-dot.ok { background: var(--wa-green); }
  .rm-dot.warn { background: var(--wa-amber); }
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
`;qt({dirty:Pe,drop:_n});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Pe()&&(e.preventDefault(),e.returnValue="")});var Co=15e3,Lo="watch settings",Jo="rooms";function No(e){return`${e}\0rooms`}var Kn=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Ue=Kn?"\u2318":"Ctrl+",Bo=820;function zo(e){return $(e).message}function Gn(e){return $(e).code}function Fn(e){let{code:o,message:t}=$(e);return Object.assign(new Error(t),o===void 0?{}:{code:o})}function Wo(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function Uo(e){let o=e?Date.parse(e):NaN;return Number.isNaN(o)?"":Ye(Math.max(0,(Date.now()-o)/1e3))}function Qo(e){return e instanceof HTMLElement?_t(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function Go(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}var Q=new Map,h=class extends Fe{constructor(){super(...arguments);this.owners=[];this.narrow=!1;this.haMenu=!1;this.barActions=m;this.shellOwnsWatch=!1;this.barHost=void 0;this.iconsTick=0;this.headBar=new pt(this);this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.hostWidth=0;this.areas=[];this.areasRead=!1;this.sensorHistory=[];this.unsupported=!1;this.shownFootDialogs=new WeakSet;this.ownListAsked=!1;this.savedTicker=new St(this);this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.sensorSeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||this.load(t,!0)};this.onKeyDown=t=>{if(t.defaultPrevented)return;let n=t.composedPath();if(!n.includes(this)&&!this.headBar.holds(n)&&!Go()||this.renderRoot.querySelector("dialog[open]"))return;let i=t.metaKey||t.ctrlKey,r=t.key.toLowerCase();if(i&&!t.altKey&&r==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&(this.topMenuOpen||this.watchMenuOpen)){t.preventDefault(),this.topMenuOpen=!1,this.watchMenuOpen=!1;return}if(!Qo(n[0])){if(i&&!t.altKey&&r==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}t.ctrlKey&&!t.metaKey&&!t.altKey&&r==="y"&&(t.preventDefault(),this.redo())}};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let n=t.composedPath(),i=r=>n.some(s=>s instanceof HTMLElement&&s.classList.contains(r));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("rm-watch-picker")&&(this.watchMenuOpen=!1)}}get watches(){return at(this.owners.length>0?this.owners:this.ownList??[])}get kind(){return this.kindOf(this.watchId)}kindOf(t,n=this.watches){return kn(t===void 0?void 0:n.find(i=>i.owner_watch_id===t))}get draftKey(){let t=this.watchId;if(t!==void 0)return this.kind==="rooms"?No(t):t}get draft(){let t=this.record,n=this.draftKey;if(n===void 0||t===void 0)return;if(t.revision<=0)return this.kind==="rooms"&&this.unsupported||!this.opensReady()?void 0:ie(n)??Me(n,this.newWatchBase());let i=De(t);if(i!==void 0)return ie(n)??He(n,i,t.revision).draft}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!(this.kind==="rooms"&&this.unsupported)}newWatchBase(){return this.kind==="rooms"?Sn():lt()}opensReady(t=this.watches){let n=this.watchId,i=ce(t.find(r=>r.owner_watch_id===n));return Bt(i,this.kindOf(n,t),n)}startFresh(){let t=this.watchId;t!==void 0&&dt(ce(this.watches.find(n=>n.owner_watch_id===t)))&&(Nt(this.kind,t),this.note=void 0,this.requestUpdate())}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.stopListeningForReconnect(),this.reloadPending=!1,this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++,this.sensorSeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Ke(this.hass).then(s=>{this.ownList=s.owners},()=>{this.ownList=[]}));let i=ut(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));i!==void 0?this.openWatch(i):this.watchId!==void 0&&this.shownKind!==void 0&&this.kind!==this.shownKind&&this.openWatch(this.watchId),this.areasAsked!==this.hass.connection&&this.loadAreas();let r=this.currentSensor();r!==this.sensorHistoryFor&&this.loadSensorHistory(r)}let n=this.restoreAsk;n!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===n.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),Et(this.renderRoot,this.shownFootDialogs),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let n of t){let i=n.contentRect.width;Math.abs(i-this.hostWidth)>=1&&(this.hostWidth=i)}}),this.sizeObserver.observe(this))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}openWatch(t,n=!1){let i=this.kindOf(t);(t!==this.watchId||i!==this.shownKind)&&(this.reloadPending=!1,this.watchId=t,this.note=void 0,this.history=[],this.pagesRecord=void 0,this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.uiState.clear(),this.unsupported=!1,n=!1),this.shownKind=i,this.startSubscription(t),this.load(t,n),this.loadPages(t)}async load(t,n=!1){let i=this.hass;if(!i)return;if(n&&this.saving){this.reloadPending=!0;return}let r=++this.loadSeq;this.stopPolling(),n||(this.record=void 0,this.loading=!0,this.loadError=void 0);let s=this.kind;try{let a=await M(i,t,s);if(r!==this.loadSeq)return;if(n&&this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(a),this.loadError=void 0}catch(a){if(r!==this.loadSeq)return;s==="rooms"&&Rn(a)?(this.unsupported=!0,this.loadError=void 0):n||(this.loadError=zo(a))}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}show(t){let n=this.draftKey;this.record=t,n!==void 0&&t.revision<=0&&Me(n,this.newWatchBase());let i=De(t);if(n===void 0||i===void 0)return;He(n,i,t.revision).mergedIntoEdits&&(this.note={kind:"warn",text:`${this.kind==="rooms"?"This home's rooms":"The watch's settings"} changed elsewhere. Your edits are kept on top.`}),this.requestUpdate()}async loadPages(t){let n=this.hass;if(n)try{let i=await M(n,t,"pages");t===this.watchId&&(this.pagesRecord=i)}catch{}}async loadHistory(t){let n=this.hass;if(!n||this.historyState==="unsupported")return;let i=++this.historySeq;try{let r=await je(n,t,this.kind);if(i!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(r?.entries)?r.entries:[],this.historyState="ready"}catch(r){if(i!==this.historySeq||t!==this.watchId)return;this.historyState=Gn(r)==="unknown_command"?"unsupported":"error"}}async loadAreas(){let t=this.hass;if(t){this.areasAsked=t.connection;try{let n=await t.connection.sendMessagePromise({type:"config/area_registry/list"});this.areas=un(n)}catch{this.areas=Object.values(t.areas??{}).flatMap(n=>typeof n.name=="string"&&n.name.trim()!==""?[{name:n.name}]:[])}this.areasRead=!0}}async loadSensorHistory(t){let n=this.hass;this.sensorHistoryFor=t;let i=++this.sensorSeq;if(this.sensorHistory=[],!(!n||t===""))try{let r=await n.connection.sendMessagePromise({type:"history/history_during_period",start_time:new Date(Date.now()-mn*36e5).toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0,significant_changes_only:!1});if(i!==this.sensorSeq)return;this.sensorHistory=pn(r,t)}catch{}}startSubscription(t){let n=this.hass;if(this.endSubscription(),!n)return;let i=++this.subscribeSeq;Ze(n,t,r=>{i===this.subscribeSeq&&(r.kind===this.kind&&r.revision!==(this.record?.revision??0)&&this.load(t,!0),r.kind==="pages"&&r.revision!==(this.pagesRecord?.revision??0)&&this.loadPages(t))}).then(r=>{i===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||rt(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Co))}async poll(){this.pollTimer=void 0;let t=this.hass,n=this.watchId,i=this.record;if(!(!t||n===void 0||i===void 0)){if(this.saving){this.pollIfWaiting();return}try{let r=await M(t,n,this.kind);if(n!==this.watchId||this.record!==i)return;r.revision===i.revision?this.record={...i,delivered_revision:r.delivered_revision,delivered_at:r.delivered_at,rejected_revision:r.rejected_revision,rejected_at:r.rejected_at,rejected_reason:r.rejected_reason}:this.saving?this.reloadPending=!0:(this.show(r),this.loadHistory(n))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}currentSensor(){let t=this.draft;return t===void 0?"":ee(t.effective).sensor}memoIcons(){let t=this.icons??Ot,n=this.iconMemo;if(n!==void 0&&n.provider===t&&n.tick===this.iconsTick)return n.icons;let i=Ht(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:i},i}screen(){let t=this.watches.find(n=>n.owner_watch_id===this.watchId);return(gt(t?.screen_size)??ft).screen}viewHost(){let t=this.draft,n=this.hass,i=this.watchId;if(t===void 0||n===void 0||i===void 0)return;let r=t.effective,s=ee(r),a=Q.get(i)??[],l=this.kind==="rooms",d=ln({areas:this.areas,mappingKeys:Object.keys(s.mappings),zoneKeys:s.zones.ok?s.zones.rooms.map(([p])=>p):[],history:this.sensorHistory,added:a});return{hass:n,document:r,view:s,dirty:new Set(W(t.document,t.pending)),pages:dn(pe(this.pagesRecord?.document)),rooms:d,roomsState:this.areasRead?"ready":"loading",busy:t.saving,uiState:this.uiState,write:(p,v)=>{this.draft===t&&(t.apply(l?Oe(p):p,v),this.requestUpdate())},endCoalesce:()=>t.endCoalesce(),addRoom:p=>{let v=Q.get(i)??[];v.includes(p)||Q.set(i,[...v,p]),this.requestUpdate()},added:a,forgetRoom:p=>{let v=Q.get(i)??[];Q.set(i,v.filter(g=>y(g)!==p))},pagesDocument:pe(this.pagesRecord?.document),screen:this.screen(),icons:this.memoIcons(),narrow:this.stacked,requestUpdate:()=>this.requestUpdate(),...l?{home:!0}:{}}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,n=this.watchId,i=this.draft,r=this.record;if(!t||n===void 0||!i||!r||i.saving||!i.dirty)return;this.note=void 0,i.endCoalesce();let s=this.kind,a=i.revision<=0,l=Hn(i,{save:(p,v)=>Ve(t,n,s,p,v).catch(g=>{throw Fn(g)}),fetch:()=>M(t,n,s).catch(p=>{throw Fn(p)})});this.requestUpdate();let d=await l;if(n===this.watchId){if(d.ok){let p=d.fresh??r;this.record=d.alreadySaved?p:{...p,revision:d.revision,updated_at:new Date().toISOString(),updated_by:"panel",document:d.document}}else d.fresh!==void 0&&(this.record=d.fresh);this.note=Wt(a,d.ok?void 0:d.code,yn(d,s)),this.reloadPending?(this.reloadPending=!1,this.load(n,!0)):(this.pollIfWaiting(),this.loadHistory(n)),this.requestUpdate()}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let n=this.record;this.watchId===void 0||n===void 0||this.dirty||(this.restoreAsk={entry:t,baseRevision:n.revision})}async restore(){let t=this.hass,n=this.watchId,i=this.restoreAsk;if(!t||n===void 0||i===void 0||this.restoring)return;this.restoring=!0;let r=this.kind==="rooms",s=this.draftKey??n,a;try{await qe(t,n,this.kind,i.entry.revision,i.baseRevision),a={kind:"ok",text:Mt(i.entry.updated_at)},(ie(s)?.dirty??!1)||On(s)}catch(l){let d=Gn(l);d==="conflict"?a={kind:"warn",text:`Not restored. ${r?"This home's rooms":"The watch's settings"} changed somewhere else, so the newest copy is shown.`}:d==="no_record"?a={kind:"warn",text:r?"Not restored. Home Assistant no longer holds rooms for this home.":"Not restored. Home Assistant no longer holds settings for this watch."}:d==="not_found"?a={kind:"warn",text:"Not restored. That save is no longer kept."}:d==="unknown_command"?(this.historyState="unsupported",a={kind:"warn",text:"This version of the integration cannot restore an earlier save. Update it to restore one."}):a={kind:"err",text:`Could not restore: ${wt(l)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}n===this.watchId&&(this.note=a,this.load(n,!0))}render(){let t=this.watches,n=this.draft;return c`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(n,t):m}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:m}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):m}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Bo}renderTopBar(t,n){let i=t!==void 0,r=i&&this.dirty;return c`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch rooms">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:m}
      ${this.shellOwnsWatch?m:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Vt(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      ${this.barHost===void 0?c`<span class="rm-title">Rooms</span>`:m}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?m:this.renderWatchPicker(n)}
      ${this.barHost!==void 0&&i?mt({newWatch:this.newWatch,dirty:r,saved:ue(this.record)}):m}
      ${this.renderSyncPill(t)}
      ${i?c`
        <button class="tb-btn icon rm-undo" ?disabled=${!t.canUndo||this.saving} title=${`Undo (${Ue}Z)`} aria-label="Undo"
          @click=${()=>this.undo()}>${k("undo")}</button>
        <button class="tb-btn icon rm-undo" ?disabled=${!t.canRedo||this.saving} title=${Kn?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
          @click=${()=>this.redo()}>${k("redo")}</button>`:m}
      ${this.renderTopMenu(t)}
      ${i?c`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${Ue}S). A save reaches the watch the next time it checks.`:`Nothing to save (${Ue}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?m:c`<span class="tb-saved" title=${r?"Unsaved changes":""}>${ue(this.record)}</span>
        ${Qt(zt({newWatch:this.newWatch,dirty:r,saving:this.saving}))}`}`:m}
      ${this.barActions}
      <button class="help" title="Help: rooms" aria-label="Help"
        @click=${()=>window.open(jt,"_blank","noopener")}>?</button>
    </div>`}get noun(){return this.kind==="rooms"?Jo:Lo}renderSyncPill(t){let n=this.record;if(n===void 0||n.revision<=0||t===void 0)return m;let i=Ee(t.effective,this.kind),r=le({record:n,size:i.size,limit:i.limit,noun:this.noun,historyState:this.historyState});return c`<span class="tb-sync ${r.tone==="ok"?"ok":"warn"}" title=${`${r.state}. ${r.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${r.state}</span>
    </span>`}renderTopMenu(t){if(t===void 0)return m;let n=this.topMenuOpen,i=r=>()=>{this.topMenuOpen=!1,r()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${n?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!n}}>···</button>
      ${n?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to how the screen opened. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${i(()=>this.discard())}>Discard edits</button>
      </div>`:m}
    </span>`}personColor(t){let n=kt(this.owners.length>0?this.owners:this.ownList??[]);return xt(n.findIndex(i=>i.owners.some(r=>r.owner_watch_id===t)))}renderWatchPicker(t){if(t.length<2)return m;let n=t.find(s=>s.owner_watch_id===this.watchId),i=this.watchMenuOpen,r=s=>{let a=s===void 0?void 0:this.personColor(s);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:m} aria-hidden="true">${k("watch")}</span>`};return c`<span class="picker rm-watch-picker">
      <button type="button" class="tb-browse rm-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose rooms are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${r(n?.owner_watch_id)}<span class="tb-browse-l">${n?se(n,t):"Choose a watch"}</span>
        <span class="rm-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${i?c`<div class="pop-menu rm-watch-menu" role="menu" aria-label="Watches">
        ${t.map(s=>{let a=s.owner_watch_id===this.watchId;return c`<button type="button" class="row rm-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(s.owner_watch_id)}}>
            ${r(s.owner_watch_id)}<span class="rm-watch-name">${se(s,t)}</span>
            <span class="rm-watch-check" aria-hidden="true">${a?k("check"):m}</span>
          </button>`})}
      </div>`:m}
    </span>`}renderBody(t){if(t.length===0){let a=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${a?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}let n=this.kindOf(this.watchId,t)==="rooms";if(n&&this.unsupported)return c`<div class="pe-empty"><b>${En}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let a=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this ${n?"home's rooms":"watch's settings"}: ${this.loadError}</span>
        ${a===void 0?m:c`<button class="pe-btn" @click=${()=>{this.load(a)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return c`<div class="pe-empty">Loading…</div>`;if(i.revision<=0&&!this.opensReady(t))return c`<div class="pe-empty"><b>${n?Tn:fn}</b>
        <span>${n?K:gn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${ct}</button>
      </div>`;let r=this.draft,s=this.viewHost();return r===void 0||s===void 0?c`<div class="pe-empty"><b>${n?Dn:wn}</b></div>`:i.revision<=0?c`${this.barHost===void 0?Ut():m}${We(s)}`:c`${We(s)}${this.renderFoot(i,r)}`}renderFoot(t,n){let i=n.effective,r=Ee(i,this.kind),s=this.noun,a=le({record:t,size:r.size,limit:r.limit,noun:s,historyState:this.historyState}),l=this.watchId;return c`${Rt({status:a,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?At({noun:s,record:t,entries:this.history,historyState:this.historyState,dirty:n.dirty,restoring:this.restoring,onRetry:()=>{l!==void 0&&(this.historyState="loading",this.loadHistory(l))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):m}
    ${this.rawOpen?Tt({noun:s,document:i,revision:t.revision,dirty:n.dirty,copied:this.rawCopied,onCopy:d=>{Dt(d).then(p=>{this.rawCopied=p})},onClosed:()=>{this.rawOpen=!1}}):m}`}renderRestoreAsk(t){let n=this.record,i=Uo(t.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="rm-ask-title"
      @cancel=${r=>{this.restoring&&r.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="rm-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${t.entry.updated_by==="panel"?"Saved here":"From the watch"}${i?` ${i}`:""}, ${Wo(t.entry.size)}.</p>
      <p>${this.kind==="rooms"?"This home's rooms come back as they were in that save.":"Every watch setting comes back as it was in that save, not only the rooms."} It is saved again as a new revision${n?`, after revision ${n.revision}`:""}, and the copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[it,Xe,et,tt,nt,ot,Jt,Kt,Gt,F`
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
  `,Qn,$t,ht]}};f([R({attribute:!1})],h.prototype,"hass",2),f([R({attribute:!1})],h.prototype,"owners",2),f([R({attribute:!1})],h.prototype,"ownerId",2),f([R({type:Boolean,reflect:!0})],h.prototype,"narrow",2),f([R({attribute:!1})],h.prototype,"haMenu",2),f([R({attribute:!1})],h.prototype,"onHaMenu",2),f([R({attribute:!1})],h.prototype,"onBack",2),f([R({attribute:!1})],h.prototype,"barActions",2),f([R({attribute:!1})],h.prototype,"shellOwnsWatch",2),f([R({attribute:!1})],h.prototype,"barHost",2),f([R({attribute:!1})],h.prototype,"icons",2),f([R({attribute:!1})],h.prototype,"iconsTick",2),f([w()],h.prototype,"watchId",2),f([w()],h.prototype,"record",2),f([w()],h.prototype,"pagesRecord",2),f([w()],h.prototype,"loading",2),f([w()],h.prototype,"loadError",2),f([w()],h.prototype,"history",2),f([w()],h.prototype,"historyState",2),f([w()],h.prototype,"note",2),f([w()],h.prototype,"restoreAsk",2),f([w()],h.prototype,"restoring",2),f([w()],h.prototype,"historyOpen",2),f([w()],h.prototype,"rawOpen",2),f([w()],h.prototype,"rawCopied",2),f([w()],h.prototype,"ownList",2),f([w()],h.prototype,"topMenuOpen",2),f([w()],h.prototype,"watchMenuOpen",2),f([w()],h.prototype,"hostWidth",2),f([w()],h.prototype,"areas",2),f([w()],h.prototype,"areasRead",2),f([w()],h.prototype,"sensorHistory",2),f([w()],h.prototype,"sensorHistoryFor",2),f([w()],h.prototype,"unsupported",2);customElements.get("wa-rooms-editor")||customElements.define("wa-rooms-editor",h);export{h as WaRoomsEditor};
