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

document.addEventListener("click", (e) => {
  const state = store.getState();
  if (e.target.id === "reverse") { 
    // Birazdan burayı dolduracağız
    // [...dizi] ile sığ kopya alıp onu ters çeviriyoruz
    const newItems = [...state.list.items].reverse();
    // state.list içindeki diğer verileri (...state.list) kaybetmemek için yayıyoruz
    store.setState({ list: { ...state.list, items: newItems } });
  }
  if (e.target.id === "remove-first") { 
    // Birazdan burayı dolduracağız
    // slice(1) orijinali bozmadan ilk eleman hariç yeni bir dizi döner
    const newItems = state.list.items.slice(1);
    store.setState({ list: { ...state.list, items: newItems } });
  }
});

const fakeItems = [ 
  { id: 121, title: "iPhone X",   price: 549 },
  { id: 122, title: "Galaxy S20", price: 399 },
  { id: 123, title: "Pixel 7",    price: 299 },
  { id: 124, title: "Xiaomi 13",  price: 249 },
];

const initialState = {
  route: { name: "list", params: {}, query: { q: "", page: 1 } },
  list: { status: "success", items: fakeItems, total: 4, error: null },
  detail: { status: "idle", item: null, error: null },
};


const store = createStore(initialState);
store.subscribe(render);
startRouter((route) => store.setState({ route })); // kabloyu hoparlöre bağlamadan müziği niye başlatayım ki.

// const items = store.getState().list.items;
// items.reverse();
// store.setState({ list: { items } }); 
//dondurma olayımız boşuna durmuyor, hata verecek.
// dondurma korumasını kaldırırsak veriyi üzerine yazar ve diğer alanlar silinir. doğrusu önce spread edip ondan sonra üzerine yazdırmaktır

// aşama a:  ters çevirde innerHTML sıfırlanıyor bu yüzden de odak da sıfırlanıyor. aynı durum ilkini çıkarda da var.


// aşama c sonrası not: ilkini çıkar ve ters çevir olayları kutuya yazılan değeri etkilemiyor. burada kimlikle eşleştirme lazım. dataset id ile.


// const c = document.querySelector(".cards");
// const first = c.children[0];
// c.appendChild(first);
// kondolda denendi, hedef kartı en baştan en sona götürdü. 