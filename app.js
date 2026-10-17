import { MAP, OVERLAYS, TILE_SIZE, ASSETS } from './config.js';
import { LEGACY_KEYS } from './catalog.js';
import { EditorModel, prepareScene, migrateArray, descriptor, canonicalFile, keyValid, CATEGORIES, CATEGORY_LABELS, blank, clone } from './model.js';
import { assetGeometry, tileCenter, cellAt } from './geometry.js';
const $=id=>document.getElementById(id),canvas=$('canvas'),ctx=canvas.getContext('2d'),viewport=$('viewport');
const initial=prepareScene({ground:MAP,overlays:OVERLAYS,tileSize:TILE_SIZE},ASSETS);
const model=new EditorModel(initial),assets=new Map();
let brushes={ground:'ground_pavement',overlay:'crosswalk_2lane_nw_se'},zoom=1,pan={x:0,y:0},hover=null,space=false,gesture=null,lastCell='',cssWidth=0,cssHeight=0,dpr=1,currentSample='current',busy=false;
let folderState=new Map(),searchActive=false,lastSuggestion='',keyEdited=false,paletteMatches=[];
let trayPreference=null;
const activeCategories={ground:'ground/roads/2lane',overlay:'ground/markings'};
const dims=()=>model.state.tileSize,grid=()=>model.state.ground,layer=()=>model.layer,brush=()=>brushes[layer()];
function message(text,error=false){$('message').textContent=text;$('message').classList.toggle('error',error);}
function currentAssets(){return model.state.assets;}
function categoryLabel(id){return id.split('/').map((_,i,a)=>CATEGORY_LABELS[a.slice(0,i+1).join('/')]).filter(Boolean).join(' / ');}
function assetInfo(key){const d=currentAssets()[key],a=assets.get(key);if(!d)return 'Erase on '+layer()+' only.';
 return [d.label,key,d.file,categoryLabel(d.category),a?.ready?`${a.geom.width} × ${a.geom.height} logical · ${a.geom.bleed}px bleed`:a?.error??'Loading…'].join('\n');}
