import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restorePlots, tendSlot, plotDescription } from '../gardening-core.js';
import { restorePosition } from '../game-core.js';

test('Un lugar admite una semilla y dos riegos, sin sobrescribir flores ni alterar otros lugares', () => {
  const plots = restorePlots(null);
  const planted = tendSlot(plots.flowers[2], 'sunflower');
  assert.equal(planted.event, 'planted');
  assert.deepEqual(planted.slot, { type: 'sunflower', stage: 1 });
  assert.equal(plots.flowers[2], null);
  const sprout = tendSlot(planted.slot, 'water');
  const bloom = tendSlot(sprout.slot, 'water');
  assert.equal(sprout.event, 'sprouted');
  assert.equal(bloom.event, 'bloomed');
  assert.equal(tendSlot(bloom.slot, 'water').changed, false);
  assert.equal(tendSlot(bloom.slot, 'daisy').event, 'occupied');
  assert.equal(tendSlot(null, 'water').event, 'empty');
  assert.equal(tendSlot(null, 'unknown').changed, false);
});
test('La migración conserva los seis lugares antiguos y añade dos espacios libres', () => {
  const plots = restorePlots(undefined, { flowers: 3, daisies: 2 });
  assert.equal(plots.flowers.length, 8);
  assert.equal(plots.flowers.filter(Boolean).length, 6);
  assert.deepEqual(plots.flowers[0], { type: 'sunflower', stage: 3 });
  assert.deepEqual(plots.daisies[0], { type: 'daisy', stage: 2 });
  assert.equal(plots.flowers[6], null);
  assert.equal(plots.flowers[7], null);
});
test('Guardar y restaurar conserva mezclas y estados y descarta datos inválidos', () => {
  const plots = restorePlots({ flowers: [{ type: 'daisy', stage: 2 }, { type: 'sunflower', stage: 3 }, { type: 'unknown', stage: 9 }, null] });
  assert.deepEqual(restorePlots(JSON.parse(JSON.stringify(plots))), plots);
  assert.equal(plots.flowers[2], null);
  assert.equal(plotDescription(plots.flowers[0]), 'margarita, primeras hojas');
  assert.deepEqual(restorePosition({ x: 470, y: 510 }), { x: 470, y: 510 });
  assert.deepEqual(restorePosition({ x: NaN, y: null }), { x: 660, y: 690 });
  assert.deepEqual(restorePosition({ x: -100, y: 9999 }), { x: 65, y: 835 });
});
