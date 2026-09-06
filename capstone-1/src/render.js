import { listView } from "./views/listView.js";
 import { updateList } from "./lib/updateList.js";
 import { detailView } from "./views/detailView.js";
 import { notFoundView } from "./views/notFoundView.js";
import { buildListUrl } from "./router.js";

const routesMap = {
  list: listView,
  detail: detailView,
  notFound: notFoundView,
};
// nesne eşleşmesi daha kısa ve okunabilir

let currentViewName = null;

export function render(state) {


  const root = document.querySelector("#app");
  if (!root) throw new Error("render(): #app not found");

  // 1. Kabuk (Shell) Kurulumu: YALNIZCA rota (sayfa türü) değiştiğinde
  if (state.route.name !== currentViewName) {
    const viewFn = routesMap[state.route.name] || routesMap.notFound;
    root.innerHTML = viewFn(state); // listView yerine seçilen viewFn çalıştırılıyor
    currentViewName = state.route.name;
  }

  //  İçerik Güncellemesi: Kabuğu yıkmadan sadece içeriği besle
  if (state.route.name === "list") {
    const { q, page } = state.route.query;
    const { status, items, total, error } = state.list;

    // 1. Dört durumun ekrana yansıtılması (Türetilmiş durum kontrolüyle)
    const statusEl = root.querySelector(".status");
    if (statusEl) {
      if (status === "loading") {
        statusEl.textContent = "Yükleniyor...";
      } else if (status === "error") {
        statusEl.textContent = error;
      } else if (status === "success" && items.length === 0) {
        statusEl.textContent = "Sonuç bulunamadı.";
      } else if (status === "success") {
        statusEl.textContent = `${total} sonuç listelendi`;
      } else {
        statusEl.textContent = "";
      }
    }
  //  Kartları uzlaştır
  updateList(root.querySelector(".cards"), state.list.items);

  //  Arama kutusu (kontrollü alan)
   const input = root.querySelector("#search");
    if (input.value !== q)
      input.value = q; 

  //  Bilgi satırı
  const meta = root.querySelector(".meta");
  if (meta) meta.textContent = `q = "${q}" · sayfa = ${page}`;

  //  Pager bağlantıları (??? olan yer)
  const pager = root.querySelector(".pager");
  if (pager) {
    const prevButton =
      page > 1
        ? `<a href="${buildListUrl({ q, page: page - 1 })}">← Önceki</a>`
        : `<span class="disabled">← Önceki</span>`;
    const nextButton = `<a href="${buildListUrl({ q, page: page + 1 })}">Sonraki →</a>`;
    pager.innerHTML = `${prevButton}${nextButton}`;
  }
}
}