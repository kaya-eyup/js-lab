export const routes = [
  { name: "list",   pattern: "/" },
  { name: "detail", pattern: "/product/:id" },
];

export function matchRoute(pathname) {

    // kuralları sırayla deneme (list ve detail)

    const pathParts = pathname.split("/").filter(Boolean); // kullanıcı girdisi, aynı kaldığı için sürekli döngüye sokmak yok.

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

// ─────  Şu anki adresi okuma ─────
function getCurrentRoute() { 
  const { name, params } = matchRoute(window.location.pathname);// o anki yolu al, içinden name ve params değerlerini çek.
  const query = parseQuery(window.location.search); // query sorgusundaki değeri çeker.

  return { name, params, query }; // o anki rotanın tam resmini döndürür.
}    // location -> { name, params, query }



// ─────  Gezinme ─────
let onRouteChange = null;
export function navigate(url, { replace = false } = {}) { 
     if (!onRouteChange) {
    throw new Error("navigate() called before startRouter()");
  }
    const currentUrl = window.location.pathname + window.location.search; // tam adresi sorgu parametresi ile birlikte al
    if (url === currentUrl) return; // zaten bulunduğun adrese gidemezsin

    if (replace) { window.history.replaceState(null, "", url) }//Geçmiş yığınına yeni sayfa eklemez; en üstteki mevcut adres kaydının üzerine yazar.
  else { window.history.pushState(null, "", url) } // Geçmiş yığınına yeni bir sayfa kaydı koyar ve URL'i günceller. Sayfa kesinlikle yeniden yüklenmez.
  onRouteChange(getCurrentRoute());   // ← eksik olan

}

// ─────  Başlatma ─────
export function startRouter(onChange) {
  onRouteChange = onChange;
    window.addEventListener("popstate", () => { onRouteChange(getCurrentRoute()) }); //Geri veya ileri basıldığında URL değiştiği için o anki yeni rotayı okur ve ekranı güncellemesi için fonksiyona gönderir.
    document.addEventListener("click", handleLinkClick)
    onRouteChange(getCurrentRoute());   // ilk çizim
}


// ─────  tıklamayı hallet ─────

function handleLinkClick(e) {

  // Bu bloğun ana görevi şudur: Kullanıcı sayfadaki bir şeye tıkladığında araya girip "Bu tıklama sayfayı yeniden yüklemeden çözebileceğimiz bir iç link tıklaması mı?" sorusunu sormak. Yanıt evetse tarayıcının beyaz ekran vermesini engelleyip kontrolü SPA motoruna verir.

  if (e.defaultPrevented) return; // Benden önce çalışan bir listener preventDefault() dedi mi? Dediyse olaya karışma, sessizce çık.

  if (e.button !== 0) return; // e.button fare tuşunu belirtiyormuş. 0-sol tık, 1-orta tık, 2-sağ tık. // sol tık değilse çık.
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; // klayve kısayollarını kullanıyorsa çık.

  const anchor = e.target.closest("a"); // kancayı ağaçtan yukarı çıkarken en yakın a'ya tak. (kendinden başladığını unutma.)
  if (!anchor) return;                  // a'ya basılmama durumunda çık. 

  if (anchor.target && anchor.target !== "_self") return;  // yazan kişi bilerek farklı bi davranış istemiş.
  if (!anchor.hasAttribute("href")||anchor.hasAttribute("download")) return;    // yazan kişi bilerek farklı bi davranış istemiş2.
  if (anchor.origin !== window.location.origin) return;    // domain kontrolü, farklı kökene gidecekse çık.


  if (anchor.pathname === window.location.pathname && anchor.hash) return; // aynı sayfada #çapa linki ise çık (sayfa içi kaydırma)

  e.preventDefault(); // yukarıdaki bütün durumları geçiyor ise kesinlikle masum bi iç site sol tıkıdır. Komple yenileme özelliğini kapat.
  navigate(anchor.pathname + anchor.search); 


}

export function buildListUrl({ q = "", page = 1 } = {}) {
  // ??? URLSearchParams ile kur
const searchParams = new URLSearchParams();
  const trimmedQ = q.trim();
  if (trimmedQ) {
    searchParams.set("q", trimmedQ);
  }

  if (Number.isInteger(page) && page > 1) {
    searchParams.set("page", page);
  }

  const queryString = searchParams.toString();
  return queryString ? `/?${queryString}` : "/";
}

