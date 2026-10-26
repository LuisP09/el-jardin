# Memoria de El jardín de Isis

Última actualización: 25 de octubre de 2026, zona de referencia America/Mexico_City.

Este archivo reúne lo construido, las decisiones y el estado de la publicación. Es la referencia para continuar el proyecto y debe mantenerse actualizado junto con los cambios; no sustituye al historial de Git.

## Proyecto y destinataria

- Juego web y PWA personal para Isis, la novia del usuario.
- Le gustan los jardines, especialmente girasoles y margaritas; también las estrellas, el arte, el cine y la naturaleza.
- Frase personal: **«Besito en tu pollollo»**.
- Idioma: español. Dispositivo principal: teléfono Android.
- Intención: ofrecer un pequeño mundo acogedor para explorar y acompañar momentos de ansiedad, sin prometer efectos terapéuticos.
- Se busca una experiencia de juego, con personaje, paseos y descubrimientos. Evitar que se sienta como una página de información.
- No hay derrotas, cronómetros, rachas ni obligaciones de alimentar animales. El sonido comienza por decisión de la persona y se respeta el movimiento reducido.

## Estado de publicación

- Repositorio: https://github.com/LuisP09/el-jardin
- Sitio público: https://luisp09.github.io/el-jardin/
- Rama de publicación: `main`; un push activa `.github/workflows/pages.yml`.
- Versión funcional publicada y verificada: `ff2d6453007cddf4e9f1303959344bcc5960a0e4`. Los commits posteriores de documentación no cambian esa versión funcional.
- Despliegue verificado: https://github.com/LuisP09/el-jardin/actions/runs/40272462002 (completado correctamente).
- **Segunda fase, menús de juego, mapa ampliado y correcciones de caminos publicados con autorización del usuario. GitHub Actions y archivos públicos verificados.**
- Caché offline publicada: `6dec94104f3c8abe`; incluye mapa, menús, segunda fase, minijuegos y postales. El hash de CI puede diferir del local por los finales de línea de los archivos.
- No hacer commit/push para publicar ni activar despliegues sin autorización del usuario.
- Vista previa de la segunda fase: http://localhost:4176/?preview=1&review=phase-two
- La vista previa requiere el servidor local activo; el enlace no es accesible desde el celular de Isis como si fuera un sitio público.

## Qué contiene la versión publicada

### Mundo y actividades

- Personaje de Isis que camina tocando el mapa, con flechas/WASD o controles táctiles; acción mediante botón o tecla E.
- Luci acompaña al personaje, señala encuentros cercanos y tiene mensajes plegables fuera del mapa para no tapar la vista.
- Girasoles y margaritas: dos parterres con ocho espacios cada uno. Elegir semilla y regar para pasar de semilla a brote y flor.
- Estanque con ondas y propuestas opcionales para observar el entorno.
- Buzón con **24 notas** incluidas en el código.
- Observatorio de estrellas, taller de dibujo, pequeño cine, lista de películas y creación de postales.
- Decoración: macetas, farolitos, bancas y piedras; colocar junto a Isis, mover y quitar. Hasta 30 objetos.
- Diez encuentros: mariposa de miel, hoja viajera, piedrita de luna, deseo entre ramas, caracol, pluma, pétalos, constelación, paseo de mariposa y sobre escondido.
- Actividades de componer pétalos, conectar estrellas y seguir una mariposa hasta un claro.
- Pistas opcionales en la mochila para caminar hacia los encuentros.
- Día/noche, animaciones ambientales, pausa y movimiento reducido.
- Sonidos sintetizados de lluvia, arroyo y brisa, con volumen y pausa al pasar a segundo plano.

### Continuidad y ciclo diario

