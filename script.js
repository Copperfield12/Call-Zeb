const nav=document.querySelector('.navbar');
const btn=document.querySelector('.menu-btn');
if(btn){btn.addEventListener('click',()=>nav.classList.toggle('open'));}
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));


/* ---------------------------------------------------------
   Animated network waves
   --------------------------------------------------------- */
(function(){
  const canvases = document.querySelectorAll('.tech-wave');
  if(!canvases.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const instances = [];

  function setup(canvas, type){
    const parent = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, points = [];
    const waves = type === 'hero' ? 3 : 2;

    function resize(){
      const r = parent.getBoundingClientRect();
      width = Math.max(1, r.width);
      height = Math.max(1, r.height);
      canvas.width = Math.round(width * DPR);
      canvas.height = Math.round(height * DPR);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);

      const count = Math.max(55, Math.floor(width / 24));
      points = Array.from({length:count},(_,i)=>({
        x:i/(count-1),
        seed:Math.random()*Math.PI*2
      }));
    }

    function waveY(t, wave, time){
      const base = type === 'hero'
        ? height * (.34 + wave*.16)
        : height * (.35 + wave*.25);

      const amplitude = type === 'hero'
        ? Math.min(38, height*.07)
        : Math.min(16, height*.20);

      return base
        + Math.sin(t*7.0 + time*(.00055 + wave*.00008) + wave)*amplitude
        + Math.sin(t*14.0 - time*.00035 + wave*2)*amplitude*.25;
    }

    function draw(time){
      ctx.clearRect(0,0,width,height);

      // faint horizontal signal traces
      for(let w=0; w<waves; w++){
        ctx.beginPath();
        points.forEach((p,i)=>{
          const y=waveY(p.x,w,time);
          const x=p.x*width;
          i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
        });
        ctx.strokeStyle = type === 'hero'
          ? `rgba(8,124,255,${.11 + w*.035})`
          : `rgba(24,200,255,${.13 + w*.04})`;
        ctx.lineWidth = w===0 ? 1.4 : 1;
        ctx.stroke();
      }

      // connected nodes + moving data pulses
      const nodeCount = type === 'hero' ? 10 : 8;
      for(let n=0;n<nodeCount;n++){
        const t=(n/(nodeCount-1) + time*.000018*(n%2?1:-1))%1;
        const y=waveY(t,n%waves,time);
        const x=t*width;

        if(n>0){
          const prevT=((n-1)/(nodeCount-1) + time*.000018*(n%2?1:-1))%1;
          const py=waveY(prevT,(n-1)%waves,time);
          const px=prevT*width;
          ctx.beginPath();
          ctx.moveTo(px,py);
          ctx.lineTo(x,y);
          ctx.strokeStyle='rgba(30,181,255,.12)';
          ctx.lineWidth=1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(x,y,type==='hero'?2.2:1.8,0,Math.PI*2);
        ctx.fillStyle=type==='hero'?'rgba(8,124,255,.55)':'rgba(24,200,255,.65)';
        ctx.shadowBlur=type==='hero'?10:8;
        ctx.shadowColor='rgba(8,180,255,.8)';
        ctx.fill();
        ctx.shadowBlur=0;
      }

      // a travelling signal pulse
      const pulse=(time*.00009)%1;
      const py=waveY(pulse,0,time), px=pulse*width;
      const grad=ctx.createRadialGradient(px,py,0,px,py,type==='hero'?55:35);
      grad.addColorStop(0,'rgba(0,210,255,.35)');
      grad.addColorStop(1,'rgba(0,210,255,0)');
      ctx.fillStyle=grad;
      ctx.fillRect(px-(type==='hero'?55:35),py-(type==='hero'?55:35),
                   (type==='hero'?110:70),(type==='hero'?110:70));

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize',resize,{passive:true});
    requestAnimationFrame(draw);
    instances.push({canvas});
  }

  document.querySelectorAll('.tech-wave-hero').forEach(c=>setup(c,'hero'));
  document.querySelectorAll('.tech-wave-footer').forEach(c=>setup(c,'footer'));
})();
