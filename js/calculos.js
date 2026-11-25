// NEXUS ARENA · calculos
// Cálculos de la liga: estadísticas, PL, medallas, ranking, feed de resultados, reliquias.
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
const feed=()=>[...D.results.map(r=>({p:r.p,at:r.at,t:rname(r),bt:mset(r).map(k=>MED[k].n).join(' + '),pl:rpl(r)})),...duelRes().map(r=>({p:r.p,at:r.at,t:(r.ra?'Auto · ':'')+r.t,bt:mset(r).map(k=>MED[k].n).join(' + '),pl:rpl(r),ra:r.ra})),...raRes().map(r=>({p:r.p,at:r.at,t:'Auto · '+rname(r),bt:mset(r).map(k=>MED[k].n).join(' + '),pl:rpl(r),ra:1})),...allCg().map(x=>({p:x.p,at:x.at,t:(x.ra?'Auto · ':'')+x.t,bt:'Logro del desafío',pl:x.pl})),...allSyncs().map(x=>({p:x.p,at:x.at,t:(x.ra?'Auto · ':'')+x.t,bt:SYNC.name,pl:x.pl})),...D.atem.map(x=>({p:x.p,at:x.at,t:'Desafío atemporal: '+x.t,bt:'Medalla Atemporal',pl:0})),...evFeed()];
const fbadge=f=>badge(f.bt+(f.pl?' · +'+f.pl+' PL':''),'cyan');
const C=id=>D.challenges.find(c=>c.id===id);
const nxb=r=>{if(r.m==='participacion')return 0;const c=C(r.c);return c?(c.rarity==='Nexus'?+c.bonus||0:0):(+r.nb||0)};
const mset=r=>{const a=Array.isArray(r.ms)&&r.ms.length>1?r.ms.filter(k=>MED[k]):[];return a.length>1?a:[r.m]};
const rpl=r=>mset(r).reduce((s,k)=>s+MED[k].pl,0)+nxb(r);
const dms=d=>{const a=Array.isArray(d.ms)?d.ms.filter(k=>MED[k]&&k!=='participacion'):(d.m&&MED[d.m]?[d.m]:[]);return a};
const dfix=o=>{o.rq=Math.max(0,Math.round(+o.rq||0));o.ms=OBM.filter(k=>(o.ms||[]).includes(k));o.m=o.ms.length?o.ms[o.ms.length-1]:'';return o};
const duelRes=()=>D.duels.flatMap(d=>{if(dms(d).length&&dst(d)==='Cumplido'){const a=dms(d);return[{p:d.b,c:null,m:a[a.length-1],ms:a.length>1?a:undefined,at:d.at||0,t:'Reto: '+(d.game||'sin juego'),s:D.season,cat:edf(d).cat||'',d:d.id}]}const x=raDuel(d);if(!x.ms.length)return[];return[{p:d.b,c:null,m:x.ms[x.ms.length-1],ms:x.ms.length>1?x.ms:undefined,at:x.at||d.at||0,t:'Reto: '+(edf(d).game||'sin juego'),s:D.season,ra:1,cat:edf(d).cat||'',d:d.id}]});
function raDuel(d){if(d.status==='No cumplido'||(d.status==='Cumplido'&&dms(d).length))return{ms:[],at:0,got:{}};const e=edf(d);if(!raOn(e))return{ms:[],at:0,got:{}};return raMed({ra:e.ra,end:0},d.b)}
const rname=r=>r.t||cname(r.c);
const crar=c=>rbadge(!c.rarity||c.rarity==='Normal'?'Común':c.rarity);
const relicLeft=a=>Math.max(0,(+a.max||0)-D.grants.filter(g=>g.a===a.id).length-(RAC?RAC.gr.filter(g=>g.a===a.id).length:0));
const relicLeftC=c=>Math.max(0,(+c.slots||0)-D.results.filter(r=>r.c===c.id&&r.m!=='participacion').length);
const relicDone=r=>r.m!=='participacion'&&(C(r.c)?C(r.c).rarity==='Reliquia':!!r.rel);
const rqChip=(c,big)=>+c.rq>0?`<span class="rqc${big?' big':''}" title="Reliquias" aria-label="${+c.rq} Reliquias">${RQI}${+c.rq}</span>`:'';
const relicNote=c=>c.rarity!=='Reliquia'?'':(relicLeftC(c)>0?`<span class="badge" style="color:${rc('Reliquia')};align-self:flex-start">Reliquia · quedan ${relicLeftC(c)} de ${+c.slots||0}</span>`:`<span class="badge red" style="align-self:flex-start">🔒 Cupos agotados · ya no está disponible</span>`);
const gone=c=>c.rarity==='Reliquia'&&relicLeftC(c)<=0?' gone':'';
const ytId=u=>{const m=String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);return m&&m[1]};

