import {ENCOUNTER_SPOTS} from './world-layout.js';
import {clampPoint} from './game-core.js';
export function dayKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function renewDay(state,key=dayKey()){
  if(!state.gardenDate){state.gardenDate=key;return false;}
  if(key<=state.gardenDate)return false;
  state.gardenDate=key;state.plots={flowers:Array(8).fill(null),daisies:Array(8).fill(null)};state.beds={flowers:0,daisies:0};state.finds=[];return true;
}
const spots=ENCOUNTER_SPOTS;
export function dailyEncounters(items,key){
  const day=Math.floor(Date.UTC(...key.split('-').map((n,i)=>Number(n)-(i===1?1:0)))/86400000);
  return items.map((item,i)=>({...item,x:spots[((day%spots.length)+spots.length+i)%spots.length][0],y:spots[((day%spots.length)+spots.length+i)%spots.length][1]}));
}
export function restoreExtras(value={}){
  return {gardenDate:/^\d{4}-\d{2}-\d{2}$/.test(value.gardenDate)?value.gardenDate:null,
    decorations:Array.isArray(value.decorations)?value.decorations.filter(d=>d&&['pot','lamp','bench','stone'].includes(d.type)&&Number.isFinite(d.x)&&Number.isFinite(d.y)).slice(0,30).map(d=>({type:d.type,...clampPoint(d)})):[],
    letters:Array.isArray(value.letters)?value.letters.filter(t=>typeof t==='string'&&t.trim()).slice(0,30).map(t=>t.slice(0,600)):[],
    keepsakes:Array.isArray(value.keepsakes)?[...new Set(value.keepsakes.filter(t=>typeof t==='string'))].slice(0,40):[]};
}
export function parseBackup(text){
  const value=JSON.parse(text);
  if(value?.format!=='isis-garden'||value.version!==1||!value.game||typeof value.game!=='object'||Array.isArray(value.game))throw Error('Este archivo no es una copia del jardín.');
  if(!value.game.plots||!Array.isArray(value.game.plots.flowers)||!Array.isArray(value.game.plots.daisies))throw Error('La copia no contiene los parterres.');
  return value;
}
