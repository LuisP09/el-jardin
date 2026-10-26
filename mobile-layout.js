import {mobileHeight} from './arrival-core.js';
export function initMobileLayout(){
 let frame=0,keyboard=false;
 function update(){
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const active=document.activeElement,editing=/INPUT|TEXTAREA|SELECT/.test(active?.tagName),height=mobileHeight(innerHeight,window.visualViewport?.height,editing),visible=editing&&height<innerHeight-100;
   document.documentElement.style.setProperty('--visible-height',`${height}px`);
   document.documentElement.classList.toggle('keyboard-open',visible);
   if(visible&&!keyboard)active.scrollIntoView({block:'nearest',behavior:'auto'});keyboard=visible;
  });
 }
 window.visualViewport?.addEventListener('resize',update);window.addEventListener('resize',update);document.addEventListener('focusin',update);document.addEventListener('focusout',update);update();
}
