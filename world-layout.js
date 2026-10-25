import {WORLD,clampPoint,moveTowards} from './game-core.js';
export const PLACES={greenhouse:{x:2020,y:430},visitors:{x:540,y:1360},river:{x:2650,y:1450},moments:{x:1700,y:1430},flowers:{x:470,y:510},daisies:{x:780,y:340},pond:{x:1060,y:690},letter:{x:260,y:690},stars:{x:1350,y:300},art:{x:2490,y:690},cinema:{x:240,y:270}};
export const REGIONS=[{id:'garden',name:'El jardín de los comienzos',x:550,y:580,rx:630,ry:540,color:'#8ca773'},{id:'stars',name:'La colina de las estrellas',x:1350,y:290,rx:380,ry:330,color:'#8b9d8d'},{id:'glass',name:'El valle del invernadero',x:2110,y:450,rx:670,ry:500,color:'#a4b482'},{id:'woods',name:'El bosque de los visitantes',x:510,y:1390,rx:670,ry:560,color:'#678e70'},{id:'meadow',name:'La pradera compartida',x:1690,y:1430,rx:720,ry:600,color:'#b8b581'},{id:'river',name:'La ribera de los sauces',x:2670,y:1300,rx:440,ry:680,color:'#81a99b'}];
export const ROAD_NODES=[{x:240,y:270},{x:400,y:400},{x:470,y:510},{x:260,y:690},{x:650,y:700},{x:850,y:600},{x:780,y:340},{x:900,y:900},{x:1110,y:790},{x:1320,y:750},{x:1400,y:500},{x:1350,y:300},{x:1760,y:500},{x:2020,y:430},{x:2310,y:690},{x:2490,y:690},{x:700,y:1200},{x:540,y:1360},{x:1400,y:1100},{x:1700,y:1430},{x:2280,y:1440},{x:2650,y:1450},{x:1060,y:690}];
export const ROAD_LINKS=[[0,1],[1,2],[2,3],[2,4],[4,5],[5,6],[4,7],[7,8],[8,9],[9,10],[10,11],[10,12],[12,13],[13,14],[14,15],[7,16],[16,17],[7,18],[9,18],[18,19],[19,20],[20,21],[8,22]];
export const ENCOUNTER_SPOTS=[[590,590],[720,430],[920,820],[1270,370],[360,580],[540,300],[830,1130],[1180,870],[380,230],[650,1250],[1490,1190],[1640,1510],[1910,580],[2160,410],[2340,820],[2560,1260],[2380,1580],[490,1480],[810,1520],[1130,1250],[1730,920],[1980,1260],[1540,570],[2660,900]];
export function regionAt(p){return REGIONS.reduce((best,r)=>{const score=Math.hypot((p.x-r.x)/r.rx,(p.y-r.y)/r.ry);return !best||score<best.score?{region:r,score}:best;},null).region;}
export function walkablePoint(value){const p=clampPoint(value),dx=(p.x-1080)/174,dy=(p.y-590)/96,d=Math.hypot(dx,dy);if(d<1){const angle=d?Math.atan2(dy,dx):Math.PI/2;p.x=1080+Math.cos(angle)*175;p.y=590+Math.sin(angle)*97;}if(p.x>2800&&p.y>570)p.x=2800;return p;}
export function segmentSafe(a,b){const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/18));for(let i=0;i<=steps;i++){const p={x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps},safe=walkablePoint(p);if(Math.hypot(p.x-safe.x,p.y-safe.y)>2)return false;}return true;}
export function walkStep(from,to,distance){const next=moveTowards(from,to,distance),safe=walkablePoint(next);return Math.hypot(safe.x-from.x,safe.y-from.y)>distance*1.6+.1?from:safe;}
export function planPath(from,value,{followRoads=false}={}){
 const to=walkablePoint(value);if(segmentSafe(from,to)&&(!followRoads||Math.hypot(to.x-from.x,to.y-from.y)<200))return [to];
 if(!followRoads)return obstaclePath(from,to);
 const closest=p=>ROAD_NODES.map((n,i)=>({i,d:Math.hypot(n.x-p.x,n.y-p.y)})).filter(n=>segmentSafe(p,ROAD_NODES[n.i])).sort((a,b)=>a.d-b.d)[0]?.i;
 const start=closest(from),end=closest(to);if(start===undefined||end===undefined)return [to];
 const distances=ROAD_NODES.map(()=>Infinity),previous=[],pending=new Set(ROAD_NODES.map((_,i)=>i));distances[start]=0;
 while(pending.size){const current=[...pending].sort((a,b)=>distances[a]-distances[b])[0];pending.delete(current);if(current===end)break;for(const[a,b]of ROAD_LINKS){const next=a===current?b:b===current?a:null;if(next===null||!pending.has(next))continue;const cost=distances[current]+Math.hypot(ROAD_NODES[next].x-ROAD_NODES[current].x,ROAD_NODES[next].y-ROAD_NODES[current].y);if(cost<distances[next]){distances[next]=cost;previous[next]=current;}}}
 const route=[];let index=end;while(index!==undefined){route.unshift({...ROAD_NODES[index]});if(index===start)break;index=previous[index];}if(!route.length||Math.hypot(route.at(-1).x-to.x,route.at(-1).y-to.y)>2)route.push(to);return route.filter((p,i)=>i||Math.hypot(p.x-from.x,p.y-from.y)>12);
}
function obstaclePath(from,to){
 const points=[from,to,...Array.from({length:16},(_,i)=>({x:1080+Math.cos(i*Math.PI/8)*184,y:590+Math.sin(i*Math.PI/8)*107})),{x:2790,y:560}];
 const count=points.length,edges=points.map(()=>[]),distances=points.map(()=>Infinity),previous=[],pending=new Set(points.map((_,i)=>i));
 for(let a=0;a<count;a++)for(let b=a+1;b<count;b++)if(segmentSafe(points[a],points[b])){const distance=Math.hypot(points[a].x-points[b].x,points[a].y-points[b].y);edges[a].push([b,distance]);edges[b].push([a,distance]);}
 distances[0]=0;
 while(pending.size){const current=[...pending].sort((a,b)=>distances[a]-distances[b])[0];pending.delete(current);if(current===1||!Number.isFinite(distances[current]))break;for(const[next,cost]of edges[current])if(pending.has(next)&&distances[current]+cost<distances[next]){distances[next]=distances[current]+cost;previous[next]=current;}}
 if(!Number.isFinite(distances[1]))return planPath(from,to,{followRoads:true});
 const route=[];let i=1;while(i!==0){route.unshift({...points[i]});i=previous[i];}return route;
}
export function overviewSVG(){return `<rect width="${WORLD.width}" height="${WORLD.height}" rx="90" fill="#9eae83"/>${REGIONS.map(r=>`<ellipse cx="${r.x}" cy="${r.y}" rx="${r.rx}" ry="${r.ry}" fill="${r.color}" opacity=".65"/>`).join('')}<path d="M2930 550Q2750 900 2920 1180T2870 2050" fill="none" stroke="#739f99" stroke-width="220"/>${ROAD_LINKS.map(([a,b])=>`<path d="M${ROAD_NODES[a].x} ${ROAD_NODES[a].y}L${ROAD_NODES[b].x} ${ROAD_NODES[b].y}" stroke="#e2d2a8" stroke-width="24" stroke-linecap="round"/>`).join('')}<ellipse cx="1080" cy="590" rx="156" ry="84" fill="#6c9e94"/>`;}
