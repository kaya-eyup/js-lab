export { };
// ── Bölüm 0 — dünden devir: çıkarım doğrulaması ──────────────
declare function pair<T>(a: T, b: T): T[];
declare function all<T>(items: T[]): T;

const p1 = pair(1, 2); // number[] çıkar
// @ts-expect-error : Argument of type 'string' is not assignable to parameter of type 'number'.
const p2 = pair(1, "iki");
const a1 = all([1, "iki"]); // string| number çıkar

// p1de birleşim yok çünkü gerek yok, a1de ise dizinin kendisi kapsayıcı olduğu için içindeki elemanları tarayıp birleşim yapar

// --- TS TİP ÇIKARIMI (Type Inference Mechanism) ---

// 1. Aday Toplama (Candidate Inference): TS ilk argümanda "kilitlenmez".
// Tüm argümanları tarayıp T için aday havuzu çıkarır (Örn: [number, string]).

// 2. En İyi Ortak Tip (Best Common Type): Seçilecek tip, havuzdaki adaylardan
// biri olmak zorundadır. TS adayların birbirini kapsayıp kapsamadığına bakar.

// 3. Union İcat Etmeme: TS, bağımsız parametreler (a: T, b: T) çakıştığında
// durumu kurtarmak için durduk yere birleşim (number | string) uydurmaz.

// 4. Raporlama Yanılsaması: Adaylar uyuşmadığında algoritma çöker. TS sadece
// referans vermek adına hata mesajını ilk adayı (number) baz alarak oluşturur.
// Bu da "ilkinde kilitlendi" yanılsamasını yaratır.


// ── Bölüm 1 — iskelet + kendi utility'lerim ──────────────────

type User = { id: number; name: string; email: string };
type Draft = { id?: number; name?: string };
type Frozen = { readonly id: number };
type WithFlags = { readonly id: number; name?: string };

//   Copy<T>

type Copy<T> = { [P in keyof T]: T[P] };
const u: Copy<User> = { id: 1, name: "a", email: "b" }; // sıkıntısız

//   MyPartial<T>     her alan isteğe bağlı.

type MyPartial<T> = { [P in keyof T]?: T[P] };

const u2a: MyPartial<User> = {}; // Geçerli
const u2b: MyPartial<User> = { name: "a" }; // Geçerli

// @ts-expect-error Type 'number' is not assignable to type 'string'.
const u2c: MyPartial<User> = { name: 42 };

//   MyRequired<T>   her alan zorunlu

type MyRequired<T> = { [P in keyof T]-?: T[P] };

const u3a: MyRequired<Draft> = { id: 1, name: "a" }; // Geçerli

// @ts-expect-error Property 'name' is missing in type '{ id: number; }' but required in type 'MyRequired<Draft>'.
const u3b: MyRequired<Draft> = { id: 1 };


//   MyReadonly<T>   her alan salt-okunur.

type MyReadonly<T> = { readonly [P in keyof T]: T[P] };

const u2: MyReadonly<User> = { id: 1, name: "a", email: "b" };
// @ts-expect-error : Cannot assign to 'id' because it is a read-only property.
u2.id = 5

//   Mutable<T>   ters yön, salt-okunurluğu kaldır

type Mutable<T> = {-readonly [P in keyof T]: T[P]  }

const f: Mutable<Frozen> = { id: 1 };
f.id = 5; // Geçerli (readonly kalkan bir tipe atama yapıldı)


//   MyPick<T, K>     sadece seçilen anahtarlar.

type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

const u6a: MyPick<User, "id" | "name"> = { id: 1, name: "a" }; 

// @ts-expect-error Object literal may only specify known properties, and 'email' does not exist in type 'MyPick<User, "id" | "name">'.
const u6b: MyPick<User, "id" | "name"> = { id: 1, name: "a", email: "b" };

// @ts-expect-error Type '"phone"' does not satisfy the constraint 'keyof User'.
type WrongPick = MyPick<User, "phone">;

//   MyRecord<K, V>       anahtar listesinden sözlük kur.

type MyRecord<K extends keyof any, V> = { [P in K]: V };

const perms: MyRecord<"admin" | "viewer", string[]> = {
  admin: ["read"],
  viewer: ["read"]
};

// @ts-expect-error Property 'viewer' is missing in type '{ admin: string[]; }' but required in type 'MyRecord<"admin" | "viewer", string[]>'.
const badPerms: MyRecord<"admin" | "viewer", string[]> = { admin: ["read"] };


//   PartialBy<T, K>        ← okumada yoktu    (Mimari Birleştirme)
  
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// İsteğe bağlı çözülmüş hali: (id, name zorunlu) & (email isteğe bağlı)
type UserInput = PartialBy<User, "email">;

const ui1: UserInput = { id: 1, name: "a" }; // Geçerli
const ui2: UserInput = { id: 1, name: "a", email: "b" }; // Geçerli

// @ts-expect-error Property 'name' is missing in type '{ id: number; email: string; }' but required in type 'Omit<User, "email">'.
const ui3: UserInput = { id: 1, email: "b" };


// ── Bölüm 2 — deneyler ───────────────────────────────────────
//   Deney 1: şekil koruma

type R1 = MyPartial<WithFlags>; // duruyor.
type R2 = MyReadonly<WithFlags>; // duruyor.
type R3 = MyPartial<string[]>;   // bir dizi, şekli korudu.
type R4 = MyPick<WithFlags, "id">; // anlamadım.

//   Deney 2: Partial ne kadar derine iniyor

type Config = { db: { host: string; port: number }; debug: boolean };

const c1: MyPartial<Config> = {};  // sıkıntısız
//@ts-expect-error : Property 'port' is missing in type '{ host: string; }' but required in type '{ host: string; port: number; }'.
const c2: MyPartial<Config> = { db: { host: "localhost" } };  // MyPartial, spread gibi yüzeysel kalıyordu. iç katmana erişemez.


//   Deney 3: Pick ile Record birbirinin yerine geçer mi

// (a) Record'a User'ın anahtarlarını ver
type A = MyRecord<keyof User, string>; // hepsi string oldu.

// (b) Pick'in işini Record'a yaptırmayı dene
type B = MyRecord<"id" | "name", number|string>;   // amaç: { id: number; name: string } tip güvenliği yok oldu.

// (c) Record'un işini Pick'e yaptırmayı dene
type C = MyPick<{ admin: number; viewer: number; other: boolean }, "admin" | "viewer" >; // amaç: { admin: number; viewer: number } gereksiz bir uzunluk oldu.



// Pick, var olan karmaşık bir DTO/Model'i daraltmak ve alt kümelerini çıkarmak için kullanılır; Record, yapısal bir kaynak tip olmadığında sıfırdan homojen bir sözlük (dictionary/hash map) haritası yaratmak için kullanılır. 