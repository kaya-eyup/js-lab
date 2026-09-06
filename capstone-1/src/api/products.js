import { http } from "../lib/http.js";

const BASE = "https://dummyjson.com";
const LIMIT = 12;

export async function searchProducts(q = "", { page = 1, signal } = {}) {
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

  const items = data.products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    thumbnail: p.thumbnail,
  }));

  return {
    items,
    total: data.total,
  };
}

export async function getProduct(id, { signal } = {}) {
  const url = `${BASE}/products/${id}`;
  return await http(url, { signal });
}