function sync(){
 $('map-json').value=JSON.stringify(model.cells(),null,2);$('rows').value=grid().length;$('cols').value=grid()[0].length;
 const history=model.histories[layer()];$('undo').disabled=!history.undo.length;$('redo').disabled=!history.redo.length;
 $('history-label').textContent=(layer()==='ground'?'Ground':'Overlay')+' history';$('array-label').textContent=layer().toUpperCase()+' ARRAY';
 for(const l of ['ground','overlay']){$('layer-'+l).classList.toggle('selected',layer()===l);$('layer-'+l).setAttribute('aria-pressed',String(layer()===l));}
 $('erase').classList.toggle('selected',brush()===null);$('dirty').textContent=model.dirty()?'Unsaved changes':'Saved';
 updateSelected();draw();
}
function updateSelected(){
 const d=currentAssets()[brush()];$('selected-label').textContent=d?.label??'Erase';$('selected-detail').textContent=d?assetInfo(brush()).split('\n').slice(1).join('\n'):'Only the active '+layer()+' layer is affected.';
 for(const b of $('asset-tiles').querySelectorAll('.asset')){b.classList.toggle('selected',b.dataset.key===brush());b.setAttribute('aria-pressed',String(b.dataset.key===brush()));}
}
function setLayer(next){endGesture();model.layer=next;if(brushes[next]!==null&&!currentAssets()[brushes[next]])brushes[next]=null;hideTooltip();renderPalette();sync();}
function select(key){if(key!==null){const d=currentAssets()[key];if(!d||!assets.get(key)?.ready)return;if(d.layer!==layer())model.layer=d.layer;}brushes[layer()]=key;sync();}
function showTooltip(key,button){
 $('tooltip').textContent=assetInfo(key);$('tooltip').hidden=false;const r=button.getBoundingClientRect(),t=$('tooltip').getBoundingClientRect();
 $('tooltip').style.left=Math.max(8,Math.min(window.innerWidth-t.width-8,r.left))+'px';$('tooltip').style.top=Math.max(8,r.top-t.height-8)+'px';
}
function hideTooltip(){$('tooltip').hidden=true;}
function renderTiles(){
 const query=$('asset-search').value.trim(),category=activeCategories[layer()];
 const matches=paletteMatches.filter(([,d])=>query||d.category===category||d.category.startsWith(category+'/'));
 $('asset-tiles').replaceChildren();$('category-heading').textContent=query?'Search results · '+layer():categoryLabel(category);
 for(const [key,d]of matches){
  const button=document.createElement('button');button.className='asset';button.dataset.key=key;button.dataset.layer=d.layer;button.setAttribute('aria-label',d.label);button.setAttribute('aria-describedby','tooltip');button.setAttribute('aria-pressed',String(key===brush()));button.title=assetInfo(key);
  const image=document.createElement('img');image.alt='';const a=assets.get(key);if(a?.ready)image.src=a.image.src;else button.disabled=true;
  button.append(image);button.onclick=()=>select(key);button.onpointerenter=()=>showTooltip(key,button);button.onpointerleave=hideTooltip;button.onfocus=()=>showTooltip(key,button);button.onblur=hideTooltip;$('asset-tiles').append(button);
 }
 for(const item of $('assets').querySelectorAll('[data-category]'))item.classList.toggle('active-category',item.dataset.category===category&&!query);
 $('asset-count').textContent=matches.length+' / '+Object.values(currentAssets()).filter(d=>d.layer===layer()).length+' assets';$('empty-search').hidden=matches.length!==0;
 $('empty-search').textContent=query?'No matching assets on this layer.':category.startsWith('props')||category==='buildings'?'No assets yet. These folders are reserved for future work.':'No assets on this layer.';updateSelected();
}
function renderPalette(){
 const query=$('asset-search').value.trim().toLowerCase();
 if(query&&!searchActive){folderState=new Map([...$('assets').querySelectorAll('details')].map(d=>[d.dataset.category,d.open]));searchActive=true;}
 if(!query&&searchActive)searchActive=false;
 paletteMatches=Object.entries(currentAssets()).filter(([key,d])=>d.layer===layer()&&(!query||[key,d.label,d.file,...(d.legacy_keys??[]),...Object.entries(LEGACY_KEYS).filter(([,value])=>value===key).map(([old])=>old)].join(' ').toLowerCase().includes(query)));
 $('assets').replaceChildren();
 function count(node){return paletteMatches.filter(([,d])=>d.category===node.id||d.category.startsWith(node.id+'/')).length;}
 function makeFolder(node){
  const number=count(node),element=document.createElement(node.children?'details':'button');element.className=node.children?'folder':'category-leaf';element.dataset.category=node.id;
  if(node.children)element.open=query?number>0:(folderState.get(node.id)??node.id.startsWith('ground'));
  const heading=node.children?document.createElement('summary'):element,title=document.createElement('span'),counter=document.createElement('small');title.textContent=node.label;counter.textContent=String(number);heading.append(title,counter);if(node.children)element.append(heading);
  heading.addEventListener('click',()=>{activeCategories[layer()]=node.id;renderTiles();});
  if(node.children){const body=document.createElement('div');body.className='folder-body';element.append(body);for(const child of node.children){if(query&&count(child)===0)continue;body.append(makeFolder(child));}element.addEventListener('toggle',()=>{if(element.isConnected&&!searchActive)folderState.set(node.id,element.open);});}
  return element;
 }
 for(const root of CATEGORIES){if(query&&count(root)===0)continue;$('assets').append(makeFolder(root));}renderTiles();
}
function loadAsset(key,value){
 const d=descriptor(value,key),cached=assets.get(key);if(cached?.ready&&JSON.stringify(cached.descriptor)===JSON.stringify(d))return Promise.resolve(cached);
 return new Promise((resolve,reject)=>{
  const image=new Image(),timer=setTimeout(()=>reject(Error('Timed out loading '+d.file)),10000);
  image.onload=()=>{clearTimeout(timer);try{resolve({descriptor:d,image,geom:assetGeometry(image.naturalWidth,image.naturalHeight,d),ready:true});}catch(e){reject(Error(key+': '+e.message));}};
  image.onerror=()=>{clearTimeout(timer);reject(Error('Cannot load assets/'+d.file));};image.src=new URL(canonicalFile(d.file),new URL('./assets/',import.meta.url)).href;
 });
}
async function stageAssets(catalog,partial=false){const entries=await Promise.all(Object.entries(catalog).map(async([key,d])=>{try{return [key,await loadAsset(key,d)];}catch(e){if(!partial)throw e;return [key,{descriptor:d,ready:false,error:e.message}];}}));return new Map(entries);}
function installAssets(staged){assets.clear();for(const [key,value]of staged)assets.set(key,value);}
function center(row,col){return tileCenter(row,col,dims().width,dims().height);}
function maxBleed(){return Math.max(0,...[...assets.values()].filter(a=>a.ready).map(a=>a.geom.bleed*dims().width/a.geom.width));}
function bounds(){const {width:w,height:h}=dims(),p=maxBleed();return{left:-grid().length*w/2-p,right:grid()[0].length*w/2+p,top:-h/2-p,bottom:(grid().length+grid()[0].length-1)*h/2+p};}
function diamond(c,x,y){const {width:w,height:h}=dims();c.beginPath();c.moveTo(x,y-h/2);c.lineTo(x+w/2,y);c.lineTo(x,y+h/2);c.lineTo(x-w/2,y);c.closePath();}
function valid(cell){return cell&&cell.row>=0&&cell.col>=0&&cell.row<grid().length&&cell.col<grid()[0].length;}
function drawWorld(c,guides=false,target='scene'){
 const {width:w,height:h}=dims();c.imageSmoothingEnabled=$('smooth').checked;
 const layers=target==='ground'?['ground']:target==='overlay'?['overlay']:guides&&!$('show-overlays').checked?['ground']:['ground','overlay'];
 for(const l of layers){const cells=model.cells(l);
  for(let sum=0;sum<cells.length+cells[0].length-1;sum++)for(let row=0;row<cells.length;row++){
   const col=sum-row;if(col<0||col>=cells[0].length)continue;const key=cells[row][col];if(key===null)continue;const a=assets.get(key),p=center(row,col);
   if(a?.ready){const width=a.image.naturalWidth/a.geom.width*w,height=a.image.naturalHeight/a.geom.height*h;c.drawImage(a.image,p.x-width/2,p.y-height/2,width,height);}
   else{diamond(c,p.x,p.y);c.fillStyle='#b75b7966';c.fill();}
  }
 }
 if(guides){for(let row=0;row<grid().length;row++)for(let col=0;col<grid()[0].length;col++){const p=center(row,col);
  if($('grid').checked){diamond(c,p.x,p.y);c.strokeStyle='#b9ccd270';c.lineWidth=1/zoom;c.stroke();}
  if($('labels').checked){c.font=`${Math.round(h*.09)}px monospace`;c.textAlign='center';c.fillStyle='#11202ad0';c.fillRect(p.x-w*.12,p.y-h*.08,w*.24,h*.16);c.fillStyle='#e7f1f5';c.fillText(row+','+col,p.x,p.y+h*.03);}
 }
 if(valid(hover)){const p=center(hover.row,hover.col);diamond(c,p.x,p.y);c.fillStyle='#d8f0a825';c.fill();c.strokeStyle='#d3edaf';c.lineWidth=2/zoom;c.stroke();}}
}
function draw(){
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cssWidth,cssHeight);ctx.translate(pan.x,pan.y);ctx.scale(zoom,zoom);drawWorld(ctx,true);
 $('zoom-label').value=Math.round(zoom*100)+'%';$('stats').textContent=`${grid().length} × ${grid()[0].length} · ${dims().width} × ${dims().height} logical · ${layer()}`;
 $('hover').textContent=valid(hover)?`row ${hover.row}, col ${hover.col} · ${grid()[hover.row][hover.col]??'empty'}${model.state.overlays[hover.row][hover.col]?' + overlay':''}`:'—';
}
function fit(){const b=bounds();zoom=Math.max(.02,Math.min(2,(cssWidth-56)/(b.right-b.left),(cssHeight-48)/(b.bottom-b.top)));pan={x:cssWidth/2-(b.left+b.right)*zoom/2,y:cssHeight/2-(b.top+b.bottom)*zoom/2};draw();}
function resizeCanvas(){const oldW=cssWidth,oldH=cssHeight;cssWidth=viewport.clientWidth;cssHeight=viewport.clientHeight;dpr=window.devicePixelRatio||1;canvas.width=Math.round(cssWidth*dpr);canvas.height=Math.round(cssHeight*dpr);if(!oldW)fit();else{pan.x+=(cssWidth-oldW)/2;pan.y+=(cssHeight-oldH)/2;draw();}}
new ResizeObserver(resizeCanvas).observe(viewport);
function local(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function hit(e){const p=local(e);return cellAt((p.x-pan.x)/zoom,(p.y-pan.y)/zoom,dims().width,dims().height);}
function paint(cell){if(!valid(cell)||busy)return;const id=cell.row+','+cell.col;if(lastCell===id)return;lastCell=id;
 try{if(model.paint(cell.row,cell.col,brush(),!gesture.changed)){gesture.changed=true;sync();}}catch(e){message(e.message,true);}}
canvas.addEventListener('pointerdown',e=>{if(e.button!==0&&e.button!==1)return;e.preventDefault();hideTooltip();canvas.setPointerCapture(e.pointerId);gesture={mode:space||e.button===1?'pan':'paint',point:local(e),origin:{...pan},changed:false};lastCell='';if(gesture.mode==='paint')paint(hit(e));});
canvas.addEventListener('pointermove',e=>{hover=hit(e);if(gesture?.mode==='pan'){const p=local(e);pan={x:gesture.origin.x+p.x-gesture.point.x,y:gesture.origin.y+p.y-gesture.point.y};}else if(gesture?.mode==='paint')paint(hover);draw();});
function endGesture(){gesture=null;lastCell='';}
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,endGesture);
canvas.addEventListener('pointerleave',()=>{hover=null;draw();});
function zoomAt(factor,p={x:cssWidth/2,y:cssHeight/2}){const next=Math.max(.02,Math.min(6,zoom*factor)),ratio=next/zoom;pan.x=p.x-(p.x-pan.x)*ratio;pan.y=p.y-(p.y-pan.y)*ratio;zoom=next;draw();}
canvas.addEventListener('wheel',e=>{e.preventDefault();zoomAt(Math.exp(-e.deltaY*.0015),local(e));},{passive:false});
$('zoom-in').onclick=()=>zoomAt(1.25);$('zoom-out').onclick=()=>zoomAt(.8);$('fit').onclick=fit;
for(const id of ['grid','labels','smooth','show-overlays'])$(id).onchange=draw;
$('checker').onchange=()=>viewport.classList.toggle('checker',$('checker').checked);
$('layer-ground').onclick=()=>setLayer('ground');$('layer-overlay').onclick=()=>setLayer('overlay');$('asset-search').oninput=()=>{hideTooltip();renderPalette();};$('erase').onclick=()=>select(null);
$('undo').onclick=()=>{if(busy)return;endGesture();model.undo();sync();};$('redo').onclick=()=>{if(busy)return;endGesture();model.redo();sync();};
window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)||$('add-dialog').open||$('confirm-dialog').open)return;
 if(e.code==='Space'){e.preventDefault();space=true;canvas.style.cursor='grab';}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();$(e.shiftKey?'redo':'undo').click();}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();$('redo').click();}
 if(e.key==='0')select(null);const n=Number(e.key);if(n>=1&&n<=9){const b=[...$('asset-tiles').querySelectorAll('.asset:not(:disabled)')].filter(b=>b.getClientRects().length)[n-1];if(b)select(b.dataset.key);}
 if(e.key==='Escape'&&!$('settings').hidden)toggleSettings(false);
});
window.addEventListener('keyup',e=>{if(e.code==='Space'){space=false;canvas.style.cursor='';}});window.addEventListener('blur',()=>{space=false;endGesture();canvas.style.cursor='';hideTooltip();});document.addEventListener('scroll',hideTooltip,true);
function toggleSettings(open){$('settings').hidden=!open;$('settings-toggle').setAttribute('aria-expanded',String(open));}
$('settings-toggle').onclick=()=>toggleSettings($('settings').hidden);$('settings-close').onclick=()=>toggleSettings(false);
function setTrayVisible(visible){$('tray-body').hidden=!visible;$('tray-toggle').setAttribute('aria-expanded',String(visible));$('tray-toggle').textContent=visible?'Hide assets ▾':'Show assets ▴';hideTooltip();}
$('tray-toggle').onclick=()=>{trayPreference=$('tray-body').hidden;setTrayVisible(trayPreference);};
const shortViewport=window.matchMedia('(max-height:550px)');
function adaptTray(){if(trayPreference===null)setTrayVisible(!shortViewport.matches);}
shortViewport.addEventListener('change',adaptTray);adaptTray();
function confirmAction(title,text){const dialog=$('confirm-dialog');$('confirm-title').textContent=title;$('confirm-text').textContent=text;dialog.returnValue='cancel';dialog.showModal();return new Promise(resolve=>dialog.addEventListener('close',()=>resolve(dialog.returnValue==='ok'),{once:true}));}
async function discardIfNeeded(){return !model.dirty()||await confirmAction('Replace this scene?','You have unsaved changes. Export full scene JSON first to keep them, or continue to replace the working scene.');}
function cropped(rows,cols){return ['ground','overlay'].reduce((n,l)=>n+model.cells(l).flatMap((row,r)=>row.map((key,c)=>key!==null&&(r>=rows||c>=cols)?1:0)).reduce((a,b)=>a+b,0),0);}
$('resize').onclick=async()=>{
 try{const rows=Number($('rows').value),cols=Number($('cols').value);if(!Number.isInteger(rows)||!Number.isInteger(cols)||rows<1||cols<1||rows>64||cols>64)throw Error('Rows and columns must be integers from 1 to 64.');
 if(rows===grid().length&&cols===grid()[0].length){message('Map dimensions are unchanged.');return;}
 const count=cropped(rows,cols);if(count&&!await confirmAction('Shrink the map?',`${count} occupied cells fall outside the new dimensions. Continue to crop them?`))return;
 model.resize(rows,cols,brushes.ground);sync();fit();message('Map resized. Retained cells preserved; both layer histories reset.');
 }catch(e){message(e.message,true);}
};
$('apply').onclick=async()=>{if(busy)return;try{const next=migrateArray(JSON.parse($('map-json').value),currentAssets(),layer());if(layer()==='ground'&&(next.length!==grid().length||next[0].length!==grid()[0].length)){const count=cropped(next.length,next[0].length);if(count&&!await confirmAction('Change map dimensions?',`${count} occupied cells are outside the new dimensions. Layer histories will reset. Continue?`))return;}
 message(model.apply(next));sync();fit();}catch(e){message(e.message,true);}};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function jsonDownload(value,name){download(new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'}),name);}
$('export-json').onclick=()=>{const target=$('export-target').value;jsonDownload(model.export(target),'city-wonderer-'+target+'.json');if(target==='scene')model.markSaved();sync();message((target==='scene'?'Full scene':target)+' JSON exported.');};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(model.cells(),null,2));message('Active '+layer()+' array copied.');}catch{$('map-json').focus();$('map-json').select();message('Copy the selected array with Ctrl/Cmd+C.');}};
$('export-registry').onclick=()=>jsonDownload(currentAssets(),'city-wonderer-assets.json');
$('export-png').onclick=()=>{
 try{const target=$('export-target').value,keys=target==='scene'?[...model.state.ground.flat(),...model.state.overlays.flat()]:model.cells(target).flat();
 if(keys.some(k=>k!==null&&!assets.get(k)?.ready))throw Error('Fix missing assets before exporting.');
 const b=bounds(),width=b.right-b.left,height=b.bottom-b.top,scale=Math.min(1,8192/width,8192/height,Math.sqrt(32000000/(width*height)));
 const out=document.createElement('canvas');out.width=Math.ceil(width*scale);out.height=Math.ceil(height*scale);const c=out.getContext('2d');c.scale(scale,scale);c.translate(-b.left,-b.top);drawWorld(c,false,target);
 out.toBlob(blob=>{if(!blob){message('Could not create PNG.',true);return;}download(blob,'city-wonderer-'+target+'.png');message(`${target} PNG exported: ${out.width} × ${out.height}${scale<1?' (reduced to export limits)':''}.`);},'image/png');
 }catch(e){message(e.message,true);}
};
function crossingSample(){const ground=blank(11,11).map(row=>row.map(()=>'ground_pavement')),overlays=blank(11,11);
 for(let c=0;c<5;c++){ground[1][c]='road';ground[7][c]='road_4lane_straight_nw_se_sidewalk_ne';ground[8][c]='road_4lane_straight_nw_se_sidewalk_sw';}
 for(let r=0;r<5;r++)ground[r][8]='road_2lane_straight_ne_sw';
 for(let r=6;r<11;r++){ground[r][8]='road_4lane_straight_ne_sw_sidewalk_nw';ground[r][9]='road_4lane_straight_ne_sw_sidewalk_se';}
 overlays[1][2]='crosswalk_2lane_nw_se';overlays[2][8]='crosswalk_2lane_ne_sw';overlays[7][2]='crosswalk_4lane_nw_se_half_ne';overlays[8][2]='crosswalk_4lane_nw_se_half_sw';overlays[8][8]='crosswalk_4lane_ne_sw_half_nw';overlays[8][9]='crosswalk_4lane_ne_sw_half_se';
 return prepareScene({ground,overlays,tileSize:TILE_SIZE},currentAssets());
}
$('sample').onchange=async()=>{if(busy){$('sample').value=currentSample;return;}const choice=$('sample').value;if(choice==='imported')return;
 if(!await discardIfNeeded()){$('sample').value=currentSample;return;}
 model.replace(choice==='current'?{...clone(initial),assets:clone(currentAssets())}:crossingSample());currentSample=choice;hover=null;sync();fit();message('Sample loaded. Ground and Overlay histories reset.');};
