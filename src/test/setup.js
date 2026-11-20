import { vi } from 'vitest';
import '@testing-library/jest-dom';

// La campanita monta en CADA cabecera (PageHeader) y dispara fetch async en effects;
// en los tests que NO la testean eso genera warnings de act() sin valor. Se stubbea
// globalmente a null. Su test propio (CampanitaAvisos.test.jsx) la des-mockea con vi.unmock.
vi.mock('../components/molecules/campanitaAvisos/CampanitaAvisos.jsx', () => ({
  default: () => null,
}));

// jsdom (bajo Vitest 0.34) no siempre expone localStorage/sessionStorage.
// Polyfill mínimo en memoria para tests que leen/escriben la sesión.
function createMemoryStorage() {
  let store = {};
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => {
      store[k] = String(v);
    },
    removeItem: (k) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
    key: (i) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
}

if (!globalThis.localStorage) {
  globalThis.localStorage = createMemoryStorage();
}
if (!globalThis.sessionStorage) {
  globalThis.sessionStorage = createMemoryStorage();
}

// jsdom no implementa scrollIntoView, pero varios componentes lo llaman en effects.
if (typeof window !== 'undefined' && window.HTMLElement) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
