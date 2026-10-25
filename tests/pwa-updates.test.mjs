import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../pwa.js',import.meta.url),'utf8');

function setup({controlled=true,waiting=false,preview=false}={}){
  const target=()=>({events:{},addEventListener(name,fn){this.events[name]=fn;}});
  const elements=Object.fromEntries(['install-app','update-app','check-update','quick-update','pwa-status','open-install'].map(id=>[id,{...target(),hidden:['update-app','check-update','quick-update'].includes(id),textContent:'',click(){this.onclick?.();}}]));
  let checks=0,reloads=0,saves=0,fail=false,sent=0;
  const registration={...target(),waiting:waiting?{postMessage(){sent++;}}:null,installing:null,async update(){checks++;if(fail)throw Error('offline');}};
  const serviceWorker={...target(),controller:controlled?{}:null,ready:Promise.resolve(),async register(path,options){assert.equal(options.updateViaCache,'none');return registration;}};
  const window={...target(),matchMedia:()=>({matches:false}),isSecureContext:true,setInterval(){},dispatchEvent(event){if(event.type==='garden-before-update')saves++;}};
  const document={...target(),hidden:false,querySelector:selector=>elements[selector.slice(1)]};
  vm.runInNewContext(source,{window,document,navigator:{serviceWorker},location:{hostname:'localhost',search:preview?'?preview=1':'',reload(){reloads++;}},URLSearchParams,Date,Event});
  return {elements,window,document,registration,serviceWorker,stats:()=>({checks,reloads,saves,sent}),offline:()=>{fail=true;}};
}
test('Detecta novedades al abrir y volver al jardín sin recargar durante el juego',async()=>{
  const h=setup({waiting:true});await h.window.events.load();
  assert.equal(h.elements['quick-update'].hidden,false);
  assert.equal(h.elements['update-app'].hidden,false);
  assert.equal(h.stats().reloads,0);
  h.window.events.focus();h.window.events.online();
  assert.equal(h.stats().checks,1); // evita peticiones repetidas al recuperar conexión/foco
  h.elements['update-app'].onclick();
  assert.equal(h.stats().saves,1);assert.equal(h.stats().sent,1);
  h.serviceWorker.events.controllerchange();h.serviceWorker.events.controllerchange();
  assert.equal(h.stats().reloads,1);
});
test('La búsqueda manual informa del fallo offline y no altera la partida',async()=>{
  const h=setup();await h.window.events.load();await Promise.resolve();h.offline();
  await h.elements['check-update'].onclick();
  assert.match(h.elements['pwa-status'].textContent,/conexión/);
  assert.equal(h.elements['check-update'].disabled,false);
  assert.equal(h.stats().reloads,0);assert.equal(h.stats().saves,0);
});
test('La primera instalación no anuncia una actualización; otra pestaña sí permite recargar después',async()=>{
  const h=setup({controlled:false});await h.window.events.load();
  h.serviceWorker.events.controllerchange();
  assert.equal(h.elements['quick-update'].hidden,true);
  h.serviceWorker.events.controllerchange();
  assert.equal(h.elements['quick-update'].hidden,false);
  assert.equal(h.stats().reloads,0);
  h.elements['update-app'].onclick();assert.equal(h.stats().reloads,1);
});
test('La vista previa no registra workers ni ofrece instalar o actualizar',()=>{
  const h=setup({preview:true});assert.equal(h.window.events.load,undefined);
  assert.equal(h.elements['check-update'].hidden,true);
  assert.match(h.elements['pwa-status'].textContent,/Vista previa/);
});
