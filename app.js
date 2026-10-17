import { ASSETS, MAP, TILE_SIZE } from './config.js';
import { assetGeometry, tileCenter, cellAt, validateMap } from './geometry.js';

const $ = id => document.getElementById(id);
const canvas=$('canvas'), ctx=canvas.getContext('2d'), viewport=$('viewport');
const W=TILE_SIZE.width,H=TILE_SIZE.height;
if (!(W>0 && H>0 && W/H===2)) throw Error('TILE_SIZE must have a positive 2:1 logical size.');
let map=validateMap(MAP), brush=Object.keys(ASSETS)[0]??null;
let zoom=1,pan={x:0,y:0},hover=null,space=false,gesture=null,lastCell='';
const assets=new Map(),undo=[],redo=[];
let cssWidth=0,cssHeight=0,dpr=1;
const copy = value => value.map(row=>[...row]);
function message(text,error=false){$('message').textContent=text;$('message').classList.toggle('error',error);}
function history(){undo.push(copy(map));if(undo.length>100)undo.shift();redo.length=0;}
function sync(){
 $('map-json').value=JSON.stringify(map,null,2);$('rows').value=map.length;$('cols').value=map[0].length;
 $('undo').disabled=!undo.length;$('redo').disabled=!redo.length;
 draw();
}
function center(row,col){return tileCenter(row,col,W,H);}
function maxBleed(){return Math.max(0,...[...assets.values()].filter(a=>a.ready).map(a=>a.geom.bleed*W/a.geom.width));}
function bounds(){const p=maxBleed();return {left:-map.length*W/2-p,right:map[0].length*W/2+p,top:-H/2-p,bottom:(map.length+map[0].length-1)*H/2+p};}
function diamond(c,x,y){c.beginPath();c.moveTo(x,y-H/2);c.lineTo(x+W/2,y);c.lineTo(x,y+H/2);c.lineTo(x-W/2,y);c.closePath();}
function valid(cell){return cell&&cell.row>=0&&cell.col>=0&&cell.row<map.length&&cell.col<map[0].length;}
function drawWorld(c,guides=false){
 c.imageSmoothingEnabled=$('smooth').checked;
 // Depth order is deterministic; grid spacing NEVER uses image dimensions.
 for(let sum=0;sum<map.length+map[0].length-1;sum++){
  for(let row=0;row<map.length;row++){
   const col=sum-row;if(col<0||col>=map[0].length)continue;
   const key=map[row][col],a=assets.get(key),p=center(row,col);
   if(a?.ready){
    const width=a.image.naturalWidth/a.geom.width*W;
    const height=a.image.naturalHeight/a.geom.height*H;
    // A symmetric bleed canvas shares its center with the logical diamond.
    c.drawImage(a.image,p.x-width/2,p.y-height/2,width,height);
   }else if(key!==null){
    diamond(c,p.x,p.y);c.fillStyle='#9e3f5960';c.fill();
    c.fillStyle='#ffbdcb';c.font=`${Math.round(H*.11)}px monospace`;c.textAlign='center';c.fillText(`Missing: ${key}`,p.x,p.y);
   }
  }
 }
 if(guides){
  for(let row=0;row<map.length;row++)for(let col=0;col<map[0].length;col++){
   const p=center(row,col);
   if($('grid').checked){diamond(c,p.x,p.y);c.strokeStyle='#c7d7ed70';c.lineWidth=1/zoom;c.stroke();}
   if($('labels').checked){c.font=`${Math.round(H*.1)}px monospace`;c.textAlign='center';c.fillStyle='#101722cc';c.fillRect(p.x-W*.17,p.y-H*.09,W*.34,H*.18);c.fillStyle='#eef5ff';c.fillText(`${row},${col} · ${map[row][col]??'∅'}`,p.x,p.y+H*.035);}
  }
  if(valid(hover)){const p=center(hover.row,hover.col);diamond(c,p.x,p.y);c.fillStyle='#e0f6b91f';c.fill();c.strokeStyle='#d6f6b0';c.lineWidth=2/zoom;c.stroke();}
 }
}
function draw(){
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cssWidth,cssHeight);
 ctx.translate(pan.x,pan.y);ctx.scale(zoom,zoom);drawWorld(ctx,true);
 $('zoom-label').value=`${Math.round(zoom*100)}%`;
 $('stats').textContent=`${map.length} × ${map[0].length} cells · ${W} × ${H} logical px · Brush: ${brush??'erase'}`;
 $('hover').textContent=valid(hover)?`row ${hover.row}, column ${hover.col} · ${map[hover.row][hover.col]??'empty'}`:'—';
}
function fit(){const b=bounds();zoom=Math.max(.02,Math.min(2,(cssWidth-64)/(b.right-b.left),(cssHeight-64)/(b.bottom-b.top)));pan={x:cssWidth/2-(b.left+b.right)*zoom/2,y:cssHeight/2-(b.top+b.bottom)*zoom/2};draw();}
function resizeCanvas(){const oldW=cssWidth,oldH=cssHeight;cssWidth=viewport.clientWidth;cssHeight=viewport.clientHeight;dpr=window.devicePixelRatio||1;canvas.width=Math.round(cssWidth*dpr);canvas.height=Math.round(cssHeight*dpr);if(!oldW)fit();else{pan.x+=(cssWidth-oldW)/2;pan.y+=(cssHeight-oldH)/2;draw();}}
new ResizeObserver(resizeCanvas).observe(viewport);
function local(event){const r=canvas.getBoundingClientRect();return {x:event.clientX-r.left,y:event.clientY-r.top};}
function hit(event){const p=local(event);return cellAt((p.x-pan.x)/zoom,(p.y-pan.y)/zoom,W,H);}
function paint(cell){
 if(!valid(cell))return;const id=`${cell.row},${cell.col}`;if(id===lastCell)return;lastCell=id;
 if(map[cell.row][cell.col]===brush)return;
 if(!gesture.changed){history();gesture.changed=true;}
 map[cell.row][cell.col]=brush;sync();
}
canvas.addEventListener('pointerdown',e=>{
 if(e.button!==0&&e.button!==1)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);
 gesture={mode:space||e.button===1?'pan':'paint',point:local(e),origin:{...pan},changed:false};lastCell='';
 if(gesture.mode==='paint')paint(hit(e));
});
canvas.addEventListener('pointermove',e=>{
 hover=hit(e);
 if(gesture?.mode==='pan'){const p=local(e);pan={x:gesture.origin.x+p.x-gesture.point.x,y:gesture.origin.y+p.y-gesture.point.y};}
 else if(gesture?.mode==='paint')paint(hover);
 draw();
});
function endGesture(){gesture=null;lastCell='';}
canvas.addEventListener('pointerup',endGesture);canvas.addEventListener('pointercancel',endGesture);canvas.addEventListener('lostpointercapture',endGesture);
canvas.addEventListener('pointerleave',()=>{hover=null;draw();});
function zoomAt(factor,p={x:cssWidth/2,y:cssHeight/2}){const next=Math.max(.02,Math.min(6,zoom*factor)),ratio=next/zoom;pan.x=p.x-(p.x-pan.x)*ratio;pan.y=p.y-(p.y-pan.y)*ratio;zoom=next;draw();}
canvas.addEventListener('wheel',e=>{e.preventDefault();zoomAt(Math.exp(-e.deltaY*.0015),local(e));},{passive:false});
$('zoom-in').onclick=()=>zoomAt(1.25);$('zoom-out').onclick=()=>zoomAt(.8);$('fit').onclick=fit;
for(const id of ['grid','labels','smooth'])$(id).onchange=draw;
$('checker').onchange=()=>viewport.classList.toggle('checker',$('checker').checked);
function select(key){brush=key;for(const b of $('assets').children)b.classList.toggle('selected',b.dataset.key===key);$('erase').classList.toggle('selected',key===null);draw();}
$('erase').onclick=()=>select(null);
$('undo').onclick=()=>{if(!undo.length)return;redo.push(copy(map));map=undo.pop();sync();};
$('redo').onclick=()=>{if(!redo.length)return;undo.push(copy(map));map=redo.pop();sync();};
window.addEventListener('keydown',e=>{
 if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;
 if(e.code==='Space'){e.preventDefault();space=true;canvas.style.cursor='grab';}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();$(e.shiftKey?'redo':'undo').click();}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();$('redo').click();}
 if(e.key==='0')select(null);const n=Number(e.key);if(n>=1&&n<=9){const k=Object.keys(ASSETS)[n-1];if(k)select(k);}
});
window.addEventListener('keyup',e=>{if(e.code==='Space'){space=false;canvas.style.cursor='';}});
window.addEventListener('blur',()=>{space=false;endGesture();canvas.style.cursor='';});
$('apply').onclick=()=>{
 try{const next=validateMap(JSON.parse($('map-json').value));history();map=next;sync();fit();const missing=[...new Set(map.flat().filter(k=>k!==null&&!assets.get(k)?.ready))];message(missing.length?`Missing asset keys: ${missing.join(', ')}`:'Map applied.',!!missing.length);}catch(e){message(e.message,true);}
};
$('resize').onclick=()=>{
 const rows=Number($('rows').value),cols=Number($('cols').value);
 if(!Number.isInteger(rows)||!Number.isInteger(cols)||rows<1||cols<1||rows>64||cols>64){message('Rows and columns must be integers from 1 to 64.',true);return;}
 history();map=Array.from({length:rows},(_,r)=>Array.from({length:cols},(_,c)=>r<map.length&&c<map[r].length?map[r][c]:brush));sync();fit();message('Existing cells retained; new cells use the selected brush.');
};
$('reset').onclick=()=>{history();map=validateMap(MAP);sync();fit();message('Sample restored.');};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
$('export-json').onclick=()=>download(new Blob([JSON.stringify(map,null,2)+'\n'],{type:'application/json'}),'city-wonderer-map.json');
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(map,null,2));message('Map array copied.');}catch{ $('map-json').focus();$('map-json').select();message('Copy the selected array with Ctrl/Cmd+C.');}};
$('export-png').onclick=()=>{
 if(map.flat().some(k=>k!==null&&!assets.get(k)?.ready)){message('Fix missing assets before exporting a PNG.',true);return;}
 const b=bounds(),width=b.right-b.left,height=b.bottom-b.top;
 const scale=Math.min(1,8192/width,8192/height,Math.sqrt(32000000/(width*height)));
 const out=document.createElement('canvas');out.width=Math.ceil(width*scale);out.height=Math.ceil(height*scale);
 const c=out.getContext('2d');c.scale(scale,scale);c.translate(-b.left,-b.top);drawWorld(c,false);
 out.toBlob(blob=>{if(!blob){message('Could not create PNG.',true);return;}download(blob,'city-wonderer-map.png');message(`Transparent PNG exported: ${out.width}×${out.height}${scale<1?' (scaled to fit export limits)':''}.`);},'image/png');
};

