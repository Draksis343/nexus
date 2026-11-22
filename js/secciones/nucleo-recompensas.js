// NEXUS ARENA · Sección: nucleo-recompensas
// Apertura de núcleos (animación 3D con three.js), recompensas selladas y sonido del núcleo.
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
// ===== APERTURA DE RECOMPENSAS (núcleo 3D) =====
const LRC={'Común':['#dfe6ee','#9fb0c2'],Rara:['#4da3ff','#73dbe4'],'Épica':['#b57bff','#ff7ad9'],Nexus:['#ffc266','#73dbe4'],Reliquia:['#ff4d4d','#ffb35c'],Atemporal:['#4fd6b8','#bff6ff']};
const lcol=r=>(LRC[r]||LRC.Rara)[0];
let THREE_P=null;const T3URL='https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
const loadThree=()=>THREE_P||(THREE_P=import(T3URL).catch(e=>{THREE_P=null;throw e}));
function coreSvg(c){const face=(m,logo)=>{let g='';for(let i=1;i<4;i++){g+=`<line x1="${i/4}" y1="0" x2="${i/4}" y2="1"/><line x1="0" y1="${i/4}" x2="1" y2="${i/4}"/>`}
  return`<g transform="matrix(${m})"><g stroke="${c}" stroke-width="1.3" vector-effect="non-scaling-stroke" fill="none">${g.replace(/\/>/g,' vector-effect="non-scaling-stroke"/>')}</g>${logo?`<rect x=".26" y=".26" width=".48" height=".48" fill="#07090c" stroke="${c}" stroke-width="1.6" vector-effect="non-scaling-stroke"/><path d="M.5 .31L.69 .5 .5 .69 .31 .5Z" fill="none" stroke="#ffc266" stroke-width="1.5" vector-effect="non-scaling-stroke"/><circle cx=".5" cy=".5" r=".06" fill="none" stroke="#73dbe4" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`:''}</g>`};
 return`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M60 14 99 36.5 60 59 21 36.5Z" fill="#2a313b"/><path d="M21 36.5 60 59V104L21 81.5Z" fill="#141920"/><path d="M60 59 99 36.5V81.5L60 104Z" fill="#0d1116"/>${face('39,22.5,39,-22.5,21,36.5',0)}${face('39,22.5,0,45,21,36.5',1)}${face('39,-22.5,0,45,60,59',1)}<path d="M60 14 99 36.5V81.5L60 104 21 81.5V36.5Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/></svg>`}
function lootLogoTex(T,c){const cv=document.createElement('canvas'),Z=512;cv.width=cv.height=Z;const g=cv.getContext('2d');g.fillStyle='#07090c';g.fillRect(0,0,Z,Z);g.strokeStyle=c;g.lineWidth=18;g.shadowColor=c;g.shadowBlur=18;g.strokeRect(9,9,Z-18,Z-18);
 const h=Z*.36,m=Z/2;g.strokeStyle='#ffc266';g.lineWidth=Z*.034;g.shadowColor='#ffc266';g.shadowBlur=12;g.beginPath();g.moveTo(m,m-h);g.lineTo(m+h,m);g.lineTo(m,m+h);g.lineTo(m-h,m);g.closePath();g.stroke();
 g.strokeStyle='#73dbe4';g.shadowColor='#73dbe4';g.shadowBlur=26;g.beginPath();g.arc(m,m,h*.32,0,7);g.stroke();g.stroke();const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;return t}
