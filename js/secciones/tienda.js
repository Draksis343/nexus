// =====================================================================
//  TIENDA NEXUS
//
//  Datos (en data.json):
//    D.shop = { on: false,                 // visible para los jugadores
//               t: 'Tienda de Reliquias',          // nombre
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
const SHOP = () => { D.shop = D.shop || { on: false, t: 'Tienda de Reliquias', d: '', items: [] }; D.shop.items = D.shop.items || []; return D.shop };
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
const shopNew = it => (it.at || 0) > Date.now() - 7 * 864e5;
const shopLim = it => +it.stock > 0 || !!it.until;
const shopSale = it => +it.old > +it.price;

// Categorías del menú lateral (tipo, nombre, ícono)
const SHCAT = [['marco', 'Marcos', '🖼'], ['borde', 'Márgenes', '▣'], ['efecto', 'Efectos', '✨'], ['color', 'Colores', '🎨'], ['emblema', 'Emblemas', '✦'], ['titulo', 'Títulos', '🏷'], ['fondo', 'Fondos', '🌄'], ['avatar', 'Avatar', '🤖'], ['objeto', 'Objetos', '🎟'], ['descarga', 'Descargas', '⬇'], ['tarjeta', 'Tarjetas', '🪪'], ['trofeo', 'Trofeos', '🏆']];
const SHTAB = [['', 'Todo'], ['nuevos', 'Nuevos'], ['limitados', 'Limitados'], ['ofertas', 'Ofertas'], ['obtenidos', 'Obtenidos']];

function shopArt(r) {
  if (r.type === 'titulo') return `<span class="shtit">${esc(r.name || 'Título')}</span>`;
  return rIcon(r);
}

function shopCard(it, p) {
  const r = it.rw || {}, P = PT[r.type] || PT.objeto, [st, lb] = shopState(it, p), rar = rwRar(r), col = lcol(rar), left = shopLeft(it);
  const badge = st === 'mine' ? ['OBTENIDO', 'own'] : left <= 0 ? ['AGOTADO', 'off'] : shopSale(it) ? ['-' + Math.round(100 - 100 * (+it.price || 0) / (+it.old)) + '%', 'sale'] : +it.stock === 1 ? ['ÚNICO', 'one'] : shopLim(it) ? ['LIMITADO', 'lim'] : shopNew(it) ? ['NUEVO', 'new'] : null;
  const info = [left !== Infinity && left > 0 ? `Quedan ${left} de ${+it.stock}` : '', it.until && shopOpen(it) ? '⏳ Hasta ' + shopUntil(it.until) : '', +it.sync > 0 ? `✦ Requiere ${+it.sync} Sincronías` : ''].filter(Boolean);
  const pr = `<span class="shp-dia">💎</span> ${+it.price || 0}${shopSale(it) ? ` <s>${+it.old}</s>` : ''}`;
  const btn = A ? `<button type="button" class="shbuy" data-a="shopedit" data-id="${it.id}">${pr}<span class="shp-ed">✎ Editar</span></button>`
    : st === 'buy' ? `<button type="button" class="shbuy" data-a="shopbuy" data-id="${it.id}">${pr}</button>`
    : st === 'mine' ? `<button type="button" class="shbuy own" data-a="shopview" data-id="${it.id}">✔ Ya es tuyo</button>`
    : st === 'login' ? `<button type="button" class="shbuy" data-a="ulogin">${pr}</button>`
    : `<button type="button" class="shbuy no" disabled title="${esc(lb)}">${st === 'off' ? esc(lb) : pr}</button>`;
  return `<article class="shc st-${st}" style="--pc:${col}">
  <div class="shc-top"><span class="shrar">${esc(rar)}</span>${badge ? `<span class="shbdg ${badge[1]}">${badge[0]}</span>` : ''}</div>
  <button type="button" class="shpv" data-a="shopview" data-id="${it.id}" aria-label="Ver ${esc(r.name || P[0])}">${shopArt(r)}</button>
  <div class="shtx"><b>${esc(r.name || P[0])}</b><span>${esc(P[0])}</span>${info.map(t => `<em>${esc(t)}</em>`).join('')}</div>
  ${st === 'lock' && !A ? `<small class="shneed">${esc(lb)}</small>` : ''}
  ${btn}
  ${A ? `<button type="button" class="shdel" data-a="shopdel" data-id="${it.id}" title="Quitar de la tienda" aria-label="Quitar">✕</button>` : ''}</article>`;
}

