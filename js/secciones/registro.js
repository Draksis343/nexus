// NEXUS ARENA · Sección: registro
// Registro de cambios del admin.
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
function registro(){const L=[...(D.log||[])].reverse();return A?`<section class="panel pad"><p class="muted">Se guardan las últimas 400 acciones del administrador (se publican junto con los datos). Útil para aclarar dudas del tipo «¿quién me quitó la medalla?».</p>${L.length?L.map(x=>`<div class="rrow"><span>${esc(x.t)}</span><span class="subtle">${fmt(x.at)}</span></div>`).join(''):empty('Aún no hay acciones registradas.')}</section>`:''}

// ---- acciones de esta sección ----
Object.assign(act,{
 reg(e){const c=C(e.c);if(!c)return;if(!D.players.length)return toast('Agrega jugadores primero.');
  const go=pid=>{const at=c.rarity==='Atemporal',r=D.results.find(x=>x.p===pid&&x.c===c.id),gs=c.goals||[],f=[];
   if(at)f.push(['at','Medalla Atemporal','select',[['','No'],['1','Sí, otorgarla']]]);else f.push(['ms','Objetivos cumplidos: marca cada medalla que ganó (si marca las 4 las recibe todas y suma sus PL)','checks',Object.keys(MED).map(k=>[k,MED[k].n+' · '+MED[k].pl+' PL'])]);
   if(gs.length)f.push(['g','Logros del desafío que consiguió','checks',gs.map(g=>[g.id,g.name+' (+'+(+g.pl||0)+' PL)'])]);
   openForm('Resultado de '+pname(pid)+' · '+c.title,f,{ms:r?mset(r):[],at:D.atem.some(x=>x.p===pid&&x.c===c.id)?'1':'',g:D.cg.filter(x=>x.p===pid&&x.c===c.id).map(x=>x.g)},o=>applyReg(c,pid,o))};
  if(e.p)return go(e.p);openForm('¿A qué jugador registras?',[['p','Jugador','select',opts()]],{},o=>go(o.p))},
 regdel(e){const c=C(e.c);if(!c||!confirm('¿Quitar el resultado de '+pname(e.p)+' en este desafío (medalla y logros)?'))return;D.results=D.results.filter(r=>!(r.p===e.p&&r.c===e.c));D.cg=D.cg.filter(x=>!(x.p===e.p&&x.c===e.c));D.atem=D.atem.filter(x=>!(x.p===e.p&&x.c===e.c));syncCheck(e.p,e.c);touch()}
});
