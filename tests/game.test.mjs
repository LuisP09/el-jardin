import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampPoint, moveTowards, nearestStation } from '../game-core.js';

test('Caminar llega al destino sin sobrepasarlo y mantiene la velocidad en diagonal', () => {
  assert.deepEqual(moveTowards({x:100,y:100},{x:103,y:104},20),{x:103,y:104});
  const point=moveTowards({x:100,y:100},{x:200,y:200},10);
  assert.ok(Math.abs(Math.hypot(point.x-100,point.y-100)-10)<1e-10);
  assert.deepEqual(moveTowards({x:100,y:100},{x:100,y:100},10),{x:100,y:100});
});
test('El personaje permanece dentro del mundo y solo interactúa con rincones cercanos', () => {
  assert.deepEqual(clampPoint({x:-100,y:2000}),{x:65,y:835});
  const stations=[{id:'far',x:300,y:300},{id:'near',x:105,y:105}];
  assert.equal(nearestStation({x:100,y:100},stations,82).id,'near');
  assert.equal(nearestStation({x:800,y:800},stations,82),null);
});
