import "./style.css";
import { startRouter, navigate, buildListUrl } from "./router.js";
import { render } from "./render.js";
import { debounce } from "./lib/debounce.js";
import { createStore } from "./store.js";
import { loadList } from "./actions.js";

const onSearch = debounce((value) => {
  navigate(buildListUrl({ q: value, page: 1 }), { replace: true });
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

startRouter((route) => {
  store.setState({ route });
  if (route.name === "list") {
    loadList(store, route.query);
  }
});  