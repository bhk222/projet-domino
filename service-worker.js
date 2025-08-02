
const CACHE_NAME = 'domino-calculator-cache-v3'; // Version incrémentée pour la mise à jour
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/components/ChaoticNames.tsx',
  '/components/GameBoard.tsx',
  '/components/Header.tsx',
  '/components/PenaltyDisplay.tsx',
  '/components/PlayerSetup.tsx',
  '/components/ScoreInputModal.tsx',
  '/components/WinnerDisplay.tsx',
  '/components/GameHistory.tsx',
  '/components/Fireworks.tsx',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap',
  'https://fonts.gstatic.com/s/tajawal/v9/Iura6YBj_oCad4k1nzSBC45I-VwA.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Ajoute toutes les URL, mais ne fait pas échouer toute l'installation si l'une échoue
        const promises = urlsToCache.map(url => {
            // S'assurer d'obtenir les fichiers les plus récents du réseau, pas du cache HTTP du navigateur
            const request = new Request(url, {cache: 'reload'});
            return cache.add(request).catch(err => {
                console.warn(`Failed to cache ${url}:`, err);
            });
        });
        return Promise.all(promises);
      })
      .then(() => self.skipWaiting()) // Force l'activation du nouveau service worker
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend le contrôle de toutes les pages
  );
});

self.addEventListener('fetch', event => {
  // Nous ne voulons gérer que les requêtes GET.
  if (event.request.method !== 'GET') {
    return;
  }

  // Stratégie Stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Si nous avons une réponse valide, la mettre en cache.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(error => {
            // La récupération a échoué, probablement hors ligne.
            console.warn('Fetch failed; using cache if available.', error);
            // S'il s'agit d'une requête de navigation et que nous n'avons pas de réponse en cache, afficher la page racine hors ligne.
            if(event.request.mode === 'navigate' && !response) {
                return caches.match('/');
            }
        });

        // Retourner la réponse en cache si elle existe, sinon attendre le réseau.
        return response || fetchPromise;
      });
    })
  );
});
