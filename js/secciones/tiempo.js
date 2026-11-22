// NEXUS ARENA · Sección: tiempo
// Línea de tiempo de temporadas.
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
const PIN='<svg viewBox="0 0 40 40"><path d="M20 0Q22.5 17.5 40 20Q22.5 22.5 20 40Q17.5 22.5 0 20Q17.5 17.5 20 0Z" fill="#ffc266"/></svg>';
function tiempo(){const L=[...D.tl].sort((a,b)=>(+a.n)-(+b.n)),N=L.length;
 let last=-1;L.forEach((t,i)=>{if(t.state==='En vivo')last=i});if(last<0)L.forEach((t,i)=>{if(t.state==='Pasada')last=i});
 const pct=N?(last>=0?(last+.5)/N*100:0):0;
 const items=L.map(t=>{const live=t.state==='En vivo',next=t.state==='Próxima',
  ic=t.icon&&/^img\//.test(t.icon)?`<img class="tl-ic" src="${esc(t.icon)}" alt="">`:'<span class="tl-ic"><span class="tl-emb"></span></span>',
  bg=t.img&&/^img\//.test(t.img)?`background:linear-gradient(100deg,#14171cf5 0%,#14171ce6 45%,#14171c80 78%,#14171c26 100%),url('${esc(t.img)}') center/cover`:'background:linear-gradient(100deg,#1d2127,#14171c)';
  return`<div class="tl-it${live?' live':''}${next?' next':''}"><span class="tl-pin">${PIN}</span><div class="tl-top">${ic}<div><button class="tl-name" data-a="tlopen" data-id="${t.id}"><span class="tl-n">Temporada ${esc(t.n)}:</span><span class="tl-s">${esc(t.name||'—')}</span></button>${live?'<span class="tl-live">● EN VIVO</span>':''}</div></div>
  <div class="tl-card" id="tc-${t.id}" style="${bg}"><div class="tl-ct"><strong>Temporada ${esc(t.n)}${t.name?' · '+esc(t.name):''}</strong><div class="rt">${sani(t.text||'')||'<span style="color:#a3adb5">Sin descripción todavía.</span>'}</div>${adm(`<button class="tl-b" data-a="editt" data-id="${t.id}">Editar</button><button class="tl-b d" data-a="delt" data-id="${t.id}">Quitar pin</button>`)}</div></div></div>`}).join('');
 return adm('<div class="mb"><button class="btn" data-a="newt">+ Nueva temporada (pin)</button></div>')+`<section class="tlx"><div class="tlv"><div class="tlv-head"><div class="tl-big"></div></div><div class="tlv-list"><div class="tlv-line" style="background:linear-gradient(180deg,#ffc266 0,#ffc266 ${pct.toFixed(1)}%,#ffc26659 ${Math.min(100,pct+14).toFixed(1)}%,#ffc2660a 100%)"><i style="height:${pct.toFixed(1)}%"></i></div>${items}<div class="tl-end">Continuará...</div></div></div>${N?'':'<p class="tl-hint">Aún no hay temporadas en la línea de tiempo.</p>'}<p class="tl-hint">Toca el nombre de una temporada para leer su descripción.</p></section>`}
const tf=t=>[['n','Número de temporada* (0 = temporada de prueba)','number',{min:0}],['name','Nombre (ej. Protocolo Zero; escribe "Oculto" para un spoiler)'],['state','Estado','select',['Pasada','En vivo','Próxima']],['text','Descripción (se abre al hacer clic en el nombre)','rich'],['img','Imagen detrás del texto (opcional)','file',{max:700}],['icon','Icono de la temporada (opcional, imagen cuadrada)','file',{max:96,png:1}],...(t&&t.img?[['rmimg','Imagen de fondo actual','select',[['0','Conservar'],['1','Quitar']]]]:[]),...(t&&t.icon?[['rmicon','Icono actual','select',[['0','Conservar'],['1','Quitar']]]]:[])];
async function saveTl(t,o){try{const u=o._ups||{};
 if(u.img){const path='img/tl-'+Date.now()+'.jpg';await repoPut(path,u.img.b64,'Imagen de temporada');if(t.img)repoDel(t.img);t.img=path}else if(o.rmimg==='1'&&t.img){repoDel(t.img);t.img=''}
 if(u.icon){const path='img/tl-ic-'+Date.now()+'.png';await repoPut(path,u.icon.b64,'Icono de temporada');if(t.icon)repoDel(t.icon);t.icon=path}else if(o.rmicon==='1'&&t.icon){repoDel(t.icon);t.icon=''}
 t.n=+o.n;t.name=(o.name||'').trim();t.state=o.state;t.text=o.text;if(!D.tl.includes(t))D.tl.push(t);touch()}catch(e){toast('No se pudo subir la imagen ('+e.message+'). Revisa tu sesión de administrador.')}}

// ---- acciones de esta sección ----
Object.assign(act,{
 tlopen(e){const c=document.getElementById('tc-'+e.id),was=c&&c.classList.contains('open');document.querySelectorAll('.tl-card.open').forEach(x=>x.classList.remove('open'));if(c&&!was)c.classList.add('open')},
 newt(){const nx=D.tl.length?Math.max(...D.tl.map(t=>+t.n||0))+1:0;openForm('Nueva temporada en la línea de tiempo',tf(),{n:nx,state:'Próxima'},o=>saveTl({id:uid(),img:'',icon:''},o))},
 editt(e){const t=D.tl.find(x=>x.id===e.id);openForm('Editar temporada',tf(t),t,o=>saveTl(t,o))},
 delt(e){const t=D.tl.find(x=>x.id===e.id);if(!t||!confirm('¿Quitar este pin de la línea de tiempo?'))return;if(t.img)repoDel(t.img);if(t.icon)repoDel(t.icon);D.tl=D.tl.filter(x=>x.id!==e.id);touch()}
});
