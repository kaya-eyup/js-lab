export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  function getState() {
      return state;
  }

  function setState(patch) {
      // 1) yeni state üret (immutable)
      state = {...state, ...patch } // üzerine güncelliyoruz.
      // 2) her aboneyi çağır
      for (const listener of listeners) {
           listener(state)
      }
      
  }

  function subscribe(listener) {
    // 1) listeyi ekle
      listeners.add(listener);
      // 2) aboneliği bitiren bir fonksiyon döndür
      return () => {
    listeners.delete(listener);
  };
  }

  return { getState, setState, subscribe };
}