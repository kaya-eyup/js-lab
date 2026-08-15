//              Deney 1 — sort()

// tahminim: [10,9,1].sort() sonucu ne olur ve neden?
// console.log([10, 9, 1].sort());
//  sort metodu string şeklinde çevirdiği için ilk harflere/rakamlara bakıyor, dolayısıyla 10, 9dan önce geliyor. tehlikeli sonuçlara sebebiyet verebilir gerçek uygulamalarda.


//             Deney 2 — reduce boş dizi, initialValue yok

//   tahminim: [].reduce((toplam, sayi) => toplam + sayi) çalıştığında ne olur?
 // console.log([].reduce((toplam, sayi) => toplam + sayi, 0));

// boş dizi için uyarı verecek diye tahmin etmiştim ama initialValue olmadığı için başlayacak nokta bulamayacağını ve hata döndüreceğini sonra gördüm. boş dizide initialValue 0 verince konsolda 0dan başlatıp ilerleyecek bişey olmadığı için 0da kalıyor, hata vermiyor. demek ki başlangıç noktası gerçekten önemli imiş.

//          Deney 3 - referans atamanın bellekteki etkileri 

// tahminim: b, a ile aynı referans mı olur?

 //const a = [3, 1, 2];
//const b = a.sort();
 

//console.log(a === b); //true döndürür, aynı referansı taşıyan değerler aynı bellek adresinde tutulur, dolayısıyla fiziksel olarak aynı noktayı gösterirler.
 
//b.push(99);   // aynı bellekte tutuldukları için birbirlerinin tamamen aynılarıdır(bellekte tek dizi, editörde iki farklı değişkende gözükür), birinde yapılan değişiklik diğerine de yansır tehlikeli bir açık. 

//console.log(a); // [1, 2, 3, 99]


// bu sebeple mutate etmeyen değerlerin kullanılması önemlidir. 

//const c = [3, 1, 2];
//const d = c.map(x => x);
//console.log(c === d); // false — map YENİ dizi döner, sort AYNI diziyi döner




// tahminim: [] == false  -->  ? , neden?
console.log([] == false);
// [] == false
// → (adım 2: false bir boolean, önce Number'a çevrilir)
// [] == 0
// → (adım 3: [] bir object, 0 bir number, [] ToPrimitive ile çevrilir → [].toString() → "")
// "" == 0
// → (adım 4: "" bir string, 0 bir number, string sayıya çevrilir → Number("") → 0)
// 0 == 0
// → true


// tahminim: '' == 0  -->  ? , neden?
 console.log('' == 0); // ilişkisel operatörler iki tarafı da numbera çevirir, "" boş string değeri motorda coerce edilirken 0 olarak kabul edilir.


// tahminim: null >= 0  -->  true , neden?
console.log(null >= 0);
 // 0>=0, true.
//                             ilişkisel operatörler iki tarafı da numbera çevirir (ikiside string değil ise). null değeri de 0 olarak kabul edilir.
// tahminim: null > 0  -->  false , neden?
console.log(null > 0);
// 0>0, false.




console.log(null == 0);

//neden null 0a dönüştüğü halde 0=0 false çıkıyor?

// Spesifikasyonlarda == operatörü için sabit ve değiştirilemez bir istisna kuralı vardır:
// null ve undefined değerleri, == ile karşılaştırıldıklarında sadece ve sadece birbirlerine veya kendilerine eşit kabul edilirler. Asla ToNumber() işlemine sokulmazlar.




///         neden asla iki == kullanmaman gerektiğini üstteki blok vesilesiyle kavramış oldun. her zaman === kullan.