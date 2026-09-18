export type FetchState<T> =
  | { status: "idle" }
  | { status: "loading"; previous: T | null }
  | { status: "success"; data: T }
  | { status: "error"; message: string };