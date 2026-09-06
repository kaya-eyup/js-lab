import { searchProducts } from "./api/products.js";

let currentController = null;

export async function loadList(store, { q = "", page = 1 } = {}) {
  // 1. Havada asılı önceki istek varsa fişini çek
  currentController?.abort();

  // 2. Bu yeni istek için temiz bir kumanda oluştur
  const controller = new AbortController();
  currentController = controller;

  // 3. Durumu "loading" yap (Yayma tuzağı: eski listeyi koru ki ekran aniden sıfırlanmasın)
  store.setState({
    list: { ...store.getState().list, status: "loading", error: null },
  });

  try {
    const { items, total } = await searchProducts(q, {
      page,
      signal: controller.signal,
    });

    // Başarılı: veriyi state'e bas
    store.setState({
      list: { status: "success", items, total, error: null },
    });
  } catch (error) {
    // Kendi elimizle iptal ettiğimiz istekler bir hata değildir, akıştan sessizce çık
    if (error.name === "AbortError") return;

    // Gerçek ağ veya HTTP hatası
    store.setState({
      list: {
        status: "error",
        items: [],
        total: 0,
        error: error.userMessage ?? "Bir hata oluştu.",
      },
    });
  }
}