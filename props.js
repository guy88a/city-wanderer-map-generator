import { ASSETS } from './catalog.js';
import { PROP_FAMILIES, PROP_VARIANTS } from './prop-catalog.js';
import { PROFILE_SIZE, PAVEMENT_PROFILES } from './tile-profiles.js';
import { tileCenter } from './geometry.js';
export { PROP_FAMILIES, PROP_VARIANTS };
export const DIRECTIONS=['nw','ne','se','sw'];
export const INWARD={nw:'se',ne:'sw',se:'nw',sw:'ne'};
const roadFacing={se:'sw',sw:'se',nw:'ne',ne:'nw'};
const masks=new Map(),inwardCache=new Map();
function maskFor(key){
 if(!PAVEMENT_PROFILES[key])return null;
 if(!masks.has(key)){const bytes=Uint8Array.from(PAVEMENT_PROFILES[key].split('').flatMap(c=>{const n=parseInt(c,16);return[8,4,2,1].map(b=>+(!!(n&b)));}));masks.set(key,bytes);}
 return masks.get(key);
}
export function pavementAt(key,u,v){const mask=maskFor(key);return !!mask&&u>=0&&v>=0&&u<1&&v<1&&!!mask[Math.floor(v*PROFILE_SIZE)*PROFILE_SIZE+Math.floor(u*PROFILE_SIZE)];}
export function footprintFits(key,u,v,family){
 const radius=(PROP_FAMILIES[family].radius+.08)/8;
 // Conservative square footprint plus curb clearance, sampled at mask resolution.
 const n=Math.ceil(2*radius*PROFILE_SIZE);
 for(let j=0;j<=n;j++)for(let i=0;i<=n;i++)if(!pavementAt(key,u-radius+2*radius*i/n,v-radius+2*radius*j/n))return false;
 return true;
}
const coordinates=[.045,.065,.09];
export const SLOTS=DIRECTIONS.flatMap(side=>coordinates.flatMap(inset=>[.045,.075,.25,.36,.5,.64,.75,.925,.955].map(t=>({
 id:`${side}-${Math.round(inset*1000)}-${Math.round(t*1000)}`,side,
 u:side==='nw'?inset:side==='se'?1-inset:t,
 v:side==='ne'?inset:side==='sw'?1-inset:t
}))));
function inwardAt(key,slot){
 if(key==='ground_pavement')return INWARD[slot.side];
 const cacheKey=key+':'+slot.id;if(inwardCache.has(cacheKey))return inwardCache.get(cacheKey);
 let nearest=null;
 // Find the closest asphalt sample inside this tile. Paint/seams have been removed from the profile.
 for(let j=2;j<PROFILE_SIZE-2;j+=3)for(let i=2;i<PROFILE_SIZE-2;i+=3){
  const u=(i+.5)/PROFILE_SIZE,v=(j+.5)/PROFILE_SIZE;if(pavementAt(key,u,v))continue;
  const du=u-slot.u,dv=v-slot.v,d=du*du+dv*dv;if(!nearest||d<nearest.d)nearest={du,dv,d};
 }
 const result=!nearest?INWARD[slot.side]:Math.abs(nearest.du)>Math.abs(nearest.dv)?nearest.du>0?'se':'nw':nearest.dv>0?'sw':'ne';inwardCache.set(cacheKey,result);return result;
}
// These curved-corner slots must follow their owning border, rather than
// an ambiguous nearest-asphalt sample near the outer corner.
const cornerInward={
 road_2lane_corner_nw_ne:{'se-65-750':'nw','sw-65-750':'ne'},
 road_2lane_corner_nw_sw:{'ne-65-750':'sw','se-65-250':'nw'}
};
function baseAutomaticFacing(key,slot,family){
 if(family==='vehicle'&&key==='road_2lane_cross'){
  // Physical diamond vertices: N=(0,0), E=(1,0), S=(1,1), W=(0,1).
  return slot.u<.5?(slot.v<.5?'se':'ne'):(slot.v<.5?'sw':'nw');
 }
 if(family==='streetlight'&&cornerInward[key]?.[slot.id])return cornerInward[key][slot.id];
 if(['stop','one_way'].includes(family)&&(
  key==='road_2lane_corner_nw_ne'&&slot.id==='se-65-750'||
  key==='road_2lane_corner_nw_sw'&&slot.id==='se-65-250'))return 'ne';
 const inward=inwardAt(key,slot);
 return ['streetlight','pedestrian'].includes(family)?inward:roadFacing[inward];
}
// On a straight road, a corner candidate can be tagged with a transverse
// tile edge even though it sits on the continuous sidewalk. Resolve the
// physical pavement strip from the road profile and UV coordinates instead.
function straightRoadPavement(key,slot){
 const profile=ASSETS[key];
 if(!profile?.axis||!(key==='road'||key.includes('_straight_')))return null;
 if(profile.sidewalk)return profile.sidewalk;
 return profile.axis==='ne_sw'?(slot.u<.5?'nw':'se'):(slot.v<.5?'ne':'sw');
}
const approachByPavement={nw:'ne',se:'sw',ne:'se',sw:'nw'};
function automaticFacing(key,slot,family){
 if(['vehicle','overhead','stop','one_way'].includes(family)){
  // Junction approaches belong to the road topology, not candidate-edge tags.
  const corner=slot.u<.5?(slot.v<.5?'north':'west'):(slot.v<.5?'east':'south');
  const approach=ASSETS[key]?.road_prop_approaches?.[corner];
  if(approach)return approach;
  const pavement=straightRoadPavement(key,slot);
  if(pavement)return approachByPavement[pavement];
 }
 const facing=baseAutomaticFacing(key,slot,family);
 // Preserve the explicitly mapped intersection vertices and all non-road props.
 if(key==='road_2lane_cross'||!['vehicle','overhead','stop','one_way'].includes(family))return facing;
 // Right-hand traffic: correct only the reversed NW/SE-border approaches.
 if(slot.side==='nw'&&facing==='sw')return 'ne';
 if(slot.side==='se'&&facing==='ne')return 'sw';
 return facing;
}
export function crossingIssue(scene,row,col){
 const key=scene.ground[row]?.[col],mark=scene.overlays[row]?.[col],d=scene.assets[mark];
 if(!d||d.recommended_ground!==key)return 'Pedestrian signals require a matching crosswalk.';
 if(!mark.startsWith('crosswalk_4lane'))return null;
 const side=scene.assets[key]?.sidewalk,dr=side==='ne'?1:side==='sw'?-1:0,dc=side==='nw'?1:side==='se'?-1:0;
 const other={ne:'sw',sw:'ne',nw:'se',se:'nw'}[side],r=row+dr,c=col+dc;
 if(!other||scene.overlays[r]?.[c]!==mark.replace(/_(ne|sw|nw|se)$/,'_'+other)||scene.assets[scene.overlays[r]?.[c]]?.recommended_ground!==scene.ground[r]?.[c])return 'Complete both matching halves of the 4-lane crossing first.';
 return null;
}
export function variantFor(prop){return PROP_VARIANTS[prop.family+'_'+prop.facing];}
export function artworkIssue(prop){
 const v=variantFor(prop);if(!v)return 'Missing artwork for this facing.';
 if(prop.family==='one_way'){
  const permitted=['ne','sw'].includes(prop.facing)?['nw','se']:['ne','sw'];
  if(!permitted.includes(prop.travel))return 'Choose travel along the sign plate axis.';
  if(v.visibleArrow&&v.visibleArrow!==prop.travel)return `Missing ${prop.facing.toUpperCase()} artwork with a ${prop.travel.toUpperCase()} arrow.`;
 }
 return null;
}
export function collisionIssue(scene,prop){
 for(const other of scene.props??[]){if(other.id===prop.id)continue;
  const d=Math.hypot(other.col+other.u-prop.col-prop.u,other.row+other.v-prop.row-prop.v);
  if(d<(PROP_FAMILIES[prop.family].radius+PROP_FAMILIES[other.family].radius+.12)/8)return 'Another prop occupies this footprint.';
 }
 return null;
}
function contextIssue(scene,prop){
 const key=scene.ground[prop.row]?.[prop.col],d=scene.assets[key];
 if(!PAVEMENT_PROFILES[key])return 'This ground tile has no approved pavement profile.';
 if(!footprintFits(key,prop.u,prop.v,prop.family))return 'Footprint is outside the pavement or too close to the curb.';
 if(prop.family!=='streetlight'&&!d?.category?.startsWith('ground/roads/'))return 'This prop requires a road tile with pavement.';
 if(['vehicle','overhead','stop'].includes(prop.family)&&d.axis&&!d.axis.split('_').includes(prop.facing))return 'Facing no longer matches the road approach.';
 if(['streetlight','overhead','pedestrian'].includes(prop.family)&&key!=='ground_pavement'){
  const expected=automaticFacing(key,{id:prop.slotId,side:prop.side,u:prop.u,v:prop.v},prop.family);
  if(prop.facing!==expected)return 'Facing no longer matches this pavement slot.';
 }
 if(prop.family==='pedestrian'){
  const issue=crossingIssue(scene,prop.row,prop.col);if(issue)return issue;
  const axis=d.axis,along=axis==='nw_se'?prop.u:prop.v;
  if(![.36,.64].includes(along))return 'Use the designated slots beside the crossing.';
 }
 return null;
}
export function propIssues(scene,prop){return [contextIssue(scene,prop),artworkIssue(prop),collisionIssue(scene,prop)].filter(Boolean);}
export function placementSlots(scene,row,col,family,options={}){
 if(!PROP_FAMILIES[family]||!scene.ground[row]?.[col])return [];
 const key=scene.ground[row][col],results=[];
 for(const slot of SLOTS){
  if(!footprintFits(key,slot.u,slot.v,family))continue;
  const autoFacing=automaticFacing(key,slot,family);
  const facing=options.approach&&options.approach!=='auto'&&!['streetlight','pedestrian','overhead'].includes(family)?options.approach:autoFacing;
  const state=PROP_FAMILIES[family].states.includes(options.state)?options.state:PROP_FAMILIES[family].states[0];
  const v=PROP_VARIANTS[family+'_'+facing];
  const travel=family==='one_way'?(options.travel&&options.travel!=='auto'?options.travel:v.visibleArrow??(['ne','sw'].includes(facing)?'se':'ne')):undefined;
  const prop={id:'preview',family,row,col,slotId:slot.id,u:slot.u,v:slot.v,side:slot.side,facing,state,...(travel?{travel}:{})};
  const issues=propIssues(scene,prop);
  // Suppress unusable context/footprint slots, but keep missing-art/collision slots visible in red.
  const context=contextIssue(scene,prop);if(context&&!context.startsWith('Facing'))continue;
  // Two insets support different curb widths; expose only one slot per side/longitudinal position.
  if(results.some(s=>s.side===slot.side&&(slot.side==='ne'||slot.side==='sw'?s.u===slot.u:s.v===slot.v)))continue;
  if(results.some(s=>Math.hypot(s.u-prop.u,s.v-prop.v)<.105))continue;
  results.push({...prop,issues,valid:issues.length===0});
 }
 return results;
}
export function validateProps(value,rows,cols){
 if(!Array.isArray(value)||value.length>20000)throw Error('Props must be an array of at most 20,000 instances.');
 const ids=new Set();return value.map(p=>{
  if(!p||typeof p!=='object'||!PROP_FAMILIES[p.family]||typeof p.id!=='string'||!p.id||p.id.length>120||ids.has(p.id))throw Error('Invalid or duplicate prop identity.');ids.add(p.id);
  if(!Number.isInteger(p.row)||!Number.isInteger(p.col)||p.row<0||p.col<0||p.row>=rows||p.col>=cols)throw Error('Prop tile is outside the map.');
  if(!DIRECTIONS.includes(p.facing)||!PROP_FAMILIES[p.family].states.includes(p.state))throw Error('Invalid prop facing or light state.');
  const slot=SLOTS.find(s=>s.id===p.slotId);
  if(!slot||p.u!==slot.u||p.v!==slot.v||p.side!==slot.side)throw Error('Prop must use a predefined slot and its recorded coordinates.');
  if(p.family==='one_way'&&!DIRECTIONS.includes(p.travel))throw Error('One-way signs need a travel direction.');
  return {id:p.id,family:p.family,row:p.row,col:p.col,slotId:p.slotId,u:p.u,v:p.v,side:p.side,facing:p.facing,state:p.state,...(p.family==='one_way'?{travel:p.travel}:{})};
 });
}
export function propGround(prop,size){const p=tileCenter(prop.row,prop.col,size.width,size.height);return{x:p.x+(prop.u-prop.v)*size.width/2,y:p.y+(prop.u+prop.v-1)*size.height/2};}
export function propRect(prop,size){const v=variantFor(prop),p=propGround(prop,size),s=size.width/512;return{left:p.x-v.anchor[0]*s,top:p.y-v.anchor[1]*s,width:v.canvas[0]*s,height:v.canvas[1]*s};}
export function sortedProps(scene){return [...scene.props].sort((a,b)=>{const pa=propGround(a,scene.tileSize),pb=propGround(b,scene.tileSize);return pa.y-pb.y||pa.x-pb.x||a.id.localeCompare(b.id);});}
export function sceneBounds(scene,bleed=0,target='scene'){
 const {width:w,height:h}=scene.tileSize;let b={left:-scene.ground.length*w/2-bleed,right:scene.ground[0].length*w/2+bleed,top:-h/2-bleed,bottom:(scene.ground.length+scene.ground[0].length-1)*h/2+bleed};
 if(target==='scene'||target==='props')for(const p of scene.props){const r=propRect(p,scene.tileSize);b={left:Math.min(b.left,r.left),right:Math.max(b.right,r.left+r.width),top:Math.min(b.top,r.top),bottom:Math.max(b.bottom,r.top+r.height)};}
 return b;
}
