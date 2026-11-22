// NEXUS ARENA · service worker (red primero; la copia guardada solo se usa sin conexión)
// NEXUS ARENA · service worker (red primero; la copia guardada solo se usa sin conexión) + avisos push (Firebase)
try {
  importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
  firebase.initializeApp({
    apiKey: 'AIzaSyBcgB4xvrxn1IBhzISZyhWBSUpLlEgcF78',
    authDomain: 'nexus-arena-d00df.firebaseapp.com',
    projectId: 'nexus-arena-d00df',
    storageBucket: 'nexus-arena-d00df.firebasestorage.app',
    messagingSenderId: '309278324482',
    appId: '1:309278324482:web:c02726bd9f5c22d934f41b'
  });
  firebase.messaging(); // muestra los avisos recibidos con la app cerrada
} catch (e) { /* sin conexión al instalar: la app sigue funcionando, solo sin avisos hasta la próxima actualización */ }

const CACHE = 'nexus-arena-v3';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  const key = u.origin + u.pathname;
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(key, c)); }
      return res;
    }).catch(() => caches.match(key).then(m => m || (r.mode === 'navigate' ? caches.match(location.origin + u.pathname.replace(/[^/]*$/, '')) : undefined) || Response.error()))
  );
});
