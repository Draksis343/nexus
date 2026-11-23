// =====================================================================
//  CALENDARIO DE ADVIENTO (dentro de cada evento de temporada)
//
//  Se guarda en el evento como:
//    e.adv = { on: true/false,          // visible para los jugadores
//              t: 'Calendario de adviento',  // título del botón y la ventana
//              s: 'AAAA-MM-DD',          // primer día
//              n: 24,                    // cuántos días dura (1 a 31)
//              peek: false,              // ¿mostrar los regalos de días futuros?
//              rw: { 1:{recompensa}, 2:{...}, ... } }
//
//  Reclamar usa la misma acción del script que el pase ('passclaim'),
//  con el id 'adv:<evento>:<día>', así que NO hay que actualizar el
//  Apps Script. El día se calcula con la hora de Ciudad de México y un
//  reclamo solo cuenta si se hizo ESE día: si no se reclama, se pierde.
// =====================================================================
const ADVTZ = 'America/Mexico_City';
const advYmd = t => { try { return new Date(t).toLocaleDateString('en-CA', { timeZone: ADVTZ }) } catch (e) { return new Date(t).toISOString().slice(0, 10) } };
const advNum = s => { const [y, m, d] = String(s || '').split('-').map(Number); return Math.round(Date.UTC(y || 2000, (m || 1) - 1, d || 1) / 864e5) };
const advOn = e => !!(e && e.adv && e.adv.on && e.adv.s && +e.adv.n > 0);
const advN = e => Math.max(1, Math.min(31, Math.round(+((e.adv || {}).n) || 1)));
// número de día (puede salir de 1..n) que corresponde a un instante
const advRaw = (e, t) => advNum(advYmd(t)) - advNum(e.adv.s) + 1;
const advDayOf = (e, t) => { const k = advRaw(e, t); return k >= 1 && k <= advN(e) ? k : 0 };
const advToday = e => advOn(e) ? advDayOf(e, Date.now()) : 0;
const advDate = (e, k, o) => new Date((advNum(e.adv.s) + k - 1) * 864e5).toLocaleDateString('es-MX', { timeZone: 'UTC', day: 'numeric', month: 'short', ...(o || {}) });
const advRid = (e, k) => 'adv:' + e.id + ':' + k;
const advRwOf = (e, k) => { const z = ((e.adv || {}).rw || {})[k]; return z && PT[z.type] ? z : null };
// reclamo válido: hecho el mismo día que le toca
const advGot = (e, pid, k) => PASSC.find(c => c.p === pid && c.r === advRid(e, k) && (!c.at || advDayOf(e, c.at) === k));

// Recompensas del calendario que ya tiene el jugador (se suman a las del evento)
function advRw(p) {
  const L = [];
  (D.events || []).forEach(e => {
    if (!e.adv || !e.adv.s || !e.adv.rw) return;
    for (let k = 1; k <= advN(e); k++) {
      const z = advRwOf(e, k); if (!z) continue;
      const c = advGot(e, p.id, k);
      if (c) L.push({ ...z, id: 'adv-' + e.id + '-' + k, ev: e.id, lv: 0, from: (e.adv.t || 'Calendario') + ' · día ' + k, name: z.name || PT[z.type][0], at: c.at || 0 });
    }
  });
  return L;
}

// ¿El jugador conectado tiene un regalo esperando hoy?
const advHot = e => { const k = advToday(e); return !!(k && advRwOf(e, k) && U && U.pid && !advGot(e, U.pid, k)) };

// Botón del banner del evento
function advBtn(e) {
  if (!advOn(e)) return '';
  const hot = advHot(e);
  return `<button class="btn small advbtn${hot ? ' hot' : ''}" data-a="advopen" data-id="${e.id}">🎄 ${esc(e.adv.t || 'Calendario de adviento')}${hot ? '<i class="advdot" aria-label="Regalo disponible"></i>' : ''}</button>`;
}

