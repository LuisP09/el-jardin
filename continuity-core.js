import {clampPoint} from './game-core.js';
import {walkablePoint} from './world-layout.js';
export const SOUVENIRS={
 'bouquet:sun':'Un ramo de girasoles','bouquet:daisy':'Un ramo de margaritas',
 'bouquet:rose':'Un ramo rosa','bouquet:leaf':'Un ramito de hojas',
 'postcard:sun':'Un claro de girasoles','postcard:moon':'Margaritas bajo la luna',
 'postcard:rose':'Un atardecer junto al agua','light:luci':'Un farol para Luci'
};
export function restoreSouvenirs(value){
 const owned=Array.isArray(value?.owned)?[...new Set(value.owned.filter(key=>Object.hasOwn(SOUVENIRS,key)))]:[];
 const placed=[];
 for(const item of Array.isArray(value?.placed)?value.placed:[]){
  if(!item||!owned.includes(item.key)||placed.some(p=>p.key===item.key)||!Number.isFinite(item.x)||!Number.isFinite(item.y))continue;
  placed.push({key:item.key,...clampPoint(item)});
 }
 return {owned,placed};
}
export function rememberSouvenir(state,key){
 if(!Object.hasOwn(SOUVENIRS,key))return false;
 const fresh=!state.owned.includes(key);if(fresh)state.owned.push(key);return fresh;
}
export function placeSouvenir(state,key,position){
 if(!Object.hasOwn(SOUVENIRS,key)||!Number.isFinite(position?.x)||!Number.isFinite(position?.y))return false;
 const others=state.placed.filter(p=>p.key!==key);
 const offsets=[0,80,-80,160,-160].flatMap(x=>[0,80,-80,160,-160].map(y=>[x,y]));
 const free=offsets.map(([x,y])=>walkablePoint({x:position.x+x,y:position.y+y})).find(p=>others.every(other=>Math.hypot(p.x-other.x,p.y-other.y)>=60));
 if(!free)return false;
 rememberSouvenir(state,key);const item=state.placed.find(p=>p.key===key);
 if(item)Object.assign(item,free);else state.placed.push({key,...free});
 return true;
}
export const ENCOUNTER_VARIANTS={
 butterfly:[['Una mariposa entre flores','Luci encontró una mariposa junto a una flor. Puedes observarla o dejarle un pequeño claro.','Observar su vuelo','Dejarle espacio'],['Alas de la tarde','La mariposa abre sus alas como dos pequeñas hojas de miel. Tú eliges cómo acompañarla.','Seguirla con la mirada','Sentarme cerquita']],
 leaf:[['La hoja que dibuja','Una hoja gira y parece trazar una espiral. Puedes imaginar su dibujo o acompañar su viaje.','Imaginar su dibujo','Acompañar su viaje'],['Una hoja en el camino','El viento dejó una hoja a los pies de Isis. Sus pequeñas líneas parecen un mapa.','Mirar sus líneas','Dejarla seguir']],
 snail:[['Un descanso bajo la hoja','Un caracol encontró sombra. No tiene ningún lugar urgente al que llegar.','Acompañarlo','Observar la hoja'],['El sendero diminuto','Luci sigue el caminito brillante de un caracol. Se detiene a tu lado para mirar.','Mirar el camino','Quedarme un ratito']],
 feather:[['Una pluma al sol','Una pluma se mueve apenas con la brisa. Parece un pequeño pincel del bosque.','Imaginar sus colores','Mirar cómo se mueve'],['Brisa dejó una pista','Entre las flores hay una pluma. Quizá un petirrojo pasó por este rincón.','Buscarlo entre las ramas','Dejar la pluma aquí']]
};
export function encounterVariant(id,date,visit=0){
 const variants=ENCOUNTER_VARIANTS[id];if(!variants)return null;
 const seed=[...String(date)].reduce((sum,c)=>sum+c.charCodeAt(0),0);
 return variants[(seed+Math.max(0,visit))%variants.length];
}