- Guarda posición, orientación, plantas, decoración, preferencias y recuerdos en el dispositivo.
- En cada nueva fecha local del teléfono se vacían los parterres y se reinician los hallazgos del día.
- Los encuentros cambian de lugar al cambiar de día, con distribución estable durante ese mismo día.
- Se conservan la decoración y los recuerdos permanentes. El cambio no interrumpe un diálogo abierto.
- La primera migración al ciclo diario conserva las flores existentes; retroceder el reloj no provoca otro reinicio.
- La mochila muestra una sola lista de hallazgos diarios: se retiró la lista visual duplicada de recuerdos.
- Exportación e importación de una copia JSON para trasladar el jardín a otro dispositivo.

### Decisión sobre cartas personales

- Se retiró el editor de cartas personales: no existe sincronización entre el teléfono del usuario y el de Isis.
- El buzón y el sobre escondido conservan textos incluidos en el juego. No reintroducir un formulario que parezca enviar cartas entre teléfonos.
- Las estructuras antiguas de cartas pueden seguir preservándose internamente por compatibilidad con copias; no constituyen una función visible activa.

## Segunda fase: publicada

1. **Invernadero:** tres semillas (girasol, margarita y luz de estrella), seis mezclas independientes del orden y tres etapas de crecimiento. Repetir una mezcla no duplica ni reinicia la planta. Las flores especiales permanecen entre días.
2. **Visitantes:** Miso, el gatito, siempre disponible; Nube, el conejito, con flores abiertas; Brisa, el petirrojo, con macetas o farolitos. Se pueden acompañar y acariciar. Las visitas se registran en el cuaderno.
3. **Río:** zona propia con dos orillas, puente, personaje, controles táctiles/teclado, tres hallazgos y barquitos de papel. Las rutas cruzan por el puente; se conserva la posición dentro de la zona.
4. **Cuaderno ilustrado:** reúne flores especiales, animales conocidos, hallazgos del jardín y río, y momentos creados. Ilustraciones SVG locales; recuerdos permanentes.
5. **Momentos compartidos:** picnic, cine exterior y ramo; tres paletas y detalles elegibles. Té/fruta/libro, luces/palomitas/manta y lazo/tarjeta/ramas. Guardado en el cuaderno y descarga de postal PNG.
6. **Clima:** despejado, atardecer, neblina y lluvia. Transiciones visuales, adaptación del audio que ya esté activo y respeto al movimiento reducido. No enciende el sonido por sí solo.

- Nuevos destinos: invernadero, claro de visitantes, sendero del río y rincón compartido.
- Cuaderno y clima se abren desde la mochila.
- El progreso nuevo vive en `phase2` dentro de la partida existente y se incluye en las copias JSON.
- El botón de regreso de estos paneles permanece disponible al desplazarse.

## Menús de juego (publicados)

- Petición del usuario: que los menús se sientan parte del juego, en lugar de páginas web.
- Mochila convertida en inventario con cuatro compartimentos: Rincones, Paseos, Mis cosas y Ajustes. Cada compartimento muestra solo sus controles.
- Destinos con iconos ilustrados; cuaderno, decoración, postales y clima como objetos visuales de la mochila.
- Cuaderno y visitantes con un recuerdo/animal por página y flechas de navegación; no son listas largas de tarjetas.
- Paneles de la segunda fase con marco, cabecera y salida fijas, área de juego desplazable y mensajes en una bandeja inferior.
- Instrucciones opcionales desplegables. Decoración y copias separadas en dos pestañas.
- Pestañas accesibles con roles, controles asociados y navegación por flechas/Home/End.
- Implementación: `game-menus.js` y `game-menus.css`, integrados en el build y la caché offline.
- Verificado en navegador: cambiar página del cuaderno, abrir las herramientas, separar decoración/copia, navegar por teclado; inventario a 320×640, 390×844, 844×390 y 1280×800, sin desbordamiento horizontal y con botones visibles de al menos 44 px de alto.
- Vista previa: http://localhost:4176/?preview=1&review=game-menus
- Estado: **publicado** con la segunda fase, tras autorización del usuario.

## Mapa ampliado (publicado)

