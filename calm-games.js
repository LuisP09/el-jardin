import {BLOOMS,flowerRound,lightSequence,followLight,chooseDifferent} from './calm-games-core.js';
import {POSTCARD_THEMES,postcardArt} from './calm-postcards.js';
import {gardenIcon} from './garden-art.js';
const GAMES={postcard:['Ventanas del jardín','Descubre una pequeña postal, hoja a hoja.','❦'],flowers:['Un ramo escondido','Busca pequeños detalles entre las flores.','❀'],lights:['El sendero de Luci','Sigue un caminito de luces, con ayuda o de memoria.','✧'],clouds:['Nubes de paso','Dale un lugar a una idea y déjala pasar un ratito.','☁']};
const LIGHTS=[['Luna','☾','#e6d5a0'],['Flor','❀','#dfadae'],['Hoja','❧','#a9c49c'],['Estrella','✧','#c0bbdf']];
export function createCalmGames({body,status,keep,onComplete}){
 let cleanup=()=>{},lastGame=null,lastGoal=null,length=3,flowerSize=16,guided=true,lastPostcard=null;
 const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 const button=(text,action,cls='phase-button')=>{const b=node('button',text,cls);b.type='button';b.onclick=action;return b;};
 const paint=(element,id)=>{element.innerHTML=gardenIcon(id);return element;};
 function souvenirActions(key){const actions=node('div',null,'souvenir-actions');actions.hidden=true;actions.append(button('Guardar en mi cuaderno',()=>keep(key)),button('Poner junto a Isis',()=>keep(key,true)));return actions;}
 function clear(){cleanup();cleanup=()=>{};body.replaceChildren();status('');}
 function home(){clear();const heading=node('div',null,'calm-intro');heading.append(node('span','✧','calm-emblem'),node('h3','¿Qué tipo de ratito necesitas?'),node('p','No tienes que cambiar cómo te sientes para estar aquí. Puedes elegir algo pequeño o solo mirar.'));body.append(heading);const paths=node('div',null,'calm-shortcuts');paths.setAttribute('aria-label','Elegir un tipo de actividad');for(const [text,id]of [['Algo sencillo','postcard'],['Ocupar mi atención','flowers'],['Dejar una idea aquí','clouds']])paths.append(button(text,()=>open(id)));body.append(paths);const grid=node('div',null,'calm-game-shelf');for(const[id,[title,description,symbol]]of Object.entries(GAMES)){const b=button('',()=>open(id),'calm-game-card');b.dataset.game=id;b.append(paint(node('span',null,'calm-card-symbol'),id==='flowers'?'daisy':id),node('strong',title),node('small',description));grid.append(b);}body.append(grid,button('Luci, elige uno para mí',()=>open(chooseDifferent(Object.keys(GAMES),lastGame))));}
 function open(id){clear();lastGame=id;const nav=node('div',null,'calm-game-nav');nav.append(button('← Otros juegos',home),node('h3',GAMES[id][0]));body.append(nav);({postcard,flowers,lights,clouds}[id])();body.scrollTop=0;}
 function postcard(){
  lastPostcard=chooseDifferent(POSTCARD_THEMES,lastPostcard);const art=postcardArt(lastPostcard);
  body.append(node('p','Aparta las hojas que quieras para descubrir el paisaje. También puedes verlo entero; no hace falta completar nada.','calm-instruction'));
  const frame=node('div',null,'calm-postcard'),picture=node('div',null,'calm-postcard-picture');picture.innerHTML=art.svg;picture.setAttribute('aria-hidden','true');const leaves=node('div',null,'calm-postcard-leaves');leaves.setAttribute('role','group');leaves.setAttribute('aria-label','Hojas que cubren la postal');let revealed=0;
  const caption=node('p','Un pequeño paisaje espera bajo las hojas.','calm-postcard-caption');
  const messages=['No tienes que hacerlo todo hoy. Una hoja puede ser suficiente.','Aquí puedes ir despacio, sin tener que explicar nada.','Si hoy pesa un poquito, este rincón también es para ti.','Puedes quedarte con este color un momento.'];
  const keepsake=souvenirActions('postcard:'+lastPostcard);
  function revealAll(){keepsake.hidden=false;onComplete?.('postcard');for(const b of leaves.children){b.disabled=true;b.classList.add('revealed');}picture.setAttribute('aria-hidden','false');caption.textContent=art.title;status(art.caption);}
  for(let i=0;i<12;i++){const b=button('❧',()=>{b.disabled=true;b.classList.add('revealed');revealed++;if(revealed===12)revealAll();else{caption.textContent='El paisaje va apareciendo, a tu manera.';if(revealed===1||revealed===5||revealed===9)status(chooseDifferent(messages,null));}},'calm-postcard-leaf');b.setAttribute('aria-label',`Apartar hoja ${i+1}`);leaves.append(b);}
  frame.append(picture,leaves);body.append(frame,caption,keepsake,button('Ver la postal completa',revealAll),button('Descubrir otro paisaje',()=>open('postcard')));
 }
 function flowers(){
  const round=flowerRound(lastGoal,Math.random,{size:flowerSize});lastGoal=round.goal;const goal=BLOOMS.find(b=>b.id===round.goal);let found=0;
  const density=node('div',null,'phase-actions');for(const [size,text]of [[9,'Poquitas flores'],[16,'Jardín completo']]){const b=button(text,()=>{flowerSize=size;open('flowers');});b.setAttribute('aria-pressed',String(flowerSize===size));density.append(b);}body.append(density);
  const prompt=node('p',`Encuentra tres ${goal.name}. Puedes mirar todo el tiempo que quieras.`,'calm-instruction');
  const bouquet=node('div',null,'calm-bouquet');bouquet.setAttribute('aria-hidden','true');bouquet.textContent='·  ·  ·';
  const field=node('div',null,'calm-flower-field');field.setAttribute('role','group');field.setAttribute('aria-label','Flores para explorar');
  field.classList.toggle('sparse',flowerSize===9);
  const keepsake=souvenirActions('bouquet:'+round.goal);
  const next=button('Buscar otro ramo',flowersAgain);next.hidden=true;
  function flowersAgain(){open('flowers');}
  round.tiles.forEach((id,i)=>{const bloom=BLOOMS.find(b=>b.id===id),b=button('',()=>{
   if(id!==round.goal){status(`Esta es otra pequeña belleza. Busca ${goal.name}; no hay prisa.`);return;}
   b.disabled=true;b.classList.add('picked');b.setAttribute('aria-label',`${goal.name}, recogida`);found++;bouquet.textContent=Array(found).fill(goal.symbol).join('  ');
   status(found===3?'Tu ramo ya tiene su lugar. Puedes quedarte mirándolo, buscar otro o cambiar de juego.':`Una flor para tu ramo. Quedan ${3-found} por encontrar.`);
   if(found===3){keepsake.hidden=false;onComplete?.('flowers');next.hidden=false;field.classList.add('finished');}
  },'calm-bloom');b.style.setProperty('--bloom',bloom.color);b.style.setProperty('--lean',`${(i%3-1)*9}deg`);b.append(paint(node('span'),bloom.id),node('small',bloom.id==='sun'?'Girasol':bloom.id==='daisy'?'Margarita':bloom.id==='rose'?'Flor rosa':'Hoja'));b.setAttribute('aria-label',`${bloom.name}, lugar ${i+1}`);field.append(b);});
  body.append(prompt,bouquet,field,keepsake,next,button('Cambiar el paisaje',flowersAgain));
 }
 function lights(){
  let sequence=lightSequence(length),progress=0,showing=true;
  body.append(node('p','Sigue las luces en orden. Con Luci el camino queda a la vista; de memoria puedes volver a mirarlo cuando quieras.','calm-instruction'));
  const sizes=node('div',null,'phase-actions');for(const n of [3,4,5]){const b=button(`${n} luces`,()=>{length=n;open('lights');});b.setAttribute('aria-pressed',String(n===length));sizes.append(b);}body.append(sizes);
  const keepsake=souvenirActions('light:luci');
  const trail=node('ol',null,'calm-light-trail');sequence.forEach((id,i)=>{const item=node('li');item.append(paint(node('span'),['moon','daisy','leaf','star'][id]),node('small',`${i+1}. ${LIGHTS[id][0]}`));trail.append(item);});
  const message=node('p','Mira las luces y elige «Ya lo vi» cuando quieras.','calm-instruction');
  const toggle=button('Ya lo vi',()=>{showing=!showing;trail.classList.toggle('concealed',!showing);toggle.textContent=showing?'Seguir mi camino':'Volver a mirar';message.textContent=showing?'Aquí está el camino. Puedes seguir desde donde ibas.':`Busca la luz ${progress+1} del camino.`;});
  const modes=node('div',null,'phase-actions');modes.setAttribute('aria-label','Ayuda para seguir las luces');
  for(const [value,text]of [[true,'Con Luci'],[false,'De memoria']]){const b=button(text,()=>{guided=value;showing=true;trail.classList.remove('concealed');toggle.hidden=guided;toggle.textContent='Ya lo vi';message.textContent=guided?'El camino se queda a la vista. Seguimos desde donde ibas.':'Mira el camino. Puedes ocultarlo cuando quieras.';[...modes.children].forEach(item=>item.setAttribute('aria-pressed',String(item===b)));});b.setAttribute('aria-pressed',String(guided===value));modes.append(b);}
  toggle.hidden=guided;if(guided)message.textContent='El camino se queda a la vista. Toca sus luces, una a una.';
  const pad=node('div',null,'calm-light-pad');const again=button('Otro caminito',()=>open('lights'));again.hidden=true;
  LIGHTS.forEach(([name,symbol,color],id)=>{const b=button('',()=>{
   if(showing&&!guided){status('Cuando quieras, toca «Ya lo vi». También puedes seguir mirando.');return;}
   const result=followLight(sequence,progress,id);progress=result.progress;
   [...trail.children].forEach((item,i)=>item.classList.toggle('reached',i<progress));
   if(result.complete){keepsake.hidden=false;onComplete?.('lights');showing=true;trail.classList.remove('concealed');toggle.hidden=true;again.hidden=false;message.textContent='Un pequeño camino encendido por ti.';status('Luci se queda contigo. Puedes probar otro camino o elegir algo diferente.');pad.querySelectorAll('button').forEach(b=>b.disabled=true);modes.querySelectorAll('button').forEach(b=>b.disabled=true);}
   else if(result.matched){message.textContent=`Ahora busca la luz ${progress+1} del camino.`;status('Esa luz se queda encendida. Seguimos desde aquí.');}
   else{status(`Tu camino sigue intacto. Si te apetece una pista, la siguiente luz es ${LIGHTS[sequence[progress]][0].toLowerCase()}.`);}
  },'calm-light');b.style.setProperty('--bloom',color);b.append(paint(node('span'),['moon','daisy','leaf','star'][id]),node('small',name));pad.append(b);});
  body.append(modes,trail,message,toggle,pad,keepsake,again);
 }
 function clouds(){
  body.append(node('p','No hace falta resolver cada idea ahora. Puedes ponerle un nombre breve o dejar la nube sin palabras.','calm-instruction'));
  const sky=node('div',null,'calm-cloud-sky'),cloud=node('div',null,'calm-thought-cloud');cloud.append(paint(node('span'),'clouds'),node('p','Una idea de paso'));sky.append(cloud);body.append(sky);
  const form=node('form',null,'calm-cloud-form'),label=node('label','Un nombre para esta nube (opcional)'),input=node('input');input.id='calm-thought';input.maxLength=80;input.autocomplete='off';input.setAttribute('autocapitalize','sentences');label.htmlFor=input.id;input.placeholder='Algo que puedo dejar aquí un ratito';const name=button('Ponerlo en la nube',()=>{});name.type='submit';form.append(label,input,name);form.onsubmit=e=>{e.preventDefault();cloud.classList.remove('passing');cloud.querySelector('p').textContent=input.value.trim()||'Una idea de paso';input.value='';status('Tu nube puede estar aquí. No tienes que hacer nada con ella todavía.');};
  const nextSteps=node('div',null,'calm-next-steps');nextSteps.hidden=true;nextSteps.append(node('p','¿Te apetece algo pequeño ahora?'),button('Mirar un paisaje',()=>open('postcard')),button('Buscar unas flores',()=>{flowerSize=9;open('flowers');}),button('Volver a pasear',()=>body.closest('dialog').close()));
  const release=button('Dejar pasar esta nube',()=>{cloud.querySelector('p').textContent='☁';input.value='';cloud.classList.add('passing');nextSteps.hidden=false;lastCloudMessage=chooseDifferent(['Puedes volver al jardín sin resolverlo todo ahora.','Una idea puede pasar sin que tengas que seguirla.','Por un ratito, puedes dejar esa idea a un lado.'],lastCloudMessage);status(lastCloudMessage);});
  const another=button('Una nube nueva',()=>{cloud.classList.remove('passing');cloud.querySelector('p').textContent='Una idea de paso';input.value='';status('Aquí hay espacio para empezar de nuevo, o simplemente mirar el cielo.');});
  body.append(form,node('small','Lo que escribas no se guarda ni se envía.','calm-privacy'),release,another,nextSteps);
  cleanup=()=>{input.value='';cloud.querySelector('p').textContent='';};
 }
 let lastCloudMessage=null;
 return {open:home,dispose:()=>{cleanup();cleanup=()=>{};}};
}
