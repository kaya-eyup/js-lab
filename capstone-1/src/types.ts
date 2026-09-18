import type { ListResult, Product } from "./api/products.ts";
import type { Route } from "./router.ts";

export type AppState = {
  route: Route;
  list: FetchState<ListResult>;
  detail: FetchState<Product | null>;
};



export type FetchState<T> =
  | { status: "idle" }
  | { status: "loading"; previous: T | null }
  | { status: "success"; data: T }
  | { status: "error"; message: string };