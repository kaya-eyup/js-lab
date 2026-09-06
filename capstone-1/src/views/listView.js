import { buildListUrl } from "../router.js";
import { escapeHtml } from "../lib/escapeHtml.js";

export function listView(state) {
  const { q, page } = state.route.query;

  const prevButton =
    page > 1
      ? `<a href="${buildListUrl({ q, page: page - 1 })}">← Önceki</a>`
      : `<span class="disabled">← Önceki</span>`;

  const nextButton = `<a href="${buildListUrl({ q, page: page + 1 })}">Sonraki →</a>`;

  return `
    <div class="list">
      <input id="search" value="${escapeHtml(q)}" placeholder="ara..." autocomplete="off">
      <p class="meta">q = "${escapeHtml(q)}" · sayfa = ${page}</p>

      <div class="status"></div>
      <div class="cards"></div>

      <nav class="pager">
        ${prevButton}
        ${nextButton}
      </nav>
    </div>
  `;
}