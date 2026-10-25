# El jardín de Isis · PWA

Un regalo interactivo en español: un jardín nocturno, estrellas con mensajes, un lienzo libre y escenas animadas de naturaleza. Sin puntuación ni objetivos obligatorios.

## Abrirlo

Abre `index.html` en el navegador o ejecuta `python -m http.server 4173` y visita http://localhost:4173.

No necesita instalación, compilación ni claves. Las fuentes de Google son opcionales: hay fuentes de respaldo. Las flores se guardan en el navegador, si permite almacenamiento local; el lienzo es temporal. El sonido se activa únicamente al pulsar su botón.

## Publicarlo con GitHub Actions y GitHub Pages

1. Crea un repositorio de GitHub, por ejemplo `el-jardin`, vacío, sin README inicial. Con GitHub Free, utiliza un repositorio público para Pages.
2. Sube este proyecto completo a la rama `main`, incluyendo `.github/workflows/pages.yml`, `scripts/`, `tests/`, `icons/`, el manifiesto y el service worker. No subas `_site/`: se genera automáticamente.
3. En **Settings → Pages → Build and deployment → Source**, elige **GitHub Actions**.
4. En **Actions → Publicar el jardín en GitHub Pages → Run workflow**, ejecuta el flujo si el primer intento ocurrió antes de habilitar Pages. Los siguientes pushes a `main` publican automáticamente. Los pull requests solo ejecutan verificaciones.
5. El trabajo `deploy` mostrará la URL real de publicación: `https://luisp09.github.io/el-jardin/`.

Si usas GitHub CLI autenticado, puedes crear el repositorio y subirlo desde esta carpeta:

```powershell
gh repo create LuisP09/el-jardin --public --source . --remote origin --push
gh api --method POST repos/LuisP09/el-jardin/pages -f build_type=workflow
gh workflow run pages.yml
```

Si el repositorio ya existe, vincúlalo con `git remote add origin https://github.com/LuisP09/el-jardin.git` y ejecuta `git push -u origin main` (sin forzar si tiene contenido previo).

No necesitas tokens en los archivos ni secretos personalizados: el workflow usa los permisos de Pages y el token temporal de GitHub Actions. Publica únicamente los archivos de la app preparados en `_site/`.

Los archivos usan rutas relativas para funcionar también dentro de un repositorio de proyecto.

## Instalar y usar sin conexión

- Abre la URL HTTPS publicada, espera el mensaje «Tu jardín está preparado para abrirse sin conexión» y pulsa **Instalar mi jardín**. El aviso nativo depende del navegador; el botón también explica la instalación manual.
- En iPhone o iPad: abre en Safari → Compartir → Añadir a pantalla de inicio.
- La primera visita necesita internet. Después, las escenas, dibujos, postales y sonido sintetizado funcionan sin conexión. Las fuentes de Google son opcionales; sin internet se utilizan fuentes del dispositivo.
- El jardín y las películas se guardan localmente, sin cuenta ni sincronización. El dispositivo puede borrar los datos si se elimina su almacenamiento.
- Una versión nueva se descarga al visitar la app con conexión; pulsa **Actualizar jardín** cuando termines lo que estés haciendo. El dibujo y la postal en curso se reinician al recargar; los datos guardados permanecen.
- No compruebes la PWA abriendo `index.html` como archivo: usa HTTPS o `http://localhost:4173`. Algunas funciones de instalación dependen del navegador.

## Verificación local

Necesitas Node.js moderno (22 o posterior recomendado), sin dependencias npm:

```powershell
node --check app.js
node --check pwa.js
node --check sw.js
node --test tests/pwa.test.mjs
node scripts/build.mjs
python -m http.server 4173 --directory _site
```

Abre `http://localhost:4173`. Para probar una ruta equivalente a GitHub Pages, sirve la carpeta contenedora y entra a la carpeta del proyecto. Las pruebas automáticas cubren el caché sin conexión en raíz y subcarpeta, el aislamiento entre repositorios y la activación de actualizaciones. La compilación verifica el manifiesto, tamaños PNG y referencias locales, y genera una versión de caché según el contenido para cada despliegue.

Para comprobar en un dispositivo real: instala desde HTTPS, abre cada rincón, activa modo avión y vuelve a abrir la app. Comprueba además una actualización con un dibujo en curso: debe esperar al botón de actualizar.

Referencias: [GitHub Pages con workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [instalación de PWA en MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

## Personalizar el regalo

- Cambia la dedicatoria y los textos en `index.html`.
- Cambia los mensajes de las estrellas en `messages` y el mensaje final en `app.js`.
- Las escenas del cine son ilustraciones animadas, no videos ni películas alojadas.
- Ideas para la siguiente versión: sus flores favoritas, una constelación con sus iniciales y una selección de recuerdos elegidos por ustedes. Lo publicado en GitHub Pages será accesible a quienes tengan la URL; evita añadir recuerdos privados sin decidirlo juntos.

Una experiencia de descanso y creatividad, sin promesas de tratamiento. Incluye controles de sonido, movimiento reducido según las preferencias del dispositivo y cierre libre del ejercicio de respiración.

## Primera fase personalizada para Isis

- Girasoles y margaritas ilustrados, con selector al plantar y cambio libre entre día y noche.
- Sobres con tres notas iniciales y la dedicatoria «Besito en tu pollollo».
- Cinco estrellas que revelan el nombre ISIS y una dedicatoria al descubrirlas.
- Paseo con mariposa, hojas y luciérnaga, sin puntuación ni límites de tiempo.
- Editor de postales con flor, cielo y texto; exportación a PNG.
- Lista editable de películas con una razón para verlas juntos; almacenamiento local en ese navegador, sin sincronización.
- Modo sencillo con las opciones mirar, dibujar y leer una notita.

Los textos iniciales de las cartas están en `letters`, en `app.js`; son propuestas para personalizar. Las películas se añaden desde la propia interfaz. El jardín y las películas usan almacenamiento local; el dibujo y la postal se conservan solo mientras la página permanezca abierta.

## El jardín como juego

La pantalla principal ahora es un mundo ilustrado que se recorre con un personaje y cámara móvil. Luci, una luciérnaga, acompaña el paseo con sugerencias opcionales.

- Toca un rincón para caminar hasta él y abrir su actividad al llegar. Tocar el suelo mueve al personaje sin abrir actividades.
- En computadora: flechas o WASD para caminar; E para interactuar. En celular: cruceta o toques sobre el mundo.
- Sembrar, regar y ver florecer girasoles y margaritas son tres acciones sin esperas ni mantenimiento diario.
- El estanque invita a tocar el agua y explorar colores, texturas y sonidos a tu alrededor, siempre de forma opcional.
- El buzón, observatorio, taller y cine abren las actividades originales desde el mundo. Las postales, instalación y actualización están en «Mi mochila».
- La mochila permite elegir destinos y muestra recuerdos de las actividades realizadas. El paseo se guarda localmente con la clave `isis-game-v1`; no se envía a un servidor.
- Cambia entre día y noche, pausa el ambiente o abre «Necesito un momento tranquilo» cuando quieras. No hay enemigos, puntuación, cronómetros, rachas ni penalizaciones.

Comprueba la lógica de movimiento y la caché con `npm test`; prepara la PWA con `npm run build`. No se requieren paquetes ni instalación de dependencias.