function lootGlowTex(T){const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return new T.CanvasTexture(cv)}
const lease=x=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3),lcl=x=>Math.max(0,Math.min(1,x));
function lootScene(T,cv,col,col2){const R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});R.setPixelRatio(Math.min(2,devicePixelRatio||1));R.toneMapping=T.ACESFilmicToneMapping;R.outputColorSpace=T.SRGBColorSpace;
 const sc=new T.Scene(),cam=new T.PerspectiveCamera(34,1,.1,200);cam.position.set(0,.6,13.5);cam.lookAt(0,0,0);
 sc.add(new T.HemisphereLight(0xaab4c4,0x050608,1.3));const k=new T.DirectionalLight(0xffffff,2.4);k.position.set(5,8,7);sc.add(k);const k2=new T.DirectionalLight(new T.Color(col2),1.4);k2.position.set(-7,-1,-5);sc.add(k2);
 const pl=new T.PointLight(new T.Color(col),0,30,1.6);sc.add(pl);
 const G=new T.Group();sc.add(G);const C=new T.Color(col);
 const core=new T.Mesh(new T.BoxGeometry(3.74,3.74,3.74),new T.MeshBasicMaterial({color:C.clone().multiplyScalar(.6),transparent:true}));G.add(core);
 const glowT=lootGlowTex(T),halo=new T.Sprite(new T.SpriteMaterial({map:glowT,color:C,blending:T.AdditiveBlending,transparent:true,opacity:.25,depthWrite:false}));halo.scale.set(9,9,1);sc.add(halo);
 let sd=11;const rn=()=>{sd=(sd*16807)%2147483647;return(sd-1)/2147483646};
 const B=[],N=4,gap=.08;
 for(let i=0;i<N;i++)for(let j=0;j<N;j++)for(let q=0;q<N;q++){if(!(i===0||i===N-1||j===0||j===N-1||q===0||q===N-1))continue;
  const v=.016+rn()*.012,m=new T.Mesh(new T.BoxGeometry(1-gap,1-gap,1-gap),new T.MeshStandardMaterial({color:new T.Color().setRGB(v,v*1.08,v*1.22),roughness:.42+rn()*.2,metalness:.5,transparent:true}));
  const b=new T.Vector3(i-1.5,j-1.5,q-1.5);m.position.copy(b);G.add(m);
  const dir=b.clone().normalize().add(new T.Vector3(rn()-.5,rn()-.5,rn()-.5).multiplyScalar(.5)).normalize();
  B.push({m,b,dir,dist:1.05+rn()*1.5,ax:new T.Vector3(rn()-.5,rn()-.5,rn()-.5).normalize(),sp:(rn()-.5)*1.6,ph:rn()*6.28})}
 const lm=new T.Mesh(new T.PlaneGeometry(1.16,1.16),new T.MeshBasicMaterial({map:lootLogoTex(T,col),transparent:true}));lm.position.set(0,0,2.04);G.add(lm);
 const lm2=lm.clone();lm2.material=lm.material.clone();lm2.rotation.y=Math.PI/2;lm2.position.set(2.04,0,0);G.add(lm2);
 const beams=[],bG=new T.BoxGeometry(.022,1,.022);
 const size=()=>{const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.position.z=w<h?25:15.5;cam.updateProjectionMatrix()};size();
 return{R,sc,cam,G,core,halo,pl,B,lm,lm2,beams,bG,C,size,
  spawnBeams(){B.forEach(o=>{const wp=new T.Vector3();o.m.getWorldPosition(wp);for(let n=0;n<(rn()<.5?1:2);n++){const bm=new T.Mesh(bG,new T.MeshBasicMaterial({color:n?new T.Color(col2):C,blending:T.AdditiveBlending,transparent:true,depthWrite:false}));bm.position.copy(wp).add(new T.Vector3((rn()-.5)*.7,(rn()-.5)*.5,(rn()-.5)*.7));bm.userData={y0:bm.position.y,dl:rn()*.35,len:.5+rn()*1.4,sp:1.4+rn()*2.2};bm.scale.y=.01;sc.add(bm);beams.push(bm)}})},
  dispose(){R.dispose();sc.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(o.material.map&&o.material.map.dispose());o.material.dispose()}})}}}
