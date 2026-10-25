const installButton = document.querySelector('#install-app');
const updateButton = document.querySelector('#update-app');
const pwaStatus = document.querySelector('#pwa-status');
let installPrompt;

function installed() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}
function installationHelp() {
  if (installed()) return 'Tu jardín ya está abierto como aplicación.';
  return 'Para instalarlo, abre el menú del navegador y busca «Instalar aplicación» o «Añadir a pantalla de inicio». En iPhone o iPad: Safari → Compartir → Añadir a pantalla de inicio.';
}
installButton.hidden = installed();
installButton.addEventListener('click', async () => {
  if (!installPrompt) { pwaStatus.textContent = installationHelp(); return; }
  try {
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    pwaStatus.textContent = outcome === 'accepted' ? 'Instalación solicitada. Tu navegador completará el proceso.' : 'Puedes instalar tu jardín cuando quieras.';
  } catch { pwaStatus.textContent = installationHelp(); }
  installPrompt = null;
});
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event; installButton.hidden = false;
});
window.addEventListener('appinstalled', () => {
  installButton.hidden = true; installPrompt = null; pwaStatus.textContent = 'Tu jardín está instalado. ♡';
});

if ('serviceWorker' in navigator && window.isSecureContext) {
  let refreshing = false;
  let applyingUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (applyingUpdate && !refreshing) { refreshing = true; location.reload(); }
  });
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      const offerUpdate = () => {
        if (!registration.waiting) return;
        updateButton.hidden = false;
        pwaStatus.textContent = 'Hay una nueva versión. Puedes actualizar cuando termines: la página se recargará y se borrarán el dibujo y la postal en curso. Las flores y películas guardadas se conservan.';
      };
      offerUpdate();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate();
        });
      });
      updateButton.onclick = () => {
        if (!registration.waiting) return;
        applyingUpdate = true;
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      };
      await navigator.serviceWorker.ready;
      if (updateButton.hidden) pwaStatus.textContent = 'Tu jardín está preparado para abrirse sin conexión en este dispositivo.';
    } catch {
      pwaStatus.textContent = 'Puedes disfrutar el jardín. No se pudo preparar el modo sin conexión; vuelve a abrirlo con internet para intentarlo otra vez.';
    }
  });
} else {
  pwaStatus.textContent = 'Para instalar y preparar el modo sin conexión, abre el jardín mediante HTTPS o localhost.';
}
