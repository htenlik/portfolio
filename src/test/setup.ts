import '@testing-library/jest-dom/vitest';

// Node 25+ ships its own Web Storage globals. Without --localstorage-file its
// `localStorage` is undefined and shadows jsdom's, so restore a working Storage.
class MemoryStorage implements Storage {
  [name: string]: unknown;
  #items = new Map<string, string>();
  get length() { return this.#items.size; }
  clear() { this.#items.clear(); }
  getItem(key: string) { return this.#items.get(String(key)) ?? null; }
  key(index: number) { return [...this.#items.keys()][index] ?? null; }
  removeItem(key: string) { this.#items.delete(String(key)); }
  setItem(key: string, value: string) { this.#items.set(String(key), String(value)); }
}

const readStorage = (source: object | undefined, key: 'localStorage' | 'sessionStorage'): Storage | undefined => {
  try { return (source as Partial<Record<typeof key, Storage>> | undefined)?.[key] ?? undefined; } catch { return undefined; }
};

for (const key of ['localStorage', 'sessionStorage'] as const) {
  if (readStorage(globalThis, key)) continue;
  const jsdomWindow = (globalThis as { jsdom?: { window?: object } }).jsdom?.window;
  const storage = readStorage(jsdomWindow, key) ?? new MemoryStorage();
  Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: storage });
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: () => undefined, removeListener: () => undefined,
    addEventListener: () => undefined, removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