function tienda() {
  if (!shopVis()) return empty('🔒 La tienda todavía no abre. ¡Pronto!');
  const sh = SHOP(), p = myP(), cat = S.shopc == null ? 'dest' : S.shopc, tab = S.shopt || '';
  if (A && !sh.items.length && !sh.seeded) setTimeout(() => act.shopseed({ auto: 1 }), 0);
  const all = sh.items.filter(it => A || shopOpen(it) || (p && shopMine(p.id, it)));
  const feat = all.filter(it => it.feat);
  const cats = SHCAT.filter(c => all.some(it => (it.rw || {}).type === c[0]));
  const cur = cat === 'dest' && !feat.length ? '' : cat;
  let L = all.filter(it => cur === 'dest' ? it.feat : !cur || (it.rw || {}).type === cur);
  if (tab === 'nuevos') L = L.filter(shopNew); else if (tab === 'limitados') L = L.filter(shopLim); else if (tab === 'ofertas') L = L.filter(shopSale); else if (tab === 'obtenidos') L = L.filter(it => p && shopMine(p.id, it));
  L.sort((a, b) => (!!b.feat - !!a.feat) || RARORD.indexOf(rwRar(a.rw || {})) - RARORD.indexOf(rwRar(b.rw || {})) || (+a.price || 0) - (+b.price || 0));
  const own = p ? sh.items.filter(it => shopMine(p.id, it)).length : 0;
  const side = [...(feat.length ? [['dest', 'Destacados', '⭐']] : []), ['', 'Todo', '◆'], ...cats].map(([k, t, ic]) => `<button type="button" class="shcat${cur === k ? ' on' : ''}" data-a="shopc" data-k="${k}"><span class="shci">${ic}</span>${esc(t)}<i>${k === 'dest' ? feat.length : k ? all.filter(it => (it.rw || {}).type === k).length : all.length}</i></button>`).join('');
  const PER = 24, pg = Math.min(S.shopn || 1, Math.max(1, Math.ceil(L.length / PER))), shown = L.slice(0, pg * PER);
  return `${A ? `<section class="panel pad shadm${sh.on ? ' on' : ''}"><div><b>${sh.on ? '🟢 Tienda abierta' : '🔒 Tienda oculta'}</b><span class="subtle">${sh.on ? 'Los jugadores la ven en el menú.' : 'Solo tú la ves. Ábrela cuando esté lista.'} · ${sh.items.length} artículos</span></div><div class="mg"><button class="btn small" data-a="shopnew">＋ Nuevo artículo</button><button class="btn small secondary" data-a="shopseed">📦 Agregar catálogo</button><button class="btn small secondary" data-a="shopcfg">⚙ Ajustes</button><button class="btn small ${sh.on ? 'danger' : 'secondary'}" data-a="shopon">${sh.on ? 'Ocultar tienda' : 'Abrir tienda'}</button></div></section>` : ''}
  <section class="shop">
   <header class="shop-hd"><div><h2>${esc(sh.t || 'Tienda de Reliquias')}</h2>${sh.d ? `<p>${esc(sh.d)}</p>` : ''}</div>
    <div class="shop-pills">${p ? `<span class="shpill" title="Reliquias disponibles">${RQI} <b>${rqBal(p)}</b><button type="button" class="shplus" data-a="shopinfo" aria-label="Cómo conseguir Reliquias">+</button></span><span class="shpill" title="Medallas de Sincronía (no se gastan)">✦ <b>${syncOf(p)}</b></span><span class="shpill">🎒 <b>${own}</b> obtenidos</span>` : A ? '' : '<span class="shpill">Inicia sesión para comprar</span>'}</div></header>
   <div class="shop-body">
    <nav class="shop-side" aria-label="Categorías">${side}</nav>
    <div class="shop-main">
     <div class="shtabs" role="tablist">${SHTAB.map(([k, t]) => `<button type="button" role="tab" class="${tab === k ? 'on' : ''}" aria-selected="${tab === k}" data-a="shopt" data-k="${k}">${t}</button>`).join('')}</div>
     ${shown.length ? `<div class="shgrid">${shown.map(it => shopCard(it, p)).join('')}</div>${L.length > shown.length ? `<button class="btn secondary shmore" data-a="shopmore">Ver más (${L.length - shown.length})</button>` : ''}` : `<div class="shempty">${A && !sh.items.length ? 'Aún no hay artículos. Pulsa «📦 Agregar catálogo» o «＋ Nuevo artículo».' : tab === 'obtenidos' ? 'Todavía no has comprado nada aquí.' : 'No hay artículos en esta vista.'}</div>`}
    </div></div></section>`;
}

