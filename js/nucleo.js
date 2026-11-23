// NEXUS ARENA · nucleo
// Base compartida: estado global (D, S, A), utilidades, medallas, rarezas, textos de páginas, historial de cambios (touch/undo).
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
// las imágenes dentro de variables CSS se resuelven desde la carpeta css/: se pasan como URL completa
const absU=u=>{try{return /^(https?:|data:|blob:)/.test(u)?u:new URL(u,document.baseURI).href}catch(e){return u}};
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MED={participacion:{n:'Part.',pl:5,xp:15,c:'#a3adb5'},bronce:{n:'Bronce',pl:10,xp:25,c:'#ca906c'},plata:{n:'Plata',pl:20,xp:35,c:'#c6d2da'},oro:{n:'Oro',pl:30,xp:45,c:'#ffc266'},platino:{n:'Platino',pl:40,xp:55,c:'#c7f5f7'}};
const RANKS=[[0,'Recluta'],[200,'Rival'],[500,'Veterano'],[900,'Élite'],[1400,'Maestro'],[2000,'Leyenda']];
const RAR={'Común':{c:'#a3adb5'},Rara:{c:'#5aa9ff'},'Épica':{c:'#b57bff'},Nexus:{c:'#d9b95b'},Reliquia:{c:'#b5564e'},Atemporal:{c:'#4fd6b8'}};
const rc=r=>(RAR[r]||RAR['Común']).c;
const rbadge=r=>r==='Nexus'?'<span class="badge nexus">Nexus</span>':`<span class="badge" style="color:${rc(r)}">${esc(RAR[r]?r:'Común')}</span>`;
const DIFF=['Fácil','Medio','Difícil'];
const DR={Extrema:0,'Difícil':1,Medio:2,'Fácil':3};
const RO={Reliquia:0,Nexus:1,'Épica':2,Rara:3,'Común':4};
const SYNC={name:'Sincronía Total',medal:'Medalla de Sincronía'};
const pr=n=>n?`<span class="prs" title="Prestigio ${roman(n)}">${roman(n)}</span>`:'';
const roman=n=>['','I','II','III','IV','V','VI','VII','VIII','IX','X'][n]||String(n);
const CATS=['Habilidad','Supervivencia','Velocidad','Resistencia','Exploración','Creatividad','Cooperación','Combate','Sigilo','Caos'];
const cats=()=>[...new Set([...CATS,...D.challenges.map(c=>c.category).filter(Boolean)])];
const EMPTY=()=>({season:'Temporada 01',players:[],challenges:[],results:[],duels:[],event:null,achs:[],grants:[],videos:[],seasons:[],rounds:{total:6,cur:1},music:null,slogan:'Juega. Supera. Trasciende.',news:[],notes:[],polls:[],slogo:'',sStart:0,sEnd:0,sfx:{},rdl:0,pens:[],penv:{ch:10,rej:5,noev:10},pst:{},emu:null,credit:null,fb:null,tl:[],cg:[],syncs:[],atem:[],log:[],events:[],rax:[],ram:[]});
const T={inicio:['INICIO','COMMAND CENTER','Tu centro de operaciones para la liga.'],evento:['TEMPORADA','EVENTOS DE TEMPORADA','Desafíos, logros y premios especiales por tiempo limitado.'],desafios:['LIGA','DESAFÍOS','Elige una misión. Cada punto cuenta.'],retos:['DUELOS','RETOS','Jugador contra jugador.'],rankings:['CLASIFICACIÓN','RANKINGS','El marcador nunca miente.'],logros:['PROGRESIÓN','LOGROS','Las hazañas dejan huella.'],pase:['TEMPORADA','PASE DE TEMPORADA','Sube de nivel y reclama tus recompensas.'],tienda:['TEMPORADA','TIENDA','Cambia tus Reliquias por cosméticos.'],jugadores:['COMPETIDORES','JUGADORES','Cada leyenda empieza en algún lugar.'],historial:['REGISTRO','HISTORIAL','Cada movimiento, registrado.'],tiempo:['TEMPORADAS','LÍNEA DE TIEMPO','El camino de Nexus Arena, temporada a temporada.'],guia:['AYUDA','GUÍA','Todo lo que necesitas saber para jugar en Nexus Arena.'],recomendaciones:['BUZÓN','RECOMENDACIONES','Cuéntanos tus ideas y sugerencias.']};
T.panel=['ADMIN','PANEL DE EDICIÓN','Todo lo que puedes editar, en un solo lugar.'];T.registro=['ADMIN','REGISTRO','Quién hizo qué y cuándo (solo lo ve el administrador).'];
T.cuenta=['JUGADOR','MI CUENTA','Tu perfil, tu foto y tu título.'];T.accs=['ADMIN','CUENTAS','Cuentas de jugadores y coadministradores.'];
let D=EMPTY(),A=null,dirty=false,S={page:'inicio',sel:null,psel:null,rtab:'PL',rs:'',ptab:'Resumen',fq:'',fs:'',fc:'',fd:'',fr:'',fy:'',lq:'',lr:'',lt:'',ld:'',tq:'',tr:'',vs:''};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const badge=(t,c='amber')=>`<span class="badge ${c}">${esc(t)}</span>`;
const bar=n=>`<div class="progress"><span style="width:${Math.max(0,Math.min(100,n||0))}%"></span></div>`;
const empty=t=>`<div class="panel empty">${t}</div>`;
const adm=h=>A?h:'';
const pname=id=>(D.players.find(p=>p.id===id)||{name:'(eliminado)'}).name;
const cname=id=>(D.challenges.find(c=>c.id===id)||{title:'(eliminado)'}).title;
const stat=(n,l)=>`<div class="panel stat"><small>${l}</small><strong>${n}</strong></div>`;
const fmt=ms=>new Date(ms).toLocaleString('es',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
function toast(t){const e=$('#toast');e.textContent=t;e.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.add('hidden'),5000)}
let pre=null,pend=null;const UNDO=[];
function logA(t){if(!A)return;D.log=D.log||[];D.log.push({at:Date.now(),t});if(D.log.length>400)D.log=D.log.slice(-400)}
function touch(){RAC=null;D.challenges.forEach(c=>{if(c.ra&&!c.ra.since&&c.status!=='Próximamente'&&c.status!=='Finalizado')c.ra.since=Date.now()});if(pre!==null){UNDO.push(pre);if(UNDO.length>25)UNDO.shift();pre=null}if(A&&pend){logA(pend);pend=null}dirty=true;render()}

const OBM=['bronce','plata','oro','platino'];
const SC={Activo:'amber',Disponible:'amber','Por validar':'cyan',Próximamente:'muted',Finalizado:'red'};
const plain=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();

/* ---------- acciones ---------- */
const opts=()=>D.players.map(p=>[p.id,p.name]);
const _pn=id=>pname(id),_cn=id=>(C(id)||{title:'(eliminado)'}).title;
// Acciones de los botones (data-a="..."). Cada sección agrega las suyas con Object.assign(act,{...}).
const act={};
