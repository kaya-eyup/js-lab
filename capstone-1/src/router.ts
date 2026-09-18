export type ListRoute = { name: "list"; query: { q: string; page: number } };
export type DetailRoute = { name: "detail"; id: string };
export type NotFoundRoute = { name: "notFound" };
export type Route = ListRoute | DetailRoute | NotFoundRoute;

export const routes = [
  { name: "list", pattern: "/" },
  { name: "detail", pattern: "/product/:id" },
] as const;

type RouteName = (typeof routes)[number]["name"] | "notFound";
type Match = { name: RouteName; params: Record<string, string> };
export function matchRoute(pathname: string): Match {
  // kuralları sırayla deneme (list ve detail)
  // split ve filter kesinlikle string[] döner; if kontrolüne gerek yoktur.
  const pathParts = pathname.split("/").filter(Boolean); // kullanıcı girdisi, aynı kaldığı için sürekli döngüye sokmak yok.
  for (const route of routes) {
    // dış döngü-1. tur
    const routeParts = route.pattern.split("/").filter(Boolean); // /'lerden ayırıp dizi yapar, bizim tanımladığımız

    if (routeParts.length !== pathParts.length) continue; // eşit değil ise çöpe at

    let isMatch = true;
    const params: Record<string, string> = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];

      // 1. noUncheckedIndexedAccess koruması: ikisi de kesinlikle string olmak zorunda
      if (routePart === undefined || pathPart === undefined) {
        isMatch = false;
        break;
      }
      if (routePart.startsWith(":")) {
        params[routePart.slice(1)] = pathPart;
      } else if (routeParts[i] !== pathPart) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) return { name: route.name, params };
  }

  return { name: "notFound", params: {} };
}
export function toRoute(match: Match, search: string): Route {
  if (match.name === "list") {
    

    return {
      name: "list",
      query: parseQuery(search),
    };
  }

  if (match.name === "detail") {
    const id = match.params["id"]?.trim();

    // id yoksa veya boş metinse notFound
    if (!id) {
      return { name: "notFound" };
    }

    return {
      name: "detail",
      id,
    };
  }

  return { name: "notFound" };
}
function parseQuery(search: string): { q: string; page: number } {
  const params = new URLSearchParams(search);
  const q = params.get("q") || ""; // query(sorgu) değerini al, yoksa boş string dön.
  let page = Number(params.get("page"));
  // Eğer sayıya dönüşemediyse veya 1'den küçükse 1'e sabitle
  if (!Number.isInteger(page) || page < 1) {
    page = 1;
  }

  return { q, page };
}

// ─────  Şu anki adresi okuma ─────
function getCurrentRoute(): Route {
  return toRoute(matchRoute(window.location.pathname), window.location.search);
} // location -> { name, params, query }

// ─────  Gezinme ─────
type RouteChangeHandler = (route: Route) => void;
let onRouteChange: RouteChangeHandler | null = null;

export function navigate(url: string, { replace = false }: { replace?: boolean } = {}) {
  if (!onRouteChange) {
    throw new Error("navigate() called before startRouter()");
  }
  const currentUrl = window.location.pathname + window.location.search; // tam adresi sorgu parametresi ile birlikte al
  if (url === currentUrl) return; // zaten bulunduğun adrese gidemezsin

  if (replace) {
    window.history.replaceState(null, "", url);
  } //Geçmiş yığınına yeni sayfa eklemez; en üstteki mevcut adres kaydının üzerine yazar.
  else {
    window.history.pushState(null, "", url);
  } // Geçmiş yığınına yeni bir sayfa kaydı koyar ve URL'i günceller. Sayfa kesinlikle yeniden yüklenmez.
  onRouteChange(getCurrentRoute()); // ← eksik olan
}

// ─────  Başlatma ─────
export function startRouter(onChange: (route: Route) => void) {
  onRouteChange = onChange;
  window.addEventListener("popstate", () => {
    onRouteChange?.(getCurrentRoute())
  }); //Geri veya ileri basıldığında URL değiştiği için o anki yeni rotayı okur ve ekranı güncellemesi için fonksiyona gönderir.
  document.addEventListener("click", handleLinkClick);
  onRouteChange(getCurrentRoute()); // ilk çizim
}

// ─────  tıklamayı hallet ─────

function handleLinkClick(e: MouseEvent) {
  // Bu bloğun ana görevi şudur: Kullanıcı sayfadaki bir şeye tıkladığında araya girip "Bu tıklama sayfayı yeniden yüklemeden çözebileceğimiz bir iç link tıklaması mı?" sorusunu sormak. Yanıt evetse tarayıcının beyaz ekran vermesini engelleyip kontrolü SPA motoruna verir.
if (!(e.target instanceof Element)) return;
  if (e.defaultPrevented) return; // Benden önce çalışan bir listener preventDefault() dedi mi? Dediyse olaya karışma, sessizce çık.

  if (e.button !== 0) return; // e.button fare tuşunu belirtiyormuş. 0-sol tık, 1-orta tık, 2-sağ tık. // sol tık değilse çık.
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; // klayve kısayollarını kullanıyorsa çık.

  const anchor = e.target.closest("a"); // kancayı ağaçtan yukarı çıkarken en yakın a'ya tak. (kendinden başladığını unutma.)
  if (!anchor) return; // a'ya basılmama durumunda çık.

  if (anchor.target && anchor.target !== "_self") return; // yazan kişi bilerek farklı bi davranış istemiş.
  if (!anchor.hasAttribute("href") || anchor.hasAttribute("download")) return; // yazan kişi bilerek farklı bi davranış istemiş2.
  if (anchor.origin !== window.location.origin) return; // domain kontrolü, farklı kökene gidecekse çık.

  if (anchor.pathname === window.location.pathname && anchor.hash) return; // aynı sayfada #çapa linki ise çık (sayfa içi kaydırma)

  e.preventDefault(); // yukarıdaki bütün durumları geçiyor ise kesinlikle masum bi iç site sol tıkıdır. Komple yenileme özelliğini kapat.
  navigate(anchor.pathname + anchor.search);
}

export function buildListUrl({ q = "", page = 1 }: { q?: string; page?: number } = {}): string {
  // ??? URLSearchParams ile kur
  const searchParams = new URLSearchParams();
  const trimmedQ = q.trim();
  if (trimmedQ) {
    searchParams.set("q", trimmedQ);
  }

  if (Number.isInteger(page) && page > 1) {
    searchParams.set("page", String(page));
  }

  const queryString = searchParams.toString();
  return queryString ? `/?${queryString}` : "/";
}
