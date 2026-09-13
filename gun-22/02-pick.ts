export {};

// ============================================================
// Bölüm 3 — pick: birden çok alanı tipli olarak seçmek
// ============================================================
//
// getField tek bir alan veriyor. Şimdi birden çok alan istiyoruz:
//   pick(user, ["id", "name"])   →   { id: 1, name: "Ada" }
//
// Çalışma anı tarafı kolay: döngüyle kopyala.
// Zor olan tip tarafı: dönüş tipi "verilen anahtarlar hangileriyse
// onlardan oluşan yeni bir nesne tipi" olmalı.
//   - T fazla geniş (bütün alanları içerir)
//   - T[K] tek bir DEĞER tipi verir, nesne değil
//
// Eksik olan şey: "anahtar listesinin üzerinde dolaşıp her biri için
// bir alan üret" — yani tip dünyasında bir döngü.

type User = { id: number; name: string; isActive: boolean };
const user: User = { id: 1, name: "Ada", isActive: true };

// ------------------------------------------------------------
// 1) Çalışma anı gövdesi + kısıtlı imza (dönüş tipi henüz yok)
// ------------------------------------------------------------

function pick1<T, K extends keyof T>(obj: T, keys: K[]) {
  const out: any = {}; // borç: any
  for (const key of keys) {
    out[key] = obj[key];
  }
  return out;
}

// Çıkarım sonucu: dönüş tipi 'any'.
// Sebep: TS dönüş tipini 'out' değişkeninden okur, ona any dedik.
// Yani tip güvenliği fonksiyonun İÇİNDE değil, DIŞINDA da kayboldu:
// çağıran herkes any alıyor.

// ------------------------------------------------------------
// 2) Yalan imza: dönüş tipi T  →  kanıt satırı
// ------------------------------------------------------------

function pick2<T, K extends keyof T>(obj: T, keys: K[]): T {
  const out: any = {};
  for (const key of keys) {
    out[key] = obj[key];
  }
  // out gerçekte T'nin tamamı değil; any olduğu için TS ses etmiyor.
  return out;
}

const picked2 = pick2(user, ["id", "name"]);

// Tahmin (doğrulandı): derleyici burada HATA VERMEZ, çünkü imzada
// dönenin tam bir User olduğunu iddia ettik.
// Çalışma anında 'undefined' basar — döngü isActive'i hiç kopyalamadı.
// Tip ile gerçeklik koptu.
console.log(picked2.isActive);

// ------------------------------------------------------------
// 3) Tip dünyasında döngü ile dürüst dönüş tipi
// ------------------------------------------------------------

// [P in K] : "K birleşimindeki her üyeyi sırayla P diye adlandır ve
// her biri için bir alan üret." Adı: eşlemeli tip (mapped type).
// Buradaki 'in', ne "name" in obj operatörü ne de for...in — üçüncü anlam.
type PickedFields<T, K extends keyof T> = {
  [P in K]: T[P];
};

// keys: readonly K[]  →  fonksiyon diziyi değiştirmiyor, sadece okuyor.
// Daha az söz verince kabul kümesi büyür: hem readonly hem normal dizi geçer.
// Kural: girdi dizilerini readonly al, çıktı dizilerini değiştirilebilir ver.
function pick3<T, K extends keyof T>(obj: T, keys: readonly K[]): PickedFields<T, K> {
  // Tek iddia, tek satır. Gerekçe: TS döngünün boş nesneyi adım adım
  // hedef şekle getirdiğini takip edemez; bildirim anında {} gerçekten
  // PickedFields değildir. Bu yüzden 'as' ile sorumluluğu biz alıyoruz.
  //
  // Neden 'as', neden 'any' değil:
  //   const out: PickedFields<T, K> = {}   → AÇIKLAMA (annotation): denetlenir, TS2322 verir
  //   const out = {} as PickedFields<T, K> → İDDİA (assertion): denetlenmez, geçer
  // 'as' yalanı bu tek satıra hapseder; 'any' yalanı fonksiyonun tamamına yayar.
  // İmza dürüst kaldığı için çağıran herkes doğruyu alır.
  const out = {} as PickedFields<T, K>;
  for (const key of keys) {
    out[key] = obj[key];
  }
  return out;
}

const picked3 = pick3(user, ["id", "name"]);

picked3.name.toUpperCase(); // çalışır → dönüş tipi string
picked3.id.toFixed(2); // çalışır → dönüş tipi number

// @ts-expect-error Property 'isActive' does not exist on type 'PickedFields<User, "id" | "name">'.
picked3.isActive; // artık tip dünyasında da dürüstüz

// ------------------------------------------------------------
// 4) Hazır sürümle karşılaştırma
// ------------------------------------------------------------

// PickedFields<T, K> ile Pick<T, K> aynı şeydir; Pick, lib.es5.d.ts'te
// birebir şu satırla tanımlıdır:  type Pick<T, K extends keyof T> = { [P in K]: T[P] }
// Sektör standardı: kendi eşlemeli tipini yazma, hazır olanı kullan.
function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const key of keys) {
    out[key] = obj[key];
  }
  return out;
}

const picked4 = pick(user, ["name", "isActive"]);
picked4.isActive; // boolean
// @ts-expect-error Property 'id' does not exist on type 'Pick<User, "name" | "isActive">'.
picked4.id;

// ------------------------------------------------------------
// 5) Deney 4: anahtar listesi bir değişkende olursa
// ------------------------------------------------------------

// 5a) Düz değişken: elemanlar 'string' olarak genişler (widening).
const wanted = ["id", "name"];

// @ts-expect-error Argument of type 'string[]' is not assignable to parameter of type '(keyof User)[]'.
const w1 = pick1(user, wanted);
// Not: TS burada K'yi çıkaramadığı için çıkarımdan vazgeçip KISITA düşüyor
// ve birleşimi açmadan 'keyof User' yazıyor.

// 5b) as const: elemanlar literal oldu ama dizi readonly oldu.
// pick1'in imzası değiştirilebilir dizi istediği için hâlâ patlıyor.
const wantedConst = ["id", "name"] as const;

// @ts-expect-error The type 'readonly ["id", "name"]' is 'readonly' and cannot be assigned to the mutable type '(keyof User)[]'.
const w2 = pick1(user, wantedConst);

// 5c) as const + imzada readonly K[]  →  ikisi birlikte çalışır.
const w3 = pick3(user, wantedConst);
w3.name.toUpperCase();
// @ts-expect-error Property 'isActive' does not exist on type 'PickedFields<User, "id" | "name">'.
w3.isActive;

// Ders: 'as const' tek başına yetmez. Bir sorunu çözüp (literal tip)
// ikincisini yaratır (readonly). Diğer yarısı imzada: readonly K[].