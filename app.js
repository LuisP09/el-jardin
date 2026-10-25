const $ = (s) => document.querySelector(s);
let saved = [];
try { saved = JSON.parse(localStorage.getItem('jardin-flores') || '[]'); if (!Array.isArray(saved)) saved = []; } catch {}
const flowers = saved.filter(x => x && Number.isFinite(x.x) && Number.isFinite(x.size) && Number.isInteger(x.color)).slice(-24);
const colors = ['#e6b5b5', '#e4cd8e', '#c4bbdd', '#ece4ce'];
function flowerSVG(type) {
  const sunflower=type==='sunflower',petals=sunflower?16:12;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 180"><path d="M40 180 Q30 120 40 48" fill="none" stroke="#8da57d" stroke-width="3"/><path d="M37 128 Q7 130 13 105 Q35 103 37 128 M37 102 Q67 99 65 78 Q42 80 37 102" fill="#66876a"/>${Array.from({length:petals},(_,i)=>`<ellipse cx="40" cy="27" rx="${sunflower?6:5}" ry="18" fill="${sunflower?'#efc448':'#fff9e6'}" transform="rotate(${i*360/petals} 40 46)"/>`).join('')}<circle cx="40" cy="46" r="${sunflower?15:9}" fill="${sunflower?'#654735':'#e3ba4f'}"/>${sunflower?'<circle cx="36" cy="42" r="2" fill="#997446"/><circle cx="44" cy="49" r="2" fill="#997446"/>':''}</svg>`;
}
function drawFlower(f) {
  const el = document.createElement('div'); el.className = 'flower';
  el.style.cssText = `left:${Math.max(0, Math.min(85, f.x))}%;height:${Math.max(80, Math.min(220, f.size))}px;animation-delay:-${f.x / 10}s`;
  el.innerHTML = flowerSVG(f.type || (f.color%2?'daisy':'sunflower'));el.setAttribute('aria-hidden','true');
  $('#flowers').append(el);
}
if (!flowers.length) { for(let i=0;i<7;i++) flowers.push({x: i*12, size:100+(i*37)%110, color:i%4}); }
flowers.forEach(drawFlower);
let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500); }
$('#plant').onclick = () => {
  const f={x:Math.random()*85,size:100+Math.random()*115,color:Math.floor(Math.random()*4),type:$('#flower-type').value};
  if(flowers.length>=24){flowers.shift();$('#flowers').firstElementChild.remove();}
  flowers.push(f);drawFlower(f);
  try{localStorage.setItem('jardin-flores',JSON.stringify(flowers));}catch{}
  toast(['Un pequeño comienzo también cuenta.','Esta flor es para tu momento de hoy.','Aquí hay espacio para ti.','Que algo bonito te acompañe hoy.'][Math.floor(Math.random()*4)]);
};
const labels={garden:'01 / EL JARDÍN DE LA CALMA',stars:'02 / UN CIELO PARA TI',art:'03 / EL TALLER SIN REGLAS',cinema:'04 / EL PEQUEÑO CINE'};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-view]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b));});
  document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==b.dataset.view);
  $('#scene-label').textContent=labels[b.dataset.view]; if(b.dataset.view==='art') resizeCanvas();
});
const messages=['Puedes ir despacio.','No necesitas resolverlo todo hoy.','Tus días nublados también tienen lugar aquí.','Hay belleza en volver a empezar.','Bajo este cielo, pienso en ti.'];
const positions=[[12,27],[75,22],[19,60],[71,62],[48,72]];
const found=new Set();
positions.forEach(([x,y],i)=>{const b=document.createElement('button');b.className='star-button';b.style.cssText=`left:${x}%;top:${y}%`;b.textContent='✧';b.setAttribute('aria-label',`Descubrir estrella ${i+1}`);b.onclick=()=>{found.add(i);b.classList.add('found');$('#star-message').textContent=found.size===5?'Isis, besito en tu pollollo. ♡':messages[i];if(found.size===5&&!$('.constellation-name')){const name=document.createElement('div');name.className='constellation-name';name.textContent='ISIS';$('#constellation').append(name);const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),line=document.createElementNS(ns,'polyline');svg.id='constellation-lines';svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');line.setAttribute('points',positions.map(([a,c])=>`${a+3},${c+7}`).join(' '));svg.append(line);$('#constellation').prepend(svg);}};$('#constellation').append(b);});
const canvas=$('#canvas'),ctx=canvas.getContext('2d');let color=colors[0],drawing=false,last=null;
function resizeCanvas(){const rect=canvas.getBoundingClientRect();if(!rect.width)return;const ratio=devicePixelRatio||1;const w=Math.round(rect.width*ratio),h=Math.round(rect.height*ratio);if(canvas.width===w&&canvas.height===h)return;const copy=document.createElement('canvas');copy.width=canvas.width;copy.height=canvas.height;copy.getContext('2d').drawImage(canvas,0,0);canvas.width=w;canvas.height=h;ctx.drawImage(copy,0,0,w,h);ctx.setTransform(ratio,0,0,ratio,0,0);}
window.addEventListener('resize',()=>{if(!$('#art').hidden)resizeCanvas();});
function point(e){const r=canvas.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];}
canvas.onpointerdown=e=>{drawing=true;last=point(e);canvas.setPointerCapture(e.pointerId);ctx.fillStyle=color;ctx.beginPath();ctx.arc(...last,2.5,0,Math.PI*2);ctx.fill();};
canvas.onpointermove=e=>{if(!drawing)return;const p=point(e);ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=5;ctx.lineCap='round';ctx.moveTo(...last);ctx.lineTo(...p);ctx.stroke();last=p;};
canvas.onpointerup=canvas.onpointercancel=()=>{drawing=false;last=null;};
document.querySelectorAll('.swatch').forEach(b=>b.onclick=()=>{color=b.dataset.color;document.querySelectorAll('.swatch').forEach(s=>{s.classList.toggle('selected',s===b);s.setAttribute('aria-pressed',String(s===b));});});
$('#clear').onclick=()=>ctx.clearRect(0,0,canvas.width,canvas.height);
const films=[['La noche también florece.','Quédate aquí. Mira cómo las luces se mueven.','#1d4140'],['Un bosque después de la lluvia.','Imagina el aroma de la tierra y las hojas.','#314c3b'],['El último abrazo del atardecer.','El cielo cambia de color, a su propio ritmo.','#674e50']];let film=0;
$('#change-film').onclick=()=>{film=(film+1)%films.length;$('#film-title').textContent=films[film][0];$('#film-caption').textContent=films[film][1];$('.cinema-frame').style.background=films[film][2];};
$('#pause-film').onclick=()=>{const paused=$('#cinema').classList.toggle('paused');$('#pause-film').textContent=paused?'Reanudar movimiento':'Pausar movimiento';$('#pause-film').setAttribute('aria-pressed',String(paused));};
$('#breath').onclick=()=>$('#breath-dialog').showModal();$('#close-breath').onclick=()=>$('#breath-dialog').close();
// Día y noche se eligen libremente, sin depender del reloj.
$('#day-toggle').onclick=()=>{const day=$('.world').classList.toggle('day');$('#day-toggle').textContent=day?'☾ Visitar de noche':'☀ Visitar de día';$('#day-toggle').setAttribute('aria-pressed',String(day));$('#flower-type').value=day?'sunflower':'daisy';};
const letters=[
  'Este jardín tiene tus flores favoritas y un cielo que puedes visitar cuando quieras. Un pequeño lugar pensado para ti.',
  'Un girasol para tus días de sol, una margarita para acompañar la noche. Aquí puedes quedarte un ratito, a tu manera.',
  'Hay una frase que tiene su propio rincón entre todas estas flores: Besito en tu pollollo.'
];
let letterIndex=0;
$('#letter-open').onclick=()=>{$('#letter-text').textContent=letters[letterIndex];$('#letter-dialog').showModal();};
$('#close-letter').onclick=()=>$('#letter-dialog').close();
$('#next-letter').onclick=()=>{letterIndex=(letterIndex+1)%letters.length;$('#letter-text').textContent=letters[letterIndex];};
const simpleOptions=document.createElement('div');simpleOptions.className='simple-options';simpleOptions.hidden=true;
[['Mirar','garden'],['Dibujar','art'],['Leer una notita','letter']].forEach(([text,view])=>{const b=document.createElement('button');b.textContent=text;b.onclick=()=>view==='letter'?$('#letter-open').click():$(`[data-view="${view}"]`).click();simpleOptions.append(b);});
$('.world').after(simpleOptions);
$('#simple-mode').onclick=()=>{const simple=document.body.classList.toggle('simple');$('#simple-mode').setAttribute('aria-pressed',String(simple));$('#simple-mode').textContent=simple?'Volver a todos los rincones':'Hoy necesito algo sencillo';simpleOptions.hidden=!simple;$('[data-view="garden"]').click();};
const discoveries={butterfly:['🦋','Una mariposa se posa en una margarita. Puedes imaginar sus colores, sin tener que seguirla.'],leaves:['🍃','Las hojas se mecen. Si te apetece, escucha un sonido cercano y quédate un instante con él.'],light:['✧','Una lucecita aparece entre los girasoles. A veces basta con mirar algo pequeño.']};
document.querySelectorAll('[data-discovery]').forEach(b=>b.onclick=()=>{const [icon,message]=discoveries[b.dataset.discovery];b.classList.add('visited');$('#discovery-message').replaceChildren();const illustration=document.createElement('span');illustration.className='encounter-illustration';illustration.textContent=icon;illustration.setAttribute('aria-hidden','true');$('#discovery-message').append(illustration,document.createTextNode(message));});
const card=$('#postcard'),cardCtx=card.getContext('2d');let cardVersion=0;
function renderPostcard(){
  const version=++cardVersion,sky=$('#card-sky').value;
  const palette={night:['#122e30','#2d5248','#f5edd5'],day:['#c3ddd2','#90b384','#294734'],sunset:['#9c6b73','#534d52','#fff0d4']}[sky];
  const gradient=cardCtx.createLinearGradient(0,0,0,650);gradient.addColorStop(0,palette[0]);gradient.addColorStop(1,palette[1]);cardCtx.fillStyle=gradient;cardCtx.fillRect(0,0,1000,650);
  cardCtx.fillStyle=sky==='day'?'#ffe3a0':'#f4e8bd';cardCtx.beginPath();cardCtx.arc(820,110,40,0,Math.PI*2);cardCtx.fill();
  if(sky==='night'){for(let i=0;i<35;i++){cardCtx.beginPath();cardCtx.arc((i*173+30)%980,(i*67+20)%410,1.5,0,Math.PI*2);cardCtx.fill();}}
  cardCtx.fillStyle=palette[2];cardCtx.textAlign='center';cardCtx.font='20px Georgia';cardCtx.fillText('EL JARDÍN DE ISIS',500,86);cardCtx.font='italic 38px Georgia';
  const phrase=$('#card-phrase').value.trim()||'Un ratito para ti';let line='',lines=[];
  phrase.split(/\s+/).forEach(word=>{const next=line?line+' '+word:word;if(cardCtx.measureText(next).width>800&&line){lines.push(line);line=word;}else if(cardCtx.measureText(word).width>800){if(line)lines.push(line);line='';for(const char of word){if(cardCtx.measureText(line+char).width>800){lines.push(line);line='';}line+=char;}}else line=next;});if(line)lines.push(line);
  lines.forEach((text,i)=>cardCtx.fillText(text,500,210+i*48));cardCtx.font='18px Georgia';cardCtx.fillText('Sin metas. Sin prisa. Contigo.',500,610);
  const image=new Image();image.onload=()=>{if(version!==cardVersion)return;for(let i=0;i<7;i++)cardCtx.drawImage(image,105+i*117,355+(i%2)*18,90,205);};image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(flowerSVG($('#card-flower').value));
}
['#card-flower','#card-sky','#card-phrase'].forEach(id=>$(id).addEventListener('input',renderPostcard));renderPostcard();
$('#download-card').onclick=()=>{card.toBlob(blob=>{if(!blob){$('#download-status').textContent='No se pudo crear la imagen. Inténtalo otra vez.';return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='una-postal-para-isis.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);$('#download-status').textContent='Tu postal está lista para guardar.';},'image/png');};
let movies=[];try{const data=JSON.parse(localStorage.getItem('isis-peliculas')||'[]');if(Array.isArray(data))movies=data.filter(m=>m&&typeof m.name==='string'&&typeof m.note==='string').slice(0,50);}catch{}
function saveMovies(){try{localStorage.setItem('isis-peliculas',JSON.stringify(movies));$('#movie-status').textContent='Lista guardada en este navegador.';}catch{$('#movie-status').textContent='La lista está disponible mientras esta página siga abierta; no se pudo guardar en el navegador.';}}
function renderMovies(){const list=$('#movies');list.replaceChildren();movies.forEach((movie,i)=>{const li=document.createElement('li'),div=document.createElement('div'),title=document.createElement('strong'),note=document.createElement('p'),remove=document.createElement('button');title.textContent=movie.name;note.textContent=movie.note;div.append(title,note);remove.textContent='Quitar';remove.setAttribute('aria-label',`Quitar ${movie.name}`);remove.onclick=()=>{movies.splice(i,1);saveMovies();renderMovies();};li.append(div,remove);list.append(li);});if(!movies.length){const li=document.createElement('li');li.textContent='La primera función la eligen ustedes.';list.append(li);}}
$('#movie-form').onsubmit=e=>{e.preventDefault();const name=$('#movie-name').value.trim(),note=$('#movie-note').value.trim();if(!name||!note){$('#movie-status').textContent='Escribe un título y una razón para compartirlo.';return;}if(movies.length>=50){$('#movie-status').textContent='Tu lista ya tiene 50 películas. Puedes quitar una para añadir otra.';return;}movies.push({name,note});saveMovies();renderMovies();$('#movie-form').reset();};renderMovies();
