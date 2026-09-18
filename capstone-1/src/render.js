import { listView } from "./views/listView.js";
import { updateList } from "./lib/updateList.js";
import { detailView } from "./views/detailView.js";
import { notFoundView } from "./views/notFoundView.js";
import { buildListUrl } from "./router.ts";
import { visibleItems, visibleTotal, statusText } from "./selectors.js"
import { LIMIT} from "./api/products.ts"
const routesMap = {
  list: listView,
  detail: detailView,
  notFound: notFoundView,
};

let currentViewName = null;

// ───── Sunum Katmanı Yardımcıları ─────


export function render(state) {
  const root = document.querySelector("#app");
  if (!root) throw new Error("render(): #app not found");

  // 1. Kabuk (Shell) Kurulumu: YALNIZCA rota (sayfa türü) değiştiğinde
  if (state.route.name !== currentViewName) {
    const viewFn = routesMap[state.route.name] || routesMap.notFound;
    root.innerHTML = viewFn(state);
    currentViewName = state.route.name;
  }

  // İçerik Güncellemesi: Kabuğu yıkmadan sadece içeriği besle
  if (state.route.name === "list") {
    const { q, page } = state.route.query;

    // 1. Durum metnini güncelle
    const statusEl = root.querySelector(".status");
    if (statusEl) {
      statusEl.textContent = statusText(state.list);
    }

    // 2. Kartları uzlaştır
    updateList(root.querySelector(".cards"), visibleItems(state.list));

    // Arama kutusu (kontrollü alan)
    const input = root.querySelector("#search");
    if (input && input.value !== q) {
      input.value = q;
    }

    // Bilgi satırı
    const meta = root.querySelector(".meta");
    if (meta) meta.textContent = `q = "${q}" · sayfa = ${page}`;

    // Pager bağlantıları (visibleTotal üzerinden)
    const pager = root.querySelector(".pager");
    if (pager) {
      const total = visibleTotal(state.list);
      const totalPages = Math.max(1, Math.ceil(total / LIMIT));
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      const prevButton = hasPrev
        ? `<a href="${buildListUrl({ q, page: page - 1 })}">← Önceki</a>`
        : `<span class="disabled">← Önceki</span>`;
      const nextButton = hasNext
        ? `<a href="${buildListUrl({ q, page: page + 1 })}">Sonraki →</a>`
        : `<span class="disabled">Sonraki →</span>`;

      pager.innerHTML = `${prevButton}${nextButton}`;
    }
  }
}