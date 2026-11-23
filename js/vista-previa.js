// =====================================================================
//  VISTA PREVIA DE RECOMPENSAS
//  En los formularios donde se elige una recompensa (pase, logros,
//  Núcleo del evento y calendario de adviento) agrega:
//   1. Una vista previa grande que cambia mientras eliges.
//   2. Una galería con miniaturas debajo de cada lista desplegable
//      (marcos, márgenes, efectos, fondos, colores, animaciones y piezas
//      de avatar) para ver cuál es cuál sin tener que adivinar.
//  Se activa con rwPicker(form) al final de cada formulario.
// =====================================================================

// Miniatura de un cosmético. t = tipo, v = valor, o = extras {c, a, e(emoji)}
function rwThumb(t, v, o) {
  o = o || {};
  const ini = esc(((U && U.nombre) || 'N')[0] || 'N').toUpperCase();
  if (t === 'marco') return `<div class="avatar fr-${esc(v || 'neon')}">${ini}</div>`;
  if (t === 'borde') return `<div class="bdp${v ? ' bd-' + esc(v) : ''}"></div>`;
  if (t === 'color') return nmSpan(v || '#ffffff', 'Aa', "font:700 24px 'Space Mono',monospace;");
  if (t === 'efecto') return pfxCv(v, o.c || '', '', 'width:72px;height:48px;border-radius:8px;background:#0006');
  if (t === 'fondo') return FBG.some(x => x[0] === v) ? `<div class="fbp bg-${esc(v)}" style="width:72px;height:48px"></div>` : '<span class="rwpv-e">🌄</span>';
  if (t === 'emblema') return `<span class="emb ${o.a ? 'ea-' + esc(o.a) : ''}" style="margin:0;font-size:24px">${esc(String(o.e || v || '✦').slice(0, 4))}</span>`;
  if (t === 'avatar') return rIcon({ type: 'avatar', v });
  return rIcon({ type: t, v });
}

// Lee el formulario y arma la recompensa tal como se guardaría
function rwRead(f, t) {
  const g = n => { const x = f.querySelector('[name="' + n + '"]'); return x ? x.value : '' };
  const r = { type: t, name: g('rwname').trim() || g('name').trim(), v: '' };
  if (t === 'reliquias') r.v = Math.max(1, Math.round(+g('vrq') || 0));
  else if (t === 'marco') r.v = g('vfr');
  else if (t === 'borde') r.v = g('vbd');
  else if (t === 'efecto') { r.v = g('vef'); r.c = g('vfcm') === 'c' ? g('vfcol') : '' }
  else if (t === 'color') { const m = g('vcm'); r.v = m && m !== 'solido' ? m : g('vcol') }
  else if (t === 'emblema') { r.v = [...g('vemb').trim()].slice(0, 2).join('') || '✦'; r.a = g('vea') }
  else if (t === 'fondo') r.v = g('vfb');
  else if (t === 'avatar') r.v = g('vav');
  return r;
}

// Vista previa grande
function rwBig(r) {
  if (!r.type || !PT[r.type]) return '<div class="rwpv-empty">Sin recompensa</div>';
  const P = PT[r.type], nm = r.name || P[0];
  let body;
  if (['marco', 'borde', 'color', 'efecto', 'fondo', 'emblema'].includes(r.type)) {
    // Mini perfil con el cosmético puesto
    const ini = esc(((U && U.nombre) || 'N')[0] || 'N').toUpperCase(), who = esc((U && U.nombre) || 'Jugador');
    const bg = r.type === 'fondo' && FBG.some(x => x[0] === r.v) ? `<div class="fbp bg-${esc(r.v)} rwpv-bg"></div>` : '';
    const fx = r.type === 'efecto' ? pfxCv(r.v, r.c || '', '', 'position:absolute;inset:0;width:100%;height:100%') : '';
    const name = r.type === 'color' ? nmSpan(r.v || '#ffffff', who, 'font-weight:800;font-size:17px;') : `<b style="font-size:17px">${who}</b>`;
    const emb = r.type === 'emblema' ? `<span class="emb ${r.a ? 'ea-' + esc(r.a) : ''}">${esc(String(r.v).slice(0, 4))}</span>` : '';
    body = `<div class="rwpv-prof${r.type === 'borde' && r.v ? ' bd-' + esc(r.v) : ''}">${bg}${fx}<div class="rwpv-in"><div class="avatar${r.type === 'marco' ? ' fr-' + esc(r.v || 'neon') : ''}">${ini}</div><div>${name}${emb}<small>Así se vería en tu perfil</small></div></div></div>`;
  } else body = `<div class="rwpv-ic">${rIcon(r)}</div>`;
  return `${body}<div class="rwpv-tx"><b>${esc(nm)}</b><span>${P[1]} ${esc(P[0])}${r.type === 'reliquias' ? ' · ' + (+r.v || 0) : ''}</span></div>`;
}

