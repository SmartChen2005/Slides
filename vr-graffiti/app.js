"use strict";
const deck=window.GRAFFITI_DECK;
const mainCount=deck.filter(s=>!s.backup).length;
const slidesRoot=document.getElementById('slides');
slidesRoot.innerHTML=deck.map((s,i)=>`<section class="slide ${s.theme||''}" id="slide-${i+1}" tabindex="-1" aria-label="${s.title}" ${i?'hidden inert aria-hidden="true"':''}>${s.html}</section>`).join('');
const slides=[...slidesRoot.children],stage=document.querySelector('.stage');
const previousButton=document.getElementById('previous'),nextButton=document.getElementById('next');
const pauseButton=document.getElementById('pause');
const scrubber=document.getElementById('animation-time'),transport=document.querySelector('.transport');
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const totalTime=deck.reduce((sum,s)=>sum+s.seconds,0);
let currentSlide=-1,paused=motionPreference.matches,elapsed=0,lastFrame=0,raf=0,printing=false;
const transitions=deck.map(()=>({opacity:0,velocity:0,y:9,yVelocity:0,target:0,yTarget:9}));
const formatTime=seconds=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds)%60).padStart(2,'0')}`;
window.GraffitiMotion.init();
window.GraffitiLearning.init();
window.GraffitiLettering.init();
function fitCanvas(){stage.style.setProperty('--deck-scale',stage.getBoundingClientRect().width/1280);}
new ResizeObserver(fitCanvas).observe(stage);fitCanvas();
function slideFromHash(){const m=location.hash.match(/^#slide-(\d+)$/);return m?Math.max(0,Math.min(deck.length-1,+m[1]-1)):0;}
function duration(){return deck[currentSlide]?.duration||0;}
function updateTransport(){
  const d=duration();transport.classList.toggle('is-static',!d);scrubber.max=String(d||1);scrubber.value=String(elapsed);scrubber.disabled=!d;
  document.getElementById('animation-time-label').textContent=formatTime(elapsed);
  pauseButton.disabled=!d;document.getElementById('replay').disabled=!d;
  pauseButton.textContent=paused?'Play':'Pause';pauseButton.setAttribute('aria-pressed',String(paused));
  scrubber.setAttribute('aria-valuetext',`${elapsed.toFixed(1)} of ${d} seconds`);
}
function renderCurrent(){GraffitiMotion.render(currentSlide,elapsed);updateTransport();}
function settled(s){return Math.abs(s.opacity-s.target)<.002&&Math.abs(s.velocity)<.015&&Math.abs(s.y-s.yTarget)<.03&&Math.abs(s.yVelocity)<.1;}
function settleTransitions(){transitions.forEach((s,i)=>{s.opacity=s.target;s.y=s.yTarget;s.velocity=s.yVelocity=0;slides[i].style.opacity=String(s.opacity);slides[i].style.transform=`translateY(${s.y}px)`;slides[i].hidden=s.target===0;});}
function updateSprings(dt){
  const omega=2*Math.PI/.36;let moving=false;
  transitions.forEach((s,i)=>{
    if(settled(s)){s.opacity=s.target;s.y=s.yTarget;s.velocity=s.yVelocity=0;}
    else {
      moving=true;
      // Independent position/opacity springs carry their current velocity on retarget.
      for(let remaining=dt;remaining>0;){const h=Math.min(1/120,remaining);s.velocity+=(-2*omega*s.velocity-omega*omega*(s.opacity-s.target))*h;s.opacity+=s.velocity*h;s.yVelocity+=(-2*omega*s.yVelocity-omega*omega*(s.y-s.yTarget))*h;s.y+=s.yVelocity*h;remaining-=h;}
    }
    const node=slides[i];node.style.opacity=String(Math.max(0,Math.min(1,s.opacity)));node.style.transform=`translateY(${s.y}px)`;
    if(s.target===0&&settled(s))node.hidden=true;
  });return moving;
}
function ensureFrame(){if(!raf&&!document.hidden&&!printing)raf=requestAnimationFrame(tick);}
function tick(now){
  raf=0;const dt=Math.min((now-(lastFrame||now))/1000,.05);lastFrame=now;
  const moving=!motionPreference.matches&&updateSprings(dt);
  if(!paused&&duration()){
    elapsed+=dt;if(deck[currentSlide].loop){elapsed%=duration();}else{elapsed=Math.min(duration(),elapsed);if(elapsed>=duration())paused=true;}renderCurrent();
  }
  if(moving||(!paused&&duration()))ensureFrame();
}
function setPaused(value){paused=value;if(!paused&&elapsed>=duration())elapsed=0;lastFrame=performance.now();updateTransport();if(!paused)ensureFrame();}
function resetAnimation(){elapsed=motionPreference.matches?GraffitiMotion.staticTimes[currentSlide]:0;paused=motionPreference.matches||!duration();renderCurrent();lastFrame=performance.now();ensureFrame();}
function showSlide(index,{updateHash=true,moveFocus=false}={}){
  index=Math.max(0,Math.min(deck.length-1,index));if(index===currentSlide)return;
  const previous=currentSlide,direction=index>=previous?1:-1;
  slides.forEach((node,i)=>{
    const active=i===index,s=transitions[i];node.inert=!active;node.classList.toggle('active',active);
    if(active){node.hidden=false;node.removeAttribute('aria-hidden');if(s.target===0&&s.opacity<.002)s.y=9*direction;s.target=1;s.yTarget=0;}
    else {node.setAttribute('aria-hidden','true');s.target=0;s.yTarget=-6*direction;}
  });
  currentSlide=index;if(previous<0||motionPreference.matches)settleTransitions();
  previousButton.disabled=index===0;nextButton.disabled=index===deck.length-1;
  nextButton.textContent=deck[index+1]?.backup?'Tools':'Next';
  nextButton.setAttribute('aria-label',deck[index+1]?.backup?'Open tools reference backup':'Next slide');
  document.getElementById('slide-counter').textContent=deck[index].backup?`Backup ${index-mainCount+1}/${deck.length-mainCount}`:`${String(index+1).padStart(2,'0')} / ${mainCount}`;
  document.getElementById('slide-time').textContent=deck[index].backup?'Backup':formatTime(deck[index].seconds);
  document.title=deck[index].name+' | VR Graffiti';
  document.getElementById('announcement').textContent=`${deck[index].backup?'Backup':`Slide ${index+1} of ${mainCount}`}. ${deck[index].title}`;
  document.querySelector('.skip-link').href=`#slide-${index+1}`;
  if(updateHash&&location.hash!==`#slide-${index+1}`)history.pushState(null,'',`#slide-${index+1}`);
  resetAnimation();if(moveFocus)slides[index].focus({preventScroll:true});
}
function seek(t){paused=true;elapsed=Math.max(0,Math.min(duration(),t));renderCurrent();}
previousButton.addEventListener('click',()=>showSlide(currentSlide-1));nextButton.addEventListener('click',()=>showSlide(currentSlide+1));
document.getElementById('replay').addEventListener('click',()=>{elapsed=0;renderCurrent();setPaused(false);});pauseButton.addEventListener('click',()=>setPaused(!paused));
scrubber.addEventListener('input',()=>seek(Number(scrubber.value)));
async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.getElementById('announcement').textContent='Full screen is unavailable. Use your browser’s full screen command.';}}
document.getElementById('fullscreen').addEventListener('click',toggleFullscreen);
document.addEventListener('fullscreenchange',()=>document.getElementById('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen'));
window.addEventListener('hashchange',()=>showSlide(slideFromHash(),{updateHash:false,moveFocus:true}));window.addEventListener('popstate',()=>showSlide(slideFromHash(),{updateHash:false,moveFocus:true}));
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else{lastFrame=performance.now();ensureFrame();}});
motionPreference.addEventListener('change',()=>{if(motionPreference.matches){setPaused(true);elapsed=GraffitiMotion.staticTimes[currentSlide];settleTransitions();renderCurrent();}});
document.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.ctrlKey||e.altKey||e.metaKey||e.isComposing||e.target.closest('input,textarea,select,[contenteditable="true"],dialog[open]'))return;
  const keys={ArrowRight:currentSlide+1,PageDown:currentSlide+1,ArrowLeft:currentSlide-1,PageUp:currentSlide-1,Home:0,End:mainCount-1};
  if(Object.hasOwn(keys,e.key)){e.preventDefault();showSlide(keys[e.key],{moveFocus:true});}
  else if(e.key.toLowerCase()==='r'&&duration()){e.preventDefault();elapsed=0;renderCurrent();setPaused(false);}
  else if(e.key.toLowerCase()==='f'){e.preventDefault();toggleFullscreen();}
  else if(e.code==='Space'&&!e.target.closest('button,a')&&duration()){e.preventDefault();setPaused(!paused);}
});
function preparePrint(){printing=true;paused=true;cancelAnimationFrame(raf);raf=0;settleTransitions();slides.forEach((s,i)=>GraffitiMotion.render(i,GraffitiMotion.staticTimes[i]));}
window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',()=>{printing=false;renderCurrent();});
window.deckAPI={showSlide,seek,preparePrint,settleTransitions,getState(){return{currentSlide,paused,elapsed,duration:duration(),mainCount,totalCount:deck.length,totalTime};}};
showSlide(slideFromHash(),{updateHash:false});
