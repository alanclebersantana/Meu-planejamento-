/* Planejar — service worker
   Troque a versão sempre que publicar uma alteração: isso avisa o app
   e limpa o cache antigo automaticamente. */
const VERSAO = 'planejar-v1.0.0';
const CASCA = VERSAO + '-casca';
const EXTERNO = VERSAO + '-externo';

const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

/* Fontes e bibliotecas usadas pelo app. Guardadas na primeira vez que
   aparecem, para o PDF e as letras continuarem funcionando sem internet. */
const DOMINIOS_EXTERNOS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com'
];

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CASCA)
      .then(c => c.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(
        nomes.filter(n => !n.startsWith(VERSAO)).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', ev => {
  if (ev.data === 'atualizar-agora') self.skipWaiting();
});

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Abrir o app: tenta a rede, mas nunca fica na tela de erro.
  if (req.mode === 'navigate') {
    ev.respondWith(
      fetch(req)
        .then(res => {
          const copia = res.clone();
          caches.open(CASCA).then(c => c.put('./index.html', copia));
          return res;
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Arquivos do próprio app: cache primeiro, atualiza por baixo.
  if (url.origin === location.origin) {
    ev.respondWith(
      caches.match(req).then(guardado => {
        const rede = fetch(req).then(res => {
          if (res && res.status === 200) {
            const copia = res.clone();
            caches.open(CASCA).then(c => c.put(req, copia));
          }
          return res;
        }).catch(() => guardado);
        return guardado || rede;
      })
    );
    return;
  }

  // Letras e bibliotecas: guarda na primeira visita.
  if (DOMINIOS_EXTERNOS.indexOf(url.hostname) >= 0) {
    ev.respondWith(
      caches.match(req).then(guardado => guardado || fetch(req).then(res => {
        const copia = res.clone();
        caches.open(EXTERNO).then(c => c.put(req, copia));
        return res;
      }).catch(() => guardado))
    );
  }
});