// Contenido de la ventana
function advHTML(e) {
  const n = advN(e), raw = advRaw(e, Date.now()), today = raw >= 1 && raw <= n ? raw : 0, pid = U && U.pid, t = e.adv.t || 'Calendario de adviento';
  let got = 0, tot = 0;
  const tiles = [];
  for (let k = 1; k <= n; k++) {
    const z = advRwOf(e, k), c = pid && advGot(e, pid, k);
    if (z) tot++; if (c && z) got++;
    const st = !z ? 'vacio' : c ? 'got' : k === today ? 'hoy' : k < raw ? 'perdido' : 'futuro';
    const ic = !z ? '<span class="advx">·</span>' : (st === 'got' || A || (st === 'futuro' && e.adv.peek) || st === 'hoy' && e.adv.peek) ? rIcon(z) : st === 'perdido' ? '🎁' : st === 'hoy' ? '🎁' : '🔒';
    const lb = A ? (z ? esc(z.name || PT[z.type][0]) : 'Sin regalo')
      : st === 'got' ? '✔ ' + esc(z.name || PT[z.type][0]) : st === 'hoy' ? (pid ? 'Reclamar' : 'Inicia sesión') : st === 'perdido' ? 'Perdido' : st === 'vacio' ? 'Sin regalo' : (e.adv.peek ? esc(z.name || PT[z.type][0]) : 'Pronto');
    const act0 = A ? 'advday' : st === 'hoy' ? (pid ? 'advclaim' : 'ulogin') : '';
    const col = z ? lcol(rwRar(z)) : 'var(--line)';
    tiles.push(`<div class="advd st-${st}${k === today ? ' today' : ''}" style="--pc:${col}"><button type="button" class="advb" ${act0 ? `data-a="${act0}" data-id="${e.id}" data-d="${k}"` : 'disabled'} aria-label="Día ${k}: ${lb.replace(/<[^>]*>/g, '')}"><span class="advk">${k}</span><span class="advi">${ic}</span><small>${lb}</small><em>${advDate(e, k)}</em></button>${A && z ? `<button type="button" class="advrm" data-a="advdel" data-id="${e.id}" data-d="${k}" title="Quitar regalo">✕</button>` : ''}</div>`);
  }
  const msg = !e.adv.on ? '🔒 Desactivado: los jugadores aún no lo ven.' : raw < 1 ? `Abre el ${advDate(e, 1, { weekday: 'long' })}.` : raw > n ? 'El calendario terminó. ¡Gracias por participar!' : `Hoy es el día <b>${today}</b> de ${n}.`;
  return `<div class="advs" style="--ec:${evC(e)}">
  <div class="advhd"><div class="advbig" aria-hidden="true">🎄</div><div><h2>${esc(t)}</h2><p class="muted">Un regalo por día. Si no lo reclamas ese mismo día, se pierde.</p></div></div>
  <div class="advst"><span>${msg}</span>${pid && !A && tot ? `<span class="badge cyan">🎁 ${got} / ${tot} reclamados</span>` : ''}</div>
  ${A ? `<p class="subtle" style="margin:0 0 10px">Toca un día para elegir su regalo. Los días cambian a la medianoche (hora del centro de México).</p>` : ''}
  <div class="advg">${tiles.join('')}</div>
  <div class="mg mt">${A ? `<button type="button" class="btn small secondary" data-a="advcfg" data-id="${e.id}">⚙ Ajustes del calendario</button><button type="button" class="btn small ghost" data-a="advfill" data-id="${e.id}">💎 Rellenar días vacíos</button>` : ''}<button type="button" class="btn small ghost" data-a="advclose">Cerrar</button></div></div>`;
}

const advEv = id => (D.events || []).find(v => v.id === id);
const advRefresh = e => { const w = document.querySelector('#mform .advs'); if (w && e) w.outerHTML = advHTML(e) };

