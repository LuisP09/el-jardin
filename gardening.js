import { tendSlot, plotDescription } from './gardening-core.js';

export function bloomSVG(type, stage = 3) {
  const daisy = type === 'daisy';
  if (stage === 1) return '<g class="seedling"><ellipse cy="7" rx="18" ry="5" fill="#3d352d" opacity=".3"/><path d="M-4 4Q-8-9 2-7Q10-4 5 5Z" fill="#bd9560"/><path d="M-2-3L2 3" stroke="#e9c997" stroke-width="1.5"/></g>';
  if (stage === 2) return '<g class="seedling"><ellipse cy="8" rx="17" ry="4" fill="#3d352d" opacity=".2"/><path d="M0 8Q-2-5 1-15" fill="none" stroke="#65965d" stroke-width="3"/><path d="M0-4Q-25-24-16-25Q0-29 0-4M1-12Q23-34 25-21Q23-9 1-12" fill="#91b779"/><path d="M0-4L-14-21M1-12L20-23" stroke="#bfd19a" fill="none"/></g>';
  const count = daisy ? 12 : 16;
  return `<g class="flower-stem"><ellipse cy="9" rx="19" ry="5" fill="#3d352d" opacity=".15"/><path d="M0 8Q-5-25 0-52" fill="none" stroke="#6c965c" stroke-width="3"/><path d="M-1-15Q-31-36-25-20Q-20-8-1-15M-1-31Q25-53 24-34Q17-25-1-31" fill="#87a86a"/><path d="M-1-15L-22-23M-1-31L20-38" stroke="#b1c28b" fill="none"/>${Array.from({ length: count }, (_, i) => `<ellipse cy="-68" rx="${daisy ? 4 : 5}" ry="${daisy ? 13 : 15}" fill="${daisy ? (i % 2 ? '#fff8e6' : '#e9e8d6') : (i % 2 ? '#ecc35b' : '#dba746')}" transform="rotate(${i * 360 / count} 0 -51)"/>`).join('')}<circle cy="-51" r="${daisy ? 7 : 12}" fill="${daisy ? '#d8b14b' : '#71513b'}"/><circle cy="-53" cx="-2" r="${daisy ? 3 : 7}" fill="${daisy ? '#eacb6c' : '#906b43'}"/>${daisy ? '' : '<g fill="#c49654"><circle cx="-4" cy="-55" r="1.2"/><circle cx="3" cy="-58" r="1.2"/><circle cx="4" cy="-49" r="1.2"/><circle cx="-3" cy="-47" r="1.2"/></g>'}</g>`;
}

export const wateringCanSVG = '<svg viewBox="0 0 80 70" aria-hidden="true"><path d="M19 29Q-1 7 12 6Q30 0 38 25" fill="none" stroke="#9da995" stroke-width="5"/><path d="M22 25L56 21 61 60Q43 69 21 61Z" fill="#8eaa98"/><path d="M23 32L55 28M24 37L55 33" stroke="#b7c8ae" stroke-width="2"/><path d="M57 42L71 27 77 33 62 55" fill="#8eaa98"/><path d="M69 27l10 9" stroke="#c5cdb4" stroke-width="5"/><path d="M36 24L36 13Q44 8 49 20" fill="none" stroke="#9da995" stroke-width="5"/><path d="M28 46q13-10 24 0" stroke="#c7d3b9" fill="none"/></svg>';

