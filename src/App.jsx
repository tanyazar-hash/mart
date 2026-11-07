import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import{ArrowUpRight,ArrowRight,MapPin,Menu,X}from'lucide-react';
const crops=[
{name:'Пшеница',desc:'Зерновая культура • выращиваем в Алтайском крае',image:import.meta.env.BASE_URL+'images/wheat-card.webp'},
{name:'Подсолнечник',desc:'Масличная культура • семена подсолнечника',image:import.meta.env.BASE_URL+'images/sunflower-card.webp'},
{name:'Лён',desc:'Масличная культура • семена льна',image:import.meta.env.BASE_URL+'images/flax-card.webp'}
];
/* Defer offscreen background images; load them before they scroll into view. */
function LazyBackground({src,className='',children,style={},gradient='',...props}){
 const ref=useRef(null);
 const [visible,setVisible]=useState(false);
 const imageSrc=(typeof window!=='undefined'&&window.matchMedia('(max-width: 760px)').matches)?src.replace(/\.webp$/, '-mobile.webp'):src;
 useEffect(()=>{
  const el=ref.current;
  if(!el||!('IntersectionObserver' in window)){setVisible(true);return}
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect()}},{rootMargin:'700px 0px'});
  observer.observe(el);
  return()=>observer.disconnect();
 },[]);
 return <div ref={ref} className={className} style={{...style,...(visible?{backgroundImage:gradient?gradient+',url("'+imageSrc+'")':'url("'+imageSrc+'")'}:{})}} {...props}>{children}</div>;
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
 {slug:'wheat',number:'01',name:'Пшеница',title:'Золото наших полей',type:'ЗЕРНОВАЯ КУЛЬТУРА',desc:'Пшеница — одна из основных культур нашего хозяйства. Каждый сезон за урожаем стоят подготовка почвы, уход за посевами и работа в поле.',note:'Поля Алтайского края',tone:'wheat',photo:import.meta.env.BASE_URL+'images/psen1.webp'},
 {slug:'sunflower',number:'02',name:'Подсолнечник',title:'Солнце в каждом семени',type:'МАСЛИЧНАЯ КУЛЬТУРА',desc:'Подсолнечник — важное направление растениеводства КФХ «Март». Внимание к каждому этапу выращивания помогает нам работать на результат.',note:'Труд каждого сезона',tone:'sunflower',photo:import.meta.env.BASE_URL+'images/sem2.webp'},
 {slug:'flax',number:'03',name:'Лён',title:'Сила в каждой детали',type:'МАСЛИЧНАЯ КУЛЬТУРА',desc:'Лён — культура, требующая внимательного подхода. Мы выращиваем его в условиях Алтайского края наряду с другими полевыми культурами.',note:'Выращено на нашей земле',tone:'flax',photo:import.meta.env.BASE_URL+'images/len2.webp'}
];
function ProductPage({slug}){
 const [mobileMenu,setMobileMenu]=useState(false);
 useEffect(()=>setMobileMenu(false),[slug]);
 const productHeader=<header className="top product-top product-reference-header home-reference-header"><a href="#/" className="brand" onClick={()=>setMobileMenu(false)}><span className="product-brand-icon">❧</span><span className="product-brand-text"><small>КФХ</small>Март</span></a><nav id="product-mobile-navigation" className={mobileMenu?"product-nav active":"product-nav"} aria-label="Основная навигация"><a href="#/" onClick={()=>setMobileMenu(false)}>Главная</a><a className="active" aria-current="page" href="#/products" onClick={()=>setMobileMenu(false)}>Продукция</a><a href="#/about" onClick={()=>setMobileMenu(false)}>О хозяйстве</a><a href="#/machinery" onClick={()=>setMobileMenu(false)}>Техника</a><a href="#/contacts" onClick={()=>setMobileMenu(false)}>Контакты</a></nav><a className="contact-link" href="#/contacts">Связаться <ArrowUpRight size={15}/></a><button type="button" className="hamburger" aria-expanded={mobileMenu} aria-controls="product-mobile-navigation" aria-label={mobileMenu?"Закрыть меню":"Открыть меню"} onClick={()=>setMobileMenu(v=>!v)}>{mobileMenu?<X/>:<Menu/>}</button></header>;

 useLayoutEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'});const id=requestAnimationFrame(()=>window.scrollTo(0,0));return()=>cancelAnimationFrame(id)},[slug]);
 const current=productStories.find(item=>item.slug===slug);
 useEffect(()=>{
  const elements=document.querySelectorAll('.product-page .reveal');
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if(reduced||!('IntersectionObserver' in window)){elements.forEach(el=>el.classList.add('is-visible'));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.06,rootMargin:'0px 0px 80px 0px'});
  elements.forEach(el=>observer.observe(el));
  return()=>observer.disconnect();
 },[slug]);
 if(current)return <div className="site product-page product-detail-page">{productHeader}<main><section className={'product-detail-hero '+current.tone}><div className="product-detail-inner reveal"><a className="product-back" href="#/products">← К продукции</a><div className="eyebrow">{current.type} / {current.number}</div><h1>{current.name}</h1><p>{current.desc}</p><a className="btn ghost" href="#/contacts">Обсудить сотрудничество <ArrowUpRight size={16}/></a></div><div className="product-art product-art-detail has-photo" style={{backgroundImage:`linear-gradient(0deg,rgba(29,29,28,.25),rgba(29,29,28,.05)),url("${current.photo}")`}} role="img" aria-label={"Фотография культуры: "+current.name}/><svg className="reference-wave reference-wave-hero" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path className="detail-wave-fill" d="M0 38 C170 92 290 66 420 56 C560 40 640 104 795 59 C895 27 942 15 1000 18 L1000 100 L0 100 Z"/><path className="reference-wave-halo" d="M0 38 C170 92 290 66 420 56 C560 40 640 104 795 59 C895 27 942 15 1000 18"/><path className="reference-wave-line" d="M0 38 C170 92 290 66 420 56 C560 40 640 104 795 59 C895 27 942 15 1000 18"/></svg></section><section className="product-detail-bottom"><div className="eyebrow dark">КФХ «МАРТ»</div><h2>Земля. Труд. Урожай.</h2><p>Алтайский край, Завьяловский район, село Светлое.</p><a href="#/products">← Вернуться к продукции</a></section></main><SiteFooter/></div>;
 return <div className="site product-page product-reference">
 {productHeader}
 <main>
  <section className="product-hero reference-hero">
   <div className="reference-hero-shade" aria-hidden="true"/>
   <div className="reference-hero-inner reveal">
    <div className="product-breadcrumb">КФХ «МАРТ» <span>/</span> ПРОДУКЦИЯ</div>
    <div className="eyebrow">НАША ПРОДУКЦИЯ</div>
    <h1><span>Выращено</span><br/>с уважением к земле.</h1>
    <p>Пшеница. Подсолнечник. Лён.<br/>Три культуры, за которыми стоит труд каждого сезона.</p>
    <a href="#culture-wheat" onClick={e=>{e.preventDefault();document.getElementById("culture-wheat")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}} className="product-scroll"><span>↓</span>Листайте, чтобы узнать больше</a>
   </div>
   
   
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
     <div className="reference-story-features">{(i===0?['Качество урожая','Работа в поле','Забота о земле']:i===1?['Масличная культура','Внимание к почве','Опыт хозяйства']:['Масличная культура','Бережный подход','Алтайский край']).map((feature,j)=><div className="reference-story-feature" key={feature}><span className="reference-feature-symbol" aria-hidden="true">{['✦','◇','♧'][j]}</span><span>{feature}</span></div>)}</div>
     <a className="product-story-link" href={'#/products/'+item.slug}>Подробнее <ArrowUpRight size={17}/></a>
    </div>
   </div>
   <svg className="reference-wave reference-wave-story" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path className="reference-wave-halo" d={i===0?'M0 48 C160 10 295 92 430 59 C585 21 695 77 835 50 C915 35 960 31 1000 20':i===1?'M0 46 C140 68 245 16 385 43 C535 79 655 19 805 51 C900 73 951 70 1000 44':'M0 48 C180 25 310 78 475 47 C615 22 750 71 870 46 C930 35 975 29 1000 40'}/><path className="reference-wave-line" d={i===0?'M0 48 C160 10 295 92 430 59 C585 21 695 77 835 50 C915 35 960 31 1000 20':i===1?'M0 46 C140 68 245 16 385 43 C535 79 655 19 805 51 C900 73 951 70 1000 44':'M0 48 C180 25 310 78 475 47 C615 22 750 71 870 46 C930 35 975 29 1000 40'}/></svg>
  </section>)}
  <section className="product-end"><div className="eyebrow">СОТРУДНИЧЕСТВО</div><h2>Интересует наша<br/>продукция?</h2><p>Свяжитесь с хозяйством, чтобы обсудить вопросы сотрудничества.</p><a className="btn primary" href="#/contacts">Перейти к контактам <ArrowUpRight size={17}/></a></section>
 </main><SiteFooter/></div>;
}

