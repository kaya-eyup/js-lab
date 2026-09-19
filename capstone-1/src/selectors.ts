import type { FetchState} from "./types.ts"
import type { ListResult, ProductSummary } from "./api/products.ts";


export function assertNever(x: never): never {
  throw new Error(`Beklenmeyen durum: ${JSON.stringify(x)}`);
}

type ListState = FetchState<ListResult>;

export function visibleItems(list: ListState): ProductSummary[] {
  switch (list.status) {
    case "success":
      return list.data.items;
    case "loading":
      return list.previous?.items ?? [];
    default:
      return [];
  }
}

export function visibleTotal(list: ListState): number {
  switch (list.status) {
    case "success":
      return list.data.total;
    case "loading":
      return list.previous?.total ?? 0;
    default:
      return 0;
  }
}

export function statusText(list: ListState): string {
  switch (list.status) {
    case "loading":
      return "Yükleniyor...";
    case "error":
      return list.message;
    case "success":
      return list.data.items.length === 0
        ? "Sonuç bulunamadı."
        : `${list.data.total} sonuç listelendi`;
    case "idle":
      return ""
    default:
      return assertNever(list);
  }
}