// items: [{r, rar, src}] · p: jugador dueño (para Equipar)
// ===== SONIDO DEL NÚCLEO (sintetizado, sin archivos) =====
const LSND={'Común':[0,3],Rara:[2,4],'Épica':[5,5],Nexus:[7,6],Reliquia:[3,6],Atemporal:[9,6]};
function lootAudio(){if(!FXON())return null;let c;try{c=sfx.c||(sfx.c=new (window.AudioContext||window.webkitAudioContext)());if(c.state==='suspended')c.resume()}catch(e){return null}
 const out=c.createGain();out.gain.value=.8;const cmp=c.createDynamicsCompressor();cmp.threshold.value=-14;cmp.ratio.value=4;out.connect(cmp);cmp.connect(c.destination);
 // reverberación generada (sala amplia y oscura)
 const ir=c.createBuffer(2,c.sampleRate*2.6,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3.2)}
 const rv=c.createConvolver();rv.buffer=ir;const rvg=c.createGain();rvg.gain.value=.42;rv.connect(rvg);rvg.connect(out);
 const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
 const bus=(wet)=>{const g=c.createGain();g.connect(out);if(wet){const w=c.createGain();w.gain.value=wet;g.connect(w);w.connect(rv)}return g};
 const env=(g,t,a,peak,d,end=.0001)=>{g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(end,t+a+d)};
 const osc=(type,f,t,dst)=>{const o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);o.connect(dst);o.start(t);return o};
 const noise=(t,dst)=>{const n=c.createBufferSource();n.buffer=nb;n.loop=true;n.connect(dst);n.start(t);return n};
 const live=[];const L={c,
  // carga: zumbido grave que sube, vibración y energía que se acumula
  charge(dur){const t=c.currentTime+.02,g=bus(.35);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.06,t+.5);g.gain.exponentialRampToValueAtTime(.17,t+dur);
   const lp=c.createBiquadFilter();lp.type='lowpass';lp.Q.value=6;lp.frequency.setValueAtTime(180,t);lp.frequency.exponentialRampToValueAtTime(1600,t+dur);lp.connect(g);
   const trem=c.createGain();trem.connect(lp);const lfo=osc('sine',5,t,c.createGain());lfo.frequency.exponentialRampToValueAtTime(22,t+dur);const lg=c.createGain();lg.gain.value=.45;lfo.disconnect();lfo.connect(lg);lg.connect(trem.gain);
   const a=osc('sawtooth',55,t,trem),b=osc('sawtooth',55.6,t,trem),s2=osc('square',27.5,t,trem);[a,b].forEach(o=>o.frequency.exponentialRampToValueAtTime(110,t+dur));s2.frequency.exponentialRampToValueAtTime(55,t+dur);
   const wg=c.createGain();wg.gain.setValueAtTime(.0001,t);wg.gain.exponentialRampToValueAtTime(.11,t+dur);wg.connect(g);const w=osc('sine',220,t,wg);w.frequency.exponentialRampToValueAtTime(1320,t+dur);
   const bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.4;bp.frequency.setValueAtTime(900,t);bp.frequency.exponentialRampToValueAtTime(4200,t+dur);const ng=c.createGain();ng.gain.setValueAtTime(.0001,t);ng.gain.exponentialRampToValueAtTime(.35,t+dur);bp.connect(ng);ng.connect(g);const n=noise(t,bp);
   const nodes=[a,b,s2,w,lfo,n];live.push(...nodes);L._ch={g,nodes}},
  stopCharge(){const x=L._ch;if(!x)return;L._ch=null;const t=c.currentTime;x.g.gain.cancelScheduledValues(t);x.g.gain.setTargetAtTime(.0001,t,.03);x.nodes.forEach(o=>{try{o.stop(t+.3)}catch(e){}})},
  // apertura: golpe grave, estallido y cristal que se quiebra
  open(){L.stopCharge();const t=c.currentTime+.01,g=bus(.55);
   const kg=c.createGain();kg.connect(g);env(kg,t,.005,.7,.9);const k=osc('sine',150,t,kg);k.frequency.exponentialRampToValueAtTime(32,t+.7);k.stop(t+1.1);
   const sg=c.createGain();sg.connect(g);env(sg,t,.004,.5,.5);const sb=osc('triangle',90,t,sg);sb.frequency.exponentialRampToValueAtTime(40,t+.4);sb.stop(t+.7);
   const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(7000,t);lp.frequency.exponentialRampToValueAtTime(220,t+1.4);const ng=c.createGain();env(ng,t,.003,.45,1.5);lp.connect(ng);ng.connect(g);const n=noise(t,lp);n.stop(t+1.7);
   const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=5000;const hg=c.createGain();env(hg,t,.002,.22,.35);hp.connect(hg);hg.connect(g);const h=noise(t,hp);h.stop(t+.5);
   [2093,2637,3136,3951].forEach((f,i)=>{const cg=c.createGain();cg.connect(g);env(cg,t+.02+i*.025,.003,.07,.9);const o=osc('sine',f*(1+Math.random()*.01),t+.02+i*.025,cg);o.stop(t+1.2)});
   // resonancia que queda flotando mientras se ve la recompensa
   const pg=bus(.6);pg.gain.setValueAtTime(.0001,t);pg.gain.exponentialRampToValueAtTime(.07,t+1.2);const pl=c.createBiquadFilter();pl.type='lowpass';pl.frequency.value=900;pl.connect(pg);
   const pn=[110,164.8,220.6].map(f=>osc('triangle',f,t,pl));const lf=osc('sine',.25,t,c.createGain());lf.disconnect();const lfg=c.createGain();lfg.gain.value=300;lf.connect(lfg);lfg.connect(pl.frequency);live.push(...pn,lf);L._pad={g:pg,nodes:[...pn,lf]}},
  // recompensa: campanas cristalinas en escala según la rareza
  reveal(rar){const t=c.currentTime+.03,[tr,n]=LSND[rar]||LSND.Rara,g=bus(.6),base=523.25*Math.pow(2,tr/12),sc=[0,4,7,12,16,19,24];
   for(let i=0;i<n;i++){const f=base*Math.pow(2,sc[i]/12),tt=t+i*.075,d=1.6-i*.1;[[1,.26,'sine'],[2.01,.08,'sine'],[3,.04,'triangle']].forEach(([m,v,ty])=>{const eg=c.createGain();eg.connect(g);env(eg,tt,.004,v,d*(m>1?.5:1));const o=osc(ty,f*m,tt,eg);o.stop(tt+d+.1)})}
   const top=n>=5,sp=c.createBiquadFilter();sp.type='bandpass';sp.frequency.value=top?7000:5200;sp.Q.value=3;const sg=c.createGain();env(sg,t,.05,top?.18:.1,top?1.4:.8);sp.connect(sg);sg.connect(g);const z=noise(t,sp);z.stop(t+1.6);
   if(top){const ch=c.createGain();ch.connect(g);env(ch,t+.1,.5,.06,2.2);const cl=c.createBiquadFilter();cl.type='lowpass';cl.frequency.value=2400;cl.connect(ch);[0,7,12].forEach(i=>{const o=osc('sawtooth',base/2*Math.pow(2,i/12),t+.1,cl);o.detune.value=(Math.random()-.5)*14;o.stop(t+3)})}},
  // salida: el núcleo se deshace en haces de luz que suben
  beams(full){const t=c.currentTime+.01,g=bus(.7),dur=full?1.3:.7;
   const bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=2.5;bp.frequency.setValueAtTime(800,t);bp.frequency.exponentialRampToValueAtTime(9000,t+dur);const ng=c.createGain();env(ng,t,dur*.45,full?.36:.2,dur*.6);bp.connect(ng);ng.connect(g);const n=noise(t,bp);n.stop(t+dur+.2);
   const k=full?9:5;for(let i=0;i<k;i++){const tt=t+Math.random()*dur*.55,f=900+Math.random()*1800,eg=c.createGain();eg.connect(g);env(eg,tt,.01,.035,.5);const o=osc('sine',f,tt,eg);o.frequency.exponentialRampToValueAtTime(f*2.6,tt+.5);o.stop(tt+.6)}
   if(full&&L._pad){const x=L._pad;L._pad=null;x.g.gain.cancelScheduledValues(t);x.g.gain.setTargetAtTime(.0001,t,.35);x.nodes.forEach(o=>{try{o.stop(t+2)}catch(e){}})}},
  end(){L.stopCharge();const t=c.currentTime;out.gain.setTargetAtTime(.0001,t+1.6,.4);live.forEach(o=>{try{o.stop(t+3.2)}catch(e){}});setTimeout(()=>{try{out.disconnect()}catch(e){}},3600)}};
 return L}
