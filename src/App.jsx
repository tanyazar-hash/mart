import React,{useEffect,useRef,useState} from 'react';
import{ArrowUpRight,ArrowRight,MapPin,Menu,X}from'lucide-react';
const crops=[
{name:'Пшеница',desc:'Зерновая культура • выращиваем в Алтайском крае',image:import.meta.env.BASE_URL+'images/wheat-card.png'},
{name:'Подсолнечник',desc:'Масличная культура • семена подсолнечника',image:import.meta.env.BASE_URL+'images/sunflower-card.png'},
{name:'Лён',desc:'Масличная культура • семена льна',image:import.meta.env.BASE_URL+'images/flax-card.png'}
];
/* Defer offscreen background images; load them before they scroll into view. */
function LazyBackground({src,className='',children,style={},gradient='',...props}){
 const ref=useRef(null);
 const [visible,setVisible]=useState(false);
 useEffect(()=>{
  const el=ref.current;
  if(!el||!('IntersectionObserver' in window)){setVisible(true);return}
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect()}},{rootMargin:'700px 0px'});
  observer.observe(el);
  return()=>observer.disconnect();
 },[]);
 return <div ref={ref} className={className} style={{...style,...(visible?{backgroundImage:gradient?gradient+',url("'+src+'")':'url("'+src+'")'}:{})}} {...props}>{children}</div>;
}
function Seeds(){
 const host=useRef(null);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(max-width: 700px)').matches||navigator.connection?.saveData)return;
  if(!('WebGLRenderingContext' in window))return;
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
    if(document.visibilityState==='visible'&&scroll>18&&fade>0)renderer.render(scene,camera);else renderer.clear();
    raf=requestAnimationFrame(tick);
   }
   tick();
  }
  let idleId=0,delayId=0;
  const schedule3D=()=>{if(dead)return;removeEventListener('scroll',schedule3D);if('requestIdleCallback' in window)idleId=window.requestIdleCallback(()=>{if(!dead)init()},{timeout:4000});else delayId=setTimeout(()=>{if(!dead)init()},1800)};
  addEventListener('scroll',schedule3D,{passive:true,once:true});
  addEventListener('resize',resize);addEventListener('scroll',onScroll,{passive:true});
  return()=>{dead=true;if(idleId)window.cancelIdleCallback?.(idleId);clearTimeout(delayId);removeEventListener('scroll',schedule3D);cancelAnimationFrame(raf);removeEventListener('resize',resize);removeEventListener('scroll',onScroll);renderer?.dispose();renderer?.domElement.remove();geometry?.dispose();material?.dispose()};
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
 const mobileCurves={
  a:"M0 48 C180 18 320 38 500 56 C690 74 830 45 1000 35",
  b:"M0 40 C170 58 360 66 540 47 C730 28 860 32 1000 51",
  c:"M0 49 C170 29 330 31 510 48 C690 65 830 58 1000 39",
  d:"M0 41 C190 61 330 58 510 43 C690 28 850 39 1000 54"
 };
 return <><svg className="wave-glow wave-desktop" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path className="wave-halo" d={curves[shape]}/><path className="wave-line" d={curves[shape]}/></svg><svg className="wave-glow wave-mobile" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path className="wave-halo" d={mobileCurves[shape]}/><path className="wave-line" d={mobileCurves[shape]}/></svg></>;
}
const productStories=[
 {slug:'wheat',number:'01',name:'Пшеница',title:'Золото наших полей',type:'ЗЕРНОВАЯ КУЛЬТУРА',desc:'Пшеница — одна из основных культур нашего хозяйства. Каждый сезон за урожаем стоят подготовка почвы, уход за посевами и работа в поле.',note:'Поля Алтайского края',tone:'wheat',photo:import.meta.env.BASE_URL+'images/psen1.png'},
 {slug:'sunflower',number:'02',name:'Подсолнечник',title:'Солнце в каждом семени',type:'МАСЛИЧНАЯ КУЛЬТУРА',desc:'Подсолнечник — важное направление растениеводства КФХ «Март». Внимание к каждому этапу выращивания помогает нам работать на результат.',note:'Труд каждого сезона',tone:'sunflower',photo:import.meta.env.BASE_URL+'images/sem2.png'},
 {slug:'flax',number:'03',name:'Лён',title:'Сила в каждой детали',type:'МАСЛИЧНАЯ КУЛЬТУРА',desc:'Лён — культура, требующая внимательного подхода. Мы выращиваем его в условиях Алтайского края наряду с другими полевыми культурами.',note:'Выращено на нашей земле',tone:'flax',photo:import.meta.env.BASE_URL+'images/len2.png'}
];
function ProductPage({slug}){
 const current=productStories.find(item=>item.slug===slug);
 useEffect(()=>{
  window.scrollTo({top:0,behavior:'instant'});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});
  document.querySelectorAll('.product-page .reveal').forEach(el=>observer.observe(el));
  return()=>observer.disconnect();
 },[slug]);
 if(current)return <div className="site product-page"><header className="top product-top"><a href="#/" className="brand"><span className="mark">✳</span><span>КФХ Март</span></a><nav className="product-nav"><a href="#/">Главная</a><a href="#/products">Продукция</a><a href="#/contacts">Контакты</a></nav><a className="contact-link" href="#/products">Все культуры <ArrowUpRight size={15}/></a></header><main><section className={'product-detail-hero '+current.tone}><div className="product-detail-inner reveal"><a className="product-back" href="#/products">← К продукции</a><div className="eyebrow">{current.type} / {current.number}</div><h1>{current.name}</h1><p>{current.desc}</p><a className="btn ghost" href="#/contacts">Обсудить сотрудничество <ArrowUpRight size={16}/></a></div><div className="product-art product-art-detail has-photo" style={{backgroundImage:`linear-gradient(0deg,rgba(29,29,28,.25),rgba(29,29,28,.05)),url("${current.photo}")`}} role="img" aria-label={"Фотография культуры: "+current.name}/></section><section className="product-detail-bottom"><div className="eyebrow dark">КФХ «МАРТ»</div><h2>Земля. Труд. Урожай.</h2><p>Алтайский край, Завьяловский район, село Светлое.</p><a href="#/products">← Вернуться к продукции</a></section></main><div className="bottom"><span>© {new Date().getFullYear()} КФХ Март</span><span>Сайт в разработке</span></div></div>;
 return <div className="site product-page product-reference">
 <header className="top product-top product-reference-header">
  <a href="#/" className="brand"><span className="product-brand-icon">❧</span><span className="product-brand-text"><small>КФХ</small>Март</span></a>
  <nav className="product-nav"><a href="#/">Главная</a><a className="active" href="#/products">Продукция</a><a href="#/about">О хозяйстве</a><a href="#/machinery">Техника</a><a href="#/contacts">Контакты</a></nav>
  <a className="contact-link" href="#/contacts">Связаться <ArrowUpRight size={15}/></a>
 </header>
 <main>
  <section className="product-hero reference-hero">
   <div className="reference-hero-shade" aria-hidden="true"/>
   <div className="reference-hero-inner reveal">
    <div className="product-breadcrumb">КФХ «МАРТ» <span>/</span> ПРОДУКЦИЯ</div>
    <div className="eyebrow">НАША ПРОДУКЦИЯ</div>
    <h1><span>Выращено</span><br/>с уважением к земле.</h1>
    <p>Пшеница. Подсолнечник. Лён.<br/>Три культуры, за которыми стоит труд каждого сезона.</p>
    <a href="#culture-wheat" className="product-scroll"><span>↓</span>Листайте, чтобы узнать больше</a>
   </div>
   <div className="reference-hero-aside" aria-hidden="true"><div className="reference-aside-ring"><span>МАРТ</span><span className="reference-aside-seed">✳</span><span>ЗЕМЛЯ · ТРУД · УРОЖАЙ</span></div><div className="reference-aside-caption"><span>АЛТАЙСКИЙ КРАЙ</span><strong>03</strong><span>КУЛЬТУРЫ<br/>ОДНА ЗЕМЛЯ</span></div></div>
   <div className="reference-hero-grains" aria-hidden="true"><span>✧</span><span>✧</span><span>✧</span></div>
   <svg className="reference-wave reference-wave-hero" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path className="reference-wave-halo" d="M0 38 C170 92 290 66 420 56 C560 40 640 104 795 59 C895 27 942 15 1000 18"/><path className="reference-wave-line" d="M0 38 C170 92 290 66 420 56 C560 40 640 104 795 59 C895 27 942 15 1000 18"/></svg>
  </section>
  {productStories.map((item,i)=><section key={item.slug} className={'product-story reference-story '+item.tone+(i%2?' reverse':'')} id={'culture-'+item.slug}>
   <LazyBackground className="reference-story-photo" src={item.photo} role="img" aria-label={"Фотография культуры: "+item.name}/>
   <div className="reference-story-shade" aria-hidden="true"/>
   <div className="reference-story-inner reveal">
    <div className="product-story-index">{item.number} / {item.name.toUpperCase()}</div>
    <h2>{item.title}</h2>
    <p>{i===0?'Основная культура хозяйства. Выращиваем пшеницу на полях Алтайского края, внимательно относясь к каждому этапу работы.':i===1?'Масличная культура, которую выращиваем с заботой о почве и соблюдением агротехнологий.':'Лён — ценная масличная культура. Его выращивание требует внимательного отношения к земле и каждому сезону.'}</p>
    <div className="reference-story-footer">
     <div className="reference-story-features">{(i===0?['Качество урожая','Работа в поле','Забота о земле']:i===1?['Масличная культура','Внимание к почве','Опыт хозяйства']:['Масличная культура','Бережный подход','Алтайский край']).map((feature,j)=><div className="reference-story-feature" key={feature}><span className="reference-feature-symbol" aria-hidden="true">{['✳','◇','♧'][j]}</span><span>{feature}</span></div>)}</div>
     <a className="product-story-link" href={'#/products/'+item.slug}>Подробнее <ArrowUpRight size={17}/></a>
    </div>
   </div>
   <svg className="reference-wave reference-wave-story" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path className="reference-wave-halo" d={i===0?'M0 48 C160 10 295 92 430 59 C585 21 695 77 835 50 C915 35 960 31 1000 20':i===1?'M0 46 C140 68 245 16 385 43 C535 79 655 19 805 51 C900 73 951 70 1000 44':'M0 48 C180 25 310 78 475 47 C615 22 750 71 870 46 C930 35 975 29 1000 40'}/><path className="reference-wave-line" d={i===0?'M0 48 C160 10 295 92 430 59 C585 21 695 77 835 50 C915 35 960 31 1000 20':i===1?'M0 46 C140 68 245 16 385 43 C535 79 655 19 805 51 C900 73 951 70 1000 44':'M0 48 C180 25 310 78 475 47 C615 22 750 71 870 46 C930 35 975 29 1000 40'}/></svg>
  </section>)}
  <section className="product-end"><div className="eyebrow">СОТРУДНИЧЕСТВО</div><h2>Интересует наша<br/>продукция?</h2><p>Свяжитесь с хозяйством, чтобы обсудить вопросы сотрудничества.</p><a className="btn primary" href="#/contacts">Перейти к контактам <ArrowUpRight size={17}/></a></section>
 </main><div className="bottom"><span>© {new Date().getFullYear()} КФХ Март</span><span>Сайт в разработке</span></div></div>;
}
function App(){
 const[menu,setMenu]=useState(false);
 const[route,setRoute]=useState(()=>window.location.hash);
 const[copied,setCopied]=useState(false);
 useEffect(()=>{const onHash=()=>{setRoute(window.location.hash);if(window.location.hash.startsWith('#/products'))window.scrollTo(0,0);else if(window.location.hash==='#/contacts')requestAnimationFrame(()=>document.getElementById('contacts')?.scrollIntoView())};window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[]);
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
 useEffect(()=>{if(route==='#/contacts')requestAnimationFrame(()=>document.getElementById('contacts')?.scrollIntoView())},[route]);
 const copyAddress=async()=>{
  const address='Алтайский край, Завьяловский район, село Светлое';
  try{await navigator.clipboard.writeText(address);setCopied(true)}catch{setCopied(false)}
 };
 if(route==='#/products'||route.startsWith('#/products/'))return <ProductPage slug={route.split('/')[2]}/>;
 return <div className="site"><svg className="wave-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>
<clipPath id="wave-a" clipPathUnits="objectBoundingBox"><path d="M0,.105 C.16,-.04 .33,.20 .55,.17 C.73,.15 .85,.035 1,.055 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-b" clipPathUnits="objectBoundingBox"><path d="M0,.085 C.19,-.015 .34,.025 .52,.13 C.70,.21 .85,.15 1,.025 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-c" clipPathUnits="objectBoundingBox"><path d="M0,.12 C.20,.015 .40,.07 .57,.04 C.74,-.015 .87,-.02 1,.055 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-d" clipPathUnits="objectBoundingBox"><path d="M0,.08 C.17,.16 .37,.02 .55,.06 C.72,.11 .87,.20 1,.095 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-a-mobile" clipPathUnits="objectBoundingBox"><path d="M0,.048 C.18,.018 .32,.038 .50,.056 C.69,.074 .83,.045 1,.035 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-b-mobile" clipPathUnits="objectBoundingBox"><path d="M0,.040 C.17,.058 .36,.066 .54,.047 C.73,.028 .86,.032 1,.051 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-c-mobile" clipPathUnits="objectBoundingBox"><path d="M0,.049 C.17,.029 .33,.031 .51,.048 C.69,.065 .83,.058 1,.039 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-d-mobile" clipPathUnits="objectBoundingBox"><path d="M0,.041 C.19,.061 .33,.058 .51,.043 C.69,.028 .85,.039 1,.054 L1,1 L0,1 Z"/></clipPath>
</defs></svg><Seeds/><header className="top"><a href="#home" className="brand"><span className="mark">✳</span><span>КФХ Март</span></a><span className="location"><MapPin size={13}/> Алтайский край, Завьяловский район, с. Светлое</span><nav className={menu?'active':''}><a href="#home" onClick={()=>setMenu(false)}>Главная</a><a href="#about" onClick={()=>setMenu(false)}>О хозяйстве</a><a href="#/products" onClick={()=>setMenu(false)}>Продукция</a><a href="#contacts" onClick={()=>setMenu(false)}>Контакты</a></nav><a className="contact-link" href="#contacts">Связаться <ArrowUpRight size={15}/></a><button className="hamburger" onClick={()=>setMenu(!menu)} aria-label="Открыть меню">{menu?<X/>:<Menu/>}</button></header>
<main><section id="home" className="hero"><div className="hero-shade"/><div className="hero-dust" aria-hidden="true"/><div className="hero-copy reveal"><div className="eyebrow">РАСТЕНИЕВОДЧЕСКОЕ ХОЗЯЙСТВО</div><h1>МАРТ</h1><p className="tagline">Земля. Труд. Урожай.</p><p className="lead">Выращиваем пшеницу, подсолнечник<br/> и лён в Алтайском крае.</p><div className="actions"><a className="btn primary" href="#/products">Наша продукция <ArrowRight size={16}/></a><a className="btn ghost" href="#about">О хозяйстве</a></div><div className="scroll-hint">ЛИСТАЙТЕ ВНИЗ <span>↓</span></div></div></section>
<section id="about" className="about"><WaveGlow shape="a"/><div className="about-photo"/><div className="about-copy reveal"><div className="eyebrow dark">О НАС</div><h2>О хозяйстве</h2><p>КФХ Март — сельскохозяйственное хозяйство в Завьяловском районе Алтайского края, село Светлое.</p><p>Выращиваем зерновые и масличные культуры, работаем на земле и развиваем производство.</p><a className="text-link" href="#/products">Что мы выращиваем <ArrowRight size={18}/></a></div></section>
<section id="products" className="products"><WaveGlow shape="b"/><div className="section-head reveal"><div><div className="eyebrow dark">НАША ДЕЯТЕЛЬНОСТЬ</div><h2>Что мы выращиваем</h2></div><p>Три культуры — одно отношение<br/>к качеству и работе.</p></div><div className="crop-grid">{crops.map((c,i)=><LazyBackground className="crop reveal" key={c.name} src={c.image} gradient="linear-gradient(0deg,rgba(34,29,19,.82),transparent 67%)" style={{transitionDelay:(i*80)+'ms'}}><div className="crop-info"><h3 className="crop-title">{c.name}</h3><p className="crop-desc">{c.desc}</p></div><span className="crop-arrow" aria-hidden="true"><ArrowUpRight size={22}/></span></LazyBackground>)}</div></section>
<section className="land"><div className="land-art" aria-hidden="true"/><WaveGlow shape="c"/><div className="land-inner reveal"><div className="eyebrow">НАШ ПОДХОД</div><h2>Забота о земле.<br/>Уважение к труду.</h2><p>Каждый сезон начинается с большой работы. Мы ценим опыт, надёжную технику и результат, который приносит земля.</p></div></section>
<section id="contacts" className="footer"><WaveGlow shape="d"/><div className="reveal"><div className="eyebrow dark">СОТРУДНИЧЕСТВО</div><h2>Давайте работать<br/>вместе</h2><p>По вопросам покупки сельхозпродукции и сотрудничества свяжитесь с хозяйством.</p><p className="address"><MapPin size={18}/> Алтайский край, Завьяловский район, село Светлое</p><button type="button" className="copy-address" onClick={copyAddress}>{copied?"Адрес скопирован":"Скопировать адрес"} <ArrowUpRight size={15}/></button></div><div className="contact-note reveal"><span className="contact-note-label">КОНТАКТЫ ХОЗЯЙСТВА</span><p>Телефон и реквизиты появятся после согласования с хозяйством.</p><div className="contact-remark">Контакты уточняются</div></div></section></main><div className="bottom"><span>© {new Date().getFullYear()} КФХ Март</span><span>Сайт в разработке</span></div></div>}
export default App;