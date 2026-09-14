export{};
// ── Bölüm 0 — 02'den devir: literal düzeltmesi ───────────────
// düzeltme tamamlandı.

// ── Bölüm 1 — sorun: neden metin hata yetmiyor ───────────────
    
//     hata metni ile ne yapabileceğin:

// Üzerine switch yazamazsın — metin karşılaştırması yapman gerekir, if (error === "sayı değil"). Birisi mesajı düzeltince kodun sessizce bozulur.
// Arayüzü Türkçeden İngilizceye çeviremezsin; hata mesajı iş mantığının içine gömülü.
// Hatanın verisini taşıyamazsın: "çok büyük" diyebilirsin ama "en fazla 150 olabilir, sen 900 yazdın" diyemezsin.
// Derleyici sana "bu hata türünü ele almadın" diyemez, çünkü kaç tür olduğunu bilmiyor.

// Metin hata bir başlangıçtır, varış değil.
    
// ── Bölüm 2 — etiketli hata birleşimi ───────────────────────
    type ParseError =
  | { kind: "empty" }
  | { kind: "not_a_number"; input: string }
  | { kind: "negative"; value: number }
  | { kind: "too_large"; value: number; max: number } 
  | { kind: "not_integer"; value: number } 

  

  const e1: ParseError = { kind: "negative", value: -5 };
// @ts-expect-error :Type '{ kind: "negative"; }' is not assignable to type 'ParseError'.
//   Property 'value' is missing in type '{ kind: "negative"; }' but required in type '{ kind: "negative"; value: number; }'.
// 03-result-error.ts(20, 25): 'value' is declared here.
const e2: ParseError = { kind: "negative" };

// @ts-expect-error :Type '"nope"' is not assignable to type '"empty" | "not_a_number" | "negative" | "too_large"'.
//03-result-error.ts(18, 7): The expected type comes from property 'kind' which is declared here on type 'ParseError'
const e3: ParseError = { kind: "nope" };



// ── Bölüm 3 — parseAge yeniden yazımı ───────────────────────

// Varsayılan tip kolaya kaçırır; çağıranı somut bir hata modeli tasarlamaya zorlamak için E açıkça istenmelidir
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function parseAge(input: string): Result<number, ParseError> {
  const trimmed = input.trim();
  if (trimmed === "") {
    return { ok: false, error: { kind: "empty" } };
  }

  const num = Number(trimmed);
  if (Number.isNaN(num)) {
    return { ok: false, error: { kind: "not_a_number", input: trimmed } };
  }

  if (num < 0) {
    return { ok: false, error: { kind: "negative", value: num } };
  }

  if (num > 150) {
    return { ok: false, error: { kind: "too_large", value: num, max: 150 } };
  }
if (!Number.isInteger(num)) {
  return { ok: false, error: { kind: "not_integer", value: num } };
}
  return { ok: true, value: num };
}
// ── Testler ──────────────────────────────────────────────────

// 1. Boş girdi
const t1 = parseAge("   ");
console.log(t1); // { ok: false, error: { kind: 'empty' } }

// 2. Sayı olmayan girdi
const t2 = parseAge("yirmi");
console.log(t2); // { ok: false, error: { kind: 'not_a_number', input: 'yirmi' } }

// 3. Negatif sayı
const t3 = parseAge("-5");
console.log(t3); // { ok: false, error: { kind: 'negative', value: -5 } }

// 4. Sınırı aşan sayı
const t4 = parseAge("151");
console.log(t4); // { ok: false, error: { kind: 'too_large', value: 151, max: 150 } }

// 5. Başarılı
const t5 = parseAge(" 21 ");
console.log(t5); // { ok: true, value: 21 }




// ── Bölüm 4 — sunum katmanı: switch + assertNever ────────────

