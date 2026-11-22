// NEXUS ARENA · Sección: juego-secreto
// Juego secreto (código Konami), su música y tabla.
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
// Música chiptune del juego (sintetizada, sin archivos)
const MUS={on:false},CHD=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],mf=m=>440*Math.pow(2,(m-69)/12);
const MEL=[{0:76,3:74,4:72,6:69,8:72,10:74,12:76,14:79},{0:77,3:76,4:74,6:72,8:69,10:72,12:74,14:72},{0:72,3:74,4:76,6:79,8:76,10:74,12:72,14:67},{0:71,3:72,4:74,6:76,8:79,10:77,12:74,14:71}];
function musStart(){if(G.mute||MUS.on||!G.on)return;try{G.ac=G.ac||new (window.AudioContext||window.webkitAudioContext)();G.ac.resume&&G.ac.resume()}catch(e){return}const a=G.ac;MUS.on=true;MUS.step=0;MUS.t=a.currentTime+.08;MUS.g=a.createGain();MUS.g.gain.value=.5;MUS.g.connect(a.destination);
 if(!MUS.nb||MUS.nb.sampleRate!==a.sampleRate){const b=a.createBuffer(1,Math.floor(a.sampleRate*.3),a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;MUS.nb=b}
 MUS.iv=setInterval(musTick,25)}
function musStop(){MUS.on=false;clearInterval(MUS.iv);try{MUS.g&&MUS.g.disconnect()}catch(e){}MUS.g=null}
function musTick(){const a=G.ac;if(!a||!MUS.on)return;const bpm=G.st==='play'?138+Math.min(42,(G.wave-1)*4):G.st==='pause'?100:116,sp=60/bpm/4;
 while(MUS.t<a.currentTime+.15){musNote(MUS.step,MUS.t,sp);MUS.t+=sp;MUS.step=(MUS.step+1)%64}}
function musNote(s,t,sp){const a=G.ac,bar=Math.floor(s/16),i=s%16,ch=CHD[bar],play=G.st==='play',v=G.st==='pause'?.35:1;
 const tone=(f,d,type,vol)=>{const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(vol*v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(MUS.g);o.start(t);o.stop(t+d+.03)};
 const noise=(d,vol,hp)=>{const n=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();n.buffer=MUS.nb;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol*v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);n.connect(f).connect(g).connect(MUS.g);n.start(t);n.stop(t+d+.03)};
 if(i%2===0)tone(mf(ch[0]-24+(i%4===2?12:0)),sp*1.7,'triangle',.24);
 tone(mf(ch[i%3]+12+(i>=8?12:0)),sp*.85,'square',.028);
 const m=MEL[bar][i];if(m)tone(mf(m),sp*(play?2.6:3.2),'square',play?.045:.032);
 if(play||G.st==='over'){if(i%8===0){const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(40,t+.12);g.gain.setValueAtTime(.32*v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.14);o.connect(g).connect(MUS.g);o.start(t);o.stop(t+.16)}
  if(i%8===4)noise(.13,.13,1400);if(i%2===1)noise(.03,.035,7000)}}

// ===== EASTER EGG: NEXUS STRIKE =====
let ARC=[];
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],KGL={ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',b:'B',a:'A'};
let kbuf=[];
function kodePrompt(){if($('#kcode'))return;const w=document.createElement('div');w.id='kcode';w.className='kc-bg';let seq=[];
 const draw=(bad)=>{w.innerHTML=`<div class="kc${bad?' bad':''}"><div class="kc-t">INTRODUCE CÓDIGO</div><div class="kc-s">${Array.from({length:10},(_,i)=>`<span class="${seq[i]?'f':''}">${seq[i]?KGL[seq[i]]:'·'}</span>`).join('')}</div>
  <div class="kc-p"><div class="kc-d"><button data-k="ArrowUp" style="grid-area:u">↑</button><button data-k="ArrowLeft" style="grid-area:l">←</button><button data-k="ArrowRight" style="grid-area:r">→</button><button data-k="ArrowDown" style="grid-area:d">↓</button></div><div class="kc-ab"><button data-k="b">B</button><button data-k="a">A</button></div></div><button class="kc-x" data-kx="1">Cerrar</button></div>`};
 draw();w.addEventListener('click',e=>{if(e.target===w||e.target.dataset.kx){w.remove();return}const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;seq.push(k);try{navigator.vibrate&&navigator.vibrate(12)}catch(x){}
  if(seq.some((x,i)=>x!==KONAMI[i])){seq=[];draw(1);setTimeout(()=>draw(),450);return}if(seq.length===10){w.remove();arcOpen();return}draw()});document.body.appendChild(w)}
const G={on:false};
function eggGrant(){if(!A)return;let n=0;D.achs.filter(a=>a.egg).forEach(a=>ARC.forEach(x=>{if(D.players.some(p=>p.id===x.p)&&!D.grants.some(g=>g.p===x.p&&g.a===a.id)&&!(a.rar==='Reliquia'&&relicLeft(a)<=0)){if(!n){pre=JSON.stringify(D);pend='Otorgó logros del juego secreto'}D.grants.push({p:x.p,a:a.id,at:x.at||Date.now()});n++}}));if(n){touch();toast(n+(n===1?' jugador encontró':' jugadores encontraron')+' el juego secreto: logro otorgado. Recuerda publicar.')}}
function arcBest(){const L={};ARC.filter(x=>x.s>0).forEach(x=>{if(!L[x.p]||x.s>L[x.p].s)L[x.p]=x});return Object.values(L).filter(x=>D.players.some(p=>p.id===x.p)).sort((a,b)=>b.s-a.s)}
function arcBoard(n){const L=arcBest().slice(0,n||10),me=U&&U.pid;return L.length?L.map((x,i)=>{const p=D.players.find(y=>y.id===x.p);return`<div class="ab-r${x.p===me?' me':''}"><span>${i+1}</span><b>${esc(p?p.name:'?')}</b><em>${x.s.toLocaleString('es-MX')}</em></div>`}).join(''):'<p class="ab-e">Nadie ha jugado todavía. ¡Sé el primero!</p>'}
function arcOpen(){if(G.on)return;G.on=true;if(U&&U.pid&&FBU()&&!ARC.some(x=>x.p===U.pid)){ARC.push({p:U.pid,s:0,w:0,at:Date.now()});api({action:'score',token:TOK(),score:0,wave:0}).catch(()=>{})}const ov=document.createElement('div');ov.id='arc';ov.innerHTML=`<div class="arc-w"><canvas id="arcv" width="480" height="720"></canvas><div id="arcui"></div><button class="arc-x" id="arcx" title="Salir">✕</button><button class="arc-m" id="arcm" title="Sonido">${G.mute?'🔇':'🔊'}</button></div>`;document.body.appendChild(ov);document.body.style.overflow='hidden';
 $('#arcx').onclick=arcClose;$('#arcm').onclick=()=>{G.mute=!G.mute;$('#arcm').textContent=G.mute?'🔇':'🔊';if(G.mute)musStop();else musStart();try{localStorage.setItem('nx_arc_mute',G.mute?'1':'')}catch(e){}};
 try{G.mute=!!localStorage.getItem('nx_arc_mute');$('#arcm').textContent=G.mute?'🔇':'🔊'}catch(e){}
 G.cv=$('#arcv');G.g=G.cv.getContext('2d');G.keys={};G.st='title';G.stars=Array.from({length:90},()=>({x:Math.random()*480,y:Math.random()*720,v:.4+Math.random()*2.2,r:Math.random()<.15?1.6:.9}));
 G.kd=e=>{if(!G.on)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();G.keys[e.key.toLowerCase()]=1;if(e.key==='Escape'){if(G.st==='play')G.st='pause';else if(G.st==='pause')G.st='play';else arcClose()}if((e.key==='p'||e.key==='P')&&(G.st==='play'||G.st==='pause'))G.st=G.st==='play'?'pause':'play';if((e.key==='Enter'||e.key===' ')&&(G.st==='title'||G.st==='over')&&!G.saving)arcStart()};
 G.ku=e=>{G.keys[e.key.toLowerCase()]=0};addEventListener('keydown',G.kd);addEventListener('keyup',G.ku);
 const tp=e=>{const r=G.cv.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return(t.clientX-r.left)/r.width*480};
 G.cv.addEventListener('touchstart',e=>{e.preventDefault();if(G.st==='title'||G.st==='over'){return}G.tx=tp(e);G.touch=1},{passive:false});
 G.cv.addEventListener('touchmove',e=>{e.preventDefault();G.tx=tp(e)},{passive:false});G.cv.addEventListener('touchend',()=>{G.touch=0;G.tx=null});
 G.cv.addEventListener('mousedown',e=>{if(G.st==='play'){G.mouse=1}});addEventListener('mouseup',G.mu=()=>{G.mouse=0});
 arcUI();G.last=performance.now();G.acc=0;G.raf=requestAnimationFrame(arcLoop);musStart()}
function arcClose(){musStop();G.on=false;cancelAnimationFrame(G.raf);removeEventListener('keydown',G.kd);removeEventListener('keyup',G.ku);removeEventListener('mouseup',G.mu);const o=$('#arc');if(o)o.remove();document.body.style.overflow='';try{G.ac&&G.ac.close()}catch(e){}G.ac=null}
function arcSnd(f,d,type,vol,slide){if(G.mute)return;try{G.ac=G.ac||new (window.AudioContext||window.webkitAudioContext)();const a=G.ac,o=a.createOscillator(),g=a.createGain(),t=a.currentTime;o.type=type||'square';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);g.gain.setValueAtTime(vol||.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d)}catch(e){}}
function arcUI(){const u=$('#arcui');if(!u)return;const me=U&&U.pid&&D.players.find(p=>p.id===U.pid),mine=me&&arcBest().find(x=>x.p===me.id);
 if(G.st==='title')u.innerHTML=`<div class="au"><div class="au-logo">NEXUS<br><span>STRIKE</span></div><p class="au-s">Encontraste el secreto. Defiende la arena.</p><button class="au-b" id="arcgo">▶ JUGAR</button><p class="au-h">${matchMedia('(pointer:coarse)').matches?'Arrastra el dedo para moverte · disparo automático':'← → para moverte · ESPACIO para disparar · P pausa'}</p><div class="ab"><div class="ab-t">🏆 MEJORES PILOTOS</div>${arcBoard(10)}</div>${mine?`<p class="au-h">Tu récord: <b>${mine.s.toLocaleString('es-MX')}</b></p>`:''}</div>`;
 else if(G.st==='over'){const s=G.score;u.innerHTML=`<div class="au"><div class="au-logo" style="font-size:34px">GAME<br><span>OVER</span></div><p class="au-sc">${s.toLocaleString('es-MX')}</p><p class="au-s">Oleada ${G.wave}</p><p class="au-s" id="arcmsg">${me?(FBU()?'Guardando tu puntuación…':'Sin conexión al servidor: no se guardó.'):'Inicia sesión en el sitio para guardar tus puntuaciones.'}</p><button class="au-b" id="arcgo">↻ OTRA VEZ</button><div class="ab"><div class="ab-t">🏆 MEJORES PILOTOS</div><div id="arcbd">${arcBoard(10)}</div></div></div>`}
 else u.innerHTML='';const b=$('#arcgo');if(b)b.onclick=()=>{if(!G.saving)arcStart()}}
