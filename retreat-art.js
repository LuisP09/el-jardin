export function retreatArt(theme='sage',flowers=true,lights=true){
 const colors={sage:['#8da383','#cad4ab'],honey:['#c2a36e','#e4ca8d'],rose:['#b79b9b','#dfc4ba']}[theme]||['#8da383','#cad4ab'];
 const bloom=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 2v20" stroke="#698960" stroke-width="3"/><g fill="${theme==='honey'?'#e7c063':'#f5e9ce'}">${Array.from({length:8},(_,i)=>`<ellipse cy="-8" rx="3" ry="7" transform="rotate(${i*45})"/>`).join('')}</g><circle r="5" fill="#c4a15d"/></g>`;
 return `<svg viewBox="-160 -120 320 220" aria-hidden="true"><ellipse cy="45" rx="147" ry="46" fill="#31544022"/><ellipse cy="29" rx="135" ry="59" fill="${colors[0]}" opacity=".8"/><path d="M-133 28q130 62 266 0" fill="none" stroke="${colors[1]}" stroke-width="5"/>
 <path d="M-70 16V-66Q0-126 70-66v82" fill="none" stroke="#b59b75" stroke-width="7"/><path d="M-71-37q30-35 40-48m31-14q25 0 39 20m32 36q-2 25-4 35" fill="none" stroke="#a4bc86" stroke-width="13" stroke-linecap="round"/>
 <ellipse cy="26" rx="53" ry="16" fill="#36524222"/><path d="M-47-12H47M-47-1H47M-52 14H52M-40 14v24M40 14v24" stroke="#b49770" stroke-width="8" stroke-linecap="round"/><path d="M-47-13H47M-47-2H47" stroke="#d8c69b" stroke-width="2"/>
 ${flowers?[[-108,24],[-87,44],[90,42],[114,15],[-37,-86],[29,-90]].map(([x,y])=>bloom(x,y)).join(''):''}
 ${lights?[-64,64].map(x=>`<g transform="translate(${x} -50)"><circle r="23" fill="#e9d693" opacity=".15"/><path d="M-7-10H7V9H-7Z" fill="#f1d99a" stroke="#a78f63" stroke-width="2"/><path d="M-8-11L0-18 8-11" fill="none" stroke="#a78f63" stroke-width="2"/></g>`).join(''):''}
 </svg>`;
}
