import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTexture, SOUNDS, GardenAudio } from '../soundscape.js';

test('Los tres ambientes generan señal audible de prueba, finita y sin recorte',()=>{
  for(const kind of Object.keys(SOUNDS)){
    const samples=createTexture(kind,24000,2);
    let sum=0,peak=0,mean=0;
    for(const sample of samples){assert.ok(Number.isFinite(sample));sum+=sample*sample;peak=Math.max(peak,Math.abs(sample));mean+=sample;}
    const rms=Math.sqrt(sum/samples.length);
    assert.ok(rms>.2&&rms<.27,`${kind}: nivel RMS inesperado ${rms}`);
    assert.ok(peak<=.851);assert.ok(Math.abs(mean/samples.length)<.03);
  }
});
test('Las preferencias de volumen se acotan y un ambiente inválido se rechaza',async()=>{
  const audio=new GardenAudio();audio.setVolume(2);assert.equal(audio.volume,1);
  audio.setVolume(-1);assert.equal(audio.volume,0);audio.setVolume(NaN);assert.equal(audio.volume,0);
  await audio.select('unknown');assert.equal(audio.kind,'rain');
  assert.throws(()=>createTexture('unknown',24000),/desconocido/);
});

test('El audio espera al gesto, se pausa en segundo plano y permite cambiar el ambiente pausado',async()=>{
  const previous=globalThis.AudioContext;
  const param=()=>({value:0,cancelScheduledValues(){},setValueAtTime(value){this.value=value;},linearRampToValueAtTime(value){this.value=value;}});
  const node=()=>({connect(){},disconnect(){},gain:param(),frequency:param()});
  class FakeContext{
    state='suspended';sampleRate=8000;currentTime=0;destination={};
    addEventListener(){}createGain(){return node();}
    createDynamicsCompressor(){return {...node(),threshold:param(),ratio:param(),attack:param(),release:param()};}
    createAnalyser(){return {...node(),getFloatTimeDomainData(samples){samples.fill(.03);}};}
    createBuffer(){return {copyToChannel(){}};}
    createBufferSource(){return {...node(),start(){},stop(){this.onended?.();}};}
    createBiquadFilter(){return node();}
    async resume(){this.state='running';}async suspend(){this.state='suspended';}
  }
  globalThis.AudioContext=FakeContext;const audio=new GardenAudio();
  try{
    assert.equal(audio.context,undefined);assert.equal(audio.playing,false);
    await audio.play();assert.equal(audio.context.state,'running');assert.equal(audio.voices.length,1);
    await audio.background();assert.equal(audio.context.state,'suspended');
    await audio.select('stream');assert.equal(audio.active,null);
    await audio.play();assert.equal(audio.kind,'stream');assert.equal(audio.voices.length,1);
    await audio.select('breeze');assert.equal(audio.voices.length,1);
    audio.stop();assert.equal(audio.playing,false);assert.equal(audio.master.gain.value,0);assert.equal(audio.voices.length,0);
    const oldContext=audio.context;oldContext.state='closed';
    await audio.play();assert.notEqual(audio.context,oldContext);assert.equal(audio.context.state,'running');assert.equal(audio.voices.length,1);
  }finally{audio.stop();globalThis.AudioContext=previous;}
});
