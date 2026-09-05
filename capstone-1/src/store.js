import { deepFreeze } from "./lib/deepFreeze.js"; 

// Vite/Snowpack gibi paketleyiciler import.meta.env.DEV değerini dev ortamında true, build ortamında false yapar.
const freeze = import.meta.env.DEV ? deepFreeze : (x) => x;
//Bu koruma kalkanı son kullanıcıyı değil beni (geliştiriciyi) hatalardan korumak için vardır; geliştirme aşamasında mutasyonları yakalayıp kodu zaten düzelteceğim için, üretime (production) çıkan hatasız kodda gereksiz CPU maliyeti yaratan özyinelemeli dondurma işlemine (deepFreeze) gerek kalmaz
export function createStore(initialState) {
  const listeners = new Set();
  
  // Artık deepFreeze yerine ortam duyarlı freeze'i çağırıyoruz
  let state = freeze(initialState); 

  function getState() {
      return state;
  }

  function setState(patch) {
      state = freeze({ ...state, ...patch }); 
      for (const listener of listeners) {
           listener(state);
      }
  }

  function subscribe(listener) {
      listeners.add(listener);
      return () => {
          listeners.delete(listener);
      };
  }

  return { getState, setState, subscribe };
}