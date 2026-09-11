/**
 * Ambiente de teste (jsdom): polyfills mínimos para as APIs de browser que os
 * componentes usam, com controle por teste via `__setMedia`.
 */
const mediaState: Record<string, boolean> = {};

(globalThis as unknown as { __setMedia: (query: string, matches: boolean) => void }).__setMedia = (
  query: string,
  matches: boolean,
) => {
  mediaState[query] = matches;
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: mediaState[query] ?? false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
Object.defineProperty(window, "IntersectionObserver", { writable: true, value: IntersectionObserverStub });
Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, value: IntersectionObserverStub });

Element.prototype.scrollIntoView = () => {};
