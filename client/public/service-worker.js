self.addEventListener("install", () => {
  console.log("Service Worker instalado para AEDE-IA");
});

self.addEventListener("activate", () => {
  console.log("Service Worker activado para AEDE-IA");
});

self.addEventListener("fetch", (event) => {
  // Permite que las peticiones pasen normalmente
  event.respondWith(fetch(event.request));
});
