export const SEEDS={sunflower:'Girasol',daisy:'Margarita',starlight:'Luz de estrella'};
export const SPECIAL_FLOWERS={
 'sunflower+sunflower':{id:'sol',name:'Girasol de ámbar',color:'#e5b44c',center:'#80543c',description:'Pétalos cálidos que recuerdan la última luz de la tarde.'},
 'daisy+daisy':{id:'nieve',name:'Margarita de porcelana',color:'#fff5dc',center:'#d9b458',description:'Una flor pequeña con pétalos como pinceladas de crema.'},
 'starlight+starlight':{id:'estrella',name:'Estrella del invernadero',color:'#c6b8df',center:'#eee0a9',description:'Una flor violeta que parece guardar un pedacito de cielo.'},
 'daisy+sunflower':{id:'miel',name:'Margarita de miel',color:'#e7c681',center:'#b48349',description:'La forma de una margarita y los colores de un girasol.'},
 'starlight+sunflower':{id:'luna',name:'Girasol de luna',color:'#c6d5bb',center:'#baa773',description:'Verde suave y luz dorada para las tardes tranquilas.'},
 'daisy+starlight':{id:'perla',name:'Margarita de nácar',color:'#e5bdcb',center:'#dfcd8c',description:'Rosa y marfil, como una pequeña acuarela entre hojas.'}
};
export const FLOWERS=Object.values(SPECIAL_FLOWERS);
export const VISITORS={cat:{name:'Miso, el gatito',description:'Le gustan los rincones tibios y sentarse cerca de Isis.'},rabbit:{name:'Nube, el conejito',description:'Se asoma cuando hay alguna flor abierta en el jardín.'},bird:{name:'Brisa, el petirrojo',description:'Le gustan las macetas y los farolitos que eliges para decorar.'}};
export const RIVER_FINDS={shell:{name:'Una concha del río',description:'El agua dejó una espiral entre las piedras.'},reed:{name:'Una ramita de junco',description:'Una línea verde que se refleja en el agua.'},reflection:{name:'Un reflejo de estrellas',description:'El río también tiene un cielo para mirar.'}};
export const WEATHER={clear:'Cielo despejado',sunset:'Atardecer',mist:'Neblina ligera',rain:'Lluvia suave'};
export const MOMENTS={picnic:'Un picnic entre flores',cinema:'Nuestro cine al aire libre',bouquet:'Un ramo para compartir'};
export const MOMENT_DETAILS={picnic:{tea:'Una taza de té',fruit:'Fruta para compartir',book:'Un libro'},cinema:{lights:'Guirnalda de luces',popcorn:'Palomitas',blanket:'Una mantita'},bouquet:{ribbon:'Un lazo',tag:'Una tarjetita',leaves:'Ramas verdes'}};
const unique=(value,allowed)=>Array.isArray(value)?[...new Set(value.filter(x=>Object.hasOwn(allowed,x)))]:[];
export function restorePhaseTwo(value={}){
 value=value&&typeof value==='object'?value:{};const flowers={};
 for(const f of FLOWERS)if([1,2,3].includes(value.flowers?.[f.id]))flowers[f.id]=value.flowers[f.id];
 return {flowers,visitors:unique(value.visitors,VISITORS),riverFinds:unique(value.riverFinds,RIVER_FINDS),moments:unique(value.moments,MOMENTS),weather:Object.hasOwn(WEATHER,value.weather)?value.weather:'clear',boats:Number.isInteger(value.boats)?Math.max(0,Math.min(999,value.boats)):0,riverPosition:riverPoint(value.riverPosition),details:Object.fromEntries(Object.keys(MOMENTS).map(id=>[id,unique(value.details?.[id],MOMENT_DETAILS[id])])),designs:Object.fromEntries(Object.keys(MOMENTS).map(id=>[id,['sage','honey','rose'].includes(value.designs?.[id])?value.designs[id]:'sage']))};
}
export function combineSeeds(a,b){if(!Object.hasOwn(SEEDS,a)||!Object.hasOwn(SEEDS,b))throw Error('Elige dos semillas del invernadero.');return SPECIAL_FLOWERS[[a,b].sort().join('+')];}
export function plantSpecial(state,a,b){const flower=combineSeeds(a,b);const fresh=!state.flowers[flower.id];if(fresh)state.flowers[flower.id]=1;return {flower,fresh};}
export function waterSpecial(state,id){if(!state.flowers[id])return false;state.flowers[id]=Math.min(3,state.flowers[id]+1);return true;}
export function availableVisitors(game){return ['cat',...(Object.values(game.plots||{}).flat().some(s=>s?.stage===3)||Object.values(game.phase2?.flowers||{}).some(s=>s===3)?['rabbit']:[]),...(game.decorations?.some(d=>['pot','lamp'].includes(d.type))?['bird']:[])];}
export function riverPoint(point){let x=Number.isFinite(point?.x)?Math.max(40,Math.min(760,point.x)):110,y=Number.isFinite(point?.y)?Math.max(65,Math.min(350,point.y)):300;if(y>125&&y<290&&Math.abs(x-400)>40)y=y<205?115:300;return {x,y};}
export function riverRoute(from,to){
 const target=riverPoint(to),bank=p=>p.y<=125?'top':p.y>=290?'bottom':'bridge';
 const a=bank(from),b=bank(target);
 if(a===b)return [target];
 const route=[];if(a!=='bridge')route.push({x:400,y:a==='top'?110:305});if(b!=='bridge')route.push({x:400,y:b==='top'?110:305});route.push(target);return route;
}
