import { escapeHtml } from "../lib/escapeHtml.ts";

type ListViewQuery= {
  q: string;
  page: number;
}
export function listView(query: ListViewQuery): string {
  const { q, page }  = query;

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