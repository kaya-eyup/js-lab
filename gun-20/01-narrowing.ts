//Sade mesele: Ürün kimliği bazı yerlerde sayı, bazı yerlerde metin geliyor.


 type ID = string | number;

// function formatId(id: ID): string {
//   return id.toUpperCase();   // burası hata verecek
// }

//Hata veriyor çünkü id metin olabilir ama sayı da olabilir, ve sayının toUpperCase'i yok. TypeScript "ikisinde de olan şeyi yap" diyor.

//Çözüm, kodun içinde sorup ayırmak:

//  function formatId(id: ID): string {
//    if (typeof id === "string") {
//      return id.toUpperCase();      // burada TS artık "metin" biliyor
//    }
//    return id.toFixed(0);           // burada "sayı" biliyor
// }


// // Yaz, çalıştır (npx tsx gun-20/01-narrowing.ts), iki dalın da çalıştığını gör: formatId("ab12") → "AB12", formatId(7) → "7".


// console.log(formatId(25.56));
// console.log(formatId("Cristiano Ronaldo"));

// Buna daraltma (narrowing) deniyor: bir kontrolden geçtikten sonra TypeScript'in tipi kendiliğinden sıkılaştırması.

// Sonra tek ölçüm. Nesnelerde typeof yetersiz kalıyor — dün kendin fark etmiştin. Şunu dene:


type Success = { data: string[] };
type Failure = { error: string };

function show(r: Success | Failure) {
  if (typeof r === "object") {
      // burada r'nin hangisi olduğunu TS biliyor mu? r.data yazmayı dene
    //   r.data  // bilmiyor.
  }
}
//r.data yazınca ne diyor? Çünkü ikisi de nesne, typeof ikisini de "object" diyor, ayırmıyor. Bunun cevabı seni doğrudan ③'e sokuyor.