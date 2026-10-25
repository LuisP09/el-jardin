const installButton = document.querySelector('#install-app');
const updateButton = document.querySelector('#update-app');
const pwaStatus = document.querySelector('#pwa-status');
const checkButton = document.querySelector('#check-update');
const quickUpdate = document.querySelector('#quick-update');
quickUpdate.onclick = () => document.querySelector('#open-install').click();
let installPrompt;
const localPreview = ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).has('preview');

function installed() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}
function installationHelp() {
  if (installed()) return 'Tu jardín ya está abierto como aplicación.';
  return 'En Android: abre el jardín en Chrome, toca el menú ⋮ y elige «Añadir a pantalla de inicio» → «Instalar». Según tu versión puede aparecer directamente «Instalar aplicación». En iPhone o iPad: Safari → Compartir → Añadir a pantalla de inicio.';
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
  event.preventDefault();
  if (localPreview || installed()) return;
  installPrompt = event; installButton.hidden = false;
});
window.addEventListener('appinstalled', () => {
  installButton.hidden = true; installPrompt = null; pwaStatus.textContent = 'Tu jardín está instalado. ♡';
});

if (localPreview) {
  installButton.hidden = true;
  pwaStatus.textContent = 'Vista previa local. Estos cambios todavía no están publicados.';
} else if ('serviceWorker' in navigator && window.isSecureContext) {
  let refreshing = false;
  let applyingUpdate = false;
  let controllerChanged = false;
  let hadController = !!navigator.serviceWorker.controller;
  let offerUpdate = () => {};
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if(!hadController){hadController=true;return;}
    if (applyingUpdate && !refreshing) { refreshing = true; location.reload(); }
    else if (!refreshing) { controllerChanged = true; offerUpdate(); }
  });
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', {updateViaCache:'none'});
      offerUpdate = () => {
        if (!registration.waiting && !controllerChanged) return;
        updateButton.hidden = false;
        quickUpdate.hidden = false;
        pwaStatus.textContent = 'Hay una nueva versión. Puedes actualizar cuando termines: la página se recargará y se borrarán el dibujo y la postal en curso. Tu paseo, flores y películas guardados se conservan.';
      };
      offerUpdate();
      const watchInstalling = () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate();
        });
      };
      registration.addEventListener('updatefound',watchInstalling);
      watchInstalling();
      updateButton.onclick = () => {
        if (!registration.waiting && !controllerChanged) return;
        window.dispatchEvent(new Event('garden-before-update'));
        applyingUpdate = true;
        updateButton.disabled = true;
        pwaStatus.textContent = 'Preparando la nueva versión de tu jardín…';
        if(controllerChanged){refreshing=true;location.reload();}
        else registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      };
      let lastCheck = -Infinity, checking = false;
      const check = async (manual=false) => {
        if(checking || (!manual && Date.now()-lastCheck<60000))return;
        checking=true;lastCheck=Date.now();checkButton.disabled=true;
        if(manual && updateButton.hidden)pwaStatus.textContent='Buscando una nueva versión…';
        try{
          await registration.update();offerUpdate();
          if(manual && updateButton.hidden)pwaStatus.textContent=registration.installing?'Descargando una nueva versión. Te avisaré cuando esté lista.':'No hay una actualización lista. Tu jardín está al día.';
        }catch{
          if(updateButton.hidden && manual)pwaStatus.textContent='No pude comprobar las novedades. Cuando tengas conexión, puedes intentarlo de nuevo; tu jardín sigue disponible.';
        }finally{checking=false;checkButton.disabled=false;}
      };
      checkButton.hidden=false;checkButton.onclick=()=>check(true);
      window.addEventListener('online',()=>check());
      window.addEventListener('focus',()=>check());
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
      window.setInterval(()=>{if(!document.hidden)check();},15*60*1000);
      check();
      await navigator.serviceWorker.ready;
      if (updateButton.hidden) pwaStatus.textContent = 'Tu jardín está preparado para abrirse sin conexión en este dispositivo.';
    } catch {
      pwaStatus.textContent = 'Puedes disfrutar el jardín. No se pudo preparar el modo sin conexión; vuelve a abrirlo con internet para intentarlo otra vez.';
    }
  });
} else {
  pwaStatus.textContent = 'Para instalar y preparar el modo sin conexión, abre el jardín mediante HTTPS o localhost.';
}
