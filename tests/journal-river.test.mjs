import {test} from 'node:test';
import assert from 'node:assert/strict';
import {restoreJournal,commitNote,NOTE_LIMIT} from '../journal-core.js';
import {restorePhaseTwo} from '../phase-two-core.js';
import {renewDay,parseBackup} from '../daily-core.js';
import {riverSceneSVG,floatingArt} from '../river-scene.js';

test('Crear y editar notas conserva la identidad, la fecha original y no duplica entradas',()=>{
 const journal=restoreJournal();journal.draft={id:null,title:' Mi rincón ',text:'Un pensamiento para conservar.'};
 assert.equal(commitNote(journal,'2026-10-25T15:00:00.000Z','note-1').ok,true);
 journal.draft.text='El pensamiento con un detalle más.';
 commitNote(journal,'2026-10-26T15:00:00.000Z','unused');
 assert.equal(journal.entries.length,1);assert.equal(journal.entries[0].id,'note-1');assert.equal(journal.entries[0].title,'Mi rincón');
 assert.equal(journal.entries[0].created,'2026-10-25T15:00:00.000Z');assert.match(journal.entries[0].updated,/2026-10-26/);
});
test('Las notas y el borrador sobreviven al día nuevo, la copia y las partidas antiguas migran vacías',()=>{
 const phase2=restorePhaseTwo();phase2.journal.draft.text='Borrador que puedo retomar.';
 const game={phase2,gardenDate:'2026-10-25',plots:{flowers:[],daisies:[]}};renewDay(game,'2026-10-26');
 const backup=parseBackup(JSON.stringify({format:'isis-garden',version:1,game}));
 assert.equal(restorePhaseTwo(backup.game.phase2).journal.draft.text,'Borrador que puedo retomar.');
 assert.deepEqual(restorePhaseTwo({flowers:{sol:3}}).journal,restoreJournal());
});
test('Restaurar limita tamaño, elimina IDs duplicados y mantiene el texto literal sin convertirlo en HTML',()=>{
 const source={entries:[{id:'same',text:'<script>solo texto</script>',title:'a'.repeat(100),created:'bad'},{id:'same',text:'duplicado'},{id:'empty',text:'  '}],draft:{title:'b'.repeat(200),text:'c'.repeat(9000)}};
 const result=restoreJournal(source);assert.equal(result.entries.length,1);assert.equal(result.entries[0].title.length,80);assert.match(result.entries[0].text,/<script>/);
 assert.equal(result.draft.text.length,3000);assert.equal(result.draft.title.length,80);
 assert.deepEqual(restoreJournal(null),{entries:[],draft:{id:null,title:'',text:''}});
});
test('No se guardan notas vacías y el límite no impide editar las existentes',()=>{
 const journal=restoreJournal();assert.equal(commitNote(journal,'2026-10-25','empty').reason,'empty');
 for(let i=0;i<NOTE_LIMIT;i++){journal.draft={id:null,title:'Nota',text:'Texto'};commitNote(journal,'2026-10-25',`note-${i}`);}
 journal.draft={id:null,title:'Otra',text:'Texto'};assert.equal(commitNote(journal,'2026-10-25','overflow').reason,'full');
 journal.draft={...journal.entries[0]};journal.draft.text='Edición';assert.equal(commitNote(journal,'2026-10-26','unused').ok,true);
 assert.equal(journal.entries.length,NOTE_LIMIT);
});
test('Barcos y patos están dentro de la capa de agua anterior al puente; Isis queda sobre el puente',()=>{
 const svg=riverSceneSVG(),water=svg.indexOf('id="river-floaters"'),boats=svg.indexOf('id="river-boats"'),ducks=svg.indexOf('id="river-ducks"'),bridge=svg.indexOf('id="river-bridge"'),avatar=svg.indexOf('id="river-avatar"');
 assert.ok(water<boats&&boats<ducks&&ducks<bridge&&bridge<avatar);assert.match(svg,/id="river-floaters" clip-path="url\(#river-water-clip\)"/);
 assert.notEqual(floatingArt('duck'),floatingArt('boat'));assert.doesNotMatch(svg,/<script|<foreignObject/);
});
test('Los patos se conservan en la partida sin aceptar cantidades inválidas o ilimitadas',()=>{
 assert.equal(restorePhaseTwo({ducks:3}).ducks,3);assert.equal(restorePhaseTwo({ducks:999}).ducks,5);
 assert.equal(restorePhaseTwo({ducks:-3}).ducks,0);assert.equal(restorePhaseTwo({ducks:'tres'}).ducks,0);
 assert.equal(restorePhaseTwo(JSON.parse(JSON.stringify(restorePhaseTwo({ducks:4})))).ducks,4);
});
