const C = 'prestavka-v3';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});
self.addEventListener('fetch', e => {
  // Síť má vždy přednost, cache je jen záloha pro offline režim.
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone(); // klonovat HNED, než se odpověď použije jinde
      caches.open(C).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
