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

## Revisión local: móvil, Luci y audio

Esta revisión incorpora el pulido de la interfaz móvil y el audio. La publicación utiliza el workflow de GitHub Actions del repositorio.

- Luci aparece en una franja plegable fuera del mapa. El mensaje completo se abre a petición; al iniciar un paseo se contrae. Los mensajes se anuncian de forma discreta a los lectores de pantalla.
- En móvil y horizontal, la cruceta y la acción tienen una zona propia fuera del mapa. Se respetan los bordes seguros del dispositivo y se usan alturas dinámicas de pantalla.
- La escena se limita a 30 actualizaciones por segundo, se detiene cuando la página está oculta y deja de reconstruir controles y medir el diseño en cada fotograma.
- El panel de sonido ofrece lluvia, arroyo y brisa sintetizados localmente. No usa archivos remotos, anuncios ni sonidos repentinos. Las texturas no son grabaciones de naturaleza.
- El sonido requiere activación manual. Permite ajustar el volumen, apagar, cambiar con transición y reanudar después de volver del segundo plano. Se guardan ambiente y volumen, sin reproducción automática al abrir.
- El medidor representa la señal generada, no el nivel físico del altavoz ni una medida en decibelios. La escucha final se debe revisar en un teléfono real.
- La selección es opcional y personal; no se atribuyen propiedades terapéuticas a una frecuencia. Referencias de diseño: [NHS inform sobre música y relajación](https://www.nhsinform.scot/healthy-living/mental-wellbeing/breathing-and-relaxation-exercises/distraction-techniques/) y [OMS sobre escucha segura](https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening).

Para revisar sin caché de PWA: ejecuta `npm run build`, sirve `_site/` localmente y abre `http://localhost:4176/?preview=1`. En ese modo local se omite registrar el service worker. Al publicar mediante HTTPS, el modo sin conexión sigue habilitado normalmente.

### Dispositivo principal: Android

La revisión se orienta a Chrome en Android. Se añadió `interactive-widget=resizes-content` para que el teclado de los formularios reduzca el espacio disponible y `viewport-fit=cover` para respetar los bordes seguros. La cruceta evita menús de pulsación larga; los campos en dispositivos táctiles usan texto de 16 px.

El sonido muestra su estado de pausa al volver de otra aplicación, requiere un toque para reanudar y puede reconstruir el motor si el navegador cierra su contexto de audio. La guía de instalación prioriza Chrome en Android. La publicación de esta revisión fue autorizada por el usuario.

Referencias: [teclado y viewport en Chrome Android](https://developer.chrome.com/blog/viewport-resize-behavior/), [instalar aplicaciones web en Android](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid).

Prueba pendiente en un Android real: salida por altavoz y audífonos; bloquear/desbloquear; cambiar de aplicación y reanudar; abrir el teclado en películas/postales; girar la pantalla; instalar desde HTTPS y abrir sin conexión. Las pruebas de escritorio y tamaños de pantalla no sustituyen estas comprobaciones del dispositivo.

## Jardinería y dirección visual

Los parterres abren una mesa de jardinería con ocho lugares independientes. Puedes elegir semillas de girasol o margarita, tocar un lugar libre y usar la regadera para pasar de semilla a brote y a flor. Los parterres admiten mezclas de flores; no hay monedas, esperas obligatorias, agua limitada ni marchitamiento.

El estado anterior migra conservando sus seis plantas y añade dos lugares libres por parterre. Se conserva la posición del personaje al llegar, soltar los controles o dejar la página. Luci acompaña al personaje y el mundo incorpora parterres de madera, senderos de piedra, árboles con gradientes y mariposas. Los efectos respetan movimiento reducido y la pausa del ambiente.

Archivos de esta mecánica: `gardening-core.js` (estado y migración), `gardening.js` (interacción y dibujos), `gardening.css` (mesa de jardinería y pulido visual). `npm test` comprueba además la migración, las etapas individuales y la recuperación de la posición.
La revisión usa `isis-game-v2`, leyendo `isis-game-v1` como punto de partida cuando no hay partida nueva. La copia antigua se conserva para que una pestaña de la versión publicada anterior no sobrescriba la jardinería nueva.

## Ilustración y animación

Esta revisión sigue sin publicar. Se añadió un personaje vectorial con piernas, brazos, bolso, rostro y vista de espaldas; la dirección se deriva del desplazamiento real. La caminata usa la distancia recorrida para sincronizar pasos y acelera/frena de manera gradual. Luci sigue con amortiguación para evitar saltos al cambiar de dirección.

El ambiente incorpora alas independientes en mariposas, ondulaciones del estanque, nenúfares, brisa en las copas y flores, halos lentos de faroles y una señal del destino al caminar. Las animaciones decorativas se pausan con un diálogo abierto, al ocultar la página o con «Pausar ambiente». La preferencia de pausa se guarda y los cambios del ajuste de movimiento reducido del dispositivo se aplican mientras está abierto el juego.

El rediseño usa una insignia floral, iconos de los rincones, paleta de bosque y luz de miel, un marco suave y transiciones de día/noche. Todo se dibuja con SVG y CSS; no se descargan sprites ni videos. Los módulos nuevos (`motion.js`, `illustration.js`, `atmosphere.css`) forman parte de la caché sin conexión y del paquete estático.


### Un jardín propio

La mochila incluye decoración (hasta 30 objetos, colocados junto a Isis y movibles) y exportación/importación JSON del jardín. El buzón y los sobres muestran notas incluidas en el juego. El editor de cartas personales se retiró porque no hay sincronización entre dispositivos. La mochila muestra una sola lista de hallazgos del día.

Cada nueva fecha local libera ambos parterres y renueva los hallazgos; los diez encuentros cambian de lugar de forma estable durante el día. Decoración, recuerdos permanentes y posición se conservan. La primera apertura de esta actualización conserva las flores existentes. Si la app sigue abierta, el cambio se aplica al volver al jardín, sin interrumpir una actividad. No hay reinicios por reloj atrasado, rachas ni penalizaciones.

Los encuentros incluyen composición de pétalos, dibujo de constelaciones y un paseo de tres paradas tras una mariposa. El ambiente respeta la pausa y el movimiento reducido del sistema.


### Segunda fase

- Cuatro nuevos destinos del mapa: invernadero, claro de visitantes, sendero del río y rincón compartido.
- Invernadero con tres semillas, seis combinaciones simétricas y flores permanentes de tres etapas. Repetir una mezcla no duplica ni reinicia la flor.
- Miso siempre puede visitar; Nube aparece con flores abiertas y Brisa con macetas o farolitos. Acompañar o acariciar guarda una ilustración, sin obligaciones de cuidado.
- Río explorable con dos orillas, cruce por puente, tres hallazgos y barquitos. Guarda la posición dentro de la zona. Solo mantiene su animación mientras está abierta y visible.
- Cuaderno ilustrado en la mochila: flores, visitas, hallazgos del jardín y del río, y momentos creados. Los recuerdos permanecen entre días.
- Picnic, cine y ramo con tres paletas y detalles elegibles (té, fruta, libro; luces, palomitas, manta; lazo, tarjeta, ramas); se pueden guardar en el cuaderno y descargar como postal PNG.
- Cielo despejado, atardecer, neblina y lluvia a elección. Las transiciones respetan el movimiento reducido. El clima adapta el sonido ya activo sin comenzar la reproducción.
- El progreso de la segunda fase forma parte de las copias existentes del jardín. Las partidas anteriores reciben valores iniciales válidos sin perder sus flores o recuerdos.


### Menús de juego

La mochila tiene compartimentos de rincones, paseos, objetos y ajustes. El cuaderno y los visitantes se recorren por páginas. Las actividades usan cabecera y salida fijas; las instrucciones son desplegables y las herramientas de decoración están separadas de las copias. Las pestañas admiten teclado y los controles mantienen al menos 44 px de alto. El estado completo del proyecto está en [MEMORIA.md](MEMORIA.md).


### Mundo ampliado

Mapa de 3000×2000 con seis regiones, destinos ilustrados, caminos conectados, minimapa, vista general y dos distancias de cámara. Elegir un rincón permite seguir los senderos; tocar un área libre va directamente o rodea el agua por un camino corto. Las uniones de los caminos se pintan como una red continua. Las partidas mantienen coordenadas válidas y los objetos de decoración pueden guardarse en las zonas nuevas. Los encuentros diarios usan 24 emplazamientos repartidos por el mundo. Segunda fase, menús, mapa y navegación publicados el 25 de octubre de 2026.


Publicación funcional verificada: [`a72400b`](https://github.com/LuisP09/el-jardin/commit/a72400b7ffde345a81e1d753dc509a1b93cc149d), con [GitHub Actions completado](https://github.com/LuisP09/el-jardin/actions/runs/40175729661) y 48 pruebas aprobadas. Para actualizar la PWA instalada: **Mi mochila → Ajustes → Instalar / actualizar → Actualizar jardín**.

Minijuegos publicados: Ventanas del jardín, Un ramo escondido, El sendero de Luci y Nubes de paso. Acceso desde Mi mochila → Mis cosas → Minijuegos. Incluyen ayuda visible, ramos pequeños, escenas variables y texto de nubes temporal que no se guarda. La PWA busca nuevas versiones y permite aplicarlas desde un aviso, guardando el paseo antes de recargar.
