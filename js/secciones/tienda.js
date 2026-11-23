// =====================================================================
//  TIENDA NEXUS
//
//  Datos (en data.json):
//    D.shop = { on: false,                 // visible para los jugadores
//               t: 'Tienda Nexus',          // nombre
//               d: 'texto',                 // descripción corta
//               items: [ { id, rw:{recompensa}, price, sync, stock, until, feat, at } ] }
//      price = Reliquias que cuesta        sync  = Medallas de Sincronía necesarias (no se gastan)
//      stock = cupo total (0 = sin límite) until = fecha límite en ms (0 = siempre)
//      feat  = destacado (aparece arriba)
//
//  Compras: se guardan con la acción 'passclaim' del script, con el id
//  'shop:<artículo>:<precio>' (no hay que actualizar el Apps Script).
//  Reliquias disponibles = Reliquias ganadas (rqOf) − lo gastado en la tienda.
// =====================================================================
const SHOP = () => { D.shop = D.shop || { on: false, t: 'Tienda Nexus', d: '', items: [] }; D.shop.items = D.shop.items || []; return D.shop };
const shopVis = () => !!(A || (D.shop && D.shop.on));
const shopTypes = () => EVRWT().filter(k => k !== 'reliquias');
const shopBuys = (pid, id) => PASSC.filter(c => /^shop:/.test(c.r || '') && (!pid || c.p === pid) && (!id || String(c.r).split(':')[1] === id));
const shopSpent = pid => shopBuys(pid).reduce((n, c) => n + Math.max(0, +String(c.r).split(':')[2] || 0), 0);
const rqBal = p => Math.max(0, rqOf(p) - shopSpent(p.id));
const syncOf = p => allSyncs().filter(x => x.p === p.id).length;
const shopSold = it => new Set(shopBuys('', it.id).map(c => c.p)).size;
const shopLeft = it => +it.stock > 0 ? Math.max(0, +it.stock - shopSold(it)) : Infinity;
const shopOpen = it => !it.until || Date.now() < it.until;
const shopMine = (pid, it) => !!pid && shopBuys(pid, it.id).length > 0;

// Lo comprado se suma a la colección del jugador
function shopRw(p) {
  const L = [], items = (D.shop && D.shop.items) || [];
  shopBuys(p.id).forEach(c => {
    const id = String(c.r).split(':')[1], it = items.find(x => x.id === id);
    if (it && it.rw && PT[it.rw.type] && !L.some(r => r.id === 'shop-' + id)) L.push({ ...it.rw, id: 'shop-' + id, lv: 0, from: 'Tienda', name: it.rw.name || PT[it.rw.type][0], at: c.at || 0 });
  });
  return L;
}

// Estado de un artículo para el jugador conectado
function shopState(it, p) {
  if (p && shopMine(p.id, it)) return ['mine', '✔ Ya es tuyo'];
  if (!shopOpen(it)) return ['off', 'Ya no está disponible'];
  if (shopLeft(it) <= 0) return ['off', 'Agotado'];
  if (!p) return ['login', 'Inicia sesión para comprar'];
  const sy = syncOf(p), need = Math.max(0, +it.sync || 0);
  if (sy < need) return ['lock', `Necesitas ${need} ✦ (tienes ${sy})`];
  const bal = rqBal(p), pr = Math.max(0, +it.price || 0);
  if (bal < pr) return ['lock', `Te faltan ${pr - bal} 💎`];
  return ['buy', 'Comprar'];
}

const shopUntil = ms => new Date(ms).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) + ', ' + new Date(ms).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

function shopCard(it, p) {
  const r = it.rw || {}, P = PT[r.type] || PT.objeto, [st, lb] = shopState(it, p), col = lcol(rwRar(r)), left = shopLeft(it);
  const tags = [
    +it.sync > 0 ? `<span class="shtag sy" title="Medallas de Sincronía necesarias (no se gastan)">✦ ${+it.sync}</span>` : '',
    left !== Infinity ? `<span class="shtag">${left > 0 ? 'Quedan ' + left : 'Agotado'}</span>` : '',
    it.until ? `<span class="shtag">${shopOpen(it) ? '⏳ Hasta ' + shopUntil(it.until) : 'Terminó'}</span>` : ''
  ].join('');
  return `<article class="panel shc st-${st}${it.feat ? ' feat' : ''}" style="--pc:${col}">
  ${it.feat ? '<span class="shfeat">★ Destacado</span>' : ''}
  <button type="button" class="shpv" data-a="shopview" data-id="${it.id}" aria-label="Ver ${esc(r.name || P[0])}">${rIcon(r)}</button>
  <div class="shtx"><b>${esc(r.name || P[0])}</b><span class="subtle">${P[1]} ${esc(P[0])} · <span style="color:${col}">${esc(rwRar(r))}</span></span>${r.desc ? `<p>${esc(r.desc)}</p>` : ''}</div>
  <div class="shtags">${tags}</div>
  <div class="shbot"><span class="shpr">${RQI} ${+it.price || 0}</span>${A ? `<span class="mg"><button class="btn small secondary" data-a="shopedit" data-id="${it.id}">Editar</button><button class="btn small ghost" data-a="shopdel" data-id="${it.id}" title="Quitar">✕</button></span>`
    : `<button class="btn small${st === 'buy' ? '' : ' secondary'}" ${st === 'buy' ? `data-a="shopbuy" data-id="${it.id}"` : st === 'login' ? 'data-a="ulogin"' : st === 'mine' ? `data-a="shopview" data-id="${it.id}"` : 'disabled'}>${lb}</button>`}</div></article>`;
}