function arcStart(){musStart();Object.assign(G,{st:'play',score:0,lives:3,wave:0,pl:{x:240,y:660,inv:90,cd:0},pb:[],eb:[],en:[],fx:[],t:0,msg:0});arcWave();arcUI();arcSnd(440,.12,'square',.05,880)}
function arcWave(){G.wave++;G.en=[];const rows=Math.min(5,3+Math.floor(G.wave/3)),cols=8;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const ty=r===0?2:r<2?1:0;G.en.push({sx:60+c*52,sy:90+r*46,x:240+(Math.random()-.5)*400,y:-40-r*40-c*8,ty,hp:ty===2?2:1,st:'in',k:Math.random()*6,dv:0})}G.msg=120;G.eb=[]}
const ECOL=['#ffc266','#73dbe4','#ff7772'],EPTS=[50,100,150];
function arcBoom(x,y,c,n){for(let i=0;i<(n||16);i++){const a=Math.random()*6.28,v=1+Math.random()*3.5;G.fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:30+Math.random()*20,c})}}
function arcStep(){const P=G.pl,K=G.keys;G.t++;
 G.stars.forEach(s=>{s.y+=s.v*(G.st==='play'?1.6:.6);if(s.y>720){s.y=0;s.x=Math.random()*480}});
 if(G.st!=='play')return;
 let dx=0;if(K.arrowleft||K.a)dx-=5.2;if(K.arrowright||K.d)dx+=5.2;if(G.touch&&G.tx!=null){const d=G.tx-P.x;dx=Math.max(-7,Math.min(7,d*.3))}P.x=Math.max(22,Math.min(458,P.x+dx));
 P.cd--;const fire=K[' ']||G.touch||G.mouse||K.z;if(fire&&P.cd<=0&&G.pb.length<4&&P.inv<90){G.pb.push({x:P.x,y:P.y-22});P.cd=13;arcSnd(880,.07,'square',.025,1320)}
 if(P.inv>0)P.inv--;
 G.pb.forEach(b=>b.y-=10);G.pb=G.pb.filter(b=>b.y>-10);
 const sway=Math.sin(G.t/60)*30,spd=1+G.wave*.12;
 G.en.forEach(e=>{e.k+=.05;const tx=e.sx+sway,ty=e.sy+Math.sin(e.k)*3;
  if(e.st==='in'){e.x+=(tx-e.x)*.05;e.y+=(ty-e.y)*.05;if(Math.abs(tx-e.x)<2&&Math.abs(ty-e.y)<2)e.st='f'}
  else if(e.st==='f'){e.x=tx;e.y=ty}
  else if(e.st==='d'){e.dv+=.035*spd;e.y+=2.6*spd;e.x+=Math.sin(e.dv)*3.2+(P.x-e.x)*.006;if(e.y>760){e.y=-30;e.st='in'}}
  if(e.st!=='in'&&Math.random()<(.0007+G.wave*.00035)*(e.st==='d'?6:1))G.eb.push({x:e.x,y:e.y+12,vx:(P.x-e.x)*.004,vy:3+G.wave*.18})});
 if(G.t%Math.max(40,150-G.wave*12)===0){const L=G.en.filter(e=>e.st==='f');if(L.length){const e=L[Math.floor(Math.random()*L.length)];e.st='d';e.dv=0;arcSnd(300,.25,'sawtooth',.02,120)}}
 G.eb.forEach(b=>{b.x+=b.vx;b.y+=b.vy});G.eb=G.eb.filter(b=>b.y<740);
 G.pb.forEach(b=>G.en.forEach(e=>{if(!b.dead&&e.hp>0&&Math.abs(b.x-e.x)<18&&Math.abs(b.y-e.y)<16){b.dead=1;e.hp--;if(e.hp<=0){G.score+=EPTS[e.ty]*(e.st==='d'?2:1);arcBoom(e.x,e.y,ECOL[e.ty]);arcSnd(160,.18,'triangle',.06,60)}else arcSnd(600,.05,'square',.03)}}));
 G.pb=G.pb.filter(b=>!b.dead);G.en=G.en.filter(e=>e.hp>0);
 if(P.inv<=0){const hit=G.eb.some(b=>Math.abs(b.x-P.x)<14&&Math.abs(b.y-P.y)<14)||G.en.some(e=>Math.abs(e.x-P.x)<22&&Math.abs(e.y-P.y)<20);
  if(hit){G.lives--;arcBoom(P.x,P.y,'#73dbe4',40);arcBoom(P.x,P.y,'#ffc266',30);arcSnd(90,.6,'sawtooth',.08,30);G.eb=[];P.inv=150;if(G.lives<=0){G.st='over';arcOver()}}}
 G.fx.forEach(f=>{f.x+=f.vx;f.y+=f.vy;f.vx*=.96;f.vy*=.96;f.l--});G.fx=G.fx.filter(f=>f.l>0);
 if(!G.en.length){G.score+=500*G.wave;arcWave();arcSnd(523,.15,'square',.05);setTimeout(()=>arcSnd(784,.2,'square',.05),130)}
 if(G.msg>0)G.msg--}
