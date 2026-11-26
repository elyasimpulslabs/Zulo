/* Zulo Offline Speicher. Lädt nur Dateien von dieser Adresse, nichts von fremden Servern.
   Ziel: Die App startet und läuft komplett ohne Internet, auch Lohnabrechnung (PDF) und Foto Texterkennung. */
const CACHE="zulo-v49";
/* Bibliotheken ändern sich selten und sind groß. Eigener Speicher, der bei App Updates erhalten bleibt.
   Bei neuer Version einer Bibliothek diesen Namen hochzählen. */
const LIB_CACHE="zulo-lib-v1";
const SHELL=["./","index.html","manifest.webmanifest","news.json",
  "icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","icons/apple-touch-icon.png"];
const LIBS=["lib/pdf.min.mjs","lib/pdf.worker.min.mjs",
  "lib/ocr/ocr-worker.js","lib/ocr/deu.traineddata",
  "lib/ocr/tesseract-core-lstm.js","lib/ocr/tesseract-core-lstm.wasm",
  "lib/ocr/tesseract-core-simd-lstm.js","lib/ocr/tesseract-core-simd-lstm.wasm"];
/* So lange wartet die App beim Start auf das Netz, danach kommt der gespeicherte Stand */
const NET_TIMEOUT=3000;

/* Bibliotheken einzeln laden: fehlt eine, startet die App trotzdem offline */
async function cacheLibs(){
  const c=await caches.open(LIB_CACHE);
  await Promise.all(LIBS.map(async p=>{
    try{if(await c.match(p))return;const r=await fetch(p,{credentials:"omit"});if(r.ok)await c.put(p,r)}catch(e){}
  }));
}
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(p=>new Request(p,{cache:"reload"}))))
    .then(()=>cacheLibs()).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==LIB_CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()).then(()=>cacheLibs()));
});

function put(req,res){if(res&&res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c))}return res}
function fromCache(req){return caches.match(req,{ignoreSearch:true})}

/* Erst Netz, aber nicht ewig warten. Ohne Netz oder bei schlechtem Netz: gespeicherter Stand */
function networkFirst(e,fallback){
  return new Promise(resolve=>{
    let done=false;
    const finish=r=>{if(!done&&r){done=true;resolve(r)}};
    const net=fetch(e.request).then(r=>put(e.request,r));
    const cached=()=>fromCache(e.request).then(r=>r||(fallback&&caches.match(fallback)));
    const t=setTimeout(()=>cached().then(finish),NET_TIMEOUT);
    net.then(r=>{clearTimeout(t);if(r.ok)finish(r);else cached().then(c=>finish(c||r))})
      .catch(()=>{clearTimeout(t);cached().then(c=>finish(c||Response.error()))});
    /* Neuen Stand trotzdem speichern, auch wenn schon der alte gezeigt wurde */
    e.waitUntil(net.catch(()=>{}));
  });
}

self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;
  /* App und News: aktuell vom Netz, ohne Netz der letzte Stand */
  if(e.request.mode==="navigate"||u.pathname.endsWith("/index.html")){e.respondWith(networkFirst(e,"index.html"));return}
  if(u.pathname.endsWith("/news.json")){e.respondWith(networkFirst(e,null));return}
  /* Rest (Symbole, PDF Leser, Texterkennung): aus dem Speicher, sonst laden und merken */
  e.respondWith(fromCache(e.request).then(r=>r||fetch(e.request).then(r2=>put(e.request,r2))));
});