- Mundo ampliado de 1400×900 a **3000×2000**, más de cuatro veces el área anterior. Se conservan las coordenadas válidas de las partidas antiguas y los parterres de la zona inicial.
- Seis regiones: jardín de los comienzos, colina de estrellas, valle del invernadero, bosque de visitantes, pradera compartida y ribera de sauces.
- Destinos repartidos por el mundo con nuevas ilustraciones de edificios y claros. Identificadores de plantas, recuerdos y destinos permanecen iguales.
- Senderos conectados, señales, cercas, vegetación, faroles, estanque y ribera. Los árboles se distribuyen evitando caminos y destinos.
- Al elegir un rincón se pueden seguir los senderos, con ruta visible y señal en el destino. Tocar un área libre usa una línea directa sin límite de distancia; si hay agua en medio, busca un rodeo local corto. Movimiento y destinos se acotan para evitar caminar sobre el estanque o entrar en el cauce de la ribera.
- Minimap visible en vertical, mapa general con destinos seleccionables y botón para alejar/acercar la cámara. En horizontal corto se conserva el control de cámara; el minimapa se oculta para liberar espacio.
- Los encuentros diarios se distribuyen por 24 puntos del mundo ampliado. Las decoraciones de las nuevas zonas se conservan en partidas y copias.
- Nuevos archivos: `world-layout.js` (regiones/rutas), `world-art.js` (paisaje), `world-map.js` y `world-map.css` (orientación e interfaz).
- Pruebas automatizadas: **32 aprobadas**, con cobertura de conectividad, seguridad de rutas, migración de posiciones/objetos y cámara en cuatro tamaños.
- Revisión de navegador: llegada al invernadero mediante los senderos, cámara alejada, minimapa y mapa general. La vista general no desborda horizontalmente a 320×640, 390×844, 844×390 y 1280×800; botones HTML de al menos 44 px.
- Vista previa: http://localhost:4176/?preview=1&review=expanded-world
- Publicado con autorización del usuario; continuar las nuevas mejoras en local.

## Pulido de senderos y desplazamiento (publicado)

- Corregidas las uniones superpuestas: la red completa se pinta en tres capas continuas, en lugar de dibujar bordes y transparencias por cada tramo. Se retiró la línea central punteada decorativa.
- Eliminado el umbral de 200 unidades que enviaba un toque lejano a la red de caminos. Los toques al terreno libre van directamente cuando hay paso.
- Si el estanque interrumpe el paso, una búsqueda local de visibilidad rodea su borde; no obliga a volver a un cruce distante.
- La selección de destinos conserva la navegación por senderos. Los controles manuales y la prevención de entrar al agua se mantienen.
- Validación: 35 pruebas aprobadas, incluyendo toques largos, rodeo corto del estanque, llegada simulada sin atascarse y distinción entre terreno libre y destinos. Compilación y revisión visual de las uniones. Publicado y verificado.
- Vista previa: http://localhost:4176/?preview=1&review=paths

## Archivos principales

| Archivo | Función |
| --- | --- |
| `index.html` | Mapa, interfaz, paneles y diálogos |
| `game.js` | Movimiento, Luci, destinos, encuentros, guardado e integración |
| `game-core.js`, `motion.js`, `illustration.js` | Movimiento/cámara, animación y arte del personaje/iconos |
| `gardening.js`, `gardening-core.js`, `gardening.css` | Parterres y herramientas de jardinería |
| `daily-core.js`, `extras.js` | Renovación diaria, decoración y copias |
| `app.js` | Notas del buzón y actividades de estrellas, arte, cine y postales |
| `phase-two-core.js` | Estado, mezclas, visitantes y rutas del río |
| `phase-two-art.js` | Ilustraciones de la segunda fase y postales |
| `phase-two.js`, `phase-two.css` | Interacciones y diseño de la segunda fase |
| `game-menus.js`, `game-menus.css` | Inventario, pestañas, paginación y aspecto de los menús |
| `world-layout.js`, `world-art.js`, `world-map.js`, `world-map.css` | Mundo ampliado, rutas, paisaje, minimapa y mapa general |
| `style.css`, `game.css`, `atmosphere.css` | Estilos generales, móvil y ambiente |
| `audio.js`, `soundscape.js` | Controles y generación del sonido |
| `pwa.js`, `sw.js`, `manifest.webmanifest` | Instalación, actualizaciones y funcionamiento sin conexión |
| `scripts/build.mjs` | Validación, copia de archivos públicos y hash de caché |
| `.github/workflows/pages.yml` | Comprobaciones y despliegue en Pages |
| `tests/` | Pruebas de lógica, audio, persistencia y caché |

