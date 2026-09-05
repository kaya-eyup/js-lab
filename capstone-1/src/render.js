 import { listView } from "./views/listView.js";
 import { detailView } from "./views/detailView.js";
 import { notFoundView } from "./views/notFoundView.js";

const routesMap = {
  list: listView,
  detail: detailView,
  notFound: notFoundView,
};
// nesne eşleşmesi daha kısa ve okunabilir


let renderCount = 0;
export function render(state) {
   console.log("render #" + (++renderCount), state.route.name);  // çizim sayacı kontrolü.
   const root = document.querySelector("#app");
     // ??? name'e göre görünüm seç

    // Eşleşen rota fonksiyonunu bul; tanımlı değilse güvenli liman notFoundView
  const viewFn = routesMap[state.route.name] || notFoundView;

  root.innerHTML = viewFn(state);
 }