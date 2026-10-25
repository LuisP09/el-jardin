import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BLOOMS,flowerRound,lightSequence,followLight,drawingLayout,shuffle,chooseDifferent} from '../calm-games-core.js';
import {POSTCARD_THEMES,postcardArt} from '../calm-postcards.js';
function random(seed){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;};}
test('Cada ramo tiene exactamente tres flores objetivo, cuatro tipos y cambia de objetivo',()=>{
 let previous=null;const rng=random(8),layouts=new Set();
 for(let i=0;i<150;i++){
  const round=flowerRound(previous,rng);assert.notEqual(round.goal,previous);
  assert.equal(round.tiles.length,16);assert.equal(round.tiles.filter(id=>id===round.goal).length,3);
  assert.equal(new Set(round.tiles).size,BLOOMS.length);layouts.add(round.tiles.join());previous=round.goal;
 }
 assert.ok(layouts.size>140);
});
test('El jardín pequeño conserva tres objetivos y los cuatro tipos sin exigir más búsqueda',()=>{
 for(let seed=0;seed<50;seed++){
  const round=flowerRound(null,random(seed),{size:9});
  assert.equal(round.tiles.length,9);assert.equal(round.tiles.filter(id=>id===round.goal).length,3);
  assert.equal(new Set(round.tiles).size,4);
 }
 assert.equal(flowerRound(null,random(1),{size:10000}).tiles.length,16);
});
test('Las tres postales son ilustraciones locales distintas y una elección desconocida tiene respaldo',()=>{
 assert.equal(POSTCARD_THEMES.length,3);
 const art=POSTCARD_THEMES.map(id=>postcardArt(id));
 assert.equal(new Set(art.map(item=>item.svg)).size,3);
 for(const item of art){assert.ok(item.title&&item.caption);assert.match(item.svg,/viewBox="0 0 480 360"/);assert.doesNotMatch(item.svg,/<script|<foreignObject|href=|<image/);}
 assert.equal(postcardArt('desconocido').title,postcardArt('sun').title);
});
test('Los caminos tienen la longitud elegida, símbolos válidos y no repiten luces consecutivas',()=>{
 for(const count of [3,4,5])for(let seed=0;seed<100;seed++){
  const seq=lightSequence(count,random(seed));assert.equal(seq.length,count);
  seq.forEach((id,i)=>{assert.ok(id>=0&&id<=3);assert.notEqual(id,seq[i-1]);});
 }
 assert.equal(lightSequence(100).length,3);
});
test('Explorar otra luz no borra el avance y se puede terminar sin límite de intentos',()=>{
 const seq=[1,3,0];let progress=followLight(seq,0,1).progress;
 for(let i=0;i<20;i++){const result=followLight(seq,progress,2);assert.equal(result.progress,1);assert.equal(result.complete,false);}
 progress=followLight(seq,progress,3).progress;
 assert.deepEqual(followLight(seq,progress,0),{progress:3,complete:true,matched:true});
 assert.equal(followLight(seq,3,1).progress,3);
});
test('Los nuevos diseños dejan separados los objetivos táctiles de pétalos y estrellas',()=>{
 for(let seed=0;seed<100;seed++){
  const points=drawingLayout(random(seed));assert.equal(points.length,7);
  for(const [x,y]of points){assert.ok(x>=23&&x<=217);assert.ok(y>=20&&y<=168);}
  for(let i=0;i<7;i++)for(let j=i+1;j<7;j++)assert.ok(Math.hypot(points[i][0]-points[j][0],points[i][1]-points[j][1])>44);
 }
});
test('Las propuestas se barajan sin perder opciones ni modificar las originales',()=>{
 const choices=['color','textura','sonido','cielo'],mixed=shuffle(choices,random(3));
 assert.deepEqual([...mixed].sort(),[...choices].sort());assert.equal(choices[0],'color');
 for(const prior of choices)assert.notEqual(chooseDifferent(choices,prior),prior);
});
