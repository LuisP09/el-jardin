import { GardenAudio, SOUNDS } from './soundscape.js';
const $=id=>document.getElementById(id);
let volume=.45,kind='rain';
try{const preferences=JSON.parse(localStorage.getItem('isis-audio')||'null');if(Number.isFinite(preferences?.volume))volume=Math.max(0,Math.min(1,preferences.volume));if(SOUNDS[preferences?.kind])kind=preferences.kind;}catch{}
const audio=new GardenAudio({onState:render,onLevel:level=>{$('audio-meter').firstElementChild.style.width=`${Math.min(100,level*650)}%`;}});
audio.volume=volume;audio.kind=kind;
function remember(){try{localStorage.setItem('isis-audio',JSON.stringify({volume:audio.volume,kind:audio.kind}));}catch{}}
function render(){
  const running=audio.playing&&audio.context?.state==='running';
  const paused=audio.playing&&!running;
  $('audio-play').disabled=audio.pending;$('audio-play').textContent=audio.pending?'Preparando ambiente…':running?'Reproduciendo · '+SOUNDS[audio.kind].name:audio.playing?'Reanudar ambiente':'Escuchar ambiente';
  $('audio-play').setAttribute('aria-pressed',String(running));$('audio-stop').disabled=!audio.playing&&!audio.pending;
  $('game-sound').classList.toggle('audio-on',running);
  $('game-sound').classList.toggle('audio-paused',paused);
  $('game-sound').firstChild.nodeValue=paused?'Ⅱ ':'♪ ';
  $('game-sound').querySelector('span').textContent=paused?'En pausa':'Sonido';
  $('game-sound').setAttribute('aria-label',running?`Configurar sonido: ${SOUNDS[audio.kind].name} activo`:paused?'Sonido en pausa. Abrir para reanudar.':'Configurar sonidos del jardín');
  $('sound').textContent=running?'♪ Sonido encendido':'♪ Sonido apagado';$('sound').setAttribute('aria-pressed',String(running));
  $('audio-volume-value').value=`${Math.round(audio.volume*100)}%`;
  $('audio-status').textContent=audio.pending?'Preparando tu ambiente…':running?(audio.volume===0?'Reproduciendo con volumen en cero. Sube el control para escucharlo.':`Ambiente activo: ${SOUNDS[audio.kind].name}. La barra muestra la señal de audio; el volumen final depende de tu dispositivo.`):audio.playing?'El ambiente está en pausa. Pulsa Reanudar para escucharlo.':'Apagado. El sonido comienza solo cuando tú lo activas.';
}
function open(){ $('audio-dialog').showModal();render(); }
$('game-sound').onclick=open;$('sound').onclick=open;$('close-audio').onclick=()=>$('audio-dialog').close();
$('audio-play').onclick=async()=>{if(audio.playing&&audio.context?.state==='running')return;try{await audio.play();}catch(error){$('audio-status').textContent=`No pudimos iniciar el sonido. ${error.message} Comprueba el volumen multimedia y vuelve a intentarlo.`;}};
$('audio-stop').onclick=()=>audio.stop();
$('audio-volume').value=String(Math.round(volume*100));$('audio-volume').oninput=e=>{audio.setVolume(Number(e.target.value)/100);remember();};
document.querySelectorAll('[name="soundscape"]').forEach(input=>{input.checked=input.value===kind;input.onchange=async()=>{try{await audio.select(input.value);remember();}catch{$('audio-status').textContent='No se pudo cambiar el ambiente. Apágalo y vuelve a escucharlo.';}};});
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.background().catch(()=>{});else render();});
window.addEventListener('pageshow',render);
render();
