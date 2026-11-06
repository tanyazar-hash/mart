import React,{useEffect,useRef,useState} from 'react';
import{ArrowUpRight,ArrowRight,MapPin,Menu,X}from'lucide-react';
const crops=[
{name:'Пшеница',desc:'Зерновая культура • выращиваем в Алтайском крае',image:import.meta.env.BASE_URL+'images/wheat-card.png'},
{name:'Подсолнечник',desc:'Масличная культура • семена подсолнечника',image:import.meta.env.BASE_URL+'images/sunflower-card.png'},
{name:'Лён',desc:'Масличная культура • семена льна',image:import.meta.env.BASE_URL+'images/flax-card.png'}
];
function Seeds(){
 const host=useRef(null);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let dead=false,raf=0,renderer,scene,camera,items=[],scroll=window.scrollY,geometry,material;
  const resize=()=>{if(!renderer)return;renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()};
  const onScroll=()=>scroll=window.scrollY;
  async function init(){
   const T=await import('three');if(dead)return;
   scene=new T.Scene();camera=new T.PerspectiveCamera(36,innerWidth/innerHeight,.1,100);camera.position.z=14;
   renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;
   host.current.appendChild(renderer.domElement);resize();
   scene.add(new T.HemisphereLight(0xffc887,0x584335,1.65));
   const sun=new T.DirectionalLight(0xffd9a2,1.55);sun.position.set(-4,7,8);scene.add(sun);
   let model=null;
   try{
    const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
    const gltf=await new GLTFLoader().loadAsync(import.meta.env.BASE_URL+'models/wheat-seed.glb');
    if(dead)return;
    const raw=gltf.scene,bounds=new T.Box3().setFromObject(raw),size=new T.Vector3(),center=new T.Vector3();
    bounds.getSize(size);bounds.getCenter(center);
    raw.position.sub(center);
    model=new T.Group();model.scale.setScalar(1/(Math.max(size.x,size.y,size.z)||1));model.add(raw);
   }catch(err){console.warn('Wheat GLB could not load',err)}
   if(!model){geometry=new T.SphereGeometry(1,12,9);geometry.scale(.22,.46,.19);material=new T.MeshStandardMaterial({color:0xc7a16a,roughness:.82})}
   const count=innerWidth<720?16:32;
   items=Array.from({length:count},(_,i)=>{
    const r=n=>{const v=Math.sin((i+1)*n*19.417)*43758.5453;return v-Math.floor(v)};
    const mesh=new T.Group();mesh.add(model?model.clone(true):new T.Mesh(geometry,material));scene.add(mesh);
    return {mesh,delay:r(1.13)*.19,drift:r(2.57),start:r(3.91),depth:r(4.27),turn:r(5.73),size:r(6.49),spread:r(7.83),speed:r(8.21)};
   });
   const clock=new T.Clock();
   function tick(){
    if(dead)return;
    const t=clock.getElapsedTime(),max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    // A small handful enters from the upper-right. Staggered, gravity-led
    // trajectories keep the grains together at first, then disperse slowly.
    const travel=Math.max(1800,Math.min(3400,max*.94));
    const progress=Math.max(0,Math.min(1.42,(scroll-18)/travel));
    // Fade the falling grains out before the contacts/footer area.
    // Never leave floating grains over the final screen.
    const contactsTop=document.getElementById('contacts')?.offsetTop??max;
    const fadeStart=contactsTop-innerHeight*1.5;
    const fadeEnd=contactsTop-innerHeight*.72;
    const fade=Math.max(0,Math.min(1,(fadeEnd-scroll)/Math.max(1,fadeEnd-fadeStart)));
    renderer.domElement.style.opacity=String(fade);
    const h=2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.position.z,w=h*camera.aspect;
    for(const p of items){
     const f=Math.max(0,progress-p.delay);
     const gravity=.53*f*f;
     const scatter=(p.drift-.5)*(.045+.38*Math.min(f,1.2));
     const x=w*(1.035+p.start*.035-.20*f+scatter)+Math.sin(t*.65+p.turn*6)*w*.006*Math.min(f,1);
     const y=h*(.74+p.spread*.075-.12*f-gravity*(1.18+p.speed*.42));
     p.mesh.position.set(x-w*.5,y-h*.5,(p.depth-.5)*2.5);
     p.mesh.rotation.set(p.turn*5+f*(3+p.speed*4),t*.12+p.turn*5+f*4,p.start*3+f*2);
     p.mesh.scale.setScalar((.16+p.size*.14)*(innerWidth<720?.78:1));
     p.mesh.visible=scroll>18&&f>0&&y>-.22*h&&x>-.15*w;
    }
    if(scroll>18&&fade>0)renderer.render(scene,camera);else renderer.clear();
    raf=requestAnimationFrame(tick);
   }
   tick();
  }
  init();addEventListener('resize',resize);addEventListener('scroll',onScroll,{passive:true});
  return()=>{dead=true;cancelAnimationFrame(raf);removeEventListener('resize',resize);removeEventListener('scroll',onScroll);renderer?.dispose();renderer?.domElement.remove();geometry?.dispose();material?.dispose()};
 },[]);
 return <div ref={host} className="seeds" aria-hidden="true"/>;
}
function WaveGlow({shape}) {
 const curves={
  a:"M0 105 C160 -40 330 200 550 170 C730 150 850 35 1000 55",
  b:"M0 85 C190 -15 340 25 520 130 C700 210 850 150 1000 25",
  c:"M0 120 C200 15 400 70 570 40 C740 -15 870 -20 1000 55",
  d:"M0 80 C170 160 370 20 550 60 C720 110 870 200 1000 95"
 };
 return <svg className="wave-glow" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path className="wave-halo" d={curves[shape]}/><path className="wave-line" d={curves[shape]}/></svg>;
}
function App(){
 const[menu,setMenu]=useState(false);
 const[activeCrop,setActiveCrop]=useState(null);
 const[copied,setCopied]=useState(false);
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced)return;
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
  },{threshold:.12,rootMargin:'0px 0px -25px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  let raf=0;
  const update=()=>{
   raf=0;
   const hero=document.querySelector('.hero');
   if(hero)hero.style.setProperty('--hero-shift',Math.min(100,scrollY*.115)+'px');
  };
  const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update)};
  addEventListener('scroll',onScroll,{passive:true});update();
  return()=>{observer.disconnect();removeEventListener('scroll',onScroll);cancelAnimationFrame(raf)};
 },[]);
 const copyAddress=async()=>{
  const address='Алтайский край, Завьяловский район, село Светлое';
  try{await navigator.clipboard.writeText(address);setCopied(true)}catch{setCopied(false)}
 };
 return <div className="site"><svg className="wave-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>
