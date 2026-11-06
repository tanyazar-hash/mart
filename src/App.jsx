import React,{useEffect,useRef,useState} from 'react';
import{ArrowUpRight,ArrowRight,MapPin,Menu,X}from'lucide-react';
const crops=[
{name:'Пшеница',desc:'Выращивание зерновых культур',image:import.meta.env.BASE_URL+'images/wheat-card.png'},
{name:'Подсолнечник',desc:'Масличная культура',image:import.meta.env.BASE_URL+'images/sunflower-card.png'},
{name:'Лён',desc:'Масличная культура',image:import.meta.env.BASE_URL+'images/flax-card.png'}
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
   const sun=new T.DirectionalLight(0xffbd69,1.9);sun.position.set(-4,7,8);scene.add(sun);
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
   const count=innerWidth<720?11:23;
   items=Array.from({length:count},(_,i)=>{
    const r=n=>{const v=Math.sin((i+1)*n*19.417)*43758.5453;return v-Math.floor(v)};
    const mesh=new T.Group();mesh.add(model?model.clone(true):new T.Mesh(geometry,material));scene.add(mesh);
    return {mesh,delay:r(1.13)*.20,drift:r(2.57),start:r(3.91),depth:r(4.27),turn:r(5.73),size:r(6.49)};
   });
   const clock=new T.Clock();
   function tick(){
    if(dead)return;
    const t=clock.getElapsedTime(),max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const progress=Math.min(1.65,Math.max(0,(scroll-14)/Math.min(1100,Math.max(500,max*.65))));
    const h=2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.position.z,w=h*camera.aspect;
    for(const p of items){
     const f=Math.max(0,(progress-p.delay)*1.18),e=.18*f+.82*f*f;
     const x=w*(1.07+p.start*.17)-w*(.20+p.drift*.52)*Math.min(1,f*1.65)+Math.sin(t*.75+p.turn*7)*w*.012*f;
     const y=h*(.52+p.start*.24)-h*(1.45+p.depth*.58)*e;
     p.mesh.position.set(x-w*.5,y-h*.5,p.depth*1.3-.6);
     p.mesh.rotation.set(p.turn*4+f*7,t*.15+p.turn*5+f*8,p.start*3+f*5);
     p.mesh.scale.setScalar((.17+p.size*.19)*(innerWidth<720?.85:1));
     p.mesh.visible=scroll>14&&f>0&&y>-.55*h;
    }
    if(scroll>12&&innerWidth>=480)renderer.render(scene,camera);else renderer.clear();
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
function App(){const[menu,setMenu]=useState(false);return <div className="site"><svg className="wave-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>
<clipPath id="wave-a" clipPathUnits="objectBoundingBox"><path d="M0,.105 C.16,-.04 .33,.20 .55,.17 C.73,.15 .85,.035 1,.055 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-b" clipPathUnits="objectBoundingBox"><path d="M0,.085 C.19,-.015 .34,.025 .52,.13 C.70,.21 .85,.15 1,.025 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-c" clipPathUnits="objectBoundingBox"><path d="M0,.12 C.20,.015 .40,.07 .57,.04 C.74,-.015 .87,-.02 1,.055 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-d" clipPathUnits="objectBoundingBox"><path d="M0,.08 C.17,.16 .37,.02 .55,.06 C.72,.11 .87,.20 1,.095 L1,1 L0,1 Z"/></clipPath>
</defs></svg><Seeds/><header className="top"><a href="#home" className="brand"><span className="mark">✳</span><span>КФХ Март</span></a><span className="location"><MapPin size={13}/> Алтайский край, Завьяловский район, с. Светлое</span><nav className={menu?'active':''}><a href="#home" onClick={()=>setMenu(false)}>Главная</a><a href="#about" onClick={()=>setMenu(false)}>О хозяйстве</a><a href="#products" onClick={()=>setMenu(false)}>Продукция</a><a href="#contacts" onClick={()=>setMenu(false)}>Контакты</a></nav><a className="contact-link" href="#contacts">Связаться <ArrowUpRight size={15}/></a><button className="hamburger" onClick={()=>setMenu(!menu)} aria-label="Открыть меню">{menu?<X/>:<Menu/>}</button></header>
<main><section id="home" className="hero"><div className="hero-shade"/><div className="hero-copy"><div className="eyebrow">РАСТЕНИЕВОДЧЕСКОЕ ХОЗЯЙСТВО</div><h1>МАРТ</h1><p className="tagline">Земля. Труд. Урожай.</p><p className="lead">Выращиваем пшеницу, подсолнечник<br/> и лён в Алтайском крае.</p><div className="actions"><a className="btn primary" href="#products">Наша продукция <ArrowRight size={16}/></a><a className="btn ghost" href="#about">О хозяйстве</a></div></div><div className="scroll-hint">ЛИСТАЙТЕ ВНИЗ <span>↓</span></div></section>
<section id="about" className="about"><WaveGlow shape="a"/><div className="about-photo"/><div className="about-copy"><div className="eyebrow dark">О НАС</div><h2>О хозяйстве</h2><p>КФХ Март — сельскохозяйственное хозяйство в Завьяловском районе Алтайского края, село Светлое.</p><p>Выращиваем зерновые и масличные культуры, работаем на земле и развиваем производство.</p><a className="text-link" href="#products">Что мы выращиваем <ArrowRight size={18}/></a></div></section>
<section id="products" className="products"><WaveGlow shape="b"/><div className="section-head"><div><div className="eyebrow dark">НАША ДЕЯТЕЛЬНОСТЬ</div><h2>Что мы выращиваем</h2></div><p>Три культуры — одно отношение<br/>к качеству и работе.</p></div><div className="crop-grid">{crops.map(c=><article className="crop" key={c.name} style={{backgroundImage:`linear-gradient(0deg,rgba(34,29,19,.79),transparent 65%),url("${c.image}")`}}><div className="crop-info"><h3>{c.name}</h3><p>{c.desc}</p></div><span className="crop-arrow"><ArrowUpRight size={22}/></span></article>)}</div></section>
<section className="land"><WaveGlow shape="c"/><div className="land-inner"><div className="eyebrow">НАШ ПОДХОД</div><h2>Забота о земле.<br/>Уважение к труду.</h2><p>Каждый сезон начинается с большой работы. Мы ценим опыт, надёжную технику и результат, который приносит земля.</p></div></section>
<section id="contacts" className="footer"><WaveGlow shape="d"/><div><div className="eyebrow dark">СОТРУДНИЧЕСТВО</div><h2>Давайте работать<br/>вместе</h2><p>По вопросам покупки сельхозпродукции и сотрудничества свяжитесь с хозяйством.</p><p className="address"><MapPin size={18}/> Алтайский край, Завьяловский район, село Светлое</p></div><div className="contact-note">Контактный телефон и реквизиты добавим после согласования.<div className="contact-remark">Контакты уточняются</div></div></section></main><div className="bottom"><span>© {new Date().getFullYear()} КФХ Март</span><span>Сайт в разработке</span></div></div>}
export default App;