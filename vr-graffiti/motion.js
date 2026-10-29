/* Deterministic interaction visualizations. Rendering is a pure function of time. */
"use strict";
window.GraffitiMotion = (() => {
  const clamp = x => Math.max(0,Math.min(1,x));
  const smooth = x => { x=clamp(x); return x*x*(3-2*x); };
  const ramp = (t,start,end) => smooth((t-start)/(end-start));
  const lerp = (a,b,t) => a+(b-a)*t;
  let pathNode, pathLength, samples;
  const surfaces=new Map();
  const colors=[ [41,151,255],[173,97,239],[246,110,160],[245,166,90] ];
  function color(p,alpha=1) {const v=clamp(p)*2.999,i=Math.floor(v),f=v-i;return `rgba(${colors[i].map((c,k)=>Math.round(lerp(c,colors[i+1]?.[k]??c,f))).join(',')},${alpha})`;}
  function point(p) {const q=pathNode.getPointAtLength(clamp(p)*pathLength);return {x:q.x,y:q.y};}
  function surface(id) {if(surfaces.has(id))return surfaces.get(id);const c=document.getElementById(id);const s={ctx:c.getContext('2d'),w:c.width/2,h:c.height/2};surfaces.set(id,s);return s;}
  function reset(id) {const s=surface(id);s.ctx.setTransform(2,0,0,2,0,0);s.ctx.clearRect(0,0,s.w,s.h);if(['hero-motion','layers-motion','depth-motion'].includes(id)){s.ctx.fillStyle='#050507';s.ctx.fillRect(0,0,s.w,s.h);}s.ctx.lineCap='round';s.ctx.lineJoin='round';return s;}
  function line(ctx,pts,stroke,width=2) {if(!pts.length)return;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
  function label(ctx,text,x,y,size=15,color='#86868b',align='left') {ctx.font=`500 ${size}px -apple-system, Segoe UI, sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(text,x,y);}
  function ink(root,selector,p) {root.querySelectorAll(selector).forEach(n=>{n.style.strokeDasharray='1';n.style.strokeDashoffset=String(1-clamp(p));});}
  function alpha(root,selector,value) {root.querySelectorAll(selector).forEach(n=>n.style.opacity=String(clamp(value)));}
  function pose(root,selector,p,dx=0,dy=0,angle=0) {const n=root.querySelector(selector),q=point(p);n.setAttribute('transform',`translate(${q.x+dx} ${q.y+dy}) rotate(${angle})`);}
  function tube(ctx,pts,width=15,opacity=1) {
    // A soft shadow, shaded edge and fine highlight make the gesture read as volume.
    const shadow=pts.map(p=>({x:p.x+1,y:p.y+6}));
    line(ctx,shadow,'rgba(0,0,0,.22)',width+3);
    for(let i=1;i<pts.length;i++) {
      const f=i/(pts.length-1);line(ctx,[pts[i-1],pts[i]],color(f,opacity),width);
    }
    const hi=pts.map(p=>({x:p.x-1.5,y:p.y-2.5}));line(ctx,hi,`rgba(255,255,255,${.25*opacity})`,Math.max(1,width*.14));
  }
  function project(p,depth,yaw,scale,cx,cy,hero=false) {
    const x=(p.x-185)*scale,y=(p.y-170)*scale;
    const z=p.u*depth;
    const xr=x*Math.cos(yaw)+z*Math.sin(yaw),zr=-x*Math.sin(yaw)+z*Math.cos(yaw);
    const perspective=780/(780-zr);
    return {x:cx+xr*perspective,y:cy+(y-z*.15)*perspective,z:zr};
  }
  function hero(t) {
    const {ctx,w,h}=reset('hero-motion');
    const progress=ramp(t,0,4.2),depth=ramp(t,3.5,6.4)*110;
    const pts=samples.filter(p=>p.u<=progress).map(p=>project(p,depth,.25+ramp(t,3.5,6.4)*.28,1.05,w/2-20,h/2+12,true));
    // The shadow stays attached to the floor instead of pulsing or floating.
    const shadow=ctx.createRadialGradient(w/2,328,5,w/2,328,175);shadow.addColorStop(0,'rgba(76,91,153,.19)');shadow.addColorStop(1,'rgba(76,91,153,0)');ctx.save();ctx.translate(0,266);ctx.scale(1,.2);ctx.fillStyle=shadow;ctx.fillRect(220,0,650,600);ctx.restore();
    tube(ctx,pts,25);
    if(progress<1&&pts.length) {const p=pts.at(-1);ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();}
  }
  function grain(seed) {const n=Math.sin(seed*12.9898+78.233)*43758.5453;return n-Math.floor(n);}
  function tools(root,t) {
    const spray=ramp(t,0,4),marker=ramp(t,4,8),roller=ramp(t,8,12.5);
    let {ctx}=reset('spray-motion');
    for(let i=0;i<180*spray;i++) {
      const p=i/180,x=30+270*p,y=37+4*Math.sin(p*3),r=4+13*p;
      const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(0,113,227,.10)');g.addColorStop(.6,'rgba(0,113,227,.055)');g.addColorStop(1,'rgba(0,113,227,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
      for(let k=0;k<4;k++){const a=grain(i*5+k)*Math.PI*2,rr=Math.sqrt(grain(i*17+k))*r;ctx.fillStyle='rgba(0,113,227,.22)';ctx.fillRect(x+Math.cos(a)*rr,y+Math.sin(a)*rr,.7,.7);}
    }
    if(spray>0&&spray<1){ctx.fillStyle='#0071e3';ctx.beginPath();ctx.arc(30+270*spray,37,3,0,Math.PI*2);ctx.fill();}
    ({ctx}=reset('marker-motion'));
    const points=Array.from({length:140},(_,i)=>{const p=i/139;return{x:34+260*p,y:37+15*Math.sin(p*Math.PI*2)};});
    const until=Math.ceil(marker*139);
    ctx.fillStyle='#ef8731';
    if(until>0){const stroke=points.slice(0,until+1);ctx.beginPath();ctx.moveTo(stroke[0].x-3,stroke[0].y-7);stroke.slice(1).forEach(p=>ctx.lineTo(p.x-3,p.y-7));stroke.slice().reverse().forEach(p=>ctx.lineTo(p.x+3,p.y+7));ctx.closePath();ctx.fill();}
    ({ctx}=reset('roller-motion'));ctx.fillStyle='#1d1d1f';
    const first=clamp(roller*2),second=clamp((roller-.48)*2);
    ctx.fillRect(36,13,258*first,25);ctx.globalAlpha=.88;ctx.fillRect(36,34,258*second,25);ctx.globalAlpha=1;
    root.querySelectorAll('.tool-control').forEach((n,i)=>n.classList.toggle('is-current',t<4?i===0:t<8?i===1:t<12.6?i===2:false));
  }
  function lesson(root,t) {
    const phase=t<4.8?0:t<10.8?1:t<16?2:3;
    const progress=phase===0?ramp(t,.35,4.1):phase===1?ramp(t,5.1,10.2):phase===2?ramp(t,11.4,15.3):1;
    const learner=phase===1?clamp(progress-.085):progress;
    const fade=phase===1?1-ramp(t,8.2,10.5):phase===0?1:0;
    const appear=phase===0?1-ramp(t,4.15,4.75):phase===1?ramp(t,4.8,5.15):phase===2?ramp(t,10.8,11.3):0;
    ink(root,'.lesson-ghost-ink',phase===0?progress:phase===1?1:0);ink(root,'.lesson-ink',phase===0?0:learner);
    alpha(root,'.lesson-target',phase===0?.8:phase===1?fade*.7:0);alpha(root,'.lesson-trail',fade*.9);alpha(root,'.lesson-ghost-ink',phase===0?.5:fade*.2);alpha(root,'.lesson-ghost',fade*appear*.68);alpha(root,'.lesson-learner',phase===0?0:phase===3?0:1);
    const q=point(learner),dx=9+4*Math.sin(learner*Math.PI*3),dy=-3+3*Math.cos(learner*Math.PI*2);
    pose(root,'.lesson-ghost',progress,22,-14,-12);
    pose(root,'.lesson-learner',learner,dx,dy,-8);
    const painted=root.querySelector('.lesson-ink');
    // The learner's painted centerline and tracked cursor use the same sampled path.
    const learnerPath=samples.filter(p=>p.u<=learner).map(p=>`${p.x+9+4*Math.sin(p.u*Math.PI*3)},${p.y-3+3*Math.cos(p.u*Math.PI*2)}`).join('L');
    painted.setAttribute('d',learnerPath?'M'+learnerPath:'M285 65');painted.style.strokeDasharray='none';painted.style.strokeDashoffset='0';painted.style.opacity=phase===0?'0':'1';
    const remix=ramp(t,16,18.2);painted.setAttribute('stroke',phase===3?'url(#lesson-paint)':'#0071e3');painted.setAttribute('transform',`translate(${remix*12} ${-remix*4}) scale(${1-remix*.08} ${1+remix*.05})`);
    const deviation=root.querySelector('.lesson-deviation');deviation.setAttribute('d',`M${q.x} ${q.y}L${q.x+dx} ${q.y+dy}`);deviation.style.opacity=phase===1?'.7':'0';
    const captions=['Observe the expert motion','Trace with spatial cues that gradually fade','Reproduce the letter without the guide','Remix proportions and color'];
    document.getElementById('journey-phase').textContent=captions[phase];root.querySelectorAll('.lesson-step').forEach((n,i)=>n.classList.toggle('is-current',phase===i));
  }
  function layers(root,t) {
    const p=ramp(t,.3,5.9);pose(root,'.layer-hand',p,6,0,-9);
    alpha(root,'.layer-hand',.65*(1-ramp(t,7.5,10)));alpha(root,'.layer-trail',1-ramp(t,7.5,10)*.8);
    const settle=ramp(t,6.5,10.5);root.querySelector('.layer-front').setAttribute('transform',`translate(${132-settle*75} ${settle*20})`);
  }
  function playground(root,t) {
    const {ctx}=reset('playground-motion'),move=ramp(t,3.2,6.8),turn=ramp(t,4.3,7.3);
    const yaw=.22+ramp(t,13.8,15.8)*.12,pitch=.26;
    const project3=p=>{
      const x=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),z=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw),y=p.y-132;
      const depth=z*Math.cos(pitch)+y*Math.sin(pitch),scale=900/(1050-depth);
      return {x:562+x*scale,y:186-(y*Math.cos(pitch)-z*Math.sin(pitch))*scale,z:depth,scale};
    };
    const polygon=(points,fill,stroke)=>{
      ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
      if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
    };
    const floor=(x,z)=>project3({x,y:0,z});
    polygon([floor(-600,-340),floor(600,-340),floor(600,360),floor(-600,360)],'#fafbfc');
    for(let n=-550;n<=550;n+=55)line(ctx,[floor(n,-300),floor(n,330)],'#ebedf0',.8);
    for(let n=-275;n<=330;n+=55)line(ctx,[floor(-550,n),floor(550,n)],'#ebedf0',.8);
    const panels=[
      {x:lerp(-145,-245,move),z:lerp(-40,45,move),theta:-.24*turn,width:280,height:260,lift:0,alpha:ramp(t,.05,.9)},
      {x:lerp(145,20,move),z:lerp(-40,-90,move),theta:.33*turn,width:230,height:220,lift:0,alpha:ramp(t,1.05,1.95)},
      {x:lerp(390,290,move),z:lerp(-40,110,move),theta:-.65*turn,width:190,height:170,lift:25*move,alpha:ramp(t,2.05,2.95)}
    ];
    const local=(p,u,v,back=0)=>({x:p.x+u*Math.cos(p.theta)-back*Math.sin(p.theta),y:v+p.lift,z:p.z-u*Math.sin(p.theta)-back*Math.cos(p.theta)});
    const corners=p=>[local(p,-p.width/2,0),local(p,p.width/2,0),local(p,p.width/2,p.height),local(p,-p.width/2,p.height)];
    // Surface transforms move the attached paint; the camera projects actual world coordinates.
    panels.forEach(p=>{
      ctx.globalAlpha=p.alpha;
      const foot=corners(p).map(q=>floor(q.x+q.y*.24,q.z-q.y*.18));
      polygon(foot,'rgba(46,55,67,.055)');ctx.globalAlpha=1;
    });
    const selected=t<1.05?0:t<2.05?1:t<3.2?2:t<5.2?0:2;
    const handleAlpha=(1-ramp(t,7.2,7.8));
    const objects=panels.map((p,index)=>({z:corners(p).map(project3).reduce((s,q)=>s+q.z,0)/4,draw:()=>{
      if(!p.alpha)return;ctx.save();ctx.globalAlpha=p.alpha;
      const front=corners(p).map(project3),back=[local(p,-p.width/2,0,7),local(p,p.width/2,0,7),local(p,p.width/2,p.height,7),local(p,-p.width/2,p.height,7)].map(project3);
      polygon([front[1],back[1],back[2],front[2]],'#c9d0d3');polygon([front[2],back[2],back[3],front[3]],'#edf0f1');
      const material=ctx.createLinearGradient(front[3].x,front[3].y,front[1].x,front[1].y);material.addColorStop(0,'#f0f1ef');material.addColorStop(1,'#dce1de');
      polygon(front,material,'#cbd1ce');
      ctx.save();polygon(front);ctx.clip();
      line(ctx,[project3(local(p,0,0)),project3(local(p,0,p.height))],'rgba(120,132,127,.16)',.7);
      line(ctx,[project3(local(p,-p.width/2,p.height/2)),project3(local(p,p.width/2,p.height/2))],'rgba(120,132,127,.16)',.7);
      [-.36,.36].forEach(u=>[.13,.48,.86].forEach(v=>{const q=project3(local(p,p.width*u,p.height*v));ctx.beginPath();ctx.arc(q.x,q.y,1.4*q.scale,0,Math.PI*2);ctx.fillStyle='#bec6c1';ctx.fill();}));
      if(index<2){
        const progress=ramp(t,index?9:7.8,index?10.6:9.8),pts=[];
        for(let j=0;j<=100*progress;j++){const u=j/100,uv=index?{u:-78+150*u,v:95+45*Math.sin(u*Math.PI*1.5)}:{u:-100+184*u,v:125+63*Math.sin(u*Math.PI*1.8)};pts.push(project3(local(p,uv.u,uv.v)));}
        line(ctx,pts,index?'#af52de':'#0071e3',index?10:15);
        if(index===0){const accent=Array.from({length:Math.ceil(60*ramp(t,9.1,10.3))},(_,j)=>{const u=j/59;return project3(local(p,-87+165*u,66+10*Math.sin(u*Math.PI)));});line(ctx,accent,'#f08cab',5);}
      }
      ctx.restore();
      if(index===selected&&handleAlpha){ctx.globalAlpha=p.alpha*handleAlpha;polygon(front,null,'#0071e3');front.forEach(q=>{ctx.fillStyle='white';ctx.strokeStyle='#0071e3';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(q.x-3.5,q.y-3.5,7,7,1);ctx.fill();ctx.stroke();});}
      ctx.restore();
    }}));
    if(t>4&&t<7.8){
      ctx.save();ctx.globalAlpha=ramp(t,4,4.5)*(1-ramp(t,7.1,7.8));ctx.setLineDash([4,5]);
      const p=panels[2],arc=Array.from({length:35},(_,j)=>{const a=-.6+j/34*1.8;return floor(p.x+Math.cos(a)*95,p.z+Math.sin(a)*95);});
      line(ctx,arc,'#79a9dd',1.5);ctx.setLineDash([]);const q=arc.at(-1);polygon([{x:q.x-4,y:q.y-6},{x:q.x+5,y:q.y},{x:q.x-5,y:q.y+4}],'#79a9dd');ctx.restore();
    }
    const start=local(panels[0],84,125+63*Math.sin(Math.PI*1.8)),progress=ramp(t,10.5,14.5),spatial=[];
    for(let j=0;j<=180*progress;j++){
      const u=j/180,world={x:start.x+600*u,y:start.y+150*Math.sin(Math.PI*u)+40*Math.sin(3*Math.PI*u),z:start.z+130*Math.sin(2*Math.PI*u)+140*u};
      spatial.push({...project3(world),u,world});
    }
    if(spatial.length>1)line(ctx,spatial.map(p=>floor(p.world.x,p.world.z)),'rgba(74,87,110,.10)',2);
    objects.sort((a,b)=>a.z-b.z).forEach(o=>o.draw());
    // Ray/plane visibility lets the ribbon leave its wall continuously and pass behind other surfaces.
    const camera={x:-1050*Math.cos(pitch)*Math.sin(yaw),y:132+1050*Math.sin(pitch),z:1050*Math.cos(pitch)*Math.cos(yaw)};
    const hidden=point=>panels.some(p=>{
      if(p.alpha<.98)return false;
      const nx=Math.sin(p.theta),nz=Math.cos(p.theta),denom=nx*(camera.x-point.x)+nz*(camera.z-point.z);
      if(Math.abs(denom)<.0001)return false;
      const distance=(nx*(p.x-point.x)+nz*(p.z-point.z))/denom;
      if(distance<=.0001||distance>=1)return false;
      const x=point.x+(camera.x-point.x)*distance-p.x,z=point.z+(camera.z-point.z)*distance-p.z;
      const u=x*Math.cos(p.theta)-z*Math.sin(p.theta),v=point.y+(camera.y-point.y)*distance-p.lift;
      return Math.abs(u)<p.width/2&&v>0&&v<p.height;
    });
    const highlights=[];let visibleRun=[];
    for(let i=1;i<spatial.length;i++){
      const a=spatial[i-1],b=spatial[i],mid={x:(a.world.x+b.world.x)/2,y:(a.world.y+b.world.y)/2,z:(a.world.z+b.world.z)/2};
      if(hidden(mid)){if(visibleRun.length)highlights.push(visibleRun);visibleRun=[];continue;}
      const width=(10+3*Math.sin(b.u*Math.PI))*b.scale;line(ctx,[a,b],color(b.u),width);
      if(!visibleRun.length)visibleRun.push(a);visibleRun.push(b);
    }
    if(visibleRun.length)highlights.push(visibleRun);
    highlights.forEach(run=>line(ctx,run.map(p=>({x:p.x-.6,y:p.y-1.4})),'rgba(255,255,255,.2)',1.1));
    if(progress>0&&progress<1&&spatial.length){const tip=spatial.at(-1);ctx.beginPath();ctx.arc(tip.x,tip.y,4,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();ctx.strokeStyle=color(tip.u);ctx.lineWidth=2;ctx.stroke();}
    const phase=t<3.2?0:t<7.8?1:2;
    document.getElementById('playground-phase').textContent=['Add walls of different sizes','Move and rotate them into your own layout','Paint across surfaces and into open space'][phase];
    root.querySelectorAll('[data-playground-step]').forEach((node,i)=>node.classList.toggle('is-current',phase===i));
  }
  function temporal(t) {
    const {ctx,w}=reset('layers-motion');
    const positions=[{x:-27,y:-5,alpha:.22,start:3.5},{x:23,y:9,alpha:.38,start:5.1},{x:0,y:0,alpha:1,start:0}];
    positions.forEach((layer,index)=>{
      const progress=index===2?ramp(t,.25,3.2):1,visible=index===2?1:ramp(t,layer.start,layer.start+1.5);
      const pts=samples.filter(p=>p.u<=progress).map(p=>({x:w/2+(p.x-185)*.85+layer.x,y:144+(p.y-170)*.85+layer.y}));
      line(ctx,pts,index===0?`rgba(175,82,222,${layer.alpha*visible})`:index===1?`rgba(246,110,160,${layer.alpha*visible})`:'#55acff',index===2?15:12);
    });
    const pos=clamp(t/7.5);line(ctx,[{x:80,y:282},{x:466,y:282}],'#34343c',1);
    for(let i=0;i<3;i++){const x=80+i*193;ctx.fillStyle=i/2<=pos?'#a3b4d4':'#34343c';ctx.beginPath();ctx.arc(x,282,3.5,0,Math.PI*2);ctx.fill();}
    label(ctx,'Earlier attempts',80,308,14,'#86868b');label(ctx,'Current',466,308,14,'#86868b','right');
  }
  function depth(t) {
    const {ctx,w}=reset('depth-motion');const prog=ramp(t,.2,3.1),depth=ramp(t,3.5,8.9)*190,yaw=.12+ramp(t,3.5,9.8)*.7;
    const projectQ=p=>project(p,depth,yaw,.75,w/2-18,142);
    const plane=[{x:35,y:22},{x:340,y:22},{x:340,y:318},{x:35,y:318},{x:35,y:22}].map(p=>project({...p,u:0},0,yaw,.75,w/2-18,142));
    line(ctx,plane,'#3a3a45',1);
    const flat=samples.map(p=>project({...p,u:0},0,yaw,.75,w/2-18,142));line(ctx,flat,'#22232e',8);
    const pts=samples.filter(p=>p.u<=prog).map(projectQ);
    if(depth>1){[.2,.45,.7,1].forEach(u=>{const q={...point(u),u};line(ctx,[project({...q,u:0},0,yaw,.75,w/2-18,142),projectQ(q)],'rgba(116,132,164,.28)',1);});}
    tube(ctx,pts,10);
    if(prog>0){const a=pts[0],b=pts.at(-1);ctx.fillStyle='#c8d2e8';[a,b].forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,3.2,0,Math.PI*2);ctx.fill();});}
    label(ctx,'t₀',142,269,15,'#a1a1aa');label(ctx,'t₁',403,269,15,'#a1a1aa');label(ctx,depth<15?'A flat recorded stroke':'Time mapped to spatial depth',w/2,308,15,'#a1a1aa','center');
  }
  function render(index,t) {
    const root=document.getElementById(`slide-${index+1}`);if(!root)return;
    if(index===0)hero(t);
    else if(index===5)tools(root,t);else if(index===6)lesson(root,t);else if(index===7)layers(root,t);else if(index===8)playground(root,t);else if(index===9){temporal(t);depth(t);}else if(index===10){const p=root.querySelector('.data-pulse');p.setAttribute('cx',String(14+1030*ramp(t,.2,5.8)));p.style.opacity=t>6?'0':'1';}
  }
  function init() {
    const ns='http://www.w3.org/2000/svg',s=document.createElementNS(ns,'svg');s.setAttribute('width','0');s.setAttribute('height','0');s.style.position='absolute';s.setAttribute('aria-hidden','true');pathNode=document.createElementNS(ns,'path');pathNode.setAttribute('d',S_PATH);s.appendChild(pathNode);document.body.appendChild(s);pathLength=pathNode.getTotalLength();samples=Array.from({length:241},(_,i)=>({...point(i/240),u:i/240}));
  }
  return {init,render,staticTimes:[7,0,0,0,0,13,7.7,5,16,12,7,0,0,0]};
})();
