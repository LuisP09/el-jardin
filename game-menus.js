export function paginateCards(container,{label='Página'}={}){
 const cards=Array.from(container.children);if(!cards.length||cards[0].classList.contains('phase-empty'))return;
 let page=0;const nav=document.createElement('nav');nav.className='book-pagination';nav.setAttribute('aria-label','Cambiar página');
 const prev=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');prev.type=next.type='button';prev.textContent='←';next.textContent='→';prev.setAttribute('aria-label','Página anterior');next.setAttribute('aria-label','Página siguiente');count.setAttribute('role','status');
 function show(){cards.forEach((card,i)=>{card.hidden=i!==page;});prev.disabled=page===0;next.disabled=page===cards.length-1;count.textContent=`${label} ${page+1} de ${cards.length}`;}
 prev.onclick=()=>{page=Math.max(0,page-1);show();};next.onclick=()=>{page=Math.min(cards.length-1,page+1);show();};nav.append(prev,count,next);container.after(nav);container.classList.add('paged-gallery');show();
}
export function initGameMenus(){
 document.querySelectorAll('[data-game-tabs]').forEach(nav=>{
  const tabs=Array.from(nav.querySelectorAll('[role=tab]'));const select=(tab,focus=false)=>{tabs.forEach(b=>{const active=b===tab;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=!active;});if(focus)tab.focus();};
  tabs.forEach((tab,i)=>{tab.onclick=()=>select(tab);tab.onkeydown=e=>{let index=i;if(e.key==='ArrowRight')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft')index=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();select(tabs[index],true);};});select(tabs[0]);
 });
 const icons={
  games:'<path d="M5 28L13 13 24 27 34 8M9 7v6m-3-3h6M26 31v6m-3-3h6"/>',
  notebook:'<path d="M5 5q8-3 15 0q7-3 15 0v28q-8-3-15 0q-7-3-15 0ZM20 5v28M9 12h6m-6 6h6m10-6h6m-6 6h6"/>',
  pot:'<path d="M10 21h20l-3 14H13ZM20 21V7m0 9Q4 2 9 13q4 7 11 3m0-4Q36 0 32 12q-6 6-12 0"/>',
  postcard:'<rect x="4" y="7" width="32" height="26" rx="3"/><path d="M4 10l16 13 16-13M8 29l8-8m16 8l-8-8"/>',
  weather:'<circle cx="16" cy="14" r="7"/><path d="M16 2v3M3 14h3M7 5l3 3m16-3l-3 3M13 30q-8-10 4-13q4-10 12-3q12-1 8 12q0 4-7 4Z"/>',
  install:'<path d="M14 4H7v32h26V4h-7M20 2v20m-7-7l7 7 7-7M14 30h12"/>',
  rest:'<path d="M20 19Q4-1 4 14q-1 12 16 22q17-10 16-22Q36-1 20 19Z"/>'
 };
 for(const[id,icon,label]of [['open-personalize','pot','Decorar'],['open-postcards','postcard','Postales']]){const b=document.getElementById(id);decorate(b,icons[icon],label);}
 document.querySelectorAll('[data-phase-open]').forEach(b=>{const id=b.dataset.phaseOpen;decorate(b,icons[id]||icons.weather,({notebook:'Cuaderno',weather:'Clima',games:'Minijuegos'})[id]||'Mi jardín');});
 for(const[id,icon]of [['open-install','install'],['backpack-rest','rest']]){const b=document.getElementById(id);if(b)b.dataset.menuIcon=icon;}
 function decorate(button,art,label){const full=button.textContent;button.setAttribute('aria-label',full);button.replaceChildren();const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 40 40');svg.setAttribute('aria-hidden','true');svg.innerHTML=art;const text=document.createElement('span');text.textContent=label;button.append(svg,text);}
}