$('import-json').onclick=()=>$('json-file').click();
$('json-file').onchange=async event=>{
 const file=event.target.files[0];if(!file)return;busy=true;message('Checking imported JSON…');
 try{const data=JSON.parse(await file.text()),target=$('import-target').value;
 if(target!=='scene'){
  const value=Array.isArray(data)?data:target==='ground'?data.ground:data.overlays;if(!value)throw Error('Choose an array for the selected layer.');
  const next=migrateArray(value,currentAssets(),target);if(target==='overlay'&&(next.length!==grid().length||next[0].length!==grid()[0].length))throw Error('Overlay dimensions must match Ground.');
  if(!await discardIfNeeded())return;const old=model.layer;model.layer=target;model.apply(next);setLayer(old);message(target+' array imported.');
 }else{
  const next=prepareScene(data,currentAssets(),dims()),staged=await stageAssets(next.assets);
  if(!await discardIfNeeded())return;model.replace(next);installAssets(staged);currentSample='imported';if(!$('sample').querySelector('option[value=imported]')){const option=document.createElement('option');option.value='imported';option.textContent='Imported scene';option.disabled=true;$('sample').append(option);}$('sample').value='imported';renderPalette();sync();fit();message('Scene imported. Known legacy keys and filenames migrated. Layer histories reset.');
 }
 }catch(e){message(e.message,true);}finally{busy=false;event.target.value='';}
};
for(const [id,label]of Object.entries(CATEGORY_LABELS)){if(['ground','ground/roads','ground/markings','props'].includes(id))continue;const option=document.createElement('option');option.value=id;option.textContent=categoryLabel(id);$('asset-category').append(option);}
$('add-open').onclick=()=>{$('add-error').textContent='';$('asset-layer').value=layer();$('asset-category').value=layer()==='overlay'?'ground/markings/2lane':'ground/terrain';$('add-dialog').showModal();};$('add-close').onclick=()=>$('add-dialog').close();
$('asset-key').oninput=()=>{keyEdited=true;};$('asset-file').oninput=()=>{const suggested=$('asset-file').value.split('/').pop().replace(/\.[^.]+$/,'').toLowerCase().replace(/[^a-z0-9_]+/g,'_');if(!keyEdited||$('asset-key').value===lastSuggestion){$('asset-key').value=suggested;keyEdited=false;}lastSuggestion=suggested;};
$('add-form').onsubmit=async e=>{e.preventDefault();const key=$('asset-key').value.trim();$('add-asset').disabled=true;
 try{if(!keyValid(key))throw Error('Use letters, numbers, underscores or hyphens; begin with a letter.');if(Object.hasOwn(currentAssets(),key)||Object.hasOwn(LEGACY_KEYS,key))throw Error('That key already exists or is a legacy alias.');
 const value={file:$('asset-file').value.trim(),label:$('asset-label').value.trim()||key,layer:$('asset-layer').value,category:$('asset-category').value};
 for(const [id,name]of [['logical-width','logicalWidth'],['logical-height','logicalHeight'],['asset-bleed','bleed']])if($(id).value!=='')value[name]=Number($(id).value);
 const entry=await loadAsset(key,value);model.register(key,value);assets.set(key,entry);$('add-dialog').close();$('asset-search').value='';model.layer=value.layer;brushes[value.layer]=key;folderState.set(value.category,true);activeCategories[value.layer]=value.category;renderPalette();sync();message('Asset added. Export full scene JSON or the asset list to retain its registration.');
 }catch(e){$('add-error').textContent=e.message;}finally{$('add-asset').disabled=false;}
};
window.addEventListener('beforeunload',e=>{if(model.dirty()){e.preventDefault();e.returnValue='';}});
sync();stageAssets(currentAssets(),true).then(staged=>{installAssets(staged);renderPalette();sync();fit();const failed=[...staged.values()].filter(a=>!a.ready);message(failed.length?'Some assets could not load:\n'+failed.map(a=>a.error).join('\n'):'Ready · '+staged.size+' catalog assets · your original city is preserved.',!!failed.length);}).catch(e=>{message(e.message,true);renderPalette();});
