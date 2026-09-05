 import { listView } from "./views/listView.js";
 import { detailView } from "./views/detailView.js";
 import { notFoundView } from "./views/notFoundView.js";

const routesMap = {
  list: listView,
  detail: detailView,
  notFound: notFoundView,
};
// nesne eşleşmesi daha kısa ve okunabilir
 export function render(state) {
   const root = document.querySelector("#app");
     // ??? name'e göre görünüm seç

    // Eşleşen rota fonksiyonunu bul; tanımlı değilse güvenli liman notFoundView
  const viewFn = routesMap[state.route.name] || notFoundView;

  root.innerHTML = viewFn(state);
 }