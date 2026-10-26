import {gardenIcon} from './garden-art.js';
export function createGardenLife({player,stage,onSit}){
 const bubble=document.createElementNS('http://www.w3.org/2000/svg','g');bubble.id='isis-reaction';bubble.setAttribute('aria-hidden','true');bubble.setAttribute('transform','translate(24 -72)');bubble.style.display='none';player.append(bubble);let timer=0;
 function react(kind='heart'){clearTimeout(timer);bubble.innerHTML=`<circle r="17" fill="#f4e8c7" stroke="#cbb681"/><svg x="-13" y="-13" width="26" height="26" viewBox="-36 -36 72 72">${gardenIcon(kind).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`;bubble.style.display='';bubble.classList.remove('reaction-pop');void bubble.getBoundingClientRect();bubble.classList.add('reaction-pop');timer=setTimeout(()=>{bubble.style.display='none';},2400);}
 const sit=document.getElementById('sit-with-luci');sit.onclick=()=>{onSit();};
 function setSeated(value){player.classList.toggle('is-seated',value);stage.classList.toggle('sitting-with-luci',value);sit.setAttribute('aria-pressed',String(value));sit.textContent=value?'Levantarme':'Sentarme';sit.setAttribute('aria-label',value?'Levantarme y seguir paseando':'Sentarme con Luci');}
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);bubble.style.display='none';}});
 return {react,setSeated};
}