export function createGardening({ getPlots, updateSlot, onMessage, onBloom, isDay, motionPaused }) {
  const $ = id => document.getElementById(id);
  const dialog = $('gardening-dialog');
  let bed = 'flowers', tool = 'sunflower', lastChange = -1;
  const toolLabels = { sunflower: 'Girasol', daisy: 'Margarita', water: 'Regadera' };

  function instructions() {
    $('gardening-instruction').textContent = tool === 'water' ? 'Toca una semilla o un brote para darle un poquito de agua.' : 'Toca un lugar libre para dejar tu semilla.';
  }
  function selectTool(next) {
    tool = next;
    dialog.dataset.tool = next;
    document.querySelectorAll('[data-garden-tool]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.gardenTool === next)));
    $('garden-cursor-label').textContent = toolLabels[next];
    instructions();
  }
  function render() {
    dialog.classList.toggle('garden-day', isDay());
    dialog.classList.toggle('garden-still', motionPaused());
    $('gardening-bed').replaceChildren();
    getPlots(bed).forEach((slot, index) => {
      const button = document.createElement('button');
      button.className = `garden-slot ${slot ? 'planted' : 'empty'} ${index === lastChange ? 'just-tended' : ''}`;
      button.dataset.stage = slot?.stage || 0;
      button.setAttribute('aria-label', `Lugar ${index + 1}: ${plotDescription(slot)}`);
      button.innerHTML = `<svg viewBox="-48 -100 96 135" aria-hidden="true"><ellipse cy="12" rx="38" ry="17" fill="#71553f"/><ellipse cy="10" rx="32" ry="12" fill="#5b4635"/><path d="M-18 11l7-2m20 5l8-3" stroke="#a47d55" stroke-width="2"/>${slot ? bloomSVG(slot.type, slot.stage) : '<path class="soil-plus" d="M-6 10H6M0 4v12" stroke="#c1a478" stroke-width="1.5" stroke-linecap="round"/>'}${index === lastChange && tool === 'water' ? '<g class="water-drops" fill="#b6d8d2"><path d="M-16-55q-8 13 0 13q8 0 0-13"/><path d="M5-70q-8 13 0 13q8 0 0-13"/><path d="M20-48q-8 13 0 13q8 0 0-13"/></g>' : ''}</svg><span>${slot ? (slot.stage === 3 ? 'En flor' : slot.stage === 2 ? 'Brote' : 'Semilla') : 'Sembrar aquí'}</span>`;
      button.onclick = () => tend(index);
      button.addEventListener('animationend', event => { if (event.animationName === 'open-petals') button.classList.remove('just-tended'); });
      $('gardening-bed').append(button);
    });
  }
  function tend(index) {
    const result = tendSlot(getPlots(bed)[index], tool);
    const messages = {
      planted: 'Una semillita, un comienzo. Cuando quieras, elige la regadera.',
      sprouted: 'Ya asoman las primeras hojas. Otro poquito de agua y abrirá sus pétalos.',
      bloomed: 'Mira cómo floreció. Esta pequeña belleza la hiciste tú.',
      occupied: 'Aquí ya crece algo bonito. Puedes cuidarlo con la regadera o elegir otro lugar.',
      empty: 'Primero deja una semillita en este lugar.',
      admire: 'Esta flor ya está contenta. Puedes contemplarla, sin hacer nada más.'
    };
    if (result.changed) {
      updateSlot(bed, index, result.slot);
      lastChange = index;
      render();
      if (result.event === 'bloomed') onBloom(bed);
    }
    $('gardening-message').textContent = messages[result.event] || 'Aquí puedes ir a tu ritmo.';
    onMessage($('gardening-message').textContent);
    // Conserva el foco al reemplazar el dibujo de un lugar.
    if (result.changed) $('gardening-bed').children[index].focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-garden-tool]').forEach(button => button.onclick = () => selectTool(button.dataset.gardenTool));
  $('close-gardening').onclick = () => dialog.close();
  $('garden-water-icon').innerHTML = wateringCanSVG;
  for (const type of ['sunflower', 'daisy']) $(`garden-${type}-icon`).innerHTML = `<svg viewBox="-40 -92 80 110" aria-hidden="true">${bloomSVG(type)}</svg>`;
  return {
    open(id) {
      bed = id; lastChange = -1;
      const plots = getPlots(bed), empty = plots.some(slot => !slot), growing = plots.some(slot => slot && slot.stage < 3);
      selectTool(growing && !empty ? 'water' : id === 'flowers' ? 'sunflower' : 'daisy');
      $('gardening-title').textContent = id === 'flowers' ? 'Un rincón de girasoles.' : 'Margaritas para tu cielo.';
      $('gardening-message').textContent = 'Puedes mezclar tus flores favoritas. Aquí nada se marchita por dejarlo para después.';
      render(); dialog.showModal();
    }
  };
}