const aboutWavePaths=[
 'M0 52 L50 35 L100 20 L150 15 L200 21 L250 38 L300 59 L350 77 L400 88 L450 91 L500 85 L550 71 L600 53 L650 36 L700 24 L750 19 L800 24 L850 37 L900 49 L950 54 L1000 48',
 'M0 52 L50 35 L100 20 L150 15 L200 21 L250 38 L300 59 L350 77 L400 88 L450 91 L500 85 L550 71 L600 53 L650 36 L700 24 L750 19 L800 24 L850 37 L900 49 L950 54 L1000 48',
 'M0 52 L50 35 L100 20 L150 15 L200 21 L250 38 L300 59 L350 77 L400 88 L450 91 L500 85 L550 71 L600 53 L650 36 L700 24 L750 19 L800 24 L850 37 L900 49 L950 54 L1000 48',
 'M0 52 L50 35 L100 20 L150 15 L200 21 L250 38 L300 59 L350 77 L400 88 L450 91 L500 85 L550 71 L600 53 L650 36 L700 24 L750 19 L800 24 L850 37 L900 49 L950 54 L1000 48'
];
function AboutWave({index=0}){const d=aboutWavePaths[index];return <svg className={"about-wave about-wave-"+index} viewBox="0 0 1000 110" preserveAspectRatio="none" aria-hidden="true"><path className="about-wave-halo" d={d}/><path className="about-wave-line" d={d}/></svg>}
function AboutPage(){
 const[menu,setMenu]=useState(false);
 useLayoutEffect(()=>{window.scrollTo(0,0)},[]);
 useEffect(()=>{
  const nodes=document.querySelectorAll('.about-page .reveal');
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)){nodes.forEach(el=>el.classList.add('is-visible'));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px 80px 0px'});
  nodes.forEach(el=>observer.observe(el));return()=>observer.disconnect();
 },[]);
 return <div className="site about-page">
  <header className="top product-top product-reference-header home-reference-header about-header"><a className="brand" href="#/" onClick={()=>setMenu(false)}><span className="product-brand-icon">❧</span><span className="product-brand-text"><small>КФХ</small>Март</span></a><nav id="about-mobile-navigation" className={menu?'product-nav active':'product-nav'} aria-label="Основная навигация"><a href="#/" onClick={()=>setMenu(false)}>Главная</a><a href="#/products" onClick={()=>setMenu(false)}>Продукция</a><a href="#/about" className="active" aria-current="page" onClick={()=>setMenu(false)}>О хозяйстве</a><a href="#/machinery" onClick={()=>setMenu(false)}>Техника</a><a href="#/contacts" onClick={()=>setMenu(false)}>Контакты</a></nav><a href="#/contacts" className="contact-link">Связаться <ArrowUpRight size={15}/></a><button type="button" className="hamburger" aria-expanded={menu} aria-controls="about-mobile-navigation" aria-label={menu?'Закрыть меню':'Открыть меню'} onClick={()=>setMenu(v=>!v)}>{menu?<X/>:<Menu/>}</button></header>
  <main>
   <section className="about-hero"><div className="about-hero-content reveal"><div className="about-kicker">О ХОЗЯЙСТВЕ</div><h1>Земля, которой<br/>мы верны</h1><p>Крестьянско-фермерское хозяйство «Март» — сельскохозяйственное производство в Алтайском крае, основанное на труде и уважении к земле.</p><a className="about-scroll" href="#about-history" onClick={e=>{e.preventDefault();document.getElementById('about-history')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}} aria-label="К истории хозяйства">↓</a></div></section>
   <section className="about-history about-section" id="about-history"><AboutWave index={0}/><div className="about-history-image reveal" role="img" aria-label="Пейзаж сельскохозяйственных полей"/><div className="about-history-copy reveal"><div className="about-kicker">НАША ИСТОРИЯ</div><h2>Развиваем хозяйство<br/>с заботой о будущем</h2><p>КФХ «Март» работает в Завьяловском районе Алтайского края, в селе Светлое. Выращиваем зерновые и масличные культуры, уделяя внимание каждому сезону и качеству работы.</p><p>Для нас сельское хозяйство — это ответственность за землю, надёжный труд и постоянное развитие.</p><div className="about-history-facts"><div><strong>Алтай</strong><span>родной край</span></div><div><strong>03</strong><span>основные культуры</span></div><div><strong>Март</strong><span>наше хозяйство</span></div></div></div></section>
   <section className="about-values about-section"><AboutWave index={1}/><div className="about-values-inner reveal"><div className="about-kicker">НАШИ ЦЕННОСТИ</div><div className="about-value-grid"><article><span className="about-value-symbol">♧</span><h3>Ответственность</h3><p>Бережно относимся к земле и природным ресурсам.</p></article><article><span className="about-value-symbol">✧</span><h3>Качество</h3><p>Внимание к каждому этапу выращивания.</p></article><article><span className="about-value-symbol">◎</span><h3>Развитие</h3><p>Совершенствуем подход к работе и производству.</p></article></div></div></section>
   <section className="about-people about-section"><AboutWave index={2}/><div className="about-people-copy reveal"><div className="about-kicker">ЛЮДИ И ТЕХНИКА</div><h2>Сила хозяйства —<br/>в людях и их труде</h2><p>За каждым урожаем стоит ежедневная работа, опыт и надёжная техника, которые помогают добиваться результата.</p><a className="about-outline-button" href="#/machinery">Наша техника <ArrowUpRight size={17}/></a></div><div className="about-people-photos reveal"><div className="about-people-photo about-people-photo-one" role="img" aria-label="Поля Алтайского края"/><div className="about-people-photo about-people-photo-two" role="img" aria-label="Сельскохозяйственная техника в поле"/></div></section>
   <section className="about-products-cta"><AboutWave index={3}/><div className="about-cta-inner reveal"><div><div className="about-kicker">ВЫРАЩЕНО НА НАШЕЙ ЗЕМЛЕ</div><h2>Наша продукция</h2><p>Пшеница, подсолнечник и лён — результат труда каждого сезона.</p></div><a className="about-outline-button" href="#/products">Перейти в продукцию <ArrowUpRight size={17}/></a></div></section>
  </main><SiteFooter/>
 </div>;
}