function describe(e: ParseError): string {
  switch (e.kind) {
    case "empty":        return "Yaş boş bırakılamaz.";
    case "not_a_number": return `"${e.input}" bir sayı değil.`;
    case "negative":     return `Yaş negatif olamaz (${e.value}).`;
    case "too_large": return `Yaş en fazla ${e.max} olabilir (${e.value}).`; // deney 1: bu dalda input diye bi alan yok.
    case "not_integer": return `Lütfen tam sayı giriniz`;
    default:             return assertNever(e); 
  }
}
function assertNever(x: never): never {
  throw new Error(`Ele alınmayan durum: ${JSON.stringify(x)}`);
}


// ── Bölüm 5 — deney: hata kümesini büyüt ────────────────────
// tamamlandı
// ele alınmayan durum neverdaki e'ye düşüyor, orası da never tipi beklediği için buraya o durum gelemez diyor. describe içindeki defaultta patlar.


// ── Bölüm 6 — unwrapOr'ı genişlet + cause zinciri ────────────
function unwrapOr<T, E, U>(r: Result<T, E>, fallback: U): T | U {
  return r.ok ? r.value : fallback;
}
const age  = unwrapOr(parseAge("30"),  0);      // number
const age2 = unwrapOr(parseAge("abc"), null);   // number | null

function unwrap<T, E>(r: Result<T, E>, toMessage: (e: E) => string): T {
  if (r.ok) return r.value;
  throw new Error(toMessage(r.error), { cause: r.error });
}

unwrap(parseAge("abc"), describe);



// ── Bölüm 7 — (vakit kalırsa) Record tabanlı alternatif ──────

type ErrorMessages = {
  [K in ParseError["kind"]]: (e: Extract<ParseError, { kind: K }>) => string;
};

// Tablo nesnesi:
const errorTable: ErrorMessages = {
  empty: () => "Yaş boş bırakılamaz.",
  not_a_number: (e) => `"${e.input}" bir sayı değil.`,
  negative: (e) => `Yaş negatif olamaz (${e.value}).`,
  too_large: (e) => `Yaş en fazla ${e.max} olabilir (${e.value}).`,
  not_integer: (e) => `Yaş tam sayı olmalıdır (${e.value}).`,
};

function describeWithTable(e: ParseError): string {
  return errorTable[e.kind](e as never); 
  // 'as never' pratik bir çağrı bypass'ıdır; nesne tanımında tip güvenliği zaten eksiksiz sağlanmıştır.
}

// @ts-expect-error Property 'not_integer' is missing in type '{ ... }' but required in type 'ErrorMessages'.
const incompleteTable: ErrorMessages = {
  empty: () => "Boş",
  not_a_number: (e) => "Sayı değil",
  negative: (e) => "Negatif",
  too_large: (e) => "Çok büyük",
};
// Burada assertNever yazmaya gerek kalmaz; eşlemeli tip ([K in ParseError["kind"]]) bütün anahtarların nesnede bulunmasını zorunlu (exhaustive) kılar.

// Karşılaştırma: switch + assertNever mı, Tablo (Lookup Table) mı?

// Switch + assertNever (Kontrol Akışı / Control Flow):

// Doğası: Prosedürel kod çalıştırır. Her dalda farklı ara işlemler, ekstra loglamalar veya karmaşık if-else dallanmaları gerekiyorsa idealdir.

// Kullanım Yeri: Her hatanın tamamen farklı bir mantık veya yan etki (side-effect) tetiklediği durumlar.

// Tablo Yaklaşımı (Veri Odaklı / Data-Driven):

// Doğası: Saf veri eşlemesidir (Dictionary). Kod mantığı ile mesaj şablonlarını birbirinden ayırır.

// Çoklu Dil (i18n) Kolaylığı: Tablo yaklaşımı açık ara kazanır. Örneğin İngilizce ve Türkçe desteği eklemek istediğinde switch bloklarını çoğaltmak yerine, sadece tipi referans alan yeni bir veri nesnesi tanımlamak yeterlidir:

// TypeScript
// const errorTableEn: ErrorMessages = { /* İngilizce mesajlar */ };
// const errorTableTr: ErrorMessages = { /* Türkçe mesajlar */ };
// Kullanım Yeri: Biçimlendirme, çeviri veya her varyantın doğrudan tek bir değere (string, ikon, HTTP status kodu) dönüştüğü durumlar.