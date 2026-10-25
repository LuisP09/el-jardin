import {PLACES,regionAt,walkablePoint,walkStep,planPath} from './world-layout.js';
import {drawWorld} from './world-art.js';
import {createWorldMap} from './world-map.js';
import {initGameMenus} from './game-menus.js';
import {restorePhaseTwo} from './phase-two-core.js';
import {createPhaseTwo} from './phase-two.js';
import {dayKey,renewDay,dailyEncounters,restoreExtras} from './daily-core.js';
import {createExtras} from './extras.js';
import { WORLD, clampPoint, moveTowards, nearestStation, cameraBounds, restorePosition } from './game-core.js';
import { restorePlots } from './gardening-core.js';
import { createGardening, bloomSVG } from './gardening.js';
import { approach, dampPoint, movementFacing } from './motion.js';
import { createActor, stationIcons } from './illustration.js';
const el = id => document.getElementById(id);
const svg = el('game-map'), player = el('player'), stage = document.querySelector('.game-stage');
const actor = createActor(player);
const stations = [
  {id:'greenhouse',x:610,y:210,icon:'⌂',name:'El invernadero',action:'Combinar semillas',memory:'Una flor que permanece'},
  {id:'visitors',x:400,y:765,icon:'♡',name:'El claro de los visitantes',action:'Conocer a los visitantes',memory:'Compañía entre flores'},
  {id:'river',x:1260,y:760,icon:'≈',name:'El sendero del río',action:'Pasear junto al río',memory:'Otro cielo en el agua'},
  {id:'moments',x:650,y:800,icon:'❀',name:'El rincón compartido',action:'Preparar un momento',memory:'Un ratito para compartir'},
  { id:'flowers', x:470, y:510, icon:'❀', name:'Los girasoles', action:'Sembrar un girasol', memory:'Un pequeño comienzo' },
  { id:'daisies', x:780, y:340, icon:'❁', name:'Las margaritas', action:'Sembrar una margarita', memory:'Flores bajo el cielo' },
  { id:'pond', x:1060, y:690, icon:'◌', name:'El estanque', action:'Sentarme junto al agua', memory:'Un instante presente' },
  { id:'letter', x:260, y:690, icon:'♡', name:'El buzón', action:'Abrir una carta', memory:'Besito en tu pollollo' },
  { id:'stars', x:1060, y:210, icon:'✧', name:'El observatorio', action:'Mirar las estrellas', memory:'Un cielo para Isis' },
  { id:'art', x:1230, y:400, icon:'◌', name:'El taller', action:'Pintar un ratito', memory:'Un trazo a tu manera' },
  { id:'cinema', x:240, y:270, icon:'▷', name:'El cine del bosque', action:'Entrar al pequeño cine', memory:'Una historia compartida' }
];
stations.forEach(s=>Object.assign(s,PLACES[s.id]));
const encounterTemplates=[
  {id:'butterfly',x:590,y:590,name:'Una mariposa de miel',action:'Observar la mariposa',symbol:'ʚɞ',text:'Una mariposa descansa junto al sendero. Abre sus alas despacito. Podemos acompañarla un momento, sin tener que hacer nada más.'},
  {id:'leaf',x:720,y:430,name:'Una hoja viajera',action:'Mirar la hoja',symbol:'❧',text:'Una hoja gira y encuentra dónde descansar. Si te apetece, sigue su pequeño recorrido con la mirada. No hay prisa por llegar.'},
  {id:'stone',x:920,y:650,name:'Una piedrita de luna',action:'Mirar su brillo',symbol:'◈',text:'Entre la hierba hay una piedrita lisa que recoge la luz. Hasta los días más grandes pueden tener un detalle pequeño y bonito.'},
  {id:'wish',x:940,y:265,name:'Un deseo entre las ramas',action:'Guardar este instante',symbol:'✧',text:'Luci encontró un rincón desde donde se ve el cielo. Este ratito es para ti, Isis. Besito en tu pollollo.'}
  ,{id:'snail',name:'Un caracol diminuto',action:'Acompañar al caracol',symbol:'＠',text:'Un caracol avanza sobre una hoja. Su camino también cuenta, aunque sea pequeñito.'},
  {id:'feather',name:'Una pluma del bosque',action:'Mirar la pluma',symbol:'❦',text:'Una pluma quedó entre las flores. Puedes imaginar el viaje del pájaro que pasó por aquí.'},
  {id:'petals',name:'Pétalos para un mandala',action:'Crear con pétalos',symbol:'❀',text:'Toca los pétalos para formar una composición. Puedes cambiarla todas las veces que quieras.'},
  {id:'constellation',name:'Un cielo por dibujar',action:'Unir las estrellas',symbol:'☆',text:'Elige estrellas para trazar tu propio dibujo. Aquí ninguna constelación está equivocada.'},
  {id:'trail',name:'El paseo de una mariposa',action:'Seguir su vuelo',symbol:'ʚɞ',text:'La mariposa se ha posado más adelante. Puedes seguirla a tu ritmo; te esperará.'},
  {id:'envelope',name:'Un sobre escondido',action:'Abrir el sobre',symbol:'♡',text:'Unas palabras te estaban esperando entre las hojas.'}
];
let encounters=dailyEncounters(encounterTemplates,dayKey());
const validFinds=value=>Array.isArray(value)?[...new Set(value.filter(id=>encounters.some(e=>e.id===id)))]:[];
const SAVE_KEY='isis-game-v2';
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let data = { entered:false, beds:{flowers:0,daisies:0}, plots:restorePlots(null), memories:[], day:false, motionPaused:false, finds:[],phase2:restorePhaseTwo(),...restoreExtras() };
try {
  const saved=JSON.parse(localStorage.getItem(SAVE_KEY)||localStorage.getItem('isis-game-v1')||'null');
  if(saved&&typeof saved==='object') data={...restoreExtras(saved),phase2:restorePhaseTwo(saved.phase2),entered:saved.entered===true,beds:{flowers:[0,1,2,3].includes(saved.beds?.flowers)?saved.beds.flowers:0,daisies:[0,1,2,3].includes(saved.beds?.daisies)?saved.beds.daisies:0},plots:restorePlots(saved.plots,saved.beds),position:restorePosition(saved.position),facing:['up','down','left','right'].includes(saved.facing)?saved.facing:'down',finds:validFinds(saved.finds),memories:Array.isArray(saved.memories)?saved.memories.filter(id=>stations.some(s=>s.id===id)):[],day:saved.day===true,motionPaused:saved.motionPaused===true};
} catch {}
data.keepsakes=[...new Set([...data.keepsakes,...data.finds])];
renewDay(data);encounters=dailyEncounters(encounterTemplates,data.gardenDate);
let position=walkablePoint(restorePosition(data.position)),target=null,arrival=null,nearby=null,keys=new Set(),lastFrame=0,ambientPaused=motionPreference.matches||data.motionPaused;
let luciPosition={x:position.x+26,y:position.y-36};
let speed=0,lastVector={x:0,y:1},strideDistance=0,ambientTime=0,facing=data.facing||'down',wasWalking=false,tapBeacon=null;
let nearbyEncounter=null,noticedEncounter=null,autosaveTime=0;
let dailyCheck=0;let route=[],zoom=1;
let restoringBackup=false;
function save(){if(restoringBackup)return;data.position={...position};data.facing=facing;try{localStorage.setItem(SAVE_KEY,JSON.stringify(data));el('game-saved').textContent='Tu paseo está guardado en este dispositivo.';}catch{el('game-saved').textContent='Tu paseo continúa, pero este navegador no permitió guardarlo.';}}
function say(text,speaker='Luci, la luciérnaga'){
  el('speaker').textContent=speaker;el('game-message').textContent=text;
  el('luci-preview').textContent=text;el('luci-announcement').textContent=text;
  el('companion-panel').classList.toggle('has-message',!luciExpanded);
}
let luciExpanded=false;
function setLuci(expanded){luciExpanded=expanded;el('luci-content').hidden=!expanded;el('toggle-luci').setAttribute('aria-expanded',String(expanded));el('luci-toggle-label').textContent=expanded?'Cerrar ▾':'Leer ▴';if(expanded)el('companion-panel').classList.remove('has-message');}
el('toggle-luci').onclick=()=>setLuci(!luciExpanded);
function remember(id){if(!data.memories.includes(id)){data.memories.push(id);save();}renderBackpack();updateGuide();}
function tree(x,y,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cy="20" rx="47" ry="16" fill="#102c28" opacity=".22"/><path d="M-7 15L-5-42 6-44 9 14Q0 19-7 15" fill="url(#bark)"/><path d="M0-10L-18-32M3-18L21-39" stroke="#9a8660" stroke-width="4"/><g class="tree-canopy" style="animation-delay:-${x%8}s"><path d="M-43-32Q-61-60-33-75Q-32-103-7-95Q17-115 31-87Q62-84 49-56Q67-36 39-22Q16-11 1-19Q-25-8-43-32" fill="url(#leaf-deep)"/><path d="M-35-65Q-18-88 3-81M12-90Q28-96 35-77M-42-43Q-32-59-20-52" stroke="#a9b786" stroke-width="4" opacity=".3" fill="none" stroke-linecap="round"/><g fill="#b0bf8a" opacity=".3"><ellipse cx="-15" cy="-70" rx="4" ry="2" transform="rotate(-30 -15 -70)"/><ellipse cx="24" cy="-47" rx="4" ry="2"/><ellipse cx="-29" cy="-38" rx="3" ry="2"/><ellipse cx="13" cy="-76" rx="3" ry="2"/></g></g><path d="M-17 21q-13-14-20-10m22 13q-4-18-13-23m49 20q7-18 14-18" stroke="#73916b" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;}
function flower(x,y,daisy=false,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})"><g class="field-flower" style="animation-delay:-${x%6}s"><path d="M0 8v-28" stroke="#8aa86b" stroke-width="2"/><ellipse cx="-5" cy="-3" rx="7" ry="3" fill="#8aa86b" transform="rotate(30 -5 -3)"/>${Array.from({length:daisy?10:12},(_,i)=>`<ellipse cy="-31" rx="${daisy?2.8:3.8}" ry="8" fill="${daisy?'#f6eed2':'#dfb95b'}" transform="rotate(${i*(daisy?36:30)} 0 -23)"/>`).join('')}<circle cy="-23" r="${daisy?4:7}" fill="${daisy?'#d1b963':'#66523c'}"/></g></g>`;}
function scenery(){
  const art=drawWorld({tree,flower});
  el('map-scenery').innerHTML=art;
  el('map-stations').innerHTML=stations.map(s=>`<g class="map-station" id="station-${s.id}" transform="translate(${s.x} ${s.y})" role="button" tabindex="0" aria-label="Ir a ${s.name}"><circle class="station-ring" r="37"/><circle class="station-mark" r="18"/><g class="station-icon">${stationIcons[s.id]||stationIcons.flowers}</g><text class="station-label" y="57">${s.name}</text></g>`).join('');
  stations.forEach(s=>{const node=el(`station-${s.id}`);node.addEventListener('click',e=>{e.stopPropagation();walkTo(s);});node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();walkTo(s);}});});
  el('map-effects').innerHTML=Array.from({length:36},(_,i)=>`<circle class="ambient-mote" cx="${100+(i*457)%(WORLD.width-200)}" cy="${130+(i*283)%(WORLD.height-260)}" r="${i%3===0?2:1.2}" fill="#e5d697" opacity=".6" style="animation-delay:-${i%6}s"/>`).join('')+[[520,410],[1920,380],[1730,1340]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><g class="garden-butterfly" style="animation-delay:-${i*3}s"><g fill="${['#dbc491','#c6b2ba','#c1cbb3'][i]}" opacity=".85"><path class="butterfly-left" d="M0 0Q-16-23-16-5Q-18 8-2 4"/><path class="butterfly-right" d="M0 0Q16-23 16-5Q18 8 2 4"/></g><path d="M0-8V7" stroke="#5f6048" stroke-width="2"/></g></g>`).join('')+'<g id="tap-beacon" class="tap-beacon"><ellipse class="tap-ring" rx="18" ry="10" fill="none" stroke="#eddda6" stroke-width="1.5"/><circle r="2" fill="#eddda6"/></g><g id="luci" aria-hidden="true"><circle class="luci-halo" r="34" fill="url(#lamp-glow)"/><ellipse class="luci-wing" cx="-5" cy="-4" rx="5" ry="3" fill="#f6e8bb" opacity=".55"/><ellipse class="luci-wing" cx="5" cy="-4" rx="5" ry="3" fill="#f6e8bb" opacity=".55"/><circle r="4" fill="#f4db85"/><circle r="2" fill="#fff5cb"/></g>';
  const routeLine=document.createElementNS('http://www.w3.org/2000/svg','polyline');routeLine.id='world-route';routeLine.setAttribute('aria-hidden','true');el('map-effects').insertBefore(routeLine,el('tap-beacon'));
  tapBeacon=el('tap-beacon');
  el('garden-encounters')?.remove();
  const layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.id='garden-encounters';
  layer.innerHTML=encounters.map(e=>`<g class="garden-encounter" id="encounter-${e.id}" role="button" tabindex="0" aria-label="Acercarme: ${e.name}" transform="translate(${e.x} ${e.y})"><ellipse class="encounter-glow" rx="27" ry="16"/><text class="encounter-symbol" text-anchor="middle" y="5">${e.symbol}</text></g>`).join('')+Array.from({length:9},(_,i)=>`<g transform="translate(${420+i*65} ${560+(i%3)*35})"><path class="wandering-leaf" style="animation-delay:-${i}s" d="M-6 0Q0-12 8-4Q6 7-6 0M-4 0L6-3"/></g>`).join('');
  svg.insertBefore(layer,el('map-effects'));
  encounters.forEach(e=>{const node=el(`encounter-${e.id}`);node.onclick=event=>{event.stopPropagation();walkTo(e);};node.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();walkTo(e);}};});
  renderBeds();
}
function renderBeds(){el('map-plants').innerHTML=['flowers','daisies'].map(id=>{const s=stations.find(s=>s.id===id);let art=`<g transform="translate(${s.x} ${s.y-65})"><ellipse cy="13" rx="93" ry="45" fill="#152e26" opacity=".25"/><path d="M-87-7Q-85-44 0-44Q85-44 87-7V9Q79 47 0 47Q-80 47-87 9Z" fill="#9a7a56"/><path d="M-87 1Q-67 35 0 35Q68 35 87 1" fill="none" stroke="#c0a477" stroke-width="4"/><ellipse cy="-8" rx="86" ry="35" fill="#5b4937" stroke="#b79a6e" stroke-width="5"/>`;for(let i=0;i<8;i++){const x=-57+(i%4)*38,y=-15+Math.floor(i/4)*26,slot=data.plots[id][i];art+=`<g transform="translate(${x} ${y}) scale(.58)">${slot?bloomSVG(slot.type,slot.stage):'<ellipse cy="9" rx="18" ry="7" fill="#3e382c"/><path d="M-6 9H6M0 3v12" stroke="#a28b60" opacity=".5"/>'}</g>`;}if(data.plots[id].some(slot=>slot?.type==='daisy'&&slot.stage===3))art+='<g transform="translate(45 -66)"><g class="garden-butterfly"><path class="butterfly-left" d="M0 0Q-16-23-16-5Q-18 8-2 4" fill="#e4c6ac"/><path class="butterfly-right" d="M0 0Q16-23 16-5Q18 8 2 4" fill="#e4c6ac"/><path d="M0-5V6" stroke="#6b7051" stroke-width="2"/></g></g>';return art+'<path d="M92 5v-37" stroke="#98815b" stroke-width="3"/><path d="M78-38h30v16H78Z" fill="#c0a77d"/><path d="M85-30h16" stroke="#7d7953" stroke-width="2"/></g>';}).join('');}
const gardening=createGardening({
  getPlots:id=>data.plots[id],
  updateSlot:(id,index,slot)=>{data.plots[id][index]=slot;data.beds[id]=Math.max(0,...data.plots[id].map(item=>item?.stage||0));renderBeds();phaseTwo.renderWorld();save();},
  onMessage:text=>say(text),onBloom:id=>remember(id),isDay:()=>data.day,motionPaused:()=>ambientPaused
});
function updateGuide(){
  const next=stations.find(s=>!data.memories.includes(s.id));
  el('game-guide').textContent=next?({greenhouse:'El invernadero guarda semillas para inventar una flor.',visitors:'Miso encontró un claro para descansar contigo.',river:'Hay otro camino, junto al río. ¿Vamos al puente?',moments:'Podemos preparar un pequeño rincón para compartir.',flowers:'¿Plantamos un girasol? Yo te enseño el camino.',daisies:'Hay un parterre esperando margaritas.',pond:'El agua guarda un ratito tranquilo para ti.',letter:'Alguien dejó una notita en tu buzón.',stars:'Esta noche el cielo tiene tu nombre.',art:'Hay un lienzo esperando tus colores.',cinema:'Nos queda una función entre los árboles.'}[next.id]):'El jardín ya guarda tus recuerdos. Hoy puedes pasear a tu manera.';
  el('follow-light').textContent=next?'Seguir su luz ↗':'Volver a mis flores ↗';
}
function walkTo(s){if(!data.entered)return;beginRoute(s,{followRoads:true});arrival=s;setLuci(false);say(`Vamos ${s.name.toLowerCase().startsWith('el ')?'al '+s.name.toLowerCase().slice(3):'a '+s.name.toLowerCase()}. Puedes cambiar de camino cuando quieras.`);el('game-welcome').hidden=true;}
function stop(){keys.clear();target=null;route=[];arrival=null;speed=0;player.classList.remove('walking');save();}
function activity(panel){stop();const dialog=el('activity-dialog');dialog.dataset.panel=panel;dialog.showModal();if(['stars','art','cinema'].includes(panel))document.querySelector(`[data-view="${panel}"]`).click();}
function interact(s=nearby){
  if(!s)return;
  stop();
  if(encounters.some(e=>e.id===s.id)){
    if(!data.finds.includes(s.id)){data.finds.push(s.id);if(!data.keepsakes.includes(s.id))data.keepsakes.push(s.id);save();renderBackpack();}
    el('discovery-title').textContent=s.name;el('discovery-text').textContent=s.text;el('discovery-symbol').textContent=s.symbol;
    renderDiscovery(s);el('discovery-dialog').showModal();say('Lo guardé en tus pequeños encuentros. Podemos volver cuando quieras.');
  }else if(['greenhouse','visitors','river','moments'].includes(s.id)){remember(s.id);phaseTwo.open(s.id);
  }else if(s.id==='flowers'||s.id==='daisies'){
    gardening.open(s.id);say('Aquí puedes elegir qué sembrar y darle un lugar a cada flor.');
  }else if(s.id==='letter'){remember(s.id);el('letter-open').click();}
  else if(s.id==='pond'){el('pond-dialog').showModal();say('Escucha el agua, o simplemente quédate. Tú eliges.');}
  else{activity(s.id);say({stars:'Toca las estrellas. Guardan una sorpresa para ti.',art:'Aquí no hay un dibujo correcto. Deja una pequeña huella de color.',cinema:'Una función tranquila, bajo las ramas.'}[s.id]);if(s.id==='cinema')remember(s.id);}
  updateContext();
}
let contextSignature='';
function updateContext(){nearby=nearestStation(position,stations,82)||nearestStation(position,encounters,68);const signature=`${nearby?.id||''}:${arrival?.id||''}:${data.beds[nearby?.id]||0}:${regionAt(position).id}`;if(signature===contextSignature)return;contextSignature=signature;const button=el('game-interact');button.disabled=!nearby;el('nearby-label').textContent=nearby?nearby.name:'Toca el camino para caminar';el('game-location').textContent=nearby?nearby.name.toUpperCase():regionAt(position).name.toUpperCase();let action=nearby?.action||'Acércate a un rincón';if(nearby&&['flowers','daisies'].includes(nearby.id))action='Cuidar este rincón';button.replaceChildren(document.createTextNode(action+' '));const kbd=document.createElement('kbd');kbd.textContent='E';button.append(kbd);stations.forEach(s=>{el(`station-${s.id}`).classList.toggle('nearest',s===nearby);el(`station-${s.id}`).classList.toggle('guiding',s===arrival);});}
function renderBackpack(){el('daily-destinations').replaceChildren();encounters.forEach(e=>{const b=document.createElement('button');b.textContent=e.symbol+' '+e.name;b.onclick=()=>{el('backpack').close();walkTo(e);};el('daily-destinations').append(b);});el('encounter-journal').textContent=data.finds.length?'En este paseo has encontrado: '+data.finds.map(id=>encounters.find(e=>e.id===id).name.toLowerCase()).join(' · ')+'.':'Luci guardará aquí los pequeños encuentros que elijas mirar durante tus paseos.';el('map-destinations').replaceChildren();stations.forEach(s=>{const button=document.createElement('button');const badge=document.createElement('span');badge.className='destination-art';badge.setAttribute('aria-hidden','true');badge.innerHTML=`<svg viewBox="-18 -18 36 36">${stationIcons[s.id]||stationIcons.flowers}</svg>`;const label=document.createElement('strong');label.textContent=s.name;button.append(badge,label);const status=document.createElement('span');status.textContent=data.memories.includes(s.id)?`♡ ${s.memory}`:'Un rincón por descubrir';button.append(status);button.onclick=()=>{el('backpack').close();walkTo(s);};el('map-destinations').append(button);});}
let viewport={width:840,height:540},cameraDirty=true,frameId=0;
const resizeObserver=new ResizeObserver(entries=>{const {width,height}=entries[0].contentRect;viewport={width,height};cameraDirty=true;});resizeObserver.observe(svg);
function camera(){const b=cameraBounds(position,viewport.width,viewport.height,zoom);svg.setAttribute('viewBox',`${b.x} ${b.y} ${b.width} ${b.height}`);cameraDirty=false;}
function setTime(){stage.classList.toggle('day',data.day);el('game-time').textContent=data.day?'☀ Día':'☾ Noche';el('game-time').setAttribute('aria-pressed',String(data.day));const stops=el('ground').querySelectorAll('stop');stops[0].setAttribute('stop-color',data.day?'#9cb486':'#45694f');stops[1].setAttribute('stop-color',data.day?'#75996c':'#1b4038');const leaves=el('leaf-deep').querySelectorAll('stop');['#94ac79','#6f925f','#456e50'].forEach((color,i)=>leaves[i].setAttribute('stop-color',data.day?color:['#819769','#5c7e57','#315d48'][i]));save();}
function loop(time){
  if(document.hidden){lastFrame=0;return;}
  if(lastFrame&&time-lastFrame<1000/30){frameId=requestAnimationFrame(loop);return;}
  const dt=lastFrame?Math.min((time-lastFrame)/1000,.05):0;lastFrame=time;
  const modal=!!document.querySelector('dialog[open]');let walking=false;
  stage.classList.toggle('scene-paused',modal||!data.entered);
  const before={...position};
  if(data.entered&&!modal){let dx=(keys.has('right')?1:0)-(keys.has('left')?1:0),dy=(keys.has('down')?1:0)-(keys.has('up')?1:0);
    speed=approach(speed,(dx||dy||target)?145:0,(dx||dy||target?600:850)*dt);
    if(dx||dy){if(luciExpanded)setLuci(false);target=null;route=[];arrival=null;const length=Math.hypot(dx,dy);lastVector={x:dx/length,y:dy/length};position=walkStep(position,{x:position.x+dx*100,y:position.y+dy*100},speed*dt);}
    else if(target){lastVector={x:target.x-position.x,y:target.y-position.y};position=walkStep(position,target,speed*dt);const length=Math.hypot(lastVector.x,lastVector.y);if(length)lastVector={x:lastVector.x/length,y:lastVector.y/length};if(Math.hypot(position.x-target.x,position.y-target.y)<2){if(route.length){target=route.shift();}else{const reached=arrival;target=null;arrival=null;speed=0;if(reached)interact(reached);else save();}}}
    else if(speed>.1){position=walkStep(position,{x:position.x+lastVector.x*100,y:position.y+lastVector.y*100},speed*dt);}
  }
  const moved=Math.hypot(position.x-before.x,position.y-before.y);walking=moved>.01;
  strideDistance+=moved;facing=movementFacing(position.x-before.x,position.y-before.y,facing);
  if(!ambientPaused&&!modal&&data.entered)ambientTime+=dt;
  if(walking||cameraDirty)player.setAttribute('transform',`translate(${position.x} ${position.y})`);player.classList.toggle('walking',walking);
  actor.render({direction:facing,distance:strideDistance,time:ambientTime,delta:dt,walking,muted:ambientPaused||modal});
  nearbyEncounter=data.entered?nearestStation(position,encounters,110):null;
  if(!modal&&nearbyEncounter?.id!==noticedEncounter){noticedEncounter=nearbyEncounter?.id||null;if(nearbyEncounter&&!data.finds.includes(nearbyEncounter.id))say(['Isis, mira… ','Hay algo bonito por aquí: ','¿Lo ves entre las hojas? '][encounters.indexOf(nearbyEncounter)%3]+nearbyEncounter.name.toLowerCase()+'. Acércate si te apetece.');}
  encounters.forEach(e=>el(`encounter-${e.id}`).classList.toggle('noticed',nearbyEncounter===e));
  stage.classList.toggle('flowers-aware',Math.hypot(position.x-470,position.y-510)<125||Math.hypot(position.x-780,position.y-340)<125);
  el('luci').classList.toggle('luci-discovering',!!nearbyEncounter);
  const t=ambientTime;
  const guide=nearbyEncounter?{x:position.x+(nearbyEncounter.x-position.x)*.45,y:position.y+(nearbyEncounter.y-position.y)*.45-18}:{x:position.x+27,y:position.y-38};
  if(!modal)luciPosition=dampPoint(luciPosition,{x:guide.x+Math.sin(t)*9,y:guide.y+(walking||nearbyEncounter?Math.cos(t*.7)*6:22)},7,dt);
  el('luci').setAttribute('transform',`translate(${luciPosition.x} ${luciPosition.y})`);
  if(tapBeacon){tapBeacon.classList.toggle('active',!!target&&!modal);if(target){const destination=route.at(-1)||target;tapBeacon.setAttribute('transform',`translate(${destination.x} ${destination.y})`);}}
  dailyCheck+=dt;if(dailyCheck>15){dailyCheck=0;checkDay();}
  autosaveTime+=dt;if(walking&&autosaveTime>=2){save();autosaveTime=0;}
  if(wasWalking&&!walking)save();wasWalking=walking;
  if(target)el('world-route').setAttribute('points',[position,target,...route].map(p=>`${p.x},${p.y}`).join(' '));else el('world-route').removeAttribute('points');
  worldMap.update();if(walking||cameraDirty)camera();updateContext();frameId=requestAnimationFrame(loop);
}
svg.addEventListener('click',e=>{if(!data.entered||document.querySelector('dialog[open]'))return;setLuci(false);const matrix=svg.getScreenCTM();if(!matrix)return;const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());beginRoute(point);arrival=null;});
const keyMap={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
window.addEventListener('keydown',e=>{if(!data.entered||document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName))return;if(keyMap[e.key]){e.preventDefault();keys.add(keyMap[e.key]);}if((e.key==='e'||e.key==='E')&&!e.repeat){e.preventDefault();interact();}});
window.addEventListener('keyup',e=>{if(keyMap[e.key]){keys.delete(keyMap[e.key]);if(!keys.size)save();}});window.addEventListener('blur',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();stage.classList.add('scene-paused');cancelAnimationFrame(frameId);lastFrame=0;}else{checkDay();lastFrame=0;frameId=requestAnimationFrame(loop);}});
document.querySelectorAll('[data-move]').forEach(button=>{button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(button.dataset.move);};button.onpointerup=button.onpointercancel=button.onlostpointercapture=()=>{keys.delete(button.dataset.move);save();};});
document.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('contextmenu',event=>event.preventDefault()));
el('enter-garden').onclick=()=>{data.entered=true;el('game-welcome').hidden=true;save();say('Toca las flores o sigue mi luz. Tus primeros girasoles te esperan.');document.activeElement?.blur();};
el('follow-light').onclick=()=>walkTo(stations.find(s=>!data.memories.includes(s.id))||stations[0]);el('game-interact').onclick=()=>interact();
el('game-time').onclick=()=>{data.day=!data.day;setTime();say(data.day?'Un poquito de sol entre las hojas.':'La noche enciende sus pequeñas luces.');};
el('game-menu').onclick=()=>{stop();renderBackpack();el('backpack').showModal();};el('close-backpack').onclick=()=>el('backpack').close();el('close-activity').onclick=()=>el('activity-dialog').close();
el('open-postcards').onclick=()=>{el('backpack').close();activity('postcards');};el('open-install').onclick=()=>{el('backpack').close();activity('install');};
el('motion-toggle').onclick=()=>{ambientPaused=!ambientPaused;data.motionPaused=ambientPaused;save();setMotion();};
function setMotion(){stage.classList.toggle('paused-ambient',ambientPaused);document.documentElement.classList.toggle('motion-muted',ambientPaused);el('motion-toggle').disabled=motionPreference.matches;el('motion-toggle').textContent=motionPreference.matches?'Movimiento reducido activo':ambientPaused?'Reanudar ambiente':'Pausar ambiente';el('motion-toggle').setAttribute('aria-pressed',String(ambientPaused));}
motionPreference.addEventListener('change',()=>{ambientPaused=motionPreference.matches||data.motionPaused;setMotion();});
el('game-rest').onclick=()=>{stop();el('breath-dialog').showModal();};el('game-help').onclick=()=>{stop();el('help-dialog').showModal();};el('close-help').onclick=()=>el('help-dialog').close();el('close-pond').onclick=()=>el('pond-dialog').close();
el('backpack-rest').onclick=()=>{el('backpack').close();el('game-rest').click();};
el('backpack-help').onclick=()=>{el('backpack').close();el('game-help').click();};
let ripples=0;const pondPrompts=['Si te apetece, encuentra un color que te guste a tu alrededor.','Ahora puedes notar una textura: la tela de tu ropa, el suelo bajo tus pies…','Escucha un sonido cercano. No necesitas cambiarlo, solo darte cuenta de que está ahí.','Aquí estás, en este pequeño instante. Puedes seguir mirando el agua o volver a pasear.'];
el('pond-water').onclick=()=>{ripples++;el('pond-water').classList.remove('ripple');requestAnimationFrame(()=>el('pond-water').classList.add('ripple'));el('pond-prompt').textContent=pondPrompts[Math.min(ripples-1,3)];el('pond-caption').textContent=ripples>=3?'Una onda se va. Puedes quedarte o dejarla ir.':'Cada onda puede ser una pequeña pausa.';if(ripples>=3)remember('pond');};
el('pond-again').onclick=()=>{ripples=0;el('pond-prompt').textContent='Toca el agua y observa cómo se abre una onda. Si te apetece, busca un color a tu alrededor.';el('pond-caption').textContent='Puedes quedarte aquí todo lo que quieras.';};
el('canvas').addEventListener('pointerup',()=>remember('art'));document.querySelectorAll('.star-button').forEach(button=>button.addEventListener('click',()=>{if(document.querySelectorAll('.star-button.found').length===5)remember('stars');}));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',()=>{keys.clear();document.activeElement?.blur();checkDay();}));
window.addEventListener('pagehide',stop);
el('close-discovery').onclick=()=>el('discovery-dialog').close();
const phaseTwo=createPhaseTwo({getData:()=>data,save,stop,onMessage:say,encounters:()=>encounterTemplates,motionPaused:()=>ambientPaused});
scenery();phaseTwo.renderWorld();renderDecorations();setTime();setMotion();renderBackpack();updateGuide();el('game-welcome').hidden=data.entered;frameId=requestAnimationFrame(loop);

if(data.entered)say('Bienvenida de vuelta, Isis. Te guardé tu lugar; seguimos cuando quieras.');

function checkDay(){
 if(document.querySelector('dialog[open]'))return;
 if(renewDay(data)){stop();encounters=dailyEncounters(encounterTemplates,data.gardenDate);noticedEncounter=null;trailStep=0;contextSignature='';scenery();phaseTwo.renderWorld();renderDecorations();renderBackpack();save();say('Un nuevo día, Isis. La tierra vuelve a estar lista y el sendero guarda otras sorpresas.');}
}
function renderDecorations(){
 let layer=el('garden-decorations');if(!layer){layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.id='garden-decorations';layer.setAttribute('aria-hidden','true');svg.insertBefore(layer,el('map-stations'));}
 const art={pot:'<path d="M-14-2H14L10 19H-10Z" fill="#bd9271"/><path d="M0-2V-23M0-11Q-18-27-17-13Q-12-5 0-11M0-17Q15-32 17-20Q14-10 0-17" fill="#96ac7d" stroke="#77925f"/>',lamp:'<circle cy="-24" r="36" fill="url(#lamp-glow)"/><path d="M0 16V-35" stroke="#9e8f69" stroke-width="4"/><rect x="-8" y="-36" width="16" height="20" rx="5" fill="#edcf83"/>',bench:'<path d="M-25-12H25M-25-3H25M-28 8H28M-20 8V24M20 8V24" stroke="#c2a47d" stroke-width="7"/>',stone:'<ellipse rx="20" ry="11" fill="#bab89b"/><ellipse cx="15" cy="8" rx="12" ry="8" fill="#929e89"/>'};
 phaseTwo?.renderWorld();
 layer.innerHTML=data.decorations.map(d=>`<g transform="translate(${d.x} ${d.y})"><ellipse cy="21" rx="25" ry="6" fill="#15372b" opacity=".2"/>${art[d.type]}</g>`).join('');
}
let trailStep=0;
function renderDiscovery(s){
 const play=el('discovery-play');play.replaceChildren();
 if(s.id==='envelope')el('discovery-text').textContent='Isis, este jardín guarda un lugar para ti. Besito en tu pollollo.';
 if(s.id==='petals'||s.id==='constellation'){
  const sky=s.id==='constellation';play.className=sky?'little-sky':'petal-mandala';
  const drawing=document.createElementNS('http://www.w3.org/2000/svg','svg');drawing.setAttribute('viewBox','0 0 240 200');drawing.setAttribute('preserveAspectRatio','none');drawing.setAttribute('aria-hidden','true');play.append(drawing);let points=[];
  const coords=[[120,22],[187,55],[202,125],[157,178],[80,174],[35,118],[52,52]];
  coords.forEach(([x,y],i)=>{const b=document.createElement('button');b.className='discovery-choice';b.textContent=sky?'✧':'❀';b.setAttribute('aria-label',(sky?'Estrella ':'Pétalo ')+(i+1));b.style.left=x/240*100+'%';b.style.top=y+'px';b.setAttribute('aria-pressed','false');b.onclick=()=>{b.classList.toggle('chosen');if(sky){points=points.filter(p=>p[0]!==x||p[1]!==y);if(b.classList.contains('chosen'))points.push([x,y]);drawing.innerHTML=`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#e4c577" stroke-width="2"/>`;}b.setAttribute('aria-pressed',String(b.classList.contains('chosen')));};play.append(b);});
  const reset=document.createElement('button');reset.className='play-reset';reset.textContent='Nuevo dibujo';reset.onclick=()=>{points=[];drawing.replaceChildren();play.querySelectorAll('[aria-pressed]').forEach(b=>{b.classList.remove('chosen');b.setAttribute('aria-pressed','false');});};play.append(reset);
 }else{play.className='';}
 if(s.id==='trail'){
  if(trailStep===2)el('discovery-text').textContent='La mariposa encontró un claro y se queda contigo. Puedes descansar aquí o dar otro paseo con ella.';
  const b=document.createElement('button');b.className='discovery-action';b.textContent=trailStep>=2?'Volver a pasear con ella':'Seguir a la mariposa';b.onclick=()=>{el('discovery-dialog').close();trailStep=(trailStep+1)%3;const base=dailyEncounters(encounterTemplates,data.gardenDate).find(e=>e.id==='trail');const next={...base,...clampPoint({x:base.x+(trailStep===1?65:trailStep===2?-40:0),y:base.y+(trailStep===1?-35:trailStep===2?45:0)})};Object.assign(encounters.find(e=>e.id==='trail'),next);el('encounter-trail').setAttribute('transform',`translate(${next.x} ${next.y})`);walkTo({...next,trail:true});};play.append(b);
 }
}
createExtras({getData:()=>data,save,position:()=>({...position}),renderDecorations,stop,beforeRestore:value=>{restoringBackup=value;}});

initGameMenus();

function beginRoute(point,options){route=planPath(position,point,options);target=route.shift()||null;}
const worldMap=createWorldMap({getPosition:()=>position,stations,walkTo,onZoom:value=>{zoom=value;cameraDirty=true;}});
