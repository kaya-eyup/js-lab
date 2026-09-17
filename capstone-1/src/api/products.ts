import { http, HttpError } from "../lib/http.ts";

const BASE = "https://dummyjson.com";
const LIMIT = 12;

// ── 1. Tipler: ürünün UYGULAMA içindeki şekli ──
export type ProductSummary = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};
export type Product = ProductSummary & {
  description: string;
  category: string;
};
export type ListResult = { items: ProductSummary[]; total: number };
type SearchOptions = { page?: number; signal?: AbortSignal };

// ── 2. Sınır: unknown → kontrol edilmiş tip ──
function parseSummary(raw: unknown): ProductSummary {
  // nesne mi? (typeof null da "object" döner, o yüzden null ayrıca kontrol ediliyor)
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid product: not an object");
  }

  // alan var mı + doğru türde mi? Bu if'ten sonra TS raw.id'nin sayı olduğunu biliyor
  if (!("id" in raw) || typeof raw.id !== "number") {
    throw new Error("Invalid product: id");
  }

  // title (string),
  if (!("title" in raw) || typeof raw.title !== "string") {
    throw new Error("Invalid product: title");
  }
  //  price (number),
  if (!("price" in raw) || typeof raw.price !== "number") {
    throw new Error("Invalid product: price");
  }
  //  thumbnail (string),

  if (!("thumbnail" in raw) || typeof raw.thumbnail !== "string") {
    throw new Error("Invalid product: thumbnail");
  }

  return {
    id: raw.id,
    title: raw.title,
    price: raw.price,
    thumbnail: raw.thumbnail,
  };
}

function parseList(raw: unknown): ListResult {
  // nesne mi? (typeof null da "object" döner, o yüzden null ayrıca kontrol ediliyor)
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid list: not an object");
  }
  if (!("products" in raw) || !Array.isArray(raw.products)) {
    throw new Error("Invalid list: products");
  }

  if (!("total" in raw) || typeof raw.total !== "number") {
    throw new Error("Invalid list: total");
  }

  return { items: raw.products.map(parseSummary), total: raw.total }; // raw.products burada any
}

function parseProduct(raw: unknown): Product {
  //  Ortak 4 alanı doğrula
  const summary = parseSummary(raw);

  // TS için raw hâlâ unknown → nesne kontrolü tekrar
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid product: not an object");
  }

  //  description kontrolü
  if (!("description" in raw) || typeof raw.description !== "string") {
    throw new Error("Invalid product: description");
  }

  //  category kontrolü
  if (!("category" in raw) || typeof raw.category !== "string") {
    throw new Error("Invalid product: category");
  }

  //  Her şey tamamsa, summary'den gelen 4 alanı ve buradan gelen 2 alanı birleştir
  return {
    ...summary,
    description: raw.description,
    category: raw.category,
  };
}

// ── 3. Dışarıya açılan fonksiyonlar ──

export async function searchProducts(
  q = "",
  { page = 1, signal }: SearchOptions = {},
): Promise<ListResult> {
  const trimmedQ = q.trim();
  const skip = (page - 1) * LIMIT;

  // 1. Endpoint ve query parametrelerinin belirlenmesi
  const endpoint = trimmedQ ? "/products/search" : "/products";
  const params = new URLSearchParams({
    limit: String(LIMIT),
    skip: String(skip),
  });

  if (trimmedQ) {
    params.set("q", trimmedQ);
  }

  const url = `${BASE}${endpoint}?${params.toString()}`;

  // 2. İstek ve veri çevirisi
  const data = await http(url, { signal });
  return parseList(data);
}

export async function getProduct(
  id: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Product | null> {
  const safeId = encodeURIComponent(id);
  const url = `${BASE}/products/${safeId}`;
  try {
    const data = await http(url, { signal });
    return parseProduct(data);
  } catch (error) {
    // 1) error 404 taşıyan bir HttpError ise → null döndür
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    // 2) değilse → aynı hatayı olduğu gibi tekrar fırlat
    throw error;
  }
}
