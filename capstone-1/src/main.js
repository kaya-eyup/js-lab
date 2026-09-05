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
startRouter((route) => store.setState({ route })); // yapılacaklar listesinde 3. öncül hakkında: kabloyu hoparlöre bağlamadan müziği niye başlatayım ki.


// ölçüm deneyler
// sayfa açılışında ilk çizim, yeni sayfaya geçişte bi çizim daha, eski sayfaya dönüşte yeni çizim yok store işini yapmalı(yanıldım.) arama kutusuna phone yazınca bi artmalı(debounce sayesinde), sonrakinde de bir artmalı, aynı bağlantıya ikinci kez tıklamada artmamalı.
// state her değiştiğinde ekran yeniden çiziliyor, şimdi kavradım bu durumu. 
// gereksiz çizim oluyor çünkü eşitlik kontrolü koymadık, olmamalı.