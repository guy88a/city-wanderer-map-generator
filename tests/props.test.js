import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareScene,EditorModel} from '../model.js';
import {PROP_FAMILIES,PROP_VARIANTS,placementSlots,propIssues,propGround,propRect,sceneBounds,sortedProps,validateProps,footprintFits,crossingIssue} from '../props.js';
import {ASSETS} from '../catalog.js';
const scene=(key='road',mark=null)=>prepareScene({ground:[[key]],overlays:[[mark]]});
const instance=(s,f='vehicle',options={})=>{const {valid,issues,...p}=placementSlots(s,0,0,f,options).find(s=>s.valid);return {...p,id:'test-1'};};
test('every supplied body and overlay exists in both scales, registered with matching canvas',()=>{
 assert.equal(Object.keys(PROP_VARIANTS).length,24);let overlays=0;
 for(const v of Object.values(PROP_VARIANTS))for(const file of [v.file,...Object.values(v.overlays)]){
  const source=readFileSync(new URL('../assets/'+file,import.meta.url)),runtime=readFileSync(new URL('../assets/'+file.replace('/source_2x/','/runtime/'),import.meta.url));
  assert.deepEqual([source.readUInt32BE(16),source.readUInt32BE(20)],v.canvas);assert.deepEqual([runtime.readUInt32BE(16),runtime.readUInt32BE(20)],v.canvas.map(x=>x/2));
 }for(const v of Object.values(PROP_VARIANTS))overlays+=Object.keys(v.overlays).length;assert.equal(overlays,16);
});
test('legacy scenes gain an empty prop layer and preserve original tile arrays',()=>{const s=prepareScene([['R','P']]);assert.deepEqual(s.props,[]);assert.deepEqual(s.ground,[['road','ground_pavement']]);assert.equal(s.version,4);});
test('placement footprints stay on pavement for all shipped tile profiles',()=>{
 let count=0;
 for(const[key,d]of Object.entries(ASSETS))if(d.layer==='ground'){
  const s=scene(key);for(const f of Object.keys(PROP_FAMILIES))for(const p of placementSlots(s,0,0,f)){
   assert.ok(footprintFits(key,p.u,p.v,f));assert.ok(p.u>0&&p.u<1&&p.v>0&&p.v<1);count++;
  }
 }assert.ok(count>200);assert.equal(placementSlots(scene('grass'),0,0,'streetlight').length,0);
});
test('inward street lights, parallel traffic faces and crossing faces use correct side',()=>{
 const s=scene('road','crosswalk_2lane_nw_se');
 const get=(family,side)=>placementSlots(s,0,0,family).find(p=>p.side===side&&p.u===.5)||placementSlots(s,0,0,family).find(p=>p.side===side);
 assert.equal(get('streetlight','ne').facing,'sw');assert.equal(get('streetlight','sw').facing,'ne');
 assert.equal(get('overhead','ne').facing,'se');assert.equal(get('overhead','sw').facing,'nw');
 assert.equal(get('pedestrian','ne').facing,'sw');assert.equal(get('pedestrian','sw').facing,'ne');
});
test('multiple props and their history are independent of ground and markings',()=>{
 const m=new EditorModel(scene());m.addProp(instance(m.state));const second=placementSlots(m.state,0,0,'vehicle').find(p=>p.valid);const {issues,valid,...p}=second;m.addProp({...p,id:'test-2'});
 assert.equal(m.state.props.length,2);m.paint(0,0,'grass');m.layer='overlay';m.paint(0,0,'crosswalk_2lane_nw_se');m.layer='props';m.undo();assert.equal(m.state.props.length,1);assert.equal(m.state.ground[0][0],'grass');assert.ok(m.state.overlays[0][0]);m.redo();assert.equal(m.state.props.length,2);
 m.deleteProp('test-1');assert.equal(m.state.props.length,1);m.undo();assert.equal(m.state.props.length,2);
});
test('context edits retain invalid props and warnings disappear when ground is restored',()=>{
 const m=new EditorModel(scene());m.addProp(instance(m.state));const p=structuredClone(m.state.props[0]);m.paint(0,0,'grass');assert.deepEqual(m.state.props[0],p);assert.ok(propIssues(m.state,p).length);m.undo();assert.deepEqual(propIssues(m.state,p),[]);
});
test('occupied footprints are blocked and adjacent tile slots keep safe separation',()=>{
 const m=new EditorModel(prepareScene({ground:[['ground_pavement','ground_pavement']]}));const base=placementSlots(m.state,0,0,'streetlight').find(p=>p.side==='se'&&p.v===.5);const {valid,issues,...p}=base;m.addProp({...p,id:'a'});
 const other=placementSlots(m.state,0,1,'streetlight').find(p=>p.side==='nw'&&p.v===.5); 
 assert.ok(other?.valid);assert.ok(Math.hypot(other.col+other.u-p.col-p.u,other.row+other.v-p.row-p.v)>=(PROP_FAMILIES.streetlight.radius*2+.12)/8);
 assert.throws(()=>m.addProp({...p,id:'b'}),/occupies/);
});
test('one-way front artwork rejects unavailable arrows; rear supports either hidden arrow',()=>{
 const s=scene();let slots=placementSlots(s,0,0,'one_way',{approach:'se',travel:'sw'});assert.ok(slots.length);assert.ok(slots.every(s=>!s.valid&&s.issues.some(x=>x.includes('Missing'))));
 slots=placementSlots(s,0,0,'one_way',{approach:'se',travel:'ne'});assert.ok(slots.some(s=>s.valid));
 for(const travel of ['nw','se'])assert.ok(placementSlots(s,0,0,'one_way',{approach:'ne',travel}).some(s=>s.valid));
});
test('pedestrian placement requires the correct crossing and complete wide-road pairs',()=>{
 assert.equal(placementSlots(scene(),0,0,'pedestrian').length,0);assert.equal(placementSlots(scene('road','crosswalk_2lane_ne_sw'),0,0,'pedestrian').length,0);
 const s=prepareScene({ground:[['road_4lane_straight_nw_se_sidewalk_ne'],['road_4lane_straight_nw_se_sidewalk_sw']],overlays:[['crosswalk_4lane_nw_se_half_ne'],[null]]});
 assert.match(crossingIssue(s,0,0),/both/);s.overlays[1][0]='crosswalk_4lane_nw_se_half_sw';assert.equal(crossingIssue(s,0,0),null);assert.ok(placementSlots(s,0,0,'pedestrian').some(s=>s.valid));
});
test('off body and state are one logical instance; rear state survives round trips',()=>{
 const m=new EditorModel(scene());m.addProp(instance(m.state,'vehicle',{approach:'nw',state:'green'}));m.layer='props';m.updateProp('test-1',{state:'red'});assert.equal(m.state.props.length,1);assert.equal(m.state.props[0].state,'red');assert.deepEqual(prepareScene(m.export()).props,m.state.props);m.undo();assert.equal(m.state.props[0].state,'green');assert.deepEqual(m.export('props'),m.state.props);
});
test('invalid imports are atomic, including IDs, states, coordinates and out-of-map tiles',()=>{
 const m=new EditorModel(scene());m.addProp(instance(m.state));const before=m.signature();m.layer='props';const p=m.state.props[0];
 for(const next of [[p,p],[{...p,state:'blue'}],[{...p,u:.5}],[{...p,row:2}]])assert.throws(()=>m.apply(next));assert.equal(m.signature(),before);assert.equal(m.histories.props.undo.length,1);
});
test('full and half scales share anchors, depth and bounds include the whole tall sprite',()=>{
 const s=scene();const p=instance(s,'streetlight');s.props=[p];const a=propRect(p,s.tileSize),ground=propGround(p,s.tileSize),b=sceneBounds(s);assert.ok(b.top<=a.top&&b.left<=a.left&&b.right>=a.left+a.width);assert.ok(a.top<ground.y-200);
 s.tileSize={width:256,height:128};const half=propRect(p,s.tileSize);for(const k of ['left','top','width','height'])assert.equal(half[k],a[k]/2);
 const q={...p,id:'q',row:1};s.props=[q,p];assert.equal(sortedProps(s)[0].id,p.id);
});
test('shrinking crops out-of-map props only and clears all histories',()=>{
 const m=new EditorModel(prepareScene({ground:[['road','road']]}));const p=instance(m.state);m.addProp(p);m.addProp({...p,id:'far',col:1});m.resize(1,1,null);assert.deepEqual(m.state.props.map(p=>p.id),['test-1']);assert.equal(m.histories.props.undo.length,0);
});