## Desarrollo y comprobaciones

- JavaScript/HTML/CSS sin dependencias de npm; Node.js 22 o posterior.
- `npm test`: última ejecución verificada con **61 pruebas aprobadas**.
- `npm run build`: genera `_site/` y valida archivos públicos e iconos.
- Servidor usado: `python -m http.server 4176 --bind 127.0.0.1 --directory _site`.
- Añadir cada nuevo módulo/estilo público a `scripts/build.mjs` y `sw.js`; ampliar la cobertura de archivos offline de `tests/pwa.test.mjs` y las comprobaciones del workflow cuando corresponda.
- No editar `_site/` como fuente: se regenera al compilar.
- Partida principal: clave local `isis-game-v2`, con migración desde `isis-game-v1`.
- Copias: formato `isis-garden`, versión 1. La restauración suspende el guardado previo antes de recargar para no sobrescribir la copia recién importada.
- Los datos son locales al navegador y al origen. `localhost`, `127.0.0.1` y el sitio público tienen almacenamientos separados.
- Se detectó una caché antigua en la vista previa de `127.0.0.1`; la revisión reciente usa `localhost` con `?preview=1`. Este parámetro evita registrar un nuevo service worker en la vista previa, pero no garantiza eliminar uno que ya estuviera activo.
- En Android, una PWA instalada se actualiza desde **Mi mochila → Ajustes → Instalar / actualizar → Actualizar jardín**, cuando la actualización esté disponible.

## Validación de la segunda fase

- Pruebas de seis combinaciones, crecimiento permanente, conservación entre días, requisitos de visitas, migración/copia, composiciones y rutas seguras del río.
- Se comprobó en navegador: mezclar y regar, persistencia al recargar, caricias, clima, hallazgo en la otra orilla, barquito, cuaderno y generación de postal.
- Río revisado a 320×640, 390×844, 844×390 y 1280×800: sin desbordamiento horizontal y con botones HTML de al menos 44 px de alto.
- Las comprobaciones de navegador son emulación de tamaños; falta la revisión del usuario y, preferiblemente, una prueba en el Android real.

## Movimiento móvil (publicado)

- **Ajuste publicado y verificado:** movimiento de Isis a 205 unidades/s (antes 145), aceleración más ágil y render sin límite artificial de 30 FPS. Los cuadros lentos se recuperan en pasos pequeños de hasta 1/120 s, con límite de 150 ms para evitar saltos tras pausas. En dispositivos táctiles se desactiva el balanceo masivo de árboles y flores; Luci y fauna conservan sus animaciones. Publicado con autorización del usuario en `01657c6`; Actions `40173485762` correcto y archivos públicos verificados.
- Validación del ajuste: 37 pruebas y build correctos; simulación de avance equivalente entre 10 y 120 FPS y recorrido por teclado en navegador. Falta confirmar fluidez en Android real; las pruebas no sustituyen una medición en ese teléfono.
## Minijuegos y variedad (publicados)

