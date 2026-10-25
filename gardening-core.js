export const BED_IDS = ['flowers', 'daisies'];
export const SLOT_COUNT = 8;
export const FLOWER_TYPES = ['sunflower', 'daisy'];

export function restorePlots(saved, legacyBeds = {}) {
  return Object.fromEntries(BED_IDS.map(id => {
    const slots = Array.isArray(saved?.[id]) ? saved[id] : null;
    const legacyStage = [1, 2, 3].includes(legacyBeds?.[id]) ? legacyBeds[id] : 0;
    return [id, Array.from({ length: SLOT_COUNT }, (_, index) => {
      if (!slots) return index < 6 && legacyStage ? { type: id === 'flowers' ? 'sunflower' : 'daisy', stage: legacyStage } : null;
      const slot = slots[index];
      return slot && FLOWER_TYPES.includes(slot.type) && [1, 2, 3].includes(slot.stage) ? { type: slot.type, stage: slot.stage } : null;
    })];
  }));
}

export function tendSlot(slot, tool) {
  if (FLOWER_TYPES.includes(tool)) {
    if (slot) return { slot, changed: false, event: 'occupied' };
    return { slot: { type: tool, stage: 1 }, changed: true, event: 'planted' };
  }
  if (tool !== 'water') return { slot, changed: false, event: 'invalid' };
  if (!slot) return { slot, changed: false, event: 'empty' };
  if (slot.stage === 3) return { slot, changed: false, event: 'admire' };
  const next = { ...slot, stage: slot.stage + 1 };
  return { slot: next, changed: true, event: next.stage === 3 ? 'bloomed' : 'sprouted' };
}

export function plotDescription(slot) {
  if (!slot) return 'tierra lista para sembrar';
  const name = slot.type === 'sunflower' ? 'girasol' : 'margarita';
  return `${name}, ${['', 'semilla', 'primeras hojas', 'en flor'][slot.stage]}`;
}
