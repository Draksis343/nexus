// NEXUS ARENA · service worker (red primero; la copia guardada solo se usa sin conexión)
const CACHE = 'nexus-arena-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return; // Apps Script, GitHub API, etc. no se tocan
  const key = u.origin + u.pathname; // ignora ?t=... para no acumular copias
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(key, c)); }
      return res;
    }).catch(() => caches.match(key).then(m => m || (r.mode === 'navigate' ? caches.match(location.origin + u.pathname.replace(/[^/]*$/, '')) : undefined) || Response.error()))
  );
});