function lootPlay(items,p){return new Promise(async done=>{if(!items||!items.length)return done();
 const rar0=items[0].rar,col=lcol(rar0),ov=document.createElement('div');ov.className='loot';ov.style.setProperty('--lc',col);
 ov.innerHTML=`<canvas></canvas><div class="lt-flash"></div><div class="lt-card"></div><div class="lt-hint">Toca para abrir</div>`;document.body.appendChild(ov);requestAnimationFrame(()=>ov.classList.add('on'));
 const card=ov.querySelector('.lt-card'),hint=ov.querySelector('.lt-hint'),flash=ov.querySelector('.lt-flash');let SA=lootAudio(),opened=0,idx=0,S3=null,raf=0,t0=performance.now(),skip=0,openAt=null,exitAt=null,ended=false;
 const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const fill=i=>{const it=items[i],c=lcol(it.rar),cos6=['marco','borde','color','emblema','fondo','efecto'].includes(it.r.type),own=p&&U&&U.pid===p.id;ov.style.setProperty('--lc',c);
  card.innerHTML=`<span class="lt-rar">${esc(it.rar)}</span><div class="lt-ic">${rIcon(it.r)}</div><h3>${esc(it.r.name||PT[it.r.type][0])}</h3><p>${esc((PT[it.r.type]||PT.objeto)[0])} · ${esc(it.src||'')}</p>${it.r.desc?`<p style="margin-top:6px;font-size:12px">${esc(it.r.desc)}</p>`:''}<div class="lt-bt">${cos6&&own?`<button type="button" class="btn secondary" data-lt="eq">Equipar</button>`:''}${i<items.length-1?'<button type="button" class="btn ghost" data-lt="all">Saltar</button>':''}<button type="button" class="btn" data-lt="next">${i<items.length-1?`Siguiente (${i+1}/${items.length})`:'Listo'}</button></div>`;
  card.classList.remove('out','in');void card.offsetWidth;card.classList.add('in');pfxStart();try{SA&&SA.reveal(it.rar)}catch(e){}};
 const showCard=()=>{hint.textContent='';flash.classList.remove('go');void flash.offsetWidth;flash.classList.add('go');fill(idx)};
 const beams2d=()=>{const r=card.getBoundingClientRect();for(let n=0;n<26;n++){const b=document.createElement('i');b.className='lt-beam';const h=30+Math.random()*90;b.style.cssText=`left:${r.left+Math.random()*r.width}px;top:${r.top+Math.random()*r.height-h/2}px;height:${h}px;--d:${.5+Math.random()*.6}s;animation-delay:${Math.random()*.25}s`;ov.appendChild(b)}};
 const finish=()=>{if(ended)return;ended=true;card.classList.remove('in');card.classList.add('out');beams2d();try{if(SA){SA.beams(1);SA.end()}}catch(e){}exitAt=performance.now();setTimeout(()=>ov.classList.add('bye'),750);setTimeout(()=>{cancelAnimationFrame(raf);removeEventListener('resize',onRs);if(S3)S3.dispose();ov.remove();done()},1250)};
 card.addEventListener('click',e=>{const b=e.target.closest('[data-lt]');if(!b)return;e.stopPropagation();if(b.dataset.lt==='eq'){act.equip({t:items[idx].r.type,id:items[idx].r.id});b.textContent='✓ Equipado';b.disabled=true;return}
  if(b.dataset.lt==='all')return finish();if(idx<items.length-1){idx++;card.classList.remove('in');card.classList.add('out');beams2d();try{SA&&SA.beams(0)}catch(e){}if(S3)S3.burst=performance.now();setTimeout(showCard,380)}else finish()});
 ov.addEventListener('click',()=>{if(openAt==null)skip=1});
 const onRs=()=>S3&&S3.size();addEventListener('resize',onRs);
 // ---- versión 2D (sin 3D o con movimiento reducido)
 const flat=()=>{ov.querySelector('canvas').remove();const w=document.createElement('div');w.innerHTML=coreSvg(col);const s=w.firstChild;s.classList.add('lt-core2d');ov.insertBefore(s,card);s.style.position='absolute';try{SA&&!rm&&SA.charge(1.5)}catch(e){}setTimeout(()=>{s.remove();try{SA&&SA.open()}catch(e){}openAt=1;showCard()},rm?300:1500)};
 let T;try{if(rm)throw 0;T=await loadThree();S3=lootScene(T,ov.querySelector('canvas'),col,(LRC[rar0]||LRC.Rara)[1])}catch(e){return flat()}
 const OP=2.3;try{SA&&SA.charge(OP)}catch(e){}
 const tick=now=>{raf=requestAnimationFrame(tick);let t=(now-t0)/1000;if(skip&&t<OP){t0-=(OP-t)*1000;t=OP;skip=0}
  const{G,core,halo,pl,B,lm,lm2,beams,cam,R,sc}=S3;
  const intro=lease(t/1.1),charge=lcl((t-1)/(OP-1)),o=lease((t-OP)/.9),idle=Math.max(0,t-OP-.9);
  G.scale.setScalar(.35+.65*intro);G.rotation.y=-.7+t*.55+o*.6;G.rotation.x=.38-o*.2;
  const sh=charge*charge*(1-o)*.09;G.position.set((Math.random()-.5)*sh,(Math.random()-.5)*sh+Math.sin(t*1.4)*.12,0);
  const pul=.55+.45*Math.sin(t*(4+charge*16));core.material.color.copy(S3.C).multiplyScalar(.35+charge*.55*pul+o*.9);core.scale.setScalar(1-o*.72);core.material.opacity=1-o*.55;
  halo.material.opacity=Math.max(.12,.16+charge*.22*pul+o*.32-idle*.04);halo.scale.setScalar(6.5+charge*2+o*4.5+(S3.burst&&now-S3.burst<500?(1-(now-S3.burst)/500)*8:0));
  pl.intensity=o*14;
  if(!opened&&t>=OP){opened=1;try{SA&&SA.open()}catch(e){}}
  if(openAt==null&&t>=OP+.35){openAt=now;showCard()}
  const ex=exitAt?lcl((now-exitAt)/900):0;if(ex>0&&!S3.bm){S3.bm=1;S3.spawnBeams()}
  B.forEach(b=>{const d=b.dist*o+Math.sin(idle*.9+b.ph)*.18*o;b.m.position.copy(b.b).addScaledVector(b.dir,d);b.m.setRotationFromAxisAngle(b.ax,b.sp*o+idle*b.sp*.12);b.m.material.opacity=1-ex;b.m.scale.setScalar(1-ex*.9)});
  [lm,lm2].forEach((m,i)=>{m.material.opacity=1-lcl(o*1.6);m.position[i?'x':'z']=2.04+o*3});
  beams.forEach(bm=>{const u=lcl((now-exitAt)/1000-bm.userData.dl);bm.scale.y=.01+bm.userData.len*Math.sin(Math.min(1,u*1.3)*Math.PI*.5);bm.position.y=bm.userData.y0+u*bm.userData.sp;bm.material.opacity=u<.15?u/.15:1-lcl((u-.35)/.65)});
  if(ex>0){halo.material.opacity*=1-ex;core.material.opacity*=1-lcl(ex*2.5);pl.intensity*=1-ex}
  R.render(sc,cam)};
 raf=requestAnimationFrame(tick)})}

