/* Original teaching sketches, informed by credited graffiti photographs.
   The strokes illustrate construction, not the original artist's recorded order. */
"use strict";
window.GraffitiLettering = (() => {
  const refs = [
    {key:'handstyle',sourceKey:'handstyleRef',name:'Handstyle',work:'YANK tag',image:'assets/lettering/handstyle-yank.jpg',width:506,height:384,crop:'0 0 506 330',page:'https://commons.wikimedia.org/wiki/File:Tag_yank.jpg',creator:'Crazyank',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',study:'YANK study',focus:'Signature rhythm',level:'Curriculum direction'},
    {key:'bubble',sourceKey:'bubbleRef',name:'Bubble / Throw-up',work:'SPLEEN, NSW',image:'assets/lettering/bubble-spleen.jpg',width:1030,height:832,crop:'80 110 850 510',page:'https://commons.wikimedia.org/wiki/File:Bubble_writing_graffiti.jpg',creator:'Notcharizard',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',study:'SPLEEN study',focus:'Inflated contours',level:'Semester lesson: Bubble S'},
    {key:'wildstyle',sourceKey:'wildstyleRef',name:'Wildstyle',work:'Germany, wall detail',image:'assets/lettering/wildstyle-germany.jpg',width:1280,height:384,crop:'220 0 810 384',page:'https://commons.wikimedia.org/wiki/File:Wildstyle_graffiti.JPG',creator:'KOchstudiO',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',study:'FLOW study',focus:'Structure + overlaps',level:'Future showcase'}
  ];
  const hand=[
    ['M22 28C26 50 31 64 43 66C55 65 64 40 66 24',.2,.85],
    ['M47 55C42 81 32 106 19 119',.85,1.3],
    ['M54 105C70 66 75 26 91 22C100 46 105 73 114 104M64 78Q87 74 108 78',1.3,2.15],
    ['M115 105L123 27C124 21 128 29 132 37L157 95L169 23',2.1,2.9],
    ['M179 104L189 24M223 27Q202 56 186 64Q210 64 235 98',2.9,3.75],
    ['M17 128Q120 141 235 113',3.75,4.3]
  ];
  const bubbles=[
    'M78 29C60-1 4 5 6 45C5 73 70 62 68 91C65 117 15 116 5 97L0 126C25 157 100 139 101 94C103 51 38 61 38 43C39 29 60 30 68 41Z',
    'M113 137C101 102 101 67 108 31C113 4 159 4 176 23C194 47 176 82 149 80C157 119 151 147 132 148Q119 151 113 137ZM135 30Q157 20 156 43Q155 58 135 54Z',
    'M197 30Q202 4 224 12Q243 17 238 43L230 103Q268 87 277 105Q286 124 270 137Q232 158 206 146Q185 128 191 96Z',
    'M289 31Q295 4 323 9Q365 1 376 26Q384 49 352 54Q375 56 372 74Q370 90 343 92Q380 87 381 116Q380 144 343 148Q293 158 288 127Q275 80 289 31ZM320 38Q338 30 342 44L320 47Z',
    'M389 31Q395 4 423 9Q465 1 476 26Q484 49 452 54Q475 56 472 74Q470 90 443 92Q480 87 481 116Q480 144 443 148Q393 158 388 127Q375 80 389 31ZM420 38Q438 30 442 44L420 47Z',
    'M494 132L492 35C497 4 519 12 530 36L552 78L551 29C553 5 581 9 586 29L587 134Q578 156 558 143L530 98L529 134Q518 156 501 143Z'
  ];
  const wild=[
    'M42 159L66 31L178 18L167 50L101 61L94 84L153 76L145 111L87 117L77 158Z',
    'M160 164L190 27L227 20L201 125L268 110L253 151Z',
    'M255 139L282 49L366 12L398 36L369 138L283 170ZM303 122L335 108L354 54L325 69Z',
    'M388 33L426 22L419 106L459 29L488 23L490 103L530 16L571 7L511 158L475 166L466 102L435 170L394 164Z'
  ];
  const extensions=['M62 32L25 23L46 61Z','M142 83L188 66L172 106L145 111Z','M204 126L285 96L266 132L254 152L185 170Z','M334 26L357 0L364 18Z','M548 46L605 35L577 78L566 60L534 89Z'];
  const drawPath=(d,from,to,attrs='')=>`<path class="style-draw" d="${d}" data-from="${from}" data-to="${to}" pathLength="1" fill="none" stroke-linecap="round" stroke-linejoin="round" ${attrs}/>`;
  function scene(body,viewBox,label){return `<svg class="lettering-construction" viewBox="${viewBox}" role="img" aria-label="${label}">${body}<circle class="style-pen" cx="0" cy="0" r="4" fill="#0071e3" stroke="white" stroke-width="1.5"/></svg>`;}
  function handScene(){return scene(hand.map(([d,a,b])=>`<path d="${d}" fill="none" stroke="#e8ebf0" stroke-width="5" stroke-linecap="round"/>${drawPath(d,a,b,'stroke="#1d1d1f" stroke-width="6"')}`).join(''),'0 0 256 150','YANK written as a handstyle signature with separate strokes and an underline');}
  function bubbleScene(){return scene(bubbles.map((d,i)=>`<path class="bubble-body" d="${d}" fill="#f2f8fe" fill-rule="evenodd"/>${drawPath(d,4.65+i*.57,5.5+i*.57,'stroke="#1d1d1f" stroke-width="6"')}`).join(''),'-8 -8 610 172','SPLEEN develops through six rounded contours, retaining letter counters and generous inflated proportions');}
  function wildScene(){return scene(`<defs><linearGradient id="wild-letter-fill" x1="0" y1="0" x2=".6" y2="1"><stop stop-color="#d3e6f6"/><stop offset=".5" stop-color="#749bc7"/><stop offset="1" stop-color="#566b94"/></linearGradient></defs>${drawPath('M60 151L83 45L159 31M80 92L138 87M181 151L205 35M181 151L252 134M284 137L308 58L361 31L378 44L351 125ZM410 39L409 139L470 40L480 143L550 25',9.05,10.5,'data-skeleton="true" stroke="#aac5e8" stroke-width="5"')}<g class="wild-shadow" transform="translate(8 10)" fill="#283449" fill-rule="evenodd">${wild.map(d=>`<path d="${d}"/>`).join('')}</g>${wild.map((d,i)=>`<path class="wild-body" data-letter="${i}" d="${d}" fill="url(#wild-letter-fill)" fill-rule="evenodd" stroke="white" stroke-width="11" stroke-linejoin="round"/>${drawPath(d,10.7+i*.55,11.75+i*.55,'stroke="#23324b" stroke-width="4"')}`).join('')}<g class="wild-extensions" fill="#9ecbe5" stroke="#23324b" stroke-width="3" stroke-linejoin="round">${extensions.map(d=>`<path d="${d}"/>`).join('')}</g><g class="wild-highlights" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><path d="M73 39L163 27M196 38L176 143M291 58L355 27M407 35L408 85M546 29L513 115"/></g>`,'7 -6 610 194','The readable FLOW skeleton grows into interlocking letter bodies, dimensional shadows and connected extensions');}
  function build(){const scenes=[handScene(),bubbleScene(),wildScene()];return refs.map((r,i)=>`<article class="lettering-tile" data-style="${r.key}"><h3>${r.name}</h3><button type="button" class="reference-button" data-reference="${r.key}" aria-label="Enlarge ${r.name} lettering"><svg class="reference-photo" viewBox="${r.crop}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Graffiti lettering: ${r.work}"><image href="${r.image}" x="0" y="0" width="${r.width}" height="${r.height}"/></svg><span class="reference-enlarge" aria-hidden="true">↗</span></button><p class="reference-caption">${r.work}</p><p class="reference-credit"><a href="${r.page}" target="_blank" rel="noopener noreferrer">${r.creator}</a> · <a href="${r.licenseUrl}" target="_blank" rel="noopener noreferrer">${r.license}</a></p><div class="construction-wrap">${scenes[i]}</div><p class="construction-label">${r.study}</p><p class="construction-focus">${r.focus}</p><span class="level">${r.level}</span></article>`).join('');}
  const cache=[];let root,dialog,lastTrigger;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ramp=(t,a,b)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x);};
  function init(){root=document.querySelector('.lettering-slide');if(!root)return;root.querySelectorAll('.style-draw').forEach(node=>cache.push({node,from:+node.dataset.from,to:+node.dataset.to,length:node.getTotalLength(),svg:node.closest('svg')}));
    dialog=document.getElementById('lettering-reference');
    root.querySelectorAll('[data-reference]').forEach(button=>button.addEventListener('click',()=>{
      const r=refs.find(r=>r.key===button.dataset.reference);lastTrigger=button;
      if(window.deckAPI)window.deckAPI.seek(window.deckAPI.getState().elapsed);
      document.getElementById('reference-title').textContent=r.name+' · '+r.work;
      const image=document.getElementById('reference-image');image.src=r.image;image.alt='Full original photograph: '+r.work;
      const credit=document.getElementById('reference-credit');credit.replaceChildren();credit.append('Photo: '+r.creator+'. ');const a=document.createElement('a');a.href=r.page;a.textContent='Original source';a.target='_blank';a.rel='noopener noreferrer';credit.appendChild(a);credit.append(' · ');const license=document.createElement('a');license.href=r.licenseUrl;license.textContent=r.license;license.target='_blank';license.rel='noopener noreferrer';credit.appendChild(license);dialog.showModal();
    }));
    document.getElementById('reference-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>lastTrigger?.focus());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  }
  function render(t){if(!root)return;
    root.querySelectorAll('.style-pen').forEach(n=>n.style.opacity='0');
    cache.forEach(({node,from,to,length,svg})=>{const p=ramp(t,from,to);node.style.strokeDasharray='1';node.style.strokeDashoffset=String(1-p);if(t>=from&&t<=to&&p>0&&p<1){const q=node.getPointAtLength(length*p),pen=svg.querySelector('.style-pen');pen.setAttribute('cx',q.x);pen.setAttribute('cy',q.y);pen.style.opacity='1';}});
    root.querySelectorAll('.wild-body').forEach((n,i)=>n.style.opacity=String(ramp(t,10.5+i*.55,11.4+i*.55)));
    root.querySelector('.wild-shadow').style.opacity=String(ramp(t,11.9,13.8));root.querySelector('.wild-extensions').style.opacity=String(ramp(t,13.6,15.4));root.querySelector('.wild-highlights').style.opacity=String(ramp(t,14.7,15.9));
    const skeleton=root.querySelector('[data-skeleton]');if(skeleton)skeleton.style.opacity=String(1-ramp(t,10.6,13.8));
    root.querySelectorAll('.lettering-tile').forEach((n,i)=>n.classList.toggle('is-current',t>=[0,4.5,9][i]&&t<[4.5,9,16][i]));
  }
  return {refs,build,init,render};
})();