- Acceso: **Mi mochila → Mis cosas → Minijuegos**. Selector ilustrado «Un ratito para mí», integrado en el panel de actividades. Sin relojes, puntos, rachas, derrotas ni recompensas obligatorias. No promete efectos terapéuticos.
- Selector ampliado con accesos «Algo sencillo», «Ocupar mi atención» y «Dejar una idea aquí». Son elecciones de actividad; no se pregunta, registra ni infiere el estado emocional. El texto de bienvenida permite estar triste o sin energía sin exigir cambiar cómo se siente.
- **Ventanas del jardín:** cuarto minijuego. Apartar hasta doce hojas para descubrir una ilustración SVG local. Tres paisajes (girasoles, margaritas bajo la luna y atardecer junto al agua) con tema distinto al anterior. Se puede ver la postal entera desde el principio, salir o descubrir otra. Sin porcentaje de progreso ni obligación de terminar. Arte en `calm-postcards.js`, integrado también en precaché y workflow.
- Ramos: modos «Poquitas flores» (9 objetivos) y «Jardín completo» (16), siempre con tres coincidencias y cuatro tipos. Nubes: tras dejarlas pasar se ofrecen paisaje, búsqueda pequeña o regreso al jardín; texto temporal sigue descartándose al salir. Luci: modo **Con Luci** predeterminado deja el camino visible; **De memoria** permite ocultarlo. Cambiar la ayuda conserva el avance y, al terminar, puede elegirse otro camino.
- **Un ramo escondido:** buscar tres flores/hojas de un tipo entre 16 objetivos, cuatro clases distinguibles por símbolo, texto y color. Distribución nueva en cada ronda y objetivo distinto al anterior; elegir otra flor no resta nada. Ramo visual y opción de cambiar de paisaje.
- **El sendero de Luci:** recordar secuencias de tres, cuatro o cinco luces con nombre y símbolo. Sin repeticiones consecutivas; se puede volver a mirar. Una elección diferente ofrece una pista y conserva todo el avance. Nuevas secuencias al repetir, sin temporizadores ni destellos.
- **Nubes de paso:** nube con nombre opcional de hasta 80 caracteres. Se puede dejar pasar sin escribir, crear otra o salir en cualquier momento. El texto se inserta con `textContent`, no se guarda ni se envía, y se vacía al soltar la nube, cambiar de juego o cerrar el panel. No forma parte de la partida ni las copias.
- Selector «Luci, elige uno para mí» evita elegir el último minijuego usado. El nivel de luces se conserva solo durante la sesión. Las animaciones respetan movimiento reducido y pausa del ambiente.
- Variedad existente: pétalos y constelaciones generan posiciones nuevas con separación táctil, propuestas creativas distintas sin repetir la anterior y botón «Otra composición» / «Otro cielo». Estanque con propuestas barajadas que rotan, en vez de quedar atascado en la última frase.
- Archivos: `calm-games.js`, `calm-games-core.js`, `calm-games.css`, integrados en build, precaché offline, pruebas y workflow. No se modifica el formato de las partidas.
- Validación: **46 pruebas**, build y sintaxis correctos. Navegador: completar ramo y secuencia, elegir otra luz sin perder avance, poner/soltar nube y descartar texto al cerrar; consola sin errores. Selector en 320×640, 390×844, 844×390 y 1280×800 sin desbordamiento y botones de al menos 44 px; objetivos del ramo verificados también a 320 px. Falta prueba en Android real. Vista previa: http://localhost:4176/?preview=1&review=minigames.
- Estado: **publicado** con autorización del usuario en `a72400b`; Actions `40175729661` correcto y archivos públicos verificados. Las mejoras de actualizaciones PWA también están publicadas.
- Validación de esta ampliación: **48 pruebas**, build, sintaxis y diff correctos. Navegador: revelar hojas y postal completa, tema nuevo, seguir luces alternando ayuda sin perder avance, pasar de nubes a ramo de nueve flores. A 320 px: sin desbordamiento del ramo, objetivos y hojas de al menos 44 px. Captura de postal completa a 390×844; consola sin errores. Pendiente Android real.

## Actualizaciones PWA (publicadas)