function tienda() {
  if (!shopVis()) return empty('🔒 La tienda todavía no abre. ¡Pronto!');
  const sh = SHOP(), p = myP(), f = S.shopf || '';
  const all = sh.items.filter(it => A || shopOpen(it) || (p && shopMine(p.id, it)));
  const types = [...new Set(all.map(it => (it.rw || {}).type).filter(Boolean))];
  const L = all.filter(it => !f || (it.rw || {}).type === f).sort((a, b) => (!!b.feat - !!a.feat) || (+a.price || 0) - (+b.price || 0));
  const bal = p ? `<div class="shbal"><span title="Reliquias disponibles">${RQI} <b>${rqBal(p)}</b> Reliquias</span><span title="Medallas de Sincronía: no se gastan, desbloquean objetos exclusivos">✦ <b>${syncOf(p)}</b> Sincronías</span></div>` : (A ? '' : '<p class="subtle">Inicia sesión para ver tus Reliquias y comprar.</p>');
  return `${A ? `<section class="panel pad shadm${sh.on ? ' on' : ''}"><div><b>${sh.on ? '🟢 Tienda abierta' : '🔒 Tienda oculta'}</b><span class="subtle">${sh.on ? 'Los jugadores la ven en el menú.' : 'Solo tú la ves. Actívala cuando esté lista.'}</span></div><div class="mg"><button class="btn small" data-a="shopnew">＋ Nuevo artículo</button><button class="btn small secondary" data-a="shopcfg">⚙ Ajustes</button><button class="btn small ${sh.on ? 'danger' : 'secondary'}" data-a="shopon">${sh.on ? 'Ocultar tienda' : 'Abrir tienda'}</button></div></section>` : ''}
  <section class="panel hero shhero"><div class="shhd"><div class="shic" aria-hidden="true">🛒</div><div><h2 class="big" style="margin:0">${esc(sh.t || 'Tienda Nexus')}</h2><p class="muted" style="margin:6px 0 0">${esc(sh.d || 'Cambia tus Reliquias por cosméticos para tu perfil. Algunos objetos exclusivos piden Medallas de Sincronía, que no se gastan.')}</p></div></div>${bal}</section>
  ${types.length > 1 ? `<div class="tabs mt">${[['', 'Todo'], ...types.map(k => [k, PT[k][1] + ' ' + PT[k][0]])].map(([k, t]) => `<button class="tab ${f === k ? 'active' : ''}" data-a="shopf" data-k="${k}">${esc(t)}</button>`).join('')}</div>` : ''}
  ${L.length ? `<div class="shgrid mt">${L.map(it => shopCard(it, p)).join('')}</div>` : empty(A ? 'Aún no hay artículos. Pulsa «＋ Nuevo artículo».' : 'Todavía no hay artículos a la venta.')}`;
}

// Formulario de artículo (usa el mismo formulario de recompensas del Núcleo)
function shopForm(it) {
  const sh = SHOP(), dt = ms => { if (!ms) return ''; const d = new Date(ms - new Date(ms).getTimezoneOffset() * 6e4); return d.toISOString().slice(0, 16) };
  act.evpz({
    cb: (n, o) => {
      const x = it || { id: 's' + uid(), at: Date.now() };
      Object.assign(x, { rw: n, price: Math.max(0, Math.round(+o.price || 0)), sync: Math.max(0, Math.round(+o.sync || 0)), stock: Math.max(0, Math.round(+o.stock || 0)), until: o.until ? (Date.parse(o.until) || 0) : 0, feat: o.feat === '1' });
      if (!it) sh.items.push(x);
      pend = (it ? 'Editó' : 'Agregó') + ' «' + (n.name || PT[n.type][0]) + '» en la tienda'; touch();
    },
    rw: it ? it.rw : null, types: shopTypes(), title: it ? 'Editar artículo de la tienda' : '🛒 Nuevo artículo de la tienda',
    pre: [['', 'Precio y condiciones', 'sec'], ['price', 'Precio en Reliquias', 'number', { min: 0 }], ['sync', 'Medallas de Sincronía necesarias (no se gastan; 0 = ninguna)', 'number', { min: 0 }], ['stock', 'Cupo total (0 = sin límite)', 'number', { min: 0 }], ['until', 'Disponible hasta (opcional)', 'dt'], ['feat', '¿Destacado?', 'select', [['0', 'No'], ['1', 'Sí, mostrarlo primero']]], ['', 'Qué se lleva el jugador', 'sec']],
    pv: { price: it ? it.price : 100, sync: it ? it.sync || 0 : 0, stock: it ? it.stock || 0 : 0, until: it ? dt(it.until) : '', feat: it && it.feat ? '1' : '0', ...(it ? {} : { rwt: 'marco' }) }
  });
}

