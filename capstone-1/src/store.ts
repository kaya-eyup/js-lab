import { deepFreeze } from "./lib/deepFreeze.ts"; 

// Vite/Snowpack gibi paketleyiciler import.meta.env.DEV değerini dev ortamında true, build ortamında false yapar.
const freeze = import.meta.env.DEV ? deepFreeze : <T>(x: T): T => x;
//Bu koruma kalkanı son kullanıcıyı değil beni (geliştiriciyi) hatalardan korumak için vardır; geliştirme aşamasında mutasyonları yakalayıp kodu zaten düzelteceğim için, üretime (production) çıkan hatasız kodda gereksiz CPU maliyeti yaratan özyinelemeli dondurma işlemine (deepFreeze) gerek kalmaz
type Listener<TState> = (state: TState) => void;
export type Store<TState> = {
  getState: () => TState;
  setState: (patch: Partial<TState>) => void;
  subscribe: (listener: Listener <TState>) => () => void;
};

export function createStore<TState>(initialState: TState):Store<TState> {

    const listeners = new Set<Listener<TState>>();
  
  // Artık deepFreeze yerine ortam duyarlı freeze'i çağırıyoruz
  let state = freeze(initialState); 

  function getState() {
      return state;
  }

  function setState(patch: Partial<TState>) {
      state = freeze({ ...state, ...patch }); 
      for (const listener of listeners) {
           listener(state);
      }
  }

  function subscribe(listener : Listener<TState>){
      listeners.add(listener);
      return () => {
          listeners.delete(listener);
      };
  }

  return { getState, setState, subscribe };
} 

