export const BLOOMS=[
 {id:'sun',name:'girasoles',color:'#e6bf60',symbol:'☀'},
 {id:'daisy',name:'margaritas blancas',color:'#fff5d8',symbol:'❀'},
 {id:'rose',name:'flores rosas',color:'#d99aaa',symbol:'✿'},
 {id:'leaf',name:'hojitas verdes',color:'#a6c78e',symbol:'❧'}
];
export function shuffle(items,rng=Math.random){
 const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;
}
export function chooseDifferent(items,previous,rng=Math.random){const options=items.filter(item=>item!==previous);return (options.length?options:items)[Math.floor(rng()*(options.length||items.length))];}
export function flowerRound(previous,rng=Math.random,{size=16}={}){
 const goal=chooseDifferent(BLOOMS.map(b=>b.id),previous,rng),others=BLOOMS.filter(b=>b.id!==goal);
 const tiles=shuffle([goal,goal,goal,...Array.from({length:(size===9?9:16)-3},(_,i)=>others[i%others.length].id)],rng);
 return {goal,tiles};
}
export function lightSequence(length=3,rng=Math.random){
 const count=[3,4,5].includes(length)?length:3,result=[];
 for(let i=0;i<count;i++)result.push(chooseDifferent([0,1,2,3],result.at(-1),rng));return result;
}
export function followLight(sequence,progress,choice){
 if(progress>=sequence.length)return {progress,complete:true,matched:false};
 const matched=sequence[progress]===choice,next=progress+(matched?1:0);
 return {progress:next,complete:next===sequence.length,matched};
}
export function drawingLayout(rng=Math.random){
 // Separate angular sectors keep every 44 px target apart at narrow widths.
 return Array.from({length:7},(_,i)=>{const a=(i/7*Math.PI*2)-Math.PI/2,rx=77+rng()*10,ry=64+rng()*9;return [120+Math.cos(a)*rx,94+Math.sin(a)*ry];});
}
