export const NOTE_LIMIT=80;
const text=(value,max)=>typeof value==='string'?value.slice(0,max):'';
const date=value=>typeof value==='string'&&Number.isFinite(Date.parse(value))?new Date(value).toISOString():'1970-01-01T00:00:00.000Z';
export function restoreJournal(value){
 const entries=[];
 for(const note of Array.isArray(value?.entries)?value.entries:[]){
  const id=text(note?.id,100);
  if(!note||!id||entries.some(n=>n.id===id)||!text(note.text,3000).trim())continue;
  entries.push({id,title:text(note.title,80),text:text(note.text,3000),created:date(note.created),updated:date(note.updated)});if(entries.length===NOTE_LIMIT)break;
 }
 const draft={id:entries.some(n=>n.id===value?.draft?.id)?value.draft.id:null,title:text(value?.draft?.title,80),text:text(value?.draft?.text,3000)};
 return {entries,draft};
}
export function commitNote(state,now=new Date().toISOString(),id=globalThis.crypto.randomUUID()){
 const draft=state.draft;if(!draft.text.trim())return {ok:false,reason:'empty'};
 const existing=state.entries.find(n=>n.id===draft.id);
 if(!existing&&state.entries.length>=NOTE_LIMIT)return {ok:false,reason:'full'};
 const note={id:existing?.id||id,title:draft.title.trim().slice(0,80),text:draft.text.slice(0,3000),created:existing?.created||now,updated:now};
 state.entries=state.entries.filter(n=>n.id!==note.id);state.entries.unshift(note);state.draft={id:note.id,title:note.title,text:note.text};return {ok:true,note};
}
