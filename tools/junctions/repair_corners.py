"""Match each quarter-circle to its actual adjacent straight curb profiles.
Retain the paving field, except the one slab at each curved corner.
"""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates
R=Path(__file__).resolve().parent
N=1254
def read(n):return np.asarray(Image.open(R/'references'/n).convert('RGB'),dtype=np.float32)
A=read('main_a_material.png');B=read('main_b_material.png');S=read('straight_material.png');P=read('pavement_material.png')
base=np.asarray(Image.open(R/'junction_material_master.png').convert('RGB'),dtype=np.float32)
yy,xx=np.mgrid[:2*N,:2*N];X=(xx+.5)/N;Y=(yy+.5)/N
def profile(t):return np.median(t[:,35:110],axis=1)
pa=profile(A);pb=profile(B[::-1]);ps=profile(S);psback=profile(S[::-1])
def last_bright(p,guess):
 ids=np.arange(int(guess*N)-30,int(guess*N)+15)
 return (ids[np.flatnonzero(p[ids].mean(1)>140)[-1]]+.5)/N
def inner_edge(p,edge):
 ids=np.arange(int(edge*N)-65,int(edge*N));dark=ids[p[ids].mean(1)<110];return (dark[0]-2)/N-edge
def at(p,coord):return np.stack([np.interp(coord*N,np.arange(N)+.5,p[:,c])for c in range(3)],-1)
def smooth(t):t=np.clip(t,0,1);return t*t*(3-2*t)
def sample(t,u,v):
 sx=np.clip(u*N-.5,0,N-1);sy=np.clip(v*N-.5,0,N-1)
 return np.stack([map_coordinates(t[:,:,c],[sy,sx],order=1,mode="nearest")for c in range(3)],-1)
def make(f):
 art=base.copy();std=ps if f in ['nw','ne']else psback
 se=last_bright(std,.125)
 for bottom in [False,True]:
  main=(pb if bottom else pa)if f in ['nw','ne']else(pa if bottom else pb)
  me=last_bright(main,.175)
  # A real circular visible road-side curb boundary, with exact perpendicular tangents.
  radius=.125;cx=1+se-radius;cy=me-radius
  y=2-Y if bottom else Y
  dx=np.maximum(X-cx,0);dy=np.maximum(y-cy,0)
  distance=np.hypot(dx,dy)-radius
  theta=np.arctan2(dy,dx);blend=np.cos(theta)**2
  # Sample each native profile without stretching its width. The visible face
  # ends are aligned to the shared circle before interpolating their colors.
  mcol=at(main,me+distance);scol=at(std,se+distance)
  native_main=A if main is pa else B[::-1]
  along=np.mod(X if f in ['nw','ne']else 2-X,1)
  mcol=np.where((X<cx)[:,:,None],sample(native_main,along,me+distance),mcol)
  native_std=S if f in ['nw','ne']else S[::-1]
  travel=np.mod(y if f in ['nw','ne']else 2-y,1)
  scol=np.where((y<cy)[:,:,None],sample(native_std,travel,se+distance),scol)
  col=mcol*(1-blend[:,:,None])+scol*blend[:,:,None]
  # A single paving slab fills the curved corner; no remnant stripe or tiny
  # clipped neighbor slab. Texture is sampled wholly within one native slab.
  slab=smooth((X-(cx-.015))/.015)*(distance<0)
  ux=np.clip((X-cx)/radius,0,1);vy=np.clip((y-cy)/radius,0,1)
  iy=np.clip((.025+.065*vy)*N,0,N-1).astype(int)
  ix=np.clip((.025+.065*ux)*N,0,N-1).astype(int)
  brick=A if main is pa else B[::-1]
  ix=np.clip((.89+.09*ux)*N,0,N-1).astype(int)
  iy=np.clip((.025+.075*vy)*N,0,N-1).astype(int)
  art=art*(1-slab[:,:,None])+brick[iy,ix]*slab[:,:,None]
  # Cover the entire old curb and its shadow before drawing the new profile.
  # The unchanged far sidewalk and road markings are outside this strip.
  width=.065
  weight=(1-smooth(np.maximum(distance,0)/.025))
  weight*= (X<1.25)&(y<.27)
  inside=inner_edge(main,me)*(1-blend)+inner_edge(std,se)*blend
  weight*=1-smooth((-distance-.06)/.015)
  interior=(distance<inside)&(X>=cx)&(y>=cy)
  col=np.where(interior[:,:,None],brick[iy,ix],col)
  # Curved strip is one unbroken curb stone. Thin joints appear only at the
  # two tangencies, never across the middle of the arc.
  face=(distance<-.002)&(distance>-.035)
  joint=((np.abs(X-cx)<.65/N)&(y>=cy))|((np.abs(y-cy)<.65/N)&(X>=cx))
  joint&=face
  joint&=False
  col=np.where(joint[:,:,None],np.array([91,92,93]),col)
  art=art*(1-weight[:,:,None])+col*weight[:,:,None]
 return np.clip(art,0,255).round().astype('uint8')
if __name__=='__main__':
 for f in ['nw','ne','se','sw']:
  im=make(f);Image.fromarray(im).save(R/f'junction_canonical_{f}_repaired.png')
 print('Matched all eight corners to their native straight curb profiles.')
