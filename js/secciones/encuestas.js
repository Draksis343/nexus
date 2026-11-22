// NEXUS ARENA · Sección: encuestas
// Encuestas.
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
// ===== ENCUESTAS =====
let VOTES=[];
const pOpen=q=>!q.closed&&(!q.end||Date.now()<q.end),pVotes=q=>VOTES.filter(v=>String(v.q)===String(q.id)),pMine=q=>{const v=U&&U.pid&&pVotes(q).find(x=>x.p===U.pid);return v?v.o:null};
const pShow=q=>A||!pOpen(q)||q.res==='always'||(q.res!=='close'&&!!pMine(q));
function pollCard(q){const vs=pVotes(q),mine=pMine(q),open=pOpen(q),show=pShow(q),edit=(S.pedit||{})[q.id],can=open&&U&&U.pid&&FBU()&&(!mine||edit),tot=vs.length,cnt=q.opts.map((_,i)=>vs.filter(v=>v.o.includes(i)).length),mx=Math.max(1,...cnt);
 const st=!open?badge('Cerrada','muted'):q.end?`<span class="subtle">Cierra ${fmt(q.end)}</span>`:badge('Abierta','cyan');
 let body;
 if(can){body=q.multi?`<div class="popts">${q.opts.map((o,i)=>`<label class="popt ck"><input type="checkbox" name="pv-${q.id}" value="${i}" ${mine&&mine.includes(i)?'checked':''}><span>${esc(o)}</span></label>`).join('')}</div><div class="mg mt"><button class="btn small" data-a="pvote" data-id="${q.id}">Votar</button>${mine?`<button class="btn small ghost" data-a="pedit" data-id="${q.id}">Cancelar</button>`:''}</div><p class="subtle" style="margin:6px 0 0;font-size:12px">Puedes elegir varias opciones.</p>`
  :`<div class="popts">${q.opts.map((o,i)=>`<button class="popt${mine&&mine.includes(i)?' on':''}" data-a="pvote" data-id="${q.id}" data-o="${i}">${esc(o)}</button>`).join('')}</div>${mine?`<div class="mt"><button class="btn small ghost" data-a="pedit" data-id="${q.id}">Cancelar</button></div>`:''}`}
 else if(show){body=`<div class="pres">${q.opts.map((o,i)=>{const pc=tot?Math.round(cnt[i]/tot*100):0,me=mine&&mine.includes(i),win=!open&&cnt[i]===mx&&cnt[i]>0,who=!q.anon?vs.filter(v=>v.o.includes(i)).map(v=>pname(v.p)):[];return`<div class="pr${me?' me':''}${win?' win':''}"><div class="pr-b" style="width:${tot?cnt[i]/tot*100:0}%"></div><span class="pr-t">${win?'🏆 ':''}${esc(o)}${me?' <b>· tu voto</b>':''}</span><span class="pr-n">${pc}% · ${cnt[i]}</span>${who.length?`<span class="pr-w">${who.map(esc).join(', ')}</span>`:''}</div>`}).join('')}</div>`}
 else body=`<div class="popts">${q.opts.map(o=>`<div class="popt dis">${esc(o)}</div>`).join('')}</div>`;
 const foot=[];foot.push(`${tot} ${tot===1?'voto':'votos'}`);if(!q.anon)foot.push('votos públicos');if(mine&&!edit&&open)foot.push(`<button class="lnk" data-a="pedit" data-id="${q.id}">Cambiar mi voto</button>`);
 if(!U&&open)foot.push(FBU()?'Inicia sesión para votar':'');if(mine&&!show)foot.push('Los resultados se verán al cerrar la encuesta');
 return`<article class="poll${open?'':' closed'}"><div class="row">${badge('Encuesta','amber')}${st}</div><h3>${esc(q.q)}</h3>${q.desc?`<p class="subtle" style="margin:-4px 0 10px">${esc(q.desc)}</p>`:''}${body}<p class="pfoot">${foot.filter(Boolean).join(' · ')}</p>${A?`<div class="mg mt"><button class="btn small secondary" data-a="polled" data-id="${q.id}">Editar</button><button class="btn small secondary" data-a="pollcl" data-id="${q.id}">${q.closed?'Reabrir':'Cerrar'}</button><button class="btn small danger" data-a="polldel" data-id="${q.id}">Eliminar</button></div>`:''}</article>`}
