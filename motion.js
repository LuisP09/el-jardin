export function approach(current, target, amount) {
  return current < target ? Math.min(target, current + amount) : Math.max(target, current - amount);
}

export function dampPoint(current, target, rate, delta) {
  const mix = 1 - Math.exp(-Math.max(0, rate) * Math.max(0, delta));
  return { x: current.x + (target.x - current.x) * mix, y: current.y + (target.y - current.y) * mix };
}

export function movementFacing(dx, dy, previous = 'down') {
  if (Math.hypot(dx, dy) < .01) return previous;
  return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
}

export function walkingPose(distance, time, walking, muted) {
  if (muted) return { bob: 0, sway: 0, leftLeg: 0, rightLeg: 0, arm: 0 };
  const stride = distance / 33 * Math.PI * 2;
  const step = walking ? Math.sin(stride) : 0;
  return {
    bob: walking ? -Math.abs(step) * 1.6 : Math.sin(time * 1.1) * .35,
    sway: step * 1.2,
    leftLeg: step * 13,
    rightLeg: -step * 13,
    arm: -step * 5
  };
}
