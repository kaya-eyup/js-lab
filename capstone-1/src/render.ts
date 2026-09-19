// src/render.ts
import { listView } from "./views/listView.ts";
import { updateList } from "./lib/updateList.ts";
import { detailView } from "./views/detailView.ts";
import { notFoundView } from "./views/notFoundView.ts";
import { buildListUrl } from "./router.ts";
import { visibleItems, visibleTotal, statusText } from "./selectors.ts";
import { LIMIT } from "./api/products.ts";
import { getElement } from "./lib/dom.ts";
import { assertNever } from "./lib/assertNever.ts";
import type { AppState, FetchState } from "./types.ts";
import type { Route } from "./router.ts";
import type { ListResult } from "./api/products.ts";

type ListState = FetchState<ListResult>;
type ListRoute = Extract<Route, { name: "list" }>;
type ListQuery = ListRoute["query"];

let currentViewName: Route["name"] | null = null;

function renderShell(route: Route, root: HTMLElement): void {
  switch (route.name) {
    case "list":
      root.innerHTML = listView(route.query);
      break;
    case "detail":
      root.innerHTML = detailView(route.id);
      break;
    case "notFound":
      root.innerHTML = notFoundView();
      break;
    default:
      return assertNever(route);
  }
}

function renderList(
  root: HTMLElement,
  query: ListQuery,
  list: ListState,
): void {
  const { q, page } = query;

  const statusEl = getElement(root, ".status", HTMLElement);
  statusEl.textContent = statusText(list);

  const cardsEl = getElement(root, ".cards", HTMLElement);
  updateList(cardsEl, visibleItems(list));

  const input = getElement(root, "#search", HTMLInputElement);
  if (input.value !== q) {
    input.value = q;
  }

  const metaEl = getElement(root, ".meta", HTMLElement);
  metaEl.textContent = `q = "${q}" · sayfa = ${page}`;

  const pagerEl = getElement(root, ".pager", HTMLElement);
  const total = visibleTotal(list);
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const prevButton = hasPrev
    ? `<a href="${buildListUrl({ q, page: page - 1 })}">← Önceki</a>`
    : `<span class="disabled">← Önceki</span>`;
  const nextButton = hasNext
    ? `<a href="${buildListUrl({ q, page: page + 1 })}">Sonraki →</a>`
    : `<span class="disabled">Sonraki →</span>`;

  pagerEl.innerHTML = `${prevButton}${nextButton}`;
}

export function render(state: AppState): void {
  const root = getElement(document, "#app", HTMLElement);
  const currentRoute = state.route;

  if (currentRoute.name !== currentViewName) {
    renderShell(currentRoute, root);
    currentViewName = currentRoute.name;
  }

  if (currentRoute.name === "list") {
    renderList(root, currentRoute.query, state.list);
  }
}
