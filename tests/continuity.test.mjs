import {test} from 'node:test';
import assert from 'node:assert/strict';
import {restoreSouvenirs,rememberSouvenir,placeSouvenir,encounterVariant,SOUVENIRS} from '../continuity-core.js';
import {restorePhaseTwo} from '../phase-two-core.js';
import {renewDay,parseBackup} from '../daily-core.js';
import {gardenIcon,souvenirArt} from '../garden-art.js';

test('Las partidas anteriores empiezan sin recuerdos nuevos y conservan flores, visitas y clima',()=>{
 const old={flowers:{sol:3},visitors:['cat'],weather:'sunset'};
 const state=restorePhaseTwo(old);assert.deepEqual(state.souvenirs,{owned:[],placed:[]});
 assert.equal(state.flowers.sol,3);assert.deepEqual(state.visitors,['cat']);assert.equal(state.weather,'sunset');
});
test('Conservar y colocar un recuerdo no duplica objetos ni acepta tipos o posiciones inválidos',()=>{
 const state=restoreSouvenirs();assert.equal(rememberSouvenir(state,'bouquet:sun'),true);
 assert.equal(rememberSouvenir(state,'bouquet:sun'),false);assert.equal(rememberSouvenir(state,'cloud:private'),false);
 assert.equal(placeSouvenir(state,'postcard:moon',{x:400,y:700}),true);
 placeSouvenir(state,'postcard:moon',{x:500,y:800});
 assert.equal(state.placed.length,1);assert.equal(state.placed[0].x,500);
 assert.equal(placeSouvenir(state,'light:luci',{x:NaN,y:1}),false);
 assert.equal(placeSouvenir(state,'bad',{x:1,y:1}),false);
});
test('Recuerdos y ubicación sobreviven al nuevo día y a exportar e importar una copia',()=>{
 const game={gardenDate:'2026-10-25',phase2:restorePhaseTwo(),plots:{flowers:[],daisies:[]},finds:['leaf']};
 placeSouvenir(game.phase2.souvenirs,'light:luci',{x:2100,y:1300});
 renewDay(game,'2026-10-26');assert.equal(game.phase2.souvenirs.placed.length,1);
 const copy=parseBackup(JSON.stringify({format:'isis-garden',version:1,game}));
 assert.deepEqual(restorePhaseTwo(copy.game.phase2).souvenirs,game.phase2.souvenirs);
});
test('Colocar varios recuerdos desde el mismo lugar deja espacio y evita el agua',()=>{
 for(const location of [{x:930,y:590},{x:65,y:65}]){
 const state=restoreSouvenirs();for(const key of Object.keys(SOUVENIRS))assert.equal(placeSouvenir(state,key,location),true);
 for(let i=0;i<state.placed.length;i++){
  const p=state.placed[i];assert.ok(Math.hypot((p.x-1080)/174,(p.y-590)/96)>=.99);
  for(let j=0;j<i;j++)assert.ok(Math.hypot(p.x-state.placed[j].x,p.y-state.placed[j].y)>=60);
 }
 }
});
test('Restaurar descarta textos ajenos, recuerdos no poseídos y duplicados; acota las coordenadas',()=>{
 const value=restoreSouvenirs({owned:['postcard:sun','postcard:sun','un texto privado'],placed:[{key:'postcard:sun',x:-100,y:99999},{key:'postcard:sun',x:400,y:500},{key:'bouquet:sun',x:1,y:2}]});
 assert.deepEqual(value.owned,['postcard:sun']);assert.equal(value.placed.length,1);
 assert.equal(value.placed[0].x,65);assert.equal(value.placed[0].y,1935);
 assert.equal(JSON.stringify(value).includes('privado'),false);
});
test('Los encuentros cambian al volver y son estables para la fecha y visita indicadas',()=>{
 for(const id of ['butterfly','leaf','snail','feather']){
  const first=encounterVariant(id,'2026-10-25',0);
  assert.deepEqual(first,encounterVariant(id,'2026-10-25',0));
  assert.notDeepEqual(first,encounterVariant(id,'2026-10-25',1));assert.equal(first.length,4);
 }
 assert.equal(encounterVariant('trail','2026-10-25'),null);
});
test('Los iconos y recuerdos usan ilustraciones locales sin scripts ni recursos externos',()=>{
 for(const key of Object.keys(SOUVENIRS))assert.match(souvenirArt(key),/^<svg/);
 for(const id of ['sun','daisy','rose','leaf','clouds','moon','postcard','heart','star']){
  const art=gardenIcon(id);assert.match(art,/aria-hidden="true"/);assert.doesNotMatch(art,/<script|href=|<foreignObject/);
 }
});
