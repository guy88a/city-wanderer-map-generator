import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ASSETS,LEGACY_KEYS,LEGACY_FILES} from '../catalog.js';
import {MAP,OVERLAYS,TILE_SIZE} from '../config.js';
import {EditorModel,prepareScene,migrateArray,canonicalFile,descriptor} from '../model.js';
import {assetGeometry,tileCenter,cellAt} from '../geometry.js';
const make=()=>new EditorModel(prepareScene({ground:MAP,overlays:OVERLAYS,tileSize:TILE_SIZE}));
test('complete filename migration preserves every image byte and original positions',()=>{
 const dictionary=JSON.parse(readFileSync(new URL('../asset-rename-map.json',import.meta.url)));
 assert.equal(dictionary.files.length,53);assert.equal(new Set(dictionary.files.map(f=>f.new_file)).size,53);assert.equal(Object.keys(ASSETS).length,47);
 for(const f of dictionary.files){const bytes=readFileSync(new URL('../'+f.new_file,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),f.sha256);}
 const reverse=Object.fromEntries(Object.entries(LEGACY_KEYS).map(([a,b])=>[b,a]));const old=MAP.map(row=>row.map(k=>reverse[k]));assert.deepEqual(migrateArray(old,ASSETS,'ground'),MAP);assert.equal(MAP.flat().length,100);
 assert.equal(ASSETS.grass.file.split('/').pop(),'grass.png');assert.equal(ASSETS.road.file.split('/').pop(),'road.png');
});
test('independent histories never rewind the other layer',()=>{
 const m=make();m.paint(0,0,'grass');m.layer='overlay';m.paint(0,0,'crosswalk_2lane_nw_se');m.layer='ground';m.undo();assert.equal(m.state.ground[0][0],MAP[0][0]);assert.equal(m.state.overlays[0][0],'crosswalk_2lane_nw_se');
 m.redo();assert.equal(m.state.ground[0][0],'grass');m.layer='overlay';m.undo();assert.equal(m.state.overlays[0][0],null);assert.equal(m.state.ground[0][0],'grass');
});
test('drag gesture can group changes in one undo',()=>{const m=make();m.paint(0,0,'grass',true);m.paint(0,1,'grass',false);m.undo();assert.deepEqual(m.state.ground,MAP);});
test('invalid arrays leave histories and scene untouched',()=>{const m=make();m.paint(0,0,'grass');const before=m.signature();const count=m.histories.ground.undo.length;
 assert.throws(()=>m.apply([['missing_key']]));assert.equal(m.signature(),before);assert.equal(m.histories.ground.undo.length,count);
 m.layer='overlay';assert.throws(()=>m.apply([[null]]));assert.equal(m.signature(),before);
});
test('resize keeps nulls and surviving cells; resets both histories',()=>{const m=make();m.paint(0,0,null);m.layer='overlay';m.paint(0,0,'crosswalk_2lane_nw_se');m.resize(11,12,'grass');assert.equal(m.state.ground[0][0],null);assert.equal(m.state.ground[10][11],'grass');assert.equal(m.state.overlays[0][0],'crosswalk_2lane_nw_se');assert.equal(m.state.overlays[10][11],null);assert.equal(m.histories.ground.undo.length,0);assert.equal(m.histories.overlay.undo.length,0);});
test('legacy scene keys and filenames normalize; unknowns fail before commit',()=>{
 const original=make(),next=prepareScene({ground:[['R','P']],assets:{R:'road.png',P:'pavement.png'},tileSize:{width:256,height:128}});
 assert.deepEqual(next.ground,[['road','ground_pavement']]);assert.equal(next.assets.ground_pavement.file,LEGACY_FILES['pavement.png']);assert.equal(next.tileSize.width,256);
 const before=original.signature();assert.throws(()=>prepareScene({ground:[['not_registered']]}));assert.equal(original.signature(),before);
 assert.throws(()=>canonicalFile('../app.js'));assert.throws(()=>canonicalFile('folder%2f..%2f..%2fapp.js'));assert.throws(()=>canonicalFile('https://outside.invalid/tile.png'));
});
test('scene round trip keeps tile size, catalog metadata, layers and export scope',()=>{const m=make();m.state.tileSize={width:256,height:128};m.layer='overlay';m.paint(1,1,'crosswalk_2lane_nw_se');const next=prepareScene(JSON.parse(JSON.stringify(m.export())));assert.deepEqual(next,m.state);assert.deepEqual(m.export('ground'),m.state.ground);assert.deepEqual(m.export('overlay'),m.state.overlays);});
test('logical and padded sizes share cell centers',()=>{assert.deepEqual(assetGeometry(514,258),{width:512,height:256,bleed:1});assert.deepEqual(assetGeometry(258,130),{width:256,height:128,bleed:1});for(const [r,c]of [[0,0],[4,7],[9,9]]){const p=tileCenter(r,c,512,256);assert.deepEqual(cellAt(p.x,p.y,512,256),{row:r,col:c});}});
test('custom registrations using canonical image paths retain their distinct keys on round trip',()=>{
 const m=make();m.register('my_grass',{file:'ground/terrain/grass.png',label:'My grass copy',category:'ground/terrain',layer:'ground'});m.paint(0,0,'my_grass');
 const next=prepareScene(m.export());assert.equal(next.ground[0][0],'my_grass');assert.equal(next.assets.my_grass.label,'My grass copy');assert.equal(next.assets.grass.label,'Grass');
});

test('filename-only catalog entries normalize without leaking string indices',()=>{
 ASSETS.simple_string='ground/terrain/grass.png';
 try{const d=descriptor(ASSETS.simple_string,'simple_string');assert.equal(d.file,'ground/terrain/grass.png');assert.equal(d.layer,'ground');assert.equal(Object.hasOwn(d,'0'),false);}finally{delete ASSETS.simple_string;}
});
