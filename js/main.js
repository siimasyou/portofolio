(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,r){return (r||document).querySelector(s)}, $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* ---------- 3D scene: mouse parallax + draggable rig ---------- */
  function scene3d(scene,rig,base,onTap){
    var fls=$$('.fl',scene), mx=0,my=0,tx=0,ty=0,dX=0,dY=0,drag=false,sx=0,sy=0,bx=0,by=0,moved=0,visible=!reduce,raf=0;
    (function frame(){
      if(!visible||document.hidden){raf=0;return;}
      tx+=(mx-tx)*.08; ty+=(my-ty)*.08;
      rig.style.transform='rotateY('+(tx*14+dY+base[0])+'deg) rotateX('+(-ty*10+dX+base[1])+'deg)';
      fls.forEach(function(el){var d=+el.dataset.depth||50; el.style.transform='translate3d('+(tx*d*.45)+'px,'+(ty*d*.35)+'px,'+d+'px)'});
      raf=requestAnimationFrame(frame);
    })();
    new IntersectionObserver(function(es){if(reduce)return;visible=es.some(function(e){return e.isIntersecting});if(visible&&!raf&&!document.hidden)raf=requestAnimationFrame(frame)},{threshold:0}).observe(scene);
    document.addEventListener('visibilitychange',function(){if(!reduce&&!document.hidden&&visible&&!raf)raf=requestAnimationFrame(frame)});
    scene.addEventListener('pointermove',function(e){
      var r=scene.getBoundingClientRect(); mx=((e.clientX-r.left)/r.width-.5)*2; my=((e.clientY-r.top)/r.height-.5)*2;
      if(drag){moved=Math.max(moved,Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)); dY=by+(e.clientX-sx)*.5; dX=Math.max(-40,Math.min(40,bx-(e.clientY-sy)*.3));}
    });
    scene.addEventListener('pointerleave',function(){mx=0;my=0});
    rig.addEventListener('pointerdown',function(e){drag=true;moved=0;sx=e.clientX;sy=e.clientY;by=dY;bx=dX;rig.setPointerCapture(e.pointerId)});
    rig.addEventListener('pointerup',function(){
      drag=false; if(moved<5&&onTap)onTap();
      (function back(){ if(drag)return; dY*=.9; dX*=.9; if(Math.abs(dY)>.3||Math.abs(dX)>.3) requestAnimationFrame(back); else {dY=0;dX=0} })();
    });
    return function(){return drag};
  }
  scene3d($('#hscene'),$('#hrig'),[-10,4]);

  var slides=$('#slides'), dots=$$('#dots i'), caps=['PEKAT Himbio 2023','Selamat datang mahasiswa baru','Himbio Bangga','Info lomba','SIMBIOSIS 2023'], N=5, cur=0;
  function go(n){cur=(n+N)%N; slides.style.transform='translateX(-'+cur*100+'%)'; dots.forEach(function(d,i){d.classList.toggle('on',i===cur)}); $('#phCap').textContent=caps[cur];}
  var dragging=scene3d($('#pscene'),$('#prig'),[-8,4],function(){go(cur+1)});
  var carouselPaused=reduce;
  setInterval(function(){if(!carouselPaused&&!document.hidden&&!dragging())go(cur+1)},3600);
  ['pointerenter','focusin'].forEach(function(e){$('#cf').addEventListener(e,function(){carouselPaused=true})});
  $('#cf').addEventListener('pointerleave',function(){carouselPaused=reduce});
  $('#cf').addEventListener('focusout',function(e){if(!$('#cf').contains(e.relatedTarget))carouselPaused=reduce});

  /* ---------- about: flip card ---------- */
  var idc=$('#idcard'); idc.setAttribute('aria-pressed','false'); idc.setAttribute('aria-label','Balik kartu profil untuk melihat data singkat'); idc.addEventListener('click',function(){var flipped=idc.classList.toggle('flip');idc.setAttribute('aria-pressed',String(flipped));idc.setAttribute('aria-label',flipped?'Balik kartu profil untuk melihat foto':'Balik kartu profil untuk melihat data singkat')});

  /* ---------- konten: coverflow ---------- */
  var works=[
    {t:'PEKAT Himbio 2023',d:'Poster pendaftaran ajang penampilan mahasiswa Pendidikan Biologi. Memuat waktu pendaftaran, waktu kegiatan, catatan syarat, tautan formulir, dan kontak panitia dalam satu halaman.',g:'Publikasi kegiatan, 6 Juni 2023'},
    {t:'Selamat datang mahasiswa baru',d:'Poster penyambutan mahasiswa baru jalur mandiri 2023. Warna lembut dan ilustrasi sederhana membuat informasi kontak mudah ditemukan.',g:'Penyambutan, 30 Juli 2023'},
    {t:'Himbio Bangga',d:'Apresiasi untuk mahasiswa yang meraih Terbaik 3 Duta Bahasa Provinsi Kalimantan Barat 2023, dikemas sebagai kabar baik bagi seluruh warga prodi.',g:'Apresiasi prestasi, Juni 2023'},
    {t:'Info lomba',d:'Dua slide informasi lomba: slide pembuka bergaya ilustrasi dan poster rincian lomba yang memuat hadiah serta kontak panitia.',g:'Publikasi lomba, 2023'},
    {t:'SIMBIOSIS 2023',d:'Dokumentasi kegiatan daring SIMBIOSIS 2023 dari Himpunan Mahasiswa Pendidikan Biologi: slide pertanyaan dan tangkapan layar sesi Zoom.',g:'Dokumentasi kegiatan, 2023'}
  ];
  var cards=$$('.card3'), ci=0;
  function layout(){
    cards.forEach(function(c,i){
      var o=i-ci, a=Math.abs(o);
      c.style.transform='translateX('+(o*50)+'%) translateZ('+(-a*140)+'px) rotateY('+(-o*26)+'deg) scale('+(1-a*.05)+')';
      c.style.zIndex=10-a; c.style.opacity=a>2?0:1-a*.18; c.style.filter=a?'saturate(.85) brightness(.97)':'none';
    });
    var w=works[ci]; $('#cap').innerHTML='<h3>'+w.t+'</h3><p>'+w.d+'</p><span class="tag">'+w.g+'</span>'; cards.forEach(function(c,i){c.setAttribute('aria-current',i===ci?'true':'false')});
  }
  cards.forEach(function(c,i){c.addEventListener('click',function(){ci=i;layout()})});
  $('#prev').onclick=function(){ci=(ci+N-1)%N;layout()}; $('#next').onclick=function(){ci=(ci+1)%N;layout()};
  var cf=$('#cf'), px=null; cf.addEventListener('pointerdown',function(e){px=e.clientX});
  cf.addEventListener('pointerup',function(e){ if(px===null)return; var dx=e.clientX-px; px=null; if(dx<-50){ci=(ci+1)%N;layout()} else if(dx>50){ci=(ci+N-1)%N;layout()} });
  document.addEventListener('keydown',function(e){ var r=cf.getBoundingClientRect(); if(document.activeElement===cf&&r.top<innerHeight&&r.bottom>0){ if(e.key==='ArrowRight'){e.preventDefault();ci=(ci+1)%N;layout()} if(e.key==='ArrowLeft'){e.preventDefault();ci=(ci+N-1)%N;layout()} } });
  layout();

  /* ---------- pengalaman: 3D deck ---------- */
  var xp=[
    {t:'Kampus Mengajar Angkatan 4',s:'SMPN 25 Pontianak Utara',y:'2022–2023',c:'#cfe3f7',l:['Merancang dan melaksanakan program literasi dan numerasi sesuai kebutuhan sekolah','Berkoordinasi dengan guru dan pihak sekolah untuk mendukung kegiatan','Aktif dalam kegiatan sekolah dan membantu memastikan kegiatan berjalan baik']},
    {t:'Asisten Mata Kuliah Genetika',s:'Laboratorium Pendidikan Biologi',y:'2023–2024',c:'#d9f1e6',l:['Membantu dosen melaksanakan dan mengatur kegiatan praktikum','Menjelaskan materi dan prosedur praktikum kepada mahasiswa','Membantu pengelolaan dan input nilai mahasiswa']},
    {t:'Asisten Mata Kuliah Ekologi Tumbuhan',s:'Laboratorium Pendidikan Biologi',y:'2025–2026',c:'#fcd9c2',l:['Mendukung dosen dalam persiapan dan pelaksanaan praktikum','Mengatur jadwal praktikum dan berkoordinasi dengan mahasiswa','Menjelaskan materi, prosedur, dan tahapan selama pengamatan','Membantu pengelolaan dan input nilai mahasiswa']}
  ];
  var deck=$('#deck'), tabs=$('#tabs'), ai=0, dc=[], tb=[];
  xp.forEach(function(x,i){
    var d=document.createElement('article'); d.className='dcard'; d.id='panel-'+i; d.setAttribute('role','tabpanel'); d.setAttribute('aria-labelledby','tab-'+i); d.tabIndex=0;
    d.innerHTML='<h3>'+x.t+'</h3><span class="when" style="--c:'+x.c+'">'+x.y+' &nbsp;|&nbsp; '+x.s+'</span><ul class="dots-ul">'+x.l.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul>';
    deck.appendChild(d); dc.push(d);
    var b=document.createElement('button'); b.className='tab'; b.setAttribute('type','button'); b.setAttribute('role','tab'); b.id='tab-'+i; b.setAttribute('aria-controls','panel-'+i); b.setAttribute('tabindex',i===0?'0':'-1');
    b.innerHTML='<b>'+x.t+'</b><small>'+x.y+'</small>'; b.onclick=function(){ai=i;place(); if(innerWidth<=860){var r=deck.getBoundingClientRect(); if(r.top>innerHeight*.55||r.bottom<120) deck.scrollIntoView({behavior:'smooth',block:'center'});}}; tabs.appendChild(b); tb.push(b);
  });
  function place(){
    dc.forEach(function(d,i){
      var o=i-ai;
      if(o<0){ d.style.transform='translateY(60px) translateZ(120px) rotateX(-18deg)'; d.style.opacity=0; d.style.pointerEvents='none'; d.style.zIndex=0; }
      else { d.style.transform='translateY('+(o*-26)+'px) translateZ('+(-o*70)+'px) scale('+(1-o*.04)+')'; d.style.opacity=1-o*.25; d.style.zIndex=20-o; d.style.pointerEvents=o?'none':'auto'; }
      d.setAttribute('aria-hidden',String(i!==ai));
    });
    tb.forEach(function(b,i){b.setAttribute('aria-selected',i===ai);b.setAttribute('tabindex',i===ai?'0':'-1')});
  }
  place();
  tabs.addEventListener('keydown',function(e){if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();var next=ai;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(ai+1)%xp.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(ai+xp.length-1)%xp.length;if(e.key==='Home')next=0;if(e.key==='End')next=xp.length-1;ai=next;place();tb[ai].focus()});

  /* ---------- tilt cards ---------- */
  $$('[data-tilt]').forEach(function(el){
    el.addEventListener('pointermove',function(e){ var r=el.getBoundingClientRect(); var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; el.style.transform='perspective(900px) rotateY('+(x*14)+'deg) rotateX('+(-y*14)+'deg) translateZ(10px)'; });
    el.addEventListener('pointerleave',function(){el.style.transform=''});
  });

  /* ---------- kontak: chat, parallax, salin ---------- */
  var ct=$('#kontak'), chat=$('#chat');
  new IntersectionObserver(function(es,o){es.forEach(function(e){ if(e.isIntersecting){ chat.classList.add('go'); o.disconnect(); } })},{threshold:.3}).observe(chat);
  var cfl=$$('.cfl',ct);
  ct.addEventListener('pointermove',function(e){ if(reduce)return; var r=ct.getBoundingClientRect(), x=((e.clientX-r.left)/r.width-.5), y=((e.clientY-r.top)/r.height-.5); cfl.forEach(function(el){var d=+el.dataset.d; el.style.transform='translate3d('+(x*d)+'px,'+(y*d*.8)+'px,0)'}); });
  var toast=$('#toast'), tt;
  function say(m){toast.textContent=m; toast.classList.add('on'); clearTimeout(tt); tt=setTimeout(function(){toast.classList.remove('on')},1800)}
  $$('[data-copy]').forEach(function(b){ b.addEventListener('click',function(){
    var v=b.dataset.copy;
    try{ navigator.clipboard.writeText(v).then(function(){say('Tersalin: '+v)},function(){say('Salin manual: '+v)}); }catch(e){ say('Salin manual: '+v) }
  })});

  /* ---------- nav highlight ---------- */
  var links=$$('.nav a'), secs=links.map(function(a){return $(a.getAttribute('href'))});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)}) } })},{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(function(s){io.observe(s)});
})();
