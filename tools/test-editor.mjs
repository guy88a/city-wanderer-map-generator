// Integration harness: execute the unmodified application against a DOM and native canvas.
import {JSDOM} from 'jsdom';
import {createCanvas,Image as NativeImage} from '@napi-rs/canvas';
import {readFileSync,writeFileSync} from 'node:fs';import{fileURLToPath}from'node:url';import{mkdirSync}from'node:fs';import assert from'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url)).replace(/\/$/,'');const out=fileURLToPath(new URL('./test-output/',import.meta.url));mkdirSync(out,{recursive:true});
const dom=new JSDOM(readFileSync(root+'/index.html','utf8'),{url:'http://localhost:5173/',pretendToBeVisual:true});const{window}=dom;const downloads=[];const blobMap=new Map();let blobId=0;
Object.assign(globalThis,{window,document:window.document,Option:window.Option,ResizeObserver:class{observe(){queueMicrotask(()=>this.cb());}constructor(cb){this.cb=cb;}},Image:class extends NativeImage{set src(value){super.src=value.startsWith('file:')?fileURLToPath(value):value.startsWith('./')?root+'/'+value.slice(2):value;}get src(){return super.src;}}});
Object.defineProperty(globalThis,'navigator',{value:window.navigator,configurable:true});
window.matchMedia=()=>({matches:false,addEventListener(){}});const $=id=>document.getElementById(id);
Object.defineProperties($('viewport'),{clientWidth:{value:1440},clientHeight:{value:590}});
window.HTMLCanvasElement.prototype.getBoundingClientRect=function(){return{x:0,y:0,left:0,top:0,width:1440,height:590};};window.HTMLCanvasElement.prototype.setPointerCapture=()=>{};
const backings=new WeakMap();function backing(el){if(!backings.has(el))backings.set(el,createCanvas(el.width,el.height));return backings.get(el);}
for(const key of ['width','height']){const d=Object.getOwnPropertyDescriptor(window.HTMLCanvasElement.prototype,key);Object.defineProperty(window.HTMLCanvasElement.prototype,key,{get:d.get,set(v){d.set.call(this,v);if(backings.has(this))backings.get(this)[key]=v;}});}
window.HTMLCanvasElement.prototype.getContext=function(type){return backing(this).getContext(type);};
window.HTMLCanvasElement.prototype.toBlob=function(cb){cb(new Blob([backing(this).toBuffer('image/png')],{type:'image/png'}));};
window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};window.HTMLDialogElement.prototype.close=function(value){this.open=false;this.returnValue=value??'';this.dispatchEvent(new window.Event('close'));};
URL.createObjectURL=blob=>{const key='blob:test-'+(++blobId);blobMap.set(key,blob);return key;};URL.revokeObjectURL=()=>{};window.HTMLAnchorElement.prototype.click=function(){downloads.push({name:this.download,blob:blobMap.get(this.href)});};
await import('../app.js');
for(let i=0;i<200&&!$('message').textContent.startsWith('Ready');i++)await new Promise(r=>setTimeout(r,20));
assert.match($('message').textContent,/^Ready/);assert.equal(window.mapStudio.getScene().props.length,0);assert.equal(window.mapStudio.getScene().ground.length,10);
$('sample').value='props';await $('sample').onchange();const sample=window.mapStudio.getScene();assert.equal(sample.props.length,24);console.log('Sample variants:',sample.props.map(p=>p.family+':'+p.facing).join(', '));writeFileSync(out+'/props-placement.json',JSON.stringify(sample,null,2)+'\n');
$('layer-props').click();assert.equal($('asset-tiles').children.length,6);assert.equal($('prop-toolbar').hidden,false);assert.equal($('prop-warning').textContent,'');
function clickWorld(x,y){const {zoom,pan}=window.mapStudio.getView();$('canvas').dispatchEvent(new window.MouseEvent('pointerdown',{bubbles:true,button:0,clientX:pan.x+x*zoom,clientY:pan.y+y*zoom}));}
const {propGround}=await import('../props.js');
// Open a road tile then place an available slot using the real canvas event handler.
const r=1,c=3,size=sample.tileSize;clickWorld((c-r)*size.width/2,(r+c)*size.height/2);const slot=window.mapStudio.getSlots().find(s=>s.valid);assert.ok(slot);const point=propGround(slot,size);clickWorld(point.x,point.y);assert.equal(window.mapStudio.getScene().props.length,25);
$('undo').click();assert.equal(window.mapStudio.getScene().props.length,24);$('redo').click();assert.equal(window.mapStudio.getScene().props.length,25);
// Select via instance list, change a state, then delete and undo the whole instance.
const placed=window.mapStudio.getScene().props.at(-1);$('prop-instance').value=placed.id;$('prop-instance').onchange();$('prop-state').value='green';$('prop-state').onchange();assert.equal(window.mapStudio.getScene().props.at(-1).state,'green');$('prop-delete').click();assert.equal(window.mapStudio.getScene().props.length,24);$('undo').click();assert.equal(window.mapStudio.getScene().props.length,25);
// A ground edit retains the object and exposes a warning.
$('layer-ground').click();document.querySelector('[data-key="grass"]')?.click(); // Grass is in another folder: use search as a user would.
$('asset-search').value='grass';$('asset-search').oninput();document.querySelector('[data-key="grass"]').click();clickWorld((c-r)*size.width/2,(r+c)*size.height/2);$('canvas').dispatchEvent(new window.MouseEvent('pointerup'));assert.equal(window.mapStudio.getScene().ground[r][c],'grass');assert.equal(window.mapStudio.getScene().props.length,25);$('layer-props').click();assert.match($('prop-warning').textContent,/pavement|requires/);
$('layer-ground').click();$('undo').click();$('asset-search').value='';$('asset-search').oninput();$('layer-props').click();assert.equal($('prop-warning').textContent,'');
$('erase').click();const pp=window.mapStudio.getScene().props.at(-1),gr=propGround(pp,size);clickWorld(gr.x,gr.y-20);assert.equal(window.mapStudio.getScene().props.length,24);$('undo').click();assert.equal(window.mapStudio.getScene().props.length,25);
// Canvas render snapshots and guide-free PNG exports; all targets execute the shipped renderer.
$('prop-select').click();$('show-props').checked=true;$('show-props').onchange();writeFileSync(out+'/props-render-full.png',backing($('canvas')).toBuffer('image/png'));
$('export-target').value='scene';$('export-png').click();$('export-target').value='props';$('export-png').click();$('export-target').value='scene';$('export-json').click();
assert.equal(downloads.length,3);const exported=JSON.parse(await downloads[2].blob.text());assert.equal(exported.props.length,25);
for(const d of downloads.slice(0,2))writeFileSync(out+'/'+d.name,Buffer.from(await d.blob.arrayBuffer()));
// A full scene import and props-only list import retain state and independent undo.
await $('json-file').onchange({target:{files:[{text:async()=>JSON.stringify(exported)}],value:'x'}});assert.equal(window.mapStudio.getScene().props.length,25);
$('import-target').value='props';await $('json-file').onchange({target:{files:[{text:async()=>JSON.stringify(exported.props.slice(0,2))}],value:'x'}});assert.equal(window.mapStudio.getScene().props.length,2);$('undo').click();assert.equal(window.mapStudio.getScene().props.length,25);
$('tile-scale').value='256';$('tile-scale').onchange();assert.equal(window.mapStudio.getScene().tileSize.width,256);writeFileSync(out+'/props-render-half.png',backing($('canvas')).toBuffer('image/png'));
// Missing one-way artwork remains flagged and cannot be placed.
$('asset-search').value='';$('asset-search').oninput();document.querySelector('[data-key="one_way"]').click();$('prop-approach').value='se';$('prop-approach').onchange();$('prop-travel').value='sw';$('prop-travel').onchange();clickWorld((c-r)*128,(r+c)*64);assert.ok(window.mapStudio.getSlots().some(s=>s.issues.some(x=>x.includes('Missing'))));
// Exercise the reported entry corners through actual import/palette/canvas handlers.
$('export-target').value='scene';$('export-json').click();
const {prepareScene}=await import('../model.js');
const entries=[['road_4lane_to_2lane_t_branch_ne_entry','se'],['road_4lane_junction_entry_corner_ne_se','se'],['road_4lane_junction_entry_corner_se_sw','sw']];
const entryScene=prepareScene({ground:entries.map(([key])=>[key]),tileSize:{width:512,height:256}});
$('import-target').value='scene';await $('json-file').onchange({target:{files:[{text:async()=>JSON.stringify(entryScene)}],value:'x'}});
document.querySelector('[data-key="vehicle"]').click();$('prop-approach').value='auto';$('prop-approach').onchange();
for(let row=0;row<entries.length;row++){
 clickWorld(-row*256,row*128);
 const slot=window.mapStudio.getSlots().find(p=>p.valid&&p.u>.5&&(row===2?p.v>.5:p.v<.5));assert.ok(slot,entries[row][0]);
 const p=propGround(slot,{width:512,height:256});clickWorld(p.x,p.y);
 assert.equal(window.mapStudio.getScene().props.at(-1).facing,entries[row][1]);
}
console.log('Reported entry corners: PASS via scene import, automatic palette selection and canvas placement.');
console.log('DOM/native-canvas integration: PASS · 24 sample views, placement, states, undo, ground warnings, both scales, JSON round trip, scene/props PNG, missing-arrow blocking.');process.exit(0);
