import React,{useEffect,useRef,useState} from 'react';
import{ArrowUpRight,ArrowRight,MapPin,Menu,X}from'lucide-react';
const crops=[{name:'Пшеница',desc:'Выращивание зерновых культур',image:'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?auto=format&fit=crop&w=1000&q=85'},{name:'Подсолнечник',desc:'Масличная культура',image:'https://images.unsplash.com/photo-1597848212624-e6e3b7a12d78?auto=format&fit=crop&w=1000&q=85'},{name:'Лён',desc:'Масличная культура',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85'}];
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
   scene.add(new T.HemisphereLight(0xffe6c5,0x655a4d,2.4));
   const sun=new T.DirectionalLight(0xffd9a4,2.4);sun.position.set(-4,7,8);scene.add(sun);
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
   const count=innerWidth<720?13:30;
   items=Array.from({length:count},(_,i)=>{
    const r=n=>{const v=Math.sin((i+1)*n*19.417)*43758.5453;return v-Math.floor(v)};
    const mesh=new T.Group();mesh.add(model?model.clone(true):new T.Mesh(geometry,material));scene.add(mesh);
    return {mesh,delay:r(1.13)*.22,drift:r(2.57),start:r(3.91),depth:r(4.27),turn:r(5.73),size:r(6.49)};
   });
   const clock=new T.Clock();
   function tick(){
    if(dead)return;
    const t=clock.getElapsedTime(),max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const progress=Math.min(1,Math.max(0,(scroll-12)/Math.max(1,max-12)));
    const h=2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.position.z,w=h*camera.aspect;
    for(const p of items){
     const f=Math.max(0,(progress-p.delay)/(1-p.delay)),e=f*f*(3-2*f);
     const x=w*(1.04+p.start*.13)-w*(.43+p.drift*.67)*(1-Math.exp(-f*5))+Math.sin(t*.55+p.turn*7)*w*.006*f;
     const y=h*(.62+p.start*.13)-h*(1.85+p.depth*.52)*e;
     p.mesh.position.set(x-w*.5,y-h*.5,p.depth*1.3-.6);
     p.mesh.rotation.set(p.turn*4+f*7,t*.15+p.turn*5+f*8,p.start*3+f*5);
     p.mesh.scale.setScalar((.27+p.size*.27)*(innerWidth<720?.8:1));
     p.mesh.visible=scroll>12&&f>0&&y>-.35*h;
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
function App(){const[menu,setMenu]=useState(false);return <div className="site"><Seeds/><header className="top"><a href="#home" className="brand"><span className="mark">✳</span><span>КФХ Мартынова</span></a><span className="location"><MapPin size={13}/> Алтайский край, Завьяловский район, с. Светлое</span><nav className={menu?'active':''}><a href="#home" onClick={()=>setMenu(false)}>Главная</a><a href="#about" onClick={()=>setMenu(false)}>О хозяйстве</a><a href="#products" onClick={()=>setMenu(false)}>Продукция</a><a href="#contacts" onClick={()=>setMenu(false)}>Контакты</a></nav><a className="contact-link" href="#contacts">Связаться <ArrowUpRight size={15}/></a><button className="hamburger" onClick={()=>setMenu(!menu)} aria-label="Открыть меню">{menu?<X/>:<Menu/>}</button></header>
<main><section id="home" className="hero"><div className="hero-shade"/><div className="hero-copy"><div className="eyebrow">РАСТЕНИЕВОДЧЕСКОЕ ХОЗЯЙСТВО</div><h1>МАРТЫНОВ</h1><p className="tagline">Земля. Труд. Урожай.</p><p className="lead">Выращиваем пшеницу, подсолнечник<br/> и лён в Алтайском крае.</p><div className="actions"><a className="btn primary" href="#products">Наша продукция <ArrowRight size={16}/></a><a className="btn ghost" href="#about">О хозяйстве</a></div></div><div className="scroll-hint">ЛИСТАЙТЕ ВНИЗ <span>↓</span></div></section>
<section id="about" className="about"><div className="about-photo"/><div className="about-copy"><div className="eyebrow dark">О НАС</div><h2>О хозяйстве</h2><p>КФХ Мартынова — сельскохозяйственное хозяйство в Завьяловском районе Алтайского края, село Светлое.</p><p>Выращиваем зерновые и масличные культуры, работаем на земле и развиваем производство.</p><a className="text-link" href="#products">Что мы выращиваем <ArrowRight size={18}/></a></div></section>
<section id="products" className="products"><div className="section-head"><div><div className="eyebrow dark">НАША ДЕЯТЕЛЬНОСТЬ</div><h2>Что мы выращиваем</h2></div><p>Три культуры — одно отношение<br/>к качеству и работе.</p></div><div className="crop-grid">{crops.map(c=><article className="crop" key={c.name} style={{backgroundImage:`linear-gradient(0deg,rgba(34,29,19,.79),transparent 65%),url("${c.image}")`}}><div className="crop-info"><h3>{c.name}</h3><p>{c.desc}</p></div><span className="crop-arrow"><ArrowUpRight size={22}/></span></article>)}</div></section>
<section className="land"><div className="land-inner"><div className="eyebrow">НАШ ПОДХОД</div><h2>Забота о земле.<br/>Уважение к труду.</h2><p>Каждый сезон начинается с большой работы. Мы ценим опыт, надёжную технику и результат, который приносит земля.</p></div></section>
<section id="contacts" className="footer"><div><div className="eyebrow dark">СОТРУДНИЧЕСТВО</div><h2>Давайте работать<br/>вместе</h2><p>По вопросам покупки сельхозпродукции и сотрудничества свяжитесь с хозяйством.</p><p className="address"><MapPin size={18}/> Алтайский край, Завьяловский район, село Светлое</p></div><div className="contact-note">Контактный телефон и реквизиты добавим после согласования.<div className="contact-remark">Контакты уточняются</div></div></section></main><div className="bottom"><span>© {new Date().getFullYear()} КФХ Мартынова</span><span>Сайт в разработке</span></div></div>}
export default App;