async function loadAssets(){
 $('asset-count').textContent=Object.keys(ASSETS).length;
 const errors=[];
 await Promise.all(Object.entries(ASSETS).map(async([key,value])=>{
  const descriptor=typeof value==='string'?{file:value}:value;
  const button=document.createElement('button');button.className='asset';button.dataset.key=key;
  const img=document.createElement('img');img.alt='';
  const text=document.createElement('span'),title=document.createElement('strong'),detail=document.createElement('small');
  title.textContent=`${key} · ${descriptor.label??descriptor.file}`;detail.textContent='Loading…';text.append(title,detail);button.append(img,text);$('assets').append(button);button.onclick=()=>select(key);
  const entry={descriptor,image:new Image(),ready:false};assets.set(key,entry);
  try{
   if(!descriptor.file)throw Error('Missing filename.');
   const base=new URL('./assets/',import.meta.url),url=new URL(descriptor.file,base);
   if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))throw Error('Use a filename inside assets/.');
   await new Promise((resolve,reject)=>{entry.image.onload=resolve;entry.image.onerror=()=>reject(Error(`Cannot load assets/${descriptor.file}`));entry.image.src=url.href;});
   entry.geom=assetGeometry(entry.image.naturalWidth,entry.image.naturalHeight,descriptor);entry.ready=true;img.src=url.href;
   detail.textContent=`${entry.image.naturalWidth}×${entry.image.naturalHeight} · bleed ${entry.geom.bleed}px`;
  }catch(e){detail.textContent=e.message;button.disabled=true;errors.push(`${key}: ${e.message}`);}
 }));
 select(brush);sync();fit();message(errors.length?errors.join('\n'):'Assets loaded. Choose a tile and paint, or edit the map array.',!!errors.length);
}
sync();loadAssets().catch(e=>message(e.message,true));