function ContactModal(){
 const[open,setOpen]=useState(false),[type,setType]=useState('contact'),[copied,setCopied]=useState(false);
 const[form,setForm]=useState({name:'',phone:'',email:'',company:'',message:''});
 useEffect(()=>{
  const handler=e=>{const a=e.target.closest?.('a');if(!a)return;const label=a.textContent?.trim()||'';if(label.includes('Обсудить сотрудничество')||(a.classList.contains('contact-link')&&label.includes('Связаться'))){e.preventDefault();setType(label.includes('Обсудить')?'cooperation':'contact');setCopied(false);setOpen(true)}};
  document.addEventListener('click',handler);return()=>document.removeEventListener('click',handler);
 },[]);
 useEffect(()=>{if(!open)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';const key=e=>{if(e.key==='Escape')setOpen(false)};document.addEventListener('keydown',key);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key)}},[open]);
 if(!open)return null;
 const cooperation=type==='cooperation';
 const update=e=>setForm(v=>({...v,[e.target.name]:e.target.value}));
 const submit=async e=>{e.preventDefault();const message=['КФХ Март — '+(cooperation?'Запрос о сотрудничестве':'Обратная связь'),'Имя: '+form.name,'Телефон: '+form.phone,form.email&&'E-mail: '+form.email,form.company&&'Компания: '+form.company,'Сообщение: '+form.message].filter(Boolean).join('\n');try{await navigator.clipboard.writeText(message);setCopied(true)}catch{setCopied(false);window.prompt('Скопируйте текст заявки:',message)}};
 return <div className="mart-modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><section className="mart-contact-modal" role="dialog" aria-modal="true" aria-labelledby="mart-contact-title">
  <button className="mart-modal-close" type="button" aria-label="Закрыть форму" onClick={()=>setOpen(false)}><X size={22}/></button>
  <div className="mart-modal-kicker">КФХ «МАРТ» · ОБРАТНАЯ СВЯЗЬ</div><h2 id="mart-contact-title">{cooperation?'Обсудить сотрудничество':'Связаться с нами'}</h2><p className="mart-modal-intro">Оставьте ваши контакты и расскажите, что вас интересует.</p>
  <form onSubmit={submit}><label>Ваше имя *<input name="name" value={form.name} onChange={update} placeholder="Как к вам обращаться" required maxLength={100}/></label><label>Телефон *<input name="phone" type="tel" value={form.phone} onChange={update} placeholder="+7 (999) 000-00-00" required maxLength={35}/></label>
  <label>E-mail<input name="email" type="email" value={form.email} onChange={update} placeholder="name@example.ru" maxLength={150}/></label>
  {cooperation&&<label>Компания<input name="company" value={form.company} onChange={update} placeholder="Название организации" maxLength={150}/></label>}
  <label>Ваше сообщение *<textarea name="message" value={form.message} onChange={update} placeholder="Расскажите о вашем запросе" required maxLength={2000} rows={3}/></label>
  <button className="mart-modal-submit" type="submit">{copied?'Заявка скопирована':'Скопировать заявку'} <ArrowUpRight size={18}/></button>
  <p className="mart-modal-note" role="status">{copied?'Текст заявки скопирован. Его можно отправить хозяйству удобным способом.':'Пока не подключён адрес для приёма заявок: кнопка копирует заполненную форму, но не отправляет её.'}</p>
  </form></section></div>
}


function ContactsPage(){
 const[menu,setMenu]=useState(false);
 useLayoutEffect(()=>{window.scrollTo(0,0)},[]);
 return <div className="site contacts-page">
  <header className="top product-top product-reference-header home-reference-header contacts-header"><a className="brand" href="#/" onClick={()=>setMenu(false)}><span className="product-brand-icon">❧</span><span className="product-brand-text"><small>КФХ</small>Март</span></a><nav id="contacts-mobile-navigation" className={menu?'product-nav active':'product-nav'} aria-label="Основная навигация"><a href="#/" onClick={()=>setMenu(false)}>Главная</a><a href="#/products" onClick={()=>setMenu(false)}>Продукция</a><a href="#/about" onClick={()=>setMenu(false)}>О хозяйстве</a><a href="#/machinery" onClick={()=>setMenu(false)}>Техника</a><a href="#/contacts" className="active" aria-current="page" onClick={()=>setMenu(false)}>Контакты</a></nav><a href="#/contacts" className="contact-link">Связаться <ArrowUpRight size={15}/></a><button type="button" className="hamburger" aria-expanded={menu} aria-controls="contacts-mobile-navigation" aria-label={menu?'Закрыть меню':'Открыть меню'} onClick={()=>setMenu(v=>!v)}>{menu?<X/>:<Menu/>}</button></header>
  <main><section className="contacts-intro"><div className="contacts-kicker">КФХ «МАРТ» <span>—</span> КОНТАКТЫ</div><div className="contacts-hero-layout"><h1>Всегда<br/><span>на связи.</span></h1><p className="contacts-hero-lead">Открыты к новым партнёрствам, вопросам о продукции и совместной работе. Мы рядом — на земле Алтая.</p></div><div className="contacts-intro-bottom"><div><span className="contacts-label">МЕСТОНАХОЖДЕНИЕ</span><p>Алтайский край, Завьяловский район,<br/>село Светлое</p></div><div><span className="contacts-label">СОТРУДНИЧЕСТВО</span><p>По вопросам продукции<br/>и совместной работы</p></div><a href="#/contacts" className="contact-link contacts-cta">Обсудить сотрудничество <ArrowUpRight size={18}/></a></div><div className="contacts-wave" aria-hidden="true"><svg viewBox="0 0 1440 140" preserveAspectRatio="none"><path className="contacts-wave-fill" d="M0 55 C170 4 285 15 450 65 S740 138 940 68 S1240 4 1440 54 L1440 140 L0 140Z"/><path className="contacts-wave-halo" d="M0 55 C170 4 285 15 450 65 S740 138 940 68 S1240 4 1440 54"/><path className="contacts-wave-line" d="M0 55 C170 4 285 15 450 65 S740 138 940 68 S1240 4 1440 54"/></svg></div></section>
  <section className="contacts-map-section" aria-label="Расположение хозяйства"><div className="contacts-map-heading"><div><div className="contacts-label">ГДЕ НАС НАЙТИ</div><h2>Наше местоположение<span>.</span></h2></div><span>Алтайский край · Россия</span></div><div className="contacts-map-frame"><iframe title="Карта расположения КФХ Март — 2ГИС" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://makemap.2gis.ru/widget?data=eJw1jsFuhDAMRP_FvUarhBDI8gFb9ba3Sq32gIjbRgo4Cl6pW8S_10Drk-UZv5kFqAQsGJ6RRuQScYbufQF-ZIQOLtjzvSAoyIUyFt71BQZKVER_0pU3H5XoHDltH7IGnIcSM0eajsPPyxTwGzqj_2dV8HkEPjbcX9qV4sTiH0hKxannvYy3p9Z7Y2rl7MnWzp_tTf5jEKD3br0pGPt8pTkeiQuknqHbzZVrKqsbq93ZKkibvOHaylnXWq1r46Qe0SisRqBSnFJ6_UJMb_uVyx3XX8EDWRY" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allowFullScreen/></div></section></main>
  <SiteFooter/>
 </div>
}

function AppContent(){
 useEffect(()=>{
  const updateMetadata=()=>{
   const hash=window.location.hash;
   const product=productStories.find(item=>hash==='#/products/'+item.slug);
   const title=product?'КФХ «Март» — '+product.name:hash==='#/products'?'Продукция — КФХ «Март»':hash==='#/about'?'О хозяйстве — КФХ «Март»':hash==='#/machinery'?'Наш подход — КФХ «Март»':hash==='#/contacts'?'Контакты — КФХ «Март»':'КФХ «Март» — Земля. Труд. Урожай.';
   const description=product?product.desc:hash==='#/products'?'Пшеница, подсолнечник и лён — продукция КФХ «Март» в Алтайском крае.':'КФХ «Март» — выращиваем пшеницу, подсолнечник и лён в Завьяловском районе Алтайского края.';
   document.title=title;
   document.querySelector('meta[name="description"]')?.setAttribute('content',description);
   document.querySelector('meta[property="og:title"]')?.setAttribute('content',title);
   document.querySelector('meta[property="og:description"]')?.setAttribute('content',description);
  };
  updateMetadata();
  window.addEventListener('hashchange',updateMetadata);
  return()=>window.removeEventListener('hashchange',updateMetadata);
 },[]);
 useEffect(()=>{if('scrollRestoration' in history)history.scrollRestoration='manual'},[]);
 const[menu,setMenu]=useState(false);
 const[route,setRoute]=useState(()=>window.location.hash);
 const[copied,setCopied]=useState(false);
 useEffect(()=>{const onHash=()=>{setRoute(window.location.hash);setMenu(false);if(window.location.hash.startsWith('#/products'))window.scrollTo(0,0)};window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[]);
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer=(!reduced&&'IntersectionObserver' in window)?new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
  },{threshold:.12,rootMargin:'0px 0px -25px 0px'}):null;
  document.querySelectorAll('.site:not(.product-page) .reveal').forEach(el=>{
   if(observer)observer.observe(el);
   else el.classList.add('is-visible');
  });
  let raf=0;
  const update=()=>{
   raf=0;
   const hero=document.querySelector('.hero');
   if(hero)hero.style.setProperty('--hero-shift',Math.min(100,scrollY*.115)+'px');
  };
  const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update)};
  addEventListener('scroll',onScroll,{passive:true});update();
  return()=>{observer?.disconnect();removeEventListener('scroll',onScroll);cancelAnimationFrame(raf)};
 },[route]);
 useEffect(()=>{if(route!=='#/machinery')return;let raf1=0,raf2=0;raf1=requestAnimationFrame(()=>{raf2=requestAnimationFrame(()=>document.getElementById(route==='#/machinery'?'land':route.slice(2))?.scrollIntoView({behavior:'instant',block:'start'}))});return()=>{cancelAnimationFrame(raf1);cancelAnimationFrame(raf2)}},[route]);
 const copyAddress=async()=>{
  const address='Алтайский край, Завьяловский район, село Светлое';
  try{await navigator.clipboard.writeText(address);setCopied(true)}catch{setCopied(false)}
 };
 if(route==='#/products'||route.startsWith('#/products/'))return <ProductPage slug={route.split('/')[2]}/>;
 if(route==='#/about')return <AboutPage/>;
 if(route==='#/contacts')return <ContactsPage/>;
 return <div className="site"><svg className="wave-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>
