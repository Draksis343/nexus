// =====================================================================
//  ESTADÍSTICAS POR CATEGORÍA (pestaña «Estadísticas» del perfil)
//
//  Cada desafío y cada reto tiene una categoría (CATS: Habilidad,
//  Supervivencia, Velocidad...). Cada resultado suma puntos de estadística
//  en su categoría según las medallas obtenidas:
//     Participación 0.5 · Bronce 1 · Plata 2 · Oro 3 · Platino 4
//  (con las 4 medallas de un desafío: 1+2+3+4 = 10 puntos).
//  Los logros de desafío NO suman. La gráfica muestra cada categoría como
//  % del mejor jugador de la liga en esa categoría.
// =====================================================================
const STW = { participacion: .5, bronce: 1, plata: 2, oro: 3, platino: 4 };
const stPts = r => mset(r).reduce((n, k) => n + (STW[k] || 0), 0);
const stCat = r => { if (r.c) { const c = (D.challenges || []).find(x => x.id === r.c); return c && c.category || '' } return r.cat || '' };
const stCats = () => [...new Set([...CATS, ...(D.challenges || []).map(c => c.category).filter(Boolean)])];
const stAll = () => [...(D.results || []), ...raRes(), ...duelRes()];

// Puntos por categoría de cada jugador. season = '' para todo el historial
function stTable(season) {
  const T = {}, n = {};
  stAll().forEach(r => {
    if (season && r.s !== season) return;
    const k = stCat(r); if (!k || !r.p) return;
    const t = T[r.p] || (T[r.p] = {}), c = n[r.p] || (n[r.p] = {});
    t[k] = (t[k] || 0) + stPts(r);
    const q = c[k] || (c[k] = { d: 0, r: 0 }); r.c ? q.d++ : q.r++;
  });
  return { T, n };
}

const stPoly = (vals, cx, cy, R) => vals.map((v, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / vals.length, d = R * Math.max(0, Math.min(100, v)) / 100; return (cx + Math.cos(a) * d).toFixed(1) + ',' + (cy + Math.sin(a) * d).toFixed(1) }).join(' ');

