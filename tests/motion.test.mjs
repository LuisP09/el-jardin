import { test } from 'node:test';
import assert from 'node:assert/strict';
import { approach, dampPoint, movementFacing, walkingPose } from '../motion.js';

test('Arrancar y frenar no sobrepasa la velocidad objetivo', () => {
  let speed=0;
  for(let i=0;i<30;i++)speed=approach(speed,145,600/30);
  assert.equal(speed,145);
  for(let i=0;i<30;i++)speed=approach(speed,0,850/30);
  assert.equal(speed,0);
});
test('Luci se aproxima sin rebasar al personaje y no depende de la frecuencia de pantalla', () => {
  const start={x:10,y:20},target={x:200,y:120};
  const one=dampPoint(start,target,7,1);
  let many={...start};for(let i=0;i<30;i++)many=dampPoint(many,target,7,1/30);
  assert.ok(Math.abs(one.x-many.x)<1e-10);
  assert.ok(Math.abs(one.y-many.y)<1e-10);
  assert.ok(one.x>=start.x&&one.x<=target.x);
  assert.deepEqual(dampPoint(start,target,7,0),start);
});
test('El personaje mira hacia el movimiento, conserva su orientación al parar y respeta la pausa', () => {
  assert.equal(movementFacing(-2,.5),'left');assert.equal(movementFacing(0,-3),'up');
  assert.equal(movementFacing(0,0,'right'),'right');
  const muted=walkingPose(10,100,true,true);
  assert.ok(Object.values(muted).every(value=>value===0));
  const walking=walkingPose(8,1,true,false);
  assert.equal(walking.leftLeg,-walking.rightLeg);
  assert.ok(Math.abs(walking.bob)<=1.6);
});
