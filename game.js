import { WORLD, clampPoint, moveTowards, nearestStation, cameraBounds } from './game-core.js';
const el = id => document.getElementById(id);
const svg = el('game-map'), player = el('player'), stage = document.querySelector('.game-stage');
const stations = [
  { id:'flowers', x:470, y:510, icon:'❀', name:'Los girasoles', action:'Sembrar un girasol', memory:'Un pequeño comienzo' },
  { id:'daisies', x:780, y:340, icon:'❁', name:'Las margaritas', action:'Sembrar una margarita', memory:'Flores bajo el cielo' },
  { id:'pond', x:1060, y:690, icon:'◌', name:'El estanque', action:'Sentarme junto al agua', memory:'Un instante presente' },
  { id:'letter', x:260, y:690, icon:'♡', name:'El buzón', action:'Abrir una carta', memory:'Besito en tu pollollo' },
  { id:'stars', x:1060, y:210, icon:'✧', name:'El observatorio', action:'Mirar las estrellas', memory:'Un cielo para Isis' },
  { id:'art', x:1230, y:400, icon:'◌', name:'El taller', action:'Pintar un ratito', memory:'Un trazo a tu manera' },
  { id:'cinema', x:240, y:270, icon:'▷', name:'El cine del bosque', action:'Entrar al pequeño cine', memory:'Una historia compartida' }
];
let data = { entered:false, beds:{flowers:0,daisies:0}, memories:[], day:false };
try {
  const saved=JSON.parse(localStorage.getItem('isis-game-v1')||'null');
  if(saved&&typeof saved==='object') data={entered:saved.entered===true,beds:{flowers:[0,1,2,3].includes(saved.beds?.flowers)?saved.beds.flowers:0,daisies:[0,1,2,3].includes(saved.beds?.daisies)?saved.beds.daisies:0},memories:Array.isArray(saved.memories)?saved.memories.filter(id=>stations.some(s=>s.id===id)):[],day:saved.day===true};
} catch {}
let position={x:660,y:690},target=null,arrival=null,nearby=null,keys=new Set(),lastFrame=0,ambientPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
function save(){try{localStorage.setItem('isis-game-v1',JSON.stringify(data));el('game-saved').textContent='Tu paseo está guardado en este dispositivo.';}catch{el('game-saved').textContent='Tu paseo continúa, pero este navegador no permitió guardarlo.';}}
function say(text,speaker='Luci, la luciérnaga'){
  el('speaker').textContent=speaker;el('game-message').textContent=text;
  el('luci-preview').textContent=text;el('luci-announcement').textContent=text;
  el('companion-panel').classList.toggle('has-message',!luciExpanded);
}
let luciExpanded=false;
function setLuci(expanded){luciExpanded=expanded;el('luci-content').hidden=!expanded;el('toggle-luci').setAttribute('aria-expanded',String(expanded));el('luci-toggle-label').textContent=expanded?'Cerrar ▾':'Leer ▴';if(expanded)el('companion-panel').classList.remove('has-message');}
el('toggle-luci').onclick=()=>setLuci(!luciExpanded);
function remember(id){if(!data.memories.includes(id)){data.memories.push(id);save();}renderBackpack();updateGuide();}
function tree(x,y,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cy="20" rx="36" ry="13" fill="#0d332a" opacity=".2"/><path d="M-5 14L-3-35 7-35 6 14" fill="#6a6750"/><ellipse cy="-46" rx="40" ry="38" fill="#325c49"/><ellipse cx="-20" cy="-40" rx="25" ry="28" fill="#426e50"/><ellipse cx="17" cy="-56" rx="29" ry="32" fill="#527e58"/><ellipse cx="-5" cy="-72" rx="27" ry="26" fill="#658a5e"/></g>`;}
function flower(x,y,daisy=false,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 8v-28" stroke="#8aa86b" stroke-width="2"/><ellipse cx="-5" cy="-3" rx="7" ry="3" fill="#8aa86b" transform="rotate(30 -5 -3)"/>${Array.from({length:daisy?10:12},(_,i)=>`<ellipse cy="-31" rx="${daisy?2.8:3.8}" ry="8" fill="${daisy?'#f6eed2':'#dfb95b'}" transform="rotate(${i*(daisy?36:30)} 0 -23)"/>`).join('')}<circle cy="-23" r="${daisy?4:7}" fill="${daisy?'#d1b963':'#66523c'}"/></g>`;}
function scenery(){
  let art=`<rect width="1400" height="900" fill="url(#ground)"/><path d="M-20 715Q350 815 680 660T1420 390M685 660Q510 450 270 265M680 660Q700 420 800 335T1080 190" stroke="#a7ab7b" stroke-width="72" fill="none" opacity=".37" stroke-linecap="round"/><path d="M-20 715Q350 815 680 660T1420 390M685 660Q510 450 270 265M680 660Q700 420 800 335T1080 190" stroke="#b5b284" stroke-width="52" fill="none" opacity=".15" stroke-linecap="round"/>`;
  for(let i=0;i<210;i++){const x=(i*197+39)%1400,y=(i*113+51)%900;art+=`<path d="M${x} ${y}l-2-5m2 5l3-4" stroke="#81a070" opacity=".18" stroke-width="1.5"/>`;}
  const trees=[[90,170,1.7],[170,120,1.4],[370,95,1.6],[520,130,1.3],[680,100,1.6],[840,100,1.5],[1260,130,1.7],[1360,260,1.4],[1320,660,1.8],[1220,820,1.4],[875,845,1.2],[420,860,1.4],[100,860,1.7],[70,440,1.6],[130,590,1.3],[620,330,.9],[900,440,.8]];trees.forEach(t=>art+=tree(...t));
  art+=`<ellipse cx="1080" cy="595" rx="170" ry="95" fill="#58795b"/><ellipse cx="1080" cy="590" rx="156" ry="84" fill="url(#pond-fill)"/><path d="M960 576q100-50 210-5M991 620q85 27 165-5" stroke="#92b9aa" opacity=".4" fill="none" stroke-width="2"/><ellipse cx="1160" cy="588" rx="18" ry="8" fill="#6e986e"/><ellipse cx="1018" cy="555" rx="14" ry="7" fill="#80a578"/><circle cx="1161" cy="583" r="5" fill="#e4b9b2"/><path d="M1040 652v49m20-53v49m20-49v49m20-49v49m-72-35h85m-85 17h85" stroke="#a2916a" stroke-width="9"/><path d="M1025 655h91" stroke="#c6b18a" stroke-width="6"/>`;
  art+=`<g transform="translate(240 244)" filter="url(#soft-shadow)"><path d="M-78 0V-92H78V0Z" fill="#d1c4a0"/><rect x="-67" y="-81" width="134" height="70" rx="2" fill="#345954"/><path d="M-60-18l45-35 27 16 32-34 20 53" fill="#81a17b"/><circle cx="35" cy="-60" r="11" fill="#e1d9a1"/><path d="M-75 9h150m-145 18h140" stroke="#867b5b" stroke-width="13"/><path d="M-88-103H88" stroke="#8da077" stroke-width="10"/></g>`;
  art+=`<g transform="translate(1060 174)" filter="url(#soft-shadow)"><ellipse cy="28" rx="47" ry="16" fill="#708572"/><path d="M0-13l-24 42m24-42l27 42m-27-42v45" stroke="#c1b28d" stroke-width="5"/><g transform="rotate(-30)"><rect x="-39" y="-28" width="75" height="19" rx="5" fill="#bcb794"/><rect x="-45" y="-32" width="12" height="27" rx="3" fill="#e3d6a8"/></g></g>`;
  art+=`<g transform="translate(1230 361)" filter="url(#soft-shadow)"><path d="M-17-15l-22 52m43-52l23 52M-2-12v48" stroke="#bba37c" stroke-width="6"/><rect x="-30" y="-56" width="60" height="53" rx="2" fill="#eadfc3"/><circle cx="2" cy="-31" r="14" fill="#d9b452"/><path d="M-20-9l10-17 14 13 13-17 9 21" fill="#7a9b76"/><ellipse cx="36" cy="21" rx="18" ry="11" fill="#c4b697"/><circle cx="29" cy="20" r="3" fill="#cfb15c"/><circle cx="40" cy="17" r="3" fill="#cb9390"/></g>`;
  art+=`<g transform="translate(260 641)" filter="url(#soft-shadow)"><path d="M0 0v48" stroke="#a28c69" stroke-width="9"/><path d="M-24 2v-35q24-30 48 0V2Z" fill="#bd8e76"/><path d="M-16-17h32v20h-32Z" fill="#e1d4af"/><path d="M-16-17L0-5 16-17" fill="none" stroke="#a0876c" stroke-width="2"/><path d="M28-31v-22h16v13H28" fill="#dfbb69"/></g>`;
  for(const [x,y] of [[540,660],[850,580],[380,350],[950,290],[1170,460]])art+=`<g><circle cx="${x}" cy="${y-25}" r="65" fill="url(#lamp-glow)"/><path d="M${x} ${y}v-45" stroke="#9a9470" stroke-width="4"/><rect x="${x-7}" y="${y-51}" width="14" height="18" rx="4" fill="#edce87"/></g>`;
  for(let i=0;i<22;i++)art+=flower(160+(i*79)%1100,180+(i*137)%590,i%3!==0,.45);
  el('map-scenery').innerHTML=art;
  el('map-stations').innerHTML=stations.map(s=>`<g class="map-station" id="station-${s.id}" transform="translate(${s.x} ${s.y})" role="button" tabindex="0" aria-label="Ir a ${s.name}"><circle class="station-ring" r="37"/><circle r="9" fill="#e4d69d" opacity=".65"/><text class="station-label" y="57">${s.name}</text></g>`).join('');
  stations.forEach(s=>{const node=el(`station-${s.id}`);node.addEventListener('click',e=>{e.stopPropagation();walkTo(s);});node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();walkTo(s);}});});
  el('map-effects').innerHTML=Array.from({length:22},(_,i)=>`<circle class="ambient-mote" cx="${100+(i*157)%1200}" cy="${130+(i*103)%620}" r="${i%3===0?2:1.2}" fill="#e5d697" opacity=".6" style="animation-delay:-${i%6}s"/>`).join('')+'<g id="luci" aria-hidden="true"><circle r="30" fill="url(#lamp-glow)"/><ellipse cx="-5" cy="-4" rx="5" ry="3" fill="#f6e8bb" opacity=".55"/><ellipse cx="5" cy="-4" rx="5" ry="3" fill="#f6e8bb" opacity=".55"/><circle r="4" fill="#f4db85"/></g>';
  renderBeds();
}
function renderBeds(){el('map-plants').innerHTML=['flowers','daisies'].map(id=>{const s=stations.find(s=>s.id===id),n=data.beds[id];let art=`<g transform="translate(${s.x} ${s.y-65})"><ellipse rx="74" ry="40" fill="#705f47" stroke="#8e8660" stroke-width="5"/>`;for(let i=0;i<6;i++){const x=-45+(i%3)*43,y=-9+Math.floor(i/3)*27;if(n===0)art+=`<ellipse cx="${x}" cy="${y}" rx="7" ry="3" fill="#4e4937"/>`;else if(n<3)art+=`<path d="M${x} ${y}v-12m0 7q-15-17 0-10q15-12 0 10" fill="#95b66f" stroke="#95b66f" stroke-width="2"/>`;else art+=flower(x,y,id==='daisies',.85);}return art+'</g>';}).join('');}
function updateGuide(){
  const next=stations.find(s=>!data.memories.includes(s.id));
  el('game-guide').textContent=next?({flowers:'¿Plantamos un girasol? Yo te enseño el camino.',daisies:'Hay un parterre esperando margaritas.',pond:'El agua guarda un ratito tranquilo para ti.',letter:'Alguien dejó una notita en tu buzón.',stars:'Esta noche el cielo tiene tu nombre.',art:'Hay un lienzo esperando tus colores.',cinema:'Nos queda una función entre los árboles.'}[next.id]):'El jardín ya guarda tus recuerdos. Hoy puedes pasear a tu manera.';
  el('follow-light').textContent=next?'Seguir su luz ↗':'Volver a mis flores ↗';
}
function walkTo(s){if(!data.entered)return;target={x:s.x,y:s.y};arrival=s;setLuci(false);say(`Vamos ${s.name.toLowerCase().startsWith('el ')?'al '+s.name.toLowerCase().slice(3):'a '+s.name.toLowerCase()}. Puedes cambiar de camino cuando quieras.`);el('game-welcome').hidden=true;}
function stop(){keys.clear();target=null;arrival=null;player.classList.remove('walking');}
function activity(panel){stop();const dialog=el('activity-dialog');dialog.dataset.panel=panel;dialog.showModal();if(['stars','art','cinema'].includes(panel))document.querySelector(`[data-view="${panel}"]`).click();}
function interact(s=nearby){
  if(!s)return;
  stop();
  if(s.id==='flowers'||s.id==='daisies'){
    const n=data.beds[s.id];
    if(n<3){data.beds[s.id]++;renderBeds();save();say([`Una semillita en la tierra. Puedes regarla cuando quieras.`,`Un poquito de agua. Mira, ya asoman las primeras hojas.`,`¡Floreció! Este rincón guarda algo que hiciste con tus manos.`][n]);if(n===2)remember(s.id);}
    else{say(s.id==='flowers'?'Tus girasoles siguen aquí. No necesitan que vengas cada día.':'Las margaritas se quedan contigo, incluso cuando cierras el jardín.');}
  }else if(s.id==='letter'){remember(s.id);el('letter-open').click();}
  else if(s.id==='pond'){el('pond-dialog').showModal();say('Escucha el agua, o simplemente quédate. Tú eliges.');}
  else{activity(s.id);say({stars:'Toca las estrellas. Guardan una sorpresa para ti.',art:'Aquí no hay un dibujo correcto. Deja una pequeña huella de color.',cinema:'Una función tranquila, bajo las ramas.'}[s.id]);if(s.id==='cinema')remember(s.id);}
  updateContext();
}
let contextSignature='';
function updateContext(){nearby=nearestStation(position,stations,82);const signature=`${nearby?.id||''}:${data.beds[nearby?.id]||0}`;if(signature===contextSignature)return;contextSignature=signature;const button=el('game-interact');button.disabled=!nearby;el('nearby-label').textContent=nearby?nearby.name:'Toca el camino para caminar';let action=nearby?.action||'Acércate a un rincón';if(nearby&&['flowers','daisies'].includes(nearby.id)){const n=data.beds[nearby.id];action=[nearby.action,'Regar con cariño','Ver florecer','Contemplar mis flores'][n];}button.replaceChildren(document.createTextNode(action+' '));const kbd=document.createElement('kbd');kbd.textContent='E';button.append(kbd);stations.forEach(s=>el(`station-${s.id}`).classList.toggle('nearest',s===nearby));}
function renderBackpack(){el('map-destinations').replaceChildren();stations.forEach(s=>{const button=document.createElement('button');button.textContent=`${s.icon} ${s.name}`;const status=document.createElement('span');status.textContent=data.memories.includes(s.id)?`♡ ${s.memory}`:'Un rincón por descubrir';button.append(status);button.onclick=()=>{el('backpack').close();walkTo(s);};el('map-destinations').append(button);});}
let viewport={width:840,height:540},cameraDirty=true,frameId=0;
const resizeObserver=new ResizeObserver(entries=>{const {width,height}=entries[0].contentRect;viewport={width,height};cameraDirty=true;});resizeObserver.observe(svg);
function camera(){const b=cameraBounds(position,viewport.width,viewport.height);svg.setAttribute('viewBox',`${b.x} ${b.y} ${b.width} ${b.height}`);cameraDirty=false;}
function setTime(){stage.classList.toggle('day',data.day);el('game-time').textContent=data.day?'☀ Día':'☾ Noche';el('game-time').setAttribute('aria-pressed',String(data.day));const stops=el('ground').querySelectorAll('stop');stops[0].setAttribute('stop-color',data.day?'#91b27d':'#345f51');stops[1].setAttribute('stop-color',data.day?'#6e946b':'#193e38');save();}
function loop(time){
  if(document.hidden){lastFrame=0;return;}
  if(lastFrame&&time-lastFrame<1000/30){frameId=requestAnimationFrame(loop);return;}
  const dt=lastFrame?Math.min((time-lastFrame)/1000,.05):0;lastFrame=time;
  const modal=!!document.querySelector('dialog[open]');let walking=false;
  if(data.entered&&!modal){let dx=(keys.has('right')?1:0)-(keys.has('left')?1:0),dy=(keys.has('down')?1:0)-(keys.has('up')?1:0);
    if(dx||dy){if(luciExpanded)setLuci(false);target=null;arrival=null;position=moveTowards(position,{x:position.x+dx*100,y:position.y+dy*100},145*dt);walking=true;}
    else if(target){const before=position;position=moveTowards(position,target,145*dt);walking=Math.hypot(position.x-before.x,position.y-before.y)>.1;if(Math.hypot(position.x-target.x,position.y-target.y)<2){const reached=arrival;target=null;arrival=null;if(reached)interact(reached);}}
  }
  if(walking||cameraDirty)player.setAttribute('transform',`translate(${position.x} ${position.y})`);player.classList.toggle('walking',walking);
  const next=stations.find(s=>!data.memories.includes(s.id))||stations[0],t=ambientPaused?0:time/1000;
  el('luci').setAttribute('transform',`translate(${next.x+Math.sin(t)*16} ${next.y-40+Math.cos(t*.7)*9})`);
  if(walking||cameraDirty)camera();updateContext();frameId=requestAnimationFrame(loop);
}
svg.addEventListener('click',e=>{if(!data.entered||document.querySelector('dialog[open]'))return;setLuci(false);const matrix=svg.getScreenCTM();if(!matrix)return;const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());target=clampPoint(point);arrival=null;});
const keyMap={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
window.addEventListener('keydown',e=>{if(!data.entered||document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName))return;if(keyMap[e.key]){e.preventDefault();keys.add(keyMap[e.key]);}if((e.key==='e'||e.key==='E')&&!e.repeat){e.preventDefault();interact();}});
window.addEventListener('keyup',e=>{if(keyMap[e.key])keys.delete(keyMap[e.key]);});window.addEventListener('blur',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();cancelAnimationFrame(frameId);lastFrame=0;}else{lastFrame=0;frameId=requestAnimationFrame(loop);}});
document.querySelectorAll('[data-move]').forEach(button=>{button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(button.dataset.move);};button.onpointerup=button.onpointercancel=button.onlostpointercapture=()=>keys.delete(button.dataset.move);});
document.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('contextmenu',event=>event.preventDefault()));
el('enter-garden').onclick=()=>{data.entered=true;el('game-welcome').hidden=true;save();say('Toca las flores o sigue mi luz. Tus primeros girasoles te esperan.');document.activeElement?.blur();};
el('follow-light').onclick=()=>walkTo(stations.find(s=>!data.memories.includes(s.id))||stations[0]);el('game-interact').onclick=()=>interact();
el('game-time').onclick=()=>{data.day=!data.day;setTime();say(data.day?'Un poquito de sol entre las hojas.':'La noche enciende sus pequeñas luces.');};
el('game-menu').onclick=()=>{stop();renderBackpack();el('backpack').showModal();};el('close-backpack').onclick=()=>el('backpack').close();el('close-activity').onclick=()=>el('activity-dialog').close();
el('open-postcards').onclick=()=>{el('backpack').close();activity('postcards');};el('open-install').onclick=()=>{el('backpack').close();activity('install');};
el('motion-toggle').onclick=()=>{ambientPaused=!ambientPaused;setMotion();};function setMotion(){stage.classList.toggle('paused-ambient',ambientPaused);el('motion-toggle').textContent=ambientPaused?'Reanudar ambiente':'Pausar ambiente';el('motion-toggle').setAttribute('aria-pressed',String(ambientPaused));}
el('game-rest').onclick=()=>{stop();el('breath-dialog').showModal();};el('game-help').onclick=()=>{stop();el('help-dialog').showModal();};el('close-help').onclick=()=>el('help-dialog').close();el('close-pond').onclick=()=>el('pond-dialog').close();
el('backpack-rest').onclick=()=>{el('backpack').close();el('game-rest').click();};
el('backpack-help').onclick=()=>{el('backpack').close();el('game-help').click();};
let ripples=0;const pondPrompts=['Si te apetece, encuentra un color que te guste a tu alrededor.','Ahora puedes notar una textura: la tela de tu ropa, el suelo bajo tus pies…','Escucha un sonido cercano. No necesitas cambiarlo, solo darte cuenta de que está ahí.','Aquí estás, en este pequeño instante. Puedes seguir mirando el agua o volver a pasear.'];
el('pond-water').onclick=()=>{ripples++;el('pond-water').classList.remove('ripple');requestAnimationFrame(()=>el('pond-water').classList.add('ripple'));el('pond-prompt').textContent=pondPrompts[Math.min(ripples-1,3)];el('pond-caption').textContent=ripples>=3?'Una onda se va. Puedes quedarte o dejarla ir.':'Cada onda puede ser una pequeña pausa.';if(ripples>=3)remember('pond');};
el('pond-again').onclick=()=>{ripples=0;el('pond-prompt').textContent='Toca el agua y observa cómo se abre una onda. Si te apetece, busca un color a tu alrededor.';el('pond-caption').textContent='Puedes quedarte aquí todo lo que quieras.';};
el('canvas').addEventListener('pointerup',()=>remember('art'));document.querySelectorAll('.star-button').forEach(button=>button.addEventListener('click',()=>{if(document.querySelectorAll('.star-button.found').length===5)remember('stars');}));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',()=>{keys.clear();document.activeElement?.blur();}));
scenery();setTime();setMotion();renderBackpack();updateGuide();el('game-welcome').hidden=data.entered;frameId=requestAnimationFrame(loop);
