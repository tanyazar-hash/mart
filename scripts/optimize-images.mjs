import sharp from 'sharp';
import {readdir,rm,access,stat} from 'node:fs/promises';
import path from 'node:path';
const folder=path.resolve('public/images');
const QUALITY_REVISION='2026-11-premium-v3';
const stamp=path.join(folder,'.webp-quality-version');
let refresh=false;
try{refresh=(await (await import('node:fs/promises')).readFile(stamp,'utf8')).trim()!==QUALITY_REVISION}catch{refresh=true}
const files=process.argv.includes('--clean-dist')?[]:(await readdir(folder)).filter(name=>/\.(png|jpe?g)$/i.test(name));
for(let offset=0;offset<files.length;offset+=2){
 await Promise.all(files.slice(offset,offset+2).map(async name=>{
 const source=path.join(folder,name),base=name.replace(/\.(png|jpe?g)$/i,'');
 const desktop=path.join(folder,base+'.webp'),mobile=path.join(folder,base+'-mobile.webp');
 if(!process.argv.includes('--force')&&!refresh){
  try{await Promise.all([access(desktop),access(mobile)]);const [original,large,small]=await Promise.all([stat(source),stat(desktop),stat(mobile)]);if(large.mtimeMs>=original.mtimeMs&&small.mtimeMs>=original.mtimeMs&&large.size>0&&small.size>0){console.log('Cached',name);return}}catch{}
 }
 const info=await sharp(source).metadata();
 const width=Math.min(info.width||1600,1600);
 const mobileWidth=Math.min(info.width||760,760);
 await Promise.all([
  sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality:83,effort:5,smartSubsample:true}).toFile(path.join(folder,base+'.webp')),
  sharp(source).rotate().resize({width:mobileWidth,withoutEnlargement:true}).webp({quality:76,effort:5,smartSubsample:true}).toFile(path.join(folder,base+'-mobile.webp'))
 ]);
 console.log('Optimized',name,'->',base+'.webp',base+'-mobile.webp');
}));
}
if(!process.argv.includes('--clean-dist')&&refresh){await (await import('node:fs/promises')).writeFile(stamp,QUALITY_REVISION)}
if(process.argv.includes('--clean-dist')){
 const out=path.resolve('dist/images');
 try{
  for(const name of await readdir(out)){
   if(/\.(png|jpe?g)$/i.test(name))await rm(path.join(out,name));
  }
 }catch(e){if(e.code!=='ENOENT')throw e}
}
