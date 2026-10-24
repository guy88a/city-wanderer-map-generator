"""Derive four facings in square material coordinates, then project/slice.
Run with Python + Pillow/numpy/scipy. No finished diamond is rotated.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image,ImageDraw,ImageFont
from scipy.ndimage import map_coordinates
ROOT=Path(__file__).resolve().parent
PROJECT=ROOT.parent.parent
OUT=PROJECT/'assets/ground/roads/2lane'
def load(p):return np.asarray(Image.open(p).convert('RGB'),dtype=np.float32)
master=np.asarray(Image.open(ROOT/'junction_material_master.png').convert('RGB'))
A=load(ROOT/'references/main_a_material.png');B=load(ROOT/'references/main_b_material.png')
S=load(ROOT/'references/straight_material.png');P=load(ROOT/'references/pavement_material.png')
AB=np.concatenate([A,B],0)
def sample(t,u,v):
 h,w=t.shape[:2];sx=np.clip(u*w-.5,0,w-1);sy=np.clip(v*h-.5,0,h-1)
 return np.stack([map_coordinates(t[:,:,c],[sy,sx],order=1,mode='nearest')for c in range(3)],-1)
def canonical(gx,gy):
 rgb=sample(master,gx/2,gy/2)
 rgb=np.where((gx<0)[:,:,None],sample(AB,np.mod(gx,1),gy/2),rgb)
 rgb=np.where((gx>2)[:,:,None],sample(P,np.mod(gx,1),np.mod(gy,1)),rgb)
 outside=(gy<0)|(gy>2)
 neighbor=sample(S,np.mod(gy,1),gx-1)
 neighbor=np.where((gx<1)[:,:,None],sample(P,np.mod(gx,1),np.mod(gy,1)),neighbor)
 return np.where(outside[:,:,None],neighbor,rgb)
def inverse(f,x,y):
 if f=='nw':return x,y
 if f=='ne':return y,x
 if f=='se':return 2-x,2-y
 return 2-y,2-x
mask=np.asarray(Image.open(ROOT/'road_mask.png'))>=128
def oriented_mask(f):
 if f=='nw':return mask
 if f=='ne':return mask.T
 if f=='se':return mask[::-1,::-1]
 return mask[::-1,::-1].T
def project(f,c,r):
 ss=4;w,h=514,258;sy,sx=np.mgrid[:h*ss,:w*ss]
 px=(sx+.5)/ss-1;py=(sy+.5)/ss-1
 u=(py/128+(px-256)/256)/2;v=(py/128-(px-256)/256)/2
 gx,gy=inverse(f,c+u,r+v)
 rgb=canonical(gx,gy).reshape(h,ss,w,ss,3).mean((1,3))
 im=Image.fromarray(np.clip(rgb,0,255).round().astype('uint8')).convert('RGBA')
 im.putalpha(Image.open(ROOT/'references/iso_tile_template_514_white.png').getchannel('A'))
 return im
entries={};layouts={};scenes={};validation={}
for f in ['nw','ne','se','sw']:
 layout=[];pieces={};m=oriented_mask(f);N=mask.shape[0]//2
 for r in range(2):
  line=[]
  for c in range(2):
   x,y=inverse(f,c+.5,r+.5)
   role='approach' if x<1 else 'street'
   half=('ne' if y<1 else 'sw') if f in ['nw','se'] else ('nw' if y<1 else 'se')
   if f=='se':half='sw' if y<1 else 'ne'
   if f=='sw':half='se' if y<1 else 'nw'
   key=f'road_2lane_t_4lane_branch_{f}_{role}_{half}'
   im=project(f,c,r);im.save(OUT/(key+'.png'));pieces[r,c]=im
   cell=m[r*N:(r+1)*N,c*N:(c+1)*N]
   edges={'nw':cell[:,0],'se':cell[:,-1],'ne':cell[0,:],'sw':cell[-1,:]}
   entries[key]={'label':f'2-lane T · 4-lane branch {f.upper()} · {role} {half.upper()}', 'category':'ground/roads/2lane','layer':'ground','file':f'ground/roads/2lane/{key}.png','open_edges':[e for e,a in edges.items() if a.any()]}
   line.append(key)
  layout.append(line)
 layouts[f]=layout
 # Every internal road-mask interface and closed side of the T.
 for r in range(2):assert np.array_equal(m[r*N:(r+1)*N,N-1],m[r*N:(r+1)*N,N])
 for c in range(2):assert np.array_equal(m[N-1,c*N:(c+1)*N],m[N,c*N:(c+1)*N])
 closed={'nw':m[:,-1],'ne':m[-1,:],'se':m[:,0],'sw':m[0,:]}[f]
 assert not closed.any()
 validation[f]={'internal_edges':4,'closed_side':True,'branch':f,'tiles':layout}
 scene=Image.new('RGBA',(1026,514))
 for (r,c),im in pieces.items():scene.alpha_composite(im,(256+(c-r)*256,(r+c)*128))
 scenes[f]=scene
catalog=PROJECT/'catalog.js';text=catalog.read_text();start=text.index('{');end=text.index('};',start)
assets=json.loads(text[start:end+1]);assets.update(entries)
catalog.write_text(text[:start]+json.dumps(assets,indent=2)+text[end+1:])
examples=PROJECT/'examples';(examples/'junction-layouts.json').write_text(json.dumps(layouts,indent=2)+'\n')
(ROOT/'validation.json').write_text(json.dumps(validation,indent=2)+'\n')
preview=PROJECT/'examples/junctions_all_directions.png'
board=Image.new('RGB',(1540,880),'#edf0f3');d=ImageDraw.Draw(board)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20)
for i,f in enumerate(scenes):
 x=(i%2)*770;y=(i//2)*440
 d.text((x+20,y+12),f'4-lane branch from {f.upper()} / continuous 2-lane street',font=font,fill='#202630')
 im=scenes[f].resize((750,376),Image.Resampling.LANCZOS);bg=Image.new('RGBA',im.size,'#303640');bg.alpha_composite(im);board.paste(bg.convert('RGB'),(x+10,y+50))
board.save(preview)
print('Built and registered',len(entries),'junction tiles; 4 directions verified.')
