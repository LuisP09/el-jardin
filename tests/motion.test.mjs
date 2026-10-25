import { test } from 'node:test';
import assert from 'node:assert/strict';
import { approach, dampPoint, movementFacing, walkingPose, movementSteps, WALK_SPEED, WALK_ACCELERATION } from '../motion.js';
import {walkStep} from '../world-layout.js';

test('El avance mantiene su velocidad a 10, 15, 30, 60 y 120 cuadros por segundo', () => {
  const distances=[10,15,30,60,120].map(fps=>{
    let position={x:500,y:1000},speed=0;
    for(let frame=0;frame<fps*2;frame++)for(const dt of movementSteps(1/fps)){
      speed=approach(speed,WALK_SPEED,WALK_ACCELERATION*dt);
      position=walkStep(position,{x:1800,y:1000},speed*dt);
    }
    return position.x-500;
  });
  assert.ok(Math.min(...distances)>385);
  assert.ok(Math.max(...distances)-Math.min(...distances)<2);
});

test('Un cuadro lento conserva el tiempo en pasos pequeños y una pausa larga no teletransporta', () => {
  const steps=movementSteps(.1);
  assert.ok(Math.abs(steps.reduce((sum,dt)=>sum+dt,0)-.1)<1e-10);
  assert.ok(steps.every(dt=>dt<=1/120));
  assert.ok(movementSteps(30).reduce((sum,dt)=>sum+dt,0)<=.15000001);
  for(const value of [0,-1,NaN,Infinity])assert.deepEqual(movementSteps(value),[]);
});

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
