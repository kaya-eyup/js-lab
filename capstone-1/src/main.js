import "./style.css";
// import { matchRoute } from "./router.js";
//import { parseQuery } from "./router.js";
import { startRouter, navigate } from "./router.js";

//  console.log(matchRoute("/"))
//  console.log(matchRoute("/product/121"))
//  console.log(matchRoute("/product/"))
//  console.log(matchRoute("/product/121/reviews"))
//  console.log(matchRoute("/urunler"))
// console.log(matchRoute(""));

// console.log(parseQuery("")); // { q: "", page: 1 }
// console.log(parseQuery("?q=phone")); // { q: "phone", page: 1 }
// console.log(parseQuery("?q=phone&page=3")); // { q: "phone", page: 3 }
// console.log(parseQuery("?page=abc")); // { q: "", page: 1 }
// console.log(parseQuery("?page=-5")); // { q: "", page: 1 }
// console.log(parseQuery("?page=2.7")); // { q: "", page: 1 }
// console.log(parseQuery("?q=t%C3%BCrk")); // { q: "türk", page: 1 }

// GEÇİCİ — Adım 4'te gerçek render gelecek
 function debugRender(route) {
   document.querySelector("#app").textContent = JSON.stringify(route, null, 2);
 }
 startRouter(debugRender);
window.navigate = navigate;   // GEÇİCİ — konsoldan denemek için
 

// #0, history.length başlangı. değeri 1
// #1, url eklendi, history = 2
// #2, değişmedi
// #3, url ?q=phone oldu. 
// #4, url /product/9 oldu, history= 3
// #5, istenen phone sorgu urlsine döndü.
// #6, istenen şekilde oldu yine.
// #7, /kediler oldu url, history= 4
// #8, aynen öyle oldu.


// bir de bunu gözle dediğin deney:

// geri dönüşten sonra da history aynı kalır, ama yeni bi yere gittikten sonraki olayı anlamam biraz zaman aldı. geçmişe gidip yeni bi dallanma yapar ise önceki yaptığımız dallanma tamamamen kırılıp çöpe atılıyor sanırım.

// ekstra detaylar:
// adres çubuğuna elle yazıp popstate yapamıyoruz.  f5e tıklamış gibi tepki veriyor sadece.
// google.comu navigate etmek istediğinde güvenlik hatası verdi, kabul edilebilir bi tepki.