function pollsHTML(){const L=[...(D.polls||[])].sort((a,b)=>(pOpen(b)-pOpen(a))||(b.at-a.at)),sh=S.allpolls?L:L.slice(0,3);
 return(sh.map(pollCard).join('')||'<p class="muted">Aún no hay encuestas.</p>')+(L.length>3?`<button class="btn small ghost mt" data-a="morepolls">${S.allpolls?'Ver menos':'Ver más ('+(L.length-3)+')'}</button>`:'')}

// ---- acciones de esta sección ----
Object.assign(act,{
 ntab(e){S.ntab=e.k;render()},
 morepolls(){S.allpolls=!S.allpolls;render()},
 pedit(e){S.pedit=S.pedit||{};S.pedit[e.id]=!S.pedit[e.id];render()},
 async pvote(e){const q=(D.polls||[]).find(x=>x.id===e.id);if(!q||!pOpen(q))return toast('Esta encuesta ya cerró.');if(!U||!U.pid)return toast('Inicia sesión para votar.');
  const o=q.multi?[...document.querySelectorAll('input[name="pv-'+q.id+'"]:checked')].map(x=>+x.value):[+e.o];if(!o.length)return toast('Elige al menos una opción.');
  const prev=VOTES.slice();VOTES=VOTES.filter(v=>!(String(v.q)===String(q.id)&&v.p===U.pid)).concat([{q:q.id,p:U.pid,o}]);if(S.pedit)delete S.pedit[q.id];PEND++;sfx('accept');render();toast('¡Voto registrado!');
  const j=await api({action:'vote',token:TOK(),poll:q.id,opts:o});PEND--;if(j.ok)softSync();else{VOTES=prev;render();apiErr(j,12)}},
 polled(e){const q=e.id?(D.polls||[]).find(x=>x.id===e.id):null;pre=JSON.stringify(D);pend=q?'Editó una encuesta':'Creó una encuesta';openForm.wide=true;
  openForm(q?'Editar encuesta':'Nueva encuesta',[['','1 · La pregunta','sec'],['q','Pregunta*'],['desc','Detalle (opcional)'],['opts','Opciones (una por línea, de 2 a 10)*','area'],['','2 · Cómo se vota','sec'],['multi','Tipo de respuesta','seg',[['','Una sola opción','Cada jugador elige una'],['1','Varias opciones','Pueden marcar varias']]],['res','¿Cuándo ver los resultados?','seg',[['vote','Al votar','Ven resultados después de votar'],['close','Al cerrar','Nadie los ve hasta que cierre'],['always','Siempre','Visibles desde el inicio']]],['anon','Votos','seg',[['1','Anónimos','Solo se ven los totales'],['','Públicos','Se ve quién votó qué']]],['end','Cierre automático (opcional)','dt']],
   q?{...q,opts:q.opts.join('\n'),multi:q.multi?'1':'',anon:q.anon?'1':'',end:q.end?toLocal(q.end):''}:{res:'vote',anon:'1',multi:''},
   o=>{const op=String(o.opts||'').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,10);if(op.length<2)return toast('Pon al menos 2 opciones.');D.polls=D.polls||[];
    const n={q:(o.q||'').trim(),desc:(o.desc||'').trim(),opts:op,multi:o.multi==='1',res:['vote','close','always'].includes(o.res)?o.res:'vote',anon:o.anon==='1',end:o.end?new Date(o.end).getTime():0};
    if(q)Object.assign(q,n);else D.polls.push({id:uid(),at:Date.now(),closed:false,...n});S.ntab='polls';touch();if(q&&pVotes(q).length)toast('Ojo: si cambiaste el orden de las opciones, los votos anteriores siguen ligados a su posición.')})},
 pollcl(e){const q=(D.polls||[]).find(x=>x.id===e.id);if(!q)return;pre=JSON.stringify(D);pend=q.closed?'Reabrió una encuesta':'Cerró una encuesta';q.closed=!q.closed;if(!q.closed&&q.end&&q.end<Date.now())q.end=0;touch()},
 async polldel(e){if(!confirm('¿Eliminar esta encuesta y sus votos?'))return;pre=JSON.stringify(D);pend='Eliminó una encuesta';D.polls=(D.polls||[]).filter(x=>x.id!==e.id);VOTES=VOTES.filter(v=>String(v.q)!==String(e.id));touch();if(FBU()&&FBK())api({action:'votedel',key:FBK(),poll:e.id}).catch(()=>{})}
});
