import numpy as np,json
from PIL import Image,ImageDraw
from pathlib import Path
from scipy.ndimage import binary_closing,binary_opening
import subprocess
project=Path(__file__).resolve().parent.parent
assets=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {ASSETS} from './catalog.js'; process.stdout.write(JSON.stringify(ASSETS))"],cwd=project));N=128;out={}
for key,a in assets.items():
 if a['layer']!='ground':continue
 im=Image.open(project/'assets'/a['file']).convert('RGBA');arr=np.asarray(im);w,h=im.size;bleed=h-w/2;lw=w-2*bleed;lh=h-2*bleed
 u,v=np.meshgrid((np.arange(N)+.5)/N,(np.arange(N)+.5)/N,indexing='xy');x=np.clip(np.rint(w/2+(u-v)*lw/2).astype(int),0,w-1);y=np.clip(np.rint((u+v)*lh/2+bleed).astype(int),0,h-1);pix=arr[y,x].astype(float)
 rgb=pix[:,:,:3];mask=(rgb.mean(2)>125)&((rgb.max(2)-rgb.min(2))<28)&(pix[:,:,3]>200)
 # Close paving seams, open thin road paint. Pad edge to preserve the sidewalk border.
 mask=binary_opening(binary_closing(np.pad(mask,3,mode='edge'),iterations=2),iterations=2)[3:-3,3:-3]
 if key=='ground_pavement':mask[:]=True
 if key=='grass':mask[:]=False
 # N rows, v increases down, each row contains u columns. Four bits per hex digit.
 bits=''.join('1' if b else '0' for b in mask.flatten());out[key]=''.join(format(int(bits[i:i+4],2),'x') for i in range(0,len(bits),4))
(project/'tile-profiles.js').write_text('// Pavement occupancy sampled from the supplied ground artwork.\n// 128 x 128 local UV grid; row=v, column=u; hex bits are most-significant first.\nexport const PROFILE_SIZE = 128;\nexport const PAVEMENT_PROFILES = '+json.dumps(out,indent=2)+';\n')
print('Pavement profiles:',len(out))
