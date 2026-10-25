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
- Versión funcional publicada y verificada: `01657c69f0f4a19cb9a66bfc4b9fb24ce25e7a77`. Los commits posteriores de documentación no cambian esa versión funcional.
- Despliegue verificado: https://github.com/LuisP09/el-jardin/actions/runs/40173485762 (completado correctamente).
- **Segunda fase, menús de juego, mapa ampliado y correcciones de caminos publicados con autorización del usuario. GitHub Actions y archivos públicos verificados.**
- Caché offline publicada: `ed29b1d3101fa767`; incluye los módulos del mapa, menús y segunda fase. El hash de CI puede diferir del local por los finales de línea de los archivos.
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
- `npm test`: última ejecución verificada con **37 pruebas aprobadas**.
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
## Pendiente

- Revisar la actualización en el Android real de Isis cuando sea posible.
- Continuar cualquier nueva mejora en local y publicar únicamente con autorización del usuario.
- Mantener esta memoria actualizada en cada entrega.

## Historial resumido

| Fecha | Cambio | Validación / estado |
| --- | --- | --- |
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
