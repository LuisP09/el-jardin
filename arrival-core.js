import {walkablePoint} from './world-layout.js';
export const RETREAT_THEMES={sage:'Verde salvia',honey:'Miel y girasoles',rose:'Rosa de acuarela'};
export function retreatPoint(point){
 let {x,y}=walkablePoint(point);x=Math.max(160,Math.min(2840,x));y=Math.max(170,Math.min(1830,y));if(x>2620&&y>470)x=2620;
 const dx=(x-1080)/330,dy=(y-590)/230,d=Math.hypot(dx,dy);if(d<1){x=1080+(d?dx/d:1)*330;y=590+(d?dy/d:0)*230;}
 return {x,y};
}
export function restoreRetreat(value){
 const anchor=Number.isFinite(value?.anchor?.x)&&Number.isFinite(value?.anchor?.y)?retreatPoint(value.anchor):null;
 return {anchor,theme:Object.hasOwn(RETREAT_THEMES,value?.theme)?value.theme:'sage',flowers:value?.flowers!==false,lights:value?.lights!==false};
}
export function luciLine(context,previous=null,rng=Math.random){
 let lines;
 if(context.retreat)lines=['Este rincón tiene un poquito de ti. Podemos quedarnos aquí.','Tu banca, tus flores y un ratito nuestro. No hace falta hacer nada más.','Me gusta volver contigo a este lugar que elegiste.'];
 else if(context.memory)lines=['Por aquí hay algo que creaste tú. El jardín se va pareciendo a ti.','Guardaste un pequeño recuerdo en este lugar. Podemos mirarlo otra vez.'];
 else if(context.weather==='rain')lines=['Las hojas reciben la lluvia. Yo me quedo cerquita de ti.','Podemos mirar cómo cambia el agua con la lluvia. Sin prisa por movernos.'];
 else if(context.weather==='sunset')lines=['La tarde está pintando las hojas de miel. ¿Nos quedamos a mirar?','Mira ese color entre las ramas. Parece una pequeña acuarela para ti.'];
 else if(context.weather==='mist')lines=['La neblina deja ver el jardín poquito a poco. Podemos ir despacio.','Aunque hoy no veamos todo el camino, podemos elegir un solo pasito.'];
 else if(context.region==='river')lines=['El río sigue su camino, y nosotros podemos mirar desde la orilla.','Quizá un pato pase por debajo del puente. Podemos esperarlo un ratito.'];
 else if(context.region==='stars'||!context.day)lines=['Hay luces pequeñitas entre las hojas. Puedo acompañarte hasta una.','Las estrellas también tienen un lugar en este jardín. Como tú.','No tenemos que encontrar nada esta noche. Podemos simplemente pasear.'];
 else lines=['Hoy podemos empezar por lo que te apetezca, Isis.','Un girasol, un trazo o una banca. Tú eliges nuestro siguiente ratito.','El jardín puede acompañarte tal como estás hoy.'];
 const choices=lines.filter(line=>line!==previous);return choices[Math.floor(rng()*choices.length)];
}
export function mobileHeight(layout,visual,editing){return editing&&Number.isFinite(visual)&&visual>120&&layout-visual>100?visual:layout;}
