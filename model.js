import { validateMap } from './geometry.js';
import { ASSETS, LEGACY_KEYS, LEGACY_FILES } from './catalog.js';
export const CATEGORIES = [
 {id:'ground',label:'Ground tiles',children:[{id:'ground/terrain',label:'Ground'},{id:'ground/roads',label:'Roads',children:[{id:'ground/roads/2lane',label:'2 lanes'},{id:'ground/roads/4lane',label:'4 lanes'}]},{id:'ground/markings',label:'Road markings',children:[{id:'ground/markings/2lane',label:'2 lanes'},{id:'ground/markings/4lane',label:'4 lanes'}]}]},
 {id:'props',label:'Props',children:[{id:'props/street',label:'Street props'},{id:'props/road',label:'Road props'}]},
 {id:'buildings',label:'Buildings'}
];
export const CATEGORY_LABELS = Object.fromEntries((function walk(nodes){return nodes.flatMap(n=>[[n.id,n.label],...walk(n.children??[])])})(CATEGORIES));
export const clone = value => structuredClone(value);
export const blank = (rows,cols) => Array.from({length:rows},()=>Array(cols).fill(null));
export const sameSize = (a,b) => a.length===b.length&&a[0].length===b[0].length;
const own = (o,k)=>Object.hasOwn(o,k);
const fileKeys = new Map();
for(const [key,d]of Object.entries(ASSETS))for(const file of typeof d==='string'?[d]:[d.file,...Object.values(d.variants??{})])fileKeys.set(file,key);
export function keyValid(key){return typeof key==='string'&&/^[A-Za-z][A-Za-z0-9_-]*$/.test(key)&&!['constructor','prototype','__proto__'].includes(key);}
export function canonicalFile(file){
 if(typeof file!=='string'||!file.trim())throw Error('Provide a filename inside assets/.');
 const clean=file.trim().replace(/^\.\//,'').replace(/^assets\//,'');
 const resolved=own(LEGACY_FILES,clean)?LEGACY_FILES[clean]:clean;
 const base=new URL('https://map-tester.invalid/assets/'),url=new URL(resolved,base);
 let decoded;try{decoded=new URL(decodeURIComponent(resolved),base);}catch{throw Error('Invalid filename encoding.');}
 if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname)||url.search||url.hash||decoded.origin!==base.origin||!decoded.pathname.startsWith(base.pathname))throw Error('Filenames must stay inside assets/.');
 return resolved;
}
export function descriptor(value,key){
 const d=typeof value==='string'?{file:value}:value;
 if(!d||typeof d!=='object'||Array.isArray(d))throw Error('Invalid asset: '+key);
 const file=canonicalFile(d.file),base=ASSETS[key],defaults=typeof base==='string'?{file:base}:base??{};
 const layer=d.layer??defaults.layer??'ground';if(!['ground','overlay'].includes(layer))throw Error('Unknown layer: '+layer);
 const category=d.category??defaults.category??(layer==='overlay'?'ground/markings/2lane':'ground/terrain');
 if(!own(CATEGORY_LABELS,category))throw Error('Unknown category: '+category);
 const result={...clone(defaults),...clone(d),file,layer,category,label:d.label??defaults.label??key};
 if(typeof result.label!=='string')throw Error('Asset labels must be text.');
 if(result.variants){if(typeof result.variants!=='object'||Array.isArray(result.variants))throw Error('Invalid asset variants.');for(const [variant,path]of Object.entries(result.variants))result.variants[variant]=canonicalFile(path);}
 return result;
}
export function canonicalKey(key,extra={}){return own(LEGACY_KEYS,key)?LEGACY_KEYS[key]:own(extra,key)?extra[key]:key;}
export function validateTileSize(size){
 if(!size||!Number.isFinite(size.width)||!Number.isFinite(size.height)||size.width<=0||size.height<=0||size.width/size.height!==2||size.width>4096)throw Error('Logical tile size must be positive, 2:1, and at most 4096 px wide.');
 return {width:size.width,height:size.height};
}
export function migrateArray(value,assets,layer,extra={}){
 const next=validateMap(value).map(row=>row.map(k=>k===null?null:canonicalKey(k,extra)));
 const errors=new Set();for(const key of next.flat())if(key!==null){if(!own(assets,key))errors.add('Unknown key: '+key);else if(assets[key].layer!==layer)errors.add(key+' belongs on '+assets[key].layer);}
 if(errors.size)throw Error([...errors].join('\n'));
 return next;
}
export function prepareScene(input,baseAssets=ASSETS,fallbackSize={width:512,height:256}){
 const data=Array.isArray(input)?{ground:input}:input;
 if(!data||typeof data!=='object')throw Error('Expected a map array or full scene.');
 const assets=Object.fromEntries(Object.entries(baseAssets).map(([k,v])=>[k,descriptor(v,k)])),extra={};
 const supplied=data.assets??{};if(!supplied||typeof supplied!=='object'||Array.isArray(supplied))throw Error('Assets must be a key-to-file object.');
 for(const [oldKey,value]of Object.entries(supplied)){
  if(!keyValid(oldKey))throw Error('Invalid asset key: '+oldKey);
  const raw=typeof value==='string'?{file:value}:value;
  if(!raw||typeof raw!=='object')throw Error('Invalid asset: '+oldKey);
  const file=canonicalFile(raw.file),rawPath=raw.file.trim().replace(/^\.\//,'').replace(/^assets\//,''),known=own(LEGACY_FILES,rawPath)?fileKeys.get(file):undefined,key=LEGACY_KEYS[oldKey]??(own(ASSETS,oldKey)?oldKey:known??oldKey);
  extra[oldKey]=key;assets[key]=descriptor(raw,key);
 }
 const ground=migrateArray(data.ground,assets,'ground',extra);
 const overlays=data.overlays?migrateArray(data.overlays,assets,'overlay',extra):blank(ground.length,ground[0].length);
 if(!sameSize(ground,overlays))throw Error('Ground and Overlay dimensions must match.');
 return {version:3,tileSize:validateTileSize(data.tileSize??fallbackSize),assets,ground,overlays};
}
export class EditorModel{
 constructor(scene){this.state=clone(scene);this.layer='ground';this.histories={ground:{undo:[],redo:[]},overlay:{undo:[],redo:[]}};this.markSaved();}
 cells(layer=this.layer){return layer==='ground'?this.state.ground:this.state.overlays;}
 signature(){return JSON.stringify(this.state);}
 markSaved(){this.saved=this.signature();}
 dirty(){return this.signature()!==this.saved;}
 clearHistory(){for(const h of Object.values(this.histories)){h.undo=[];h.redo=[];}}
 record(layer=this.layer){const h=this.histories[layer];h.undo.push(clone(this.cells(layer)));if(h.undo.length>100)h.undo.shift();h.redo=[];}
 paint(row,col,key,record=true){const cells=this.cells();if(row<0||col<0||row>=cells.length||col>=cells[0].length)return false;
  if(key!==null&&(!own(this.state.assets,key)||this.state.assets[key].layer!==this.layer))throw Error('Choose an asset for the current layer.');
  if(cells[row][col]===key)return false;if(record)this.record();cells[row][col]=key;return true;}
 undo(){const h=this.histories[this.layer];if(!h.undo.length)return;h.redo.push(clone(this.cells()));this.setCells(h.undo.pop());}
 redo(){const h=this.histories[this.layer];if(!h.redo.length)return;h.undo.push(clone(this.cells()));this.setCells(h.redo.pop());}
 setCells(value){this.state[this.layer==='ground'?'ground':'overlays']=value;}
 apply(value){const next=migrateArray(value,this.state.assets,this.layer);
  if(!sameSize(next,this.state.ground)){
   if(this.layer==='overlay')throw Error('Overlay dimensions must match Ground.');
   this.resize(next.length,next[0].length,null);this.state.ground=next;return 'Ground applied; dimensions changed and layer histories reset.';
  }
  this.record();this.setCells(next);return 'Applied '+this.layer+' array.';
 }
 resize(rows,cols,fill){
  if(!Number.isInteger(rows)||!Number.isInteger(cols)||rows<1||cols<1||rows>64||cols>64)throw Error('Rows and columns must be integers from 1 to 64.');
  if(fill!==null&&(!own(this.state.assets,fill)||this.state.assets[fill].layer!=='ground'))throw Error('Invalid ground fill.');
  this.state.ground=Array.from({length:rows},(_,r)=>Array.from({length:cols},(_,c)=>this.state.ground[r]?.[c]??(r<this.state.ground.length&&c<this.state.ground[0].length?null:fill)));
  this.state.overlays=Array.from({length:rows},(_,r)=>Array.from({length:cols},(_,c)=>this.state.overlays[r]?.[c]??null));this.clearHistory();
 }
 replace(scene){this.state=clone(scene);this.clearHistory();this.markSaved();}
 register(key,value){if(!keyValid(key))throw Error('Use a key containing letters, numbers, underscores or hyphens.');if(own(this.state.assets,key)||own(LEGACY_KEYS,key))throw Error('That key already exists or is a legacy alias.');this.state.assets[key]=descriptor(value,key);}
 export(target='scene'){return clone(target==='scene'?this.state:this.cells(target));}
}
