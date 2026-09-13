export { };
    

// ============================================================
// Bölüm 4 — result
// ============================================================
//
// Önce mantık

// Şu fonksiyonu düşün:

// function parseAge(input: string): number {
//   const n = Number(input);
//   if (Number.isNaN(n)) throw new Error("sayı değil");
//   return n;
// }s

// İmzaya bak: (input: string) => number. Bu imza patlayabileceğini söylemiyor. Çağıran kişi imzaya bakıp "tamam, sayı alacağım" der, try/catch yazmaz, uygulama çöker. Üstelik yakalasa bile catch (e) içindeki e'nin tipi unknown'dır — ne olduğunu bilemez.

// Yani: throw, tip sisteminin göremediği gizli bir ikinci çıkıştır.

// Kargo benzetmesi. throw ile çalışan bir kargo şirketi: paket kaybolursa sana haber gelmez, sadece kapıda beklersin. Result ile çalışan şirket: her seferinde bir kutu gelir. Kutunun içinde ya ürün vardır ya da "hasarlı, sebebi şu" fişi. Kutuyu açmadan hangisi olduğunu bilemezsin — ama kutu mutlaka gelir ve açmadan içindekini kullanamazsın.

// Fikir bu: başarısızlığı fırlatma, döndür. Dönüş tipinin bir parçası yap ki derleyici çağıranı kontrol etmeye zorlasın.


// 1) ve 4) Result<T, E> tipi — iki dallı etiketli birleşim
    
    // İki dal: başarı dalı bir T taşır, hata dalı bir E taşır. İkisini ayırt eden ortak bir etiket alanı olacak (Gün 20'deki FetchState'in status alanı gibi; burada ok: true / ok: false kullan).
    
 // Tahmin Doğrulaması: type Bad<E = string, T> yazarsan derleyici 
// "Required type parameters may not follow optional type parameters." hatası fırlatır.

type Result<T, E = string> = 
  | { ok: true; value: T }
  | { ok: false; error: E };
    
// 2) parseAge — hatayı fırlatmak yerine döndüren sürüm
    
   // Hiçbir gizli patlama (throw) yok, her ihtimal sözleşmenin (imzanın) bir parçası.
    
    // E'yi belirtmiyoruz, varsayılan olarak 'string' alıyor.
function parseAge(input: string): Result<number> {
  const n = Number(input);
  if (Number.isNaN(n)) {
    return { ok: false, error: "sayı değil" };
  }
  if (n < 0) {
    return { ok: false, error: "yaş negatif olamaz" };
  }
  return { ok: true, value: n };
}
    
// 3) tüketim: daraltmadan value'ya erişememe kanıtı
    
    
    const r = parseAge("30");

// @ts-expect-error Property 'value' does not exist on type 'Result<number, string>'. Property 'value' does not exist on type '{ ok: false; error: string; }'.
console.log(r.value); 

// Derleyici diyor ki: "Bu kutunun içinde error olma ihtimali var, 'ok' bayrağını kontrol etmeden 'value' okutmam."

if (r.ok) {
  // Burada r daraltıldı (Type Narrowing). r artık kesinlikle { ok: true, value: number }
  console.log(r.value.toFixed(0));  
} else {
  // Burada r artık kesinlikle { ok: false, error: string }
  console.log(r.error);
}
    
    

    
    
    
    
    
// 5) unwrap ve unwrapOr

// Bazen kutuyu güvenli açmak istemezsin, "bana değeri ver, yoksa patlasın umurumda değil" dersin. unwrap bunun içindir. Dönüş tipi T | E olamaz, sadece T olmak zorundadır. Neden? Çünkü hatayı (E) geriye döndürmüyoruz, throw ile fırlatarak uygulama akışını kesiyoruz. Fonksiyon başarıyla dönerse elinde tek bir ihtimal kalır: T.

function unwrap<T, E>(result: Result<T, E>): T {
  if (!result.ok) {
    throw new Error(String(result.error)); // Hatayı çalışma anında fırlat
  }
  return result.value;
}

// Fallback (B planı) mekanizması
function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  if (!result.ok) {
    return fallback;
  }
  return result.value;
}

console.log(unwrap(parseAge("30")));       // 30
// console.log(unwrap(parseAge("abc")));   // Çalışma anında throw Error: sayı değil

console.log(unwrapOr(parseAge("abc"), 0)); // 0
console.log(unwrapOr(parseAge("30"), 0));  // 30