function visSet(p){const L=String((EQ[p.id]||{}).visto||'').split(',').filter(Boolean);try{L.push(...JSON.parse(localStorage.getItem('nx_vis_'+p.id)||'[]'))}catch(e){}return new Set(L)}
function isSealed(p,r){if(!p||!r||!/^(ach|hall|ev)-/.test(r.id||''))return false;const e=EQ[p.id]||{};if(Object.values(e).includes(r.id))return false;return!visSet(p).has(r.id)}
const sealedOf=p=>p?rwOwned(p).filter(r=>isSealed(p,r)):[];
function rwRar(r){if(r&&r.rar&&RAR[r.rar])return r.rar;const N=Math.max(1,+PS().levels||30),f=(rlv(r)||0)/N;return f>=.9?'Nexus':f>=.6?'Épica':f>=.3?'Rara':'Común'}
async function markSeen(p,ids){const s=visSet(p);ids.forEach(i=>s.add(i));const L=[...s];while(L.join(',').length>4000)L.shift();try{localStorage.setItem('nx_vis_'+p.id,JSON.stringify(L))}catch(e){}
 EQ[p.id]={...(EQ[p.id]||{}),visto:L.join(',')};render();if(S.sty&&!$('#modal').classList.contains('hidden'))stySheet(S.sty);PEND++;const j=await api({action:'equip',token:TOK(),eq:EQ[p.id]});PEND--;if(j.ok)softSync()}
