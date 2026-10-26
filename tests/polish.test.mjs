import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createJournal} from '../journal.js';
import {restoreJournal} from '../journal-core.js';
import {paginateCards} from '../game-menus.js';

function documentFixture(){
 const doc={nodes:[],createElement(tag){const e={tagName:tag.toUpperCase(),children:[],attributes:{},className:'',value:'',hidden:false,disabled:false,_text:'',append(...items){this.children.push(...items);},replaceChildren(...items){this.children=[...items];},setAttribute(name,value){this.attributes[name]=value;},focus(){doc.activeElement=this;},after(node){this.afterNode=node;},get textContent(){return this._text+this.children.map(c=>c.textContent).join('');},set textContent(value){this._text=String(value);this.children=[];}};e.classList={contains:name=>e.className.split(' ').includes(name),add:name=>{e.className+=' '+name;}};doc.nodes.push(e);return e;}};
 doc.byId=id=>doc.nodes.find(e=>e.id===id);doc.byClass=name=>doc.nodes.find(e=>e.classList.contains(name));doc.button=text=>doc.nodes.find(e=>e.tagName==='BUTTON'&&e.textContent===text);
 return doc;
}
function journalFixture(){
 const previous=globalThis.document,doc=documentFixture();globalThis.document=doc;
 const note={id:'a',title:'Nota de prueba',text:'Texto guardado',created:'2026-10-25',updated:'2026-10-25'};
 const state=restoreJournal({entries:[note],draft:{id:'a',title:note.title,text:note.text}});let message='';
 const journal=createJournal({body:doc.createElement('div'),getState:()=>state,save:()=>true,status:text=>{message=text;}});journal.open();
 return {doc,state,message:()=>message,close(){journal.dispose();globalThis.document=previous;}};
}
test('Tocar la nota que se está editando conserva el texto sin guardar',()=>{
 const f=journalFixture();try{
  const words=f.doc.byId('journal-words');words.value='Una edición que todavía no guardé';words.oninput();
  f.doc.byClass('journal-list').children[0].onclick();
  assert.equal(words.value,'Una edición que todavía no guardé');assert.equal(f.state.draft.text,words.value);
  assert.equal(f.state.entries[0].text,'Texto guardado');
 }finally{f.close();}
});
test('Deshacer eliminación recupera la nota sin reemplazar un borrador nuevo',()=>{
 const f=journalFixture();try{
  f.doc.button('Quitar esta nota').onclick();const words=f.doc.byId('journal-words'),title=f.doc.byId('journal-title');
  title.value='Nuevo pensamiento';title.oninput();words.value='No quiero perder este borrador';words.oninput();
  f.doc.button('Deshacer última eliminación').onclick();
  assert.equal(f.state.entries.length,1);assert.equal(f.state.entries[0].id,'a');
  assert.equal(words.value,'No quiero perder este borrador');assert.equal(title.value,'Nuevo pensamiento');assert.equal(f.state.draft.id,null);assert.match(f.message(),/borrador actual sigue intacto/);
 }finally{f.close();}
});
test('Un borrador con solo título no desaparece al pulsar Nueva o elegir otra nota',()=>{
 const f=journalFixture();try{
  f.doc.button('Nueva nota').onclick();const title=f.doc.byId('journal-title');title.value='Una idea que retomaré';title.oninput();
  f.doc.button('Nueva nota').onclick();assert.equal(title.value,'Una idea que retomaré');
  f.doc.byClass('journal-list').children[0].onclick();assert.equal(title.value,'Una idea que retomaré');assert.match(f.message(),/título y texto/);
 }finally{f.close();}
});
test('El cuaderno retoma una página válida y comunica la página elegida al cambiarla',()=>{
 const previous=globalThis.document,doc=documentFixture();globalThis.document=doc;
 try{
  const make=()=>{const container=doc.createElement('div');for(let i=0;i<3;i++)container.append(doc.createElement('article'));return container;};
  let page=-1;const first=make();paginateCards(first,{initialPage:99,onPageChange:value=>{page=value;}});
  assert.equal(page,2);assert.equal(first.children[2].hidden,false);assert.equal(first.afterNode.children[2].disabled,true);
  first.afterNode.children[0].onclick();assert.equal(page,1);
  const rebuilt=make();paginateCards(rebuilt,{initialPage:page});assert.equal(rebuilt.children[1].hidden,false);assert.equal(rebuilt.afterNode.children[1].textContent,'Página 2 de 3');
 }finally{globalThis.document=previous;}
});
