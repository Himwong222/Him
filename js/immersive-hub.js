/* immersive hub: full-screen parallax starfield behind content */
(function(){
  try {
    const canvas = document.createElement('canvas');
    canvas.id = 'immersive-hub-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // 初始化多層星星
      stars = [];
      const total = Math.floor((canvas.width * canvas.height) / 1200);
      for(let i=0;i<400;i++){
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: Math.max(0.5, Math.random() * 1.5)
        });
      }
    }

    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let s of stars){
        s.x += s.vx; s.y += s.vy;
        if(s.x < 0) s.x += canvas.width; if(s.x > canvas.width) s.x -= canvas.width;
        if(s.y < 0) s.y += canvas.height; if(s.y > canvas.height) s.y -= canvas.height;
        const a = 0.25 + s.z * 0.2;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  } catch(e){ /* ignore if failed */ }
})();
