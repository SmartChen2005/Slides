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
    {title:'Creative Expression',theme:'learning-slide learning-create',duration:12,html:heading('Creative Expression','A space for experimentation and personal style.')+`<figure class="creation-art sandbox-scene">${canvas('learn-create',1100,360,'A customizable graffiti studio with an open painting wall, concrete, brick and metal options, and expressive strokes and lettering in progress')}<div class="sandbox-controls" role="group" aria-label="Creative sandbox controls"><p>Wall material</p><div class="sandbox-materials">${[['concrete','Concrete'],['brick','Brick'],['metal','Metal']].map(([id,label],i)=>`<button type="button" data-material="${id}" aria-pressed="${i===0}"><span class="material-swatch swatch-${id}" aria-hidden="true"></span>${label}</button>`).join('')}</div><div class="sandbox-colors" role="group" aria-label="Paint color">${[['#0071e3','Blue'],['#af52de','Violet'],['#f66ea0','Pink'],['#f5a65a','Orange']].map(([color,label],i)=>`<button type="button" data-paint-color="${color}" aria-label="${label} paint" aria-pressed="${i===0}" style="--paint-color:${color}"></button>`).join('')}</div><div class="sandbox-actions"><button type="button" id="sandbox-add">Add stroke</button><button type="button" id="sandbox-clear">Clear wall</button></div></div><figcaption class="sandbox-hint">Drag on the wall to paint</figcaption></figure><p class="creation-note">Customize the wall. Experiment with materials. Create your own style.</p>`+progress(3)}

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

  const sandbox={material:'concrete',color:'#0071e3',marks:[],empty:false,time:0,drawing:null};
  const materialTextures=new Map();
  function wallTexture(material){
    if(materialTextures.has(material))return materialTextures.get(material);
    const tile=document.createElement('canvas');tile.width=790;tile.height=274;const c=tile.getContext('2d');
    if(material==='brick'){
      c.fillStyle='#d4c6b8';c.fillRect(0,0,790,274);
      for(let row=0;row<8;row++)for(let col=-1;col<8;col++){
        const x=col*120+(row%2)*60,y=row*38;c.fillStyle=['#b67f69','#ad7864','#c18b74'][(row*7+col+8)%3];c.fillRect(x+2,y+2,116,34);
        c.fillStyle='rgba(255,255,255,.09)';c.fillRect(x+4,y+4,112,2);
      }
    }else if(material==='metal'){
      c.fillStyle='#c7d0d7';c.fillRect(0,0,790,274);
      for(let x=0;x<790;x+=27){const g=c.createLinearGradient(x,0,x+27,0);g.addColorStop(0,'#afbdc8');g.addColorStop(.3,'#d6dfe5');g.addColorStop(.72,'#c5d0d9');g.addColorStop(1,'#9eafbd');c.fillStyle=g;c.fillRect(x,0,27,274);}
      c.fillStyle='#718491';for(let x=20;x<790;x+=108)for(const y of [16,258]){c.beginPath();c.arc(x,y,2.3,0,7);c.fill();}
    }else{
      c.fillStyle='#dcdedb';c.fillRect(0,0,790,274);
      for(let i=0;i<1800;i++){const x=(i*127.31)%790,y=(i*47.73)%274;c.fillStyle=i%3?'rgba(90,98,89,.05)':'rgba(255,255,255,.17)';c.fillRect(x,y,1+i%2,1);}
      c.strokeStyle='#c4c8c3';c.lineWidth=1;for(const x of [155,395,635]){c.beginPath();c.moveTo(x,0);c.lineTo(x,274);c.stroke();}
      c.fillStyle='#aeb5ac';for(const x of [38,275,515,752])for(const y of [35,238]){c.beginPath();c.arc(x,y,2.1,0,7);c.fill();}
    }
    materialTextures.set(material,tile);return tile;
  }
  function create(t){
    sandbox.time=t;const {ctx}=surface('learn-create');
    ctx.fillStyle='#f5f5f7';ctx.beginPath();ctx.roundRect(0,0,1100,360,22);ctx.fill();
    // A restrained studio perspective leaves the wall as the main painting surface.
    ctx.fillStyle='#e8e9e6';ctx.beginPath();ctx.moveTo(230,306);ctx.lineTo(1080,306);ctx.lineTo(1100,360);ctx.lineTo(210,360);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#d9dcd7';ctx.lineWidth=1;for(let x=270;x<1080;x+=170){ctx.beginPath();ctx.moveTo(x,306);ctx.lineTo(655+(x-655)*1.35,360);ctx.stroke();}ctx.beginPath();ctx.moveTo(220,336);ctx.lineTo(1092,336);ctx.stroke();
    ctx.fillStyle='#b9bdb7';ctx.beginPath();ctx.moveTo(230,53);ctx.lineTo(270,28);ctx.lineTo(270,302);ctx.lineTo(230,318);ctx.closePath();ctx.fill();
    ctx.fillStyle='#aeb5ae';ctx.beginPath();ctx.moveTo(1060,28);ctx.lineTo(1080,45);ctx.lineTo(1080,317);ctx.lineTo(1060,302);ctx.closePath();ctx.fill();
    ctx.save();ctx.shadowColor='rgba(29,29,31,.12)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.drawImage(wallTexture(sandbox.material),270,28);ctx.restore();
    ctx.save();ctx.beginPath();ctx.rect(270,28,790,274);ctx.clip();
    if(!sandbox.empty){
      const wave=ease(t/4.4),ring=ease((t-2.5)/5),letter=ease((t-5)/5.2);
      const points=Array.from({length:Math.floor(180*wave)+1},(_,i)=>{const u=i/180;return{x:330+220*u,y:119+28*Math.sin(u*Math.PI*2)};});
      line(ctx,points,'rgba(0,113,227,.13)',22);line(ctx,points,'#0071e3',11);
      // A loose filled form, an outline study and a small letter share the open wall.
      ctx.fillStyle=`rgba(175,82,222,${.7*ease((t-1.7)/4)})`;ctx.beginPath();ctx.moveTo(348,204);ctx.bezierCurveTo(400,158,444,217,485,179);ctx.lineTo(501,213);ctx.bezierCurveTo(448,247,398,198,353,239);ctx.closePath();ctx.fill();
      ctx.fillStyle=`rgba(245,166,90,${.24*ring})`;ctx.beginPath();ctx.ellipse(705,139,63,67,-.3,0,Math.PI*2);ctx.fill();
      const loop=Array.from({length:Math.floor(200*ring)+1},(_,i)=>{const a=i/200*Math.PI*2-.7;return{x:705+62*Math.cos(a)+13*Math.sin(a*2),y:139+66*Math.sin(a)};});line(ctx,loop,'#ef8731',8);
      const stem=[{x:866,y:211},{x:892,y:81},{x:937,y:88},{x:958,y:116},{x:945,y:144},{x:881,y:149},{x:953,y:214}];
      const count=Math.floor(letter*(stem.length-1)),part=letter*(stem.length-1)-count;const path=stem.slice(0,count+1);if(count<stem.length-1)path.push({x:stem[count].x+(stem[count+1].x-stem[count].x)*part,y:stem[count].y+(stem[count+1].y-stem[count].y)*part});line(ctx,path,'#353543',5);
      ctx.globalAlpha=ease((t-8)/3);line(ctx,[{x:605,y:234},{x:746,y:216},{x:811,y:237}],'#f66ea0',9);ctx.globalAlpha=1;
      if(t<4.5&&points.length){const q=points.at(-1);can(ctx,q.x+11,q.y+12,-.2);}else if(t<8&&loop.length){const q=loop.at(-1);can(ctx,q.x+12,q.y+15,-.2);}else{can(ctx,1007,230,-.25);}
    }
    for(const mark of sandbox.marks)line(ctx,mark.points,mark.color,mark.width);
    ctx.restore();
  }
  function freezeSandbox(){if(window.deckAPI)deckAPI.seek(sandbox.time);}
  function initSandbox(){
    const node=document.getElementById('learn-create');
    document.querySelectorAll('[data-material]').forEach(button=>button.addEventListener('click',()=>{
      freezeSandbox();sandbox.material=button.dataset.material;document.querySelectorAll('[data-material]').forEach(n=>n.setAttribute('aria-pressed',String(n===button)));create(sandbox.time);
    }));
    document.querySelectorAll('[data-paint-color]').forEach(button=>button.addEventListener('click',()=>{
      freezeSandbox();sandbox.color=button.dataset.paintColor;document.querySelectorAll('[data-paint-color]').forEach(n=>n.setAttribute('aria-pressed',String(n===button)));
    }));
    document.getElementById('sandbox-clear').addEventListener('click',()=>{freezeSandbox();sandbox.marks=[];sandbox.empty=true;create(sandbox.time);});
    document.getElementById('sandbox-add').addEventListener('click',()=>{
      freezeSandbox();const n=sandbox.marks.length,points=Array.from({length:80},(_,i)=>{const u=i/79;return{x:325+460*u,y:240-((n*39)%120)+17*Math.sin(u*Math.PI*2+n)};});sandbox.marks.push({color:sandbox.color,width:8,points});create(sandbox.time);
    });
    const point=event=>{const r=node.getBoundingClientRect();return{x:(event.clientX-r.left)*1100/r.width,y:(event.clientY-r.top)*360/r.height};};
    const inside=p=>p.x>=270&&p.x<=1060&&p.y>=28&&p.y<=302;
    node.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;const p=point(event);if(!inside(p))return;event.preventDefault();freezeSandbox();node.setPointerCapture(event.pointerId);sandbox.drawing={color:sandbox.color,width:8,points:[p,{x:p.x+.01,y:p.y}]};sandbox.marks.push(sandbox.drawing);create(sandbox.time);
    });
    node.addEventListener('pointermove',event=>{if(!sandbox.drawing)return;const p=point(event);if(inside(p)){sandbox.drawing.points.push(p);create(sandbox.time);}});
    const finish=()=>{sandbox.drawing=null;};node.addEventListener('pointerup',finish);node.addEventListener('pointercancel',finish);node.addEventListener('lostpointercapture',finish);
  }

  function selectLetter(index){const col=index%4,row=Math.floor(index/4),letter=String.fromCharCode(65+index),x=Math.max(0,15+128*col-16),y=Math.max(0,60+86*row-20);document.querySelectorAll('[data-letter]').forEach(n=>n.setAttribute('aria-pressed',String(+n.dataset.letter===index)));document.getElementById('selected-letter').textContent='Letter '+letter;const svg=document.querySelector('.letter-enlargement svg');svg.setAttribute('viewBox',`${x} ${y} 160 130`);svg.setAttribute('aria-label',`Enlarged detail of letter ${letter} from the original alphabet`);}
  function init(){document.querySelectorAll('[data-letter]').forEach(button=>{button.addEventListener('click',()=>selectLetter(+button.dataset.letter));button.addEventListener('keydown',event=>{const moves={ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4};if(!(event.key in moves))return;event.preventDefault();event.stopPropagation();const index=Math.max(0,Math.min(25,+button.dataset.letter+moves[event.key]));selectLetter(index);document.querySelector(`[data-letter="${index}"]`).focus();});});selectLetter(0);initSandbox();}
  function render(index,t){if(index===0)tools(t);else if(index===1)guidance(t);else if(index===3)create(t);}
  return{layouts,init,render};
})();
