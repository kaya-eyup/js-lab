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


const initialState = {
  route: { name: "list", params: {}, query: { q: "", page: 1 } },
  list: { status: "idle", items: [], total: 0, error: null },
  detail: { status: "idle", item: null, error: null },
};


const store = createStore(initialState);
store.subscribe(render);
startRouter((route) => store.setState({ route })); // kabloyu hoparlöre bağlamadan müziği niye başlatayım ki.

// deney 1
// const frozen = Object.freeze({ a: 1 });
// frozen.a = 99;
// console.log(frozen.a); // htmlde module olarak çekilen dosyalar katı modda çalışır. burda hata fırlatır lakin konsola yazılınca daha müsamahalı davranır. sessizce devam eder, istemediğimiz şekilde yani.



// deney 2
// const state = Object.freeze({
//   count: 0,
//   list: { items: [], total: 0 },
// });
 
// // state.count = 5;              // 1) ? 0 olur, değiştirilemez.
// state.list.total = 99;        // 2) ? 99 olur, gezilebilir elemanları etkileyebilirsin, o elemanın içine giremezsin
// state.list.items.push("x");   // 3) ? x oraya girer.
// console.log(Object.isFrozen(state), Object.isFrozen(state.list));   // 4) ? true-false dönmeli. sebebini yukarda dedim.

// deney 3
// const frozen = Object.freeze({ a: 1, b: 2 }); 
// const next = { ...frozen, b: 3 };
// console.log(next, Object.isFrozen(next));
// // spread ile yapılan kopyalamalar sığ kopya olur ama burda zaten sadece tek katman var. burda frozeni dondurdun, nexte atayınca o dondurma eriyormuş yeni keşfettim. konsolda a:1 b:3 , false yazdırmalı.

// deney 4
//deepFreeze({ a: { b: { c: 1 } } }) //sonra
//  .a.b.c = 9// 	TypeError
//deepFreeze({ items: [1, 2] }) //sonra 
 // .items.push(3)	//TypeError
 // deepFreeze(5), deepFreeze(null)	//patlamamalı
// aynen istendiği gibi çıktı.

//deney 5 te istendiği gibi çıktı.