// ---- acciones de esta sección ----
Object.assign(act, {
  advopen(e) { const x = advEv(e.id); if (!x || !x.adv) return; sheetOpen(advHTML(x)) },
  advclose() { closeM(false) },
  async advclaim(e) {
    const x = advEv(e.id); if (!x || !advOn(x)) return;
    if (!U || !U.pid) return toast('Inicia sesión con tu cuenta para reclamar.');
    const k = advToday(x), z = advRwOf(x, k), p = D.players.find(q => q.id === U.pid);
    if (!k || +e.d !== k) { toast('Ese día ya no está disponible.'); return advRefresh(x) }
    if (!z || !p || advGot(x, p.id, k)) return;
    const rid = advRid(x, k), now = Date.now();
    PEND++; PASSC.push({ p: p.id, r: rid, at: now }); sfx('accept'); advRefresh(x); render();
    lootPlay([{ r: z, rar: rwRar(z), src: (x.adv.t || 'Calendario') + ' · día ' + k }], p);
    const j = await api({ action: 'passclaim', token: TOK(), rids: [rid] }); PEND--;
    if (j.ok) softSync(); else { PASSC = PASSC.filter(c => !(c.p === p.id && c.r === rid && c.at === now)); render(); advRefresh(x); apiErr(j, 8) }
  },
  // ---- admin ----
  advcfg(e) {
    const x = advEv(e.id); if (!x) return; const a = x.adv || {};
    const span = x.start && x.end ? Math.round((x.end - x.start) / 864e5) : 7;
    openForm('🎄 Calendario de adviento', [
      ['on', '¿Visible para los jugadores?', 'select', [['1', 'Sí, mostrar el botón en el evento'], ['0', 'No, todavía no']]],
      ['t', 'Título (aparece en el botón)'],
      ['s', 'Primer día', 'date'],
      ['n', 'Cuántos días dura (1 a 31)', 'number', { min: 1 }],
      ['peek', 'Regalos de días que no han llegado', 'select', [['0', 'Ocultos: que sean sorpresa'], ['1', 'Visibles: que se vea qué toca']]],
      ['advnote', 'Cada día solo se puede reclamar ese día; si alguien no entra, lo pierde. Después de guardar, toca cada día para elegir su regalo.', 'note']
    ], { on: a.on ? '1' : '0', t: a.t || 'Calendario de adviento', s: a.s || advYmd(x.start || Date.now()), n: a.n || Math.max(1, Math.min(31, span || 7)), peek: a.peek ? '1' : '0' }, o => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(o.s || '')) return toast('Elige el primer día.');
      x.adv = { ...a, on: o.on === '1', t: (o.t || '').trim().slice(0, 60) || 'Calendario de adviento', s: o.s, n: Math.max(1, Math.min(31, Math.round(+o.n || 1))), peek: o.peek === '1', rw: a.rw || {} };
      pend = (a.s ? 'Editó' : 'Creó') + ' el calendario del evento «' + x.title + '»'; touch(); setTimeout(() => sheetOpen(advHTML(x)), 80);
    });
  },
  advday(e) { act.evpz({ id: e.id, d: e.d }) },
  advdel(e) { const x = advEv(e.id); if (!x || !x.adv || !x.adv.rw) return; const z = x.adv.rw[e.d]; if (!z || !confirm('¿Quitar el regalo del día ' + e.d + '?')) return; if (z.img) repoDel(z.img); delete x.adv.rw[e.d]; touch(); advRefresh(x) },
  advfill(e) {
    const x = advEv(e.id); if (!x || !x.adv) return;
    openForm('💎 Rellenar días vacíos', [['v', 'Reliquias por día', 'number', { min: 1 }], ['v7', 'Cada 7 días, en su lugar (0 = igual que los demás)', 'number', { min: 0 }]], { v: 10, v7: 50 }, o => {
      const v = Math.max(1, Math.round(+o.v || 1)), v7 = Math.max(0, Math.round(+o.v7 || 0)); x.adv.rw = x.adv.rw || {}; let c = 0;
      for (let k = 1; k <= advN(x); k++) if (!advRwOf(x, k)) { const big = v7 && k % 7 === 0; x.adv.rw[k] = { id: 'a' + uid(), type: 'reliquias', v: big ? v7 : v, name: '', desc: '', rar: big ? 'Épica' : 'Común' }; c++ }
      touch(); toast(c ? `Listo: ${c} días con Reliquias.` : 'No había días vacíos.'); setTimeout(() => sheetOpen(advHTML(x)), 80);
    });
  }
});
