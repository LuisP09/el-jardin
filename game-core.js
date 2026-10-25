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
