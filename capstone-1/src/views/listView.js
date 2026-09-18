import { escapeHtml } from "../lib/escapeHtml.ts";

export function listView(state) {
  const { q, page } = state.route.query;

  return `
    <div class="list">
      <input id="search" value="${escapeHtml(q)}" placeholder="ara..." autocomplete="off">
      <p class="meta">q = "${escapeHtml(q)}" · sayfa = ${page}</p>

      <div class="status"></div>
      <div class="cards"></div>

      <nav class="pager"></nav>
    </div>
  `;
}