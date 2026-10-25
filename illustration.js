import { approach, walkingPose } from './motion.js';

export function createActor(player) {
  player.innerHTML = `<ellipse id="actor-shadow" cy="24" rx="18" ry="7" fill="#112e28" opacity=".3"/>
    <g id="actor-direction"><g id="actor-leg-left"><path d="M-6 7L-7 22" stroke="#d4b599" stroke-width="5" stroke-linecap="round"/><path d="M-9 21h8v4h-10Z" fill="#655548"/></g>
    <g id="actor-leg-right"><path d="M6 7L7 22" stroke="#d4b599" stroke-width="5" stroke-linecap="round"/><path d="M3 21h8l2 4H3Z" fill="#655548"/></g>
    <g id="actor-upper"><path d="M-12-30Q-21-14-13-4L14-4Q21-22 10-36Z" fill="#4d3d35"/>
      <g id="actor-arm-left"><path d="M-10-7L-18 4" stroke="#d7b89b" stroke-width="6" stroke-linecap="round"/><path d="M-9-8L-14-1" stroke="#b8c19c" stroke-width="8" stroke-linecap="round"/></g>
      <g id="actor-arm-right"><path d="M10-7L18 4" stroke="#d7b89b" stroke-width="6" stroke-linecap="round"/><path d="M9-8L14-1" stroke="#b8c19c" stroke-width="8" stroke-linecap="round"/></g>
      <path d="M-9-11Q0-16 9-11L16 14Q0 23-16 14Z" fill="#b7c29b"/><path d="M1-11L6 17Q12 17 16 14L9-11Z" fill="#91a684"/><path d="M-12 11Q0 17 12 11" fill="none" stroke="#d7dbb7" stroke-width="1.5"/>
      <path d="M-5-13L-3-7 3-7 6-13" fill="#d9ad9d"/><path d="M-1-6L-4 1 1-1 3-6" fill="#d9ad9d"/>
      <g class="actor-front"><path d="M-10-10L11 10" stroke="#8b7255" stroke-width="2"/><rect x="7" y="1" width="11" height="12" rx="3" fill="#c09a6d"/><path d="M9 5h7" stroke="#ddbd89" stroke-width="1.5"/>
      <ellipse cy="-26" rx="11" ry="13" fill="#e3bea0"/><path d="M-13-25Q-13-42 2-41Q17-39 14-24L9-25 4-35Q-1-26-13-25" fill="#594238"/>
      <circle cx="-4" cy="-25" r="1" fill="#5b483d"/><circle cx="4" cy="-25" r="1" fill="#5b483d"/><path d="M-2-20Q0-18 2-20" stroke="#b67b65" stroke-width="1" fill="none" stroke-linecap="round"/>
      <ellipse cx="-7" cy="-21" rx="2.5" ry="1.2" fill="#d99f8e" opacity=".6"/><ellipse cx="7" cy="-21" rx="2.5" ry="1.2" fill="#d99f8e" opacity=".6"/></g>
      <g class="actor-back"><path d="M-12-30Q-14-44 2-42Q18-40 13-21L8-12H-8Z" fill="#594238"/><path d="M0-25Q-5-17 0-11Q5-6 0 1" fill="none" stroke="#795a44" stroke-width="6" stroke-linecap="round"/><rect x="-8" y="-5" width="16" height="17" rx="4" fill="#ba9468"/><path d="M-5-2h10v5H-5Z" fill="#d0af7d"/></g>
      <g transform="translate(10 -36)"><ellipse cy="-3" rx="2" ry="4" fill="#e9cd7d"/><ellipse cy="-3" rx="2" ry="4" fill="#e9cd7d" transform="rotate(72)"/><ellipse cy="-3" rx="2" ry="4" fill="#e9cd7d" transform="rotate(144)"/><ellipse cy="-3" rx="2" ry="4" fill="#e9cd7d" transform="rotate(216)"/><ellipse cy="-3" rx="2" ry="4" fill="#e9cd7d" transform="rotate(288)"/><circle r="2" fill="#9c7845"/></g>
    </g></g>`;
  const refs = Object.fromEntries(['actor-direction', 'actor-upper', 'actor-leg-left', 'actor-leg-right', 'actor-arm-left', 'actor-arm-right', 'actor-shadow'].map(id => [id, player.querySelector(`#${id}`)]));
  let facing = '', gait = 0;
  return {
    render({ direction, distance, time, delta, walking, muted }) {
      gait = approach(gait, walking ? 1 : 0, delta * 7);
      const pose = walkingPose(distance, time, gait > .001, muted);
      for (const key of ['sway', 'leftLeg', 'rightLeg', 'arm']) pose[key] *= gait;
      if (gait > .001) pose.bob *= gait;
      if (direction !== facing) {
        player.dataset.facing = direction;
        refs['actor-direction'].setAttribute('transform', direction === 'left' ? 'scale(-1 1)' : 'scale(1 1)');
        facing = direction;
      }
      refs['actor-upper'].setAttribute('transform', `translate(0 ${pose.bob}) rotate(${pose.sway})`);
      refs['actor-leg-left'].setAttribute('transform', `rotate(${pose.leftLeg} -6 9)`);
      refs['actor-leg-right'].setAttribute('transform', `rotate(${pose.rightLeg} 6 9)`);
      refs['actor-arm-left'].setAttribute('transform', `rotate(${pose.arm} -9 -8)`);
      refs['actor-arm-right'].setAttribute('transform', `rotate(${-pose.arm} 9 -8)`);
      refs['actor-shadow'].setAttribute('rx', String(18 + pose.bob * .6));
    }
  };
}

export const stationIcons = {
  flowers: '<path d="M0 8V-3m0 7q-13-13-11-13Q0-8 0 4m0-7q13-12 10-3Q8 1 0-3"/>',
  daisies: '<circle cy="-2" r="3"/><path d="M0-10v2m0 12v2m-8-8h2m12 0h2M-6-8l2 2m8 8l2 2M-6 4l2-2m8-8l2-2"/>',
  pond: '<path d="M-10-4q5-5 10 0t10 0M-10 3q5-5 10 0t10 0"/>',
  letter: '<rect x="-10" y="-8" width="20" height="15" rx="2"/><path d="M-10-8L0 0 10-8"/>',
  stars: '<path d="M0-11L3-3 11 0 3 3 0 11-3 3-11 0-3-3Z"/>',
  art: '<path d="M-5 4L6-9 10-6-2 7Z"/><path d="M-3 6q-9-3-9 4q5 3 9-4"/>',
  cinema: '<rect x="-11" y="-9" width="22" height="17" rx="2"/><path d="M-3-5L5 0-3 5Z"/>'
};
