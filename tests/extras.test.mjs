import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createExtras} from '../extras.js';
test('Restaurar suspende el guardado anterior antes de escribir la copia y recargar',async()=>{
 const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:true,value:'',files:[]});return nodes.get(id);};
 const old={document:globalThis.document,localStorage:globalThis.localStorage,location:globalThis.location};
 const calls=[];let blocked=false;
 globalThis.document={getElementById:node,querySelectorAll:()=>[]};
 globalThis.localStorage={setItem:(key,value)=>{assert.equal(blocked,true);calls.push([key,value]);}};
 globalThis.location={reload:()=>{assert.equal(blocked,true);calls.push(['reload']);}};
 try{
  createExtras({getData:()=>({}),save:()=>{},position:()=>({x:100,y:100}),renderDecorations:()=>{},stop:()=>{},beforeRestore:value=>{blocked=value;}});
  const game={plots:{flowers:[],daisies:[]},position:{x:333,y:444}};
  await node('import-garden').onchange({target:{files:[{size:100,text:async()=>JSON.stringify({format:'isis-garden',version:1,game})}],value:'copy'}});
  assert.equal(node('confirm-import').hidden,false);node('confirm-import').onclick();
  assert.deepEqual(JSON.parse(calls[0][1]).position,{x:333,y:444});assert.equal(calls.at(-1)[0],'reload');
 }finally{Object.assign(globalThis,old);}
});
test('La copia descargada conserva cartas, decoración, posición y películas y puede importarse',async()=>{
 const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{});return nodes.get(id);};
 const old={document:globalThis.document,localStorage:globalThis.localStorage};
 const originalCreate=URL.createObjectURL,originalRevoke=URL.revokeObjectURL;
 let blob,downloaded=false;const game={plots:{flowers:[{type:'daisy',stage:3}],daisies:[]},letters:['Para ti'],decorations:[{type:'lamp',x:400,y:500}],position:{x:300,y:600}};
 globalThis.document={getElementById:node,querySelectorAll:()=>[],createElement:()=>({click:()=>{downloaded=true;}})};
 globalThis.localStorage={getItem:key=>key==='isis-peliculas'?'[{"name":"Una película","note":"Juntos"}]':null};
 URL.createObjectURL=value=>{blob=value;return 'blob:test';};URL.revokeObjectURL=()=>{};
 try{createExtras({getData:()=>game,save:()=>{},position:()=>game.position,renderDecorations:()=>{},stop:()=>{},beforeRestore:()=>{}});node('export-garden').onclick();assert.equal(downloaded,true);const copy=JSON.parse(await blob.text());assert.deepEqual(copy.game,game);assert.equal(JSON.parse(copy.extra['isis-peliculas'])[0].name,'Una película');assert.equal(copy.format,'isis-garden');}finally{Object.assign(globalThis,old);URL.createObjectURL=originalCreate;URL.revokeObjectURL=originalRevoke;}
});
