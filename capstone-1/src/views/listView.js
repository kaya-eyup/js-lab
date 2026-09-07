import { buildListUrl } from "../router.js";
import { escapeHtml } from "../lib/escapeHtml.js";

export function listView(state) {
  const { q, page } = state.route.query;
  const { total } = state.list;

  const LIMIT = 12;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const prevButton = hasPrev
    ? `<a href="${buildListUrl({ q, page: page - 1 })}">← Önceki</a>`
    : `<span class="disabled">← Önceki</span>`;

  const nextButton = hasNext
    ? `<a href="${buildListUrl({ q, page: page + 1 })}">Sonraki →</a>`
    : `<span class="disabled">Sonraki →</span>`;

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