function arcShip(g,x,y,a){g.save();g.globalAlpha=a;g.translate(x,y);g.shadowColor='#ffc266';g.shadowBlur=14;g.strokeStyle='#ffc266';g.lineWidth=3;g.beginPath();g.moveTo(0,-20);g.lineTo(18,14);g.lineTo(-18,14);g.closePath();g.stroke();g.shadowColor='#73dbe4';g.strokeStyle='#73dbe4';g.lineWidth=2.5;g.beginPath();g.arc(0,2,5.5,0,6.29);g.stroke();
 if(G.st==='play'){g.shadowBlur=10;g.fillStyle=`rgba(115,219,228,${.4+Math.random()*.5})`;g.beginPath();g.moveTo(-7,16);g.lineTo(0,24+Math.random()*7);g.lineTo(7,16);g.fill()}g.restore()}
function arcDraw(){const g=G.g;g.fillStyle='#07090c';g.fillRect(0,0,480,720);const gr=g.createLinearGradient(0,0,0,720);gr.addColorStop(0,'rgba(42,40,36,.35)');gr.addColorStop(1,'rgba(28,40,45,.45)');g.fillStyle=gr;g.fillRect(0,0,480,720);
 G.stars.forEach(s=>{g.fillStyle=`rgba(255,255,255,${.25+s.v/4})`;g.fillRect(s.x,s.y,s.r,s.r*(G.st==='play'?2.5:1))});
 if(G.st==='title'||G.st==='over'){arcShip(g,240,640,.9);return}
 g.save();g.shadowBlur=12;
 G.en.forEach(e=>{const c=ECOL[e.ty];g.shadowColor=c;g.strokeStyle=c;g.lineWidth=2.5;const s=e.ty===2?15:13,f=Math.sin(e.k*3)*2;g.beginPath();g.moveTo(e.x,e.y-s);g.lineTo(e.x+s+f,e.y);g.lineTo(e.x,e.y+s);g.lineTo(e.x-s-f,e.y);g.closePath();g.stroke();g.fillStyle=e.hp>1?c:'rgba(255,255,255,.85)';g.beginPath();g.arc(e.x,e.y,e.ty===2?3.5:2.5,0,6.29);g.fill()});
 g.shadowColor='#73dbe4';g.fillStyle='#bff6fa';G.pb.forEach(b=>g.fillRect(b.x-1.5,b.y-9,3,14));
 g.shadowColor='#ff7772';g.fillStyle='#ff9a8c';G.eb.forEach(b=>{g.beginPath();g.arc(b.x,b.y,3.5,0,6.29);g.fill()});
 G.fx.forEach(f=>{g.shadowColor=f.c;g.fillStyle=f.c;g.globalAlpha=Math.min(1,f.l/30);g.fillRect(f.x-1.5,f.y-1.5,3,3)});g.globalAlpha=1;g.restore();
 if(G.lives>0)arcShip(g,G.pl.x,G.pl.y,G.pl.inv>0&&Math.floor(G.t/5)%2?.35:1);
 g.font='700 15px "Space Mono",monospace';g.fillStyle='#ffc266';g.textAlign='left';g.fillText(String(G.score).padStart(7,'0'),14,28);g.textAlign='center';g.fillStyle='#73dbe4';g.fillText('OLEADA '+G.wave,240,28);
 for(let i=0;i<G.lives;i++){g.save();g.translate(24+i*24,50);g.scale(.45,.45);g.strokeStyle='#ffc266';g.lineWidth=4;g.beginPath();g.moveTo(0,-20);g.lineTo(18,14);g.lineTo(-18,14);g.closePath();g.stroke();g.restore()}
 if(G.msg>0){g.globalAlpha=Math.min(1,G.msg/30);g.font='700 30px "Space Mono",monospace';g.fillStyle='#ffc266';g.shadowColor='#ffc266';g.shadowBlur=18;g.fillText('OLEADA '+G.wave,240,380);g.shadowBlur=0;g.globalAlpha=1}
 if(G.st==='pause'){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,0,480,720);g.font='700 32px "Space Mono",monospace';g.fillStyle='#73dbe4';g.fillText('PAUSA',240,360);g.font='13px "Space Mono",monospace';g.fillStyle='#aaa';g.fillText('P o ESC para seguir',240,392)}}
