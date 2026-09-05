import "./style.css";
import { startRouter, navigate, buildListUrl } from "./router.js";
import { render } from "./render.js";
import { debounce } from "./lib/debounce.js";

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