<clipPath id="wave-a" clipPathUnits="objectBoundingBox"><path d="M0,.105 C.16,-.04 .33,.20 .55,.17 C.73,.15 .85,.035 1,.055 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-b" clipPathUnits="objectBoundingBox"><path d="M0,.085 C.19,-.015 .34,.025 .52,.13 C.70,.21 .85,.15 1,.025 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-c" clipPathUnits="objectBoundingBox"><path d="M0,.12 C.20,.015 .40,.07 .57,.04 C.74,-.015 .87,-.02 1,.055 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-d" clipPathUnits="objectBoundingBox"><path d="M0,.08 C.17,.16 .37,.02 .55,.06 C.72,.11 .87,.20 1,.095 L1,1 L0,1 Z"/></clipPath>
</defs></svg><Seeds/><header className="top"><a href="#home" className="brand"><span className="mark">✳</span><span>КФХ Март</span></a><span className="location"><MapPin size={13}/> Алтайский край, Завьяловский район, с. Светлое</span><nav className={menu?'active':''}><a href="#home" onClick={()=>setMenu(false)}>Главная</a><a href="#about" onClick={()=>setMenu(false)}>О хозяйстве</a><a href="#products" onClick={()=>setMenu(false)}>Продукция</a><a href="#contacts" onClick={()=>setMenu(false)}>Контакты</a></nav><a className="contact-link" href="#contacts">Связаться <ArrowUpRight size={15}/></a><button className="hamburger" onClick={()=>setMenu(!menu)} aria-label="Открыть меню">{menu?<X/>:<Menu/>}</button></header>
<main><section id="home" className="hero"><div className="hero-shade"/><div className="hero-dust" aria-hidden="true"/><div className="hero-copy reveal"><div className="eyebrow">РАСТЕНИЕВОДЧЕСКОЕ ХОЗЯЙСТВО</div><h1>МАРТ</h1><p className="tagline">Земля. Труд. Урожай.</p><p className="lead">Выращиваем пшеницу, подсолнечник<br/> и лён в Алтайском крае.</p><div className="actions"><a className="btn primary" href="#products">Наша продукция <ArrowRight size={16}/></a><a className="btn ghost" href="#about">О хозяйстве</a></div><div className="scroll-hint">ЛИСТАЙТЕ ВНИЗ <span>↓</span></div></div></section>
<section id="about" className="about"><WaveGlow shape="a"/><div className="about-photo"/><div className="about-copy reveal"><div className="eyebrow dark">О НАС</div><h2>О хозяйстве</h2><p>КФХ Март — сельскохозяйственное хозяйство в Завьяловском районе Алтайского края, село Светлое.</p><p>Выращиваем зерновые и масличные культуры, работаем на земле и развиваем производство.</p><a className="text-link" href="#products">Что мы выращиваем <ArrowRight size={18}/></a></div></section>
<section id="products" className="products"><WaveGlow shape="b"/><div className="section-head reveal"><div><div className="eyebrow dark">НАША ДЕЯТЕЛЬНОСТЬ</div><h2>Что мы выращиваем</h2></div><p>Три культуры — одно отношение<br/>к качеству и работе.</p></div><div className="crop-grid">{crops.map((c,i)=><button type="button" className={'crop reveal'+(activeCrop===i?' crop-selected':'')} key={c.name} onClick={()=>setActiveCrop(activeCrop===i?null:i)} aria-expanded={activeCrop===i} aria-label={'Подробнее: '+c.name} style={{backgroundImage:`linear-gradient(0deg,rgba(34,29,19,.82),transparent 67%),url("${c.image}")`,transitionDelay:(i*80)+'ms'}}><div className="crop-info"><h3 className="crop-title">{c.name}</h3><p className="crop-desc">{c.desc}</p><span className="crop-more">{activeCrop===i?'Свернуть':'Подробнее о культуре'}</span></div><span className="crop-arrow"><ArrowUpRight size={22}/></span></button>)}</div>{activeCrop!==null&&<div className="crop-detail" role="region" aria-live="polite"><strong>{crops[activeCrop].name}</strong><p>{crops[activeCrop].desc}. По вопросам наличия, объёмов и условий продажи свяжитесь с хозяйством.</p><a href="#contacts">Перейти к контактам <ArrowRight size={16}/></a></div>}</section>
<section className="land"><div className="land-art" aria-hidden="true"/><WaveGlow shape="c"/><div className="land-inner reveal"><div className="eyebrow">НАШ ПОДХОД</div><h2>Забота о земле.<br/>Уважение к труду.</h2><p>Каждый сезон начинается с большой работы. Мы ценим опыт, надёжную технику и результат, который приносит земля.</p></div></section>
<section id="contacts" className="footer"><WaveGlow shape="d"/><div className="reveal"><div className="eyebrow dark">СОТРУДНИЧЕСТВО</div><h2>Давайте работать<br/>вместе</h2><p>По вопросам покупки сельхозпродукции и сотрудничества свяжитесь с хозяйством.</p><p className="address"><MapPin size={18}/> Алтайский край, Завьяловский район, село Светлое</p><button type="button" className="copy-address" onClick={copyAddress}>{copied?"Адрес скопирован":"Скопировать адрес"} <ArrowUpRight size={15}/></button></div><div className="contact-note reveal"><span className="contact-note-label">КОНТАКТЫ ХОЗЯЙСТВА</span><p>Телефон и реквизиты появятся после согласования с хозяйством.</p><div className="contact-remark">Контакты уточняются</div></div></section></main><div className="bottom"><span>© {new Date().getFullYear()} КФХ Март</span><span>Сайт в разработке</span></div></div>}
export default App;