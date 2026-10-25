export const WORLD = { width: 1400, height: 900, margin: 65 };
export function clampPoint(point) {
  return { x: Math.max(WORLD.margin, Math.min(WORLD.width - WORLD.margin, point.x)), y: Math.max(WORLD.margin, Math.min(WORLD.height - WORLD.margin, point.y)) };
}
export function moveTowards(from, to, distance) {
  const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy);
  if (length <= distance) return clampPoint(to);
  return clampPoint({ x: from.x + dx / length * distance, y: from.y + dy / length * distance });
}
export function nearestStation(point, stations, radius = 100) {
  return stations.map(station => ({ station, distance: Math.hypot(point.x - station.x, point.y - station.y) })).filter(item => item.distance <= radius).sort((a, b) => a.distance - b.distance)[0]?.station || null;
}

export function cameraBounds(position, width, height) {
  const ratio=Math.max(1,width)/Math.max(1,height);
  let h=ratio<1?660:590,w=h*ratio;
  if(w>WORLD.width){w=WORLD.width;h=w/ratio;}
  if(h>WORLD.height){h=WORLD.height;w=h*ratio;}
  const x=Math.max(0,Math.min(WORLD.width-w,position.x-w/2));
  const y=Math.max(0,Math.min(WORLD.height-h,position.y-h/2));
  return {x,y,width:w,height:h};
}