<clipPath id="wave-a" clipPathUnits="objectBoundingBox"><path d="M0,.105 C.16,-.04 .33,.20 .55,.17 C.73,.15 .85,.035 1,.055 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-b" clipPathUnits="objectBoundingBox"><path d="M0,.085 C.19,-.015 .34,.025 .52,.13 C.70,.21 .85,.15 1,.025 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-c" clipPathUnits="objectBoundingBox"><path d="M0,.12 C.20,.015 .40,.07 .57,.04 C.74,-.015 .87,-.02 1,.055 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-d" clipPathUnits="objectBoundingBox"><path d="M0,.08 C.17,.16 .37,.02 .55,.06 C.72,.11 .87,.20 1,.095 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-a-mobile" clipPathUnits="objectBoundingBox"><path d="M0,.048 C.18,.018 .32,.038 .50,.056 C.69,.074 .83,.045 1,.035 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-b-mobile" clipPathUnits="objectBoundingBox"><path d="M0,.040 C.17,.058 .36,.066 .54,.047 C.73,.028 .86,.032 1,.051 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-c-mobile" clipPathUnits="objectBoundingBox"><path d="M0,.049 C.17,.029 .33,.031 .51,.048 C.69,.065 .83,.058 1,.039 L1,1 L0,1 Z"/></clipPath>
<clipPath id="wave-d-mobile" clipPathUnits="objectBoundingBox"><path d="M0,.041 C.19,.061 .33,.058 .51,.043 C.69,.028 .85,.039 1,.054 L1,1 L0,1 Z"/></clipPath>
</defs></svg><header className="top product-top product-reference-header home-reference-header"><a href="#/" className="brand"><span className="product-brand-icon">❧</span><span className="product-brand-text"><small>КФХ</small>Март</span></a><nav id="home-mobile-navigation" aria-label="Основная навигация" className={menu?'product-nav active':'product-nav'}><a className="active" href="#/" onClick={()=>setMenu(false)}>Главная</a><a href="#/products" onClick={()=>setMenu(false)}>Продукция</a><a href="#/about" onClick={()=>setMenu(false)}>О хозяйстве</a><a href="#/machinery" onClick={()=>setMenu(false)}>Техника</a><a href="#/contacts" onClick={()=>setMenu(false)}>Контакты</a></nav><a className="contact-link" href="#/contacts">Связаться <ArrowUpRight size={15}/></a><button className="hamburger" onClick={()=>setMenu(!menu)} aria-label={menu?"Закрыть меню":"Открыть меню"} aria-expanded={menu} aria-controls="home-mobile-navigation" type="button">{menu?<X/>:<Menu/>}</button></header>
<main><section id="home" className="hero"><div className="hero-shade"/><div className="hero-dust" aria-hidden="true"/><div className="hero-copy reveal"><div className="eyebrow">РАСТЕНИЕВОДЧЕСКОЕ ХОЗЯЙСТВО</div><h1>МАРТ</h1><p className="tagline">Земля. Труд. Урожай.</p><p className="lead">Выращиваем пшеницу, подсолнечник<br/> и лён в Алтайском крае.</p><div className="actions"><a className="btn primary" href="#/products">Наша продукция <ArrowRight size={16}/></a><a className="btn ghost" href="#/about">О хозяйстве</a></div><div className="scroll-hint">ЛИСТАЙТЕ ВНИЗ <span>↓</span></div></div></section>
<section id="about" className="about"><WaveGlow shape="a"/><div className="about-photo"/><div className="about-copy reveal"><div className="eyebrow dark">О НАС</div><h2>О хозяйстве</h2><p>КФХ Март — сельскохозяйственное хозяйство в Завьяловском районе Алтайского края, село Светлое.</p><p>Выращиваем зерновые и масличные культуры, работаем на земле и развиваем производство.</p><a className="text-link" href="#/products">Что мы выращиваем <ArrowRight size={18}/></a></div></section>
<section id="products" className="products"><WaveGlow shape="b"/><div className="section-head reveal"><div><div className="eyebrow dark">НАША ДЕЯТЕЛЬНОСТЬ</div><h2>Что мы выращиваем</h2></div><p>Три культуры — одно отношение<br/>к качеству и работе.</p></div><div className="crop-grid">{crops.map((c,i)=><LazyBackground className="crop reveal" key={c.name} src={c.image} gradient="linear-gradient(0deg,rgba(34,29,19,.82),transparent 67%)" style={{transitionDelay:(i*80)+'ms'}}><div className="crop-info"><h3 className="crop-title">{c.name}</h3><p className="crop-desc">{c.desc}</p></div><span className="crop-arrow" aria-hidden="true"><ArrowUpRight size={22}/></span><a className="crop-hit" href={"#/products/"+productStories[i].slug} aria-label={"Подробнее о культуре: "+c.name}><span className="sr-only">Подробнее: {c.name}</span></a></LazyBackground>)}</div></section>
<section className="land" id="land"><div className="land-art" aria-hidden="true"/><WaveGlow shape="c"/><div className="land-inner reveal"><div className="eyebrow">НАШ ПОДХОД</div><h2>Забота о земле.<br/>Уважение к труду.</h2><p>Каждый сезон начинается с большой работы. Мы ценим опыт, надёжную технику и результат, который приносит земля.</p></div></section>
<section id="contacts" className="footer"><WaveGlow shape="d"/><div className="reveal"><div className="eyebrow dark">СОТРУДНИЧЕСТВО</div><h2>Давайте работать<br/>вместе</h2><p>По вопросам покупки сельхозпродукции и сотрудничества свяжитесь с хозяйством.</p><p className="address"><MapPin size={18}/> Алтайский край, Завьяловский район, село Светлое</p><button type="button" className="copy-address" onClick={copyAddress}>{copied?"Адрес скопирован":"Скопировать адрес"} <ArrowUpRight size={15}/></button></div><div className="contact-note reveal"><span className="contact-note-label">КОНТАКТЫ ХОЗЯЙСТВА</span><p>Телефон и реквизиты появятся после согласования с хозяйством.</p><div className="contact-remark">Контакты уточняются</div></div></section></main><SiteFooter/></div>}
function SiteFooter(){return <footer className="site-footer"><span>© {new Date().getFullYear()} КФХ «Март»</span><span>Алтайский край · Россия</span></footer>}
function App(){return <><AppContent/><ContactModal/></>}
export default App;