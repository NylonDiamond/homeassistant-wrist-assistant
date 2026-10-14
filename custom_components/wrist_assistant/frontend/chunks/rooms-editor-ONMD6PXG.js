import{a as Wt,b as Ut,c as Qt,d as Gt,e as Ft,f as Kt,g as Vt}from"./chunk-FMEYBIGP.js";import{j as jt,r as me,v as qt}from"./chunk-XEMGG7QA.js";import"./chunk-XDMMZFSQ.js";import"./chunk-UDRG2OIJ.js";import{a as le,b as ue,c as Tt,d as Et,e as $t,f as Dt,g as Ot,h as _t,i as Ht,j as Bt,k as zt}from"./chunk-5XY7QZT5.js";import{b as Rt,p as At,w as Ct}from"./chunk-RGR5B6W7.js";import{a as Mt,b as Pt,d as It}from"./chunk-QUOL6HJ4.js";import{Lb as kt,Nb as de,Ob as xt,Q as wt,Rb as St,V as yt,Xa as vt,Zb as V,h as tt,qd as Zt,rd as Yt,sd as Xt}from"./chunk-WG7NZLOX.js";import{Ag as Ze,Bg as Ye,Dg as Xe,Eg as et,_h as ct,b as F,c,cg as qe,d as ae,eh as k,f as p,hj as ht,i as je,ih as nt,ii as dt,j as R,ji as se,jj as ft,k as b,kh as ot,kj as gt,li as lt,lj as bt,mh as it,mi as ce,ni as K,oh as rt,oi as ut,ph as at,pi as pt,xi as mt,yg as M,zh as st}from"./chunk-RYLMRUWW.js";import"./chunk-WIDK423N.js";import{i as Lt,k as pe,l as P,n as I,o as j,p as Jt,q as Nt}from"./chunk-Y5WD6GQY.js";import{a as D}from"./chunk-KXSD4G27.js";import{a as f}from"./chunk-LO2NM3CE.js";var en={version:1,note:"The panel's own table: edit it here. RoomRulesTableTests in the app repository checks the parts the watch decides against the watch's code.",keys:{sensor:"roomQuickJumpSourceEntityId",fallback:"roomQuickJumpFallbackPageId",mappings:"roomQuickJumpMappings",autoSwitch:"roomAutoSwitchEnabled",legacyQuickJump:"roomQuickJumpEnabled",zones:"pointControlRoomMappingsJSON",topSectionDoubleTap:"topSectionDoubleTapAction",handGesture:"handGestureAction",tapToToggle:"pointControlTapToToggle",liveTile:"pointControlLiveTile"},normalize:{rule:"Lower case; _ and - as spaces; anything but a-z, 0-9 and space as a space; runs of spaces as one, none at either end.",cases:[{input:"Living Room",key:"living room"},{input:"living_room",key:"living room"},{input:"Living-Room",key:"living room"},{input:"  Kitchen  ",key:"kitchen"},{input:"Kids' Room",key:"kids room"},{input:"ROOM__3",key:"room 3"},{input:"Room 2",key:"room 2"},{input:"Office/Study",key:"office study"},{input:"1st floor",key:"1st floor"},{input:"a	b",key:"a b"},{input:"Caf\xE9",key:"caf"},{input:"B\xFCro",key:"b ro"},{input:"\u0130stanbul",key:"i stanbul"},{input:"\u65E5\u672C",key:""},{input:"\uFF2C\uFF49\uFF56\uFF49\uFF4E\uFF47",key:""},{input:"",key:""},{input:"___",key:""},{input:"--",key:""},{input:"kitchen.",key:"kitchen"},{input:"Master Bedroom (Upstairs)",key:"master bedroom upstairs"}]},roomValue:{notRoom:["unknown","unavailable","none","null","on","off","true","false","home","not_home","away"],rule:"Trimmed, not empty, not one of notRoom (compared lower case), not a number as Swift's Double reads one (nan, inf, infinity and hex floats included), and with a letter in it.",source:"The watch reads a person's room from its state only. Any other sensor gives its state, or, when that is not a room, its location_name attribute.",attribute:"location_name",cases:[{input:"Kitchen",room:!0},{input:"living_room",room:!0},{input:"unknown",room:!1},{input:"Unavailable",room:!1},{input:" on ",room:!1},{input:"OFF",room:!1},{input:"home",room:!1},{input:"not_home",room:!1},{input:"Away",room:!1},{input:"none",room:!1},{input:"NULL",room:!1},{input:"true",room:!1},{input:"42",room:!1},{input:"3.5",room:!1},{input:"-1",room:!1},{input:"1e3",room:!1},{input:"1E3",room:!1},{input:"nan",room:!1},{input:"NaN",room:!1},{input:"inf",room:!1},{input:"-Infinity",room:!1},{input:"0x1F",room:!1},{input:"0x1p3",room:!1},{input:"+5",room:!1},{input:".5",room:!1},{input:"",room:!1},{input:"   ",room:!1},{input:"!!",room:!1},{input:"2nd floor",room:!0},{input:"B\xFCro",room:!0},{input:"\u65E5\u672C",room:!0},{input:"e",room:!0},{input:"Home Office",room:!0}]},switching:{keys:["roomQuickJumpSourceEntityId","roomQuickJumpEnabled","roomAutoSwitchEnabled","topSectionDoubleTapAction","handGestureAction"],triggers:[{value:"Automatic",label:"Automatic",help:"Switches when your room sensor detects a new room. Uses more battery."},{value:"Double-Tap Top",label:"Double-tap the page title",help:"Double-tap the page title or top area to switch."},{value:"Double Pinch",label:"Double Pinch",help:"Double pinch gesture to switch rooms"}],absent:{handGestureAction:"Refresh"},rule:"Picking a room sensor writes only roomQuickJumpSourceEntityId. Switch Pages by Room on is Double-Tap Top. When nothing is on, the trigger shown is Double-Tap Top.",cases:[{op:{switch:!0},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{switch:!0},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Next Page"}},{op:{switch:!0},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{switch:!0},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{switch:!1},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1}},{op:{switch:!1},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{switch:!1},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Refresh"}},{op:{switch:!1},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{switch:!1},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{switch:!1},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}},{op:{trigger:"Automatic"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0}},{op:{trigger:"Automatic"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled"}},{op:{trigger:"Automatic"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,handGestureAction:"Refresh"}},{op:{trigger:"Automatic"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{trigger:"Automatic"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled"}},{op:{trigger:"Automatic"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}},{op:{trigger:"Double-Tap Top"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{trigger:"Double-Tap Top"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Next Page"}},{op:{trigger:"Double-Tap Top"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump"}},{op:{trigger:"Double-Tap Top"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Refresh"}},{op:{trigger:"Double Pinch"},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{trigger:"Double Pinch"},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Room Jump"}},{op:{clearSensor:!0},before:{},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1}},{op:{clearSensor:!0},before:{topSectionDoubleTapAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{clearSensor:!0},before:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,handGestureAction:"Refresh"}},{op:{clearSensor:!0},before:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"}},{op:{clearSensor:!0},before:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled"}},{op:{clearSensor:!0},before:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},after:{roomQuickJumpEnabled:!1,roomAutoSwitchEnabled:!1,topSectionDoubleTapAction:"Disabled",handGestureAction:"Refresh"}}],readCases:[{document:{},on:!1,trigger:"Double-Tap Top"},{document:{topSectionDoubleTapAction:"Room Jump"},on:!0,trigger:"Double-Tap Top"},{document:{roomAutoSwitchEnabled:!1,handGestureAction:"Room Jump"},on:!0,trigger:"Double Pinch"},{document:{topSectionDoubleTapAction:"Activate Scene",handGestureAction:"Next Page"},on:!1,trigger:"Double-Tap Top"},{document:{roomQuickJumpEnabled:!0,topSectionDoubleTapAction:"Disabled"},on:!0,trigger:"Double-Tap Top"},{document:{roomQuickJumpSourceEntityId:"sensor.watch_area",roomQuickJumpEnabled:!0,roomAutoSwitchEnabled:!0,topSectionDoubleTapAction:"Room Jump",handGestureAction:"Room Jump"},on:!0,trigger:"Automatic"}]},fallback:{stay:"__stay__",firstAvailable:null,watchFallbackNames:["favorites","nearby","home"],rule:"Stay on current page stores the sentinel; First available page stores no key, and the watch then takes a page whose normalized name is one of watchFallbackNames, else the first page. A page id is a page's id as stored. The pages offered are the listed pages that are neither system nor hidden pages."},mappings:{rule:"roomQuickJumpMappings maps a normalized room name to a page id. A room set to no page has no key, and an empty mapping is no key at all. The watch normalizes every key before it compares, and also takes a key that contains the room or is contained by it."},pointControl:{domains:[{domain:"light",label:"Light"},{domain:"switch",label:"Switch"},{domain:"fan",label:"Fan"},{domain:"cover",label:"Cover"},{domain:"scene",label:"Scene"},{domain:"script",label:"Script"},{domain:"climate",label:"Climate"},{domain:"media_player",label:"Player"},{domain:"lock",label:"Lock"},{domain:"input_boolean",label:"Toggle"}],heading:{min:0,max:359,rule:"Degrees clockwise from north. The watch shows its compass heading, snapped to 5, for the user to type in; the panel takes a typed or dialled whole degree."},newTarget:"A target added in the panel starts at heading 0 with the entity's friendly name from its id as the label.",switches:[{key:"pointControlTapToToggle",label:"Tap to Toggle",onDetail:"Tap immediately toggles the aimed entity",offDetail:"Tap opens the point control overlay",absent:!1},{key:"pointControlLiveTile",label:"Live Point Control Tile",onDetail:"Show live needle and aimed entity on grid tile",offDetail:"Show live needle and aimed entity on grid tile",absent:!1}]},zones:{cleanCases:[{input:{kitchen:[]},output:null},{input:{den:[{entityId:"light.a",centerHeading:0}],kitchen:[]},output:{den:[{entityId:"light.a",centerHeading:0}],kitchen:[]}},{input:{den:[{entityId:" ",centerHeading:0}]},output:null},{input:{den:[{entityId:" ",centerHeading:0},{entityId:"light.a",centerHeading:10}],hall:[{entityId:"",centerHeading:0}]},output:{den:[{entityId:" ",centerHeading:0},{entityId:"light.a",centerHeading:10}]}},{input:{"living room":[{entityId:"light.tv",centerHeading:90,label:"TV"},{entityId:"switch.fan",centerHeading:180}]},output:{"living room":[{entityId:"light.tv",centerHeading:90,label:"TV"},{entityId:"switch.fan",centerHeading:180}]}}],encodeCases:[{rooms:{"living room":[{entityId:"light.tv_backlight",centerHeading:90,label:"TV / Lamp"},{entityId:"switch.fan",centerHeading:272.5}]},parsed:{"living room":[{centerHeading:90,entityId:"light.tv_backlight",label:"TV / Lamp"},{centerHeading:272.5,entityId:"switch.fan"}]},slashEscaped:!0},{rooms:{kitchen:[{entityId:"light.kitchen",centerHeading:0}]},parsed:{kitchen:[{centerHeading:0,entityId:"light.kitchen"}]},slashEscaped:!1},{rooms:{den:[]},parsed:{den:[]},slashEscaped:!1},{rooms:{b\u00FCro:[{entityId:"light.b\xFCro",centerHeading:359,label:'Schreibtisch "neu"'}]},parsed:{b\u00FCro:[{centerHeading:359,entityId:"light.b\xFCro",label:'Schreibtisch "neu"'}]},slashEscaped:!1}],decodeCases:[{json:'{"kitchen":[{"entityId":"light.a","centerHeading":0}],"living room":[{"entityId":"light.b","centerHeading":359.5,"label":"Lamp"}]}',rooms:{kitchen:[{entityId:"light.a",centerHeading:0}],"living room":[{entityId:"light.b",centerHeading:359.5,label:"Lamp"}]}},{json:'{"den":[{"entityId":"light.a","centerHeading":45,"label":"A","extra":1}]}',rooms:{den:[{entityId:"light.a",centerHeading:45,label:"A"}]}},{json:'{"den":[{"entityId":"light.a","centerHeading":45,"label":null}]}',rooms:{den:[{entityId:"light.a",centerHeading:45}]}},{json:'{"den":[]}',rooms:{den:[]}},{json:'{"den":[{"entityId":"light.a"}]}',rooms:{}},{json:'{"den":[{"entityId":"light.a","centerHeading":"45"}]}',rooms:{}},{json:'{"den":[{"entityId":"light.a","centerHeading":45}],"hall":{"entityId":"light.b"}}',rooms:{}},{json:"[]",rooms:{}},{json:"not json",rooms:{}},{json:"",rooms:{}}]}};var S=en,u=S.keys,L=S.fallback.stay,A="Room Jump",O=S.switching.absent.handGestureAction??"Refresh",E="Room Jump",J="Disabled",he=S.pointControl.domains.map(e=>e.domain);function y(e){return e.toLowerCase().replace(/[_-]/g," ").replace(/[^a-z0-9 ]/g," ").split(" ").filter(n=>n!=="").join(" ")}var Yn=/^[+-]?(?:nan|inf|infinity|(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|0x(?:[0-9a-f]+\.?[0-9a-f]*|\.[0-9a-f]+)(?:p[+-]?\d+)?)$/,Xn=new Set(S.roomValue.notRoom);function C(e){let n=e.trim();if(n==="")return!1;let t=n.toLowerCase();return Xn.has(t)||Yn.test(t)?!1:/[\p{L}\p{M}]/u.test(t)}function fe(e,n){if(n===void 0)return;let t=typeof n.state=="string"?n.state.trim():"";if(e.startsWith("person."))return C(t)?t:void 0;if(C(t))return t;let o=n.attributes?.[S.roomValue.attribute];if(typeof o=="string"&&C(o))return o.trim()}function tn(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function eo(e){if(!tn(e))return;let{entityId:n,centerHeading:t,label:o}=e;if(!(typeof n!="string"||typeof t!="number"||!Number.isFinite(t))&&!(o!=null&&typeof o!="string"))return typeof o=="string"?{entityId:n,centerHeading:t,label:o}:{entityId:n,centerHeading:t}}function _(e){if(e==null||e==="")return{ok:!0,rooms:[]};if(typeof e!="string")return{ok:!1};let n;try{n=JSON.parse(e)}catch{return{ok:!1}}if(!tn(n))return{ok:!1};let t=[];for(let[o,i]of Object.entries(n)){if(!Array.isArray(i))return{ok:!1};let r=[];for(let a of i){let s=eo(a);if(s===void 0)return{ok:!1};r.push(s)}t.push([o,r])}return{ok:!0,rooms:t}}function q(e){let n=e.filter(([,t])=>t.length===0||t.some(o=>o.entityId.trim()!==""));if(!(n.length===0||n.every(([,t])=>t.length===0)))return n}function Z(e){let n={};for(let[t,o]of e)n[t]=o.map(i=>i.label===void 0?{entityId:i.entityId,centerHeading:i.centerHeading}:{entityId:i.entityId,centerHeading:i.centerHeading,label:i.label});return JSON.stringify(n).replace(/\//g,"\\/")}function ge(e,n){if(e.length!==n.length)return!1;let t=new Map(n);return t.size!==n.length?!1:e.every(([o,i])=>{let r=t.get(o);return r!==void 0&&r.length===i.length&&i.every((a,s)=>a.entityId===r[s].entityId&&a.centerHeading===r[s].centerHeading&&a.label===r[s].label)})}function N(e){return Number.isFinite(e)?(Math.round(e)%360+360)%360:0}function be(e){return["N","NE","E","SE","S","SW","W","NW"][Math.floor(((e+22.5)%360+360)%360/45)%8]}function we(e){let n=e.indexOf(".");return n<0?e:e.slice(n+1).split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function nn(e){return e.split(" ").filter(n=>n!=="").map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function T(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function z(e,n){if(e===n)return!0;if(Array.isArray(e)||Array.isArray(n))return!Array.isArray(e)||!Array.isArray(n)||e.length!==n.length?!1:e.every((t,o)=>z(t,n[o]));if(T(e)&&T(n)){let t=Object.keys(e);return t.length!==Object.keys(n).length?!1:t.every(o=>Object.hasOwn(n,o)&&z(e[o],n[o]))}return!1}var on=new Map(S.pointControl.switches.map(e=>[e.key,e.absent]));function an(e,n,t){return Object.hasOwn(e,n)?t!==void 0&&z(e[n],t):t===void 0||on.has(n)&&on.get(n)===t}function ve(e,n){let t=structuredClone(e);for(let[o,i]of n)i===void 0?delete t[o]:t[o]=structuredClone(i);return t}function ke(e,n,t){let o=new Map(n);for(let[i,r]of t)an(e,i,r)?o.delete(i):o.set(i,r);return o}function W(e,n){return e===void 0?[]:[...n.entries()].filter(([t,o])=>!an(e,t,o)).map(([t])=>t)}function rn(e,n,t){let o=new Map(t);for(let i of new Set([...e.keys(),...n.keys()])){let r=e.get(i),a=n.get(i);z(r,a)||(a===void 0?o.delete(i):o.set(i,a))}return o}function ye(e){return new Map(T(e)?Object.entries(e):[])}function xe(e,n,t){let o=new Map(t);for(let[i,r]of t)if(!z(e[i],n[i])){if(i===u.mappings){let a=rn(ye(e[i]),ye(r),ye(n[i]));o.set(i,a.size===0?void 0:Object.fromEntries(a))}else if(i===u.zones){let a=_(e[i]),s=_(r),l=_(n[i]);if(!a.ok||!s.ok||!l.ok)continue;let d=q([...rn(new Map(a.rooms),new Map(s.rooms),new Map(l.rooms))]);d===void 0?o.set(i,void 0):o.set(i,ge(d,l.rooms)?n[i]:Z(d))}else if(i===u.topSectionDoubleTap||i===u.handGesture){let a=i===u.topSectionDoubleTap?E:A;e[i]===a&&r!==a&&n[i]!==a&&o.delete(i)}}return o}function B(e,n){let t=e[n];return typeof t=="string"?t:void 0}function Y(e,n){let t=e[n];return typeof t=="boolean"?t:void 0}function U(e){let n={},t=B(e,u.sensor);t!==void 0&&(n.roomQuickJumpSourceEntityId=t);let o=Y(e,u.legacyQuickJump);o!==void 0&&(n.roomQuickJumpEnabled=o);let i=Y(e,u.autoSwitch);i!==void 0&&(n.roomAutoSwitchEnabled=i);let r=B(e,u.topSectionDoubleTap);r!==void 0&&(n.topSectionDoubleTapAction=r);let a=B(e,u.handGesture);return a!==void 0&&(n.handGestureAction=a),n}function to(e){let n=U(e),t=n.topSectionDoubleTapAction===E||(n.roomQuickJumpEnabled??!1),o=(n.handGestureAction??O)===A;return t||(n.roomAutoSwitchEnabled??!1)||o}function no(e){let n=U(e);return n.roomAutoSwitchEnabled??!1?"Automatic":(n.handGestureAction??O)===A?"Double Pinch":"Double-Tap Top"}function X(e){let n={},t=e[u.mappings];if(T(t))for(let[i,r]of Object.entries(t))typeof r=="string"&&(n[i]=r);let o=i=>Y(e,i)??S.pointControl.switches.find(r=>r.key===i)?.absent??!1;return{sensor:(B(e,u.sensor)??"").trim(),switching:to(e),trigger:no(e),fallback:(B(e,u.fallback)??"").trim(),mappings:n,zones:_(e[u.zones]),tapToToggle:o(u.tapToToggle),liveTile:o(u.liveTile)}}function Se(e,n){let t=new Map;for(let o of S.switching.keys)e[o]!==n[o]&&t.set(o,n[o]);return t}function oo(e){delete e.roomQuickJumpSourceEntityId,e.roomQuickJumpEnabled=!1,e.roomAutoSwitchEnabled=!1,e.handGestureAction===A&&(e.handGestureAction=O),e.topSectionDoubleTapAction===E&&(e.topSectionDoubleTapAction=J)}function sn(e,n){let t=n.trim();return t!==""?new Map([[u.sensor,t]]):io(e)}function io(e){let n=U(e),t={...n};return oo(t),Se(n,t)}function Re(e,n){let t=U(e),o={...t};return n?(o.topSectionDoubleTapAction=E,o.roomQuickJumpEnabled=!1,o.roomAutoSwitchEnabled=!1,o.handGestureAction===A&&(o.handGestureAction=O)):(o.roomQuickJumpEnabled=!1,o.roomAutoSwitchEnabled=!1,o.handGestureAction===A&&(o.handGestureAction=O),o.topSectionDoubleTapAction===E&&(o.topSectionDoubleTapAction=J)),Se(t,o)}function Ae(e,n){let t=U(e),o={...t};switch(n){case"Automatic":o.roomAutoSwitchEnabled=!0,o.roomQuickJumpEnabled=!1,o.handGestureAction===A&&(o.handGestureAction=O),o.topSectionDoubleTapAction===E&&(o.topSectionDoubleTapAction=J);break;case"Double-Tap Top":o.roomAutoSwitchEnabled=!1,o.roomQuickJumpEnabled=!1,o.topSectionDoubleTapAction=E,o.handGestureAction===A&&(o.handGestureAction=O);break;case"Double Pinch":o.roomAutoSwitchEnabled=!1,o.roomQuickJumpEnabled=!1,o.topSectionDoubleTapAction===E&&(o.topSectionDoubleTapAction=J),o.handGestureAction=A;break}return Se(t,o)}function cn(e){let n=e.trim();return new Map([[u.fallback,n===""?void 0:n]])}function dn(e,n){return new Map([[e,n]])}function H(e,n){let t=e.mappings[n];if(t!==void 0)return t.trim();for(let[o,i]of Object.entries(e.mappings))if(y(o)===n)return i.trim();return""}function ee(e,n,t){let o=e[u.mappings],i=T(o)?structuredClone(o):{};for(let a of Object.keys(i))y(a)===n&&delete i[a];let r=t.trim();return r!==""&&(i[n]=r),new Map([[u.mappings,Object.keys(i).length===0?void 0:i]])}function Te(e,n){return e.filter(([t])=>y(t)===n).flatMap(([,t])=>t)}function Ee(e,n,t){let o=_(e[u.zones]);if(!o.ok)return;let i=[],r=!1;for(let[s,l]of o.rooms)y(s)!==n?i.push([s,l]):r||(i.push([n,t]),r=!0);r||i.push([n,t]);let a=q(i);return a===void 0?new Map([[u.zones,void 0]]):ge(a,o.rooms)?new Map:new Map([[u.zones,Z(a)]])}function ln(e,n){let t=new Map,o=X(e);if(H(o,n)!==""||Object.keys(o.mappings).some(r=>y(r)===n))for(let[r,a]of ee(e,n,""))t.set(r,a);let i=_(e[u.zones]);if(i.ok&&i.rooms.some(([r])=>y(r)===n)){let r=q(i.rooms.filter(([a])=>y(a)!==n));t.set(u.zones,r===void 0?void 0:Z(r))}return t}function $e(e,n,t){return n.lastSeen!==void 0||H(e,n.key)!==""||Object.keys(e.mappings).some(o=>y(o)===n.key)||e.zones.ok&&e.zones.rooms.some(([o])=>y(o)===n.key)?!0:t.some(o=>y(o)===n.key)}function un(e){return P(e).filter(n=>!Nt(n)&&!Jt(n)&&I(n)!=="").map(n=>({id:I(n),name:j(n)}))}function te(e,n){let t=n.trim().toLowerCase();return t===""?void 0:e.find(o=>o.id.toLowerCase()===t)}function pn(e){let n=new Map,t=new Map;for(let s of e.history??[]){if(!C(s.state))continue;let l=y(s.state.trim());if(l==="")continue;let d=t.get(l);(d===void 0||s.at>d.at)&&t.set(l,{at:s.at,state:s.state.trim()})}let o=(s,l,d)=>{let m=y(s);if(m===""||n.has(m))return;let v=t.get(m)?.at;n.set(m,{key:m,name:d??nn(m),area:l,...v===void 0?{}:{lastSeen:v}})};for(let s of e.areas??[])for(let l of[s.name,...s.aliases??[]]){let d=typeof l=="string"?l.trim():"";d!==""&&o(d,!0,d)}for(let s of e.mappingKeys??[])o(s,!1);for(let s of e.zoneKeys??[])o(s,!1);for(let[s,l]of t)n.has(s)||o(s,!1,l.state);for(let s of e.added??[])o(s,!1,s.trim());let i=[...n.values()],r=i.filter(s=>s.lastSeen!==void 0).sort((s,l)=>l.lastSeen-s.lastSeen),a=i.filter(s=>s.lastSeen===void 0).sort((s,l)=>s.name.localeCompare(l.name,void 0,{sensitivity:"base"}));return[...r,...a]}function mn(e){if(!Array.isArray(e))return[];let n=[];for(let t of e){if(!T(t)||typeof t.name!="string")continue;let o=Array.isArray(t.aliases)?t.aliases.filter(i=>typeof i=="string"):[];n.push({name:t.name,aliases:o})}return n}function hn(e,n){if(!T(e))return[];let t=e[n];if(!Array.isArray(t))return[];let o=[];for(let i of t){if(!T(i))continue;let r=typeof i.s=="string"?i.s:typeof i.state=="string"?i.state:void 0;if(r===void 0)continue;let a,s=typeof i.lc=="number"?i.lc:typeof i.lu=="number"?i.lu:void 0;if(s!==void 0)a=s*1e3;else{let l=typeof i.last_changed=="string"?i.last_changed:typeof i.last_updated=="string"?i.last_updated:void 0,d=l===void 0?NaN:Date.parse(l);Number.isNaN(d)||(a=d)}o.push({state:r,at:a??0})}return o}var fn=24,ro=64*1024;function De(e,n="behavior"){return{size:new TextEncoder().encode(JSON.stringify(e)).length,limit:n==="rooms"?ro:Lt}}var ao=3;async function gn(e,n,t){let o=n,i;for(let r=1;;r++){if(r>1&&W(o.document,t).length===0)return{ok:!0,revision:o.revision,document:o.document,merged:!0,alreadySaved:!0,...i?{fresh:i}:{}};let a=ve(o.document,t);try{let{revision:s}=await e.save(o.revision,a);return{ok:!0,revision:s,document:a,merged:r>1,alreadySaved:!1,...i?{fresh:i}:{}}}catch(s){let{code:l="unknown",message:d}=D(s);if(l!=="conflict"||r>=ao)return{ok:!1,code:l,message:d,...i?{fresh:i}:{}};try{i=await e.fetch()}catch(m){let v=D(m);return{ok:!1,code:v.code??"unknown",message:v.message}}if(!(i.revision>0)||!T(i.document))return{ok:!1,code:"no_record",message:"Home Assistant holds no settings for this watch.",fresh:i};t=xe(o.document,i.document,t),o={revision:i.revision,document:i.document}}}}function Oe(e){return e!==void 0&&e.revision>0&&T(e.document)?e.document:void 0}var bn="No watch settings from this watch yet.",wn=`Rooms are part of the watch's settings. ${K}`,yn="Home Assistant holds settings for this watch that this panel cannot read. Update the integration.",vn="The point control targets stored for this watch cannot be read, so they are shown as none and left as they are. Update the integration to change them here.",_e={stay:"Stay on current page",first:"First available page"};function kn(e,n="behavior"){let t=n==="rooms";if(e.ok)return e.alreadySaved?{kind:"ok",text:`Nothing left to save. The ${t?"rooms":"settings"} already had these changes, as revision ${e.revision}.`}:e.merged?{kind:"ok",text:t?"Saved. Room changes made elsewhere meanwhile were kept.":"Saved. Settings changed elsewhere meanwhile were kept."}:void 0;let o=e.message.trim();switch(e.code){case"conflict":return{kind:"warn",text:`Not saved. ${t?"This home's rooms":"The watch's settings"} kept changing elsewhere while saving. Your edits are kept, so try Save again in a moment.`};case"no_record":return{kind:"warn",text:t?"Not saved. Home Assistant no longer holds rooms for this home.":"Not saved. Home Assistant no longer holds settings for this watch."};case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:`Not saved. Home Assistant could not store the ${t?"rooms":"settings"} just now. Your edits are kept, so try again in a moment.`};default:return{kind:"err",text:`Not saved${o===""?".":`: ${o}`}`}}}function xn(e){return e===""?"first":e===L?"stay":"page"}function Sn(e){return lt(e)?"rooms":"behavior"}var so=1,ni=[u.legacyQuickJump,u.sensor,u.fallback,u.mappings,u.autoSwitch,u.zones],co=[u.topSectionDoubleTap,u.handGesture,u.tapToToggle,u.liveTile];function He(e){return new Map([...e].filter(([n])=>!co.includes(n)))}function Me(e){return Y(e,u.autoSwitch)??!1}function Pe(e,n){return He(n?Ae(e,"Automatic"):new Map([[u.autoSwitch,!1]]))}function Rn(){return{schemaVersion:so}}function An(e){let n=D(e).code;return n==="invalid"||n==="unknown_command"}var Tn="The double-tap on the page title, the double pinch and the point control switches come from this watch's main home.",En="No rooms for this home yet.",$n="Update the integration to edit this home's rooms here.",Dn="Home Assistant holds rooms for this home that this panel cannot read. Update the integration.",On="Switch automatically";var lo=100,ne=class{constructor(n,t){this.edits=new Map;this.undoStack=[];this.redoStack=[];this.saving=!1;this.document=n,this.revision=t}get effective(){return ve(this.document,this.edits)}get pending(){return this.edits}get dirty(){return W(this.document,this.edits).length>0}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}apply(n,t){if(this.saving)return!1;let o=ke(this.document,this.edits,n);return uo(o,this.edits)?!1:((t===void 0||t!==this.coalesceKey)&&(this.undoStack.push(new Map(this.edits)),this.undoStack.length>lo&&this.undoStack.shift()),this.coalesceKey=t,this.redoStack=[],this.edits=o,!0)}endCoalesce(){this.coalesceKey=void 0}undo(){if(this.saving)return!1;let n=this.undoStack.pop();return n===void 0?!1:(this.redoStack.push(this.edits),this.edits=n,this.coalesceKey=void 0,!0)}redo(){if(this.saving)return!1;let n=this.redoStack.pop();return n===void 0?!1:(this.undoStack.push(this.edits),this.edits=n,this.coalesceKey=void 0,!0)}discard(){return this.edits.size===0||this.saving?!1:(this.undoStack.push(this.edits),this.redoStack=[],this.edits=new Map,this.coalesceKey=void 0,!0)}rebase(n,t){let o=xe(this.document,n,this.edits);return this.document=n,this.revision=t,this.edits=ke(n,new Map,o),this.undoStack=[],this.redoStack=[],this.coalesceKey=void 0,this.edits.size>0}};function uo(e,n){if(e.size!==n.size)return!1;for(let[t,o]of e)if(!n.has(t)||JSON.stringify(o)!==JSON.stringify(n.get(t)))return!1;return!0}var $=new Map;function oe(e){return $.get(e)}function _n(e){$.delete(e)}function Ie(e,n,t){let o=$.get(e);if(o===void 0){let a=new ne(n,t);return $.set(e,a),{draft:a,mergedIntoEdits:!1}}if(o.saving||t===o.revision)return{draft:o,mergedIntoEdits:!1};let i=o.dirty,r=o.rebase(n,t);return{draft:o,mergedIntoEdits:i&&r}}function Ce(e,n){let t=$.get(e);if(t===void 0){let o=new ne(n,0);return $.set(e,o),o}return t.revision>0&&!t.saving&&t.rebase(n,0),t}function Le(){for(let e of $.values())if(e.dirty)return!0;return!1}function Hn(){for(let[e,n]of $)n.saving||$.delete(e)}async function Mn(e,n){if(e.saving)return{ok:!1,code:"busy",message:"A save is running."};let t=new Map(e.pending);e.saving=!0;let o=gn(n,{revision:e.revision,document:e.document},t);e.saveDone=o;try{let i=await o;if(e.saving=!1,i.ok)e.rebase(i.document,i.revision);else if(i.fresh!==void 0&&i.fresh.revision>0){let r=i.fresh.document;r!==void 0&&typeof r=="object"&&!Array.isArray(r)&&e.rebase(r,i.fresh.revision)}return i}finally{e.saving=!1}}var ie="var(--wa-hue-pink)",Je={width:208,height:248};function po(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function Ne(e,n){let t=n.indexOf(".");return{entityId:n,displayName:n===""?"":po(e,n),domain:t<0?"":n.slice(0,t)}}function Be(e,n){return n.some(t=>e.dirty.has(t))}function ze(e){return e?c`<span class="sec-dot" title="Changed, not saved yet" aria-label="Changed"></span>`:p}function mo(e,n){if(n==="")return{line:Cn,tone:"none"};let t=e.states[n];if(t===void 0)return{line:"Home Assistant has no entity with this id now.",tone:"warn"};let o=fe(n,t),i=typeof t.state=="string"?t.state:"";if(o===void 0)return{line:`Now "${i}", which the watch does not read as a room.`,tone:"warn"};let r=y(o);return{line:`Now in ${o}${r===""?", whose name has no letter or digit the watch can match":""}.`,tone:r===""?"warn":"ok"}}function ho(e,n){if(n==="")return"";let t=fe(n,e.states[n]);return t===void 0?"":y(t)}var In="https://github.com/agittins/bermuda",Cn="No room sensor picked. The watch looks for one by its name, such as a Bermuda area sensor. Pick one to be sure.",fo="Bermuda uses Bluetooth to tell which room your watch is in. Rooms works best with its area sensor. Add Bermuda to Home Assistant, then pick its sensor here.";function Ln(e,n){if(n==="")return!1;let t=e.states[n];if((typeof t?.attributes?.device_class=="string"?t.attributes.device_class:"").toLowerCase().startsWith("bermuda"))return!0;let i=typeof t?.attributes?.friendly_name=="string"?t.attributes.friendly_name:"";return`${n} ${i}`.toLowerCase().includes("bermuda")}function go(e){let t=e.currentTarget.getRootNode().querySelector(".rm-sensor-field");t?.scrollIntoView({block:"center",behavior:"smooth"}),t?.querySelector("input, button")?.focus()}function bo(e){let n=e.indexOf("Bermuda");return n<0?e:c`${e.slice(0,n)}<a href=${In} target="_blank" rel="noopener noreferrer">Bermuda</a>${e.slice(n+7)}`}function We(e,n,t){let o=[...t,...e.map(i=>[i.id,i.name])];return n!==""&&!t.some(([i])=>i===n)&&te(e,n)===void 0&&o.push([n,"A page not on this watch"]),o}function Ue(e,n){return te(e,n)?.id??n}function Jn(e,n){return n===""?"":te(e.pages,n)?.name??"A page not on this watch"}function Nn(e,n){let t=n.trim().toLowerCase();if(t!=="")return P(e.pagesDocument).find(o=>I(o).toLowerCase()===t)}function Bn(e){return e.rooms.filter(n=>$e(e.view,n,e.added??[]))}function wo(e){return e.rooms.filter(n=>n.area&&!$e(e.view,n,e.added??[]))}function yo(e,n){let t=e.uiState.get("pick");return n.find(o=>o.key===t)??n[0]}function zn(e,n){e.uiState.set("pick",n),e.requestUpdate()}function vo(e){return e===0?"nothing to point at":e===1?"1 thing to point at":`${e} things to point at`}function ko(e,n){let t=Jn(e,H(e.view,n.key)),o=e.view.zones.ok?Te(e.view.zones.rooms,n.key).length:0;return`${t===""?"No page yet":`Opens ${t}`} \xB7 ${vo(o)}`}function xo(e,n,t,o){return c`<li>
    <button type="button" class="rm-room ${t?"on":""}" aria-pressed=${t?"true":"false"} @click=${()=>zn(e,n.key)}>
      <span class="rm-chip" aria-hidden="true">${k("home")}</span>
      <span class="rm-room-text">
        <span class="rm-room-top"><b class="rm-room-name">${n.name}</b>${o?c`<span class="rm-here"><i aria-hidden="true"></i>You are here</span>`:p}</span>
        <span class="rm-room-sub">${ko(e,n)}</span>
      </span>
    </button>
  </li>`}function Wn(e,n){let t=y(n);t!==""&&(e.addRoom(n.trim()),zn(e,t))}function So(e){let n=String(e.uiState.get("addRoom")??""),t=y(n),o=Bn(e),i=t!==""&&o.some(a=>a.key===t),r=()=>{t===""||i||(e.uiState.set("addRoom",""),Wn(e,n))};return c`<div class="rm-add-room">
    <input type="text" placeholder="Add a room by name" aria-label="Room name" .value=${n}
      @input=${a=>{e.uiState.set("addRoom",a.target.value),e.requestUpdate()}}
      @keydown=${a=>{a.key==="Enter"&&(a.preventDefault(),r())}} />
    <button type="button" class="lc-btn rm-add" ?disabled=${t===""||i} @click=${r}>${k("plus")}<span>Add</span></button>
  </div>
  ${n.trim()!==""&&t===""?c`<p class="rm-help warn">The watch matches room names by their letters a to z and digits, and this name has none.</p>`:p}
  ${i?c`<p class="rm-help">That room is in the list.</p>`:p}`}function Ro(e,n,t){let o=ho(e.hass,e.view.sensor),i=wo(e);return c`<section class="card lc rm-rooms-card" aria-label="Your rooms" style=${`--c: ${ie}`}>
    <div class="lc-head">
      <span class="swatch">${k("home")}</span><span class="lc-title">Your rooms</span>
      <span class="lc-sub">${n.length}</span>${ze(Be(e,[u.mappings,u.zones]))}
    </div>
    <div class="rm-rooms-body">
      ${n.length===0?c`<div class="rm-none">
            <b>${e.roomsState==="loading"?"Reading your rooms":"No rooms yet"}</b>
            <span>${e.roomsState==="loading"?"The areas and what the room sensor reported.":i.length>0?"Pick an area below, or type a name.":"Type a room's name below."}</span>
          </div>`:c`<ul class="rm-rooms" aria-label="Rooms">${n.map(r=>xo(e,r,r.key===t?.key,r.key===o))}</ul>`}
      ${So(e)}
      ${i.length>0?c`<div class="rm-areas">
        <span class="rm-areas-l">From your Home Assistant areas</span>
        ${i.map(r=>c`<button type="button" class="rm-area" title=${`Add ${r.name} to your rooms`} @click=${()=>Wn(e,r.name)}>+ ${r.name}</button>`)}
      </div>`:p}
    </div>
  </section>`}var Un=1.15,Pn=.2;function Qn(e,n){return Math.round((e.screen??Je).height*n*100)/100}function Ao(e,n){let t=e.screen??Je,o=e.narrow===!0?1:Un,i=Nn(e,n);if(i!==void 0)return me({page:i,pages:P(e.pagesDocument),screen:t,states:e.hass.states,...e.icons?{icons:e.icons}:{},scale:o,...e.home===!0?{}:{behavior:e.document}});let r=Jn(e,n);return Bt(t,o,c`<div class="wp-screen rm-screen"
    style=${`width:${t.width*o}px;height:${t.height*o}px;background:${jt({},o,t)}`}>
    <span>${r===""?"No page yet":r}</span>
  </div>`,r===""?"Watch":`Watch showing ${r}`)}function To(e,n){if(n===void 0)return c`<div class="card canvas-card lit rm-canvas" aria-label="Rooms">
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
    </div>`;let t=H(e.view,n.key),o=Ue(e.pages,t),i=e.home===!0?Me(e.document):e.view.switching;return c`<div class="card canvas-card lit rm-canvas" aria-label=${`What the watch does in ${n.name}`}>
    <div class="rm-stage-head">
      <b class="rm-stage-title">${n.name}</b>
      <span class="rm-stage-sub">What the watch does when you walk in</span>
    </div>
    <div class="stage-area rm-stage-area">
      <div class="rm-flow">
        <div class="rm-flow-side rm-flow-in">
          <div class="rm-step">
            <span class="rm-step-l">1 · Sensor says</span>
            <code class="rm-key" title="The room sensor's state that names this room. The watch matches its letters and digits.">${n.key}</code>
            ${e.view.sensor===""?c`<span class="rm-step-note">No room sensor picked</span>
              <button type="button" class="rm-stage-btn" @click=${go}>Pick a sensor</button>`:p}
          </div>
          <div class="rm-step">
            <span class="rm-step-l">2 · Watch opens</span>
            <select class="rm-stage-select" aria-label=${`Page to open in ${n.name}`} ?disabled=${e.busy}
              @change=${r=>{e.busy||e.write(ee(e.document,n.key,r.target.value))}}>
              ${We(e.pages,o,[["","No page"]]).map(([r,a])=>c`<option value=${r} .selected=${r===o}>${a}</option>`)}
            </select>
            ${i?p:c`<span class="rm-step-note">${e.home===!0?"Switch automatically is off":"Switch pages by room is off"}</span>
              <button type="button" class="rm-stage-btn" ?disabled=${e.busy} @click=${()=>{e.busy||e.write(e.home===!0?Pe(e.document,!0):Re(e.document,!0))}}>Turn on</button>`}
          </div>
          <span class="rm-wire" aria-hidden="true"><i></i></span>
        </div>
        <div class="rm-stage-body" style=${`--rm-screen-h: ${Qn(e,e.narrow===!0?1:Un)}px`}>${Ao(e,t)}</div>
        <!-- An empty side, so the watch stays in the middle. Point control is
             rare, so it lives only in the room's card on the right. -->
        <div class="rm-flow-side rm-flow-out" aria-hidden="true"></div>
      </div>
    </div>
  </div>`}function Eo(e,n,t,o){let i=Math.atan2(e-t,o-n)*180/Math.PI;return N(i)}function $o(e,n,t,o,i){let r=n[t].centerHeading,a=26,s=32,l=(g,w)=>{let x=g*Math.PI/180;return{x:s+Math.sin(x)*w,y:s-Math.cos(x)*w}},d=l(r,a-3),m=g=>{if(e.busy||g.button!==0)return;let w=g.currentTarget,x=w.getBoundingClientRect(),Ke=x.width/64,re=Ve=>o(Eo((Ve.clientX-x.left)/Ke,(Ve.clientY-x.top)/Ke,s,s),i);re(g),w.setPointerCapture?.(g.pointerId);let G=()=>{w.removeEventListener("pointermove",re),w.removeEventListener("pointerup",G),w.removeEventListener("pointercancel",G),e.endCoalesce()};w.addEventListener("pointermove",re),w.addEventListener("pointerup",G),w.addEventListener("pointercancel",G)},v=g=>{let w=g.shiftKey?15:1;if(g.key==="ArrowRight"||g.key==="ArrowUp")o(N(r+w),i);else if(g.key==="ArrowLeft"||g.key==="ArrowDown")o(N(r-w),i);else return;g.preventDefault()};return c`<svg class="rm-dial" viewBox="0 0 64 64" role="slider" tabindex="0" aria-label="Heading"
    aria-valuemin="0" aria-valuemax="359" aria-valuenow=${Math.round(r)} aria-valuetext=${`${Math.round(r)} degrees, ${be(r)}`}
    @pointerdown=${m} @keydown=${v} @blur=${()=>e.endCoalesce()}>
    <circle class="rm-dial-face" cx=${s} cy=${s} r=${a}></circle>
    ${[0,90,180,270].map(g=>{let w=l(g,a-1),x=l(g,a-5);return ae`<line class="rm-dial-tick" x1=${w.x} y1=${w.y} x2=${x.x} y2=${x.y}></line>`})}
    <text class="rm-dial-n" x=${s} y="13">N</text>
    ${n.map((g,w)=>{if(w===t)return p;let x=l(g.centerHeading,a-3);return ae`<circle class="rm-dial-other" cx=${x.x} cy=${x.y} r="2"></circle>`})}
    <line class="rm-dial-needle" x1=${s} y1=${s} x2=${d.x} y2=${d.y}></line>
    <circle class="rm-dial-tip" cx=${d.x} cy=${d.y} r="3.2"></circle>
    <circle class="rm-dial-hub" cx=${s} cy=${s} r="2.2"></circle>
  </svg>`}function Do(e,n,t,o){let i=t[o],r=(l,d)=>{if(e.busy)return;let m=t.flatMap((g,w)=>{if(w!==o)return[g];let x=l(g);return x===void 0?[]:[x]}),v=Ee(e.document,n,m);v!==void 0&&e.write(v,d)},a=(l,d)=>r(m=>({...m,centerHeading:N(l)}),d),s=`target:${n}:${o}`;return c`<div class="rm-target">
    ${$o(e,t,o,a,`${s}:heading`)}
    <div class="rm-target-fields">
      <div class="rm-stack">${V({hass:e.hass},"Entity",Ne(e.hass,i.entityId),l=>{let d=l.entityId.trim();d===""||d===i.entityId||r(m=>({...m,entityId:d}))},`rooms:${s}:entity`,{domain:he,clearable:!1})}</div>
      <label class="field num rm-heading">
        <span>Heading</span>
        <span class="rm-heading-box">
          <input type="number" min="0" max="359" step="1" .value=${String(Math.round(i.centerHeading))} ?disabled=${e.busy}
            aria-label="Heading in degrees"
            @change=${l=>{let d=l.target,m=Number(d.value);if(d.value.trim()===""||Number.isNaN(m)){d.value=String(Math.round(i.centerHeading));return}a(m,`${s}:typed`),e.endCoalesce()}} />
          <span class="rm-compass">° ${be(i.centerHeading)}</span>
        </span>
      </label>
      ${kt("Label",i.label??"",l=>r(d=>{let m={entityId:d.entityId,centerHeading:d.centerHeading};return l!==""&&(m.label=l),m},`${s}:label`),{placeholder:we(i.entityId)})}
    </div>
    <button type="button" class="rm-remove" title="Remove this target" aria-label="Remove this target" ?disabled=${e.busy}
      @click=${()=>r(()=>{})}>${k("close")}</button>
  </div>`}var Oo="To read a heading, stand where you point from, face the target and open Heading on the watch (in Connection Health, or on the point control of a room with no targets). Type the number it shows.";function _o(e,n){let{view:t}=e,o=e.uiState.get(`adding:${n.key}`)===!0,i=s=>c`<div class="rm-sub-h">
    <span>Things to point at</span>
    ${t.zones.ok?c`<button type="button" class="lc-btn rm-add-thing" ?disabled=${e.busy} aria-expanded=${o?"true":"false"}
      @click=${()=>{e.uiState.set(`adding:${n.key}`,!o),e.requestUpdate()}}>${o&&s>0?"Done":"+ Add a thing"}</button>`:p}
  </div>`;if(!t.zones.ok)return c`${i(0)}<p class="rm-help warn">${vn}</p>`;let r=Te(t.zones.rooms,n.key),a=`rooms:target-add:${n.key}`;return c`${i(r.length)}
    ${r.length===0&&!o?c`<p class="rm-help">None yet. Add a lamp or a switch you point the watch at in this room.</p>`:p}
    ${r.map((s,l)=>Do(e,n.key,r,l))}
    ${o?c`<div class="rm-stack rm-add-target">${V({hass:e.hass},"Add a thing",Ne(e.hass,""),s=>{let l=s.entityId.trim();if(l===""||e.busy||r.some(m=>m.entityId===l))return;let d=Ee(e.document,n.key,[...r,{entityId:l,centerHeading:0,label:we(l)}]);d!==void 0&&e.write(d),e.uiState.set(`adding:${n.key}`,!1)},a,{domain:he,clearable:!1})}</div>`:p}
    ${r.length>0?c`<p class="rm-help" title=${Oo}>Heading is degrees clockwise from north. Drag the dial or type it.</p>`:p}`}function Ho(e,n){let t=Nn(e,n);if(t===void 0)return p;let o=e.screen??Je;return c`<span class="rm-thumb" aria-hidden="true" title=${j(t)} style=${`--rm-screen-h: ${Qn(e,Pn)}px`}>${me({page:t,pages:[t],screen:o,states:e.hass.states,...e.icons?{icons:e.icons}:{},scale:Pn})}</span>`}function Mo(e,n){let t=H(e.view,n.key),o=Ue(e.pages,t),i=()=>{if(e.busy)return;let r=ln(e.document,n.key);e.forgetRoom?.(n.key),r.size>0&&e.write(r),e.requestUpdate()};return c`<section class="sec rm-card rm-room-card" data-open="true" aria-label=${n.name} style=${`--c: ${ie}`}>
    <div class="sec-h pinned">
      <span class="swatch">${k("home")}</span>
      <span class="tt"><h4>${n.name}${ze(Be(e,[u.mappings,u.zones]))}</h4></span>
      <button type="button" class="rm-danger" ?disabled=${e.busy}
        title="Take this room off: its page and its things to point at go. Undo brings them back." @click=${i}>Remove</button>
    </div>
    <div class="sec-b">
      ${n.key!==n.name.toLowerCase()?c`<p class="rm-help">The sensor has to say <code>${n.key}</code>, in any case or spacing.</p>`:p}
      <div class="rm-page-pick">
        ${Ho(e,t)}
        <div class="rm-stack">${de("Page to open",o,We(e.pages,o,[["","None"]]),r=>{e.busy||e.write(ee(e.document,n.key,r))},{snapBack:!0})}</div>
      </div>
      ${_o(e,n)}
    </div>
  </section>`}function Qe(e,n,t,o){return c`<div class="rm-switch">${St(e,n,o)}<p class="rm-help">${t}</p></div>`}function Gn(e){let{view:n}=e,t=n.sensor===""?void 0:mo(e.hass,n.sensor),o=Ln(e.hass,n.sensor);return c`<div class="rm-stack rm-sensor-field" title=${n.sensor===""?"":"Clearing the sensor turns Switch pages by room off."}>${V({hass:e.hass},"Room sensor",Ne(e.hass,n.sensor),i=>{e.busy||e.write(sn(e.document,i.entityId))},"rooms:sensor",{clearable:!0})}</div>
    ${t?c`<div class="rm-reading"><i class="rm-dot ${t.tone}" aria-hidden="true"></i><span>${t.line}</span></div>`:p}
    ${o?c`<p class="rm-bermuda-ok">${k("check")}<span>A Bermuda area sensor, the best kind for Rooms.</span></p>`:n.sensor===""?c`<p class="rm-help">${bo(Cn)}</p>`:p}`}function Po(e){let n=e.view.sensor;return Ln(e.hass,n)?p:c`<section class="sec rm-card rm-bermuda" data-open="true" aria-label="Best with Bermuda" style=${`--c: ${ie}`}>
    <div class="sec-h pinned">
      <span class="swatch">${k("place")}</span>
      <span class="tt"><h4>Best with Bermuda</h4></span>
    </div>
    <div class="sec-b">
      <p class="rm-pitch">${fo}</p>
      <a class="rm-bermuda-link" href=${In} target="_blank" rel="noopener noreferrer">Get Bermuda</a>
      ${n===""?Gn(e):p}
    </div>
  </section>`}function Fn(e){let n=xn(e.view.fallback),t=n==="first"?"":n==="stay"?L:Ue(e.pages,e.view.fallback);return c`<div class="rm-stack">${de("Fallback page",t,We(e.pages,t,[[L,_e.stay],["",_e.first]]),o=>{e.busy||e.write(cn(o))},{snapBack:!0})}</div>
    <p class="rm-help">When the room cannot be told, or has no page.</p>`}function Io(e){let{view:n}=e,t=S.switching.triggers,o=t.find(i=>i.value===n.trigger)?.help??"";return c`${Qe("Switch pages by room",n.switching,"Jump to the page you give a room.",i=>{e.busy||e.write(Re(e.document,i))})}
    ${n.switching?c`<div class="rm-sub-group">
      <div class="rm-stack">${xt("When",n.trigger,t.map(i=>[i.value,i.label]),i=>{e.busy||e.write(Ae(e.document,i))})}</div>
      <p class="rm-help">${o}</p>
      ${Fn(e)}
    </div>`:p}`}function Co(e){let n=Me(e.document),t=S.switching.triggers.find(o=>o.value==="Automatic")?.help??"";return c`${Qe(On,n,t,o=>{e.busy||e.write(Pe(e.document,o))})}
    <div class="rm-sub-group">${Fn(e)}</div>`}function Lo(e){let{view:n}=e,t={[u.tapToToggle]:n.tapToToggle,[u.liveTile]:n.liveTile};return c`<div class="rm-point-switches" title="One value for every point control tile on this watch.">
    <div class="rm-sub-h"><span>Point control</span></div>
    ${S.pointControl.switches.map(o=>{let i=t[o.key]??o.absent;return Qe(o.label,i,i?o.onDetail:o.offDetail,r=>{e.busy||e.write(dn(o.key,r))})})}
  </div>`}function Jo(e){let n=e.home===!0,t=n?[u.sensor,u.autoSwitch,u.legacyQuickJump,u.fallback]:[u.sensor,u.autoSwitch,u.legacyQuickJump,u.topSectionDoubleTap,u.handGesture,u.fallback,u.tapToToggle,u.liveTile];return c`<section class="sec rm-card rm-every" data-open="true" aria-label="Every room">
    <div class="sec-h pinned"><span class="tt"><h4>Every room${ze(Be(e,t))}</h4></span></div>
    <div class="sec-b">
      ${n?c`<p class="rm-help rm-main-house">${Tn}</p>`:p}
      ${e.view.sensor===""?p:Gn(e)}
      ${n?Co(e):Io(e)}
      ${n?p:Lo(e)}
    </div>
  </section>`}function Ge(e){let n=Bn(e),t=yo(e,n);return c`<div class="rm-layout" style=${`--wa-stage-hue: ${ie}`}>
    <div class="rm-col rm-list-col">${Ro(e,n,t)}</div>
    <div class="rm-col column canvas rm-stage-col">${To(e,t)}</div>
    <div class="rm-col rm-insp-col">
      ${Po(e)}
      ${t===void 0?p:Mo(e,t)}
      ${Jo(e)}
    </div>
  </div>`}var Kn=F`
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
  .rm-step { display: flex; flex-direction: column; gap: 5px; min-width: 0; align-items: inherit; }
  .rm-step-l { font-size: 10.5px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-muted); }
  .rm-key {
    display: inline-flex; align-items: center; min-height: 28px; padding: 3px 11px; border-radius: 8px; font-size: 12px;
    color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong); overflow-wrap: anywhere;
  }
  .rm-step-v { font-size: 14px; font-weight: 500; overflow-wrap: anywhere; }
  .rm-step-v.none { font-size: 13px; font-weight: 400; color: var(--wa-muted); }
  .rm-step-note { font-size: 11.5px; color: var(--wa-amber); }
  /* The stage's own controls: the page to open and the quick fixes beside
     a step, outlined like every other control. */
  select.rm-stage-select {
    max-width: 100%; height: 30px; padding: 0 8px; border-radius: 7px; font: inherit; font-size: 13.5px; font-weight: 500;
    color: var(--wa-ink); background: var(--wa-field); border: 1px solid var(--wa-line-strong); cursor: pointer;
  }
  select.rm-stage-select:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-stage-btn {
    height: 26px; padding: 0 10px; border-radius: 7px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  button.rm-stage-btn:hover:not(:disabled) { background: var(--wa-hover); }
  button.rm-stage-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-stage-btn:disabled { opacity: .45; cursor: default; }
  /* Bermuda's card, and the tick once its sensor is the one picked. */
  .rm-pitch { margin: 0 0 10px; font-size: 13px; line-height: 1.5; color: var(--wa-ink); overflow-wrap: anywhere; }
  a.rm-bermuda-link {
    display: inline-flex; align-items: center; height: 28px; padding: 0 11px; margin-bottom: 12px; border-radius: 7px;
    font-size: 12.5px; font-weight: 500; text-decoration: none; color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
  }
  a.rm-bermuda-link:hover { background: var(--wa-hover); }
  a.rm-bermuda-link:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-bermuda-ok { display: flex; align-items: center; gap: 6px; margin: 2px 0 8px; font-size: 12px; color: var(--wa-green); }
  .rm-bermuda-ok svg.ui-icon { width: 13px; height: 13px; flex: none; }
  /* The wire from the steps to the watch: a hairline ending in a dot in the
     Rooms hue. */
  .rm-wire { display: flex; align-items: center; width: 70px; height: 7px; }
  .rm-wire::before { content: ""; flex: 1; height: 1px; background: var(--wa-line-strong); }
  .rm-wire i { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--wa-stage-hue); }
  .canvas-card.lit .stage-area > .rm-flow .rm-stage-body { display: flex; justify-content: center; padding-bottom: 32px; }
  /* One screen of the page: a taller page is cut at the screen's foot, as
     the watch opens it, rather than drawn on down past the case. */
  :is(.rm-stage-body, .rm-thumb) .wa-watch > .wp-screen { max-height: var(--rm-screen-h); }
  :is(.rm-stage-body, .rm-thumb) .wp-fold { display: none; }
  /* A plain watch screen: the page's name on the watch's black. */
  .wp-screen.rm-screen { display: grid; place-items: center; padding: 20px; text-align: center; }
  .wp-screen.rm-screen span { font-size: 15px; font-weight: 600; color: var(--wa-face-muted); overflow-wrap: anywhere; }
  /* A narrow stage: the steps over the watch. */
  @container rmstage (max-width: 600px) {
    .rm-flow { grid-template-columns: minmax(0, 1fr); justify-items: center; }
    .rm-flow-out { display: none; }
    .rm-flow-in { align-items: center; text-align: center; }
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
`;Xt({dirty:Le,drop:Hn});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Le()&&(e.preventDefault(),e.returnValue="")});var No=15e3,Bo="watch settings",zo="rooms";function Wo(e){return`${e}\0rooms`}var qn=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Fe=qn?"\u2318":"Ctrl+",Uo=820;function Qo(e){return D(e).message}function Vn(e){return D(e).code}function jn(e){let{code:n,message:t}=D(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}function Go(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function Fo(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":tt(Math.max(0,(Date.now()-n)/1e3))}function Ko(e){return e instanceof HTMLElement?Pt(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function Vo(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}var Q=new Map,h=class extends je{constructor(){super(...arguments);this.owners=[];this.narrow=!1;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.barHost=void 0;this.iconsTick=0;this.headBar=new ft(this);this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.hostWidth=0;this.areas=[];this.areasRead=!1;this.sensorHistory=[];this.unsupported=!1;this.shownFootDialogs=new WeakSet;this.ownListAsked=!1;this.savedTicker=new Tt(this);this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.sensorSeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||this.load(t,!0)};this.onKeyDown=t=>{if(t.defaultPrevented)return;let o=t.composedPath();if(!o.includes(this)&&!this.headBar.holds(o)&&!Vo()||this.renderRoot.querySelector("dialog[open]"))return;let i=t.metaKey||t.ctrlKey,r=t.key.toLowerCase();if(i&&!t.altKey&&r==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&(this.topMenuOpen||this.watchMenuOpen)){t.preventDefault(),this.topMenuOpen=!1,this.watchMenuOpen=!1;return}if(!Ko(o[0])){if(i&&!t.altKey&&r==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}t.ctrlKey&&!t.metaKey&&!t.altKey&&r==="y"&&(t.preventDefault(),this.redo())}};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let o=t.composedPath(),i=r=>o.some(a=>a instanceof HTMLElement&&a.classList.contains(r));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("rm-watch-picker")&&(this.watchMenuOpen=!1)}}get watches(){return dt(this.owners.length>0?this.owners:this.ownList??[])}get kind(){return this.kindOf(this.watchId)}kindOf(t,o=this.watches){return Sn(t===void 0?void 0:o.find(i=>i.owner_watch_id===t))}get draftKey(){let t=this.watchId;if(t!==void 0)return this.kind==="rooms"?Wo(t):t}get draft(){let t=this.record,o=this.draftKey;if(o===void 0||t===void 0)return;if(t.revision<=0)return this.kind==="rooms"&&this.unsupported||!this.opensReady()?void 0:oe(o)??Ce(o,this.newWatchBase());let i=Oe(t);if(i!==void 0)return oe(o)??Ie(o,i,t.revision).draft}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!(this.kind==="rooms"&&this.unsupported)}newWatchBase(){return this.kind==="rooms"?Rn():mt()}opensReady(t=this.watches){let o=this.watchId,i=ce(t.find(r=>r.owner_watch_id===o));return Ut(i,this.kindOf(o,t),o)}startFresh(){let t=this.watchId;t!==void 0&&pt(ce(this.watches.find(o=>o.owner_watch_id===t)))&&(Wt(this.kind,t),this.note=void 0,this.requestUpdate())}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.stopListeningForReconnect(),this.reloadPending=!1,this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++,this.sensorSeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,qe(this.hass).then(a=>{this.ownList=a.owners},()=>{this.ownList=[]}));let i=ht(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));i!==void 0?this.openWatch(i):this.watchId!==void 0&&this.shownKind!==void 0&&this.kind!==this.shownKind&&this.openWatch(this.watchId),this.areasAsked!==this.hass.connection&&this.loadAreas();let r=this.currentSensor();r!==this.sensorHistoryFor&&this.loadSensorHistory(r)}let o=this.restoreAsk;o!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===o.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),Ot(this.renderRoot,this.shownFootDialogs),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let o of t){let i=o.contentRect.width;Math.abs(i-this.hostWidth)>=1&&(this.hostWidth=i)}}),this.sizeObserver.observe(this))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}openWatch(t,o=!1){let i=this.kindOf(t);(t!==this.watchId||i!==this.shownKind)&&(this.reloadPending=!1,this.watchId=t,this.note=void 0,this.history=[],this.pagesRecord=void 0,this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.uiState.clear(),this.unsupported=!1,o=!1),this.shownKind=i,this.startSubscription(t),this.load(t,o),this.loadPages(t)}async load(t,o=!1){let i=this.hass;if(!i)return;if(o&&this.saving){this.reloadPending=!0;return}let r=++this.loadSeq;this.stopPolling(),o||(this.record=void 0,this.loading=!0,this.loadError=void 0);let a=this.kind;try{let s=await M(i,t,a);if(r!==this.loadSeq)return;if(o&&this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(s),this.loadError=void 0}catch(s){if(r!==this.loadSeq)return;a==="rooms"&&An(s)?(this.unsupported=!0,this.loadError=void 0):o||(this.loadError=Qo(s))}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}show(t){let o=this.draftKey;this.record=t,o!==void 0&&t.revision<=0&&Ce(o,this.newWatchBase());let i=Oe(t);if(o===void 0||i===void 0)return;Ie(o,i,t.revision).mergedIntoEdits&&(this.note={kind:"warn",text:`${this.kind==="rooms"?"This home's rooms":"The watch's settings"} changed elsewhere. Your edits are kept on top.`}),this.requestUpdate()}async loadPages(t){let o=this.hass;if(o)try{let i=await M(o,t,"pages");t===this.watchId&&(this.pagesRecord=i)}catch{}}async loadHistory(t){let o=this.hass;if(!o||this.historyState==="unsupported")return;let i=++this.historySeq;try{let r=await Ye(o,t,this.kind);if(i!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(r?.entries)?r.entries:[],this.historyState="ready"}catch(r){if(i!==this.historySeq||t!==this.watchId)return;this.historyState=Vn(r)==="unknown_command"?"unsupported":"error"}}async loadAreas(){let t=this.hass;if(t){this.areasAsked=t.connection;try{let o=await t.connection.sendMessagePromise({type:"config/area_registry/list"});this.areas=mn(o)}catch{this.areas=Object.values(t.areas??{}).flatMap(o=>typeof o.name=="string"&&o.name.trim()!==""?[{name:o.name}]:[])}this.areasRead=!0}}async loadSensorHistory(t){let o=this.hass;this.sensorHistoryFor=t;let i=++this.sensorSeq;if(this.sensorHistory=[],!(!o||t===""))try{let r=await o.connection.sendMessagePromise({type:"history/history_during_period",start_time:new Date(Date.now()-fn*36e5).toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0,significant_changes_only:!1});if(i!==this.sensorSeq)return;this.sensorHistory=hn(r,t)}catch{}}startSubscription(t){let o=this.hass;if(this.endSubscription(),!o)return;let i=++this.subscribeSeq;et(o,t,r=>{i===this.subscribeSeq&&(r.kind===this.kind&&r.revision!==(this.record?.revision??0)&&this.load(t,!0),r.kind==="pages"&&r.revision!==(this.pagesRecord?.revision??0)&&this.loadPages(t))}).then(r=>{i===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||ct(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},No))}async poll(){this.pollTimer=void 0;let t=this.hass,o=this.watchId,i=this.record;if(!(!t||o===void 0||i===void 0)){if(this.saving){this.pollIfWaiting();return}try{let r=await M(t,o,this.kind);if(o!==this.watchId||this.record!==i)return;r.revision===i.revision?this.record={...i,delivered_revision:r.delivered_revision,delivered_at:r.delivered_at,rejected_revision:r.rejected_revision,rejected_at:r.rejected_at,rejected_reason:r.rejected_reason}:this.saving?this.reloadPending=!0:(this.show(r),this.loadHistory(o))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}currentSensor(){let t=this.draft;return t===void 0?"":X(t.effective).sensor}memoIcons(){let t=this.icons??Mt,o=this.iconMemo;if(o!==void 0&&o.provider===t&&o.tick===this.iconsTick)return o.icons;let i=It(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:i},i}screen(){let t=this.watches.find(o=>o.owner_watch_id===this.watchId);return(yt(t?.screen_size)??wt).screen}viewHost(){let t=this.draft,o=this.hass,i=this.watchId;if(t===void 0||o===void 0||i===void 0)return;let r=t.effective,a=X(r),s=Q.get(i)??[],l=this.kind==="rooms",d=pn({areas:this.areas,mappingKeys:Object.keys(a.mappings),zoneKeys:a.zones.ok?a.zones.rooms.map(([m])=>m):[],history:this.sensorHistory,added:s});return{hass:o,document:r,view:a,dirty:new Set(W(t.document,t.pending)),pages:un(pe(this.pagesRecord?.document)),rooms:d,roomsState:this.areasRead?"ready":"loading",busy:t.saving,uiState:this.uiState,write:(m,v)=>{this.draft===t&&(t.apply(l?He(m):m,v),this.requestUpdate())},endCoalesce:()=>t.endCoalesce(),addRoom:m=>{let v=Q.get(i)??[];v.includes(m)||Q.set(i,[...v,m]),this.requestUpdate()},added:s,forgetRoom:m=>{let v=Q.get(i)??[];Q.set(i,v.filter(g=>y(g)!==m))},pagesDocument:pe(this.pagesRecord?.document),screen:this.screen(),icons:this.memoIcons(),narrow:this.stacked,requestUpdate:()=>this.requestUpdate(),...l?{home:!0}:{}}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,o=this.watchId,i=this.draft,r=this.record;if(!t||o===void 0||!i||!r||i.saving||!i.dirty)return;this.note=void 0,i.endCoalesce();let a=this.kind,s=i.revision<=0,l=Mn(i,{save:(m,v)=>Ze(t,o,a,m,v).catch(g=>{throw jn(g)}),fetch:()=>M(t,o,a).catch(m=>{throw jn(m)})});this.requestUpdate();let d=await l;if(o===this.watchId){if(d.ok){let m=d.fresh??r;this.record=d.alreadySaved?m:{...m,revision:d.revision,updated_at:new Date().toISOString(),updated_by:"panel",document:d.document}}else d.fresh!==void 0&&(this.record=d.fresh);this.note=Gt(s,d.ok?void 0:d.code,kn(d,a)),this.reloadPending?(this.reloadPending=!1,this.load(o,!0)):(this.pollIfWaiting(),this.loadHistory(o)),this.requestUpdate()}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let o=this.record;this.watchId===void 0||o===void 0||this.dirty||(this.restoreAsk={entry:t,baseRevision:o.revision})}async restore(){let t=this.hass,o=this.watchId,i=this.restoreAsk;if(!t||o===void 0||i===void 0||this.restoring)return;this.restoring=!0;let r=this.kind==="rooms",a=this.draftKey??o,s;try{await Xe(t,o,this.kind,i.entry.revision,i.baseRevision),s={kind:"ok",text:Ct(i.entry.updated_at)},(oe(a)?.dirty??!1)||_n(a)}catch(l){let d=Vn(l);d==="conflict"?s={kind:"warn",text:`Not restored. ${r?"This home's rooms":"The watch's settings"} changed somewhere else, so the newest copy is shown.`}:d==="no_record"?s={kind:"warn",text:r?"Not restored. Home Assistant no longer holds rooms for this home.":"Not restored. Home Assistant no longer holds settings for this watch."}:d==="not_found"?s={kind:"warn",text:"Not restored. That save is no longer kept."}:d==="unknown_command"?(this.historyState="unsupported",s={kind:"warn",text:"This version of the integration cannot restore an earlier save. Update it to restore one."}):s={kind:"err",text:`Could not restore: ${vt(l)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}o===this.watchId&&(this.note=s,this.load(o,!0))}render(){let t=this.watches,o=this.draft;return c`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(o,t):p}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):p}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Uo}renderTopBar(t,o){let i=t!==void 0,r=i&&this.dirty;return c`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch rooms">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:p}
      ${this.shellOwnsWatch?p:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Zt(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      ${this.barHost===void 0?c`<span class="rm-title">Rooms</span>`:p}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?p:this.renderWatchPicker(o)}
      ${this.barHost!==void 0&&i?gt({newWatch:this.newWatch,dirty:r,saved:ue(this.record)}):p}
      ${this.renderSyncPill(t)}
      ${i?c`
        <button class="tb-btn icon rm-undo" ?disabled=${!t.canUndo||this.saving} title=${`Undo (${Fe}Z)`} aria-label="Undo"
          @click=${()=>this.undo()}>${k("undo")}</button>
        <button class="tb-btn icon rm-undo" ?disabled=${!t.canRedo||this.saving} title=${qn?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
          @click=${()=>this.redo()}>${k("redo")}</button>`:p}
      ${this.renderTopMenu(t)}
      ${i?c`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${Fe}S). A save reaches the watch the next time it checks.`:`Nothing to save (${Fe}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?p:c`<span class="tb-saved" title=${r?"Unsaved changes":""}>${ue(this.record)}</span>
        ${Kt(Qt({newWatch:this.newWatch,dirty:r,saving:this.saving}))}`}`:p}
      ${this.barActions}
      <button class="help" title="Help: rooms" aria-label="Help"
        @click=${()=>window.open(Yt,"_blank","noopener")}>?</button>
    </div>`}get noun(){return this.kind==="rooms"?zo:Bo}renderSyncPill(t){let o=this.record;if(o===void 0||o.revision<=0||t===void 0)return p;let i=De(t.effective,this.kind),r=le({record:o,size:i.size,limit:i.limit,noun:this.noun,historyState:this.historyState});return c`<span class="tb-sync ${r.tone==="ok"?"ok":"warn"}" title=${`${r.state}. ${r.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${r.state}</span>
    </span>`}renderTopMenu(t){if(t===void 0)return p;let o=this.topMenuOpen,i=r=>()=>{this.topMenuOpen=!1,r()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${o?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!o}}>···</button>
      ${o?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to how the screen opened. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${i(()=>this.discard())}>Discard edits</button>
      </div>`:p}
    </span>`}personColor(t){let o=Rt(this.owners.length>0?this.owners:this.ownList??[]);return At(o.findIndex(i=>i.owners.some(r=>r.owner_watch_id===t)))}renderWatchPicker(t){if(t.length<2)return p;let o=t.find(a=>a.owner_watch_id===this.watchId),i=this.watchMenuOpen,r=a=>{let s=a===void 0?void 0:this.personColor(a);return c`<span class="pe-chip-glyph" style=${s?`--pe-person: ${s}`:p} aria-hidden="true">${k("watch")}</span>`};return c`<span class="picker rm-watch-picker">
      <button type="button" class="tb-browse rm-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose rooms are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${r(o?.owner_watch_id)}<span class="tb-browse-l">${o?se(o,t):"Choose a watch"}</span>
        <span class="rm-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${i?c`<div class="pop-menu rm-watch-menu" role="menu" aria-label="Watches">
        ${t.map(a=>{let s=a.owner_watch_id===this.watchId;return c`<button type="button" class="row rm-watch-row" role="menuitemradio" aria-checked=${s?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,s||this.openWatch(a.owner_watch_id)}}>
            ${r(a.owner_watch_id)}<span class="rm-watch-name">${se(a,t)}</span>
            <span class="rm-watch-check" aria-hidden="true">${s?k("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}renderBody(t){if(t.length===0){let s=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${s?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}let o=this.kindOf(this.watchId,t)==="rooms";if(o&&this.unsupported)return c`<div class="pe-empty"><b>${$n}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let s=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this ${o?"home's rooms":"watch's settings"}: ${this.loadError}</span>
        ${s===void 0?p:c`<button class="pe-btn" @click=${()=>{this.load(s)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return c`<div class="pe-empty">Loading…</div>`;if(i.revision<=0&&!this.opensReady(t))return c`<div class="pe-empty"><b>${o?En:bn}</b>
        <span>${o?K:wn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${ut}</button>
      </div>`;let r=this.draft,a=this.viewHost();return r===void 0||a===void 0?c`<div class="pe-empty"><b>${o?Dn:yn}</b></div>`:i.revision<=0?c`${this.barHost===void 0?Ft():p}${Ge(a)}`:c`${Ge(a)}${this.renderFoot(i,r)}`}renderFoot(t,o){let i=o.effective,r=De(i,this.kind),a=this.noun,s=le({record:t,size:r.size,limit:r.limit,noun:a,historyState:this.historyState}),l=this.watchId;return c`${Et({status:s,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?$t({noun:a,record:t,entries:this.history,historyState:this.historyState,dirty:o.dirty,restoring:this.restoring,onRetry:()=>{l!==void 0&&(this.historyState="loading",this.loadHistory(l))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?Dt({noun:a,document:i,revision:t.revision,dirty:o.dirty,copied:this.rawCopied,onCopy:d=>{_t(d).then(m=>{this.rawCopied=m})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(t){let o=this.record,i=Fo(t.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="rm-ask-title"
      @cancel=${r=>{this.restoring&&r.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="rm-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${t.entry.updated_by==="panel"?"Saved here":"From the watch"}${i?` ${i}`:""}, ${Go(t.entry.size)}.</p>
      <p>${this.kind==="rooms"?"This home's rooms come back as they were in that save.":"Every watch setting comes back as it was in that save, not only the rooms."} It is saved again as a new revision${o?`, after revision ${o.revision}`:""}, and the copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[st,nt,ot,it,rt,at,zt,qt,Vt,F`
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
  `,Kn,Ht,bt]}};f([R({attribute:!1})],h.prototype,"hass",2),f([R({attribute:!1})],h.prototype,"owners",2),f([R({attribute:!1})],h.prototype,"ownerId",2),f([R({type:Boolean,reflect:!0})],h.prototype,"narrow",2),f([R({attribute:!1})],h.prototype,"haMenu",2),f([R({attribute:!1})],h.prototype,"onHaMenu",2),f([R({attribute:!1})],h.prototype,"onBack",2),f([R({attribute:!1})],h.prototype,"barActions",2),f([R({attribute:!1})],h.prototype,"shellOwnsWatch",2),f([R({attribute:!1})],h.prototype,"barHost",2),f([R({attribute:!1})],h.prototype,"icons",2),f([R({attribute:!1})],h.prototype,"iconsTick",2),f([b()],h.prototype,"watchId",2),f([b()],h.prototype,"record",2),f([b()],h.prototype,"pagesRecord",2),f([b()],h.prototype,"loading",2),f([b()],h.prototype,"loadError",2),f([b()],h.prototype,"history",2),f([b()],h.prototype,"historyState",2),f([b()],h.prototype,"note",2),f([b()],h.prototype,"restoreAsk",2),f([b()],h.prototype,"restoring",2),f([b()],h.prototype,"historyOpen",2),f([b()],h.prototype,"rawOpen",2),f([b()],h.prototype,"rawCopied",2),f([b()],h.prototype,"ownList",2),f([b()],h.prototype,"topMenuOpen",2),f([b()],h.prototype,"watchMenuOpen",2),f([b()],h.prototype,"hostWidth",2),f([b()],h.prototype,"areas",2),f([b()],h.prototype,"areasRead",2),f([b()],h.prototype,"sensorHistory",2),f([b()],h.prototype,"sensorHistoryFor",2),f([b()],h.prototype,"unsupported",2);customElements.get("wa-rooms-editor")||customElements.define("wa-rooms-editor",h);export{h as WaRoomsEditor};
