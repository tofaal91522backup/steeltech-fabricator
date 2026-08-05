// Some browsers (cookies/site-data blocked, private mode, in-app webviews)
// throw a SecurityError on any `window.localStorage` access. Falling back to an
// in-memory map keeps the app usable instead of crashing the whole render tree.
const memoryStore = new Map();

function getBackingStore() {
  try {
    const store = window.localStorage;
    // Touching the object is not enough on all engines - probe a real call.
    const probe = "__steeltech_storage_probe__";
    store.setItem(probe, "1");
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
}

let backingStore;

function store() {
  if (backingStore === undefined) {
    backingStore = getBackingStore();
  }
  return backingStore;
}

export function getItem(key) {
  const s = store();
  if (!s) return memoryStore.has(key) ? memoryStore.get(key) : null;

  try {
    return s.getItem(key);
  } catch {
    return memoryStore.has(key) ? memoryStore.get(key) : null;
  }
}

export function setItem(key, value) {
  memoryStore.set(key, value);

  const s = store();
  if (!s) return;

  try {
    s.setItem(key, value);
  } catch {
    // quota exceeded or access revoked - memory copy already kept above
  }
}

export function removeItem(key) {
  memoryStore.delete(key);

  const s = store();
  if (!s) return;

  try {
    s.removeItem(key);
  } catch {
    // ignore
  }
}

export default { getItem, setItem, removeItem };
