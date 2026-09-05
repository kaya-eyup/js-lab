import "./style.css";
import { startRouter, navigate, buildListUrl } from "./router.js";
import { render } from "./render.js";
import { debounce } from "./lib/debounce.js";
import { createStore } from "./store.js";
const onSearch = debounce((value) => {
  navigate(buildListUrl({ q: value, page: 1 }), { replace: true }); // olmayan bi sayfaya atma tehlikesindense 1e atsın
}, 300);
function handleSearchInput(e) {
  if (!e.target.matches("#search")) return;
  onSearch(e.target.value);
}
document.addEventListener("input", handleSearchInput);

// Router'ı başlat ve tek çizim kapısını bağla
startRouter((route) => render({ route }));

// GEÇİCİ — Adım 1 doğrulaması
const s = createStore({ count: 0, user: { name: "ada" } });

// const prevState = s.getState();
// const prevUser  = s.getState().user;

// const off = s.subscribe((st) => console.log("abone:", st.count));

// s.setState({ count: 1 });                      // 1) "abone: 1" basmalı
// console.log(s.getState() === prevState);       // 2) false — kök yeni
// console.log(s.getState().user === prevUser);   // 3) true  — dokunulmayan dal aynı
// console.log(s.getState().count);               // 4) 1

// off();
// s.setState({ count: 2 });                      // 5) hiçbir şey basmamalı
// console.log(s.getState().count);               // 6) 2 — state yine değişti

// const off2 = s.subscribe(() => console.log("A"));
// const off3 = s.subscribe(() => console.log("B"));
// s.setState({ count: 3 });                      // 7) "A" ve "B", sırayla

// // çıktılar aynen istendiği gibi geliyor.

// şu iki soru:

s.subscribe((st) => { if (st.count < 5) s.setState({ count: st.count + 1 }); });
s.setState({ count: 1 }); 
// mevcut stateyi sıfırlar diye düşünüyorum // stack overflow. birbirini sonsuz tetikleyen döngüye yol açıyormuş.

// b) kodu senkron yazdık, o yüzden hata fırlatırsa direkt yolu tıkar. guard clause henüz eklenmedi. asenkrona geçiş düşünülebilir ama o kaş yaparken göz çıkarmaya döner. // aynen öyle.