test('changing the road axis flags retained traffic facing even where its base still fits',()=>{
 const s=scene(),p=instance(s);s.props=[p];s.ground[0][0]='road_2lane_straight_ne_sw';assert.ok(propIssues(s,p).some(x=>x.includes('Facing')||x.includes('Footprint')));
});

test('curved corner lamps follow the correct borders at both anchor-adjacent slots',()=>{
 const cases=[['road_2lane_corner_nw_ne',{'se-65-750':'nw','sw-65-750':'ne','se-65-500':'nw','sw-65-500':'ne'}],['road_2lane_corner_nw_sw',{'ne-65-750':'sw','se-65-250':'nw','ne-65-500':'sw','se-65-500':'nw'}]];
 for(const [key,expected]of cases){const s=scene(key),slots=placementSlots(s,0,0,'streetlight');for(const [id,facing]of Object.entries(expected)){const p=slots.find(p=>p.slotId===id);assert.ok(p?.valid,id);assert.equal(p.facing,facing);assert.deepEqual(propIssues(s,p),[]);}}
});
test('corner road signs retain road-facing orientation at the right anchor sibling',()=>{
 for(const[key,id]of [['road_2lane_corner_nw_ne','se-65-750'],['road_2lane_corner_nw_sw','se-65-250']])for(const family of ['stop','one_way']){
  const s=scene(key),p=placementSlots(s,0,0,family).find(p=>p.slotId===id);assert.ok(p?.valid);assert.equal(p.facing,'sw');
  const m=new EditorModel(s);m.addProp({...p,id:'sign'});assert.equal(prepareScene(m.export()).props[0].facing,'sw');
 }
});
test('crossroad vehicle lights follow right-hand traffic at all four diamond corners',()=>{
 const s=scene('road_2lane_cross'),slots=placementSlots(s,0,0,'vehicle');assert.equal(slots.length,4);
 const directions={n:'se',s:'nw',w:'ne',e:'sw'};
 for(const p of slots){const corner=p.u<.5?(p.v<.5?'n':'w'):(p.v<.5?'e':'s');assert.equal(p.facing,directions[corner]);assert.ok(p.valid);}
 assert.ok(placementSlots(s,0,0,'vehicle',{approach:'nw'}).every(p=>p.facing==='nw'));
});
test('straight-road endpoint fix changes only the eight affected automatic facings',()=>{
 const baseline=JSON.parse(readFileSync(new URL('./placement-v402-baseline.json',import.meta.url)));let changed=0;
 for(const {key,family,slots:before}of baseline){
  const expected=before.map(p=>{
   if(['road_2lane_straight_ne_sw','road_4lane_straight_ne_sw_sidewalk_se'].includes(key)&&['vehicle','overhead','stop','one_way'].includes(family)&&p.slotId===(family==='overhead'?'ne-65-925':'ne-45-925')){changed++;return {...p,facing:'sw'};}
   return p;
  });
  assert.deepEqual(placementSlots(scene(key),0,0,family),expected,key+'/'+family);
 }
 assert.equal(changed,8);
});
test('two- and four-lane straight road props follow right-hand traffic on NW/SE pavement',()=>{
 for(const key of ['road_2lane_straight_ne_sw','road_4lane_straight_ne_sw_sidewalk_nw','road_4lane_straight_ne_sw_sidewalk_se'])for(const family of ['vehicle','overhead','stop','one_way']){
  const s=scene(key),slots=placementSlots(s,0,0,family).filter(p=>p.valid&&(p.side==='nw'||p.side==='se'));
  assert.ok(slots.length);
  for(const p of slots){assert.equal(p.facing,p.side==='nw'?'ne':'sw');assert.deepEqual(propIssues(s,p),[]);}
 }
});
test('manual approach and one-way travel choices remain explicit overrides',()=>{
 const s=scene('road_2lane_straight_ne_sw');
 for(const family of ['vehicle','stop','one_way'])for(const approach of ['ne','sw']){
  const slots=placementSlots(s,0,0,family,{approach,travel:'se'});assert.ok(slots.length);
  assert.ok(slots.every(p=>p.facing===approach));
  if(family==='one_way')assert.ok(slots.every(p=>p.travel==='se'));
 }
});

test('every physical sidewalk on every straight-road profile has a uniform automatic road-prop facing, including endpoints',()=>{
 const profiles=[['road',p=>p.v<.5?'se':'nw'],['road_2lane_straight_ne_sw',p=>p.u<.5?'ne':'sw'],['road_4lane_straight_nw_se_sidewalk_ne',()=> 'se'],['road_4lane_straight_nw_se_sidewalk_sw',()=> 'nw'],['road_4lane_straight_ne_sw_sidewalk_nw',()=> 'ne'],['road_4lane_straight_ne_sw_sidewalk_se',()=> 'sw']];
 for(const [key,expected]of profiles)for(const family of ['vehicle','overhead','stop','one_way']){
  const s=scene(key),slots=placementSlots(s,0,0,family);assert.ok(slots.length>5);
  for(const p of slots){assert.equal(p.facing,expected(p),key+'/'+family+'/'+p.slotId);assert.ok(p.valid);}
 }
});
