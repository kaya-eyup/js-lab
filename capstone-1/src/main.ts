import "./style.css";
import { startRouter, navigate, buildListUrl } from "./router.ts";
import { render } from "./render.ts";
import { debounce } from "./lib/debounce.ts";
import { createStore } from "./store.ts";
import { loadList } from "./actions.ts";
import type { AppState } from "./types.ts";
const onSearch = debounce((value: string) => {
  navigate(buildListUrl({ q: value, page: 1 }), { replace: true });
}, 600);

function handleSearchInput(e: Event): void {
  // target'ın gerçekten bir input olup olmadığını denetleyip daraltıyoruz
  if (!(e.target instanceof HTMLInputElement)) return;
  if (!e.target.matches("#search")) return;

  onSearch(e.target.value);
}

document.addEventListener("input", handleSearchInput);

const initialState: AppState = {
  route: { name: "list", query: { q: "", page: 1 } },
  list: { status: "idle" },
  detail: { status: "idle" },
};

const store = createStore(initialState);
store.subscribe(render);

startRouter((route) => {
  store.setState({ route });
  if (route.name === "list") {
    loadList(store, route.query);
  }
});