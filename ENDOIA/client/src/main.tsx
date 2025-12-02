import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({
        immediate: true,
        onNeedRefresh() {
          console.log('[PWA] New version available, reloading...');
        },
        onOfflineReady() {
          console.log('[PWA] App ready to work offline');
        },
      });
    }).catch((error) => {
      console.error('[PWA] Service worker registration failed:', error);
    });
  });
}
