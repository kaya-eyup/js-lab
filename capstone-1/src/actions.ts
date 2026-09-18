import { searchProducts } from "./api/products.ts";
import { HttpError } from "./lib/http.ts"; // 1. Runtime sınıfı olduğu için normal import
import type { Store } from "./store.ts";
import type { AppState, FetchState } from "./types.ts";
import type { ListResult } from "./api/products.ts";

let currentController: AbortController | null = null;

function previousData(list: FetchState<ListResult>): ListResult | null {
  switch (list.status) {
    case "idle":
    case "error":
      return null;
    case "success":
      return list.data;
    case "loading":
      return list.previous;  
  }
}

export async function loadList(
  store: Store<AppState>,
  { q = "", page = 1 }: { q?: string; page?: number } = {},
) {
  // 1. Havada asılı önceki istek varsa fişini çek
  currentController?.abort();

  // 2. Bu yeni istek için temiz bir kumanda oluştur
  const controller = new AbortController();
  currentController = controller;

  // 3. Durumu "loading" yap
  store.setState({
    list: { status: "loading", previous: previousData(store.getState().list) }, // "yüklenirken ekran boşalmasın diye önceki sonuç taşınıyor"
  });

  // 3. Değişiklik: try daraltıldı
  let result;
  try {
    result = await searchProducts(q, {
      page,
      signal: controller.signal,
    });
  } catch (error) {
    // 2. Değişiklik: İptal kontrolü
    if (error instanceof DOMException && error.name === "AbortError") return;

    console.error(error);

    // 2. Değişiklik: HttpError daraltması ve sade error state
    const message =
      error instanceof HttpError ? error.userMessage : "Bir hata oluştu.";

    store.setState({
      list: {
        status: "error",
        message,
      },
    });
    return;
  }

  // Başarılı durum: try'ın tamamen dışında
  store.setState({ list: { status: "success", data: result } });
}