"use strict";
(() => {
  const deck=window.FEEDBACK_DECK, root=document.getElementById('slides');
  root.innerHTML=deck.map((s,i)=>`<section class="slide ${s.theme}" id="slide-${i+1}" tabindex="-1" aria-label="${s.title}" ${i?'hidden inert aria-hidden="true"':''}>${s.html}</section>`).join('');
  const slides=[...root.children],stage=document.querySelector('.stage');
  // Declare chart entrance groups once; the same timeline handles entry, seeking and print.
  const entranceGroups=[
    {slide:6,selector:'.selection-chart>div',kind:'selection',step:.13},
    {slide:7,selector:'.chart-row',kind:'profile',step:.16},
    {slide:8,selector:'.quality-dot',kind:'dot',step:.028},
    {slide:8,selector:'.evidence-grading tbody tr',kind:'evidence',step:.1}
  ];
  entranceGroups.forEach(({slide,selector,kind,step})=>slides[slide].querySelectorAll(selector).forEach((node,i)=>{
    node.dataset.enter=kind;node.dataset.delay=String(i*step);
  }));
  const prev=document.getElementById('previous'),next=document.getElementById('next');
  const scrubber=document.getElementById('animation-time'),transport=document.querySelector('.transport'),counter=document.getElementById('slide-counter');
  const preference=matchMedia('(prefers-reduced-motion: reduce)'),status=document.getElementById('announcement');
  const springs=deck.map(()=>({opacity:0,v:0,y:9,vy:0,target:0,yt:9}));
  let current=-1,elapsed=0,paused=preference.matches,lastFrame=0,raf=0,printing=false,dialogTrigger=null;
  const duration=()=>deck[current]?.duration||0;
  const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t)%60).padStart(2,'0')}`;
  const fit=()=>stage.style.setProperty('--deck-scale',stage.getBoundingClientRect().width/1280);
  new ResizeObserver(fit).observe(stage);fit();
  const fromHash=()=>{const m=location.hash.match(/^#slide-(\d+)$/);return m?Math.max(0,Math.min(deck.length-1,+m[1]-1)):0;};
  const settled=s=>Math.abs(s.opacity-s.target)<.002&&Math.abs(s.v)<.015&&Math.abs(s.y-s.yt)<.03&&Math.abs(s.vy)<.1;
  function settleTransitions(){springs.forEach((s,i)=>{s.opacity=s.target;s.y=s.yt;s.v=s.vy=0;slides[i].style.opacity=String(s.opacity);slides[i].style.transform=`translateY(${s.y}px)`;slides[i].hidden=s.target===0;});}
  function updateSprings(dt){
    let moving=false;const omega=2*Math.PI/.36;
    springs.forEach((s,i)=>{
      if(settled(s)){s.opacity=s.target;s.y=s.yt;s.v=s.vy=0;}
      else{moving=true;for(let left=dt;left>0;){const h=Math.min(1/120,left);s.v+=(-2*omega*s.v-omega*omega*(s.opacity-s.target))*h;s.opacity+=s.v*h;s.vy+=(-2*omega*s.vy-omega*omega*(s.y-s.yt))*h;s.y+=s.vy*h;left-=h;}}
      slides[i].style.opacity=String(Math.max(0,Math.min(1,s.opacity)));slides[i].style.transform=`translateY(${s.y}px)`;
      if(s.target===0&&settled(s))slides[i].hidden=true;
    });return moving;
  }
  // Small, finite illustrative gestures. Every gesture returns to rest at 2.4s.
  // The same pure time mapping serves playback, scrubbing, and static exports.
  function renderMotion(index,t){
    const q=preference.matches?0:Math.min(1,Math.max(0,t/2.4));
    const pulse=Math.sin(Math.PI*q)**2, wave=Math.sin(Math.PI*2*q)*pulse;
    slides[index].querySelectorAll('[data-motion]').forEach(node=>{
      const kind=node.dataset.motion;
      let x=0,y=0,rotation=0,scale=1;
      if(kind==='swim'){x=10*pulse;y=-3*wave;rotation=3*wave;}
      else if(kind==='throw'){y=-5*pulse;rotation=14*pulse;}
      else if(kind==='gym'){rotation=7*wave;}
      else if(kind==='icon'){y=-3*pulse;scale=1+.035*pulse;}
      else if(kind==='golf'){rotation=-5*pulse;}
      else if(kind==='tennis'){y=-6*pulse;rotation=10*pulse;}
      else if(kind==='gear'){rotation=20*pulse;}
      node.style.transform=`translate(${x}px,${y}px) rotate(${rotation}deg) scale(${scale})`;
    });
    slides[index].querySelectorAll('[data-enter]').forEach(node=>{
      const progress=preference.matches?1:Math.min(1,Math.max(0,(t-Number(node.dataset.delay))/.55));
      const p=1-(1-progress)**3,kind=node.dataset.enter;
      if(kind==='dot'){
        node.style.opacity=String(.3+.7*p);node.style.transform=`scale(${.72+.28*p})`;
      }else{
        // Move the intact diagrams, preserving their proportions and actual counts.
        node.style.opacity=String(.75+.25*p);
        node.style.transform=kind==='selection'?`translateX(${14*(1-p)}px)`:`translateY(${9*(1-p)}px)`;
      }
    });
  }
  function updateTransport(){
    const d=duration(),canPlay=d>0&&!preference.matches;
    transport.classList.toggle('is-static',!d);scrubber.max=String(d||1);scrubber.value=String(elapsed);scrubber.disabled=!canPlay;
    document.getElementById('animation-time-label').textContent=clock(elapsed);
    scrubber.setAttribute('aria-valuetext',`${elapsed.toFixed(1)} of ${d} seconds`);
  }
  function render(){renderMotion(current,elapsed);updateTransport();}
  function ensureFrame(){if(!raf&&!document.hidden&&!printing)raf=requestAnimationFrame(tick);}
  function tick(now){
    raf=0;const dt=Math.min((now-(lastFrame||now))/1000,.05);lastFrame=now;
    const moving=!preference.matches&&updateSprings(dt);
    if(!paused&&duration()){elapsed=Math.min(duration(),elapsed+dt);if(elapsed>=duration())paused=true;render();}
    if(moving||(!paused&&duration()))ensureFrame();
  }
  function showSlide(index,{updateHash=true,moveFocus=false}={}){
    index=Math.max(0,Math.min(deck.length-1,index));if(index===current)return;
    const old=current,dir=index>=old?1:-1;
    slides.forEach((node,i)=>{
      const active=i===index,s=springs[i];node.inert=!active;node.classList.toggle('active',active);
      if(active){node.hidden=false;node.removeAttribute('aria-hidden');if(s.target===0&&s.opacity<.002)s.y=9*dir;s.target=1;s.yt=0;}
      else{node.setAttribute('aria-hidden','true');s.target=0;s.yt=-6*dir;}
    });
    current=index;if(old<0||preference.matches)settleTransitions();
    prev.disabled=index===0;next.disabled=index===deck.length-1;
    counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(deck.length).padStart(2,'0')}`;
    counter.setAttribute('aria-label',`Slide ${index+1} of ${deck.length}. Open slide contents`);
    document.title=`${deck[index].title} | Motor Skill Feedback`;
    status.textContent=`Slide ${index+1} of ${deck.length}. ${deck[index].title}`;
    document.querySelector('.skip-link').href=`#slide-${index+1}`;
    if(updateHash&&location.hash!==`#slide-${index+1}`)history.pushState(null,'',`#slide-${index+1}`);
    elapsed=0;paused=preference.matches||!duration();render();lastFrame=performance.now();ensureFrame();
    if(moveFocus)slides[index].focus({preventScroll:true});
  }
  function setPaused(value){paused=value||preference.matches||!duration();if(!paused&&elapsed>=duration())elapsed=0;lastFrame=performance.now();render();ensureFrame();}
  function seek(t){paused=true;elapsed=Math.max(0,Math.min(duration(),t));render();}
  scrubber.addEventListener('input',()=>seek(Number(scrubber.value)));
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{status.textContent='Full screen is unavailable. Use your browser’s full screen command.';}}
  document.addEventListener('fullscreenchange',()=>document.getElementById('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen'));
  function openDialog(id,trigger){dialogTrigger=trigger;setPaused(true);document.getElementById(id).showModal();}
  document.getElementById('contents-list').innerHTML=deck.map((s,i)=>`<li><button data-slide="${i}"><span>${String(i+1).padStart(2,'0')}</span>${s.title}</button></li>`).join('');
  function openContents(trigger){
    document.querySelectorAll('[data-slide]').forEach((button,i)=>{if(i===current)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    openDialog('contents-dialog',trigger);
  }
  document.querySelectorAll('[data-slide]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('contents-dialog').close();showSlide(+button.dataset.slide,{moveFocus:true});}));
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',()=>dialogTrigger?.focus({preventScroll:true})));
  window.addEventListener('hashchange',()=>showSlide(fromHash(),{updateHash:false,moveFocus:true}));
  window.addEventListener('popstate',()=>showSlide(fromHash(),{updateHash:false,moveFocus:true}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else{lastFrame=performance.now();ensureFrame();}});
  preference.addEventListener('change',()=>{if(preference.matches){paused=true;elapsed=duration();settleTransitions();render();}});
  document.addEventListener('keydown',e=>{
    if(e.defaultPrevented||e.ctrlKey||e.altKey||e.metaKey||e.isComposing||e.target.closest('input,textarea,select,[contenteditable="true"],dialog[open]'))return;
    const keys={ArrowRight:current+1,PageDown:current+1,ArrowLeft:current-1,PageUp:current-1,Home:0,End:deck.length-1};
    if(Object.hasOwn(keys,e.key)){e.preventDefault();showSlide(keys[e.key],{moveFocus:true});}
    else if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen();}
  });
  function preparePrint(){printing=true;paused=true;cancelAnimationFrame(raf);raf=0;settleTransitions();slides.forEach((s,i)=>renderMotion(i,deck[i].duration));}
  window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',()=>{printing=false;render();});
  window.deckAPI={showSlide,seek,settleTransitions,preparePrint,fullscreen,openContents,getState(){return{currentSlide:current,paused,elapsed,duration:duration(),totalCount:deck.length};}};
  showSlide(fromHash(),{updateHash:false});
})();
