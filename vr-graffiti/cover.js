/* Wall-facing aerosol study. Positions, paint and particles are deterministic. */
"use strict";
window.GraffitiCover=(()=>{
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const mix=(a,b,u)=>a+(b-a)*u;
  const noise=n=>{const v=Math.sin(n*12.9898+78.233)*43758.5453;return v-Math.floor(v);};
  const passes=[
    {start:.9,end:2.65,a:[710,416],b:[1080,245],rgb:[30,111,255]},
    {start:2.95,end:4.55,a:[1080,295],b:[730,465],rgb:[48,148,255]},
    {start:4.85,end:6.5,a:[755,487],b:[1110,373],rgb:[99,89,245]}
  ];
  let canvas,ctx,paint,paintCtx,paintIndex=0,lastPaintTime=-1;
  const stamps=[];
  for(const [passIndex,p] of passes.entries())for(let i=0;i<=150;i++){
    const u=i/150;
    stamps.push({time:mix(p.start,p.end,u)+.1,x:mix(p.a[0],p.b[0],smooth(u)),y:mix(p.a[1],p.b[1],smooth(u))-23*Math.sin(u*Math.PI),rgb:p.rgb,seed:passIndex*500+i});
  }
  function point(p,t){const u=smooth((t-p.start)/(p.end-p.start));return{x:mix(p.a[0],p.b[0],u),y:mix(p.a[1],p.b[1],u)-23*Math.sin(u*Math.PI)};}
  function pose(t){
    let q,active=-1;
    if(t<.9){const u=smooth(t/.9);q={x:mix(870,710,u),y:mix(805,416,u)};}
    else if(t<6.5){
      for(let i=0;i<passes.length;i++){
        const p=passes[i];
        if(t>=p.start&&t<=p.end){q=point(p,t);active=i;break;}
        if(i<passes.length-1&&t>p.end&&t<passes[i+1].start){const n=passes[i+1],u=smooth((t-p.end)/(n.start-p.end));q={x:mix(p.b[0],n.a[0],u),y:mix(p.b[1],n.a[1],u)};break;}
      }
    }else{const u=smooth((t-6.5)/1.2);q={x:mix(1110,1025,u),y:mix(373,340,u)};}
    const scale=.9+.12*Math.sin(clamp((t-.9)/5.6)*Math.PI*2.3);
    return{...q,active,scale,tilt:-.12+.2*Math.sin(t*1.25)};
  }
  function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
  function can(c,q){
    c.save();c.translate(q.x,q.y);c.rotate(q.tilt);c.scale(q.scale,q.scale);
    // The circular nozzle opening faces the viewer; the body hangs below it.
    let g=c.createLinearGradient(-64,0,64,0);
    g.addColorStop(0,'#0b0d12');g.addColorStop(.13,'#434b55');g.addColorStop(.28,'#252b34');g.addColorStop(.65,'#10151c');g.addColorStop(.9,'#262d38');g.addColorStop(1,'#080b11');
    c.fillStyle=g;c.beginPath();c.roundRect(-64,66,128,256,[10,10,18,18]);c.fill();
    c.strokeStyle='rgba(195,215,241,.25)';c.lineWidth=1;c.stroke();
    ellipse(c,0,316,62,11,'#313b48');ellipse(c,0,316,56,7,'#10151d');
    g=c.createLinearGradient(-68,0,68,0);g.addColorStop(0,'#4a515e');g.addColorStop(.2,'#d8e0e9');g.addColorStop(.38,'#7f8998');g.addColorStop(.66,'#eff3fa');g.addColorStop(1,'#576170');
    c.fillStyle=g;c.beginPath();c.moveTo(-63,70);c.bezierCurveTo(-62,49,-48,40,-29,32);c.lineTo(29,32);c.bezierCurveTo(48,40,62,49,63,70);c.closePath();c.fill();
    ellipse(c,0,68,63,9,'#7e8c9e');ellipse(c,0,66,59,6,'#d4dde8');
    c.fillStyle='rgba(0,0,0,.26)';c.fillRect(-64,71,128,8);
    // A restrained blue label follows the cylindrical barrel.
    g=c.createLinearGradient(-64,0,64,0);g.addColorStop(0,'#072154');g.addColorStop(.25,'#1979ee');g.addColorStop(.62,'#1258c5');g.addColorStop(1,'#071e4d');
    c.fillStyle=g;c.fillRect(-63,142,126,87);
    c.fillStyle='rgba(147,201,255,.35)';c.fillRect(-49,154,2,60);
    c.save();c.beginPath();c.rect(-62,143,124,85);c.clip();
    c.strokeStyle='rgba(237,247,255,.8)';c.lineWidth=5;
    for(let i=0;i<3;i++){c.beginPath();c.moveTo(-26+i*26,205);c.lineTo(-8+i*26,164);c.stroke();}
    c.restore();
    c.fillStyle='rgba(255,255,255,.09)';c.fillRect(-47,83,3,216);
    c.fillStyle='#9aa9bb';c.beginPath();c.roundRect(-11,11,22,29,5);c.fill();
    ellipse(c,0,34,28,7,'#aeb9c7');
    // Front actuator, a recessed black orifice and a reflected metal rim.
    g=c.createLinearGradient(-20,-15,20,15);g.addColorStop(0,'#c6d4e6');g.addColorStop(.4,'#8096b2');g.addColorStop(1,'#30445e');
    c.fillStyle=g;c.beginPath();c.roundRect(-20,-15,40,29,6);c.fill();
    c.strokeStyle='#dce8f6';c.lineWidth=1;c.stroke();
    ellipse(c,0,0,6,6,'#a3b9d1');ellipse(c,0,0,3.7,3.7,'#02050b');ellipse(c,-1,-1,.8,.8,'#759cce');
    c.restore();
  }
  function stamp(s){
    const c=paintCtx,[r,g,b]=s.rgb;
    for(let j=0;j<32;j++){
      const n=s.seed*73+j,a=noise(n)*Math.PI*2,rad=Math.sqrt(noise(n+9))*85;
      ellipse(c,s.x+Math.cos(a)*rad,s.y+Math.sin(a)*rad,.25+noise(n+17)*1.1,.25+noise(n+17)*1.1,`rgba(${r},${g},${b},${.12+noise(n+31)*.24})`);
    }
  }
  function updatePaint(t){
    if(t<lastPaintTime){paintCtx.clearRect(0,0,1280,720);paintIndex=0;}
    while(paintIndex<stamps.length&&stamps[paintIndex].time<=t){stamp(stamps[paintIndex++]);}
    lastPaintTime=t;
  }
  function wash(t){
    const c=ctx;c.save();c.lineCap='round';c.lineJoin='round';
    for(const p of passes){
      const u=clamp((t-.1-p.start)/(p.end-p.start));if(!u)continue;
      c.beginPath();
      for(let i=0;i<=100;i++){const q=point(p,p.start+(p.end-p.start)*u*i/100);if(i)c.lineTo(q.x,q.y);else c.moveTo(q.x,q.y);}
      c.filter='blur(11px)';
      c.strokeStyle=`rgba(${p.rgb},.48)`;c.lineWidth=77;c.stroke();
      c.filter='blur(7px)';c.strokeStyle=`rgba(${p.rgb},.06)`;c.lineWidth=45;c.stroke();
    }
    c.restore();
  }
  function plume(t,q){
    if(q.active<0)return;
    const c=ctx,rgb=passes[q.active].rgb;
    // Increasing apparent radius/size conveys droplets travelling toward us.
    for(let i=0;i<150;i++){
      const f=(t*2.4+noise(i+23))%1,angle=noise(i+101)*Math.PI*2;
      const radius=(4+Math.pow(f,2.2)*135)*Math.sqrt(noise(i+810));
      const x=q.x+Math.cos(angle)*radius,y=q.y+Math.sin(angle)*radius;
      const size=.4+Math.pow(f,3)*3.9,alpha=(.15+.45*f)*(1-smooth((f-.88)/.12));
      ellipse(c,x,y,size,size,`rgba(${rgb},${alpha})`);
    }
    const haze=c.createRadialGradient(q.x,q.y,5,q.x,q.y,125);
    haze.addColorStop(0,`rgba(${rgb},.08)`);haze.addColorStop(.45,`rgba(${rgb},.055)`);haze.addColorStop(1,`rgba(${rgb},0)`);
    c.fillStyle=haze;c.fillRect(q.x-125,q.y-125,250,250);
    // Larger near-wall droplets land on the screen, in front of the can.
    for(let i=0;i<16;i++){
      const f=(t*1.7+noise(i+3000))%1;
      if(f<.72)continue;
      const a=noise(i+2000)*Math.PI*2,r=40+noise(i+1400)*110;
      ellipse(c,q.x+Math.cos(a)*r,q.y+Math.sin(a)*r,2+noise(i+200)*5,2+noise(i+200)*5,`rgba(${rgb},${.23*(1-f)/.28})`);
    }
  }
  function render(t){
    if(!ctx){canvas=document.getElementById('hero-motion');ctx=canvas.getContext('2d');paint=document.createElement('canvas');paint.width=2560;paint.height=1440;paintCtx=paint.getContext('2d');paintCtx.scale(2,2);}
    t=Math.max(0,Math.min(8,t));updatePaint(t);
    ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,1280,720);
    const q=pose(t);
    can(ctx,q);
    // The deposited pigment stays fixed to our wall plane, above the moving tool.
    wash(t);
    ctx.globalAlpha=.79;ctx.drawImage(paint,0,0,1280,720);ctx.globalAlpha=1;
    plume(t,q);
  }
  return{render,pose};
})();
