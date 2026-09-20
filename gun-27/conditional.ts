
// 1) Karar Veren Tip
type IsString<T> = T extends string ? true : false;

// Testler
const t1: IsString<"merhaba"> = true;  // Geçer
const t2: IsString<string> = true;     // Geçer

// @ts-expect-error
const t3: IsString<42> = true;         // Hata verir (false döner, true atanamaz)

// @ts-expect-error
const t4: IsString<boolean> = true;    // Hata verir (false döner, true atanamaz)

// 2) Dağıtım — Extract
type MyExtract<T, U> = T extends U ? T : never;

// Testler
type A = MyExtract<"a" | "b" | "c", "a" | "b">; // Sonuç: "a" | "b"

type Route =
  | { name: "list"; query: { q: string; page: number } }
  | { name: "detail"; id: number }
  | { name: "notFound" };

type B = MyExtract<Route, { name: "list" }>; // Sonuç: Sadece list rotası



// 3) Kalıptan Parça Çekme — ReturnType
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Testler
function statusTextExample() {
  return "Aktif";
}

type R1 = MyReturnType<() => string>;           // string
type R2 = MyReturnType<(a: number) => boolean>; // boolean
type R3 = MyReturnType<typeof statusTextExample>; // string
type R4 = MyReturnType<"merhaba">;              // never