// ---- Catálogo completo (el admin quita después los exclusivos) ----
const SHRAR = { Nexus: 180, 'Épica': 100, Rara: 60, 'Común': 30, Reliquia: 250, Atemporal: 150 };
function shopCatalog() {
  const L = [], NX = /^(corona|gloria|alas|leyenda|fenix|portal|galaxia|tplasma|ano2027|fuegos|aurorab|fx:arcoiris|fx:galaxia|vortice)$/, EP = /^(solar|arcoiris|plasma|orbita|strike|laurel|marquesina|glitch|prisma|tormenta|holo|energia|synth|matrix|aurora|fuego|fx:oro|fx:fuego|fx:hielo|fx:plasma|fx:holo|fx:glitch|fx:arcade|orbes|ondas|rayos|confeti|trineo)$/;
  const rar = (v, i) => NX.test(v) ? 'Nexus' : EP.test(v) ? 'Épica' : i < 6 ? 'Común' : 'Rara';
  const add = (type, v, name, r, x) => L.push({ type, v, name, rar: r, ...(x || {}) });
  FRAMES.forEach(([v, n], i) => add('marco', v, 'Marco ' + n.replace(/\s*\(.*\)/, ''), rar(v, i)));
  BORD.forEach(([v, n], i) => add('borde', v, 'Margen ' + n.replace(/\s*\(.*\)/, ''), rar(v, i)));
  EFX.forEach(([v, n], i) => add('efecto', v, n.replace(/\s*[✨]$/, ''), rar(v, i)));
  [['#ff7772', 'Rojo'], ['#73dbe4', 'Cian'], ['#ffc266', 'Ámbar'], ['#b57bff', 'Morado'], ['#86e3a6', 'Verde'], ['#ff9ad5', 'Rosa'], ['degradado', 'Degradado del tema']].forEach(([v, n]) => add('color', v, 'Nombre ' + n.toLowerCase(), v === 'degradado' ? 'Rara' : 'Común'));
  NMC.forEach(([v, n]) => add('color', v, 'Nombre ' + n.toLowerCase(), NX.test(v) ? 'Nexus' : EP.test(v) ? 'Épica' : 'Rara'));
  [['⚡', 'Rayo', ''], ['🔥', 'Flama', 'latido'], ['❄', 'Copo', 'giro'], ['🌙', 'Luna', ''], ['⭐', 'Estrella', 'brillo'], ['👑', 'Corona', 'brillo'], ['🎮', 'Control', ''], ['🐉', 'Dragón', 'flotar'], ['🦊', 'Zorro', ''], ['💀', 'Calavera', 'latido'], ['🍀', 'Trébol', 'giro'], ['🎯', 'Diana', ''], ['🛡', 'Escudo', ''], ['☄', 'Cometa', 'flotar'], ['🕹', 'Arcade', ''], ['👾', 'Invasor', 'flotar']].forEach(([v, n, a], i) => add('emblema', v, 'Emblema ' + n, i < 8 ? 'Común' : 'Rara', { a }));
  [['Coleccionista de Reliquias', 'Épica'], ['Cazador de logros', 'Rara'], ['Leyenda retro', 'Épica'], ['Maestro del pixel', 'Rara'], ['Sin miedo al jefe final', 'Rara'], ['Speedrunner', 'Rara'], ['Completista', 'Épica'], ['Rey del arcade', 'Nexus']].forEach(([n, r]) => add('titulo', '', n, r));
  FBG.forEach(([v, n], i) => add('fondo', v, 'Fondo ' + n.toLowerCase(), rar(v, i)));
  RB.XMAS.forEach(([v, n]) => add('avatar', v, n, 'Épica'));
  return L;
}

