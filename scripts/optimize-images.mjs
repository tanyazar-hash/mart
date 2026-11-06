import sharp from 'sharp';
import {readdir,rm,access} from 'node:fs/promises';
import path from 'node:path';
const folder=path.resolve('public/images');
const files=process.argv.includes('--clean-dist')?[]:(await readdir(folder)).filter(name=>/\.(png|jpe?g)$/i.test(name));
for(let offset=0;offset<files.length;offset+=2){
 await Promise.all(files.slice(offset,offset+2).map(async name=>{
 const source=path.join(folder,name),base=name.replace(/\.(png|jpe?g)$/i,'');
 const desktop=path.join(folder,base+'.webp'),mobile=path.join(folder,base+'-mobile.webp');
 if(!process.argv.includes('--force')){
  try{await Promise.all([access(desktop),access(mobile)]);console.log('Cached',name);return}catch{}
 }
 const info=await sharp(source).metadata();
 const width=Math.min(info.width||1280,1280);
 const mobileWidth=Math.min(info.width||640,640);
 await Promise.all([
  sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality:68,effort:4}).toFile(path.join(folder,base+'.webp')),
  sharp(source).rotate().resize({width:mobileWidth,withoutEnlargement:true}).webp({quality:60,effort:4}).toFile(path.join(folder,base+'-mobile.webp'))
 ]);
 console.log('Optimized',name,'->',base+'.webp',base+'-mobile.webp');
}));
}
if(process.argv.includes('--clean-dist')){
 const out=path.resolve('dist/images');
 try{
  for(const name of await readdir(out)){
   if(/\.(png|jpe?g)$/i.test(name))await rm(path.join(out,name));
  }
 }catch(e){if(e.code!=='ENOENT')throw e}
}
