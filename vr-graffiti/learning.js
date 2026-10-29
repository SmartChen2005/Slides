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
    {title:'Learning the Tools',theme:'learning-slide learning-tools',duration:8,loop:true,html:heading('Learning the Tools','Different tools, different techniques.')+`<div class="learning-tool-grid">${[['Spray Can','Practice spray distance, movement speed, and coverage.','spray'],['Marker','Practice controlled lines, sketching, and precise outlines.','marker'],['Roller','Practice broad strokes, large fills, and surface coverage.','roller']].map(([name,copy,id])=>`<figure>${canvas('learn-'+id,344,264,`${name} moves across a surface and leaves its characteristic paint trail`)}<figcaption><h3>${name}${id==='spray'?'<sup>*</sup>':''}</h3><p>${copy}</p></figcaption></figure>`).join('')}</div>`+`<p id="learning-mvp" class="learning-mvp"><strong>* Spray Can is the MVP priority.</strong> Marker and Roller are optional, time permitting.</p>`+progress(0)},
    {title:'Practicing Stroke Techniques',theme:'learning-slide learning-strokes',duration:18,html:heading('Practicing Stroke Techniques','Consistent lines require precise control of distance, speed, and angle.')+`<figure class="stroke-training">${canvas('learn-guidance',740,350,'Five animated spray comparisons: Ideal makes a smooth consistent line. Too close leaves excess paint and drips. Too far produces faint fuzzy edges. Too slow creates paint buildup. Wrong angle makes spray distribution uneven.')}<figcaption>Same stroke. Different physical control.</figcaption></figure><div class="stroke-objectives"><h3>Precise control</h3><div><h4>Distance</h4><p>Coverage &amp; edge quality</p></div><div><h4>Speed</h4><p>Paint buildup</p></div><div><h4>Angle</h4><p>Even distribution</p></div></div>`+progress(1)},
    {title:'Learning Lettering Styles',theme:'learning-slide learning-lettering',duration:0,html:heading('Learning Lettering Styles','One letter at a time.')+`<figure class="alphabet-reference"><img src="${alphabet}" width="540" height="692" alt="Original supplied graffiti alphabet chart, showing A through Z and a sample tag">${letterButtons()}</figure><div class="letter-detail"><p class="letter-prompt">Select a letter to explore</p><h3 id="selected-letter" aria-live="polite">Letter A</h3><div class="letter-enlargement"><svg viewBox="0 20 166 142" role="img" aria-label="Enlarged detail of letter A from the original alphabet"><image href="${alphabet}" width="540" height="692"/></svg></div><a class="letter-resource" href="https://www.bombingscience.com/graffiti-letters-61-graffiti-artists-share-their-styles/" target="_blank" rel="noopener noreferrer" aria-label="Explore lettering styles on Bombing Science (opens in a new tab)"><span class="resource-source">Bombing Science</span><strong>Explore lettering styles <span aria-hidden="true">↗</span></strong></a><p class="letter-sequence">Observe <span>→</span> Trace <span>→</span> Reproduce</p><p class="letter-objectives">Structure &amp; proportions<br>Stroke order &amp; direction<br>Individual letters, then words and tags</p></div>`+progress(2)},
    {title:'Creative Expression',theme:'learning-slide learning-create',duration:0,html:heading('Creative Expression','A space for experimentation and personal style.')+`<div class="wall-materials"><figure><div class="wall-surface"><img src="assets/materials/concrete.jpg" alt="Concrete wall with an angular graffiti tag"><svg class="wall-tag tag-angular" viewBox="0 0 375 143" role="img" aria-label="Angular tag sample from Bombing Science"><svg viewBox="377 896 375 143" width="375" height="143"><image href="assets/tags/angular.jpg" width="768" height="1063"/></svg></svg></div><figcaption>Concrete</figcaption></figure><figure><div class="wall-surface"><img src="assets/materials/brick.jpg" alt="Brick wall with a flowing graffiti tag"><svg class="wall-tag tag-flowing" viewBox="0 0 550 160" role="img" aria-label="Flowing tag sample from Bombing Science"><svg viewBox="725 1446 550 160" width="550" height="160"><image href="assets/tags/flowing.jpg" width="1408" height="1775"/></svg></svg></div><figcaption>Brick</figcaption></figure><figure><div class="wall-surface"><img src="assets/materials/container-side.png" alt="Straight-on view of a single corrugated shipping-container wall with a calligraphic graffiti tag"><svg class="wall-tag tag-calligraphic" viewBox="0 0 375 150" role="img" aria-label="Calligraphic tag sample from Bombing Science"><svg viewBox="430 846 375 150" width="375" height="150"><image href="assets/tags/calligraphic.jpg" width="841" height="1024"/></svg></svg></div><figcaption>Container</figcaption></figure></div><p class="creation-note">Customize the wall. Experiment with materials. Create your own style.</p>`+progress(3)}

  ];
  const surfaces=new Map();
  function surface(id){if(!surfaces.has(id)){const node=document.getElementById(id);surfaces.set(id,{ctx:node.getContext('2d'),w:node.width/2,h:node.height/2});}const s=surfaces.get(id);s.ctx.setTransform(2,0,0,2,0,0);s.ctx.clearRect(0,0,s.w,s.h);s.ctx.lineCap='round';s.ctx.lineJoin='round';return s;}
  function line(ctx,points,color,width){if(points.length<2)return;ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
  function can(ctx,x,y,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);const g=ctx.createLinearGradient(-13,0,13,0);g.addColorStop(0,'#b8bec8');g.addColorStop(.45,'#f5f5f7');g.addColorStop(1,'#929ba9');ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-14,12,28,63,7);ctx.fill();ctx.fillStyle='#1d1d1f';ctx.fillRect(-9,5,18,9);ctx.fillRect(-3,0,12,7);ctx.fillStyle='#0071e3';ctx.fillRect(-11,30,22,25);ctx.restore();}
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
  function guidance(t){
    const {ctx}=surface('learn-guidance');
    ctx.fillStyle='#f5f5f7';ctx.beginPath();ctx.roundRect(0,0,740,350,24);ctx.fill();
    const labels=['Ideal','Too close','Too far','Too slow','Wrong angle'];
    const normal=clamp((t-.5)/10.5),slowTime=clamp((t-.5)/15.8);
    const slow=slowTime<.28?slowTime/.28*.45:slowTime<.66?.45+.06*(slowTime-.28)/.38:.51+.49*(slowTime-.66)/.34;
    const noise=n=>{const v=Math.sin(n*12.9898+78.233)*43758.5453;return v-Math.floor(v);};
    for(let row=0;row<5;row++){
      const y=38+62*row,p=row===3?slow:normal;
      ctx.font=`${row===0?600:500} 17px -apple-system, Segoe UI, sans-serif`;ctx.fillStyle=row===0?'#0071e3':'#1d1d1f';ctx.textAlign='left';ctx.fillText(labels[row],20,y+6);
      if(row<4){ctx.strokeStyle='#e5e5ea';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(20,y+38);ctx.lineTo(718,y+38);ctx.stroke();}
      const until=Math.floor(230*p);
      for(let i=0;i<=until&&p>0;i++){
        const u=i/230,x=165+450*u;
        if(row===0){
          // A narrow, steady footprint gives a consistent opaque line with a soft rim.
          const g=ctx.createRadialGradient(x,y,0,x,y,8);g.addColorStop(0,'rgba(0,113,227,.42)');g.addColorStop(.72,'rgba(0,113,227,.30)');g.addColorStop(1,'rgba(0,113,227,0)');ctx.fillStyle=g;ctx.fillRect(x-8,y-8,16,16);
        }else if(row===1){
          const g=ctx.createRadialGradient(x,y,0,x,y,13);g.addColorStop(0,'rgba(0,57,133,.75)');g.addColorStop(.65,'rgba(0,72,163,.53)');g.addColorStop(1,'rgba(0,72,163,0)');ctx.fillStyle=g;ctx.fillRect(x-13,y-13,26,26);
        }else if(row===2){
          const g=ctx.createRadialGradient(x,y,0,x,y,23);g.addColorStop(0,'rgba(0,113,227,.045)');g.addColorStop(.4,'rgba(0,113,227,.025)');g.addColorStop(1,'rgba(0,113,227,0)');ctx.fillStyle=g;ctx.fillRect(x-23,y-23,46,46);
          for(let k=0;k<5;k++){const a=noise(i*11+k)*Math.PI*2,r=Math.sqrt(noise(i*17+k+20))*24;ctx.fillStyle='rgba(0,113,227,.18)';ctx.fillRect(x+Math.cos(a)*r,y+Math.sin(a)*r,1,1);}
        }else if(row===3){
          const linger=Math.exp(-Math.pow((u-.48)/.09,2)),r=8+11*linger;
          const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(0,57,133,${.38+.4*linger})`);g.addColorStop(.7,`rgba(0,82,180,${.26+.35*linger})`);g.addColorStop(1,'rgba(0,82,180,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);
        }else{
          // An oblique footprint has a faint upper edge and a dense lower lip.
          const width=12+10*u;
          ctx.save();ctx.translate(x,y);ctx.transform(1,.12,.6,1,0,0);ctx.scale(1,1.6);
          const g=ctx.createRadialGradient(0,3,0,0,0,width);g.addColorStop(0,'rgba(0,72,163,.34)');g.addColorStop(.45,'rgba(0,113,227,.17)');g.addColorStop(1,'rgba(0,113,227,0)');ctx.fillStyle=g;ctx.fillRect(-width,-width,2*width,2*width);ctx.restore();
          ctx.fillStyle='rgba(0,57,133,.35)';ctx.fillRect(x-1,y+6+5*u,3,4+4*u);
        }
      }
      if(row===1){
        for(const [u,length] of [[.12,16],[.28,26],[.42,13],[.61,22],[.78,17],[.92,25]]){
          if(p<=u)continue;const x=165+450*u,age=t-(.5+10.5*u),drop=length*ease(age/2.2);
          ctx.strokeStyle='#004b9b';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(x,y+5);ctx.lineTo(x,y+5+drop);ctx.stroke();ctx.fillStyle='#004b9b';ctx.beginPath();ctx.ellipse(x,y+5+drop,2.5,3.8,0,0,Math.PI*2);ctx.fill();
        }
      }
      if(row===3&&p>.42){
        const buildup=ease((t-4.9)/5.8);ctx.fillStyle=`rgba(0,46,112,${buildup*.62})`;ctx.beginPath();ctx.ellipse(382,y,10+12*buildup,6+9*buildup,0,0,Math.PI*2);ctx.fill();
      }
      const front=165+450*p,far=row===2,distance=far?22:row===1?2:9;
      const nozzle={x:front+(row===4?22:5),y:y+distance};
      const visible=ease(t/.35);ctx.save();ctx.globalAlpha=visible;
      if(p<1){ctx.strokeStyle='rgba(0,113,227,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(nozzle.x,nozzle.y);ctx.lineTo(front-5,y);ctx.moveTo(nozzle.x,nozzle.y);ctx.lineTo(front+5,y);ctx.stroke();}
      ctx.translate(nozzle.x,nozzle.y);ctx.scale(far?.42:.54,far?.42:.54);can(ctx,0,0,row===4?-.65:-.12);ctx.restore();
    }
  }

  function selectLetter(index){const col=index%4,row=Math.floor(index/4),letter=String.fromCharCode(65+index),x=Math.max(0,15+128*col-16),y=Math.max(0,60+86*row-20);document.querySelectorAll('[data-letter]').forEach(n=>n.setAttribute('aria-pressed',String(+n.dataset.letter===index)));document.getElementById('selected-letter').textContent='Letter '+letter;const svg=document.querySelector('.letter-enlargement svg');svg.setAttribute('viewBox',`${x} ${y} 160 130`);svg.setAttribute('aria-label',`Enlarged detail of letter ${letter} from the original alphabet`);}
  function init(){document.querySelectorAll('[data-letter]').forEach(button=>{button.addEventListener('click',()=>selectLetter(+button.dataset.letter));button.addEventListener('keydown',event=>{const moves={ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4};if(!(event.key in moves))return;event.preventDefault();event.stopPropagation();const index=Math.max(0,Math.min(25,+button.dataset.letter+moves[event.key]));selectLetter(index);document.querySelector(`[data-letter="${index}"]`).focus();});});selectLetter(0);}
  function render(index,t){if(index===0)tools(t);else if(index===1)guidance(t);}
  return{layouts,init,render};
})();
