import { http, HttpError } from "../lib/http.ts";
import * as z from "zod";

const BASE = "https://dummyjson.com";
export const LIMIT = 12;

// ── 1. Tipler: ürünün UYGULAMA içindeki şekli ──

export type ListResult = { items: ProductSummary[]; total: number };
type SearchOptions = { page?: number; signal?: AbortSignal };

// ── 2. Sınır: kontrol edilmiş tip ──

const ProductSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  thumbnail: z.string(),
});
const ProductSchema = ProductSummarySchema.extend({
  description: z.string(),
  category: z.string(),
});
const ListSchema = z.object({
  products: z.array(ProductSummarySchema),
  total: z.number(),
});

export type ProductSummary = z.infer<typeof ProductSummarySchema>;
export type Product = z.infer<typeof ProductSchema>;

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
  const parsed = ListSchema.parse(data); // bozuksa fırlatır
  return { items: parsed.products, total: parsed.total }; // sunucunun adı → uygulamanın adı
}
export async function getProduct(
  id: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Product | null> {
  const safeId = encodeURIComponent(id);
  const url = `${BASE}/products/${safeId}`;
  try {
    const data = await http(url, { signal });
    return ProductSchema.parse(data);
  } catch (error) {
    // 1) error 404 taşıyan bir HttpError ise → null döndür
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    // 2) değilse → aynı hatayı olduğu gibi tekrar fırlat
    throw error;
  }
}
