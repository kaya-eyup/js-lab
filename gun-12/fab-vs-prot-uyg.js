// 1. üürünleri tutacağımız boş dizi
const urunVeritabani = [];

// DevTools "Memory" sekmesinde "Take Heap Snapshot" (Bellek Anlık Görüntüsü) aldım 3 deney için de.

// bölüm a: içine yazılan metod durumunda 15.4mb yer kapladı, yüzbinlerce fonksyion var.
// bölüm b: objectCreate ile bağlama durumunda 8.7mb yer kapladı, tahmin edilebileceği üzere yüzbinlerce fonksyion olmadığı için bellek kullanımı düştü.
// bölüm c: kurucu fonksyiona sonradan prototype ile bağlanan metodda 8.3mb, bölüm b'den ekstra bi düşüş olmadı.

// // --- Bölüm A: kopyalayan fabrika ---
// function urunYap(ad, fiyat, adet) {
//     this.ad = ad;
//     this.fiyat = fiyat;
//     this.adet = adet;


//     this.toplamFiyat = function () {
//         let toplam = this.fiyat * this.adet;
//         return toplam;
//     }
    
//     this.fiyatYazdir = function () {
//          console.log(`${this.ad} sipariş/lerinizin toplam tutarı: ${this.toplamFiyat}$`);
//     }

//  }

// const u1 = new urunYap("Defter", 85, 3);
// const u2 = new urunYap("Kalem", 25, 6);

// const baslangic = performance.now();

// for (let i = 0; i < 100000; i++) {
//     const yeniUrun = new urunYap(`testNo ${i}`, Math.floor(Math.random() * 500), 1)
    
//     urunVeritabani.push(yeniUrun);

// }

// const bitis = performance.now();


// let gecenSure = bitis - baslangic;
// console.log(gecenSure); // 7-15ms arası sürüyor. dünkü testimizden sonra bu civarda birşeyler vereceğini biliyordum

 
// console.log(urunVeritabani);


// //console.log(u1.toplamFiyat === u2.toplamFiyat);

// // senin burası için dediğin ölçüm notuna bakılırsa, fonksiyonların referansını karşılaştırıyor, ama kurucunun içinde olduğu için her nesne için farklı oluşturması lazım, dolayısıyla false dönmeli. eğer dışarıdan kurucuya ekleseydik true dönerdi çünkü fonksyion her çağrıda tekrar tekrar oluşmaz.

// // --- Bölüm B: kılavuz paylaşan fabrika ---
// const urunYordamlari = {
//   toplam() { return this.fiyat * this.adet; },
//   yaz()    { return `${this.ad} x ${this.adet} = ${this.toplam()} TL`; }
// };

// function urunYap2(ad, fiyat, adet) {
//   const u = Object.create(urunYordamlari);   // "kılavuzun bu" notunu iliştirir
//   u.ad = ad; u.fiyat = fiyat; u.adet = adet;
//   return u;
// }

// const u1 = urunYap2("Defter", 85, 3);
// const u2 = urunYap2("Kalem", 25, 6);

// console.log(u1.toplam === u2.toplam);   // kurucunun içindeki durum burda olmaz, true dönmeli.


// const baslangic = performance.now();
// for (let i = 0; i < 100000; i++) {
//     const yeniUrun = new urunYap2(`testNo ${i}`, Math.floor(Math.random() * 500), 1)
 
//     urunVeritabani.push(yeniUrun);
// }
// const bitis = performance.now();
// let gecenSure = bitis - baslangic;
// console.log(gecenSure); // öncekinden daha kısa sürecek ama orantılı olarak değil. bikaç ms düşer. 5-12 ms arası çıktı
// console.log(urunVeritabani);

// let p = u1;
// while (p) { console.log(p); p = Object.getPrototypeOf(p); } // arama her zaman nesnenin kendisinden başlıyor ve en yukarıya kadar çıkıyor, görmüş olduk.

// u1.toplam = () => 999;          // this bağlamını aldığı yerden toplamı alması gerekmiyor mu? eğer bu eklediğimiz ordaki sayı değerini sonradan ezebilevek birşey değilse hiçbirşeyi dğiştirmemeli. // aramaya nesnenin kendisinden başladığını unutmuşum, bu 999 toplam direkt ilk halkada başlatıyor, normaldeki urunYordamlari içine tırmanıp orda bulma durumu burda olmaz.
// urunYordamlari.indirim = function () { return this.toplam() * 0.9; }; // dışardan metod eklemişsin, hmmmm. zaten objectCreate dışardan metod bağlamak için yok muydu, neden buna da dışardan ekledik?

// console.log(u1.indirim()); // →  ?  (tahmin) fiyatı // çalışır ve indirimi yapar sıkıntısız şekilde. 




// // --- Bölüm C: kurucu fonksiyon ---
 function Urun(ad, fiyat, adet) {
     this.ad = ad;
     this.fiyat = fiyat;
     this.adet = adet;
  }

 Urun.prototype.toplam = function () { 
     return this.fiyat * this.adet;
   };
 const u = new Urun("Kalem", 10, 3);
 console.log(u.toplam());

// console.log(Object.getPrototypeOf(u) === Urun.prototype) //  →  ?  // true döner sanırım, ikisi de arkaplanda aynı yere bağlı.
// console.log(u.__proto__ === Urun.prototype);             //  →  ?  // eğitimde hoca __proto__ yukarıdakinin deprecated halidir demişti, o yüzden aynı şekilde true dönmeli.
// console.log(Urun.__proto__ === Urun.prototype)           //  →  ?  //     burda bi farklılık olmalı, urun globalde tanımlanmış bir fonksyion ancak urun.prototype ona sonradan bağlanmış  // sonucu doğru tahmin etmişim ama mantık yürütmemde bi eksiklik varmış.

// // Urun globalde tanımlı bir fonksiyondur ve atası Function.prototype'dır (__proto__).
// // // Urun.prototype ise fonksiyonun kendisi için değil, üreteceği nesneler (u gibi) için hazırladığı miras sepetidir.





// const baslangic = performance.now();
// for (let i = 0; i < 100000; i++) {
//     const yeniUrun = new Urun(`testNo ${i}`, Math.floor(Math.random() * 500), 1)
 
//     urunVeritabani.push(yeniUrun);
// }
// const bitis = performance.now();
// let gecenSure = bitis - baslangic;
// console.log(gecenSure); //          3-5 ms arasında düştü süre.
// console.log(urunVeritabani);



// // --- Bölüm D: new'ü kendin yaz ---



function kendiNew(Kurucu, ...argumanlar) {
    // 1. Boş bir nesne oluştur (RAM'de yeni bir hafıza bloğu açılır)
    const nesne = {};

    // 2. O nesnenin kılavuzunu Kurucu.prototype yap (Kalıtım kordonu bağlanır)
    Object.setPrototypeOf(nesne, Kurucu.prototype); 
    // Not: nesne.__proto__ = Kurucu.prototype da yazılabilir, aynı işi yapar.

    // 3. Kurucu'yu, 'this' bu nesneyi gösterecek şekilde çalıştır (Hocanın ipucu)
    // apply, Kurucu fonksiyonun içindeki this referansını zorla bizim 'nesne'ye kilitler.
    Kurucu.apply(nesne, argumanlar);

    // 4. İçerisi Kurucu tarafından verilerle doldurulmuş nesneyi döndür
    return nesne;
}
  

kendiNew(Urun, "Kalem", 10, 3).toplam()         // →  30
kendiNew(Urun, "Kalem", 10, 3) instanceof Urun  // →  true