function arcLoop(now){if(!G.on)return;G.acc+=Math.min(100,now-G.last);G.last=now;while(G.acc>=16.67){arcStep();G.acc-=16.67}arcDraw();G.raf=requestAnimationFrame(arcLoop)}
async function arcOver(){arcUI();const me=U&&U.pid;if(!me||!FBU())return;G.saving=true;const s=G.score,w=G.wave;
 try{const j=await api({action:'score',token:TOK(),score:s,wave:w});G.saving=false;const m=$('#arcmsg');
  if(j.ok){const old=ARC.find(x=>x.p===me);if(!old)ARC.push({p:me,s:j.best,w,at:Date.now()});else if(j.best>old.s){old.s=j.best;old.w=w}if(m)m.innerHTML=j.nuevo?'🏆 <b>¡Nuevo récord personal!</b>':'Tu récord sigue siendo '+(+j.best).toLocaleString('es-MX')+'.';const bd=$('#arcbd');if(bd)bd.innerHTML=arcBoard(10)}
  else if(m)m.textContent=j.error==='clave'||j.error==='acción desconocida'?'El script está desactualizado (versión 10): no se guardó.':j.error==='sesion'?'Tu sesión caducó: no se guardó.':'No se pudo guardar.'}catch(e){G.saving=false;const m=$('#arcmsg');if(m)m.textContent='No se pudo guardar (sin conexión).'}}
