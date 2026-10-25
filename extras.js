import {parseBackup} from './daily-core.js';
export function createExtras({getData,save,position,renderDecorations,stop,beforeRestore}){
 const $=id=>document.getElementById(id);let selected=-1;
 const labels={pot:'Maceta',lamp:'Farolito',bench:'Banca',stone:'Piedras'};
 function render(){
  const data=getData();$('decoration-list').replaceChildren();
  data.decorations.forEach((d,i)=>{const b=document.createElement('button');b.textContent=`${labels[d.type]} ${i+1}`;b.setAttribute('aria-pressed',String(selected===i));b.onclick=()=>{selected=i;render();};$('decoration-list').append(b);});
  $('move-decoration').disabled=selected<0||!data.decorations[selected];$('remove-decoration').disabled=$('move-decoration').disabled;
 }
 $('open-personalize').onclick=()=>{stop();$('backpack').close();render();$('personalize-dialog').showModal();};
 $('close-personalize').onclick=()=>$('personalize-dialog').close();
 document.querySelectorAll('[data-decoration]').forEach(b=>b.onclick=()=>{const data=getData();if(data.decorations.length>=30){$('extras-status').textContent='Puedes mover o quitar alguna de tus 30 decoraciones.';return;}data.decorations.push({type:b.dataset.decoration,...position()});selected=data.decorations.length-1;save();renderDecorations();render();$('extras-status').textContent='Colocada donde está Isis. Para cambiarla de lugar, camina a otro punto y elige «Traer aquí».';});
 $('move-decoration').onclick=()=>{const d=getData().decorations[selected];if(d){Object.assign(d,position());save();renderDecorations();$('extras-status').textContent='Tu decoración ya está junto a Isis.';}};
 $('remove-decoration').onclick=()=>{getData().decorations.splice(selected,1);selected=-1;save();renderDecorations();render();};
 $('export-garden').onclick=()=>{save();const keys=['jardin-flores','isis-peliculas'];const extra=Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]));const blob=new Blob([JSON.stringify({format:'isis-garden',version:1,game:getData(),extra},null,2)],{type:'application/json'});const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='jardin-de-isis.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('extras-status').textContent='Copia preparada. Guárdala en un lugar que puedas abrir desde el otro celular.';};
 let pending=null;
 $('import-garden').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>1000000)throw Error('El archivo es demasiado grande.');pending=parseBackup(await file.text());$('confirm-import').hidden=false;$('extras-status').textContent='Copia válida. «Restaurar esta copia» sustituirá el jardín de este dispositivo; puedes exportarlo primero.';}catch(error){pending=null;$('confirm-import').hidden=true;$('extras-status').textContent=error.message;}finally{e.target.value='';}};
 $('confirm-import').onclick=()=>{if(!pending)return;try{beforeRestore(true);localStorage.setItem('isis-game-v2',JSON.stringify(pending.game));for(const k of ['jardin-flores','isis-peliculas'])if(typeof pending.extra?.[k]==='string')localStorage.setItem(k,pending.extra[k]);location.reload();}catch{beforeRestore(false);$('extras-status').textContent='No se pudo guardar la copia. Tu navegador puede estar sin espacio.';}};
}