- El usuario confirmó que borrar la caché resolvió la lentitud en celulares sin la optimización gráfica pendiente. Se retiró por completo el experimento de paisaje como textura; se conserva el paisaje vectorial publicado.
- **Actualizaciones PWA publicadas:** búsqueda al iniciar, recuperar foco/visibilidad/conexión y cada 15 minutos mientras esté visible, con límite de una consulta automática por minuto. Botón «Buscar actualización» y aviso inferior «Nueva versión disponible» que abre el panel. Se guarda el paseo antes de activar/recargar; nunca se recarga por sorpresa. Gestiona activaciones desde otra pestaña y fallos sin conexión. Registro con `updateViaCache:none` e instalación de recursos con `cache:reload` para evitar reutilizar archivos HTTP antiguos.
- Validación: 41 pruebas y build correctos. Ciclo real en servidor local separado: primera instalación sin aviso falso, detección de un worker nuevo, aviso móvil a 390×844, actualización elegida por botón, recarga y regreso al paseo, sin errores de consola. Pruebas automatizadas cubren offline, limitación de consultas, guardado, recarga única y otras pestañas. Publicado en `a72400b`; Actions y archivos públicos verificados.
## Cinco mejoras de continuidad y personalidad (publicadas)

- Petición: trabajar los cinco puntos de presencia de Isis/Luci, conectar actividades con el mundo, variar encuentros, unificar arte y conocer la experiencia de Isis sin seguimiento automático. Publicado con autorización del usuario en ff2d645.
- **Presencia:** botón «Sentarme con Luci» en el mapa, postura sentada y Luci cerca. Volver a caminar levanta al personaje. Pequeñas reacciones ilustradas al descubrir, conservar recuerdos y volver de actividades. Sin bucle de animación adicional; se respeta movimiento reducido y pausa del ambiente.
- **Continuidad:** al descubrir una postal, terminar un ramo o un sendero de luces se puede elegir «Guardar en mi cuaderno» o «Poner junto a Isis». Ocho recuerdos posibles (cuatro ramos, tres postales y un farol), sin contadores de colección ni requisitos diarios. Cuaderno permite colocar/mover o recoger; recoger conserva el recuerdo. La postal guardada muestra su ilustración original.
- Datos nuevos en `phase2.souvenirs`: `owned` admite solo claves conocidas; `placed` conserva clave y posición, sin duplicados. Migración vacía para partidas anteriores; persiste al cambiar de día y en las copias JSON existentes. Colocación busca espacio cercano para evitar encimar recuerdos y evita agua/bordes. No se guardan textos de nubes ni comentarios en este campo.
- **Encuentros:** mariposa, hoja, caracol y pluma tienen dos situaciones cada uno, dos elecciones opcionales y respuestas de Luci. La variante depende de fecha y visita de la sesión; volver ofrece otra situación. No modifica identificadores de hallazgos ni los diez encuentros diarios.
- **Arte:** ilustraciones SVG compartidas para flores, hojas, luna, estrellas, nube, postales y reacciones; sustituyen símbolos de los botones de minijuegos y se reutilizan en recuerdos. Transiciones discretas, contenedores táctiles conservados. No se recuperó el experimento de textura móvil descartado.
- **Opinión voluntaria:** Mi mochila → Ajustes → «Contar qué me gustó». Elegir un rincón y escribir hasta 400 caracteres. Se puede mostrar la pantalla o descargar un TXT para compartir manualmente. No hay envío, analítica, registro de ánimo ni almacenamiento del comentario en la partida; se limpia al cerrar. Falta recibir la opinión real de Isis.
- Archivos nuevos: `continuity-core.js`, `garden-art.js`, `garden-life.js`; añadidos a build, caché offline y workflow. Pruebas en `tests/continuity.test.mjs`.
- Validación: **55 pruebas**, build y diff correctos. Navegador: sentarse/levantarse al caminar, guardar/colocar postal, conservarla tras recargar y verla en el cuaderno; completar/conservar ramo y farol; dos variantes de hoja y sus elecciones; descargar comentario y verificar que se vacía al salir. Selector a 320×640, 390×844, 844×390 y 1280×800 sin desbordamiento y controles de al menos 44 px; consola sin errores. Emulación de tamaño, no prueba en Android real.
- Vista previa: http://127.0.0.1:4176/?preview=1&review=continuity. Estado: **publicado** en ff2d645; Actions 40272462002 y archivos públicos verificados.

## Notas personales y río renovado (publicados)