// Formulario de artículo (usa el mismo formulario de recompensas del Núcleo)
function shopForm(it) {
  const sh = SHOP(), dt = ms => { if (!ms) return ''; const d = new Date(ms - new Date(ms).getTimezoneOffset() * 6e4); return d.toISOString().slice(0, 16) };
  act.evpz({
    cb: (n, o) => {
      const x = it || { id: 's' + uid(), at: Date.now() };
      Object.assign(x, { rw: n, price: Math.max(0, Math.round(+o.price || 0)), old: Math.max(0, Math.round(+o.old || 0)), sync: Math.max(0, Math.round(+o.sync || 0)), stock: Math.max(0, Math.round(+o.stock || 0)), until: o.until ? (Date.parse(o.until) || 0) : 0, feat: o.feat === '1' });
      if (!it) sh.items.push(x);
      pend = (it ? 'Editó' : 'Agregó') + ' «' + (n.name || PT[n.type][0]) + '» en la tienda'; touch();
    },
    rw: it ? it.rw : null, types: shopTypes(), title: it ? 'Editar artículo de la tienda' : '🛒 Nuevo artículo de la tienda',
    pre: [['', 'Precio y condiciones', 'sec'], ['price', 'Precio en Reliquias', 'number', { min: 0 }], ['old', 'Precio anterior, para mostrarlo en oferta (0 = sin oferta)', 'number', { min: 0 }], ['sync', 'Medallas de Sincronía necesarias (no se gastan; 0 = ninguna)', 'number', { min: 0 }], ['stock', 'Cupo total (0 = sin límite)', 'number', { min: 0 }], ['until', 'Disponible hasta (opcional)', 'dt'], ['feat', '¿Destacado?', 'select', [['0', 'No'], ['1', 'Sí, mostrarlo primero']]], ['', 'Qué se lleva el jugador', 'sec']],
    pv: { price: it ? it.price : 100, old: it ? it.old || 0 : 0, sync: it ? it.sync || 0 : 0, stock: it ? it.stock || 0 : 0, until: it ? dt(it.until) : '', feat: it && it.feat ? '1' : '0', ...(it ? {} : { rwt: 'marco' }) }
  });
}

// ---- acciones de esta sección ----
Object.assign(act, {
  shopc(e) { S.shopc = e.k || ''; S.shopn = 1; render() },
  shopt(e) { S.shopt = e.k || ''; S.shopn = 1; render() },
  shopmore() { S.shopn = (S.shopn || 1) + 1; render() },
  shopinfo() { const p = myP(); if (p) act.rqjoke({ id: p.id }) },
  shopseed(e) {
    if (!A) return; const auto = e && e.auto; SHOP().seeded = true; const sh = SHOP(), have = new Set(sh.items.map(it => (it.rw || {}).type + ':' + ((it.rw || {}).type === 'titulo' ? (it.rw || {}).name : (it.rw || {}).v)));
    const C = shopCatalog().filter(c => !have.has(c.type + ':' + (c.type === 'titulo' ? c.name : c.v)));
    if (!C.length) return toast('El catálogo completo ya está en la tienda.');
    if (!auto && !confirm(`¿Agregar ${C.length} artículos a la tienda? Son todos los marcos, márgenes, efectos, colores, emblemas, títulos, fondos y piezas de avatar. Después puedes quitar los que sean exclusivos.`)) return;
    const now = Date.now();
    C.forEach((c, i) => sh.items.push({ id: 's' + uid() + i, at: now - 8 * 864e5, rw: { id: 'z' + uid() + i, type: c.type, v: c.v, name: c.name, desc: '', rar: c.rar, a: c.a || '', c: '' }, price: SHRAR[c.rar] || 60, sync: 0, stock: 0, until: 0, feat: false }));
    pend = 'Agregó el catálogo completo a la tienda'; touch(); toast(C.length + ' artículos agregados. Publica los cambios cuando termines.');
  },
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
    openForm('⚙ Ajustes de la tienda', [['t', 'Nombre de la tienda'], ['d', 'Descripción corta', 'area']], { t: sh.t || 'Tienda de Reliquias', d: sh.d || '' }, o => { sh.t = (o.t || '').trim().slice(0, 50) || 'Tienda de Reliquias'; sh.d = (o.d || '').trim().slice(0, 300); pend = 'Editó los ajustes de la tienda'; touch() });
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