function stRadar(cats, series) {
  const W = 440, H = 300, cx = W / 2, cy = H / 2, R = 104, n = cats.length;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="strad" role="img" aria-label="Gráfica de estadísticas por categoría">`;
  [25, 50, 75, 100].forEach(l => s += `<polygon points="${stPoly(cats.map(() => l), cx, cy, R)}" class="st-ring${l === 100 ? ' out' : ''}"/>`);
  cats.forEach((c, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, lx = cx + Math.cos(a) * (R + 22), ly = cy + Math.sin(a) * (R + 22);
    const anc = Math.abs(Math.cos(a)) < .25 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="st-axis"/><text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${anc}" class="st-lbl">${esc(c)}</text>`;
  });
  series.forEach(z => {
    s += `<polygon points="${stPoly(z.v, cx, cy, R)}" class="st-poly ${z.cls}"/>`;
    if (z.dots) z.v.forEach((v, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n, d = R * Math.min(100, v) / 100; s += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" r="3.2" class="st-dot ${z.cls}"><title>${esc(cats[i])}: ${Math.round(v)}%</title></circle>` });
  });
  return s + '</svg>';
}

function statsTab(p) {
  const season = S.stS == null ? '' : S.stS, { T, n } = stTable(season), cats = stCats();
  const ids = D.players.map(x => x.id), max = {};
  cats.forEach(k => max[k] = Math.max(0, ...ids.map(id => (T[id] || {})[k] || 0)));
  const pct = id => cats.map(k => max[k] ? 100 * ((T[id] || {})[k] || 0) / max[k] : 0);
  const act = ids.filter(id => T[id]);
  const avg = cats.map((k, i) => act.length ? act.reduce((a, id) => a + pct(id)[i], 0) / act.length : 0);
  const me = pct(p.id), mine = T[p.id] || {}, cnt = n[p.id] || {};
  const tot = Object.values(cnt).reduce((a, q) => a + q.d + q.r, 0);
  const rival = S.stR && S.stR !== p.id && D.players.find(x => x.id === S.stR);
  const seasons = [...new Set(stAll().map(r => r.s).filter(Boolean))];
  const order = cats.map((k, i) => ({ k, v: me[i], pts: mine[k] || 0 })).filter(x => x.pts > 0).sort((a, b) => b.v - a.v);
  const strong = order.slice(0, 2), weak = cats.map((k, i) => ({ k, v: me[i] })).sort((a, b) => a.v - b.v).filter(x => !strong.some(s => s.k === x.k)).slice(0, 2);
  const series = [{ v: avg, cls: 'avg' }, ...(rival ? [{ v: pct(rival.id), cls: 'riv', dots: 1 }] : []), { v: me, cls: 'me', dots: 1 }];
  const orphan = A ? (D.results || []).map((r, i) => ({ r, i })).filter(x => x.r.p === p.id && !x.r.c && !x.r.cat) : [];
  return `<div class="stt mt">
  <div class="st-top">
   <div class="st-legend"><span><i class="me"></i>${esc(p.name)}</span><span><i class="avg"></i>Promedio de la liga</span>${rival ? `<span><i class="riv"></i>${esc(rival.name)}</span>` : ''}</div>
   <div class="st-ctl">
    <select class="field" data-stsel="S" aria-label="Temporada"><option value="">Todas las temporadas</option>${seasons.map(s => `<option value="${esc(s)}" ${s === season ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select>
    <select class="field" data-stsel="R" aria-label="Comparar con"><option value="">Comparar con…</option>${D.players.filter(x => x.id !== p.id).map(x => `<option value="${x.id}" ${rival && rival.id === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
   </div>
  </div>
  ${tot < 3 ? `<p class="st-note">${tot ? `Lleva ${tot} ${tot === 1 ? 'resultado' : 'resultados'} con categoría.` : 'Todavía no tiene resultados con categoría.'} La gráfica se va formando con cada desafío y reto que cumpla.</p>` : ''}
  <div class="st-chart">${stRadar(cats, series)}</div>
  ${strong.length ? `<div class="st-tags">${strong.map(x => `<span class="st-tag up">▲ ${esc(x.k)}</span>`).join('')}${weak.map(x => `<span class="st-tag dn">◎ ${esc(x.k)}</span>`).join('')}</div>` : ''}
  <div class="st-rows">${cats.map((k, i) => { const q = cnt[k] || { d: 0, r: 0 }, v = mine[k] || 0; return `<div class="st-row"><span class="st-k">${esc(k)}</span><span class="st-bar"><b style="width:${me[i].toFixed(1)}%"></b>${rival ? `<b class="riv" style="width:${pct(rival.id)[i].toFixed(1)}%"></b>` : ''}</span><span class="st-v">${Math.round(v * 10) / 10} pts</span><span class="st-n" title="Desafíos y retos">${q.d}D · ${q.r}R</span></div>` }).join('')}</div>
  <p class="st-help">Cada desafío o reto suma puntos a su categoría según las medallas: Bronce 1, Plata 2, Oro 3 y Platino 4. Con las cuatro medallas son 10 puntos. El 100 % de cada eje es el mejor jugador de la liga en esa categoría.</p>
  ${orphan.length ? `<div class="st-orph"><b>Retos sin categoría (solo tú lo ves)</b><span class="subtle">Asígnales una para que cuenten en las estadísticas.</span>${orphan.map(({ r, i }) => `<label class="st-orow"><span>${esc(r.t || 'Reto')} · ${esc(MED[r.m] ? MED[r.m].n : '')}</span><select class="field" data-stcat="${i}"><option value="">Elegir…</option>${cats.map(k => `<option>${esc(k)}</option>`).join('')}</select></label>`).join('')}</div>` : ''}
  </div>`;
}

// selectores de la pestaña (temporada, rival y categoría de retos viejos)
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset && t.dataset.stsel) { S['st' + t.dataset.stsel] = t.value; render(); }
  else if (t.dataset && t.dataset.stcat != null && A) { const r = (D.results || [])[+t.dataset.stcat]; if (r && t.value) { r.cat = t.value; pend = 'Asignó categoría a un reto'; touch() } }
});
