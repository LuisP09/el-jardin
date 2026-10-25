// Texturas originales: ruido filtrado, sin archivos externos ni frecuencias terapéuticas.
export const SOUNDS = {
  rain: { name:'Lluvia suave', low:5200, high:280, color:0.3, wave:0.12 },
  stream: { name:'Arroyo', low:3200, high:160, color:0.55, wave:0.25 },
  breeze: { name:'Brisa entre hojas', low:2400, high:220, color:0.8, wave:0.35 }
};
export function createTexture(kind, sampleRate, seconds=12, seed=137) {
  const preset=SOUNDS[kind];
  if(!preset) throw new Error('Ambiente desconocido');
  const samples=new Float32Array(Math.round(sampleRate*seconds));
  let state=seed>>>0,slow=0,medium=0,sum=0;
  for(let i=0;i<samples.length;i++){
    state=(Math.imul(state,1664525)+1013904223)>>>0;
    const white=(state/4294967296)*2-1;
    slow=.985*slow+.015*white;medium=.75*medium+.25*white;
    const texture=white*(1-preset.color)+medium*preset.color*2+slow*preset.color*3;
    const envelope=1-preset.wave/2+preset.wave/2*Math.sin(i/samples.length*Math.PI*4);
    samples[i]=texture*envelope;sum+=samples[i]*samples[i];
  }
  const scale=.25/Math.sqrt(sum/samples.length);
  for(let i=0;i<samples.length;i++)samples[i]=Math.max(-.85,Math.min(.85,samples[i]*scale));
  return samples;
}

export class GardenAudio {
  constructor({onState=()=>{},onLevel=()=>{}}={}){
    this.onState=onState;this.onLevel=onLevel;this.volume=.45;this.kind='rain';this.playing=false;this.voices=[];this.generation=0;this.pending=false;
  }
  init(){
    if(this.context&&this.context.state!=='closed')return;
    this.active=null;this.voices=[];
    const Context=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!Context)throw new Error('Este navegador no tiene audio compatible.');
    this.context=new Context();this.master=this.context.createGain();this.master.gain.value=0;
    this.compressor=this.context.createDynamicsCompressor();this.compressor.threshold.value=-14;this.compressor.ratio.value=3;this.compressor.attack.value=.02;this.compressor.release.value=.3;
    this.analyser=this.context.createAnalyser();this.analyser.fftSize=256;this.levelSamples=new Float32Array(256);
    this.master.connect(this.compressor);this.compressor.connect(this.analyser);this.analyser.connect(this.context.destination);
    this.context.addEventListener('statechange',()=>{this.onState();if(this.context.state==='running'&&this.playing)this.meter();});
  }
  voice(kind){
    const context=this.context,preset=SOUNDS[kind],buffer=context.createBuffer(2,context.sampleRate*12,context.sampleRate);
    for(let channel=0;channel<2;channel++)buffer.copyToChannel(createTexture(kind,context.sampleRate,12,137+channel*811),channel);
    const source=context.createBufferSource(),high=context.createBiquadFilter(),low=context.createBiquadFilter(),gain=context.createGain();
    source.buffer=buffer;source.loop=true;high.type='highpass';high.frequency.value=preset.high;low.type='lowpass';low.frequency.value=preset.low;
    source.connect(high);high.connect(low);low.connect(gain);gain.connect(this.master);gain.gain.value=0;source.start();
    const voice={source,gain,high,low};
    source.onended=()=>{source.disconnect();high.disconnect();low.disconnect();gain.disconnect();this.voices=this.voices.filter(v=>v!==voice);};
    this.voices.push(voice);return voice;
  }
  ramp(param,value,seconds=.8){const now=this.context.currentTime;param.cancelScheduledValues(now);param.setValueAtTime(param.value,now);param.linearRampToValueAtTime(value,now+seconds);}
  async play(){
    if(this.pending)return;this.pending=true;this.onState();const generation=++this.generation;
    try{
      this.init();
      // resume se invoca directamente desde el gesto de la persona (Safari/Chrome móvil).
      await this.context.resume();
      if(generation!==this.generation)return;
      if(this.context.state!=='running')throw new Error('El navegador pausó el audio. Pulsa Escuchar otra vez.');
      if(!this.active){this.active=this.voice(this.kind);this.ramp(this.active.gain.gain,1,1.2);}
      this.playing=true;this.ramp(this.master.gain,this.volume*.95,1.2);this.meter();
    }finally{this.pending=false;this.onState();}
  }
  async select(kind){
    if(!SOUNDS[kind]||kind===this.kind)return;this.kind=kind;
    if(this.playing&&this.context?.state==='running'){
      const previous=this.active;this.active=this.voice(kind);this.ramp(this.active.gain.gain,1,1.3);
      if(previous){this.ramp(previous.gain.gain,0,1.3);previous.source.stop(this.context.currentTime+1.4);}
    }else if(this.active){
      for(const voice of this.voices){try{voice.source.stop();}catch{}}
      this.voices=[];this.active=null;
    }
    this.onState();
  }
  setVolume(value){this.volume=Math.max(0,Math.min(1,Number.isFinite(value)?value:0));if(this.context&&this.playing)this.ramp(this.master.gain,this.volume*.95,.15);this.onState();}
  stop(){++this.generation;this.playing=false;if(this.context){this.ramp(this.master.gain,0,.3);for(const voice of [...this.voices]){this.ramp(voice.gain.gain,0,.25);try{voice.source.stop(this.context.currentTime+.35);}catch{}}this.voices=[];this.active=null;}clearTimeout(this.meterTimer);this.onLevel(0);this.onState();}
  async background(){if(!this.context||!this.playing)return;clearTimeout(this.meterTimer);await this.context.suspend();this.onLevel(0);this.onState();}
  meter(){clearTimeout(this.meterTimer);if(!this.playing||this.context.state!=='running')return;this.analyser.getFloatTimeDomainData(this.levelSamples);let sum=0;for(const sample of this.levelSamples)sum+=sample*sample;this.onLevel(Math.sqrt(sum/this.levelSamples.length));this.meterTimer=setTimeout(()=>this.meter(),150);}
}
