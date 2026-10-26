import {test} from 'node:test';
import assert from 'node:assert/strict';
import {restoreRetreat,retreatPoint,luciLine,mobileHeight} from '../arrival-core.js';
import {retreatArt} from '../retreat-art.js';
import {restorePhaseTwo} from '../phase-two-core.js';
import {renewDay,parseBackup} from '../daily-core.js';

test('Las partidas anteriores conservan su contenido y reciben un rincón sin ubicación',()=>{
 const state=restorePhaseTwo({flowers:{sol:3},journal:{draft:{text:'Una nota privada'}}});
 assert.equal(state.entryMenu,true);assert.equal(state.retreat.anchor,null);assert.equal(state.flowers.sol,3);assert.equal(state.journal.draft.text,'Una nota privada');
 assert.deepEqual(restoreRetreat(null),{anchor:null,theme:'sage',flowers:true,lights:true});
});
test('Rincón, colores y preferencia de entrada sobreviven al nuevo día y a la copia',()=>{
 const game={gardenDate:'2026-10-25',plots:{flowers:[],daisies:[]},phase2:restorePhaseTwo({entryMenu:false,retreat:{anchor:{x:1300,y:1100},theme:'rose',flowers:false,lights:true}})};
 renewDay(game,'2026-10-26');const copy=parseBackup(JSON.stringify({format:'isis-garden',version:1,game}));
 const state=restorePhaseTwo(copy.game.phase2);assert.deepEqual(state.retreat,game.phase2.retreat);assert.equal(state.entryMenu,false);
 assert.equal(restoreRetreat({anchor:{x:Infinity,y:1},theme:'invalid'}).anchor,null);
 const river=retreatPoint({x:2900,y:1400});assert.equal(river.x,2620);
 const pond=retreatPoint({x:1080,y:590});assert.ok(Math.hypot((pond.x-1080)/330,(pond.y-590)/230)>=.99);
});
test('Luci comenta el entorno y evita repetir la última frase sin leer notas o ánimo',()=>{
 const context={retreat:true,weather:'rain',day:false};const first=luciLine(context,null,()=>0),second=luciLine(context,first,()=>0);
 assert.notEqual(first,second);assert.match(first,/rincón/);
 assert.match(luciLine({weather:'rain'},null,()=>0),/lluvia/);
 assert.match(luciLine({region:'river',day:true},null,()=>0),/río/);
 assert.match(luciLine({memory:true},null,()=>0),/creaste/);
});
test('El ajuste de teclado usa la altura visible solo durante edición y evita saltos por barras del navegador',()=>{
 assert.equal(mobileHeight(844,450,true),450);assert.equal(mobileHeight(844,780,true),844);
 assert.equal(mobileHeight(844,450,false),844);assert.equal(mobileHeight(844,NaN,true),844);
 assert.equal(mobileHeight(844,20,true),844);assert.equal(mobileHeight(450,450,true),450);
});
test('El rincón cambia de paleta y detalles con ilustraciones locales',()=>{
 assert.notEqual(retreatArt('sage'),retreatArt('rose'));assert.notEqual(retreatArt('sage'),retreatArt('sage',false,false));
 assert.match(retreatArt(),/^<svg/);assert.doesNotMatch(retreatArt(),/<script|href=|<foreignObject/);
});