/* ---------- cálculos ---------- */
function stats(p){const r=[...D.results,...duelRes(),...raRes()].filter(x=>x.p===p.id),cur=x=>(x.s||D.season)===D.season,s={pl:+p.bonus||0,plAll:(+p.bonus||0)+(+p.bonusOld||0),sm:0,xp:0,n:{participacion:0,bronce:0,plata:0,oro:0,platino:0},r};
 r.forEach(x=>{if(!MED[x.m])return;const ks=mset(x),v=ks.reduce((q,k)=>q+MED[k].pl,0)+nxb(x);s.plAll+=v;if(cur(x)){s.pl+=v;if(x.m!=='participacion')s.sm+=ks.length}ks.forEach(k=>{s.xp+=MED[k].xp;s.n[k]++})});
 allCg().filter(x=>x.p===p.id).forEach(x=>{const v=+x.pl||0;s.plAll+=v;if(cur(x))s.pl+=v});evFeed().filter(x=>x.p===p.id).forEach(x=>{const v=+x.pl||0;s.plAll+=v;if(cur(x))s.pl+=v});s.sync=0;allSyncs().filter(x=>x.p===p.id).forEach(x=>{const v=+x.pl||0;s.plAll+=v;if(cur(x))s.pl+=v;s.sync++});s.atm=D.atem.filter(x=>x.p===p.id).length;
 s.xpRaw=s.xp;s.rp=10*(r.filter(relicDone).length+[...D.grants,...raGrants()].filter(g=>g.p===p.id&&(D.achs.find(a=>a.id===g.a)||{}).rar==='Reliquia').length+(p.hall||[]).filter(x=>x.rar==='Reliquia').length);s.xp=Math.max(0,s.xp-(+p.xpBase||0));s.prest=+p.prestige||0;
 s.medals=s.n.bronce+s.n.plata+s.n.oro+s.n.platino;let k=0;RANKS.forEach((q,i)=>{if(s.xp>=q[0])k=i});
 s.lvl=k;s.rank=RANKS[k][1];s.last=Math.max(0,...r.map(x=>+x.at||0));{const W=604800000,ws=new Set(r.filter(x=>x.at).map(x=>Math.floor(x.at/W))),w0=Math.floor(Date.now()/W);let w=ws.has(w0)?w0:w0-1,n=0;while(ws.has(w)){n++;w--}s.streak=n;let best=0,run=0;[...ws].sort((a,b)=>a-b).forEach((x,i,a)=>{run=i&&x===a[i-1]+1?run+1:1;best=Math.max(best,run)});s.bestStreak=best}s.from=RANKS[k][0];s.next=RANKS[k+1];s.max=k===RANKS.length-1;return s}
function ranking(k='PL'){const L=D.players.map(p=>{const s=stats(p);return{p,s,g:nach(p,s)}});
 const f={PL:(a,b)=>b.s.pl-a.s.pl||b.s.n.platino-a.s.n.platino||b.s.n.oro-a.s.n.oro||b.s.n.plata-a.s.n.plata||b.s.r.length-a.s.r.length||(a.s.last||9e15)-(b.s.last||9e15),MED:(a,b)=>b.s.medals-a.s.medals||b.s.pl-a.s.pl,XP:(a,b)=>b.s.prest-a.s.prest||b.s.xp-a.s.xp,HIST:(a,b)=>b.s.plAll-a.s.plAll||b.s.pl-a.s.pl||(a.s.last||9e15)-(b.s.last||9e15),REL:(a,b)=>b.s.rp-a.s.rp||b.s.pl-a.s.pl};
 return L.sort(f[k])}
const lim=c=>c.rarity==='Atemporal'?'Sin fecha límite':(c.end?fmt(c.end):esc(c.due||'—'));
