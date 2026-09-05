import { buildListUrl } from "../router.js";
import { escapeHtml } from "../lib/escapeHtml.js";
export function listView(state) {
    const { q, page } = state.route.query;



// Sayfa 1 ise tıklanamaz span, 2 ve üzeri ise önceki sayfa linki
  const prevButton =
    page > 1
      ? `<a href="${buildListUrl({ q, page: page - 1 })}">← Önceki</a>`
      : `<span class="disabled">← Önceki</span>`;

  // Şimdilik toplam sayfa bilinmediği için sonraki linki hep açık
  const nextButton = `<a href="${buildListUrl({ q, page: page + 1 })}">Sonraki →</a>`;




    return `
    <div class="list">
      <input id="search" value="${escapeHtml(q)}" placeholder="ara..." autocomplete="off">
      <p>q = "${escapeHtml(q)}" · sayfa = ${page}</p>
      <div class="cards">(kartlar Gün 18'de)</div>
      <nav class="pager">
        ${prevButton}
        ${nextButton}
      </nav>
    </div>
  `;
}