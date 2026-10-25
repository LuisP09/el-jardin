import {stationIcons} from './illustration.js';
import {WORLD} from './game-core.js';
import {REGIONS,overviewSVG,regionAt} from './world-layout.js';
export function createWorldMap({getPosition,stations,walkTo,onZoom}){
 const $=id=>document.getElementById(id),map=$('garden-overview-svg');
 const mini=$('garden-mini-svg');mini.innerHTML=overviewSVG()+'<circle id="mini-player" r="50" fill="#fff2be" stroke="#3d6552" stroke-width="18"/>';
 map.innerHTML=overviewSVG()+REGIONS.map(r=>`<text x="${r.x}" y="${r.y-160}" text-anchor="middle" class="overview-region">${({garden:'Girasoles',stars:'Colina',glass:'Invernadero',woods:'Bosque',meadow:'Pradera',river:'Ribera'})[r.id]}</text>`).join('')+stations.map(s=>`<g class="overview-station" data-map-station="${s.id}" role="button" tabindex="0" aria-label="Caminar a ${s.name}" transform="translate(${s.x} ${s.y})"><circle r="48"/><g transform="scale(3.2)" class="overview-poi-icon">${stationIcons[s.id]||stationIcons.flowers}</g></g>`).join('')+'<circle id="overview-player" r="30" fill="#fff5cb" stroke="#466e58" stroke-width="12"/>';
 for(const node of map.querySelectorAll('[data-map-station]')){const s=stations.find(s=>s.id===node.dataset.mapStation);node.onclick=()=>choose(s);node.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(s);}};}
 $('world-map-destinations').replaceChildren();for(const s of stations){const b=document.createElement('button');b.type='button';b.textContent=s.name;b.onclick=()=>choose(s);$('world-map-destinations').append(b);}
 function choose(s){$('world-map-dialog').close();walkTo(s);}
 $('world-map-open').onclick=()=>{update(true);$('world-map-dialog').showModal();};$('close-world-map').onclick=()=>$('world-map-dialog').close();
 let wide=false;$('world-zoom').onclick=()=>{wide=!wide;$('world-zoom').setAttribute('aria-pressed',String(wide));$('world-zoom').setAttribute('aria-label',wide?'Acercar la cámara':'Alejar la cámara');$('world-zoom').textContent=wide?'＋':'−';onZoom(wide?.73:1);};
 let last={x:-1000,y:-1000};
 function update(force=false){const p=getPosition();if(!force&&Math.hypot(last.x-p.x,last.y-p.y)<10)return;last={...p};$('mini-player').setAttribute('cx',p.x);$('mini-player').setAttribute('cy',p.y);$('overview-player').setAttribute('cx',p.x);$('overview-player').setAttribute('cy',p.y);$('world-map-location').textContent=regionAt(p).name;}
 update(true);return {update};
}