// Campos que llevan galería y cómo se dibuja cada opción
const RWGAL = {
  vfr: k => rwThumb('marco', k),
  vbd: k => rwThumb('borde', k),
  vef: k => rwThumb('efecto', k),
  vfb: k => k ? rwThumb('fondo', k) : '<span class="rwpv-e">🖼</span>',
  vav: k => rwThumb('avatar', k),
  vcm: k => k === 'solido' ? '<span class="rwpv-e">🎨</span>' : rwThumb('color', k),
  vea: (k, f) => rwThumb('emblema', '', { a: k, e: ((f.querySelector('[name=vemb]') || {}).value || '✦') })
};

function rwPicker(f) {
  f = f || $('#mform'); if (!f || f.querySelector('.rwpv')) return;
  const typeOf = () => { const s = f.querySelector('[name=rwt]'); if (s) return s.value; const r = f.querySelector('[name=type]:checked'); return r ? r.value : '' };
  // 1) vista previa grande, justo después del selector de tipo
  const tEl = f.querySelector('[name=rwt]') || f.querySelector('[name=type]');
  if (!tEl) return;
  const box = document.createElement('div'); box.className = 'rwpv'; box.setAttribute('aria-live', 'polite');
  const anchor = tEl.closest('[data-grp]') || tEl.closest('label') || tEl.parentElement;
  anchor.after(box);
  // 2) galerías bajo cada lista
  Object.keys(RWGAL).forEach(n => {
    const s = f.querySelector('select[name="' + n + '"]'); if (!s) return;
    const g = document.createElement('div'); g.className = 'rwgal'; g.dataset.for = n;
    g.innerHTML = [...s.options].map(o => `<button type="button" class="rwgo" data-v="${esc(o.value)}" title="${esc(o.text)}"><span class="rwgp">${RWGAL[n](o.value, f)}</span><small>${esc(o.text)}</small></button>`).join('');
    g.addEventListener('click', ev => { const b = ev.target.closest('.rwgo'); if (!b) return; ev.preventDefault(); s.value = b.dataset.v; s.dispatchEvent(new Event('change', { bubbles: true })); mark() });
    (s.closest('label') || s.parentElement).appendChild(g);
  });
  const mark = () => f.querySelectorAll('.rwgal').forEach(g => { const s = f.querySelector('select[name="' + g.dataset.for + '"]'); g.querySelectorAll('.rwgo').forEach(b => b.classList.toggle('on', !!s && b.dataset.v === s.value)) });
  let tm = 0;
  const upd = () => {
    clearTimeout(tm);
    tm = setTimeout(() => {
      const t = typeOf();
      box.style.display = t ? '' : 'none';
      box.innerHTML = rwBig(rwRead(f, t));
      // las animaciones del emblema siguen el emoji escrito
      const ge = f.querySelector('.rwgal[data-for=vea]');
      if (ge) ge.querySelectorAll('.rwgo').forEach(b => b.querySelector('.rwgp').innerHTML = RWGAL.vea(b.dataset.v, f));
      mark();
    }, 40);
  };
  f.addEventListener('change', upd); f.addEventListener('input', upd); upd();
}
