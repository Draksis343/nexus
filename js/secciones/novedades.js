// NEXUS ARENA · Sección: novedades
// Notas de actualización (Novedades) y la ventanilla automática al entrar.
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
const notesL=()=>[...(D.notes||[])].sort((a,b)=>(b.at||0)-(a.at||0));
function updBtn(){const L=notesL();if(!L.length&&!A)return'';let seen='';try{seen=localStorage.getItem('nx_notes_seen')||''}catch(e){}const nw=L.length&&L[0].id!==seen;
 return`<div class="upd-row"><button class="updb" data-a="notes" title="Notas de actualización">📝 Novedades${L.length?` <b>${esc(L[0].ver||'')}</b>`:''}${nw?'<i></i>':''}</button></div>`}
// Al entrar: muestra la nota más reciente una sola vez por nota nueva
function noteAutoSheet(n){try{localStorage.setItem('nx_notes_seen',n.id)}catch(e){}
 sheetOpen(`<h3>🆕 ¡Nueva actualización!</h3><p>Esto es lo nuevo en Nexus Arena.</p><div class="sh-l"><article class="unote last"><div class="unh"><span class="uver">${esc(n.ver||'—')}</span><b>${esc(n.title||'')}</b><span class="subtle">${n.at?new Date(n.at).toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'}):''}</span></div><div class="unb">${sani(n.body||'')}</div></article></div>
 <div class="ac-foot"><button type="button" class="btn secondary" data-a="notes">Ver todas las notas</button><button type="button" class="btn" style="flex:1" data-a="close">¡Entendido!</button></div>`);render()}
let NAT=0;function noteAuto(){if(NAT>60)return;NAT++;
 const busy=A||document.hidden||document.getElementById('splash')||document.getElementById('wel')||document.querySelector('.loot')||document.querySelector('#rbx.on')||!$('#modal').classList.contains('hidden')||!(D.notes||[]).length;
 if(busy){if(!A)setTimeout(noteAuto,1500);return}
 const n=notesL()[0];let seen='';try{seen=localStorage.getItem('nx_notes_seen')||''}catch(e){}if(n&&n.id!==seen)noteAutoSheet(n)}
function notesSheet(){const L=notesL();try{if(L.length)localStorage.setItem('nx_notes_seen',L[0].id)}catch(e){}
 sheetOpen(`<h3>📝 Notas de actualización</h3><p>Lo nuevo y lo que cambió en Nexus Arena.</p>${A?'<div class="mg" style="margin-bottom:12px"><button type="button" class="btn small" data-a="noteed">+ Nueva nota</button></div>':''}
 <div class="sh-l">${L.map((n,i)=>`<article class="unote${i===0?' last':''}"><div class="unh"><span class="uver">${esc(n.ver||'—')}</span><b>${esc(n.title||'')}</b><span class="subtle">${n.at?new Date(n.at).toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'}):''}</span></div><div class="unb">${sani(n.body||'')}</div>${A?`<div class="mg" style="margin-top:8px"><button type="button" class="mbtn" data-a="noteed" data-id="${n.id}">✎ Editar</button><button type="button" class="mbtn" data-a="notedel" data-id="${n.id}">✕ Borrar</button></div>`:''}</article>`).join('')||'<p class="muted">Aún no hay notas.</p>'}</div>
 <div class="ac-foot"><button type="button" class="btn" style="flex:1" data-a="close">Cerrar</button></div>`);render()}

// ---- acciones de esta sección ----
Object.assign(act,{
 notes(){notesSheet()},
 noteed(e){const n=e.id?(D.notes||[]).find(x=>x.id===e.id):null;pre=JSON.stringify(D);pend=n?'Editó una nota de actualización':'Agregó una nota de actualización';openForm.wide=true;openForm(n?'Editar nota':'Nueva nota de actualización',[['ver','Versión (ej. v1.4)*'],['title','Título*'],['at','Fecha','dt'],['body','Qué hay de nuevo','rich']],n?{...n,at:n.at?toLocal(n.at):''}:{ver:'',at:toLocal(Date.now())},o=>{D.notes=D.notes||[];const x=n?D.notes.find(y=>y.id===n.id):null,v={ver:(o.ver||'').trim(),title:(o.title||'').trim(),at:o.at?new Date(o.at).getTime():Date.now(),body:o.body||''};if(x)Object.assign(x,v);else D.notes.push({id:uid(),...v});touch();setTimeout(notesSheet,50)})},
 notedel(e){if(!confirm('¿Borrar esta nota?'))return;pre=JSON.stringify(D);pend='Borró una nota de actualización';D.notes=(D.notes||[]).filter(x=>x.id!==e.id);touch();notesSheet()}
});
