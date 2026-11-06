import React,{useEffect,useRef,useState} from 'react';
import{ArrowUpRight,ArrowRight,MapPin,Menu,X}from'lucide-react';
const crops=[{name:'Пшеница',desc:'Выращивание зерновых культур',image:'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?auto=format&fit=crop&w=1000&q=85'},{name:'Подсолнечник',desc:'Масличная культура',image:'https://images.unsplash.com/photo-1597848212624-e6e3b7a12d78?auto=format&fit=crop&w=1000&q=85'},{name:'Лён',desc:'Масличная культура',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85'}];
function Seeds(){
  const host=useRef(null);
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let disposed=false,raf=0,renderer,scene,camera,root,geometry,material;
    const container=host.current;
    let scroll=window.scrollY;
    const onScroll=()=>{scroll=window.scrollY};
    const onResize=()=>{if(!renderer)return;const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
    const start=async()=>{
      const THREE=await import('three');
      if(disposed)return;
      scene=new THREE.Scene();
      camera=new THREE.PerspectiveCamera(36,window.innerWidth/window.innerHeight,.1,100);
      camera.position.z=12;
      renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
      renderer.setClearColor(0,0);
      renderer.domElement.setAttribute('aria-hidden','true');
      container.appendChild(renderer.domElement);
      onResize();
      root=new THREE.Group();scene.add(root);
      // Lightweight 3D wheat-kernel fallback until the supplied GLB is added to public/models.
      geometry=new THREE.SphereGeometry(1,12,9);
      geometry.scale(.23,.48,.19);
      material=new THREE.MeshStandardMaterial({color:0xc99b54,roughness:.72,metalness:0});
      scene.add(new THREE.HemisphereLight(0xffe7ba,0x6e5439,2.4));
      const light=new THREE.DirectionalLight(0xffdb9a,2.2);light.position.set(-3,6,8);scene.add(light);
      const seeds=Array.from({length:14},(_,i)=>{
        const mesh=new THREE.Mesh(geometry,material);
        const seed={mesh,i,phase:(i*0.61803398875)%1,speed:.62+(i%5)*.095,depth:(i%4)*.17};
        root.add(mesh);return seed;
      });
      const clock=new THREE.Clock();
      const animate=()=>{
        if(disposed)return;
        const t=clock.getElapsedTime();
        const visible=window.innerWidth>=720;
        renderer.domElement.style.display=visible?'block':'none';
        if(visible){
          const pageProgress=Math.min(1,scroll/Math.max(1,document.documentElement.scrollHeight-window.innerHeight));
          const viewHeight=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.z;
          const viewWidth=viewHeight*camera.aspect;
          seeds.forEach(s=>{
            const p=(s.phase+pageProgress*(.6+s.speed*.3))%1.2;
            const y=(.65-p)*viewHeight;
            const x=viewWidth*(.33+(s.i%5)*.025)+Math.sin(t*.4+s.i)*.13;
            s.mesh.position.set(x,y,-s.depth);
            s.mesh.rotation.set(t*.24*s.speed+s.i,t*.42*s.speed+s.i*.8,t*.19+s.i);
            const scale=.55+(s.i%4)*.16;
            s.mesh.scale.setScalar(scale);
            s.mesh.visible=p<1.05;
          });
          renderer.render(scene,camera);
        }
        raf=requestAnimationFrame(animate);
      };
      animate();
      // Prefer the actual wheat model when uploaded to public/models/wheat-seed.glb.
      try{
        const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
        const gltf=await new GLTFLoader().loadAsync(import.meta.env.BASE_URL+'models/wheat-seed.glb');
        if(disposed)return;
        const model=gltf.scene;
        const box=new THREE.Box3().setFromObject(model);
        const size=new THREE.Vector3();box.getSize(size);
        const max=Math.max(size.x,size.y,size.z)||1;
        const center=new THREE.Vector3();box.getCenter(center);
        seeds.forEach(s=>{
          const copy=model.clone(true);
          copy.position.sub(center);
          copy.scale.setScalar(.75/max);
          s.mesh.geometry=undefined;
          s.mesh.material=undefined;
          s.mesh.add(copy);
        });
        geometry.dispose();material.dispose();
      }catch{ /* GLB not yet in repository: use procedural kernels. */ }
    };
    start();
    window.addEventListener('resize',onResize);
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('resize',onResize);window.removeEventListener('scroll',onScroll);renderer?.dispose();renderer?.domElement.remove();geometry?.dispose();material?.dispose()};
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