- Petición nueva: escribir notas/pensamientos permanentes, invitar patos al río, hacer que barcos y patos pasen debajo del puente y mejorar el diseño de la ribera. Publicado junto con las cinco mejoras de continuidad, tras autorización del usuario.
- **Mis notas:** acceso en Mi mochila → Mis cosas → Mis notas. Libreta con títulos opcionales, fechas, lista de notas y edición. Hasta 80 notas de 3000 caracteres, con títulos de hasta 80. Guardar actualiza la nota sin duplicarla. Se puede quitar una y deshacer la última eliminación antes de salir de la sección.
- Borrador automático con demora de 500 ms, actualizado también en memoria al escribir; se vacía el temporizador y se guarda al cerrar, pasar a segundo plano, actualizar la PWA o salir de la página. Borrador y notas sobreviven al cambio de día y se incluyen en la copia JSON existente. No se envían ni sincronizan con otro teléfono. Son notas personales de quien usa el jardín; esto no reintroduce el editor de cartas entre teléfonos retirado anteriormente. Las nubes y los comentarios voluntarios siguen siendo temporales.
- Datos nuevos `phase2.journal = {entries,draft}` y `phase2.ducks` (0–5). Partidas anteriores migran sin borrar los campos previos. Texto de notas se muestra como texto/valor de formulario, sin interpretar HTML. Si falla guardar en el dispositivo, la libreta indica el fallo en vez de confirmar un guardado inexistente.
- **Río:** nuevo arte SVG local con senderos, vegetación, piedras, una banca, orillas y puente de madera. Los flotantes se dibujan dentro de una capa recortada al cauce, antes del puente; Isis sigue encima de la pasarela. Se corrige el fallo de los barcos que pasaban por arriba.
- «Invitar un pato» añade hasta cinco sin reiniciar el recorrido de los otros. Los patos permanecen elegidos al volver a entrar; «Dejar ir a los patos» permite retirarlos sin obligaciones de cuidado. Barquitos temporales con límite de cinco simultáneos y limpieza al terminar el recorrido. Animaciones CSS, con pausa local, movimiento reducido y pausa al pasar a segundo plano; no se añade otro bucle de animación JS.
- Archivos nuevos `journal-core.js`, `journal.js`, `river-scene.js`, integrados en build, caché offline, pruebas y workflow. `tests/journal-river.test.mjs` comprueba creación/edición, límites, migración, copia, renovación diaria, patos y orden de capas del puente.
- Validación: **61 pruebas aprobadas**, build y sintaxis correctos. Navegador: recarga inmediata conserva borrador; guardar dos notas, editar, quitar y deshacer; patos conservados al recargar, límite de cinco y pausa de animaciones. Orden de capas comprobado en DOM y captura con un pato bajo la pasarela. Notas y río revisados a 320×640, 390×844, 844×390 y 1280×800, sin desbordamiento horizontal y con botones HTML de al menos 44 px. Consola sin errores. Falta Android real.
- Vista previa limpia: http://127.0.0.1:4178/?preview=1&review=river-notes (servidor local activo). Se usó 4178 porque la pestaña previa de 4176 reutilizaba un CSS antiguo; los datos de estos orígenes son independientes. Capturas en artefactos: `notas-persistentes-android.png` y `rio-patos-bajo-puente.png`.
- Estado: **publicado** en `ff2d645`; Actions `40272462002` correcto. Archivos públicos de notas, patos, puente, recuerdos y caché offline verificados; caché `6dec94104f3c8abe`.

## Pendiente

- Revisar los minijuegos y la actualización en el Android real de Isis cuando sea posible.
- Continuar cualquier nueva mejora en local y publicar únicamente con autorización del usuario.
- Mantener esta memoria actualizada en cada entrega.

## Historial resumido

