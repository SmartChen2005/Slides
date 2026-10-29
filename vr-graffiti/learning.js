/* Four learning stages. Canvas frames are deterministic; controls use native buttons. */
"use strict";
window.GraffitiLearning = (() => {
  const stages=['Tools','Strokes','Lettering','Create'];
  const alphabet='assets/learning/graffiti-alphabet.png';
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const canvas=(id,w,h,label)=>`<canvas id="${id}" width="${w*2}" height="${h*2}" style="width:${w}px;height:${h}px" role="img" aria-label="${label}">${label}</canvas>`;
  const progress=current=>`<ol class="learning-progress" aria-label="Learning stages">${stages.map((name,i)=>`<li ${i===current?'aria-current="step"':''}><span>0${i+1}</span> ${name}${i<3?'<b aria-hidden="true">→</b>':''}</li>`).join('')}</ol>`;
  const heading=(title,subtitle)=>`<h2 class="centered">${title}</h2><p class="lead centered">${subtitle}</p>`;
  const letterButtons=()=>Array.from({length:26},(_,i)=>{const col=i%4,row=Math.floor(i/4);return `<button type="button" class="alphabet-letter" data-letter="${i}" aria-label="Select letter ${String.fromCharCode(65+i)}" aria-pressed="${i===0}" style="left:${(15+128*col)/540*100}%;top:${(60+86*row)/692*100}%;width:${128/540*100}%;height:${86/692*100}%"><span class="sr-only">${String.fromCharCode(65+i)}</span></button>`;}).join('');
  const layouts=[
    {title:'Learning the Tools',theme:'learning-slide learning-tools',duration:8,loop:true,html:heading('Learning the Tools','Different tools, different techniques.')+`<div class="learning-tool-grid">${[['Spray Can','Practice spray distance, movement speed, and coverage.','spray'],['Marker','Practice controlled lines, sketching, and precise outlines.','marker'],['Roller','Practice broad strokes, large fills, and surface coverage.','roller']].map(([name,copy,id])=>`<figure>${canvas('learn-'+id,344,264,`${name} moves across a surface and leaves its characteristic paint trail`)}<figcaption><h3>${name}</h3><p>${copy}</p></figcaption></figure>`).join('')}</div>`+progress(0)},
    {title:'Practicing Stroke Techniques',theme:'learning-slide learning-strokes',duration:18,html:heading('Practicing Stroke Techniques','Building control through guided movement.')+`<figure class="stroke-training">${canvas('learn-guidance',740,350,'A translucent ghost hand demonstrates a curved stroke, the learner follows, and assistance fades over three practice levels')}<figcaption><span class="ghost-key">Ghost hand</span><span class="learner-key">Your stroke</span></figcaption></figure><div class="stroke-objectives"><h3>Build control</h3><p>Lines &amp; curves</p><p>Outlines &amp; fills</p><p>Width &amp; consistency</p><p>Distance &amp; speed</p></div><div class="guidance-levels">${['Full Guidance','Partial Guidance','Independent Practice'].map((label,i)=>`<span data-guidance="${i}">${label}</span>`).join('<b aria-hidden="true">→</b>')}</div>`+progress(1)},
    {title:'Learning Lettering Styles',theme:'learning-slide learning-lettering',duration:0,html:heading('Learning Lettering Styles','One letter at a time.')+`<figure class="alphabet-reference"><img src="${alphabet}" width="540" height="692" alt="Original supplied graffiti alphabet chart, showing A through Z and a sample tag">${letterButtons()}</figure><div class="letter-detail"><p class="letter-prompt">Select a letter to explore</p><h3 id="selected-letter" aria-live="polite">Letter A</h3><div class="letter-enlargement"><svg viewBox="0 20 166 142" role="img" aria-label="Enlarged detail of letter A from the original alphabet"><image href="${alphabet}" width="540" height="692"/></svg></div><p class="letter-sequence">Observe <span>→</span> Trace <span>→</span> Reproduce</p><p class="letter-objectives">Structure &amp; proportions<br>Stroke order &amp; direction<br>Individual letters, then words and tags</p></div>`+progress(2)},
    {title:'Creative Expression',theme:'learning-slide learning-create',duration:12,html:heading('Creative Expression','From imitation to personal style.')+`<figure class="creation-art">${canvas('learn-create',1100,360,'An original FLOW tag transforms from a simple outline into a colorful composition with fills, contours and expressive details')}</figure><p class="creation-note">Combine tools, strokes and letters. Create your own tag.</p>`+progress(3)}
  ];
  const surfaces=new Map();
  function surface(id){if(!surfaces.has(id)){const node=document.getElementById(id);surfaces.set(id,{ctx:node.getContext('2d'),w:node.width/2,h:node.height/2});}const s=surfaces.get(id);s.ctx.setTransform(2,0,0,2,0,0);s.ctx.clearRect(0,0,s.w,s.h);s.ctx.lineCap='round';s.ctx.lineJoin='round';return s;}
  function line(ctx,points,color,width){if(points.length<2)return;ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
  function can(ctx,x,y,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);const g=ctx.createLinearGradient(-13,0,13,0);g.addColorStop(0,'#b8bec8');g.addColorStop(.45,'#f5f5f7');g.addColorStop(1,'#929ba9');ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-14,12,28,63,7);ctx.fill();ctx.fillStyle='#1d1d1f';ctx.fillRect(-9,5,18,9);ctx.fillRect(-3,0,12,7);ctx.fillStyle='#0071e3';ctx.fillRect(-11,30,22,25);ctx.restore();}
  function hand(ctx,x,y,opacity){ctx.save();ctx.translate(x,y);ctx.globalAlpha*=opacity;ctx.strokeStyle='#2997ff';ctx.fillStyle='#d9ecff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-26,68);ctx.lineTo(-34,39);ctx.quadraticCurveTo(-39,20,-30,16);ctx.quadraticCurveTo(-24,12,-18,29);ctx.lineTo(-16,4);ctx.quadraticCurveTo(-15,-6,-8,-3);ctx.lineTo(-4,20);ctx.lineTo(5,-1);ctx.quadraticCurveTo(11,-8,15,0);ctx.lineTo(14,24);ctx.lineTo(25,9);ctx.quadraticCurveTo(34,4,33,14);ctx.lineTo(26,47);ctx.quadraticCurveTo(23,61,12,69);ctx.closePath();ctx.fill();ctx.stroke();can(ctx,1,-12,-.13);ctx.restore();}
  function tools(t){
    const p=ease(Math.min(t,5.4)/5.4),fade=ease(t/.45)*(1-ease((t-7.1)/.9));
    for(const id of ['spray','marker','roller']){
      const {ctx,w}=surface('learn-'+id);ctx.fillStyle='#f5f5f7';ctx.beginPath();ctx.roundRect(0,0,w,264,22);ctx.fill();ctx.globalAlpha=fade;
      if(id==='spray'){
        for(let i=0;i<180*p;i++){const u=i/180,x=34+268*u,y=148+12*Math.sin(u*Math.PI),r=7+22*u;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(0,113,227,.16)');g.addColorStop(.6,'rgba(0,113,227,.08)');g.addColorStop(1,'rgba(0,113,227,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}
        const x=34+268*p,y=148+12*Math.sin(p*Math.PI);ctx.strokeStyle='rgba(41,151,255,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+8,y-45-20*p);ctx.lineTo(x-10-15*p,y);ctx.moveTo(x+8,y-45-20*p);ctx.lineTo(x+10+15*p,y);ctx.stroke();can(ctx,x+14,y-105-20*p,-.18);
      }else if(id==='marker'){
        const pts=Array.from({length:Math.floor(180*p)+1},(_,i)=>{const u=i/180;return{x:32+270*u,y:155+24*Math.sin(u*Math.PI*2)};});line(ctx,pts,'#ef8731',12);const q=pts.at(-1);ctx.save();ctx.translate(q.x,q.y);ctx.rotate(.28);ctx.fillStyle='#e5e7eb';ctx.fillRect(-7,-84,17,65);ctx.fillStyle='#ef8731';ctx.fillRect(-9,-65,21,40);ctx.fillStyle='#1d1d1f';ctx.beginPath();ctx.moveTo(-7,-19);ctx.lineTo(10,-19);ctx.lineTo(5,0);ctx.lineTo(-4,0);ctx.closePath();ctx.fill();ctx.restore();
      }else{
        const first=clamp(p*2),second=clamp((p-.5)*2);ctx.fillStyle='#1d1d1f';ctx.fillRect(36,78,272*first,47);ctx.fillStyle='#343439';ctx.fillRect(36,119,272*second,47);const x=36+272*(p<.5?first:second),y=p<.5?100:143;ctx.fillStyle='#e5e7eb';ctx.beginPath();ctx.roundRect(x-16,y-29,32,58,9);ctx.fill();ctx.strokeStyle='#929ba9';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+18,y);ctx.lineTo(x+30,y);ctx.lineTo(x+30,y+45);ctx.lineTo(x+8,y+56);ctx.stroke();ctx.strokeStyle='#f5a65a';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(x+8,y+56);ctx.lineTo(x+8,y+90);ctx.stroke();
      }ctx.globalAlpha=1;
    }
  }
  function strokePoint(u){return{x:85+545*u,y:163+68*Math.sin(u*Math.PI*2)-25*u};}
  function guidance(t){
    const {ctx}=surface('learn-guidance'),phase=Math.min(2,Math.floor(t/6)),local=t-phase*6;
    const progress=ease((local-.4)/4.7),learner=ease((local-1.45)/4.2),support=1-.64*ease((t-4.7)/2.5)-.36*ease((t-10.7)/2.5);
    ctx.fillStyle='#f5f5f7';ctx.beginPath();ctx.roundRect(0,0,740,350,24);ctx.fill();
    const points=Array.from({length:181},(_,i)=>strokePoint(i/180));
    if(support){ctx.globalAlpha=support;ctx.setLineDash([5,9]);line(ctx,points,'#77aee8',3);ctx.setLineDash([]);line(ctx,points.slice(0,Math.floor(progress*180)+1),'#aad2fa',18);ctx.globalAlpha=1;const ghost=strokePoint(progress);hand(ctx,ghost.x,ghost.y-8,support*.68);}
    const actual=points.slice(0,Math.floor(learner*180)+1).map((p,i)=>({x:p.x,y:p.y+4*Math.sin(i*.13)*(phase===2?.65:1)}));line(ctx,actual,'#0071e3',15);
    const q=strokePoint(learner);can(ctx,q.x+12,q.y+16,-.2);
    document.querySelectorAll('[data-guidance]').forEach((node,i)=>node.classList.toggle('is-current',i===phase));
  }
  const letterPaths=[
    'M0 28L170 0L153 62L75 74L65 112L139 104L127 159L52 167L30 250L-25 238Z',
    'M212 13L271 8L237 190L344 173L333 236L166 257Z',
    'M406 22Q524-22 548 82L524 198Q505 261 397 244Q351 224 367 149L384 57ZM433 80L413 179Q425 196 462 177L486 75Q461 57 433 80Z',
    'M597 24L652 14L641 157L713 33L762 25L754 153L820-1L882 12L762 251L697 235L704 134L644 247L579 238Z'
  ];
  function create(t){
    const {ctx}=surface('learn-create'),fill=ease((t-2.1)/4.8),details=ease((t-6.5)/3.4),finish=ease((t-9)/2.5);
    ctx.save();ctx.translate(124,68);ctx.rotate(-.035);
    const gradient=ctx.createLinearGradient(0,0,880,260);gradient.addColorStop(0,'#2997ff');gradient.addColorStop(.45,'#af52de');gradient.addColorStop(.75,'#f66ea0');gradient.addColorStop(1,'#f5a65a');
    for(const d of letterPaths){const p=new Path2D(d);ctx.strokeStyle='#d2d2d7';ctx.lineWidth=3;ctx.stroke(p);ctx.save();ctx.clip(p);ctx.fillStyle=gradient;ctx.fillRect(-40,270*(1-fill),940,290*fill);ctx.restore();ctx.globalAlpha=details;ctx.strokeStyle='#29294b';ctx.lineWidth=8;ctx.stroke(p);ctx.globalAlpha=1;}
    ctx.globalAlpha=details;line(ctx,[{x:-18,y:265},{x:330,y:281},{x:860,y:252}],'#0071e3',7);ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=4;[[28,61,109,47],[223,49,206,147],[420,52,469,45],[609,49,604,128]].forEach(([a,b,c,d])=>{ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();});
    ctx.globalAlpha=finish;[[22,277,7],[879,249,13],[862,278,5],[-48,164,8],[-30,187,4]].forEach(([x,y,r])=>{ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();});ctx.restore();
  }
  function selectLetter(index){const col=index%4,row=Math.floor(index/4),letter=String.fromCharCode(65+index),x=Math.max(0,15+128*col-16),y=Math.max(0,60+86*row-20);document.querySelectorAll('[data-letter]').forEach(n=>n.setAttribute('aria-pressed',String(+n.dataset.letter===index)));document.getElementById('selected-letter').textContent='Letter '+letter;const svg=document.querySelector('.letter-enlargement svg');svg.setAttribute('viewBox',`${x} ${y} 160 130`);svg.setAttribute('aria-label',`Enlarged detail of letter ${letter} from the original alphabet`);}
  function init(){document.querySelectorAll('[data-letter]').forEach(button=>{button.addEventListener('click',()=>selectLetter(+button.dataset.letter));button.addEventListener('keydown',event=>{const moves={ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4};if(!(event.key in moves))return;event.preventDefault();event.stopPropagation();const index=Math.max(0,Math.min(25,+button.dataset.letter+moves[event.key]));selectLetter(index);document.querySelector(`[data-letter="${index}"]`).focus();});});selectLetter(0);}
  function render(index,t){if(index===0)tools(t);else if(index===1)guidance(t);else if(index===3)create(t);}
  return{layouts,init,render};
})();
