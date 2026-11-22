// NEXUS ARENA · Sección: historial
// Historial de resultados.
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
function historial(){const L=feed().sort((a,b)=>b.at-a.at);
 return`<section class="panel pad"><h2 class="section-title">Registro de actividad · ${esc(D.season)}</h2>${L.length?L.map(r=>`<div class="rrow"><span><strong>${pnh(r.p)}</strong> · ${esc(r.t)}<br><span class="subtle">${fmt(r.at)}</span></span>${fbadge(r)}</div>`).join(''):'<p class="muted">Todavía no hay actividad registrada.</p>'}</section>`}