| Fecha | Cambio | Validación / estado |
| --- | --- | --- |
| 25-10-2026 | Publicación autorizada de continuidad, notas persistentes y río renovado con patos | 61 pruebas; versión funcional ff2d645; Actions 40272462002 correcto, archivos públicos y caché 6dec94104f3c8abe verificados |
| 25-10-2026 | Libreta personal con borrador y notas persistentes, patos y nuevo arte del río; flotantes debajo del puente | 61 pruebas, build, persistencia y cuatro tamaños de navegador; **solo local**, pendiente Android real |
| 25-10-2026 | Cinco mejoras: presencia de Isis/Luci, recuerdos de minijuegos en jardín/cuaderno, encuentros con elecciones, arte SVG compartido y comentario voluntario | 55 pruebas, build, persistencia y revisión móvil en navegador; **solo local**, pendiente Android real y opinión de Isis |
| 25-10-2026 | Publicación autorizada de cuatro minijuegos, variedad y actualizaciones PWA | 48 pruebas; versión funcional a72400b; Actions 40175729661 correcto, archivos públicos y caché a4048f811c3acd3b verificados |
| 25-10-2026 | Ventanas del jardín con tres ilustraciones, accesos según actividad deseada, ramos pequeños, Luci con ayuda visible y pasos opcionales tras las nubes | 48 pruebas, build y partidas verificadas en navegador; **solo local**, pendiente Android real |
| 25-10-2026 | Tres minijuegos: ramos, secuencias de Luci y nubes temporales; variedad en pétalos, constelaciones y estanque | 46 pruebas, build, partidas y tamaños revisados en navegador; **solo local**, pendiente Android real |
| 25-10-2026 | Retirado el experimento de textura; detección y aviso de actualizaciones PWA, búsqueda manual y descarga sin caché HTTP | 41 pruebas, build y ciclo real de actualización en navegador; **solo local**, sin publicar |
| 25-10-2026 | Paisaje móvil convertido en textura, conservando capas interactivas; menos efectos de composición en controles y clima | 37 pruebas, build y navegador 390×844; textura, día/noche y movimiento verificados; **retirado** tras confirmar el usuario que borrar caché resolvió la lentitud |
| 25-10-2026 | Corrección de lentitud en móvil: velocidad 205, respuesta más rápida, recuperación de cuadros lentos y menos animación de vegetación en pantallas táctiles | 37 pruebas, build y movimiento por teclado en navegador; **publicado en `01657c6`**, Actions y archivos públicos verificados; pendiente Android real |
| Previo al 25-10-2026 | PWA, mundo explorable, móvil, audio, jardinería, Luci y continuidad | Publicaciones previas; commits `f6d4bf7` y `3d80bb7` |
| 25-10-2026 | Decoración, diez encuentros, renovación diaria, copias, 24 notas y correcciones de botones; retirada del editor de cartas y lista duplicada | 20 pruebas; publicado en `bb6d31d`, Actions correcto |
| 25-10-2026 | Segunda fase: invernadero, visitantes, río, cuaderno, momentos y clima | 28 pruebas; compilación y revisión móvil; **solo local** |
| 25-10-2026 | Menús convertidos en inventario visual, cuaderno y visitantes paginados, paneles con cabecera fija y herramientas separadas | 28 pruebas existentes, compilación y revisión de teclado/tamaños; **solo local** |
| 25-10-2026 | Ampliación del mundo, seis regiones, nuevos paisajes, senderos, minimapa, mapa general y cámara ajustable | 32 pruebas y compilación; **solo local** |
| 25-10-2026 | Uniones continuas de caminos y desplazamiento directo en terreno libre, con rodeos locales del agua | 35 pruebas, compilación y revisión visual; **solo local** |
| 25-10-2026 | Creación de `MEMORIA.md` y `AGENTS.md` para mantener el contexto actualizado | Documentación; sin publicación |

| 25-10-2026 | Publicación integral de segunda fase, menús, mapa y navegación corregida | 35 pruebas; versión funcional `75f9a3a`; Actions `40172945161` correcto y archivos públicos/caché verificados |

Al añadir una entrada, indicar lo que realmente se comprobó y cualquier pendiente. Evitar copiar conversaciones completas, datos sensibles o resultados de pruebas que no se hayan ejecutado.
