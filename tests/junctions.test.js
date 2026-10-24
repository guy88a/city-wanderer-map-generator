import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {ASSETS} from '../catalog.js';
import {MAP,OVERLAYS,PROPS,TILE_SIZE} from '../config.js';
import {prepareScene,EditorModel} from '../model.js';
import {PAVEMENT_PROFILES} from '../tile-profiles.js';
import {placementSlots} from '../props.js';
const layouts=JSON.parse(readFileSync(new URL('../examples/junction-layouts.json',import.meta.url)));
test('all four mixed T facings register four independently placeable padded tiles with prop profiles',()=>{
 for(const [facing,layout] of Object.entries(layouts)){
  assert.equal(layout.length,2);assert.ok(layout.every(row=>row.length===2));
  const ground=layout,scene=prepareScene({ground});let slots=0;
  for(let row=0;row<2;row++)for(let col=0;col<2;col++){
   const key=layout[row][col],asset=ASSETS[key];assert.ok(key.includes('_branch_'+facing+'_'));
   assert.equal(asset.layer,'ground');assert.equal(asset.category,'ground/roads/2lane');
   assert.ok(existsSync(new URL('../assets/'+asset.file,import.meta.url)));
   const png=readFileSync(new URL('../assets/'+asset.file,import.meta.url));
   assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[514,258]);
   assert.equal(PAVEMENT_PROFILES[key].length,4096);
   slots+=placementSlots(scene,row,col,'streetlight').filter(s=>s.valid).length;
  }
  assert.ok(slots>0,'streetlight placement on '+facing+' sidewalks');
 }
});
test('config defines an independent default props list and nonempty scene defaults survive prepare/reset',()=>{
 assert.ok(Array.isArray(PROPS));
 const initial=prepareScene({ground:MAP,overlays:OVERLAYS,props:PROPS,tileSize:TILE_SIZE});
 assert.deepEqual(initial.props,PROPS);
 const scene=prepareScene({ground:[['road']]});
 const {issues,valid,...slot}=placementSlots(scene,0,0,'streetlight').find(s=>s.valid);
 const props=[{...slot,id:'default-lamp'}];
 const seeded=prepareScene({ground:[['road']],props});
 const model=new EditorModel(seeded);model.deleteProp('default-lamp');assert.equal(model.state.props.length,0);
 model.replace(seeded);assert.deepEqual(model.state.props,props);assert.deepEqual(props,[{...slot,id:'default-lamp'}]);
});
