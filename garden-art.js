export function gardenIcon(id){
 const petals=color=>`<g fill="${color}">${Array.from({length:8},(_,i)=>`<ellipse cy="-9" rx="4" ry="9" transform="rotate(${i*45})"/>`).join('')}</g><circle r="6" fill="#b78c4f"/>`;
 let art='';
 if(['sun','daisy','rose','flower'].includes(id))art=`<path d="M0 4v22m0-9q-16-18-19-7m19 0q14-18 19-8" fill="none" stroke="#9eb98a" stroke-width="3"/>${petals(id==='sun'?'#e8c263':id==='rose'?'#d9a5b1':'#f8efd3')}`;
 else if(id==='leaf')art='<path d="M-18 14Q-25-15 20-23Q26 13-18 14Z" fill="#a9c591" stroke="#d6dfb5" stroke-width="2"/><path d="M-21 23L12-13M-9 8l-7-12m15 2l13 1" fill="none" stroke="#6e9270" stroke-width="2"/>';
 else if(id==='clouds')art='<path d="M-24 9q-13-20 6-27q4-22 22-11q19-5 21 14q17 5 7 22q-1 6-13 6h-31Z" fill="#f9efda" stroke="#c7d8bf" stroke-width="2"/>';
 else if(id==='moon')art='<path d="M15-23Q-15-18-12 7Q-9 26 12 22Q-18 38-28 9Q-36-18-10-28Q5-33 15-23" fill="#e8d7a2" stroke="#f8edc5" stroke-width="2"/>';
 else if(id==='postcard')art='<rect x="-26" y="-24" width="52" height="43" rx="4" fill="#e9dfb9" stroke="#c1ac7e" stroke-width="3"/><rect x="-21" y="-19" width="42" height="29" fill="#7d9e83"/><circle cx="10" cy="-10" r="6" fill="#e7ca7b"/><path d="M-21 10l14-17 12 12 16-8v13" fill="#b1bd8a"/><path d="M-15 29h30M0 20v10" stroke="#ac926b" stroke-width="3"/>';
 else if(id==='heart')art='<path d="M0 22Q-35-2-22-17Q-9-30 0-13Q9-30 22-17Q35-2 0 22" fill="#d5a7ac" stroke="#f0d9bb" stroke-width="2"/>';
 else art='<path d="M0-28L7-8 26 0 7 8 0 28-7 8-26 0-7-8Z" fill="#e6d395" stroke="#fff0c3" stroke-width="2"/><circle r="4" fill="#f9f0ce"/>';
 return `<svg viewBox="-36 -36 72 72" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${art}</svg>`;
}
export function souvenirArt(key){
 const [kind,id]=key.split(':');
 if(kind==='postcard')return gardenIcon('postcard');
 if(kind==='light')return '<svg viewBox="-36 -36 72 72" aria-hidden="true"><ellipse cy="26" rx="24" ry="7" fill="#395d4822"/><path d="M-12-16h24V15h-24Z" fill="#e7ce88" stroke="#a89164" stroke-width="3"/><path d="M-17-18L0-30 17-18M0 16v17" fill="none" stroke="#a89164" stroke-width="4"/><path d="M-5-7h10v14H-5Z" fill="#fff1bd"/></svg>';
 return gardenIcon(id);
}
