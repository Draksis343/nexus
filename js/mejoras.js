// =====================================================================
//  MEJORAS GENERALES (se carga al final, después de arranque.js)
//  - Enlaces directos por sección (#desafios, #jugadores/ID, ...) y
//    soporte para el botón «atrás» del navegador / celular.
//  - Al cambiar de sección la página vuelve arriba.
//  - Botón flotante «volver arriba».
//  - Accesibilidad: nombres para listas desplegables y elementos
//    decorativos ocultos a lectores de pantalla.
// =====================================================================

// ---- 1. Enlaces directos por sección --------------------------------
const NXR = {
  // secciones que se pueden abrir con un enlace (las de admin no)
  ok: k => k in PAGES && !['panel', 'registro', 'accs'].includes(k),
  // estado actual -> texto del enlace
  hash() {
    const p = S.page || 'inicio';
    if (p === 'desafios' && S.sel) return '#desafios/' + S.sel;
    if (p === 'jugadores' && S.psel) return '#jugadores/' + S.psel;
    if (p === 'evento' && S.ev) return '#evento/' + S.ev;
    return p === 'inicio' ? '#' : '#' + p;
  },
  // texto del enlace -> estado
  read(h) {
    const [k, id] = decodeURIComponent(String(h || '').replace(/^#\/?/, '')).split('/');
    if (!k || !NXR.ok(k)) return null;
    return { k, id: id || null };
  },
  apply(r) {
    S.page = r.k; S.sel = null; S.psel = null;
    if (r.k === 'evento') S.ev = r.id || null;
    if (r.k === 'desafios' && r.id) S.sel = r.id;
    if (r.k === 'jugadores') { S.psel = r.id || null; S.ptab = '' }
  },
  last: null,
  quiet: false
};

// Al entrar con un enlace (#rankings, #jugadores/abc ...) abre esa sección.
try { const r = NXR.read(location.hash); if (r) NXR.apply(r) } catch (e) {}

// Cada vez que se dibuja la página, el enlace del navegador se actualiza.
// Si cambió la sección, se guarda en el historial (para que «atrás» funcione)
// y la vista sube al inicio.
const nxRender0 = render;
render = function () {
  const before = NXR.last;
  nxRender0.apply(this, arguments);
  try {
    const h = NXR.hash(), pg = S.page;
    NXR.last = pg;
    if (NXR.quiet) return;
    const cur = location.hash || '#';
    if (h !== cur) {
      const url = h === '#' ? location.pathname + location.search : h;
      if (before && before !== pg) history.pushState(null, '', url);
      else history.replaceState(null, '', url);
    }
    if (before && before !== pg) window.scrollTo({ top: 0 });
  } catch (e) {}
};

window.addEventListener('popstate', () => {
  const r = NXR.read(location.hash) || { k: 'inicio' };
  NXR.apply(r);
  try { closeM(false) } catch (e) {}
  NXR.quiet = true;
  try { render() } finally { NXR.quiet = false }
  window.scrollTo({ top: 0 });
});

// Enlace directo a un jugador, para compartir.
const nxLink = (k, id) => location.href.split('#')[0].replace(/index\.html$/, '') + '#' + k + (id ? '/' + id : '');

// ---- 2. Botón «volver arriba» ---------------------------------------
(() => {
  const b = document.createElement('button');
  b.id = 'totop'; b.type = 'button'; b.title = 'Volver arriba';
  b.setAttribute('aria-label', 'Volver arriba'); b.textContent = '↑';
  b.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(b);
  let t = 0;
  const upd = () => { t = 0; b.classList.toggle('on', window.scrollY > 700) };
  window.addEventListener('scroll', () => { if (!t) t = requestAnimationFrame(upd) }, { passive: true });
})();

// ---- 3. Accesibilidad -----------------------------------------------
const nxA11y = () => {
  try {
    document.querySelectorAll('select:not([aria-label])').forEach(s => {
      const l = s.id && document.querySelector('label[for="' + s.id + '"]');
      if (l) return;
      const o = s.options[0];
      s.setAttribute('aria-label', (s.title || (o && o.text) || 'Opciones').trim());
    });
    ['#fx', '#pfx'].forEach(q => { const c = document.querySelector(q); if (c) c.setAttribute('aria-hidden', 'true') });
  } catch (e) {}
};
const nxRender1 = render;
render = function () { nxRender1.apply(this, arguments); nxA11y() };
nxA11y();
