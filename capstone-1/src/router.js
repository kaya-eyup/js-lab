export const routes = [
  { name: "list",   pattern: "/" },
  { name: "detail", pattern: "/product/:id" },
];

export function matchRoute(pathname) {
  const path = pathname === "" ? "/" : pathname; // boşsa / yap, değilse devam et

    // kuralları sırayla deneme (list ve detail)

    const pathParts = path.split("/").filter(Boolean); // kullanıcı girdisi, aynı kaldığı için sürekli döngüye sokmak yok.

  for (const route of routes) {  // dış döngü-1. tur
    const routeParts = route.pattern.split("/").filter(Boolean); // /'lerden ayırıp dizi yapar, bizim tanımladığımız

    if (routeParts.length !== pathParts.length) continue; // eşit değil ise çöpe at

    let isMatch = true;
    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) return { name: route.name, params };
  }

  return { name: "notFound", params: {} };
}

export function parseQuery(search) {
const params = new URLSearchParams(search);
    const q = params.get("q") || ""; // query(sorgu) değerini al, yoksa boş string dön.
    let page = Number(params.get("page"));
    // Eğer sayıya dönüşemediyse veya 1'den küçükse 1'e sabitle
    if (!Number.isInteger(page)|| page < 1 ) {
        page = 1
    }
    
    return { q, page };


}