function sealBtn(p,r,cls){if(r.ev){const e=(D.events||[]).find(x=>x.id===r.ev),n=sealedOf(p).filter(x=>x.ev===r.ev).length,rar=e?evCoreRar(e):rwRar(r),c=lcol(rar),own=!!(U&&U.pid===p.id);return`<button type="button" class="lt-seal ${cls||''}" style="--lc:${c}" ${own?`data-a="rwopen" data-id="${esc(r.id)}"`:'disabled'}>${coreSvg(c)}<b>${own?'Recibir recompensa':'Sin abrir'}</b><small>Núcleo del evento «${esc(e?e.title:'')}» · ${n} ${n===1?'recompensa':'recompensas'}</small></button>`}const rar=rwRar(r),c=lcol(rar),own=!!(U&&U.pid===p.id);return`<button type="button" class="lt-seal ${cls||''}" style="--lc:${c}" ${own?`data-a="rwopen" data-id="${esc(r.id)}"`:'disabled'}>${coreSvg(c)}<b>${own?'Recibir recompensa':'Sin abrir'}</b><small>${esc(rar)} · Logro «${esc(r.from||'')}»</small></button>`}
function rdotSide(){const cb=document.querySelector('#side [data-k=cuenta]');if(!cb)return;const n=myP()&&sealedOf(myP()).length,d=cb.querySelector('.rdot');if(n&&!d)cb.insertAdjacentHTML('beforeend','<i class="rdot" title="Tienes recompensas sin abrir"></i>');if(!n&&d)d.remove()}
const RARORD=['Común','Rara','Épica','Nexus','Atemporal','Reliquia'];

// ---- acciones de esta sección ----
Object.assign(act,{
 async rwopen(e){const p=myP();if(!p)return;let L=e.all?sealedOf(p):rwOwned(p).filter(r=>r.id===e.id&&isSealed(p,r));if(!L.length)return;if(!e.all&&L[0].ev)L=sealedOf(p).filter(r=>r.ev===L[0].ev);
  await lootPlay(L.map(r=>({r,rar:rwRar(r),src:r.ev?'Núcleo · '+(r.from||''):'Logro «'+(r.from||'')+'»'})),p);markSeen(p,L.map(r=>r.id))},
 lootdemo(){const L=Object.keys(RAR).map((k,i)=>({r:{id:'demo'+i,type:['marco','color','efecto','emblema','reliquias','trofeo'][i%6],v:['laurel','fx:oro','oro','👑',25,''][i%6],name:'Recompensa '+k,a:'latido'},rar:k,src:'Demostración'}));lootPlay(L,null)}
});
