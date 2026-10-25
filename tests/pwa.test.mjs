import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
function worker(scope) {
  const listeners = {}, stores = new Map();
  const state = { offline: false, claimed: false, skipped: false };
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async name => stores.delete(name),
    open: async name => {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        addAll: async files => files.forEach(file => store.set(new URL(file, scope).href, `cached:${file}`)),
        match: async request => store.get(request.url)
      };
    }
  };
  vm.runInNewContext(source, {
    URL, Set, caches,
    fetch: async () => { if (state.offline) throw Error('offline'); return 'network'; },
    self: {
      registration: { scope },
      addEventListener: (name, fn) => { listeners[name] = fn; },
      clients: { claim: async () => { state.claimed = true; } },
      skipWaiting: () => { state.skipped = true; }
    }
  });
  return { listeners, stores, caches, state };
}

for (const path of ['/', '/el-jardin/']) {
  test(`Carga offline y aislamiento de caché en ${path}`, async () => {
    const scope = `https://example.github.io${path}`;
    const w = worker(scope);
    let work;
    w.listeners.install({ waitUntil: promise => { work = promise; } });
    await work;
    w.state.offline = true;
    for (const file of ['./', 'index.html', 'app.js', 'style.css', 'pwa.js', 'manifest.webmanifest', 'icons/icon-512.png']) {
      let response;
      w.listeners.fetch({ request: { url: new URL(file, scope).href, method: 'GET' }, respondWith: value => { response = value; } });
      assert.match(await response, /^cached:/);
    }
    for (const url of ['https://fonts.googleapis.com/test', 'https://example.github.io/otro-jardin/app.js']) {
      let handled = false;
      w.listeners.fetch({ request: { url, method: 'GET' }, respondWith: () => { handled = true; } });
      assert.equal(handled, false);
    }
    const old = `isis-${scope}-old`;
    const unrelated = 'isis-https://example.github.io/otro/-v1';
    await w.caches.open(old); await w.caches.open(unrelated);
    w.listeners.activate({ waitUntil: promise => { work = promise; } }); await work;
    assert.equal(w.stores.has(old), false);
    assert.equal(w.stores.has(unrelated), true);
    assert.equal(w.state.claimed, true);
    assert.equal(w.state.skipped, false);
    w.listeners.message({ data: { type: 'SKIP_WAITING' } });
    assert.equal(w.state.skipped, true);
  });
}