// ---- acciones de esta sección ----
Object.assign(act, {
  shopf(e) { S.shopf = e.k || ''; render() },
  shopgo() { try { closeM(false) } catch (x) {} act.nav({ k: 'tienda' }) },
  shopnew() { if (A) shopForm(null) },
  shopedit(e) { const it = SHOP().items.find(x => x.id === e.id); if (A && it) shopForm(it) },
  shopdel(e) {
    const sh = SHOP(), it = sh.items.find(x => x.id === e.id); if (!it) return;
    const n = shopSold(it);
    if (!confirm(`¿Quitar «${it.rw.name || PT[it.rw.type][0]}» de la tienda?` + (n ? `\n\n${n} jugador(es) ya lo compraron: lo conservan solo si lo dejas en la tienda. Mejor ponle una fecha límite pasada para retirarlo.` : ''))) return;
    if (it.rw && it.rw.img) repoDel(it.rw.img); sh.items = sh.items.filter(x => x !== it); pend = 'Quitó un artículo de la tienda'; touch();
  },
  shopcfg() {
    const sh = SHOP();
    openForm('⚙ Ajustes de la tienda', [['t', 'Nombre de la tienda'], ['d', 'Descripción corta', 'area']], { t: sh.t || 'Tienda Nexus', d: sh.d || '' }, o => { sh.t = (o.t || '').trim().slice(0, 50) || 'Tienda Nexus'; sh.d = (o.d || '').trim().slice(0, 300); pend = 'Editó los ajustes de la tienda'; touch() });
  },
  shopon() {
    const sh = SHOP();
    if (!sh.on && !confirm('¿Abrir la tienda? Los jugadores la verán en el menú en cuanto publiques los cambios.')) return;
    sh.on = !sh.on; pend = sh.on ? 'Abrió la tienda' : 'Ocultó la tienda'; touch(); toast(sh.on ? 'Tienda abierta. Publica los cambios para que la vean.' : 'Tienda oculta.');
  },
  shopview(e) {
    const it = SHOP().items.find(x => x.id === e.id); if (!it) return; const p = myP(), [st, lb] = shopState(it, p);
    sheetOpen(`<div class="shsheet" style="--pc:${lcol(rwRar(it.rw))}"><div class="rwpv">${rwBig(it.rw)}</div>${it.rw.desc ? `<p>${esc(it.rw.desc)}</p>` : ''}
     <div class="shbal" style="margin:10px 0"><span>${RQI} Precio: <b>${+it.price || 0}</b></span>${+it.sync > 0 ? `<span>✦ Requiere <b>${+it.sync}</b> Sincronías</span>` : ''}${p ? `<span class="subtle">Tienes ${rqBal(p)} 💎 · ${syncOf(p)} ✦</span>` : ''}</div>
     <div class="mg mt">${st === 'buy' && !A ? `<button class="btn" data-a="shopbuy" data-id="${it.id}">Comprar por ${+it.price || 0} 💎</button>` : `<span class="badge ${st === 'mine' ? 'cyan' : 'muted'}">${A ? 'Vista previa del admin' : lb}</span>`}<button class="btn ghost" data-a="advclose">Cerrar</button></div></div>`);
  },
  async shopbuy(e) {
    const it = SHOP().items.find(x => x.id === e.id), p = myP(); if (!it || !p || !U || U.pid !== p.id) return toast('Inicia sesión con tu cuenta para comprar.');
    const [st, lb] = shopState(it, p); if (st !== 'buy') return toast(lb);
    const pr = Math.max(0, +it.price || 0), nm = it.rw.name || PT[it.rw.type][0];
    if (!confirm(`¿Comprar «${nm}» por ${pr} Reliquias?\n\nTe quedarán ${rqBal(p) - pr}.`)) return;
    const rid = 'shop:' + it.id + ':' + pr, now = Date.now();
    PEND++; PASSC.push({ p: p.id, r: rid, at: now }); try { closeM(false) } catch (x) {} sfx('accept'); render();
    lootPlay([{ r: { ...it.rw, id: 'shop-' + it.id }, rar: rwRar(it.rw), src: 'Tienda' }], p);
    const j = await api({ action: 'passclaim', token: TOK(), rids: [rid] }); PEND--;
    if (j.ok) softSync(); else { PASSC = PASSC.filter(c => !(c.p === p.id && c.r === rid && c.at === now)); render(); apiErr(j, 8) }
  }
});
